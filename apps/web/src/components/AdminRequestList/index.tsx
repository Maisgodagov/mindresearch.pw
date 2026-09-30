import { ExternalLink } from "lucide-react";
import { Button, Card } from "../../ui";
import { TextAreaField } from "../TextAreaField";
import { queueActions } from "./const";
import type { AdminRequestListProps } from "./types";
import { Queue } from "./styles";

export function AdminRequestList({ kind, items, emptyText, onNoteChange, onStatusChange }: AdminRequestListProps) {
  return <Queue>
    {items.length === 0 && <Card className="empty">{emptyText}</Card>}
    {items.map((item) => <Card className="item" key={item.id}>
      <div className="top">
        <div>
          <div className="meta">{item.submittedBy} · {item.submittedAt}</div>
          <h2>{item.title}</h2>
        </div>
        <span className="badge">{item.status}</span>
      </div>
      {item.details.map((detail) => <p key={detail.label}><b>{detail.label}:</b> {detail.value}</p>)}
      {item.description && <p style={{ whiteSpace: "pre-wrap" }}>{item.description}</p>}
      {kind === "report" && item.pageUrl && <a className="page-link" href={item.pageUrl} target="_blank" rel="noreferrer"><ExternalLink size={13} /> Открыть страницу</a>}
      <TextAreaField value={item.adminNote ?? ""} placeholder="Комментарий администратора" onChange={(event) => onNoteChange(item.id, event.target.value)} />
      <div className="actions">{queueActions[kind].map((action) => <Button key={action.status} onClick={() => onStatusChange(item, action.status)}>{action.label}</Button>)}</div>
    </Card>)}
  </Queue>;
}

export type { AdminRequestListProps, QueueKind } from "./types";
