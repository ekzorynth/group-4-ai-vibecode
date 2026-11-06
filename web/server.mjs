import http from 'node:http';
import {readFileSync} from 'node:fs';
import {dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {one,all,run,tx,id,secret,hash,password,validPassword,now,fail,setClock,reset} from './store.mjs';
import * as D from './domain.mjs';
import * as S from './sales.mjs';
import * as Delivery from './delivery.mjs';
const root=dirname(fileURLToPath(import.meta.url)),port=Number(process.env.PORT||4310),host=process.env.HOST||'127.0.0.1';
const publicUser=u=>u?{id:u.id,email:u.email,username:u.username,name:u.name,role:u.role,presale:!!S.member(u)}:null;
const email=s=>typeof s==='string'?s.trim().toLowerCase():'';
function checkEmail(e){if(e.length>254||!/^\S+@\S+\.\S+$/.test(e))fail(400,'EMAIL','กรุณากรอกอีเมลให้ถูกต้อง');}
function newSession(res,u){const token=secret();run('INSERT INTO sessions VALUES(?,?,?)',hash(token),u.id,now()+86400000);res.setHeader('Set-Cookie',`encore_v2=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=86400`);}
function authenticate(req){const token=/\bencore_v2=([a-f0-9]{64})\b/.exec(req.headers.cookie||'')?.[1];return token?one('SELECT u.* FROM sessions s JOIN users u ON u.id=s.user WHERE s.token=? AND s.expires>?',hash(token),now()):null;}
function testGate(req){if(process.env.TEST_MODE!=='1'||!process.env.TEST_TOKEN||req.headers['x-test-token']!==process.env.TEST_TOKEN)fail(403,'TEST_DISABLED','ปิดเครื่องมือทดสอบ');}
const server=http.createServer(async(req,res)=>{const url=new URL(req.url,`http://${req.headers.host}`);res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','same-origin');
const send=(s,d)=>{res.writeHead(s,{'Content-Type':'application/json; charset=utf-8'});res.end(JSON.stringify({...d,now:now()}));};
try{
if(!url.pathname.startsWith('/api/')){const files={'/':'index.html','/app.js':'app.js','/style.css':'style.css'};if(req.method!=='GET'||!files[url.pathname])fail(404,'NOT_FOUND','ไม่พบหน้าเว็บ');const file=files[url.pathname];res.writeHead(200,{'Content-Type':file.endsWith('html')?'text/html; charset=utf-8':file.endsWith('css')?'text/css':'text/javascript; charset=utf-8'});return res.end(readFileSync(join(root,'public',file)));}
let b={};if(req.method==='POST'){if(req.headers.origin&&req.headers.origin!==`http://${req.headers.host}`)fail(403,'ORIGIN','Origin not allowed');if(!req.headers['content-type']?.startsWith('application/json'))fail(415,'CONTENT_TYPE','ต้องเป็น JSON');let raw='';for await(const c of req){raw+=c;if(Buffer.byteLength(raw)>16384)fail(413,'BODY_TOO_LARGE','ข้อมูลมากเกินไป');}try{b=JSON.parse(raw||'{}');}catch{fail(400,'JSON','ข้อมูลไม่ถูกต้อง');}if(!b||Array.isArray(b)||typeof b!=='object')fail(400,'JSON','ข้อมูลไม่ถูกต้อง');}
D.sweep();const path=url.pathname.replace('/api/',''),get=req.method==='GET',post=req.method==='POST';
if(get&&path==='health')return send(200,{ok:true,mode:'training',version:3});
if(post&&path==='test/reset'){testGate(req);if(b.now&&!Number.isFinite(Date.parse(b.now)))fail(400,'TIME','วันเวลาไม่ถูกต้อง');reset(b.now);return send(200,{ok:true});}
if(post&&path==='test/clock'){testGate(req);setClock(b.now);D.sweep();return send(200,{ok:true});}
if(post&&path==='test/callback'){testGate(req);return send(200,tx(()=>D.settle(b.payment,b.result,b.amount,Date.parse(b.paidAt))));}
const required={queue:['event'],'membership/verify':['event'],checkout:['hold'],holds:['event'],release:['hold'],pay:['hold'], 'payments/resolve':['payment'],refunds:['ticket'],'admin/refunds':['refund'],'admin/event':['event'],'admin/seats':['event','seat'],scan:['event','code']};
if(post&&required[path])for(const field of required[path])if(typeof b[field]!=='string'||!b[field]||b[field].length>256)fail(400,'INPUT','Invalid '+field);
let user=authenticate(req);
if(get&&path==='me')return send(200,{user:publicUser(user)});
if(post&&path==='register'){const e=email(b.email);checkEmail(e);if(typeof b.name!=='string'||b.name.trim().length<1||b.name.trim().length>80)fail(400,'NAME','ชื่อยาว 1–80 ตัวอักษร');if(typeof b.password!=='string'||b.password.length<10||b.password.length>128)fail(400,'PASSWORD','รหัสผ่านยาว 10–128 ตัวอักษร');if(one('SELECT id FROM users WHERE email=?',e))fail(409,'EMAIL_EXISTS','อีเมลนี้ลงทะเบียนแล้ว');const username=typeof b.username==='string'?b.username.trim().toLowerCase():'';if(!/^[a-z0-9._-]{3,32}$/.test(username))fail(400,'USERNAME','ชื่อผู้ใช้ต้องมี 3–32 ตัวอักษร ใช้ตัวอักษรอังกฤษ a-z ตัวเลข หรือ . _ -');if(one('SELECT id FROM users WHERE username=?',username))fail(409,'USERNAME_EXISTS','ชื่อผู้ใช้นี้มีผู้ใช้งานแล้ว');const uid=id();run("INSERT INTO users(id,email,name,password,role,presale,username) VALUES(?,?,?,?,'buyer',0,?)",uid,e,b.name.trim(),password(b.password),username);user=one('SELECT * FROM users WHERE id=?',uid);newSession(res,user);return send(201,{user:publicUser(user)});}
if(post&&path==='login'){const e=email(b.username||b.email),keys=['email:'+e,'ip:'+req.socket.remoteAddress];for(const k of keys){const a=one('SELECT * FROM attempts WHERE key=?',k);if(a?.blocked>now())fail(429,'LOGIN_LOCKED','ลองเข้าสู่ระบบใหม่ใน 15 นาที');}
const u=one('SELECT * FROM users WHERE email=? OR username=?',e,e);if(typeof b.password!=='string'||b.password.length>128||!u||!validPassword(b.password,u.password)){
for(const k of keys){run('INSERT INTO failures VALUES(?,?)',k,now());const n=one('SELECT count(*) n FROM failures WHERE key=? AND at>?',k,now()-900000).n;if(n>=5)run('INSERT INTO attempts VALUES(?,?,?,?) ON CONFLICT(key) DO UPDATE SET blocked=excluded.blocked',k,n,now(),now()+900000);}
fail(keys.some(k=>one('SELECT blocked FROM attempts WHERE key=?',k)?.blocked>now())?429:401,'LOGIN_INVALID','ชื่อผู้ใช้ อีเมล หรือรหัสผ่านไม่ถูกต้อง');}
run('DELETE FROM failures WHERE key=?',keys[0]);const old=/\bencore_v2=([a-f0-9]{64})\b/.exec(req.headers.cookie||'')?.[1];if(old)run('DELETE FROM sessions WHERE token=?',hash(old));newSession(res,u);return send(200,{user:publicUser(u)});}
if(post&&path==='logout'){const token=/\bencore_v2=([a-f0-9]{64})\b/.exec(req.headers.cookie||'')?.[1];if(token)run('DELETE FROM sessions WHERE token=?',hash(token));res.setHeader('Set-Cookie','encore_v2=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0');return send(200,{ok:true});}
if(get&&path==='events')return send(200,{events:all('SELECT id FROM events ORDER BY rowid').map(r=>{const {owner,...e}=D.eventById(r.id);let view=e;if(user?.role==='buyer'){const kind=S.member(user)?'member':'general',saleRound=e.schedule.find(r=>r.kind===kind);view={...e,schedule:[saleRound],saleRound,round:kind,limit:kind==='member'?2:4};}return{...view,status:D.saleStatus(view)};})});
if(get&&path==='seats'){const {owner,...e}=D.eventById(url.searchParams.get('event'));if(e.round==='member'&&!user)fail(401,'AUTH_REQUIRED','กรุณาเข้าสู่ระบบก่อน');S.mapAccess(user,e.id);return send(200,{event:{...e,status:D.saleStatus(e)},seats:all('SELECT * FROM seats WHERE event=? ORDER BY id',e.id).map(s=>({id:s.id,zone:s.zone,price:s.price,status:s.sold?'sold':s.blocked?'blocked':s.hold?'held':'available'}))});}
if(!user)fail(401,'AUTH_REQUIRED','กรุณาเข้าสู่ระบบก่อน');
if(get&&path==='admin/events'){if(user.role!=='organizer')fail(403,'FORBIDDEN','คุณไม่มีสิทธิ์ใช้งานส่วนนี้');return send(200,{events:all('SELECT id FROM events WHERE owner=?',user.id).map(r=>D.eventById(r.id))});}
if(get&&path==='active-hold')return send(200,{hold:D.activeHold(user)});
if((get||post)&&path==='queue')return send(200,tx(()=>({queue:D.queue(user,post?b.event:url.searchParams.get('event'),post?(b.action==='leave'?'leave':'join'):'get',post?b.round:url.searchParams.get('round'))})));
if(post&&path==='membership/verify')return send(200,S.verify(user,b));
if(post&&path==='checkout')return send(200,D.checkout(user,b));
if(get&&path==='payment')return send(200,{payment:Delivery.payment(user,url.searchParams.get('id'))});
if(get&&path==='ticket-qr'){const t=Delivery.ticket(user,url.searchParams.get('id'));const png=url.searchParams.get('format')==='png';res.writeHead(200,{'Content-Type':png?'image/png':'image/svg+xml','Content-Security-Policy':"default-src 'none'; style-src 'unsafe-inline'"});return res.end(await (png?Delivery.qrPng(t.code):Delivery.qrSvg(t.code)));}
if(get&&path==='payment-qr'){const p=Delivery.payment(user,url.searchParams.get('id'));res.writeHead(200,{'Content-Type':'image/svg+xml'});return res.end(await Delivery.qrSvg(p.qr_payload));}
if(get&&path==='mailbox')return send(200,{messages:Delivery.mailbox(user)});
if(get&&path==='mail'){const m=await Delivery.mail(user,url.searchParams.get('id'));const {pngs,...data}=m;data.html=data.html.replace(/src="cid:([^"]+)"/g,(_,id)=>'src="/api/ticket-qr?id='+id+'"');return send(200,{mail:data});}
if(get&&path==='mail.eml'){const data=await Delivery.eml(user,url.searchParams.get('id'));res.writeHead(200,{'Content-Type':'message/rfc822','Content-Disposition':'attachment; filename="ENCORE-E-Tickets.eml"'});return res.end(data);}
if(post&&path==='holds')return send(201,{hold:D.reserve(user,b)});
if(post&&path==='release')return send(200,D.release(user,b.hold));
if(post&&path==='pay')return send(200,D.pay(user,b));
if(post&&path==='payments/resolve')return send(200,D.resolve(user,b));
if(get&&path==='orders')return send(200,{orders:D.orders(user)});
if(get&&path==='notifications')return send(200,{notifications:all('SELECT id,message,created FROM notifications WHERE user=? ORDER BY created DESC,rowid DESC',user.id)});
if(post&&path==='refunds')return send(201,D.requestRefund(user,b));
if(post&&path==='admin/refunds')return send(200,D.decideRefund(user,b));
if(post&&path==='admin/event')return send(200,D.control(user,b));
if(post&&path==='admin/seats')return send(200,D.block(user,b));
if(get&&path==='admin/dashboard')return send(200,D.dashboard(user,url.searchParams.get('event')));
if(post&&path==='scan')return send(200,D.scan(user,b));
fail(404,'NOT_FOUND','ไม่พบรายการ');
}catch(e){if(!e.status)console.error(e);send(e.status||500,{error:e.code||'INTERNAL',message:e.status?e.message:'ระบบขัดข้อง กรุณาลองใหม่'});}});
server.listen(port,host,()=>console.log(`ENCORE V3 ready: http://localhost:${port}`));
