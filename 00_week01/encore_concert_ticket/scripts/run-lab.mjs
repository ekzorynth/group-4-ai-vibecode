import {spawnSync} from 'node:child_process';
import {mkdirSync,rmSync,copyFileSync,writeFileSync,readFileSync,existsSync} from 'node:fs';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
const mode=process.argv[2]||'normal';if(!['normal','bug'].includes(mode))throw Error('Use normal or bug');
const root=join('e2e','report-'+mode),env={...process.env,BUG_MODE:mode==='bug'?'1':'0'};
// Only generated lab output is replaced; user database and other charter records are untouched.
rmSync(root,{recursive:true,force:true});mkdirSync(join(root,'exploration'),{recursive:true});
const frozenFiles=['e2e/api.test.mjs','e2e/grace-component.mjs','e2e/ui.spec.js','e2e/lab.spec.js','e2e/fixtures.mjs','playwright.config.js','REQUIREMENTS.md','TEST-DATA.md','TEST-PLAN.md','plan/5.1.json','plan/5.2.json','plan/5.3.json'];
const digest=Object.fromEntries(frozenFiles.map(file=>[file,createHash('sha256').update(readFileSync(file)).digest('hex')]));
if(mode==='bug'){const baseline=JSON.parse(readFileSync('e2e/report-normal/frozen.json','utf8'));for(const file of frozenFiles)if(baseline[file]!==digest[file])throw Error('Frozen oracle/test changed before mutation: '+file);}
writeFileSync(join(root,'frozen.json'),JSON.stringify(digest,null,2));
const started=new Date().toISOString();const api=spawnSync(process.execPath,['--test','e2e/api.test.mjs'],{env,encoding:'utf8',maxBuffer:20*1024*1024});writeFileSync(join(root,'api-run.txt'),api.stdout+api.stderr);if(api.error)throw api.error;copyFileSync('e2e/api-results.json',join(root,'api-results.json'));
const ui=spawnSync('npx',['playwright','test'],{env,encoding:'utf8',maxBuffer:20*1024*1024});writeFileSync(join(root,'ui-run.txt'),ui.stdout+ui.stderr);if(ui.error)throw ui.error;
writeFileSync(join(root,'run.json'),JSON.stringify({mode,started,ended:new Date().toISOString(),apiExit:api.status,uiExit:ui.status,workers:3,isolatedDatabases:true,bugMode:mode==='bug'?1:0,node:process.version},null,2));
console.log(JSON.stringify({mode,apiExit:api.status,uiExit:ui.status}));
if(mode==='normal'&&(api.status!==0||ui.status!==0))process.exitCode=1;
// In bug mode failing business assertions are expected; the report, not exit zero, decides mutation detection.
if(mode==='bug'&&!existsSync(join(root,'results.json')))process.exitCode=1;
