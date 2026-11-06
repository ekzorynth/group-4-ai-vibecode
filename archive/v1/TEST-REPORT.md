# รายงานทดสอบ ENCORE

รันจริงบนเครื่องผู้ใช้ 6 พฤศจิกายน 2569 (Asia/Bangkok) โหมดปกติ Node.js v22.13.1 และ Playwright 1.58.2 Chromium ทดสอบAPI18ข้อและUI5ข้อ

| ระดับ | ทั้งหมด | ผ่าน | ไม่ผ่าน | Blocked |
|---|---:|---:|---:|---:|
| P1 | 20 | 20 | 0 | 0 |
| P2 | 3 | 3 | 0 | 0 |
| รวม | 23 | 23 | 0 | 0 |

**ผ่านเกณฑ์บทเรียน:** P1ครบ20/20 และรวม100% (เกณฑ์>=95%) ข้อสรุปจำกัดเฉพาะขอบเขตในTEST-PLAN.md ไม่ใช่การรับรองพร้อมขายบัตรจริง

## ผลรายข้อ
| ID | เรื่อง | ผลจริง | หลักฐาน |
|---|---|---|---|
| TC-01 | catalog has available, upcoming and sold-out events | ผ่าน | e2e/api-results.json |
| TC-02 | one Regular ticket costs 1832 | ผ่าน | e2e/api-results.json |
| TC-03 | two VIP tickets coupon capped at 500 total 5964 | ผ่าน | e2e/api-results.json |
| TC-04 | reject 0 and 5 seats; allow 4 | ผ่าน | e2e/api-results.json |
| TC-05 | reject duplicates, missing and sold seats | ผ่าน | e2e/api-results.json |
| TC-06 | two simultaneous buyers: exactly one succeeds | ผ่าน | e2e/api-results.json |
| TC-07 | hold is valid at 9:59 and fails exactly 10:00 | ผ่าน | e2e/api-results.json |
| TC-08 | payment replay returns one order | ผ่าน | e2e/api-results.json |
| TC-09 | decline keeps hold and allows retry | ผ่าน | e2e/api-results.json |
| TC-10 | session isolation blocks others payment/release/history | ผ่าน | e2e/api-results.json |
| TC-11 | release immediately makes the seat available | ผ่าน | e2e/api-results.json |
| TC-12 | sale opens exactly at boundary, closes exactly at end | ผ่าน | e2e/api-results.json |
| TC-13 | reject invalid coupon and ignore manipulated total | ผ่าน | e2e/api-results.json |
| TC-14 | invalid email does not create order | ผ่าน | e2e/api-results.json |
| TC-15 | paid seat is sold and cannot be reserved again | ผ่าน | e2e/api-results.json |
| TC-16 | reset guarded; reject foreign-origin writes | ผ่าน | e2e/api-results.json |
| TC-17 | mixed zones correct and atomic failure holds nothing | ผ่าน | e2e/api-results.json |
| TC-18 | new hold releases previous basket; paid seat survives time | ผ่าน | e2e/api-results.json |
| TC-19 | TC-19 desktop booking, failed payment, retry, ticket persists | ผ่าน | e2e/ui-results.json |
| TC-20 | TC-20 mobile 375px, search, filters, four-seat cap, no overflow | ผ่าน | e2e/ui-results.json |
| TC-21 | TC-21 keyboard modal, escape releases held seats | ผ่าน | e2e/ui-results.json |
| TC-22 | TC-22 timeout exact boundary disables pay and allows reselection | ผ่าน | e2e/ui-results.json |
| TC-23 | TC-23 closing while reservation is in flight releases late hold | ผ่าน | e2e/ui-results.json |

## การตรวจภาพและผลการแก้ไข
ตรวจภาพdesktop/mobileด้วยตาแล้ว โปสเตอร์และตัวอักษรแสดงครบ ตรวจ375pxทั้งหน้าและผังไม่ล้นโดยassert มีหลักฐานexploration/*.png
รอบแรกพบbrowserขาดและlocatorไม่ชัด แก้สภาพแวดล้อม/สคริปต์แล้วรันใหม่ พบความเสี่ยงปิดdialogระหว่างreserve แก้เว็บและเพิ่มTC23 ผลสุดท้ายUI5/5ผ่าน ไม่ซ่อนปัญหารอบแรก รายละเอียดEXPLORATION.md

## การทดสอบแยกสภาพแวดล้อม
API4311 และUI4312 ใช้DB in-memory คนละprocess ไม่ล้างข้อมูลเว็บ4310 ผลดิบเป็นmachine-readableพร้อมเวลารัน รายงานHTMLสร้างที่playwright-report/index.html

## พิสูจน์testจับบั๊ก
เปิดBUG_MODEทีละแบบ: moneyล้ม4ข้อ expiryล้ม1ข้อ inventoryล้ม2ข้อ ตามBUG-HUNT.md การล้มเหล่านั้นตั้งใจเพื่อการเรียนและไม่รวมในผลโหมดปกติ

## ข้อจำกัด
ผู้สร้างและผู้ทดสอบเป็นagentเดียว ไม่มีindependent audit ไม่ทำload test, gatewayจริง, emailจริง, refund, login, cross-device หรือWCAGครบ ใช้SQLiteหนึ่งprocessและlocalhost ไม่มีdeploymentออนไลน์ ผลผ่าน23ข้อไม่ได้แปลว่าครบทุกค่าขอบ ดูช่องว่างในTEST-PLAN.md
