import {DatabaseSync} from 'node:sqlite';
import {randomBytes,randomUUID,scryptSync,createHash,timingSafeEqual} from 'node:crypto';
import {mkdirSync} from 'node:fs';
import {join,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=dirname(fileURLToPath(import.meta.url));mkdirSync(join(root,'data'),{recursive:true});
export const db=new DatabaseSync(process.env.DB_PATH||join(root,'data','encore-v2.sqlite'));
db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;
CREATE TABLE IF NOT EXISTS users(id TEXT PRIMARY KEY,email TEXT UNIQUE NOT NULL,name TEXT NOT NULL,password TEXT NOT NULL,role TEXT NOT NULL,presale INTEGER NOT NULL DEFAULT 0);
CREATE TABLE IF NOT EXISTS sessions(token TEXT PRIMARY KEY,user TEXT REFERENCES users(id),expires INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS attempts(key TEXT PRIMARY KEY,count INTEGER NOT NULL,start INTEGER NOT NULL,blocked INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS failures(key TEXT NOT NULL,at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS events(id TEXT PRIMARY KEY,owner TEXT REFERENCES users(id),state TEXT NOT NULL,round TEXT NOT NULL,data TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS queues(seq INTEGER PRIMARY KEY AUTOINCREMENT,event TEXT REFERENCES events(id),user TEXT REFERENCES users(id),status TEXT NOT NULL,expires INTEGER NOT NULL,UNIQUE(event,user));
CREATE TABLE IF NOT EXISTS holds(id TEXT PRIMARY KEY,user TEXT REFERENCES users(id),event TEXT REFERENCES events(id),seats TEXT NOT NULL,expires INTEGER NOT NULL,status TEXT NOT NULL,price TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS seats(event TEXT REFERENCES events(id),id TEXT NOT NULL,zone TEXT NOT NULL,price INTEGER NOT NULL,hold TEXT REFERENCES holds(id),sold INTEGER NOT NULL DEFAULT 0,blocked INTEGER NOT NULL DEFAULT 0,PRIMARY KEY(event,id));
CREATE TABLE IF NOT EXISTS payments(id TEXT PRIMARY KEY,hold TEXT REFERENCES holds(id),status TEXT NOT NULL,amount INTEGER NOT NULL,paid_at INTEGER,refund_amount INTEGER NOT NULL DEFAULT 0);
CREATE TABLE IF NOT EXISTS orders(id TEXT PRIMARY KEY,user TEXT REFERENCES users(id),hold TEXT UNIQUE REFERENCES holds(id),created INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS tickets(id TEXT PRIMARY KEY,order_id TEXT REFERENCES orders(id),event TEXT REFERENCES events(id),seat TEXT NOT NULL,code TEXT UNIQUE NOT NULL,status TEXT NOT NULL,net INTEGER NOT NULL,fee INTEGER NOT NULL,vat INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS refunds(id TEXT PRIMARY KEY,ticket TEXT UNIQUE REFERENCES tickets(id),amount INTEGER NOT NULL,status TEXT NOT NULL,reason TEXT NOT NULL,created INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS notifications(id TEXT PRIMARY KEY,user TEXT REFERENCES users(id),message TEXT NOT NULL,created INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS audit(id TEXT PRIMARY KEY,actor TEXT NOT NULL,event TEXT REFERENCES events(id),action TEXT NOT NULL,target TEXT NOT NULL,created INTEGER NOT NULL);
`);
// Additive V3 schema: preserve existing users, paid orders and seats.
function column(table,name,definition){if(!db.prepare(`PRAGMA table_info(${table})`).all().some(c=>c.name===name))db.exec(`ALTER TABLE ${table} ADD COLUMN ${name} ${definition}`);}
column('users','username','TEXT');column('queues','round',"TEXT NOT NULL DEFAULT 'general'");column('holds','round',"TEXT NOT NULL DEFAULT 'general'");column('holds','checkout','TEXT');column('payments','method',"TEXT NOT NULL DEFAULT 'qr'");column('tickets','holder','TEXT');
db.exec(`CREATE UNIQUE INDEX IF NOT EXISTS users_username_unique ON users(username);
CREATE TABLE IF NOT EXISTS memberships(number TEXT PRIMARY KEY,user TEXT UNIQUE REFERENCES users(id),status TEXT NOT NULL,valid_until INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS sale_rounds(event TEXT REFERENCES events(id),kind TEXT NOT NULL,start INTEGER NOT NULL,end INTEGER NOT NULL,PRIMARY KEY(event,kind),CHECK(start<end));
CREATE TABLE IF NOT EXISTS member_grants(user TEXT REFERENCES users(id),event TEXT REFERENCES events(id),expires INTEGER NOT NULL,PRIMARY KEY(user,event));
CREATE TABLE IF NOT EXISTS mail_outbox(id TEXT PRIMARY KEY,user TEXT REFERENCES users(id),order_id TEXT UNIQUE REFERENCES orders(id),recipient TEXT NOT NULL,status TEXT NOT NULL,created INTEGER NOT NULL);`);
export const id=()=>randomUUID();export const secret=()=>randomBytes(32).toString('hex');export const hash=s=>createHash('sha256').update(s).digest('hex');
export function password(s){const salt=randomBytes(16).toString('hex');return salt+':'+scryptSync(s,salt,64).toString('hex');}
export function validPassword(s,encoded){const [salt,digest]=encoded.split(':');return timingSafeEqual(scryptSync(s,salt,64),Buffer.from(digest,'hex'));}
let fixed=process.env.LIVE_CLOCK==='1'?null:Date.parse('2026-11-06T03:00:00Z'),anchor=Date.now();
export const now=()=>fixed===null?Date.now():fixed+(process.env.TEST_MODE==='1'?0:Date.now()-anchor);
export function setClock(iso){const n=Date.parse(iso);if(!Number.isFinite(n))fail(400,'TIME','วันเวลาไม่ถูกต้อง');fixed=n;anchor=Date.now();}
export function fail(status,code,message){throw Object.assign(new Error(message),{status,code});}
export const one=(sql,...args)=>db.prepare(sql).get(...args),all=(sql,...args)=>db.prepare(sql).all(...args),run=(sql,...args)=>db.prepare(sql).run(...args);
export function tx(fn){db.exec('BEGIN IMMEDIATE');try{const r=fn();db.exec('COMMIT');return r;}catch(e){db.exec('ROLLBACK');throw e;}}
export function notify(user,message){run('INSERT INTO notifications VALUES(?,?,?,?)',id(),user,message,now());}
export function audit(actor,event,action,target){run('INSERT INTO audit VALUES(?,?,?,?,?,?)',id(),actor,event,action,target,now());}
const fixtures=[
{id:'neon',tag:'INDIE / SYNTH POP',title:'NEON AFTERGLOW',thai:'ค่ำคืนที่เราเปล่งประกายไปด้วยกัน',artist:'LUNA / THE MIDNIGHT CLUB / WAVE',date:'12 ธันวาคม 2569',time:'18:00',venue:'Encore Hall · กรุงเทพฯ',start:'2026-12-12T11:00:00Z',sale:'2026-11-01T03:00:00Z',end:'2026-12-12T10:00:00Z',theme:'neon',from:1800},
{id:'sunset',tag:'FESTIVAL / ALTERNATIVE',title:'SUNSET FREQUENCY',thai:'ปล่อยใจไปกับเสียงเพลงยามเย็น',artist:'SOL / DAYDREAM / GOOD MONDAY',date:'19 ธันวาคม 2569',time:'16:00',venue:'Riverside Park · กรุงเทพฯ',start:'2026-12-19T09:00:00Z',sale:'2026-11-10T03:00:00Z',end:'2026-12-19T08:00:00Z',theme:'sunset',from:1800},
{id:'orbit',tag:'ELECTRONIC / LIVE',title:'ORBIT : THE LIVE',thai:'อีกหนึ่งวงโคจรของคนรักดนตรี',artist:'ORBIT / COSMIC KIDS',date:'26 ธันวาคม 2569',time:'19:00',venue:'Encore Hall · กรุงเทพฯ',start:'2026-12-26T12:00:00Z',sale:'2026-10-01T03:00:00Z',end:'2026-12-26T11:00:00Z',theme:'orbit',from:1800,soldOut:true},
{id:'aurora',tag:'DREAM POP / LIVE',title:'AURORA BLOOM',thai:'ดอกไม้ แสงเหนือ และเพลงโปรด',artist:'VELVET SKY / NORTHLIGHT',date:'5 ธันวาคม 2569',time:'19:00',venue:'Bloom Arena · กรุงเทพฯ',start:'2026-12-05T12:00:00Z',sale:'2026-11-01T03:00:00Z',end:'2026-12-05T11:00:00Z',theme:'aurora',from:1800},
{id:'jazz',tag:'JAZZ / SOUL',title:'BLUE NOTE NIGHTS',thai:'ค่ำคืนแจ๊สที่อยากให้ยาวนาน',artist:'MELLOW QUARTET / IRIS SOUL',date:'6 ธันวาคม 2569',time:'20:00',venue:'Blue Room · กรุงเทพฯ',start:'2026-12-06T13:00:00Z',sale:'2026-11-01T03:00:00Z',end:'2026-12-06T12:00:00Z',theme:'jazz',from:1800,owner:'sky'},
{id:'rock',tag:'ROCK / ALTERNATIVE',title:'ELECTRIC REBELLION',thai:'ปล่อยเสียงให้สุด แล้วหยุดที่หน้าเวที',artist:'BLACK VOLT / THE REBELS',date:'13 ธันวาคม 2569',time:'18:00',venue:'Thunder Hall · กรุงเทพฯ',start:'2026-12-13T11:00:00Z',sale:'2026-11-01T03:00:00Z',end:'2026-12-13T10:00:00Z',theme:'rock',from:1800},
{id:'citypop',tag:'CITY POP / RETRO',title:'TOKYO AFTER HOURS',thai:'ขับผ่านแสงนีออนด้วยเพลงซิตี้ป๊อป',artist:'TOKYO FM / PEACH CASSETTE',date:'20 ธันวาคม 2569',time:'19:00',venue:'Skyline Studio · กรุงเทพฯ',start:'2026-12-20T12:00:00Z',sale:'2026-11-02T03:00:00Z',end:'2026-12-20T11:00:00Z',theme:'citypop',from:1800},
{id:'acoustic',tag:'ACOUSTIC / SINGER-SONGWRITER',title:'UNPLUGGED STORIES',thai:'เรื่องเล่าใกล้ตัวกับเสียงกีตาร์ที่คุ้นเคย',artist:'PAPER MOON / HOMEBOUND',date:'27 ธันวาคม 2569',time:'17:00',venue:'Garden Stage · กรุงเทพฯ',start:'2026-12-27T10:00:00Z',sale:'2026-11-01T03:00:00Z',end:'2026-12-27T09:00:00Z',theme:'acoustic',from:1800},
{id:'kpop',tag:'K-POP / DANCE',title:'STARDUST FAN FEST',thai:'รวมพลคนรักจังหวะและแสงดาว',artist:'NOVA GIRLS / STAR UNIT',date:'9 มกราคม 2570',time:'18:00',venue:'Galaxy Arena · กรุงเทพฯ',start:'2027-01-09T11:00:00Z',sale:'2026-11-15T03:00:00Z',end:'2027-01-09T10:00:00Z',theme:'kpop',from:1800,owner:'sky',round:'presale'},
{id:'hiphop',tag:'HIP HOP / R&B',title:'RHYTHM DISTRICT',thai:'จังหวะของเมืองที่ไม่มีวันหลับ',artist:'EASTSIDE / VIOLET R&B',date:'16 มกราคม 2570',time:'19:00',venue:'District Warehouse · กรุงเทพฯ',start:'2027-01-16T12:00:00Z',sale:'2026-11-20T03:00:00Z',end:'2027-01-16T11:00:00Z',theme:'hiphop',from:1800,owner:'sky'},
{id:'folk',tag:'FOLK / INDIE',title:'FOREST ECHOES',thai:'พักใจใต้ร่มไม้แล้วฟังเพลงด้วยกัน',artist:'WOODLAND / LITTLE RIVER',date:'23 มกราคม 2570',time:'16:00',venue:'Greenfield Park · กรุงเทพฯ',start:'2027-01-23T09:00:00Z',sale:'2026-12-01T03:00:00Z',end:'2027-01-23T08:00:00Z',theme:'folk',from:1800,owner:'sky'},
{id:'midnight',tag:'ELECTRONIC / TECHNO',title:'MIDNIGHT SIGNAL',thai:'คลื่นเสียงสุดท้ายก่อนรุ่งสาง',artist:'PHASE ZERO / SIGNAL 88',date:'31 ธันวาคม 2569',time:'20:00',venue:'Pulse Hall · กรุงเทพฯ',start:'2026-12-31T13:00:00Z',sale:'2026-10-15T03:00:00Z',end:'2026-12-31T12:00:00Z',theme:'midnight',from:1800,soldOut:true}];
export function seed(){
for(const u of [ ['fan','fan@demo.test','มายด์ ทดลอง','FanDemo!26','buyer',1],['fan2','fan2@demo.test','ต้น ทดลอง','FanTwo!26','buyer',1],['fan3','fan3@demo.test','ฟ้า ทดลอง','FanThree!26','buyer',1],['general','general@demo.test','เจน ทั่วไป','GeneralDemo!26','buyer',0],['expired','expired@demo.test','สมาชิก หมดอายุ','Expired!26','buyer',1],['encore','encore@demo.test','ผู้จัด ENCORE','EncoreDemo!26','organizer',0],['sky','sky@demo.test','ผู้จัด SKY','SkyDemo!26','organizer',0],['gate','gate@demo.test','เจ้าหน้าที่ประตู','GateDemo!26','scanner',0] ]){
if(!one('SELECT id FROM users WHERE id=?',u[0]))run('INSERT INTO users(id,email,name,password,role,presale) VALUES(?,?,?,?,?,?)',u[0],u[1],u[2],password(u[3]),u[4],u[5]);
}
for(const fixture of fixtures){
const {owner=fixture.id==='sunset'?'sky':'encore',round=fixture.id==='sunset'?'presale':'public',soldOut=false,...e}=fixture;
// Add newly introduced events only; preserve existing sales controls, seats and orders.
if(one('SELECT id FROM events WHERE id=?',e.id))continue;
run('INSERT INTO events VALUES(?,?,?,?,?)',e.id,owner,'on_sale',round,JSON.stringify(e));
for(const row of ['A','B','C','D'])for(let n=1;n<=12;n++){
const sid=row+String(n).padStart(2,'0');
run('INSERT INTO seats(event,id,zone,price,sold) VALUES(?,?,?,?,?)',e.id,sid,row<'C'?'VIP':'REGULAR',row<'C'?3200:1800,soldOut||e.id==='neon'&&['A03','A04','B09','C06','D10'].includes(sid)?1:0);
}
}
run("UPDATE users SET username=CASE WHEN id IN ('fan','fan2','fan3','general','expired','encore','sky','gate') THEN id ELSE 'u_'||substr(replace(id,'-',''),1,30) END WHERE username IS NULL");
run("UPDATE users SET name='มายด์ ทดลอง' WHERE id='fan' AND name='มายด์'");
for(const [number,user,until] of [['ENCORE-0001','fan','2027-12-31T17:00:00Z'],['ENCORE-0002','fan2','2027-12-31T17:00:00Z'],['ENCORE-0003','fan3','2027-12-31T17:00:00Z'],['ENCORE-EXPIRED','expired','2026-11-06T03:00:00Z']])run("INSERT OR IGNORE INTO memberships VALUES(?,?,'active',?)",number,user,Date.parse(until));
for(const e of all('SELECT id,data FROM events')){
 const data=JSON.parse(e.data),start=Date.parse(e.id==='neon'?'2026-11-06T03:00:00Z':data.sale),memberEnd=start+5*3600000;
 run("INSERT OR IGNORE INTO sale_rounds VALUES(?,'member',?,?)",e.id,start,memberEnd);
 run("INSERT OR IGNORE INTO sale_rounds VALUES(?,'general',?,?)",e.id,memberEnd,Date.parse(data.end));
}
}
export function reset(iso){tx(()=>{for(const table of ['mail_outbox','member_grants','sale_rounds','memberships','audit','notifications','refunds','tickets','orders','payments','seats','holds','queues','events','sessions','attempts','failures','users'])db.exec(`DELETE FROM ${table}`);seed();});setClock(iso||'2026-11-06T03:00:00Z');}
tx(seed);
