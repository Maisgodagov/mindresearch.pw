import{useEffect,useState,type ReactNode}from'react';
import{NavLink,useNavigate}from'react-router-dom';
import styled from'styled-components';
import{ClipboardList,Leaf,LogOut,PanelLeftClose,PanelLeftOpen,Plus,Send,ShieldCheck,UserRound}from'lucide-react';
import{getCachedCurrentUser,getCurrentUser,logout}from'../api';

const Frame=styled.div<{$collapsed:boolean}>`min-height:100dvh;background:#f3f6f0;display:grid;grid-template-columns:${p=>p.$collapsed?'76px':'240px'} minmax(0,1fr);transition:grid-template-columns .22s ease;@media(max-width:760px){grid-template-columns:1fr;padding-bottom:74px}`;
const Side=styled.aside<{$collapsed:boolean}>`
  padding:24px ${p=>p.$collapsed?'10px':'18px'};border-right:1px solid #dfe7dc;background:rgba(250,252,248,.94);position:sticky;top:0;height:100dvh;transition:padding .22s ease;
  .top{display:flex;flex-direction:${p=>p.$collapsed?'column':'row'};align-items:center;justify-content:space-between;gap:10px;margin-bottom:24px;min-height:${p=>p.$collapsed?'72px':'36px'}}
  .brand{display:flex;align-items:center;justify-content:${p=>p.$collapsed?'center':'flex-start'};gap:9px;color:#3e5e48;font-weight:800;min-width:0;padding:${p=>p.$collapsed?'0':'0 8px'}}
  .brand svg{flex:none}.brand span{display:${p=>p.$collapsed?'none':'block'};white-space:nowrap;overflow:hidden}
  .toggle{border:0;background:#e8efe5;color:#55705d;width:30px;height:30px;display:grid;place-items:center;border-radius:9px;cursor:pointer;flex:none;padding:0}
  .nav{display:grid;gap:5px}
  a,.logout{border:0;text-decoration:none;background:transparent;color:#68766c;display:flex;align-items:center;justify-content:${p=>p.$collapsed?'center':'flex-start'};gap:10px;padding:12px;border-radius:12px;font-weight:650;font-size:14px;white-space:nowrap;cursor:pointer}
  a svg,.logout svg{flex:none}a span,.logout span{display:${p=>p.$collapsed?'none':'inline'}}
  a.active,a:hover,.logout:hover{background:#e6eee3;color:#3d5c46}
  .logout{position:absolute;bottom:22px;left:${p=>p.$collapsed?'10px':'18px'};right:${p=>p.$collapsed?'10px':'18px'};width:auto}
  @media(max-width:760px){position:fixed;z-index:10;top:auto;bottom:0;width:100%;height:68px;border-right:0;border-top:1px solid #dfe7dc;padding:8px;.top,.logout{display:none}.nav{display:grid;grid-template-columns:repeat(auto-fit,minmax(55px,1fr))}a{justify-content:center;flex-direction:column;gap:2px;padding:5px;font-size:10px}a span{display:inline}}
`;
const Main=styled.main`width:min(100% - 36px,1180px);margin:0 auto;padding:34px 0 70px;`;
const links=[
  {to:'/app',end:true,label:'Мои опросы',icon:ClipboardList},
  {to:'/app/surveys/new',label:'Создать',icon:Plus},
  {to:'/app/methodologies/suggest',label:'Запросить методику',icon:Send},
  {to:'/app/profile',label:'Профиль',icon:UserRound},
];

export function PlatformLayout({children}:{children:ReactNode}){
  const nav=useNavigate(),cached=getCachedCurrentUser();
  const[role,setRole]=useState(cached?.role??'');
  const[collapsed,setCollapsed]=useState(()=>localStorage.getItem('mindresearch_sidebar_collapsed')==='1');
  useEffect(()=>{if(!cached)getCurrentUser().then(user=>setRole(String(user.role??''))).catch(()=>{})},[]);
  const toggle=()=>setCollapsed(value=>{const next=!value;localStorage.setItem('mindresearch_sidebar_collapsed',next?'1':'0');return next});
  const visibleLinks=['owner','admin'].includes(role)?[...links.slice(0,3),{to:'/app/methodologies/review',label:'Заявки на методики',icon:ShieldCheck},links[3]]:links;
  return <Frame $collapsed={collapsed}><Side $collapsed={collapsed}>
    <div className="top"><div className="brand"><Leaf size={24}/><span>mindresearch</span></div><button className="toggle" type="button" aria-label={collapsed?'Развернуть боковое меню':'Свернуть боковое меню'} title={collapsed?'Развернуть боковое меню':'Свернуть боковое меню'} onClick={toggle}>{collapsed?<PanelLeftOpen size={18}/>:<PanelLeftClose size={18}/>}</button></div>
    <div className="nav">{visibleLinks.map(({to,end,label,icon:Icon})=><NavLink to={to} end={end} aria-label={label} title={collapsed?label:undefined} key={to}><Icon size={18}/><span>{label}</span></NavLink>)}</div>
    <button className="logout" title={collapsed?'Выйти':undefined} aria-label="Выйти" onClick={async()=>{await logout();nav('/login')}}><LogOut size={17}/><span>Выйти</span></button>
  </Side><Main>{children}</Main></Frame>;
}
