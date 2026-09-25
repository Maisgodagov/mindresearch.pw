import {Router} from 'express';
import bcrypt from 'bcryptjs';
import {randomUUID} from 'node:crypto';
import {z} from 'zod';
import {db} from './db.js';
import {requireAuth,signToken,type AuthRequest} from './auth.js';
import {methodologies} from './scoring/methodologies.js';

export const platformRouter=Router();
const slugify=(input:string)=>input.toLowerCase().trim().replace(/[^a-z0-9а-яё]+/gi,'-').replace(/^-|-$/g,'').slice(0,90);
const uniqueSlug=async(table:'users'|'surveys',column:'public_slug'|'slug',preferred:string)=>{const base=slugify(preferred)||`profile-${Math.random().toString(36).slice(2,8)}`;for(let n=0;n<100;n++){const slug=n?`${base}-${n+1}`:base;const[rows]=await db.query<any[]>(`SELECT id FROM ${table} WHERE ${column}=?`,[slug]);if(!rows.length)return slug}return `${base}-${randomUUID().slice(0,8)}`};

platformRouter.post('/auth/register',async(req,res,next)=>{try{
  const body=z.object({name:z.string().trim().min(2).max(120),email:z.string().email().max(255),password:z.string().min(8).max(100)}).parse(req.body);
  const[exists]=await db.query<any[]>('SELECT id FROM users WHERE email=?',[body.email.toLowerCase()]);if(exists.length)return res.status(409).json({message:'Пользователь с такой почтой уже зарегистрирован'});
  const id=randomUUID(),publicSlug=await uniqueSlug('users','public_slug',body.name);
  await db.execute('INSERT INTO users (id,email,password_hash,name,role,public_slug) VALUES (?,?,?,?,\'researcher\',?)',[id,body.email.toLowerCase(),await bcrypt.hash(body.password,12),body.name,publicSlug]);
  const user={id,email:body.email.toLowerCase(),name:body.name,role:'researcher',publicSlug,isProfilePublic:false};res.status(201).json({token:signToken({id,role:'researcher'}),user});
}catch(e){next(e)}});

platformRouter.get('/account/me',requireAuth,async(req:AuthRequest,res,next)=>{try{const[rows]=await db.query<any[]>('SELECT id,email,name,role,bio,avatar_url avatarUrl,public_slug publicSlug,is_profile_public isProfilePublic,created_at createdAt FROM users WHERE id=?',[req.user!.id]);if(!rows.length)return res.status(404).json({message:'Профиль не найден'});res.json(rows[0])}catch(e){next(e)}});
platformRouter.patch('/account/me',requireAuth,async(req:AuthRequest,res,next)=>{try{
  const body=z.object({name:z.string().trim().min(2).max(120),bio:z.string().max(3000).default(''),avatarUrl:z.union([z.string().url().max(2000),z.literal('')]).default(''),publicSlug:z.string().trim().min(3).max(120).regex(/^[a-z0-9а-яё-]+$/i),isProfilePublic:z.boolean()}).parse(req.body);
  const[conflict]=await db.query<any[]>('SELECT id FROM users WHERE public_slug=? AND id<>?',[body.publicSlug,req.user!.id]);if(conflict.length)return res.status(409).json({message:'Этот адрес профиля уже занят'});
  await db.execute('UPDATE users SET name=?,bio=?,avatar_url=?,public_slug=?,is_profile_public=? WHERE id=?',[body.name,body.bio,body.avatarUrl||null,body.publicSlug,body.isProfilePublic,req.user!.id]);res.json({ok:true});
}catch(e){next(e)}});

platformRouter.get('/public/profiles/:slug',async(req,res,next)=>{try{
  const[profiles]=await db.query<any[]>('SELECT id,name,bio,avatar_url avatarUrl,public_slug publicSlug FROM users WHERE public_slug=? AND is_profile_public=TRUE',[req.params.slug]);if(!profiles.length)return res.status(404).json({message:'Публичный профиль не найден'});
  const[surveys]=await db.query<any[]>(`SELECT id,slug,title,description,created_at createdAt FROM surveys WHERE owner_id=? AND status='active' ORDER BY created_at DESC`,[profiles[0].id]);res.json({...profiles[0],surveys});
}catch(e){next(e)}});

platformRouter.get('/account/instruments',requireAuth,async(req:AuthRequest,res,next)=>{try{
  const[rows]=await db.query<any[]>(`SELECT i.id,i.code,i.title,i.description,i.is_verified isVerified,i.scoring_code scoringCode,COUNT(q.id) questionCount FROM instruments i LEFT JOIN instrument_questions q ON q.instrument_id=i.id WHERE i.status='active' AND (i.is_verified=TRUE OR i.owner_id=?) GROUP BY i.id ORDER BY i.is_verified DESC,i.title`,[req.user!.id]);
  const authors:Record<string,string>={test_1:'Gregory Zimet, Nancy Dahlem, Sara Zimet, Gordon Farley',test_2:'В. И. Моросанова, Н. Г. Кондратюк',test_3:'Jennifer Campbell и соавторы',test_4:'David Moscovitch, Keith Huyder',test_5:'David Garner, Marion Olmsted, Janet Polivy',test_6:'Tatjana van Strien и соавторы'};
  res.json(rows.map(row=>({...row,author:authors[row.code]??null,methodology:methodologies[row.code]??null})));
}catch(e){next(e)}});

const optionSchema=z.object({value:z.string().min(1).max(120),label:z.string().trim().min(1).max(500)});
const questionSchema=z.object({text:z.string().trim().min(1).max(5000),type:z.enum(['single','multiple','text','number']),required:z.boolean().default(true),options:z.array(optionSchema).max(30).optional(),validation:z.record(z.string(),z.unknown()).optional()}).superRefine((q,ctx)=>{if((q.type==='single'||q.type==='multiple')&&(!q.options||q.options.length<2))ctx.addIssue({code:'custom',message:'Добавьте минимум два варианта ответа',path:['options']})});
const createSurveySchema=z.object({title:z.string().trim().min(2).max(255),slug:z.string().trim().max(120).optional(),description:z.string().max(3000).default(''),welcomeTitle:z.string().trim().min(2).max(255),welcomeText:z.string().trim().min(2).max(5000),status:z.enum(['draft','active']).default('draft'),showAuthor:z.boolean().default(true),sections:z.array(z.discriminatedUnion('kind',[z.object({kind:z.literal('library'),instrumentId:z.string().uuid()}),z.object({kind:z.literal('custom'),title:z.string().trim().min(1).max(255),description:z.string().max(2000).default(''),questions:z.array(questionSchema).min(1).max(300)})])).min(1).max(30)});

platformRouter.post('/account/surveys',requireAuth,async(req:AuthRequest,res,next)=>{let connection;try{
  const body=createSurveySchema.parse(req.body),slug=await uniqueSlug('surveys','slug',body.slug||body.title),surveyId=randomUUID();connection=await db.getConnection();await connection.beginTransaction();
  await connection.execute(`INSERT INTO surveys (id,owner_id,slug,title,welcome_title,welcome_text,status,settings,description,show_author) VALUES (?,?,?,?,?,?,?,?,?,?)`,[surveyId,req.user!.id,slug,body.title,body.welcomeTitle,body.welcomeText,body.status,JSON.stringify({showSectionTitles:false}),body.description,body.showAuthor]);
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
