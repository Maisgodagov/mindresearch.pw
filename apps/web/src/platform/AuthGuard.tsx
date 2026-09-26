import{useEffect,useState,type ReactNode}from'react';
import{Navigate,useLocation}from'react-router-dom';
import styled from'styled-components';
import{initializeAuth}from'../api';
const Loading=styled.div`min-height:100vh;display:grid;place-items:center;color:#58735f;background:#f5f8f2;font-size:14px`;
export function AuthGuard({children,loginPath='/login'}:{children:ReactNode;loginPath?:string}){const[state,setState]=useState<'loading'|'allowed'|'denied'>('loading'),location=useLocation();useEffect(()=>{let active=true;initializeAuth().then(token=>{if(active)setState(token?'allowed':'denied')});const ended=()=>setState('denied');window.addEventListener('mindresearch:session-ended',ended);return()=>{active=false;window.removeEventListener('mindresearch:session-ended',ended)}},[]);if(state==='loading')return <Loading>Проверяем сессию…</Loading>;if(state==='denied')return <Navigate to={loginPath} replace state={{from:location.pathname}}/>;return children}
