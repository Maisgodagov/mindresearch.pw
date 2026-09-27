import{useEffect,useState,type ReactNode}from'react';
import{Navigate,useLocation}from'react-router-dom';
import{initializeAuth}from'../api';
import{Page,Shell,SkeletonScreen}from'../ui';
export function AuthGuard({children,loginPath='/login'}:{children:ReactNode;loginPath?:string}){const[state,setState]=useState<'loading'|'allowed'|'denied'>('loading'),location=useLocation();useEffect(()=>{let active=true;initializeAuth().then(token=>{if(active)setState(token?'allowed':'denied')});const ended=()=>setState('denied');window.addEventListener('mindresearch:session-ended',ended);return()=>{active=false;window.removeEventListener('mindresearch:session-ended',ended)}},[]);if(state==='loading')return <Page><Shell style={{padding:'8vh 0'}}><SkeletonScreen variant="public"/></Shell></Page>;if(state==='denied')return <Navigate to={loginPath} replace state={{from:location.pathname}}/>;return children}
