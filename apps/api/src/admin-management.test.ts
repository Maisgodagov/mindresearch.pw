import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import express from "express";
import type { Server } from "node:http";
import { signToken } from "./auth.js";
const mocks = vi.hoisted(() => ({
  query: vi.fn(),
  execute: vi.fn(),
  connection: {
    query: vi.fn(),
    execute: vi.fn(),
    beginTransaction: vi.fn(),
    rollback: vi.fn(),
    commit: vi.fn(),
    release: vi.fn(),
  },
}));
vi.mock("./db.js", () => ({
  db: {
    query: mocks.query,
    execute: mocks.execute,
    getConnection: vi.fn(async () => mocks.connection),
  },
}));
import { adminManagementRouter } from "./admin-management.js";
import { canReadSurvey } from "./admin-access.js";
import { analyticsRouter, eventSchema } from "./analytics.js";
let server: Server, base: string;
beforeEach(async () => {
  vi.resetAllMocks();
  process.env.JWT_SECRET = "test-only-secret-which-is-long-enough";
  mocks.query.mockImplementation(async (sql: string, args: any[]) => {
    if (sql === "SELECT id,role FROM users WHERE id=?")
      return [
        [
          {
            id: args[0],
            role:
              args[0] === "actor"
                ? "admin"
                : args[0] === "owner"
                  ? "owner"
                  : "researcher",
          },
        ],
      ];
    return [[]];
  });
  mocks.execute.mockResolvedValue([{}]);
  mocks.connection.execute.mockResolvedValue([{}]);
  mocks.connection.query.mockImplementation(async (sql: string) =>
    sql.includes("FROM users")
      ? [[{ id: "target", email: "target@example.test", role: "researcher" }]]
      : sql.includes("COUNT(*)")
        ? [[{ count: 3 }]]
        : sql.includes("FROM surveys")
          ? [[{ id: "survey" }]]
          : [[]],
  );
  const app = express();
  app.use(express.json());
  app.use(adminManagementRouter);
  app.use(analyticsRouter);
  app.use((e: any, _r: any, res: any, _n: any) =>
    res.status(e.name === "ZodError" ? 400 : 500).json({ message: "error" }),
  );
  server = await new Promise<Server>((resolve) => {
    const s = app.listen(0, "127.0.0.1", () => resolve(s));
  });
  base = `http://127.0.0.1:${(server.address() as any).port}`;
});
afterEach(async () => {
  await new Promise<void>((r) => server.close(() => r()));
});
const request = (path: string, id = "actor", options: any = {}) =>
  fetch(base + path, {
    ...options,
    headers: {
      authorization: `Bearer ${signToken({ id, role: "owner" })}`,
      "content-type": "application/json",
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
describe("administrator inspection and deletion", () => {
  it("uses the current database role rather than a stale privileged JWT", async () => {
    const r = await request("/admin/users/target", "researcher");
    expect(r.status).toBe(403);
    expect(mocks.connection.execute).not.toHaveBeenCalled();
  });
  it("rejects deleted accounts even with an unexpired signed token", async () => {
    mocks.query.mockResolvedValue([[]]);
    expect((await request("/admin/users/target")).status).toBe(401);
  });
  it.each([
    { target: "owner", role: "owner", actor: "owner" },
    { target: "actor", role: "admin", actor: "actor" },
    { target: "target", role: "admin", actor: "actor" },
  ])(
    "protects owner, self and peer admin: $target/$role",
    async ({ target, role, actor }) => {
      mocks.connection.query.mockResolvedValue([
        [{ id: target, email: "target@example.test", role }],
      ]);
      const r = await request(`/admin/users/${target}`, actor, {
        method: "DELETE",
        body: { confirmEmail: "target@example.test" },
      });
      expect(r.status).toBe(403);
      expect(mocks.connection.execute).not.toHaveBeenCalled();
      expect(mocks.connection.rollback).toHaveBeenCalled();
    },
  );
  it("requires exact target email confirmation", async () => {
    const r = await request("/admin/users/target", "actor", {
      method: "DELETE",
      body: { confirmEmail: "wrong@example.test" },
    });
    expect(r.status).toBe(400);
    expect(mocks.connection.execute).not.toHaveBeenCalled();
  });
  it("atomically deletes dependent survey data and writes an audit entry", async () => {
    const r = await request("/admin/users/target", "actor", {
      method: "DELETE",
      body: { confirmEmail: "target@example.test" },
    });
    expect(r.status).toBe(200);
    const statements = mocks.connection.execute.mock.calls.map((c) => c[0]);
    expect(statements.findIndex((s) => s.startsWith("DELETE rs"))).toBeLessThan(
      statements.findIndex((s) => s.startsWith("DELETE FROM surveys")),
    );
    expect(
      statements.findIndex((s) => s.startsWith("DELETE FROM surveys")),
    ).toBeLessThan(
      statements.findIndex((s) => s.startsWith("DELETE FROM users")),
    );
    expect(statements.at(-1)).toContain("admin_audit_log");
    expect(mocks.connection.commit).toHaveBeenCalledOnce();
    expect(mocks.connection.release).toHaveBeenCalledOnce();
  });
  it("rolls back on dependent data failures", async () => {
    mocks.connection.execute.mockRejectedValueOnce(new Error("constraint"));
    const r = await request("/admin/users/target", "actor", {
      method: "DELETE",
      body: { confirmEmail: "target@example.test" },
    });
    expect(r.status).toBe(500);
    expect(mocks.connection.rollback).toHaveBeenCalledOnce();
    expect(mocks.connection.commit).not.toHaveBeenCalled();
  });
  it("does not delete a survey during background recomputation", async () => {
    mocks.connection.query.mockImplementation(async (sql: string) =>
      sql.includes("FROM users")
        ? [[{ id: "target", email: "target@example.test", role: "researcher" }]]
        : sql.includes("quality_jobs")
          ? [[{ id: "job" }]]
          : [[]],
    );
    expect(
      (
        await request("/admin/users/target", "actor", {
          method: "DELETE",
          body: { confirmEmail: "target@example.test" },
        })
      ).status,
    ).toBe(409);
    expect(mocks.connection.execute).not.toHaveBeenCalled();
  });
  it("allows administrator survey reads through the SQL ownership predicate", async () => {
    mocks.query.mockResolvedValue([[{ id: "s" }]]);
    expect(
      await canReadSurvey({ user: { id: "actor", role: "admin" } } as any, "s"),
    ).toBe(true);
    expect(mocks.query.mock.calls.at(-1)?.[1]).toEqual(["s", "actor", true]);
    await canReadSurvey(
      { user: { id: "researcher", role: "researcher" } } as any,
      "s",
    );
    expect(mocks.query.mock.calls.at(-1)?.[1]).toEqual([
      "s",
      "researcher",
      false,
    ]);
  });
});
describe("product analytics", () => {
  it("rejects unauthenticated uploads and non-admin analytics reads", async () => {
    expect(
      (
        await fetch(base + "/account/analytics/events", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: "{}",
        })
      ).status,
    ).toBe(401);
    expect((await request("/admin/analytics", "researcher")).status).toBe(403);
  });
  it("strips unknown fields and refuses query strings or free-text event values", () => {
    const e = {
      id: crypto.randomUUID(),
      sessionId: crypto.randomUUID(),
      type: "click",
      page: "/app/surveys/:id/edit",
      name: "survey.save",
      at: Date.now(),
      email: "private@example.test",
    };
    expect(eventSchema.parse(e)).not.toHaveProperty("email");
    expect(
      eventSchema.safeParse({ ...e, page: "/app?token=secret" }).success,
    ).toBe(false);
    expect(
      eventSchema.safeParse({ ...e, name: "Моя личная информация" }).success,
    ).toBe(false);
  });
  it("takes user identity from authentication and deduplicates event UUIDs", async () => {
    const e = {
      id: crypto.randomUUID(),
      sessionId: crypto.randomUUID(),
      type: "click",
      page: "/app",
      name: "survey.create",
      at: Date.now(),
      userId: "someone-else",
    };
    mocks.query.mockImplementation(async (sql: string, args: any[]) =>
      sql.includes("SELECT id,role")
        ? [[{ id: args[0], role: "researcher" }]]
        : sql.includes("COUNT(*)")
          ? [[{ n: 0 }]]
          : [{}],
    );
    expect(
      (
        await request("/account/analytics/events", "researcher", {
          method: "POST",
          body: { events: [e] },
        })
      ).status,
    ).toBe(200);
    const insert = mocks.query.mock.calls.find((c) =>
      c[0].startsWith("INSERT IGNORE"),
    );
    expect(insert?.[1][0][0][1]).toBe("researcher");
  });
});
