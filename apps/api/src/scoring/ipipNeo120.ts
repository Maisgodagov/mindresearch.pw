type Direction='+'|'-';
type FacetKey='N1'|'N2'|'N3'|'N4'|'N5'|'N6'|'E1'|'E2'|'E3'|'E4'|'E5'|'E6'|'O1'|'O2'|'O3'|'O4'|'O5'|'O6'|'A1'|'A2'|'A3'|'A4'|'A5'|'A6'|'C1'|'C2'|'C3'|'C4'|'C5'|'C6';
type DomainKey='neuroticism'|'extraversion'|'openness'|'agreeableness'|'conscientiousness';
type FacetDefinition={domain:DomainKey;label:string;items:readonly [number,Direction][]};
type Score={label:string;score:number;average:number;min:1;max:5};

export const ipipNeo120Facets={
  N1:{domain:'neuroticism',label:'Anxiety',items:[[1,'+'],[31,'+'],[61,'+'],[91,'+']]},
  N2:{domain:'neuroticism',label:'Anger',items:[[6,'+'],[36,'+'],[66,'+'],[96,'-']]},
  N3:{domain:'neuroticism',label:'Depression',items:[[11,'+'],[41,'+'],[71,'+'],[101,'-']]},
  N4:{domain:'neuroticism',label:'Self-Consciousness',items:[[16,'+'],[46,'+'],[76,'+'],[106,'-']]},
  N5:{domain:'neuroticism',label:'Immoderation',items:[[21,'+'],[51,'-'],[81,'-'],[111,'-']]},
  N6:{domain:'neuroticism',label:'Vulnerability',items:[[26,'+'],[56,'+'],[86,'+'],[116,'-']]},
  E1:{domain:'extraversion',label:'Friendliness',items:[[2,'+'],[32,'+'],[62,'-'],[92,'-']]},
  E2:{domain:'extraversion',label:'Gregariousness',items:[[7,'+'],[37,'+'],[67,'-'],[97,'-']]},
  E3:{domain:'extraversion',label:'Assertiveness',items:[[12,'+'],[42,'+'],[72,'+'],[102,'-']]},
  E4:{domain:'extraversion',label:'Activity Level',items:[[17,'+'],[47,'+'],[77,'+'],[107,'-']]},
  E5:{domain:'extraversion',label:'Excitement-Seeking',items:[[22,'+'],[52,'+'],[82,'+'],[112,'+']]},
  E6:{domain:'extraversion',label:'Cheerfulness',items:[[27,'+'],[57,'+'],[87,'+'],[117,'+']]},
  O1:{domain:'openness',label:'Imagination',items:[[3,'+'],[33,'+'],[63,'+'],[93,'+']]},
  O2:{domain:'openness',label:'Artistic Interests',items:[[8,'+'],[38,'+'],[68,'-'],[98,'-']]},
  O3:{domain:'openness',label:'Emotionality',items:[[13,'+'],[43,'+'],[73,'-'],[103,'-']]},
  O4:{domain:'openness',label:'Adventurousness',items:[[18,'+'],[48,'-'],[78,'-'],[108,'-']]},
  O5:{domain:'openness',label:'Intellect',items:[[23,'+'],[53,'-'],[83,'-'],[113,'-']]},
  O6:{domain:'openness',label:'Liberalism',items:[[28,'+'],[58,'+'],[88,'-'],[118,'-']]},
  A1:{domain:'agreeableness',label:'Trust',items:[[4,'+'],[34,'+'],[64,'+'],[94,'-']]},
  A2:{domain:'agreeableness',label:'Morality',items:[[9,'-'],[39,'-'],[69,'-'],[99,'-']]},
  A3:{domain:'agreeableness',label:'Altruism',items:[[14,'+'],[44,'+'],[74,'-'],[104,'-']]},
  A4:{domain:'agreeableness',label:'Cooperation',items:[[19,'-'],[49,'-'],[79,'-'],[109,'-']]},
  A5:{domain:'agreeableness',label:'Modesty',items:[[24,'-'],[54,'-'],[84,'-'],[114,'-']]},
  A6:{domain:'agreeableness',label:'Sympathy',items:[[29,'+'],[59,'+'],[89,'-'],[119,'-']]},
  C1:{domain:'conscientiousness',label:'Self-Efficacy',items:[[5,'+'],[35,'+'],[65,'+'],[95,'+']]},
  C2:{domain:'conscientiousness',label:'Orderliness',items:[[10,'+'],[40,'-'],[70,'-'],[100,'-']]},
  C3:{domain:'conscientiousness',label:'Dutifulness',items:[[15,'+'],[45,'+'],[75,'-'],[105,'-']]},
  C4:{domain:'conscientiousness',label:'Achievement-Striving',items:[[20,'+'],[50,'+'],[80,'-'],[110,'-']]},
  C5:{domain:'conscientiousness',label:'Self-Discipline',items:[[25,'+'],[55,'+'],[85,'-'],[115,'-']]},
  C6:{domain:'conscientiousness',label:'Cautiousness',items:[[30,'-'],[60,'-'],[90,'-'],[120,'-']]},
}as const satisfies Record<FacetKey,FacetDefinition>;

const domainLabels:Record<DomainKey,string>={
  neuroticism:'Neuroticism',
  extraversion:'Extraversion',
  openness:'Openness to Experience',
  agreeableness:'Agreeableness',
  conscientiousness:'Conscientiousness',
};

export type IpipNeo120Result={instrument:'IPIP-NEO-120';complete:true;answered:120;domains:Record<DomainKey,Score>;facets:Record<FacetKey,Score>};

const scoreValue=(raw:number,direction:Direction)=>direction==='+'?raw:6-raw;
const makeScore=(label:string,values:number[]):Score=>{const score=values.reduce((sum,value)=>sum+value,0);return{label,score,average:score/values.length,min:1,max:5}};

export function scoreIpipNeo120(answers:Map<number,number>):IpipNeo120Result|null{
  const required=Array.from({length:120},(_,index)=>index+1);
  if(answers.size!==120||required.some(item=>!answers.has(item))||[...answers.values()].some(value=>!Number.isInteger(value)||value<1||value>5))return null;
  const facets=Object.fromEntries(Object.entries(ipipNeo120Facets).map(([key,facet])=>[key,makeScore(facet.label,facet.items.map(([item,direction])=>scoreValue(answers.get(item)!,direction)))]))as IpipNeo120Result['facets'];
  const domains=Object.fromEntries(Object.entries(domainLabels).map(([domain,label])=>{
    const values=Object.values(ipipNeo120Facets).flatMap(facet=>facet.domain===domain?facet.items.map(([item,direction])=>scoreValue(answers.get(item)!,direction)):[]);
    return[domain,makeScore(label,values)];
  }))as IpipNeo120Result['domains'];
  return{instrument:'IPIP-NEO-120',complete:true,answered:120,domains,facets};
}
