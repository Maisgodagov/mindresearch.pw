import type {Request,Response,NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import {createHash,randomBytes,randomUUID} from 'node:crypto';
import {db} from './db.js';

export type AuthUser={id:string;role:string};
export type AuthRequest=Request & {user?:AuthUser};
const ACCESS_TOKEN_TTL='15m',REFRESH_DAYS=180,REFRESH_COOKIE='mindresearch_refresh';
const refreshMaxAge=REFRESH_DAYS*24*60*60*1000;
const hashToken=(token:string)=>createHash('sha256').update(token).digest('hex');
const cookieOptions={httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax' as const,path:'/api/auth',maxAge:refreshMaxAge};

export function signToken(user:AuthUser){return jwt.sign(user,process.env.JWT_SECRET!,{expiresIn:ACCESS_TOKEN_TTL})}
function readCookie(req:Request,name:string){const value=req.headers.cookie?.split(';').map(x=>x.trim()).find(x=>x.startsWith(`${name}=`))?.slice(name.length+1);return value?decodeURIComponent(value):null}
export function clearRefreshCookie(res:Response){res.clearCookie(REFRESH_COOKIE,{httpOnly:true,secure:cookieOptions.secure,sameSite:'lax',path:'/api/auth'})}

export async function createAuthSession(req:Request,res:Response,user:AuthUser){
  const refreshToken=randomBytes(48).toString('hex'),expiresAt=new Date(Date.now()+refreshMaxAge);
  await db.execute('INSERT INTO auth_sessions (id,user_id,token_hash,expires_at,user_agent,ip_address) VALUES (?,?,?,?,?,?)',[randomUUID(),user.id,hashToken(refreshToken),expiresAt,req.get('user-agent')?.slice(0,500)??null,req.ip?.slice(0,45)??null]);
  res.cookie(REFRESH_COOKIE,refreshToken,cookieOptions);return signToken(user);
}
export async function rotateAuthSession(req:Request,res:Response){
  const refreshToken=readCookie(req,REFRESH_COOKIE);if(!refreshToken)return null;
  const connection=await db.getConnection();
  try{await connection.beginTransaction();const[rows]=await connection.query<any[]>(`SELECT s.id,s.user_id userId,u.role FROM auth_sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=? AND s.revoked_at IS NULL AND s.expires_at>CURRENT_TIMESTAMP FOR UPDATE`,[hashToken(refreshToken)]);if(!rows.length){await connection.rollback();clearRefreshCookie(res);return null}const session=rows[0],nextToken=randomBytes(48).toString('hex'),expiresAt=new Date(Date.now()+refreshMaxAge);await connection.execute('UPDATE auth_sessions SET token_hash=?,expires_at=?,last_used_at=CURRENT_TIMESTAMP,user_agent=?,ip_address=? WHERE id=?',[hashToken(nextToken),expiresAt,req.get('user-agent')?.slice(0,500)??null,req.ip?.slice(0,45)??null,session.id]);await connection.commit();res.cookie(REFRESH_COOKIE,nextToken,cookieOptions);return signToken({id:session.userId,role:session.role})}catch(error){await connection.rollback();throw error}finally{connection.release()}
}
export async function revokeAuthSession(req:Request,res:Response){const token=readCookie(req,REFRESH_COOKIE);if(token)await db.execute('UPDATE auth_sessions SET revoked_at=CURRENT_TIMESTAMP WHERE token_hash=? AND revoked_at IS NULL',[hashToken(token)]);clearRefreshCookie(res)}
export async function revokeAllUserSessions(userId:string){await db.execute('UPDATE auth_sessions SET revoked_at=CURRENT_TIMESTAMP WHERE user_id=? AND revoked_at IS NULL',[userId])}
export function requireAuth(req:AuthRequest,res:Response,next:NextFunction){const token=req.headers.authorization?.replace(/^Bearer\s+/,'');if(!token)return res.status(401).json({message:'Требуется авторизация'});try{req.user=jwt.verify(token,process.env.JWT_SECRET!) as AuthUser;next()}catch{return res.status(401).json({message:'Сессия истекла'})}}
export const requireRole=(...roles:string[])=>(req:AuthRequest,res:Response,next:NextFunction)=>requireAuth(req,res,()=>roles.includes(req.user!.role)?next():res.status(403).json({message:'Недостаточно прав'}));
