import {readFileSync,writeFileSync} from 'node:fs';
const api=JSON.parse(readFileSync('e2e/api-results.json','utf8')),ui=JSON.parse(readFileSync('e2e/ui-results.json','utf8'));
if(api.version!==3)throw Error('Need V3 API results');
const map={
'V3-U15':'FR01 FR02 FR03 NFR01',
'V3-U01':'FR01 FR05 FR06 FR07 FR08 FR09 FR10 FR11 FR12 FR13 FR14 FR15 BR05 BR07 BR08 BR11 BR12 BR15 NFR01 NFR02',
'V3-U02':'FR01 FR02 FR03 BR01 BR03 BR05',
'V3-U03':'FR07 FR08 FR09 FR10 FR11 BR08 BR10 NFR01',
'V3-U04':'FR04 FR05 BR06 NFR06',
'V3-U05':'FR10 FR12 FR13 FR15 BR19',
'V3-U06':'FR17 BR08',
'V3-U07':'FR16 BR17',
'V3-U08':'FR02 FR07 NFR01',
'V3-U09':'FR07 NFR01 NFR03',
'V3-U10':'FR02 FR12 BR03 BR09',
'V3-U11':'FR11 FR12 FR14 BR13 BR18',
'V3-U12':'FR11 FR12 FR14 BR14 BR18',
'V3-U13':'FR11 FR12 FR14 BR13 BR18',
'V3-U14':'FR11 FR12 FR14 BR13 BR18'};
const rows=[...api.results];
function visit(ss){for(const s of ss){for(const spec of s.specs||[]){const id=spec.title.split(' ')[0],test=spec.tests[0],result=test.results.at(-1);if(!id.startsWith('V3-'))throw Error('Mixed legacy UI result');rows.push({id,name:spec.title.slice(id.length+1),trace:map[id],status:result.status});}visit(s.suites||[]);}}
visit(ui.suites);
const p2=new Set(['V3-A04','V3-U08']),coverage=new Map();
for(const r of rows)for(const tag of r.trace.match(/(?:NFR|FR|BR)\d{2}/g)||[]){const key='V3-'+tag;coverage.set(key,[...(coverage.get(key)||[]),r.id]);}
const expected=[];for(const [kind,count]of[['FR',18],['BR',20],['NFR',7]])for(let n=1;n<=count;n++)expected.push('V3-'+kind+String(n).padStart(2,'0'));
for(const id of expected)if(!coverage.has(id))throw Error('Unmapped requirement '+id);
const passed=rows.filter(r=>r.status==='passed').length,failed=rows.filter(r=>r.status==='failed').length,other=rows.length-passed-failed;
let plan=`# Test Plan — ENCORE V3\n\nOracle: [U]คำสั่งผู้ใช้ในREQUIREMENTS > [A]รายละเอียดที่ตกลงใช้ > TEST-DATAคำนวณเงิน > [R]เว็บอ้างอิง ไม่ใช้ผลบนUIเป็นexpected\nAPI4311/UI4312 in-memory; migration/restart4314temporaryfile; resetก่อนทุกข้อ; ไม่ล้าง4310\nเวลาเริ่ม6พ.ย.2569 10:00ไทย; ข้อมูลMember/Generalและผลเงินอยู่TEST-DATA; methodsเป็นsandboxตามคำตอบผู้ใช้\nเกณฑ์: P1ผ่านทั้งหมดและรวม>=95%; ผลที่ไม่ได้รันต้องBlocked ไม่อ้างV2\n\n## Cases\nแต่ละชื่อเป็นเงื่อนไขและผลที่ต้องยืนยัน ขั้นตอนละเอียด/assertอยู่e2e/api.test.mjsและui.spec.js ค่าเงิน/ขอบเวลาในTEST-DATAและBRเป็นauthority\n\n| Case | Priority | Scenario / Acceptance | Trace |\n|---|---|---|---|\n`;
for(const r of rows)plan+=`| ${r.id} | ${p2.has(r.id)?'P2':'P1'} | ${r.name} | ${r.trace} |\n`;
plan+='\n## Requirement → Test\n| Requirement | Tests |\n|---|---|\n';for(const id of expected)plan+=`| ${id} | ${coverage.get(id).join(', ')} |\n`;
plan+='\nการโยงครบหมายถึงมีscenarioอย่างน้อยหนึ่ง ไม่ใช่ทุกinput/ทุกUnicode/ทุกfailurebranch; ไม่มีSMTPจริง/paymentจริง/productionload/QRcamera/WCAGauditครบ QRตรวจด้วยjsQRอิสระไม่ใช้generatorตรวจตัวเอง; ภาพreferenceไม่ใช่หลักฐานUIของเรา\n';
writeFileSync('TEST-PLAN.md',plan);
let report=`# Test Report — ENCORE V3\n\nวันที่6พฤศจิกายน2569 (Asia/Bangkok); APIrunAtUTC ${api.runAt}; UIstartUTC ${ui.stats.startTime}; Node ${process.version}; Playwright1.58.2/Chromium\nผลจากAPIและPlaywrightรอบV3จริง ไม่รวม49ข้อV2หรือmutationรุ่นเก่า\n\n| กลุ่ม | ทั้งหมด | ผ่าน | ไม่ผ่าน/Blocked |\n|---|---:|---:|---:|\n| API | ${api.results.length} | ${api.results.filter(r=>r.status==='passed').length} | ${api.results.filter(r=>r.status!=='passed').length} |\n| UI | ${rows.length-api.results.length} | ${rows.slice(api.results.length).filter(r=>r.status==='passed').length} | ${rows.slice(api.results.length).filter(r=>r.status!=='passed').length} |\n| รวม | ${rows.length} | ${passed} | ${failed+other} |\n\nเกณฑ์: P1ทั้งหมดและรวม>=95%; P1 ${rows.filter(r=>!p2.has(r.id)&&r.status==='passed').length}/${rows.filter(r=>!p2.has(r.id)).length}, P2 ${rows.filter(r=>p2.has(r.id)&&r.status==='passed').length}/${rows.filter(r=>p2.has(r.id)).length}; ${failed+other===0?'**ผ่านเกณฑ์ V3**':'**ยังไม่ผ่าน ต้องตรวจผลล้มเหลว**'}\n\n## หลักฐานสำคัญ\n- Generalเข้าMemberผ่านqueue/map/holdต้อง403และข้อความตรง“ไม่ใช่สมาชิกMember”; Memberexpiredตรงvalid_untilถูกปฏิเสธ\n- ไม่มีgrantอ่านผัง/holdไม่ได้; เลขผิดและเลขของอีกบัญชีไม่ผ่าน; grantไม่ข้ามevent/accountและหมดอายุตามqueue/round\n- Member2ใบสะสม/account/event; Generalรวม4ข้ามround; MemberปิดและGeneralเปิดตรง15:00 ไม่มีปุ่มadminข้ามschedule\n- queueFIFO active2, fixednumber/ahead/ETA, prequeue15minแต่ไม่activeก่อนเปิด; UIพาไปตรวจเลขอัตโนมัติหลังมีช่อง\n- contactvalidatebuyer+eachholderครบseats; snapshotfreezeเมื่อpending; ราคา1652/3304/5964/4564ตามโจทย์\n- ทั้งQR/7-Eleven/CreditCard/Alipay pending→successออกnamedticket/email; failedหรือเงินช้าไม่มีemail; replayorder/emailหนึ่งชุด\n- ภาพPNGticketQRถอดด้วยjsQRได้code256bitตรงระบบ ไม่มีPIIในpayload; .emlมีMIMEHTMLและinlineQRPNGถึงbuyeremail\n- ownerอื่นอ่านQR/mail/paymentไม่ได้; refund/scan/adminคงทำงาน; scanซ้ำผ่านครั้งเดียวและคืนชื่อผู้ถือ\n- migrationtestA42เริ่มschemaV2ที่ไม่มีcolumnsใหม่จริง แล้วบูตV3ยังมีLEGACY-ORDER/code/NULLholderเดิม ไม่ส่งemailย้อนหลัง; restartV3เก็บemailต่อเนื่อง\n\n## Results\n| Case | Scenario | ผล |\n|---|---|---|\n`;
for(const r of rows)report+=`| ${r.id} | ${r.name} | ${r.status} |\n`;
report+='\n## Coverage / Limit\nFR18/18 BR20/20 NFR7/7มีmappingและscenarioในTEST-PLAN ไม่ได้แปลว่าทุกconditionถูกตรวจทุกinput เป็นself-reviewagentผู้สร้าง ไม่ใช่auditอิสระ ไม่ต่อprovider/SMTP/MemberAPI/กล้องจริง ไม่วัดproductionthroughputหรือปัญหาdiskfull/crashทุกจังหวะ\nภาพจริงexploration/v3-*.png; ผลดิบe2e/api-results.jsonและui-results.json; loge2e/final-run.log; HTMLplaywright-report/index.html\nReference+ภาพต้นทางอยู่references/README.mdและmanifest ไม่ปะปนกับภาพENCORE; PDFเก่ายังV2 ใช้PLAYBOOK.mdเป็นคู่มือV3\n';
report+='\n## Latest UI refinement\nSuccessful membership validation opens the seat map immediately, with no success interstitial or second confirmation. A44/U15 verify account-specific Member/General schedules and demo-account selection. The light theme is covered by the current desktop and mobile screenshots. UI copy now uses plain Thai for account selection, membership, checkout, refund states and organizer history; PLAYBOOK.md uses the same labels.\n';
writeFileSync('TEST-REPORT.md',report);
console.log(JSON.stringify({cases:rows.length,passed,failed,other,FR:18,BR:20,NFR:7}));
if(failed+other)process.exitCode=1;
