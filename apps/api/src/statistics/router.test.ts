import express from "express";
import type { Server } from "node:http";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({
  query: vi.fn(),
  execute: vi.fn(),
  connection: {
    query: vi.fn(),
    execute: vi.fn(),
    beginTransaction: vi.fn(),
    commit: vi.fn(),
    rollback: vi.fn(),
    release: vi.fn(),
  },
  results: vi.fn(),
  jobs: vi.fn(),
}));
vi.mock("../db.js", () => ({
  db: {
    query: mocks.query,
    execute: mocks.execute,
    getConnection: async () => mocks.connection,
  },
}));
vi.mock("../survey-results.js", () => ({ loadSurveyResults: mocks.results }));
vi.mock("./service.js", () => ({ runStatisticsJobs: mocks.jobs }));
import { statisticsRouter } from "./router.js";
import { signToken } from "../auth.js";
import { z } from "zod";
const ids = {
  survey: "00000000-0000-4000-8000-000000000001",
  sample: "00000000-0000-4000-8000-000000000002",
  a: "00000000-0000-4000-8000-000000000003",
  b: "00000000-0000-4000-8000-000000000004",
  analysis: "00000000-0000-4000-8000-000000000005",
};
let server: Server,
  url: string,
  role: string,
  permission: string,
  sampleRow: any;
beforeEach(async () => {
  vi.resetAllMocks();
  process.env.JWT_SECRET = "statistics-test-only-secret-at-least-24";
  role = "owner";
  permission = "owner";
  sampleRow = {
    id: ids.sample,
    name: "Group",
    revision: 1,
    definition: { completedOnly: true, conditions: [] },
    members: [ids.a, ids.b],
  };
  mocks.query.mockImplementation(async (sql: string, args: any[]) => {
    if (sql === "SELECT id,role FROM users WHERE id=?")
      return [[{ id: "actor", role }]];
    if (sql.includes("SELECT s.owner_id ownerId"))
      return [[{ ownerId: "actor", permission, version: 1 }]].map((rows) =>
        rows.map((r) => ({
          ...r,
          ownerId: permission === "owner" ? "actor" : "other",
        })),
      );
    if (sql.includes("SELECT id FROM surveys WHERE"))
      return [[{ id: ids.survey }]];
    if (sql.includes("COUNT(*)")) return [[{ n: 2 }]];
    if (sql.includes("FROM analysis_samples s")) return [[sampleRow]];
    return [[]];
  });
  mocks.execute.mockResolvedValue([{ affectedRows: 1 }]);
  mocks.connection.execute.mockResolvedValue([{ affectedRows: 1 }]);
  mocks.connection.query.mockImplementation(async (sql: string) =>
    sql.includes("SELECT * FROM analysis_samples")
      ? [[sampleRow]]
      : [[{ definition: sampleRow.definition }]],
  );
  mocks.results.mockResolvedValue({
    questions: [],
    respondents: [
      {
        id: ids.a,
        alias: "A",
        age: 20,
        gender: null,
        status: "completed",
        groups: [],
      },
      {
        id: ids.b,
        alias: "B",
        age: 30,
        gender: null,
        status: "completed",
        groups: [],
      },
    ],
  });
  const app = express();
  app.use(express.json());
  app.use(statisticsRouter);
  app.use((error: any, _req: any, res: any, _next: any) =>
    res
      .status(error instanceof z.ZodError ? 400 : (error.status ?? 500))
      .json({ message: error.message }),
  );
  server = await new Promise<Server>((resolve) => {
    const s = app.listen(0, "127.0.0.1", () => resolve(s));
  });
  url = `http://127.0.0.1:${(server.address() as any).port}/admin/surveys/${ids.survey}/statistics`;
});
afterEach(() => new Promise<void>((resolve) => server.close(() => resolve())));
const request = (path = "", method = "GET", body?: unknown, auth = true) =>
  fetch(url + path, {
    method,
    headers: {
      ...(auth
        ? {
            Authorization: `Bearer ${signToken({ id: "actor", role: "admin" })}`,
          }
        : {}),
      "Content-Type": "application/json",
    },
    body: body && method !== "GET" ? JSON.stringify(body) : undefined,
  });

it("denies anonymous and researcher roles at every statistics endpoint, using current database role rather than JWT role", async () => {
  expect((await request("", "GET", undefined, false)).status).toBe(401);
  role = "researcher";
  for (const [path, method] of [
    ["", "GET"],
    ["/samples", "POST"],
    [`/samples/${ids.sample}`, "PUT"],
    ["/preview", "POST"],
    ["/analyses", "POST"],
    ["/analyses", "GET"],
    [`/analyses/${ids.analysis}`, "GET"],
  ])
    expect((await request(path, method, {})).status).toBe(403);
  expect(mocks.results).not.toHaveBeenCalled();
});
it("permits owner/admin reads and denies inspection-only mutations", async () => {
  expect((await request()).status).toBe(200);
  role = "admin";
  permission = "view";
  expect((await request()).status).toBe(200);
  expect((await request("/samples", "POST", {})).status).toBe(403);
});
it("saves the full server-selected group, ignoring any forged filtered member IDs", async () => {
  const response = await request("/samples", "POST", {
    name: "Age",
    conditions: [
      { question: "__age", labels: [], range: { min: "25", max: "40" } },
    ],
    completedOnly: true,
    source: "filtered",
    memberIds: [ids.a],
  });
  expect(response.status).toBe(201);
  const call = mocks.connection.execute.mock.calls.find(([sql]) =>
    sql.includes("analysis_sample_versions"),
  )!;
  expect(JSON.parse(call[1][2])).toEqual([ids.b]);
  expect(mocks.connection.commit).toHaveBeenCalledOnce();
});
it("rejects lost updates and rolls back rather than overwriting a sample version", async () => {
  const response = await request(`/samples/${ids.sample}`, "PUT", {
    name: "Changed",
    revision: 2,
    memberIds: [ids.a],
  });
  expect(response.status).toBe(409);
  expect(mocks.connection.rollback).toHaveBeenCalledOnce();
  expect(mocks.connection.commit).not.toHaveBeenCalled();
});
it("previews exact inputs, validates the preview hash and persists a snapshot for a queued calculation", async () => {
  const config = {
    method: "descriptive",
    alpha: 0.05,
    groups: [{ sampleId: ids.sample, revision: 1, variableId: "age" }],
  };
  const preview = (await (
    await request("/preview", "POST", config)
  ).json()) as any;
  expect(preview.input.groups[0].included.map((p: any) => p.value)).toEqual([
    20, 30,
  ]);
  expect(
    (
      await request("/analyses", "POST", {
        ...config,
        requestId: ids.analysis,
        previewHash: "stale",
      })
    ).status,
  ).toBe(409);
  const response = await request("/analyses", "POST", {
    ...config,
    requestId: ids.analysis,
    previewHash: preview.hash,
  });
  expect(response.status).toBe(202);
  expect(mocks.jobs).toHaveBeenCalledOnce();
  expect(
    mocks.execute.mock.calls.some(
      ([sql, args]) =>
        sql.includes("statistical_analyses") &&
        JSON.parse(args[4]).groups[0].included.length === 2,
    ),
  ).toBe(true);
});
it("requires provenance for manual values and disallows replacing saved scores", async () => {
  const config = {
    method: "descriptive",
    alpha: 0.05,
    groups: [{ sampleId: ids.sample, revision: 1, variableId: "age" }],
    manual: { [`0:${ids.a}`]: 99 },
  };
  expect((await request("/preview", "POST", config)).status).toBe(400);
  expect(
    (await request("/preview", "POST", { ...config, manualReason: "source" }))
      .status,
  ).toBe(400);
});
