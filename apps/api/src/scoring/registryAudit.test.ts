import {expect,it} from 'vitest';
import {loadMethodologyRegistry} from '../data/methodologyRegistry.js';
import {withdrawnMethodologyCodes} from '../data/withdrawnMethodologies.js';
import {registryScoringIssues} from './registryAudit.js';

it('checks every remaining registry instrument against its real response domain and saved controls',async()=>{
 const registrations=await loadMethodologyRegistry();
 const registered=new Set(registrations.map(r=>r.instrument.code));
 for(const code of withdrawnMethodologyCodes)expect(registered.has(code)).toBe(true);
 const failures=registrations.filter(r=>!withdrawnMethodologyCodes.has(r.instrument.code)).flatMap(r=>registryScoringIssues(r).map(issue=>`${r.instrument.code}: ${issue}`));
 expect(failures).toEqual([]);
},60_000);

it('does not pass an inconsistent new instrument merely because existing bad instruments were withdrawn',()=>{
 expect(registryScoringIssues({instrument:{code:'test_new',title:'New',questions:[{code:'q1',text:'Question',type:'single',options:[{value:'yes',label:'Yes'},{value:'no',label:'No'}]}]},scoringConfig:{min:0,max:1,scales:[{key:'x',label:'x',items:[1],reverseItems:[],aggregation:'sum'}]},validationCases:[{title:'Expected yes',answers:{'1':'yes'},expected:{x:1}}]})).toContain('Valid response rejected: 1');
});
