import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import { randomUUID } from 'node:crypto';
import { spawn, type ChildProcess } from 'node:child_process';
import { createServer } from 'node:net';

const enabled=process.env.COMMUNITY_TEST_DATABASE_URL;
describe.skipIf(!enabled)('Survey sharing and concurrent edits',()=>{
  let db:typeof import('./db.js').db,sign:typeof import('./auth.js').signToken,child:ChildProcess,base:string;
  const owner=randomUUID(),viewer=randomUUID(),editor=randomUUID(),outsider=randomUUID(),regularAuthor=randomUUID();
  const payload={title:'Shared fixture survey',welcomeTitle:'Welcome',welcomeText:'Test survey welcome',description:'Fixture',status:'draft',collectAlias:false,showAuthor:true,sections:[{kind:'custom',title:'Questions',questions:[{text:'How old?',type:'number',required:true}]}]};
  let surveyId:string,sessionId:string;
  async function request(user:string|null,path:string,method='GET',body?:unknown,version?:number){const r=await fetch(base+'/api'+path,{method,headers:{'Content-Type':'application/json',...(user?{Authorization:'Bearer '+sign({id:user,role:'researcher'})}:{}),...(version!==undefined?{'X-Survey-Version':String(version)}:{})},body:body===undefined?undefined:JSON.stringify(body)});return {status:r.status,data:r.status===204?null:await r.json()};}
  const invite=async(permission='view',recipient?:string)=>{const r=await request(owner,`/sharing/surveys/${surveyId}/invitations`,'POST',{permission,...(recipient?{recipient}: {})});expect(r.status).toBe(201);return {id:r.data.id,token:r.data.path.split('/').pop()};};
  beforeAll(async()=>{
    const u=new URL(enabled!);if(!['127.0.0.1','localhost'].includes(u.hostname)||!/^\/mindresearch_community_test_/.test(u.pathname))throw new Error('Isolated localhost test database required');
    process.env.DATABASE_URL=enabled;process.env.JWT_SECRET='sharing-test-fixture-secret-only';
    const d=await import('./db.js');db=d.db;await d.migrate();await (await import('./sharing.js')).migrateSharing();await (await import('./sharing.js')).migrateSharing();sign=(await import('./auth.js')).signToken;
    for(const id of [owner,viewer,editor,outsider,regularAuthor])await db.execute('INSERT INTO users(id,email,password_hash,name,role,public_slug) VALUES (?,?,?,?,?,?)',[id,id+'@example.test','not-real','Fixture '+id.slice(0,4),id===owner?'admin':'researcher','fixture-'+id]);
    const port=await new Promise<number>(resolve=>{const s=createServer();s.listen(0,'127.0.0.1',()=>{const p=(s.address() as any).port;s.close(()=>resolve(p));});});base=`http://127.0.0.1:${port}`;
    child=spawn(process.execPath,['dist/index.js'],{cwd:process.cwd(),env:{...process.env,PORT:String(port),QUALITY_V2_ENABLED:'0'},stdio:'pipe'});
    let logs='';child.stderr?.on('data',d=>logs+=d);for(let i=0;i<100;i++){try{if((await fetch(base+'/api/health')).ok)break;}catch{}if(i===99)throw new Error(logs||'API did not start');await new Promise(r=>setTimeout(r,100));}
    const made=await request(owner,'/account/surveys','POST',payload);expect(made.status).toBe(201);surveyId=made.data.id;
    sessionId=randomUUID();await db.execute("INSERT INTO response_sessions(id,survey_id,public_token,status) VALUES (?,?,?,'completed')",[sessionId,surveyId,randomUUID()]);
  },30000);
  afterAll(async()=>{child?.kill();if(db)await db.end();});
  it('credits or rejects community participation in the completion request without waiting for quality jobs',async()=>{
    await db.execute("UPDATE users SET role='admin' WHERE id=?",[regularAuthor]);
    const profile={adultConfirmed:true,age:30,sex:'female',education:'higher',studying:'no',employment:'employed',marital:'married',children:0,childAges:[]};
    for(const u of [owner,regularAuthor])expect((await request(u,'/community/profile','PUT',{data:profile,complete:true})).status).toBe(200);
    await request(owner,'/community/me');
    for(const fast of [false,true]){
      const made=await request(owner,'/account/surveys','POST',{...payload,status:'active',sections:[{kind:'custom',title:'Questions',questions:Array.from({length:4},()=>({text:'Question?',type:'number',required:true}))}]});expect(made.status).toBe(201);
      const listing=await request(owner,'/community/listings','POST',{surveyId:made.data.id,description:'Behavioral test survey',topic:'Test',minutes:5,criteria:{},quotas:[{id:'all',label:'All',target:10}],budget:1});expect(listing.status).toBe(201);
      const joined=await request(regularAuthor,`/community/listings/${listing.data.id}/join`,'POST',{});expect(joined.status).toBe(200);
      const [sessions]=await db.query<any[]>('SELECT id FROM response_sessions WHERE public_token=?',[joined.data.token]);const sid=sessions[0].id;
      await db.execute('UPDATE response_sessions SET started_at=DATE_SUB(NOW(),INTERVAL 60 SECOND) WHERE id=?',[sid]);
      const [questions]=await db.query<any[]>('SELECT q.id FROM questions q JOIN sections s ON s.id=q.section_id WHERE s.survey_id=?',[made.data.id]);
      for(const q of questions){await db.execute('INSERT INTO answers(session_id,question_id,value) VALUES (?,?,?)',[sid,q.id,'1']);await db.execute('INSERT INTO question_timings(session_id,question_id,visit_id,active_ms) VALUES (?,?,?,?)',[sid,q.id,randomUUID(),fast?500:1500]);}
      await db.execute("INSERT INTO quality_jobs(id,survey_id,kind,options,status) VALUES (?,?,'recompute',?,'running')",[randomUUID(),made.data.id,JSON.stringify({sessionId:sid})]);
      const before=(await request(regularAuthor,'/community/me')).data.wallet.earned;
      const done=await request(null,`/public/sessions/${joined.data.token}/complete`,'POST',{});expect(done.status).toBe(200);expect(done.data.community.status).toBe(fast?'rejected':'credited');
      expect((await request(regularAuthor,'/community/me')).data.wallet.earned).toBe(before+(fast?0:1));
      expect((await request(null,`/public/sessions/${joined.data.token}/complete`,'POST',{})).data.community.status).toBe(fast?'rejected':'credited');
      expect((await request(regularAuthor,'/community/me')).data.wallet.earned).toBe(before+(fast?0:1));
    }
    await db.execute("UPDATE users SET role='researcher' WHERE id=?",[regularAuthor]);
  });
  it('saves an avatar when the optional biography was never filled in',async()=>{
    await db.execute('UPDATE users SET bio=NULL WHERE id=?',[viewer]);
    const me=(await request(viewer,'/account/me')).data;
    expect(me.bio).toBe('');
    expect((await request(viewer,'/account/me','PATCH',{...me,bio:null,avatarSeed:'willow'})).status).toBe(200);
    expect((await request(viewer,'/account/me')).data.avatarSeed).toBe('willow');
  });
  it('allows every author to manage sharing, never collaborators or unrelated admins',async()=>{
    expect((await request(null,`/sharing/surveys/${surveyId}`)).status).toBe(401);
    expect((await request(outsider,`/sharing/surveys/${surveyId}/invitations`,'POST',{permission:'edit'})).status).toBe(403);
    const own=await request(regularAuthor,'/account/surveys','POST',payload);expect(own.status).toBe(201);
    expect((await request(regularAuthor,`/sharing/surveys/${own.data.id}/invitations`,'POST',{permission:'view'})).status).toBe(201);
    expect((await request(regularAuthor,`/sharing/surveys/${own.data.id}/access`)).data.canManage).toBe(true);
    expect((await request(owner,`/sharing/surveys/${own.data.id}/invitations`,'POST',{permission:'view'})).status).toBe(403);
  });
  it('binds email/username invitations to the intended account and requires login',async()=>{
    const i=await invite('view',viewer+'@example.test');
    expect((await request(null,`/sharing/invitations/${i.token}/accept`,'POST',{})).status).toBe(401);
    expect((await request(outsider,`/sharing/invitations/${i.token}/accept`,'POST',{})).status).toBe(404);
    expect((await request(viewer,`/sharing/invitations/${i.token}/accept`,'POST',{})).data.surveyId).toBe(surveyId);
    const shared=(await request(viewer,'/sharing/shared')).data;expect(shared.find((s:any)=>s.id===surveyId)).toMatchObject({permission:'view',authorName:expect.any(String)});
    const j=await invite('edit','@fixture-'+editor);expect((await request(editor,`/sharing/invitations/${j.token}/accept`,'POST',{})).status).toBe(200);
  });
  it('enforces view-only across results, survey editing, quality and lifecycle endpoints',async()=>{
    expect((await request(viewer,`/admin/surveys/${surveyId}/results`)).status).toBe(200);
    expect((await request(outsider,`/admin/surveys/${surveyId}/results`)).status).toBe(404);
    expect((await request(viewer,`/account/surveys/${surveyId}`)).status).toBe(404);
    expect((await request(viewer,`/account/surveys/${surveyId}`,'PUT',payload,0)).status).toBe(403);
    expect((await request(viewer,`/admin/surveys/${surveyId}/results/trash`,'POST',{sessionIds:[sessionId]},0)).status).toBe(403);
    expect((await request(viewer,`/admin/surveys/${surveyId}/quality-v2/metadata`,'POST',{sessionIds:[sessionId],trusted:true},0)).status).toBe(404);
    for(const action of ['trash','archive','publish'])expect((await request(editor,`/account/surveys/${surveyId}/${action}`,'POST',{})).status).toBe(404);
    expect((await request(editor,`/account/surveys/${surveyId}`,'PUT',{...payload,status:'archived'},0)).status).toBe(403);
  });
  it('allows shared imported private questionnaires without exposing unrelated instruments',async()=>{
    const instrument=randomUUID(),unrelated=randomUUID(),section=randomUUID();
    for(const i of [instrument,unrelated])await db.execute("INSERT INTO instruments(id,owner_id,code,title,status) VALUES (?,?,?,?,'active')",[i,owner,'fixture-'+i,'Private fixture']);
    await db.execute("INSERT INTO instrument_questions(id,instrument_id,code,text,type,position) VALUES (?,?,?,?,'number',0)",[randomUUID(),instrument,'age','Age?']);
    await db.execute("INSERT INTO sections(id,survey_id,code,title,position,source_instrument_id,section_kind) VALUES (?,?,?, ?,99,?,'custom')",[section,surveyId,'private-fixture','Private',instrument]);
    expect((await request(editor,`/account/instruments/${instrument}/questions`)).status).toBe(200);
    expect((await request(viewer,`/account/instruments/${instrument}/questions`)).status).toBe(200);
    expect((await request(outsider,`/account/instruments/${instrument}/questions`)).status).toBe(404);
    expect((await request(editor,`/account/instruments/${unrelated}/questions`)).status).toBe(404);
    expect((await request(viewer,`/sharing/surveys/${surveyId}/preview`)).data.questions.length).toBeGreaterThan(0);
    expect((await request(outsider,`/sharing/surveys/${surveyId}/preview`)).status).toBe(403);
    await db.execute('UPDATE instruments SET owner_id=? WHERE id=?',[outsider,unrelated]);
    await db.execute('UPDATE surveys SET builder_state=? WHERE id=?',[JSON.stringify({meta:payload,sections:[{kind:'library',instrumentId:unrelated}]}),surveyId]);
    expect((await request(editor,`/account/instruments/${unrelated}/questions`)).status).toBe(404);
    expect((await request(viewer,`/sharing/surveys/${surveyId}/preview`)).data.questions).toEqual([]);
  });
  it('atomically rejects a stale second result mutation and permits explicit refresh',async()=>{
    const version=(await request(editor,`/admin/surveys/${surveyId}/results`)).data.version;
    const r=await Promise.all([request(owner,`/admin/surveys/${surveyId}/results/trash`,'POST',{sessionIds:[sessionId]},version),request(editor,`/admin/surveys/${surveyId}/results/trash`,'POST',{sessionIds:[sessionId]},version)]);
    expect(r.map(x=>x.status).sort()).toEqual([200,409]);
    expect((await request(editor,`/admin/surveys/${surveyId}/results/restore`,'POST',{sessionIds:[sessionId]},version)).status).toBe(409);
    expect((await request(editor,`/admin/surveys/${surveyId}/results/restore`,'POST',{sessionIds:[sessionId]},version+1)).status).toBe(200);
  });
  it('protects survey saves and draft autosave with the same version counter',async()=>{
    const v=(await request(editor,`/account/surveys/${surveyId}`)).data.version;
    const results=await Promise.all([request(owner,`/account/surveys/${surveyId}`,'PUT',{...payload,title:'Owner changes'},v),request(editor,`/account/surveys/${surveyId}`,'PUT',{...payload,title:'Editor changes'},v)]);
    expect(results.map(x=>x.status).sort()).toEqual([200,409]);
    expect((await request(editor,`/account/surveys/${surveyId}`,'PUT',payload)).status).toBe(409);
    const state={meta:{...payload},sections:payload.sections,open:{}};
    expect((await request(editor,`/account/surveys/${surveyId}/draft-state`,'PUT',state,v)).status).toBe(409);
    expect((await request(editor,`/account/surveys/${surveyId}/draft-state`,'PUT',state,v+1)).status).toBe(200);
  });
  it('protects metadata changes against stale survey/result versions',async()=>{
    const v=(await request(editor,`/admin/surveys/${surveyId}/results`)).data.version;
    expect((await request(editor,`/admin/surveys/${surveyId}/quality-v2/metadata`,'POST',{sessionIds:[sessionId],trusted:true},v)).status).toBe(200);
    expect((await request(owner,`/admin/surveys/${surveyId}/quality-v2/metadata`,'POST',{sessionIds:[sessionId],trusted:false},v)).status).toBe(409);
  });
  it('uses a link once under concurrent acceptance and does not downgrade existing editor rights',async()=>{
    const i=await invite('view');const r=await Promise.all([request(editor,`/sharing/invitations/${i.token}/accept`,'POST',{}),request(outsider,`/sharing/invitations/${i.token}/accept`,'POST',{})]);expect(r.map(x=>x.status).sort()).toEqual([200,404]);
    expect((await request(editor,`/sharing/surveys/${surveyId}/access`)).data.permission).toBe('edit');
  });
  it('expires and cancels invitations and revokes accepted access without regranting on replay',async()=>{
    const i=await invite();await db.execute('UPDATE survey_invitations SET expires_at=DATE_SUB(NOW(),INTERVAL 1 DAY) WHERE id=?',[i.id]);expect((await request(outsider,`/sharing/invitations/${i.token}/accept`,'POST',{})).status).toBe(404);
    const j=await invite();await request(owner,`/sharing/surveys/${surveyId}/invitations/${j.id}`,'DELETE');expect((await request(outsider,`/sharing/invitations/${j.token}/accept`,'POST',{})).status).toBe(404);
    const k=await invite('edit');await request(viewer,`/sharing/invitations/${k.token}/accept`,'POST',{});
    await request(owner,`/sharing/surveys/${surveyId}/members/${viewer}`,'PATCH',{permission:'view'});expect((await request(viewer,`/sharing/surveys/${surveyId}/access`)).data.permission).toBe('view');
    const pending=await invite('edit',viewer+'@example.test');
    await request(owner,`/sharing/surveys/${surveyId}/members/${viewer}`,'DELETE');
    expect((await request(viewer,`/admin/surveys/${surveyId}/results`)).status).toBe(404);
    expect((await request(viewer,`/sharing/invitations/${k.token}/accept`,'POST',{})).status).toBe(404);
    expect((await request(viewer,`/sharing/invitations/${pending.token}/accept`,'POST',{})).status).toBe(404);
  });
});
