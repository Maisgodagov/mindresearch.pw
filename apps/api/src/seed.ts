import { randomUUID } from 'node:crypto';
import bcrypt from 'bcryptjs';
import data from './data/survey.json' with { type: 'json' };
import { shamInstrument } from './data/sham.js';
import { amsInstrument } from './data/ams.js';
import { studyAlienationInstrument } from './data/studyAlienation.js';
import { gpsInstrument } from './data/gps.js';
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
  const welcomeTitle='Спасибо, что решили принять участие';
  const welcomeText='Данное исследование посвящено особенностям пищевого поведения, отношения к себе и саморегуляции у женщин.\n\nВ исследовании нет «правильных» или «неправильных» ответов. Пожалуйста, выбирайте те варианты, которые наиболее точно отражают ваш личный опыт, чувства и особенности поведения.\n\nПолученные данные будут использоваться исключительно в научных целях и анализироваться только в обобщённом виде.\n\nПрохождение займёт около 25–35 минут. Ответы сохраняются автоматически, поэтому при необходимости можно прерваться и продолжить позже.';
  if(!surveys.length) await db.execute(`INSERT INTO surveys (id,owner_id,slug,title,welcome_title,welcome_text,status,settings) VALUES (?,?,?,?,?,?,'active',?)`,[surveyId,ownerId,'anketa','Анкета',welcomeTitle,welcomeText,JSON.stringify({showSectionTitles:false,estimatedMinutes:30})]);
  else await db.execute('UPDATE surveys SET welcome_title=?,welcome_text=? WHERE id=?',[welcomeTitle,welcomeText,surveyId]);
  for(const [si,section] of (data as SeedSection[]).entries()) {
    let instrumentId:string|null=null;
    if(section.code.startsWith('test_')){
      const[instruments]=await db.query<any[]>('SELECT id FROM instruments WHERE code=?',[section.code]);
      instrumentId=instruments[0]?.id??randomUUID();
      if(!instruments.length)await db.execute('INSERT INTO instruments (id,code,title,description,is_verified,scoring_code) VALUES (?,?,?,?,TRUE,?)',[instrumentId,section.code,section.title,section.description??null,section.code]);
      else await db.execute('UPDATE instruments SET title=?,description=?,is_verified=TRUE,scoring_code=?,status=\'active\' WHERE id=?',[section.title,section.description??null,section.code,instrumentId]);
    }
    const [rows]=await db.query<any[]>('SELECT id FROM sections WHERE survey_id=? AND code=?',[surveyId,section.code]);
    const sectionId=rows[0]?.id ?? randomUUID();
    if(!rows.length) await db.execute('INSERT INTO sections (id,survey_id,code,title,description,position,source_instrument_id,section_kind) VALUES (?,?,?,?,?,?,?,?)',[sectionId,surveyId,section.code,section.title,section.description??null,si,instrumentId,instrumentId?'verified':'custom']);
    else await db.execute('UPDATE sections SET source_instrument_id=?,section_kind=? WHERE id=?',[instrumentId,instrumentId?'verified':'custom',sectionId]);
    for(const [qi,q] of section.questions.entries()) {
      const [existing]=await db.query<any[]>('SELECT id FROM questions WHERE section_id=? AND code=?',[sectionId,q.code]);
      const values=[q.text,q.type,q.required!==false,qi,q.options?JSON.stringify(q.options):null,q.validation?JSON.stringify(q.validation):null];
      if(existing.length) await db.execute('UPDATE questions SET text=?,type=?,required=?,position=?,options=?,validation=? WHERE id=?',[...values,existing[0].id]);
      else await db.execute('INSERT INTO questions (id,section_id,code,text,type,required,position,options,validation) VALUES (?,?,?,?,?,?,?,?,?)',[randomUUID(),sectionId,q.code,...values]);
      if(instrumentId){const[iq]=await db.query<any[]>('SELECT id FROM instrument_questions WHERE instrument_id=? AND code=?',[instrumentId,q.code]);if(iq.length)await db.execute('UPDATE instrument_questions SET text=?,type=?,required=?,position=?,options=?,validation=? WHERE id=?',[...values,iq[0].id]);else await db.execute('INSERT INTO instrument_questions (id,instrument_id,code,text,type,required,position,options,validation) VALUES (?,?,?,?,?,?,?,?,?)',[randomUUID(),instrumentId,q.code,...values])}
    }
  }
  const verifiedInstruments:SeedSection[]=[shamInstrument,amsInstrument,studyAlienationInstrument,gpsInstrument];
  for(const instrument of verifiedInstruments){
    const[rows]=await db.query<any[]>('SELECT id FROM instruments WHERE code=?',[instrument.code]);
    const instrumentId=rows[0]?.id??randomUUID();
    if(!rows.length)await db.execute('INSERT INTO instruments (id,code,title,description,is_verified,scoring_code) VALUES (?,?,?,?,TRUE,?)',[instrumentId,instrument.code,instrument.title,instrument.description??null,instrument.code]);
    else await db.execute('UPDATE instruments SET title=?,description=?,is_verified=TRUE,scoring_code=?,status=\'active\' WHERE id=?',[instrument.title,instrument.description??null,instrument.code,instrumentId]);
    for(const[position,question]of instrument.questions.entries()){
      const[existing]=await db.query<any[]>('SELECT id FROM instrument_questions WHERE instrument_id=? AND code=?',[instrumentId,question.code]);
      const values=[question.text,question.type,question.required!==false,position,question.options?JSON.stringify(question.options):null,question.validation?JSON.stringify(question.validation):null];
      if(existing.length)await db.execute('UPDATE instrument_questions SET text=?,type=?,required=?,position=?,options=?,validation=? WHERE id=?',[...values,existing[0].id]);
      else await db.execute('INSERT INTO instrument_questions (id,instrument_id,code,text,type,required,position,options,validation) VALUES (?,?,?,?,?,?,?,?,?)',[randomUUID(),instrumentId,question.code,...values]);
    }
  }
  console.log(`Survey ready: ${data.reduce((n,s)=>n+s.questions.length,0)} questions; /s/anketa`);
}

if(import.meta.url===`file://${process.argv[1].replace(/\\/g,'/')}`) seed().then(()=>db.end()).catch(e=>{console.error(e);process.exit(1)});
