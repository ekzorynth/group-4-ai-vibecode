# Regression findings — V3

1. กติกาV2ให้เข้าผังได้ทันทีไม่พอสำหรับMemberใหม่: เพิ่มgrantหลังqueueและตรวจซ้ำที่GETmap/POSThold ทดสอบA05–10
2. กฎเดิม4ใบต้องแยกMember2/Generalรวม4: นับบัตรต่อhold.roundและaccountในtransactionรวมrefund_pending ทดสอบA14/A43
3. เวลาholdเดิม600sอาจล่วงMember15:00: clampด้วยroundendและmemberexpiry ทดสอบA13/U10
4. Paymentสำเร็จต้องออกชื่อ/QRและemailพร้อมกัน: snapshotcontactก่อนpay, order/outboxUNIQUE ทดสอบA19–34
5. UItestรอบแรกเลือกปุ่มloginชื่อซ้ำระหว่างheader/form: แก้locatorให้เจาะsubmit ไม่เปลี่ยนexpectedธุรกิจ รอบสุดท้ายรันครบใหม่
6. QRทำให้ปุ่มขอคืนเดิมยืดสูงตามgrid: ปรับalign-items:start ตรวจภาพV3อีกครั้ง
7. ข้อความvalidationในcontactformค้างหลังแก้: clearเมื่อinput แล้วvalidateใหม่ตอนsubmit; หน้าmobileยังใช้ได้และไม่ล้น
8. Migrationต้องไม่แต่งชื่อย้อนหลัง: holderNULLของV2แสดงรายการรุ่นก่อน ไม่มีemailที่สร้างย้อนหลัง ทดสอบA41/A42

V3ไม่มีBUG_MODE/intentionalmutation รอบนี้เป็นregressionจริงและself-review ไม่มีการอ้างmutationV2เป็นผลV3

## Latest account and membership UX refinement
- Successful membership validation opens the seat map immediately. Duplicate submissions are disabled, and a closed dialog is not reopened after a delayed response.
- The new General demo account required A13 to log in to the seeded account instead of registering the same username again.
- A44 and U15 verify account-specific schedules, statuses and round buttons. General still cannot enter Member endpoints directly.
- The light palette was inspected on desktop, account chooser, seat map and mobile checkout after all 59 tests passed.
