# บันทึกข้อบกพร่อง ENCORE

1. ต้องมีgrantหลังqueueก่อนเข้าผังรอบMember และตรวจซ้ำที่GETmap/POSThold ทดสอบA05–10
2. กฎเดิม4ใบต้องแยกMember2/Generalรวม4: นับบัตรต่อhold.roundและaccountในtransactionรวมrefund_pending ทดสอบA14/A43
3. เวลาholdเดิม600sอาจล่วงMember15:00: clampด้วยroundendและmemberexpiry ทดสอบA13/U10
4. Paymentสำเร็จต้องออกชื่อ/QRและemailพร้อมกัน: snapshotcontactก่อนpay, order/outboxUNIQUE ทดสอบA19–34
5. UItestรอบแรกเลือกปุ่มloginชื่อซ้ำระหว่างheader/form: แก้locatorให้เจาะsubmit ไม่เปลี่ยนexpectedธุรกิจ รอบสุดท้ายรันครบใหม่
6. QRทำให้ปุ่มขอคืนยืดสูงตามgrid: ปรับalign-items:start และตรวจภาพหน้าจอ
7. ข้อความvalidationในcontactformค้างหลังแก้: clearเมื่อinput แล้วvalidateใหม่ตอนsubmit; หน้าmobileยังใช้ได้และไม่ล้น
8. การปรับschemaต้องไม่แต่งชื่อย้อนหลัง: รายการที่holderNULLแสดงตามข้อมูลที่มี ไม่มีemailที่สร้างย้อนหลัง ทดสอบA41/A42

ข้อพบด้านบนตรวจพบระหว่างพัฒนา ส่วนการรัน BUG_MODE เป็นการวัดความสามารถของชุดทดสอบในการตรวจจับข้อบกพร่องแยกต่างหาก

## Latest account and membership UX refinement
- Successful membership validation opens the seat map immediately. Duplicate submissions are disabled, and a closed dialog is not reopened after a delayed response.
- The new General demo account required A13 to log in to the seeded account instead of registering the same username again.
- A44 and U15 verify account-specific schedules, statuses and round buttons. General still cannot enter Member endpoints directly.
- The light palette was inspected on desktop, account chooser, seat map and mobile checkout after all 59 tests passed.

## การทบทวน Acceptance Test เพิ่มเติม — 6 พฤศจิกายน 2569

เพิ่ม A45–A61 และ U16–U25 รวม 27 ข้อ และยกระดับ assertion ของ U22 ให้ตรวจประวัติผลจริงหลังระงับ/เปิดที่นั่ง แทนตรวจว่าปุ่มแสดงอยู่เฉย ๆ จึงพบว่า renderAdmin ล้างช่องเลขที่นั่งหลังสั่งระงับ ทำให้กดเปิดที่นั่งเดิมต่อแล้วส่งค่าว่าง แก้ให้คืนค่าเลขที่นั่งที่ทำรายการหลังโหลดข้อมูลใหม่ U22 ที่ตรวจทั้งสองผลผ่านแล้ว ผลชุดเต็มดู TEST-REPORT.md

กรณี A57 ในรอบแรกระบุผลคาดหวังของงานยังไม่เปิดเป็น 409 แต่ส่งคำขอโดยไม่เลือกรอบ ทำให้บัญชี General ไปตรวจ Member และได้ 403 ถูกต้องตามกฎ จึงแก้ข้อมูลทดสอบให้ระบุรอบ General อย่างชัดเจน ไม่มีการผ่อนเงื่อนไขสิทธิ์ในระบบเพื่อให้ทดสอบผ่าน

## LAB13 — รอบฝังบั๊กและผลที่จับได้จริง

Normal 89/89; Bug 78/89 ผ่านและ11ล้มใหม่;3/3บั๊กถูกจับ แผน/test/expectedเดียวกัน SHA256เหมือนกัน=true;UIconcurrencyจริงnormal3/bug3

ผลnormalอยู่e2e/report-normal ผลbugอยู่report-bug แยกกันก่อนเปรียบเทียบ ไม่แก้expectedหรือแผนให้โหมดbugผ่าน ผู้สำรวจ/writer/reviewerถูกสั่งไม่อ่านruntime/BUGSก่อนรัน;หัวหน้าผู้เลือกบั๊กย่อมรู้เฉลยตั้งแต่ต้น จึงไม่อ้างว่าหัวหน้าค้นพบแบบblind

### ส่วน1 บั๊กที่พบจากชุดเดียวกัน
|Seed|ระดับ/กฎ|ขั้นทำซ้ำ|คาดหวังD|ผลจริงbug|Testที่ล้ม|หลักฐาน|
|---|---|---|---|---|---|---|
|M1 เงิน|P1 BR12|Memberเลือก2VIP/STAGE10และยืนยันhold ไปcheckout|6400−500+60+4=5964|ลด640แทน500 ยอด5824|A17/L01|[normal](e2e/report-normal/gifs/V3-L01.gif) · [bugGIF](e2e/report-bug/gifs/V3-L01.gif) · [ภาพ](e2e/report-bug/screenshots/V3-L01.png)|
|M2 การจอง|P1 BR08|MemberเลือกC01/C02แล้วคลิกC03 และลองAPI/สะสมก่อนrefundapprove|เลือกสูงสุด2/สะสม2|เลือก3และAPIรับเกินสิทธิ์|A14/A15/U03/L02 และพบเพิ่มA04/A35|[normal](e2e/report-normal/gifs/V3-L02.gif) · [bugGIF](e2e/report-bug/gifs/V3-L02.gif) · [ภาพ](e2e/report-bug/screenshots/V3-L02.png)|
|M3 สถานะ|P1 FR16/BR17|สร้างticketและscancodeเดิม2ครั้งในเวลาประตู|ครั้งแรก200 ครั้ง2ต้อง409/ข้อความปฏิเสธตรง|200ทั้งสองครั้ง สถานะยังvalid|A36/U07/L03|[normal](e2e/report-normal/gifs/V3-L03.gif) · [bugGIF](e2e/report-bug/gifs/V3-L03.gif) · [ภาพ](e2e/report-bug/screenshots/V3-L03.png)|

สิ่งที่ทายไว้ก่อนรันอยู่TEST-PLANส่วน8 ทั้ง3แบบมีdetectorตามแผน พบA04และA35เป็นสัญญาณเพิ่มหลังรันของM2 ไม่อ้างว่าเป็นบั๊กแยกหรือทายไว้ก่อน รายละเอียดทุก11caseอยู่e2e/triage.json ทั้งหมดadjudicateเป็นwebsite-defect-controlled-seed ไม่มีnormal-failureหรือunknownค้าง

### ส่วน2 วิเคราะห์oracleจากเว็บจริงหลังปลดเฉลย
ทำpost-disclosure probeบน4393โลกแยก เก็บภาพ/ข้อมูลจริงใน [oracle-analysis](e2e/oracle-analysis/results.json) ไม่แก้testsที่freezeไว้และไม่นับเพิ่มใน89case

|Seed|ค่าจริงจากbugprobe|D/Rตรวจได้หรือไม่|ถ้าใช้SPEC[A]อย่างเดียว|ถ้าลอกOจากจังหวะผิดมาเป็นexpected|
|---|---|---|---|---|
|M1|฿5,824|ตรวจได้ เทียบ ฿5,964|ข้อมูลไม่พอ: SPECอ้างcanonicalสูตรเดิมและอ้างTEST-DATA แต่ไม่มีตัวเลขสูตรพอคำนวณ5964จากAล้วน|ไม่จับ เพราะexpectedถูกคัดเป็น฿5,824เท่าผลผิด|
|M2|3|ตรวจได้ เทียบ 2|ตรวจได้ในกรณีนี้ SPECอ้างquota2/4ชัด|ไม่จับ เพราะexpectedถูกคัดเป็น3เท่าผลผิด|
|M3|200|ตรวจได้ เทียบ 409|ตรวจได้ในกรณีนี้ SPECอ้างตรวจครั้งเดียว แปลงเป็นcontrolledrejectionตามA-testcontract|ไม่จับ เพราะexpectedถูกคัดเป็น200เท่าผลผิด|

D/Rตรวจ3/3;Aล้วนมีข้อมูลพอ2/3และไม่พอ1/3 ไม่อ้างว่าAผิดเสมอ เพราะSPECปัจจุบันบางกฎเขียนถูกจริง;Oที่คัดหลังเกิดบั๊กตรวจ0/3เป็นcounterfactualที่ประเมินกับค่าจริง ไม่ใช่การเปลี่ยนexpectedของการทดสอบหลัก

### ส่วน3 เทียบเฉลยและคืนสภาพ
หลังรอบทั้งคู่จบจึงเทียบกับweb/BUGS.mdต่อผู้ตรวจ ชื่อกฎ3ตัวตรงกับผลจริง ไม่มีบั๊กseedที่พลาดในชุดนี้ แต่ไม่ใช้3/3แทนmutationcoverageทั้งโปรแกรม
mode-isolation.jsonพิสูจน์TEST0/BUG0→0,TEST1/BUG1→1,TEST0/BUG1→0และไม่มีtokenเรียกtesttools403;Dockerfreshcontextmarker0;ทุกworkerถูกปิดหลังsuite;ปิดcharterinstancesและไม่เปิดbugบนเว็บผู้ใช้4310

ข้อจำกัดGIFแสดงช่วงแรกสูงสุด8วินาที ต้องดูภาพfinal/videoเต็ม/traceเมื่อจังหวะล้มอยู่นอกช่วง ไม่มีการส่งGitHubในรอบนี้ตามคำสั่งผู้ใช้
