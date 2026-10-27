import { useState } from 'react';
import { Checkbox, Modal, Radio } from 'antd';
import styled from 'styled-components';
import { Button } from '../../../../components/Button';
import { sectionKey, type ExportSection, type ExportSelection, type ExportScope, type ExportContent } from '../../../../admin/resultsWorkbook';

const Content = styled.div`
  max-height: calc(100dvh - 160px);
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-color: #a1b09b transparent;
  h3:first-child { margin-top: 6px; }
  p { color: #647268; line-height: 1.6; }
  h3 { font-size: 14px; margin: 22px 0 10px; }
  .content-options { display: grid; gap: 10px; width: 100%; }
  .content-options .ant-radio-wrapper { margin: 0; align-items: flex-start; }
  .content-options small { display: block; color: #647268; line-height: 1.5; margin-top: 2px; }
  .scope { display: grid; gap: 9px; }
  .selection-actions { display: flex; gap: 16px; align-items: center; margin-bottom: 12px; }
  .selection-actions button { padding: 0; background: none; border: 0; color: #52764b; text-decoration: underline; text-underline-offset: 3px; }
  .sections { display: grid; gap: 14px; max-height: 28vh; overflow: auto; overscroll-behavior: contain; padding: 4px; }
  .section-label { display: grid; gap: 3px; }
  .section-label small { color: #647268; font-size: 12px; }
  .footer { position: sticky; bottom: 0; background: #fff; display: flex; justify-content: flex-end; flex-wrap: wrap; gap: 10px; margin-top: 12px; padding: 12px 0 2px; }
`;

export function ResultsExportModal({ sections, selectedCount, filteredCount, totalCount, busy, onCancel, onExport }: {
  sections: ExportSection[]; selectedCount: number; filteredCount: number; totalCount: number;
  busy: boolean; onCancel: () => void; onExport: (selection: ExportSelection) => void;
}) {
  const [keys, setKeys] = useState(() => sections.map(sectionKey));
  const [content, setContent] = useState<ExportContent>('results');
  const [scope, setScope] = useState<ExportScope>(selectedCount ? 'selected' : 'filtered');
  const count = scope === 'selected' ? selectedCount : scope === 'filtered' ? filteredCount : totalCount;
  return <Modal open title="Выгрузка результатов в Excel" centered width={620} footer={null} onCancel={busy ? undefined : onCancel} closable={!busy} maskClosable={!busy} keyboard={!busy}>
    <Content>
      <h3>Что выгрузить</h3>
      <Radio.Group className="content-options" aria-label="Что выгрузить" value={content} onChange={event => setContent(event.target.value)} disabled={busy}>
        <Radio value="results"><span>Результаты<small>Итоговые показатели методик и свои вопросы на одном листе.</small></span></Radio>
        <Radio value="answers"><span>Бланки ответов<small>Отдельный лист для каждой методики: участники в строках, вопросы в столбцах.</small></span></Radio>
        <Radio value="both"><span>Результаты и бланки<small>Лист с результатами и дополнительные листы с ответами.</small></span></Radio>
      </Radio.Group>
      <h3>Участники</h3>
      <Radio.Group className="scope" value={scope} onChange={event => setScope(event.target.value)} disabled={busy}>
        <Radio value="selected" disabled={!selectedCount}>Отмеченные в таблице ({selectedCount})</Radio>
        <Radio value="filtered" disabled={!filteredCount}>Текущая выборка по всем страницам ({filteredCount})</Radio>
        <Radio value="all" disabled={!totalCount}>Все участники опроса ({totalCount})</Radio>
      </Radio.Group>
      <h3>Методики и свои блоки вопросов</h3>
      <div className="selection-actions"><button disabled={busy} onClick={() => setKeys(sections.map(sectionKey))}>Выбрать все</button><button disabled={busy} onClick={() => setKeys([])}>Снять выбор</button><span>{keys.length} из {sections.length}</span></div>
      <div className="sections">{sections.map((section, index) => <Checkbox key={sectionKey(section)} checked={keys.includes(sectionKey(section))} disabled={busy} onChange={event => setKeys(current => event.target.checked ? [...current, sectionKey(section)] : current.filter(key => key !== sectionKey(section)))}>
        <span className="section-label"><span>{index + 1}. {section.title}</span><small>{content === 'answers' ? 'Ответы на каждый вопрос' : content === 'both' ? 'Результаты и ответы на вопросы' : section.sectionKind === 'custom' && !section.code.startsWith('custom_method_') ? 'Свой блок: ответы на вопросы или показатели настроенного расчёта' : 'Методика: только итоговые показатели'}</small></span>
      </Checkbox>)}</div>
      <p>{content === 'results' ? 'Пустая ячейка означает, что данных или рассчитанного результата нет. Ответы на отдельные вопросы методик не включаются.' : 'В бланках — исходные ответы участников и вертикальные заголовки вопросов. Пустая ячейка означает, что ответа нет.'} Качество и время прохождения не включаются.</p>
      <div className="footer"><Button disabled={busy} onClick={onCancel}>Отмена</Button><Button type="primary" loading={busy} disabled={!keys.length || !count} onClick={() => onExport({ sectionKeys: keys, scope, content })}>Скачать Excel · {count}</Button></div>
    </Content>
  </Modal>;
}
