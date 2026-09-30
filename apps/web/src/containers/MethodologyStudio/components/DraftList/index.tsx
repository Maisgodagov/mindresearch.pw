import { FilePlus2 } from "lucide-react";
import { Button } from "../../../../ui";
import { DRAFT_LIST_COPY as copy } from "./const";
import { DraftListCard } from "./styles";
import type { DraftListProps } from "./types";

export function DraftList({ drafts, selectedId, busy, onCreate, onSelect }: DraftListProps) {
  return (
    <DraftListCard className="list">
      <div className="list-head">
        <h2>{copy.title}</h2>
        <Button className="icon-button" aria-label={copy.create} title={copy.create} onClick={onCreate} disabled={busy}>
          <FilePlus2 size={17} />
        </Button>
      </div>
      <p className="muted">{copy.description}</p>
      <div className="drafts">
        {drafts.map((draft) => (
          <button key={draft.id} type="button" className={`draft ${selectedId === draft.id ? "active" : ""}`} onClick={() => onSelect(draft)}>
            <span className="draft-title">{draft.title}</span>
            <span className="draft-meta">
              {draft.isVerified && draft.status === "archived" ? (
                <><span className="archive-badge">{copy.archived}</span><span className="draft-meta-text">{copy.restore}</span></>
              ) : draft.isVerified ? (
                <><span className="draft-meta-text">{draft.isBuiltin ? copy.builtIn : copy.published}</span><span className="draft-meta-text">Версия {draft.formulaVersion ?? copy.fixedVersion}</span></>
              ) : copy.draft}
            </span>
          </button>
        ))}
        {!drafts.length && <p className="muted">{copy.empty}</p>}
      </div>
    </DraftListCard>
  );
}
