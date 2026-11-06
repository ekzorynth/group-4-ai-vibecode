# Test Data — V3

เวลาเริ่ม2026-11-06T03:00:00Z = 6พ.ย.2569 10:00Asia/Bangkok; MemberNEONถึงก่อน08:00Z(15:00ไทย); Generalเริ่ม08:00Z
ก่อนรอบ09:44:59.999เข้าqueueไม่ได้;09:45เข้าwaiting;10:00pumpactive;14:59:59.999Memberยังถือได้แต่expiresclamp15:00;15:00Memberปิด/Generalเปิด

| Username | Password | Membership | หมายเหตุ |
|---|---|---|---|
| fan | FanDemo!26 | ENCORE-0001 | activeถึงสิ้นปี2570 |
| fan2 | FanTwo!26 | ENCORE-0002 | activeเพื่อทดสอบสองผู้ซื้อ |
| fan3 | FanThree!26 | ENCORE-0003 | activeสำหรับคิวรอคนที่3 |
| general | GeneralDemo!26 | ไม่มี | General Sale เท่านั้นในมุมมองบัญชี |
| expired | Expired!26 | ENCORE-EXPIRED | valid_untilตรงเวลาเริ่ม เข้าMemberไม่ได้ |
| encore | EncoreDemo!26 | ไม่มี | owner7งาน |
| sky | SkyDemo!26 | ไม่มี | owner5งาน |
| gate | GateDemo!26 | ไม่มี | scannerNEON |
สมัครใหม่Generalไม่มีmembership; emailบัญชีเดิมยังloginได้; เลขของอีกคนและเลขผิดไม่ผ่าน

12งาน6ต่อหน้า: neon/sunset/orbit/aurora/jazz/rock/citypop/acoustic/kpop/hiphop/folk/midnight รายการและราคาพื้นฐานเดิม48ที่/งาน A-BVIP3200 C-DRegular1800; NEONขายแล้วA03A04B09C06D10; orbit/midnightหมดทุกที่
NEONMemberเริ่มวันนี้; aurora/jazz/rock/citypop/acousticเป็นGeneralตอนเริ่ม; sunset/kpop/hiphop/folkยังไม่ถึงวันเปิด

## เงิน expected คิดก่อนดูเว็บ
| Seats | Coupon | subtotal | discount | fee | VAT | total |
|---|---|---:|---:|---:|---:|---:|
| C01 | ว่าง | 1800 | 0 | 30 | 2 | 1832 |
| C01 | STAGE10 | 1800 | 180 | 30 | 2 | 1652 |
| C01 C02 | STAGE10 | 3600 | 360 | 60 | 4 | 3304 |
| A01 A02 | STAGE10 | 6400 | 500 | 60 | 4 | 5964 |
| A01 C01 | STAGE10 | 5000 | 500 | 60 | 4 | 4564 |
คืนC01โค้ดnet1620 ไม่คืนfee30/VAT2; 2Regularโค้ด3304คืน1ใบ1620→net1684

Contact: buyerfullname“Buyer Test”, emailbuyer@example.test, phone0812345678; holder“Holder 1/Holder 2”, emailรายคน, phone0898765432; ทดลองผิดSingle(ไม่มีนามสกุล)/bademail/phone123/holderขาดหรือseatซ้ำ
ช่องทางqr/seven_eleven/credit_card/alipay; QRชำระpayloadENCORE-DEMO-PAYไม่ใช่บัญชีเงินจริง; .emlถึงbuyeremailและแนบQRทุกใบ

Paymentexpiry600sหรือroundendแล้วแต่ใดก่อน; callbackpaidAt599.999sและarrival719.999sสำเร็จ; paidAt600sหรือarrival720sคืนเงินจำลองไม่มีemail; queueTTL900s; refund72h; gateNEON12ธ.ค.16:00ถึงก่อน22:00ไทย

Testsใช้4311/4312/in-memoryและ4314/tempfile ไม่reset4310; ภาพV3และผลดิบV3แยกจากV2; Tmigrationสร้างschemaV2จริงก่อนบูตV3เพื่อตรวจข้อมูลเก่า

Accountview fixture: เวลา10:00NEONในfan=Member/available แต่ในgeneral=General/upcoming; AURORAในfan=Member/closed แต่ในgeneral=General/available; เวลา15:00NEONในfan=Member/closed แต่general=General/available ผู้เยี่ยมชม/ผู้จัดเห็นสองscheduleได้ตามบทบาท
