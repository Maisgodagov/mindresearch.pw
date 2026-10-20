// Explicitly volatile storage for synthetic tests and the loopback-only preview server.
// Production always uses mysqlRepository; this is never a database-error fallback.
import type { Repository, Publication, Assessment } from "./repository.js";
import { initialCatalog, failure } from "./model.js";
export function memoryRepository(): Repository {
  const publications = new Map<string, Publication>(
    initialCatalog.map((m) => [
      m.slug,
      {
        slug: m.slug,
        draft: structuredClone(m),
        published: structuredClone(m),
        revision: 1,
      },
    ]),
  );
  const sessions = new Map<
    string,
    { assessment: Assessment; tokenHash: string }
  >();
  let tail = Promise.resolve();
  return {
    async publications() {
      return structuredClone([...publications.values()]);
    },
    async savePublication(slug, draft, action, revision) {
      const p = publications.get(slug);
      if (!p || p.revision !== revision)
        throw failure(
          409,
          "Публикация изменилась. Обновите страницу перед сохранением",
        );
      p.draft = structuredClone(draft);
      p.revision++;
      if (action === "publish") p.published = structuredClone(draft);
      if (action === "unpublish") p.published = null;
    },
    async create(assessment, tokenHash) {
      sessions.set(assessment.id, {
        assessment: structuredClone(assessment),
        tokenHash,
      });
    },
    async assessment(id, tokenHash, operation) {
      const previous = tail;
      let release!: () => void;
      tail = new Promise<void>((resolve) => {
        release = resolve;
      });
      await previous;
      try {
        const row = sessions.get(id);
        if (
          !row ||
          row.tokenHash !== tokenHash ||
          Date.parse(row.assessment.expiresAt) <= Date.now()
        )
          throw failure(404, "Прохождение недоступно или срок хранения истёк");
        const copy = structuredClone(row.assessment);
        const result = await operation(copy);
        row.assessment = copy;
        return result;
      } finally {
        release();
      }
    },
    async remove(id, tokenHash) {
      if (sessions.get(id)?.tokenHash === tokenHash) sessions.delete(id);
    },
  };
}
