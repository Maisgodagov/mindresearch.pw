import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Bug, ClipboardList, ExternalLink, ShieldCheck, Users } from "lucide-react";
import { api, getCurrentUser } from "../api";
import { Button, Card, SkeletonScreen } from "../ui";
import { PlatformLayout } from "./Layout";

const Page = styled.div`
  h1 { margin: 0; color: #304a38; font: 500 clamp(34px, 5vw, 46px) var(--font-heading), serif; }
  .lead { color: #748178; margin: 7px 0 22px; }
  .tabs { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 18px; }
  .tabs button { display: inline-flex; align-items: center; gap: 7px; padding: 10px 13px; border: 1px solid #d4dfd2; border-radius: 11px; background: #fff; color: #5d7063; font-weight: 700; }
  .tabs button.active { border-color: #557660; background: #557660; color: #fff; }
  .count { display: inline-grid; place-items: center; min-width: 21px; height: 21px; padding: 0 6px; border-radius: 999px; background: rgba(255,255,255,.22); font-size: 10px; }
  .stack { display: grid; gap: 12px; }
  .item { padding: 21px; border-radius: 18px; }
  .top { display: flex; justify-content: space-between; gap: 14px; align-items: flex-start; }
  .meta { color: #839087; font-size: 11px; line-height: 1.5; }
  h2 { margin: 6px 0 9px; color: #3a5140; font-size: 20px; }
  p { color: #5f6e64; line-height: 1.55; }
  .badge { padding: 5px 8px; border-radius: 999px; background: #edf3ea; color: #56705e; font-size: 10px; font-weight: 750; white-space: nowrap; }
  textarea { width: 100%; min-height: 76px; padding: 10px; border: 1px solid #d5dfd3; border-radius: 10px; resize: vertical; }
  .actions { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px; }
  .actions button { min-height: 38px; padding: 8px 12px; border-radius: 10px; }
  .page-link { display: inline-flex; align-items: center; gap: 5px; color: #52705a; font-size: 12px; }
  .user-grid { display: grid; grid-template-columns: minmax(180px,1.4fr) repeat(4,minmax(90px,.6fr)) minmax(150px,.8fr); gap: 14px; align-items: center; }
  .user-grid + .user-grid { border-top: 1px solid #e7ece5; margin-top: 13px; padding-top: 13px; }
  .user-name b,.user-name span { display: block; }.user-name span { color: #849087; font-size: 11px; }
  .metric b,.metric span { display: block; }.metric span { color: #89948d; font-size: 10px; }
  .role { display: flex; gap: 6px; }.role select { min-width: 0; width: 100%; border: 1px solid #d4dfd2; border-radius: 9px; padding: 8px; background: #fff; }.role button { border: 0; border-radius: 9px; background: #e7efe4; color: #486451; font-weight: 700; }
  .empty { padding: 32px; text-align: center; color: #7a887e; }
  @media(max-width:850px){.user-grid{grid-template-columns:1fr 1fr}.user-name{grid-column:1/-1}.role{grid-column:1/-1}}
`;

type Tab = "methods" | "reports" | "users";
const statusLabel: Record<string,string> = { submitted:"Новая",reviewing:"В работе",approved:"Принята",rejected:"Отклонена",new:"Новое",in_progress:"В работе",resolved:"Решено",dismissed:"Отклонено" };
const categoryLabel: Record<string,string> = { bug:"Ошибка на сайте",methodology:"Ошибка в методике",other:"Другое" };

export function AdminCenter(){
  const[tab,setTab]=useState<Tab>("methods"),[methods,setMethods]=useState<any[]>([]),[reports,setReports]=useState<any[]>([]),[users,setUsers]=useState<any[]>([]),[loading,setLoading]=useState(true),[role,setRole]=useState("");
  const load=()=>Promise.all([api.get("/admin/instrument-submissions"),api.get("/admin/bug-reports"),api.get("/admin/users"),getCurrentUser()]).then(([m,r,u,me])=>{setMethods(m.data);setReports(r.data);setUsers(u.data);setRole(String(me.role))}).finally(()=>setLoading(false));
  useEffect(()=>{load().catch(()=>setLoading(false))},[]);
  const counts=useMemo(()=>({methods:methods.filter(x=>["submitted","reviewing"].includes(x.status)).length,reports:reports.filter(x=>["new","in_progress"].includes(x.status)).length,users:users.length}),[methods,reports,users]);
  const updateMethod=async(item:any,status:string)=>{await api.patch(`/admin/instrument-submissions/${item.id}`,{status,adminNote:item.adminNote??""});await load()};
  const updateReport=async(item:any,status:string)=>{await api.patch(`/admin/bug-reports/${item.id}`,{status,adminNote:item.adminNote??""});await load()};
  const updateRole=async(user:any)=>{await api.patch(`/admin/users/${user.id}/role`,{role:user.role});await load()};
  if(loading)return <PlatformLayout><SkeletonScreen variant="dashboard"/></PlatformLayout>;
  return <PlatformLayout><Page><h1>Админ-центр</h1><p className="lead">Заявки, сообщения пользователей и управление доступом.</p><div className="tabs"><button className={tab==="methods"?"active":""} onClick={()=>setTab("methods")}><ClipboardList size={16}/> Методики <span className="count">{counts.methods}</span></button><button className={tab==="reports"?"active":""} onClick={()=>setTab("reports")}><Bug size={16}/> Ошибки <span className="count">{counts.reports}</span></button><button className={tab==="users"?"active":""} onClick={()=>setTab("users")}><Users size={16}/> Пользователи <span className="count">{counts.users}</span></button></div>
  {tab==="methods"&&<div className="stack">{methods.length===0&&<Card className="empty">Заявок пока нет.</Card>}{methods.map(item=><Card className="item" key={item.id}><div className="top"><div><div className="meta">{item.submitterName} · {item.submitterEmail} · {new Date(item.createdAt).toLocaleDateString("ru-RU")}</div><h2>{item.title}</h2></div><span className="badge">{statusLabel[item.status]}</span></div><p><b>Автор:</b> {item.originalAuthor}<br/><b>Год:</b> {item.publicationYear??"не указан"}<br/><b>Русскоязычная адаптация:</b> {item.hasRussianAdaptation===null?"неизвестно":item.hasRussianAdaptation?"есть":"нет или не найдена"}</p><textarea value={item.adminNote??""} placeholder="Комментарий администратора" onChange={e=>setMethods(current=>current.map(x=>x.id===item.id?{...x,adminNote:e.target.value}:x))}/><div className="actions"><Button onClick={()=>updateMethod(item,"reviewing")}>В работу</Button><Button onClick={()=>updateMethod(item,"approved")}>Принять</Button><Button onClick={()=>updateMethod(item,"rejected")}>Отклонить</Button></div></Card>)}</div>}
  {tab==="reports"&&<div className="stack">{reports.length===0&&<Card className="empty">Сообщений пока нет.</Card>}{reports.map(item=><Card className="item" key={item.id}><div className="top"><div><div className="meta">{item.submitterName} · {item.submitterEmail} · {new Date(item.createdAt).toLocaleString("ru-RU")}</div><h2>{categoryLabel[item.category]}</h2></div><span className="badge">{statusLabel[item.status]}</span></div><p style={{whiteSpace:"pre-wrap"}}>{item.description}</p>{item.pageUrl&&<a className="page-link" href={item.pageUrl} target="_blank" rel="noreferrer"><ExternalLink size={13}/> Открыть страницу</a>}<textarea value={item.adminNote??""} placeholder="Комментарий администратора" onChange={e=>setReports(current=>current.map(x=>x.id===item.id?{...x,adminNote:e.target.value}:x))}/><div className="actions"><Button onClick={()=>updateReport(item,"in_progress")}>В работу</Button><Button onClick={()=>updateReport(item,"resolved")}>Решено</Button><Button onClick={()=>updateReport(item,"dismissed")}>Отклонить</Button></div></Card>)}</div>}
  {tab==="users"&&<Card className="item"><div className="user-grid meta"><span>Пользователь</span><span>Опросы</span><span>Активные</span><span>Ответы</span><span>Завершены</span><span>Роль</span></div>{users.map(user=><div className="user-grid" key={user.id}><div className="user-name"><b>{user.name}</b><span>{user.email} · с {new Date(user.createdAt).toLocaleDateString("ru-RU")}</span></div><div className="metric"><b>{user.surveyCount}</b><span>опросов</span></div><div className="metric"><b>{user.activeSurveyCount}</b><span>активных</span></div><div className="metric"><b>{user.responseCount}</b><span>ответов</span></div><div className="metric"><b>{user.completedCount}</b><span>завершено</span></div><div className="role">{user.role==="owner"?<span className="badge"><ShieldCheck size={11}/> Владелец</span>:<><select disabled={role!=="owner"} value={user.role} onChange={e=>setUsers(current=>current.map(x=>x.id===user.id?{...x,role:e.target.value}:x))}><option value="researcher">Исследователь</option><option value="admin">Администратор</option></select>{role==="owner"&&<button onClick={()=>updateRole(user)}>Сохранить</button>}</>}</div></div>)}</Card>}
  </Page></PlatformLayout>
}
