# ENCORE API

JSONมีnowUTCms; error={error,message}; cookieHttpOnly/SameSite/24hเดิม, POSTOrigincheck/body16KB/session/RBACตามข้อกำหนดความปลอดภัย

| Method | Path | Contract |
|---|---|---|
| POST | /api/register | {username,email,name,password}; usernameไม่ซ้ำ/rolebuyer/defaultGeneral |
| POST | /api/login | {username,password}; usernameหรือemailเก่าได้; cookieใหม่ |
| GET/POST | /api/me / /api/logout | ข้อมูลตัวเอง/เพิกถอนsession |
| GET | /api/events | {events:[...,round,limit,schedule:[kind,start,end],saleRound]} |
| POST | /api/queue | {event,round?:member/general,action?:join/leave}→{queue:{number,status,ahead,estimated_wait_seconds,expires,starts,round,limit}} |
| GET | /api/queue?event=&round= | คิวเดิม+pumpFIFO; MemberGeneralguardเหมือนjoin |
| POST | /api/membership/verify | {event,number}→{verified,expires}; account/activequeue/Member/เลขตรง |
| GET | /api/seats?event= | Memberต้องgrantก่อน; Generalผังpublic; holdยังต้องlogin/queue |
| POST | /api/holds | {event,seats,coupon?}→{hold}; ตรวจMembergrant/2ใบและglobal4atomic |
| GET | /api/active-hold | holdพร้อมround/checkout/paymentของบัญชี |
| POST | /api/checkout | {hold,buyer:{name,email,phone},holders:[{seat,name,email,phone}]}→{hold} |
| POST | /api/pay | {hold,result:pending/approved/declined,method:qr/seven_eleven/credit_card/alipay}→status; checkoutrequired |
| GET | /api/payment?id= | owner-only{payment:{method,reference,amount,expires,qr_payload}} |
| GET | /api/payment-qr?id= | owner-onlydemoSVGQR encodeENCORE-DEMO-PAY:paymentId |
| POST | /api/payments/resolve | {payment,result:approved/declined}; simulatorใช้serveramount/time |
| GET | /api/orders | order/hold/tickets; ticket.holderเป็นJSONsnapshotหรือNULLlegacy |
| GET | /api/ticket-qr?id=&format=png | owner-onlySVG(default)/PNG; encodeopaque256bittoken |
| GET | /api/mailbox | {messages:[id,order_id,recipient,status,created]}owner-only |
| GET | /api/mail?id= | {mail:{subject,html,tickets,…}}owner-only safeescapedPII |
| GET | /api/mail.eml?id= | owner-onlyMIMEHTML+inlineQRPNG download |
| POST | /api/refunds | {ticket}; buyerown/cutoff/state |
| GET/POST | /api/admin/events / admin/dashboard / admin/event / admin/seats / admin/refunds | owner-onlyคงเดิม; manualroundoverrideปฏิเสธ ใช้schedule |
| POST | /api/scan | {event,code}→{ok,seat,status,holder}; assignedscanner/window/once |
| GET | /api/notifications | owner-only |
| POST | /api/test/reset / test/clock / test/callback | TEST_MODE+tokenเท่านั้น; isolatedDB |

Errorsสำคัญ: MEMBER_REQUIRED403ข้อความตรง“ไม่ใช่สมาชิกMember”; MEMBERSHIP_INVALID400; MEMBERSHIP_VERIFY_REQUIRED403; MEMBER_QUOTA409; CHECKOUT_REQUIRED400; HOLDER_NAME/EMAIL/PHONE/COUNT400; PAYMENT_METHOD400; HOLD_EXPIRED409; QR/mailของบัญชีอื่น404

## A-test contracts สำหรับแผนที่ผ่านการรีวิว
16,384bytes JSONbody limit; เกิน413/unsupportedcontent415/malformedJSON400; validlogin bodyต่ำกว่าขีดจำกัดยังได้200
callback amount/futuretimestampinvalidตอบ400และคงpending/amount/refund0/hold ไม่ออกorder/mail
TEST_MODE=1และtokenเท่านั้นเปิดreset/clock/callback; BUG_MODEมีผลเฉพาะTEST_MODE=1; normalhealthและHTMLแสดงbugMode0
