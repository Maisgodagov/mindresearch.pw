import { Pagination } from 'antd';
import styled from 'styled-components';
import { SelectField } from '../../../../components/SelectField';

const Row = styled.div`
  display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap;
  gap: 12px 18px; padding: 14px 0;
  color: #526557; font-size: 12px;
  .range { font-variant-numeric: tabular-nums; }
  .controls { display: flex; align-items: center; flex-wrap: wrap; gap: 12px; }
  .size { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
  .size > span { white-space: nowrap; }
  .ant-select { width: 80px; flex-shrink: 0; }
  .ant-pagination-item-active { background: #52764b; border-color: #52764b; }
  .ant-pagination-item-active a, .ant-pagination-item-active:hover a { color: #fff; }
  .ant-pagination-item, .ant-pagination-prev, .ant-pagination-next { border-radius: 7px; }
  @media(max-width: 700px) {
    display: grid; grid-template-columns: minmax(0,1fr) auto;
    .controls { display: contents; }
    .size { grid-column: 2; }
    .ant-pagination { grid-column: 1 / -1; justify-self: end; }
    .ant-select { width: 66px; }
  }
`;

export function RespondentPagination({total,page,pageSize,onChange,onSizeChange}:{total:number;page:number;pageSize:number;onChange:(page:number)=>void;onSizeChange:(size:number)=>void}) {
  const start = total ? (page - 1) * pageSize + 1 : 0;
  return <Row>
    <span className="range" aria-live="polite">{start}–{Math.min(page * pageSize, total)} из {total} респондентов</span>
    <div className="controls">
      <label className="size"><span>На странице</span><SelectField aria-label="Респондентов на странице" size="small" value={pageSize} options={[20,50,100].map(value=>({value,label:String(value)}))} onChange={value=>onSizeChange(Number(value))}/></label>
      {total > pageSize && <Pagination aria-label="Страницы респондентов" size="small" current={page} pageSize={pageSize} total={total} showSizeChanger={false} showLessItems responsive onChange={onChange}/>}
    </div>
  </Row>;
}
