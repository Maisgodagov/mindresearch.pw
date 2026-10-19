import { Router, type Response, type NextFunction } from "express";
import { z } from "zod";
import { randomUUID, createHash } from "node:crypto";
import { db } from "../db.js";
import { requireAuth, type AuthRequest } from "../auth.js";
import { canReadSurvey, isAdministrator } from "../admin-access.js";
import { surveyAccess } from "../sharing.js";
import { loadSurveyResults } from "../survey-results.js";
import {
  analyticalData,
  matches,
  prepareInput,
  methods,
  fail,
  type Condition,
  type Person,
} from "./domain.js";
import { runStatisticsJobs } from "./service.js";

export const statisticsRouter = Router();
const base = "/admin/surveys/:id/statistics";
const parse = (x: any) => (typeof x === "string" ? JSON.parse(x) : x);
const handle =
  (fn: (req: AuthRequest, res: Response) => Promise<unknown>) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    void fn(req, res).catch(next);
  };
statisticsRouter.use(base, requireAuth, (req: AuthRequest, res, next) => {
  if (!isAdministrator(req))
    return res.status(403).json({
      message: "Статистический анализ пока доступен только admin и owner.",
    });
  next();
});
async function authorize(req: AuthRequest, write = false) {
  const id = String(req.params.id);
  if (!(await canReadSurvey(req, id))) fail("Опрос не найден.", 404);
  const access = await surveyAccess(req.user!.id, id);
  const canWrite = ["owner", "edit"].includes(access?.permission);
  if (write && !canWrite)
    fail(
      "Просмотр чужого опроса не даёт права изменять выборки и создавать расчёты.",
      403,
    );
  return { id, canWrite };
}
async function data(surveyId: string) {
  const [counts] = await db.query<any[]>(
    "SELECT COUNT(*) n FROM response_sessions WHERE survey_id=? AND deleted_at IS NULL",
    [surveyId],
  );
  if (Number(counts[0].n) > 5000)
    fail(
      "В пилоте статистика доступна для опросов до 5000 участников. Экспорт результатов доступен без этого ограничения.",
    );
  const results = await loadSurveyResults(surveyId, { statistics: true });
  const people = results.respondents as Person[];
  return {
    people,
    questions: results.questions ?? [],
    ...analyticalData(people),
  };
}
async function samples(surveyId: string, connection: any = db): Promise<any[]> {
  const [rows] = await connection.query(
    `SELECT s.*,v.definition,v.members FROM analysis_samples s JOIN analysis_sample_versions v ON v.sample_id=s.id AND v.revision=s.revision WHERE s.survey_id=? ORDER BY s.created_at`,
    [surveyId],
  );
  return rows.map((row: any) => ({
    id: row.id,
    name: row.name,
    revision: row.revision,
    definition: parse(row.definition),
    members: parse(row.members),
    createdAt: row.created_at,
  }));
}
const conditionSchema = z.object({
  question: z.string().min(1).max(200),
  title: z.string().max(500).optional(),
  labels: z.array(z.string().max(1000)).max(100),
  range: z
    .object({ min: z.string().max(30), max: z.string().max(30) })
    .optional(),
});
const sampleSchema = z.object({
  name: z.string().trim().max(160),
  conditions: z.array(conditionSchema).max(30),
  completedOnly: z.boolean(),
  source: z.enum(["filtered", "selected"]).default("filtered"),
  memberIds: z.array(z.string().uuid()).max(5000).optional(),
});
function definition(raw: z.infer<typeof sampleSchema>, questions: any[]) {
  const conditions: Condition[] = raw.conditions.map((c) => {
    const question = questions.find((q) => q.questionId === c.question);
    if (c.question !== "__age" && !question)
      fail("Вопрос условия больше не существует. Настройте выборку заново.");
    if (c.range) {
      if (c.question !== "__age" && question.type !== "number")
        fail("Диапазон допустим только для числового вопроса.");
      const min = c.range.min.trim() ? Number(c.range.min) : undefined;
      const max = c.range.max.trim() ? Number(c.range.max) : undefined;
      if (
        (min === undefined && max === undefined) ||
        (min !== undefined && !Number.isFinite(min)) ||
        (max !== undefined && !Number.isFinite(max)) ||
        (min !== undefined && max !== undefined && min > max)
      )
        fail("Некорректные границы выборки.");
      return {
        question: c.question,
        title: question?.text ?? "Возраст",
        min,
        max,
      };
    }
    if (!c.labels.length || !question)
      fail("Укажите ответы для условия выборки.");
    const options = question.options ?? [];
    return {
      question: c.question,
      title: question.text,
      values: c.labels.map(
        (label) => options.find((o: any) => o.label === label)?.value ?? label,
      ),
    };
  });
  return { conditions, completedOnly: raw.completedOnly };
}

statisticsRouter.get(
  base,
  handle(async (req, res) => {
    const { id, canWrite } = await authorize(req);
    const [dataset, groups, [analyses]] = await Promise.all([
      data(id),
      samples(id),
      db.query<any[]>(
        "SELECT id,name,status,error,created_at createdAt,finished_at finishedAt FROM statistical_analyses WHERE survey_id=? ORDER BY created_at DESC LIMIT 100",
        [id],
      ),
    ]);
    res.json({
      canWrite,
      methods,
      variables: dataset.variables,
      participants: dataset.people.map((p) => ({
        id: p.id,
        alias: p.alias,
        age: p.age,
        gender: p.gender,
        status: p.status,
        values: dataset.rows[p.id],
      })),
      samples: groups.map((s) => ({
        ...s,
        candidates: dataset.people
          .filter(
            (p) =>
              !s.members.includes(p.id) &&
              matches(p, s.definition.conditions, s.definition.completedOnly),
          )
          .map((p) => p.id),
        unavailable: s.members.filter((id: string) => !dataset.rows[id]),
      })),
      analyses,
    });
  }),
);

statisticsRouter.post(
  `${base}/samples`,
  handle(async (req, res) => {
    const { id } = await authorize(req, true);
    const raw = sampleSchema.parse(req.body),
      dataset = await data(id),
      def = definition(raw, dataset.questions);
    const members =
      raw.source === "filtered"
        ? dataset.people
            .filter((p) => matches(p, def.conditions, def.completedOnly))
            .map((p) => p.id)
        : [...new Set(raw.memberIds ?? [])];
    if (!members.length) fail("Пустую выборку сохранить нельзя.");
    if (members.some((member) => !dataset.rows[member]))
      fail("Выборка содержит недоступного участника. Обновите результаты.");
    const sampleId = randomUUID();
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      await connection.execute(
        "INSERT INTO analysis_samples(id,survey_id,name,created_by) VALUES (?,?,?,?)",
        [
          sampleId,
          id,
          raw.name || `Выборка ${new Date().toLocaleDateString("ru-RU")}`,
          req.user!.id,
        ],
      );
      await connection.execute(
        "INSERT INTO analysis_sample_versions(sample_id,revision,definition,members) VALUES (?,1,?,?)",
        [sampleId, JSON.stringify(def), JSON.stringify(members)],
      );
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
    res.status(201).json({ id: sampleId });
  }),
);

statisticsRouter.put(
  `${base}/samples/:sampleId`,
  handle(async (req, res) => {
    const { id } = await authorize(req, true);
    const raw = z
      .object({
        revision: z.number().int().min(1),
        name: z.string().trim().min(1).max(160),
        memberIds: z.array(z.string().uuid()).min(1).max(5000),
      })
      .parse(req.body);
    const dataset = await data(id),
      members = [...new Set(raw.memberIds)];
    // Removed/soft-deleted members may be dropped, never silently carried into a new version.
    if (members.some((member) => !dataset.rows[member]))
      fail("Уберите недоступных участников перед сохранением.");
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      const [rows] = await connection.query<any[]>(
        "SELECT * FROM analysis_samples WHERE id=? AND survey_id=? FOR UPDATE",
        [req.params.sampleId, id],
      );
      if (!rows.length) fail("Выборка не найдена.", 404);
      if (rows[0].revision !== raw.revision)
        fail(
          "Выборка уже изменена. Обновите страницу и повторите изменение.",
          409,
        );
      const [versions] = await connection.query<any[]>(
        "SELECT definition FROM analysis_sample_versions WHERE sample_id=? AND revision=?",
        [req.params.sampleId, raw.revision],
      );
      await connection.execute(
        "INSERT INTO analysis_sample_versions(sample_id,revision,definition,members) VALUES (?,?,?,?)",
        [
          req.params.sampleId,
          raw.revision + 1,
          JSON.stringify(parse(versions[0].definition)),
          JSON.stringify(members),
        ],
      );
      await connection.execute(
        "UPDATE analysis_samples SET name=?,revision=revision+1 WHERE id=?",
        [raw.name, req.params.sampleId],
      );
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
    res.json({ ok: true });
  }),
);

const configSchema = z.object({
  method: z.enum(methods.map((m) => m.id) as [string, ...string[]]),
  alpha: z.number().min(0.001).max(0.2),
  mu: z.number().finite().optional(),
  vectors: z.record(z.string().max(40), z.array(z.number().finite()).max(60)).default({}),
  matrixData: z.string().max(100000).default(""),
  parameters: z.record(z.string().max(40), z.number().finite()).default({}),
  groups: z
    .array(
      z.object({
        sampleId: z.string().uuid(),
        revision: z.number().int().positive(),
        variableId: z.string().max(500),
      }),
    )
    .min(0)
    .max(16),
  manual: z.record(z.string().max(100), z.number().finite()).default({}),
  manualReason: z.string().trim().max(1000).default(""),
  name: z.string().trim().max(160).default(""),
});
async function prepare(surveyId: string, raw: z.infer<typeof configSchema>) {
  if (Object.keys(raw.manual).length > 500)
    fail("Можно дополнить не более 500 значений.");
  if (Object.keys(raw.manual).length && !raw.manualReason)
    fail("Укажите источник/причину ручных значений.");
  const method = methods.find(m => m.id === raw.method)!;
  for (const key of Object.keys(raw.parameters)) {
    const field = method.parameters?.find(p => p.key === key);
    const value = raw.parameters[key];
    if (!field || (field.min !== undefined && value < field.min) ||
        (field.max !== undefined && value > field.max) || (field.integer && !Number.isInteger(value)) || (field.options && !field.options.some(o => o.value === value)))
      fail("Проверьте параметры выбранного метода.");
  }
  for (const key of Object.keys(raw.vectors)) if (!method.vectors?.some(v => v.key === key)) fail("Неизвестный вектор настроек метода.");
  const parameters = Object.fromEntries((method.parameters ?? []).map(p => [p.key, raw.parameters[p.key] ?? p.value]));
  if (method.kind === "manual") {
    if (raw.groups.length || Object.keys(raw.manual).length) fail("Для матричного метода задайте матрицу вместо групп участников.");
    if (!raw.manualReason.trim()) fail("Укажите источник матрицы и смысл её строк и столбцов.");
    let matrixData: unknown;
    try { matrixData = JSON.parse(raw.matrixData); } catch { fail("Матрица должна быть корректным JSON-массивом чисел."); }
    const vector = z.array(z.number().finite().min(0).max(1e10)).min(2).max(60);
    const matrix = z.array(vector).min(2).max(60);
    const schema = raw.method === "mds_individual" ? z.array(matrix).min(2).max(10) : matrix;
    matrixData = schema.parse(matrixData);
    const matrices = raw.method === "mds_individual" ? matrixData as number[][][] : [matrixData as number[][]];
    for (const value of matrices) {
      const width = value[0].length;
      if (value.length < 3 || width < 3 || value.some(row => row.length !== width)) fail("Нужна прямоугольная матрица минимум 3×3 без пропусков.");
      if (raw.method !== "mds_preference") {
        if (value.length !== width || value.some((row, i) => Math.abs(row[i]) > 1e-10 || row.some((entry, j) => Math.abs(entry - value[j][i]) > 1e-10)))
          fail("Матрица различий должна быть квадратной, симметричной и с нулевой диагональю.");
      }
      if (raw.method === "mds_individual" && (value.length > 25 || value.length !== matrices[0].length)) fail("INDSCAL поддерживает одинаковые матрицы до 25 объектов.");
      if (raw.method === "mds_preference" && (value.length > 25 || width > 25)) fail("Развёртывание поддерживает до 25 строк и столбцов.");
    }
    return { config: { method: raw.method, alpha: raw.alpha, parameters, matrixData }, groups: [],
      manualReason: raw.manualReason, snapshotAt: new Date().toISOString(), policy: "User-provided matrices; no respondent matching; source recorded; deterministic seed" };
  }
  if (raw.matrixData) fail("Этот метод использует показатели опроса, а не заданную матрицу.");
  const dataset = await data(surveyId),
    currentSamples = await samples(surveyId);
  const groups = raw.groups.map((g) => {
    const sample =
      currentSamples.find((s) => s.id === g.sampleId) ??
      fail("Выборка не найдена.", 404);
    if (sample.revision !== g.revision)
      fail("Состав группы изменился. Обновите настройки расчёта.", 409);
    const variable =
      dataset.variables.find((v) => v.id === g.variableId) ??
      fail("Показатель больше не доступен. Обновите настройки.");
    return { sample, variable };
  });
  for (const key of Object.keys(raw.manual)) {
    const split = key.indexOf(":"),
      index = Number(key.slice(0, split)),
      member = key.slice(split + 1);
    if (
      !Number.isInteger(index) ||
      !groups[index]?.sample.members.includes(member)
    )
      fail("Ручное значение не относится к выбранной группе.");
    if (dataset.rows[member]?.[groups[index].variable.id] !== undefined)
      fail(
        "В пилоте ручной ввод только дополняет пропуски, не заменяет сохранённые ответы.",
      );
  }
  const prepared = prepareInput(
    raw.method,
    groups,
    dataset.people,
    dataset.rows,
    raw.manual,
  );
  return {
    config: { method: raw.method, alpha: raw.alpha, mu: raw.mu, parameters, vectors: raw.vectors },
    groups: prepared,
    manualReason: raw.manualReason,
    snapshotAt: new Date().toISOString(),
    policy:
      "complete cases; paired by sessionId; no imputation; no outlier exclusion; alternative and multiplicity in method report",
  };
}
statisticsRouter.post(
  `${base}/preview`,
  handle(async (req, res) => {
    const { id } = await authorize(req, true);
    const raw = configSchema.parse(req.body);
    const input = await prepare(id, raw);
    res.json({
      input,
      hash: createHash("sha256")
        .update(JSON.stringify({ ...input, snapshotAt: undefined }))
        .digest("hex"),
    });
  }),
);
statisticsRouter.post(
  `${base}/analyses`,
  handle(async (req, res) => {
    const { id } = await authorize(req, true);
    const raw = configSchema.parse(req.body);
    const requestId = z.string().uuid().parse(req.body.requestId);
    const [existing] = await db.query<any[]>(
      "SELECT id FROM statistical_analyses WHERE id=? AND survey_id=? AND created_by=?",
      [requestId, id, req.user!.id],
    );
    if (existing.length) return res.status(200).json({ id: requestId });
    const input = await prepare(id, raw);
    const hash = createHash("sha256")
      .update(JSON.stringify({ ...input, snapshotAt: undefined }))
      .digest("hex");
    if (req.body.previewHash !== hash)
      fail(
        "Данные изменились или предпросмотр не выполнен. Проверьте данные ещё раз.",
        409,
      );
    const [pending] = await db.query<any[]>(
      "SELECT id FROM statistical_analyses WHERE survey_id=? AND status IN ('queued','running')",
      [id],
    );
    if (pending.length >= 3)
      fail("Уже выполняются три расчёта. Дождитесь завершения.");
    const analysisId = requestId,
      label = methods.find((m) => m.id === raw.method)!.label;
    await db.execute(
      "INSERT IGNORE INTO statistical_analyses(id,survey_id,created_by,name,input) VALUES (?,?,?,?,?)",
      [analysisId, id, req.user!.id, raw.name || label, JSON.stringify(input)],
    );
    void runStatisticsJobs();
    res.status(202).json({ id: analysisId });
  }),
);
statisticsRouter.get(
  `${base}/analyses/:analysisId`,
  handle(async (req, res) => {
    const { id } = await authorize(req);
    const [rows] = await db.query<any[]>(
      "SELECT id,name,status,input,result,error,created_at createdAt FROM statistical_analyses WHERE id=? AND survey_id=?",
      [req.params.analysisId, id],
    );
    if (!rows.length) fail("Расчёт не найден.", 404);
    res.json({
      ...rows[0],
      input: parse(rows[0].input),
      result: parse(rows[0].result),
    });
  }),
);
statisticsRouter.get(
  `${base}/analyses`,
  handle(async (req, res) => {
    const { id } = await authorize(req);
    const [rows] = await db.query<any[]>(
      "SELECT id,name,status,error,created_at createdAt,finished_at finishedAt FROM statistical_analyses WHERE survey_id=? ORDER BY created_at DESC LIMIT 100",
      [id],
    );
    res.json(rows);
  }),
);

statisticsRouter.delete(
  `${base}/analyses/:analysisId`,
  handle(async (req, res) => {
    const { id } = await authorize(req, true);
    const [result] = await db.execute<any>(
      "DELETE FROM statistical_analyses WHERE id=? AND survey_id=? AND status IN ('completed','failed')",
      [req.params.analysisId, id],
    );
    if (!result.affectedRows) {
      const [rows] = await db.query<any[]>(
        "SELECT id FROM statistical_analyses WHERE id=? AND survey_id=?",
        [req.params.analysisId, id],
      );
      if (!rows.length) fail("Расчёт не найден.", 404);
      fail("Дождитесь завершения расчёта перед удалением.", 409);
    }
    res.status(204).end();
  }),
);
