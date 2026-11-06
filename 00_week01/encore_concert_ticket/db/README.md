# ฐานข้อมูล ENCORE

Runtime ใช้ SQLite WAL และ additive migration ใน `web/store.mjs` เก็บไฟล์ใน Docker named volume ไม่แยก PostgreSQL container ตามตัวอย่างสปา เพราะโจทย์นี้เลือก Node + SQLite ไว้แล้ว

`schema.sql` เป็น snapshot ของ schema รุ่นปัจจุบัน ไม่มีข้อมูลผู้ใช้หรือรหัสผ่านจริง สร้างซ้ำด้วย `node scripts/export-schema.mjs` ห้ามใช้แทน migration สำหรับฐานข้อมูลที่มีรายการเดิม ส่วน worker ทดสอบแต่ละตัวใช้ SQLite ในหน่วยความจำของ process ตนเอง
