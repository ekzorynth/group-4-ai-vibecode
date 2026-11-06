# ENCORE V2 — ข้อกำหนดระบบจองบัตรคอนเสิร์ตฉบับขยาย

รุ่นเอกสาร: 2.0 · วันที่ 6 พฤศจิกายน 2569 · เป้าหมาย: ระบบฝึกเรียนที่ทำงานครบวงจรบนเครื่อง

## 1. เป้าหมายและที่มา

เพิ่มความลึกจากการจองแบบguest เป็นสมาชิก การรอคิว สิทธิ์ซื้อหลายรอบ การชำระแบบไม่รู้ผลทันที คืนเงินรายใบ ตรวจบัตรหน้างาน และหลังบ้านที่จำกัดงานของผู้จัด
[P] = ข้อเสนอของผู้วิเคราะห์ตามคำขอให้เพิ่มความลึก ใช้เป็นspecในการพัฒนารอบนี้ ไม่ใช่คำตอบจากการสัมภาษณ์จริงหรือข้อกฎหมาย [D1] = โจทย์จำลองV1ในinterview/OWNER-ANSWERS.md
V2มีผลแทนV1ในเรื่องguest checkout, limitต่อบัญชี, รอบขาย, payment pending และคืนเงิน เอกสารV1และผล23ข้อเดิมเก็บในarchive/v1/ ไม่นำมาอ้างว่าเป็นผลV2

## 2. ขอบเขตและการแบ่งรุ่น

รอบนี้ต้องทำFR01–FR25ทั้งหมด พร้อมUIและAPI ใช้Node/SQLite, ฐานข้อมูลV2แยกจากV1 การชำระ/แจ้งเตือน/คืนเงินเป็นตัวจำลองบนเครื่องเท่านั้น ไม่มีการต่อgatewayหรือส่งข้อความออกนอกระบบ
ไม่รวมบัตรยืน, ขายต่อ/โอนบัตร, แฟนคลับAPIภายนอก, สร้างงานใหม่จากหน้าเว็บ, เครื่องสแกนกล้องจริง, คิวหลายหมื่นคน, emailจริง, ลืมรหัสผ่านผ่านemail, OAuth และการโฮสต์ออนไลน์
สร้างงานและผังด้วยfixtureที่ตรวจซ้ำได้ ผู้จัดแก้สถานะ/รอบขายและระงับที่นั่งได้ ไม่เพิ่ม/ลบผังหลังเริ่มขาย

## 3. ผู้ใช้และสิทธิ์ [P]

| บทบาท | สิ่งที่ทำได้ | สิ่งที่ห้าม |
|---|---|---|
| ผู้เยี่ยมชม | ดู/ค้นคอนเสิร์ต ผัง ราคา | ถือที่นั่ง จ่าย อ่านบัตร |
| สมาชิก buyer | เข้าคิว จอง จ่าย ดูประวัติ/notification ขอคืนบัตรของตน | อ่านหรือเปลี่ยนรายการผู้อื่น |
| ผู้จัด organizer | ดูยอด/รายการ/คืนเงิน/รอบขาย/ที่นั่งเฉพาะงานที่ตนเป็นเจ้าของ | จัดการงานของผู้อื่น สแกนแทนเจ้าหน้าที่ |
| เจ้าหน้าที่ scanner | ตรวจรหัสบัตรและใช้สิทธิ์เข้างานเฉพาะงานที่ได้รับมอบหมาย | ดูรายได้/เปลี่ยนราคา/คืนเงิน |

User journeys: UJ01 สมัคร→เข้าคิว→จอง→จ่าย→บัตร; UJ02 pending→ตรวจผล→สำเร็จ/หมดเวลา; UJ03 ขอคืนบางใบ→ผู้จัดอนุมัติ→คืนเงิน→เปิดที่นั่ง; UJ04 scannerตรวจ→เข้าได้ครั้งเดียว; UJ05 ผู้จัดดูยอด→เปลี่ยนรอบ/หยุดขาย→อ่านaudit

## 4. Functional requirements

ทุกข้อมีที่มา[P] เว้นแต่ระบุ[D1] เป็นMustสำหรับV2 รหัสV2-FRป้องกันสับสนกับFRของรุ่นเดิม

| ID | ความสามารถ | เกณฑ์ยอมรับหลัก | Journey |
|---|---|---|---|
| V2-FR01 | สมัครสมาชิก | emailไม่ซ้ำแบบไม่สนตัวเล็กใหญ่; name1–80; password10–128; ไม่รับroleจากclient | UJ01 |
| V2-FR02 | เข้าสู่/ออกระบบและsession | loginออกcookieใหม่; logoutเพิกถอนtoken; sessionหมดอายุ24ชม.; loginผิด5ครั้งใน15นาทีล็อก15นาที | UJ01 |
| V2-FR03 | บัตรข้ามอุปกรณ์ | loginบัญชีเดิมbrowserใหม่เห็นorderเดิม; browserอื่นไม่loginไม่ได้ข้อมูล | UJ01 |
| V2-FR04 | รายการ/ค้นหา/กรองงาน | เห็นวันเวลา สถานที่ รอบขาย ราคา และavailable/upcoming/soldout/paused/cancelled; รายการหน้าละ6งาน มีเลขหน้า/ก่อนหน้า/ถัดไป แสดงช่วงผลลัพธ์; ค้นหา/กรองก่อนแบ่งหน้าและเปลี่ยนแล้วกลับหน้า1 | UJ01 |
| V2-FR05 | คิวFIFO | joinซ้ำได้คิวเดิม; activeไม่เกิน2บัญชี/งาน; รอแสดงposition; refreshไม่แซง; ออกคิวคืนช่อง | UJ01 |
| V2-FR06 | สิทธิ์ตามรอบ | รอบpublicซื้อได้ทุกmember; รอบpresaleเฉพาะmemberที่มีentitlement; ตรวจใหม่ตอนhold; ส่งroundปลอมข้ามไม่ได้ | UJ01 |
| V2-FR07 | ผังแบบมีสถานะ | available/held/sold/blocked; แยกVIP/Regular; เลือก1–4ไม่ซ้ำ; conflictล้มทั้งชุด | UJ01 |
| V2-FR08 | ถือที่นั่งแบบatomic | ไม่ขายซ้ำเมื่อแข่งกัน; บัญชีเดียวมีholdเดียวทั้งระบบ; คืนตะกร้าเก่าเมื่อใหม่สำเร็จ | UJ01 |
| V2-FR09 | โควตาต่อบัญชีต่องาน | paidที่ไม่คืน+held+pendingรวมไม่เกิน4; เปิดหลายแท็บไม่เพิ่มสิทธิ์ | UJ01 |
| V2-FR10 | ราคา/ส่วนลด | สูตรD1คงเดิมเป็นบาทเต็ม; STAGE10ครั้งเดียวต่อorder; snapshotราคาคงเดิมหลังhold | UJ01 |
| V2-FR11 | กู้รายการกำลังจอง | reload/loginบัญชีเดิมเห็นholdและเวลาที่เหลือ; เวลาserverเป็นหลัก | UJ02 |
| V2-FR12 | ชำระจำลอง | approved/declined/pending; ปฏิเสธไม่ออกบัตร; ไม่เรียกเงินจริง; ห้ามclientเลือกยอดเอง | UJ02 |
| V2-FR13 | ยืนยันผลชำระซ้ำได้ปลอดภัย | active paymentหนึ่งตัวต่อhold; callbackซ้ำคืนorderเดิม; callbackยอดไม่ตรงไม่ออกบัตร | UJ02 |
| V2-FR14 | เงินเข้าช้าหรือผลไม่แน่ชัด | pendingกันที่ถึงexpires+120s; สำเร็จตรงเวลาภายในgraceออกบัตร; ช้า/ที่ปล่อยไปแล้วบันทึกคืนอัตโนมัติ ไม่แย่งที่คืน | UJ02 |
| V2-FR15 | ออกบัตรรายใบ | แต่ละที่มีticketId+รหัสสุ่มอิสระ; orderเดียวมีหลายบัตร; ไม่ใช้orderIdเป็นสิทธิ์เข้า | UJ01 |
| V2-FR16 | ประวัติ/แจ้งเตือน | แสดงorder เงิน paymentสถานะและticket; notificationเมื่อจ่ายสำเร็จ/ขอคืน/คืนสำเร็จ; อ่านได้เฉพาะเจ้าของ | UJ01/03 |
| V2-FR17 | ขอคืนบางใบ | เลือกticketของตนที่ยังvalid; ตรวจcutoff72ชม.; แสดงยอดคาดคืนก่อนยืนยัน; ไม่คืนซ้ำ | UJ03 |
| V2-FR18 | พิจารณาคืนเงิน | organizerรับ/ปฏิเสธ; approvedมีrefundledger; คืนที่และโควตาเมื่อsuccess; rejectedกลับvalid | UJ03 |
| V2-FR19 | งานยกเลิก | ผู้จัดยกเลิกงาน; หยุดhold/จ่าย; คืนhold; ticketยังไม่usedเข้าสู่refund pendingคืนเต็มยอดรวมfee/VAT; ไม่คืนซ้ำ | UJ03 |
| V2-FR20 | ตรวจและใช้บัตร | scannerที่ถูกงานกรอกรหัส; ใช้ได้start−2h ถึงstart+4h; สแกนซ้ำหรือrefunding/refundedเข้าไม่ได้; แข่งสแกนสำเร็จหนึ่งราย | UJ04 |
| V2-FR21 | หลังบ้านรายได้ | แยกยอดรับแล้ว ยอดคืนแล้ว สุทธิ จำนวนบัตรvalid/used/refund_pending/refunded; ไม่รวมdeclined/pendingเป็นรายได้ | UJ05 |
| V2-FR22 | ควบคุมการขาย | ownerหยุด/เปิดขาย เปลี่ยนรอบpublic/presale; pauseห้ามholdใหม่แต่holdเดิมยังจ่ายได้; cancelledห้ามจ่าย | UJ05 |
| V2-FR23 | ระงับที่นั่ง | ownerblock/unblockได้เฉพาะที่ว่าง; held/soldห้ามblock; ไม่เปลี่ยนมูลค่าorderเดิม | UJ05 |
| V2-FR24 | ประวัติการเปลี่ยนแปลง | auditบันทึกactor/action/target/timeผลสำเร็จของadmin,refund,scan; ไม่เก็บpassword/tokenบัตรในlog | UJ03/04/05 |
| V2-FR25 | เครื่องมือทดสอบแยก | reset/clock/simulate-callbackเปิดเฉพาะTEST_MODEพร้อมtoken; ไม่อยู่UIปกติ; แยกDB/pอร์ตจากเว็บผู้เรียน | ทุกjourney |

## 5. Business rules และค่าขอบ

| ID | กฎที่ใช้ตัดสิน | ขอบ/ผลคาดหวัง |
|---|---|---|
| V2-BR01 | emailtrim/lowercase, รูปแบบมี@และโดเมน; ยาว<=254; nametrim1–80; password10–128 | password9ไม่ผ่าน/10ผ่าน/129ไม่ผ่าน; roleที่ส่งเพิ่มไม่ทำให้เป็นadmin |
| V2-BR02 | session24h ไม่ขยายเมื่อrefresh; logoutลบทันที | ก่อนหมด1msผ่าน/ตรงหมดไม่ผ่าน |
| V2-BR03 | loginผิด5ครั้งในrolling15min -> blocked15min ตั้งแต่ครั้งที่5; accountและIPใช้counterแยกกัน | ครั้ง4ยังลองได้/ครั้ง5ล็อก; ตรงblockedUntilลองได้; ข้อความไม่เผยว่ามีaccountไหม |
| V2-BR04 | FIFOต่อevent, activeสูงสุด2, สิทธิ์อยู่900s; ออกจากคิวไม่ยกเลิกholdที่ได้แล้ว | join3คน -> active2/waiting1; tokenตรงexpiryหมด; refreshรักษาลำดับ |
| V2-BR05 | ทุกholdต้องมีactive queueของบัญชีและevent; presaleต้องentitled | เปลี่ยนevent/account/roundในrequestไม่ข้ามสิทธิ์ |
| V2-BR06 | เปิดขายเมื่อsale_start<=now<sale_end; pauseห้ามholdใหม่; ยกเลิกห้ามholdและpay | ก่อนเปิด1msไม่ได้/ตรงเปิดได้/ตรงปิดไม่ได้ |
| V2-BR07 | เลือก1–4ที่ไม่ซ้ำ; account event quota4 รวมที่จ่ายแล้ว+held/pending | ซื้อไป3ถือเพิ่ม1ได้/2ไม่ได้; refundedคืนโควตา; refund_pendingยังนับ |
| V2-BR08 | seatหนึ่งมีเจ้าของliveได้หนึ่งราย; conflictหนึ่งที่ล้มทั้งชุด | แข่งที่A01หลายคำขอสำเร็จหนึ่ง; ชุดมีA03soldไม่ถือA01ไปบางส่วน |
| V2-BR09 | hold600s, หนึ่งบัญชีหนึ่งactive basket; reselectเป็นatomic replaceยกเว้นpendingต้องรอผล | 599.999sจ่ายได้/600sเริ่มจ่ายใหม่ไม่ได้; reloadไม่เริ่มเวลาใหม่ |
| V2-BR10 | VIP3200, Regular1800; STAGE10=floor(subtotal×.1)สูงสุด500; fee30/ใบ; VAT=round(fee×.07)บาทเต็ม | Regular1832; Regular+โค้ด1652; VIP2+โค้ด5964; ผสม2+โค้ด4564 |
| V2-BR11 | snapshotpriceที่holdสร้าง; คิดฝั่งserver ไม่รับtotalจากclient; ไม่มีส่วนลดซ้อน | ส่งtotal1ยังคิด1832; FAKEปฏิเสธทั้งhold |
| V2-BR12 | ส่วนลดรายใบแบ่งตามสัดส่วนราคา: floorก่อน แล้วแจกเศษบาทตามfractionมากก่อน/idน้อยก่อน; VATแบ่งเท่าๆกันแบบเดียวกัน | A01+C01ลด500 -> A01ลด320,C01ลด180; sumรายใบตรงorderทุกบาท |
| V2-BR13 | approvedก่อนexpiry -> orderหนึ่งชุด; declinedกลับheldถ้ายังไม่หมด; pendingไม่ให้สร้างintentใหม่ | declinedแล้วretryสร้างpaymentIdใหม่; retryคำขอผลสำเร็จได้เลขเดิม; ไม่ออกบัตรเมื่อยอดcallbackไม่ตรง |
| V2-BR14 | pendingล็อกถึงhold.expires+120s; accept successเฉพาะpaidAt<expires, arrivedAt<expires+120s และยังownseats | paidAtตรงexpiresต้องคืน; callbackตรงgraceEndต้องคืน; หลังปล่อยที่ต้องไม่ออกบัตร |
| V2-BR15 | callbackเป็นเหตุการณ์terminalแรกของpayment; duplicateignored; failedแล้วsuccessภายหลังไม่เปลี่ยนผล; unknowneventปฏิเสธ | 2callbackพร้อมกันออกorderเดียว; late-successบันทึกrefundหนึ่งรายการยอดเต็ม |
| V2-BR16 | บัตร1ใบต่อ1ที่; รหัสสุ่ม>=128bit; validเท่านั้นใช้เข้างานได้ | เดารหัสorderไม่ใช่บัตร; duplicate scanสำเร็จครั้งเดียว |
| V2-BR17 | voluntaryrefundขอได้เมื่อnow<=start−72h และticketvalid; คืนเฉพาะticketprice−allocatedDiscount ไม่คืนfee/VAT | ก่อน/ตรงcutoffรับ; เกิน1msปฏิเสธ; used/pending/refundedปฏิเสธ |
| V2-BR18 | requestrefundทำให้ticketrefund_pendingทันที; approvedคืนเงินจำลองสำเร็จแล้วเป็นrefunded/เปิดseat; rejectedกลับvalid | refund/scanแข่งกันผลสำเร็จเพียงทางเดียว; requestซ้ำไม่สร้างยอดคืนเพิ่ม |
| V2-BR19 | cancelledคืนเต็มticketnet+fee+allocatedVATสำหรับticketยังไม่used; refundที่จ่ายไปแล้วไม่คืนซ้ำ | orderRegular1ไม่มีโค้ดคืนเต็ม1832; voluntaryคืน1800; cancelledซ้ำผลเดิม |
| V2-BR20 | check-inช่วงstart−2h<=now<start+4h; scannerเฉพาะeventassigned | ตรงเปิดเข้าได้/ตรงปิดไม่ได้; wrongevent403; used409 |
| V2-BR21 | ownerเฉพาะeventของตน; buyer/scannerไม่มีadminสิทธิ์ | เปลี่ยนURLไปeventอื่น403; ไม่เผยemailผู้ซื้อในdashboardทั่วไป |
| V2-BR22 | blockที่ว่างได้; blockheld/sold409; unblockคืนavailable | หยุดขายไม่ปล่อยhold; cancelledปล่อยholdและยกเลิกpending |
| V2-BR23 | รายรับรวม=orderconfirmed.total; คืนรวม=refundsuccess.amount; net=รายรับ−คืน; pendingไม่นับ | ซื้อ1832คืน1800 -> net32; auto-refundlateไม่นับทั้งรายรับ/คืนของorderเพราะไม่เคยออกorder |
| V2-BR24 | auditเขียนพร้อมธุรกรรม; timestampUTC แสดงAsia/Bangkok; สำเร็จlogครั้งเดียว | approve/scan/cancelซ้ำไม่มีlogความสำเร็จเพิ่ม |

นโยบายทั้งหมดเป็นกฎจำลองเพื่อพัฒนา ไม่ใช่นโยบายภาษี/คืนเงินของธุรกิจจริง

## 6. สถานะและความสอดคล้อง

- Queue: waiting → active → left/expired; joinใหม่หลังหมดได้ลำดับท้าย
- Hold: held → payment_pending → paid/expired/cancelled; declinedกลับheldถ้าทันเวลา; heldปิดdialogคืนได้; pendingปิดdialogไม่releaseจนทราบผล
- Payment: pending → succeeded/failed/timed_out/auto_refunded; succeededเป็นterminal ห้ามcallbackช้าdowngrade
- Ticket: valid → used หรือ refund_pending → refunded/valid(ปฏิเสธ); ห้ามused→refund
- Refund: requested → succeeded/rejected; duplicate approveต้องไม่จ่ายซ้ำ
- Event: on_sale ↔ paused → cancelled; cancelledเป็นterminal
ทุกคำขออ่านผัง/เขียนจะexpirehold/queueก่อน คำขอชำระ สแกน คืนเงิน และreserveต้องตรวจสถานะในtransactionเดียวกับการเปลี่ยน ห้ามเชื่อสีที่นั่ง/นาฬิกา/ยอดเงินฝั่งclient

## 7. NFR ที่วัดได้ [P]

| ID | ข้อกำหนด/วิธีตรวจ | เกณฑ์ |
|---|---|---|
| V2-NFR01 | หน้าหลัก/สมาชิก/ผัง/บัตร/หลังบ้าน375px | scrollWidth<=clientWidth และใช้primaryactionได้ |
| V2-NFR02 | keyboardและfeedback | dialogมีชื่อ; Tab/Space/Escapeใช้ได้; error role=alert; ไม่ใช้สีอย่างเดียว |
| V2-NFR03 | password/session | salted scrypt; ไม่มีplaintext DB/response/log; cookieHttpOnly/SameSite; session tokenสุ่ม>=256bit |
| V2-NFR04 | authorizationทุกresource | ownerother/buyer/scannerไม่ข้ามสิทธิ์; ตรวจในAPIไม่ใช่แค่ซ่อนปุ่ม |
| V2-NFR05 | zerooversell/idempotency | 10buyerแข่งที่เดียวออกได้หนึ่งhold; 2scan/2callback/refundapproveซ้ำมีผลครั้งเดียว |
| V2-NFR06 | monetaryconsistency | บาทเต็มทุกfield; sumticketalloc=order; refundไม่เกินpaid; ไม่รับเงินจากclient |
| V2-NFR07 | testability | clockควบคุมค่าขอบms; resetแยกDB; callbackจำลองควบคุมpaidAt/amountได้เฉพาะtest |
| V2-NFR08 | durability | restartไฟล์DBเดิมยังมีบัญชี/order/audit; transactionrollbackไม่ทิ้งhalf-order |
| V2-NFR09 | input/origin | rejectcross-originPOST; จำกัดbody16KB; email/nameแสดงescape; SQLparameterized |
| V2-NFR10 | localresponsiveness | รายงานlatencyจากhealth/catalog20ครั้งบนเครื่องนี้และระบุp95; เป้าหมายp95<500ms ไม่ใช่loadSLA |

## 8. ข้อมูล/หน้าจอและข้อตกลงสำคัญ

ข้อมูลหลัก: users, sessions, login_attempts, events, rounds(entitlement), queues, holds, seats, payments, orders, tickets, refunds, notifications, audit
หน้าจอ: catalog, auth, queue, booking+payment, accountactivehold, tickets+refund, inbox, organizerdashboard+refunds+inventory+audit, scanner
แคตตาล็อกขยายเป็น12งาน: available6/upcoming4/soldout2 ณเวลาเริ่มบทเรียน ทุกงานมี48ที่นั่ง ดูรายชื่อในTEST-DATA; เพิ่มงานแบบadd-onlyเมื่อเริ่มserver รักษาordersและสถานะขายเดิม
fixture: neonเปิดpublic; sunsetยังไม่ถึงsale_startและเป็นpresale; orbitขายหมด ENCORE: neon, orbit, aurora, rock, citypop, acoustic, midnight (7 งาน); SKY: sunset, jazz, kpop, hiphop, folk (5 งาน) scannergateดูneon

## 9. Acceptance scenariosที่ต้องมีหลักฐาน

A01 signupduplicate/passwordboundary; A02 login/logout/sessionexpiry/lockout; A03 anonymousprotected; A04 ordercross-device/isolation; A05 catalog/filter; A06 queueFIFO/rejoin/expiry; A07 holdwithoutqueue; A08 presaleallow/deny; A09 accountquota; A10 seatconflict10buyer; A11 all-or-nothing; A12 hold600s/recovery; A13 price/couponallocation; A14 tamperedtotal; A15 declinedretry/idempotency; A16 pendingtimelycallback; A17 latecallbackgraceandreleased; A18 callbackwrongamount/duplicate; A19 partialrefund/approve/reject/cutoff; A20 refundscanrace; A21 cancel/fullrefund/idempotent; A22 scannerwindow/wrongrole/duplicate; A23 organizerisolation/pause/block; A24 dashboardreconciliation/audit; A25 notificationownership; A26 testgate/cross-origin; A27 mobile/keyboard; A28 restartdurability; A29 localp95

## 10. เกณฑ์ส่งมอบ

สร้างtraceabilityV2-FR/BR/NFR→testcase; ผ่านP1ทั้งหมดและรวม>=95%; หลักฐานต้องเป็นรอบV2 แยกplanned/implemented/testedตามจริง ถ้าแผนเปลี่ยนอัปเดตเอกสารก่อนอ้างว่าครบ
รายงานข้อจำกัด: ยังเป็นsingle-nodeSQLite simulator ไม่มีเงินจริง ไม่มีemailจริง ไม่มีexternalwebhook/ลายเซ็นproviderหรือทดสอบปริมาณproduction
