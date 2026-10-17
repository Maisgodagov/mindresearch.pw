import { useEffect, useState } from 'react';
import { Modal, Button, Input, Select, message, Spin } from 'antd';
import { Link, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { api, getCurrentUser } from '../api';
import { getApiErrorMessage } from '../utils/apiErrors';
import { BuilderPreview } from './BuilderPreview';

const Surface=styled.div`
  color:var(--color-ink); line-height:1.6;
  .sharing-note { color:var(--color-muted); margin:0 0 20px; }
  .sharing-fields { display:grid; gap:14px; }
  label { display:grid; gap:6px; font-size:14px; }
  .sharing-row { display:flex; align-items:center; justify-content:space-between; gap:12px; padding:14px 0; border-bottom:1px solid var(--color-border); }
  .sharing-row > div { min-width:0; overflow-wrap:anywhere; }
  .sharing-controls { display:flex; gap:6px; flex-wrap:wrap; flex-shrink:0; }
  h3 { font-size:16px; margin:24px 0 4px; }
  small { display:block; color:var(--color-muted); }
  .sharing-link { display:grid; gap:8px; padding:14px; background:var(--color-page); border-radius:12px; margin-top:16px; }
  .sharing-error { color:#a25c55; }
  @media(max-width:550px){.sharing-row { align-items:flex-start; flex-direction:column; }.sharing-controls{width:100%;}}
`;
const permissionOptions=[{value:'view',label:'Только просмотр'},{value:'edit',label:'Просмотр и редактирование'}];
export function SurveySharing({surveyId,onClose}:{surveyId:string;onClose:()=>void}){
  const [data,setData]=useState<any>(null),[recipient,setRecipient]=useState(''),[permission,setPermission]=useState('view'),[link,setLink]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState('');
  const [linkRecipient,setLinkRecipient]=useState('');
  const load=async()=>{try{setData((await api.get(`/sharing/surveys/${surveyId}`)).data);}catch(e){setError(getApiErrorMessage(e,'Не удалось загрузить доступ'));}};
  useEffect(()=>{void load();},[surveyId]);
  async function action(fn:()=>Promise<unknown>){setBusy(true);setError('');try{await fn();await load();}catch(e){setError(getApiErrorMessage(e,'Не удалось изменить доступ'));}finally{setBusy(false);}}
  return <Modal open title="Совместный доступ" onCancel={onClose} footer={null} width={620}><Surface>
    <p className="sharing-note">Пригласите коллегу к опросу и его результатам. Управлять доступом и удалять опрос можете только вы.</p>
    <div className="sharing-fields">
      <label>Кого пригласить<Input value={recipient} onChange={e=>setRecipient(e.target.value)} placeholder="Почта или @имя пользователя" maxLength={255}/><small>Оставьте пустым, чтобы создать приглашение по ссылке.</small></label>
      <label>Права<Select value={permission} onChange={setPermission} options={permissionOptions}/></label>
      <small>{permission==='view'?'Просмотр опроса, ответов, статистики и экспорт.':'Редактирование опроса, работа с ответами и показателями качества. Чужие ответы нельзя изменить.'}</small>
      <Button type="primary" loading={busy} onClick={()=>void action(async()=>{const r=await api.post(`/sharing/surveys/${surveyId}/invitations`,{permission,...(recipient.trim()?{recipient:recipient.trim()}: {})});setLinkRecipient(recipient.trim());setLink(location.origin+r.data.path);})}>Создать приглашение</Button>
    </div>
    {link&&<div className="sharing-link" data-analytics-private><strong>Отправьте ссылку коллеге</strong><Input aria-label="Ссылка приглашения" readOnly value={link}/><small>Действует 7 дней, для одного аккаунта. {linkRecipient?'Доступна только указанному пользователю.':'Любой вошедший пользователь с этой ссылкой сможет принять приглашение.'}</small><Button onClick={async()=>{try{await navigator.clipboard.writeText(link);message.success('Ссылка скопирована');}catch{setError('Скопируйте ссылку из поля вручную');}}}>Скопировать ссылку</Button></div>}
    {error&&<p className="sharing-error" role="alert">{error}</p>}
    {!data?(error?<Button onClick={()=>{setError('');void load();}}>Повторить загрузку</Button>:<Spin/>):<>
      <h3>Кто имеет доступ</h3>{data.members.length?data.members.map((m:any)=><div className="sharing-row" key={m.id}><div><strong>{m.name}</strong><small>@{m.username}</small></div><div className="sharing-controls"><Select aria-label={`Права: ${m.name}`} value={m.permission} disabled={busy} options={permissionOptions} onChange={value=>void action(()=>api.patch(`/sharing/surveys/${surveyId}/members/${m.id}`,{permission:value}))}/><Button danger disabled={busy} onClick={()=>void action(()=>api.delete(`/sharing/surveys/${surveyId}/members/${m.id}`))}>Отозвать</Button></div></div>):<p className="sharing-note">Пока доступ есть только у вас.</p>}
      <h3>Приглашения</h3>{data.invitations.filter((i:any)=>!i.revokedAt&&!i.acceptedAt&&new Date(i.expiresAt).getTime()>Date.now()).map((i:any)=><div className="sharing-row" key={i.id}><div>{i.targetName??'По ссылке'}<small>{i.permission==='edit'?'Редактирование':'Просмотр'} · до {new Date(i.expiresAt).toLocaleDateString('ru-RU')}</small></div><Button disabled={busy} onClick={()=>void action(async()=>{await api.delete(`/sharing/surveys/${surveyId}/invitations/${i.id}`);setLink('');})}>Отменить</Button></div>)}
    </>}
  </Surface></Modal>;
}
export const invitationReturn=()=>{const next=new URLSearchParams(location.search).get('next');return next&&/^\/invite\/[A-Za-z0-9_-]{43}$/.test(next)?next:null;};
export function SharedSurveyPreview(){const {surveyId}=useParams(),nav=useNavigate();const [data,setData]=useState<any>(null),[error,setError]=useState('');useEffect(()=>{let active=true;api.get(`/sharing/surveys/${surveyId}/preview`).then(r=>{if(active)setData(r.data);}).catch(e=>{if(active)setError(getApiErrorMessage(e,'Не удалось открыть опрос'));});return()=>{active=false;};},[surveyId]);if(data)return <BuilderPreview meta={data.meta} questions={data.questions} closeLabel="Вернуться к результатам" onClose={()=>nav(`/app/surveys/${surveyId}/results`)}/>;return <Surface style={{padding:24}}>{error?<p role="alert">{error}</p>:<Spin/>}</Surface>;}
export function SurveyInvitation(){const {token}=useParams(),nav=useNavigate();const [needsLogin,setNeedsLogin]=useState(false),[error,setError]=useState('');
  useEffect(()=>{let active=true;async function accept(){try{await getCurrentUser();}catch{if(active)setNeedsLogin(true);return;}try{const r=await api.post(`/sharing/invitations/${token}/accept`);if(active)nav(`/app/surveys/${r.data.surveyId}/results`,{replace:true});}catch(e:any){if(active){if(e.response?.status===401)setNeedsLogin(true);else setError(getApiErrorMessage(e,'Не удалось принять приглашение'));}}}void accept();return()=>{active=false;};},[token,nav]);
  const next=encodeURIComponent(`/invite/${token}`);return <Surface style={{maxWidth:520,margin:'80px auto',padding:24}}><h1>Приглашение к опросу</h1>{error?<><p role="alert">{error}</p><Link to="/app">Мои опросы</Link></>:needsLogin?<><p>Войдите или зарегистрируйтесь, чтобы получить доступ к опросу и его результатам. После входа мы откроем результаты.</p><div className="sharing-controls"><Link to={`/login?next=${next}`}><Button type="primary">Войти</Button></Link><Link to={`/register?next=${next}`}><Button>Зарегистрироваться</Button></Link></div></>:<p><Spin/> Открываем результаты…</p>}</Surface>;
}
