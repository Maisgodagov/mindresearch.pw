import {Router} from 'express';
import bcrypt from 'bcryptjs';
import {createHash,randomBytes,randomUUID} from 'node:crypto';
import {z} from 'zod';
import {db} from './db.js';
import {createAuthSession,requireAuth,revokeAllUserSessions,type AuthRequest} from './auth.js';
import {methodologies} from './scoring/methodologies.js';
import {sendPasswordReset} from './mailer.js';

export const platformRouter=Router();
const transliteration:Record<string,string>={а:'a',б:'b',в:'v',г:'g',д:'d',е:'e',ё:'e',ж:'zh',з:'z',и:'i',й:'y',к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',р:'r',с:'s',т:'t',у:'u',ф:'f',х:'h',ц:'ts',ч:'ch',ш:'sh',щ:'sch',ъ:'',ы:'y',ь:'',э:'e',ю:'yu',я:'ya'};
const slugify=(input:string)=>input.toLowerCase().trim().split('').map(char=>transliteration[char]??char).join('').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,90);
const uniqueSlug=async(table:'users'|'surveys',column:'public_slug'|'slug',preferred:string)=>{const fallback=table==='surveys'?'survey':'profile';const base=slugify(preferred)||`${fallback}-${Math.random().toString(36).slice(2,8)}`;for(let n=0;n<100;n++){const slug=n?`${base}-${n+1}`:base;const[rows]=await db.query<any[]>(`SELECT id FROM ${table} WHERE ${column}=?`,[slug]);if(!rows.length)return slug}return `${base}-${randomUUID().slice(0,8)}`};

platformRouter.post('/auth/register',async(req,res,next)=>{try{
  const body=z.object({name:z.string().trim().min(2).max(120),email:z.string().email().max(255),password:z.string().min(8).max(100)}).parse(req.body);
  const[exists]=await db.query<any[]>('SELECT id FROM users WHERE email=?',[body.email.toLowerCase()]);if(exists.length)return res.status(409).json({message:'Пользователь с такой почтой уже зарегистрирован'});
  const id=randomUUID(),publicSlug=await uniqueSlug('users','public_slug',body.name);
  await db.execute('INSERT INTO users (id,email,password_hash,name,role,public_slug) VALUES (?,?,?,?,\'researcher\',?)',[id,body.email.toLowerCase(),await bcrypt.hash(body.password,12),body.name,publicSlug]);
  const user={id,email:body.email.toLowerCase(),name:body.name,role:'researcher',publicSlug,isProfilePublic:false},token=await createAuthSession(req,res,{id,role:'researcher'});res.status(201).json({token,user});
}catch(e){next(e)}});

const resetHash=(token:string)=>createHash('sha256').update(token).digest('hex');
const resetResponse={message:'Если аккаунт с такой почтой существует, мы отправили ссылку для смены пароля.'};
platformRouter.post('/auth/forgot-password',async(req,res,next)=>{try{
  const{email}=z.object({email:z.string().email().max(255)}).parse(req.body),normalized=email.toLowerCase();
  const[users]=await db.query<any[]>('SELECT id,email FROM users WHERE email=?',[normalized]);if(!users.length)return res.json(resetResponse);
  const[count]=await db.query<any[]>('SELECT COUNT(*) count FROM password_reset_tokens WHERE user_id=? AND requested_at>DATE_SUB(NOW(),INTERVAL 15 MINUTE)',[users[0].id]);if(Number(count[0].count)>=3)return res.json(resetResponse);
  const token=randomBytes(32).toString('hex');await db.execute('INSERT INTO password_reset_tokens (id,user_id,token_hash,expires_at) VALUES (?,?,?,DATE_ADD(NOW(),INTERVAL 30 MINUTE))',[randomUUID(),users[0].id,resetHash(token)]);
  try{await sendPasswordReset(users[0].email,token)}catch(error){console.error('Password reset email failed',error)}res.json(resetResponse);
}catch(e){next(e)}});
platformRouter.post('/auth/reset-password',async(req,res,next)=>{let connection;try{
  const body=z.object({token:z.string().length(64),password:z.string().min(8).max(100)}).parse(req.body);connection=await db.getConnection();await connection.beginTransaction();const[rows]=await connection.query<any[]>('SELECT id,user_id userId FROM password_reset_tokens WHERE token_hash=? AND used_at IS NULL AND expires_at>NOW() FOR UPDATE',[resetHash(body.token)]);if(!rows.length){await connection.rollback();return res.status(400).json({message:'Ссылка недействительна или срок её действия истёк'});}
  await connection.execute('UPDATE users SET password_hash=? WHERE id=?',[await bcrypt.hash(body.password,12),rows[0].userId]);await connection.execute('UPDATE password_reset_tokens SET used_at=NOW() WHERE user_id=? AND used_at IS NULL',[rows[0].userId]);await connection.execute('UPDATE auth_sessions SET revoked_at=NOW() WHERE user_id=? AND revoked_at IS NULL',[rows[0].userId]);await connection.commit();res.json({ok:true});
}catch(e){if(connection)await connection.rollback();next(e)}finally{connection?.release()}});

platformRouter.get('/account/me',requireAuth,async(req:AuthRequest,res,next)=>{try{const[rows]=await db.query<any[]>('SELECT id,email,name,role,bio,avatar_seed avatarSeed,public_slug publicSlug,is_profile_public isProfilePublic,created_at createdAt FROM users WHERE id=?',[req.user!.id]);if(!rows.length)return res.status(404).json({message:'Профиль не найден'});res.json({...rows[0],isProfilePublic:Boolean(rows[0].isProfilePublic)})}catch(e){next(e)}});
platformRouter.patch('/account/me',requireAuth,async(req:AuthRequest,res,next)=>{try{
  const body=z.object({name:z.string().trim().min(2).max(120),bio:z.string().max(3000).default(''),avatarSeed:z.string().trim().min(1).max(120).default('willow'),publicSlug:z.string().trim().min(3).max(120).regex(/^[a-z0-9-]+$/i),isProfilePublic:z.union([z.boolean(),z.literal(0),z.literal(1)]).transform(Boolean)}).parse(req.body);
  const[conflict]=await db.query<any[]>('SELECT id FROM users WHERE public_slug=? AND id<>?',[body.publicSlug,req.user!.id]);if(conflict.length)return res.status(409).json({message:'Этот адрес профиля уже занят'});
  await db.execute('UPDATE users SET name=?,bio=?,avatar_url=NULL,avatar_seed=?,public_slug=?,is_profile_public=? WHERE id=?',[body.name,body.bio,body.avatarSeed,body.publicSlug,body.isProfilePublic,req.user!.id]);res.json({ok:true});
}catch(e){next(e)}});
platformRouter.patch('/account/password',requireAuth,async(req:AuthRequest,res,next)=>{try{
  const body=z.object({currentPassword:z.string().min(1).max(100),newPassword:z.string().min(8).max(100)}).parse(req.body);const[users]=await db.query<any[]>('SELECT password_hash passwordHash FROM users WHERE id=?',[req.user!.id]);if(!users.length)return res.status(404).json({message:'Профиль не найден'});if(!await bcrypt.compare(body.currentPassword,users[0].passwordHash))return res.status(400).json({message:'Текущий пароль указан неверно'});if(await bcrypt.compare(body.newPassword,users[0].passwordHash))return res.status(400).json({message:'Новый пароль должен отличаться от текущего'});await db.execute('UPDATE users SET password_hash=? WHERE id=?',[await bcrypt.hash(body.newPassword,12),req.user!.id]);await revokeAllUserSessions(req.user!.id);const token=await createAuthSession(req,res,{id:req.user!.id,role:req.user!.role});res.json({ok:true,token});
}catch(e){next(e)}});

platformRouter.get('/public/profiles/:slug',async(req,res,next)=>{try{
  const[profiles]=await db.query<any[]>('SELECT id,name,bio,avatar_seed avatarSeed,public_slug publicSlug FROM users WHERE public_slug=? AND is_profile_public=TRUE',[req.params.slug]);if(!profiles.length)return res.status(404).json({message:'Публичный профиль не найден'});
  const[surveys]=await db.query<any[]>(`SELECT id,slug,title,description,created_at createdAt FROM surveys WHERE owner_id=? AND status='active' AND deleted_at IS NULL ORDER BY created_at DESC`,[profiles[0].id]);res.json({...profiles[0],surveys});
}catch(e){next(e)}});

platformRouter.get('/account/instruments',requireAuth,async(req:AuthRequest,res,next)=>{try{
  const[rows]=await db.query<any[]>(`SELECT i.id,i.code,i.title,i.description,i.is_verified isVerified,i.scoring_code scoringCode,COUNT(q.id) questionCount FROM instruments i LEFT JOIN instrument_questions q ON q.instrument_id=i.id WHERE i.status='active' AND (i.is_verified=TRUE OR i.owner_id=?) GROUP BY i.id ORDER BY i.is_verified DESC,i.title`,[req.user!.id]);
  const authors:Record<string,string>={test_1:'Gregory Zimet, Nancy Dahlem, Sara Zimet, Gordon Farley',test_2:'В. И. Моросанова, Н. Г. Кондратюк',test_3:'Jennifer Campbell и соавторы',test_4:'David Moscovitch, Keith Huyder',test_5:'David Garner, Marion Olmsted, Janet Polivy',test_6:'Tatjana van Strien и соавторы'};
  res.json(rows.map(row=>({...row,author:authors[row.code]??null,methodology:methodologies[row.code]??null})));
}catch(e){next(e)}});
platformRouter.get('/account/instruments/:id/questions',requireAuth,async(req:AuthRequest,res,next)=>{try{
  const[instruments]=await db.query<any[]>(`SELECT id,title FROM instruments WHERE id=? AND status='active' AND (is_verified=TRUE OR owner_id=?)`,[req.params.id,req.user!.id]);if(!instruments.length)return res.status(404).json({message:'Методика не найдена'});
  const[questions]=await db.query<any[]>(`SELECT id,text,type,required,options,validation FROM instrument_questions WHERE instrument_id=? ORDER BY position`,[req.params.id]);
  res.json({title:instruments[0].title,questions:questions.map(question=>({...question,required:Boolean(question.required),options:parseJson(question.options)??[],validation:parseJson(question.validation)??null}))});
}catch(e){next(e)}});

const submissionSchema=z.object({title:z.string().trim().min(2).max(255),originalAuthor:z.string().trim().max(500).default(''),sourceUrl:z.union([z.string().url().max(2000),z.literal('')]).default(''),description:z.string().trim().min(10).max(5000),questionnaireText:z.string().trim().min(20).max(100000),scoringText:z.string().max(50000).default(''),rightsNote:z.string().max(5000).default('')});
platformRouter.get('/account/instrument-submissions',requireAuth,async(req:AuthRequest,res,next)=>{try{const[rows]=await db.query<any[]>('SELECT id,title,status,admin_note adminNote,created_at createdAt FROM instrument_submissions WHERE user_id=? ORDER BY created_at DESC',[req.user!.id]);res.json(rows)}catch(e){next(e)}});
platformRouter.post('/account/instrument-submissions',requireAuth,async(req:AuthRequest,res,next)=>{try{const body=submissionSchema.parse(req.body),id=randomUUID();await db.execute('INSERT INTO instrument_submissions (id,user_id,title,original_author,source_url,description,questionnaire_text,scoring_text,rights_note) VALUES (?,?,?,?,?,?,?,?,?)',[id,req.user!.id,body.title,body.originalAuthor||null,body.sourceUrl||null,body.description,body.questionnaireText,body.scoringText||null,body.rightsNote||null]);res.status(201).json({id,status:'submitted'})}catch(e){next(e)}});
platformRouter.get('/admin/instrument-submissions',requireAuth,async(req:AuthRequest,res,next)=>{try{if(!['owner','admin'].includes(req.user!.role))return res.status(403).json({message:'Недостаточно прав'});const[rows]=await db.query<any[]>(`SELECT s.id,s.title,s.original_author originalAuthor,s.source_url sourceUrl,s.description,s.questionnaire_text questionnaireText,s.scoring_text scoringText,s.rights_note rightsNote,s.status,s.admin_note adminNote,s.created_at createdAt,u.name submitterName,u.email submitterEmail FROM instrument_submissions s JOIN users u ON u.id=s.user_id ORDER BY FIELD(s.status,'submitted','reviewing','approved','rejected'),s.created_at DESC`);res.json(rows)}catch(e){next(e)}});
platformRouter.patch('/admin/instrument-submissions/:id',requireAuth,async(req:AuthRequest,res,next)=>{try{if(!['owner','admin'].includes(req.user!.role))return res.status(403).json({message:'Недостаточно прав'});const body=z.object({status:z.enum(['submitted','reviewing','approved','rejected']),adminNote:z.string().max(5000).default('')}).parse(req.body);const[result]=await db.execute<any>('UPDATE instrument_submissions SET status=?,admin_note=? WHERE id=?',[body.status,body.adminNote||null,req.params.id]);if(!result.affectedRows)return res.status(404).json({message:'Предложение не найдено'});res.json({ok:true})}catch(e){next(e)}});

const optionSchema=z.object({value:z.string().min(1).max(120),label:z.string().trim().min(1).max(500)});
const questionSchema=z.object({text:z.string().trim().min(1).max(5000),type:z.enum(['single','multiple','text','number']),required:z.boolean().default(true),options:z.array(optionSchema).max(30).optional(),validation:z.record(z.string(),z.unknown()).optional()}).superRefine((q,ctx)=>{if((q.type==='single'||q.type==='multiple')&&(!q.options||q.options.length<2))ctx.addIssue({code:'custom',message:'Добавьте минимум два варианта ответа',path:['options']})});
const resultPresentationSchema=z.object({showResults:z.boolean().default(true),title:z.string().trim().min(2).max(255).default('Спасибо за ваши ответы'),text:z.string().max(3000).default(''),showScores:z.boolean().default(true)}).default({showResults:true,title:'Спасибо за ваши ответы',text:'',showScores:true});
const createSurveySchema=z.object({title:z.string().trim().min(2).max(255),slug:z.string().trim().max(120).regex(/^[a-z0-9-]+$/i).optional(),description:z.string().max(3000).default(''),welcomeTitle:z.string().trim().min(2).max(255),welcomeText:z.string().trim().min(2).max(5000),status:z.enum(['draft','active','archived']).default('draft'),showAuthor:z.boolean().default(true),resultPresentation:resultPresentationSchema,sections:z.array(z.discriminatedUnion('kind',[z.object({kind:z.literal('library'),instrumentId:z.string().uuid()}),z.object({kind:z.literal('custom'),title:z.string().trim().min(1).max(255),description:z.string().max(2000).default(''),questions:z.array(questionSchema).min(1).max(300)})])).min(1).max(30)});

const parseJson=(value:unknown)=>typeof value==='string'?JSON.parse(value):value;
platformRouter.get('/account/surveys/trash',requireAuth,async(req:AuthRequest,res,next)=>{try{
  const[rows]=await db.query<any[]>(`SELECT s.id,s.slug,s.title,s.description,s.status,s.deleted_at deletedAt,COUNT(rs.id) responses,COALESCE(SUM(rs.status='completed'),0) completed FROM surveys s LEFT JOIN response_sessions rs ON rs.survey_id=s.id AND rs.deleted_at IS NULL WHERE s.owner_id=? AND s.deleted_at IS NOT NULL GROUP BY s.id ORDER BY s.deleted_at DESC`,[req.user!.id]);res.json(rows);
}catch(e){next(e)}});
platformRouter.post('/account/surveys/:id/trash',requireAuth,async(req:AuthRequest,res,next)=>{try{
  const[result]=await db.execute<any>('UPDATE surveys SET deleted_at=CURRENT_TIMESTAMP WHERE id=? AND owner_id=? AND deleted_at IS NULL',[req.params.id,req.user!.id]);if(!result.affectedRows)return res.status(404).json({message:'Опрос не найден'});res.json({ok:true});
}catch(e){next(e)}});
platformRouter.post('/account/surveys/:id/restore',requireAuth,async(req:AuthRequest,res,next)=>{try{
  const[result]=await db.execute<any>('UPDATE surveys SET deleted_at=NULL WHERE id=? AND owner_id=? AND deleted_at IS NOT NULL',[req.params.id,req.user!.id]);if(!result.affectedRows)return res.status(404).json({message:'Опрос не найден в корзине'});res.json({ok:true});
}catch(e){next(e)}});
platformRouter.post('/account/surveys/:id/archive',requireAuth,async(req:AuthRequest,res,next)=>{try{
  const[result]=await db.execute<any>("UPDATE surveys SET status='archived' WHERE id=? AND owner_id=? AND deleted_at IS NULL AND status<>'archived'",[req.params.id,req.user!.id]);if(!result.affectedRows)return res.status(404).json({message:'Опрос не найден или уже находится в архиве'});res.json({ok:true,status:'archived'});
}catch(e){next(e)}});
platformRouter.post('/account/surveys/:id/unarchive',requireAuth,async(req:AuthRequest,res,next)=>{try{
  const[result]=await db.execute<any>("UPDATE surveys SET status='active' WHERE id=? AND owner_id=? AND deleted_at IS NULL AND status='archived'",[req.params.id,req.user!.id]);if(!result.affectedRows)return res.status(404).json({message:'Опрос не найден в архиве'});res.json({ok:true,status:'active'});
}catch(e){next(e)}});
platformRouter.get('/account/surveys/:id',requireAuth,async(req:AuthRequest,res,next)=>{try{
  const[surveys]=await db.query<any[]>(`SELECT s.id,s.slug,s.title,s.description,s.welcome_title welcomeTitle,s.welcome_text welcomeText,s.status,s.settings,s.show_author showAuthor,(SELECT COUNT(*) FROM response_sessions rs WHERE rs.survey_id=s.id) responseCount FROM surveys s WHERE s.id=? AND s.owner_id=? AND s.deleted_at IS NULL`,[req.params.id,req.user!.id]);if(!surveys.length)return res.status(404).json({message:'Опрос не найден'});
  const[sections]=await db.query<any[]>(`SELECT id,title,description,position,source_instrument_id instrumentId,section_kind sectionKind FROM sections WHERE survey_id=? ORDER BY position`,[req.params.id]);
  const[questions]=await db.query<any[]>(`SELECT q.id,q.section_id sectionId,q.text,q.type,q.required,q.options,q.validation,q.position FROM questions q JOIN sections s ON s.id=q.section_id WHERE s.survey_id=? ORDER BY s.position,q.position`,[req.params.id]);
  const settings=parseJson(surveys[0].settings)??{};res.json({...surveys[0],settings,resultPresentation:settings.resultPresentation??{showResults:true,showScores:true,title:'Спасибо за ваши ответы',text:''},sections:sections.map(section=>section.instrumentId?{id:section.id,kind:'library',instrumentId:section.instrumentId,title:section.title,questionCount:questions.filter(q=>q.sectionId===section.id).length,isVerified:section.sectionKind==='verified'}:{id:section.id,kind:'custom',title:section.title,questions:questions.filter(q=>q.sectionId===section.id).map(q=>({...q,required:Boolean(q.required),options:parseJson(q.options)??[],validation:parseJson(q.validation)}))})});
}catch(e){next(e)}});

platformRouter.put('/account/surveys/:id',requireAuth,async(req:AuthRequest,res,next)=>{let connection;try{
  const body=createSurveySchema.parse(req.body);connection=await db.getConnection();await connection.beginTransaction();const[surveys]=await connection.query<any[]>('SELECT id FROM surveys WHERE id=? AND owner_id=? AND deleted_at IS NULL FOR UPDATE',[req.params.id,req.user!.id]);if(!surveys.length){await connection.rollback();return res.status(404).json({message:'Опрос не найден'})}const[countRows]=await connection.query<any[]>('SELECT COUNT(*) count FROM response_sessions WHERE survey_id=?',[req.params.id]);const structureLocked=Number(countRows[0].count)>0;
  await connection.execute('UPDATE surveys SET title=?,description=?,welcome_title=?,welcome_text=?,status=?,show_author=?,settings=? WHERE id=?',[body.title,body.description,body.welcomeTitle,body.welcomeText,body.status,body.showAuthor,JSON.stringify({showSectionTitles:false,resultPresentation:body.resultPresentation}),req.params.id]);
  if(!structureLocked){await connection.execute('DELETE FROM sections WHERE survey_id=?',[req.params.id]);for(const[position,section]of body.sections.entries()){const sectionId=randomUUID();if(section.kind==='library'){const[instruments]=await connection.query<any[]>(`SELECT id,code,title,description,is_verified FROM instruments WHERE id=? AND status='active' AND (is_verified=TRUE OR owner_id=?)`,[section.instrumentId,req.user!.id]);if(!instruments.length)throw Object.assign(new Error('Методика не найдена'),{status:400});const instrument=instruments[0];await connection.execute('INSERT INTO sections (id,survey_id,code,title,description,position,source_instrument_id,section_kind) VALUES (?,?,?,?,?,?,?,?)',[sectionId,req.params.id,instrument.code??`custom-${position+1}`,instrument.title,instrument.description,position,instrument.id,instrument.is_verified?'verified':'custom']);await connection.execute(`INSERT INTO questions (id,section_id,code,text,type,required,position,options,validation) SELECT UUID(),?,code,text,type,required,position,options,validation FROM instrument_questions WHERE instrument_id=? ORDER BY position`,[sectionId,instrument.id])}else{await connection.execute('INSERT INTO sections (id,survey_id,code,title,description,position,section_kind) VALUES (?,?,?,?,?,?,\'custom\')',[sectionId,req.params.id,`custom-${position+1}-${randomUUID().slice(0,6)}`,section.title,section.description,position]);for(const[index,question]of section.questions.entries())await connection.execute('INSERT INTO questions (id,section_id,code,text,type,required,position,options,validation) VALUES (?,?,?,?,?,?,?,?,?)',[randomUUID(),sectionId,`q${index+1}`,question.text,question.type,question.required,index,question.options?JSON.stringify(question.options):null,question.validation?JSON.stringify(question.validation):null])}}}
  await connection.commit();res.json({ok:true,structureLocked});
}catch(e:any){if(connection)await connection.rollback();if(e?.status)return res.status(e.status).json({message:e.message});next(e)}finally{connection?.release()}});

platformRouter.post('/account/surveys/:id/publish',requireAuth,async(req:AuthRequest,res,next)=>{try{
  const[surveys]=await db.query<any[]>(`SELECT s.id,COUNT(q.id) questionCount FROM surveys s LEFT JOIN sections sec ON sec.survey_id=s.id LEFT JOIN questions q ON q.section_id=sec.id WHERE s.id=? AND s.owner_id=? AND s.deleted_at IS NULL GROUP BY s.id`,[req.params.id,req.user!.id]);
  if(!surveys.length)return res.status(404).json({message:'Опрос не найден'});
  if(Number(surveys[0].questionCount)<1)return res.status(409).json({message:'Добавьте хотя бы один вопрос перед публикацией'});
  await db.execute("UPDATE surveys SET status='active' WHERE id=?",[req.params.id]);res.json({ok:true,status:'active'});
}catch(e){next(e)}});

platformRouter.post('/account/surveys',requireAuth,async(req:AuthRequest,res,next)=>{let connection;try{
  const body=createSurveySchema.parse(req.body),slug=await uniqueSlug('surveys','slug',body.slug||body.title),surveyId=randomUUID();connection=await db.getConnection();await connection.beginTransaction();
  await connection.execute(`INSERT INTO surveys (id,owner_id,slug,title,welcome_title,welcome_text,status,settings,description,show_author) VALUES (?,?,?,?,?,?,?,?,?,?)`,[surveyId,req.user!.id,slug,body.title,body.welcomeTitle,body.welcomeText,body.status,JSON.stringify({showSectionTitles:false,resultPresentation:body.resultPresentation}),body.description,body.showAuthor]);
  for(const[position,section]of body.sections.entries()){
    const sectionId=randomUUID();
    if(section.kind==='library'){
      const[instruments]=await connection.query<any[]>(`SELECT id,code,title,description,is_verified FROM instruments WHERE id=? AND status='active' AND (is_verified=TRUE OR owner_id=?)`,[section.instrumentId,req.user!.id]);if(!instruments.length)throw Object.assign(new Error('Методика не найдена'),{status:400});const instrument=instruments[0];
      await connection.execute('INSERT INTO sections (id,survey_id,code,title,description,position,source_instrument_id,section_kind) VALUES (?,?,?,?,?,?,?,?)',[sectionId,surveyId,instrument.code??`custom-${position+1}`,instrument.title,instrument.description,position,instrument.id,instrument.is_verified?'verified':'custom']);
      await connection.execute(`INSERT INTO questions (id,section_id,code,text,type,required,position,options,validation) SELECT UUID(),?,code,text,type,required,position,options,validation FROM instrument_questions WHERE instrument_id=? ORDER BY position`,[sectionId,instrument.id]);
    }else{
      await connection.execute('INSERT INTO sections (id,survey_id,code,title,description,position,section_kind) VALUES (?,?,?,?,?,?,\'custom\')',[sectionId,surveyId,`custom-${position+1}-${randomUUID().slice(0,6)}`,section.title,section.description,position]);
      for(const[index,question]of section.questions.entries())await connection.execute('INSERT INTO questions (id,section_id,code,text,type,required,position,options,validation) VALUES (?,?,?,?,?,?,?,?,?)',[randomUUID(),sectionId,`q${index+1}`,question.text,question.type,question.required,index,question.options?JSON.stringify(question.options):null,question.validation?JSON.stringify(question.validation):null]);
    }
  }
  await connection.commit();res.status(201).json({id:surveyId,slug});
}catch(e:any){if(connection)await connection.rollback();if(e?.status)return res.status(e.status).json({message:e.message});next(e)}finally{connection?.release()}});
