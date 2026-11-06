# Test Report — ENCORE V3

วันที่6พฤศจิกายน2569 (Asia/Bangkok); APIrunAtUTC 2026-11-06T09:40:11.093Z; UIstartUTC 2026-11-06T09:40:11.647Z; Node v26.0.0; Playwright1.58.2/Chromium
ผลจากAPIและPlaywrightรอบV3จริง ไม่รวม49ข้อV2หรือmutationรุ่นเก่า

| กลุ่ม | ทั้งหมด | ผ่าน | ไม่ผ่าน/Blocked |
|---|---:|---:|---:|
| API | 44 | 44 | 0 |
| UI | 15 | 15 | 0 |
| รวม | 59 | 59 | 0 |

เกณฑ์: P1ทั้งหมดและรวม>=95%; P1 57/57, P2 2/2; **ผ่านเกณฑ์ V3**

## หลักฐานสำคัญ
- Generalเข้าMemberผ่านqueue/map/holdต้อง403และข้อความตรง“ไม่ใช่สมาชิกMember”; Memberexpiredตรงvalid_untilถูกปฏิเสธ
- ไม่มีgrantอ่านผัง/holdไม่ได้; เลขผิดและเลขของอีกบัญชีไม่ผ่าน; grantไม่ข้ามevent/accountและหมดอายุตามqueue/round
- Member2ใบสะสม/account/event; Generalรวม4ข้ามround; MemberปิดและGeneralเปิดตรง15:00 ไม่มีปุ่มadminข้ามschedule
- queueFIFO active2, fixednumber/ahead/ETA, prequeue15minแต่ไม่activeก่อนเปิด; UIพาไปตรวจเลขอัตโนมัติหลังมีช่อง
- contactvalidatebuyer+eachholderครบseats; snapshotfreezeเมื่อpending; ราคา1652/3304/5964/4564ตามโจทย์
- ทั้งQR/7-Eleven/CreditCard/Alipay pending→successออกnamedticket/email; failedหรือเงินช้าไม่มีemail; replayorder/emailหนึ่งชุด
- ภาพPNGticketQRถอดด้วยjsQRได้code256bitตรงระบบ ไม่มีPIIในpayload; .emlมีMIMEHTMLและinlineQRPNGถึงbuyeremail
- ownerอื่นอ่านQR/mail/paymentไม่ได้; refund/scan/adminคงทำงาน; scanซ้ำผ่านครั้งเดียวและคืนชื่อผู้ถือ
- migrationtestA42เริ่มschemaV2ที่ไม่มีcolumnsใหม่จริง แล้วบูตV3ยังมีLEGACY-ORDER/code/NULLholderเดิม ไม่ส่งemailย้อนหลัง; restartV3เก็บemailต่อเนื่อง

## Results
| Case | Scenario | ผล |
|---|---|---|
| V3-A01 | username registration, case duplicates, validation and role injection | passed |
| V3-A02 | username and legacy email login, cookie rotation and logout | passed |
| V3-A03 | session 24h and five-login lockout exact boundaries | passed |
| V3-A04 | catalog twelve maps and explicit Member/General schedules | passed |
| V3-A05 | anonymous cannot queue or read Member map | passed |
| V3-A06 | General rejected by Member queue/map/hold with exact Thai message | passed |
| V3-A07 | expired membership exactly at valid_until denied | passed |
| V3-A08 | before queue: Member map and forged hold both blocked | passed |
| V3-A09 | correct membership unlocks map, wrong and other owner number do not | passed |
| V3-A10 | grant scoped to account and event, queue expiry revokes access | passed |
| V3-A11 | prequeue fifteen minutes, fixed number, no admission before sale | passed |
| V3-A12 | FIFO two slots shows ahead and ETA; leaves promote in order | passed |
| V3-A13 | Member closes and General opens exactly 15:00 without admin toggle | passed |
| V3-A14 | Member two seats per user cumulative, multidevice cannot bypass | passed |
| V3-A15 | Member 0/3 duplicates sold invalid and all-or-nothing | passed |
| V3-A16 | race same seat only one hold, same ID across events isolated | passed |
| V3-A17 | canonical price, allocation, coupon cap and tampered total | passed |
| V3-A18 | hold exact600s, reload recovery and closing releases | passed |
| V3-A19 | checkout mandatory and data ownership enforced | passed |
| V3-A20 | validate buyer and each holder name email phone and exact seat count | passed |
| V3-A21 | checkout freezes after pending; contact snapshot retained cross-device | passed |
| V3-A22 | payment channel qr pending instructions then named ticket and email | passed |
| V3-A23 | payment channel seven_eleven pending instructions then named ticket and email | passed |
| V3-A24 | payment channel credit_card pending instructions then named ticket and email | passed |
| V3-A25 | payment channel alipay pending instructions then named ticket and email | passed |
| V3-A26 | invalid method and client amount rejected/ignored respectively | passed |
| V3-A27 | declined retry new attempt; duplicate success creates one order/mail | passed |
| V3-A28 | pending cannot release/reselect; timely callback in grace succeeds | passed |
| V3-A29 | late paidAt at expiry refunds with no email/ticket | passed |
| V3-A30 | grace exact end releases seat; callback cannot steal resale | passed |
| V3-A31 | wrong amount/future callback does not finalize | passed |
| V3-A32 | actual ticket QR independently decodes to opaque code without PII | passed |
| V3-A33 | QR/payment/mail owner isolation and eml embedded QR attachment | passed |
| V3-A34 | two holders distinct names and buyer email receives both tickets | passed |
| V3-A35 | partial refund restores seat and Member quota only after approval | passed |
| V3-A36 | scanner uses QR code once, returns holder name; wrong role denied | passed |
| V3-A37 | refund pending blocks scanning, refund cutoff exact boundary | passed |
| V3-A38 | organizer scope, pause/block and automatic round cannot be bypassed | passed |
| V3-A39 | cancel full refund idempotent, no extra tickets or mail | passed |
| V3-A40 | Origin, body, malformed IDs and test tools protected | passed |
| V3-A41 | additive migration and restart preserve legacy order, then V3 order/email | passed |
| V3-A42 | real V2 schema upgraded additively without losing legacy tickets | passed |
| V3-A43 | Member quota two counts toward General total four across sale rounds | passed |
| V3-A44 | account catalog scopes round schedules, status and availability by audience | passed |
| V3-U01 | Member invalid/valid number, two named tickets, payment retry and email E-Ticket | passed |
| V3-U02 | General signs up, denied Member, joins General at15 with no membership input | passed |
| V3-U03 | mobile Member cap2 contact validation copy and QR demo | passed |
| V3-U04 | Member queue has stable number, ahead, ETA and auto-enters verification | passed |
| V3-U05 | pending and contact snapshots recover after reload | passed |
| V3-U06 | named ticket partial refund and organizer audit | passed |
| V3-U07 | gate scans ticket QR payload once and shows holder name | passed |
| V3-U08 | pagination all-event search and General new-event booking | passed |
| V3-U09 | keyboard selection and close during reserve release late hold | passed |
| V3-U10 | automatic Member cutoff blocks pay, General opens at15 | passed |
| V3-U11 | payment qr completes sandbox email | passed |
| V3-U12 | payment seven_eleven completes sandbox email | passed |
| V3-U13 | payment credit_card completes sandbox email | passed |
| V3-U14 | payment alipay completes sandbox email | passed |
| V3-U15 | demo accounts separate Member and General sale views in calm theme | passed |

## Coverage / Limit
FR18/18 BR20/20 NFR7/7มีmappingและscenarioในTEST-PLAN ไม่ได้แปลว่าทุกconditionถูกตรวจทุกinput เป็นself-reviewagentผู้สร้าง ไม่ใช่auditอิสระ ไม่ต่อprovider/SMTP/MemberAPI/กล้องจริง ไม่วัดproductionthroughputหรือปัญหาdiskfull/crashทุกจังหวะ
ภาพจริงexploration/v3-*.png; ผลดิบe2e/api-results.jsonและui-results.json; loge2e/final-run.log; HTMLplaywright-report/index.html
Reference+ภาพต้นทางอยู่references/README.mdและmanifest ไม่ปะปนกับภาพENCORE; PDFเก่ายังV2 ใช้PLAYBOOK.mdเป็นคู่มือV3

## Latest UI refinement
Successful membership validation opens the seat map immediately, with no success interstitial or second confirmation. A44/U15 verify account-specific Member/General schedules and demo-account selection. The light theme is covered by the current desktop and mobile screenshots. UI copy now uses plain Thai for account selection, membership, checkout, refund states and organizer history; PLAYBOOK.md uses the same labels.
