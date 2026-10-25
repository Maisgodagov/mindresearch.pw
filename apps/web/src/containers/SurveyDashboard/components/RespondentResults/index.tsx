import { flexRender, getCoreRowModel, getExpandedRowModel, useReactTable, type ColumnDef, type VisibilityState, type ColumnSizingState, type ExpandedState } from "@tanstack/react-table";
import type { AnswerGroup, Respondent } from "../../types";
import { Fragment, useEffect, useId, useMemo, useRef, useState } from "react";
import {
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  ArchiveRestore,
  ChevronDown,
  ChevronRight,
  Download,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { Button } from "../../../../ui";
import { Checkbox } from "antd";
import { shortNames } from "../../const";
import { RESPONDENT_RESULTS_COPY as copy } from "./const";
import { Table, TableWrap, TrashBox, TrashToggle } from "./styles";
import type { RespondentResultsProps } from "./types";
import { percent } from "../ResponseQuality";
import { MetricExplanation } from "../ResponseQuality/explanations";
import type { MetricKey } from "../../quality";
import { STATUS } from "../../quality";
import type { Quality } from "../../quality";

type ResultRow = Respondent & { methodGroup?: AnswerGroup; parentId?: string; qualityRow?: boolean; subRows?: ResultRow[] };

const qualityColumns: { metric: MetricKey; label: string; render: (value: Quality) => string; title: string }[] = [
  ...(['overall','behavioral','response'] as const).map((key,index)=>({metric:key,label:['Общий индекс качества','Поведение','Ответы'][index],render:(q:Quality)=>percent(q[key].score)+' · '+STATUS[q[key].status],title:'Эвристический индекс V2, не вероятность честности'})),
  {metric:'confidence',label:'Уверенность',render:q=>percent(q.overall.confidence*100),title:'Полнота и качество основания расчёта'},
  {metric:'strongFlags',label:'Сильные признаки',render:q=>String(q.strong_flag_count),title:'Количество сильных признаков; подробности в раскрытых результатах'},
];

function formatDuration(startedAt: string, completedAt: string | null) {
  if (!completedAt) return null;
  const milliseconds = Date.parse(completedAt) - Date.parse(startedAt);
  if (!Number.isFinite(milliseconds) || milliseconds < 0) return null;
  const seconds = Math.floor(milliseconds / 1000);
  return `${Math.floor(seconds / 60)} мин ${seconds % 60} сек`;
}

export function RespondentResults({
  storageKey = "mindresearch:results-table:v1",
  showToolbarActions = true,
  includeQualityRow = true,
  initialMethodExpanded = {},
  sortKey, sortDirection, methodSortOptions, onColumnSort,
  readOnly=false,
  showGender=false,
  showAge=false, onSortAge, ageSortDirection,
  respondents,
  totalCount,
  qualities,
  deletedRespondents,
  sections,
  selected,
  deletedSelected,
  expanded,
  allSelected,
  selectedCount,
  trashOpen,
  exporting,
  updatingTrash,
  adminView,
  onSelectAll,
  onSelectRespondent,
  onSelectDeleted,
  onToggleExpanded,
  onToggleTrash,
  onDeleteSelected,
  onExport,
  onRestore,
  renderMethodResult,
  renderMethodHelp,
  renderRespondentDetails,
  getRespondentGroups,
}: RespondentResultsProps) {
  const [qualityExpanded, setQualityExpanded] = useState(false);
  const tableId = useId();
  const draggingColumn = useRef<string | null>(null);
  const suppressSort = useRef(false);
  const [dropColumn, setDropColumn] = useState<string | null>(null);
  const [methodExpanded, setMethodExpanded] = useState<Record<string, boolean>>(initialMethodExpanded);
  const data = useMemo<ResultRow[]>(() => respondents.map(person => ({...person, subRows:[...(includeQualityRow?[{...person,id:JSON.stringify([person.id,'__quality']),parentId:person.id,qualityRow:true}]:[]),...getRespondentGroups(person).map(group => ({...person,id:JSON.stringify([person.id,group.code]),parentId:person.id,methodGroup:group}))]})), [respondents,getRespondentGroups,includeQualityRow]);
  const expandedRows = useMemo<ExpandedState>(() => ({...expanded,...methodExpanded}), [expanded,methodExpanded]);

  const selectedDeletedCount = Object.values(deletedSelected).some(Boolean);

  const [saved] = useState(() => {try {return JSON.parse(localStorage.getItem(storageKey) || '{}');} catch {return {};}});
  const [visibility, setVisibility] = useState<VisibilityState>({});
  const [columnOrder, setColumnOrder] = useState<string[]>(saved.order || []);
  const [sizing, setSizing] = useState<ColumnSizingState>(saved.sizing || {});
  const [pinning, setPinning] = useState<{left?:string[];right?:string[]}>({left:['select']});
  const density = 'compact';
  useEffect(() => {try {localStorage.setItem(storageKey, JSON.stringify({visibility,order:columnOrder,sizing,pinning,density}));} catch {}},[visibility,columnOrder,sizing,pinning,density]);
  const columns: ColumnDef<ResultRow>[] = [
    {id:'select',size:44,minSize:44,maxSize:44,enableResizing:false,enableHiding:false,header:()=> <Checkbox aria-label="Выбрать респондентов на этой странице" checked={allSelected} indeterminate={!allSelected && respondents.some(person => selected[person.id])} onChange={event=>onSelectAll(event.target.checked)}/>,cell:({row})=><Checkbox aria-label={`Выбрать ${row.original.alias}`} checked={!!selected[row.original.id]} onChange={event=>onSelectRespondent(row.original.id,event.target.checked)}/>},
    {id:'respondent',meta:copy.respondent,size:220,header:copy.respondent,cell:({row})=><div className="person"><Button className="expand" aria-label={copy.showAnswers} aria-expanded={!!expanded[row.original.id]} onClick={()=>onToggleExpanded(row.original.id)}>{expanded[row.original.id]?<ChevronDown size={17}/>:<ChevronRight size={17}/>}</Button><span>{row.original.alias}{row.original.source==='community'&&<small>Взаимопомощь</small>}</span></div>},
    ...(showAge ? [{id:'age',meta:'Возраст',size:100,header:()=> <button type="button" className="sort-age" onClick={onSortAge}>Возраст {ageSortDirection==='asc'?'↑':ageSortDirection==='desc'?'↓':'↕'}</button>,cell:({row}: {row:{original:Respondent}})=>row.original.age??'—'}] : []),
    ...(showGender?[{id:'gender',meta:'Пол',size:145,header:'Пол',cell:({row}:{row:{original:Respondent}})=>row.original.gender??'—'}]:[]),
    {id:'status',meta:copy.status,size:145,header:copy.status,cell:({row})=><span className={`pill ${row.original.status==='completed'?'completed':'in-progress'}`}>{row.original.status==='completed'?copy.completed:copy.inProgress}</span>},
    {id:'answers',meta:copy.answers,size:95,header:copy.answers,cell:({row})=>row.original.answered+(adminView?' / 208':'')},
    {id:'duration',meta:'Время прохождения',size:165,header:'Время прохождения',cell:({row})=>row.original.status==='completed'?formatDuration(row.original.startedAt,row.original.completedAt)??'—':'—'},
    ...(includeQualityRow || Object.keys(qualities).length ? qualityColumns : []).filter((_,index)=>qualityExpanded||index===0).map(column=>({id:'quality-'+column.metric,meta:column.label,size:185,header:()=> <>{column.label}<MetricExplanation metric={column.metric}/></>,cell:({row}: {row:{original:Respondent}})=>{const quality=qualities[row.original.id];if(!quality)return <span className="cell-missing" title="Качество ещё не рассчитано">—</span>;if(['overall','behavioral','response'].includes(column.metric)){const index=quality[column.metric as 'overall'|'behavioral'|'response'];return <span className="table-quality" data-status={index.status}><b>{percent(index.score)}</b><span>{STATUS[index.status]}</span></span>;}return <span className="cell-number">{column.render(quality)}</span>;}})),
    ...sections.map(section=>({id:'method-'+section.code,meta:shortNames[section.code]??section.title,size:190,header:shortNames[section.code]??section.title,cell:({row}: {row:{original:Respondent}})=>{const group=row.original.groups.find(group=>group.code===section.code);return group?.result?renderMethodResult(group):<span className="cell-missing" aria-label="Нет рассчитанного результата" title="Нет рассчитанного результата">—</span>;}})),
    {id:'started',meta:copy.started,size:130,header:copy.started,cell:({row})=>new Date(row.original.startedAt).toLocaleDateString('ru')}
  ];
  const sortKeyForColumn = (id:string) => {
    if(id==='select')return undefined;
    if(id==='respondent')return 'alias';
    if(id.startsWith('quality-'))return id.slice(8);
    if(id.startsWith('method-')) {const prefix='method:'+encodeURIComponent(id.slice(7))+':';const keys=methodSortOptions.filter(option=>option.value.startsWith(prefix));return keys.find(option=>/:(overall(\.score)?|score|average)$/.test(option.value))?.value??keys[0]?.value;}
    return id;
  };
  const activeColumn = columns.find(column=>{const key=sortKeyForColumn(column.id!);return key===sortKey||(column.id==='started'&&['newest','oldest'].includes(sortKey));})?.id;
  for(const column of columns) {column.enableSorting=!!sortKeyForColumn(column.id!);Object.assign(column,{accessorFn:()=>0});column.sortDescFirst=false;}
  const ids = columns.map(column => column.id!);
  const orderedIds = ['select', ...columnOrder.filter(id=>id!=='select'&&ids.includes(id)),...ids.filter(id=>id!=='select'&&!columnOrder.includes(id))];
  const table = useReactTable({data,columns,getCoreRowModel:getCoreRowModel(),getSubRows:row=>row.subRows,getExpandedRowModel:getExpandedRowModel(),getRowCanExpand:()=>true,autoResetExpanded:false,autoResetPageIndex:false,getRowId:person=>person.id,columnResizeMode:'onChange',defaultColumn:{minSize:80,maxSize:640},manualSorting:true,enableSortingRemoval:false,onSortingChange:updater=>{const previous=activeColumn?[{id:activeColumn,desc:sortDirection==='desc'}]:[];const next=typeof updater==='function'?updater(previous):updater;if(next[0]){const key=sortKeyForColumn(next[0].id);if(key)onColumnSort(key,next[0].desc?'desc':'asc');}},state:{sorting:activeColumn?[{id:activeColumn,desc:sortDirection==='desc'}]:[],expanded:expandedRows,columnVisibility:visibility,columnOrder:orderedIds,columnSizing:sizing,columnPinning:pinning},onColumnVisibilityChange:setVisibility,onColumnOrderChange:setColumnOrder,onColumnSizingChange:setSizing,onColumnPinningChange:setPinning});
  function reorderColumn(from:string, to:string) {
    if(from===to||from==='select'||to==='select')return;
    const next=[...orderedIds];const targetIndex=next.indexOf(to);next.splice(next.indexOf(from),1);next.splice(targetIndex,0,from);setColumnOrder(next);
  }
  function columnStyle(column: ReturnType<typeof table.getAllLeafColumns>[number]) {return {position:column.getIsPinned()?'sticky' as const:undefined,left:column.getIsPinned()==='left'?column.getStart('left'):undefined,zIndex:column.getIsPinned()?3:undefined,width:column.getSize(),textAlign:column.id==='select'?'center' as const:undefined,verticalAlign:column.id==='select'?'middle':undefined,background:column.getIsPinned()?'var(--table-cell-background, #fff)':undefined};}

  return (
    <>
      <div className="respondent-toolbar">
        <div className="respondent-heading">
          <div className="respondent-title"><h2>{copy.title}</h2><span className="respondent-count">Всего: {totalCount}</span></div>
          <div className="respondent-selected-count" role="status">{selectedCount > 0 ? `Выбрано ${selectedCount}` : "\u00a0"}</div>
        </div>
        {showToolbarActions && <div className="toolbar-actions">
          {!readOnly&&<Button
            className="bulk-action delete-action"
            disabled={!selectedCount || updatingTrash}
            onClick={onDeleteSelected}
          >
            <Trash2 size={16} /> {copy.delete}
            {selectedCount ? ` (${selectedCount})` : ""}
          </Button>}
          <Button className="bulk-action" disabled={!totalCount || exporting} onClick={onExport}>
            <Download size={16} />{" "}
            {exporting
              ? copy.preparing
              : `${copy.export}${selectedCount ? ` (${selectedCount})` : ""}`}
          </Button>
        <Button aria-expanded={qualityExpanded} aria-controls={tableId} onClick={() => setQualityExpanded(value => !value)}>
          {qualityExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          {qualityExpanded ? "Скрыть показатели качества" : "Показать показатели качества"}
        </Button>
        </div>}
      </div>
      <TableWrap>
        <Table id={tableId} $qualityExpanded={qualityExpanded} data-density={density} style={{width:table.getTotalSize(), minWidth:table.getTotalSize(), tableLayout:'fixed'}}>
          <colgroup>{[...table.getLeftVisibleLeafColumns(),...table.getCenterVisibleLeafColumns(),...table.getRightVisibleLeafColumns()].map(column => <col key={column.id} style={{width:column.getSize()}} />)}</colgroup>
          <thead>{table.getHeaderGroups().map(group => <tr key={group.id}>{group.headers.map(header => <th key={header.id} data-column-id={header.column.id} draggable={header.column.id!=='select'} className={dropColumn===header.column.id?'column-drop-target':undefined}
            onDragStart={event=>{if((event.target as HTMLElement).closest('.column-resizer')){event.preventDefault();return;}draggingColumn.current=header.column.id;suppressSort.current=true;event.dataTransfer.effectAllowed='move';event.dataTransfer.setData('text/plain',header.column.id);}}
            onDragOver={event=>{if(draggingColumn.current&&header.column.id!=='select'){event.preventDefault();event.dataTransfer.dropEffect='move';setDropColumn(header.column.id);}}}
            onDrop={event=>{event.preventDefault();if(draggingColumn.current)reorderColumn(draggingColumn.current,header.column.id);draggingColumn.current=null;setDropColumn(null);}}
            onDragEnd={()=>{draggingColumn.current=null;setDropColumn(null);setTimeout(()=>{suppressSort.current=false;},0);}}
            onKeyDown={event=>{if(event.altKey&&(event.key==='ArrowLeft'||event.key==='ArrowRight')){event.preventDefault();const index=orderedIds.indexOf(header.column.id);const target=orderedIds[index+(event.key==='ArrowLeft'?-1:1)];if(target)reorderColumn(header.column.id,target);}}}
            title={header.column.id!=='select'?'Перетащите заголовок, чтобы переместить столбец. Alt + стрелки — с клавиатуры.':undefined} style={columnStyle(header.column)} aria-sort={header.column.getIsSorted()==='asc'?'ascending':header.column.getIsSorted()==='desc'?'descending':undefined}>
            {header.column.getCanSort()?<div className="sortable-heading"><button type="button" className="column-sort" onClick={event=>{if(!suppressSort.current)header.column.getToggleSortingHandler()?.(event);}}>{header.column.columnDef.meta as string}{header.column.getIsSorted()==='asc'?<ArrowUp size={13}/>:header.column.getIsSorted()==='desc'?<ArrowDown size={13}/>:<ArrowUpDown size={13}/>}</button>{header.column.id.startsWith('quality-')&&<MetricExplanation metric={header.column.id.slice(8) as MetricKey}/>}</div>:flexRender(header.column.columnDef.header, header.getContext())}
            {header.column.getCanResize() && <div role="separator" aria-label={`Ширина: ${header.column.columnDef.meta}`} aria-orientation="vertical" tabIndex={0} className="column-resizer" onMouseDown={header.getResizeHandler()} onTouchStart={header.getResizeHandler()} onDoubleClick={() => header.column.resetSize()} onKeyDown={event => {if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();setSizing(value=>({...value,[header.column.id]:Math.max(80,header.column.getSize()+(event.key==='ArrowRight'?16:-16))}));}}} />}
          </th>)}</tr>)}</thead>
          <tbody>{table.getRowModel().rows.map(row => {
            const person = row.original;
            const group = person.methodGroup;
            if (person.qualityRow) return <Fragment key={row.id}>
              <tr className="method-subrow quality-subrow"><td colSpan={table.getVisibleLeafColumns().length}><div className="method-subrow-content quality-subrow-content">
                <button type="button" className="method-subrow-toggle" aria-expanded={!!methodExpanded[person.id]} onClick={()=>setMethodExpanded(current=>({...current,[person.id]:!current[person.id]}))}>{methodExpanded[person.id]?<ChevronDown size={16}/>:<ChevronRight size={16}/>}<ShieldCheck size={16}/><span>Качество прохождения</span></button>
                <span className={`quality-summary ${qualities[person.parentId!]?.overall.status ?? "unavailable"}`}>{qualities[person.parentId!]?<><strong>{percent(qualities[person.parentId!].overall.score)}</strong><span>{STATUS[qualities[person.parentId!].overall.status]}</span></>:"Не рассчитано"}</span>
              </div></td></tr>
              {methodExpanded[person.id] && <tr className="details-row quality-details-row"><td className="details-cell" colSpan={table.getVisibleLeafColumns().length}>{renderRespondentDetails({...person,id:person.parentId!},'__quality')}</td></tr>}
            </Fragment>;
            if (group) return <Fragment key={row.id}>
              <tr className="method-subrow"><td colSpan={table.getVisibleLeafColumns().length}>
                <div className="method-subrow-content">
                  <div className="method-title-actions"><button type="button" className="method-subrow-toggle" aria-expanded={!!methodExpanded[person.id]} onClick={() => setMethodExpanded(current=>({...current,[person.id]:!current[person.id]}))}>
                    {methodExpanded[person.id]?<ChevronDown size={16}/>:<ChevronRight size={16}/>}<span>{group.title}</span>
                  </button>{renderMethodHelp(group)}</div>
                  <span className="method-answer-count">{group.answers.length > 0 ? `${group.answers.length} ответов` : ""}</span>
                  <div className="method-subrow-result">{renderMethodResult(group)}</div>
                </div>
              </td></tr>
              {methodExpanded[person.id] && <tr className="details-row method-details-row"><td className="details-cell" colSpan={table.getVisibleLeafColumns().length}>{renderRespondentDetails({...person,id:person.parentId!},group.code)}</td></tr>}
            </Fragment>;
            return <Fragment key={row.id}>
              <tr className={`respondent-row${selected[person.id] ? ' is-selected' : ''}`}>{row.getVisibleCells().map(cell => <td data-column-id={cell.column.id} key={cell.id} style={columnStyle(cell.column)}>{flexRender(cell.column.columnDef.cell,cell.getContext())}</td>)}</tr>

            </Fragment>;
          })}
          {!respondents.length && <tr><td className="empty-state" colSpan={table.getVisibleLeafColumns().length}>Нет респондентов для отображения. Если применены фильтры, нажмите «Сбросить всё».</td></tr>}
          </tbody>
        </Table>
      </TableWrap>
      {showToolbarActions && <TrashToggle onClick={onToggleTrash}>
        <Trash2 size={13} /> {copy.trash}
        {deletedRespondents.length
          ? ` (${deletedRespondents.length})`
          : ""}{" "}
        {trashOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
      </TrashToggle>}
      {showToolbarActions && trashOpen && (
        <TrashBox>
          <div className="head">
            <span className="title">{copy.deletedTitle}</span>
            <Button
              disabled={readOnly || !selectedDeletedCount || updatingTrash} onClick={onRestore}
            >
              <ArchiveRestore size={15} /> {copy.restore}
            </Button>
          </div>
          {deletedRespondents.length ? (
            <div className="items">
              {deletedRespondents.map((person) => (
                <label className="item" key={person.id}>
                  <Checkbox

                    checked={Boolean(deletedSelected[person.id])}
                    onChange={(event) =>
                      onSelectDeleted(person.id, event.target.checked)
                    }
                  />
                  <b>{person.alias}</b>
                  <span className="meta">{person.answered} ответов</span>
                  <span className="meta">
                    {copy.deletedAt}{" "}
                    {person.deletedAt
                      ? new Date(person.deletedAt).toLocaleDateString("ru")
                      : ""}
                  </span>
                </label>
              ))}
            </div>
          ) : (
            <span className="pending">{copy.emptyTrash}</span>
          )}
        </TrashBox>
      )}
    </>
  );
}
