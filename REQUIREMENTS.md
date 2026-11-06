# ENCORE V3 — Member Sale → E-Ticket QR → Email Sandbox

วันที่6พฤศจิกายน2569; [U]=ผู้ใช้ระบุ, [R]=references/README.md, [A]=สมมติฐานที่กำหนดให้พัฒนาตรวจได้
คำตอบยืนยันรอบนี้[U]: สมาชิก/การชำระจำลองและกล่องอีเมลทดลอง ไม่มีการเรียกเก็บหรือส่งอีเมลภายนอก แต่QRบัตรต้องสร้างและถอดรหัสได้จริง
V3แทนกฎV2เรื่องlogin, รอบขาย, memberquota, checkoutและรูปแบบบัตร เอกสารV2อยู่archive/v2 ผลV2ไม่ใช่หลักฐานV3

## User Journey [U]
เข้าเว็บ → Username/Password → เลือกEvent/รอบ → Queue number + คนก่อนหน้า + เวลาประมาณ → เมื่อถึงคิว → กรอกMembershipก่อนเข้าผัง(เฉพาะMember) → เลือกโซน/ราคา/ที่นั่ง → ข้อมูลผู้ซื้อและผู้ถือรายใบ → ตรวจสรุป → QR/7-Eleven/Credit Card/Alipay → ตรวจผลชำระ → E-Ticket QR+ชื่อ → ส่งเข้ากล่องอีเมลทดลองของผู้ซื้อ

## ขอบเขตและการคงของเดิม
เก็บ12งานและpagination6งาน/หน้า ฐานข้อมูลเดิมเพิ่มschemaแบบรักษาordersเดิม คืนเงิน/หลังบ้าน/ตรวจบัตร/หมดเวลายังต้องทำงาน ห้ามทำV2ordersเก่ามีชื่อผู้ถือปลอม ให้ระบุ“รายการรุ่นก่อน”เมื่อไม่มีข้อมูล
รูปแบบทุกงานเป็นบัตรระบุที่นั่ง VIP/Regular ไม่มีบัตรยืนในรุ่นนี้ ราคาและสูตรส่วนลดเดิม ช่องทางชำระจำลองทั้งสี่ใช้feeเดิม ไม่อ้างเป็นค่าธรรมเนียมผู้ให้บริการจริง

## Functional Requirements
| ID | ข้อกำหนดและเกณฑ์ยอมรับ | ที่มา |
|---|---|---|
| V3-FR01 | สมัครด้วยusernameไม่ซ้ำและpassword; loginusername/password; รองรับemailเดิมเพื่อเข้าบัญชีเก่า; ห้ามclientกำหนดrole/member | U/A |
| V3-FR02 | ผู้เยี่ยมชมเห็นสองรอบเพื่อดูภาพรวม; บัญชีMemberเห็นเฉพาะMember Sale บัญชีGeneralเห็นเฉพาะGeneral Sale รวมวันเวลา สถานะ และปุ่มซื้อตามรอบของตน; ตรวจเวลาserverและปิดอัตโนมัติ | U/REF02 |
| V3-FR03 | ต้องloginก่อนเข้าคิว; Generalเข้ารอบMemberไม่ได้ ตอบข้อความตรง“ไม่ใช่สมาชิกMember” | U |
| V3-FR04 | คิวFIFOมีหมายเลขคิวคงที่ จำนวนคนก่อนหน้า เวลารอประมาณ; reloadไม่แซง; pollingเมื่อถึงคิวพาไปขั้นถัดไป | U/REF01 |
| V3-FR05 | เมื่อactiveMemberให้กรอกเลขMembershipก่อนเห็นผัง; ผิดแสดงerrorและห้ามAPIอ่านผัง/hold; ตรวจถูกแล้วเข้าผังอัตโนมัติทันที ไม่มีข้อความสำเร็จหรือปุ่มเข้าผังซ้ำ; grantผูกuser/event/round | U/REF02 |
| V3-FR06 | ตรวจสมาชิกactive/วันหมดอายุ/เลขต้องเป็นของaccount; Generalไม่ใช้เลข; เลขคนอื่นหรือเลขใช้ข้ามงานไม่ได้ | U/A |
| V3-FR07 | เลือกราคา/ประเภทVIPหรือRegularแล้วผัง; statusว่าง/ถือ/ขาย/blocked; เลือกไม่ซ้ำatomic | U |
| V3-FR08 | Memberสูงสุด2ใบสะสมต่อuser/event/Member; เปิดหลายแท็บไม่เพิ่มสิทธิ์; Generalคง4ใบต่อaccount/eventรวมทุกround | U/A |
| V3-FR09 | กรอกผู้ซื้อ fullname/email/phone และผู้ถือแต่ละใบครบตรงseats; validateฝั่งserver; ห้ามpayถ้ายังไม่ผ่าน | U/REF05 |
| V3-FR10 | สรุปข้อมูลรายใบ ประเภท ราคา ส่วนลด fee VAT totalก่อนจ่าย; snapshotฝั่งserverและกู้checkoutได้ | U |
| V3-FR11 | เลือก4methods: qr, seven_eleven, credit_card, alipay; แสดงคำแนะนำ/เลขอ้างอิง/deadlineเฉพาะmethod | U/REF03/04 |
| V3-FR12 | simulatorตรวจpending/succeeded/failed/expired; pendingไม่ออกบัตร; callbackซ้ำไม่สร้างorder/emailซ้ำ; เงินมาช้าคืนจำลองไม่แย่งseat | U |
| V3-FR13 | ชำระสำเร็จสร้างticketรายใบ มีชื่อผู้ถือ/event/seat/QRจริงที่encodeopaque code; endpointQRเฉพาะเจ้าของ; QRไม่เก็บemail/phone | U/REF05 |
| V3-FR14 | สร้างemailoutboxอัตโนมัติถึงbuyer.emailหลังsuccessพร้อมสรุปและticketทั้งหมด; localกล่องทดลองดูHTMLและดาวน์โหลด.emlได้ | U/REF05/06 |
| V3-FR15 | Outboxแยกowner; paymentfailed/pendingไม่มีemail; replayมีemailเดียว; ข้อมูลผู้ซื้อ/ผู้ถือเป็นsnapshot | U/A |
| V3-FR16 | scannerตรวจcodeที่ถอดจากQRได้ครั้งเดียว พร้อมคืนชื่อผู้ถือ; refunded/pendingrefund/usedห้ามเข้า; role/event/windowเดิม | U/REF06 |
| V3-FR17 | regression: refundบางใบ, ownerisolation, pause/block/cancel, audit, sessionและinputprotectionต้องคงอยู่ | A/V2 |
| V3-FR18 | ทดสอบclock/memberexpired/invalid/refund/callbackในDBแยก เก็บภาพจริงและผล V3 ไม่อ้างผลV2 | U |

## Business Rules / Boundaries
| ID | กฎและผลคาดหวัง | ที่มา |
|---|---|---|
| V3-BR01 | username3–32 ใช้อักษรอังกฤษตัวเลข._- normalize lowercase ไม่ซ้ำ; password10–128; emailเก่ายังloginได้ | A |
| V3-BR02 | แต่ละeventมีmember_start<member_end<=general_start<general_end; timeUTCเก็บ แสดงAsia/Bangkok | U/A |
| V3-BR03 | NEON: Member6พ.ย.2569 10:00<=now<15:00; General15:00<=now<12ธ.ค.2569 17:00; ตรง15:00Memberซื้อใหม่ไม่ได้ Generalซื้อได้ | U/A |
| V3-BR04 | waitingroomเปิด15นาทีก่อนroundstart; ก่อนเปิดได้waitingแต่ห้ามactive; หลังroundendห้ามjoin/holdและexpireสิทธิ์เก่า | A |
| V3-BR05 | Generalเข้ารอบMember403และmessageตรง“ไม่ใช่สมาชิกMember” ตรวจทั้งjoin/map/hold ไม่ใช่ซ่อนปุ่มอย่างเดียว | U |
| V3-BR06 | queueactiveสูงสุด2บัญชี/event/round, TTL900sไม่เกินroundend; ahead=active+waitingก่อนตน; ETAceil(ahead/2)×120s บวกเวลารอก่อนเปิดรอบ เป็นประมาณ | U/A |
| V3-BR07 | membershipgrantมีอายุไม่เกินqueueexpiry/roundend; ต้องactiveบัญชีเดียวกัน/eventเดียวกัน; expiredmemberตรงvalid_untilเข้าไม่ได้ | U/A |
| V3-BR08 | Memberเลือก1–2ที่; boughtMemberที่ยังไม่refunded+heldใหม่<=2; globalboughtทุกround+heldใหม่<=4; refund_pendingยังนับ | U/A |
| V3-BR09 | holdexpires=min(now+600s,roundend); paymentintentยืดdeadlineเองไม่ได้; pendinggraceเดิม120sแต่ไม่เริ่มpaymentใหม่หลังexpiry | A |
| V3-BR10 | fullname2–100และมีชื่อ/นามสกุลคั่นวรรค; email<=254รูปแบบถูก; phone8–15digits รองรับ+นำหน้า/ตัดเว้นวรรคและขีด | U/A |
| V3-BR11 | จำนวนholders=seatsและจับคู่seatไม่ซ้ำ ห้ามข้อมูลขาด/seatนอกbasket; buyeremailเป็นผู้รับemail ไม่ใช้holderemailแทน | U |
| V3-BR12 | Regular1800 VIP3200; STAGE10floor10%max500; fee30/ใบ VATround7%fee; 1Regular+โค้ด1652; 2VIP+โค้ด5964 | V2 |
| V3-BR13 | methodenumเท่านั้น; clienttotalไม่ใช่ยอดยืนยัน; ไม่รับเลขบัตรจริง; QRชำระencodeENCORE-DEMO-PAYเท่านั้น ไม่มีบัญชีรับเงินจริง | U/A |
| V3-BR14 | 7-Elevenเป็นใบอ้างอิงทดลอง deadlineเท่าhold600s ไม่ใช่2ชม. ต้องยืนยันในUI; ไม่สร้างหนี้/receiptจริง | U/A |
| V3-BR15 | paymentattemptfailedเป็นterminal retryต้องpaymentIdใหม่; approvedซ้ำorderเดียว/emailเดียว/ticketจำนวนเดิม | V2 |
| V3-BR16 | successเมื่อpaidAt<expiryและarrivedAt<expiry+120sและseatยังเป็นของhold; ไม่เช่นนั้นauto-refundไม่มีticket/email | V2 |
| V3-BR17 | ticketQRrandom256bit ไม่มีPIIในpayload; ชื่ออยู่บนบัตรภายนอกQR; QRdownload/Emailowner-only | U/A |
| V3-BR18 | mailoutboxorderUNIQUE; ส่งในกล่องทดลองหลังticketcomplete; statusdelivered_sandbox ไม่อ้างsentภายนอก; .emlมีHTMLและQRPNGแนบ | U/A |
| V3-BR19 | ข้อมูลcontactแก้ได้เฉพาะheldก่อนpayment pending/paid; ใบเก่าที่ไม่มีcontactไม่แต่งข้อมูลย้อนหลัง | A |
| V3-BR20 | การเปลี่ยนroundตามเวลาอัตโนมัติ ไม่ใช้ปุ่มadminบังคับGeneralก่อนเวลา; cancel/pauseownerเดิมยังใช้; login5ผิดพัก15min/session24hคงเดิม | A/V2 |

## NFR
NFR01:375pxทุกขั้นไม่ล้น/keyboard/label/error; NFR02:ข้อมูลส่วนตัวแสดงescape, owner-onlyQR/mail, passwordhash, Origin/bodylimits; NFR03:atomiczerooversell/replayexactly-once; NFR04:QRถอดรหัสตรงcodeจริงผ่านdecoder; NFR05:เพิ่มschemaแบบadditive/restartข้อมูลเก่าอยู่; NFR06:queueETAระบุประมาณ ไม่แสดงเป็นคำรับประกัน; NFR07:fixtures+controlledclockและsandboxชัดทั้งUI/eml

## Fixtures
fan / FanDemo!26 เป็นMember เลขENCORE-0001 activeถึง31ธ.ค.2570; สมัครใหม่เป็นGeneral; สมาชิก fan2 / FanTwo!26 เลขENCORE-0002 และ fan3 / FanThree!26 เลขENCORE-0003เพื่อทดลองคิว; adminencore/skyและgateคงเดิม
NEONเริ่มMemberตอนนาฬิกาบทเรียน10:00 จึงใช้fanทดลองได้ทันที งานอื่นใช้member5ชม.ก่อนgeneralตามตารางsaleเดิม ดูTEST-DATA.md

## Acceptance Gate
P1ผ่านทั้งหมด รวม>=95%; มีtraceFR/BR/NFR→tests; มีภาพmembershipvalid/invalid, queue, contactform, methods, E-ticketQR, sandboxmail และทดสอบ2ใบ/15:00/Memberไม่ใช่Member พร้อมผลรันจริง
เก็บreferencesต้นทาง+ภาพในrepo; ข้อเสนอ[A]ไม่ใช่กฎของเว็บไซต์อ้างอิง; การเชื่อมexternalpayment/emailเป็นงานรุ่นถัดไปตามคำตอบผู้ใช้

## UI refinement ตามคำขอผู้ใช้
ธีมพื้นขาว/เทาอ่อน สีเน้นฟ้านุ่ม โปสเตอร์พาสเทล สถานะเขียว/เหลือง/แดงที่อ่านได้ แยกบัญชีทดลองMember/Generalให้เลือกในหน้าlogin แต่เส้นทางซื้อดำเนินต่อเนื่องเหมือนระบบใช้งานจริง ไม่มีsuccessinterstitialหลังMembership
บัญชีGeneralทดลอง: general / GeneralDemo!26 ไม่มีmembership; บัญชีMemberfanคงเดิม ข้อมูลรอบในGETeventsคำนวณตามaccount ไม่ใช้เพียงซ่อนปุ่มฝั่งclient การพยายามGeneralเข้าMemberที่APIยัง403ข้อความเดิม
