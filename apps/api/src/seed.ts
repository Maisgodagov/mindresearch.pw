import { randomUUID } from 'node:crypto';
import bcrypt from 'bcryptjs';
import data from './data/survey.json' with { type: 'json' };
import { db, migrate } from './db.js';
import type { SeedSection } from './types.js';

export async function seed() {
  await migrate();
  const email=process.env.ADMIN_EMAIL ?? 'admin@example.ru';
  const password=process.env.ADMIN_PASSWORD ?? 'change-me-now';
  const [users]=await db.query<any[]>('SELECT id FROM users WHERE email=?',[email]);
  const ownerId=users[0]?.id ?? randomUUID();
  if(!users.length) await db.execute('INSERT INTO users (id,email,password_hash,name) VALUES (?,?,?,?)',[ownerId,email,await bcrypt.hash(password,12),'Евгения']);
  const [surveys]=await db.query<any[]>('SELECT id FROM surveys WHERE slug=?',['anketa']);
  const surveyId=surveys[0]?.id ?? randomUUID();
  if(!surveys.length) await db.execute(`INSERT INTO surveys (id,owner_id,slug,title,welcome_title,welcome_text,status,settings) VALUES (?,?,?,?,?,?,'active',?)`,[surveyId,ownerId,'anketa','Анкета','Спасибо, что решили принять участие','Опрос анонимный. Здесь нет правильных или неправильных ответов — важен только ваш личный опыт. Прохождение займёт около 25–35 минут, а ответы сохраняются автоматически.',JSON.stringify({showSectionTitles:false,estimatedMinutes:30})]);
  for(const [si,section] of (data as SeedSection[]).entries()) {
    const [rows]=await db.query<any[]>('SELECT id FROM sections WHERE survey_id=? AND code=?',[surveyId,section.code]);
    const sectionId=rows[0]?.id ?? randomUUID();
    if(!rows.length) await db.execute('INSERT INTO sections (id,survey_id,code,title,description,position) VALUES (?,?,?,?,?,?)',[sectionId,surveyId,section.code,section.title,section.description??null,si]);
    for(const [qi,q] of section.questions.entries()) {
      const [existing]=await db.query<any[]>('SELECT id FROM questions WHERE section_id=? AND code=?',[sectionId,q.code]);
      if(!existing.length) await db.execute('INSERT INTO questions (id,section_id,code,text,type,required,position,options,validation) VALUES (?,?,?,?,?,?,?,?,?)',[randomUUID(),sectionId,q.code,q.text,q.type,q.required!==false,qi,q.options?JSON.stringify(q.options):null,q.validation?JSON.stringify(q.validation):null]);
    }
  }
  console.log(`Survey ready: ${data.reduce((n,s)=>n+s.questions.length,0)} questions; /s/anketa`);
}

if(import.meta.url===`file://${process.argv[1].replace(/\\/g,'/')}`) seed().then(()=>db.end()).catch(e=>{console.error(e);process.exit(1)});
