import{db}from'../db.js';
import{scoreSspm2011}from'./sspm2011.js';
import{scoreSccs}from'./sccs.js';
import{scoreMspss}from'./mspss.js';
import{scoreNsps}from'./nsps.js';
import{scoreShopp}from'./shopp.js';
import{scoreDebq}from'./debq.js';
import{scoreSham}from'./sham.js';
import{scoreAms}from'./ams.js';
import{scoreStudyAlienation}from'./studyAlienation.js';
import{scoreGps}from'./gps.js';
import{scorePps}from'./pps.js';
import{scoreBfi2}from'./bfi2.js';
import{scoreBfi2Short}from'./bfi2Short.js';
import{scoreTipiRu}from'./tipiRu.js';
import{scoreIpipNeo120}from'./ipipNeo120.js';
import{scoreMiniIpip}from'./miniIpip.js';
import{scoreRses}from'./rses.js';
import{scoreCses}from'./cses.js';
import{scoreGses}from'./gses.js';
import{scoreBriefCopeRu}from'./briefCopeRu.js';
import{scoreMun}from'./mun.js';
import{scoreIafRu}from'./iafRu.js';
import{scoreBsmasRu}from'./bsmasRu.js';
import{scoreSmdsRu}from'./smdsRu.js';
import{scoreFomosRu}from'./fomosRu.js';
import{scoreNmpqRu}from'./nmpqRu.js';
import{scoreCavRu}from'./cavRu.js';
import{scoreIgds9Ru}from'./igds9Ru.js';
import{calculateConfigurableScores}from'./configurable.js';

function parseValue(value:unknown):unknown{if(typeof value!=='string')return value;try{return JSON.parse(value)}catch{return value}}

export async function calculateSspm2011ForSession(sessionId:string){
  const[rows]=await db.query<any[]>(`SELECT s.id sectionId,q.code,a.value FROM response_sessions rs JOIN sections s ON s.survey_id=rs.survey_id AND s.code='test_2' JOIN questions q ON q.section_id=s.id LEFT JOIN answers a ON a.question_id=q.id AND a.session_id=rs.id WHERE rs.id=? ORDER BY q.position`,[sessionId]);
  if(!rows.length)return null;
  const answers=new Map<number,number>();
  for(const row of rows){const number=Number(String(row.code).match(/(\d+)$/)?.[1]);const value=Number(parseValue(row.value));if(number&&value)answers.set(number,value)}
  const result=scoreSspm2011(answers);
  if(!result){await db.execute('DELETE FROM assessment_results WHERE session_id=? AND section_id=?',[sessionId,rows[0].sectionId]);return null}
  await db.execute(`INSERT INTO assessment_results (session_id,section_id,formula_version,result,interpretation) VALUES (?,?,?, ?,NULL) ON DUPLICATE KEY UPDATE formula_version=VALUES(formula_version),result=VALUES(result),interpretation=NULL,calculated_at=CURRENT_TIMESTAMP`,[sessionId,rows[0].sectionId,'sspm-2011-v1',JSON.stringify(result)]);
  return result;
}

export async function calculateSccsForSession(sessionId:string){
  const[rows]=await db.query<any[]>(`SELECT s.id sectionId,q.code,a.value FROM response_sessions rs JOIN sections s ON s.survey_id=rs.survey_id AND s.code='test_3' JOIN questions q ON q.section_id=s.id LEFT JOIN answers a ON a.question_id=q.id AND a.session_id=rs.id WHERE rs.id=? ORDER BY q.position`,[sessionId]);
  if(!rows.length)return null;
  const answers=new Map<number,number>();
  for(const row of rows){const number=Number(String(row.code).match(/(\d+)$/)?.[1]);const value=Number(parseValue(row.value));if(number&&value)answers.set(number,value)}
  const result=scoreSccs(answers);
  if(!result){await db.execute('DELETE FROM assessment_results WHERE session_id=? AND section_id=?',[sessionId,rows[0].sectionId]);return null}
  await db.execute(`INSERT INTO assessment_results (session_id,section_id,formula_version,result,interpretation) VALUES (?,?,?, ?,NULL) ON DUPLICATE KEY UPDATE formula_version=VALUES(formula_version),result=VALUES(result),interpretation=NULL,calculated_at=CURRENT_TIMESTAMP`,[sessionId,rows[0].sectionId,'sccs-ru-2021-v1',JSON.stringify(result)]);
  return result;
}

export async function calculateMspssForSession(sessionId:string){
  const[rows]=await db.query<any[]>(`SELECT s.id sectionId,q.code,a.value FROM response_sessions rs JOIN sections s ON s.survey_id=rs.survey_id AND s.code='test_1' JOIN questions q ON q.section_id=s.id LEFT JOIN answers a ON a.question_id=q.id AND a.session_id=rs.id WHERE rs.id=? ORDER BY q.position`,[sessionId]);
  if(!rows.length)return null;
  const answers=new Map<number,number>();
  for(const row of rows){const number=Number(String(row.code).match(/(\d+)$/)?.[1]);const value=Number(parseValue(row.value));if(number&&value)answers.set(number,value)}
  const result=scoreMspss(answers);
  if(!result){await db.execute('DELETE FROM assessment_results WHERE session_id=? AND section_id=?',[sessionId,rows[0].sectionId]);return null}
  await db.execute(`INSERT INTO assessment_results (session_id,section_id,formula_version,result,interpretation) VALUES (?,?,?, ?,NULL) ON DUPLICATE KEY UPDATE formula_version=VALUES(formula_version),result=VALUES(result),interpretation=NULL,calculated_at=CURRENT_TIMESTAMP`,[sessionId,rows[0].sectionId,'mspss-zimet-v1',JSON.stringify(result)]);
  return result;
}

export async function calculateNspsForSession(sessionId:string){
  const[rows]=await db.query<any[]>(`SELECT s.id sectionId,q.code,a.value FROM response_sessions rs JOIN sections s ON s.survey_id=rs.survey_id AND s.code='test_4' JOIN questions q ON q.section_id=s.id LEFT JOIN answers a ON a.question_id=q.id AND a.session_id=rs.id WHERE rs.id=? ORDER BY q.position`,[sessionId]);
  if(!rows.length)return null;
  const answers=new Map<number,number>();
  for(const row of rows){const number=Number(String(row.code).match(/(\d+)$/)?.[1]);const value=Number(parseValue(row.value));if(number&&value)answers.set(number,value)}
  const result=scoreNsps(answers);
  if(!result){await db.execute('DELETE FROM assessment_results WHERE session_id=? AND section_id=?',[sessionId,rows[0].sectionId]);return null}
  await db.execute(`INSERT INTO assessment_results (session_id,section_id,formula_version,result,interpretation) VALUES (?,?,?, ?,NULL) ON DUPLICATE KEY UPDATE formula_version=VALUES(formula_version),result=VALUES(result),interpretation=NULL,calculated_at=CURRENT_TIMESTAMP`,[sessionId,rows[0].sectionId,'nsps-moscovitch-huyder-v1',JSON.stringify(result)]);
  return result;
}

async function calculateFoodAssessment(sessionId:string,sectionCode:'test_5'|'test_6'){
  const[rows]=await db.query<any[]>(`SELECT s.id sectionId,q.code,a.value FROM response_sessions rs JOIN sections s ON s.survey_id=rs.survey_id AND s.code=? JOIN questions q ON q.section_id=s.id LEFT JOIN answers a ON a.question_id=q.id AND a.session_id=rs.id WHERE rs.id=? ORDER BY q.position`,[sectionCode,sessionId]);
  if(!rows.length)return null;const answers=new Map<number,number>();
  for(const row of rows){const number=Number(String(row.code).match(/(\d+)$/)?.[1]);const value=Number(parseValue(row.value));if(number&&value)answers.set(number,value)}
  const result=sectionCode==='test_5'?scoreShopp(answers):scoreDebq(answers);
  if(!result){await db.execute('DELETE FROM assessment_results WHERE session_id=? AND section_id=?',[sessionId,rows[0].sectionId]);return null}
  const version=sectionCode==='test_5'?'shopp-ru-2011-v1':'debq-van-strien-v2';
  await db.execute(`INSERT INTO assessment_results (session_id,section_id,formula_version,result,interpretation) VALUES (?,?,?, ?,NULL) ON DUPLICATE KEY UPDATE formula_version=VALUES(formula_version),result=VALUES(result),interpretation=NULL,calculated_at=CURRENT_TIMESTAMP`,[sessionId,rows[0].sectionId,version,JSON.stringify(result)]);return result;
}
export const calculateShoppForSession=(sessionId:string)=>calculateFoodAssessment(sessionId,'test_5');
export const calculateDebqForSession=(sessionId:string)=>calculateFoodAssessment(sessionId,'test_6');

export async function calculateShamForSession(sessionId:string){
  const[rows]=await db.query<any[]>(`SELECT s.id sectionId,q.code,a.value FROM response_sessions rs JOIN sections s ON s.survey_id=rs.survey_id AND s.code='test_7' JOIN questions q ON q.section_id=s.id LEFT JOIN answers a ON a.question_id=q.id AND a.session_id=rs.id WHERE rs.id=? ORDER BY q.position`,[sessionId]);
  if(!rows.length)return null;
  const answers=new Map<number,number>();
  for(const row of rows){const number=Number(String(row.code).match(/(\d+)$/)?.[1]);const value=Number(parseValue(row.value));if(number&&value)answers.set(number,value)}
  const result=scoreSham(answers);
  if(!result){await db.execute('DELETE FROM assessment_results WHERE session_id=? AND section_id=?',[sessionId,rows[0].sectionId]);return null}
  await db.execute(`INSERT INTO assessment_results (session_id,section_id,formula_version,result,interpretation) VALUES (?,?,?, ?,NULL) ON DUPLICATE KEY UPDATE formula_version=VALUES(formula_version),result=VALUES(result),interpretation=NULL,calculated_at=CURRENT_TIMESTAMP`,[sessionId,rows[0].sectionId,'sham-gordeeva-2014-v1',JSON.stringify(result)]);
  return result;
}

export async function calculateAmsForSession(sessionId:string){
  const[rows]=await db.query<any[]>(`SELECT s.id sectionId,q.code,a.value FROM response_sessions rs JOIN sections s ON s.survey_id=rs.survey_id AND s.code='test_8' JOIN questions q ON q.section_id=s.id LEFT JOIN answers a ON a.question_id=q.id AND a.session_id=rs.id WHERE rs.id=? ORDER BY q.position`,[sessionId]);
  if(!rows.length)return null;
  const answers=new Map<number,number>();
  for(const row of rows){const number=Number(String(row.code).match(/(\d+)$/)?.[1]);const value=Number(parseValue(row.value));if(number&&value)answers.set(number,value)}
  const result=scoreAms(answers);
  if(!result){await db.execute('DELETE FROM assessment_results WHERE session_id=? AND section_id=?',[sessionId,rows[0].sectionId]);return null}
  await db.execute(`INSERT INTO assessment_results (session_id,section_id,formula_version,result,interpretation) VALUES (?,?,?, ?,NULL) ON DUPLICATE KEY UPDATE formula_version=VALUES(formula_version),result=VALUES(result),interpretation=NULL,calculated_at=CURRENT_TIMESTAMP`,[sessionId,rows[0].sectionId,'ams-c28-vallerand-v1',JSON.stringify(result)]);
  return result;
}

export async function calculateStudyAlienationForSession(sessionId:string){
  const[rows]=await db.query<any[]>(`SELECT s.id sectionId,q.code,a.value FROM response_sessions rs JOIN sections s ON s.survey_id=rs.survey_id AND s.code='test_9' JOIN questions q ON q.section_id=s.id LEFT JOIN answers a ON a.question_id=q.id AND a.session_id=rs.id WHERE rs.id=? ORDER BY q.position`,[sessionId]);
  if(!rows.length)return null;
  const answers=new Map<number,number>();
  for(const row of rows){const number=Number(String(row.code).match(/(\d+)$/)?.[1]);const value=Number(parseValue(row.value));if(number&&value)answers.set(number,value)}
  const result=scoreStudyAlienation(answers);
  if(!result){await db.execute('DELETE FROM assessment_results WHERE session_id=? AND section_id=?',[sessionId,rows[0].sectionId]);return null}
  await db.execute(`INSERT INTO assessment_results (session_id,section_id,formula_version,result,interpretation) VALUES (?,?,?, ?,NULL) ON DUPLICATE KEY UPDATE formula_version=VALUES(formula_version),result=VALUES(result),interpretation=NULL,calculated_at=CURRENT_TIMESTAMP`,[sessionId,rows[0].sectionId,'study-alienation-osin-2015-v1',JSON.stringify(result)]);
  return result;
}

export async function calculateGpsForSession(sessionId:string){
  const[rows]=await db.query<any[]>(`SELECT s.id sectionId,q.code,a.value FROM response_sessions rs JOIN sections s ON s.survey_id=rs.survey_id AND s.code='test_10' JOIN questions q ON q.section_id=s.id LEFT JOIN answers a ON a.question_id=q.id AND a.session_id=rs.id WHERE rs.id=? ORDER BY q.position`,[sessionId]);
  if(!rows.length)return null;
  const answers=new Map<number,number>();
  for(const row of rows){const number=Number(String(row.code).match(/(\d+)$/)?.[1]);const value=Number(parseValue(row.value));if(number&&value)answers.set(number,value)}
  const result=scoreGps(answers);
  if(!result){await db.execute('DELETE FROM assessment_results WHERE session_id=? AND section_id=?',[sessionId,rows[0].sectionId]);return null}
  await db.execute(`INSERT INTO assessment_results (session_id,section_id,formula_version,result,interpretation) VALUES (?,?,?, ?,NULL) ON DUPLICATE KEY UPDATE formula_version=VALUES(formula_version),result=VALUES(result),interpretation=NULL,calculated_at=CURRENT_TIMESTAMP`,[sessionId,rows[0].sectionId,'gps-lay-student-1986-v1',JSON.stringify(result)]);
  return result;
}

export async function calculatePpsForSession(sessionId:string){
  const[rows]=await db.query<any[]>(`SELECT s.id sectionId,q.code,a.value FROM response_sessions rs JOIN sections s ON s.survey_id=rs.survey_id AND s.code='test_11' JOIN questions q ON q.section_id=s.id LEFT JOIN answers a ON a.question_id=q.id AND a.session_id=rs.id WHERE rs.id=? ORDER BY q.position`,[sessionId]);
  if(!rows.length)return null;
  const answers=new Map<number,number>();
  for(const row of rows){const number=Number(String(row.code).match(/(\d+)$/)?.[1]);const value=Number(parseValue(row.value));if(number&&value)answers.set(number,value)}
  const result=scorePps(answers);
  if(!result){await db.execute('DELETE FROM assessment_results WHERE session_id=? AND section_id=?',[sessionId,rows[0].sectionId]);return null}
  await db.execute(`INSERT INTO assessment_results (session_id,section_id,formula_version,result,interpretation) VALUES (?,?,?, ?,NULL) ON DUPLICATE KEY UPDATE formula_version=VALUES(formula_version),result=VALUES(result),interpretation=NULL,calculated_at=CURRENT_TIMESTAMP`,[sessionId,rows[0].sectionId,'pps-steel-2010-v1',JSON.stringify(result)]);
  return result;
}

export async function calculateBfi2ForSession(sessionId:string){
  const[rows]=await db.query<any[]>(`SELECT s.id sectionId,q.code,a.value FROM response_sessions rs JOIN sections s ON s.survey_id=rs.survey_id AND s.code='test_12' JOIN questions q ON q.section_id=s.id LEFT JOIN answers a ON a.question_id=q.id AND a.session_id=rs.id WHERE rs.id=? ORDER BY q.position`,[sessionId]);
  if(!rows.length)return null;
  const answers=new Map<number,number>();
  for(const row of rows){const number=Number(String(row.code).match(/(\d+)$/)?.[1]);const value=Number(parseValue(row.value));if(number&&value)answers.set(number,value)}
  const result=scoreBfi2(answers);
  if(!result){await db.execute('DELETE FROM assessment_results WHERE session_id=? AND section_id=?',[sessionId,rows[0].sectionId]);return null}
  await db.execute(`INSERT INTO assessment_results (session_id,section_id,formula_version,result,interpretation) VALUES (?,?,?, ?,NULL) ON DUPLICATE KEY UPDATE formula_version=VALUES(formula_version),result=VALUES(result),interpretation=NULL,calculated_at=CURRENT_TIMESTAMP`,[sessionId,rows[0].sectionId,'bfi2-ru-shchebetenko-2018-v1',JSON.stringify(result)]);
  return result;
}

export async function calculateBfi2ShortForSession(sessionId:string){
  const[rows]=await db.query<any[]>(`SELECT s.id sectionId,q.code,a.value FROM response_sessions rs JOIN sections s ON s.survey_id=rs.survey_id AND s.code='test_13' JOIN questions q ON q.section_id=s.id LEFT JOIN answers a ON a.question_id=q.id AND a.session_id=rs.id WHERE rs.id=? ORDER BY q.position`,[sessionId]);
  if(!rows.length)return null;
  const answers=new Map<number,number>();
  for(const row of rows){const number=Number(String(row.code).match(/(\d+)$/)?.[1]);const value=Number(parseValue(row.value));if(number&&value)answers.set(number,value)}
  const result=scoreBfi2Short(answers);
  if(!result){await db.execute('DELETE FROM assessment_results WHERE session_id=? AND section_id=?',[sessionId,rows[0].sectionId]);return null}
  await db.execute(`INSERT INTO assessment_results (session_id,section_id,formula_version,result,interpretation) VALUES (?,?,?, ?,NULL) ON DUPLICATE KEY UPDATE formula_version=VALUES(formula_version),result=VALUES(result),interpretation=NULL,calculated_at=CURRENT_TIMESTAMP`,[sessionId,rows[0].sectionId,'bfi2-s-ru-mishkevich-2022-v1',JSON.stringify(result)]);
  return result;
}

export async function calculateTipiRuForSession(sessionId:string){
  const[rows]=await db.query<any[]>(`SELECT s.id sectionId,q.code,a.value FROM response_sessions rs JOIN sections s ON s.survey_id=rs.survey_id AND s.code='test_14' JOIN questions q ON q.section_id=s.id LEFT JOIN answers a ON a.question_id=q.id AND a.session_id=rs.id WHERE rs.id=? ORDER BY q.position`,[sessionId]);
  if(!rows.length)return null;
  const answers=new Map<number,number>();
  for(const row of rows){const number=Number(String(row.code).match(/(\d+)$/)?.[1]);const value=Number(parseValue(row.value));if(number&&value)answers.set(number,value)}
  const result=scoreTipiRu(answers);
  if(!result){await db.execute('DELETE FROM assessment_results WHERE session_id=? AND section_id=?',[sessionId,rows[0].sectionId]);return null}
  await db.execute(`INSERT INTO assessment_results (session_id,section_id,formula_version,result,interpretation) VALUES (?,?,?, ?,NULL) ON DUPLICATE KEY UPDATE formula_version=VALUES(formula_version),result=VALUES(result),interpretation=NULL,calculated_at=CURRENT_TIMESTAMP`,[sessionId,rows[0].sectionId,'tipi-ru-sergeeva-2016-v1',JSON.stringify(result)]);
  return result;
}

export async function calculateIpipNeo120ForSession(sessionId:string){
  const[rows]=await db.query<any[]>(`SELECT s.id sectionId,q.code,a.value FROM response_sessions rs JOIN sections s ON s.survey_id=rs.survey_id AND s.code='test_15' JOIN questions q ON q.section_id=s.id LEFT JOIN answers a ON a.question_id=q.id AND a.session_id=rs.id WHERE rs.id=? ORDER BY q.position`,[sessionId]);
  if(!rows.length)return null;
  const answers=new Map<number,number>();
  for(const row of rows){const number=Number(String(row.code).match(/(\d+)$/)?.[1]);const value=Number(parseValue(row.value));if(number&&value)answers.set(number,value)}
  const result=scoreIpipNeo120(answers);
  if(!result){await db.execute('DELETE FROM assessment_results WHERE session_id=? AND section_id=?',[sessionId,rows[0].sectionId]);return null}
  await db.execute(`INSERT INTO assessment_results (session_id,section_id,formula_version,result,interpretation) VALUES (?,?,?, ?,NULL) ON DUPLICATE KEY UPDATE formula_version=VALUES(formula_version),result=VALUES(result),interpretation=NULL,calculated_at=CURRENT_TIMESTAMP`,[sessionId,rows[0].sectionId,'ipip-neo-120-johnson-2014-v1',JSON.stringify(result)]);
  return result;
}

export async function calculateMiniIpipForSession(sessionId:string){
  const[rows]=await db.query<any[]>(`SELECT s.id sectionId,q.code,a.value FROM response_sessions rs JOIN sections s ON s.survey_id=rs.survey_id AND s.code='test_16' JOIN questions q ON q.section_id=s.id LEFT JOIN answers a ON a.question_id=q.id AND a.session_id=rs.id WHERE rs.id=? ORDER BY q.position`,[sessionId]);
  if(!rows.length)return null;
  const answers=new Map<number,number>();
  for(const row of rows){const number=Number(String(row.code).match(/(\d+)$/)?.[1]);const value=Number(parseValue(row.value));if(number&&value)answers.set(number,value)}
  const result=scoreMiniIpip(answers);
  if(!result){await db.execute('DELETE FROM assessment_results WHERE session_id=? AND section_id=?',[sessionId,rows[0].sectionId]);return null}
  await db.execute(`INSERT INTO assessment_results (session_id,section_id,formula_version,result,interpretation) VALUES (?,?,?, ?,NULL) ON DUPLICATE KEY UPDATE formula_version=VALUES(formula_version),result=VALUES(result),interpretation=NULL,calculated_at=CURRENT_TIMESTAMP`,[sessionId,rows[0].sectionId,'mini-ipip-donnellan-2006-v1',JSON.stringify(result)]);
  return result;
}

export async function calculateRsesForSession(sessionId:string){
  const[rows]=await db.query<any[]>(`SELECT s.id sectionId,q.code,a.value FROM response_sessions rs JOIN sections s ON s.survey_id=rs.survey_id AND s.code='test_17' JOIN questions q ON q.section_id=s.id LEFT JOIN answers a ON a.question_id=q.id AND a.session_id=rs.id WHERE rs.id=? ORDER BY q.position`,[sessionId]);
  if(!rows.length)return null;
  const answers=new Map<number,number>();
  for(const row of rows){const number=Number(String(row.code).match(/(\d+)$/)?.[1]);const parsed=parseValue(row.value);const value=Number(parsed);if(number&&parsed!==null&&parsed!==undefined&&Number.isInteger(value))answers.set(number,value)}
  const result=scoreRses(answers);
  if(!result){await db.execute('DELETE FROM assessment_results WHERE session_id=? AND section_id=?',[sessionId,rows[0].sectionId]);return null}
  await db.execute(`INSERT INTO assessment_results (session_id,section_id,formula_version,result,interpretation) VALUES (?,?,?, ?,NULL) ON DUPLICATE KEY UPDATE formula_version=VALUES(formula_version),result=VALUES(result),interpretation=NULL,calculated_at=CURRENT_TIMESTAMP`,[sessionId,rows[0].sectionId,'rses-ru-zolotareva-2020-v1',JSON.stringify(result)]);
  return result;
}

export async function calculateCsesForSession(sessionId:string){
  const[rows]=await db.query<any[]>(`SELECT s.id sectionId,q.code,a.value FROM response_sessions rs JOIN sections s ON s.survey_id=rs.survey_id AND s.code='test_18' JOIN questions q ON q.section_id=s.id LEFT JOIN answers a ON a.question_id=q.id AND a.session_id=rs.id WHERE rs.id=? ORDER BY q.position`,[sessionId]);
  if(!rows.length)return null;
  const answers=new Map<number,number>();
  for(const row of rows){const number=Number(String(row.code).match(/(\d+)$/)?.[1]);const value=Number(parseValue(row.value));if(number&&value)answers.set(number,value)}
  const result=scoreCses(answers);
  if(!result){await db.execute('DELETE FROM assessment_results WHERE session_id=? AND section_id=?',[sessionId,rows[0].sectionId]);return null}
  await db.execute(`INSERT INTO assessment_results (session_id,section_id,formula_version,result,interpretation) VALUES (?,?,?, ?,NULL) ON DUPLICATE KEY UPDATE formula_version=VALUES(formula_version),result=VALUES(result),interpretation=NULL,calculated_at=CURRENT_TIMESTAMP`,[sessionId,rows[0].sectionId,'cses-judge-2003-v1',JSON.stringify(result)]);
  return result;
}

export async function calculateGsesForSession(sessionId:string){
  const[rows]=await db.query<any[]>(`SELECT s.id sectionId,q.code,a.value FROM response_sessions rs JOIN sections s ON s.survey_id=rs.survey_id AND s.code='test_19' JOIN questions q ON q.section_id=s.id LEFT JOIN answers a ON a.question_id=q.id AND a.session_id=rs.id WHERE rs.id=? ORDER BY q.position`,[sessionId]);
  if(!rows.length)return null;
  const answers=new Map<number,number>();
  for(const row of rows){const number=Number(String(row.code).match(/(\d+)$/)?.[1]);const value=Number(parseValue(row.value));if(Number.isInteger(number)&&Number.isInteger(value))answers.set(number,value)}
  const result=scoreGses(answers);
  if(!result){await db.execute('DELETE FROM assessment_results WHERE session_id=? AND section_id=?',[sessionId,rows[0].sectionId]);return null}
  await db.execute(`INSERT INTO assessment_results (session_id,section_id,formula_version,result,interpretation) VALUES (?,?,?, ?,NULL) ON DUPLICATE KEY UPDATE formula_version=VALUES(formula_version),result=VALUES(result),interpretation=NULL,calculated_at=CURRENT_TIMESTAMP`,[sessionId,rows[0].sectionId,'gses-ru-romek-1996-v1',JSON.stringify(result)]);
  return result;
}

export async function calculateBriefCopeRuForSession(sessionId:string){
  const[rows]=await db.query<any[]>(`SELECT s.id sectionId,q.code,a.value FROM response_sessions rs JOIN sections s ON s.survey_id=rs.survey_id AND s.code='test_20' JOIN questions q ON q.section_id=s.id LEFT JOIN answers a ON a.question_id=q.id AND a.session_id=rs.id WHERE rs.id=? ORDER BY q.position`,[sessionId]);
  if(!rows.length)return null;
  const answers=new Map<number,number>();
  for(const row of rows){const number=Number(String(row.code).match(/(\d+)$/)?.[1]);const parsed=parseValue(row.value);const value=Number(parsed);if(Number.isInteger(number)&&parsed!==null&&parsed!==undefined&&Number.isInteger(value))answers.set(number,value)}
  const result=scoreBriefCopeRu(answers);
  if(!result){await db.execute('DELETE FROM assessment_results WHERE session_id=? AND section_id=?',[sessionId,rows[0].sectionId]);return null}
  await db.execute(`INSERT INTO assessment_results (session_id,section_id,formula_version,result,interpretation) VALUES (?,?,?, ?,NULL) ON DUPLICATE KEY UPDATE formula_version=VALUES(formula_version),result=VALUES(result),interpretation=NULL,calculated_at=CURRENT_TIMESTAMP`,[sessionId,rows[0].sectionId,'brief-cope-ru-pavlova-2022-v1',JSON.stringify(result)]);
  return result;
}

async function calculateConfiguredMethodologiesForSession(sessionId:string){
  const[rows]=await db.query<any[]>(`SELECT s.id sectionId,s.code sectionCode,q.code questionCode,a.value,i.title,i.formula_version formulaVersion,i.scoring_config scoringConfig FROM response_sessions rs JOIN sections s ON s.survey_id=rs.survey_id AND s.source_instrument_id IS NOT NULL JOIN instruments i ON i.id=s.source_instrument_id AND i.is_verified=TRUE AND i.scoring_config IS NOT NULL JOIN questions q ON q.section_id=s.id LEFT JOIN answers a ON a.question_id=q.id AND a.session_id=rs.id WHERE rs.id=? ORDER BY s.position,q.position`,[sessionId]);
  const groups=new Map<string,any[]>();for(const row of rows){const group=groups.get(row.sectionId)??[];group.push(row);groups.set(row.sectionId,group)}
  return Promise.all([...groups.values()].map(async group=>{
    const first=group[0],scoring=parseValue(first.scoringConfig) as {min:number;max:number;scales:{key:string;label:string;items:number[];reverseItems:number[];weights?:Record<number,number>;aggregation:'sum'|'mean'}[]};
    const answers:Record<string,unknown>={};
    for(const row of group){const number=Number(String(row.questionCode).match(/(\d+)$/)?.[1]);const value=parseValue(row.value);if(Number.isInteger(number)&&value!==null&&value!==undefined&&Number.isFinite(Number(value)))answers[String(number)]=Number(value)}
    const values=calculateConfigurableScores(scoring,answers);
    if(!values){await db.execute('DELETE FROM assessment_results WHERE session_id=? AND section_id=?',[sessionId,first.sectionId]);return null}
    const scales=Object.fromEntries(scoring.scales.map(scale=>{
      const score=values[scale.key],items=scale.items.map(item=>answers[String(item)] as number);
      const bounds=scale.items.reduce((range,item)=>{
        const weight=scale.weights?.[item]??1;
        const low=Math.min(scoring.min*weight,scoring.max*weight),high=Math.max(scoring.min*weight,scoring.max*weight);
        return[range[0]+low,range[1]+high] as [number,number];
      },[0,0] as [number,number]);
      const minimum=scale.aggregation==='sum'?bounds[0]:scoring.min,maximum=scale.aggregation==='sum'?bounds[1]:scoring.max;
      return[scale.key,{label:scale.label,score,average:scale.aggregation==='mean'?score:score/items.length,min:minimum,max:maximum,minScore:minimum,maxScore:maximum,aggregation:scale.aggregation,itemCount:items.length}]
    }));
    const result={instrument:first.title,complete:true,answered:Object.keys(answers).length,scales};
    await db.execute(`INSERT INTO assessment_results (session_id,section_id,formula_version,result,interpretation) VALUES (?,?,?,?,NULL) ON DUPLICATE KEY UPDATE formula_version=VALUES(formula_version),result=VALUES(result),interpretation=NULL,calculated_at=CURRENT_TIMESTAMP`,[sessionId,first.sectionId,first.formulaVersion,JSON.stringify(result)]);return result;
  }));
}

export async function calculateMunForSession(sessionId:string){
  const[rows]=await db.query<any[]>(`SELECT s.id sectionId,q.code,a.value FROM response_sessions rs JOIN sections s ON s.survey_id=rs.survey_id AND s.code='test_21' JOIN questions q ON q.section_id=s.id LEFT JOIN answers a ON a.question_id=q.id AND a.session_id=rs.id WHERE rs.id=? ORDER BY q.position`,[sessionId]);
  if(!rows.length)return null;
  const answers=new Map<number,number>();
  for(const row of rows){const number=Number(String(row.code).match(/(\d+)$/)?.[1]);const value=Number(parseValue(row.value));if(Number.isInteger(number)&&Number.isInteger(value))answers.set(number,value)}
  const result=scoreMun(answers);
  if(!result){await db.execute('DELETE FROM assessment_results WHERE session_id=? AND section_id=?',[sessionId,rows[0].sectionId]);return null}
  await db.execute(`INSERT INTO assessment_results (session_id,section_id,formula_version,result,interpretation) VALUES (?,?,?, ?,NULL) ON DUPLICATE KEY UPDATE formula_version=VALUES(formula_version),result=VALUES(result),interpretation=NULL,calculated_at=CURRENT_TIMESTAMP`,[sessionId,rows[0].sectionId,'rean-mun-2026-v1',JSON.stringify(result)]);
  return result;
}

export async function calculateIafRuForSession(sessionId:string){
  const[rows]=await db.query<any[]>(`SELECT s.id sectionId,q.code,a.value FROM response_sessions rs JOIN sections s ON s.survey_id=rs.survey_id AND s.code='test_24' JOIN questions q ON q.section_id=s.id LEFT JOIN answers a ON a.question_id=q.id AND a.session_id=rs.id WHERE rs.id=? ORDER BY q.position`,[sessionId]);
  if(!rows.length)return null;
  const answers=new Map<number,number>();
  for(const row of rows){const number=Number(String(row.code).match(/(\d+)$/)?.[1]);const value=Number(parseValue(row.value));if(Number.isInteger(number)&&Number.isInteger(value))answers.set(number,value)}
  const result=scoreIafRu(answers);
  if(!result){await db.execute('DELETE FROM assessment_results WHERE session_id=? AND section_id=?',[sessionId,rows[0].sectionId]);return null}
  await db.execute(`INSERT INTO assessment_results (session_id,section_id,formula_version,result,interpretation) VALUES (?,?,?, ?,NULL) ON DUPLICATE KEY UPDATE formula_version=VALUES(formula_version),result=VALUES(result),interpretation=NULL,calculated_at=CURRENT_TIMESTAMP`,[sessionId,rows[0].sectionId,'iaf-ru-kostromina-2023-subscales-v1',JSON.stringify(result)]);
  return result;
}

async function calculateSocialMediaScaleForSession(sessionId:string,code:'test_25'|'test_26'|'test_27'|'test_28'|'test_29'|'test_30',formulaVersion:string,score:(answers:Map<number,number>)=>unknown|null){
  const[rows]=await db.query<any[]>(`SELECT s.id sectionId,q.code,a.value FROM response_sessions rs JOIN sections s ON s.survey_id=rs.survey_id AND s.code=? JOIN questions q ON q.section_id=s.id LEFT JOIN answers a ON a.question_id=q.id AND a.session_id=rs.id WHERE rs.id=? ORDER BY q.position`,[code,sessionId]);
  if(!rows.length)return null;
  const answers=new Map<number,number>();
  for(const row of rows){const number=Number(String(row.code).match(/(\d+)$/)?.[1]);const raw=parseValue(row.value);const value=Number(raw);if(Number.isInteger(number)&&raw!==null&&raw!==undefined&&Number.isInteger(value))answers.set(number,value)}
  const result=score(answers);
  if(!result){await db.execute('DELETE FROM assessment_results WHERE session_id=? AND section_id=?',[sessionId,rows[0].sectionId]);return null}
  const interpretation=(result as {screeningNote?:string}).screeningNote??null;
  await db.execute(`INSERT INTO assessment_results (session_id,section_id,formula_version,result,interpretation) VALUES (?,?,?,?,?) ON DUPLICATE KEY UPDATE formula_version=VALUES(formula_version),result=VALUES(result),interpretation=VALUES(interpretation),calculated_at=CURRENT_TIMESTAMP`,[sessionId,rows[0].sectionId,formulaVersion,JSON.stringify(result),interpretation]);
  return result;
}

export async function calculateBsmasRuForSession(sessionId:string){return calculateSocialMediaScaleForSession(sessionId,'test_25','bsmas-ru-kornienko-2023-sum-v1',scoreBsmasRu)}
export async function calculateSmdsRuForSession(sessionId:string){return calculateSocialMediaScaleForSession(sessionId,'test_26','smds-ru-tereshchenko-2024-screen-v1',scoreSmdsRu)}
export async function calculateFomosRuForSession(sessionId:string){return calculateSocialMediaScaleForSession(sessionId,'test_27','fomos-ru-ardislamov-2024-six-item-v1',scoreFomosRu)}
export async function calculateNmpqRuForSession(sessionId:string){return calculateSocialMediaScaleForSession(sessionId,'test_28','nmpq-ru-maksimenko-2025-v1',scoreNmpqRu)}
export async function calculateCavRuForSession(sessionId:string){return calculateSocialMediaScaleForSession(sessionId,'test_29','cav-ru-mikhailova-istomina-2025-v1',scoreCavRu)}
export async function calculateIgds9RuForSession(sessionId:string){return calculateSocialMediaScaleForSession(sessionId,'test_30','igds9sf-ru-petrov-chernyak-2019-v1',scoreIgds9Ru)}

export async function calculateConfiguredAssessmentsForSession(sessionId:string){return Promise.all([calculateMspssForSession(sessionId),calculateSspm2011ForSession(sessionId),calculateSccsForSession(sessionId),calculateNspsForSession(sessionId),calculateShoppForSession(sessionId),calculateDebqForSession(sessionId),calculateShamForSession(sessionId),calculateAmsForSession(sessionId),calculateStudyAlienationForSession(sessionId),calculateGpsForSession(sessionId),calculatePpsForSession(sessionId),calculateBfi2ForSession(sessionId),calculateBfi2ShortForSession(sessionId),calculateTipiRuForSession(sessionId),calculateIpipNeo120ForSession(sessionId),calculateMiniIpipForSession(sessionId),calculateRsesForSession(sessionId),calculateCsesForSession(sessionId),calculateGsesForSession(sessionId),calculateBriefCopeRuForSession(sessionId),calculateMunForSession(sessionId),calculateIafRuForSession(sessionId),calculateBsmasRuForSession(sessionId),calculateSmdsRuForSession(sessionId),calculateFomosRuForSession(sessionId),calculateNmpqRuForSession(sessionId),calculateCavRuForSession(sessionId),calculateIgds9RuForSession(sessionId),calculateConfiguredMethodologiesForSession(sessionId)])}
