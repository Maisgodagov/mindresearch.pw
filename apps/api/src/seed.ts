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
import { scsRuInstrument, riscRuInstrument, didsRuInstrument, selfConstrualScoring, riscScoring, didsScoring, selfConstrualValidationCases, riscValidationCases, didsValidationCases } from './data/selfConstrualRu.js';
import { isriRuInstrument, isriRuScoring, isriRuValidationCases } from './data/isriRu.js';
import { aiqIvRuInstrument, aiqIvRuScoring, aiqIvRuValidationCases } from './data/aiqIvRu.js';
import { loskRuInstrument, loskRuScoring, loskRuValidationCases } from './data/loskRu.js';
import { makarevskayaPersonalIdentityRuInstrument, makarevskayaPersonalIdentityRuScoring, makarevskayaPersonalIdentityRuValidationCases } from './data/makarevskayaPersonalIdentityRu.js';
import { belongingExclusionRuInstrument, belongingExclusionRuScoring, belongingExclusionRuValidationCases } from './data/belongingExclusionRu.js';
import { fourFactorSelfRuInstrument, fourFactorSelfRuScoring, fourFactorSelfRuValidationCases } from './data/fourFactorSelfRu.js';
import { ideaErofeevaRuInstrument, ideaErofeevaRuScoring, ideaErofeevaRuValidationCases } from './data/ideaErofeevaRu.js';
import { ideaKlementyevaRuInstrument, ideaKlementyevaRuScoring, ideaKlementyevaRuValidationCases } from './data/ideaKlementyevaRu.js';
import { cognitiveAgeRuInstrument, cognitiveAgeRuScoring, cognitiveAgeRuValidationCases } from './data/cognitiveAgeRu.js';
import { easKonshinaRuInstrument, easKonshinaRuScoring, easKonshinaRuValidationCases } from './data/easKonshinaRu.js';
import { pryginAutonomyRuInstrument, pryginAutonomyRuScoring, pryginAutonomyRuValidationCases } from './data/pryginAutonomyRu.js';
import { karabanovaAutonomyRuInstrument, karabanovaAutonomyRuScoring, karabanovaAutonomyRuValidationCases } from './data/karabanovaAutonomyRu.js';
import { identityResilienceRuInstrument, identityResilienceRuScoring, identityResilienceRuValidationCases } from './data/identityResilienceRu.js';
import { grbsShortRuInstrument, grbsShortRuScoring, grbsShortRuValidationCases } from './data/grbsShortRu.js';
import { mrniShortRuInstrument, mrniShortRuScoring, mrniShortRuValidationCases } from './data/mrniShortRu.js';
import { lopukhovaGenderTypeRuInstrument, lopukhovaGenderTypeRuScoring, lopukhovaGenderTypeRuValidationCases } from './data/lopukhovaGenderTypeRu.js';
import { genderPersonalityTypeTitovaRuInstrument, genderPersonalityTypeTitovaRuScoring, genderPersonalityTypeTitovaRuValidationCases } from './data/genderPersonalityTypeTitovaRu.js';
import { genderDifferencesGurievaRuInstrument, genderDifferencesGurievaRuScoring, genderDifferencesGurievaRuValidationCases } from './data/genderDifferencesGurievaRu.js';
import { pid5bfPlusMRuInstrument, pid5bfPlusMRuScoring, pid5bfPlusMRuValidationCases } from './data/pid5bfPlusMRu.js';
import { bitRuInstrument, bitRuScoring, bitRuValidationCases } from './data/bitRu.js';
import { cageAidRuInstrument, cageAidRuScoring, cageAidRuValidationCases } from './data/cageAidRu.js';
import { coreOmRuInstrument, coreOmRuScoring, coreOmRuValidationCases } from './data/coreOmRu.js';
import { cyrm28RuInstrument, cyrm28RuScoring, cyrm28RuValidationCases } from './data/cyrm28Ru.js';
import { ders18RuInstrument, ders18RuScoring, ders18RuValidationCases } from './data/ders18Ru.js';
import { db, migrate } from './db.js';
import type { SeedSection } from './types.js';
import { loadMethodologyRegistry } from './data/methodologyRegistry.js';

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
  const methodologyRegistrations=await loadMethodologyRegistry();
  const methodologyByCode=new Map(methodologyRegistrations.map((registration)=>[registration.instrument.code,registration]));
  const verifiedInstruments:SeedSection[]=[shamInstrument,amsInstrument,studyAlienationInstrument,gpsInstrument,ppsInstrument,bfi2Instrument,bfi2ShortInstrument,tipiRuInstrument,ipipNeo120Instrument,miniIpipInstrument,rsesInstrument,csesInstrument,gsesInstrument,briefCopeRuInstrument,munInstrument,paqShortRuInstrument,caasRuInstrument,iafRuInstrument,bsmasRuInstrument,smdsRuInstrument,fomosRuInstrument,nmpqRuInstrument,cavRuInstrument,igds9RuInstrument,bfasRuInstrument,fivePfqInstrument,cpmqRuInstrument,bisBasRuInstrument,spsrqJuniorRuInstrument,spsrqChildRuInstrument,scsRuInstrument,riscRuInstrument,didsRuInstrument,isriRuInstrument,aiqIvRuInstrument,loskRuInstrument,makarevskayaPersonalIdentityRuInstrument,belongingExclusionRuInstrument,fourFactorSelfRuInstrument,ideaErofeevaRuInstrument,ideaKlementyevaRuInstrument,cognitiveAgeRuInstrument,easKonshinaRuInstrument,pryginAutonomyRuInstrument,karabanovaAutonomyRuInstrument,identityResilienceRuInstrument,grbsShortRuInstrument,mrniShortRuInstrument,lopukhovaGenderTypeRuInstrument,genderPersonalityTypeTitovaRuInstrument,genderDifferencesGurievaRuInstrument,pid5bfPlusMRuInstrument,bitRuInstrument,cageAidRuInstrument,coreOmRuInstrument,cyrm28RuInstrument,ders18RuInstrument,...methodologyRegistrations.map((registration)=>registration.instrument)];
  for(const instrument of verifiedInstruments){
    const[rows]=await db.query<any[]>('SELECT id,methodology FROM instruments WHERE code=?',[instrument.code]);
    const instrumentId=rows[0]?.id??randomUUID();
    const registration=methodologyByCode.get(instrument.code);
    const scoringConfig=(instrument.code==='test_22'?paqShortRuScoring:instrument.code==='test_23'?caasRuScoring:instrument.code==='test_31'?bfasRuScoring:instrument.code==='test_32'?fivePfqScoring:instrument.code==='test_33'?cpmqRuScoring:instrument.code==='test_34'?bisBasRuScoring:instrument.code==='test_35'?spsrqJuniorRuScoring:instrument.code==='test_36'?spsrqChildRuScoring:instrument.code==='test_37'?selfConstrualScoring:instrument.code==='test_38'?riscScoring:instrument.code==='test_39'?didsScoring:instrument.code==='test_40'?isriRuScoring:instrument.code==='test_41'?aiqIvRuScoring:instrument.code==='test_42'?loskRuScoring:instrument.code==='test_43'?makarevskayaPersonalIdentityRuScoring:instrument.code==='test_44'?belongingExclusionRuScoring:instrument.code==='test_45'?fourFactorSelfRuScoring:instrument.code==='test_46'?ideaErofeevaRuScoring:instrument.code==='test_47'?ideaKlementyevaRuScoring:instrument.code==='test_48'?cognitiveAgeRuScoring:instrument.code==='test_49'?easKonshinaRuScoring:instrument.code==='test_50'?pryginAutonomyRuScoring:instrument.code==='test_51'?karabanovaAutonomyRuScoring:instrument.code==='test_52'?identityResilienceRuScoring:instrument.code==='test_53'?grbsShortRuScoring:instrument.code==='test_54'?mrniShortRuScoring:instrument.code==='test_55'?lopukhovaGenderTypeRuScoring:instrument.code==='test_56'?genderPersonalityTypeTitovaRuScoring:instrument.code==='test_57'?genderDifferencesGurievaRuScoring:instrument.code==='test_58'?pid5bfPlusMRuScoring:instrument.code==='test_59'?bitRuScoring:instrument.code==='test_60'?cageAidRuScoring:instrument.code==='test_61'?coreOmRuScoring:instrument.code==='test_62'?cyrm28RuScoring:instrument.code==='test_63'?ders18RuScoring:null)??registration?.scoringConfig??null;
    const validationCases=(instrument.code==='test_22'?paqShortRuValidationCases:instrument.code==='test_23'?caasRuValidationCases:instrument.code==='test_31'?bfasRuValidationCases:instrument.code==='test_32'?fivePfqValidationCases:instrument.code==='test_33'?cpmqRuValidationCases:instrument.code==='test_34'?bisBasRuValidationCases:instrument.code==='test_35'?spsrqJuniorRuValidationCases:instrument.code==='test_36'?spsrqChildRuValidationCases:instrument.code==='test_37'?selfConstrualValidationCases:instrument.code==='test_38'?riscValidationCases:instrument.code==='test_39'?didsValidationCases:instrument.code==='test_40'?isriRuValidationCases:instrument.code==='test_41'?aiqIvRuValidationCases:instrument.code==='test_42'?loskRuValidationCases:instrument.code==='test_43'?makarevskayaPersonalIdentityRuValidationCases:instrument.code==='test_44'?belongingExclusionRuValidationCases:instrument.code==='test_45'?fourFactorSelfRuValidationCases:instrument.code==='test_46'?ideaErofeevaRuValidationCases:instrument.code==='test_47'?ideaKlementyevaRuValidationCases:instrument.code==='test_48'?cognitiveAgeRuValidationCases:instrument.code==='test_49'?easKonshinaRuValidationCases:instrument.code==='test_50'?pryginAutonomyRuValidationCases:instrument.code==='test_51'?karabanovaAutonomyRuValidationCases:instrument.code==='test_52'?identityResilienceRuValidationCases:instrument.code==='test_53'?grbsShortRuValidationCases:instrument.code==='test_54'?mrniShortRuValidationCases:instrument.code==='test_55'?lopukhovaGenderTypeRuValidationCases:instrument.code==='test_56'?genderPersonalityTypeTitovaRuValidationCases:instrument.code==='test_57'?genderDifferencesGurievaRuValidationCases:instrument.code==='test_58'?pid5bfPlusMRuValidationCases:instrument.code==='test_59'?bitRuValidationCases:instrument.code==='test_60'?cageAidRuValidationCases:instrument.code==='test_61'?coreOmRuValidationCases:instrument.code==='test_62'?cyrm28RuValidationCases:instrument.code==='test_63'?ders18RuValidationCases:null)??registration?.validationCases??null;
    const methodologyMetadata=registration?.details?JSON.stringify({code:instrument.code,title:instrument.title,...registration.details}):null;
    const formulaVersion=(instrument.code==='test_22'?'paq-s-ru-larionow-2024-v1':instrument.code==='test_23'?'caas-ru-kondratyuk-2021-v1':instrument.code==='test_31'?'bfas-ru-golubkova-2025-v1':instrument.code==='test_32'?'5pfq-ru-khromov-2000-v1':instrument.code==='test_33'?'cpmq-ru-tatarko-maklasova-grigoryan-2019-v1':instrument.code==='test_34'?'bis-bas-ru-knyazev-slobodskaya-2004-v1':instrument.code==='test_35'?'spsrq-j-ru-kuznetsova-slobodskaya-rippinen-2013-v1':instrument.code==='test_36'?'spsr-c-ru-kuznetsova-slobodskaya-2010-v1':instrument.code==='test_37'?'scs-singelis-dorosheva-2016-v1':instrument.code==='test_38'?'risc-cross-dorosheva-2016-v1':instrument.code==='test_39'?'dids-luyckx-borisenko-2020-v1':instrument.code==='test_40'?'isri-cote-borisenko-2020-v1':instrument.code==='test_41'?'aiq-iv-cheek-voiskounsky-35ru-v1':instrument.code==='test_42'?'losk-kozlov-2014-v1':instrument.code==='test_43'?'makarevskaya-ryabikina-identity-2023-index-v1':instrument.code==='test_44'?'suvorova-rakhanova-korzun-belonging-2024-v1':instrument.code==='test_45'?'dorfman-kalugin-four-factor-self-2020-v1':instrument.code==='test_46'?'idea-ru-erofeeva-2023-19item-v1':instrument.code==='test_47'?'idea-r-klementyeva-2023-31item-v1':instrument.code==='test_48'?'barak-sergienko-cognitive-age-4item-v1':instrument.code==='test_49'?'eas-konshina-sadovnikova-ru-2022-20-v1':instrument.code==='test_50'?'prygin-autonomy-dependence-adult-youth-18-v1':instrument.code==='test_51'?'karabanova-poskrebysheva-adolescent-autonomy-12-v1':instrument.code==='test_52'?'iri-ru-solovyeva-odintsova-2023-16-v1':instrument.code==='test_53'?'grbs-s-ru-mdivani-lidskaya-2020-v1':instrument.code==='test_54'?'mrni-r-sf-ru-krivoshchekov-2021-v1':instrument.code==='test_55'?'lopukhova-bsri-russian-27-2013-v1':instrument.code==='test_56'?'ogtl-titova-2024-v1':instrument.code==='test_57'?'gender-differences-gurieva-kazantseva-belova-2019-v1':instrument.code==='test_58'?'pid5bf-plus-m-ru-zinchuk-kustov-2023-v1':instrument.code==='test_59'?'bit-ru-kostenko-nabieva-lebedeva-2025-v1':instrument.code==='test_60'?'cage-aid-ru-egorov-2002-v1':instrument.code==='test_61'?'core-om-ru-core-system-trust-2024-v1':instrument.code==='test_62'?'cyrm-28-ru-makhnach-laktionova-2026-v1':instrument.code==='test_63'?'ders-18-victor-klonsky-2016-ru-psytests-v1':null)??registration?.formulaVersion??null;
    if(!rows.length)await db.execute('INSERT INTO instruments (id,code,title,description,is_verified,scoring_code,scoring_config,validation_cases,formula_version,methodology) VALUES (?,?,?,?,TRUE,?,?,?,?,?)',[instrumentId,instrument.code,instrument.title,instrument.description??null,instrument.code,scoringConfig?JSON.stringify(scoringConfig):null,validationCases?JSON.stringify(validationCases):null,formulaVersion,methodologyMetadata]);
    else await db.execute('UPDATE instruments SET title=IF(methodology IS NULL,?,title),description=IF(? IS NOT NULL,?,description),is_verified=TRUE,scoring_code=?,status=IF(methodology IS NULL,\'active\',status),scoring_config=IF(? IS NOT NULL,?,scoring_config),validation_cases=IF(? IS NOT NULL,?,validation_cases),formula_version=IF(? IS NOT NULL,?,formula_version),methodology=IF(? IS NOT NULL,?,methodology) WHERE id=?',[instrument.title,methodologyMetadata,instrument.description??null,instrument.code,scoringConfig,scoringConfig?JSON.stringify(scoringConfig):null,validationCases,validationCases?JSON.stringify(validationCases):null,formulaVersion,formulaVersion,methodologyMetadata,methodologyMetadata,instrumentId]);
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
