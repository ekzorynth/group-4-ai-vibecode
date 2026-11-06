// Run only against a disposable Compose project: creates a demo order and confirms persistence.
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
const base=process.env.BASE_URL||'http://localhost:4315';
const stateFile=process.env.SMOKE_STATE||'tmp/docker-smoke-state.json';
const mode=process.argv[2]||'create';
let cookie='';
async function api(path,body){const r=await fetch(base+'/api/'+path,{method:body===undefined?'GET':'POST',headers:{'Content-Type':'application/json',cookie},body:body===undefined?undefined:JSON.stringify(body)});if(r.headers.get('set-cookie'))cookie=r.headers.get('set-cookie').split(';')[0];const data=await r.json();return{status:r.status,data};}
assert.equal((await api('health')).data.version,3);
assert.equal((await api('login',{username:'fan',password:'FanDemo!26'})).status,200);
if(mode==='create'){
 const q=await api('queue',{event:'neon',round:'member'});assert.equal(q.data.queue.status,'active');
 assert.equal((await api('membership/verify',{event:'neon',number:'ENCORE-0001'})).data.verified,true);
 const h=await api('holds',{event:'neon',seats:['C01'],coupon:'STAGE10'});assert.equal(h.status,201);assert.equal(h.data.hold.price.total,1652);
 const person={name:'Docker Buyer',email:'docker@example.test',phone:'0812345678'};
 assert.equal((await api('checkout',{hold:h.data.hold.id,buyer:person,holders:[{seat:'C01',...person}]})).status,200);
 const payment=await api('pay',{hold:h.data.hold.id,result:'approved',method:'qr'});assert.equal(payment.data.status,'succeeded');
 const orders=(await api('orders')).data.orders;assert.equal(orders.length,1);const ticket=orders[0].tickets[0];assert.equal(JSON.parse(ticket.holder).name,'Docker Buyer');
 const qr=await fetch(base+'/api/ticket-qr?id='+ticket.id,{headers:{cookie}});assert.equal(qr.status,200);assert.match(await qr.text(),/<svg/);
 const messages=(await api('mailbox')).data.messages;assert.equal(messages.length,1);assert.equal(messages[0].recipient,'docker@example.test');
 const eml=await fetch(base+'/api/mail.eml?id='+messages[0].id,{headers:{cookie}});assert.equal(eml.status,200);assert.match(await eml.text(),/Content-Type: image\/png/);
 assert.equal((await api('test/reset',{})).status,403);
 mkdirSync('tmp',{recursive:true});writeFileSync(stateFile,JSON.stringify({order:orders[0].id,ticket:ticket.id,mail:messages[0].id}));
 console.log(JSON.stringify({phase:'create',health:true,memberCheckout:true,total:1652,ticketQR:true,emailAttachment:true,testResetDisabled:true}));
}else if(mode==='verify'){
 const expected=JSON.parse(readFileSync(stateFile,'utf8')),orders=(await api('orders')).data.orders,messages=(await api('mailbox')).data.messages;
 assert.equal(orders.length,1);assert.equal(orders[0].id,expected.order);assert.equal(orders[0].tickets[0].id,expected.ticket);assert.equal(messages.length,1);assert.equal(messages[0].id,expected.mail);
 console.log(JSON.stringify({phase:'restart',orderPersisted:true,ticketPersisted:true,emailPersisted:true}));
}else throw Error('Use create or verify');
