import { useState } from 'react';
import { Checkbox, Modal, Radio } from 'antd';
import styled from 'styled-components';
import { Button } from '../../../../components/Button';
import { sectionKey, type ExportSection, type ExportSelection, type ExportScope } from '../../../../admin/resultsWorkbook';

const Content = styled.div`
  p { color: #647268; line-height: 1.6; }
  h3 { font-size: 14px; margin: 22px 0 10px; }
  .scope { display: grid; gap: 9px; }
  .selection-actions { display: flex; gap: 16px; align-items: center; margin-bottom: 12px; }
  .selection-actions button { padding: 0; background: none; border: 0; color: #52764b; text-decoration: underline; text-underline-offset: 3px; }
  .sections { display: grid; gap: 14px; max-height: 38vh; overflow: auto; overscroll-behavior: contain; padding: 4px; }
  .section-label { display: grid; gap: 3px; }
  .section-label small { color: #647268; font-size: 12px; }
  .footer { display: flex; justify-content: flex-end; flex-wrap: wrap; gap: 10px; margin-top: 24px; }
`;

export function ResultsExportModal({ sections, selectedCount, filteredCount, totalCount, busy, onCancel, onExport }: {
  sections: ExportSection[]; selectedCount: number; filteredCount: number; totalCount: number;
  busy: boolean; onCancel: () => void; onExport: (selection: ExportSelection) => void;
}) {
  const [keys, setKeys] = useState(() => sections.map(sectionKey));
  const [scope, setScope] = useState<ExportScope>(selectedCount ? 'selected' : 'filtered');
  const count = scope === 'selected' ? selectedCount : scope === 'filtered' ? filteredCount : totalCount;
  return <Modal open title="Выгрузка результатов в Excel" centered width={620} footer={null} onCancel={busy ? undefined : onCancel} closable={!busy} maskClosable={!busy} keyboard={!busy}>
    <Content>
      <p>Одна строка — один участник. Сначала №, имя, возраст и пол, затем отдельные блоки выбранных методик и своих вопросов.</p>
      <h3>Участники</h3>
      <Radio.Group className="scope" value={scope} onChange={event => setScope(event.target.value)} disabled={busy}>
        <Radio value="selected" disabled={!selectedCount}>Отмеченные в таблице ({selectedCount})</Radio>
        <Radio value="filtered" disabled={!filteredCount}>Текущая выборка по всем страницам ({filteredCount})</Radio>
        <Radio value="all" disabled={!totalCount}>Все участники опроса ({totalCount})</Radio>
      </Radio.Group>
      <h3>Методики и свои блоки вопросов</h3>
      <div className="selection-actions"><button disabled={busy} onClick={() => setKeys(sections.map(sectionKey))}>Выбрать все</button><button disabled={busy} onClick={() => setKeys([])}>Снять выбор</button><span>{keys.length} из {sections.length}</span></div>
      <div className="sections">{sections.map((section, index) => <Checkbox key={sectionKey(section)} checked={keys.includes(sectionKey(section))} disabled={busy} onChange={event => setKeys(current => event.target.checked ? [...current, sectionKey(section)] : current.filter(key => key !== sectionKey(section)))}>
        <span className="section-label"><span>{index + 1}. {section.title}</span><small>{section.sectionKind === 'custom' && !section.code.startsWith('custom_method_') ? 'Свой блок: ответы на вопросы или показатели настроенного расчёта' : 'Методика: только итоговые показатели'}</small></span>
      </Checkbox>)}</div>
      <p>Пустая ячейка означает, что данных или рассчитанного результата нет. Качество, время прохождения и ответы на отдельные вопросы методик не включаются.</p>
      <div className="footer"><Button disabled={busy} onClick={onCancel}>Отмена</Button><Button type="primary" loading={busy} disabled={!keys.length || !count} onClick={() => onExport({ sectionKeys: keys, scope })}>Скачать Excel · {count}</Button></div>
    </Content>
  </Modal>;
}
