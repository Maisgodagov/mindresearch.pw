import styled from 'styled-components';
import {Choice} from '../../containers/SurveyTaking/styles';
export {isAnchoredRating} from './detect';
const Rating=styled.div`
 margin: auto 0;
 .rating-buttons {display:flex;gap:6px;overflow-x:auto;padding:3px;margin:-3px;}
 .rating-buttons button {flex:1 0 24px;}
 .rating-buttons button.ant-btn {justify-content:center !important;text-align:center;min-height:52px;padding:8px 0;border-radius:10px;font-size:16px;font-variant-numeric:tabular-nums;}
 .rating-buttons button:focus-visible {outline:2px solid #527a50;outline-offset:1px;}
 .rating-anchors {display:flex;justify-content:space-between;gap:24px;margin-top:12px;color:#526257;font-size:13px;line-height:1.5;}
 .rating-anchors span {max-width:45%;}
 .rating-anchors span:last-child {text-align:right;}
 @media(max-width:480px){.rating-buttons {gap:4px;} .rating-buttons button.ant-btn {font-size:14px;} }
`;
export function AnchoredRating({options,value,disabled,onChange}:{options:{value:string;label:string}[];value:unknown;disabled:boolean;onChange:(value:string)=>void}){
 const first=options[0],last=options[options.length-1];
 return <Rating>
  <div className="rating-buttons" role="group" aria-label={`Шкала от ${first.value} — ${first.label} до ${last.value} — ${last.label}`}>
   {options.map(option=><Choice key={option.value} $active={value===option.value} aria-pressed={value===option.value} aria-label={option.label===option.value?option.value:`${option.value} — ${option.label}`} disabled={disabled} onClick={()=>onChange(option.value)}>{option.value}</Choice>)}
  </div>
  <div className="rating-anchors"><span>{first.value} — {first.label}</span><span>{last.value} — {last.label}</span></div>
 </Rating>;
}
