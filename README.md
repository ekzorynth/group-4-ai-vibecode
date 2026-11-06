# ENCORE V3 — Member Sale / Named E-Ticket QR / Email Sandbox

พัฒนาตามUserStoryใหม่: Username→Event→Queue→Membershipก่อนผัง→ราคา/seat→ผู้ซื้อ+ผู้ถือรายใบ→4ช่องทางชำระ→E-TicketQR+ชื่อ→กล่องอีเมลทดลอง
[คู่มือใช้งาน](PLAYBOOK.md) · [Requirements](REQUIREMENTS.md) · [Stories](USER-STORIES.md) · [Referenceพร้อมภาพ](references/README.md) · [ผลทดสอบ](TEST-REPORT.md)

## เปิดระบบด้วย Docker Compose (แนะนำ)
ติดตั้งและเปิด Docker Desktop ก่อน จากโฟลเดอร์โปรเจกต์รัน:

```sh
docker compose up --build
```

เปิด **http://localhost:4310** เมื่อ `web` พร้อมใช้งาน ครั้งถัดไปใช้ `docker compose up` ได้เลย ไม่ต้องติดตั้ง Node.js หรือ npm บนเครื่อง
หากต้องการเปิดไว้เบื้องหลังและรอระบบพร้อม:

```sh
docker compose up -d --build --wait
docker compose ps
docker compose logs -f web
```

หยุดระบบด้วย `Ctrl+C` (โหมดหน้าจอ) หรือ `docker compose down` ข้อมูลสมาชิก คำสั่งซื้อ บัตร และอีเมลทดลองยังอยู่ใน named volume `encore-data` และกลับมาเมื่อเปิดใหม่
**`docker compose down --volumes` จะล้างข้อมูลของ Compose ชุดนี้** ใช้เฉพาะเมื่อต้องการเริ่มรอบใหม่จากข้อมูลตัวอย่าง

ถ้าพอร์ต4310ถูกใช้อยู่ ให้ตั้งพอร์ตอื่น เช่น:

```sh
ENCORE_PORT=4315 docker compose up --build
```

แล้วเปิด http://localhost:4315 หรือคัดลอก `.env.example` เป็น `.env` และตั้ง `ENCORE_PORT` ไว้ถาวร
ค่าเริ่มต้นเป็นนาฬิกาทดลอง 6พ.ย.2569 10:00ไทยทุกครั้งที่เริ่มเซิร์ฟเวอร์ หากตั้ง `LIVE_CLOCK=1` จะใช้เวลาปัจจุบันและสถานะรอบขายอาจต่างไป
Composeไม่เปิด test/reset/clock/callback และรันด้วยผู้ใช้ `node` ภายในcontainer

### ฐานข้อมูล Docker กับเว็บที่รันด้วย Node
Composeใช้ฐานข้อมูลในvolumeของตนเอง จึงเริ่มด้วยข้อมูลตัวอย่าง ไม่ได้คัดลอกฐานข้อมูลส่วนตัวจาก `web/data/` บนเครื่องเข้าimage ข้อมูลเดิมที่รันด้วยNodeยังอยู่ที่เดิม

### ทางเลือก: เปิดด้วย Node บนเครื่อง
```sh
npm ci
npm start
```
ต้องใช้Node22.13+ เปิดhttp://localhost:4310 ฐานข้อมูลอยู่ `web/data/encore-v2.sqlite` อย่าเปิดNodeและComposeที่พอร์ตเดียวกันพร้อมกัน

## บัญชีทดลองและรอบ
- Member `fan`/`FanDemo!26` เลข`ENCORE-0001`
- Member `fan2`/`FanTwo!26` เลข`ENCORE-0002`; `fan3`/`FanThree!26` เลข`ENCORE-0003`
- Generalทดลอง `general`/`GeneralDemo!26` หรือสมัครใหม่username3–32/password10–128
- Organizer `encore`/`EncoreDemo!26`, `sky`/`SkyDemo!26`; Scanner `gate`/`GateDemo!26`
NEONMember6พ.ย.2569 10:00ถึงก่อน15:00 General15:00ถึงปิดงาน; นาฬิกาสาธิตเริ่ม10:00และเดินตามprocess ใช้LIVE_CLOCK=1ถ้าต้องการเวลาจริง
Memberไม่เกิน2ใบสะสม/user/event/round; Generalรวมทุกroundไม่เกิน4; ข้อความGeneralเข้ารอบMemberตรง“ไม่ใช่สมาชิกMember”

## ช่องทางชำระและอีเมล
QR / 7-Eleven / CreditCard / Alipayเป็นsimulatorตามที่ผู้ใช้ยืนยัน ไม่มีเงินจริง ไม่มีPAN/CVVจริง ไม่มีSMTPออกนอกเครื่อง
TicketQRเป็นQRจริงที่decodeรหัสopaqueได้ ชื่ออยู่นอกQR; EmailSandboxสร้างอีเมลถึงbuyeremailพร้อมทุกticketและดาวน์โหลด.eml(MIME+QRPNG)ได้
QRชำระเป็นpayloadDEMOไม่ใช่PromptPayเงินจริง; เคาน์เตอร์มีreferenceและหมดเวลาพร้อมhold10นาที ไม่ใช่ใบรับชำระจริง

## ทดสอบ
```sh
npx playwright install chromium
npm run test:all
npx playwright show-report
```
API4311/UI4312แยกin-memory, migration/restart4314tempDB; testtoolsต้องTEST_MODEและtoken ไม่มีปุ่มล้างข้อมูลในเว็บปกติ
expectedTEST-DATA; planTEST-PLAN; รายงานTEST-REPORT; QRใช้jsQRdecoderอิสระตรวจภาพPNGจริง

## เอกสารและข้อจำกัด
[U]กฎผู้ใช้มาก่อน[R]เว็บอ้างอิงและ[A]สมมติฐานใหม่ ต้นทางลิงก์+ภาพอยู่references/ ไม่อ้างว่าการจ่าย/สมาชิกของทุกเว็บเหมือนกัน
archive/v2เก็บเอกสารและสคริปต์ก่อนเปลี่ยน; archive/v1เก็บประวัติเดิม ผลเก่าไม่ใช่ผลV3
PLAYBOOK.mdเป็นคู่มือV3 ส่วนPDFที่ทำก่อนหน้านี้ยังV2 ไม่อ้างว่าอัปเดตPDFแล้ว
ยังไม่เชื่อมสมาชิกภายนอก/providerpayment/emailจริง/กล้องQR/productionload; resetclockcallbackเฉพาะtest; อ้างอิงกระบวนการเรียน [Teaching_CWN2026](https://github.com/Tuchsanai/Teaching_CWN2026/tree/main/00_week01/04_sabai-spa-web-and-testplan-from-interview)

## หน้าจอและการแยกบัญชี
เลือกMemberหรือGeneralในหน้าเข้าสู่ระบบได้ บัญชีMemberเห็นเฉพาะรอบMemberพร้อมวันเวลาและสถานะของรอบนั้น ส่วนGeneralเห็นเฉพาะรอบGeneral เลือกบัญชีGeneralเพื่อเล่นงานที่เปิดGeneralแล้ว
Membershipถูกต้องเข้าผังทันที ไม่มีข้อความ“ตรวจสอบสมาชิกสำเร็จ”หรือปุ่มยืนยันเข้าผังซ้ำ ธีมสว่างพื้นขาวเทา/ฟ้านุ่ม ภาพโปสเตอร์ยังแยกสีแต่ลดความจัด
