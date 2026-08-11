import React from 'react';import{createRoot}from'react-dom/client';import{BrowserRouter,Routes,Route,Navigate}from'react-router-dom';
import{GlobalStyle}from'./styles';import{SurveyPage}from'./survey/SurveyPage';import{Login}from'./admin/Login';import{Dashboard}from'./admin/Dashboard';
function App(){return <><GlobalStyle/><Routes><Route path="/s/:slug" element={<SurveyPage/>}/><Route path="/admin/login" element={<Login/>}/><Route path="/admin" element={<Dashboard/>}/><Route path="*" element={<Navigate to="/s/anketa" replace/>}/></Routes></>};
createRoot(document.getElementById('root')!).render(<React.StrictMode><BrowserRouter><App/></BrowserRouter></React.StrictMode>);
