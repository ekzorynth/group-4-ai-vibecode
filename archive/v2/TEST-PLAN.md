# Test Plan — ENCORE V2

ขอบเขต: REQUIREMENTS.md V2-FR01–25/BR01–24/NFR01–10; localsimulator ไม่มีเงินจริง/emailจริง/externalgateway/กล้องQR/productionload
Oracle: [P]ข้อเสนอที่ใช้พัฒนาและ[D1]/[R]สูตรเดิม/คำนวณในTEST-DATA ไม่สร้างexpectedจากค่าบนหน้าจอ
เกณฑ์ผ่าน: P1ทั้งหมดและรวม>=95%; ถ้าไม่ได้รันระบุBlocked ไม่แทนด้วยผลV1
API4311/UI4312/in-memory; restarttest4314temporaryfile; resetก่อนทุกข้อ; fixtureเวลา6พ.ย.2569 10:00; บัญชี/สิทธิ์ในTEST-DATA; ไม่แตะDB4310

## ขั้นตอนและผลคาดหวัง
| ID | Priority | สิ่งที่ทำ | คาดหวัง | Trace |
|---|---|---|---|---|
| V2-T01 | P1 | สมัครด้วยข้อมูลผิด/ซ้ำ และส่งroleปลอม | 400เมื่อผิด; emailnormalize; rolebuyer; duplicate409 | V2-FR01, V2-BR01 |
| V2-T02 | P1 | loginซ้ำและlogoutแล้วใช้cookieเก่า | cookieใหม่; HttpOnly/SameSite; cookieเพิกถอน401 | V2-FR02, V2-BR02, V2-NFR03 |
| V2-T03 | P1 | เลื่อนเวลาไปก่อน/ตรง24ชม. | ก่อนขอบ200; ตรงขอบ401 | V2-FR02, V2-BR02 |
| V2-T04 | P1 | loginผิด5ครั้งและรอ15นาที | ครั้ง1–4=401; ครั้ง5ล็อก; ครบ15นาทีเข้าได้ | V2-FR02, V2-BR03 |
| V2-T05 | P1 | ไม่loginเรียกhold/pay/order/admin | 401ทุกเส้น | V2-FR03, V2-NFR04 |
| V2-T06 | P1 | บัญชีอื่นจ่าย/ปล่อย/อ่าน และloginบัญชีเดิมเครื่องใหม่ | อื่น404/ไม่เห็นorder; เจ้าของเห็นorderข้ามเครื่อง | V2-FR03, V2-FR16, V2-NFR04 |
| V2-T07 | P2 | catalog12งานและวันเปิด/ปิดค่าขอบ | 12งาน เปิด6/เร็วๆนี้4/หมด2; ตรงเปิดavailable/ปิดclosed | V2-FR04, V2-BR06 |
| V2-T08 | P1 | 4บัญชีjoin/refresh/leave/expirequeue | active2; waitingFIFO; refreshไม่แซง; ครบ900sขึ้นคิวถัดไป | V2-FR05, V2-BR04 |
| V2-T09 | P1 | holdโดยไม่มีคิวและสลับบัญชี/event | 403เมื่อไม่มีadmission; ก่อนเปิดงานเข้าคิว409 | V2-FR05, V2-FR06, V2-BR05 |
| V2-T10 | P1 | presalefanเทียบสมาชิกใหม่ ส่งroundปลอม | ไม่มีentitlement403; fan201 | V2-FR06, V2-BR05 |
| V2-T11 | P1 | เลือก0/1/4/5 ซ้ำ ที่ไม่มี และขายแล้ว | 0/5/ซ้ำ400; invalid/sold409; 4ที่ว่าง201 | V2-FR07, V2-BR07, V2-BR08 |
| V2-T12 | P1 | 10buyerพร้อมกันแย่งA01ผ่านqueue2 | 201หนึ่ง; conflict409หนึ่ง; queue403แปด | V2-FR07, V2-FR08, V2-NFR05, V2-BR08 |
| V2-T13 | P1 | replacebasketด้วยชุดที่มีที่sold แล้วreplaceชุดถูก | ล้มทั้งชุดและholdเดิมยังอยู่; ชุดใหม่แทนเก่าatomic | V2-FR08, V2-BR08, V2-BR09 |
| V2-T14 | P1 | ซื้อ3แล้วถือเพิ่ม1/2 รวมหลายdevice | 2ใบ409; 1ใบ201; quotaผูกบัญชี | V2-FR09, V2-BR07 |
| V2-T15 | P1 | loginใหม่กู้holdและเลื่อน599.999/600s | holdIdเดิม; 600sหายและpay409; ที่ว่าง | V2-FR11, V2-BR09 |
| V2-T16 | P1 | คำนวณ5ชุดราคา โค้ด แบ่งรายใบ ส่งtotalปลอม | 1832/1652/5964/4564/12928; sumตรง; ลด320/180; FAKE400 | V2-FR10, V2-BR10, V2-BR11, V2-BR12, V2-NFR06 |
| V2-T17 | P1 | declined→retryและapprovedสองคำขอ/callbackเก่า | intentใหม่; orderเดียว; callbackattemptfailedยังfailed | V2-FR12, V2-FR13, V2-BR13, V2-BR15 |
| V2-T18 | P1 | pendingแล้วrelease/replace/payซ้ำและเลื่อน600s | release/replace409; paymentIdเดิม; ยังกันที่ระหว่างgrace | V2-FR12, V2-FR14, V2-BR13, V2-BR14 |
| V2-T19 | P1 | callbackpaidAt599.999s arrival719.999sพร้อมกันสองครั้ง | orderเดียวและออกบัตรสำเร็จ | V2-FR13, V2-FR14, V2-BR14, V2-BR15 |
| V2-T20 | P1 | callbackpaidAtตรง600s | auto_refunded3232 ไม่มีorder | V2-FR14, V2-BR14 |
| V2-T21 | P1 | callbackตรง720sหลังปล่อยที่ให้คนใหม่ | คนใหม่ซื้อสำเร็จ; คนเก่าคืนเงิน ไม่แย่งที่ | V2-FR14, V2-BR14, V2-BR15 |
| V2-T22 | P1 | callbackยอดผิด/เวลาอนาคต/failedตามด้วยsuccess | 400เมื่อยอด/เวลาผิด; terminalfailedไม่ออกorder | V2-FR13, V2-BR15, V2-NFR06 |
| V2-T23 | P1 | ซื้อ2ใบและอ่านnotificationต่างบัญชี | token256bitต่างกัน; notificationเจ้าของ1/อื่น0 | V2-FR15, V2-FR16, V2-BR16, V2-NFR03 |
| V2-T24 | P1 | ซื้อผสมโค้ด ขอคืนC01 อนุมัติและซื้อใหม่ | คืน1620; seatว่าง; net2944; quotaกลับ | V2-FR17, V2-FR18, V2-BR17, V2-BR18, V2-BR23 |
| V2-T25 | P1 | ปฏิเสธคืนแล้วขอใหม่/approveซ้ำ | restorevalid; คืน1800ครั้งเดียว; net32; auditapprove1 | V2-FR18, V2-FR24, V2-BR18, V2-BR24 |
| V2-T26 | P1 | refundที่72h/+1msและบัญชีอื่น | ตรงcutoff201; +1ms409; อื่น404 | V2-FR17, V2-BR17 |
| V2-T27 | P1 | scanrefundpending และแข่งscanvalidสองครั้ง | pending409; validหนึ่ง200หนึ่ง409; usedคืนไม่ได้ | V2-FR18, V2-FR20, V2-BR18, V2-BR20, V2-NFR05 |
| V2-T28 | P1 | scangateก่อน/ตรงเปิด/ตรงปิดและwrongrole/event | ก่อน/ปิด409; ตรงเปิด200; role/event403 | V2-FR20, V2-BR20, V2-BR21 |
| V2-T29 | P1 | cancelงานที่มีticket/holdแล้วapproveคืนและcancelซ้ำ | holdคืน; ห้ามpay; refund1832; net0; auditcancel1 | V2-FR19, V2-BR19, V2-BR22, V2-BR24 |
| V2-T30 | P1 | ข้ามowner/role pause blockheld/sold/available round | ข้าม403; blockbusy409; pauseห้ามholdใหม่แต่เดิมpayได้ | V2-FR21, V2-FR22, V2-FR23, V2-BR21, V2-BR22, V2-NFR04 |
| V2-T31 | P1 | dashboardระหว่างdeclined/pendingและหลังsuccess | ก่อนgross0; หลัง3232; ไม่มีpassword/ticketcodeในaudit | V2-FR21, V2-FR24, V2-BR23, V2-NFR03 |
| V2-T32 | P1 | testendpointไม่มีtoken foreignorigin bodyเกิน เวลาไม่ถูก | 403/403/413/400ตามกรณี | V2-FR25, V2-NFR07, V2-NFR09 |
| V2-T33 | P2 | อ่านcatalog20คำขอบนเครื่องนี้ | p95<500ms; ไม่ใช่loadtest | V2-FR04, V2-NFR10 |
| V2-T34 | P1 | ซื้อในDBไฟล์ หยุด/เริ่มserverและตรวจhash | บัญชี/order/auditยังอยู่; DB3งานเพิ่มเป็น12; saltedhashไม่ใช่plaintext | V2-FR03, V2-FR24, V2-NFR03, V2-NFR08 |
| V2-T35 | P1 | ส่งobject/array/numberในช่องรหัส | 400 ไม่หลุดถึงSQLiteเป็น500 | V2-FR25, V2-NFR09 |
| V2-T36 | P1 | pendingdeclinedหลังexpiryและcancelpendingก่อนlateเงิน | คืนที่; lateauto_refund; ไม่มีorder/gross/refundยอดขาย | V2-FR14, V2-FR19, V2-BR14, V2-BR19 |
| V2-T37 | P1 | ตรวจ12ผังและจองauroraด้วยเลขที่นั่งซ้ำกับneon | ทุกงาน48ที่; auroraC01soldแต่neonC01ยังว่าง; ownerถูกงานเท่านั้น | V2-FR04, V2-FR07, V2-FR08, V2-FR21, V2-BR08, V2-BR21 |
| V2-U01 | P1 | UIlogin→โค้ด→declined→pending→resolve→reload→inbox | 1652ตรงก่อน/หลัง; ticketพร้อมใช้; มีnotification | V2-FR02, V2-FR10, V2-FR11, V2-FR12, V2-FR13, V2-FR15, V2-FR16 |
| V2-U02 | P2 | UI375pxสมัคร/ค้น/กรอง/เลือก5ที่และราคา4ใบ | ไม่ล้น; เลือก4; total12928; ค้น/กรองตรง | V2-FR01, V2-FR04, V2-FR07, V2-FR10, V2-NFR01 |
| V2-U03 | P1 | UIkeyboardSpace→hold→reload→resume→Escape | กู้รายการ; Escapeคืนที่; ปุ่มรายการค้างหาย | V2-FR08, V2-FR11, V2-NFR02 |
| V2-U04 | P1 | UIbuyerคืนC01 แล้วownerอนุมัติ | refundpending→success; gross3664/net1864; audit | V2-FR17, V2-FR18, V2-FR21, V2-FR24 |
| V2-U05 | P2 | UIadmin375px pause/round/block/owneroptions | ไม่ล้น; มีเฉพาะ7งานของตน; เปลี่ยนสถานะได้ | V2-FR21, V2-FR22, V2-FR23, V2-NFR01 |
| V2-U06 | P1 | UIscannerรหัสจริง/ซ้ำ/ปลอม | เข้าได้ครั้งเดียว; ซ้ำ/ปลอมปฏิเสธ | V2-FR20 |
| V2-U07 | P1 | UIwaitingqueueเมื่อactive2แล้วคนแรกleave | ลำดับ1ไม่เปลี่ยน; ได้สิทธิ์แล้วเปิดผัง | V2-FR05 |
| V2-U08 | P1 | UIcancelและอนุมัติคืนเต็มยอด | สร้างrefund1832; net0; catalogcancelled | V2-FR19, V2-FR21, V2-FR22 |
| V2-U09 | P1 | UIปิดdialogระหว่างresponseholdถูกหน่วง | lateholdถูกrelease; ที่กลับavailable | V2-FR08, V2-NFR02 |
| V2-U10 | P1 | UIถือแล้วเลื่อนserverถึง600sกดpay | errorหมดเวลา; paydisabled; กลับเลือกที่ว่างได้ | V2-FR11, V2-FR12, V2-BR09 |
| V2-U11 | P1 | UIค้นศิลปินNORTHLIGHTและจองAURORA BLOOM | counter12; ค้นเจอ1; จองบัตรสำเร็จ1832 | V2-FR04, V2-FR07, V2-FR08, V2-FR10, V2-FR15, V2-NFR01 |
| V2-U12 | P2 | แบ่งหน้า desktop/mobile/keyboard และค้น/กรองจากหน้าที่2 | 6งานต่อหน้า; เลขหน้า/ขอบdisabled; filter/searchกลับหน้า1; emptyซ่อนปุ่ม; จองหน้าที่2ได้ | V2-FR04, V2-NFR01, V2-NFR02 |

## Requirement → Test
| Requirement | Tests |
|---|---|
| V2-BR01 | V2-T01 |
| V2-BR02 | V2-T02, V2-T03 |
| V2-BR03 | V2-T04 |
| V2-BR04 | V2-T08 |
| V2-BR05 | V2-T09, V2-T10 |
| V2-BR06 | V2-T07 |
| V2-BR07 | V2-T11, V2-T14 |
| V2-BR08 | V2-T11, V2-T12, V2-T13, V2-T37 |
| V2-BR09 | V2-T13, V2-T15, V2-U10 |
| V2-BR10 | V2-T16 |
| V2-BR11 | V2-T16 |
| V2-BR12 | V2-T16 |
| V2-BR13 | V2-T17, V2-T18 |
| V2-BR14 | V2-T18, V2-T19, V2-T20, V2-T21, V2-T36 |
| V2-BR15 | V2-T17, V2-T19, V2-T21, V2-T22 |
| V2-BR16 | V2-T23 |
| V2-BR17 | V2-T24, V2-T26 |
| V2-BR18 | V2-T24, V2-T25, V2-T27 |
| V2-BR19 | V2-T29, V2-T36 |
| V2-BR20 | V2-T27, V2-T28 |
| V2-BR21 | V2-T28, V2-T30, V2-T37 |
| V2-BR22 | V2-T29, V2-T30 |
| V2-BR23 | V2-T24, V2-T31 |
| V2-BR24 | V2-T25, V2-T29 |
| V2-FR01 | V2-T01, V2-U02 |
| V2-FR02 | V2-T02, V2-T03, V2-T04, V2-U01 |
| V2-FR03 | V2-T05, V2-T06, V2-T34 |
| V2-FR04 | V2-T07, V2-T33, V2-T37, V2-U02, V2-U11, V2-U12 |
| V2-FR05 | V2-T08, V2-T09, V2-U07 |
| V2-FR06 | V2-T09, V2-T10 |
| V2-FR07 | V2-T11, V2-T12, V2-T37, V2-U02, V2-U11 |
| V2-FR08 | V2-T12, V2-T13, V2-T37, V2-U03, V2-U09, V2-U11 |
| V2-FR09 | V2-T14 |
| V2-FR10 | V2-T16, V2-U01, V2-U02, V2-U11 |
| V2-FR11 | V2-T15, V2-U01, V2-U03, V2-U10 |
| V2-FR12 | V2-T17, V2-T18, V2-U01, V2-U10 |
| V2-FR13 | V2-T17, V2-T19, V2-T22, V2-U01 |
| V2-FR14 | V2-T18, V2-T19, V2-T20, V2-T21, V2-T36 |
| V2-FR15 | V2-T23, V2-U01, V2-U11 |
| V2-FR16 | V2-T06, V2-T23, V2-U01 |
| V2-FR17 | V2-T24, V2-T26, V2-U04 |
| V2-FR18 | V2-T24, V2-T25, V2-T27, V2-U04 |
| V2-FR19 | V2-T29, V2-T36, V2-U08 |
| V2-FR20 | V2-T27, V2-T28, V2-U06 |
| V2-FR21 | V2-T30, V2-T31, V2-T37, V2-U04, V2-U05, V2-U08 |
| V2-FR22 | V2-T30, V2-U05, V2-U08 |
| V2-FR23 | V2-T30, V2-U05 |
| V2-FR24 | V2-T25, V2-T31, V2-T34, V2-U04 |
| V2-FR25 | V2-T32, V2-T35 |
| V2-NFR01 | V2-U02, V2-U05, V2-U11, V2-U12 |
| V2-NFR02 | V2-U03, V2-U09, V2-U12 |
| V2-NFR03 | V2-T02, V2-T23, V2-T31, V2-T34 |
| V2-NFR04 | V2-T05, V2-T06, V2-T30 |
| V2-NFR05 | V2-T12, V2-T27 |
| V2-NFR06 | V2-T16, V2-T22 |
| V2-NFR07 | V2-T32 |
| V2-NFR08 | V2-T34 |
| V2-NFR09 | V2-T32, V2-T35 |
| V2-NFR10 | V2-T33 |

Mappingแปลว่ามีอย่างน้อยหนึ่งscenarioตรวจแต่ละrequirement ไม่ใช่ทดสอบทุกค่าหรือทุกinput รูปแบบpassword/email/nameไม่ได้ทดสอบทุกUnicode ความเสี่ยงและช่องว่างในPLAN-REVIEW.md
refundcutoff72hและgateเปิดก่อน2hไม่ทับกัน จึงทดสอบbarrierrefund_pendingและscanraceแทนการอ้างว่าสองเส้นทางนี้eligibleพร้อมกัน
cleanup: ปิดprocessที่testเปิดเอง คืนtemporaryDBหลังจบ; testtoolsไม่เปิดในserverปกติ; Playwrightเก็บtrace/screenshotเมื่อfail และscreenshotsหลักในexploration/v2-*.png
