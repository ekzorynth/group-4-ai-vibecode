# Test Report — ENCORE V2

วันที่ 6 พฤศจิกายน 2569 (Asia/Bangkok) · ผลAPIจากรอบ `npm run test:all` ล่าสุด และรันUIซ้ำด้วย `npm run test:ui` หลังเพิ่มpagination (backendไม่ได้เปลี่ยน) บนNode.js v26.0.0 / Playwright1.58.2 / Chromium
APIrunAtUTC: 2026-11-06T04:46:57.718Z · UIstartTimeUTC: 2026-11-06T04:54:03.378Z

| กลุ่ม | ทั้งหมด | ผ่าน | ไม่ผ่าน | Blocked |
|---|---:|---:|---:|---:|
| API | 37 | 37 | 0 | 0 |
| Browser UI | 12 | 12 | 0 | 0 |
| P1 | 44 | 44 | 0 | 0 |
| P2 | 5 | 5 | 0 | 0 |
| รวม(ไม่นับซ้ำ) | 49 | 49 | 0 | 0 |

**ผ่านเกณฑ์รุ่นV2:** P1ครบ44/44 รวม100% (เกณฑ์>=95%) นับจากผลดิบรอบนี้ ไม่รวม23ข้อV1หรือmutationV1

## หลักฐานสำคัญ
- ผู้ใช้10บัญชีแย่งที่เดียว: ได้hold1, ที่ซ้ำ409อีก1, อีก8ถูกคิวปฏิเสธ403; ไม่อ้างว่าทั้ง10เข้าถึงชั้นinventoryหรือเป็นloadtest
- pending: paidAtก่อนexpiryและarrivalก่อนexpiry+120sออกบัตรครั้งเดียว; ตรงexpiryหรือgraceEndคืนเงินจำลอง ไม่แย่งที่จากผู้ซื้อรายใหม่
- partialrefundโค้ดผสม: คืน1620; net2944; refundpendingห้ามscan; repeatedapproveไม่เพิ่มledger
- eventcancel: Regular1คืนเต็ม1832/net0; ห้ามเริ่มขายใหม่และห้ามชำระholdเดิม
- สแกนพร้อมกัน2คำขอสำเร็จ1; wrongrole/wrongeventปฏิเสธ; บัตรใช้แล้วไม่คืน
- restartDBไฟล์ยังมีaccount/order/audit และตรวจpasswordsaltedhash; ไม่ใช่crash/powerlosstest
- catalog20คำขอlocal p95=0.64ms <500ms; ไม่ใช่productionSLA ไม่รวมnetworkภายนอก
- ตรวจหน้า/ผัง/admin375pxไม่ล้น และSpace/Escape; ตรวจภาพหลักด้วยตา
- ตรวจserverปกติ4310เพิ่มแบบsmoke: healthversion2และtestresetถูกปิดด้วยTEST_DISABLED แม้ส่งtokenที่testใช้

## ผลรายข้อ
| ID | ทดสอบ | ผล | ผลดิบ |
|---|---|---|---|
| V2-T01 | สมัครด้วยข้อมูลผิด/ซ้ำ และส่งroleปลอม | ผ่าน | e2e/api-results.json |
| V2-T02 | loginซ้ำและlogoutแล้วใช้cookieเก่า | ผ่าน | e2e/api-results.json |
| V2-T03 | เลื่อนเวลาไปก่อน/ตรง24ชม. | ผ่าน | e2e/api-results.json |
| V2-T04 | loginผิด5ครั้งและรอ15นาที | ผ่าน | e2e/api-results.json |
| V2-T05 | ไม่loginเรียกhold/pay/order/admin | ผ่าน | e2e/api-results.json |
| V2-T06 | บัญชีอื่นจ่าย/ปล่อย/อ่าน และloginบัญชีเดิมเครื่องใหม่ | ผ่าน | e2e/api-results.json |
| V2-T07 | catalog12งานและวันเปิด/ปิดค่าขอบ | ผ่าน | e2e/api-results.json |
| V2-T08 | 4บัญชีjoin/refresh/leave/expirequeue | ผ่าน | e2e/api-results.json |
| V2-T09 | holdโดยไม่มีคิวและสลับบัญชี/event | ผ่าน | e2e/api-results.json |
| V2-T10 | presalefanเทียบสมาชิกใหม่ ส่งroundปลอม | ผ่าน | e2e/api-results.json |
| V2-T11 | เลือก0/1/4/5 ซ้ำ ที่ไม่มี และขายแล้ว | ผ่าน | e2e/api-results.json |
| V2-T12 | 10buyerพร้อมกันแย่งA01ผ่านqueue2 | ผ่าน | e2e/api-results.json |
| V2-T13 | replacebasketด้วยชุดที่มีที่sold แล้วreplaceชุดถูก | ผ่าน | e2e/api-results.json |
| V2-T14 | ซื้อ3แล้วถือเพิ่ม1/2 รวมหลายdevice | ผ่าน | e2e/api-results.json |
| V2-T15 | loginใหม่กู้holdและเลื่อน599.999/600s | ผ่าน | e2e/api-results.json |
| V2-T16 | คำนวณ5ชุดราคา โค้ด แบ่งรายใบ ส่งtotalปลอม | ผ่าน | e2e/api-results.json |
| V2-T17 | declined→retryและapprovedสองคำขอ/callbackเก่า | ผ่าน | e2e/api-results.json |
| V2-T18 | pendingแล้วrelease/replace/payซ้ำและเลื่อน600s | ผ่าน | e2e/api-results.json |
| V2-T19 | callbackpaidAt599.999s arrival719.999sพร้อมกันสองครั้ง | ผ่าน | e2e/api-results.json |
| V2-T20 | callbackpaidAtตรง600s | ผ่าน | e2e/api-results.json |
| V2-T21 | callbackตรง720sหลังปล่อยที่ให้คนใหม่ | ผ่าน | e2e/api-results.json |
| V2-T22 | callbackยอดผิด/เวลาอนาคต/failedตามด้วยsuccess | ผ่าน | e2e/api-results.json |
| V2-T23 | ซื้อ2ใบและอ่านnotificationต่างบัญชี | ผ่าน | e2e/api-results.json |
| V2-T24 | ซื้อผสมโค้ด ขอคืนC01 อนุมัติและซื้อใหม่ | ผ่าน | e2e/api-results.json |
| V2-T25 | ปฏิเสธคืนแล้วขอใหม่/approveซ้ำ | ผ่าน | e2e/api-results.json |
| V2-T26 | refundที่72h/+1msและบัญชีอื่น | ผ่าน | e2e/api-results.json |
| V2-T27 | scanrefundpending และแข่งscanvalidสองครั้ง | ผ่าน | e2e/api-results.json |
| V2-T28 | scangateก่อน/ตรงเปิด/ตรงปิดและwrongrole/event | ผ่าน | e2e/api-results.json |
| V2-T29 | cancelงานที่มีticket/holdแล้วapproveคืนและcancelซ้ำ | ผ่าน | e2e/api-results.json |
| V2-T30 | ข้ามowner/role pause blockheld/sold/available round | ผ่าน | e2e/api-results.json |
| V2-T31 | dashboardระหว่างdeclined/pendingและหลังsuccess | ผ่าน | e2e/api-results.json |
| V2-T32 | testendpointไม่มีtoken foreignorigin bodyเกิน เวลาไม่ถูก | ผ่าน | e2e/api-results.json |
| V2-T33 | อ่านcatalog20คำขอบนเครื่องนี้ | ผ่าน | e2e/api-results.json |
| V2-T34 | ซื้อในDBไฟล์ หยุด/เริ่มserverและตรวจhash | ผ่าน | e2e/api-results.json |
| V2-T35 | ส่งobject/array/numberในช่องรหัส | ผ่าน | e2e/api-results.json |
| V2-T36 | pendingdeclinedหลังexpiryและcancelpendingก่อนlateเงิน | ผ่าน | e2e/api-results.json |
| V2-T37 | ตรวจ12ผังและจองauroraด้วยเลขที่นั่งซ้ำกับneon | ผ่าน | e2e/api-results.json |
| V2-U01 | UIlogin→โค้ด→declined→pending→resolve→reload→inbox | ผ่าน | e2e/ui-results.json |
| V2-U02 | UI375pxสมัคร/ค้น/กรอง/เลือก5ที่และราคา4ใบ | ผ่าน | e2e/ui-results.json |
| V2-U03 | UIkeyboardSpace→hold→reload→resume→Escape | ผ่าน | e2e/ui-results.json |
| V2-U04 | UIbuyerคืนC01 แล้วownerอนุมัติ | ผ่าน | e2e/ui-results.json |
| V2-U05 | UIadmin375px pause/round/block/owneroptions | ผ่าน | e2e/ui-results.json |
| V2-U06 | UIscannerรหัสจริง/ซ้ำ/ปลอม | ผ่าน | e2e/ui-results.json |
| V2-U07 | UIwaitingqueueเมื่อactive2แล้วคนแรกleave | ผ่าน | e2e/ui-results.json |
| V2-U08 | UIcancelและอนุมัติคืนเต็มยอด | ผ่าน | e2e/ui-results.json |
| V2-U09 | UIปิดdialogระหว่างresponseholdถูกหน่วง | ผ่าน | e2e/ui-results.json |
| V2-U10 | UIถือแล้วเลื่อนserverถึง600sกดpay | ผ่าน | e2e/ui-results.json |
| V2-U11 | UIค้นศิลปินNORTHLIGHTและจองAURORA BLOOM | ผ่าน | e2e/ui-results.json |
| V2-U12 | แบ่งหน้า desktop/mobile/keyboard และค้น/กรองจากหน้าที่2 | ผ่าน | e2e/ui-results.json |

## Requirement coverage
FR25/25, BR24/24, NFR10/10 มีmappingและscenarioผ่านอย่างน้อยหนึ่งข้อในTEST-PLAN เป็นtracecoverage ไม่ใช่หลักฐานว่าทุกเงื่อนไขของแต่ละข้อถูกทดสอบครบทุกกรณี

## รอบที่พบปัญหาและแก้
Catalogลำดับไม่ตายตัวเพิ่มORDERBY; paymentfailedretryแยกattemptและคงterminalresult; fieldผิดชนิดเพิ่ม400validation; รักษาการคืนlateholdเมื่อปิดdialogระหว่างreserve ทุกจุดมีregressionในรอบสุดท้าย รายละเอียดBUG-HUNT.md

## ข้อจำกัด
เป็นself-reviewโดยagentผู้สร้าง ไม่มีผู้ทดสอบอิสระ SingleNodeSQLite localhost ไม่มีเงินจริง/refundจริง/emailจริง/externalwebhooksignature/กล้องQR/productionload/automaticfailover/penetrationtest/WCAGauditครบ ความยาวemail254/name80และทุกUnicodeยังไม่ตรวจทุกค่าขอบ
ไม่ได้รันmutationV2 ไม่ใช้ผลmutationV1มาปะปน ระบบยังไม่ได้เผยแพร่ออนไลน์

ผลmachine-readable: e2e/api-results.json, e2e/ui-results.json; logAPIและUIรอบก่อน e2e/final-run.log; logUIรอบpagination e2e/ui-run.log; รายงานHTMLplaywright-report/index.html; ภาพexploration/v2-*.png

## Pagination
แสดง6งานต่อหน้า12งานทั้งหมด; ทดสอบU12เปลี่ยนหน้า1/2ด้วยเลขหน้าและก่อนหน้า/ถัดไป ตรวจaria-current/ขอบdisabled ค้นหา/กรองก่อนแบ่งหน้าแล้วresetหน้า1 ผลลัพธ์ว่างไม่แสดงปุ่มหน้า รวมการจองจากหน้า2และ375px/keyboard ภาพexploration/v2-pagination-mobile.png
