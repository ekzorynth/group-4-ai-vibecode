# Test Plan — ENCORE V3

Oracle: [U]คำสั่งผู้ใช้ในREQUIREMENTS > [A]รายละเอียดที่ตกลงใช้ > TEST-DATAคำนวณเงิน > [R]เว็บอ้างอิง ไม่ใช้ผลบนUIเป็นexpected
API4311/UI4312 in-memory; migration/restart4314temporaryfile; resetก่อนทุกข้อ; ไม่ล้าง4310
เวลาเริ่ม6พ.ย.2569 10:00ไทย; ข้อมูลMember/Generalและผลเงินอยู่TEST-DATA; methodsเป็นsandboxตามคำตอบผู้ใช้
เกณฑ์: P1ผ่านทั้งหมดและรวม>=95%; ผลที่ไม่ได้รันต้องBlocked ไม่อ้างV2

## Cases
แต่ละชื่อเป็นเงื่อนไขและผลที่ต้องยืนยัน ขั้นตอนละเอียด/assertอยู่e2e/api.test.mjsและui.spec.js ค่าเงิน/ขอบเวลาในTEST-DATAและBRเป็นauthority

| Case | Priority | Scenario / Acceptance | Trace |
|---|---|---|---|
| V3-A01 | P1 | username registration, case duplicates, validation and role injection | FR01 BR01 |
| V3-A02 | P1 | username and legacy email login, cookie rotation and logout | FR01 NFR02 |
| V3-A03 | P1 | session 24h and five-login lockout exact boundaries | FR17 BR20 |
| V3-A04 | P2 | catalog twelve maps and explicit Member/General schedules | FR02 FR07 BR02 BR03 |
| V3-A05 | P1 | anonymous cannot queue or read Member map | FR03 FR05 BR05 |
| V3-A06 | P1 | General rejected by Member queue/map/hold with exact Thai message | FR03 FR06 BR05 |
| V3-A07 | P1 | expired membership exactly at valid_until denied | FR06 BR07 |
| V3-A08 | P1 | before queue: Member map and forged hold both blocked | FR05 BR07 |
| V3-A09 | P1 | correct membership unlocks map, wrong and other owner number do not | FR05 FR06 BR07 |
| V3-A10 | P1 | grant scoped to account and event, queue expiry revokes access | FR05 FR06 BR07 |
| V3-A11 | P1 | prequeue fifteen minutes, fixed number, no admission before sale | FR04 BR04 BR06 |
| V3-A12 | P1 | FIFO two slots shows ahead and ETA; leaves promote in order | FR04 BR06 |
| V3-A13 | P1 | Member closes and General opens exactly 15:00 without admin toggle | FR02 FR03 BR03 BR20 |
| V3-A14 | P1 | Member two seats per user cumulative, multidevice cannot bypass | FR08 BR08 |
| V3-A15 | P1 | Member 0/3 duplicates sold invalid and all-or-nothing | FR07 FR08 BR08 |
| V3-A16 | P1 | race same seat only one hold, same ID across events isolated | FR07 NFR03 |
| V3-A17 | P1 | canonical price, allocation, coupon cap and tampered total | FR10 BR12 |
| V3-A18 | P1 | hold exact600s, reload recovery and closing releases | FR10 FR17 BR09 |
| V3-A19 | P1 | checkout mandatory and data ownership enforced | FR09 BR11 |
| V3-A20 | P1 | validate buyer and each holder name email phone and exact seat count | FR09 BR10 BR11 |
| V3-A21 | P1 | checkout freezes after pending; contact snapshot retained cross-device | FR10 FR15 BR19 |
| V3-A22 | P1 | payment channel qr pending instructions then named ticket and email | FR11 FR12 FR13 FR14 BR13 BR14 BR18 |
| V3-A23 | P1 | payment channel seven_eleven pending instructions then named ticket and email | FR11 FR12 FR13 FR14 BR13 BR14 BR18 |
| V3-A24 | P1 | payment channel credit_card pending instructions then named ticket and email | FR11 FR12 FR13 FR14 BR13 BR14 BR18 |
| V3-A25 | P1 | payment channel alipay pending instructions then named ticket and email | FR11 FR12 FR13 FR14 BR13 BR14 BR18 |
| V3-A26 | P1 | invalid method and client amount rejected/ignored respectively | FR11 BR13 |
| V3-A27 | P1 | declined retry new attempt; duplicate success creates one order/mail | FR12 FR15 BR15 |
| V3-A28 | P1 | pending cannot release/reselect; timely callback in grace succeeds | FR12 BR09 BR16 |
| V3-A29 | P1 | late paidAt at expiry refunds with no email/ticket | FR12 BR16 |
| V3-A30 | P1 | grace exact end releases seat; callback cannot steal resale | FR12 BR16 |
| V3-A31 | P1 | wrong amount/future callback does not finalize | FR12 BR13 BR16 |
| V3-A32 | P1 | actual ticket QR independently decodes to opaque code without PII | FR13 BR17 NFR04 |
| V3-A33 | P1 | QR/payment/mail owner isolation and eml embedded QR attachment | FR13 FR14 FR15 BR17 BR18 NFR02 |
| V3-A34 | P1 | two holders distinct names and buyer email receives both tickets | FR09 FR13 FR14 BR11 BR18 |
| V3-A35 | P1 | partial refund restores seat and Member quota only after approval | FR17 BR08 |
| V3-A36 | P1 | scanner uses QR code once, returns holder name; wrong role denied | FR16 BR17 |
| V3-A37 | P1 | refund pending blocks scanning, refund cutoff exact boundary | FR17 |
| V3-A38 | P1 | organizer scope, pause/block and automatic round cannot be bypassed | FR17 BR20 |
| V3-A39 | P1 | cancel full refund idempotent, no extra tickets or mail | FR17 |
| V3-A40 | P1 | Origin, body, malformed IDs and test tools protected | FR18 NFR02 NFR07 |
| V3-A41 | P1 | additive migration and restart preserve legacy order, then V3 order/email | FR17 FR18 NFR05 |
| V3-A42 | P1 | real V2 schema upgraded additively without losing legacy tickets | FR17 FR18 NFR05 |
| V3-A43 | P1 | Member quota two counts toward General total four across sale rounds | FR08 BR08 |
| V3-A44 | P1 | account catalog scopes round schedules, status and availability by audience | FR02 FR03 BR03 BR05 |
| V3-U01 | P1 | Member invalid/valid number, two named tickets, payment retry and email E-Ticket | FR01 FR05 FR06 FR07 FR08 FR09 FR10 FR11 FR12 FR13 FR14 FR15 BR05 BR07 BR08 BR11 BR12 BR15 NFR01 NFR02 |
| V3-U02 | P1 | General signs up, denied Member, joins General at15 with no membership input | FR01 FR02 FR03 BR01 BR03 BR05 |
| V3-U03 | P1 | mobile Member cap2 contact validation copy and QR demo | FR07 FR08 FR09 FR10 FR11 BR08 BR10 NFR01 |
| V3-U04 | P1 | Member queue has stable number, ahead, ETA and auto-enters verification | FR04 FR05 BR06 NFR06 |
| V3-U05 | P1 | pending and contact snapshots recover after reload | FR10 FR12 FR13 FR15 BR19 |
| V3-U06 | P1 | named ticket partial refund and organizer audit | FR17 BR08 |
| V3-U07 | P1 | gate scans ticket QR payload once and shows holder name | FR16 BR17 |
| V3-U08 | P2 | pagination all-event search and General new-event booking | FR02 FR07 NFR01 |
| V3-U09 | P1 | keyboard selection and close during reserve release late hold | FR07 NFR01 NFR03 |
| V3-U10 | P1 | automatic Member cutoff blocks pay, General opens at15 | FR02 FR12 BR03 BR09 |
| V3-U11 | P1 | payment qr completes sandbox email | FR11 FR12 FR14 BR13 BR18 |
| V3-U12 | P1 | payment seven_eleven completes sandbox email | FR11 FR12 FR14 BR14 BR18 |
| V3-U13 | P1 | payment credit_card completes sandbox email | FR11 FR12 FR14 BR13 BR18 |
| V3-U14 | P1 | payment alipay completes sandbox email | FR11 FR12 FR14 BR13 BR18 |
| V3-U15 | P1 | demo accounts separate Member and General sale views in calm theme | FR01 FR02 FR03 NFR01 |

## Requirement → Test
| Requirement | Tests |
|---|---|
| V3-FR01 | V3-A01, V3-A02, V3-U01, V3-U02, V3-U15 |
| V3-FR02 | V3-A04, V3-A13, V3-A44, V3-U02, V3-U08, V3-U10, V3-U15 |
| V3-FR03 | V3-A05, V3-A06, V3-A13, V3-A44, V3-U02, V3-U15 |
| V3-FR04 | V3-A11, V3-A12, V3-U04 |
| V3-FR05 | V3-A05, V3-A08, V3-A09, V3-A10, V3-U01, V3-U04 |
| V3-FR06 | V3-A06, V3-A07, V3-A09, V3-A10, V3-U01 |
| V3-FR07 | V3-A04, V3-A15, V3-A16, V3-U01, V3-U03, V3-U08, V3-U09 |
| V3-FR08 | V3-A14, V3-A15, V3-A43, V3-U01, V3-U03 |
| V3-FR09 | V3-A19, V3-A20, V3-A34, V3-U01, V3-U03 |
| V3-FR10 | V3-A17, V3-A18, V3-A21, V3-U01, V3-U03, V3-U05 |
| V3-FR11 | V3-A22, V3-A23, V3-A24, V3-A25, V3-A26, V3-U01, V3-U03, V3-U11, V3-U12, V3-U13, V3-U14 |
| V3-FR12 | V3-A22, V3-A23, V3-A24, V3-A25, V3-A27, V3-A28, V3-A29, V3-A30, V3-A31, V3-U01, V3-U05, V3-U10, V3-U11, V3-U12, V3-U13, V3-U14 |
| V3-FR13 | V3-A22, V3-A23, V3-A24, V3-A25, V3-A32, V3-A33, V3-A34, V3-U01, V3-U05 |
| V3-FR14 | V3-A22, V3-A23, V3-A24, V3-A25, V3-A33, V3-A34, V3-U01, V3-U11, V3-U12, V3-U13, V3-U14 |
| V3-FR15 | V3-A21, V3-A27, V3-A33, V3-U01, V3-U05 |
| V3-FR16 | V3-A36, V3-U07 |
| V3-FR17 | V3-A03, V3-A18, V3-A35, V3-A37, V3-A38, V3-A39, V3-A41, V3-A42, V3-U06 |
| V3-FR18 | V3-A40, V3-A41, V3-A42 |
| V3-BR01 | V3-A01, V3-U02 |
| V3-BR02 | V3-A04 |
| V3-BR03 | V3-A04, V3-A13, V3-A44, V3-U02, V3-U10 |
| V3-BR04 | V3-A11 |
| V3-BR05 | V3-A05, V3-A06, V3-A44, V3-U01, V3-U02 |
| V3-BR06 | V3-A11, V3-A12, V3-U04 |
| V3-BR07 | V3-A07, V3-A08, V3-A09, V3-A10, V3-U01 |
| V3-BR08 | V3-A14, V3-A15, V3-A35, V3-A43, V3-U01, V3-U03, V3-U06 |
| V3-BR09 | V3-A18, V3-A28, V3-U10 |
| V3-BR10 | V3-A20, V3-U03 |
| V3-BR11 | V3-A19, V3-A20, V3-A34, V3-U01 |
| V3-BR12 | V3-A17, V3-U01 |
| V3-BR13 | V3-A22, V3-A23, V3-A24, V3-A25, V3-A26, V3-A31, V3-U11, V3-U13, V3-U14 |
| V3-BR14 | V3-A22, V3-A23, V3-A24, V3-A25, V3-U12 |
| V3-BR15 | V3-A27, V3-U01 |
| V3-BR16 | V3-A28, V3-A29, V3-A30, V3-A31 |
| V3-BR17 | V3-A32, V3-A33, V3-A36, V3-U07 |
| V3-BR18 | V3-A22, V3-A23, V3-A24, V3-A25, V3-A33, V3-A34, V3-U11, V3-U12, V3-U13, V3-U14 |
| V3-BR19 | V3-A21, V3-U05 |
| V3-BR20 | V3-A03, V3-A13, V3-A38 |
| V3-NFR01 | V3-U01, V3-U03, V3-U08, V3-U09, V3-U15 |
| V3-NFR02 | V3-A02, V3-A33, V3-A40, V3-U01 |
| V3-NFR03 | V3-A16, V3-U09 |
| V3-NFR04 | V3-A32 |
| V3-NFR05 | V3-A41, V3-A42 |
| V3-NFR06 | V3-U04 |
| V3-NFR07 | V3-A40 |

การโยงครบหมายถึงมีscenarioอย่างน้อยหนึ่ง ไม่ใช่ทุกinput/ทุกUnicode/ทุกfailurebranch; ไม่มีSMTPจริง/paymentจริง/productionload/QRcamera/WCAGauditครบ QRตรวจด้วยjsQRอิสระไม่ใช้generatorตรวจตัวเอง; ภาพreferenceไม่ใช่หลักฐานUIของเรา
