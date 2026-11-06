# ใบสั่งพัฒนาระบบ ENCORE

เอกสารกำหนดงานพัฒนา สัญญาการเชื่อมต่อ และเกณฑ์ตรวจรับ สำหรับผู้พัฒนาที่ไม่มีบริบทแชต ใช้ร่วมกับข้อกำหนดและแบบระบบในโครงการนี้
ต้นฉบับการบ้าน: Teaching_CWN2026 บท 04 LAB 5–6 ปรับสปาเป็นการจองบัตรคอนเสิร์ต ข้ามเฉพาะ LAB 0

## ช่วง A — หัวหน้ากำหนดสัญญากลางก่อนแบ่งงาน
1. อ่าน REQUIREMENTS.md, USER-STORIES.md, TEST-DATA.md, DESIGN.md ตามลำดับ ยึดข้อกำหนดผู้ใช้ [U] ก่อนสมมติฐาน [A] และภาพอ้างอิง [R] ห้ามใช้ค่าจากหน้าจอเป็น oracle
2. ใช้ Node >=22.13, SQLite WAL, HTML/CSS/JS และ Docker Compose ตามสถาปัตยกรรมโครงการ ไม่เปลี่ยนเป็น PostgreSQL/สอง container เพียงเพื่อให้เหมือนตัวอย่างสปา อธิบาย adaptation ใน DESIGN และ db/README
3. สร้างฐานข้อมูลแบบ additive ใน web/store.mjs รักษาข้อมูล users/orders/tickets และค่าที่เป็น NULL ตามจริง db/schema.sql เป็น snapshot ไม่ใช่สคริปต์ล้างข้อมูล
4. กำหนด API ทุกเส้นใน web/API-CONTRACT.md: method/path/body/response/error/owner guard และช่วงเวลาที่อนุญาตก่อนให้ทีมเขียนหน้าเว็บ
5. ใช้ UTC เก็บเวลา แสดง Asia/Bangkok มีนาฬิกาเดียวและ TEST_MODE ล็อกเวลาได้ ไม่ใช้เวลาเครื่องผู้ทดสอบเป็นกติกา
6. Design system พื้นขาว/เทา ฟ้านุ่ม responsive375px เคารพ reduced-motion มี labels/keyboard/error เนื้อหาไทยตรงไปตรงมา
7. ทุกปุ่ม/ช่อง/ผลสำคัญต้องเลือกได้ด้วย label หรือ data-testid คงที่ มี html data-ready และ data-bug-mode; ไม่ให้ test ลอกค่าที่เห็นมาเป็น expected
8. แบ่งเจ้าของไฟล์ตามตารางด้านล่าง ห้ามแก้ไฟล์ของคนอื่น ถ้าสัญญาขาดให้จด web/CONTRACT-NOTES/<ชื่อ>.md หัวหน้าตัดสินจุดต่อ

| เจ้าของ | ไฟล์/ขอบเขต | กฎหลัก |
| --- | --- | --- |
| หัวหน้า | store.mjs, server.mjs, API-CONTRACT, schema, layout, test fixture | FR17–18, NFR02/03/05/07 |
| API-Sales | sales.mjs และ domain: queue/reserve/quote | FR02–10, BR02–12 |
| API-Delivery | delivery.mjs และ domain: pay/refund/scan | FR11–17, BR13–19 |
| UI-Buyer | public/app.js, public/index.html ขั้นเลือก/คิว/สมาชิก/ซื้อ | FR01–15, NFR01/06 |
| UI-Staff | หน้าบัตร/ผู้จัด/ตรวจบัตรใน branch หรือ patch แยกที่หัวหน้ารวม | FR13/16/17 |
| QA-UI / QA-API | ตรวจ UI และ API แยกกัน ใช้โลกทดสอบของตัวเอง | NFR01–07 |

## ช่วง B — ทีมพัฒนาทำงานขนานตามไฟล์ที่รับผิดชอบ
9. ใช้พร้อมกันไม่เกินจำนวน agent slots ที่มีจริง แบ่งเป็น waves และบันทึกเวลา/เจ้าของ ห้ามอ้างว่าทำพร้อมกันทั้งหมดถ้ารันเป็นรอบ
10. Agent ไม่สั่ง Docker ไม่เปลี่ยนไฟล์กลาง ไม่เลือก/อ่านเฉลย BUG_MODE และไม่ reset ระบบร่วมกัน ใช้สัญญา API เดียวกัน
11. Authentication: username3–32 normalize lowercase/password10–128 รองรับ email เดิม สมัครใหม่เป็น General เท่านั้น ห้าม client กำหนด role/member
12. Catalog:12งาน แบ่ง6ต่อหน้า ค้นหาข้ามหน้า; ผู้เยี่ยมชมเห็นสองรอบ Memberเห็นรอบสมาชิก Generalเห็นรอบทั่วไป ทั้งตารางเวลา สถานะ และปุ่มต้องมาจาก server
13. NEON Member6พ.ย.2569 10:00–ก่อน15:00 Generalเริ่ม15:00; ห้องรอเปิด15นาทีก่อนรอบ; ห้าม admin ข้าม schedule
14. Queue:FIFO active2ต่อevent/round หมายเลขคงเดิม คนก่อนหน้า ETAระบุประมาณ อายุสิทธิ์900sไม่เกินปิดรอบ และพาไปขั้นถัดไปอัตโนมัติ
15. Member:ตรวจสมาชิก active/หมดอายุ และหมายเลขเป็นของบัญชีหลังถึงคิวเท่านั้น ถูกแล้วเข้าผังทันที ไม่แสดง success หรือปุ่มเข้าผังซ้ำ grantต้องตรวจซ้ำในAPIผัง/hold
16. Generalเข้าMemberต้องถูกปฏิเสธที่server ข้อความAPIเดิม “ไม่ใช่สมาชิกMember” ส่วนUIอธิบายเป็นภาษาไทยธรรมดา
17. ที่นั่ง A01–D12:VIP A/B3200, Regular C/D1800; เลือกไม่ซ้ำ ทั้งbasketต้องสำเร็จหรือปฏิเสธทั้งหมด มี transaction ป้องกันขายเกิน
18. Memberซื้อสะสมสูงสุด2ใบ/account/event/round; Generalรวมทุกroundสูงสุด4; refund_pendingยังนับโควตา เปิดหลายแท็บข้ามไม่ได้
19. Hold600sไม่เกินปิดรอบ หนึ่งactivebasket/account; เปลี่ยนที่นั่งล้มเหลวเก็บholdเดิม; ปิด/ย้อนกลับปล่อยที่นั่ง; pendingห้ามเปลี่ยนหรือปล่อย
20. Buyerและholderทุกใบต้องมีชื่อ-นามสกุล/email/phoneครบ จำนวนและseatตรงกัน; ข้อมูลเป็นsnapshotแก้ได้ก่อนpendingเท่านั้น ใช้ข้อมูลผู้ซื้อซ้ำกับทุกใบได้
21. คำนวณ server canonical:STAGE10=floor10%ราคาบัตร max500; fee30/ใบ; VATround7%fee; total=subtotal-discount+fee+vat มี allocationรายใบตรวจยอดรวม
22. ตรวจตัวอย่างอิสระ:Regular1832; Regular+code1652;2Regular+code3304;2VIP+code5964;VIP+Regular+code4564 ห้ามเปลี่ยนexpectedตามUI
23. รองรับ QR/7-Eleven/CreditCard/Alipay แบบทดลอง มีreference/deadline/instructions ไม่รับPAN/CVVหรือเงินจริง QRชำระไม่ใช่PromptPayจริง
24. pendingไม่ออกบัตร; failed retryเป็นattemptใหม่; callbackซ้ำสร้างorder/tickets/mailชุดเดียว; paidAt<expiry และarrivedAt<expiry+120sเท่านั้นที่ยืนยันได้
25. เงินช้าหรือที่นั่งถูกขายใหม่แล้ว auto-refund ไม่แย่งที่นั่งกลับ ไม่ออกตั๋วหรือemail
26. Successสร้างorder/ticketรายใบพร้อมชื่อ และoutboxในtransactionเดียว QRเป็นrandom256bitไม่เก็บPII ถอดได้ด้วยdecoderอิสระ
27. บัตร/QR/payment/mail/EMLเฉพาะเจ้าของ อีเมลถึงbuyer.emailรวมทุกใบ มีinlinePNGในEML แสดงในกล่องทดลอง ไม่ส่งSMTPจริง
28. คงระบบคืนเงินบางใบก่อน72h ไม่รวมfee/VAT; ยกเลิกงานสร้างคืนเต็มยอด; ผู้จัดเฉพาะงานตนอนุมัติ/ปฏิเสธได้ คำขอซ้ำไม่คืนเงินซ้ำ
29. Scannerเฉพาะงานและช่วงประตูที่รับผิดชอบ บัตรvalidใช้ครั้งเดียว คืน/รอคืน/ใช้แล้ว/งานยกเลิกเข้าไม่ได้ แสดงชื่อผู้ถือถูกต้อง
30. ผู้จัดพัก/เปิด/ยกเลิกงาน ระงับเฉพาะที่นั่งว่าง ดูยอดและaudit; คงเลขที่นั่งหลังระงับเพื่อกดเปิดกลับได้
31. ภาพในreferencesเป็นของต้นทางใช้ประกอบการวิเคราะห์ ห้ามใส่เป็นposterหรือบัตรที่ระบบเราออก เก็บURL/วันที่/hashและแยกจากภาพผลทดสอบ

## ช่วง C — หัวหน้ารวม ตรวจ และเตรียมการพิสูจน์
32. รวมpatchและCONTRACT-NOTES ตรวจ FR01–18, BR01–20, NFR01–07 ครบ; SPECแยกสิ่งที่ผู้สร้างอ้าง[A]จากข้อกำหนด[D/U] และASSETSมีที่มา
33. หัวหน้าเลือกบั๊กฝึก3ตัวเท่านั้น:เงิน1 การจอง1 สถานะหลังทำรายการ1 เปิดด้วยBUG_MODE=1 เฉพาะTEST_MODEพร้อมDBแยก ค่าเริ่มต้น0 ต้องไม่กระทบเว็บผู้ใช้
34. เฉลยอยู่web/BUGS.mdเท่านั้น ผู้สำรวจ/writer/reviewerห้ามอ่านก่อนจบรอบฝังบั๊ก ห้ามบอกบั๊กในแชตหรือSPECก่อนทดสอบ
35. ให้QA-UIตรวจ375px/desktopด้วยbrowserจริง และQA-APIยิงAPIค่าขอบพร้อมกันคนละDB หัวหน้ารวมข้อพบแล้วแก้จุดต่อ
36. เปิดDockerด้วยproject/portทดสอบเฉพาะ รอhealth ตรวจuidและtesttoolsปิด ห้ามstopหรือล้างvolumeของเว็บที่ผู้ใช้เล่นอยู่
37. ทดสอบการปรับschemaจากฐานข้อมูลที่มีข้อมูลอยู่ restartและrecreatecontainerแล้วข้อมูลเดิมอยู่; QRใช้jsQRถอดจริงไม่ให้generatorตรวจตัวเอง
38. LAB7–9:ฟังDจากrequirements ฟังAจากSPEC reconOไม่ทำรายการ แล้วแบ่งcharter6+closing แยกโลกแต่ละagent เก็บบันทึกดิบ รวมA–F และให้riskjudgeคนใหม่จัดระดับจากB–C
39. LAB10–11:writerแบ่งหัวข้อ แผน8ส่วน การ์ด12ช่องและtraceทุกBR; reviewerต้องไม่ใช่writerและคิดเงินเอง บันทึกก่อน/หลังแก้
40. LAB12:Playwrightขนาน3workers แต่ละworkerมีserver/DB/clockของตน เก็บnormalผลดิบ screenshot GIFที่มาจากvideoจริง รายงานe2e/index.htmlคลิกย้อนหลักฐานได้
41. LAB13:freezeแผน/test/hashก่อน เปิดbugmode1เฉพาะระบบแยก รันชุดเดิมไม่แก้expected เทียบnormal/bugทุกID triageแยกเว็บผิด/testผิด/กฎกำกวม แล้วค่อยเปิดเฉลย
42. จบงานปิดเฉพาะserversทดสอบและกลับโหมดปกติ ตรวจhtmlmarker0 เก็บรายงานข้อจำกัดและไฟล์ไว้ในrepo ไม่อ้างว่าprovider/SMTP/โหลดสูง/ทุกbrowserถูกทดสอบแล้ว

## Trace ของใบสั่ง
| ขั้น | ข้อกำหนด |
| --- | --- |
| 1–10,31–42 | FR18; NFR01–07; เอกสาร/ภาพและความเป็นอิสระของผู้ตรวจ |
| 11 | FR01; BR01/20 |
| 12–16 | FR02–06; BR02–07 |
| 17–20 | FR07–10; BR08–11/19 |
| 21–22 | FR10; BR12 |
| 23–27 | FR11–15; BR13–18 |
| 28–30 | FR16–17; BR08/17/20 |
