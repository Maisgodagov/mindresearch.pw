import { readFile, readdir } from "node:fs/promises";
import { loadMethodologyRegistry } from "../data/methodologyRegistry.js";
import { withdrawnMethodologyCodes } from "../data/withdrawnMethodologies.js";
import baseSurvey from "../data/survey.json" with {type:"json"};
import express from "express";
import { z } from "zod";
import { createPublicMethodsRouter } from "./router.js";
import { memoryRepository } from "./testing.js";
const app = express();
app.use(express.json({ limit: "200kb" }));
// Count registered instruments for the database-free preview; production counts active DB rows.
app.get("/api/public/catalogue-summary",async(_req,res,next)=>{try{
 const codes=new Set(baseSurvey.map(s=>s.code).filter(c=>c.startsWith("test_")));
 for(const entry of await loadMethodologyRegistry())codes.add(entry.instrument.code);
 const directory=new URL("../data/",import.meta.url);
 for(const file of await readdir(directory)){if(!file.endsWith(".ts")||file.endsWith(".test.ts"))continue;const source=await readFile(new URL(file,directory),"utf8");for(const match of source.matchAll(/code:\s*['"](test_\d+)['"]/g))codes.add(match[1]);}
 for(const code of [...withdrawnMethodologyCodes,"test_8","test_10","test_11","test_15","test_16","test_18"])codes.delete(code);
 res.json({total:codes.size});
}catch(error){next(error);}});
// The isolated preview has no researcher accounts; use the normal guest status.
app.post("/api/auth/refresh", (_req, res) => res.status(401).json({ message: "Войдите в аккаунт" }));
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
