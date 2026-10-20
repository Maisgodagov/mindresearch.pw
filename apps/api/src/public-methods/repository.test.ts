import { beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({
  query: vi.fn(),
  execute: vi.fn(),
  getConnection: vi.fn(),
  connection: {
    query: vi.fn(),
    execute: vi.fn(),
    beginTransaction: vi.fn(),
    commit: vi.fn(),
    rollback: vi.fn(),
    release: vi.fn(),
  },
}));
vi.mock("../db.js", () => ({
  db: {
    query: mocks.query,
    execute: mocks.execute,
    getConnection: mocks.getConnection,
  },
}));
import { mysqlRepository, type Assessment } from "./repository.js";
import { definition, initialCatalog } from "./model.js";
describe("MySQL assessment persistence contracts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getConnection.mockResolvedValue(mocks.connection);
    mocks.connection.execute.mockResolvedValue([{ affectedRows: 1 }]);
    mocks.execute.mockResolvedValue([{ affectedRows: 1 }]);
  });
  const assessment = (): Assessment => ({
    id: "00000000-0000-4000-8000-000000000000",
    definition: definition(initialCatalog[0]),
    answers: {},
    result: null,
    position: 0,
    revision: 0,
    expiresAt: "2026-11-01T12:00:00.000Z",
  });
  it("writes explicit UTC dates and persists under a credential-and-expiry row lock", async () => {
    const a = assessment(),
      repo = mysqlRepository();
    await repo.create(a, "token-hash");
    expect(mocks.execute.mock.calls[0][1].at(-1)).toBe("2026-11-01 12:00:00");
    mocks.connection.query.mockResolvedValue([
      [
        {
          ...a,
          definition: JSON.stringify(a.definition),
          answers: "{}",
          expiresAt: a.expiresAt,
        },
      ],
    ]);
    await repo.assessment(a.id, "token-hash", (a) => {
      a.answers.test_17_1 = 0;
      a.revision++;
    });
    expect(mocks.connection.query.mock.calls[0][0]).toContain(
      "token_hash=? AND expires_at > UTC_TIMESTAMP() FOR UPDATE",
    );
    expect(mocks.connection.query.mock.calls[0][1]).toEqual([
      a.id,
      "token-hash",
    ]);
    expect(mocks.connection.execute.mock.calls[0][1][0]).toBe(
      '{"test_17_1":0}',
    );
    expect(mocks.connection.execute.mock.calls[0][1][4]).toBe(
      "2026-11-01 12:00:00",
    );
    expect(mocks.connection.commit).toHaveBeenCalledOnce();
    expect(mocks.connection.release).toHaveBeenCalledOnce();
  });
  it("rolls back unavailable credentials and validation failures without writing", async () => {
    const repo = mysqlRepository();
    mocks.connection.query.mockResolvedValue([[]]);
    await expect(
      repo.assessment("id", "wrong", () => {}),
    ).rejects.toMatchObject({ status: 404 });
    expect(mocks.connection.execute).not.toHaveBeenCalled();
    expect(mocks.connection.rollback).toHaveBeenCalledOnce();
    const a = assessment();
    mocks.connection.query.mockResolvedValue([
      [{ ...a, definition: a.definition, answers: {} }],
    ]);
    await expect(
      repo.assessment(a.id, "hash", () => {
        throw new Error("validation");
      }),
    ).rejects.toThrow("validation");
    expect(mocks.connection.execute).not.toHaveBeenCalled();
    expect(mocks.connection.commit).not.toHaveBeenCalled();
    expect(mocks.connection.release).toHaveBeenCalledTimes(2);
  });
  it("rejects stale publication revisions", async () => {
    mocks.execute.mockResolvedValue([{ affectedRows: 0 }]);
    await expect(
      mysqlRepository().savePublication(
        initialCatalog[0].slug,
        initialCatalog[0],
        "publish",
        2,
      ),
    ).rejects.toMatchObject({ status: 409 });
  });
});
