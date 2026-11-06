# Test Report — ENCORE / LAB12–13

ผลรันจริงโหมดปกติ UTC 2026-11-06T13:26:32.734Z ถึง 2026-11-06T13:27:18.877Z; Node v26.0.0; Chromium/Playwright; 3 workers คนละserver/SQLite/clock ไม่มีresetร่วม ไม่แตะ4310

|กลุ่ม|ทั้งหมด|ผ่าน|ไม่ผ่าน|
|---|---:|---:|---:|
|API|61|61|0|
|UI|28|28|0|
|รวม|89|89|0|

เกณฑ์ P1 87/87 ต้องผ่านทั้งหมด และรวม>=85/89 (95%) ผล: ผ่าน

[เปิดรายงานหลักพร้อมภาพ/GIFและผลเทียบ](e2e/index.html) · [แผน89การ์ด/12ช่อง](TEST-PLAN.md) · [รีวิวแยกจากwriter](PLAN-REVIEW.md)

## รอบฝังบั๊กที่แยกจากผลผ่านปกติ
Normal89/89; Bug78/89ผ่านและ11ล้มใหม่ ตรวจจับ3/3บั๊ก ด้วยแผน/test/expectedเดียวกัน SHA256เหมือนกัน=true; actualUIconcurrency normal3/bug3. ผลbugล้มเป็นหลักฐานทดลอง ไม่ใช่ความเสียหายบนเว็บใช้งานปกติ

## รายกรณีโหมดปกติ
|ID|ระดับ|ผล|
|---|---|---|
|V3-A01|P1|passed|
|V3-A02|P1|passed|
|V3-A03|P1|passed|
|V3-A04|P1|passed|
|V3-A05|P1|passed|
|V3-A06|P1|passed|
|V3-A07|P1|passed|
|V3-A08|P1|passed|
|V3-A09|P1|passed|
|V3-A10|P1|passed|
|V3-A11|P1|passed|
|V3-A12|P1|passed|
|V3-A13|P1|passed|
|V3-A14|P1|passed|
|V3-A15|P1|passed|
|V3-A16|P1|passed|
|V3-A17|P1|passed|
|V3-A18|P1|passed|
|V3-A19|P1|passed|
|V3-A20|P1|passed|
|V3-A21|P1|passed|
|V3-A22|P1|passed|
|V3-A23|P1|passed|
|V3-A24|P1|passed|
|V3-A25|P1|passed|
|V3-A26|P1|passed|
|V3-A27|P1|passed|
|V3-A28|P1|passed|
|V3-A29|P1|passed|
|V3-A30|P1|passed|
|V3-A31|P1|passed|
|V3-A32|P1|passed|
|V3-A33|P1|passed|
|V3-A34|P1|passed|
|V3-A35|P1|passed|
|V3-A36|P1|passed|
|V3-A37|P1|passed|
|V3-A38|P1|passed|
|V3-A39|P1|passed|
|V3-A40|P1|passed|
|V3-A41|P1|passed|
|V3-A42|P1|passed|
|V3-A43|P1|passed|
|V3-A44|P1|passed|
|V3-A45|P1|passed|
|V3-A46|P1|passed|
|V3-A47|P1|passed|
|V3-A48|P1|passed|
|V3-A49|P1|passed|
|V3-A50|P1|passed|
|V3-A51|P1|passed|
|V3-A52|P1|passed|
|V3-A53|P1|passed|
|V3-A54|P1|passed|
|V3-A55|P1|passed|
|V3-A56|P1|passed|
|V3-A57|P1|passed|
|V3-A58|P1|passed|
|V3-A59|P1|passed|
|V3-A60|P1|passed|
|V3-A61|P1|passed|
|V3-L01|P1|passed|
|V3-L02|P1|passed|
|V3-L03|P1|passed|
|V3-U01|P1|passed|
|V3-U02|P1|passed|
|V3-U03|P1|passed|
|V3-U04|P1|passed|
|V3-U05|P1|passed|
|V3-U06|P1|passed|
|V3-U07|P1|passed|
|V3-U08|P1|passed|
|V3-U09|P1|passed|
|V3-U10|P1|passed|
|V3-U11|P1|passed|
|V3-U12|P1|passed|
|V3-U13|P1|passed|
|V3-U14|P1|passed|
|V3-U15|P1|passed|
|V3-U16|P1|passed|
|V3-U17|P2|passed|
|V3-U18|P1|passed|
|V3-U19|P1|passed|
|V3-U20|P1|passed|
|V3-U21|P1|passed|
|V3-U22|P1|passed|
|V3-U23|P1|passed|
|V3-U24|P1|passed|
|V3-U25|P2|passed|

## ขอบเขตหลักฐาน
การโยงครบFR18/BR20/NFR7หมายถึงมีscenarioตามที่ระบุ ไม่ใช่line/branchcoverage100% หรือการรับรองproviderจริง ผู้เขียนแผน3agent/ผู้รีวิว3agentคนละคนกัน;ผู้ตัดสินความเสี่ยงแยกจากผู้สำรวจ แต่ทั้งหมดเป็นAI-assisted review ไม่ใช่ผู้ตรวจรับอิสระภายนอก

GIFจากvideoจริงสูงสุด8วินาทีแรก/3fps/480px ดูvideoเต็มหรือภาพfinalในe2e/indexเมื่อGIFไม่ครอบจังหวะที่ต้องตรวจ APIมีrawassertionไม่มีGIFแทน ผลดิบและfreezeอยู่e2e/report-normal,report-bug;triageอยู่e2e/triage.json

Docker freshcontextตรวจ22ข้อและกลับปิดเฉพาะโลกทดสอบ ดูexploration/lab6/FRESH-BUILD.md. SMTP/payment/memberproviderจริง โหลดสูง กล้องQR WCAGครบ Safari/Firefox ทุกUnicode และdiskfailureยังไม่ทดสอบ. นโยบายAP01–05เป็นสมมติฐานmock ต้องยืนยันใหม่ก่อนขายจริง
