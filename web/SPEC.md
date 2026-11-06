# ENCORE V3 — Implementation record [A]

พัฒนาV3-FR01–18ตามREQUIREMENTS.md แล้ว รายงานผลจริงในTEST-REPORT ไม่อ้าง[A]ของผู้สร้างแทนoracle
- store.mjs: เพิ่มusername/member/schedule/grant/checkout/holder/method/outboxแบบadditive เก็บDBเดิม มีbackupก่อนupgradeอยู่web/data/backups
- sales.mjs: schedule10/15, memberactive/owner-number, grantและcontactvalidation
- domain.mjs: queuefixednumber/ahead/ETA, quota2/4, atomicorder+ticket+outbox, refund/scanเดิม
- delivery.mjs: QR SVG/PNG, owner-onlymail/payment, escapedHTML, .emlinlineQRPNG
- server.mjs: Usernameauth+legacyemail, endpointsทั้งหมดตามAPI-CONTRACT, testgate, Origin/RBAC
- public/: 12งาน6ต่อหน้า; แสดง2sale windows; membershipstepผิด✕/ถูกเข้าผังทันที; pricezone; buyer/holders; 4methods; namedticketQR; EmailSandbox

UIชื่อ/PIIเป็นtextContentหรือescape; หมายเลขสมาชิกตัวอย่างเปิดเผยเฉพาะdemoที่ระบบเตรียม ไม่มีproviderภายนอก
PDFคู่มือในoutput/pdfเป็นV2เดิม ใช้PLAYBOOK.mdสำหรับV3 รอบนี้ไม่ได้สร้างPDFใหม่

UIล่าสุด: Memberผ่านแล้วเรียกopenSeatsทันทีและกันrequestซ้ำ/การเปิดdialogกลับหลังผู้ใช้ปิด; ไม่มี#enter-mapหรือข้อความสำเร็จในDOM บัญชีgeneralถูกseedเพิ่มแบบไม่ล้างข้อมูลเดิม CatalogจากserverแยกรอบตามaccountและUIรีโหลดหลังเปลี่ยนบัญชี Themeใช้lightneutral/blueและพาสเทล

## ภาษาที่ใช้ในหน้าจอ
ใช้ภาษาไทยที่อธิบายสิ่งที่ผู้ใช้ทำได้ตรง ๆ เช่น “รอบสมาชิก”, “รอบบุคคลทั่วไป”, “หมายเลขสมาชิก”, “จองต่อ / ชำระเงิน” และ “จัดการงาน” ชื่อ Member Sale และ General Sale ใช้ประกอบเพื่อให้รู้จักชื่อรอบเท่านั้น แสดงชื่อสถานะการขาย การคืนเงิน และประวัติการทำรายการเป็นภาษาไทยแทนรหัสภายใน ทุกขั้นตอนชำระเงินระบุว่าเป็นการทดลองอย่างชัดเจน
