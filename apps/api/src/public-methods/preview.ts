import express from "express";
import { z } from "zod";
import { createPublicMethodsRouter } from "./router.js";
import { memoryRepository } from "./testing.js";
const app = express();
app.use(express.json({ limit: "200kb" }));
app.use(
  createPublicMethodsRouter(memoryRepository(), [
    (_req, res) => {
      res
        .status(403)
        .json({ message: "Администрирование закрыто в демонстрационном API" });
    },
  ]),
);
app.use(
  (
    error: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    res
      .status(error instanceof z.ZodError ? 400 : (error.status ?? 500))
      .json({
        message:
          error instanceof z.ZodError
            ? "Проверьте введённые данные"
            : error.message,
      });
  },
);
app.listen(4011, "127.0.0.1", () =>
  console.log(
    "Public methods preview: http://127.0.0.1:4011 — volatile synthetic storage, no production database",
  ),
);
