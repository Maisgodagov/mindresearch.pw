import { randomUUID } from 'node:crypto';
import bcrypt from 'bcryptjs';
import data from './data/survey.json' with { type: 'json' };
import { shamInstrument } from './data/sham.js';
import { amsInstrument } from './data/ams.js';
import { studyAlienationInstrument } from './data/studyAlienation.js';
import { gpsInstrument } from './data/gps.js';
import { ppsInstrument } from './data/pps.js';
import { bfi2Instrument } from './data/bfi2.js';
import { bfi2ShortInstrument } from './data/bfi2Short.js';
import { tipiRuInstrument } from './data/tipiRu.js';
import { ipipNeo120Instrument } from './data/ipipNeo120.js';
import { miniIpipInstrument } from './data/miniIpip.js';
import { rsesInstrument } from './data/rses.js';
import { csesInstrument } from './data/cses.js';
import { gsesInstrument } from './data/gses.js';
import { briefCopeRuInstrument } from './data/briefCopeRu.js';
import { munInstrument } from './data/mun.js';
import { paqShortRuInstrument, paqShortRuScoring, paqShortRuValidationCases } from './data/paqShortRu.js';
import { caasRuInstrument, caasRuScoring, caasRuValidationCases } from './data/caasRu.js';
import { iafRuInstrument } from './data/iafRu.js';
import { bsmasRuInstrument } from './data/bsmasRu.js';
import { smdsRuInstrument } from './data/smdsRu.js';
import { fomosRuInstrument } from './data/fomosRu.js';
import { nmpqRuInstrument } from './data/nmpqRu.js';
import { cavRuInstrument } from './data/cavRu.js';
import { igds9RuInstrument } from './data/igds9Ru.js';
import { bfasRuInstrument, bfasRuScoring, bfasRuValidationCases } from './data/bfasRu.js';
import { fivePfqInstrument, fivePfqScoring, fivePfqValidationCases } from './data/fivePfq.js';
import { cpmqRuInstrument, cpmqRuScoring, cpmqRuValidationCases } from './data/cpmqRu.js';
import { bisBasRuInstrument, bisBasRuScoring, bisBasRuValidationCases } from './data/bisBasRu.js';
import { spsrqJuniorRuInstrument, spsrqChildRuInstrument, spsrqJuniorRuScoring, spsrqChildRuScoring, spsrqJuniorRuValidationCases, spsrqChildRuValidationCases } from './data/spsrqRu.js';
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
    let seedInstrumentQuestions=true;
    if(section.code.startsWith('test_')){
      const[instruments]=await db.query<any[]>('SELECT id,methodology FROM instruments WHERE code=?',[section.code]);
      instrumentId=instruments[0]?.id??randomUUID();
      seedInstrumentQuestions=!instruments[0]?.methodology;
      if(!instruments.length)await db.execute('INSERT INTO instruments (id,code,title,description,is_verified,scoring_code) VALUES (?,?,?,?,TRUE,?)',[instrumentId,section.code,section.title,section.description??null,section.code]);
      else await db.execute('UPDATE instruments SET title=IF(methodology IS NULL,?,title),description=IF(methodology IS NULL,?,description),is_verified=TRUE,scoring_code=?,status=IF(methodology IS NULL,\'active\',status) WHERE id=?',[section.title,section.description??null,section.code,instrumentId]);
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
      if(instrumentId&&seedInstrumentQuestions){const[iq]=await db.query<any[]>('SELECT id FROM instrument_questions WHERE instrument_id=? AND code=?',[instrumentId,q.code]);if(iq.length)await db.execute('UPDATE instrument_questions SET text=?,type=?,required=?,position=?,options=?,validation=? WHERE id=?',[...values,iq[0].id]);else await db.execute('INSERT INTO instrument_questions (id,instrument_id,code,text,type,required,position,options,validation) VALUES (?,?,?,?,?,?,?,?,?)',[randomUUID(),instrumentId,q.code,...values])}
    }
  }
  const verifiedInstruments:SeedSection[]=[shamInstrument,amsInstrument,studyAlienationInstrument,gpsInstrument,ppsInstrument,bfi2Instrument,bfi2ShortInstrument,tipiRuInstrument,ipipNeo120Instrument,miniIpipInstrument,rsesInstrument,csesInstrument,gsesInstrument,briefCopeRuInstrument,munInstrument,paqShortRuInstrument,caasRuInstrument,iafRuInstrument,bsmasRuInstrument,smdsRuInstrument,fomosRuInstrument,nmpqRuInstrument,cavRuInstrument,igds9RuInstrument,bfasRuInstrument,fivePfqInstrument,cpmqRuInstrument,bisBasRuInstrument,spsrqJuniorRuInstrument,spsrqChildRuInstrument];
  for(const instrument of verifiedInstruments){
    const[rows]=await db.query<any[]>('SELECT id,methodology FROM instruments WHERE code=?',[instrument.code]);
    const instrumentId=rows[0]?.id??randomUUID();
    const scoringConfig=instrument.code==='test_22'?paqShortRuScoring:instrument.code==='test_23'?caasRuScoring:instrument.code==='test_31'?bfasRuScoring:instrument.code==='test_32'?fivePfqScoring:instrument.code==='test_33'?cpmqRuScoring:instrument.code==='test_34'?bisBasRuScoring:instrument.code==='test_35'?spsrqJuniorRuScoring:instrument.code==='test_36'?spsrqChildRuScoring:null;
    const validationCases=instrument.code==='test_22'?paqShortRuValidationCases:instrument.code==='test_23'?caasRuValidationCases:instrument.code==='test_31'?bfasRuValidationCases:instrument.code==='test_32'?fivePfqValidationCases:instrument.code==='test_33'?cpmqRuValidationCases:instrument.code==='test_34'?bisBasRuValidationCases:instrument.code==='test_35'?spsrqJuniorRuValidationCases:instrument.code==='test_36'?spsrqChildRuValidationCases:null;
    const formulaVersion=instrument.code==='test_22'?'paq-s-ru-larionow-2024-v1':instrument.code==='test_23'?'caas-ru-kondratyuk-2021-v1':instrument.code==='test_31'?'bfas-ru-golubkova-2025-v1':instrument.code==='test_32'?'5pfq-ru-khromov-2000-v1':instrument.code==='test_33'?'cpmq-ru-tatarko-maklasova-grigoryan-2019-v1':instrument.code==='test_34'?'bis-bas-ru-knyazev-slobodskaya-2004-v1':instrument.code==='test_35'?'spsrq-j-ru-kuznetsova-slobodskaya-rippinen-2013-v1':instrument.code==='test_36'?'spsr-c-ru-kuznetsova-slobodskaya-2010-v1':null;
    if(!rows.length)await db.execute('INSERT INTO instruments (id,code,title,description,is_verified,scoring_code,scoring_config,validation_cases,formula_version) VALUES (?,?,?,?,TRUE,?,?,?,?)',[instrumentId,instrument.code,instrument.title,instrument.description??null,instrument.code,scoringConfig?JSON.stringify(scoringConfig):null,validationCases?JSON.stringify(validationCases):null,formulaVersion]);
    else await db.execute('UPDATE instruments SET title=IF(methodology IS NULL,?,title),description=IF(methodology IS NULL,?,description),is_verified=TRUE,scoring_code=?,status=IF(methodology IS NULL,\'active\',status),scoring_config=IF(? IS NOT NULL,?,scoring_config),validation_cases=IF(? IS NOT NULL,?,validation_cases),formula_version=IF(? IS NOT NULL,?,formula_version) WHERE id=?',[instrument.title,instrument.description??null,instrument.code,scoringConfig,scoringConfig?JSON.stringify(scoringConfig):null,validationCases,validationCases?JSON.stringify(validationCases):null,formulaVersion,formulaVersion,instrumentId]);
    for(const[position,question]of (rows[0]?.methodology?[]:instrument.questions).entries()){
      const[existing]=await db.query<any[]>('SELECT id FROM instrument_questions WHERE instrument_id=? AND code=?',[instrumentId,question.code]);
      const values=[question.text,question.type,question.required!==false,position,question.options?JSON.stringify(question.options):null,question.validation?JSON.stringify(question.validation):null];
      if(existing.length)await db.execute('UPDATE instrument_questions SET text=?,type=?,required=?,position=?,options=?,validation=? WHERE id=?',[...values,existing[0].id]);
      else await db.execute('INSERT INTO instrument_questions (id,instrument_id,code,text,type,required,position,options,validation) VALUES (?,?,?,?,?,?,?,?,?)',[randomUUID(),instrumentId,question.code,...values]);
    }
  }
  console.log(`Survey ready: ${data.reduce((n,s)=>n+s.questions.length,0)} questions; /s/anketa`);
}

if(import.meta.url===`file://${process.argv[1].replace(/\\/g,'/')}`) seed().then(()=>db.end()).catch(e=>{console.error(e);process.exit(1)});
