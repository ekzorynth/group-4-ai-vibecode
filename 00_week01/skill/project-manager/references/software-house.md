# งาน PM ในบริษัทรับพัฒนาซอฟต์แวร์

## รับงานจากฝ่ายขายและกำหนดอำนาจตัดสินใจ

ตรวจ TOR, proposal, SOW และสัญญาฉบับที่มีผลว่าตรงกันหรือไม่ แยกข้อเสนอออกจากสิ่งที่ลูกค้ายอมรับแล้ว
บันทึกสิ่งที่ Sales เคยสัญญา ข้อยกเว้น งวดชำระ เงื่อนไขตรวจรับ สิทธิ์ใช้งาน code และบริการบุคคลที่สามที่เกี่ยวข้อง
ถ้าไม่พบหลักฐานให้บันทึกเป็นช่องว่างที่ต้องยืนยันก่อน commit ไม่ตีความว่าเงื่อนไขนั้นไม่มี

กำหนดผู้มีอำนาจรับรอง requirement, เปลี่ยน scope, อนุมัติงบ, รับ UAT และ go-live ทั้งฝั่งบริษัทและลูกค้า
แยก Account/Sales (สัญญาและการค้า), BA (requirement), SA/Tech Lead (เทคนิค/estimate), Dev (พัฒนา),
QA (ผลทดสอบ), DevOps (deployment/operation), PM (บูรณาการส่งมอบ) และผู้แทนลูกค้า (ตัดสินใจ/ตรวจรับ)
PM ไม่ใช่ผู้รับผิดชอบงานเทคนิคทั้งหมดและไม่อนุมัติแทนลูกค้าโดยปริยาย

## คุม scope และ capacity

ทำ traceability แบบ requirement ID → deliverable → work item → test evidence → ผู้ตรวจรับ
ระบุ dependency ฝั่งลูกค้า: API specification, sandbox, credential ผ่านช่องทางที่อนุญาต, ข้อมูลทดสอบ,
SSO/LINE account, network/security approval และเวลาที่ผู้ใช้จะเข้าร่วม UAT
ทุก dependency มี needed-by date, owner, ผลหากช้า และแผนสำรอง โดยไม่ใส่ credential จริงในรายงาน

Capacity ต้องหักโครงการอื่น วันลา ประชุม support และงานแก้ defect ตามข้อมูลที่มี
แยก effort ของ BA/SA, Dev, QA, DevOps และ PM รวม integration, rework และ release ไม่ประเมินเฉพาะ coding
ใช้ sprint เพื่อควบคุมการทำงานได้ แต่ไม่ถือว่า sprint review เป็นการตรวจรับตามสัญญาอัตโนมัติ

## ต้นทุน การวางบิล และกำไร

- Fixed price: ติดตาม actual cost, estimate to complete (ETC), estimate at completion (EAC) และ scope growth
- Time and materials: ติดตาม timesheet ที่อนุมัติ อัตราตามสัญญา เพดาน budget และชั่วโมงที่ยังไม่ billable
- Retainer: ตรวจ capacity ที่ซื้อไว้ การใช้จริง งานค้าง และเงื่อนไขยกยอดตามสัญญา
- EAC = actual cost + ETC; remaining budget = approved cost budget − EAC
  ถ้ายังไม่มี cost budget หรือ ETC ให้รอยืนยัน ห้ามตั้งค่าเป็นศูนย์
- Estimated gross margin = (รายได้ตามข้อตกลง − EAC) / รายได้ตามข้อตกลง × 100
  ใช้ฐาน VAT และนิยามต้นทุนที่ตรงกัน ตรวจรายได้มากกว่าศูนย์ และอย่าใช้ TOR ceiling แทน contract revenue
- แยก invoice issued, payment due, cash received และการรับรู้รายได้ ไม่ใช้แทนกัน
  การรับรู้รายได้เป็นเรื่องให้ Finance ยืนยัน ไม่ให้ PM สรุปจากการวางบิลอย่างเดียว
- แสดง milestone ส่งมอบ / หลักฐานรับงาน / trigger วางบิล / จำนวนเงิน / due date ตามสัญญา
  ถ้าไม่มีเงื่อนไขงวดเงิน ให้ระบุว่ายังทำ cash-flow forecast ที่เชื่อถือไม่ได้

## คำขอเปลี่ยนแปลงและ defect

เทียบคำขอกับ baseline ก่อน: ถ้าเป็นการทำให้ตรง requirement เดิม ให้จัดเป็น defect หรือ scope gap พร้อมวิเคราะห์
ถ้าคำขอเปลี่ยน requirement จริง ค่อยทำ CR รวม BA/SA, Dev, QA, regression, security, deployment, เอกสาร และ training
ระบุ effort/cost/time/risk ที่เพิ่มพร้อม confidence และเจ้าของ estimate
งานเพิ่มที่ยังไม่อนุมัติแยกจาก baseline; ถ้าจำเป็นให้เสนอ time-boxed investigation พร้อมอำนาจอนุมัติที่ชัดเจน

## QA UAT และ go live

แยกสถานะ dev complete, code review, QA pass, SIT pass, UAT accepted และ production released
ระบุ defect severity ตามเกณฑ์โครงการ จำนวน defect ต้องมีวันที่/แหล่งข้อมูล ห้ามอ้างว่าทดสอบผ่านถ้าไม่มีผลจริง
Security/performance test และ data migration เป็น gate ตาม SOW/TOR หากมี ไม่ตัดออกเพื่อให้ทันวัน
UAT ต้องมีผู้ทดสอบ test case, test data, environment, entry/exit criteria และผู้ลงนามรับงาน
ข้อเสนอเกณฑ์ใหม่ต้องติดป้ายว่ารออนุมัติ ไม่ยกระดับเป็นข้อผูกพันโดยพลการ

Go-live readiness ครอบคลุม release artifact/version, approval, backup, rollback ที่ตรวจสอบแล้ว,
monitoring, support roster, customer communication และเงื่อนไข abort ที่เหมาะกับระบบ
ผลเป็น Ready / Conditional / Not ready / รอยืนยัน พร้อมหลักฐานของแต่ละ gate
PM ประสานการตัดสินใจ ไม่ปล่อย production เองจากคำขอทำรายงาน

## ส่งต่อ support warranty และ MA

ส่งมอบ runbook, known issues, license/renewal, ownership, access handover ที่ไม่เผย secret และช่องทาง incident
ระบุวันเริ่ม warranty/MA จากเงื่อนไขสัญญา SLA response กับ resolution ต้องแยกกัน
ระบุผู้รับงาน support เวลาบริการ escalation และหลักฐานยอมรับ handover
ปิดโครงการเมื่อเกณฑ์ครบตามสัญญา พร้อมรายการงานคงค้างและเจ้าของ ไม่ปิดเพียงเพราะขึ้น production

## เลือกรูปแบบรายงาน

- ผู้บริหารภายใน: forecast, ต้นทุน/EAC/margin, capacity ข้ามโครงการ, ความเสี่ยงและ decision
- ลูกค้า: deliverable, milestone, งานที่ต้องให้ลูกค้าช่วย, defect/UAT, change decision และ next steps
- ก่อนเริ่มหรือก่อนชนะงาน: readiness/gap report ระบุสิ่งที่ยืนยันแล้วและสิ่งที่ยังไม่มีข้อมูล
  ไม่สร้าง % complete, actual cost หรือผลทดสอบขึ้นมาเอง
