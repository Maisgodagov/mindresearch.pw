import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import express from 'express';
import { randomUUID } from 'node:crypto';
import type { Server } from 'node:http';

// Explicit opt-in; never connect these destructive fixture tests to a real project database.
const enabled = process.env.COMMUNITY_TEST_DATABASE_URL;
describe.skipIf(!enabled)('Community SQL integration', () => {
  let db: typeof import('../db.js').db, server: Server, base: string;
  let signToken: typeof import('../auth.js').signToken, settle: typeof import('./router.js').settleCommunity;
  const author=randomUUID(), a=randomUUID(), b=randomUUID(), reviewer=randomUUID(), researcher=randomUUID(), noProfile=randomUUID();
  const profile={adultConfirmed:true,birthDate:'1996-01-10',sex:'female',country:'Россия',region:'Москва',education:'higher',studying:'no',employment:'employed',marital:'married',children:2,childAges:[3,7]};
  async function request(user: string | null, path: string, method='GET', body?: unknown) {
    const res=await fetch(`${base}/api/community${path}`,{method,headers:{'Content-Type':'application/json',...(user?{Authorization:`Bearer ${signToken({id:user,role:'owner'})}`}:{})},body:body?JSON.stringify(body):undefined});
    return {status:res.status,data:await res.json()};
  }
  async function create(target=2,screening:any[]=[]) {
    const surveyId=randomUUID();
    await db.execute('INSERT INTO surveys(id,owner_id,slug,title,welcome_title,welcome_text,status) VALUES (?,?,?,?,?,?,\'active\')',[surveyId,author,`fixture-${surveyId}`,'Тестовое исследование','Начало','Синтетические данные']);
    const r=await request(author,'/listings','POST',{surveyId,description:'Синтетическое исследование для проверки взаимопомощи.',topic:'Тест',minutes:5,criteria:{sex:['female'],ageMin:25,childrenMin:1},screening,quotas:[{id:'all',label:'Все',target}],budget:2});
    expect(r.status).toBe(201);return {id:r.data.id,surveyId};
  }
  async function finish(token:string,seconds=300) {
    await db.execute("UPDATE response_sessions SET status='completed',started_at=DATE_SUB(NOW(),INTERVAL ? SECOND),completed_at=DATE_SUB(NOW(),INTERVAL 3 MINUTE) WHERE public_token=?",[seconds+180,token]);
  }
  beforeAll(async()=>{
    const url=new URL(enabled!);
    if(!/^\/mindresearch_community_test_[a-z0-9_]+$/.test(url.pathname)||!['127.0.0.1','localhost'].includes(url.hostname))throw new Error('Integration tests require an isolated localhost mindresearch_community_test_* database');
    process.env.DATABASE_URL=enabled;process.env.JWT_SECRET='community-integration-fixture-secret-only';
    const module=await import('../db.js');db=module.db;await module.migrate();
    const schema=await import('./schema.js');await schema.migrateCommunity();await schema.migrateCommunity();
    const router=await import('./router.js');settle=router.settleCommunity;signToken=(await import('../auth.js')).signToken;
    for(const id of [author,a,b,reviewer,researcher,noProfile])await db.execute('INSERT INTO users(id,email,password_hash,name,role) VALUES (?,?,?,?,?)',[id,`${id}@example.test`,'not-a-real-password','Тестовый участник',id===researcher?'researcher':id===reviewer?'admin':'owner']);
    const app=express();app.use(express.json());app.use('/api',router.communityRouter);app.use((err:any,_req:any,res:any,_next:any)=>res.status(500).json({message:String(err)}));
    server=await new Promise<Server>(resolve=>{const s=app.listen(0,'127.0.0.1',()=>resolve(s));});base=`http://127.0.0.1:${(server.address() as any).port}`;
    for(const id of [author,a,b,reviewer])expect((await request(id,'/profile','PUT',{data:profile,complete:true})).status).toBe(200);
    await db.execute('INSERT INTO community_wallets(user_id,earned,bonus,bonus_granted) VALUES (?,100,0,TRUE)',[author]);
  },30000);
  afterAll(async()=>{if(server)await new Promise<void>(resolve=>server.close(()=>resolve()));if(db)await db.end();});

  it('enforces authorization and the questionnaire gate on the API',async()=>{
    expect((await request(null,'/me')).status).toBe(401);
    expect((await request(researcher,'/me')).status).toBe(403);
    expect((await request(noProfile,'/feed')).status).toBe(409);
    expect((await request(noProfile,'/profile','PUT',{data:{sex:'female'},complete:false})).status).toBe(200);
    expect((await request(noProfile,'/feed')).status).toBe(409);
    expect((await request(a,'/profile','PUT',{data:profile,complete:false})).status).toBe(409);
  });
  it('executes the actual feed SQL and hides accepted screening answers',async()=>{
    const l=await create(2,[{id:'q1',question:'Живёте с ребёнком?',options:['Да','Нет'],accepted:[0]}]);
    const feed=await request(a,'/feed');expect(feed.status).toBe(200);
    expect(feed.data.find((x:any)=>x.id===l.id).screening[0]).not.toHaveProperty('accepted');
    expect((await request(a,'/impressions','POST',{ids:[l.id]})).status).toBe(200);
    await request(a,'/impressions','POST',{ids:[l.id]});
    const [rows]=await db.query<any[]>('SELECT impressions FROM community_listings WHERE id=?',[l.id]);expect(rows[0].impressions).toBe(1);
  });
  it('grants the closed-pilot starter bonus exactly once, with separate bonus accounting',async()=>{
    const surveyId=randomUUID();await db.execute('INSERT INTO surveys(id,owner_id,slug,title,welcome_title,welcome_text,status) VALUES (?,?,?,?,?,?,\'active\')',[surveyId,reviewer,`fixture-${surveyId}`,'Пилот','Начало','Тест']);
    const body={surveyId,description:'Проверяем разовое начисление стартового бюджета.',topic:'Тест',minutes:5,criteria:{},quotas:[{id:'all',label:'Все',target:10}],budget:2};
    const result=await request(reviewer,'/listings','POST',body);expect(result.status).toBe(201);
    expect((await request(reviewer,'/listings','POST',body)).status).toBe(409);
    const w=await request(reviewer,'/me');expect(w.data.wallet.bonus).toBe(6);expect(w.data.history.filter((x:any)=>x.kind==='bonus')).toHaveLength(1);
  });
  it('reserves the last quota atomically under concurrent starts',async()=>{
    const l=await create(1);
    const results=await Promise.all([request(a,`/listings/${l.id}/join`,'POST',{}),request(b,`/listings/${l.id}/join`,'POST',{})]);
    expect(results.map(r=>r.status).sort()).toEqual([200,409]);
    const winner=results[0].status===200?a:b;
    const retry=await request(winner,`/listings/${l.id}/join`,'POST',{});expect(retry.data.token).toBe(results.find(r=>r.status===200)!.data.token);
    const [rows]=await db.query<any[]>('SELECT COUNT(*) count FROM community_participations WHERE listing_id=?',[l.id]);expect(rows[0].count).toBe(1);
    expect((await request(author,`/listings/${l.id}/join`,'POST',{})).status).toBe(403);
  });
  it('records failed screening once without consuming budget or creating response sessions',async()=>{
    const l=await create(2,[{id:'q1',question:'Живёте с ребёнком?',options:['Да','Нет'],accepted:[0]}]);
    expect((await request(a,`/listings/${l.id}/join`,'POST',{answers:{q1:1}})).data.screenedOut).toBe(true);
    expect((await request(a,`/listings/${l.id}/join`,'POST',{answers:{q1:0}})).status).toBe(409);
    const [rows]=await db.query<any[]>('SELECT earned_budget,bonus_budget FROM community_listings WHERE id=?',[l.id]);expect(rows[0].earned_budget+rows[0].bonus_budget).toBe(2);
  });
  it('settles a completed participation once, even when settlement runs concurrently',async()=>{
    const l=await create(),joined=await request(a,`/listings/${l.id}/join`,'POST',{});expect(joined.status).toBe(200);await finish(joined.data.token);
    const before=(await request(a,'/me')).data.wallet.earned;
    await Promise.all([settle(),settle()]);await settle();
    const me=(await request(a,'/me')).data;expect(me.wallet.earned).toBe(before+1);expect(me.history.filter((x:any)=>x.kind==='participation'&&x.amount===1).length).toBeGreaterThan(0);
    const [rows]=await db.query<any[]>('SELECT status FROM community_participations WHERE listing_id=? AND user_id=?',[l.id,a]);expect(rows[0].status).toBe('credited');
  });
  it('returns unused reserves after closing and does not pay after the deadline',async()=>{
    const l=await create(),joined=await request(a,`/listings/${l.id}/join`,'POST',{});expect(joined.status).toBe(200);
    const before=(await request(author,'/me')).data.wallet.earned;
    expect((await request(author,`/listings/${l.id}`,'PATCH',{state:'closed'})).status).toBe(200);
    await db.execute('UPDATE community_participations SET expires_at=DATE_SUB(NOW(),INTERVAL 1 MINUTE) WHERE listing_id=?',[l.id]);
    await db.execute("UPDATE response_sessions SET status='completed',started_at=DATE_SUB(NOW(),INTERVAL 5 MINUTE),completed_at=NOW() WHERE public_token=?",[joined.data.token]);
    await settle();await settle();
    expect((await request(author,'/me')).data.wallet.earned).toBe(before+2);
    expect((await request(a,`/listings/${l.id}/join`,'POST',{})).status).toBe(409);
  });
  it('keeps promised rewards when promotion is paused and snapshots are edited',async()=>{
    const l=await create(),joined=await request(a,`/listings/${l.id}/join`,'POST',{});expect(joined.status).toBe(200);
    expect((await request(author,`/listings/${l.id}`,'PATCH',{state:'paused'})).status).toBe(200);
    const [configs]=await db.query<any[]>('SELECT config FROM community_listings WHERE id=?',[l.id]);
    const config=typeof configs[0].config==='string'?JSON.parse(configs[0].config):configs[0].config;
    expect((await request(author,`/listings/${l.id}`,'PATCH',{config:{...config,criteria:{childrenMax:0}}})).status).toBe(200);
    expect((await request(b,`/listings/${l.id}/join`,'POST',{})).status).toBe(409);
    await finish(joined.data.token);await settle();
    const [rows]=await db.query<any[]>('SELECT status,snapshot FROM community_participations WHERE listing_id=?',[l.id]);expect(rows[0].status).toBe('credited');
    const snapshot=typeof rows[0].snapshot==='string'?JSON.parse(rows[0].snapshot):rows[0].snapshot;expect(snapshot.profile.children).toBe(2);
  });
  it('requires independent review, records evidence and supports an appeal',async()=>{
    const l=await create(),joined=await request(a,`/listings/${l.id}/join`,'POST',{});await finish(joined.data.token,5);await settle();
    const [rows]=await db.query<any[]>('SELECT id,status FROM community_participations WHERE listing_id=?',[l.id]);const id=rows[0].id;expect(rows[0].status).toBe('review');
    expect((await request(author,`/reviews/${id}`)).status).toBe(403);
    expect((await request(a,`/reviews/${id}`,'POST',{approve:true,reason:'Не могу проверять собственное участие.'})).status).toBe(403);
    expect((await request(reviewer,`/reviews/${id}`)).data.seconds).toBe(5);
    expect((await request(reviewer,`/reviews/${id}`,'POST',{approve:false,reason:'Время прохождения требует уточнения участника.'})).status).toBe(200);
    expect((await request(a,`/participations/${id}/appeal`,'POST',{text:'Прошу пересмотреть начисление за моё прохождение.'})).status).toBe(200);
    const before=(await request(a,'/me')).data.wallet.earned;
    expect((await request(reviewer,`/reviews/${id}`,'POST',{approve:true,reason:'Проверены обстоятельства, оснований для отказа нет.'})).status).toBe(200);
    expect((await request(a,'/me')).data.wallet.earned).toBe(before+1);
    expect((await request(reviewer,`/reviews/${id}`,'POST',{approve:true,reason:'Повторный запрос не должен начислять баллы.'})).status).toBe(409);
  });
  it('does not overdraw a budget under competing starts or a rejected top-up',async()=>{
    const l=await create(10);
    const results=await Promise.all([request(a,`/listings/${l.id}/join`,'POST',{}),request(b,`/listings/${l.id}/join`,'POST',{}),request(reviewer,`/listings/${l.id}/join`,'POST',{})]);
    expect(results.map(r=>r.status).sort()).toEqual([200,200,409]);
    const [rows]=await db.query<any[]>('SELECT earned_budget,bonus_budget FROM community_listings WHERE id=?',[l.id]);expect(rows[0].earned_budget+rows[0].bonus_budget).toBe(0);
    const before=(await request(author,'/me')).data.wallet.earned;
    expect((await request(author,`/listings/${l.id}`,'PATCH',{topup:10000})).status).toBe(409);
    expect((await request(author,'/me')).data.wallet.earned).toBe(before);
  });
  it('waits for quality jobs and routes a stalled check to review instead of paying blindly',async()=>{
    const l=await create(),joined=await request(a,`/listings/${l.id}/join`,'POST',{});await finish(joined.data.token);
    const [rows]=await db.query<any[]>('SELECT id,session_id FROM community_participations WHERE listing_id=?',[l.id]);const p=rows[0];
    await db.execute('INSERT INTO quality_jobs(id,survey_id,kind,options,status) VALUES (?,?,\'recompute\',?,\'running\')',[randomUUID(),l.surveyId,JSON.stringify({sessionId:p.session_id})]);
    await settle();
    const [pending]=await db.query<any[]>('SELECT status FROM community_participations WHERE id=?',[p.id]);expect(pending[0].status).toBe('pending');
    await db.execute('UPDATE response_sessions SET completed_at=DATE_SUB(NOW(),INTERVAL 16 MINUTE),started_at=DATE_SUB(NOW(),INTERVAL 21 MINUTE) WHERE id=?',[p.session_id]);
    await settle();
    const [review]=await db.query<any[]>('SELECT status FROM community_participations WHERE id=?',[p.id]);expect(review[0].status).toBe('review');
  });
  it('marks community source in real result queries without disclosing the participant profile',async()=>{
    const {loadSurveyResults}=await import('../survey-results.js');
    const l=await create(),joined=await request(a,`/listings/${l.id}/join`,'POST',{});expect(joined.status).toBe(200);
    const results=await loadSurveyResults(l.surveyId,{summary:true});
    expect(results.respondents).toHaveLength(1);expect(results.respondents[0].source).toBe('community');expect(results.respondents[0]).not.toHaveProperty('profile');
  });
});
