import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { db } from "../db.js";
const parse = (x: any) => (typeof x === "string" ? JSON.parse(x) : x);
let running = false;

export function calculateStatistics(input: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const child = spawn(
      process.env.STATISTICS_PYTHON ??
        (process.platform === "win32" ? "python" : "python3"),
      [fileURLToPath(new URL("../../statistics/engine.py", import.meta.url))],
      {
        env: {
          ...process.env,
          PYTHONIOENCODING: "utf-8",
          OPENBLAS_NUM_THREADS: "1",
          OMP_NUM_THREADS: "1",
          ...(process.platform !== "win32"
            ? {
                PYTHONPATH:
                  process.env.STATISTICS_SITE_PACKAGES ??
                  "/opt/mindresearch/statistics-python-v2",
              }
            : {}),
        },
        stdio: ["pipe", "pipe", "pipe"],
        windowsHide: true,
      },
    );
    let output = "",
      errors = "",
      finished = false;
    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      done(new Error("Расчёт превысил лимит 30 секунд. Уменьшите выборку."));
    }, 30000);
    function done(error?: Error, value?: any) {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      error ? reject(error) : resolve(value);
    }
    child.on("error", () =>
      done(
        new Error("Вычислительный движок недоступен. Сообщите администратору."),
      ),
    );
    child.stdout.on("data", (data) => {
      output += data;
      if (output.length > 4_000_000) {
        child.kill("SIGKILL");
        done(new Error("Слишком большой отчёт. Уменьшите выборку."));
      }
    });
    child.stderr.on("data", (data) => {
      if (errors.length < 4000) errors += data;
    });
    child.on("close", (code) => {
      if (finished) return;
      try {
        if (code !== 0) {
          console.error("Statistics worker:", errors);
          return done(
            new Error(
              "Ошибка вычислительного движка. Сообщите администратору.",
            ),
          );
        }
        const result = JSON.parse(output);
        if (result.error) return done(new Error(result.error));
        if (!result.result?.engine)
          return done(new Error("Некорректный ответ вычислительного движка."));
        done(undefined, result.result);
      } catch {
        done(new Error("Не удалось прочитать результат расчёта."));
      }
    });
    child.stdin.on("error", () => {});
    child.stdin.end(JSON.stringify(input));
  });
}

export async function runStatisticsJobs() {
  if (running) return;
  running = true;
  try {
    while (true) {
      const [jobs] = await db.query<any[]>(
        "SELECT id,input FROM statistical_analyses WHERE status='queued' ORDER BY created_at LIMIT 1",
      );
      if (!jobs.length) break;
      const job = jobs[0];
      const [claim] = await db.execute<any>(
        "UPDATE statistical_analyses SET status='running' WHERE id=? AND status='queued'",
        [job.id],
      );
      if (!claim.affectedRows) continue;
      try {
        const input = parse(job.input);
        const result = await calculateStatistics({
          ...input.config,
          groups: input.groups.map((g: any) => ({
            label: g.label,
            values: g.included.map((row: any) => row.value),
          })),
        });
        await db.execute(
          "UPDATE statistical_analyses SET status='completed',result=?,finished_at=NOW() WHERE id=?",
          [JSON.stringify(result), job.id],
        );
      } catch (error) {
        await db.execute(
          "UPDATE statistical_analyses SET status='failed',error=?,finished_at=NOW() WHERE id=?",
          [error instanceof Error ? error.message : "Ошибка расчёта", job.id],
        );
      }
    }
  } catch (error) {
    console.error("Statistics queue:", error);
  } finally {
    running = false;
  }
}

export async function resumeStatisticsJobs() {
  await db.execute(
    "UPDATE statistical_analyses SET status='failed',error='Сервер перезапущен во время расчёта. Создайте повторный расчёт.',finished_at=NOW() WHERE status='running'",
  );
  void runStatisticsJobs();
  setInterval(() => {
    void runStatisticsJobs();
  }, 5000).unref();
}
