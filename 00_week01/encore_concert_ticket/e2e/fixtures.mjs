import {test as base,expect} from '@playwright/test';
import {spawn} from 'node:child_process';
import {mkdirSync,appendFileSync} from 'node:fs';
import {join} from 'node:path';
export const runMode=process.env.BUG_MODE==='1'?'bug':'normal';
export const runRoot=join('e2e','report-'+runMode);
export const test=base.extend({
  workerService:[async({},use,info)=>{
    const port=(runMode==='bug'?4800:4600)+info.workerIndex,baseURL='http://127.0.0.1:'+port;
    mkdirSync(runRoot,{recursive:true});const started=new Date().toISOString();
    const child=spawn(process.execPath,['web/server.mjs'],{env:{...process.env,PORT:String(port),DB_PATH:':memory:',TEST_MODE:'1',TEST_TOKEN:'encore-e2e',BUG_MODE:runMode==='bug'?'1':'0'},stdio:['ignore','ignore','pipe']});let stderr='';child.stderr.on('data',b=>stderr+=b);
    try{let ready=false;for(let n=0;n<150;n++){try{if((await fetch(baseURL+'/api/health')).ok){ready=true;break;}}catch{}await new Promise(r=>setTimeout(r,100));}if(!ready)throw Error('Worker server unavailable '+stderr);
      appendFileSync(join(runRoot,'workers.jsonl'),JSON.stringify({worker:info.workerIndex,port,pid:child.pid,started,mode:runMode})+'\n');await use({baseURL,port});
    }finally{const end=new Promise(resolve=>{if(child.exitCode!==null)resolve();else{child.once('exit',resolve);child.kill();}});await end;appendFileSync(join(runRoot,'workers.jsonl'),JSON.stringify({worker:info.workerIndex,port,ended:new Date().toISOString()})+'\n');}
  },{scope:'worker'}],
  baseURL:async({workerService},use)=>use(workerService.baseURL),
  evidence:[async({page,workerService},use,info)=>{const started=new Date().toISOString();await use();const id=info.title.split(' ')[0];mkdirSync(join(runRoot,'screenshots'),{recursive:true});if(!page.isClosed()){const path=join(runRoot,'screenshots',id+'.png');await page.screenshot({path,fullPage:false});await info.attach('final-screen',{path,contentType:'image/png'});}appendFileSync(join(runRoot,'execution.jsonl'),JSON.stringify({id,worker:info.workerIndex,port:workerService.port,started,ended:new Date().toISOString(),status:info.status})+'\n');},{auto:true}]
});
export {expect};
