# ENCORE — รายละเอียดระบบที่พัฒนา

พัฒนาV3-FR01–18ตามREQUIREMENTS.md แล้ว รายงานผลจริงในTEST-REPORT ไม่อ้าง[A]ของผู้สร้างแทนoracle
- store.mjs: เพิ่มusername/member/schedule/grant/checkout/holder/method/outboxแบบadditive เก็บDBเดิม มีbackupก่อนupgradeอยู่web/data/backups
- sales.mjs: schedule10/15, memberactive/owner-number, grantและcontactvalidation
- domain.mjs: queuefixednumber/ahead/ETA, quota2/4, atomicorder+ticket+outbox, refund/scanเดิม
- delivery.mjs: QR SVG/PNG, owner-onlymail/payment, escapedHTML, .emlinlineQRPNG
- server.mjs: Usernameauth+legacyemail, endpointsทั้งหมดตามAPI-CONTRACT, testgate, Origin/RBAC
- public/: 12งาน6ต่อหน้า; ผู้เยี่ยมชมเห็นสองรอบ บัญชีผู้ซื้อเห็นเฉพาะรอบตามสิทธิ์สมาชิก; membershipstepผิด✕/ถูกเข้าผังทันที; pricezone; buyer/holders; 4methods; namedticketQR; EmailSandbox

UIชื่อ/PIIเป็นtextContentหรือescape; หมายเลขสมาชิกตัวอย่างเปิดเผยเฉพาะdemoที่ระบบเตรียม ไม่มีproviderภายนอก
คู่มือการใช้งานหลักอยู่ที่ [PLAYBOOK.md](../PLAYBOOK.md)

พฤติกรรมหน้าจอ: Memberผ่านแล้วเรียกopenSeatsทันทีและกันrequestซ้ำ/การเปิดdialogกลับหลังผู้ใช้ปิด; ไม่มี#enter-mapหรือข้อความสำเร็จในDOM บัญชีgeneralถูกseedเพิ่มแบบไม่ล้างข้อมูลเดิม CatalogจากserverแยกรอบตามaccountและUIรีโหลดหลังเปลี่ยนบัญชี Themeใช้lightneutral/blueและพาสเทล

## ภาษาที่ใช้ในหน้าจอ
ใช้ภาษาไทยที่อธิบายสิ่งที่ผู้ใช้ทำได้ตรง ๆ เช่น “รอบสมาชิก”, “รอบบุคคลทั่วไป”, “หมายเลขสมาชิก”, “จองต่อ / ชำระเงิน” และ “จัดการงาน” ชื่อ Member Sale และ General Sale ใช้ประกอบเพื่อให้รู้จักชื่อรอบเท่านั้น แสดงชื่อสถานะการขาย การคืนเงิน และประวัติการทำรายการเป็นภาษาไทยแทนรหัสภายใน ทุกขั้นตอนชำระเงินระบุว่าเป็นการทดลองอย่างชัดเจน

หลังผู้จัดสั่งระงับหรือเปิดที่นั่ง ระบบต้องคงหมายเลขที่นั่งที่เพิ่งทำรายการไว้ เพื่อให้ทำรายการต่อกับที่นั่งเดิมได้โดยไม่ต้องกรอกซ้ำ ตรวจด้วย U22 และ A52

## ข้ออ้างสำหรับรอบการบ้าน LAB5–13
htmlมีdata-ready=trueและdata-bug-mode0/1, healthมีbugMode, BUG_MODEมีผลเฉพาะTEST_MODE1และdefault0;testtoolsยังต้องtoken
การสำรวจใช้โลกแยกต่อcharter;UIautomationใช้server/DBต่อworkerและเก็บe2e/index.htmlพร้อมภาพ/GIFจากvideoจริง;สูตรและexpectedไม่ใช้ค่านี้เป็นoracle ให้ยึดREQUIREMENTS/TEST-DATA
