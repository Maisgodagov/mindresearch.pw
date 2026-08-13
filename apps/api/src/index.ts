import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import bcrypt from 'bcryptjs';
import { randomBytes, randomUUID } from 'node:crypto';
import { z } from 'zod';
import { db, migrate } from './db.js';
import { requireAuth, signToken, type AuthRequest } from './auth.js';
import { calculateConfiguredAssessmentsForSession, calculateMspssForSession, calculateSccsForSession, calculateSspm2011ForSession } from './scoring/index.js';
import { methodologies } from './scoring/methodologies.js';

if(!process.env.JWT_SECRET || process.env.JWT_SECRET.length<24) throw new Error('JWT_SECRET must contain at least 24 characters');
const app=express();
app.use(helmet()); app.use(cors({origin:process.env.CLIENT_URL?.split(',')??true})); app.use(express.json({limit:'200kb'}));

app.get('/api/health',(_req,res)=>res.json({ok:true}));
app.get('/api/public/surveys/:slug',async(req,res,next)=>{try{
  const [surveys]=await db.query<any[]>(`SELECT id,slug,title,welcome_title AS welcomeTitle,welcome_text AS welcomeText,settings FROM surveys WHERE slug=? AND status='active'`,[req.params.slug]);
  if(!surveys.length) return res.status(404).json({message:'Опрос не найден'});
  const [questions]=await db.query<any[]>(`SELECT q.id,q.code,q.text,q.type,q.required,q.options,q.validation,s.code sectionCode,s.title sectionTitle,s.position sectionPosition,q.position FROM questions q JOIN sections s ON s.id=q.section_id WHERE s.survey_id=? ORDER BY s.position,q.position`,[surveys[0].id]);
  res.json({...surveys[0],questions});
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
const answerSchema=z.object({questionId:z.string().uuid(),value:z.union([z.string(),z.number(),z.array(z.string())]),position:z.number().int().min(0)});
app.put('/api/public/sessions/:token/answers',async(req,res,next)=>{try{
  const body=answerSchema.parse(req.body); const [sessions]=await db.query<any[]>('SELECT id,survey_id,status FROM response_sessions WHERE public_token=?',[req.params.token]);
  if(!sessions.length)return res.status(404).json({message:'Сессия не найдена'}); if(sessions[0].status==='completed')return res.status(409).json({message:'Опрос уже завершён'});
  const [questions]=await db.query<any[]>(`SELECT q.id,s.code sectionCode FROM questions q JOIN sections s ON s.id=q.section_id WHERE q.id=? AND s.survey_id=?`,[body.questionId,sessions[0].survey_id]); if(!questions.length)return res.status(400).json({message:'Некорректный вопрос'});
  await db.execute(`INSERT INTO answers (session_id,question_id,value) VALUES (?,?,?) ON DUPLICATE KEY UPDATE value=VALUES(value),answered_at=CURRENT_TIMESTAMP`,[sessions[0].id,body.questionId,JSON.stringify(body.value)]);
  await db.execute('UPDATE response_sessions SET current_position=?,last_activity_at=CURRENT_TIMESTAMP WHERE id=?',[body.position,sessions[0].id]);
  if(questions[0].sectionCode==='test_1')await calculateMspssForSession(sessions[0].id);
  if(questions[0].sectionCode==='test_2')await calculateSspm2011ForSession(sessions[0].id);
  if(questions[0].sectionCode==='test_3')await calculateSccsForSession(sessions[0].id);
  res.status(204).end();
}catch(e){next(e)}});
app.post('/api/public/sessions/:token/complete',async(req,res,next)=>{try{const [r]=await db.execute<any>(`UPDATE response_sessions SET status='completed',completed_at=CURRENT_TIMESTAMP WHERE public_token=? AND status='in_progress'`,[req.params.token]); if(!r.affectedRows)return res.status(404).json({message:'Сессия не найдена'});res.status(204).end()}catch(e){next(e)}});

app.post('/api/auth/login',async(req,res,next)=>{try{const body=z.object({email:z.string().email(),password:z.string().min(1)}).parse(req.body);const [rows]=await db.query<any[]>('SELECT id,email,name,role,password_hash FROM users WHERE email=?',[body.email]);if(!rows.length||!await bcrypt.compare(body.password,rows[0].password_hash))return res.status(401).json({message:'Неверная почта или пароль'});const {password_hash,...user}=rows[0];res.json({token:signToken({id:user.id,role:user.role}),user})}catch(e){next(e)}});
app.get('/api/admin/surveys',requireAuth,async(req:AuthRequest,res,next)=>{try{const [rows]=await db.query<any[]>(`SELECT s.id,s.slug,s.title,s.status,COUNT(rs.id) responses,SUM(rs.status='completed') completed FROM surveys s LEFT JOIN response_sessions rs ON rs.survey_id=s.id WHERE s.owner_id=? GROUP BY s.id ORDER BY s.created_at DESC`,[req.user!.id]);res.json(rows)}catch(e){next(e)}});
app.get('/api/admin/methodologies',requireAuth,(_req,res)=>res.json(methodologies));
app.get('/api/admin/surveys/:id/results',requireAuth,async(req:AuthRequest,res,next)=>{try{
  const [allowed]=await db.query<any[]>('SELECT id FROM surveys WHERE id=? AND owner_id=?',[req.params.id,req.user!.id]);if(!allowed.length)return res.status(404).json({message:'Опрос не найден'});
  const [sessions]=await db.query<any[]>(`SELECT rs.id,rs.status,rs.started_at AS startedAt,rs.last_activity_at AS lastActivityAt,rs.completed_at AS completedAt,COUNT(a.id) answered FROM response_sessions rs LEFT JOIN answers a ON a.session_id=rs.id WHERE rs.survey_id=? GROUP BY rs.id ORDER BY rs.started_at DESC`,[req.params.id]);
  await Promise.all(sessions.map(session=>calculateConfiguredAssessmentsForSession(session.id)));
  const [distribution]=await db.query<any[]>(`SELECT q.code,q.text,a.value,COUNT(*) count FROM answers a JOIN questions q ON q.id=a.question_id JOIN response_sessions rs ON rs.id=a.session_id WHERE rs.survey_id=? GROUP BY q.id,a.value ORDER BY q.position`,[req.params.id]);
  const [answerRows]=await db.query<any[]>(`SELECT a.session_id sessionId,s.id sectionId,s.code sectionCode,s.title sectionTitle,s.position sectionPosition,q.code questionCode,q.text questionText,q.options,q.position questionPosition,a.value,ar.formula_version formulaVersion,ar.result,ar.interpretation FROM answers a JOIN questions q ON q.id=a.question_id JOIN sections s ON s.id=q.section_id JOIN response_sessions rs ON rs.id=a.session_id LEFT JOIN assessment_results ar ON ar.session_id=a.session_id AND ar.section_id=s.id WHERE rs.survey_id=? ORDER BY rs.started_at DESC,s.position,q.position`,[req.params.id]);
  const parseJson=(value:any)=>{if(value===null||value===undefined)return null;if(typeof value!=='string')return value;try{return JSON.parse(value)}catch{return value}};
  const grouped=new Map<string,any[]>();
  for(const row of answerRows){const value=parseJson(row.value),options=parseJson(row.options)??[];const labels=(Array.isArray(value)?value:[value]).map(v=>options.find((o:any)=>String(o.value)===String(v))?.label??String(v));let groups=grouped.get(row.sessionId);if(!groups){groups=[];grouped.set(row.sessionId,groups)}let group=groups.find(g=>g.code===row.sectionCode);if(!group){group={id:row.sectionId,code:row.sectionCode,title:row.sectionTitle,position:row.sectionPosition,result:row.result?{formulaVersion:row.formulaVersion,values:parseJson(row.result),interpretation:parseJson(row.interpretation)}:null,answers:[]};groups.push(group)}group.answers.push({code:row.questionCode,question:row.questionText,value,displayValue:labels.join(', ')})}
  const respondents=sessions.map(session=>{const groups=grouped.get(session.id)??[];const alias=groups.find(g=>g.code==='respondent')?.answers.find((a:any)=>a.code==='alias')?.displayValue||'Без псевдонима';return {...session,alias,groups}});
  res.json({sessions,respondents,distribution});
}catch(e){next(e)}});
app.get('/api/admin/sessions/:id',requireAuth,async(req:AuthRequest,res,next)=>{try{const [rows]=await db.query<any[]>(`SELECT q.code,q.text,q.options,a.value,a.answered_at AS answeredAt,s.title sectionTitle FROM answers a JOIN questions q ON q.id=a.question_id JOIN sections s ON s.id=q.section_id JOIN surveys sv ON sv.id=s.survey_id WHERE a.session_id=? AND sv.owner_id=? ORDER BY s.position,q.position`,[req.params.id,req.user!.id]);res.json(rows)}catch(e){next(e)}});
app.use((err:any,_req:express.Request,res:express.Response,_next:express.NextFunction)=>{console.error(err);if(err instanceof z.ZodError)return res.status(400).json({message:'Некорректные данные',issues:err.issues});res.status(500).json({message:'Внутренняя ошибка сервера'})});
const port=Number(process.env.PORT??4000); migrate().then(()=>app.listen(port,()=>console.log(`API http://localhost:${port}`))).catch(e=>{console.error(e);process.exit(1)});
