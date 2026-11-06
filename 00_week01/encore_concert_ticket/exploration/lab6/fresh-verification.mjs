import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {chromium} from 'playwright';
import {PNG} from 'pngjs';
import jsQR from 'jsqr';
const base='http://127.0.0.1:4385';
const results={scope:'Build verification reproduces the existing checkout; it does not establish a reimplementation or historical parallel execution.',startedUtc:new Date().toISOString(),port:4385,project:'encore-fresh-lab6',checks:[],responses:{}};
let cookie='';
async function req(path,body){assert.equal(new URL(base+path).port,'4385');const r=await fetch(base+path,{method:body?'POST':'GET',headers:{...(body?{'content-type':'application/json',origin:base}:{}),...(cookie?{cookie}:{})},body:body?JSON.stringify(body):undefined});if(r.headers.get('set-cookie'))cookie=r.headers.get('set-cookie').split(';')[0];const ct=r.headers.get('content-type')||'';const data=ct.includes('json')?await r.json():await r.text();results.responses[path]={status:r.status,data};return {status:r.status,data};}
function check(name,fn){fn();results.checks.push({name,pass:true});}
try {
let r=await req('/api/health');check('healthy bugMode0',()=>{assert.equal(r.status,200);assert.equal(r.data.ok,true);assert.equal(r.data.bugMode,0)});
r=await req('/api/test/reset',{});check('test tools disabled403',()=>assert.equal(r.status,403));
r=await req('/api/events');check('catalog12',()=>assert.equal(r.data.events.length,12));
r=await req('/');check('public html bug mode0',()=>assert.match(r.data,/data-bug-mode=["']0["']/));delete results.responses['/'].data;
r=await req('/api/login',{username:'fan',password:'FanDemo!26'});check('Member login',()=>assert.equal(r.status,200));
r=await req('/api/queue',{event:'neon',round:'member'});check('active queue',()=>assert.equal(r.data.queue.status,'active'));
r=await req('/api/membership/verify',{event:'neon',number:'ENCORE-0001'});check('membership grant',()=>assert.equal(r.data.verified,true));
r=await req('/api/seats?event=neon');check('grant permits map',()=>assert.equal(r.status,200));
r=await req('/api/holds',{event:'neon',seats:['C01'],coupon:'STAGE10'});check('hold',()=>assert.equal(r.status,201));const hold=r.data.hold;console.log('hold shape',JSON.stringify(hold));
const buyer={name:'Buyer Test',email:'buyer@example.test',phone:'0812345678'};
r=await req('/api/checkout',{hold:hold.id,buyer,holders:[{seat:'C01',name:'Holder One',email:'holder@example.test',phone:'0898765432'}]});check('checkout',()=>assert.equal(r.status,200));console.log('checkout shape',JSON.stringify(r.data));
r=await req('/api/pay',{hold:hold.id,result:'pending',method:'qr'});check('pending payment',()=>{assert.ok([200,201].includes(r.status));assert.equal(r.data.status,'pending')});console.log('pay shape',JSON.stringify(r.data));
const paymentId=r.data.payment?.id||r.data.payment||r.data.paymentId;
r=await req('/api/payment?id='+paymentId);check('independent money oracle1652',()=>assert.equal(r.data.payment.amount,1652));
r=await req('/api/payments/resolve',{payment:paymentId,result:'approved'});check('payment success',()=>assert.equal(r.data.status,'succeeded'));
r=await req('/api/orders');console.log('orders shape',JSON.stringify(r.data));
const order=(r.data.orders||r.data)[0];const tickets=order.tickets;check('named ticket issued',()=>{assert.equal(tickets.length,1);assert.equal(JSON.parse(tickets[0].holder).name,'Holder One')});
const qrResponse=await fetch(base+'/api/ticket-qr?id='+tickets[0].id+'&format=png',{headers:{cookie}});assert.equal(qrResponse.status,200);const qrBuffer=Buffer.from(await qrResponse.arrayBuffer());await fs.writeFile('exploration/lab6/ticket-qr.png',qrBuffer);const png=PNG.sync.read(qrBuffer);const decoded=jsQR(new Uint8ClampedArray(png.data),png.width,png.height);check('independent jsQR decode',()=>{assert.ok(decoded);assert.equal(decoded.data,tickets[0].code);assert.match(decoded.data,/^[a-f0-9]{64}$/i)});
r=await req('/api/mailbox');console.log('mailbox shape',JSON.stringify(r.data));const mail=r.data.messages[0];check('mail sandbox',()=>{assert.equal(r.data.messages.length,1);assert.equal(mail.recipient,buyer.email);assert.equal(mail.status,'delivered_sandbox')});
r=await req('/api/mail?id='+mail.id);check('mail detail',()=>assert.equal(r.status,200));r=await req('/api/mail.eml?id='+mail.id);check('EML inline PNG',()=>{assert.equal(r.status,200);assert.match(r.data,/image\/png/);assert.match(r.data,/Content-ID:/i)});await fs.writeFile('exploration/lab6/sandbox-mail.eml',r.data);delete results.responses['/api/mail.eml?id='+mail.id].data;
const browser=await chromium.launch({headless:true});for(const [name,viewport] of [['desktop',{width:1440,height:1000}],['mobile',{width:375,height:812}]]){const context=await browser.newContext({viewport,reducedMotion:'reduce'});const page=await context.newPage();await page.goto(base,{waitUntil:'networkidle'});await page.screenshot({path:'exploration/lab6/'+name+'.png',fullPage:true});const html=await page.locator('html').getAttribute('data-bug-mode');check(name+' browser marker0',()=>assert.equal(html,'0'));results.checks.push({name:name+' screenshot and width',pass:true,scrollWidth:await page.evaluate(()=>document.documentElement.scrollWidth),viewport:viewport.width});await context.close();}await browser.close();
results.success=true;
} catch(e){results.success=false;results.error=String(e.stack);console.error(e);process.exitCode=1;} finally{results.endedUtc=new Date().toISOString();await fs.writeFile('exploration/lab6/FRESH-BUILD.json',JSON.stringify(results,null,2));}
