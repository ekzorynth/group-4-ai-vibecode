import http from 'node:http';
import { DatabaseSync } from 'node:sqlite';
import { randomUUID } from 'node:crypto';
import { mkdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const root=dirname(fileURLToPath(import.meta.url));
mkdirSync(join(root,'data'),{recursive:true});
const db=new DatabaseSync(process.env.DB_PATH||join(root,'data','encore.sqlite'));
db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;
CREATE TABLE IF NOT EXISTS holds(id TEXT PRIMARY KEY, session TEXT NOT NULL, event TEXT NOT NULL, seats TEXT NOT NULL, expires INTEGER NOT NULL, status TEXT NOT NULL, coupon TEXT NOT NULL, price TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS seats(event TEXT NOT NULL,id TEXT NOT NULL,zone TEXT NOT NULL,price INTEGER NOT NULL,hold TEXT REFERENCES holds(id),sold INTEGER NOT NULL DEFAULT 0,PRIMARY KEY(event,id));
CREATE TABLE IF NOT EXISTS orders(id TEXT PRIMARY KEY,session TEXT NOT NULL,hold TEXT UNIQUE NOT NULL REFERENCES holds(id),email TEXT NOT NULL,created INTEGER NOT NULL);`);
export const events=[
{id:'neon',tag:'INDIE / SYNTH POP',title:'NEON AFTERGLOW',thai:'ค่ำคืนที่เราเปล่งประกายไปด้วยกัน',artist:'LUNA / THE MIDNIGHT CLUB / WAVE',date:'12 ธันวาคม 2569',time:'18:00',venue:'Encore Hall · กรุงเทพฯ',start:'2026-12-12T11:00:00Z',sale:'2026-11-01T03:00:00Z',end:'2026-12-12T10:00:00Z',theme:'neon',from:1800},
{id:'sunset',tag:'FESTIVAL / ALTERNATIVE',title:'SUNSET FREQUENCY',thai:'ปล่อยใจไปกับเสียงเพลงยามเย็น',artist:'SOL / DAYDREAM / GOOD MONDAY',date:'19 ธันวาคม 2569',time:'16:00',venue:'Riverside Park · กรุงเทพฯ',start:'2026-12-19T09:00:00Z',sale:'2026-11-10T03:00:00Z',end:'2026-12-19T08:00:00Z',theme:'sunset',from:1800},
{id:'orbit',tag:'ELECTRONIC / LIVE',title:'ORBIT : THE LIVE',thai:'อีกหนึ่งวงโคจรของคนรักดนตรี',artist:'ORBIT / COSMIC KIDS',date:'26 ธันวาคม 2569',time:'19:00',venue:'Encore Hall · กรุงเทพฯ',start:'2026-12-26T12:00:00Z',sale:'2026-10-01T03:00:00Z',end:'2026-12-26T11:00:00Z',theme:'orbit',from:1800}
];
let fixedNow=process.env.LIVE_CLOCK==='1'?null:Date.parse('2026-11-06T03:00:00Z');
let clockAnchor=Date.now();
const now=()=>fixedNow===null?Date.now():fixedNow+(process.env.TEST_MODE==='1'?0:Date.now()-clockAnchor);
const bug=process.env.BUG_MODE||'';
function seed(){if(db.prepare('SELECT count(*) n FROM seats').get().n)return;const q=db.prepare('INSERT INTO seats(event,id,zone,price,sold) VALUES(?,?,?,?,?)');for(const e of events)for(const row of ['A','B','C','D'])for(let i=1;i<=12;i++)q.run(e.id,`${row}${String(i).padStart(2,'0')}`,row<'C'?'VIP':'REGULAR',row<'C'?3200:1800,e.id==='orbit'||(e.id==='neon'&&['A03','A04','B09','C06','D10'].includes(`${row}${String(i).padStart(2,'0')}`))?1:0);}
seed();
function tx(fn){db.exec('BEGIN IMMEDIATE');try{const r=fn();db.exec('COMMIT');return r;}catch(e){db.exec('ROLLBACK');throw e;}}
function fail(status,code,message){throw Object.assign(new Error(message),{status,code});}
function expire(){const ids=db.prepare(`SELECT id FROM holds WHERE status='held' AND expires${bug==='expiry'?'<':'<='}?`).all(now());for(const {id}of ids){db.prepare('UPDATE seats SET hold=NULL WHERE hold=? AND sold=0').run(id);db.prepare("UPDATE holds SET status='expired' WHERE id=?").run(id);}}
function quote(seats,coupon=''){if(!['','STAGE10'].includes(coupon))fail(400,'COUPON_INVALID','ไม่พบโค้ดส่วนลดนี้');const subtotal=seats.reduce((s,x)=>s+x.price,0),discount=coupon?Math.min(Math.floor(subtotal*.1),500):0,fee=seats.length*30,vat=Math.round((bug==='money'?subtotal:fee)*.07);return{subtotal,discount,fee,vat,total:subtotal-discount+fee+vat};}
function getHold(id,session){const h=db.prepare('SELECT * FROM holds WHERE id=? AND session=?').get(id,session);if(!h)fail(404,'HOLD_NOT_FOUND','ไม่พบรายการจอง');return{...h,seats:JSON.parse(h.seats),price:JSON.parse(h.price)};}
function eventById(id){const e=events.find(e=>e.id===id);if(!e)fail(404,'EVENT_NOT_FOUND','ไม่พบคอนเสิร์ต');return e;}
function status(e){if(now()<Date.parse(e.sale))return'upcoming';if(now()>=Date.parse(e.end))return'closed';return db.prepare('SELECT count(*) n FROM seats WHERE event=? AND sold=0').get(e.id).n?'available':'soldout';}
const port=Number(process.env.PORT||4310);
const server=http.createServer(async(req,res)=>{
const origin=`http://${req.headers.host}`;const url=new URL(req.url,origin);
let session=/\bencore=([a-f0-9-]{36})\b/.exec(req.headers.cookie||'')?.[1];
if(!session){session=randomUUID();res.setHeader('Set-Cookie',`encore=${session}; HttpOnly; SameSite=Strict; Path=/`);}
res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Cache-Control','no-store');
const send=(s,data)=>{res.writeHead(s,{'Content-Type':'application/json; charset=utf-8'});res.end(JSON.stringify(data));};
try{
if(!url.pathname.startsWith('/api/')){if(req.method!=='GET')fail(405,'METHOD','Method not allowed');const path={'/':'index.html','/app.js':'app.js','/style.css':'style.css'}[url.pathname];if(!path)fail(404,'NOT_FOUND','ไม่พบหน้าเว็บ');res.writeHead(200,{'Content-Type':path.endsWith('.html')?'text/html; charset=utf-8':path.endsWith('.css')?'text/css':'text/javascript; charset=utf-8'});res.end(readFileSync(join(root,'public',path)));return;}
if(req.method==='POST'&&req.headers.origin&&req.headers.origin!==origin)fail(403,'ORIGIN','Origin not allowed');
let body={};if(req.method==='POST'){let raw='';for await(const chunk of req){raw+=chunk;if(raw.length>8192)fail(413,'BODY_TOO_LARGE','ข้อมูลมากเกินไป');}try{body=JSON.parse(raw||'{}');}catch{fail(400,'JSON','ข้อมูลไม่ถูกต้อง');}if(!body||Array.isArray(body)||typeof body!=='object')fail(400,'BODY','ข้อมูลไม่ถูกต้อง');}
expire();
if(req.method==='GET'&&url.pathname==='/api/health')return send(200,{ok:true,mode:'training',now:now()});
if(req.method==='POST'&&url.pathname==='/api/test/reset'){
if(process.env.TEST_MODE!=='1'||req.headers['x-test-token']!==process.env.TEST_TOKEN||!process.env.TEST_TOKEN)fail(403,'TEST_DISABLED','ปิดเครื่องมือทดสอบ');
const n=body.now?Date.parse(body.now):Date.parse('2026-11-06T03:00:00Z');if(!Number.isFinite(n))fail(400,'TIME','วันเวลาไม่ถูกต้อง');
tx(()=>{db.exec('DELETE FROM orders; DELETE FROM seats; DELETE FROM holds;');seed();});fixedNow=n;clockAnchor=Date.now();return send(200,{ok:true,now:now()});}
if(req.method==='POST'&&url.pathname==='/api/test/clock'){if(process.env.TEST_MODE!=='1'||!process.env.TEST_TOKEN||req.headers['x-test-token']!==process.env.TEST_TOKEN)fail(403,'TEST_DISABLED','ปิดเครื่องมือทดสอบ');const n=Date.parse(body.now);if(!Number.isFinite(n))fail(400,'TIME','วันเวลาไม่ถูกต้อง');fixedNow=n;clockAnchor=Date.now();expire();return send(200,{now:now()});}
if(req.method==='GET'&&url.pathname==='/api/events')return send(200,{events:events.map(e=>({...e,status:status(e)})),now:now()});
if(req.method==='GET'&&url.pathname==='/api/seats'){const e=eventById(url.searchParams.get('event'));return send(200,{event:{...e,status:status(e)},seats:db.prepare('SELECT id,zone,price,hold,sold FROM seats WHERE event=? ORDER BY id').all(e.id).map(s=>({id:s.id,zone:s.zone,price:s.price,status:s.sold?'sold':s.hold?'held':'available'})),now:now()});}
if(req.method==='POST'&&url.pathname==='/api/holds')return send(201,tx(()=>{
const e=eventById(body.event);if(status(e)!=='available')fail(409,'SALE_UNAVAILABLE','คอนเสิร์ตนี้ยังไม่เปิดขายหรือบัตรหมดแล้ว');
if(!Array.isArray(body.seats)||body.seats.length<1||body.seats.length>4||new Set(body.seats).size!==body.seats.length||body.seats.some(s=>typeof s!=='string'))fail(400,'SEAT_LIMIT','เลือกที่นั่งไม่ซ้ำกัน 1–4 ที่นั่ง');
const selected=body.seats.map(id=>db.prepare('SELECT * FROM seats WHERE event=? AND id=?').get(e.id,id));
if(selected.some(s=>!s||s.sold||s.hold))fail(409,'SEAT_UNAVAILABLE','ที่นั่งนี้ถูกจองแล้ว กรุณาเลือกใหม่');
const previous=db.prepare("SELECT id FROM holds WHERE session=? AND status='held'").all(session);for(const h of previous){db.prepare('UPDATE seats SET hold=NULL WHERE hold=?').run(h.id);db.prepare("UPDATE holds SET status='cancelled' WHERE id=?").run(h.id);}
const price=quote(selected,body.coupon||''),id=randomUUID(),expires=now()+600000;
db.prepare("INSERT INTO holds VALUES(?,?,?,?,?,'held',?,?)").run(id,session,e.id,JSON.stringify(body.seats),expires,body.coupon||'',JSON.stringify(price));for(const s of selected)db.prepare('UPDATE seats SET hold=? WHERE event=? AND id=?').run(id,e.id,s.id);
return{hold:getHold(id,session),now:now()};}));
if(req.method==='POST'&&url.pathname==='/api/release')return send(200,tx(()=>{const h=getHold(body.hold,session);if(h.status==='held'){db.prepare('UPDATE seats SET hold=NULL WHERE hold=? AND sold=0').run(h.id);db.prepare("UPDATE holds SET status='cancelled' WHERE id=?").run(h.id);}return{ok:true};}));
if(req.method==='POST'&&url.pathname==='/api/pay')return send(200,tx(()=>{
const h=getHold(body.hold,session),existing=db.prepare('SELECT id FROM orders WHERE hold=?').get(h.id);
if(existing)return{order:existing.id,replayed:true};
if(h.status!=='held'||(bug==='expiry'?h.expires<now():h.expires<=now()))fail(409,'HOLD_EXPIRED','หมดเวลาจอง กรุณาเลือกที่นั่งใหม่');
if(typeof body.email!=='string'||body.email.length>254||!/^\S+@\S+\.\S+$/.test(body.email))fail(400,'EMAIL','กรุณากรอกอีเมลให้ถูกต้อง');
if(body.result!=='approved')fail(402,'PAYMENT_DECLINED','ชำระเงินไม่สำเร็จ ลองใหม่ภายในเวลาจอง');
const id=`EN-${randomUUID().slice(0,8).toUpperCase()}`;
db.prepare('INSERT INTO orders VALUES(?,?,?,?,?)').run(id,session,h.id,body.email,now());db.prepare("UPDATE holds SET status='paid' WHERE id=?").run(h.id);if(bug!=='inventory')db.prepare('UPDATE seats SET sold=1 WHERE hold=?').run(h.id);return{order:id,replayed:false};}));
if(req.method==='GET'&&url.pathname==='/api/orders')return send(200,{orders:db.prepare('SELECT * FROM orders WHERE session=? ORDER BY created DESC').all(session).map(o=>({...o,hold:getHold(o.hold,session)}))});
fail(404,'NOT_FOUND','ไม่พบรายการ');
}catch(e){if(!e.status)console.error(e);send(e.status||500,{error:e.code||'INTERNAL',message:e.status?e.message:'ระบบขัดข้อง กรุณาลองใหม่'});}
});
server.listen(port,'127.0.0.1',()=>console.log(`ENCORE ready: http://localhost:${port}`));
