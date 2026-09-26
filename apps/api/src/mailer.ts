import nodemailer from'nodemailer';

function config(){
  const host=process.env.SMTP_HOST,user=process.env.SMTP_USER,pass=process.env.SMTP_PASSWORD;
  if(!host||!user||!pass)throw new Error('SMTP is not configured');
  const port=Number(process.env.SMTP_PORT??465);
  return{host,user,pass,port};
}

export async function verifyMailer(){const{host,user,pass,port}=config();await nodemailer.createTransport({host,port,secure:port===465,auth:{user,pass}}).verify()}

export async function sendPasswordReset(email:string,token:string){
  const{host,user,pass,port}=config(),origin=(process.env.CLIENT_URL?.split(',')[0]??'https://mindresearch.pw').replace(/\/$/,'');
  const transporter=nodemailer.createTransport({host,port,secure:port===465,auth:{user,pass}});
  const url=`${origin}/reset-password?token=${encodeURIComponent(token)}`;
  await transporter.sendMail({from:process.env.SMTP_FROM??`mindresearch <${user}>`,to:email,subject:'Восстановление пароля в mindresearch',text:`Чтобы установить новый пароль, откройте ссылку: ${url}\n\nСсылка действует 30 минут. Если вы не запрашивали восстановление, просто проигнорируйте письмо.`,html:`<div style="font-family:Arial,sans-serif;color:#31483a;line-height:1.6;max-width:560px"><h2>Восстановление пароля</h2><p>Нажмите кнопку, чтобы установить новый пароль:</p><p><a href="${url}" style="display:inline-block;padding:12px 18px;border-radius:10px;background:#557660;color:#fff;text-decoration:none;font-weight:700">Установить новый пароль</a></p><p>Ссылка действует 30 минут. Если вы не запрашивали восстановление, просто проигнорируйте письмо.</p></div>`});
}
