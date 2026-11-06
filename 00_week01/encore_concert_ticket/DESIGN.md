# ENCORE — System Design

## Architecture
NodeHTTP localhost + SQLiteWALแบบเดิม; เพิ่มsales.mjsตรวจตารางรอบ/membergrant/contact; delivery.mjsสร้างQRและMIMEemailทดลองด้วยqrcode (ไม่ต่อproviderภายนอก)

```mermaid
flowchart LR
 B[Buyer browser] --> AUTH[Username / Session]
 AUTH --> Q[Queue per event / round]
 Q --> M[Member number validation]
 M --> MAP[Seat map / Hold]
 Q -->|General| MAP
 MAP --> C[Buyer + per-ticket holder data]
 C --> P[4-method Payment simulator]
 P --> TX[Atomic confirmation]
 TX --> T[Named tickets + opaque QR]
 TX --> E[Email sandbox outbox]
 T --> G[Gate scan once]
```

## Data / Migration
คงusers/sessions/events/holds/seats/payments/orders/tickets/refunds/notifications/auditเดิม
เพิ่มusers.username UNIQUE; queues.round; holds.roundและcheckoutJSON; payments.method; tickets.holderJSON โดยตรวจPRAGMAtable_infoก่อนALTER ไม่ล้างข้อมูลเดิม
เพิ่มmemberships(number,user,status,valid_until), sale_rounds(event,kind,start,end), member_grants(user,event,expires), mail_outbox(order_idUNIQUE,user,recipient,status,created)
Membershipstatusเป็นคนละส่วนกับloginaccount; registerไม่มีสิทธิ์ตั้งmemberหรือrole; seedมีfan/fan2/fan3ให้ทดสอบจริง

## Sale state
เก็บUTC แสดงAsia/Bangkok; NEONMember6พ.ย.10:00–ก่อน15:00 General15:00ถึงวันปิดงาน; roundอื่นMemberเริ่มตามsaleเดิม5ชม.แล้วGeneral
queueเปิดก่อนstart15นาทีแต่pumpเฉพาะstart<=now<end; active2/round/งาน; TTL900sclamproundend; numberจากseqไม่เปลี่ยน; ahead+ETAเป็นประมาณ ไม่ใช่SLA
Expiredqueueและholdถูกsweepก่อนทุกAPI; หน้ารอpoll2sอัตโนมัติ; catalogrefresh30sเมื่อไม่ได้เปิดbooking

## Member gate
1. loginแล้วjoinMember ต้องmembershipactiveและvalid_until>now ไม่ผ่าน403ข้อความตรง“ไม่ใช่สมาชิกMember”
2. ถึงคิวให้ส่งnumber; ตรวจaccountเป็นเจ้าของเลข/คิวactive/รอบเปิด
3. ตรวจถูกแล้วUIเรียกGETseatsและเข้าผังทันที ไม่แสดงsuccesspageและไม่ต้องกดปุ่มซ้ำ; grantผูกuser+event expires=min(queueexpires,roundend,membervaliduntil)
4. GETmapและPOSTholdตรวจgrantซ้ำที่server; ลิงก์ตรงหรือแก้JavaScriptข้ามไม่ได้
5. Generalไม่ต้องกรอกnumberแต่ต้องactivequeueก่อนhold

## Hold / Checkout / Money
BEGINIMMEDIATEทำholdatomicทั้งbasket; Memberboughtยังไม่refunded+holdใหม่<=2; globalทุกround<=4; หนึ่งactivebasketต่อaccount
holdexpires=min(now600s,roundend,MembervalidUntil); ไม่ยืดด้วยUI; checkoutเฉพาะheldเก็บsnapshotbuyerและholdersที่จับคู่seatครบ; pending/paidแก้ไม่ได้
สูตรเงินบาทเต็มเดิมและallocationรายใบคงเดิม; อ้างTEST-DATAค่าคงที่

## Payment and email
```mermaid
sequenceDiagram
 participant U as Buyer
 participant A as API
 participant DB as SQLite
 U->>A: POST checkout (buyer + each holder)
 A->>DB: validate + save snapshot
 U->>A: POST pay (method, pending)
 A->>DB: create pending attempt
 A-->>U: demo reference + deadline + instructions
 U->>A: simulator resolve approved
 A->>DB: transaction check ownership/time/amount/seat
 A->>DB: order UNIQUE hold + tickets + mail_outbox UNIQUE order + audit
 A-->>U: succeeded
 U->>A: GET mailbox / EML / ticket QR
 A-->>U: owner-only named tickets with real QR
```
qrcodeสร้างSVG/PNG encode256bittoken ไม่ใส่ชื่อ/email/phoneในpayload ชื่ออยู่บนบัตรและemailhtml
QRชำระencodeENCORE-DEMO-PAY:paymentId ไม่ใช่PromptPayเงินจริง; CreditCardไม่รับPAN/CVVจริง; Counterมีรหัสทดลองและdeadlineเท่าhold
เงินมาช้าใช้grace120sเดิม -> auto_refundedไม่มีorder/ticket/email ไม่แย่งseatที่คืนแล้ว; failedretryใช้attemptใหม่; terminalcallback/replayไม่ส่งซ้ำ
Outboxเป็นlocalinbox ไม่มีSMTP/networkออก ข้อความemailมีbuyerrecipientและticketทุกใบ สร้าง.emlmultipart/relatedพร้อมQRPNGที่อ่านได้ เหมาะกับโหมดที่ผู้ใช้เลือก

## Legacy and invariants
รายการที่ holder=NULL ต้องแสดงตามข้อมูลที่มี ไม่สร้างชื่อผู้ถือหรืออีเมลย้อนหลังเมื่อไม่มีข้อมูลผู้ซื้อ การปรับ schema ต้องรักษาข้อมูลในไฟล์ฐานข้อมูล encore-v2.sqlite ซึ่งเป็นชื่อไฟล์ที่ระบบใช้งาน
Owner-onlyทุกQR/mail/payment; escapePIIในHTML; session/token/passwordprotectionsเดิม; refund/scan/cancelยังใช้transactionและสถานะเดิม
ไม่ใช่ระบบรับเงินจริง/ส่งemailจริง ไม่มีproviderwebhook/กล้องอ่านQRในเว็บ (นำpayloadที่อ่านจากQRมากรอกscanner); decoderทดสอบอิสระด้วยjsQR

## Docker Compose
Dockerfileใช้Node22slim ติดตั้งเฉพาะruntime dependenciesแล้วรันเป็นnodeuid1000; APIรองรับHOSTenv (default127.0.0.1บนเครื่อง และ0.0.0.0ในcontainer)
compose.yamlเปิด127.0.0.1:4310→4310และnamedvolumeencore-dataเก็บSQLite/WAL; healthcheckใช้Nodefetchไม่ต้องติดตั้งcurl
.dockerignoreกันฐานข้อมูล/secrets/dependencies/ผลทดสอบ/ภาพอ้างอิงไม่เข้าbuildcontext; defaultไม่เปิดtesttools; LIVE_CLOCK0เป็นdemoและปรับได้
การทดสอบจริงและขอบเขตดูDOCKER-VERIFICATION.md

## Account-specific catalog / theme
GETeventsระบุschedule/saleRound/status/limitตามregistryของbuyer: activeMember→Member Sale, General→General Sale; public/organizerยังเห็นสองรอบ ข้อมูลอื่นจากaccountไม่ปะปนและGeneralAPIgateยังบังคับmemberstatus
UIโหลดcatalogใหม่เมื่อlogin/logout แสดงaudienceชัดและมีdemoaccountgeneralแยก เฟรมเว็บเป็นพื้นสว่าง แถบ/ปุ่มฟ้านุ่ม รูปposterคงสีแต่ลดความจัด

## แผนภาพเพิ่มเติมตาม LAB 3
Node + SQLite ในcontainerเดียวเป็นadaptationตามระบบที่มีอยู่ ไม่เพิ่มPostgreSQLเพื่อเลียนแบบสปา ไฟล์SQLอยู่db/schema.sql

### architecture
![ภาพแผนภาพ](design/architecture.svg)

[Mermaid source](design/architecture.mmd)
```mermaid
flowchart LR
 Buyer[ผู้ซื้อ Member / General] --> Browser[Browser HTML CSS JS]
 Organizer[ผู้จัดงาน] --> Browser
 Gate[เจ้าหน้าที่ตรวจบัตร] --> Browser
 Browser -->|HTTP same-origin / session cookie| API[Node HTTP API]
 API --> Auth[Authentication and role guards]
 API --> Sales[Schedule membership grant contacts]
 API --> Domain[Queue hold price payment refund scan]
 API --> Delivery[Ticket QR and MIME email sandbox]
 Auth --> DB[(SQLite WAL)]
 Sales --> DB
 Domain -->|BEGIN IMMEDIATE transaction| DB
 Delivery --> DB
 DB --> Volume[Docker named volume]
 Test[Test-only clock reset simulator] -.->|TEST_MODE and token| API
 Provider[External payment / SMTP] -.not connected.-> API
```

### use-cases
![ภาพแผนภาพ](design/use-cases.svg)

[Mermaid source](design/use-cases.mmd)
```mermaid
flowchart LR
 Guest[ผู้เยี่ยมชม] --> UC01([ดู ค้นหา และแบ่งหน้าคอนเสิร์ต])
 Guest --> UC02([สมัครและเข้าสู่ระบบ])
 Buyer[ผู้ซื้อ] --> UC03([เข้าคิวและรอรับสิทธิ์])
 Member[สมาชิก] --> UC04([ยืนยันหมายเลขสมาชิก])
 UC04 -.เฉพาะรอบสมาชิก.-> UC03
 Buyer --> UC05([เลือกโซนและที่นั่ง])
 UC05 --> UC06([กรอกผู้ซื้อและผู้ถือบัตรทุกใบ])
 UC06 --> UC07([ตรวจยอดและเลือกช่องทางชำระ])
 UC07 --> UC08([รับ E-Ticket และอีเมลทดลอง])
 Buyer --> UC09([ขอคืนเงินบางใบ])
 Organizer[ผู้จัดงาน] --> UC10([จัดการเฉพาะงานตนเอง])
 UC10 --> UC11([พัก เปิด ยกเลิกงาน หรือระงับที่นั่ง])
 UC10 --> UC12([พิจารณาคืนเงินและดูยอดสุทธิ])
 Scanner[เจ้าหน้าที่] --> UC13([ตรวจ QR และยืนยันเข้างานครั้งเดียว])
 UC05 -.ต้องมีคิว active.-> UC03
 UC05 -.สมาชิกต้องมี grant.-> UC04
```

### booking-flow
![ภาพแผนภาพ](design/booking-flow.svg)

[Mermaid source](design/booking-flow.mmd)
```mermaid
flowchart TD
 A[เปิดเว็บไซต์และเลือกงาน] --> B{เข้าสู่ระบบแล้วหรือไม่}
 B -->|ยัง| C[เข้าสู่ระบบหรือสมัคร]
 C --> D[ตรวจรอบขายและสิทธิ์บัญชี]
 B -->|แล้ว| D
 D --> E{เข้ารอบนี้ได้หรือไม่}
 E -->|ไม่ได้| F[แจ้งเหตุผล ไม่เปิดการจอง]
 E -->|ได้| G[เข้าคิว FIFO]
 G --> H{ถึงคิวและเปิดขายแล้วหรือไม่}
 H -->|ยัง| I[แสดงเลขคิว คนก่อนหน้า เวลาประมาณ]
 I --> H
 H -->|ถึงแล้ว| J{รอบสมาชิกหรือไม่}
 J -->|ใช่| K[ตรวจหมายเลขสมาชิกของบัญชีนี้]
 K --> L{ผ่านหรือไม่}
 L -->|ไม่ผ่าน| K
 L -->|ผ่าน| M[เข้าสู่ผังทันที]
 J -->|ทั่วไป| M
 M --> N[เลือกที่นั่งและยืนยัน hold สูงสุด 10 นาที]
 N --> O[ตรวจข้อมูลผู้ซื้อและผู้ถือรายใบ]
 O --> P[สรุปราคาและเริ่มชำระทดลอง]
 P --> Q{ผลชำระ}
 Q -->|รอ| R[รอผลโดยไม่ออกบัตร]
 R --> Q
 Q -->|ไม่สำเร็จ| S[ลองใหม่ภายในเวลาจอง]
 S --> P
 Q -->|เงินช้า หรือสิทธิ์หมด| T[คืนเงินทดลอง ไม่ออกบัตร]
 Q -->|สำเร็จ| U[สร้าง order tickets outbox ใน transaction เดียว]
 U --> V[ดู QR และอีเมลทดลองเฉพาะเจ้าของ]
```

### erd
![ภาพแผนภาพ](design/erd.svg)

[Mermaid source](design/erd.mmd)
```mermaid
erDiagram
 USERS ||--o{ SESSIONS : authenticates
 USERS ||--o| MEMBERSHIPS : owns
 USERS ||--o{ EVENTS : organizes
 EVENTS ||--|{ SALE_ROUNDS : schedules
 EVENTS ||--|{ SEATS : contains
 USERS ||--o{ QUEUES : joins
 EVENTS ||--o{ QUEUES : serves
 USERS ||--o{ MEMBER_GRANTS : receives
 EVENTS ||--o{ MEMBER_GRANTS : authorizes
 USERS ||--o{ HOLDS : reserves
 EVENTS ||--o{ HOLDS : books
 HOLDS ||--o{ PAYMENTS : attempts
 HOLDS ||--o| ORDERS : confirms
 USERS ||--o{ ORDERS : purchases
 ORDERS ||--|{ TICKETS : issues
 TICKETS ||--o| REFUNDS : requests
 ORDERS ||--o| MAIL_OUTBOX : delivers
 USERS ||--o{ NOTIFICATIONS : receives
 EVENTS ||--o{ AUDIT : records
 USERS {

 string id PK
 string email UK
 string username UK
 string password
 string role
 }
 SESSIONS {

 string token PK
 string user FK
 int expires
 }
 MEMBERSHIPS {

 string number PK
 string user FK,UK
 string status
 int valid_until
 }
 EVENTS {

 string id PK
 string owner FK
 string state
 string data
 }
 SALE_ROUNDS {

 string event PK,FK
 string kind PK
 int start
 int end
 }
 SEATS {

 string event PK,FK
 string id PK
 string hold FK
 int price
 int sold
 int blocked
 }
 QUEUES {

 int seq PK
 string user FK
 string event FK
 string round
 string status
 int expires
 }
 MEMBER_GRANTS {

 string user PK,FK
 string event PK,FK
 int expires
 }
 HOLDS {

 string id PK
 string user FK
 string event FK
 string round
 string status
 string seats
 string checkout
 int expires
 }
 PAYMENTS {

 string id PK
 string hold FK
 string method
 string status
 int amount
 int paid_at
 int refund_amount
 }
 ORDERS {

 string id PK
 string user FK
 string hold FK,UK
 int created
 }
 TICKETS {

 string id PK
 string order_id FK
 string event FK
 string seat
 string code UK
 string holder
 string status
 int net
 int fee
 int vat
 }
 REFUNDS {

 string id PK
 string ticket FK,UK
 int amount
 string status
 string reason
 }
 MAIL_OUTBOX {

 string id PK
 string user FK
 string order_id FK,UK
 string recipient
 string status
 }
 NOTIFICATIONS {

 string id PK
 string user FK
 string message
 }
 AUDIT {

 string id PK
 string actor
 string event FK
 string action
 string target
 }
```

### payment-sequence
![ภาพแผนภาพ](design/payment-sequence.svg)

[Mermaid source](design/payment-sequence.mmd)
```mermaid
sequenceDiagram
 actor Buyer as ผู้ซื้อ
 participant UI as Browser
 participant API as Node API
 participant DB as SQLite
 Buyer->>UI: ยืนยันที่นั่งและข้อมูลผู้ถือ
 UI->>API: POST holds / checkout
 API->>DB: ตรวจคิว grant quota และที่นั่งใน transaction
 API-->>UI: hold + ราคาจาก server + expires
 Buyer->>UI: เลือกช่องทางและชำระทดลอง
 UI->>API: POST pay pending
 API->>DB: payment attempt + frozen checkout
 API-->>UI: reference / deadline
 Buyer->>UI: ยืนยันผลชำระจากผู้ให้บริการทดสอบ
 UI->>API: POST payments/resolve
 API->>DB: BEGIN IMMEDIATE และ ตรวจ owner / เวลา / ที่นั่ง
 alt เคยสำเร็จแล้ว
 DB-->>API: order เดิม
 else ผ่านเงื่อนไข
 API->>DB: INSERT order UNIQUE hold
 API->>DB: INSERT tickets + mail_outbox UNIQUE order
 API->>DB: UPDATE payment + seats และ COMMIT
 else เงินมาช้า หรือสิทธิ์ไม่ครบ
 API->>DB: auto refund และ ไม่ออกบัตร
 end
 API-->>UI: status และ order
 UI->>API: GET orders / mailbox / ticket-qr
 API-->>UI: เฉพาะเจ้าของรายการ
```

### seat-race-sequence
![ภาพแผนภาพ](design/seat-race-sequence.svg)

[Mermaid source](design/seat-race-sequence.mmd)
```mermaid
sequenceDiagram
 participant A as ผู้ซื้อ A
 participant B as ผู้ซื้อ B
 participant API as API
 participant DB as SQLite WAL
 A->>API: จอง C01
 B->>API: จอง C01 พร้อมกัน
 API->>DB: BEGIN IMMEDIATE สำหรับ A
 API->>DB: C01 ว่าง → สร้าง hold A
 API->>DB: COMMIT
 API-->>A: 201 hold สำเร็จ
 API->>DB: BEGIN IMMEDIATE สำหรับ B
 API->>DB: C01 ถูกถือโดย A
 API->>DB: ROLLBACK
 API-->>B: 409 เลือกที่นั่งใหม่
 Note over A,B: ไม่เกิดสอง hold ที่ใช้งานได้บนที่นั่งเดียวกัน
```

holds.seats/checkoutและtickets.holderเป็นJSONsnapshot ไม่ใช่FKแยกรายที่นั่ง; failures/attemptsบันทึกชื่อที่ไม่มีบัญชีได้จึงไม่ผูกusersFK
