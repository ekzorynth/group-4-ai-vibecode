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

ผลตรวจรับแอปอยู่ใน TEST-REPORT.md ส่วนการตรวจ Docker ในเอกสารนี้ตรวจการเชื่อมต่อและการเก็บข้อมูลตามรายการข้างต้น ไม่ใช่การรันชุด Playwright ภายใน image ใช้งาน

## ตรวจซ้ำพร้อมชุด Acceptance Test — 6 พฤศจิกายน 2569

ใช้ project encore-at-20261106 พอร์ต 4315 และ volume ทดสอบที่สร้างใหม่ แยกจาก project encore พอร์ต 4310

- Build และ healthcheck ผ่านกับ image ที่ใช้เปิดระบบจริง
- สร้างคำสั่งซื้อรอบสมาชิกด้วย QR ทดลอง ยอด 1,652 บาท ได้บัตรมีชื่อผู้ถือ QR และอีเมลแนบ QR
- ตรวจ test/reset, test/clock และ test/callback ตอบ 403 ทั้งหมด
- restart แล้วตรวจ order ID, ticket ID และ mail ID เดิมครบ
- compose down โดยเก็บ volume แล้ว up สร้าง container ใหม่ ตรวจรหัสเดิมครบ
- ลบเฉพาะ project และ volume ทดสอบเมื่อเสร็จ ฐานข้อมูลของเว็บพอร์ต 4310 ไม่ถูกล้าง

ผลรันอยู่ e2e/docker-at.log และสคริปต์ scripts/docker-smoke.mjs ไม่รวมการตรวจนี้เข้าไปในจำนวน 86 กรณี API/UI และไม่อ้างว่ารัน Playwright ทั้งหมดใน production image

## การตรวจสร้างและเปิดระบบ LAB6
รอบการบ้านฉบับขยายใช้agentบริบทใหม่อ่านBUILD-PROMPTก่อนสร้างimageและเปิดprojectencore-fresh-lab6พอร์ต4385 ตรวจ22รายการรวมuid1000/marker0/testtools403/ยอด1652/jsQR/EMLและdesktop375px แล้วลบเฉพาะcontainer/volumeของprojectตน รายงานผลจริงและความผิดพลาดharnessรอบแรกที่แก้แล้วอยู่exploration/lab6/FRESH-BUILD.md ไม่อ้างว่าสร้างใหม่จากศูนย์หรือทดสอบproductionload
