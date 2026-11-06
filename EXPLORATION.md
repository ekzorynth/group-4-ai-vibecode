# Exploration — V3 / light theme and account views

ตรวจโดย agent ผู้สร้าง บนฐานข้อมูลทดสอบแยกจากเว็บจริง เป็น self-review ไม่ใช่ independent audit

| เส้นทาง | สิ่งที่เห็นจริง / หลักฐาน |
|---|---|
| Member เลขผิด | v3-member-invalid.png แสดง error และยังไม่เห็นผัง |
| Member เลขถูก | v3-member-valid.png เปิดผังทันที ไม่มีข้อความสำเร็จหรือปุ่มกดเข้าผังซ้ำ |
| General | v3-general-view.png แสดงเฉพาะ General Sale; forced API ยังปฏิเสธ Member ด้วยข้อความที่กำหนด |
| บัญชีทดลอง | v3-demo-accounts-light.png มีตัวเลือก Member / General แยกชัด |
| แคตตาล็อก Member | v3-member-catalog-light.png แสดงเวลา สถานะ และปุ่มของรอบ Member เท่านั้น |
| Queue | v3-queue.png มีหมายเลข คนก่อนหน้า เวลาประมาณ และเปลี่ยนขั้นเมื่อถึงคิว |
| Checkout / Payment | v3-contact-mobile.png และ v3-method-*.png ข้อมูลรายใบและ 4 ช่องทางยังทำงาน |
| Ticket / Email | v3-tickets.png และ v3-mailbox.png มีชื่อกับ QR และดาวน์โหลด EML ได้ |

ตรวจภาพ desktop, เลือกบัญชี, ผัง และมือถือแล้ว: พื้นสว่าง สีฟ้านุ่ม โปสเตอร์ลดความจัด ข้อความและปุ่มอ่านได้ ไม่ล้น 375px ตาม assertion
รอบล่าสุด API 44/44 และ UI 15/15 ผ่าน รวม 59 ข้อ ดู TEST-REPORT.md
A44 ตรวจการแยก schedule/status ตาม account; U15 ตรวจเลือกบัญชีและเปลี่ยนมุมมอง; U01 ยืนยัน valid Membership เข้าผังโดยไม่มีขั้นสำเร็จคั่น
ยังไม่รวม provider/SMTP/camera จริง, production load, WCAG audit ครบ หรือทุก input Unicode
