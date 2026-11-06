# Group 4 — AI Vibe Coding

โครงการและเอกสารส่งมอบสำหรับสัปดาห์ที่ 1 อยู่ในโฟลเดอร์ `00_week01`

| โฟลเดอร์ | เนื้อหา |
| --- | --- |
| [00_week01/encore_concert_ticket](00_week01/encore_concert_ticket) | ระบบจองบัตรคอนเสิร์ต ENCORE พร้อมข้อกำหนด ชุดทดสอบ ภาพอ้างอิง และ Docker |
| [00_week01/skill/project-manager](00_week01/skill/project-manager) | Skill Project Manager พร้อมเอกสารอ้างอิงด้านการวางแผนและติดตามโครงการ |

## เปิดระบบจองบัตรคอนเสิร์ต

เปิด Docker Desktop แล้วรันจากโฟลเดอร์ repository นี้:

```sh
cd 00_week01/encore_concert_ticket
docker compose up --build
```

จากนั้นเปิด [http://localhost:4310](http://localhost:4310) และเลือกบัญชีสำหรับตรวจรับที่หน้าเข้าสู่ระบบ ขอบเขตการเชื่อมต่อใช้ผู้ให้บริการชำระเงินทดสอบและกล่องอีเมลภายในระบบ ยังไม่เรียกเก็บเงินจริงหรือส่งอีเมลภายนอก

ดู [คู่มือผู้ใช้](00_week01/encore_concert_ticket/PLAYBOOK.md), [ผลการทดสอบ](00_week01/encore_concert_ticket/TEST-REPORT.md) และ [ภาพอ้างอิงเทียบระบบ](00_week01/encore_concert_ticket/references/SCREENSHOT-COMPARISON.md)

## Skill Project Manager

อ่านวิธีใช้ได้ที่ [SKILL.md](00_week01/skill/project-manager/SKILL.md) โดยเก็บโฟลเดอร์ `references` คู่กันไว้เพื่อให้ลิงก์เอกสารภายในใช้งานได้
