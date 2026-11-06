# ENCORE — หลักฐานการบ้าน LAB1–13

ใช้โจทย์ [Teaching_CWN2026 บท04](https://github.com/Tuchsanai/Teaching_CWN2026/tree/main/00_week01/04_sabai-spa-web-and-testplan-from-interview) ปรับเป็นเว็บจองบัตรคอนเสิร์ต และ **ไม่ทำ LAB0** ตามคำสั่ง

| LAB | งานและหลักฐานที่มีจริง | ขอบเขต/การปรับจากตัวอย่าง |
| --- | --- | --- |
|1|[USER-STORIES](USER-STORIES.md), [บันทึกสัมภาษณ์](interview/INTERVIEW.md), ข้อกำหนดที่ผู้ใช้เพิ่ม|24 คำถาม–คำตอบ ครบ 12 หัวข้อ พร้อมสรุปกติกาและการอ้างอิงข้อกำหนด|
|2|[REQUIREMENTS](REQUIREMENTS.md) FR18/BR20/NFR7, U/A-policy/A-testแยกชัด|แยกข้อกำหนดผู้ใช้ นโยบายธุรกิจที่กำหนด และสัญญาเชิงเทคนิค|
|3|[DESIGN](DESIGN.md), [design/](design/) Mermaid+SVGครบArchitecture/UseCase/Flowchart/ERD/Sequence2แบบ, [schema](db/schema.sql)|Node+SQLiteในserviceเดียวตามระบบเดิม ไม่เพิ่มPostgreSQLสองcontainerตามสปา|
|4|[TEST-DATA](TEST-DATA.md), การคำนวณอิสระใน [review5.2](review/5.2.md)/[5.3](review/5.3.md)|สูตรราคา/ส่วนลด/ภาษี/คืนเงินและเวลาUTC–ไทยครบ|
|5|[BUILD-PROMPT](BUILD-PROMPT.md) มีช่วงA/B/C,สัญญาAPI,เจ้าของไฟล์และtrace|ครอบคลุมสัญญากลาง งานพัฒนา และเกณฑ์ตรวจรับ|
|6|[ตรวจการสร้างและเปิดระบบ](exploration/lab6/FRESH-BUILD.md) และJSON,desktop/mobile|agentบริบทใหม่อ่านใบสั่งก่อน buildcheckoutเดิมจริงบนDocker4385 ผ่าน22checks ไม่อ้างเขียนใหม่จากศูนย์หรือ16agentพร้อมกัน|
|7|[CHARTERS](CHARTERS.md), [read-only recon](exploration/lab8/recon.json)|D/A/O,แผนผังหน้า,7ใบ,BRowner20/20,กติกาแยกโลก;reconเป็นรอบขยายตามเวลาจริง|
|8|[rawcharters](exploration/lab8/), [formalreplay](exploration/lab8/replay/)|3agentทำขนานตามslotจริง คนละDB/port;C7เริ่มหลังรอบหลัก;ต้นฉบับไม่แก้ย้อนหลัง|
|9|[EXPLORATION](EXPLORATION.md) A–F และ [riskjudge](exploration/risk-judge.md)|judgeใหม่อ่านเฉพาะB–C ไม่ใช่ผู้สำรวจ/writer;63กลุ่มสำรวจไม่เอาไปรวมจำนวนautomation|
|10|[TEST-PLAN](TEST-PLAN.md) 8หัวข้อหลัก/89การ์ด12ช่อง, [writerparts](plan/)|writer3ตัวแบ่ง3กลุ่มตามโดเมนENCORE;คงIDของautomationและexpectedจากD ไม่ลอกหน้าจอ|
|11|[PLAN-REVIEW](PLAN-REVIEW.md), [review/](review/), [before-review](plan/before-review/)|reviewer3คนละตัวกับwriter พบ12ประเด็นแล้วแก้1รอบ;ไม่อ้างมีรีวิวรอบ2หรือผู้ตรวจธุรกิจภายนอก|
|12|[e2e/index.html](e2e/index.html), [TEST-REPORT](TEST-REPORT.md), [ผลnormal](e2e/report-normal/)|61API+28UI=89;UI3workersจริงคนละserver/DB/clock;GIF56ไฟล์รวมสองโหมดมาจากvideoจริง ไม่ใช่ภาพสร้างแทนเหตุการณ์|
|13|[BUG-HUNT](BUG-HUNT.md), [triage](e2e/triage.json), [freeze](e2e/report-normal/frozen.json), [modeguard](e2e/mode-isolation.json)|บั๊กฝึก3ตัวในโลกแยกTEST_MODE1/BUG_MODE1;ใช้แผน/tests/hashเดิม ไม่เปลี่ยนexpected;กลับโหมดปกติและปิดโลกทดสอบ|

## วิธีตรวจซ้ำ

```sh
npm ci
npx playwright install chromium
npm run lab:all
```

การสร้าง GIF ต้องมี `ffmpeg` ใน PATH ส่วน `docker compose up --build` สำหรับเปิดเว็บปกติไม่ต้องติดตั้ง ffmpeg หรือเครื่องมือทดสอบบนเครื่องผู้ใช้

- ผลปกติและฝังบั๊กเก็บแยก `e2e/report-normal` / `e2e/report-bug`; rawAPI/UI/เวลา/worker/hash อยู่ในแต่ละชุด
- เปิด `e2e/index.html` ได้แบบoffline มีตารางเปรียบเทียบ ทุกcaseอ้างcardและแสดงภาพ/GIF/video/traceที่เกี่ยวข้อง
- ใช้ `npm run test:all` รันเฉพาะรอบปกติ; `npm run lab:bug` เป็น negative experiment ผลexitของtestภายในอาจล้มตามบั๊กที่ฝัง ห้ามใช้bugpassrateแทนผลปกติ
- `compose.lab.yaml` เป็นโลกทดลองแยกพอร์ต4370/DBในtmpfs ต้องใช้project `encore-lab` ไม่ใช้กับvolumeผู้ใช้ `encore`
- รอบนี้เก็บการแก้และหลักฐานในเครื่องก่อน ตามคำสั่งล่าสุด **ยังไม่ส่งขึ้น GitHub**

## ข้อจำกัดที่ยังไม่ควรอ้างว่าผ่าน
ไม่ทดสอบSMTP/payment/memberproviderจริง โหลดสูง cameraQR WCAGครบ Safari/Firefox ทุกUnicode หรือdiskfailureทุกจังหวะ;AP01–05และAT01–06เป็นสมมติฐานการบ้าน ไม่ใช่นโยบายรับรองจากผู้จัดจริง ผู้ตรวจเป็นAIคนละagent ไม่ใช่ผู้ตรวจรับภายนอก
