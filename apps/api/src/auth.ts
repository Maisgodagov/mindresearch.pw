import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export type AuthRequest=Request & { user?: { id:string; role:string } };
export function signToken(user:{id:string;role:string}) { return jwt.sign(user,process.env.JWT_SECRET!,{expiresIn:'12h'}); }
export function requireAuth(req:AuthRequest,res:Response,next:NextFunction) {
  const token=req.headers.authorization?.replace(/^Bearer\s+/,'');
  if(!token) return res.status(401).json({message:'Требуется авторизация'});
  try { req.user=jwt.verify(token,process.env.JWT_SECRET!) as AuthRequest['user']; next(); }
  catch { res.status(401).json({message:'Сессия истекла'}); }
}
export const requireRole=(...roles:string[])=>(req:AuthRequest,res:Response,next:NextFunction)=>requireAuth(req,res,()=>roles.includes(req.user!.role)?next():res.status(403).json({message:'Недостаточно прав'}));
