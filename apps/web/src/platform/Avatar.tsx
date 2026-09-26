import{Avatar as DiceAvatar,Style}from'@dicebear/core';
import lorelei from'@dicebear/styles/lorelei.json';

const style=new Style(lorelei);
export const avatarSeeds=[
  'willow','meadow','clover','hazel','linden','juniper','iris','rowan',
  'olive','flora','luna','sage','violet','dahlia','maple','aster',
  'mira','selene','aurora','freya','alba','nora','elara','maya',
];
const cache=new Map<string,string>();
export function avatarUri(seed='willow'){if(!cache.has(seed))cache.set(seed,new DiceAvatar(style,{seed,backgroundColor:['e3eee0','d6e7dd','e8e2d5','dce6ef']}).toDataUri());return cache.get(seed)!}
export function StockAvatar({seed='willow',alt='',className}:{seed?:string|null;alt?:string;className?:string}){return <img className={className} src={avatarUri(seed||'willow')} alt={alt}/>}
