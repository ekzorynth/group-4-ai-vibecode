# PLAN-REVIEW — LAB11 / ผู้รีวิวแยกจากผู้เขียน

ผู้เขียน:writer_51/52/53;ผู้รีวิว:review_51/52/53 เป็นคนละagentและบริบทใหม่ทุกกลุ่ม อ่านเฉพาะแผน/ข้อกำหนด/ข้อมูล/ผลสำรวจ ไม่อ่านruntime/BUGSหรือเว็บจริง ไฟล์review/เก็บต้นฉบับผู้รีวิวไม่แก้ย้อนหลัง หัวหน้ารวมและแก้แผน/test1รอบ ไม่อ้างว่ามีreviewรอบสอง

## ก่อนและหลังแก้
|ตัวชี้วัด|ก่อนรีวิว|หลังแก้|
|---|---:|---:|
|การ์ดทดสอบ|89|89|
|IDซ้ำ/หาย|0|0|
|ข้อพบ|12|12จัดการแล้ว|
|ระดับสูง/P1|3|0ที่ยังเปิดในขอบเขตการบ้าน|
|FR/BR/NFRที่โยง|45|45|

จำนวนข้อเท่าเดิมเพราะเพิ่มpositivecontrol/ปรับข้อมูล/แก้timingในIDเดิม ไม่เพิ่มจำนวนเพื่อทำให้ผลดูดี สมมติฐานธุรกิจAP01–05และtestcontractAT01–06ประกาศชัด ไม่ถือว่าเจ้าของธุรกิจจริงยืนยัน

## ผู้ตรวจและหลักฐาน
|กลุ่ม|ผู้เขียน|ผู้รีวิว|การ์ดที่ตรวจ|ไฟล์ต้นฉบับ|
|---|---|---|---:|---|
|5.1|writer_51|review_51|24|[review](review/5.1.md)|
|5.2|writer_52|review_52|24|[review](review/5.2.md)|
|5.3|writer_53|review_53|41|[review](review/5.3.md)|

## ข้อพบและการแก้
|ID|ระดับ|ปัญหา|แก้อย่างไร/หลักฐาน|
|---|---|---|---|
|R51-01|high|V3-A10 cannot establish user/event/round grant binding as written. At T0 SUNSET and NEON General are not open, and fan2 is not explicitly made active before its unverified request. An implementation with an incorrectly global grant can still deny these calls at the sale/queue gate. The caveat about not using status alone does not provide an alternative observable capable of falsifying that fault.|A10เพิ่มtempfixtureMemberเปิดพร้อมสองeventและverifyก่อน/หลังtargetscope;accountpositivecontrols;ไม่อ้างroundชนิดที่schemaไม่มี|
|R51-02|medium|V3-A03 sends five wrong passwords before its first correct-password probe. It therefore cannot distinguish the specified fifth-failure lock from an incorrect lock after four failures. Another account logging in does not control that exact threshold.|A03แยก4ผิด+รหัสถูกกับ5ผิด/ก่อนปลด1ms/ตรงขอบ15min|
|R51-03|medium|V3-A12 makes the ahead=3 case optional ("ถ้าจะตรวจ") while its mandatory ahead=2/ETA120 case cannot distinguish ceil(ahead/2) from floor(ahead/2): both yield 120. Its wrongAlternative claiming floor gives ETA0 is incorrect for the supplied ahead=2 data.|A12บังคับahead3/ETA240;wrongfloor120 แก้ค่าผิดในแผน|
|R51-04|high|V3-A59 resets the fixture for the TTL branch and only creates two active users. It does not recreate a waiting fan3 or issue any verified membership grant before "อ่านpromotionและลองใช้grantเก่า". Promotion is then untestable and a denial cannot prove revocation of a previously valid grant.|A59แยกTTLfixtureมีgrantจริง+waitingจริงก่อน899.999/900s|
|R51-05|medium|V3-A45 claims organizer owner isolation, but its explicit organizer-action negatives are buyer/anonymous/scanner. It never asks the an authenticated organizer who does not own the target event to perform those actions. A role-only organizer gate can pass those negatives and the correct-owner control.|A45ให้foreignorganizerแก้event/seat/refundจริงและอ่านbefore/after;ownerทำได้|
|R52-01|P2|V3-A54 labels a 254-character address as valid although its local part contains 247 characters. This combines total-length and email-format validity, so a correct format validator may reject the positive control and appear defective.|A54ใช้email254ที่local64/labels<=63และnegative255ต่าง1อักษร แก้ทั้งแผนและtest|
|R52-02|P2|V3-A43 JSON adds an admission/oracle-blocked escape absent from Markdown and leaves General admission dependent on an unspecified controlled fixture. The assigned cross-round API regression is authorized; FR02 account visibility alone does not establish an eligibility prohibition. Different runners may skip the decisive same-account quota test or run different scenarios.|A43ระบุsamefan GeneralAPIหลัง15ตามAT06;ลบblockedescape ไม่แต่งUI|
|R52-03|P2|V3-A57 pauses/cancels Aurora before establishing an active buyer queue; V3-U22 only says fan can become active and logs fan in after pausing. Their direct hold negative checks can therefore pass because queue/grant admission is missing, even if the server wrongly accepts new holds for an already admitted buyer after pause/cancel.|A57/U22active+grantก่อนpause/cancel ตรวจSALE_UNAVAILABLEและsideeffects|
|R53-01|P1|V3-A30 masks the exact grace-boundary detector. Before sending arrival=expiry+120s, fan2 already owns C01. An implementation using arrivedAt<=expiry+120s still auto-refunds because the independent seat-ownership condition fails. Therefore the prediction that A30 detects the inclusive-arrival bug is not supported by its flow.|A30เพิ่มcomponentretainedhold/seatที่720sแยกHTTPsweep/resaleguard พร้อมzeroorders|
|R53-02|P2|V3-A36 tests buyer scan and wrong-event scan only after concurrent gate requests have consumed the code. A missing role/event guard can still return used and satisfy a generic denial. This does not independently establish the required role/event restrictions.|A36ตรวจrole/eventก่อนใช้บัตรและอ่านticketvalidก่อนscanคู่|
|R53-03|P2|V3-A38 expects blocked C02 cannot be held, but its only later hold attempt is C03 after pause. That denial is explained by pause and cannot detect an ignored seat block. AP04 also requires new queue entry to be denied during pause, which this card does not attempt.|A38แยกblockedC02ก่อนpause/รักษาholdเดิม และnewjoinระหว่างpause|
|R53-04|P2|V3-A31/A40/A53 add protocol-specific or validation assertions not defined in REQUIREMENTS/TEST-DATA: future-paidAt must return controlled4xx and remain pending;17000-character body must be rejected absent a documented limit; malformed syntax400/unsupported type415. D specifies financial timing and input/body protection, but not these exact response contracts or the numeric body threshold. A31 also fails to state the exact payment/hold state after each invalid callback despite promising to read it.|ประกาศAT01–03สำหรับprotocol/bodybytes;A31ตรวจpending/amount/refund0/hold/noorder/mailหลังreject|

## Coverage matrix: ฟีเจอร์ × 6 เทคนิค
EC=แบ่งกลุ่ม,BVA=ค่าขอบ,DT=ตารางเงื่อนไข,ST=สถานะ,UC=กรณีใช้งาน,EG=คาดข้อผิดพลาด/แข่ง/replay/security. นับจากtechniquesในการ์ด แถวทับกันได้เมื่อcaseอ้างหลายFR จึงห้ามบวกทุกช่องเป็นจำนวนtests. 0⚠️แสดงว่ายังไม่มีเทคนิคนั้น ไม่แปลว่าทุกช่องจำเป็นกับทุกfeature

|ฟีเจอร์|EC|BVA|DT|ST|UC|EG|
|---|---:|---:|---:|---:|---:|---:|
|บัญชี|0⚠️|3|3|5|2|0⚠️|
|รายการงาน|5|5|4|7|3|1|
|คิว/สมาชิก|3|9|5|14|4|3|
|ที่นั่ง/โควตา|8|8|5|10|2|4|
|ผู้ซื้อ/ผู้ถือ|6|2|4|6|9|1|
|ราคา/สรุป|2|7|3|12|5|3|
|ชำระเงิน|7|6|2|17|7|2|
|บัตร/อีเมล|7|0⚠️|6|18|9|1|
|ตรวจบัตร|2|2|2|2|1|3|
|ผู้จัด/คืนเงิน/regression|4|4|8|18|4|3|
|ข้อมูล/fixture/migration|2|1|0⚠️|0⚠️|2|2|

## Traceability และสถิติ
trace45ข้อกำหนดใน [TEST-PLAN](TEST-PLAN.md) และ [JSON](plan/traceability.json) ทุกBRมีtest;R03เอกสารแก้แล้ว,R15นโยบายใช้AP01–05,R17UXส่งต่อเป็นข้อเสนอไม่ปลอมเป็นbusinessdefect. รายกรณีที่เพิ่มcontrolมีreviewFixesกำกับJSON. ฉบับก่อนแก้เก็บplan/before-reviewและไม่ใช้เป็นoracleของรอบfinal

|ระดับ|จำนวนการ์ดหลังแก้|
|---|---:|
|P1|87|
|P2|2|
|P3|0|

ข้อจำกัด: เป็นAI-assisted peer review ไม่ใช่การตรวจรับอิสระภายนอก;ไม่มีreviewซ้ำหลังแก้ตามโจทย์ แต่ตรวจschema/trace/frozenhashและรันautomationจริง ไม่อ้างว่า89caseพิสูจน์ทุกbranch
