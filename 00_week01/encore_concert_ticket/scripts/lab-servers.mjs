// Disposable, independent worlds for simultaneous black-box charters.
import {spawn} from 'node:child_process';
import {mkdirSync,writeFileSync,openSync} from 'node:fs';
mkdirSync('exploration/lab8',{recursive:true});
const token='encore-lab8',children=[];const started=new Date().toISOString();
async function ready(baseURL){for(let n=0;n<200;n++){try{if((await fetch(baseURL+'/api/health')).ok)return;}catch{}await new Promise(r=>setTimeout(r,100));}throw Error('Server unavailable '+baseURL);}
const servers=await Promise.all(Array.from({length:8},async(_,i)=>{const key=i===0?'recon':'C'+i,port=4340+i,baseURL='http://127.0.0.1:'+port;const log=openSync('exploration/lab8/'+key+'.log','a');const p=spawn(process.execPath,['web/server.mjs'],{env:{...process.env,PORT:String(port),DB_PATH:':memory:',TEST_MODE:'1',TEST_TOKEN:token,BUG_MODE:'0'},stdio:['ignore',log,log]});children.push(p);await ready(baseURL);return[key,{baseURL,token,pid:p.pid,db:'isolated in-memory',bugMode:0}];}));
writeFileSync('exploration/lab8/ENVIRONMENT.json',JSON.stringify({started,servers:Object.fromEntries(servers),rules:['Each charter owns its own server, accounts and clock.','No calls to user runtime 4310.','C7 runs after C1–C6; reset/clock changes logged per charter.']},null,2));console.log('8 independent charter servers ready');
for(const signal of ['SIGTERM','SIGINT'])process.on(signal,()=>{for(const p of children)p.kill();setTimeout(()=>process.exit(0),300);});
