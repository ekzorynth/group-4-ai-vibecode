# Docker Compose verification

ทดสอบจริง 6 พฤศจิกายน 2569 บน Docker29.8.0 / Compose5.5.1 / containerNode22.23.4

| ตรวจ | ผล |
|---|---|
| `docker compose config --quiet` | ผ่าน |
| Buildด้วยDockerfileและpackage-lock | ผ่าน `npm ci --omit=dev` |
| เปิดcontainerแล้วรอhealthcheck | healthy |
| Runtimeไม่ใช่root | uid1000 (node) |
| ไม่ติดตั้งชุดทดสอบในruntime | ไม่มี @playwright/test |
| Testendpointปิดในcontainerปกติ | reset403 |
| Member login→queue→verify→hold→checkout→payment | ผ่าน ยอดRegular+STAGE10=1652 |
| Ticketมีชื่อและSVGQRจริง | ผ่าน |
| EmailSandboxมีmessageและEMLแนบQRPNG | ผ่าน |
| Restartแล้วข้อมูลอยู่ | order/ticket/mailรหัสเดิม |
| Compose downโดยไม่ล้างvolume แล้วupสร้างcontainerใหม่ | order/ticket/mailรหัสเดิม |
| Imageไม่ฝังฐานข้อมูลของเครื่อง | /app/web/dataว่างก่อนmountvolume |
| เปิดComposeชุดใช้งานจริงพอร์ต4310 | healthy, 12งาน, NEONMemberพร้อมทดลอง |

ทดสอบcheckoutในComposeprojectชั่วคราวแยกพอร์ต4315และvolumeใหม่ ไม่ใช้ฐานข้อมูลผู้เรียน เมื่อจบลบเฉพาะproject/volume/imageทดสอบที่สร้างในรอบนี้
Composeหลัก `encore` ที่พอร์ต4310ยังเปิดให้ใช้งาน ใช้volumeของตนเองและไม่ได้คัดลอกDBเดิมจากเครื่อง ข้อมูลเดิมNodeที่web/dataยังอยู่

สคริปต์ทำซ้ำ: `scripts/docker-smoke.mjs create` แล้วrestartหรือdown/upโดยเก็บvolume จากนั้น `scripts/docker-smoke.mjs verify` ใช้BASE_URLชี้เฉพาะระบบทดสอบที่ทิ้งได้ เพราะขั้นcreateสร้างorderตัวอย่าง ต้องมีNodeบนเครื่องเฉพาะกรณีเรียกสคริปต์นี้ ผู้ใช้ทั่วไปเปิดComposeอย่างเดียวได้

ผล57ข้อของV3อยู่TEST-REPORT.md เป็นการทดสอบแอปรอบก่อน การตรวจDockerรอบนี้เป็นintegrationที่ระบุข้างบน ไม่อ้างว่ารันPlaywright57ข้อภายในproductionimage
