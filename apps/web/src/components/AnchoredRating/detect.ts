type Option = {value:string;label:string};
/** Only collapse scales whose interior labels are exactly their numeric values. */
export function isAnchoredRating(type:string,options:Option[]|null=[]):boolean {
 if(!options||type!=='single'||options.length<5||options.length>9)return false;
 const first=Number(options[0].value);
 return Number.isInteger(first)&&options.every((o,i)=>String(first+i)===o.value)
  &&options.slice(1,-1).every(o=>o.label.trim()===o.value)
  &&options[0].label.trim()!==options[0].value&&options.at(-1)!.label.trim()!==options.at(-1)!.value
  &&Boolean(options[0].label.trim()&&options.at(-1)!.label.trim());
}
