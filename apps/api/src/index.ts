import { loadSurveyResults, loadQuestionTimingSummary } from './survey-results.js';
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import bcrypt from 'bcryptjs';
import { randomBytes, randomUUID } from 'node:crypto';
import { z } from 'zod';
import { db, migrate } from './db.js';
import { clearRefreshCookie, createAuthSession, requireAuth, revokeAllUserSessions, revokeAuthSession, rotateAuthSession, type AuthRequest } from './auth.js';
import { calculateAmsForSession, calculateBfi2ForSession, calculateBfi2ShortForSession, calculateBriefCopeRuForSession, calculateConfiguredAssessmentsForSession, calculateCsesForSession, calculateDebqForSession, calculateGpsForSession, calculateGsesForSession, calculateIpipNeo120ForSession, calculateMiniIpipForSession, calculateMspssForSession, calculateNspsForSession, calculatePpsForSession, calculateRsesForSession, calculateSccsForSession, calculateShamForSession, calculateShoppForSession, calculateSspm2011ForSession, calculateStudyAlienationForSession, calculateTipiRuForSession } from './scoring/index.js';
import { methodologies } from './scoring/methodologies.js';
import {platformRouter} from './platform.js';
import { qualityRouter } from './quality/router.js';
import { enqueueQuality, resumeQualityJobs, storedQualities, qualityEnabled } from './quality/service.js';

if(!process.env.JWT_SECRET || process.env.JWT_SECRET.length<24) throw new Error('JWT_SECRET must contain at least 24 characters');
const app=express();
app.set('trust proxy',1);
app.use(helmet()); app.use(cors({origin:process.env.CLIENT_URL?.split(',')??true,credentials:true})); app.use(express.json({limit:'200kb'}));
app.use('/api/auth',(_req,res,next)=>{res.setHeader('Cache-Control','no-store');next()});
app.use('/api',platformRouter);
app.use('/api',qualityRouter);

app.get('/api/health',(_req,res)=>res.json({ok:true}));
app.get('/api/public/surveys/:slug',async(req,res,next)=>{try{
  const [surveys]=await db.query<any[]>(`SELECT s.id,s.slug,s.title,s.status,s.welcome_title AS welcomeTitle,s.welcome_text AS welcomeText,s.settings,IF(s.show_author AND u.is_profile_public,u.name,NULL) authorName,IF(s.show_author AND u.is_profile_public,u.public_slug,NULL) authorSlug,IF(s.show_author AND u.is_profile_public,u.avatar_seed,NULL) authorAvatarSeed FROM surveys s JOIN users u ON u.id=s.owner_id WHERE s.slug=? AND s.deleted_at IS NULL`,[req.params.slug]);
  if(!surveys.length) return res.status(404).json({message:'Опрос не найден'});
  if(surveys[0].status==='archived')return res.status(410).json({code:'survey_archived',message:'Это исследование уже завершено'});
  if(surveys[0].status!=='active')return res.status(404).json({message:'Опрос не найден'});
  const [questions]=await db.query<any[]>(`SELECT q.id,q.code,q.text,q.type,q.required,q.options,q.validation,s.code sectionCode,s.title sectionTitle,s.position sectionPosition,q.position FROM questions q JOIN sections s ON s.id=q.section_id WHERE s.survey_id=? ORDER BY s.position,q.position`,[surveys[0].id]);
  const survey=surveys[0],author=survey.authorSlug?{name:survey.authorName,slug:survey.authorSlug,avatarSeed:survey.authorAvatarSeed}:null;delete survey.authorName;delete survey.authorSlug;delete survey.authorAvatarSeed;res.json({...survey,author,questions:questions.map(q=>{const validation=typeof q.validation==='string'?JSON.parse(q.validation):q.validation;const {expectedValue,qualityType,excludeFromQuality,...publicValidation}=validation??{};return{...q,validation:publicValidation}})});
}catch(e){next(e)}});
app.post('/api/public/surveys/:slug/sessions',async(req,res,next)=>{try{
  const [rows]=await db.query<any[]>('SELECT id FROM surveys WHERE slug=? AND status=\'active\'',[req.params.slug]); if(!rows.length)return res.status(404).json({message:'Опрос не найден'});
  const id=randomUUID(),token=randomBytes(32).toString('hex'); await db.execute('INSERT INTO response_sessions (id,survey_id,public_token,user_agent) VALUES (?,?,?,?)',[id,rows[0].id,token,req.get('user-agent')?.slice(0,500)]); res.status(201).json({sessionId:id,token});
}catch(e){next(e)}});
app.get('/api/public/sessions/:token',async(req,res,next)=>{try{
  const [sessions]=await db.query<any[]>('SELECT id,status,current_position AS currentPosition FROM response_sessions WHERE public_token=?',[req.params.token]);
  if(!sessions.length)return res.status(404).json({message:'Сессия не найдена'});
  const [answers]=await db.query<any[]>('SELECT question_id AS questionId,value FROM answers WHERE session_id=?',[sessions[0].id]);
  res.json({...sessions[0],answers});
}catch(e){next(e)}});
const answerSchema=z.object({questionId:z.string().uuid(),value:z.union([z.string(),z.number(),z.array(z.string())]),position:z.number().int().min(0),timing:z.object({visitId:z.string().uuid(),activeMs:z.number().int().min(0).max(86400000),visitSequence:z.number().int().min(0).max(1000000).optional()}).optional()});
app.put('/api/public/sessions/:token/answers',async(req,res,next)=>{try{
  const body=answerSchema.parse(req.body); const [sessions]=await db.query<any[]>('SELECT id,survey_id,status FROM response_sessions WHERE public_token=?',[req.params.token]);
  if(!sessions.length)return res.status(404).json({message:'Сессия не найдена'}); if(sessions[0].status==='completed')return res.status(409).json({message:'Опрос уже завершён'});
  const [questions]=await db.query<any[]>(`SELECT q.id,s.code sectionCode FROM questions q JOIN sections s ON s.id=q.section_id WHERE q.id=? AND s.survey_id=?`,[body.questionId,sessions[0].survey_id]); if(!questions.length)return res.status(400).json({message:'Некорректный вопрос'});
  await db.execute(`INSERT INTO answers (session_id,question_id,value) VALUES (?,?,?) ON DUPLICATE KEY UPDATE value=VALUES(value),answered_at=CURRENT_TIMESTAMP`,[sessions[0].id,body.questionId,JSON.stringify(body.value)]);
  if(body.timing){await db.execute(`INSERT INTO question_timings (session_id,question_id,visit_id,active_ms,visit_sequence,recorded_at) VALUES (?,?,?,?,?,CURRENT_TIMESTAMP) ON DUPLICATE KEY UPDATE active_ms=GREATEST(active_ms,VALUES(active_ms)),visit_sequence=COALESCE(visit_sequence,VALUES(visit_sequence))`,[sessions[0].id,body.questionId,body.timing.visitId,body.timing.activeMs,body.timing.visitSequence??null]);await db.execute(`INSERT INTO quality_metadata(session_id,telemetry_version) VALUES (?,?) ON DUPLICATE KEY UPDATE telemetry_version=VALUES(telemetry_version)`,[sessions[0].id,body.timing.visitSequence===undefined?'visible-time-v1':'visible-time-v2-sequence']);}
  await db.execute('UPDATE response_sessions SET current_position=?,last_activity_at=CURRENT_TIMESTAMP WHERE id=?',[body.position,sessions[0].id]);
  if(questions[0].sectionCode==='test_1')await calculateMspssForSession(sessions[0].id);
  if(questions[0].sectionCode==='test_2')await calculateSspm2011ForSession(sessions[0].id);
  if(questions[0].sectionCode==='test_3')await calculateSccsForSession(sessions[0].id);
  if(questions[0].sectionCode==='test_4')await calculateNspsForSession(sessions[0].id);
  if(questions[0].sectionCode==='test_5')await calculateShoppForSession(sessions[0].id);
  if(questions[0].sectionCode==='test_6')await calculateDebqForSession(sessions[0].id);
  if(questions[0].sectionCode==='test_7')await calculateShamForSession(sessions[0].id);
  if(questions[0].sectionCode==='test_8')await calculateAmsForSession(sessions[0].id);
  if(questions[0].sectionCode==='test_9')await calculateStudyAlienationForSession(sessions[0].id);
  if(questions[0].sectionCode==='test_10')await calculateGpsForSession(sessions[0].id);
  if(questions[0].sectionCode==='test_11')await calculatePpsForSession(sessions[0].id);
  if(questions[0].sectionCode==='test_12')await calculateBfi2ForSession(sessions[0].id);
  if(questions[0].sectionCode==='test_13')await calculateBfi2ShortForSession(sessions[0].id);
  if(questions[0].sectionCode==='test_14')await calculateTipiRuForSession(sessions[0].id);
  if(questions[0].sectionCode==='test_15')await calculateIpipNeo120ForSession(sessions[0].id);
  if(questions[0].sectionCode==='test_16')await calculateMiniIpipForSession(sessions[0].id);
  if(questions[0].sectionCode==='test_17')await calculateRsesForSession(sessions[0].id);
  if(questions[0].sectionCode==='test_18')await calculateCsesForSession(sessions[0].id);
  if(questions[0].sectionCode==='test_19')await calculateGsesForSession(sessions[0].id);
  if(questions[0].sectionCode==='test_20')await calculateBriefCopeRuForSession(sessions[0].id);
  res.status(204).end();
}catch(e){next(e)}});
app.post('/api/public/sessions/:token/complete',async(req,res,next)=>{try{
  const[sessions]=await db.query<any[]>('SELECT id,status FROM response_sessions WHERE public_token=?',[req.params.token]);if(!sessions.length)return res.status(404).json({message:'Сессия не найдена'});
  const[missing]=await db.query<any[]>(`SELECT COUNT(*) count FROM questions q JOIN sections s ON s.id=q.section_id JOIN response_sessions rs ON rs.survey_id=s.survey_id LEFT JOIN answers a ON a.question_id=q.id AND a.session_id=rs.id WHERE rs.id=? AND q.required=TRUE AND a.id IS NULL`,[sessions[0].id]);
  if(Number(missing[0].count)>0)return res.status(409).json({message:'Сначала ответьте на все обязательные вопросы',missing:Number(missing[0].count)});
  const[r]=await db.execute<any>(`UPDATE response_sessions SET status='completed',completed_at=CURRENT_TIMESTAMP WHERE id=? AND status='in_progress'`,[sessions[0].id]);if(!r.affectedRows)return res.status(409).json({message:'Опрос уже завершён'});void db.query<any[]>('SELECT survey_id surveyId FROM response_sessions WHERE id=?',[sessions[0].id]).then(([rows])=>enqueueQuality(rows[0].surveyId,'recompute',{sessionId:sessions[0].id})).catch(error=>console.error('Quality V2 scheduling failed',error instanceof Error?error.message:String(error)));res.status(204).end();
}catch(e){next(e)}});
app.get('/api/public/sessions/:token/results',async(req,res,next)=>{try{
  const[sessions]=await db.query<any[]>('SELECT rs.id,rs.status,s.settings FROM response_sessions rs JOIN surveys s ON s.id=rs.survey_id WHERE rs.public_token=?',[req.params.token]);
  if(!sessions.length)return res.status(404).json({message:'Сессия не найдена'});
  if(sessions[0].status!=='completed')return res.status(409).json({message:'Результаты доступны после завершения опроса'});
  await calculateConfiguredAssessmentsForSession(sessions[0].id);
  const[rows]=await db.query<any[]>(`SELECT s.code,s.title,ar.formula_version formulaVersion,ar.result FROM assessment_results ar JOIN sections s ON s.id=ar.section_id WHERE ar.session_id=? ORDER BY s.position`,[sessions[0].id]);
  const parse=(value:unknown)=>typeof value==='string'?JSON.parse(value):value;
  const settings=parse(sessions[0].settings)??{},presentation=settings.resultPresentation??{showResults:true,title:'Спасибо за ваши ответы',text:'',showScores:true};
  const results=presentation.showResults!==false&&presentation.showScores!==false?rows.map(row=>({code:row.code,title:row.title,formulaVersion:row.formulaVersion,values:parse(row.result)})):[];
  const[configuredRows]=await db.query<any[]>(`SELECT DISTINCT s.code,s.title,i.methodology FROM assessment_results ar JOIN sections s ON s.id=ar.section_id JOIN instruments i ON i.id=s.source_instrument_id WHERE ar.session_id=? AND i.methodology IS NOT NULL`,[sessions[0].id]);
  const configuredMethodologies=configuredRows.map(row=>{const metadata=parse(row.methodology)??{};return {...(methodologies[row.code]??{}),...metadata,code:row.code,title:row.title}});
  const sourceEntries:[string,any][]=[...rows.map((row:any):[string,any]=>[row.code,methodologies[row.code]]),...configuredMethodologies.map((item:any):[string,any]=>[item.code,item])];
  const usedMethodologies=Array.from(new Map<string,any>(sourceEntries).values()).filter(Boolean);
  const sourceGroups=usedMethodologies.map((methodology:any)=>({
    code:methodology.code,
    title:methodology.title,
    sources:Array.from(new Map(methodology.sources.map((source:any)=>[source.url,source])).values())
  })).filter(group=>group.sources.length>0);
  res.json({results,presentation,sourceGroups});
}catch(e){next(e)}});

app.post('/api/auth/login',async(req,res,next)=>{try{const body=z.object({email:z.string().email(),password:z.string().min(1)}).parse(req.body);const [rows]=await db.query<any[]>('SELECT id,email,name,role,password_hash FROM users WHERE email=?',[body.email.toLowerCase()]);if(!rows.length||!await bcrypt.compare(body.password,rows[0].password_hash))return res.status(401).json({message:'Неверная почта или пароль'});const {password_hash,...user}=rows[0],token=await createAuthSession(req,res,{id:user.id,role:user.role});res.json({token,user})}catch(e){next(e)}});
app.post('/api/auth/refresh',async(req,res,next)=>{try{const token=await rotateAuthSession(req,res);if(!token)return res.status(401).json({message:'Сессия истекла'});res.json({token})}catch(e){next(e)}});
app.post('/api/auth/logout',async(req,res,next)=>{try{await revokeAuthSession(req,res);res.status(204).end()}catch(e){next(e)}});
app.post('/api/auth/logout-all',requireAuth,async(req:AuthRequest,res,next)=>{try{await revokeAllUserSessions(req.user!.id);clearRefreshCookie(res);res.status(204).end()}catch(e){next(e)}});
app.get('/api/admin/surveys',requireAuth,async(req:AuthRequest,res,next)=>{try{const [rows]=await db.query<any[]>(`SELECT s.id,s.slug,s.title,s.description,s.status,s.created_at createdAt,s.updated_at updatedAt,s.builder_state IS NOT NULL hasBuilderState,COUNT(rs.id) responses,COALESCE(SUM(rs.status='completed'),0) completed FROM surveys s LEFT JOIN response_sessions rs ON rs.survey_id=s.id AND rs.deleted_at IS NULL WHERE s.owner_id=? AND s.deleted_at IS NULL GROUP BY s.id ORDER BY s.created_at DESC`,[req.user!.id]);res.json(rows)}catch(e){next(e)}});
app.get('/api/admin/methodologies',requireAuth,async(req,res,next)=>{try{
const codes=req.query.codes===undefined?undefined:z.array(z.string().min(1).max(120)).max(1000).parse(String(req.query.codes).split(',').filter(Boolean));
if(codes?.length===0)return res.json({});
const restriction=codes?` AND code IN (${codes.map(()=>'?').join(',')})`:'';
const[rows]=await db.query<any[]>(`SELECT code,title,description,methodology FROM instruments WHERE is_verified=TRUE AND status='active' AND methodology IS NOT NULL${restriction}`,codes??[]);const configured:Record<string,any>={};for(const row of rows){const metadata=typeof row.methodology==='string'?JSON.parse(row.methodology):row.methodology;configured[row.code]={...(methodologies[row.code]??{}),...metadata,code:row.code,title:row.title,summary:row.description??metadata?.summary??methodologies[row.code]?.summary}}res.json({...Object.fromEntries(Object.entries(methodologies).filter(([code])=>!codes||codes.includes(code))),...configured})}catch(e){next(e)}});
app.get('/api/admin/surveys/:id/results',requireAuth,async(req:AuthRequest,res,next)=>{try{
  const [allowed]=await db.query<any[]>('SELECT id FROM surveys WHERE id=? AND owner_id=?',[req.params.id,req.user!.id]);if(!allowed.length)return res.status(404).json({message:'Опрос не найден'});
  res.json(await loadSurveyResults(String(req.params.id),{summary:req.query.summary==='1'}));
}catch(e){next(e)}});
app.get('/api/admin/surveys/:id/results/timing',requireAuth,async(req:AuthRequest,res,next)=>{try{
  const[allowed]=await db.query<any[]>('SELECT id FROM surveys WHERE id=? AND owner_id=?',[req.params.id,req.user!.id]);
  if(!allowed.length)return res.status(404).json({message:'Survey not found'});
  res.json(await loadQuestionTimingSummary(String(req.params.id)));
}catch(e){next(e)}});
app.post('/api/admin/surveys/:id/results/details',requireAuth,async(req:AuthRequest,res,next)=>{try{
  const[allowed]=await db.query<any[]>('SELECT id FROM surveys WHERE id=? AND owner_id=?',[req.params.id,req.user!.id]);
  if(!allowed.length)return res.status(404).json({message:'Survey not found'});
  const {sessionIds}=z.object({sessionIds:z.array(z.string().uuid()).min(1).max(100)}).parse(req.body);
  const results=await loadSurveyResults(String(req.params.id),{sessionIds});
  res.json([...results.respondents,...results.deletedRespondents]);
}catch(e){next(e)}});
const sessionIdsSchema=z.object({sessionIds:z.array(z.string().uuid()).min(1).max(1000)});
app.post('/api/admin/surveys/:id/results/trash',requireAuth,async(req:AuthRequest,res,next)=>{try{
  const {sessionIds}=sessionIdsSchema.parse(req.body),placeholders=sessionIds.map(()=>'?').join(',');
  const[result]=await db.execute<any>(`UPDATE response_sessions rs JOIN surveys s ON s.id=rs.survey_id SET rs.deleted_at=CURRENT_TIMESTAMP WHERE rs.survey_id=? AND s.owner_id=? AND rs.id IN (${placeholders}) AND rs.deleted_at IS NULL`,[req.params.id,req.user!.id,...sessionIds]);
  res.json({updated:result.affectedRows});
}catch(e){next(e)}});
app.post('/api/admin/surveys/:id/results/restore',requireAuth,async(req:AuthRequest,res,next)=>{try{
  const {sessionIds}=sessionIdsSchema.parse(req.body),placeholders=sessionIds.map(()=>'?').join(',');
  const[result]=await db.execute<any>(`UPDATE response_sessions rs JOIN surveys s ON s.id=rs.survey_id SET rs.deleted_at=NULL WHERE rs.survey_id=? AND s.owner_id=? AND rs.id IN (${placeholders}) AND rs.deleted_at IS NOT NULL`,[req.params.id,req.user!.id,...sessionIds]);
  res.json({updated:result.affectedRows});
}catch(e){next(e)}});
app.get('/api/admin/sessions/:id',requireAuth,async(req:AuthRequest,res,next)=>{try{const [rows]=await db.query<any[]>(`SELECT q.code,q.text,q.options,a.value,a.answered_at AS answeredAt,s.title sectionTitle FROM answers a JOIN questions q ON q.id=a.question_id JOIN sections s ON s.id=q.section_id JOIN surveys sv ON sv.id=s.survey_id WHERE a.session_id=? AND sv.owner_id=? ORDER BY s.position,q.position`,[req.params.id,req.user!.id]);res.json(rows)}catch(e){next(e)}});
app.use((err:any,_req:express.Request,res:express.Response,_next:express.NextFunction)=>{console.error(err);if(err instanceof z.ZodError)return res.status(400).json({message:'Некорректные данные',issues:err.issues});res.status(500).json({message:'Внутренняя ошибка сервера'})});
const port=Number(process.env.PORT??4000); migrate().then(()=>{void resumeQualityJobs();return app.listen(port,()=>console.log(`API http://localhost:${port}`))}).catch(e=>{console.error(e);process.exit(1)});
