## B. ฟีเจอร์ที่พบและหลักฐาน
| กลุ่ม | ต้องมี[D] | ผู้สร้างอ้าง[A] | พบจริง[O] | หลักฐาน |
| --- | --- | --- | --- | --- |
| บัญชีและMember | FR01/03/05/06 | username/registry/grant | login,General403,expired403,wrongnumber400,ข้ามownerไม่ได้ | [C1](exploration/lab8/c1.md) |
| Catalogและรอบ | FR02 | ข้อความเก่าสองwindows;ส่วนใหม่scoped | Member/Generalเห็นคนละรอบตามAPIและUI | C1/C2/C6 |
| คิว | FR04 | FIFO2slots/number/ahead/ETA | waiting3rdเลขคงเดิม reloadและauto-admitทำงาน | [C2](exploration/lab8/c2.md) |
| ที่นั่ง/โควตา | FR07/08 | atomichold/2และ4ใบ | จองชน201/409,duplicate/basketinvalidถูกปฏิเสธ,สะสม2/4 | [C3](exploration/lab8/c3.md) |
| ราคา/ข้อมูล | FR09/10 | servercanonical/snapshot |1832/1652/5964/4564/3304,rollbackและvalidation | C3 |
| ชำระ4ช่องทาง | FR11/12 | pending/terminal/grace |4ช่องทางจบ,failedretrynewID,late/noemail,replayไม่ซ้ำ | [C4](exploration/lab8/c4.md) |
| QR/EML/เจ้าของ | FR13–15 | realQR/owner-only/sandbox |jsQRถอดPNGตรงopaque,EMLมีinlinePNG,owner404 | C4 |
| ผู้จัด/คืนเงิน | FR17 | owner,pause,refund,cancel |ยอด3304−1620=1684,scope/blockถูกต้อง;นโยบายบางข้อยังต้องกำหนด | [C5](exploration/lab8/c5.md) |
| ตรวจบัตร | FR16 | role/event/window/once |16:00รวม/22:00ไม่รวม,200→409,refundedห้ามเข้า | C5 |
| มือถือ/recovery | NFR01/06 |375px/keyboard |page375/dialog337ไม่ล้น,Space/Escape/empty/networkrecover | [C6](exploration/lab8/c6.md) |
| ค่าขอบปิดท้าย | BR09และค่าขอบอื่น |controlledclock |ก่อน1msและตรงขอบsession/lock/hold/queue/sale/refund/graceผ่าน | [C7](exploration/lab8/c7.md) |

## C. ตารางเทียบสามทางทีละกฎสำคัญ
| ID | D oracle | A claim | O observation | ผล/เจ้าของ |
| --- | --- | --- | --- | --- |
|R01|BR05 Generalไม่มีสิทธิ์Member|servergate|queue/map/hold403|✅ C1|
|R02|BR07เลขของaccount+grant|registry/grant|เลขผิด/คนอื่น400 ไม่มีgrant403|✅ C1|
|R03|FR02บัญชีเห็นเฉพาะรอบตน|SPECเก่าเขียน2sale windows|UI/APIscopedถูกต้อง|⚠️ เอกสารเก่า C1/C2|
|R04|BR04ห้องรอเปิดก่อน15min|prequeue/pump|09:44:59.999ปิด 09:45waiting 10:00active|✅ C2|
|R05|BR06FIFO2slots/เลขคงเดิม|stablepolling|คน3ahead2/120s reloadเลขเดิม leaveแล้วadmit|✅ C2|
|R06|BR03Memberปิด15Generalเปิด|serverclock|14:59:59.999ถือได้clamp15:00;ตรง15Generalได้|✅ C2/C7|
|R07|BR08Member2/Generalรวม4|transactionquota|ซื้อสะสมและ2sessionข้ามไม่ได้|✅ C3|
|R08|BR12ตัวเลขจากTEST-DATA|canonicalserver|1832,1652,3304,5964,4564ตรง|✅ C3|
|R09|FR07basketatomic|BEGINtransaction|ส่วนหนึ่งไม่ว่างไม่ยึดที่ว่าง;race1ชนะ|✅ C3|
|R10|BR10/11/19contactsครบ/frozen|validation/snapshot|invalid400 pending409 reloadคงข้อมูล|✅ C3/C4|
|R11|BR15/18exactlyonce|UNIQUEorder/outbox|duplicateorder/emailหนึ่งชุด|✅ C4|
|R12|BR16paidAt/arrivalexclusive|grace120|deadlineexactrefund;grace−1msได้/exactคืน|✅ C4/C7|
|R13|BR17QRopaque/owner|realSVG/PNG|jsQRตรงcodeไม่ใช่PII;owner404|✅ C4|
|R14|FR16scanonce/role/window|valid→used|first200 second409 refundeddenied|✅ C5|
|R15|FR17refund/pauseregressionแต่รายละเอียดไม่ครบ|UIอ้างคืน/พัก/ยกเลิก|observed lifecycleไม่ขัดแต่ยังไม่ใช่D|⚠️ C5 ก่อนAP01–05|
|R16|NFR01มือถือ/keyboard|375px|375/337pxไม่ล้น SpaceและEscapeทำงาน|✅ C6|
|R17|FR08โควตาต้องบังคับ|serverquota|ซื้อครบแล้วยังเลือกก่อนถูกปฏิเสธตอนยืนยัน|⚠️ UX C3 กฎserverผ่าน|
|R18|BR01/20lock/session|cookie/clock|5thlock/15minexact/24hexactตรง|✅ C1/C7|

