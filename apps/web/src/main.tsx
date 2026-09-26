import React from 'react';
import{createRoot}from'react-dom/client';
import{BrowserRouter,Routes,Route,Navigate}from'react-router-dom';
import{GlobalStyle}from'./styles';
import{SurveyPage}from'./survey/SurveyPage';
import{Login}from'./admin/Login';
import{Dashboard}from'./admin/Dashboard';
import{LegacyLogin}from'./admin/LegacyLogin';
import{Register}from'./platform/Register';
import{PlatformHome}from'./platform/Home';
import{SurveyBuilder}from'./platform/Builder';
import{ProfilePage}from'./platform/Profile';
import{PublicProfile}from'./platform/PublicProfile';
import{SuggestInstrument}from'./platform/SuggestInstrument';
import{ReviewInstruments}from'./platform/ReviewInstruments';
import{AuthGuard}from'./platform/AuthGuard';
import{PlatformLayout}from'./platform/Layout';

const protectedPage=(page:React.ReactNode)=><AuthGuard>{page}</AuthGuard>;
function App(){return <><GlobalStyle/><Routes>
  <Route path="/" element={<Navigate to="/register" replace/>}/>
  <Route path="/s/:slug" element={<SurveyPage/>}/><Route path="/p/:slug" element={<PublicProfile/>}/>
  <Route path="/login" element={<Login/>}/><Route path="/register" element={<Register/>}/>
  <Route path="/app" element={protectedPage(<PlatformHome/>)}/>
  <Route path="/app/profile" element={protectedPage(<ProfilePage/>)}/>
  <Route path="/app/methodologies/suggest" element={protectedPage(<SuggestInstrument/>)}/>
  <Route path="/app/methodologies/review" element={protectedPage(<ReviewInstruments/>)}/>
  <Route path="/app/surveys/new" element={protectedPage(<SurveyBuilder/>)}/>
  <Route path="/app/surveys/:surveyId/edit" element={protectedPage(<SurveyBuilder/>)}/>
  <Route path="/app/surveys/:surveyId/results" element={protectedPage(<PlatformLayout><Dashboard embedded/></PlatformLayout>)}/>
  <Route path="/admin/login" element={<LegacyLogin/>}/><Route path="/admin" element={<AuthGuard loginPath="/admin/login"><Dashboard/></AuthGuard>}/>
  <Route path="*" element={<Navigate to="/register" replace/>}/>
</Routes></>}
createRoot(document.getElementById('root')!).render(<React.StrictMode><BrowserRouter><App/></BrowserRouter></React.StrictMode>);
