import { Modal } from 'antd';
import { methodologyModalCopy as copy } from './const';
import type { Props } from './types';
import { Content } from './styles';

export type { Methodology } from './types';

export function MethodologyModal({ methodology, onClose }: Props) {
  return <Modal
    open
    onCancel={onClose}
    footer={null}
    centered
    width={760}
    title={methodology.title}
    aria-label={`${copy.scoring} ${methodology.title}`}
    styles={{ body: { maxHeight: 'min(75dvh, 760px)', overflowY: 'auto', padding: '8px 24px 24px' } }}
  >
    <Content>
      <div className="version">{copy.version} {methodology.version}</div>
      <p>{methodology.summary}</p>
      <h3>{copy.steps}</h3>
      <ol>{methodology.steps.map((step) => <li key={step}>{step}</li>)}</ol>
      {methodology.keys?.length ? <><h3>{copy.key}</h3>{methodology.keys.map((item) => <div className="key" key={item.label}><b>{item.label}</b><span>{item.value}</span></div>)}</> : null}
      {methodology.norms?.length ? <><h3>{copy.norms}</h3>{methodology.norms.map((item) => <div className="key" key={item.label}><b>{item.label}</b><span>{item.value}</span></div>)}</> : null}
      {methodology.notes.length > 0 ? <><h3>{copy.notes}</h3>{methodology.notes.map((note) => <p className="note" key={note}>{note}</p>)}</> : null}
      {methodology.sources.length > 0 && <><h3>{copy.sources}</h3>
      <div className="sources">{methodology.sources.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.title}</a>)}</div></>}
    </Content>
  </Modal>;
}
