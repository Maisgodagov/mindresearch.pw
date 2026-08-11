export type Option={value:string;label:string};
export type Question={id:string;code:string;text:string;type:'single'|'multiple'|'text'|'number';required:boolean;options:Option[]|null;validation:Record<string,number>|null;sectionCode:string;sectionTitle:string};
export type Survey={id:string;slug:string;title:string;welcomeTitle:string;welcomeText:string;settings:Record<string,unknown>;questions:Question[]};
export type SessionRow={id:string;status:'in_progress'|'completed'|'abandoned';startedAt:string;lastActivityAt:string;completedAt:string|null;answered:number};
