# ใบสั่งสร้าง V3

อ่านREQUIREMENTS/USER-STORIES/TEST-DATA/DESIGNและreferences/READMEก่อนทำ ใช้[U]ก่อน[R]/[A] ไม่อ้างภาพเว็บอื่นเป็นหน้าของเรา
1. รักษา12event+pagination+ordersV2 เพิ่มschemaแบบadditive ไม่resetDBผู้เรียน
2. Usernameauth+emailcompat; memberregistryแยกaccount; scheduledMember10–15/General15; queueก่อน15min/FIFO2slots/number/ahead/ETA/polling
3. Memberต้องactiveaccountและเลขMembershipของตนหลังถึงคิว ตรวจgrantอีกครั้งที่map/hold จำกัด2ใบสะสม/member; Generalรวม4
4. Buyerและholderรายใบ3fieldsvalidateที่server/snapshotก่อนpay; 4methodsจำลองพร้อมreference/deadline; ไม่รับเงินจริง/PAN
5. Paymentterminal/replay/graceและatomicseat/order/ticket/outbox; ไม่มีemailก่อนsuccess; no duplicateemail
6. QRจริงชื่ออยู่นอกQR tokenไม่มีPII; owner-onlyQR/mail; .emlMIMEQRPNG; emailอยู่sandboxตามคำตอบผู้ใช้
7. ใช้UIเดิมเพิ่มflowใหม่ responsive375px/keyboard; ยังมีrefund/admin/scan
8. API+Playwright+independentQRdecoder+V2schemamigrationtest เก็บภาพV3และreportจากผลจริง; updateMD/Playbook ห้ามอ้างV2ผลผ่านเป็นV3
