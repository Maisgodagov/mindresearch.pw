import{db}from'../db.js';
import{scoreSspm2011}from'./sspm2011.js';
import{scoreSccs}from'./sccs.js';
import{scoreMspss}from'./mspss.js';

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

export async function calculateConfiguredAssessmentsForSession(sessionId:string){return Promise.all([calculateMspssForSession(sessionId),calculateSspm2011ForSession(sessionId),calculateSccsForSession(sessionId)])}
