import { Modal } from 'antd';
import { Button } from '../Button';
import { SelectField } from '../SelectField';
import { TextAreaField } from '../TextAreaField';
import { reportIssueCopy as copy, reportIssueOptions } from './const';
import type { ReportIssueModalProps } from './types';
import { Content } from './styles';

export function ReportIssueModal({ open, sent, category, description, sending, error, onCategoryChange, onDescriptionChange, onClose, onSubmit }: ReportIssueModalProps) {
  return <Modal open={open} onCancel={onClose} footer={null} centered width={560} title={copy.title}>
    <Content>
      <p>{copy.intro}</p>
      {sent ? <div className="success">{copy.sent}</div> : <>
        <div className="field">
          <label>{copy.category}</label>
          <SelectField options={reportIssueOptions} value={category} onChange={(value) => onCategoryChange(String(value ?? 'bug'))} aria-label={copy.category} />
        </div>
        <div className="field">
          <label>{copy.description}</label>
          <TextAreaField autoFocus value={description} onChange={(event) => onDescriptionChange(event.target.value)} placeholder={copy.placeholder} />
        </div>
        {error && <p className="error">{error}</p>}
        <div className="actions">
          <Button onClick={onClose}>{copy.cancel}</Button>
          <Button type="primary" disabled={sending || description.trim().length < 10} loading={sending} onClick={onSubmit}>{sending ? copy.sending : copy.send}</Button>
        </div>
      </>}
    </Content>
  </Modal>;
}
