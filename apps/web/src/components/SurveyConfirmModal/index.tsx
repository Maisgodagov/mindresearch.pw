import { Modal } from 'antd';
import { Button } from '../Button';
import { surveyConfirmCopy } from './const';
import type { SurveyConfirmModalProps } from './types';
import { ModalContent } from './styles';

export function SurveyConfirmModal({ open, title, description, warning, confirmLabel, loading = false, onCancel, onConfirm }: SurveyConfirmModalProps) {
  return <Modal open={open} centered title={title} onCancel={onCancel} footer={null} width={470}>
    <ModalContent>
      <p>{description}</p>
      <div className="warning">{warning}</div>
      <div className="actions">
        <Button onClick={onCancel} disabled={loading}>{surveyConfirmCopy.cancel}</Button>
        <Button type="primary" danger loading={loading} onClick={onConfirm}>{confirmLabel}</Button>
      </div>
    </ModalContent>
  </Modal>;
}
