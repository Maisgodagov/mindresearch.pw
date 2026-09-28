import {Router} from 'express';
import bcrypt from 'bcryptjs';
import {createHash,randomBytes,randomUUID} from 'node:crypto';
import {z} from 'zod';
import {db} from './db.js';
import {createAuthSession,requireAuth,requireRole,revokeAllUserSessions,type AuthRequest} from './auth.js';
import {methodologies} from './scoring/methodologies.js';
import {checkConfigurableCases, validateConfigurableMethodology} from './scoring/configurable.js';
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
  const[rows]=await db.query<any[]>(`SELECT i.id,i.code,i.title,i.description,i.is_verified isVerified,i.scoring_code scoringCode,i.methodology,COUNT(q.id) questionCount FROM instruments i LEFT JOIN instrument_questions q ON q.instrument_id=i.id WHERE i.status='active' AND (i.is_verified=TRUE OR i.owner_id=?) GROUP BY i.id ORDER BY i.is_verified DESC,i.title`,[req.user!.id]);
  const authors:Record<string,string>={test_1:'Gregory Zimet, Nancy Dahlem, Sara Zimet, Gordon Farley',test_2:'В. И. Моросанова, Н. Г. Кондратюк',test_3:'Jennifer Campbell и соавторы',test_4:'David Moscovitch, Keith Huyder',test_5:'David Garner, Marion Olmsted, Janet Polivy',test_6:'Tatjana van Strien и соавторы',test_7:'Т. О. Гордеева, О. А. Сычев, Е. Н. Осин',test_8:'Robert J. Vallerand, Luc G. Pelletier, Marc R. Blais, Nathalie M. Brière, Caroline B. Senécal, Évelyne F. Vallières',test_9:'Е. Н. Осин',test_10:'Clarry H. Lay',test_11:'Piers Steel',test_12:'Christopher J. Soto, Oliver P. John; русская версия: С. А. Щебетенко и соавторы',test_13:'Christopher J. Soto, Oliver P. John; русская версия: А. М. Мишкевич и соавторы',test_14:'Samuel D. Gosling, Peter J. Rentfrow, William B. Swann Jr.; русская версия: А. С. Сергеева, Б. А. Кириллов, А. Ф. Джумагулова',test_15:'John A. Johnson; IPIP item pool: Lewis R. Goldberg и соавторы',test_16:'M. Brent Donnellan, Frederick L. Oswald, Brendan M. Baird, Richard E. Lucas',test_17:'Morris Rosenberg; русская версия: А. А. Золотарёва',test_18:'Timothy A. Judge, Amir Erez, Joyce E. Bono, Carl J. Thoresen'};
  res.json(rows.map(row=>{const configured=parseJson(row.methodology);const base=methodologies[row.code];return {...row,author:configured?.author||authors[row.code]||null,methodology:base?{...base,...configured,code:row.code,title:row.title,summary:row.description??configured?.summary??base.summary}:configured?{...configured,code:row.code,title:row.title}:null}}));
}catch(e){next(e)}});
platformRouter.get('/account/instruments/:id/questions',requireAuth,async(req:AuthRequest,res,next)=>{try{
  const[instruments]=await db.query<any[]>(`SELECT id,title FROM instruments WHERE id=? AND status='active' AND (is_verified=TRUE OR owner_id=?)`,[req.params.id,req.user!.id]);if(!instruments.length)return res.status(404).json({message:'Методика не найдена'});
  const[questions]=await db.query<any[]>(`SELECT id,text,type,required,options,validation FROM instrument_questions WHERE instrument_id=? ORDER BY position`,[req.params.id]);
  res.json({title:instruments[0].title,questions:questions.map(question=>({...question,required:Boolean(question.required),options:parseJson(question.options)??[],validation:parseJson(question.validation)??null}))});
}catch(e){next(e)}});

const submissionSchema=z.object({title:z.string().trim().min(2).max(255),originalAuthor:z.string().trim().min(2).max(500),publicationYear:z.union([z.number().int().min(1800).max(new Date().getFullYear()+1),z.null()]).default(null),hasRussianAdaptation:z.boolean().nullable().default(null)});
platformRouter.get('/account/instrument-submissions',requireAuth,async(req:AuthRequest,res,next)=>{try{const[rows]=await db.query<any[]>('SELECT id,title,original_author originalAuthor,publication_year publicationYear,has_russian_adaptation hasRussianAdaptation,status,admin_note adminNote,created_at createdAt FROM instrument_submissions WHERE user_id=? ORDER BY created_at DESC',[req.user!.id]);res.json(rows.map(row=>({...row,hasRussianAdaptation:row.hasRussianAdaptation===null?null:Boolean(row.hasRussianAdaptation)})))}catch(e){next(e)}});
platformRouter.post('/account/instrument-submissions',requireAuth,async(req:AuthRequest,res,next)=>{try{const body=submissionSchema.parse(req.body),id=randomUUID();await db.execute('INSERT INTO instrument_submissions (id,user_id,title,original_author,publication_year,has_russian_adaptation,description,questionnaire_text) VALUES (?,?,?,?,?,?,?,?)',[id,req.user!.id,body.title,body.originalAuthor,body.publicationYear,body.hasRussianAdaptation,'','']);res.status(201).json({id,status:'submitted'})}catch(e){next(e)}});
platformRouter.get('/admin/instrument-submissions',requireAuth,async(req:AuthRequest,res,next)=>{try{if(!['owner','admin'].includes(req.user!.role))return res.status(403).json({message:'Недостаточно прав'});const[rows]=await db.query<any[]>(`SELECT s.id,s.title,s.original_author originalAuthor,s.publication_year publicationYear,s.has_russian_adaptation hasRussianAdaptation,s.status,s.admin_note adminNote,s.created_at createdAt,u.name submitterName,u.email submitterEmail FROM instrument_submissions s JOIN users u ON u.id=s.user_id ORDER BY FIELD(s.status,'submitted','reviewing','approved','rejected'),s.created_at DESC`);res.json(rows.map(row=>({...row,hasRussianAdaptation:row.hasRussianAdaptation===null?null:Boolean(row.hasRussianAdaptation)})))}catch(e){next(e)}});
platformRouter.patch('/admin/instrument-submissions/:id',requireAuth,async(req:AuthRequest,res,next)=>{try{if(!['owner','admin'].includes(req.user!.role))return res.status(403).json({message:'Недостаточно прав'});const body=z.object({status:z.enum(['submitted','reviewing','approved','rejected']),adminNote:z.string().max(5000).default('')}).parse(req.body);const[result]=await db.execute<any>('UPDATE instrument_submissions SET status=?,admin_note=? WHERE id=?',[body.status,body.adminNote||null,req.params.id]);if(!result.affectedRows)return res.status(404).json({message:'Предложение не найдено'});res.json({ok:true})}catch(e){next(e)}});

const bugReportSchema=z.object({category:z.enum(['bug','methodology','other']),description:z.string().trim().min(10).max(10000),pageUrl:z.string().max(2000).optional().default('')});
platformRouter.post('/account/bug-reports',requireAuth,async(req:AuthRequest,res,next)=>{try{const body=bugReportSchema.parse(req.body),id=randomUUID();await db.execute('INSERT INTO bug_reports (id,user_id,category,description,page_url) VALUES (?,?,?,?,?)',[id,req.user!.id,body.category,body.description,body.pageUrl||null]);res.status(201).json({id,status:'new'})}catch(e){next(e)}});
platformRouter.get('/admin/bug-reports',requireRole('owner','admin'),async(_req,res,next)=>{try{const[rows]=await db.query<any[]>(`SELECT r.id,r.category,r.description,r.page_url pageUrl,r.status,r.admin_note adminNote,r.created_at createdAt,r.updated_at updatedAt,u.name submitterName,u.email submitterEmail FROM bug_reports r JOIN users u ON u.id=r.user_id ORDER BY FIELD(r.status,'new','in_progress','resolved','dismissed'),r.created_at DESC`);res.json(rows)}catch(e){next(e)}});
platformRouter.patch('/admin/bug-reports/:id',requireRole('owner','admin'),async(req:AuthRequest,res,next)=>{try{const body=z.object({status:z.enum(['new','in_progress','resolved','dismissed']),adminNote:z.string().max(5000).default('')}).parse(req.body);const[result]=await db.execute<any>('UPDATE bug_reports SET status=?,admin_note=? WHERE id=?',[body.status,body.adminNote||null,req.params.id]);if(!result.affectedRows)return res.status(404).json({message:'Обращение не найдено'});res.json({ok:true})}catch(e){next(e)}});
platformRouter.get('/admin/users',requireRole('owner','admin'),async(_req,res,next)=>{try{const[rows]=await db.query<any[]>(`SELECT u.id,u.name,u.email,u.role,u.created_at createdAt,COUNT(DISTINCT s.id) surveyCount,COUNT(DISTINCT CASE WHEN s.status='active' THEN s.id END) activeSurveyCount,COUNT(DISTINCT rs.id) responseCount,COUNT(DISTINCT CASE WHEN rs.status='completed' THEN rs.id END) completedCount FROM users u LEFT JOIN surveys s ON s.owner_id=u.id AND s.deleted_at IS NULL LEFT JOIN response_sessions rs ON rs.survey_id=s.id AND rs.deleted_at IS NULL GROUP BY u.id ORDER BY u.created_at DESC`);res.json(rows)}catch(e){next(e)}});
platformRouter.patch('/admin/users/:id/role',requireRole('owner'),async(req:AuthRequest,res,next)=>{try{const{role}=z.object({role:z.enum(['researcher','admin'])}).parse(req.body);const[users]=await db.query<any[]>('SELECT role FROM users WHERE id=?',[req.params.id]);if(!users.length)return res.status(404).json({message:'Пользователь не найден'});if(users[0].role==='owner')return res.status(409).json({message:'Роль владельца нельзя изменить'});await db.execute('UPDATE users SET role=? WHERE id=?',[role,req.params.id]);await db.execute('UPDATE auth_sessions SET revoked_at=NOW() WHERE user_id=? AND revoked_at IS NULL',[req.params.id]);res.json({ok:true,role})}catch(e){next(e)}});

const optionSchema=z.object({value:z.string().min(1).max(120),label:z.string().trim().min(1).max(500)});
const questionSchema=z.object({text:z.string().trim().min(1).max(5000),type:z.enum(['single','multiple','text','number']),required:z.boolean().default(true),options:z.array(optionSchema).max(30).optional(),validation:z.record(z.string(),z.unknown()).optional()}).superRefine((q,ctx)=>{if((q.type==='single'||q.type==='multiple')&&(!q.options||q.options.length<2))ctx.addIssue({code:'custom',message:'Добавьте минимум два варианта ответа',path:['options']})});
const resultPresentationSchema=z.object({showResults:z.boolean().default(true),title:z.string().trim().min(2).max(255).default('Спасибо за ваши ответы'),text:z.string().max(3000).default(''),showScores:z.boolean().default(true)}).default({showResults:true,title:'Спасибо за ваши ответы',text:'',showScores:true});
const createSurveySchema=z.object({title:z.string().trim().min(2).max(255),slug:z.string().trim().max(120).regex(/^[a-z0-9-]+$/i).optional(),description:z.string().max(3000).default(''),welcomeTitle:z.string().trim().min(2).max(255),welcomeText:z.string().trim().min(2).max(5000),status:z.enum(['draft','active','archived']).default('draft'),showAuthor:z.boolean().default(true),collectAlias:z.boolean().default(true),resultPresentation:resultPresentationSchema,sections:z.array(z.discriminatedUnion('kind',[z.object({kind:z.literal('library'),instrumentId:z.string().uuid()}),z.object({kind:z.literal('custom'),title:z.string().trim().min(1).max(255),description:z.string().max(2000).default(''),questions:z.array(questionSchema).min(1).max(300)})])).min(1).max(30)});
const builderStateSchema=z.object({meta:z.object({title:z.string().max(255),description:z.string().max(3000),welcomeTitle:z.string().max(255),welcomeText:z.string().max(5000),status:z.enum(['draft','active','archived']),showAuthor:z.boolean(),collectAlias:z.boolean().default(true),resultPresentation:resultPresentationSchema}),sections:z.array(z.unknown()).max(30),open:z.record(z.string(),z.boolean()).default({})});

const parseJson=(value:unknown)=>typeof value==='string'?JSON.parse(value):value;
const studioSchema=z.object({
  methodology:z.object({title:z.string().max(255).default(''),author:z.string().max(500).default(''),version:z.string().max(80).default(''),year:z.union([z.number().int().min(1800).max(new Date().getFullYear()+1),z.null()]).default(null),summary:z.string().max(5000).default(''),adaptation:z.string().max(2000).default(''),rightsNote:z.string().max(3000).default(''),steps:z.array(z.string().max(2000)).max(30).default([]),keys:z.array(z.object({label:z.string().max(255),value:z.string().max(2000)})).max(100).default([]),notes:z.array(z.string().max(2000)).max(30).default([]),sources:z.array(z.object({title:z.string().max(500).default(''),url:z.string().max(2000).default('')})).max(30).default([])}),
  questions:z.array(z.object({text:z.string().max(5000).default(''),options:z.array(z.object({value:z.string().max(30),label:z.string().max(500)})).max(30).default([])})).max(300).default([]),
  scoring:z.object({min:z.number().int().min(-1000).max(1000).default(1),max:z.number().int().min(-1000).max(1000).default(5),scales:z.array(z.object({key:z.string().max(100),label:z.string().max(255),items:z.array(z.number().int()).max(300),reverseItems:z.array(z.number().int()).max(300),aggregation:z.enum(['sum','mean'])})).max(100).default([])}),
  cases:z.array(z.object({title:z.string().max(255),answers:z.record(z.string(),z.number()),expected:z.record(z.string(),z.number())})).max(30).default([]),
});
const readStudioInstrument=async(id:string)=>{
  const[rows]=await db.query<any[]>(`SELECT id,code,title,description,is_verified isVerified,status,methodology,scoring_config scoringConfig,validation_cases validationCases,formula_version formulaVersion FROM instruments WHERE id=?`,[id]);
  if(!rows.length)return null;
  const[questions]=await db.query<any[]>(`SELECT text,options FROM instrument_questions WHERE instrument_id=? ORDER BY position`,[id]);
  const base=methodologies[rows[0].code]??{};
  const configured=parseJson(rows[0].methodology)??{};
  const questionOptions=questions.map(question=>parseJson(question.options)??[]);
  const firstOptions=questionOptions[0]??[];
  const uniformOptions=firstOptions.every((option:any)=>Number.isFinite(Number(option.value)))&&questionOptions.every(options=>JSON.stringify(options.map((option:any)=>[String(option.value),option.label]))===JSON.stringify(firstOptions.map((option:any)=>[String(option.value),option.label])));
  return {...rows[0],isVerified:Boolean(rows[0].isVerified),isBuiltin:Boolean(base.code),uniformOptions,methodology:{...base,...configured,code:rows[0].code,title:rows[0].title,summary:rows[0].description??configured.summary??base.summary??''},scoring:parseJson(rows[0].scoringConfig)??{min:1,max:5,scales:[]},cases:parseJson(rows[0].validationCases)??[],questions:questions.map((question,index)=>({text:question.text,options:questionOptions[index]}))};
};
platformRouter.get('/admin/methodology-studio',requireRole('owner','admin'),async(_req,res,next)=>{try{
  const[rows]=await db.query<any[]>(`SELECT id FROM instruments WHERE is_verified=TRUE OR code LIKE 'custom_method_%' ORDER BY is_verified DESC,updated_at DESC`);
  const instruments=await Promise.all(rows.map(row=>readStudioInstrument(row.id)));
  res.json(instruments.filter(Boolean));
}catch(e){next(e)}});
platformRouter.post('/admin/methodology-studio',requireRole('owner','admin'),async(req,res,next)=>{try{
  const body=studioSchema.parse(req.body),id=randomUUID(),code=`custom_method_${randomUUID().replaceAll('-','').slice(0,12)}`;
  await db.execute(`INSERT INTO instruments (id,owner_id,code,title,description,is_verified,scoring_code,status,methodology,scoring_config,validation_cases,formula_version) VALUES (?,NULL,?,?,?,FALSE,?,'archived',?,?,?,?)`,[id,code,body.methodology.title.trim()||'Новая методика',body.methodology.summary||null,code,JSON.stringify(body.methodology),JSON.stringify(body.scoring),JSON.stringify(body.cases),body.methodology.version||'draft']);
  res.status(201).json(await readStudioInstrument(id));
}catch(e){next(e)}});
platformRouter.put('/admin/methodology-studio/:id',requireRole('owner','admin'),async(req,res,next)=>{let connection:any;try{
  const body=studioSchema.parse(req.body),id=String(req.params.id);connection=await db.getConnection();await connection.beginTransaction();
  const[rows]=await connection.query(`SELECT id,code,title,description,is_verified isVerified,status,methodology FROM instruments WHERE id=? FOR UPDATE`,[id]);
  if(!rows.length){await connection.rollback();return res.status(404).json({message:'Методика не найдена'});}
  if(rows[0].status==='archived'&&rows[0].isVerified){await connection.rollback();return res.status(409).json({message:'Сначала восстановите методику из архива.'});}
  if(rows[0].isVerified){
    const existing=parseJson(rows[0].methodology)??{},base=methodologies[rows[0].code]??{};
    const metadata={...base,...existing,...body.methodology,title:body.methodology.title,steps:existing.steps??base.steps??[],keys:existing.keys??base.keys??[],norms:existing.norms??base.norms??[]};
    const[questions]=await connection.query(`SELECT id,options FROM instrument_questions WHERE instrument_id=? ORDER BY position FOR UPDATE`,[id]);
    if(questions.length!==body.questions.length){await connection.rollback();return res.status(409).json({message:'Нельзя менять число или порядок пунктов: от них зависит ключ автоподсчёта.'});}
    await connection.execute(`UPDATE instruments SET title=?,description=?,methodology=?,updated_at=CURRENT_TIMESTAMP WHERE id=?`,[body.methodology.title.trim()||rows[0].title,body.methodology.summary||null,JSON.stringify(metadata),id]);
    const firstOptions=parseJson(questions[0]?.options)??[];
    const canEditOptionLabels=firstOptions.length>0&&firstOptions.every((option:any)=>Number.isFinite(Number(option.value)))&&questions.every((row:any)=>JSON.stringify((parseJson(row.options)??[]).map((option:any)=>[String(option.value),option.label]))===JSON.stringify(firstOptions.map((option:any)=>[String(option.value),option.label])));
    for(const[index,question]of body.questions.entries()){
      if(canEditOptionLabels){const requested=question.options??[];if(requested.length!==firstOptions.length||requested.some((option:any,optionIndex:number)=>Number(option.value)!==Number(firstOptions[optionIndex].value))){await connection.rollback();return res.status(409).json({message:'Нельзя менять значения вариантов ответа: они связаны с ключом автоподсчёта.'});}const existingOptions=parseJson(questions[index].options)??[],updatedOptions=existingOptions.map((option:any,optionIndex:number)=>({...option,label:requested[optionIndex].label}));await connection.execute(`UPDATE instrument_questions SET text=?,options=? WHERE id=?`,[question.text,JSON.stringify(updatedOptions),questions[index].id]);}
      else await connection.execute(`UPDATE instrument_questions SET text=? WHERE id=?`,[question.text,questions[index].id]);
    }
  }else{
    await connection.execute(`UPDATE instruments SET title=?,description=?,methodology=?,scoring_config=?,validation_cases=?,formula_version=?,updated_at=CURRENT_TIMESTAMP WHERE id=?`,[body.methodology.title.trim()||'Новая методика',body.methodology.summary||null,JSON.stringify(body.methodology),JSON.stringify(body.scoring),JSON.stringify(body.cases),body.methodology.version||'draft',id]);
    await connection.execute('DELETE FROM instrument_questions WHERE instrument_id=?',[id]);
    for(const[index,question]of body.questions.entries())await connection.execute(`INSERT INTO instrument_questions (id,instrument_id,code,text,type,required,position,options) VALUES (?,?,?,?,'single',TRUE,?,?)`,[randomUUID(),id,`q${index+1}`,question.text||`Пункт ${index+1}`,index,JSON.stringify(question.options)]);
  }
  await connection.commit();res.json(await readStudioInstrument(id));
}catch(e){if(connection)await connection.rollback();next(e)}finally{connection?.release()}});
platformRouter.put('/admin/methodology-studio/:id',requireRole('owner','admin'),async(req,res,next)=>{let connection:any;try{
  const body=studioSchema.parse(req.body);connection=await db.getConnection();await connection.beginTransaction();
  const[rows]=await connection.query(`SELECT id,is_verified isVerified FROM instruments WHERE id=? AND code LIKE 'custom_method_%' FOR UPDATE`,[String(req.params.id)]);
  if(!rows.length){await connection.rollback();return res.status(404).json({message:'Черновик методики не найден'});}
  if(rows[0].isVerified){await connection.rollback();return res.status(409).json({message:'Опубликованную версию нельзя редактировать. Создайте отдельную новую версию.'});}
  await connection.execute(`UPDATE instruments SET title=?,description=?,methodology=?,scoring_config=?,validation_cases=?,formula_version=?,updated_at=CURRENT_TIMESTAMP WHERE id=?`,[body.methodology.title.trim()||'Новая методика',body.methodology.summary||null,JSON.stringify(body.methodology),JSON.stringify(body.scoring),JSON.stringify(body.cases),body.methodology.version||'draft',String(req.params.id)]);
  await connection.execute('DELETE FROM instrument_questions WHERE instrument_id=?',[String(req.params.id)]);
  for(const[index,question]of body.questions.entries())await connection.execute(`INSERT INTO instrument_questions (id,instrument_id,code,text,type,required,position,options) VALUES (?,?,?,?,'single',TRUE,?,?)`,[randomUUID(),String(req.params.id),`q${index+1}`,question.text||`Пункт ${index+1}`,index,JSON.stringify(question.options)]);
  await connection.commit();res.json(await readStudioInstrument(String(req.params.id)));
}catch(e){if(connection)await connection.rollback();next(e)}finally{connection?.release()}});
platformRouter.post('/admin/methodology-studio/validate',requireRole('owner','admin'),async(req,res,next)=>{try{
  const body=studioSchema.parse(req.body),errors=validateConfigurableMethodology(body,false),checks=errors.length?null:checkConfigurableCases({questions:body.questions,scoring:body.scoring,cases:body.cases});
  res.json({errors,checks});
}catch(e){next(e)}});
platformRouter.post('/admin/methodology-studio/:id/publish',requireRole('owner','admin'),async(req,res,next)=>{let connection:any;try{
  const id=String(req.params.id);connection=await db.getConnection();await connection.beginTransaction();
  const[rows]=await connection.query(`SELECT id,code,title,methodology,scoring_config scoringConfig,validation_cases validationCases,is_verified isVerified FROM instruments WHERE id=? AND code LIKE 'custom_method_%' FOR UPDATE`,[id]);
  if(!rows.length){await connection.rollback();return res.status(404).json({message:'Методика не найдена'});}
  if(rows[0].isVerified){await connection.rollback();return res.status(409).json({message:'Эта версия уже опубликована.'});}
  const[questions]=await connection.query(`SELECT text,options FROM instrument_questions WHERE instrument_id=? ORDER BY position`,[id]);
  const draft={methodology:parseJson(rows[0].methodology)??{},scoring:parseJson(rows[0].scoringConfig)??{},cases:parseJson(rows[0].validationCases)??[],questions:questions.map((question:any)=>({text:question.text,options:parseJson(question.options)??[]}))};
  const errors=validateConfigurableMethodology(draft,true),checks=errors.length?null:checkConfigurableCases(draft);
  if(errors.length||!checks?.passed){await connection.rollback();return res.status(409).json({message:'Публикация не прошла проверку.',errors,checks});}
  const[result]=await connection.execute(`UPDATE instruments SET is_verified=TRUE,status='active',scoring_code=code,formula_version=?,updated_at=CURRENT_TIMESTAMP WHERE id=? AND is_verified=FALSE`,[draft.methodology.version,id]);
  if(!result.affectedRows){await connection.rollback();return res.status(409).json({message:'Методика уже была изменена другим администратором. Обновите страницу и проверьте её снова.'});}
  await connection.commit();res.json({ok:true,instrument:await readStudioInstrument(id)});
}catch(e){if(connection)await connection.rollback();next(e)}finally{connection?.release()}});
platformRouter.delete('/admin/methodology-studio/:id',requireRole('owner','admin'),async(req,res,next)=>{try{
  const id=String(req.params.id),[rows]=await db.query<any[]>(`SELECT id,is_verified isVerified,code,methodology FROM instruments WHERE id=?`,[id]);
  if(!rows.length)return res.status(404).json({message:'Методика не найдена.'});
  if(rows[0].isVerified){const metadata=parseJson(rows[0].methodology)??methodologies[rows[0].code]??{};await db.execute(`UPDATE instruments SET status='archived',methodology=?,updated_at=CURRENT_TIMESTAMP WHERE id=?`,[JSON.stringify(metadata),id]);return res.json({ok:true,archived:true});}
  const[result]=await db.execute<any>(`DELETE FROM instruments WHERE id=? AND code LIKE 'custom_method_%' AND is_verified=FALSE`,[id]);
  if(!result.affectedRows)return res.status(409).json({message:'Нельзя удалить эту методику.'});res.json({ok:true,archived:false});
}catch(e){next(e)}});
platformRouter.post('/admin/methodology-studio/:id/restore',requireRole('owner','admin'),async(req,res,next)=>{try{
  const[result]=await db.execute<any>(`UPDATE instruments SET status='active',updated_at=CURRENT_TIMESTAMP WHERE id=? AND is_verified=TRUE AND status='archived'`,[String(req.params.id)]);
  if(!result.affectedRows)return res.status(404).json({message:'Методика не найдена в архиве.'});res.json({ok:true});
}catch(e){next(e)}});
platformRouter.delete('/admin/methodology-studio/:id',requireRole('owner','admin'),async(req,res,next)=>{try{
  const[usage]=await db.query<any[]>(`SELECT COUNT(*) count FROM sections WHERE source_instrument_id=?`,[String(req.params.id)]);
  if(Number(usage[0]?.count)>0)return res.status(409).json({message:'Методика уже включена в опрос и не может быть удалена.'});
  const[result]=await db.execute<any>(`DELETE FROM instruments WHERE id=? AND code LIKE 'custom_method_%' AND is_verified=FALSE`,[String(req.params.id)]);
  if(!result.affectedRows)return res.status(404).json({message:'Черновик не найден или уже опубликован.'});res.json({ok:true});
}catch(e){next(e)}});
const insertRespondentSection=async(connection:any,surveyId:string|string[])=>{const sectionId=randomUUID();await connection.execute("INSERT INTO sections (id,survey_id,code,title,description,position,section_kind) VALUES (?,?, 'respondent','О респонденте','',0,'custom')",[sectionId,surveyId]);await connection.execute("INSERT INTO questions (id,section_id,code,text,type,required,position,options,validation) VALUES (?,?,'alias','Представьтесь или укажите псевдоним','text',TRUE,0,NULL,NULL)",[randomUUID(),sectionId])};
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
platformRouter.post('/account/surveys/draft',requireAuth,async(req:AuthRequest,res,next)=>{try{const state=builderStateSchema.parse(req.body),id=randomUUID(),title=state.meta.title.trim()||'Новый опрос',slug=await uniqueSlug('surveys','slug',title);await db.execute(`INSERT INTO surveys (id,owner_id,slug,title,description,welcome_title,welcome_text,status,show_author,settings,builder_state) VALUES (?,?,?,?,?,?,?,'draft',?,?,?)`,[id,req.user!.id,slug,title,state.meta.description,state.meta.welcomeTitle,state.meta.welcomeText,state.meta.showAuthor,JSON.stringify({showSectionTitles:false,resultPresentation:state.meta.resultPresentation}),JSON.stringify(state)]);res.status(201).json({id,slug})}catch(e){next(e)}});
platformRouter.put('/account/surveys/:id/draft-state',requireAuth,async(req:AuthRequest,res,next)=>{try{const state=builderStateSchema.parse(req.body),title=state.meta.title.trim()||'Новый опрос';const[result]=await db.execute<any>(`UPDATE surveys SET title=?,description=?,welcome_title=?,welcome_text=?,show_author=?,settings=?,builder_state=? WHERE id=? AND owner_id=? AND status='draft' AND deleted_at IS NULL`,[title,state.meta.description,state.meta.welcomeTitle,state.meta.welcomeText,state.meta.showAuthor,JSON.stringify({showSectionTitles:false,resultPresentation:state.meta.resultPresentation}),JSON.stringify(state),req.params.id,req.user!.id]);if(!result.affectedRows)return res.status(404).json({message:'Черновик не найден'});res.json({ok:true})}catch(e){next(e)}});
platformRouter.get('/account/surveys/:id',requireAuth,async(req:AuthRequest,res,next)=>{try{
  const[surveys]=await db.query<any[]>(`SELECT s.id,s.slug,s.title,s.description,s.welcome_title welcomeTitle,s.welcome_text welcomeText,s.status,s.settings,s.show_author showAuthor,s.builder_state builderState,(SELECT COUNT(*) FROM response_sessions rs WHERE rs.survey_id=s.id) responseCount FROM surveys s WHERE s.id=? AND s.owner_id=? AND s.deleted_at IS NULL`,[req.params.id,req.user!.id]);if(!surveys.length)return res.status(404).json({message:'Опрос не найден'});
  const draftState=parseJson(surveys[0].builderState);if(draftState)return res.json({...surveys[0],...draftState.meta,sections:draftState.sections,builderOpen:draftState.open??{},responseCount:0});
  const[sections]=await db.query<any[]>(`SELECT id,code,title,description,position,source_instrument_id instrumentId,section_kind sectionKind FROM sections WHERE survey_id=? ORDER BY position`,[req.params.id]);
  const[questions]=await db.query<any[]>(`SELECT q.id,q.section_id sectionId,q.text,q.type,q.required,q.options,q.validation,q.position FROM questions q JOIN sections s ON s.id=q.section_id WHERE s.survey_id=? ORDER BY s.position,q.position`,[req.params.id]);
  const settings=parseJson(surveys[0].settings)??{},collectAlias=sections.some(section=>section.code==='respondent');res.json({...surveys[0],settings,collectAlias,resultPresentation:settings.resultPresentation??{showResults:true,showScores:true,title:'Спасибо за ваши ответы',text:''},sections:sections.filter(section=>section.code!=='respondent').map(section=>section.instrumentId?{id:section.id,kind:'library',instrumentId:section.instrumentId,title:section.title,questionCount:questions.filter(q=>q.sectionId===section.id).length,isVerified:section.sectionKind==='verified'}:{id:section.id,kind:'custom',title:section.title,questions:questions.filter(q=>q.sectionId===section.id).map(q=>({...q,required:Boolean(q.required),options:parseJson(q.options)??[],validation:parseJson(q.validation)}))})});
}catch(e){next(e)}});

platformRouter.put('/account/surveys/:id',requireAuth,async(req:AuthRequest,res,next)=>{let connection;try{
  const body=createSurveySchema.parse(req.body);connection=await db.getConnection();await connection.beginTransaction();const[surveys]=await connection.query<any[]>('SELECT id FROM surveys WHERE id=? AND owner_id=? AND deleted_at IS NULL FOR UPDATE',[req.params.id,req.user!.id]);if(!surveys.length){await connection.rollback();return res.status(404).json({message:'Опрос не найден'})}const[countRows]=await connection.query<any[]>('SELECT COUNT(*) count FROM response_sessions WHERE survey_id=?',[req.params.id]);const structureLocked=Number(countRows[0].count)>0;
  await connection.execute('UPDATE surveys SET title=?,description=?,welcome_title=?,welcome_text=?,status=?,show_author=?,settings=?,builder_state=NULL WHERE id=?',[body.title,body.description,body.welcomeTitle,body.welcomeText,body.status,body.showAuthor,JSON.stringify({showSectionTitles:false,resultPresentation:body.resultPresentation}),req.params.id]);
  if(!structureLocked){await connection.execute('DELETE FROM sections WHERE survey_id=?',[req.params.id]);if(body.collectAlias)await insertRespondentSection(connection,req.params.id);for(const[position,section]of body.sections.entries()){const sectionId=randomUUID(),storedPosition=position+(body.collectAlias?1:0);if(section.kind==='library'){const[instruments]=await connection.query<any[]>(`SELECT id,code,title,description,is_verified FROM instruments WHERE id=? AND status='active' AND (is_verified=TRUE OR owner_id=?)`,[section.instrumentId,req.user!.id]);if(!instruments.length)throw Object.assign(new Error('Методика не найдена'),{status:400});const instrument=instruments[0];await connection.execute('INSERT INTO sections (id,survey_id,code,title,description,position,source_instrument_id,section_kind) VALUES (?,?,?,?,?,?,?,?)',[sectionId,req.params.id,instrument.code??`custom-${position+1}`,instrument.title,instrument.description,storedPosition,instrument.id,instrument.is_verified?'verified':'custom']);await connection.execute(`INSERT INTO questions (id,section_id,code,text,type,required,position,options,validation) SELECT UUID(),?,code,text,type,required,position,options,validation FROM instrument_questions WHERE instrument_id=? ORDER BY position`,[sectionId,instrument.id])}else{await connection.execute('INSERT INTO sections (id,survey_id,code,title,description,position,section_kind) VALUES (?,?,?,?,?,?,\'custom\')',[sectionId,req.params.id,`custom-${position+1}-${randomUUID().slice(0,6)}`,section.title,section.description,storedPosition]);for(const[index,question]of section.questions.entries())await connection.execute('INSERT INTO questions (id,section_id,code,text,type,required,position,options,validation) VALUES (?,?,?,?,?,?,?,?,?)',[randomUUID(),sectionId,`q${index+1}`,question.text,question.type,question.required,index,question.options?JSON.stringify(question.options):null,question.validation?JSON.stringify(question.validation):null])}}}
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
  if(body.collectAlias)await insertRespondentSection(connection,surveyId);
  for(const[position,section]of body.sections.entries()){
    const sectionId=randomUUID(),storedPosition=position+(body.collectAlias?1:0);
    if(section.kind==='library'){
      const[instruments]=await connection.query<any[]>(`SELECT id,code,title,description,is_verified FROM instruments WHERE id=? AND status='active' AND (is_verified=TRUE OR owner_id=?)`,[section.instrumentId,req.user!.id]);if(!instruments.length)throw Object.assign(new Error('Методика не найдена'),{status:400});const instrument=instruments[0];
      await connection.execute('INSERT INTO sections (id,survey_id,code,title,description,position,source_instrument_id,section_kind) VALUES (?,?,?,?,?,?,?,?)',[sectionId,surveyId,instrument.code??`custom-${position+1}`,instrument.title,instrument.description,storedPosition,instrument.id,instrument.is_verified?'verified':'custom']);
      await connection.execute(`INSERT INTO questions (id,section_id,code,text,type,required,position,options,validation) SELECT UUID(),?,code,text,type,required,position,options,validation FROM instrument_questions WHERE instrument_id=? ORDER BY position`,[sectionId,instrument.id]);
    }else{
      await connection.execute('INSERT INTO sections (id,survey_id,code,title,description,position,section_kind) VALUES (?,?,?,?,?,?,\'custom\')',[sectionId,surveyId,`custom-${position+1}-${randomUUID().slice(0,6)}`,section.title,section.description,storedPosition]);
      for(const[index,question]of section.questions.entries())await connection.execute('INSERT INTO questions (id,section_id,code,text,type,required,position,options,validation) VALUES (?,?,?,?,?,?,?,?,?)',[randomUUID(),sectionId,`q${index+1}`,question.text,question.type,question.required,index,question.options?JSON.stringify(question.options):null,question.validation?JSON.stringify(question.validation):null]);
    }
  }
  await connection.commit();res.status(201).json({id:surveyId,slug});
}catch(e:any){if(connection)await connection.rollback();if(e?.status)return res.status(e.status).json({message:e.message});next(e)}finally{connection?.release()}});
