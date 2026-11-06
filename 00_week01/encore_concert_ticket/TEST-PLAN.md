# TEST-PLAN — ENCORE / LAB10–11

## 1. วัตถุประสงค์และขอบเขต
พิสูจน์โจทย์คอนเสิร์ตตามREQUIREMENTS V3 และเงื่อนไขผู้ใช้ รวมMember/General/คิว/ข้อมูลผู้ถือ/4payment/QR/emailSandbox/refund/admin/scan ไม่เชื่อมเงินจริงหรือSMTPจริง

## 2. แหล่งอ้างอิงและ oracle
D=REQUIREMENTS/TEST-DATA (แยกUจริง/A-policyสมมติฐานการบ้าน), R=เว็บอ้างอิงเพื่อบริบท, A=ผู้สร้างอ้างในSPEC, O=สิ่งที่เห็น ห้ามใช้A/Oอย่างเดียวเป็นexpectedธุรกิจ A-test AT01–06เป็นcontractทดลองที่ประกาศชัด ไม่ใช่คำตอบผู้จัดจริง

## 3. ความเสี่ยงและเงื่อนไขทดสอบ
ผู้ตัดสินแยกอ่านเฉพาะB–C: [risk-judge](exploration/risk-judge.md) เงินผิด/จองซ้อน/สิทธิ์หรือข้อมูลส่วนตัวผิด=P1; featureสำคัญ=P2;เอกสาร/การแสดงผล=P3 ประเด็นAP01–05ถูกระบุก่อนreview ไม่แปลงคำว่าobserved-unconfirmedย้อนหลัง

## 4. เทคนิคและการแยกงาน
ใช้equivalence partition, boundary value, decision table, state transition, use-case และerror guessing รวมconcurrency/replay/securityในเทคนิคที่เกี่ยวข้อง writer3ตัวแบ่ง5.1/5.2/5.3 reviewerคนละตัวกันทุกกลุ่ม รายละเอียดตัวผู้เขียน/เวลารวมอยู่JSONและPLAN-REVIEW

## 5. กรณีทดสอบ89ข้อ
61API+25UIเดิม+3UIตรวจoracleหลังเปลี่ยนสถานะ รายละเอียด12ช่องต่อการ์ดอยู่ด้านล่างและJSON ใช้IDเดียวกับautomation ส่วนpositivecontrols/ค่าขอบที่ผู้รีวิวเติมถูกรวมในtestIDเดิม

### 5.1 — การ์ดทดสอบละเอียดหลังรีวิว

ผู้เขียนเดิม: /root/writer_51; ผู้แก้รวม: /root หลัง independent review; ฉบับก่อนแก้อยู่ before-review/

## V3-A01 — สมัครด้วยขอบความยาวและป้องกัน role injection

**ส่วนระบบ:** สมัครด้วยขอบความยาวและป้องกัน role injection

**กฎที่อ้างอิง:** ["V3-FR01","V3-BR01","NFR02"]

**ระดับ:** P1

**เทคนิค:** ["boundary value analysis","state transition"]

**ที่มาของ oracle:** D: REQUIREMENTS.md / TEST-DATA.md; A-test: รูปแบบการจัดการทดสอบและ guard ที่ประกาศชัด; R: ไม่ใช้ external reference เป็น oracle แทน D

**เงื่อนไขก่อนเริ่ม:** DB และ controlled clock เฉพาะผู้รัน; แต่ละแขนงเริ่ม fixture ใหม่; context แยกบัญชี ห้าม reset/clock 4310 หรือ instance คนอื่น

**ข้อมูลทดสอบ:** {"usernameValid":["abc","aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa","Ab_C-9."],"usernameInvalid":["ab","aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa","ab!","ชื่อ"],"passwordValid":["abcdefghij","xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],"passwordInvalid":["xxxxxxxxx","xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],"control":"new_fan51 / NewFan!2026","inject":{"role":"admin","member":true}}

**ขั้นตอน:**
1. สมัคร valid แต่ละคู่โดยใช้ชื่อไม่ซ้ำ; login ด้วย lowercase
2. ส่ง invalid ทีละช่องโดยคงช่องอื่น valid
3. สมัคร Ab_C-9. แล้วสมัคร ab_c-9. ซ้ำ
4. สมัครพร้อม role/member แล้วลองสิทธิ์ Member/admin

**ผลที่คาดหวัง:** username3/32และpassword10/128รับได้; username2/33และpassword9/129หรืออักขระนอกอังกฤษตัวเลข._-ไม่สร้างบัญชี; normalize lowercase และไม่รับชื่อซ้ำต่างcase; clientกำหนดrole/memberไม่ได้ บัญชีใหม่General (rejectpayloadหรือตัดfieldสิทธิ์ได้)

**จังหวะตรวจ:** ตรวจบัญชี/สิทธิ์หลังสมัครและloginใหม่ ไม่ดูเพียงข้อความสำเร็จ

**คืนสภาพ:** เก็บหลักฐาน UTC/เวลาจำลอง ไม่เก็บ session token; logout ปิด context; ยกเลิก interception; คืน fixture/clock เฉพาะ instance ของผู้รัน

**ถ้ากฎผิด ควรต่างอย่างไร:** สร้างidentityแยกตามcaseหรือให้member=trueเปลี่ยนสิทธิ์

## V3-A02 — username และ email เดิมเข้า identity เดียวกัน; logout ยกเลิกสิทธิ์

**ส่วนระบบ:** username และ email เดิมเข้า identity เดียวกัน; logout ยกเลิกสิทธิ์

**กฎที่อ้างอิง:** ["V3-FR01","V3-FR17","NFR02"]

**ระดับ:** P1

**เทคนิค:** ["boundary value analysis","state transition"]

**ที่มาของ oracle:** D: REQUIREMENTS.md / TEST-DATA.md; A-test: รูปแบบการจัดการทดสอบและ guard ที่ประกาศชัด; R: ไม่ใช้ external reference เป็น oracle แทน D

**เงื่อนไขก่อนเริ่ม:** DB และ controlled clock เฉพาะผู้รัน; แต่ละแขนงเริ่ม fixture ใหม่; context แยกบัญชี ห้าม reset/clock 4310 หรือ instance คนอื่น

**ข้อมูลทดสอบ:** {"username":"fan","password":"FanDemo!26","invalidPassword":"WrongPass!26","legacyEmail":"ใช้ email บัญชีเก่าที่ fixture อนุญาต ไม่เดาค่า","control":"fan / FanDemo!26"}

**ขั้นตอน:**
1. loginผิดแล้วขอข้อมูลส่วนตัว
2. loginusernameถูกอ่านordersตน
3. logoutแล้วใช้sessionเดิมขอข้อมูลส่วนตัว
4. contextใหม่loginด้วยlegacyemailแล้วเทียบidentity
5. บันทึกcookieก่อน/หลังloginโดยไม่เก็บtoken

**ผลที่คาดหวัง:** D: รหัสผิดเข้าไม่ได้; usernameและemailเดิมเข้าidentityเดียวกัน; session protection/owner isolationต้องยังทำงาน. A-test security guard: logoutแล้วsessionเดิมไม่ควรอ่านข้อมูลส่วนตัว; rotatecookieเป็นข้อเสนอป้องกันsession fixation ไม่ใช่รูปแบบtokenที่Dกำหนด จึงไม่ประกาศdefectเพราะstringcookieไม่เปลี่ยนลำพัง. ไม่มีfixturelegacyemailให้blockedเฉพาะแขนงนั้น

**จังหวะตรวจ:** อ่านข้อมูลทันทีหลังlogin/logoutพร้อมcontextใหม่

**คืนสภาพ:** เก็บหลักฐาน UTC/เวลาจำลอง ไม่เก็บ session token; logout ปิด context; ยกเลิก interception; คืน fixture/clock เฉพาะ instance ของผู้รัน

**ถ้ากฎผิด ควรต่างอย่างไร:** สรุปว่าปลอดภัยเพียงcookieเปลี่ยนหรือเดาlegacyemail

## V3-A03 — ขอบ session24h และล็อกloginผิดห้าครั้ง15min

**ส่วนระบบ:** ขอบ session24h และล็อกloginผิดห้าครั้ง15min

**กฎที่อ้างอิง:** ["V3-FR17","V3-BR20"]

**ระดับ:** P1

**เทคนิค:** ["boundary value analysis","state transition"]

**ที่มาของ oracle:** D: REQUIREMENTS.md / TEST-DATA.md; A-test: รูปแบบการจัดการทดสอบและ guard ที่ประกาศชัด; R: ไม่ใช้ external reference เป็น oracle แทน D

**เงื่อนไขก่อนเริ่ม:** DB และ controlled clock เฉพาะผู้รัน; แต่ละแขนงเริ่ม fixture ใหม่; context แยกบัญชี ห้าม reset/clock 4310 หรือ instance คนอื่น

**ข้อมูลทดสอบ:** {"T0":"2026-11-06T03:00:00.000Z","sessionTimes":["2026-11-07T02:59:59.999Z","2026-11-07T03:00:00.000Z"],"wrongAttempts":[1,2,3,4,5],"unlockElapsed":["00:14:59.999","00:15:00.000"],"control":"fan/FanDemo!26"}

**ขั้นตอน:**
1. ตรวจsessionหมดตรง24h
2. resetfixtureแยก:loginผิด4ครั้งแล้วรหัสถูกต้องต้อง200
3. resetอีกแขนง:ผิด5ครั้งแล้วรหัสถูกต้องยัง429;ก่อนปลดล็อก1msยัง429;ตรง15minได้200

**ผลที่คาดหวัง:** 24hsessionหมด;สี่ผิดยังloginด้วยรหัสถูกได้;ห้าผิดล็อกจนถึง15min ไม่ใช้ความสำเร็จแทรกในแขนงห้าผิด

**จังหวะตรวจ:** ตรึงเวลาทั้ง5ครั้งเพื่อทราบL; ทุกขอบ−1ms/ตรงขอบใช้serverclock

**คืนสภาพ:** เก็บหลักฐาน UTC/เวลาจำลอง ไม่เก็บ session token; logout ปิด context; ยกเลิก interception; คืน fixture/clock เฉพาะ instance ของผู้รัน

**ถ้ากฎผิด ควรต่างอย่างไร:** ใช้>แทน>=จึงsessionค้างหรือปลดล็อกก่อนครบ

## V3-A04 — 12งาน ตารางรอบ และผัง48ที่

**ส่วนระบบ:** 12งาน ตารางรอบ และผัง48ที่

**กฎที่อ้างอิง:** ["V3-FR02","V3-FR07","V3-BR02","V3-BR03"]

**ระดับ:** P1

**เทคนิค:** ["boundary value analysis","state transition"]

**ที่มาของ oracle:** D: REQUIREMENTS.md / TEST-DATA.md; A-test: รูปแบบการจัดการทดสอบและ guard ที่ประกาศชัด; R: ไม่ใช้ external reference เป็น oracle แทน D

**เงื่อนไขก่อนเริ่ม:** DB และ controlled clock เฉพาะผู้รัน; แต่ละแขนงเริ่ม fixture ใหม่; context แยกบัญชี ห้าม reset/clock 4310 หรือ instance คนอื่น

**ข้อมูลทดสอบ:** {"events":["neon","sunset","orbit","aurora","jazz","rock","citypop","acoustic","kpop","hiphop","folk","midnight"],"pageSize":6,"seats":48,"VIP":"A-B/3200","Regular":"C-D/1800","neonSold":["A03","A04","B09","C06","D10"],"control":"งานเปิดและมีที่ว่างอ่านผังหลังสิทธิ์ครบ"}

**ขั้นตอน:**
1. anonymousอ่านสองหน้าเก็บID/schedule
2. loginfan/generalเทียบงานเดียวกัน
3. จัดclockและคิว/grantถูกก่อนอ่านผังแต่ละงานผ่านfixtureที่อนุญาต ไม่ข้ามสิทธิ์งานหมด/ปิด
4. ตรวจลำดับเวลารอบUTCและการแสดงไทย

**ผลที่คาดหวัง:** ครบ12IDไม่ซ้ำ6ต่อหน้า ทุกงาน48ที่ VIP/Regularไม่มีบัตรยืน; NEONขาย5ที่ตามข้อมูล orbit/midnightหมด; member_start<member_end<=general_start<general_end; เก็บUTCแสดงAsia/Bangkok; anonymousสองschedule fanเฉพาะMember generalเฉพาะGeneral

**จังหวะตรวจ:** อ่านcatalogหลังlogin; ผังตรวจหลังผ่านสิทธิ์งานนั้น ไม่บังคับงานปิดต้องเผยผัง

**คืนสภาพ:** เก็บหลักฐาน UTC/เวลาจำลอง ไม่เก็บ session token; logout ปิด context; ยกเลิก interception; คืน fixture/clock เฉพาะ instance ของผู้รัน

**ถ้ากฎผิด ควรต่างอย่างไร:** นับสองหน้ารวม12แต่มีIDซ้ำหรืออ่านscheduleไม่ตรงบัญชี

## V3-A05 — anonymousเข้าคิวและอ่านผังMemberไม่ได้

**ส่วนระบบ:** anonymousเข้าคิวและอ่านผังMemberไม่ได้

**กฎที่อ้างอิง:** ["V3-FR03","V3-FR05","V3-BR05"]

**ระดับ:** P1

**เทคนิค:** ["decision table","security abuse"]

**ที่มาของ oracle:** D: REQUIREMENTS.md / TEST-DATA.md; A-test: รูปแบบการจัดการทดสอบและ guard ที่ประกาศชัด; R: ไม่ใช้ external reference เป็น oracle แทน D

**เงื่อนไขก่อนเริ่ม:** DB และ controlled clock เฉพาะผู้รัน; แต่ละแขนงเริ่ม fixture ใหม่; context แยกบัญชี ห้าม reset/clock 4310 หรือ instance คนอื่น

**ข้อมูลทดสอบ:** {"anonymous":"contextไม่มีcookie","event":"neon","round":"member","seat":"C01","control":"fan+ENCORE-0001 ผ่านactive"}

**ขั้นตอน:**
1. anonymousjoinMember
2. anonymousขอmap/holdตรง
3. fanloginactiveverifyแล้วขอmap/holdเป็นcontrol

**ผลที่คาดหวัง:** anonymousไม่เข้าคิว/อ่านผังMember/สร้างhold; fanผ่านขั้นถูกอ่านผังและholdที่ว่างได้. ไม่บังคับข้อความGeneralกับanonymous

**จังหวะตรวจ:** ตรวจไม่มีhold/stateเปลี่ยนหลังdenialทุกคำขอ

**คืนสภาพ:** เก็บหลักฐาน UTC/เวลาจำลอง ไม่เก็บ session token; logout ปิด context; ยกเลิก interception; คืน fixture/clock เฉพาะ instance ของผู้รัน

**ถ้ากฎผิด ควรต่างอย่างไร:** ซ่อนปุ่มแต่APIanonymousอ่านผังได้

## V3-A06 — GeneralถูกปฏิเสธMemberทั้งjoin/map/hold

**ส่วนระบบ:** GeneralถูกปฏิเสธMemberทั้งjoin/map/hold

**กฎที่อ้างอิง:** ["V3-FR03","V3-FR06","V3-BR05"]

**ระดับ:** P1

**เทคนิค:** ["decision table","negative security"]

**ที่มาของ oracle:** D: REQUIREMENTS.md / TEST-DATA.md; A-test: รูปแบบการจัดการทดสอบและ guard ที่ประกาศชัด; R: ไม่ใช้ external reference เป็น oracle แทน D

**เงื่อนไขก่อนเริ่ม:** DB และ controlled clock เฉพาะผู้รัน; แต่ละแขนงเริ่ม fixture ใหม่; context แยกบัญชี ห้าม reset/clock 4310 หรือ instance คนอื่น

**ข้อมูลทดสอบ:** {"account":"general/GeneralDemo!26","forgedMembership":"ENCORE-0001","seat":"C01","control":"fan/FanDemo!26+ENCORE-0001"}

**ขั้นตอน:**
1. Generalส่งjoinMemberตรง
2. ขอmap/holdMemberทั้งไม่ส่งและส่งเลขfan
3. ตรวจไม่มีqueue/grant/hold
4. fanผ่านคิวverifyแล้วholdเป็นcontrol

**ผลที่คาดหวัง:** Generalทั้งjoin/map/holdได้403และข้อความตรง“ไม่ใช่สมาชิกMember”; ส่งเลขfanไม่เพิ่มสิทธิ์; validMembercontrolผ่าน

**จังหวะตรวจ:** ตรวจstatus/message/stateหลังแต่ละendpoint ไม่ดูUIอย่างเดียว

**คืนสภาพ:** เก็บหลักฐาน UTC/เวลาจำลอง ไม่เก็บ session token; logout ปิด context; ยกเลิก interception; คืน fixture/clock เฉพาะ instance ของผู้รัน

**ถ้ากฎผิด ควรต่างอย่างไร:** ตรวจสิทธิ์เฉพาะjoinหรือข้อความผิด

## V3-A07 — สมาชิกหมดอายุตรงvalid_untilเข้าไม่ได้

**ส่วนระบบ:** สมาชิกหมดอายุตรงvalid_untilเข้าไม่ได้

**กฎที่อ้างอิง:** ["V3-FR06","V3-BR07"]

**ระดับ:** P1

**เทคนิค:** ["boundary value analysis","state transition"]

**ที่มาของ oracle:** D: REQUIREMENTS.md / TEST-DATA.md; A-test: รูปแบบการจัดการทดสอบและ guard ที่ประกาศชัด; R: ไม่ใช้ external reference เป็น oracle แทน D

**เงื่อนไขก่อนเริ่ม:** DB และ controlled clock เฉพาะผู้รัน; แต่ละแขนงเริ่ม fixture ใหม่; context แยกบัญชี ห้าม reset/clock 4310 หรือ instance คนอื่น

**ข้อมูลทดสอบ:** {"expired":"expired/Expired!26+ENCORE-EXPIRED","validUntil":"2026-11-06T03:00:00.000Z","checks":["2026-11-06T02:59:59.999Z","2026-11-06T03:00:00.000Z","2026-11-06T03:00:00.001Z"],"control":"fan+ENCORE-0001ที่T0"}

**ขั้นตอน:**
1. ก่อนT0−1msอ่านสถานะสมาชิกแยกจากรอบNEONที่ยังไม่เปิด
2. ตรงT0ลองjoin/verify/map/holdด้วยexpired
3. ทำซ้ำT0+1msในfixtureใหม่
4. fanactiveverifyที่T0เป็นvalidcontrol

**ผลที่คาดหวัง:** ตรงvalid_untilและหลังขอบใช้Memberไม่ได้ ไม่มีgrant/map/hold; ก่อนขอบยังไม่expiredแต่NEONยังไม่เปิดจึงไม่บังคับซื้อได้; fanที่T0ผ่านได้. ถ้าจะพิสูจน์purchaseก่อนexpiryต้องจัดfixtureexpiryภายในรอบเปิดผ่านinterfaceที่อนุญาตก่อน

**จังหวะตรวจ:** ใช้serverclock−1ms/ตรง/+1msและบันทึกเหตุปฏิเสธแยกsale/member

**คืนสภาพ:** เก็บหลักฐาน UTC/เวลาจำลอง ไม่เก็บ session token; logout ปิด context; ยกเลิก interception; คืน fixture/clock เฉพาะ instance ของผู้รัน

**ถ้ากฎผิด ควรต่างอย่างไร:** รวมจุดvalid_untilว่ายังactiveหรือสับสนsaleยังไม่เปิดกับmemberหมด

## V3-A08 — ก่อนคิวactiveหรือก่อนgrantห้ามmap/hold

**ส่วนระบบ:** ก่อนคิวactiveหรือก่อนgrantห้ามmap/hold

**กฎที่อ้างอิง:** ["V3-FR05","V3-BR07"]

**ระดับ:** P1

**เทคนิค:** ["boundary value analysis","state transition"]

**ที่มาของ oracle:** D: REQUIREMENTS.md / TEST-DATA.md; A-test: รูปแบบการจัดการทดสอบและ guard ที่ประกาศชัด; R: ไม่ใช้ external reference เป็น oracle แทน D

**เงื่อนไขก่อนเริ่ม:** DB และ controlled clock เฉพาะผู้รัน; แต่ละแขนงเริ่ม fixture ใหม่; context แยกบัญชี ห้าม reset/clock 4310 หรือ instance คนอื่น

**ข้อมูลทดสอบ:** {"states":["ไม่มีคิว","waiting","activeยังไม่verify","active+verify"],"account":"fan/FanDemo!26","membership":"ENCORE-0001","seat":"C01","control":"active+verify"}

**ขั้นตอน:**
1. fanไม่joinขอverify/map/hold
2. ให้fan/fan2active fan3waitingแล้วfan3ขอmap/hold
3. activefanยังไม่verifyขอmap/hold
4. verifyถูกแล้วขอmap/holdC01

**ผลที่คาดหวัง:** ไม่มีคิว/waiting/activeไม่verifyไม่อ่านผังหรือholdMember; activeและgrantเลขเจ้าของถูกจึงผ่าน; แนบเลขในholdไม่ทดแทนgrant

**จังหวะตรวจ:** ตรวจทุกสถานะก่อนเลื่อนขั้นและC01ยังว่างหลังdenial

**คืนสภาพ:** เก็บหลักฐาน UTC/เวลาจำลอง ไม่เก็บ session token; logout ปิด context; ยกเลิก interception; คืน fixture/clock เฉพาะ instance ของผู้รัน

**ถ้ากฎผิด ควรต่างอย่างไร:** ตรวจแค่loginหรือเลขรูปแบบถูก

## V3-A09 — เลขผิด คนอื่น และเลขถูกของตน

**ส่วนระบบ:** เลขผิด คนอื่น และเลขถูกของตน

**กฎที่อ้างอิง:** ["V3-FR05","V3-FR06","V3-BR07"]

**ระดับ:** P1

**เทคนิค:** ["boundary value analysis","state transition"]

**ที่มาของ oracle:** D: REQUIREMENTS.md / TEST-DATA.md; A-test: รูปแบบการจัดการทดสอบและ guard ที่ประกาศชัด; R: ไม่ใช้ external reference เป็น oracle แทน D

**เงื่อนไขก่อนเริ่ม:** DB และ controlled clock เฉพาะผู้รัน; แต่ละแขนงเริ่ม fixture ใหม่; context แยกบัญชี ห้าม reset/clock 4310 หรือ instance คนอื่น

**ข้อมูลทดสอบ:** {"wrong":"WRONG","otherOwner":"ENCORE-0002","own":"ENCORE-0001","account":"fan/FanDemo!26","control":"เลขownหลังnegative"}

**ขั้นตอน:**
1. fanactiveส่งWRONGแล้วmap/hold
2. ส่งเลขfan2แล้วmap/hold
3. ส่งเลขfanเองแล้วmap/hold
4. บนUIตรวจเปลี่ยนจากฟอร์มไปผังไม่กดซ้ำ

**ผลที่คาดหวัง:** ผิด/คนอื่นมีerrorไม่ออกgrant/map/hold; ownเลขถูกเปิดผังทันทีไม่มีsuccessinterstitialหรือปุ่มเข้าผังซ้ำ

**จังหวะตรวจ:** ตรวจgrantไม่มีหลังแต่ละnegativeและภาพผังหลังvalidทันที

**คืนสภาพ:** เก็บหลักฐาน UTC/เวลาจำลอง ไม่เก็บ session token; logout ปิด context; ยกเลิก interception; คืน fixture/clock เฉพาะ instance ของผู้รัน

**ถ้ากฎผิด ควรต่างอย่างไร:** เช็คเพียงรูปแบบENCOREหรือมีsuccessขั้นซ้ำ

## V3-A10 — grantผูกบัญชี/event/roundและexpiryคิว

**ส่วนระบบ:** grantผูกบัญชี/event/roundและexpiryคิว

**กฎที่อ้างอิง:** ["V3-FR05","V3-FR06","V3-BR06","V3-BR07"]

**ระดับ:** P1

**เทคนิค:** ["boundary value analysis","state transition"]

**ที่มาของ oracle:** D: REQUIREMENTS.md / TEST-DATA.md; A-test: รูปแบบการจัดการทดสอบและ guard ที่ประกาศชัด; R: ไม่ใช้ external reference เป็น oracle แทน D

**เงื่อนไขก่อนเริ่ม:** fanและfan2เป็นactiveNEONMemberพร้อมกัน; tempSQLite4314มีAURORAทั้งสองsale roundsเท่าNEONตามAT05 ทั้งสองeventเปิดMemberพร้อมกัน

**ข้อมูลทดสอบ:** {"T0":"2026-11-06T03:00:00.000Z","checks":["2026-11-06T03:14:59.999Z","2026-11-06T03:15:00.000Z"],"otherEvent":"sunset","otherRound":"general","control":"fan/neon/memberก่อนTTL"}

**ขั้นตอน:**
1. verifyเฉพาะfan/NEON ให้fan map200เป็นpositivecontrol; fan2activeแต่ยังไม่verifyต้องmap/hold403; verifyfan2แล้วmap/holdสำเร็จ
2. tempfixtureใหม่:fanactiveทั้งNEON/AURORA; verifyNEONเท่านั้น; NEONmap200 แต่AURORAmap/hold403
3. verifyAURORAด้วยเลขของfan แล้วAURORAmap200/hold201โดยไม่เปลี่ยนคิวหรือเวลา
4. ตรงqueueexpiry900s NEONgrantเดิมใช้ไม่ได้

**ผลที่คาดหวัง:** แยกuser/eventgrantได้โดยไม่ถูกsaleหรือqueuegateอื่นบัง;หลังverifyของscopeนั้นจึงผ่าน; grantหมดอายุที่queue/roundend

**จังหวะตรวจ:** วัดจากTactiveจริง ตรวจ−1ms/ตรงขอบ

**คืนสภาพ:** เก็บหลักฐาน UTC/เวลาจำลอง ไม่เก็บ session token; logout ปิด context; ยกเลิก interception; คืน fixture/clock เฉพาะ instance ของผู้รัน

**ถ้ากฎผิด ควรต่างอย่างไร:** ถ้าgrantผูกแค่userไม่ผูกevent AURORAจะเปิดผังได้ก่อนverify; ถ้าglobalgrant fan2จะผ่านก่อนตรวจเลข; schemaมีMemberroundเดียวต่อeventจึงไม่อ้างตรวจMemberroundชนิดใหม่ที่ไม่มีจริง

## V3-A11 — ห้องรอ15นาทีก่อนขายและเลขคงที่

**ส่วนระบบ:** ห้องรอ15นาทีก่อนขายและเลขคงที่

**กฎที่อ้างอิง:** ["V3-FR04","V3-BR04","V3-BR06"]

**ระดับ:** P1

**เทคนิค:** ["boundary value analysis","state transition"]

**ที่มาของ oracle:** D: REQUIREMENTS.md / TEST-DATA.md; A-test: รูปแบบการจัดการทดสอบและ guard ที่ประกาศชัด; R: ไม่ใช้ external reference เป็น oracle แทน D

**เงื่อนไขก่อนเริ่ม:** DB และ controlled clock เฉพาะผู้รัน; แต่ละแขนงเริ่ม fixture ใหม่; context แยกบัญชี ห้าม reset/clock 4310 หรือ instance คนอื่น

**ข้อมูลทดสอบ:** {"timesUTC":["2026-11-06T02:44:59.999Z","2026-11-06T02:45:00.000Z","2026-11-06T02:59:59.999Z","2026-11-06T03:00:00.000Z"],"thai":["09:44:59.999","09:45","09:59:59.999","10:00"],"control":"ตรง10:00active"}

**ขั้นตอน:**
1. ก่อน09:45join
2. ตรง09:45joinจดq0/ahead/ETA
3. reloadและjoinซ้ำก่อน10:00เทียบq0และขอverify/map
4. ตรง10:00pollแล้วverifyถูก

**ผลที่คาดหวัง:** ก่อน09:45ไม่ได้; ตรง09:45waitingคนแรกahead0 ETA900sรวมรอก่อนเปิด; ก่อน10:00ไม่active/verify/map; reloadไม่เปลี่ยนเลข/แซง; ตรง10:00activeตามslotและตรวจสมาชิกได้

**จังหวะตรวจ:** ตรึงclockแต่ละค่า; อ่านเลขหลังreloadและเปิดรอบ

**คืนสภาพ:** เก็บหลักฐาน UTC/เวลาจำลอง ไม่เก็บ session token; logout ปิด context; ยกเลิก interception; คืน fixture/clock เฉพาะ instance ของผู้รัน

**ถ้ากฎผิด ควรต่างอย่างไร:** waitingroomเปิดแล้วactiveทันทีหรือreloadแซง

## V3-A12 — FIFOสองactiveและสูตรahead/ETA

**ส่วนระบบ:** FIFOสองactiveและสูตรahead/ETA

**กฎที่อ้างอิง:** ["V3-FR04","V3-BR06"]

**ระดับ:** P1

**เทคนิค:** ["boundary value analysis","state transition"]

**ที่มาของ oracle:** D: REQUIREMENTS.md / TEST-DATA.md; A-test: รูปแบบการจัดการทดสอบและ guard ที่ประกาศชัด; R: ไม่ใช้ external reference เป็น oracle แทน D

**เงื่อนไขก่อนเริ่ม:** DB และ controlled clock เฉพาะผู้รัน; แต่ละแขนงเริ่ม fixture ใหม่; context แยกบัญชี ห้าม reset/clock 4310 หรือ instance คนอื่น

**ข้อมูลทดสอบ:** {"buyers":["fan/FanDemo!26","fan2/FanTwo!26","fan3/FanThree!26"],"activeLimit":2,"thirdAhead":2,"thirdETA":120,"formula":"ceil(ahead/2)*120 + รอก่อนเปิด","control":"สองบัญชีแรกactive"}

**ขั้นตอน:**
1. สมัครqueue_a/b/c/dพร้อมข้อมูลvalidและเข้ารอบGeneralAURORAที่เปิดขายตามลำดับ
2. a/bactive cต้องahead2/ETA120 dต้องahead3/ETA240
3. aออกคิว cpromotedเลขเดิม dยังwaiting

**ผลที่คาดหวัง:** activeสูงสุด2 คนที่สามwaiting ahead2 ETAประมาณ120s; reloadเลขเดิม; slotว่างเลื่อนwaitingFIFOและUIไปMembershipอัตโนมัติ; ETAต้องสื่อประมาณ ไม่รับประกัน; ahead3สูตรให้240s

**จังหวะตรวจ:** boundedpolltimeoutเป็นharnesslimitไม่ใช่SLA; เก็บลำดับและสถานะ

**คืนสภาพ:** เก็บหลักฐาน UTC/เวลาจำลอง ไม่เก็บ session token; logout ปิด context; ยกเลิก interception; คืน fixture/clock เฉพาะ instance ของผู้รัน

**ถ้ากฎผิด ควรต่างอย่างไร:** ถ้าใช้floorแทนceil:ที่ahead3จะได้120แทน240 (ahead2ไม่แยกสองสูตร จึงต้องทดสอบahead3ด้วย)

## V3-A13 — Memberปิด Generalเปิดตรง15:00อัตโนมัติ

**ส่วนระบบ:** Memberปิด Generalเปิดตรง15:00อัตโนมัติ

**กฎที่อ้างอิง:** ["V3-FR02","V3-FR03","V3-BR03","V3-BR09","V3-BR20"]

**ระดับ:** P1

**เทคนิค:** ["boundary value analysis","state transition"]

**ที่มาของ oracle:** D: REQUIREMENTS.md / TEST-DATA.md; A-test: guard/การออกแบบทดสอบที่ประกาศชัด; R: external references ไม่ใช้แทน D

**เงื่อนไขก่อนเริ่ม:** DB และ controlled clock เฉพาะผู้รัน; แต่ละแขนงเริ่ม fixture ใหม่; context แยกบัญชี ห้าม reset/clock 4310 หรือ instance คนอื่น

**ข้อมูลทดสอบ:** {"before":"2026-11-06T07:59:59.999Z","at":"2026-11-06T08:00:00.000Z","member":"fan/FanDemo!26+ENCORE-0001","general":"general/GeneralDemo!26","seat":"C01","control":"Generaljoin/holdที่15:00"}

**ขั้นตอน:**
1. ก่อนขอบfanactiveverifyholdC01จดexpires
2. ตั้งตรง15:00โดยไม่adminอ่านcatalogทั้งสองบัญชี
3. fanลองjoin/holdใหม่และเริ่มpayจากholdเดิม
4. generaljoinGeneralอ่านผัง/holdโดยไม่Membership

**ผลที่คาดหวัง:** ก่อนขอบMemberholdได้expiresclamp15:00; ตรง15:00Memberclosed,join/hold/payใหม่จากholdหมดถูกปฏิเสธ; Generalavailableเข้าได้ตามคิวไม่ใช้Membership; การเปิดอัตโนมัติตามserverclock

**จังหวะตรวจ:** อ่านexpiryก่อนขอบและstateหลังpoll/sweepตรงขอบ ไม่ใช้wallclockรอ

**คืนสภาพ:** เก็บหลักฐาน UTC/เวลาจำลอง ไม่เก็บ session token; logout/ปิด context; ยกเลิก interception; คืน fixture/clock เฉพาะ instance ของผู้รัน

**ถ้ากฎผิด ควรต่างอย่างไร:** Memberรวมจุด15:00หรือรอadminเปิดGeneral

## V3-A44 — catalogแยกรอบ/เวลา/สถานะ/ปุ่มตามบัญชี

**ส่วนระบบ:** catalogแยกรอบ/เวลา/สถานะ/ปุ่มตามบัญชี

**กฎที่อ้างอิง:** ["V3-FR02","V3-FR03","V3-BR03","V3-BR05"]

**ระดับ:** P1

**เทคนิค:** ["decision table","pairwise comparison"]

**ที่มาของ oracle:** D: REQUIREMENTS.md / TEST-DATA.md; A-test: guard/การออกแบบทดสอบที่ประกาศชัด; R: external references ไม่ใช้แทน D

**เงื่อนไขก่อนเริ่ม:** DB และ controlled clock เฉพาะผู้รัน; แต่ละแขนงเริ่ม fixture ใหม่; context แยกบัญชี ห้าม reset/clock 4310 หรือ instance คนอื่น

**ข้อมูลทดสอบ:** {"at10":{"fanNeon":"Member/available","generalNeon":"General/upcoming","fanAurora":"Member/closed","generalAurora":"General/available"},"at15":{"fanNeon":"Member/closed","generalNeon":"General/available"},"anonymous":"สองschedule","control":"GeneralAuroraที่10:00เปิด"}

**ขั้นตอน:**
1. 10:00อ่านGETeventsanonymous/fan/generalเทียบNEONและAURORA
2. ตรวจpayloadschedule/status/availabilityพร้อมUIปุ่ม
3. ตั้ง15:00อ่านใหม่ทุกcontext
4. GeneralบังคับjoinMember

**ผลที่คาดหวัง:** anonymousสองschedule; fanเฉพาะMember generalเฉพาะGeneralรวมวันเวลา/สถานะ/ปุ่ม; ตารางค่าตรงTEST-DATA; GETeventsคำนวณตามaccount ไม่ใช่ส่งสองรอบแล้วซ่อนปุ่ม; forcedGeneral->Member403ข้อความตรง“ไม่ใช่สมาชิกMember”

**จังหวะตรวจ:** หลังloginและclockเปลี่ยนreloadแยกstale cache

**คืนสภาพ:** เก็บหลักฐาน UTC/เวลาจำลอง ไม่เก็บ session token; logout/ปิด context; ยกเลิก interception; คืน fixture/clock เฉพาะ instance ของผู้รัน

**ถ้ากฎผิด ควรต่างอย่างไร:** ส่งMemberavailableให้General10:00หรือซ่อนแค่ปุ่ม

## V3-A45 — role matrix ป้องกันข้อมูลส่วนตัวและสิทธิ์พิเศษ

**ส่วนระบบ:** role matrix ป้องกันข้อมูลส่วนตัวและสิทธิ์พิเศษ

**กฎที่อ้างอิง:** ["V3-FR01","V3-FR15","V3-FR16","V3-FR17","NFR02"]

**ระดับ:** P1

**เทคนิค:** ["decision table","authorization abuse"]

**ที่มาของ oracle:** D: REQUIREMENTS.md / TEST-DATA.md; A-test: guard/การออกแบบทดสอบที่ประกาศชัด; R: external references ไม่ใช้แทน D

**เงื่อนไขก่อนเริ่ม:** DB และ controlled clock เฉพาะผู้รัน; แต่ละแขนงเริ่ม fixture ใหม่; context แยกบัญชี ห้าม reset/clock 4310 หรือ instance คนอื่น

**ข้อมูลทดสอบ:** {"actors":["anonymous","fan2","general","encore","sky","gate"],"owner":"fan","objects":["order","ticketQR","mail","eml"],"actions":["NEON pause/block/refund","scanNEON"],"control":"fanอ่านของตน; ownerงานจัดการงานตน; gateสแกนNEONในwindow"}

**ขั้นตอน:**
1. สร้างticket/mailของfanตามjourneyปกติและให้fanอ่านเป็นcontrol
2. ทุกactorอ่านobjectIDเดียวกันและรายการส่วนตัว
3. buyer/anonymous/scannerลองorganizeraction; buyer/organizerลองscan
4. ownerถูกงานและgateถูกงาน/windowทำcontrol; scanใช้บัตรคนละใบหรือทำท้ายสุด
5. สร้างorder/refundrequestedจริงของfanในNEON ให้skyซึ่งเป็นorganizerแต่ไม่ใช่ownerลองpause/blockC02/approveคำขอนั้น ต้อง403ทุกข้อ
6. อ่านbefore/afterของencore ต้องstate/refunded/requeststatusเดิมและC02available;จากนั้นencoreblock/unblockและapproveได้เป็นpositivecontrols

**ผลที่คาดหวัง:** owner-onlyข้อมูลของfanไม่เผยข้ามactor; anonymousต้องlogin; clientกำหนดrole/memberไม่ได้; organizerต้องถูกownerและscannerต้องถูกrole/event/window; denialไม่เปลี่ยนงาน/บัตร. ไม่มีoracleบังคับ404เทียบ403จึงตรวจdenial+noPIIเป็นหลัก; organizerผิดownerทำรายการไม่ได้และไม่เกิดsideeffect แม้request/seat/eventมีจริงและownerทำได้

**จังหวะตรวจ:** เก็บstateก่อน/หลังทุกaction ป้องกันusedticketปนผลrole

**คืนสภาพ:** เก็บหลักฐาน UTC/เวลาจำลอง ไม่เก็บ session token; logout/ปิด context; ยกเลิก interception; คืน fixture/clock เฉพาะ instance ของผู้รัน

**ถ้ากฎผิด ควรต่างอย่างไร:** รู้IDแล้วorganizerอ่านmailผู้ซื้อได้หรือscannerpauseงานได้

## V3-A56 — Generalห้องรอและขอบปิดปล่อยสิทธิ์

**ส่วนระบบ:** Generalห้องรอและขอบปิดปล่อยสิทธิ์

**กฎที่อ้างอิง:** ["V3-FR02","V3-FR03","V3-FR04","V3-BR03","V3-BR04","V3-BR09"]

**ระดับ:** P1

**เทคนิค:** ["boundary value analysis","state transition"]

**ที่มาของ oracle:** D: REQUIREMENTS.md / TEST-DATA.md; A-test: guard/การออกแบบทดสอบที่ประกาศชัด; R: external references ไม่ใช้แทน D

**เงื่อนไขก่อนเริ่ม:** DB และ controlled clock เฉพาะผู้รัน; แต่ละแขนงเริ่ม fixture ใหม่; context แยกบัญชี ห้าม reset/clock 4310 หรือ instance คนอื่น

**ข้อมูลทดสอบ:** {"general":"general/GeneralDemo!26","startChecks":["2026-11-06T07:44:59.999Z","2026-11-06T07:45:00.000Z","2026-11-06T08:00:00.000Z"],"endChecks":["2026-12-12T09:59:59.999Z","2026-12-12T10:00:00.000Z"],"seat":"C01","control":"15:00activeGeneralไม่ใช้Membership"}

**ขั้นตอน:**
1. 14:44:59.999join;14:45joinจดเลข;ก่อน15ตรวจwaiting
2. 15:00pollactiveและmapไม่มีMembership
3. fixtureใหม่loginก่อน17:00วันที่12ธ.ค. join/holdที่16:59:59.999
4. ตรง17:00ตรวจjoin/map/hold/payเดิมและการคืนที่นั่ง

**ผลที่คาดหวัง:** ก่อน14:45ไม่ได้;14:45waitingคนแรกETA900;15:00activeตามslotเลขเดิมไม่ใช้Membership;ก่อน17:00holdได้expiresclamp17:00;ตรง17:00closedห้ามjoin/holdและสิทธิ์เก่าexpireไม่เริ่มpayจากholdหมด ที่นั่งไม่ค้างownedbyhold

**จังหวะตรวจ:** ทุกขอบ−1ms/ตรงขอบใช้serverclock; loginใหม่เมื่อกระโดดหลายวันไม่ให้session24hปนผล

**คืนสภาพ:** เก็บหลักฐาน UTC/เวลาจำลอง ไม่เก็บ session token; logout/ปิด context; ยกเลิก interception; คืน fixture/clock เฉพาะ instance ของผู้รัน

**ถ้ากฎผิด ควรต่างอย่างไร:** TTL900หรือhold600ทำให้ข้ามroundend

## V3-A59 — leave/rejoinไม่แซงและexpiryเลื่อนFIFO

**ส่วนระบบ:** leave/rejoinไม่แซงและexpiryเลื่อนFIFO

**กฎที่อ้างอิง:** ["V3-FR04","V3-FR05","V3-BR06","V3-BR07"]

**ระดับ:** P1

**เทคนิค:** ["boundary value analysis","state transition"]

**ที่มาของ oracle:** D: REQUIREMENTS.md / TEST-DATA.md; A-test: guard/การออกแบบทดสอบที่ประกาศชัด; R: external references ไม่ใช้แทน D

**เงื่อนไขก่อนเริ่ม:** DB และ controlled clock เฉพาะผู้รัน; แต่ละแขนงเริ่ม fixture ใหม่; context แยกบัญชี ห้าม reset/clock 4310 หรือ instance คนอื่น

**ข้อมูลทดสอบ:** {"joinOrder":["fan","fan2","fan3"],"leave":"fan","checks":["Tactive+899.999s","Tactive+900.000s"],"control":"fan3ได้slotก่อนfanrejoin"}

**ขั้นตอน:**
1. แขนงleave/rejoin:fan/fan2active verifyfan;fan3waiting;fanleaveแล้วrejoinต้องอยู่หลังfan3ที่promote
2. resetแขนงTTLแยก:fan/fan2activeและverifyfanก่อน fan3waitingเก็บq3
3. ที่899.999s fanmap200/fan3waiting;ตรง900s fanmap403/fan3activeเลขq3เดิม
4. verifyfan3แล้วmap200;ไม่ใช้fixtureที่ไม่มีwaitingหรือgrantเดิมจริง

**ผลที่คาดหวัง:** ทั้งleave/rejoinและTTLมีpositivecontrols/คิวรอจริง;expiredgrantถูกปฏิเสธ และผู้รอได้รับslotไม่เกิน2

**จังหวะตรวจ:** บันทึกลำดับrequest/สถานะก่อนหลังleave/rejoin; TTLวัดจากactiveจริง

**คืนสภาพ:** เก็บหลักฐาน UTC/เวลาจำลอง ไม่เก็บ session token; logout/ปิด context; ยกเลิก interception; คืน fixture/clock เฉพาะ instance ของผู้รัน

**ถ้ากฎผิด ควรต่างอย่างไร:** คนrejoinแย่งช่องก่อนwaitingหรือgrantยังอ่านได้หลังexpiry

## V3-A60 — fieldสมัครตรงขอบและidentityซ้ำ

**ส่วนระบบ:** fieldสมัครตรงขอบและidentityซ้ำ

**กฎที่อ้างอิง:** ["V3-FR01","V3-BR01","NFR02"]

**ระดับ:** P1

**เทคนิค:** ["boundary value analysis","state transition"]

**ที่มาของ oracle:** D: REQUIREMENTS.md / TEST-DATA.md; A-test: guard/การออกแบบทดสอบที่ประกาศชัด; R: external references ไม่ใช้แทน D

**เงื่อนไขก่อนเริ่ม:** DB และ controlled clock เฉพาะผู้รัน; แต่ละแขนงเริ่ม fixture ใหม่; context แยกบัญชี ห้าม reset/clock 4310 หรือ instance คนอื่น

**ข้อมูลทดสอบ:** {"usernames":["ab","abc","aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa","aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa","MiX_9.-"],"passwords":["xxxxxxxxx","xxxxxxxxxx","xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx","xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],"email":"same51@example.test","control":"reg51 / ValidPass!26"}

**ขั้นตอน:**
1. ส่งขอบแต่ละfieldด้วยfieldอื่นvalidชื่อไม่ซ้ำ
2. สมัครMiX_9.-แล้วloginmix_9.-และสมัครlowercaseซ้ำ
3. ถ้ารองรับemailสมัครสองusernameต่างกันด้วยemailเดียวบันทึกผล
4. ตรวจlegacyemailไม่ทำให้ข้ามidentityโดยไม่password

**ผลที่คาดหวัง:** D: username2/33,password9/129ปฏิเสธ;3/32,10/128รับ; lowercaseidentityเดียวusernameซ้ำไม่สร้างใหม่; role/memberclientไม่มีผล. Dไม่ได้กำหนดemailfieldหรือemailuniqueในการสมัคร. A-test guardเสนอปฏิเสธduplicateemailเมื่อเป็นloginidentifierเพื่อกันambiguousidentity แต่ต้องยืนยันนโยบายก่อนตัดสินแขนงนั้น ไม่ใช้ผลAPI/การสำรวจเป็นD

**จังหวะตรวจ:** ตรวจlogin/identity/บัญชีหลังทุกคำขอ; emailgapบันทึกnot-determinedไม่คิดเป็นpassเงียบๆ

**คืนสภาพ:** เก็บหลักฐาน UTC/เวลาจำลอง ไม่เก็บ session token; logout/ปิด context; ยกเลิก interception; คืน fixture/clock เฉพาะ instance ของผู้รัน

**ถ้ากฎผิด ควรต่างอย่างไร:** ยกระดับผลrejectduplicateemailเป็นข้อกำหนดหรือถือemailบังคับทั้งที่Dไม่กำหนด

## V3-U02 — Generalสมัครใหม่ ถูกกันMember และเข้ารอบตนไม่ใช้เลข

**ส่วนระบบ:** Generalสมัครใหม่ ถูกกันMember และเข้ารอบตนไม่ใช้เลข

**กฎที่อ้างอิง:** ["V3-FR01","V3-FR02","V3-FR03","V3-FR06","V3-BR03","V3-BR05","NFR01"]

**ระดับ:** P1

**เทคนิค:** ["user journey","state transition"]

**ที่มาของ oracle:** D: REQUIREMENTS.md / TEST-DATA.md; A-test: guard/การออกแบบทดสอบที่ประกาศชัด; R: external references ไม่ใช้แทน D

**เงื่อนไขก่อนเริ่ม:** DB และ controlled clock เฉพาะผู้รัน; แต่ละแขนงเริ่ม fixture ใหม่; context แยกบัญชี ห้าม reset/clock 4310 หรือ instance คนอื่น

**ข้อมูลทดสอบ:** {"signup":"u51_general / GeneralDemo!26","before":"2026-11-06T03:00:00Z","open":"2026-11-06T08:00:00Z","event":"neon","seat":"C01","control":"General15:00","viewport":"375x812"}

**ขั้นตอน:**
1. สมัครและlogin10:00ตรวจGeneralupcoming
2. บังคับjoinMemberผ่านAPI
3. 15:00reloadกดซื้อGeneralผ่านคิว
4. ตรวจไม่มีMembershipแล้วholdC01

**ผลที่คาดหวัง:** บัญชีใหม่Generalไม่มีmembership; รอบแสดงเฉพาะGeneral; forcedMember403ข้อความตรง“ไม่ใช่สมาชิกMember”;15:00Generalเปิดและผ่านคิวเข้าผังไม่มีMembership;375pxไม่ล้น

**จังหวะตรวจ:** ภาพก่อน/หลัง15:00หลังactiveและAPIstateไม่มีMembergrant

**คืนสภาพ:** เก็บหลักฐาน UTC/เวลาจำลอง ไม่เก็บ session token; logout/ปิด context; ยกเลิก interception; คืน fixture/clock เฉพาะ instance ของผู้รัน

**ถ้ากฎผิด ควรต่างอย่างไร:** สมัครใหม่เป็นMemberหรือGeneralต้องกรอกเลข

## V3-U04 — UIคิวเลขคงที่และautoเข้าMembership

**ส่วนระบบ:** UIคิวเลขคงที่และautoเข้าMembership

**กฎที่อ้างอิง:** ["V3-FR04","V3-FR05","V3-BR06","NFR06"]

**ระดับ:** P1

**เทคนิค:** ["user journey","state transition"]

**ที่มาของ oracle:** D: REQUIREMENTS.md / TEST-DATA.md; A-test: guard/การออกแบบทดสอบที่ประกาศชัด; R: external references ไม่ใช้แทน D

**เงื่อนไขก่อนเริ่ม:** DB และ controlled clock เฉพาะผู้รัน; แต่ละแขนงเริ่ม fixture ใหม่; context แยกบัญชี ห้าม reset/clock 4310 หรือ instance คนอื่น

**ข้อมูลทดสอบ:** {"fan3":"fan3/FanThree!26","number":"เก็บq3จากคิวใหม่ ไม่hardcodeผลสำรวจ","ahead":2,"etaSeconds":120,"control":"fanleaveแล้วfan3active"}

**ขั้นตอน:**
1. fan/fan2active fan3joinรออ่านเลข/ahead/ETA
2. reloadfan3ตรวจเลขเดิม
3. fanleaveและboundedpollfan3โดยไม่joinซ้ำ
4. ตรวจMembershipปรากฏอัตโนมัติและยังไม่เห็นผังก่อนverify

**ผลที่คาดหวัง:** fan3waitingahead2ETAประมาณ120sเลขเดิมหลังreload ไม่รับประกันเวลา; slotว่างpollไปMembershipอัตโนมัติไม่ต้องกดแข่งใหม่; ไม่เปิดผังจนverify

**จังหวะตรวจ:** ภาพwaiting/reload/active; harnesspolltimeoutบันทึกไม่อ้างSLA

**คืนสภาพ:** เก็บหลักฐาน UTC/เวลาจำลอง ไม่เก็บ session token; logout/ปิด context; ยกเลิก interception; คืน fixture/clock เฉพาะ instance ของผู้รัน

**ถ้ากฎผิด ควรต่างอย่างไร:** มีข้อความคิวแต่ไม่เปลี่ยนขั้นหรือactiveแล้วข้ามverify

## V3-U10 — UIMemberหมดรอบไม่เริ่มpayและGeneralเปิด

**ส่วนระบบ:** UIMemberหมดรอบไม่เริ่มpayและGeneralเปิด

**กฎที่อ้างอิง:** ["V3-FR02","V3-FR10","V3-BR03","V3-BR09","V3-BR20"]

**ระดับ:** P1

**เทคนิค:** ["boundary value analysis","state transition"]

**ที่มาของ oracle:** D: REQUIREMENTS.md / TEST-DATA.md; A-test: guard/การออกแบบทดสอบที่ประกาศชัด; R: external references ไม่ใช้แทน D

**เงื่อนไขก่อนเริ่ม:** DB และ controlled clock เฉพาะผู้รัน; แต่ละแขนงเริ่ม fixture ใหม่; context แยกบัญชี ห้าม reset/clock 4310 หรือ instance คนอื่น

**ข้อมูลทดสอบ:** {"holdAt":"2026-11-06T07:59:59.999Z","cutoff":"2026-11-06T08:00:00.000Z","seat":"C01","contact":"Buyer Test/buyer@example.test/0812345678; Holder 1/holder1@example.test/0898765432","control":"General15:00เข้าคิวได้"}

**ขั้นตอน:**
1. fanactiveverifyholdก่อนขอบตรวจdeadlineและกรอกcontactvalid
2. ตั้ง15:00ก่อนกดเริ่มpayจากหน้าเดิม
3. ตรวจserverdenialและreloadMembercatalog
4. Generalcontextเข้าคิวและผังไม่ใช้เลข

**ผลที่คาดหวัง:** holdไม่เกิน15:00; หน้าค้างไม่เริ่มpaymentหลังexpiryไม่ออกticket/email; Memberclosed Generalavailableจากserverclockไม่admin; ต้องตรวจAPIไม่ดูdisabledbuttonอย่างเดียว

**จังหวะตรวจ:** เวลาคำขอpay>=cutoff; ไม่มีintentสำเร็จหรือticketจากคำขอ; refreshcatalog

**คืนสภาพ:** เก็บหลักฐาน UTC/เวลาจำลอง ไม่เก็บ session token; logout/ปิด context; ยกเลิก interception; คืน fixture/clock เฉพาะ instance ของผู้รัน

**ถ้ากฎผิด ควรต่างอย่างไร:** clientเริ่มนับ600ใหม่หรือปุ่มเดิมข้ามservergate

## V3-U15 — demoMember/Generalแยกชัดและธีมสว่าง

**ส่วนระบบ:** demoMember/Generalแยกชัดและธีมสว่าง

**กฎที่อ้างอิง:** ["V3-FR01","V3-FR02","NFR01"]

**ระดับ:** P1

**เทคนิค:** ["visual inspection","decision table"]

**ที่มาของ oracle:** D: REQUIREMENTS.md / TEST-DATA.md; A-test: guard/การออกแบบทดสอบที่ประกาศชัด; R: external references ไม่ใช้แทน D

**เงื่อนไขก่อนเริ่ม:** DB และ controlled clock เฉพาะผู้รัน; แต่ละแขนงเริ่ม fixture ใหม่; context แยกบัญชี ห้าม reset/clock 4310 หรือ instance คนอื่น

**ข้อมูลทดสอบ:** {"member":"fan/FanDemo!26","general":"general/GeneralDemo!26","clock":"2026-11-06T03:00:00Z","viewports":["desktop","375x812"],"control":"loginแล้วidentity/รอบตรงบัญชี"}

**ขั้นตอน:**
1. หน้าloginตรวจตัวเลือกMember/Generalและlabel/keyboard
2. เลือกMemberloginตรวจNEON/AURORA
3. logoutเลือกGeneralแล้วเทียบงานเดิม
4. ตรวจ375pxไม่ล้นและพื้น/โปสเตอร์/สถานะอ่านได้

**ผลที่คาดหวัง:** ตัวเลือกทดลองแยกMember/Generalตรงfixture; fanเฉพาะMember generalเฉพาะGeneralรวมเวลา/ปุ่ม;10:00NEONfanavailable/generalupcoming,AURORAfAnclosed/generalavailable;พื้นขาว/เทาอ่อนเน้นฟ้านุ่มโปสเตอร์พาสเทลสถานะเขียวเหลืองแดงอ่านได้ ไม่กำหนดhex/pixelที่Dไม่มี

**จังหวะตรวจ:** หลังloginจริงและswitch ไม่ใช้แค่ป้ายdemoว่าidentityเปลี่ยน

**คืนสภาพ:** เก็บหลักฐาน UTC/เวลาจำลอง ไม่เก็บ session token; logout/ปิด context; ยกเลิก interception; คืน fixture/clock เฉพาะ instance ของผู้รัน

**ถ้ากฎผิด ควรต่างอย่างไร:** ป้ายเปลี่ยนแต่session/รอบเดิมหรือยึดภาพเป็นpixeloracle

## V3-U16 — loginผิดแก้ได้และสลับบัญชีไม่เห็นข้อมูลกัน

**ส่วนระบบ:** loginผิดแก้ได้และสลับบัญชีไม่เห็นข้อมูลกัน

**กฎที่อ้างอิง:** ["V3-FR01","V3-FR15","V3-FR17","NFR02"]

**ระดับ:** P1

**เทคนิค:** ["state transition","user journey","authorization"]

**ที่มาของ oracle:** D: REQUIREMENTS.md / TEST-DATA.md; A-test: guard/การออกแบบทดสอบที่ประกาศชัด; R: external references ไม่ใช้แทน D

**เงื่อนไขก่อนเริ่ม:** DB และ controlled clock เฉพาะผู้รัน; แต่ละแขนงเริ่ม fixture ใหม่; context แยกบัญชี ห้าม reset/clock 4310 หรือ instance คนอื่น

**ข้อมูลทดสอบ:** {"wrong":"fan/WrongPass!26","correct":"fan/FanDemo!26","switch":"general/GeneralDemo!26","wrongAttempts":1,"control":"fanมีticket/mailจากpurchaseปกติ;Generalไม่มี"}

**ขั้นตอน:**
1. loginfanผิด1ครั้งตรวจerror/ไม่มีข้อมูลส่วนตัว
2. แก้รหัสถูกอ่านtickets/mail/notificationsfan
3. logoutloginGeneralเปิดเมนูเดิมและdeeplinkIDfan
4. กลับloginfanตรวจรายการเดิมยังอยู่

**ผลที่คาดหวัง:** ผิด1ครั้งแก้รหัสถูกเข้าได้ไม่ติดlock5ครั้ง;fanเห็นของตน;Generalไม่เห็นticket/mail/ข้อมูลส่วนตัวfanรวมdeeplink;กลับfanรายการยังอยู่; privacyของnotificationใช้NFR02ไม่มีoracleบังคับข้อความ/รูปแบบnotification

**จังหวะตรวจ:** ทันทีหลังswitchรวมหน้าเก่าค้างและreload ตรวจserveridentityควบคู่ภาพ

**คืนสภาพ:** เก็บหลักฐาน UTC/เวลาจำลอง ไม่เก็บ session token; logout/ปิด context; ยกเลิก interception; คืน fixture/clock เฉพาะ instance ของผู้รัน

**ถ้ากฎผิด ควรต่างอย่างไร:** headerเปลี่ยนแต่cachePIIของfanยังให้Generalอ่าน

## V3-U19 — คำขอMembershipค้างและปิดก่อนผลกลับ

**ส่วนระบบ:** คำขอMembershipค้างและปิดก่อนผลกลับ

**กฎที่อ้างอิง:** ["V3-FR05","NFR01","NFR02"]

**ระดับ:** P1

**เทคนิค:** ["asynchronous state transition","error guessing"]

**ที่มาของ oracle:** D: REQUIREMENTS.md / TEST-DATA.md; A-test: guard/การออกแบบทดสอบที่ประกาศชัด; R: external references ไม่ใช้แทน D

**เงื่อนไขก่อนเริ่ม:** DB และ controlled clock เฉพาะผู้รัน; แต่ละแขนงเริ่ม fixture ใหม่; context แยกบัญชี ห้าม reset/clock 4310 หรือ instance คนอื่น

**ข้อมูลทดสอบ:** {"membership":"ENCORE-0001","control":"เลขถูกไม่ปิดต้องเข้าผังทันที","negative":"หน่วงresponse กดsubmitซ้ำ1ครั้งแล้วEscapeปิดก่อนปล่อย","submitAttempts":2}

**ขั้นตอน:**
1. validcontrolไม่หน่วงเข้าผังทันทีแล้วfixtureใหม่
2. หน่วงresponseเฉพาะbrowsercontextส่งเลขถูกพยายามsubmitซ้ำ
3. เก็บrequestcount/buttonstateแล้วEscapeปิด
4. ปล่อยresponseตรวจdialog/mapและเปิดซื้อใหม่อย่างตั้งใจ

**ผลที่คาดหวัง:** D: validcontrolเข้าผังทันทีไม่มีsuccessinterstitial;ไม่มีmapก่อนgrant. A-test UXguardจากFR05/NFR01: ขณะรอควรdisableซ้ำและปิดแล้วไม่เปิดผังกลับเอง; สิทธิ์ต้องยังผูกuser/event/round. Dไม่ได้กำหนดclosed-dialog/duplicate-submitตรงๆ จึงรายงานส่วนguardเป็นassumption-not-confirmedไม่ใช้ผลC6/SPECยกระดับเป็นDหรือdefectลำพัง

**จังหวะตรวจ:** จับrequestcountระหว่างค้างและsnapshotหลังปิด/ปล่อย; boundedwaitรับlateevent;ยกเลิกinterceptionทุกครั้ง

**คืนสภาพ:** เก็บหลักฐาน UTC/เวลาจำลอง ไม่เก็บ session token; logout/ปิด context; ยกเลิก interception; คืน fixture/clock เฉพาะ instance ของผู้รัน

**ถ้ากฎผิด ควรต่างอย่างไร:** ปล่อยresponseก่อนปิดจึงไม่ใช่raceหรือใช้ผลC6เป็นoracle

## เช็กลิสต์
- ข้อมูลและexpectedจากD/A-policy/A-testที่ระบุ ไม่ลอกO
- ทุกnegativeมีpositivecontrolที่เกี่ยวข้อง
- ตรวจตามจังหวะ ไม่ให้gateอื่นบังผล
- resetเฉพาะworker/DBตน
- ไม่แก้expectedหลังรอบฝังบั๊ก

### 5.2 — การ์ดทดสอบละเอียดหลังรีวิว

ผู้เขียนเดิม: /root/writer_52; ผู้แก้รวม: /root หลัง independent review; ฉบับก่อนแก้อยู่ before-review/

## V3-A14 — โควตา Member สะสมและข้ามอุปกรณ์

**ส่วนระบบ:** โควตาที่นั่ง

**กฎที่อ้างอิง:** ["FR08","BR08","NFR03"]

**ระดับ:** P1

**เทคนิค:** ["state transition","boundary value","cross-session"]

**ที่มาของ oracle:** {"D":["REQUIREMENTS.md","TEST-DATA.md","USER-STORIES.md"],"A-policy":[],"R":"บริบทอ้างอิง REF05 เฉพาะ contact/summary ตาม REQUIREMENTS; ไม่ใช้เว็บอ้างอิงตั้งตัวเลข/สถานะ","exploration":"EXPLORATION.md และ exploration/lab8/c1.md–c7.md เป็น O/เบาะแส ไม่ใช้แทน oracle","mapping":"plan/assignments.json; e2e/api.test.mjs, ui.spec.js, lab.spec.js ใช้จับคู่ ID/actions เท่านั้น"}

**เงื่อนไขก่อนเริ่ม:** ฐานทดสอบแยกเริ่มใหม่ เวลา 2026-11-06T03:00:00Z; fan/FanDemo!26 อยู่คิว active NEON Member และตรวจ ENCORE-0001 ผ่าน; ไม่มี hold/order เดิม; ไม่ใช้พอร์ตผู้ใช้ 4310

**ข้อมูลทดสอบ:** {"ซื้อแรก":["C01"],"ลองเกิน":["C02","C03"],"ซื้อที่สอง":["C02"],"ลองใบสาม":["C03"]}

**ขั้นตอน:**
1. ซื้อ C01 พร้อม contact ถูกต้องและอนุมัติชำระจำลอง เก็บ order/ticket
2. ส่ง hold C02,C03 จากบัญชีเดิม; อ่าน active-hold และ seat map
3. valid control: hold C02 เพียงใบเดียว แล้ว checkout/pay สำเร็จ
4. login fan ใน context ใหม่และแท็บเดิม ลอง hold C03 ทั้งคู่

**ผลที่คาดหวัง:** ครั้งเกินหลังซื้อหนึ่งใบถูกปฏิเสธ (409) ไม่มี hold บางส่วน; C02 ใบเดียวสำเร็จ; หลังซื้อรวมสองใบทั้งสอง session ขอ C03 ไม่ได้ ยอด valid ticket Member เท่ากับ 2 ไม่ใช่ต่อแท็บ

**จังหวะตรวจ:** ตรวจหลังแต่ละ hold response และ GET map/active-hold; ตรวจโควตาอีกครั้งหลัง success และ login ใหม่

**คืนสภาพ:** เก็บ request/response และภาพตาม ID โดยปิดบัง session; release hold ที่ยัง held ด้วยเจ้าของ; ถ้า paid/pending หรือเปลี่ยนเวลา/state ให้ทิ้งฐานเฉพาะกรณีแล้วสร้าง fixture ใหม่ ห้าม reset พอร์ตผู้อื่น

**ถ้ากฎผิด ควรต่างอย่างไร:** ยอมให้ซื้อรวมสามใบ หรือทดสอบเพียง request เดียวได้ 2 ใบโดยไม่ซื้อสะสม

## V3-A15 — ตะกร้าว่าง ซ้ำ เกิน ขายแล้ว และ atomic reject

**ส่วนระบบ:** ตรวจรายการที่นั่ง

**กฎที่อ้างอิง:** ["FR07","FR08","BR08","NFR03"]

**ระดับ:** P1

**เทคนิค:** ["equivalence partition","boundary value","transaction"]

**ที่มาของ oracle:** {"D":["REQUIREMENTS.md","TEST-DATA.md","USER-STORIES.md"],"A-policy":[],"R":"บริบทอ้างอิง REF05 เฉพาะ contact/summary ตาม REQUIREMENTS; ไม่ใช้เว็บอ้างอิงตั้งตัวเลข/สถานะ","exploration":"EXPLORATION.md และ exploration/lab8/c1.md–c7.md เป็น O/เบาะแส ไม่ใช้แทน oracle","mapping":"plan/assignments.json; e2e/api.test.mjs, ui.spec.js, lab.spec.js ใช้จับคู่ ID/actions เท่านั้น"}

**เงื่อนไขก่อนเริ่ม:** ฐานทดสอบแยกเริ่มใหม่ เวลา 2026-11-06T03:00:00Z; fan/FanDemo!26 อยู่คิว active NEON Member และตรวจ ENCORE-0001 ผ่าน; ไม่มี hold/order เดิม; ไม่ใช้พอร์ตผู้ใช้ 4310

**ข้อมูลทดสอบ:** {"invalid":[[],["C01","C01"],["C01","C02","C03"],["X99"],["C01","A03"]],"control":["C01","C02"],"sold":["A03","A04","B09","C06","D10"]}

**ขั้นตอน:**
1. จากไม่มี hold ส่ง invalid แต่ละชุดแยกครั้ง
2. หลังทุกครั้งอ่าน active-hold และ map C01/C02
3. valid control: ขอ C01,C02 สองที่ว่างครั้งเดียว

**ผลที่คาดหวัง:** ว่าง/ซ้ำ/3ใบปฏิเสธ 400; X99/ปน A03 ขายแล้วปฏิเสธ 409; ไม่ถือเฉพาะ C01 ทิ้งไว้ ไม่มี active-hold; control สองใบสร้าง hold เดียวสำเร็จ 201

**จังหวะตรวจ:** ตรวจทันทีหลังแต่ละ rejection ก่อนส่งกรณีถัดไป และหลัง control

**คืนสภาพ:** เก็บ request/response และภาพตาม ID โดยปิดบัง session; release hold ที่ยัง held ด้วยเจ้าของ; ถ้า paid/pending หรือเปลี่ยนเวลา/state ให้ทิ้งฐานเฉพาะกรณีแล้วสร้าง fixture ใหม่ ห้าม reset พอร์ตผู้อื่น

**ถ้ากฎผิด ควรต่างอย่างไร:** reject ปนขายแล้วแต่เก็บ C01 ไว้ หรือ deduplicate แทนปฏิเสธ

## V3-A16 — แย่งที่เดียวและ ID ที่นั่งข้ามงาน

**ส่วนระบบ:** atomic seat allocation

**กฎที่อ้างอิง:** ["FR07","NFR03"]

**ระดับ:** P1

**เทคนิค:** ["concurrency","isolation","positive control"]

**ที่มาของ oracle:** {"D":["REQUIREMENTS.md","TEST-DATA.md","USER-STORIES.md"],"A-policy":[],"R":"บริบทอ้างอิง REF05 เฉพาะ contact/summary ตาม REQUIREMENTS; ไม่ใช้เว็บอ้างอิงตั้งตัวเลข/สถานะ","exploration":"EXPLORATION.md และ exploration/lab8/c1.md–c7.md เป็น O/เบาะแส ไม่ใช้แทน oracle","mapping":"plan/assignments.json; e2e/api.test.mjs, ui.spec.js, lab.spec.js ใช้จับคู่ ID/actions เท่านั้น"}

**เงื่อนไขก่อนเริ่ม:** ฐานทดสอบแยกเริ่มใหม่ เวลา 2026-11-06T03:00:00Z; fan/FanDemo!26 อยู่คิว active NEON Member และตรวจ ENCORE-0001 ผ่าน; ไม่มี hold/order เดิม; ไม่ใช้พอร์ตผู้ใช้ 4310

**ข้อมูลทดสอบ:** {"buyers":["fan","fan2"],"neonSeat":"C01","otherEvent":"aurora","otherSeat":"C01"}

**ขั้นตอน:**
1. เตรียม fan/fan2 active และ grant ของตน ENCORE-0001/0002
2. ใช้ barrier ส่ง hold NEON C01 พร้อมกันสอง context และรอทั้งคู่
3. อ่าน map และ hold ทั้งสอง owner
4. valid control: general/GeneralDemo!26 เข้า Aurora General active แล้ว hold Aurora C01

**ผลที่คาดหวัง:** NEON มีผู้สำเร็จ 201 เพียงหนึ่งราย ผู้แพ้ 409; C01 ผูก hold ของผู้ชนะเท่านั้น; Aurora C01 สร้าง hold 201 ได้โดยไม่แก้ NEON ไม่ใช้ seat ID เป็น global key

**จังหวะตรวจ:** หลัง Promise ทั้งสองเสร็จ ตรวจ invariant ทั้งคู่ จากนั้นหลัง hold Aurora ตรวจสองผัง

**คืนสภาพ:** เก็บ request/response และภาพตาม ID โดยปิดบัง session; release hold ที่ยัง held ด้วยเจ้าของ; ถ้า paid/pending หรือเปลี่ยนเวลา/state ให้ทิ้งฐานเฉพาะกรณีแล้วสร้าง fixture ใหม่ ห้าม reset พอร์ตผู้อื่น

**ถ้ากฎผิด ควรต่างอย่างไร:** รวมผลเพียง status รวมโดยไม่ตรวจ owner หรือปฏิเสธ C01 ทุกงาน

## V3-A17 — ราคา server ส่วนลด cap และยอดปลอม

**ส่วนระบบ:** canonical money

**กฎที่อ้างอิง:** ["FR10","BR12","BR13"]

**ระดับ:** P1

**เทคนิค:** ["decision table","boundary value","tampering"]

**ที่มาของ oracle:** {"D":["REQUIREMENTS.md","TEST-DATA.md","USER-STORIES.md"],"A-policy":[],"R":"บริบทอ้างอิง REF05 เฉพาะ contact/summary ตาม REQUIREMENTS; ไม่ใช้เว็บอ้างอิงตั้งตัวเลข/สถานะ","exploration":"EXPLORATION.md และ exploration/lab8/c1.md–c7.md เป็น O/เบาะแส ไม่ใช้แทน oracle","mapping":"plan/assignments.json; e2e/api.test.mjs, ui.spec.js, lab.spec.js ใช้จับคู่ ID/actions เท่านั้น"}

**เงื่อนไขก่อนเริ่ม:** ฐานทดสอบแยกเริ่มใหม่ เวลา 2026-11-06T03:00:00Z; fan/FanDemo!26 อยู่คิว active NEON Member และตรวจ ENCORE-0001 ผ่าน; ไม่มี hold/order เดิม; ไม่ใช้พอร์ตผู้ใช้ 4310

**ข้อมูลทดสอบ:** {"cases":[{"seats":["C01"],"coupon":"","amounts":[1800,0,30,2,1832]},{"seats":["C01"],"coupon":"STAGE10","amounts":[1800,180,30,2,1652]},{"seats":["C01","C02"],"coupon":"STAGE10","amounts":[3600,360,60,4,3304]},{"seats":["A01","A02"],"coupon":"STAGE10","amounts":[6400,500,60,4,5964]},{"seats":["A01","C01"],"coupon":"STAGE10","amounts":[5000,500,60,4,4564]}],"tamperedTotal":1,"invalidCoupon":"FAKE"}

**ขั้นตอน:**
1. แต่ละชุดใช้ hold ใหม่หรือ release ชุดก่อน ส่ง total=1 ควบคู่ seats/coupon
2. หลัง hold อ่าน server hold.price และตรวจยอดรายบรรทัด net+fee+vat รวม
3. กรอก contact ถูกต้องไป summary และอ่านยอดอีกครั้ง
4. ส่ง coupon FAKE แล้วอ่านว่ารายการที่ถูกต้องก่อนหน้ายังอยู่

**ผลที่คาดหวัง:** แต่ละ amounts เรียง subtotal/discount/fee/VAT/total ตรง TEST-DATA; VAT round(7% fee); 2VIP discount=min(640,500)=500 total5964; รายใบรวมตรงยอด; total=1 ไม่มีผล; FAKE ปฏิเสธโดยไม่ทำลาย hold เดิม

**จังหวะตรวจ:** ตรวจหลัง hold และหลัง checkout server/summary ทุกชุด โดยเฉพาะ 5964 หลังยืนยันที่นั่ง ไม่ใช้ preview อย่างเดียว

**คืนสภาพ:** เก็บ request/response และภาพตาม ID โดยปิดบัง session; release hold ที่ยัง held ด้วยเจ้าของ; ถ้า paid/pending หรือเปลี่ยนเวลา/state ให้ทิ้งฐานเฉพาะกรณีแล้วสร้าง fixture ใหม่ ห้าม reset พอร์ตผู้อื่น

**ถ้ากฎผิด ควรต่างอย่างไร:** 5824 จากลด640 หรือยอมให้ client total=1; คัด observed total เป็น expected

## V3-A18 — อายุ hold 600 วินาที กู้คืนและปล่อยเมื่อปิด

**ส่วนระบบ:** hold lifecycle

**กฎที่อ้างอิง:** ["FR10","FR17","BR09"]

**ระดับ:** P1

**เทคนิค:** ["boundary value","state transition","recovery"]

**ที่มาของ oracle:** {"D":["REQUIREMENTS.md","TEST-DATA.md","USER-STORIES.md"],"A-policy":[],"R":"บริบทอ้างอิง REF05 เฉพาะ contact/summary ตาม REQUIREMENTS; ไม่ใช้เว็บอ้างอิงตั้งตัวเลข/สถานะ","exploration":"EXPLORATION.md และ exploration/lab8/c1.md–c7.md เป็น O/เบาะแส ไม่ใช้แทน oracle","mapping":"plan/assignments.json; e2e/api.test.mjs, ui.spec.js, lab.spec.js ใช้จับคู่ ID/actions เท่านั้น"}

**เงื่อนไขก่อนเริ่ม:** ฐานทดสอบแยกเริ่มใหม่ เวลา 2026-11-06T03:00:00Z; fan/FanDemo!26 อยู่คิว active NEON Member และตรวจ ENCORE-0001 ผ่าน; ไม่มี hold/order เดิม; ไม่ใช้พอร์ตผู้ใช้ 4310

**ข้อมูลทดสอบ:** {"holdAt":"2026-11-06T03:00:00Z","before":"2026-11-06T03:09:59.999Z","expiry":"2026-11-06T03:10:00Z","seat":"C01"}

**ขั้นตอน:**
1. hold C01 ไม่เริ่ม payment; เก็บ ID/expires
2. login fan อีก context และ reload/resume ตรวจ ID เดิม
3. clock เฉพาะฐานนี้ไป 599.999s แล้วอ่าน active-hold; ไป600sอ่านซ้ำและลอง pay
4. ฐานใหม่: hold C01 แล้วปิด booking dialog รอ release สำเร็จ

**ผลที่คาดหวัง:** expires=03:10Z; reload/context ใหม่คืน ID/seat เดิม; ก่อนขอบยัง held; ตรง600s hold=null pay409 และ C01 available; ปิด dialog ของ hold ที่ไม่ pending ต้องปล่อยก่อนหมด600s

**จังหวะตรวจ:** ตรวจหลัง reload/resume, ที่599.999s, ที่600s หลัง sweep/read และหลัง close/release response

**คืนสภาพ:** เก็บ request/response และภาพตาม ID โดยปิดบัง session; release hold ที่ยัง held ด้วยเจ้าของ; ถ้า paid/pending หรือเปลี่ยนเวลา/state ให้ทิ้งฐานเฉพาะกรณีแล้วสร้าง fixture ใหม่ ห้าม reset พอร์ตผู้อื่น

**ถ้ากฎผิด ควรต่างอย่างไร:** ใช้รอโดยประมาณ10นาที หรือปิดหน้าต่างแล้วเช็คเฉพาะ UI โดยไม่ดู active-hold/map

## V3-A19 — บังคับ checkout และป้องกันแก้ hold คนอื่น

**ส่วนระบบ:** checkout ownership

**กฎที่อ้างอิง:** ["FR09","BR11","NFR02"]

**ระดับ:** P1

**เทคนิค:** ["authorization matrix","negative testing","positive control"]

**ที่มาของ oracle:** {"D":["REQUIREMENTS.md","TEST-DATA.md","USER-STORIES.md"],"A-policy":[],"R":"บริบทอ้างอิง REF05 เฉพาะ contact/summary ตาม REQUIREMENTS; ไม่ใช้เว็บอ้างอิงตั้งตัวเลข/สถานะ","exploration":"EXPLORATION.md และ exploration/lab8/c1.md–c7.md เป็น O/เบาะแส ไม่ใช้แทน oracle","mapping":"plan/assignments.json; e2e/api.test.mjs, ui.spec.js, lab.spec.js ใช้จับคู่ ID/actions เท่านั้น"}

**เงื่อนไขก่อนเริ่ม:** ฐานทดสอบแยกเริ่มใหม่ เวลา 2026-11-06T03:00:00Z; fan/FanDemo!26 อยู่คิว active NEON Member และตรวจ ENCORE-0001 ผ่าน; ไม่มี hold/order เดิม; ไม่ใช้พอร์ตผู้ใช้ 4310

**ข้อมูลทดสอบ:** {"owner":"fan","other":"fan2","seat":"C01","buyer":{"name":"Buyer Test","email":"buyer@example.test","phone":"0812345678"}}

**ขั้นตอน:**
1. fan hold C01 แล้ว pay โดยยังไม่บันทึก contact
2. fan2 ส่ง checkout พร้อม hold ID ของ fan และข้อมูลครบ
3. ตรวจ hold ของ fan ว่าไม่มี checkout เปลี่ยน
4. valid control: fan บันทึก buyer และ Holder 1/C01 ครบ แล้วเริ่ม payment pending

**ผลที่คาดหวัง:** pay แรกไม่ผ่าน CHECKOUT_REQUIRED ไม่มี payment/ticket/email; fan2 ได้404ไม่เปิดเผยข้อมูลและไม่แก้ owner hold; owner checkout ถูกต้องและเริ่ม pending ได้

**จังหวะตรวจ:** หลัง pay ก่อน contact, หลัง foreign checkout และหลัง owner control ก่อน resolve payment

**คืนสภาพ:** เก็บ request/response และภาพตาม ID โดยปิดบัง session; release hold ที่ยัง held ด้วยเจ้าของ; ถ้า paid/pending หรือเปลี่ยนเวลา/state ให้ทิ้งฐานเฉพาะกรณีแล้วสร้าง fixture ใหม่ ห้าม reset พอร์ตผู้อื่น

**ถ้ากฎผิด ควรต่างอย่างไร:** สรุปว่า checkout validation ผ่านทั้งที่ไม่เคยทำ control จึงอาจ fail เพราะไม่มีสิทธิ์ทั้งหมด

## V3-A20 — ตรวจ contact ทุกคนและ seat mapping

**ส่วนระบบ:** contact validation

**กฎที่อ้างอิง:** ["FR09","BR10","BR11"]

**ระดับ:** P1

**เทคนิค:** ["equivalence partition","decision table","positive control"]

**ที่มาของ oracle:** {"D":["REQUIREMENTS.md","TEST-DATA.md","USER-STORIES.md"],"A-policy":[],"R":"บริบทอ้างอิง REF05 เฉพาะ contact/summary ตาม REQUIREMENTS; ไม่ใช้เว็บอ้างอิงตั้งตัวเลข/สถานะ","exploration":"EXPLORATION.md และ exploration/lab8/c1.md–c7.md เป็น O/เบาะแส ไม่ใช้แทน oracle","mapping":"plan/assignments.json; e2e/api.test.mjs, ui.spec.js, lab.spec.js ใช้จับคู่ ID/actions เท่านั้น"}

**เงื่อนไขก่อนเริ่ม:** ฐานทดสอบแยกเริ่มใหม่ เวลา 2026-11-06T03:00:00Z; fan/FanDemo!26 อยู่คิว active NEON Member และตรวจ ENCORE-0001 ผ่าน; ไม่มี hold/order เดิม; ไม่ใช้พอร์ตผู้ใช้ 4310

**ข้อมูลทดสอบ:** {"seats":["C01","C02"],"validBuyer":{"name":"Buyer Test","email":" BUYER@EXAMPLE.TEST ","phone":"+66 81-234-5678"},"holders":["C01:Holder 1 / holder1@example.test / 0898765432","C02:Holder 2 / holder2@example.test / 0898765432"],"invalid":["Single","bademail","123","holders=[]","ขาดC02","C01ซ้ำ","A01นอกbasket"]}

**ขั้นตอน:**
1. hold C01,C02; เตรียม valid payload ต้นแบบ
2. เปลี่ยน buyer field ทีละช่องเป็น Single/bademail/123 ส่ง server checkout
3. จาก valid buyer เปลี่ยน holder คนที่สองเป็นชื่อ/อีเมล/โทรผิดทีละช่อง และลอง mapping ขาด/ซ้ำ/นอก basket
4. valid control: ส่งครบสองผู้ถือ seat ไม่ซ้ำ แล้วอ่าน saved checkout

**ผลที่คาดหวัง:** ทุก payload ผิดได้400 ไม่มี checkout บางส่วน; valid200 มีสองผู้ถือจับคู่ C01/C02 ครบ; buyer email normalize buyer@example.test และ phone +66812345678; UI แสดง error ระบุแก้ไขได้

**จังหวะตรวจ:** ตรวจ response และ active-hold.checkout หลังแต่ละ invalid; ตรวจ normalized snapshot หลัง valid save

**คืนสภาพ:** เก็บ request/response และภาพตาม ID โดยปิดบัง session; release hold ที่ยัง held ด้วยเจ้าของ; ถ้า paid/pending หรือเปลี่ยนเวลา/state ให้ทิ้งฐานเฉพาะกรณีแล้วสร้าง fixture ใหม่ ห้าม reset พอร์ตผู้อื่น

**ถ้ากฎผิด ควรต่างอย่างไร:** ตรวจเฉพาะ buyer จน holder ผิดหลุด หรือจำนวนสองคนถูกแต่ผูก C01 ซ้ำ

## V3-A21 — snapshot ข้ามอุปกรณ์และห้ามแก้หลัง pending

**ส่วนระบบ:** contact snapshot

**กฎที่อ้างอิง:** ["FR10","FR15","BR19"]

**ระดับ:** P1

**เทคนิค:** ["state transition","cross-session","immutability"]

**ที่มาของ oracle:** {"D":["REQUIREMENTS.md","TEST-DATA.md","USER-STORIES.md"],"A-policy":[],"R":"บริบทอ้างอิง REF05 เฉพาะ contact/summary ตาม REQUIREMENTS; ไม่ใช้เว็บอ้างอิงตั้งตัวเลข/สถานะ","exploration":"EXPLORATION.md และ exploration/lab8/c1.md–c7.md เป็น O/เบาะแส ไม่ใช้แทน oracle","mapping":"plan/assignments.json; e2e/api.test.mjs, ui.spec.js, lab.spec.js ใช้จับคู่ ID/actions เท่านั้น"}

**เงื่อนไขก่อนเริ่ม:** ฐานทดสอบแยกเริ่มใหม่ เวลา 2026-11-06T03:00:00Z; fan/FanDemo!26 อยู่คิว active NEON Member และตรวจ ENCORE-0001 ผ่าน; ไม่มี hold/order เดิม; ไม่ใช้พอร์ตผู้ใช้ 4310

**ข้อมูลทดสอบ:** {"seat":"C01","before":"Buyer Test / Holder 1","attempted":"Changed Buyer / Changed Holder","method":"alipay"}

**ขั้นตอน:**
1. hold/save contact ถูกต้อง แล้ว login fan อีก context อ่าน active-hold
2. เริ่ม payment pending และเก็บ paymentID/checkout เดิม
3. ส่งแก้ contact ที่ถูก syntax แต่ชื่อใหม่ และอีกครั้ง holders=[]; reload/resume ทั้งสอง context
4. อนุมัติจำลองแล้วอ่าน order และ email sandbox

**ผลที่คาดหวัง:** ก่อน pending สอง context เห็น snapshot เดิม; pending แก้ด้วย valid หรือ invalid payload ถูกปฏิเสธ409 UI edit disabled; reload ยังคงชื่อเดิม/payment เดิม; หลัง success order/mail ใช้ชื่อเดิมและ buyer.email เดิม

**จังหวะตรวจ:** ตรวจก่อน pending, หลังแต่ละ edit response, หลัง reload/resume และหลัง success ก่อนอ่าน mail

**คืนสภาพ:** เก็บ request/response และภาพตาม ID โดยปิดบัง session; release hold ที่ยัง held ด้วยเจ้าของ; ถ้า paid/pending หรือเปลี่ยนเวลา/state ให้ทิ้งฐานเฉพาะกรณีแล้วสร้าง fixture ใหม่ ห้าม reset พอร์ตผู้อื่น

**ถ้ากฎผิด ควรต่างอย่างไร:** payloadผิดถูกปฏิเสธเพราะรูปแบบจึงไม่พิสูจน์ freeze; ต้องใช้ payloadแก้ที่ถูกด้วย

## V3-A43 — Member สองใบนับรวมเพดานสี่เมื่อเปิด General

**ส่วนระบบ:** quota across rounds

**กฎที่อ้างอิง:** ["FR08","BR08","BR03"]

**ระดับ:** P1

**เทคนิค:** ["state transition","boundary value","decision table"]

**ที่มาของ oracle:** {"D":["REQUIREMENTS.md","TEST-DATA.md","USER-STORIES.md"],"A-policy":[],"R":"บริบทอ้างอิง REF05 เฉพาะ contact/summary ตาม REQUIREMENTS; ไม่ใช้เว็บอ้างอิงตั้งตัวเลข/สถานะ","exploration":"EXPLORATION.md และ exploration/lab8/c1.md–c7.md เป็น O/เบาะแส ไม่ใช้แทน oracle","mapping":"plan/assignments.json; e2e/api.test.mjs, ui.spec.js, lab.spec.js ใช้จับคู่ ID/actions เท่านั้น"}

**เงื่อนไขก่อนเริ่ม:** fanบัญชีเดิมจ่ายMember2ใบก่อน15:00;รักษาuser/orderเดิม; AT06อนุญาตAPIGeneralหลัง15 แม้catalogยังแสดงรอบMember

**ข้อมูลทดสอบ:** {"member":["C01","C02"],"generalTooMany":["C03","C04","C05"],"generalValid":["C03","C04"],"clock":"2026-11-06T08:00:00Z"}

**ขั้นตอน:**
1. จ่ายC01/C02ในMemberด้วยfan
2. ตั้งเวลา08:00Zแล้วใช้fanเดิม POSTqueue roundgeneral ให้active
3. ขอเพิ่ม3ใบต้องdeny(รวม5);เพิ่ม2ใบต้องจ่ายสำเร็จ(รวม4);ใบถัดไปต้องdeny
4. ไม่เปลี่ยนบัญชี/role ไม่สร้างเส้นทางUI และไม่skipเพราะMembercatalogซ่อนGeneral

**ผลที่คาดหวัง:** quotaสะสมรวมข้ามroundในบัญชีเดิมไม่เกิน4; APIregressionนี้มีauthorizedadmissionตามAT06 ไม่ใช้visibilityเป็นข้อห้ามeligibility

**จังหวะตรวจ:** หลังเปลี่ยนรอบ/queue active, หลัง rejection, หลัง success สองใบและลองใบที่5

**คืนสภาพ:** เก็บ request/response และภาพตาม ID โดยปิดบัง session; release hold ที่ยัง held ด้วยเจ้าของ; ถ้า paid/pending หรือเปลี่ยนเวลา/state ให้ทิ้งฐานเฉพาะกรณีแล้วสร้าง fixture ใหม่ ห้าม reset พอร์ตผู้อื่น

**ถ้ากฎผิด ควรต่างอย่างไร:** ถ้านับเฉพาะroundจะรับใบรวม5ได้;ถ้าลืมนับMemberเดิมอาจซื้อGeneralอีก4ได้

## V3-A46 — เปลี่ยนที่ล้มเหลว rollback และ release เฉพาะเจ้าของ

**ส่วนระบบ:** hold replacement/release

**กฎที่อ้างอิง:** ["FR07","FR10","FR17","BR09","NFR03"]

**ระดับ:** P1

**เทคนิค:** ["transaction rollback","authorization","idempotency"]

**ที่มาของ oracle:** {"D":["REQUIREMENTS.md","TEST-DATA.md","USER-STORIES.md"],"A-policy":[],"R":"บริบทอ้างอิง REF05 เฉพาะ contact/summary ตาม REQUIREMENTS; ไม่ใช้เว็บอ้างอิงตั้งตัวเลข/สถานะ","exploration":"EXPLORATION.md และ exploration/lab8/c1.md–c7.md เป็น O/เบาะแส ไม่ใช้แทน oracle","mapping":"plan/assignments.json; e2e/api.test.mjs, ui.spec.js, lab.spec.js ใช้จับคู่ ID/actions เท่านั้น"}

**เงื่อนไขก่อนเริ่ม:** ฐานทดสอบแยกเริ่มใหม่ เวลา 2026-11-06T03:00:00Z; fan/FanDemo!26 อยู่คิว active NEON Member และตรวจ ENCORE-0001 ผ่าน; ไม่มี hold/order เดิม; ไม่ใช้พอร์ตผู้ใช้ 4310

**ข้อมูลทดสอบ:** {"original":"C01","replacement":"C02","bad":["BAD coupon","C02+A03 sold"],"foreign":"fan2"}

**ขั้นตอน:**
1. fan hold C01 เก็บID
2. ขอเปลี่ยนเป็นC02ด้วยBAD และC02+A03 อ่าน hold/map หลังแต่ละครั้ง
3. fan2 release ID ของfan
4. valid control: fanเปลี่ยนเป็นC02ถูกต้อง แล้ว release holdใหม่สองครั้ง

**ผลที่คาดหวัง:** invalid400/409 คงhold ID/C01เดิม ไม่สร้าง C02; foreign404ไม่ปล่อยของfan; valid replacement ได้IDใหม่ C01available/C02held; releaseซ้ำ200ได้โดยไม่มีผลเกินครั้งแรก สุดท้ายholdnull/C02available

**จังหวะตรวจ:** ตรวจหลังทุก rejected mutation; หลัง replacement ก่อน release; หลัง release แต่ละครั้ง

**คืนสภาพ:** เก็บ request/response และภาพตาม ID โดยปิดบัง session; release hold ที่ยัง held ด้วยเจ้าของ; ถ้า paid/pending หรือเปลี่ยนเวลา/state ให้ทิ้งฐานเฉพาะกรณีแล้วสร้าง fixture ใหม่ ห้าม reset พอร์ตผู้อื่น

**ถ้ากฎผิด ควรต่างอย่างไร:** ปล่อย C01 ก่อนตรวจรายการใหม่แล้วคืนไม่สำเร็จ หรือ foreign release คืนทุกseat

## V3-A47 — General เพดานสี่และ pending ไม่ย้ายงานหรือ method

**ส่วนระบบ:** General quota/pending isolation

**กฎที่อ้างอิง:** ["FR08","FR10","FR12","BR08","BR09","BR13"]

**ระดับ:** P1

**เทคนิค:** ["boundary value","state transition","cross-event"]

**ที่มาของ oracle:** {"D":["REQUIREMENTS.md","TEST-DATA.md","USER-STORIES.md"],"A-policy":[],"R":"บริบทอ้างอิง REF05 เฉพาะ contact/summary ตาม REQUIREMENTS; ไม่ใช้เว็บอ้างอิงตั้งตัวเลข/สถานะ","exploration":"EXPLORATION.md และ exploration/lab8/c1.md–c7.md เป็น O/เบาะแส ไม่ใช้แทน oracle","mapping":"plan/assignments.json; e2e/api.test.mjs, ui.spec.js, lab.spec.js ใช้จับคู่ ID/actions เท่านั้น"}

**เงื่อนไขก่อนเริ่ม:** ฐานใหม่เวลาเริ่ม; general/GeneralDemo!26 ไม่มีmembership เข้า Aurora General active; Jazz เปิด General ด้วย; ไม่มี hold/order เดิม

**ข้อมูลทดสอบ:** {"account":"general","event":"aurora","tooMany":["C01","C02","C03","C04","C05"],"four":["C01","C02","C03","C04"],"otherEvent":"jazz","pendingMethod":"qr","repeatMethod":"alipay"}

**ขั้นตอน:**
1. General เข้า Aurora; ส่ง5ใบแล้วส่ง4ใบเป็นvalid control
2. save contactsครบ4เริ่มqr pending; เก็บpaymentID/method
3. เข้าJazzแล้วขอholdC01; เรียกpayเดิมอีกด้วยalipay
4. resolveเดิมapproved; ลองAurora C05และJazz C01อีกครั้ง

**ผลที่คาดหวัง:** 5ใบ400; 4ใบ201 subtotal7200 fee120 VAT8 total7328; pendingข้ามงานถูกPAYMENT_PENDING; payซ้ำคืนpaymentIDเดิมและmethodqr; successแล้วAuroraใบ5ถูกQUOTA_EXCEEDEDแต่JazzC01สำเร็จ โควตาต่อevent

**จังหวะตรวจ:** หลังแต่ละhold, ระหว่างpendingก่อนresolve และหลังsuccessก่อน/หลังข้ามงาน

**คืนสภาพ:** เก็บ request/response และภาพตาม ID โดยปิดบัง session; release hold ที่ยัง held ด้วยเจ้าของ; ถ้า paid/pending หรือเปลี่ยนเวลา/state ให้ทิ้งฐานเฉพาะกรณีแล้วสร้าง fixture ใหม่ ห้าม reset พอร์ตผู้อื่น

**ถ้ากฎผิด ควรต่างอย่างไร:** เริ่มสองpendingข้ามevent หรือเปลี่ยนmethodโดยเปลี่ยนpaymentเดิม

## V3-A52 — ผู้จัด block/unblock และ combined update ต้อง atomic

**ส่วนระบบ:** organizer seat/state

**กฎที่อ้างอิง:** ["FR07","FR17","BR20","NFR03"]

**ระดับ:** P1

**เทคนิค:** ["transaction rollback","type partition","positive control"]

**ที่มาของ oracle:** {"D":["REQUIREMENTS.md","TEST-DATA.md","USER-STORIES.md"],"A-policy":[],"R":"บริบทอ้างอิง REF05 เฉพาะ contact/summary ตาม REQUIREMENTS; ไม่ใช้เว็บอ้างอิงตั้งตัวเลข/สถานะ","exploration":"EXPLORATION.md และ exploration/lab8/c1.md–c7.md เป็น O/เบาะแส ไม่ใช้แทน oracle","mapping":"plan/assignments.json; e2e/api.test.mjs, ui.spec.js, lab.spec.js ใช้จับคู่ ID/actions เท่านั้น"}

**เงื่อนไขก่อนเริ่ม:** ฐานทดสอบแยกเริ่มใหม่ เวลา 2026-11-06T03:00:00Z; fan/FanDemo!26 อยู่คิว active NEON Member และตรวจ ENCORE-0001 ผ่าน; ไม่มี hold/order เดิม; ไม่ใช้พอร์ตผู้ใช้ 4310

**ข้อมูลทดสอบ:** {"owner":"encore","invalidUpdate":{"state":"paused","round":"general"},"invalidSeat":"X99","wrongType":"blocked=\"true\"","seat":"C01"}

**ขั้นตอน:**
1. encoreอ่านNEON stateก่อนแก้; ส่งcombined paused+forcedgeneral
2. อ่านdashboardและfan queue/mapยืนยัน stateไม่เปลี่ยน
3. ลองX99และblockedเป็นstring
4. validcontrol block C01แล้วfanhold; unblockเป็นbooleanfalseแล้วfanholdC01
5. หลังcontrolholdสำเร็จ ลองblockC01ขณะheld ตรวจปฏิเสธและholdเดิมคงอยู่

**ผลที่คาดหวัง:** combined400 ไม่พักขายบางส่วน stateยังon_saleและroundตามclock; X99ได้404/stringได้400 ไม่เปลี่ยนseat; blockbooleantrueสำเร็จและhold409; unblockแล้วhold201; sold/heldห้ามเปลี่ยนเป็นว่างโดยblockทับ

**จังหวะตรวจ:** หลังcombined rejectionอ่านstateก่อนคำสั่งถัดไป; หลังinvalidseatแต่ละครั้ง; หลังblockและunblockตรวจmap/hold

**คืนสภาพ:** เก็บ request/response และภาพตาม ID โดยปิดบัง session; release hold ที่ยัง held ด้วยเจ้าของ; ถ้า paid/pending หรือเปลี่ยนเวลา/state ให้ทิ้งฐานเฉพาะกรณีแล้วสร้าง fixture ใหม่ ห้าม reset พอร์ตผู้อื่น

**ถ้ากฎผิด ควรต่างอย่างไร:** เห็น400แล้วถือว่าผ่านโดยไม่ตรวจpausedค้าง หรือใช้stringtrueแทนboolean

## V3-A54 — ความยาว contact ที่ขอบและรักษาข้อมูลเมื่อบันทึกผิด

**ส่วนระบบ:** contact boundaries

**กฎที่อ้างอิง:** ["FR09","FR10","BR10","BR11","BR19"]

**ระดับ:** P1

**เทคนิค:** ["boundary value","equivalence partition","rollback"]

**ที่มาของ oracle:** {"D":["REQUIREMENTS.md","TEST-DATA.md","USER-STORIES.md"],"A-policy":[],"R":"บริบทอ้างอิง REF05 เฉพาะ contact/summary ตาม REQUIREMENTS; ไม่ใช้เว็บอ้างอิงตั้งตัวเลข/สถานะ","exploration":"EXPLORATION.md และ exploration/lab8/c1.md–c7.md เป็น O/เบาะแส ไม่ใช้แทน oracle","mapping":"plan/assignments.json; e2e/api.test.mjs, ui.spec.js, lab.spec.js ใช้จับคู่ ID/actions เท่านั้น"}

**เงื่อนไขก่อนเริ่ม:** ฐานทดสอบแยกเริ่มใหม่ เวลา 2026-11-06T03:00:00Z; fan/FanDemo!26 อยู่คิว active NEON Member และตรวจ ENCORE-0001 ผ่าน; ไม่มี hold/order เดิม; ไม่ใช้พอร์ตผู้ใช้ 4310

**ข้อมูลทดสอบ:** {"validName100":"A xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx","validEmail254":"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx@aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.ccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc","validPhone15":"+111111111111111","validPhone8":"12345678","invalid":["name length101","email length255","phone7","phone16","12a45678","buyer=null","Single"],"invalidEmail255":"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx@aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc","emailDerivation":"64+1+63+1+63+1+61=254;local64/domainlabels<=63"}

**ขั้นตอน:**
1. holdC01 เตรียมHolder1ข้อมูลถูกต้อง
2. ลองbuyernull/name101/email255/phone7,16,มีตัวอักษรทีละอย่าง
3. validcontrolชื่อ100/email254/phone15บันทึกและเก็บsnapshot; อีกcaseตรวจphone8ยอมรับ
4. ส่งSingleและholderผิดทีละช่องแล้วอ่านactivehold เปรียบเทียบsnapshotที่บันทึกล่าสุด

**ผลที่คาดหวัง:** invalid400; name100 email254 phone8และ15digitsมี+นำหน้ายอมรับ200; nameต้องมีชื่อ/นามสกุล ดังนั้นความยาวผ่านอย่างเดียวไม่พอ; saveผิดไม่ลบ/แก้ snapshotเดิม; ไม่ตัดข้อมูลเกินขอบให้ผ่านเงียบๆ

**จังหวะตรวจ:** หลังแต่ละresponse ตรวจsnapshotทันที; หลังvalidcontrolและหลังinvalidที่ตามมา

**คืนสภาพ:** เก็บ request/response และภาพตาม ID โดยปิดบัง session; release hold ที่ยัง held ด้วยเจ้าของ; ถ้า paid/pending หรือเปลี่ยนเวลา/state ให้ทิ้งฐานเฉพาะกรณีแล้วสร้าง fixture ใหม่ ห้าม reset พอร์ตผู้อื่น

**ถ้ากฎผิด ควรต่างอย่างไร:** ถ้าขีดจำกัดtotalemailผิดจะรับ255หรือปฏิเสธ254 ทั้งสองinputยังแยกformatจากlengthได้ ช่องอื่นเหมือนเดิม

## V3-A57 — ไม่รับผู้ซื้อใหม่เมื่อ upcoming soldout paused cancelled

**ส่วนระบบ:** sale eligibility states

**กฎที่อ้างอิง:** ["FR02","FR04","FR07","FR17","BR04","BR20"]

**ระดับ:** P1

**เทคนิค:** ["decision table","state transition","positive control"]

**ที่มาของ oracle:** {"D":["REQUIREMENTS.md","TEST-DATA.md","USER-STORIES.md"],"A-policy":["AP03","AP04"],"R":"บริบทอ้างอิง REF05 เฉพาะ contact/summary ตาม REQUIREMENTS; ไม่ใช้เว็บอ้างอิงตั้งตัวเลข/สถานะ","exploration":"EXPLORATION.md และ exploration/lab8/c1.md–c7.md เป็น O/เบาะแส ไม่ใช้แทน oracle","mapping":"plan/assignments.json; e2e/api.test.mjs, ui.spec.js, lab.spec.js ใช้จับคู่ ID/actions เท่านั้น"}

**เงื่อนไขก่อนเริ่ม:** GeneralactiveAURORA;สำเร็จholdC01แล้วreleaseเป็นpositivecontrol ก่อนเปลี่ยนstate คิวเดิมยังactive

**ข้อมูลทดสอบ:** {"soldout":["orbit","midnight"],"upcoming":"sunset","mutable":"aurora","account":"general"}

**ขั้นตอน:**
1. ตรวจsoldout/upcomingjoinไม่ผ่าน
2. pauseAURORAแล้วbuyeractiveเดิมholdC01ต้องSALE_UNAVAILABLEและactiveholdnull;joinใหม่ก็ปฏิเสธ
3. เปิดon_sale buyerเดิมholdC01ได้แล้วrelease
4. cancelแล้วbuyeractiveเดิมholdC01ต้องSALE_UNAVAILABLE/ไม่มีhold/seatยังavailable

**ผลที่คาดหวัง:** ปฏิเสธเพราะsale stateจริง ไม่ใช้คิว/grantขาดมาช่วย;on_salepositivecontrolผ่าน

**จังหวะตรวจ:** หลังแต่ละstatus mutationและคำขอjoin/hold; หลังunpauseก่อนcancel; ตรวจnoholdหลังreject

**คืนสภาพ:** เก็บ request/response และภาพตาม ID โดยปิดบัง session; release hold ที่ยัง held ด้วยเจ้าของ; ถ้า paid/pending หรือเปลี่ยนเวลา/state ให้ทิ้งฐานเฉพาะกรณีแล้วสร้าง fixture ใหม่ ห้าม reset พอร์ตผู้อื่น

**ถ้ากฎผิด ควรต่างอย่างไร:** ทดสอบเฉพาะปุ่มdisabledแต่directAPIยังซื้อได้ หรือคิดว่าpaused=canceled

## V3-L01 — สอง VIP ต้องได้ 5964 หลัง hold จริง

**ส่วนระบบ:** money regression detector

**กฎที่อ้างอิง:** ["FR10","BR12","NFR03"]

**ระดับ:** P1

**เทคนิค:** ["boundary value","independent oracle","UI/API cross-check"]

**ที่มาของ oracle:** {"D":["REQUIREMENTS.md","TEST-DATA.md","USER-STORIES.md"],"A-policy":[],"R":"บริบทอ้างอิง REF05 เฉพาะ contact/summary ตาม REQUIREMENTS; ไม่ใช้เว็บอ้างอิงตั้งตัวเลข/สถานะ","exploration":"EXPLORATION.md และ exploration/lab8/c1.md–c7.md เป็น O/เบาะแส ไม่ใช้แทน oracle","mapping":"plan/assignments.json; e2e/api.test.mjs, ui.spec.js, lab.spec.js ใช้จับคู่ ID/actions เท่านั้น"}

**เงื่อนไขก่อนเริ่ม:** ฐานทดสอบแยกเริ่มใหม่ เวลา 2026-11-06T03:00:00Z; fan/FanDemo!26 อยู่คิว active NEON Member และตรวจ ENCORE-0001 ผ่าน; ไม่มี hold/order เดิม; ไม่ใช้พอร์ตผู้ใช้ 4310

**ข้อมูลทดสอบ:** {"seats":["A01","A02"],"coupon":"STAGE10","expected":{"subtotal":6400,"discount":500,"fee":60,"vat":4,"total":5964},"wrongTotal":5824}

**ขั้นตอน:**
1. fanเข้าMember map เลือกA01,A02 ใส่STAGE10
2. ตรวจpreviewเป็น5964แล้วกดยืนยันที่นั่ง/รอcheckoutform
3. อ่านsummaryในcheckoutและserveractivehold.price เก็บหลักฐานคู่
4. controlเปรียบเทียบC01+STAGE10ในฐานใหม่ได้1652เพื่อพิสูจน์couponใช้งาน

**ผลที่คาดหวัง:** หลังhold serverและcheckoutต้อง5964=6400−min(640,500)+60+4; discount500 ไม่ใช่640; previewถูกอย่างเดียวไม่ผ่าน; control1652 ยืนยันส่วนลด10%ทำงานเมื่อไม่ถึงcap

**จังหวะตรวจ:** assertสำคัญหลังPOSTholdsสำเร็จและcheckoutformปรากฏ อ่านserverpriceซ้ำ ไม่จบที่previewก่อนยืนยัน

**คืนสภาพ:** เก็บ request/response และภาพตาม ID โดยปิดบัง session; release hold ที่ยัง held ด้วยเจ้าของ; ถ้า paid/pending หรือเปลี่ยนเวลา/state ให้ทิ้งฐานเฉพาะกรณีแล้วสร้าง fixture ใหม่ ห้าม reset พอร์ตผู้อื่น

**ถ้ากฎผิด ควรต่างอย่างไร:** 5824 หรือpreview5964แต่checkout5824; แก้expectedให้ตรงระบบ

## V3-L02 — คลิกที่สามต้องเหลือสองที่เดิม

**ส่วนระบบ:** Member selection cap

**กฎที่อ้างอิง:** ["FR07","FR08","BR08","NFR01"]

**ระดับ:** P1

**เทคนิค:** ["boundary value","state transition","negative control"]

**ที่มาของ oracle:** {"D":["REQUIREMENTS.md","TEST-DATA.md","USER-STORIES.md"],"A-policy":[],"R":"บริบทอ้างอิง REF05 เฉพาะ contact/summary ตาม REQUIREMENTS; ไม่ใช้เว็บอ้างอิงตั้งตัวเลข/สถานะ","exploration":"EXPLORATION.md และ exploration/lab8/c1.md–c7.md เป็น O/เบาะแส ไม่ใช้แทน oracle","mapping":"plan/assignments.json; e2e/api.test.mjs, ui.spec.js, lab.spec.js ใช้จับคู่ ID/actions เท่านั้น"}

**เงื่อนไขก่อนเริ่ม:** ฐานทดสอบแยกเริ่มใหม่ เวลา 2026-11-06T03:00:00Z; fan/FanDemo!26 อยู่คิว active NEON Member และตรวจ ENCORE-0001 ผ่าน; ไม่มี hold/order เดิม; ไม่ใช้พอร์ตผู้ใช้ 4310

**ข้อมูลทดสอบ:** {"first":["C01","C02"],"third":"C03"}

**ขั้นตอน:**
1. เลือกC01แล้วC02 ตรวจจำนวนselected/aria-pressedแต่ละที่
2. คลิกC03เป็นใบที่สาม อ่านselectedและข้อความแจ้ง
3. ยืนยันที่นั่งอ่านserverhold.seats
4. controlในฐานใหม่เลือกC01เพียงใบเดียวแล้วยืนยัน

**ผลที่คาดหวัง:** คลิกที่สามไม่เพิ่มและไม่แทนที่สองที่เดิม; C01/C02true C03false จำนวน2 ข้อความสูงสุด2; serverholdมีC01/C02เท่านั้น; control1ใบสำเร็จ

**จังหวะตรวจ:** ตรวจทันทีหลังคลิกที่สามก่อนกดยืนยัน และหลังholdสำเร็จอีกครั้ง

**คืนสภาพ:** เก็บ request/response และภาพตาม ID โดยปิดบัง session; release hold ที่ยัง held ด้วยเจ้าของ; ถ้า paid/pending หรือเปลี่ยนเวลา/state ให้ทิ้งฐานเฉพาะกรณีแล้วสร้าง fixture ใหม่ ห้าม reset พอร์ตผู้อื่น

**ถ้ากฎผิด ควรต่างอย่างไร:** มีtoastสูงสุด2แต่ยังselected3 หรือยกเลิกC01เพื่อใส่C03แทนโดยไม่แจ้ง

## V3-U03 — มือถือ Member contact validation/copy และ QR ทดลอง

**ส่วนระบบ:** mobile purchase

**กฎที่อ้างอิง:** ["FR07","FR08","FR09","FR10","FR11","BR08","BR10","BR13","NFR01","NFR07"]

**ระดับ:** P1

**เทคนิค:** ["end-to-end","boundary value","responsive"]

**ที่มาของ oracle:** {"D":["REQUIREMENTS.md","TEST-DATA.md","USER-STORIES.md"],"A-policy":[],"R":"บริบทอ้างอิง REF05 เฉพาะ contact/summary ตาม REQUIREMENTS; ไม่ใช้เว็บอ้างอิงตั้งตัวเลข/สถานะ","exploration":"EXPLORATION.md และ exploration/lab8/c1.md–c7.md เป็น O/เบาะแส ไม่ใช้แทน oracle","mapping":"plan/assignments.json; e2e/api.test.mjs, ui.spec.js, lab.spec.js ใช้จับคู่ ID/actions เท่านั้น"}

**เงื่อนไขก่อนเริ่ม:** ฐานทดสอบแยกเริ่มใหม่ เวลา 2026-11-06T03:00:00Z; fan/FanDemo!26 อยู่คิว active NEON Member และตรวจ ENCORE-0001 ผ่าน; ไม่มี hold/order เดิม; ไม่ใช้พอร์ตผู้ใช้ 4310

**ข้อมูลทดสอบ:** {"viewport":[375,812],"seats":["A01","A02"],"third":"A05","invalidName":"Single","validName":"Mobile Buyer","buyerEmail":"buyer@example.test","phone":"0812345678"}

**ขั้นตอน:**
1. ที่375px fanเลือกA01,A02แล้วลองA05 ตรวจคง2
2. ยืนยันที่นั่งกรอกSingle/email/phone แล้วใช้ข้อมูลผู้ซื้อสำหรับทุกใบ กดตรวจสรุป
3. แก้Mobile Buyer กดcopyทุกใบซ้ำ ตรวจสองholderครบแล้วบันทึก
4. เลือกQRเริ่มpending ตรวจภาพ/คำอธิบายทดลองและวัดscrollWidthกับclientWidth

**ผลที่คาดหวัง:** คงA01/A02และแจ้ง2ใบ; Singleแสดงerrorชื่อและนามสกุลไม่เข้าจ่าย; validcopyมีholderสองใบตรงseat; ไม่มีcouponยอด6464=6400+60+4; QRชำระเป็นENCORE-DEMO-PAYและชัดว่าdemo; ทุกขั้น375pxไม่ล้น label/errorอ่านได้

**จังหวะตรวจ:** หลังใบที่สาม, หลังinvalidsubmit, หลังcopy/validsave และหลังQRpending ทั้งภาพและค่าความกว้าง

**คืนสภาพ:** เก็บ request/response และภาพตาม ID โดยปิดบัง session; release hold ที่ยัง held ด้วยเจ้าของ; ถ้า paid/pending หรือเปลี่ยนเวลา/state ให้ทิ้งฐานเฉพาะกรณีแล้วสร้าง fixture ใหม่ ห้าม reset พอร์ตผู้อื่น

**ถ้ากฎผิด ควรต่างอย่างไร:** copyเฉพาะคนแรก หรือQRเงินจริง; ตรวจแค่catalogไม่ตรวจcheckout/payment

## V3-U08 — ค้นหาข้ามหน้าและ General เข้า Aurora

**ส่วนระบบ:** catalog pagination/search booking

**กฎที่อ้างอิง:** ["FR02","FR07","FR09","NFR01"]

**ระดับ:** P1

**เทคนิค:** ["end-to-end","pagination","positive control"]

**ที่มาของ oracle:** {"D":["REQUIREMENTS.md","TEST-DATA.md","USER-STORIES.md"],"A-policy":[],"R":"บริบทอ้างอิง REF05 เฉพาะ contact/summary ตาม REQUIREMENTS; ไม่ใช้เว็บอ้างอิงตั้งตัวเลข/สถานะ","exploration":"EXPLORATION.md และ exploration/lab8/c1.md–c7.md เป็น O/เบาะแส ไม่ใช้แทน oracle","mapping":"plan/assignments.json; e2e/api.test.mjs, ui.spec.js, lab.spec.js ใช้จับคู่ ID/actions เท่านั้น"}

**เงื่อนไขก่อนเริ่ม:** ฐานใหม่เวลา03:00Z anonymousดูcatalogได้; general/GeneralDemo!26 ใช้AuroraGeneralซึ่งavailable ไม่มีholdเดิม

**ข้อมูลทดสอบ:** {"events":["neon","sunset","orbit","aurora","jazz","rock","citypop","acoustic","kpop","hiphop","folk","midnight"],"search":"NORTHLIGHT","buyer":"general","seat":"C01"}

**ขั้นตอน:**
1. เปิดcatalogตรวจหน้าแรก6จาก12แล้วไปหน้าสอง7–12
2. ค้นหาNORTHLIGHTจากหน้าสอง
3. loginGeneralเลือกAuroraGeneralแล้วอ่านผัง
4. controlเลือกC01และholdหนึ่งใบ

**ผลที่คาดหวัง:** สองหน้ารวม12งานไม่ซ้ำ; searchทั้งcatalogพบAuroraและrange1–1จาก1แม้เดิมหน้า2; Generalไม่เห็นmembershipform เข้าผังได้ทันทีเมื่อactive; C01controlholdสำเร็จราคา1832

**จังหวะตรวจ:** หลังโหลดแต่ละหน้า, หลังsearchตอบแล้ว และหลังGeneralqueueactive/hold

**คืนสภาพ:** เก็บ request/response และภาพตาม ID โดยปิดบัง session; release hold ที่ยัง held ด้วยเจ้าของ; ถ้า paid/pending หรือเปลี่ยนเวลา/state ให้ทิ้งฐานเฉพาะกรณีแล้วสร้าง fixture ใหม่ ห้าม reset พอร์ตผู้อื่น

**ถ้ากฎผิด ควรต่างอย่างไร:** ค้นหาเฉพาะหกงานหน้าปัจจุบัน หรือGeneralต้องใส่Membership

## V3-U09 — คีย์บอร์ดและปิดระหว่างคำตอบ hold มาช้า

**ส่วนระบบ:** async close/release

**กฎที่อ้างอิง:** ["FR07","FR10","FR17","BR09","NFR01","NFR03"]

**ระดับ:** P1

**เทคนิค:** ["race condition","keyboard accessibility","state transition"]

**ที่มาของ oracle:** {"D":["REQUIREMENTS.md","TEST-DATA.md","USER-STORIES.md"],"A-policy":[],"R":"บริบทอ้างอิง REF05 เฉพาะ contact/summary ตาม REQUIREMENTS; ไม่ใช้เว็บอ้างอิงตั้งตัวเลข/สถานะ","exploration":"EXPLORATION.md และ exploration/lab8/c1.md–c7.md เป็น O/เบาะแส ไม่ใช้แทน oracle","mapping":"plan/assignments.json; e2e/api.test.mjs, ui.spec.js, lab.spec.js ใช้จับคู่ ID/actions เท่านั้น"}

**เงื่อนไขก่อนเริ่ม:** ฐานทดสอบแยกเริ่มใหม่ เวลา 2026-11-06T03:00:00Z; fan/FanDemo!26 อยู่คิว active NEON Member และตรวจ ENCORE-0001 ผ่าน; ไม่มี hold/order เดิม; ไม่ใช้พอร์ตผู้ใช้ 4310

**ข้อมูลทดสอบ:** {"seat":"C01","interception":"เฉพาะcontextทดสอบ หน่วงresponsePOST/api/holdsหลังserverสร้างholdแล้ว"}

**ขั้นตอน:**
1. focusC01กดSpaceเลือกและกดSpaceอีกครั้งยกเลิก เป็นvalidkeyboardcontrol; เลือกใหม่
2. กดยืนยันพร้อมหน่วงholdresponse รอserverตอบแล้วแต่ยังไม่ส่งเข้าหน้า
3. กดEscapeปิดdialogก่อนปล่อยresponse
4. ปล่อยresponse รอrequestsettle ตรวจdialogยังปิด activeholdและmapอีกcontext

**ผลที่คาดหวัง:** Spaceเปลี่ยนaria-pressedถูกทั้งสองทิศ; lateholdไม่เปิดdialogกลับ; เจ้าของreleaseholdที่เกิดล่าช้าจนactiveholdnull C01availableก่อนexpiry; ไม่สร้างorder/payment

**จังหวะตรวจ:** ตรวจหลังSpaceแต่ละครั้ง, หลังEscapeก่อนresponse และหลังlate-response/releasecompleteจนsettled

**คืนสภาพ:** ยกเลิกroute/interceptionในfinally ปล่อยresponseที่ค้าง; เก็บหลักฐาน; releaseเฉพาะholdตนและทิ้งฐานเฉพาะกรณี

**ถ้ากฎผิด ควรต่างอย่างไร:** หน้าต่างปิดแต่C01ยังheld600s หรือresponseเปิดcheckoutกลับมา

## V3-U17 — ขอบหน้า ค้นหา ผลว่างและfilterสอดคล้อง

**ส่วนระบบ:** catalog search/filter

**กฎที่อ้างอิง:** ["FR02","FR07","NFR01"]

**ระดับ:** P2

**เทคนิค:** ["equivalence partition","state transition","boundary value"]

**ที่มาของ oracle:** {"D":["REQUIREMENTS.md","TEST-DATA.md","USER-STORIES.md"],"A-policy":[],"R":"บริบทอ้างอิง REF05 เฉพาะ contact/summary ตาม REQUIREMENTS; ไม่ใช้เว็บอ้างอิงตั้งตัวเลข/สถานะ","exploration":"EXPLORATION.md และ exploration/lab8/c1.md–c7.md เป็น O/เบาะแส ไม่ใช้แทน oracle","mapping":"plan/assignments.json; e2e/api.test.mjs, ui.spec.js, lab.spec.js ใช้จับคู่ ID/actions เท่านั้น"}

**เงื่อนไขก่อนเริ่ม:** ฐานใหม่03:00Z anonymouscatalogตามfixture12งาน6ต่อหน้า; ไม่loginMemberระหว่างกรณีเพื่อไม่เปลี่ยนstatusของAurora

**ข้อมูลทดสอบ:** {"noMatch":"ไม่มีคอนเสิร์ตนี้","match":"แสงเหนือ","filter":"upcoming","resetFilter":"all"}

**ขั้นตอน:**
1. หน้าแรกตรวจย้อนกลับdisabled ไปหน้าสองตรวจnextdisabled/current2
2. ค้นnoMatchตรวจemptyและpagination
3. ค้นแสงเหนือตรวจAurora/current1 แล้วเลือกupcoming
4. ล้างคำค้นคงupcoming ตรวจงานทุกใบตรงstatus จากนั้นเลือกall

**ผลที่คาดหวัง:** หน้าแรก/ท้ายไม่ข้ามขอบ; noMatchแสดงไม่พบไม่มีปุ่มหน้า; matchกลับหน้า1; Auroraไม่เข้าupcomingที่มุมมองanonymousGeneralavailableตามfixtureจึงว่าง; ล้างsearchยังfilterupcomingถูก; allกลับ6จาก12ไม่มีpage indexเก่าค้าง

**จังหวะตรวจ:** หลังผลแต่ละsearch/filterrenderเสร็จและหลังclear/all อ่านจำนวน range/currentและstatusร่วมกัน

**คืนสภาพ:** เก็บ request/response และภาพตาม ID โดยปิดบัง session; release hold ที่ยัง held ด้วยเจ้าของ; ถ้า paid/pending หรือเปลี่ยนเวลา/state ให้ทิ้งฐานเฉพาะกรณีแล้วสร้าง fixture ใหม่ ห้าม reset พอร์ตผู้อื่น

**ถ้ากฎผิด ควรต่างอย่างไร:** จำนวน0แต่rangeยัง7–12 หรือclearsearchล้างfilterโดยไม่ตั้งใจ

## V3-U18 — couponผิดคงselection แก้ถูกและปิดปล่อย hold

**ส่วนระบบ:** coupon recovery/close

**กฎที่อ้างอิง:** ["FR07","FR10","FR17","BR09","BR12","NFR01"]

**ระดับ:** P1

**เทคนิค:** ["error recovery","state transition","positive control"]

**ที่มาของ oracle:** {"D":["REQUIREMENTS.md","TEST-DATA.md","USER-STORIES.md"],"A-policy":[],"R":"บริบทอ้างอิง REF05 เฉพาะ contact/summary ตาม REQUIREMENTS; ไม่ใช้เว็บอ้างอิงตั้งตัวเลข/สถานะ","exploration":"EXPLORATION.md และ exploration/lab8/c1.md–c7.md เป็น O/เบาะแส ไม่ใช้แทน oracle","mapping":"plan/assignments.json; e2e/api.test.mjs, ui.spec.js, lab.spec.js ใช้จับคู่ ID/actions เท่านั้น"}

**เงื่อนไขก่อนเริ่ม:** ฐานทดสอบแยกเริ่มใหม่ เวลา 2026-11-06T03:00:00Z; fan/FanDemo!26 อยู่คิว active NEON Member และตรวจ ENCORE-0001 ผ่าน; ไม่มี hold/order เดิม; ไม่ใช้พอร์ตผู้ใช้ 4310

**ข้อมูลทดสอบ:** {"seat":"C01","badCoupon":"INVALID","validCoupon":"STAGE10"}

**ขั้นตอน:**
1. เลือกC01ใส่INVALIDกดยืนยัน
2. ตรวจerrorและC01ยังselected/activeholdไม่มีรายการใหม่
3. แก้STAGE10 ตรวจ1652แล้วยืนยันรอcheckout
4. ปิดbookingรอreleaseและเปิดNEONใหม่ตรวจC01ว่าง

**ผลที่คาดหวัง:** invalidแจ้งไม่พบโค้ด ไม่ล้างselectionและไม่สร้างholdผิด; controlvalidยอด1652หลังhold; closeทำactiveholdnullและC01available เปิดใหม่เลือกได้ ไม่ค้างseatจากcouponerror

**จังหวะตรวจ:** ทันทีหลังinvalidresponse, หลังvalidhold/checkout และหลังclosereleaseก่อนเปิดใหม่

**คืนสภาพ:** เก็บ request/response และภาพตาม ID โดยปิดบัง session; release hold ที่ยัง held ด้วยเจ้าของ; ถ้า paid/pending หรือเปลี่ยนเวลา/state ให้ทิ้งฐานเฉพาะกรณีแล้วสร้าง fixture ใหม่ ห้าม reset พอร์ตผู้อื่น

**ถ้ากฎผิด ควรต่างอย่างไร:** clearselectionเมื่อcouponผิด หรือpreview1652แต่hold1832

## V3-U20 — แก้ชื่อ กู้หลัง reload และกลับผังคืน hold

**ส่วนระบบ:** checkout editing/recovery

**กฎที่อ้างอิง:** ["FR09","FR10","FR15","BR19","BR09"]

**ระดับ:** P1

**เทคนิค:** ["state transition","recovery","snapshot"]

**ที่มาของ oracle:** {"D":["REQUIREMENTS.md","TEST-DATA.md","USER-STORIES.md"],"A-policy":[],"R":"บริบทอ้างอิง REF05 เฉพาะ contact/summary ตาม REQUIREMENTS; ไม่ใช้เว็บอ้างอิงตั้งตัวเลข/สถานะ","exploration":"EXPLORATION.md และ exploration/lab8/c1.md–c7.md เป็น O/เบาะแส ไม่ใช้แทน oracle","mapping":"plan/assignments.json; e2e/api.test.mjs, ui.spec.js, lab.spec.js ใช้จับคู่ ID/actions เท่านั้น"}

**เงื่อนไขก่อนเริ่ม:** ฐานทดสอบแยกเริ่มใหม่ เวลา 2026-11-06T03:00:00Z; fan/FanDemo!26 อยู่คิว active NEON Member และตรวจ ENCORE-0001 ผ่าน; ไม่มี hold/order เดิม; ไม่ใช้พอร์ตผู้ใช้ 4310

**ข้อมูลทดสอบ:** {"seat":"C01","old":"Holder 1","new":"แก้ไข ชื่อผู้ถือ"}

**ขั้นตอน:**
1. holdC01บันทึกBuyerTest/Holder1ถูกต้องยังไม่pending
2. กดแก้ข้อมูลเปลี่ยนholderเป็นชื่อใหม่แล้วบันทึก
3. reloadกดจองต่อ/ชำระเงิน อ่านsummaryและactiveholdcheckout
4. กดกลับเลือกที่นั่ง ตรวจselection/map/resumehold

**ผลที่คาดหวัง:** ชื่อใหม่persistทั้งsummaryและserverก่อน/หลังreload; ยังใช้holdเดิมและexpiryเดิม; กลับผังปล่อยholdเก่า C01enabled selected0 resumeholdหาย activeholdnull; ไม่คืนชื่อเก่าหรือยืดdeadline

**จังหวะตรวจ:** หลังeditsubmit, หลังreload/resumeและหลังback/releaseresponseครบ

**คืนสภาพ:** เก็บ request/response และภาพตาม ID โดยปิดบัง session; release hold ที่ยัง held ด้วยเจ้าของ; ถ้า paid/pending หรือเปลี่ยนเวลา/state ให้ทิ้งฐานเฉพาะกรณีแล้วสร้าง fixture ใหม่ ห้าม reset พอร์ตผู้อื่น

**ถ้ากฎผิด ควรต่างอย่างไร:** เห็นชื่อในDOMก่อนreloadอย่างเดียว หรือbackยังreserveC01อยู่

## V3-U22 — ผู้จัดมือถือ block/reopen/พักขายเฉพาะงานตน

**ส่วนระบบ:** mobile organizer

**กฎที่อ้างอิง:** ["FR07","FR17","BR20","NFR01","NFR02"]

**ระดับ:** P1

**เทคนิค:** ["authorization matrix","responsive","state transition"]

**ที่มาของ oracle:** {"D":["REQUIREMENTS.md","TEST-DATA.md","USER-STORIES.md"],"A-policy":["AP03","AP04"],"R":"บริบทอ้างอิง REF05 เฉพาะ contact/summary ตาม REQUIREMENTS; ไม่ใช้เว็บอ้างอิงตั้งตัวเลข/สถานะ","exploration":"EXPLORATION.md และ exploration/lab8/c1.md–c7.md เป็น O/เบาะแส ไม่ใช้แทน oracle","mapping":"plan/assignments.json; e2e/api.test.mjs, ui.spec.js, lab.spec.js ใช้จับคู่ ID/actions เท่านั้น"}

**เงื่อนไขก่อนเริ่ม:** ฐานใหม่เวลาเริ่ม encore/EncoreDemo!26 ownerNEON; sky/SkyDemo!26 ไม่ใช่ownerNEON; fanเป็นbuyeractiveได้ ไม่มีholdC01; requestcontextfanactiveและverifyNEONก่อนorganizerpause

**ข้อมูลทดสอบ:** {"viewport":[375,812],"owner":"encore","foreign":"sky","event":"neon","seat":"C01","notOwnedLabel":"BLUE NOTE NIGHTS"}

**ขั้นตอน:**
1. loginencoreที่375pxเปิดจัดการ ตรวจรายการงานไม่รวมของsky
2. กรอกC01block ดูauditและbuyer mapแยกcontext
3. กดreopenโดยตรวจช่องยังระบุC01หลังdashboardrefresh ดูauditและmap
4. พักขายตรวจstate/ข้อความ/ความกว้าง; loginfanตรวจปุ่มMemberdisabledและdirectjoin/holdใหม่ปฏิเสธ; skyลองแก้NEONเป็นnegativecontrol
5. หลังpauseใช้requestcontextfanเดิมส่งholdC01 ต้องSALE_UNAVAILABLE ไม่ใช่QUEUE_REQUIRED; browserfanเห็นปุ่มMemberdisabled

**ผลที่คาดหวัง:** ผู้จัดเห็น/แก้เฉพาะงานตน; blockทำC01blocked reopenทำavailableพร้อมauditตรงaction; refreshไม่ทำseatfieldหายจนreopenผิดใบ; pausedห้ามรายการใหม่; sky403ไม่มีstateเปลี่ยน; admin375pxไม่ล้น; APIguardตรวจด้วยfanที่active+grantอยู่ก่อนpauseแล้ว

**จังหวะตรวจ:** หลังblockresponse/refreshและหลังreopen, หลังpauseและหลังเปลี่ยนbuyer/foreigncontext

**คืนสภาพ:** เก็บ request/response และภาพตาม ID โดยปิดบัง session; release hold ที่ยัง held ด้วยเจ้าของ; ถ้า paid/pending หรือเปลี่ยนเวลา/state ให้ทิ้งฐานเฉพาะกรณีแล้วสร้าง fixture ใหม่ ห้าม reset พอร์ตผู้อื่น

**ถ้ากฎผิด ควรต่างอย่างไร:** auditขึ้นว่าปลดแต่seatยังblocked หรือซ่อนforeignในdropdownแต่APIยังอนุญาต

## V3-U25 — catalogโหลดพลาดและ reload กลับใช้ได้

**ส่วนระบบ:** network failure recovery

**กฎที่อ้างอิง:** ["FR02","NFR01"]

**ระดับ:** P2

**เทคนิค:** ["fault injection","error recovery","positive control"]

**ที่มาของ oracle:** {"D":["REQUIREMENTS.md","TEST-DATA.md","USER-STORIES.md"],"A-policy":[],"R":"บริบทอ้างอิง REF05 เฉพาะ contact/summary ตาม REQUIREMENTS; ไม่ใช้เว็บอ้างอิงตั้งตัวเลข/สถานะ","exploration":"EXPLORATION.md และ exploration/lab8/c1.md–c7.md เป็น O/เบาะแส ไม่ใช้แทน oracle","mapping":"plan/assignments.json; e2e/api.test.mjs, ui.spec.js, lab.spec.js ใช้จับคู่ ID/actions เท่านั้น"}

**เงื่อนไขก่อนเริ่ม:** ฐานใหม่ browsercontextเฉพาะกรณี anonymous/catalog; ไม่ตัดnetworkทั้งเครื่องหรือเปลี่ยนserver; ไม่มีการสร้างorder

**ข้อมูลทดสอบ:** {"route":"GET /api/events","failure":"abortเฉพาะbrowsercontextนี้","expectedCount":6}

**ขั้นตอน:**
1. validcontrolโหลดcatalogปกติตรวจ6จาก12
2. abortGET/api/eventsเฉพาะcontextแล้วreload
3. ตรวจข้อความerrorมีคำแนะนำรีเฟรชและไม่แสดงstalecardsเป็นข้อมูลใหม่
4. ถอดinterceptionreloadอีกครั้งตรวจcatalog6รายการและpagination12

**ผลที่คาดหวัง:** errorเข้าใจได้และบอกรีเฟรช; ถ้าตามcopyปัจจุบันใช้ โหลดข้อมูลไม่สำเร็จ กรุณารีเฟรชหน้าเว็บ โดยไม่ยกcopyเป็นกฎธุรกิจ; คืนnetworkแล้วreloadกลับ6จาก12 ไม่มีerrorค้าง ไม่ต้องresetDBหรือloginใหม่

**จังหวะตรวจ:** หลังfailedrequestsettle และหลังถอดroute/reloadสำเร็จ เปรียบเทียบcontrolก่อนล้มเหลว

**คืนสภาพ:** unroute /api/events ในfinally; ปิดcontextเฉพาะกรณี เก็บภาพก่อน/ระหว่าง/หลัง recovery; ไม่มีDB mutation

**ถ้ากฎผิด ควรต่างอย่างไร:** errorเงียบหรือถอดrouteแล้วหน้ายังค้างว่าง

## เช็กลิสต์
- ข้อมูลและexpectedจากD/A-policy/A-testที่ระบุ ไม่ลอกO
- ทุกnegativeมีpositivecontrolที่เกี่ยวข้อง
- ตรวจตามจังหวะ ไม่ให้gateอื่นบังผล
- resetเฉพาะworker/DBตน
- ไม่แก้expectedหลังรอบฝังบั๊ก

### 5.3 — การ์ดทดสอบละเอียดหลังรีวิว

ผู้เขียนเดิม: /root/writer_53; ผู้แก้รวม: /root หลัง independent review; ฉบับก่อนแก้อยู่ before-review/

## V3-A22 — QR: pending → บัตรมีชื่อ → อีเมลทดลอง

**ส่วนระบบ:** Payment/API

**กฎที่อ้างอิง:** ["FR11","FR12","FR13","FR14","BR12","BR13","BR14","BR18"]

**ระดับ:** P1

**เทคนิค:** ["State transition","Equivalence partition"]

**ที่มาของ oracle:** {"oracle":["REQUIREMENTS.md","TEST-DATA.md","USER-STORIES.md"],"policy":"ข้อกำหนด ENCORE; คงป้าย U/A ตามเอกสาร ไม่อ้างนโยบายผู้ให้บริการจริง","contextOnly":["EXPLORATION.md","exploration/lab8/c1.md–c7.md"],"actionMappingOnly":"e2e/api.test.mjs, e2e/ui.spec.js, e2e/lab.spec.js; ไม่ใช้ assertion เป็น oracle"}

**เงื่อนไขก่อนเริ่ม:** โลกทดสอบใหม่ เวลา2026-11-06T03:00:00Z; fan/FanDemo!26 เข้า NEON Member queue active และ verify ENCORE-0001; hold C01 และบันทึก checkout ครบก่อนจ่าย

**ข้อมูลทดสอบ:** Buyer Test / buyer@example.test / 0812345678; C01=Holder 1 / holder1@example.test / 0898765432; Regular1800 ไม่มีโค้ด; method=qr

**ขั้นตอน:**
1. POST /api/pay ด้วย hold ID, result=pending, method=qr; จด payment ID
2. GET /api/payment?id=ID; ถอดQRชำระและตรวจ prefix ENCORE-DEMO-PAY ไม่มีบัญชีรับเงินจริง
3. ตรวจ orders/mailbox ขณะ pending
4. เจ้าของเรียก POST /api/payments/resolve result=approved แล้วอ่าน orders/mailbox และเปิด mail

**ผลที่คาดหวัง:** ยอด=1800+30+round(30×.07)=1832; deadline=min(เริ่มhold+600s,จบรอบ)=03:10Z; pending=0บัตร/0เมล; หลังสำเร็จ1order/1ticketชื่อ Holder 1 ที่ C01/1เมลถึง buyer@example.test สถานะ delivered_sandbox พร้อม QR

**จังหวะตรวจ:** ตรวจ pending ก่อน resolve และหลัง resolve จนคำตอบ terminal; ต้องอยู่ก่อน expiry

**คืนสภาพ:** เก็บ request/response ที่ตัด cookie/token และภาพขั้นสำคัญ; ปิด context; reset/คืน clock เฉพาะฐานทดสอบที่ตนเป็นเจ้าของหลังจบ ห้ามแตะ4310

**ถ้ากฎผิด ควรต่างอย่างไร:** ห้ามนับ pending เป็น success หรือถือว่าการมีเลขอ้างอิงคือออกบัตรแล้ว

## V3-A23 — 7-Eleven: pending → บัตรมีชื่อ → อีเมลทดลอง

**ส่วนระบบ:** Payment/API

**กฎที่อ้างอิง:** ["FR11","FR12","FR13","FR14","BR12","BR13","BR14","BR18"]

**ระดับ:** P1

**เทคนิค:** ["State transition","Equivalence partition"]

**ที่มาของ oracle:** {"oracle":["REQUIREMENTS.md","TEST-DATA.md","USER-STORIES.md"],"policy":"ข้อกำหนด ENCORE; คงป้าย U/A ตามเอกสาร ไม่อ้างนโยบายผู้ให้บริการจริง","contextOnly":["EXPLORATION.md","exploration/lab8/c1.md–c7.md"],"actionMappingOnly":"e2e/api.test.mjs, e2e/ui.spec.js, e2e/lab.spec.js; ไม่ใช้ assertion เป็น oracle"}

**เงื่อนไขก่อนเริ่ม:** โลกทดสอบใหม่ เวลา2026-11-06T03:00:00Z; fan/FanDemo!26 เข้า NEON Member queue active และ verify ENCORE-0001; hold C01 และบันทึก checkout ครบก่อนจ่าย

**ข้อมูลทดสอบ:** Buyer Test / buyer@example.test / 0812345678; C01=Holder 1 / holder1@example.test / 0898765432; Regular1800 ไม่มีโค้ด; method=seven_eleven

**ขั้นตอน:**
1. POST /api/pay ด้วย hold ID, result=pending, method=seven_eleven; จด payment ID
2. GET /api/payment?id=ID; อ่านเลขอ้างอิงทดลองและคำเตือน deadline10นาที ไม่ใช่2ชั่วโมง
3. ตรวจ orders/mailbox ขณะ pending
4. เจ้าของเรียก POST /api/payments/resolve result=approved แล้วอ่าน orders/mailbox และเปิด mail

**ผลที่คาดหวัง:** ยอด=1800+30+round(30×.07)=1832; deadline=min(เริ่มhold+600s,จบรอบ)=03:10Z; pending=0บัตร/0เมล; หลังสำเร็จ1order/1ticketชื่อ Holder 1 ที่ C01/1เมลถึง buyer@example.test สถานะ delivered_sandbox พร้อม QR

**จังหวะตรวจ:** ตรวจ pending ก่อน resolve และหลัง resolve จนคำตอบ terminal; ต้องอยู่ก่อน expiry

**คืนสภาพ:** เก็บ request/response ที่ตัด cookie/token และภาพขั้นสำคัญ; ปิด context; reset/คืน clock เฉพาะฐานทดสอบที่ตนเป็นเจ้าของหลังจบ ห้ามแตะ4310

**ถ้ากฎผิด ควรต่างอย่างไร:** ห้ามนับ pending เป็น success หรือถือว่าการมีเลขอ้างอิงคือออกบัตรแล้ว

## V3-A24 — Credit Card: pending → บัตรมีชื่อ → อีเมลทดลอง

**ส่วนระบบ:** Payment/API

**กฎที่อ้างอิง:** ["FR11","FR12","FR13","FR14","BR12","BR13","BR14","BR18"]

**ระดับ:** P1

**เทคนิค:** ["State transition","Equivalence partition"]

**ที่มาของ oracle:** {"oracle":["REQUIREMENTS.md","TEST-DATA.md","USER-STORIES.md"],"policy":"ข้อกำหนด ENCORE; คงป้าย U/A ตามเอกสาร ไม่อ้างนโยบายผู้ให้บริการจริง","contextOnly":["EXPLORATION.md","exploration/lab8/c1.md–c7.md"],"actionMappingOnly":"e2e/api.test.mjs, e2e/ui.spec.js, e2e/lab.spec.js; ไม่ใช้ assertion เป็น oracle"}

**เงื่อนไขก่อนเริ่ม:** โลกทดสอบใหม่ เวลา2026-11-06T03:00:00Z; fan/FanDemo!26 เข้า NEON Member queue active และ verify ENCORE-0001; hold C01 และบันทึก checkout ครบก่อนจ่าย

**ข้อมูลทดสอบ:** Buyer Test / buyer@example.test / 0812345678; C01=Holder 1 / holder1@example.test / 0898765432; Regular1800 ไม่มีโค้ด; method=credit_card

**ขั้นตอน:**
1. POST /api/pay ด้วย hold ID, result=pending, method=credit_card; จด payment ID
2. GET /api/payment?id=ID; ตรวจว่าใช้ simulator โดยไม่ต้องกรอก PAN/CVV จริง
3. ตรวจ orders/mailbox ขณะ pending
4. เจ้าของเรียก POST /api/payments/resolve result=approved แล้วอ่าน orders/mailbox และเปิด mail

**ผลที่คาดหวัง:** ยอด=1800+30+round(30×.07)=1832; deadline=min(เริ่มhold+600s,จบรอบ)=03:10Z; pending=0บัตร/0เมล; หลังสำเร็จ1order/1ticketชื่อ Holder 1 ที่ C01/1เมลถึง buyer@example.test สถานะ delivered_sandbox พร้อม QR

**จังหวะตรวจ:** ตรวจ pending ก่อน resolve และหลัง resolve จนคำตอบ terminal; ต้องอยู่ก่อน expiry

**คืนสภาพ:** เก็บ request/response ที่ตัด cookie/token และภาพขั้นสำคัญ; ปิด context; reset/คืน clock เฉพาะฐานทดสอบที่ตนเป็นเจ้าของหลังจบ ห้ามแตะ4310

**ถ้ากฎผิด ควรต่างอย่างไร:** ห้ามนับ pending เป็น success หรือถือว่าการมีเลขอ้างอิงคือออกบัตรแล้ว

## V3-A25 — Alipay: pending → บัตรมีชื่อ → อีเมลทดลอง

**ส่วนระบบ:** Payment/API

**กฎที่อ้างอิง:** ["FR11","FR12","FR13","FR14","BR12","BR13","BR14","BR18"]

**ระดับ:** P1

**เทคนิค:** ["State transition","Equivalence partition"]

**ที่มาของ oracle:** {"oracle":["REQUIREMENTS.md","TEST-DATA.md","USER-STORIES.md"],"policy":"ข้อกำหนด ENCORE; คงป้าย U/A ตามเอกสาร ไม่อ้างนโยบายผู้ให้บริการจริง","contextOnly":["EXPLORATION.md","exploration/lab8/c1.md–c7.md"],"actionMappingOnly":"e2e/api.test.mjs, e2e/ui.spec.js, e2e/lab.spec.js; ไม่ใช้ assertion เป็น oracle"}

**เงื่อนไขก่อนเริ่ม:** โลกทดสอบใหม่ เวลา2026-11-06T03:00:00Z; fan/FanDemo!26 เข้า NEON Member queue active และ verify ENCORE-0001; hold C01 และบันทึก checkout ครบก่อนจ่าย

**ข้อมูลทดสอบ:** Buyer Test / buyer@example.test / 0812345678; C01=Holder 1 / holder1@example.test / 0898765432; Regular1800 ไม่มีโค้ด; method=alipay

**ขั้นตอน:**
1. POST /api/pay ด้วย hold ID, result=pending, method=alipay; จด payment ID
2. GET /api/payment?id=ID; ตรวจคำแนะนำ Alipay/เลขอ้างอิงจำลอง
3. ตรวจ orders/mailbox ขณะ pending
4. เจ้าของเรียก POST /api/payments/resolve result=approved แล้วอ่าน orders/mailbox และเปิด mail

**ผลที่คาดหวัง:** ยอด=1800+30+round(30×.07)=1832; deadline=min(เริ่มhold+600s,จบรอบ)=03:10Z; pending=0บัตร/0เมล; หลังสำเร็จ1order/1ticketชื่อ Holder 1 ที่ C01/1เมลถึง buyer@example.test สถานะ delivered_sandbox พร้อม QR

**จังหวะตรวจ:** ตรวจ pending ก่อน resolve และหลัง resolve จนคำตอบ terminal; ต้องอยู่ก่อน expiry

**คืนสภาพ:** เก็บ request/response ที่ตัด cookie/token และภาพขั้นสำคัญ; ปิด context; reset/คืน clock เฉพาะฐานทดสอบที่ตนเป็นเจ้าของหลังจบ ห้ามแตะ4310

**ถ้ากฎผิด ควรต่างอย่างไร:** ห้ามนับ pending เป็น success หรือถือว่าการมีเลขอ้างอิงคือออกบัตรแล้ว

## V3-A26 — method นอก enum และยอด client ไม่เปลี่ยนยอดจริง

**ส่วนระบบ:** Payment validation

**กฎที่อ้างอิง:** ["FR11","BR12","BR13"]

**ระดับ:** P1

**เทคนิค:** ["Invalid partition","Tampering"]

**ที่มาของ oracle:** {"oracle":["REQUIREMENTS.md","TEST-DATA.md","USER-STORIES.md"],"policy":"ข้อกำหนด ENCORE; คงป้าย U/A ตามเอกสาร ไม่อ้างนโยบายผู้ให้บริการจริง","contextOnly":["EXPLORATION.md","exploration/lab8/c1.md–c7.md"],"actionMappingOnly":"e2e/api.test.mjs, e2e/ui.spec.js, e2e/lab.spec.js; ไม่ใช้ assertion เป็น oracle"}

**เงื่อนไขก่อนเริ่ม:** โลกทดสอบใหม่ เวลา2026-11-06T03:00:00Z; fan/FanDemo!26 เข้า NEON Member queue active และ verify ENCORE-0001; hold C01 และบันทึก checkout ครบก่อนจ่าย

**ข้อมูลทดสอบ:** Buyer Test / buyer@example.test / 0812345678; C01=Holder 1 / holder1@example.test / 0898765432; Regular1800 ไม่มีโค้ด; method=cash; total=1

**ขั้นตอน:**
1. ส่งpay method=cash
2. ตรวจยังไม่มีorder/mail
3. ส่งpay method=qr,result=pending,total=1
4. อ่านpaymentยอดและsummary

**ผลที่คาดหวัง:** cash ถูกปฏิเสธ controlled4xx ไม่มีattemptสำเร็จ; qrยอดยืนยัน1832 ไม่ใช่1; pendingยัง0บัตร/0เมล

**จังหวะตรวจ:** หลังแต่ละคำขอก่อนapprove

**คืนสภาพ:** เก็บ request/response ที่ตัด cookie/token และภาพขั้นสำคัญ; ปิด context; reset/คืน clock เฉพาะฐานทดสอบที่ตนเป็นเจ้าของหลังจบ ห้ามแตะ4310

**ถ้ากฎผิด ควรต่างอย่างไร:** ห้ามเอายอดclientหรือข้อความหน้าจอมาใช้แทนยอดserver

## V3-A27 — failed เป็นปลายทาง retry/replay ไม่ออกซ้ำ

**ส่วนระบบ:** Payment lifecycle

**กฎที่อ้างอิง:** ["FR12","FR15","BR15","NFR03"]

**ระดับ:** P1

**เทคนิค:** ["State transition","Concurrency","Idempotency"]

**ที่มาของ oracle:** {"oracle":["REQUIREMENTS.md","TEST-DATA.md","USER-STORIES.md"],"policy":"ข้อกำหนด ENCORE; คงป้าย U/A ตามเอกสาร ไม่อ้างนโยบายผู้ให้บริการจริง","contextOnly":["EXPLORATION.md","exploration/lab8/c1.md–c7.md"],"actionMappingOnly":"e2e/api.test.mjs, e2e/ui.spec.js, e2e/lab.spec.js; ไม่ใช้ assertion เป็น oracle"}

**เงื่อนไขก่อนเริ่ม:** โลกทดสอบใหม่ เวลา2026-11-06T03:00:00Z; fan/FanDemo!26 เข้า NEON Member queue active และ verify ENCORE-0001; hold C01 และบันทึก checkout ครบก่อนจ่าย

**ข้อมูลทดสอบ:** Buyer Test / buyer@example.test / 0812345678; C01=Holder 1 / holder1@example.test / 0898765432; Regular1800 ไม่มีโค้ด

**ขั้นตอน:**
1. จ่ายresult=declined และจดpaymentIDเก่า
2. ลองapprove IDเก่า
3. retryด้วยholdเดิมจดIDใหม่; ส่งapproveใหม่สองคำขอพร้อมกัน
4. อ่านorders/mailbox/ticketsและยอด

**ผลที่คาดหวัง:** declined=failedไม่มีorder/mail; IDเก่ายังคงfailed; retryต้องIDใหม่; successซ้ำได้orderเดียว รวม1ticket/1mailยอด1832 ไม่ใช่3664

**จังหวะตรวจ:** เก็บIDก่อนretry ตรวจหลังทั้งคำขอจบแล้วอ่านซ้ำ

**คืนสภาพ:** เก็บ request/response ที่ตัด cookie/token และภาพขั้นสำคัญ; ปิด context; reset/คืน clock เฉพาะฐานทดสอบที่ตนเป็นเจ้าของหลังจบ ห้ามแตะ4310

**ถ้ากฎผิด ควรต่างอย่างไร:** ห้ามแค่ตรวจว่ามีorderอย่างน้อย1; ต้องนับและเทียบID

## V3-A28 — pending ล็อกรายการ แต่จ่ายทันยังรับผลใน grace

**ส่วนระบบ:** Payment timing

**กฎที่อ้างอิง:** ["FR12","BR09","BR16"]

**ระดับ:** P1

**เทคนิค:** ["Boundary value","State transition"]

**ที่มาของ oracle:** {"oracle":["REQUIREMENTS.md","TEST-DATA.md","USER-STORIES.md"],"policy":"ข้อกำหนด ENCORE; คงป้าย U/A ตามเอกสาร ไม่อ้างนโยบายผู้ให้บริการจริง","contextOnly":["EXPLORATION.md","exploration/lab8/c1.md–c7.md"],"actionMappingOnly":"e2e/api.test.mjs, e2e/ui.spec.js, e2e/lab.spec.js; ไม่ใช้ assertion เป็น oracle"}

**เงื่อนไขก่อนเริ่ม:** โลกทดสอบใหม่ เวลา2026-11-06T03:00:00Z; fan/FanDemo!26 เข้า NEON Member queue active และ verify ENCORE-0001; hold C01 และบันทึก checkout ครบก่อนจ่าย

**ข้อมูลทดสอบ:** Buyer Test / buyer@example.test / 0812345678; C01=Holder 1 / holder1@example.test / 0898765432; Regular1800 ไม่มีโค้ด

**ขั้นตอน:**
1. สร้างpendingเวลา03:00Z
2. ขอreleaseและhold C02 ระหว่างpending
3. ตั้งarrival=03:11:59.999Z แล้วcallback paidAt=03:09:59.999Z amount1832
4. อ่านorder/mail/seat

**ผลที่คาดหวัง:** release/reselectถูกปฏิเสธ holdเดิมไม่เปลี่ยน; paidAt=expiry−1ms และarrival=expiry+120s−1ms จึงsuccess1order/1ticket/1mail1832

**จังหวะตรวจ:** ตรวจทันทีหลังคำขอที่ถูกปฏิเสธ และที่arrival719.999s

**คืนสภาพ:** เก็บ request/response ที่ตัด cookie/token และภาพขั้นสำคัญ; ปิด context; reset/คืน clock เฉพาะฐานทดสอบที่ตนเป็นเจ้าของหลังจบ ห้ามแตะ4310

**ถ้ากฎผิด ควรต่างอย่างไร:** ห้ามใช้เวลาcallbackแทนpaidAt หรือปฏิเสธทุกcallbackหลัง600s

## V3-A29 — paidAt ตรง expiry ต้องคืนทดลอง

**ส่วนระบบ:** Late payment

**กฎที่อ้างอิง:** ["FR12","BR16"]

**ระดับ:** P1

**เทคนิค:** ["Boundary value"]

**ที่มาของ oracle:** {"oracle":["REQUIREMENTS.md","TEST-DATA.md","USER-STORIES.md"],"policy":"ข้อกำหนด ENCORE; คงป้าย U/A ตามเอกสาร ไม่อ้างนโยบายผู้ให้บริการจริง","contextOnly":["EXPLORATION.md","exploration/lab8/c1.md–c7.md"],"actionMappingOnly":"e2e/api.test.mjs, e2e/ui.spec.js, e2e/lab.spec.js; ไม่ใช้ assertion เป็น oracle"}

**เงื่อนไขก่อนเริ่ม:** โลกทดสอบใหม่ เวลา2026-11-06T03:00:00Z; fan/FanDemo!26 เข้า NEON Member queue active และ verify ENCORE-0001; hold C01 และบันทึก checkout ครบก่อนจ่าย

**ข้อมูลทดสอบ:** Buyer Test / buyer@example.test / 0812345678; C01=Holder 1 / holder1@example.test / 0898765432; Regular1800 ไม่มีโค้ด

**ขั้นตอน:**
1. สร้างpendingเวลา03:00Z
2. ตั้งclock03:10:00Zและส่งcallback paidAt03:10:00Z amount1832
3. ส่งcallbackเดิมซ้ำและอ่านpayment/orders/mailbox

**ผลที่คาดหวัง:** paidAt=expiryไม่ผ่านเงื่อนไข< จึงauto-refund1832ครั้งเดียว; 0order/0ticket/0mail; ไม่มีที่นั่งsoldจากรายการนี้

**จังหวะตรวจ:** ตรง600.000s และหลังreplay

**คืนสภาพ:** เก็บ request/response ที่ตัด cookie/token และภาพขั้นสำคัญ; ปิด context; reset/คืน clock เฉพาะฐานทดสอบที่ตนเป็นเจ้าของหลังจบ ห้ามแตะ4310

**ถ้ากฎผิด ควรต่างอย่างไร:** ห้ามใช้<=ที่paidAt หรือออกบัตรแล้วค่อยคืน

## V3-A30 — ขอบ grace ไม่แย่ง seat ที่ขายใหม่

**ส่วนระบบ:** Late callback/resale

**กฎที่อ้างอิง:** ["FR12","BR16","NFR03"]

**ระดับ:** P1

**เทคนิค:** ["Boundary value","State transition"]

**ที่มาของ oracle:** D: BR16/TEST-DATA; A-test: componentfixtureจำลองretainedholdเพื่อไม่ให้HTTPsweepบังguard ไม่อ้างว่าเป็นblack-boxbrowserทั้งหมด

**เงื่อนไขก่อนเริ่ม:** โลกทดสอบใหม่ เวลา2026-11-06T03:00:00Z; fan/FanDemo!26 เข้า NEON Member queue active และ verify ENCORE-0001; hold C01 และบันทึก checkout ครบก่อนจ่าย

**ข้อมูลทดสอบ:** Buyer Test / buyer@example.test / 0812345678; C01=Holder 1 / holder1@example.test / 0898765432; Regular1800 ไม่มีโค้ด; fan2/FanTwo!26 ENCORE-0002

**ขั้นตอน:**
1. componentfixture:สร้างpendingที่C01และไม่sweep ปรับclockเป็นexpiry+120s ขณะseatยังเป็นของholdเดิม;settle paidAtexpiry−1ms
2. ต้องauto_refunded1832 ไม่มีorder/ticket/mail แม้ไม่มีresaleมาช่วย;เทียบA28กรณีarrival719.999sซึ่งสำเร็จ
3. คงpublicAPIbranchเดิม:ตรง720sหลังsweepให้fan2ถือ/จ่ายที่เดิม แล้วcallbackfanห้ามยึดกลับ

**ผลที่คาดหวัง:** แยกgraceequalitycomponentจากresaleguard;normalpublicAPIยังปล่อยที่ตามdeadlineและcallbackไม่oversell

**จังหวะตรวจ:** ตรวจหลังholdใหม่และหลังcallbackเก่าทันที

**คืนสภาพ:** เก็บ request/response ที่ตัด cookie/token และภาพขั้นสำคัญ; ปิด context; reset/คืน clock เฉพาะฐานทดสอบที่ตนเป็นเจ้าของหลังจบ ห้ามแตะ4310

**ถ้ากฎผิด ควรต่างอย่างไร:** ถ้าarrivalgraceใช้<=ในcomponentที่ยังถือที่ จะออกบัตรที่720sผิด; publicresalealoneไม่พอพิสูจน์comparisonนี้

## V3-A31 — callback ยอดผิดหรือเวลาจ่ายอนาคตไม่finalize

**ส่วนระบบ:** Payment callback input

**กฎที่อ้างอิง:** ["FR12","BR13","BR16"]

**ระดับ:** P1

**เทคนิค:** ["Invalid partition","Boundary value"]

**ที่มาของ oracle:** D: REQUIREMENTSinput/financialguards; A-test: AT01–03กำหนดfuturetimestamp/16384bytes/HTTP400415413/unknown404ไว้อย่างชัด ไม่อ้างเป็นนโยบายผู้จัดจริง

**เงื่อนไขก่อนเริ่ม:** โลกทดสอบใหม่ เวลา2026-11-06T03:00:00Z; fan/FanDemo!26 เข้า NEON Member queue active และ verify ENCORE-0001; hold C01 และบันทึก checkout ครบก่อนจ่าย

**ข้อมูลทดสอบ:** Buyer Test / buyer@example.test / 0812345678; C01=Holder 1 / holder1@example.test / 0898765432; Regular1800 ไม่มีโค้ด

**ขั้นตอน:**
1. สร้างhold/checkout/pending1832ที่T0
2. callbackamount1ต้องcontrolled400;futurepaidAtT0+1hต้อง400
3. หลังปฏิเสธอ่านpaymentpending/amount1832/refund0/activeholdเดิม/orders0/mail0

**ผลที่คาดหวัง:** inputinvalidไม่finalizeหรือคืนเงินและคงpending/hold/amountเดิม;เป็นAT01ไม่ใช่latepaidAtที่BR16ยอมรับแล้วauto-refund

**จังหวะตรวจ:** clockคง03:00Zตลอด; ตรวจหลังแต่ละinput

**คืนสภาพ:** เก็บ request/response ที่ตัด cookie/token และภาพขั้นสำคัญ; ปิด context; reset/คืน clock เฉพาะฐานทดสอบที่ตนเป็นเจ้าของหลังจบ ห้ามแตะ4310

**ถ้ากฎผิด ควรต่างอย่างไร:** ห้ามยอมรับfuture paidAtเพราะรูปแบบISOถูกต้อง

## V3-A32 — ถอด QR ภาพจริงด้วย decoder อิสระ

**ส่วนระบบ:** Ticket QR

**กฎที่อ้างอิง:** ["FR13","BR17","NFR04"]

**ระดับ:** P1

**เทคนิค:** ["Independent oracle","Data validation"]

**ที่มาของ oracle:** {"oracle":["REQUIREMENTS.md","TEST-DATA.md","USER-STORIES.md"],"policy":"ข้อกำหนด ENCORE; คงป้าย U/A ตามเอกสาร ไม่อ้างนโยบายผู้ให้บริการจริง","contextOnly":["EXPLORATION.md","exploration/lab8/c1.md–c7.md"],"actionMappingOnly":"e2e/api.test.mjs, e2e/ui.spec.js, e2e/lab.spec.js; ไม่ใช้ assertion เป็น oracle"}

**เงื่อนไขก่อนเริ่ม:** โลกทดสอบใหม่; fan ซื้อ NEON สำเร็จด้วยข้อมูลผู้ซื้อ/ผู้ถือมาตรฐาน; บันทึก order/ticket/code/payment IDs; encore/EncoreDemo!26 เป็นเจ้าของ NEON, sky/SkyDemo!26 ต่างเจ้าของ

**ข้อมูลทดสอบ:** Buyer Test / buyer@example.test / 0812345678; C01=Holder 1 / holder1@example.test / 0898765432; Regular1800 ไม่มีโค้ด

**ขั้นตอน:**
1. ดาวน์โหลด /api/ticket-qr?id=TICKET&format=png ในฐานะเจ้าของ
2. ถอดPNGด้วยdecoderอิสระ เช่น jsQR ไม่ใช้ค่าalt/ข้อความDOM
3. เปรียบเทียบpayloadกับopaque ticket codeและตรวจPII

**ผลที่คาดหวัง:** ภาพถอดได้จริงตรงcodeบัตร; opaque random256bit (ถ้าhexยาว64ตัว); ไม่มีBuyer/Holder/email/phoneในpayload; ชื่อ Holder 1 ปรากฏบนบัตรภายนอกQR; 1QRต่อ1ticket

**จังหวะตรวจ:** หลังชำระสำเร็จและก่อนนำไปscan

**คืนสภาพ:** เก็บ request/response ที่ตัด cookie/token และภาพขั้นสำคัญ; ปิด context; reset/คืน clock เฉพาะฐานทดสอบที่ตนเป็นเจ้าของหลังจบ ห้ามแตะ4310

**ถ้ากฎผิด ควรต่างอย่างไร:** ห้ามตรวจแค่รูปโหลดได้หรือเทียบcodeจากAPIกับตัวมันเอง

## V3-A33 — QR payment mail EML แยกเจ้าของและแนบQRจริง

**ส่วนระบบ:** Privacy/EML

**กฎที่อ้างอิง:** ["FR13","FR14","FR15","BR17","BR18","NFR02"]

**ระดับ:** P1

**เทคนิค:** ["Authorization matrix","MIME inspection"]

**ที่มาของ oracle:** {"oracle":["REQUIREMENTS.md","TEST-DATA.md","USER-STORIES.md"],"policy":"ข้อกำหนด ENCORE; คงป้าย U/A ตามเอกสาร ไม่อ้างนโยบายผู้ให้บริการจริง","contextOnly":["EXPLORATION.md","exploration/lab8/c1.md–c7.md"],"actionMappingOnly":"e2e/api.test.mjs, e2e/ui.spec.js, e2e/lab.spec.js; ไม่ใช้ assertion เป็น oracle"}

**เงื่อนไขก่อนเริ่ม:** โลกทดสอบใหม่; fan ซื้อ NEON สำเร็จด้วยข้อมูลผู้ซื้อ/ผู้ถือมาตรฐาน; บันทึก order/ticket/code/payment IDs; encore/EncoreDemo!26 เป็นเจ้าของ NEON, sky/SkyDemo!26 ต่างเจ้าของ

**ข้อมูลทดสอบ:** Buyer Test / buyer@example.test / 0812345678; C01=Holder 1 / holder1@example.test / 0898765432; Regular1800 ไม่มีโค้ด; fan2ต่างบัญชี

**ขั้นตอน:**
1. เจ้าของเปิดticketQR/payment/mail/mail.emlและจดIDs
2. fan2ใช้IDsเดียวกันขอทั้ง4ทรัพยากร
3. ดาวน์โหลดEMLเจ้าของ แยกMIMEHTML/PNG แล้วถอดQRแนบ

**ผลที่คาดหวัง:** ต่างบัญชีไม่มีข้อมูลส่วนตัวและถูกปฏิเสธทุกทรัพยากร; เจ้าของได้EMLถึงbuyer@example.test มีsandbox-only/ไม่อ้างส่งจริง; 1HTMLพร้อม1QRPNGของC01 ถอดตรงcode และชื่อ Holder 1

**จังหวะตรวจ:** ตรวจทั้งownerสำเร็จและnonownerปฏิเสธในรอบเดียวก่อนcleanup

**คืนสภาพ:** เก็บ request/response ที่ตัด cookie/token และภาพขั้นสำคัญ; ปิด context; reset/คืน clock เฉพาะฐานทดสอบที่ตนเป็นเจ้าของหลังจบ ห้ามแตะ4310

**ถ้ากฎผิด ควรต่างอย่างไร:** ห้ามถือว่าเมนูซ่อนเท่ากับป้องกันAPI หรือแค่มองContent-Typeโดยไม่เปิดattachment

## V3-A34 — สองผู้ถือส่งรวมไปผู้ซื้อคนเดียว

**ส่วนระบบ:** Ticket/recipient mapping

**กฎที่อ้างอิง:** ["FR09","FR13","FR14","BR11","BR18"]

**ระดับ:** P1

**เทคนิค:** ["Data mapping","Equivalence partition"]

**ที่มาของ oracle:** {"oracle":["REQUIREMENTS.md","TEST-DATA.md","USER-STORIES.md"],"policy":"ข้อกำหนด ENCORE; คงป้าย U/A ตามเอกสาร ไม่อ้างนโยบายผู้ให้บริการจริง","contextOnly":["EXPLORATION.md","exploration/lab8/c1.md–c7.md"],"actionMappingOnly":"e2e/api.test.mjs, e2e/ui.spec.js, e2e/lab.spec.js; ไม่ใช้ assertion เป็น oracle"}

**เงื่อนไขก่อนเริ่ม:** โลกทดสอบใหม่ เวลา2026-11-06T03:00:00Z; fan/FanDemo!26 เข้า NEON Member queue active และ verify ENCORE-0001; hold C01,C02 และบันทึก checkout ครบก่อนจ่าย

**ข้อมูลทดสอบ:** Buyer Test / buyer@example.test / 0812345678; C01=Holder 1 / holder1@example.test / 0898765432; Regular1800 ไม่มีโค้ด; C02=Holder 2/holder2@example.test/0898765432

**ขั้นตอน:**
1. checkoutระบุholderคนละชื่อผูกseat C01/C02
2. จ่ายสำเร็จ
3. อ่านticketsและmailHTML/EMLของผู้ซื้อ

**ผลที่คาดหวัง:** 2Regularไม่มีโค้ด=3600+60+4=3664; 2ticketชื่อ/seatไม่สลับและcodeไม่ซ้ำ; 1เมลถึงbuyer@example.testรวม2ticket/2QR ไม่ส่งแทนไปholder1/holder2

**จังหวะตรวจ:** หลังticketcompleteแล้วตรวจoutbox

**คืนสภาพ:** เก็บ request/response ที่ตัด cookie/token และภาพขั้นสำคัญ; ปิด context; reset/คืน clock เฉพาะฐานทดสอบที่ตนเป็นเจ้าของหลังจบ ห้ามแตะ4310

**ถ้ากฎผิด ควรต่างอย่างไร:** ห้ามตรวจเพียงจำนวน2โดยไม่ตรวจmappingชื่อ-ที่นั่ง-QR

## V3-A35 — คืนบางใบจึงคืน seat/โควตาหลังอนุมัติ

**ส่วนระบบ:** Refund quota

**กฎที่อ้างอิง:** ["FR17","BR08"]

**ระดับ:** P1

**เทคนิค:** ["State transition","Money reconciliation"]

**ที่มาของ oracle:** {"oracle":["REQUIREMENTS.md","TEST-DATA.md","USER-STORIES.md"],"policy":"[A-policy AP01] นโยบายโจทย์ที่กำหนดก่อนทดสอบ ไม่ใช่คำตอบจากเจ้าของงานจริง","contextOnly":["EXPLORATION.md","exploration/lab8/c1.md–c7.md"],"actionMappingOnly":"e2e/api.test.mjs, e2e/ui.spec.js, e2e/lab.spec.js; ไม่ใช้ assertion เป็น oracle"}

**เงื่อนไขก่อนเริ่ม:** โลกทดสอบใหม่; fan ซื้อ NEON C01,C02+STAGE10 สำเร็จด้วยข้อมูลผู้ซื้อ/ผู้ถือมาตรฐาน; บันทึก order/ticket/code/payment IDs; encore/EncoreDemo!26 เป็นเจ้าของ NEON, sky/SkyDemo!26 ต่างเจ้าของ

**ข้อมูลทดสอบ:** 3304=3600−360+60+4; netใบละ1620

**ขั้นตอน:**
1. fanขอคืนC01
2. ก่อนอนุมัติลองhold C03และตรวจQRสถานะสองใบ
3. encoreอนุมัติC01สองครั้ง
4. อ่านdashboardและลองholdC01อีกครั้ง

**ผลที่คาดหวัง:** pendingยังนับ2ใบจึงเพิ่มไม่ได้; C02ยังvalid; หลังอนุมัติC01ว่าง/สิทธิ์คืน1, holdC01ได้; คืน1620ครั้งเดียวไม่รวมfee/VAT; gross3304−refund1620=net1684; เมลซื้อเดิม1ฉบับ

**จังหวะตรวจ:** ตรวจก่อนและหลังapproveแยกกัน ไม่ข้ามpending

**คืนสภาพ:** เก็บ request/response ที่ตัด cookie/token และภาพขั้นสำคัญ; ปิด context; reset/คืน clock เฉพาะฐานทดสอบที่ตนเป็นเจ้าของหลังจบ ห้ามแตะ4310

**ถ้ากฎผิด ควรต่างอย่างไร:** ห้ามคืนquotaตอนrequestหรือคืน1652แทน1620

## V3-A36 — scan แข่งกันใช้ code ได้คนเดียวและคืนชื่อ

**ส่วนระบบ:** Gate authorization

**กฎที่อ้างอิง:** ["FR16","BR17","NFR03"]

**ระดับ:** P1

**เทคนิค:** ["Concurrency","Authorization matrix"]

**ที่มาของ oracle:** {"oracle":["REQUIREMENTS.md","TEST-DATA.md","USER-STORIES.md"],"policy":"[A-policy AP05] หน้าต่างNEONตามโจทย์ ไม่ใช่คำตอบเจ้าของงานจริง","contextOnly":["EXPLORATION.md","exploration/lab8/c1.md–c7.md"],"actionMappingOnly":"e2e/api.test.mjs, e2e/ui.spec.js, e2e/lab.spec.js; ไม่ใช้ assertion เป็น oracle"}

**เงื่อนไขก่อนเริ่ม:** โลกทดสอบใหม่; fan ซื้อ NEON สำเร็จด้วยข้อมูลผู้ซื้อ/ผู้ถือมาตรฐาน; บันทึก order/ticket/code/payment IDs; encore/EncoreDemo!26 เป็นเจ้าของ NEON, sky/SkyDemo!26 ต่างเจ้าของ

**ข้อมูลทดสอบ:** ticket C01 Holder 1; clock2026-12-12T09:00Z; gate/GateDemo!26

**ขั้นตอน:**
1. ก่อนใช้บัตร:buyerยิงscanNEONต้อง403 และgateยิงeventAURORAด้วยcodeNEONต้อง403;ticketเดิมต้องยังvalid
2. gateNEONสแกนcodeเดียวกันสองคำขอพร้อมกัน ต้องได้200และ409จำนวนอย่างละหนึ่ง
3. ผลสำเร็จคืนชื่อHolder1ตรงsnapshot

**ผลที่คาดหวัง:** wrongrole/eventทดสอบกับcodevalidที่ยังไม่ใช้ จึงไม่ถูกusedguardบัง;อนุญาตครั้งเดียวและคืนชื่อถูก

**จังหวะตรวจ:** เวลา16:00ไทยภายในหน้าต่างประตู; ตรวจหลังทั้งสองคำขอจบ

**คืนสภาพ:** เก็บ request/response ที่ตัด cookie/token และภาพขั้นสำคัญ; ปิด context; reset/คืน clock เฉพาะฐานทดสอบที่ตนเป็นเจ้าของหลังจบ ห้ามแตะ4310

**ถ้ากฎผิด ควรต่างอย่างไร:** ห้ามแปลข้อความมีคำว่าใช้แล้วเป็นsuccess

## V3-A37 — refund cutoff รวม72h และpendingเข้าไม่ได้

**ส่วนระบบ:** Refund boundary/gate

**กฎที่อ้างอิง:** ["FR16","FR17","BR08"]

**ระดับ:** P1

**เทคนิค:** ["Boundary value","State transition"]

**ที่มาของ oracle:** {"oracle":["REQUIREMENTS.md","TEST-DATA.md","USER-STORIES.md"],"policy":"[A-policy AP01] นโยบายโจทย์ที่กำหนดก่อนทดสอบ ไม่ใช่คำตอบจากเจ้าของงานจริง; [A-policy AP05] เวลาประตูโจทย์","contextOnly":["EXPLORATION.md","exploration/lab8/c1.md–c7.md"],"actionMappingOnly":"e2e/api.test.mjs, e2e/ui.spec.js, e2e/lab.spec.js; ไม่ใช้ assertion เป็น oracle"}

**เงื่อนไขก่อนเริ่ม:** โลกทดสอบใหม่; fan ซื้อ NEON C01,C02 สำเร็จด้วยข้อมูลผู้ซื้อ/ผู้ถือมาตรฐาน; บันทึก order/ticket/code/payment IDs; encore/EncoreDemo!26 เป็นเจ้าของ NEON, sky/SkyDemo!26 ต่างเจ้าของ

**ข้อมูลทดสอบ:** NEONstart2026-12-12T11:00Z; cutoff2026-12-09T11:00Z

**ขั้นตอน:**
1. ตั้งclockcutoff; loginใหม่และขอคืนC01
2. เลื่อน1msและขอคืนC02
3. ตั้งgateopen2026-12-12T09:00Z; gateสแกนcodeC01

**ผลที่คาดหวัง:** ตรงstart−72hขอคืนได้; +1msขอคืนไม่ได้; C01refund_pendingเข้าไม่ได้แม้QRเดิมถอดได้; C02ยังvalidไม่เปลี่ยน

**จังหวะตรวจ:** 72hตรงขอบ/หลัง1msและประตูเปิด; loginใหม่หลังข้าม24h

**คืนสภาพ:** เก็บ request/response ที่ตัด cookie/token และภาพขั้นสำคัญ; ปิด context; reset/คืน clock เฉพาะฐานทดสอบที่ตนเป็นเจ้าของหลังจบ ห้ามแตะ4310

**ถ้ากฎผิด ควรต่างอย่างไร:** ห้ามอ้างผลสำรวจC5/C7แทนนโยบายAP01

## V3-A38 — owner scope พักขายและบังคับรอบไม่ได้

**ส่วนระบบ:** Organizer controls

**กฎที่อ้างอิง:** ["FR17","BR20"]

**ระดับ:** P1

**เทคนิค:** ["Authorization matrix","State transition"]

**ที่มาของ oracle:** {"oracle":["REQUIREMENTS.md","TEST-DATA.md","USER-STORIES.md"],"policy":"[A-policy AP04] พักขายยังชำระholdเดิมได้ ไม่ใช่คำตอบเจ้าของงานจริง","contextOnly":["EXPLORATION.md","exploration/lab8/c1.md–c7.md"],"actionMappingOnly":"e2e/api.test.mjs, e2e/ui.spec.js, e2e/lab.spec.js; ไม่ใช้ assertion เป็น oracle"}

**เงื่อนไขก่อนเริ่ม:** โลกทดสอบใหม่ เวลา2026-11-06T03:00:00Z; fan/FanDemo!26 เข้า NEON Member queue active และ verify ENCORE-0001; hold C01 และบันทึก checkout ครบก่อนจ่าย

**ข้อมูลทดสอบ:** Buyer Test / buyer@example.test / 0812345678; C01=Holder 1 / holder1@example.test / 0898765432; Regular1800 ไม่มีโค้ด; encoreเจ้าของNEON skyต่างเจ้าของ

**ขั้นตอน:**
1. buyeractive+verifyและholdC01/checkoutก่อนmutation; foreignownerดู/แก้งานไม่ผ่าน
2. ขณะon_sale:orgblockC02;buyerพยายามholdC02ต้องdeny และholdC01เดิมยังอยู่
3. pause:ผู้ซื้อใหม่joinต้องSALE_UNAVAILABLE;buyerเดิมholdใหม่ไม่ได้
4. จ่ายholdC01ที่สร้างก่อนpauseสำเร็จ ภายในexpires

**ผลที่คาดหวัง:** blockและpauseแยกเงื่อนไข; C01เดิมเป็นpositivecontrolอยู่ก่อน;pauseห้ามjoin/holdใหม่แต่จ่ายholdเดิมได้ตามAP04

**จังหวะตรวจ:** เวลา03:00Zและก่อนhold600s; ตรวจstateหลังคำขอผิดทุกครั้ง

**คืนสภาพ:** เก็บ request/response ที่ตัด cookie/token และภาพขั้นสำคัญ; ปิด context; reset/คืน clock เฉพาะฐานทดสอบที่ตนเป็นเจ้าของหลังจบ ห้ามแตะ4310

**ถ้ากฎผิด ควรต่างอย่างไร:** ห้ามตีความpauseเหมือนcancelหรือเปิดGeneralด้วยปุ่มadmin

## V3-A39 — cancel คืนเต็มและทำซ้ำไม่เพิ่มรายการ

**ส่วนระบบ:** Cancel/refund

**กฎที่อ้างอิง:** ["FR17","NFR03"]

**ระดับ:** P1

**เทคนิค:** ["Idempotency","Money reconciliation"]

**ที่มาของ oracle:** {"oracle":["REQUIREMENTS.md","TEST-DATA.md","USER-STORIES.md"],"policy":"[A-policy AP03] ยกเลิกคืนเต็มตามโจทย์ ไม่ใช่คำตอบเจ้าของงานจริง","contextOnly":["EXPLORATION.md","exploration/lab8/c1.md–c7.md"],"actionMappingOnly":"e2e/api.test.mjs, e2e/ui.spec.js, e2e/lab.spec.js; ไม่ใช้ assertion เป็น oracle"}

**เงื่อนไขก่อนเริ่ม:** โลกทดสอบใหม่; fan ซื้อ NEON C01+STAGE10 สำเร็จด้วยข้อมูลผู้ซื้อ/ผู้ถือมาตรฐาน; บันทึก order/ticket/code/payment IDs; encore/EncoreDemo!26 เป็นเจ้าของ NEON, sky/SkyDemo!26 ต่างเจ้าของ

**ข้อมูลทดสอบ:** paid1652=1620+30+2

**ขั้นตอน:**
1. encoreยกเลิกNEON
2. อ่านrefundและอนุมัติ
3. ยกเลิกซ้ำและapproveซ้ำ
4. อ่านยอดrefund/order/ticket/mail

**ผลที่คาดหวัง:** คืนเต็ม1652รวมfee/VATครั้งเดียว; refund1รายการ net0; ไม่มีticket/mailซื้อเพิ่มจาก1ชุดเดิม; บัตรยกเลิกเข้าไม่ได้

**จังหวะตรวจ:** หลังcancel หลังapproveและหลังreplayทั้งหมด

**คืนสภาพ:** เก็บ request/response ที่ตัด cookie/token และภาพขั้นสำคัญ; ปิด context; reset/คืน clock เฉพาะฐานทดสอบที่ตนเป็นเจ้าของหลังจบ ห้ามแตะ4310

**ถ้ากฎผิด ควรต่างอย่างไร:** ห้ามคืนเฉพาะ1620เหมือนbuyerrefund

## V3-A40 — Origin body IDs และtest tools ไม่เปิดช่อง

**ส่วนระบบ:** Request protection

**กฎที่อ้างอิง:** ["FR18","NFR02","NFR07"]

**ระดับ:** P1

**เทคนิค:** ["Invalid partition","Security boundary"]

**ที่มาของ oracle:** D: REQUIREMENTSinput/financialguards; A-test: AT01–03กำหนดfuturetimestamp/16384bytes/HTTP400415413/unknown404ไว้อย่างชัด ไม่อ้างเป็นนโยบายผู้จัดจริง

**เงื่อนไขก่อนเริ่ม:** โลกทดสอบแยกและsessionfan; มีtesttokenเฉพาะผู้ควบคุม ห้ามใช้4310

**ข้อมูลทดสอบ:** foreign Origin=https://foreign.test; hold=[]; body17000ตัว; test/reset,test/callbackไม่มีtoken

**ขั้นตอน:**
1. ส่งPOSTqueueด้วยforeignOrigin
2. ส่งcheckout holdเป็นarray
3. ส่งbodyขนาด17000ตัว
4. เรียกtest/resetและtest/callbackโดยไม่ส่งtoken; อ่านhealth/eventsหลังชุดผิด

**ผลที่คาดหวัง:** foreignOrigin/testtoolsไม่มีtokenถูกปฏิเสธ; invalidIDเป็นcontrolled4xx; oversizedเป็น413หรือเกณฑ์bodylimitที่ประกาศ ไม่500; ไม่เกิดhold/order/mailและserverยังตอบได้; ข้อมูลก่อนทดสอบไม่ถูกreset

**จังหวะตรวจ:** หลังแต่ละrequestและhealthหลังจบ; จดbaselineก่อนทดสอบ

**คืนสภาพ:** เก็บ request/response ที่ตัด cookie/token และภาพขั้นสำคัญ; ปิด context; reset/คืน clock เฉพาะฐานทดสอบที่ตนเป็นเจ้าของหลังจบ ห้ามแตะ4310

**ถ้ากฎผิด ควรต่างอย่างไร:** ห้ามใส่testtokenโดยอัตโนมัติทุกrequestจนไม่เคยทดสอบการป้องกัน

## V3-A41 — restart รักษาorder เก่าและข้อมูลV3

**ส่วนระบบ:** Persistence/restart

**กฎที่อ้างอิง:** ["FR17","FR18","NFR05"]

**ระดับ:** P1

**เทคนิค:** ["Persistence","Regression"]

**ที่มาของ oracle:** {"oracle":["REQUIREMENTS.md","TEST-DATA.md","USER-STORIES.md"],"policy":"ข้อกำหนด ENCORE; คงป้าย U/A ตามเอกสาร ไม่อ้างนโยบายผู้ให้บริการจริง","contextOnly":["EXPLORATION.md","exploration/lab8/c1.md–c7.md"],"actionMappingOnly":"e2e/api.test.mjs, e2e/ui.spec.js, e2e/lab.spec.js; ไม่ใช้ assertion เป็น oracle"}

**เงื่อนไขก่อนเริ่ม:** tempDBส่วนตัวใน4314/พอร์ตแยกที่ว่าง; มีfixturelegacy holderว่าง และ V3 C01 Holder 1 ที่ซื้อสำเร็จ; จดID/count/code/contact/mailก่อนstop

**ข้อมูลทดสอบ:** legacyorderไม่มีcontact; V3order1832/1ticket/1mail

**ขั้นตอน:**
1. บันทึกbaselineorders/code/ยอด/เมล
2. หยุดเฉพาะserverตนแล้วบูตDBเดิม
3. loginใหม่อ่านlegacyและV3order/mail/events
4. เปิดUIบัตรlegacyและV3

**ผลที่คาดหวัง:** legacyID/code/ยอดเดิมอยู่ holderยังว่างและแสดงรายการรุ่นก่อน ไม่แต่งชื่อ; V3snapshot/1mail/QRเดิมยังอยู่; งานตัวอย่าง12งานยังอยู่ ไม่มีorder/mailซ้ำหลังrestart

**จังหวะตรวจ:** ก่อนstopและหลังhealthready; ไม่resetระหว่างstop/start

**คืนสภาพ:** เก็บ request/response ที่ตัด cookie/token และภาพขั้นสำคัญ; ปิด context; reset/คืน clock เฉพาะฐานทดสอบที่ตนเป็นเจ้าของหลังจบ ห้ามแตะ4310; หยุดprocessทดสอบของตนและลบเฉพาะtempDB/temporarydirectoryที่สร้างสำหรับกรณีนี้หลังเก็บหลักฐาน ห้ามลบDBผู้ใช้

**ถ้ากฎผิด ควรต่างอย่างไร:** ห้ามเรียกฐานข้อมูลใหม่แล้วอ้างว่ารักษาข้อมูลสำเร็จ

## V3-A42 — upgrade schemaV2จริงแบบadditive

**ส่วนระบบ:** Schema migration

**กฎที่อ้างอิง:** ["FR17","FR18","NFR05"]

**ระดับ:** P1

**เทคนิค:** ["Migration","Data preservation"]

**ที่มาของ oracle:** {"oracle":["REQUIREMENTS.md","TEST-DATA.md","USER-STORIES.md"],"policy":"ข้อกำหนด ENCORE; คงป้าย U/A ตามเอกสาร ไม่อ้างนโยบายผู้ให้บริการจริง","contextOnly":["EXPLORATION.md","exploration/lab8/c1.md–c7.md"],"actionMappingOnly":"e2e/api.test.mjs, e2e/ui.spec.js, e2e/lab.spec.js; ไม่ใช้ assertion เป็น oracle"}

**เงื่อนไขก่อนเริ่ม:** DBtempใหม่สร้างด้วยfixtureV2ที่ตรวจรับอิสระก่อนบูตV3 ไม่อ่านruntime/ไม่สร้างV3แล้วลบholderแทน; ใช้พอร์ต4314เมื่อว่าง

**ข้อมูลทดสอบ:** legacy@example.test/LegacyDemo!26; LEGACY-ORDER/C01/code=b64ตัว; 1800+30+2=1832; ไม่มีusername/holderในschemaV2

**ขั้นตอน:**
1. ผู้ควบคุมเตรียมV2fixture; ตรวจschemaไม่มีคอลัมน์V3และจดlegacyrows
2. บูตV3ด้วยDBเดิม loginด้วยemailเก่า
3. อ่านlegacyorder/QR/UI/mail; restartอีกครั้งเปรียบเทียบ

**ผลที่คาดหวัง:** เพิ่มschemaได้โดยไม่ทำID/code/ราคา1832หาย; holderยังnull/UIรายการรุ่นก่อน ไม่มีcontactปลอม; ไม่มีเมลย้อนหลังที่แต่งขึ้น; V2eventเดิมยังอยู่ร่วม12fixtureถ้าชุดseedเพิ่มไว้; restartไม่duplicate

**จังหวะตรวจ:** baselineก่อนบูตแรก หลังmigration และหลังบูตที่2

**คืนสภาพ:** เก็บ request/response ที่ตัด cookie/token และภาพขั้นสำคัญ; ปิด context; reset/คืน clock เฉพาะฐานทดสอบที่ตนเป็นเจ้าของหลังจบ ห้ามแตะ4310; หยุดprocessทดสอบของตนและลบเฉพาะtempDB/temporarydirectoryที่สร้างสำหรับกรณีนี้หลังเก็บหลักฐาน ห้ามลบDBผู้ใช้

**ถ้ากฎผิด ควรต่างอย่างไร:** ห้ามใช้fixtureที่สร้างschemaV3แล้วเรียกว่าพิสูจน์V2migration

## V3-A48 — reject แล้วขอคืนใหม่ใช้requestเดิม

**ส่วนระบบ:** Refund transition

**กฎที่อ้างอิง:** ["FR17","BR08","NFR03"]

**ระดับ:** P1

**เทคนิค:** ["State transition","Idempotency"]

**ที่มาของ oracle:** {"oracle":["REQUIREMENTS.md","TEST-DATA.md","USER-STORIES.md"],"policy":"[A-policy AP01 AP02] นโยบายโจทย์ ไม่ใช่คำตอบจากเจ้าของงานจริง","contextOnly":["EXPLORATION.md","exploration/lab8/c1.md–c7.md"],"actionMappingOnly":"e2e/api.test.mjs, e2e/ui.spec.js, e2e/lab.spec.js; ไม่ใช้ assertion เป็น oracle"}

**เงื่อนไขก่อนเริ่ม:** โลกทดสอบใหม่; fan ซื้อ NEON สำเร็จด้วยข้อมูลผู้ซื้อ/ผู้ถือมาตรฐาน; บันทึก order/ticket/code/payment IDs; encore/EncoreDemo!26 เป็นเจ้าของ NEON, sky/SkyDemo!26 ต่างเจ้าของ

**ข้อมูลทดสอบ:** Buyer Test / buyer@example.test / 0812345678; C01=Holder 1 / holder1@example.test / 0898765432; Regular1800 ไม่มีโค้ด

**ขั้นตอน:**
1. ขอคืนC01และจดrefundID; ขอซ้ำขณะpending
2. encoreส่งdecisionผิดแล้วreject
3. ตรวจticket/QR/ยอด; buyerขอใหม่
4. approveสองครั้งอ่านdashboard

**ผลที่คาดหวัง:** pendingซ้ำ/decisionผิดไม่เพิ่มrefund; rejectทำticketvalidและrefunded0; ขอใหม่ใช้IDเดิมกลับrequested; approveซ้ำคืน1800เพียงครั้งเดียว net1832−1800=32; refundรวม1รายการ

**จังหวะตรวจ:** หลังrejectก่อนretry และหลังapproveซ้ำ

**คืนสภาพ:** เก็บ request/response ที่ตัด cookie/token และภาพขั้นสำคัญ; ปิด context; reset/คืน clock เฉพาะฐานทดสอบที่ตนเป็นเจ้าของหลังจบ ห้ามแตะ4310

**ถ้ากฎผิด ควรต่างอย่างไร:** ห้ามสร้างrefundIDใหม่ทุกretryหรือคืนเงินตอนreject

## V3-A49 — cancel ยกระดับpendingrefundและห้ามเปิดใหม่

**ส่วนระบบ:** Cancel/pending refund

**กฎที่อ้างอิง:** ["FR12","FR17","BR20"]

**ระดับ:** P1

**เทคนิค:** ["State transition","Money reconciliation"]

**ที่มาของ oracle:** {"oracle":["REQUIREMENTS.md","TEST-DATA.md","USER-STORIES.md"],"policy":"[A-policy AP03] นโยบายยกเลิกโจทย์ ไม่ใช่คำตอบเจ้าของงานจริง","contextOnly":["EXPLORATION.md","exploration/lab8/c1.md–c7.md"],"actionMappingOnly":"e2e/api.test.mjs, e2e/ui.spec.js, e2e/lab.spec.js; ไม่ใช้ assertion เป็น oracle"}

**เงื่อนไขก่อนเริ่ม:** โลกทดสอบใหม่; fan ซื้อ NEON C01+STAGE10 สำเร็จด้วยข้อมูลผู้ซื้อ/ผู้ถือมาตรฐาน; บันทึก order/ticket/code/payment IDs; encore/EncoreDemo!26 เป็นเจ้าของ NEON, sky/SkyDemo!26 ต่างเจ้าของ

**ข้อมูลทดสอบ:** paid1652; buyerrefund1620

**ขั้นตอน:**
1. buyerขอคืนC01จดID/1620
2. encorecancelNEONแล้วอ่านrefund
3. ลองเปิดon_saleและjoinใหม่
4. approveและอ่านnet

**ผลที่คาดหวัง:** refundเดิม1IDยกระดับเต็ม1652 ไม่สร้างสองรายการ; cancelเปิดกลับ/รับซื้อใหม่ไม่ได้; approveแล้วnet0; บัตรไม่valid

**จังหวะตรวจ:** ก่อนcancel หลังcancel และหลังapprove

**คืนสภาพ:** เก็บ request/response ที่ตัด cookie/token และภาพขั้นสำคัญ; ปิด context; reset/คืน clock เฉพาะฐานทดสอบที่ตนเป็นเจ้าของหลังจบ ห้ามแตะ4310

**ถ้ากฎผิด ควรต่างอย่างไร:** ห้ามคืน1620และเพิ่ม32เป็นrefundใหม่จนเสี่ยงซ้ำ

## V3-A50 — cancel pending แล้วเงินมาช้าคืนครั้งเดียว

**ส่วนระบบ:** Cancel/payment

**กฎที่อ้างอิง:** ["FR12","FR15","FR17","BR16","NFR03"]

**ระดับ:** P1

**เทคนิค:** ["State transition","Idempotency"]

**ที่มาของ oracle:** {"oracle":["REQUIREMENTS.md","TEST-DATA.md","USER-STORIES.md"],"policy":"[A-policy AP03] รับเงินของholdยกเลิกต้องคืนทดลอง ไม่ใช่คำตอบเจ้าของงานจริง","contextOnly":["EXPLORATION.md","exploration/lab8/c1.md–c7.md"],"actionMappingOnly":"e2e/api.test.mjs, e2e/ui.spec.js, e2e/lab.spec.js; ไม่ใช้ assertion เป็น oracle"}

**เงื่อนไขก่อนเริ่ม:** โลกทดสอบใหม่ เวลา2026-11-06T03:00:00Z; fan/FanDemo!26 เข้า NEON Member queue active และ verify ENCORE-0001; hold C01 และบันทึก checkout ครบก่อนจ่าย

**ข้อมูลทดสอบ:** Buyer Test / buyer@example.test / 0812345678; C01=Holder 1 / holder1@example.test / 0898765432; Regular1800 ไม่มีโค้ด

**ขั้นตอน:**
1. สร้างpending1832และจดpaymentID
2. encorecancelNEONก่อนapprove
3. ตรวจactivehold/seat แล้วส่งcallbackapprovedเดิม2ครั้ง
4. อ่านpayment/orders/mail/notifications

**ผลที่คาดหวัง:** holdถูกปล่อยและงานปิด; lateapprovalauto-refund1832ครั้งเดียว; 0ticket/0order/0mail; notificationเรื่องคืนเงินไม่ซ้ำจากreplay

**จังหวะตรวจ:** ตรวจทันทีcancelและหลังcallbackแต่ละครั้ง

**คืนสภาพ:** เก็บ request/response ที่ตัด cookie/token และภาพขั้นสำคัญ; ปิด context; reset/คืน clock เฉพาะฐานทดสอบที่ตนเป็นเจ้าของหลังจบ ห้ามแตะ4310

**ถ้ากฎผิด ควรต่างอย่างไร:** ห้ามจบที่holdหายโดยไม่ส่งเงินมาช้าพิสูจน์

## V3-A51 — ขอบประตูระดับ1ms

**ส่วนระบบ:** Gate time

**กฎที่อ้างอิง:** ["FR16","BR17","BR20"]

**ระดับ:** P1

**เทคนิค:** ["Boundary value"]

**ที่มาของ oracle:** {"oracle":["REQUIREMENTS.md","TEST-DATA.md","USER-STORIES.md"],"policy":"[A-policy AP05] 16:00<=now<22:00 NEON เป็นนโยบายโจทย์ ไม่ใช่คำตอบเจ้าของงานจริง","contextOnly":["EXPLORATION.md","exploration/lab8/c1.md–c7.md"],"actionMappingOnly":"e2e/api.test.mjs, e2e/ui.spec.js, e2e/lab.spec.js; ไม่ใช้ assertion เป็น oracle"}

**เงื่อนไขก่อนเริ่ม:** โลกทดสอบใหม่; fan ซื้อ NEON C01,C02 สำเร็จด้วยข้อมูลผู้ซื้อ/ผู้ถือมาตรฐาน; บันทึก order/ticket/code/payment IDs; encore/EncoreDemo!26 เป็นเจ้าของ NEON, sky/SkyDemo!26 ต่างเจ้าของ

**ข้อมูลทดสอบ:** open2026-12-12T09:00Z close15:00Z (16:00–22:00ไทย)

**ขั้นตอน:**
1. เวลา08:59:59.999Z login gate scanC01
2. เวลา09:00Z scanC01
3. ใช้โลกใหม่/บัตรที่ยังไม่usedตรวจC02ที่14:59:59.999Z
4. โลกใหม่/บัตรใหม่ตรวจตรง15:00Z

**ผลที่คาดหวัง:** ก่อนเปิดปฏิเสธและไม่consume; ตรงเปิดsuccess; ก่อนปิด1msยังsuccess; ตรงปิดปฏิเสธและไม่consume; แต่ละcaseใช้codeยังvalidเพื่อไม่ให้usedบดบังเวลา

**จังหวะตรวจ:** ต้องloginใหม่เมื่อเลื่อนข้าม24h; เก็บcontrolledclockทุกจุด

**คืนสภาพ:** เก็บ request/response ที่ตัด cookie/token และภาพขั้นสำคัญ; ปิด context; reset/คืน clock เฉพาะฐานทดสอบที่ตนเป็นเจ้าของหลังจบ ห้ามแตะ4310

**ถ้ากฎผิด ควรต่างอย่างไร:** ห้ามใช้บัตรusedหรือcodeไม่รู้จักเป็นหลักฐานว่าประตูเปิด

## V3-A53 — malformed request คืนข้อผิดพลาดควบคุมได้

**ส่วนระบบ:** Protocol resilience

**กฎที่อ้างอิง:** ["FR18","NFR02"]

**ระดับ:** P1

**เทคนิค:** ["Invalid partition","Error handling"]

**ที่มาของ oracle:** D: REQUIREMENTSinput/financialguards; A-test: AT01–03กำหนดfuturetimestamp/16384bytes/HTTP400415413/unknown404ไว้อย่างชัด ไม่อ้างเป็นนโยบายผู้จัดจริง

**เงื่อนไขก่อนเริ่ม:** โลกแยกสะอาด; ส่งHTTPดิบได้ ไม่ใช้helperที่บังคับJSONถูกต้อง

**ข้อมูลทดสอบ:** POSTlogin: {, null, [], text/plain hello; unknownroute/event/round; DELETEorders; POST/; /package.json

**ขั้นตอน:**
1. ส่งแต่ละbody/contenttypeแยกคำขอ
2. เรียกroute/event/roundผิดและmethodผิด
3. ขอไฟล์นอกpublic/package.json
4. อ่านhealthและloginถูกต้องหลังทุกชุด

**ผลที่คาดหวัง:** malformed JSON/shapeได้controlled4xx (syntax400, unsupportedtype415); route/methodไม่รองรับ4xx ไม่เผยsource/stack/secret; ไม่มีmutation; serverยังloginได้; ไม่500/ค้าง

**จังหวะตรวจ:** บันทึกstatus+errorbodyของทุกpartition; ตรวจhealthต่อจากทุกชุด

**คืนสภาพ:** เก็บ request/response ที่ตัด cookie/token และภาพขั้นสำคัญ; ปิด context; reset/คืน clock เฉพาะฐานทดสอบที่ตนเป็นเจ้าของหลังจบ ห้ามแตะ4310

**ถ้ากฎผิด ควรต่างอย่างไร:** ห้ามทดสอบเฉพาะJSONsyntaxผิดหนึ่งค่าแล้วอ้างครอบคลุมtype/method

## V3-A55 — markup เป็นข้อความและnotificationแยกบัญชี

**ส่วนระบบ:** Escaping/privacy

**กฎที่อ้างอิง:** ["FR09","FR13","FR14","FR15","NFR02"]

**ระดับ:** P1

**เทคนิค:** ["Injection","Authorization matrix"]

**ที่มาของ oracle:** {"oracle":["REQUIREMENTS.md","TEST-DATA.md","USER-STORIES.md"],"policy":"ข้อกำหนด ENCORE; คงป้าย U/A ตามเอกสาร ไม่อ้างนโยบายผู้ให้บริการจริง","contextOnly":["EXPLORATION.md","exploration/lab8/c1.md–c7.md"],"actionMappingOnly":"e2e/api.test.mjs, e2e/ui.spec.js, e2e/lab.spec.js; ไม่ใช้ assertion เป็น oracle"}

**เงื่อนไขก่อนเริ่ม:** โลกทดสอบใหม่ เวลา2026-11-06T03:00:00Z; fan/FanDemo!26 เข้า NEON Member queue active และ verify ENCORE-0001; hold C01 และบันทึก checkout ครบก่อนจ่าย

**ข้อมูลทดสอบ:** buyer/holder name=<img src=x onerror=alert(1)> Test; email/phoneถูกต้อง

**ขั้นตอน:**
1. บันทึกcheckoutชื่อmarkupและจ่ายสำเร็จ
2. เปิดticket/mailHTML/EML ตรวจDOMและdialog/pageerror
3. fan2เปิดnotifications/orders/mailbox
4. fanอ่านnotificationซื้อของตน

**ผลที่คาดหวัง:** markupแสดงliteralไม่execute/ไม่เป็นelementonerror; mailHTMLescapeเป็น&lt;img; 1ticket/1mail1832; fan2ไม่มีorder/mail/notificationของfan; fanเห็นnotificationที่เกี่ยวข้องของตน

**จังหวะตรวจ:** ตรวจตอนrenderครั้งแรกและหลังreload ไม่ใช่เฉพาะJSON

**คืนสภาพ:** เก็บ request/response ที่ตัด cookie/token และภาพขั้นสำคัญ; ปิด context; reset/คืน clock เฉพาะฐานทดสอบที่ตนเป็นเจ้าของหลังจบ ห้ามแตะ4310

**ถ้ากฎผิด ควรต่างอย่างไร:** ห้ามถือว่าชื่ออยู่ในJSONปลอดภัยเท่ากับHTMLescape

## V3-A58 — ผู้ซื้ออื่น/ผู้จัดอื่นสั่งpay/refundไม่ได้

**ส่วนระบบ:** Mutation ownership

**กฎที่อ้างอิง:** ["FR12","FR15","FR17","BR17","NFR02"]

**ระดับ:** P1

**เทคนิค:** ["Authorization matrix","State preservation"]

**ที่มาของ oracle:** {"oracle":["REQUIREMENTS.md","TEST-DATA.md","USER-STORIES.md"],"policy":"ข้อกำหนด ENCORE; คงป้าย U/A ตามเอกสาร ไม่อ้างนโยบายผู้ให้บริการจริง","contextOnly":["EXPLORATION.md","exploration/lab8/c1.md–c7.md"],"actionMappingOnly":"e2e/api.test.mjs, e2e/ui.spec.js, e2e/lab.spec.js; ไม่ใช้ assertion เป็น oracle"}

**เงื่อนไขก่อนเริ่ม:** โลกทดสอบใหม่ เวลา2026-11-06T03:00:00Z; fan/FanDemo!26 เข้า NEON Member queue active และ verify ENCORE-0001; hold C01 และบันทึก checkout ครบก่อนจ่าย

**ข้อมูลทดสอบ:** Buyer Test / buyer@example.test / 0812345678; C01=Holder 1 / holder1@example.test / 0898765432; Regular1800 ไม่มีโค้ด; fan2ต่างbuyer skyต่างowner

**ขั้นตอน:**
1. สร้างpendingจดpaymentID
2. fan2resolve/paymentQRโดยIDนั้น
3. fanresolveสำเร็จ; fan2ขอrefundticketนั้น
4. fanขอrefund; skyและbuyerลองapprove
5. อ่านticket/payment/refundหลังทุกการปฏิเสธ

**ผลที่คาดหวัง:** ต่างbuyerอ่านQR/resolve/refundไม่ได้และไม่เปลี่ยนstate; เจ้าของpayได้1order/1ticket/1mail; ต่างowner/buyerapproveไม่ได้; requestเจ้าของยังpendingไม่คืนเงินโดยผู้ไม่มีสิทธิ์

**จังหวะตรวจ:** ตรวจbaseline/afterทุกคำขอผิดก่อนให้เจ้าของทำรายการจริง

**คืนสภาพ:** เก็บ request/response ที่ตัด cookie/token และภาพขั้นสำคัญ; ปิด context; reset/คืน clock เฉพาะฐานทดสอบที่ตนเป็นเจ้าของหลังจบ ห้ามแตะ4310

**ถ้ากฎผิด ควรต่างอย่างไร:** ห้ามทดสอบแค่GETisolationแต่ไม่ทดสอบmutation

## V3-A61 — refunded/cancelled QRจริงเข้าประตูไม่ได้

**ส่วนระบบ:** Revoked tickets

**กฎที่อ้างอิง:** ["FR16","FR17","BR17","BR20"]

**ระดับ:** P1

**เทคนิค:** ["State transition","Negative testing"]

**ที่มาของ oracle:** {"oracle":["REQUIREMENTS.md","TEST-DATA.md","USER-STORIES.md"],"policy":"[A-policy AP01 AP03 AP05] นโยบายโจทย์ ไม่ใช่คำตอบเจ้าของงานจริง","contextOnly":["EXPLORATION.md","exploration/lab8/c1.md–c7.md"],"actionMappingOnly":"e2e/api.test.mjs, e2e/ui.spec.js, e2e/lab.spec.js; ไม่ใช้ assertion เป็น oracle"}

**เงื่อนไขก่อนเริ่ม:** โลกทดสอบใหม่; fan ซื้อ NEON C01,C02 สำเร็จด้วยข้อมูลผู้ซื้อ/ผู้ถือมาตรฐาน; บันทึก order/ticket/code/payment IDs; encore/EncoreDemo!26 เป็นเจ้าของ NEON, sky/SkyDemo!26 ต่างเจ้าของ

**ข้อมูลทดสอบ:** C01อนุมัติrefund; C02ยังvalidก่อนcancel

**ขั้นตอน:**
1. เก็บcodeจากQRทั้งสองก่อนเพิกถอน
2. buyerขอคืนC01และencoreapprove
3. ที่gateopenloginใหม่scanC01
4. encorecancelNEONแล้วgate scanC02

**ผลที่คาดหวัง:** C01refundedปฏิเสธแม้QRตรงcode; C02หลังcancelปฏิเสธงานยกเลิก; 0successfulscanทั้งคู่และไม่มีusedแทรก

**จังหวะตรวจ:** scanภายในAP05เพื่อไม่ให้closedgateบดบังสถานะ

**คืนสภาพ:** เก็บ request/response ที่ตัด cookie/token และภาพขั้นสำคัญ; ปิด context; reset/คืน clock เฉพาะฐานทดสอบที่ตนเป็นเจ้าของหลังจบ ห้ามแตะ4310

**ถ้ากฎผิด ควรต่างอย่างไร:** ห้ามใช้QRปลอมหรือหมดเวลาประตูแทนเพิกถอนจริง

## V3-L03 — ครั้งที่2ต้องเป็นผลปฏิเสธ ไม่ใช้คำค้นกำกวม

**ส่วนระบบ:** Gate UI regression

**กฎที่อ้างอิง:** ["FR16","BR17","NFR01"]

**ระดับ:** P1

**เทคนิค:** ["Negative testing","Semantic assertion"]

**ที่มาของ oracle:** {"oracle":["REQUIREMENTS.md","TEST-DATA.md","USER-STORIES.md"],"policy":"[A-policy AP05] ประตูตามเวลาโจทย์ ไม่ใช่คำตอบเจ้าของงานจริง","contextOnly":["EXPLORATION.md","exploration/lab8/c1.md–c7.md"],"actionMappingOnly":"e2e/api.test.mjs, e2e/ui.spec.js, e2e/lab.spec.js; ไม่ใช้ assertion เป็น oracle"}

**เงื่อนไขก่อนเริ่ม:** โลกทดสอบใหม่; fan ซื้อ NEON สำเร็จด้วยข้อมูลผู้ซื้อ/ผู้ถือมาตรฐาน; บันทึก order/ticket/code/payment IDs; encore/EncoreDemo!26 เป็นเจ้าของ NEON, sky/SkyDemo!26 ต่างเจ้าของ

**ข้อมูลทดสอบ:** gateopen2026-12-12T09:00Z; codeถอดจากQRจริง

**ขั้นตอน:**
1. login gate เปิดตรวจบัตร กรอกcodeและยืนยัน
2. เก็บผลแรกพร้อมภาพ
3. ยืนยันcodeเดิมครั้งที่2และอ่านresultแบบเต็ม/สถานะตอบ

**ผลที่คาดหวัง:** ครั้งแรกsuccessมีHolder 1; ครั้งที่2เป็นปฏิเสธใช้แล้ว ไม่มีข้อความsuccessหรือสไตล์success และไม่ได้เพิ่มadmission; successcountรวม1

**จังหวะตรวจ:** ตรวจทันทีแต่ละครั้ง ไม่รวมข้อความครั้งแรกที่ค้างในDOM

**คืนสภาพ:** เก็บ request/response ที่ตัด cookie/token และภาพขั้นสำคัญ; ปิด context; reset/คืน clock เฉพาะฐานทดสอบที่ตนเป็นเจ้าของหลังจบ ห้ามแตะ4310

**ถ้ากฎผิด ควรต่างอย่างไร:** ห้ามassertเพียงมีคำว่าใช้บัตรแล้วเพราะข้อความsuccessก็อาจมีคำนั้น

## V3-U01 — Member เลขผิด→ถูก ซื้อ2ชื่อ retry และรับเมล

**ส่วนระบบ:** Full Member journey

**กฎที่อ้างอิง:** ["FR05","FR06","FR09","FR11","FR12","FR13","FR14","FR15","BR11","BR15","NFR01"]

**ระดับ:** P1

**เทคนิค:** ["End-to-end","State transition"]

**ที่มาของ oracle:** {"oracle":["REQUIREMENTS.md","TEST-DATA.md","USER-STORIES.md"],"policy":"ข้อกำหนด ENCORE; คงป้าย U/A ตามเอกสาร ไม่อ้างนโยบายผู้ให้บริการจริง","contextOnly":["EXPLORATION.md","exploration/lab8/c1.md–c7.md"],"actionMappingOnly":"e2e/api.test.mjs, e2e/ui.spec.js, e2e/lab.spec.js; ไม่ใช้ assertion เป็น oracle"}

**เงื่อนไขก่อนเริ่ม:** browsercontextใหม่ขนาด375×812; โลกทดสอบส่วนตัวเวลา03:00Z; ใช้บัญชีทดลองตามTEST-DATA; บันทึกภาพ/การคลิกและrequestIDs

**ข้อมูลทดสอบ:** Buyer Test / buyer@example.test / 0812345678; C01=Holder 1 / holder1@example.test / 0898765432; Regular1800 ไม่มีโค้ด; C02 Holder 2; 2Regularไม่มีโค้ด3664

**ขั้นตอน:**
1. login fan เลือกNEON/Member เข้าqueue
2. ส่งเลขWRONGตรวจerror/ยังไม่เห็นผัง แล้วENCORE-0001ต้องเข้าผังทันที
3. เลือกC01/C02 กรอกbuyer/holdersคนละชื่อ ตรวจsummary
4. จ่ายQRแล้วจำลองfailed ตรวจยังไม่มีticket/mail; retryด้วยpaymentIDใหม่และapprove
5. เปิดบัตรและอีเมลทดลองดาวน์โหลดEML

**ผลที่คาดหวัง:** เลขผิดไม่อ่านผัง; เลขถูกไม่มีsuccessinterstitial; ยอด3600+60+4=3664; failed0ticket/0mail; retry1order/2namedticket/1เมลถึงbuyerรวม2QR; 375pxไม่ล้น

**จังหวะตรวจ:** ตรวจsummaryหลังยืนยันhold/checkout ก่อนpay และนับหลังterminal

**คืนสภาพ:** เก็บ request/response ที่ตัด cookie/token และภาพขั้นสำคัญ; ปิด context; reset/คืน clock เฉพาะฐานทดสอบที่ตนเป็นเจ้าของหลังจบ ห้ามแตะ4310

**ถ้ากฎผิด ควรต่างอย่างไร:** ห้ามหยุดตรวจแค่หน้าsuccessโดยไม่เปิดบัตร/เมล

## V3-U05 — reload กู้ pending และsnapshotโดยไม่จ่ายซ้ำ

**ส่วนระบบ:** Recovery UI

**กฎที่อ้างอิง:** ["FR10","FR12","FR15","BR19","NFR01"]

**ระดับ:** P1

**เทคนิค:** ["Recovery","State transition"]

**ที่มาของ oracle:** {"oracle":["REQUIREMENTS.md","TEST-DATA.md","USER-STORIES.md"],"policy":"ข้อกำหนด ENCORE; คงป้าย U/A ตามเอกสาร ไม่อ้างนโยบายผู้ให้บริการจริง","contextOnly":["EXPLORATION.md","exploration/lab8/c1.md–c7.md"],"actionMappingOnly":"e2e/api.test.mjs, e2e/ui.spec.js, e2e/lab.spec.js; ไม่ใช้ assertion เป็น oracle"}

**เงื่อนไขก่อนเริ่ม:** browsercontextใหม่ขนาด375×812; โลกทดสอบส่วนตัวเวลา03:00Z; ใช้บัญชีทดลองตามTEST-DATA; บันทึกภาพ/การคลิกและrequestIDs

**ข้อมูลทดสอบ:** Buyer Test / buyer@example.test / 0812345678; C01=Holder 1 / holder1@example.test / 0898765432; Regular1800 ไม่มีโค้ด; method=alipay

**ขั้นตอน:**
1. fanเข้าคิวverify ถือC01 กรอกcontactครบ
2. เริ่มAlipaypending จดpaymentID/deadline
3. reload กดจองต่อ/ชำระเงิน ตรวจsummaryและpending
4. ลองแก้contactแล้วapprove เปิดบัตร/เมล

**ผลที่คาดหวัง:** ยังpaymentID/holder/amount1832/deadlineเดิม ไม่ยืด600s; pending0ticket/0mailและcontactแก้ไม่ได้; approve1ticketHolder 1/1mail snapshotเดิม

**จังหวะตรวจ:** ก่อนreload หลังresume และหลังsuccess

**คืนสภาพ:** เก็บ request/response ที่ตัด cookie/token และภาพขั้นสำคัญ; ปิด context; reset/คืน clock เฉพาะฐานทดสอบที่ตนเป็นเจ้าของหลังจบ ห้ามแตะ4310

**ถ้ากฎผิด ควรต่างอย่างไร:** ห้ามสร้างpaymentใหม่เพื่อให้หน้าดูเหมือนกู้สำเร็จ

## V3-U06 — คืนบางใบยังมีบัตรอีกใบและauditเงินถูก

**ส่วนระบบ:** Refund UI/audit

**กฎที่อ้างอิง:** ["FR13","FR17","BR08","NFR01"]

**ระดับ:** P1

**เทคนิค:** ["State transition","Money reconciliation"]

**ที่มาของ oracle:** {"oracle":["REQUIREMENTS.md","TEST-DATA.md","USER-STORIES.md"],"policy":"[A-policy AP01] นโยบายโจทย์ที่กำหนดก่อนทดสอบ ไม่ใช่คำตอบจากเจ้าของงานจริง","contextOnly":["EXPLORATION.md","exploration/lab8/c1.md–c7.md"],"actionMappingOnly":"e2e/api.test.mjs, e2e/ui.spec.js, e2e/lab.spec.js; ไม่ใช้ assertion เป็น oracle"}

**เงื่อนไขก่อนเริ่ม:** browsercontextใหม่ขนาด375×812; โลกทดสอบส่วนตัวเวลา03:00Z; ใช้บัญชีทดลองตามTEST-DATA; บันทึกภาพ/การคลิกและrequestIDs; fanซื้อC01,C02+STAGE10เสร็จ

**ข้อมูลทดสอบ:** ยอด3304; คืนC01net1620; C02Holder 2

**ขั้นตอน:**
1. fanเปิดบัตรของฉันเลือกคืนเฉพาะC01 ยืนยัน
2. ตรวจC01รอคืนไม่มีQRเข้าได้ แต่C02ยังมีQR/ชื่อ
3. ออกระบบเข้าencore เปิดจัดการNEON อนุมัติrefund
4. ตรวจdashboard/auditและกลับfanดูสองใบ

**ผลที่คาดหวัง:** pendingยังนับquota; approveแล้วC01refunded/C02valid; auditระบุaction/seat/amountที่ถูก; gross3304 refund1620 net1684; ไม่คืน3664/ไม่ทำC02หาย

**จังหวะตรวจ:** ภาพก่อนapprove/หลังapproveพร้อมเงินและseat

**คืนสภาพ:** เก็บ request/response ที่ตัด cookie/token และภาพขั้นสำคัญ; ปิด context; reset/คืน clock เฉพาะฐานทดสอบที่ตนเป็นเจ้าของหลังจบ ห้ามแตะ4310

**ถ้ากฎผิด ควรต่างอย่างไร:** ห้ามใช้กรณี1ใบพิสูจน์partialrefundสองใบ

## V3-U07 — ประตูรับ payload จากQRและคืนชื่อเพียงครั้งเดียว

**ส่วนระบบ:** Gate journey

**กฎที่อ้างอิง:** ["FR13","FR16","BR17","NFR04"]

**ระดับ:** P1

**เทคนิค:** ["End-to-end","Independent decoder"]

**ที่มาของ oracle:** {"oracle":["REQUIREMENTS.md","TEST-DATA.md","USER-STORIES.md"],"policy":"[A-policy AP05] เวลาประตูโจทย์ ไม่ใช่คำตอบเจ้าของงานจริง","contextOnly":["EXPLORATION.md","exploration/lab8/c1.md–c7.md"],"actionMappingOnly":"e2e/api.test.mjs, e2e/ui.spec.js, e2e/lab.spec.js; ไม่ใช้ assertion เป็น oracle"}

**เงื่อนไขก่อนเริ่ม:** browsercontextใหม่ขนาด375×812; โลกทดสอบส่วนตัวเวลา03:00Z; ใช้บัญชีทดลองตามTEST-DATA; บันทึกภาพ/การคลิกและrequestIDs; ซื้อC01และดาวน์โหลดQRเจ้าของแล้วตั้งเวลาgateopen

**ข้อมูลทดสอบ:** Holder 1; decoderอ่านPNGจริง

**ขั้นตอน:**
1. ถอดภาพticketQRอิสระเก็บpayload
2. login gate เปิดตรวจบัตรกรอกpayload
3. ยืนยันครั้งแรกแล้วซ้ำครั้งที่2
4. เก็บภาพเต็มผลทั้งสอง

**ผลที่คาดหวัง:** ครั้งแรกยืนยันเข้าได้/Holder 1; ครั้งที่2ปฏิเสธused; รวม1admission; ห้ามใช้ticketIDหรือemailแทนpayload

**จังหวะตรวจ:** ที่2026-12-12T09:00Z loginใหม่หลังเลื่อนclock

**คืนสภาพ:** เก็บ request/response ที่ตัด cookie/token และภาพขั้นสำคัญ; ปิด context; reset/คืน clock เฉพาะฐานทดสอบที่ตนเป็นเจ้าของหลังจบ ห้ามแตะ4310

**ถ้ากฎผิด ควรต่างอย่างไร:** ห้ามคัดcodeจากAPIอย่างเดียวแล้วอ้างว่าทดสอบQRจริง

## V3-U11 — ซื้อด้วยQRจนถึงอีเมลทดลอง

**ส่วนระบบ:** Payment UI QR

**กฎที่อ้างอิง:** ["FR09","FR10","FR11","FR12","FR13","FR14","FR15","BR12","BR13","BR14","BR18","NFR01"]

**ระดับ:** P1

**เทคนิค:** ["End-to-end","State transition"]

**ที่มาของ oracle:** {"oracle":["REQUIREMENTS.md","TEST-DATA.md","USER-STORIES.md"],"policy":"ข้อกำหนด ENCORE; คงป้าย U/A ตามเอกสาร ไม่อ้างนโยบายผู้ให้บริการจริง","contextOnly":["EXPLORATION.md","exploration/lab8/c1.md–c7.md"],"actionMappingOnly":"e2e/api.test.mjs, e2e/ui.spec.js, e2e/lab.spec.js; ไม่ใช้ assertion เป็น oracle"}

**เงื่อนไขก่อนเริ่ม:** browsercontextใหม่ขนาด375×812; โลกทดสอบส่วนตัวเวลา03:00Z; ใช้บัญชีทดลองตามTEST-DATA; บันทึกภาพ/การคลิกและrequestIDs

**ข้อมูลทดสอบ:** Buyer Test / buyer@example.test / 0812345678; C01=Holder 1 / holder1@example.test / 0898765432; Regular1800 ไม่มีโค้ด; qr

**ขั้นตอน:**
1. fanlogin/queue/verifyและเลือกC01
2. กรอกcontact ตรวจsummary เลือกQRและเริ่มpending; ถอดQRชำระตรวจENCORE-DEMO-PAY
3. เปิดบัตร/กล่องเมลก่อนapproveแล้วกลับชำระต่อ
4. จำลองapprove เปิดบัตรและอีเมลทดลอง/EML

**ผลที่คาดหวัง:** summary1832=1800+30+2; pending0ticket/0mail; deadlineตรงhold600s; success1ticket C01 Holder 1 พร้อมQR และ1mailถึงbuyer@example.test; UIระบุจำลอง/375pxไม่ล้น

**จังหวะตรวจ:** ตรวจจำนวนก่อนapproveและหลังticketcomplete; จับภาพinstruction/bัตร/mail

**คืนสภาพ:** เก็บ request/response ที่ตัด cookie/token และภาพขั้นสำคัญ; ปิด context; reset/คืน clock เฉพาะฐานทดสอบที่ตนเป็นเจ้าของหลังจบ ห้ามแตะ4310

**ถ้ากฎผิด ควรต่างอย่างไร:** ห้ามใช้ผลmethodอื่นแทนเส้นทางนี้ หรือถือว่ามีรูปQRเท่ากับชำระแล้ว

## V3-U12 — ซื้อด้วย7-Elevenจนถึงอีเมลทดลอง

**ส่วนระบบ:** Payment UI 7-Eleven

**กฎที่อ้างอิง:** ["FR09","FR10","FR11","FR12","FR13","FR14","FR15","BR12","BR13","BR14","BR18","NFR01"]

**ระดับ:** P1

**เทคนิค:** ["End-to-end","State transition"]

**ที่มาของ oracle:** {"oracle":["REQUIREMENTS.md","TEST-DATA.md","USER-STORIES.md"],"policy":"ข้อกำหนด ENCORE; คงป้าย U/A ตามเอกสาร ไม่อ้างนโยบายผู้ให้บริการจริง","contextOnly":["EXPLORATION.md","exploration/lab8/c1.md–c7.md"],"actionMappingOnly":"e2e/api.test.mjs, e2e/ui.spec.js, e2e/lab.spec.js; ไม่ใช้ assertion เป็น oracle"}

**เงื่อนไขก่อนเริ่ม:** browsercontextใหม่ขนาด375×812; โลกทดสอบส่วนตัวเวลา03:00Z; ใช้บัญชีทดลองตามTEST-DATA; บันทึกภาพ/การคลิกและrequestIDs

**ข้อมูลทดสอบ:** Buyer Test / buyer@example.test / 0812345678; C01=Holder 1 / holder1@example.test / 0898765432; Regular1800 ไม่มีโค้ด; seven_eleven

**ขั้นตอน:**
1. fanlogin/queue/verifyและเลือกC01
2. กรอกcontact ตรวจsummary เลือก7-Elevenและเริ่มpending; ตรวจreferenceทดลองและdeadline10นาทีไม่ใช่2ชม.
3. เปิดบัตร/กล่องเมลก่อนapproveแล้วกลับชำระต่อ
4. จำลองapprove เปิดบัตรและอีเมลทดลอง/EML

**ผลที่คาดหวัง:** summary1832=1800+30+2; pending0ticket/0mail; deadlineตรงhold600s; success1ticket C01 Holder 1 พร้อมQR และ1mailถึงbuyer@example.test; UIระบุจำลอง/375pxไม่ล้น

**จังหวะตรวจ:** ตรวจจำนวนก่อนapproveและหลังticketcomplete; จับภาพinstruction/bัตร/mail

**คืนสภาพ:** เก็บ request/response ที่ตัด cookie/token และภาพขั้นสำคัญ; ปิด context; reset/คืน clock เฉพาะฐานทดสอบที่ตนเป็นเจ้าของหลังจบ ห้ามแตะ4310

**ถ้ากฎผิด ควรต่างอย่างไร:** ห้ามใช้ผลmethodอื่นแทนเส้นทางนี้ หรือถือว่ามีรูปQRเท่ากับชำระแล้ว

## V3-U13 — ซื้อด้วยCredit Cardจนถึงอีเมลทดลอง

**ส่วนระบบ:** Payment UI Credit Card

**กฎที่อ้างอิง:** ["FR09","FR10","FR11","FR12","FR13","FR14","FR15","BR12","BR13","BR14","BR18","NFR01"]

**ระดับ:** P1

**เทคนิค:** ["End-to-end","State transition"]

**ที่มาของ oracle:** {"oracle":["REQUIREMENTS.md","TEST-DATA.md","USER-STORIES.md"],"policy":"ข้อกำหนด ENCORE; คงป้าย U/A ตามเอกสาร ไม่อ้างนโยบายผู้ให้บริการจริง","contextOnly":["EXPLORATION.md","exploration/lab8/c1.md–c7.md"],"actionMappingOnly":"e2e/api.test.mjs, e2e/ui.spec.js, e2e/lab.spec.js; ไม่ใช้ assertion เป็น oracle"}

**เงื่อนไขก่อนเริ่ม:** browsercontextใหม่ขนาด375×812; โลกทดสอบส่วนตัวเวลา03:00Z; ใช้บัญชีทดลองตามTEST-DATA; บันทึกภาพ/การคลิกและrequestIDs

**ข้อมูลทดสอบ:** Buyer Test / buyer@example.test / 0812345678; C01=Holder 1 / holder1@example.test / 0898765432; Regular1800 ไม่มีโค้ด; credit_card

**ขั้นตอน:**
1. fanlogin/queue/verifyและเลือกC01
2. กรอกcontact ตรวจsummary เลือกCredit Cardและเริ่มpending; ตรวจไม่ต้องกรอกข้อมูลบัตรจริง
3. เปิดบัตร/กล่องเมลก่อนapproveแล้วกลับชำระต่อ
4. จำลองapprove เปิดบัตรและอีเมลทดลอง/EML

**ผลที่คาดหวัง:** summary1832=1800+30+2; pending0ticket/0mail; deadlineตรงhold600s; success1ticket C01 Holder 1 พร้อมQR และ1mailถึงbuyer@example.test; UIระบุจำลอง/375pxไม่ล้น

**จังหวะตรวจ:** ตรวจจำนวนก่อนapproveและหลังticketcomplete; จับภาพinstruction/bัตร/mail

**คืนสภาพ:** เก็บ request/response ที่ตัด cookie/token และภาพขั้นสำคัญ; ปิด context; reset/คืน clock เฉพาะฐานทดสอบที่ตนเป็นเจ้าของหลังจบ ห้ามแตะ4310

**ถ้ากฎผิด ควรต่างอย่างไร:** ห้ามใช้ผลmethodอื่นแทนเส้นทางนี้ หรือถือว่ามีรูปQRเท่ากับชำระแล้ว

## V3-U14 — ซื้อด้วยAlipayจนถึงอีเมลทดลอง

**ส่วนระบบ:** Payment UI Alipay

**กฎที่อ้างอิง:** ["FR09","FR10","FR11","FR12","FR13","FR14","FR15","BR12","BR13","BR14","BR18","NFR01"]

**ระดับ:** P1

**เทคนิค:** ["End-to-end","State transition"]

**ที่มาของ oracle:** {"oracle":["REQUIREMENTS.md","TEST-DATA.md","USER-STORIES.md"],"policy":"ข้อกำหนด ENCORE; คงป้าย U/A ตามเอกสาร ไม่อ้างนโยบายผู้ให้บริการจริง","contextOnly":["EXPLORATION.md","exploration/lab8/c1.md–c7.md"],"actionMappingOnly":"e2e/api.test.mjs, e2e/ui.spec.js, e2e/lab.spec.js; ไม่ใช้ assertion เป็น oracle"}

**เงื่อนไขก่อนเริ่ม:** browsercontextใหม่ขนาด375×812; โลกทดสอบส่วนตัวเวลา03:00Z; ใช้บัญชีทดลองตามTEST-DATA; บันทึกภาพ/การคลิกและrequestIDs

**ข้อมูลทดสอบ:** Buyer Test / buyer@example.test / 0812345678; C01=Holder 1 / holder1@example.test / 0898765432; Regular1800 ไม่มีโค้ด; alipay

**ขั้นตอน:**
1. fanlogin/queue/verifyและเลือกC01
2. กรอกcontact ตรวจsummary เลือกAlipayและเริ่มpending; อ่านinstructionAlipayและreferenceจำลอง
3. เปิดบัตร/กล่องเมลก่อนapproveแล้วกลับชำระต่อ
4. จำลองapprove เปิดบัตรและอีเมลทดลอง/EML

**ผลที่คาดหวัง:** summary1832=1800+30+2; pending0ticket/0mail; deadlineตรงhold600s; success1ticket C01 Holder 1 พร้อมQR และ1mailถึงbuyer@example.test; UIระบุจำลอง/375pxไม่ล้น

**จังหวะตรวจ:** ตรวจจำนวนก่อนapproveและหลังticketcomplete; จับภาพinstruction/bัตร/mail

**คืนสภาพ:** เก็บ request/response ที่ตัด cookie/token และภาพขั้นสำคัญ; ปิด context; reset/คืน clock เฉพาะฐานทดสอบที่ตนเป็นเจ้าของหลังจบ ห้ามแตะ4310

**ถ้ากฎผิด ควรต่างอย่างไร:** ห้ามใช้ผลmethodอื่นแทนเส้นทางนี้ หรือถือว่ามีรูปQRเท่ากับชำระแล้ว

## V3-U21 — ปฏิเสธrefund แล้วผู้ซื้อเห็นบัตรvalid/QRกลับมา

**ส่วนระบบ:** Rejected refund UI

**กฎที่อ้างอิง:** ["FR13","FR17","BR08","NFR01"]

**ระดับ:** P1

**เทคนิค:** ["State transition"]

**ที่มาของ oracle:** {"oracle":["REQUIREMENTS.md","TEST-DATA.md","USER-STORIES.md"],"policy":"[A-policy AP02] rejectคืนvalidตามโจทย์ ไม่ใช่คำตอบเจ้าของงานจริง","contextOnly":["EXPLORATION.md","exploration/lab8/c1.md–c7.md"],"actionMappingOnly":"e2e/api.test.mjs, e2e/ui.spec.js, e2e/lab.spec.js; ไม่ใช้ assertion เป็น oracle"}

**เงื่อนไขก่อนเริ่ม:** browsercontextใหม่ขนาด375×812; โลกทดสอบส่วนตัวเวลา03:00Z; ใช้บัญชีทดลองตามTEST-DATA; บันทึกภาพ/การคลิกและrequestIDs; fanซื้อC01สำเร็จ

**ข้อมูลทดสอบ:** Buyer Test / buyer@example.test / 0812345678; C01=Holder 1 / holder1@example.test / 0898765432; Regular1800 ไม่มีโค้ด

**ขั้นตอน:**
1. fanขอคืนC01และดูรอคืน
2. encoreเปิดจัดการNEONเลือกไม่อนุมัติ
3. fanloginใหม่เปิดบัตร/อ่านสถานะและQR
4. โหลดซ้ำตรวจไม่ย้อนกลับpending

**ผลที่คาดหวัง:** rejectทำvalid/QRกลับมา/ข้อความอ่านเข้าใจ; refunded0, net1832; ไม่มีrefundเงินหรือticket/mailซื้อเพิ่ม; โหลดใหม่คงvalid

**จังหวะตรวจ:** ตรวจหลังrejectด้วยsessionผู้ซื้อใหม่และreload

**คืนสภาพ:** เก็บ request/response ที่ตัด cookie/token และภาพขั้นสำคัญ; ปิด context; reset/คืน clock เฉพาะฐานทดสอบที่ตนเป็นเจ้าของหลังจบ ห้ามแตะ4310

**ถ้ากฎผิด ควรต่างอย่างไร:** ห้ามใช้แค่ข้อความผู้จัดว่าrejectสำเร็จโดยไม่กลับไปตรวจผู้ซื้อ

## V3-U23 — markup ผู้ถือเป็นข้อความบนบัตรและเมล

**ส่วนระบบ:** Escaping UI

**กฎที่อ้างอิง:** ["FR09","FR13","FR14","FR15","NFR02"]

**ระดับ:** P1

**เทคนิค:** ["Injection","Rendering"]

**ที่มาของ oracle:** {"oracle":["REQUIREMENTS.md","TEST-DATA.md","USER-STORIES.md"],"policy":"ข้อกำหนด ENCORE; คงป้าย U/A ตามเอกสาร ไม่อ้างนโยบายผู้ให้บริการจริง","contextOnly":["EXPLORATION.md","exploration/lab8/c1.md–c7.md"],"actionMappingOnly":"e2e/api.test.mjs, e2e/ui.spec.js, e2e/lab.spec.js; ไม่ใช้ assertion เป็น oracle"}

**เงื่อนไขก่อนเริ่ม:** browsercontextใหม่ขนาด375×812; โลกทดสอบส่วนตัวเวลา03:00Z; ใช้บัญชีทดลองตามTEST-DATA; บันทึกภาพ/การคลิกและrequestIDs

**ข้อมูลทดสอบ:** holder=<img src=x onerror=alert(1)> Test; buyer Buyer Test; C01

**ขั้นตอน:**
1. fanเลือกC01และกรอกholdermarkupพร้อมemail/phoneถูก
2. จ่ายสำเร็จ
3. เปิดบัตรและsandboxmailพร้อมจับdialog/eventerror
4. reloadและอ่านชื่อ/DOMซ้ำ

**ผลที่คาดหวัง:** 1ticket/1mail1832; แสดงชื่อliteralครบ ไม่มีscript/dialogหรือimgonerrorจากชื่อ; mailescapeไม่ทำlayoutเสีย; QRpayloadไม่มีmarkup/PII

**จังหวะตรวจ:** ตรวจขณะเปิดครั้งแรกและreloadทั้งticket/mail

**คืนสภาพ:** เก็บ request/response ที่ตัด cookie/token และภาพขั้นสำคัญ; ปิด context; reset/คืน clock เฉพาะฐานทดสอบที่ตนเป็นเจ้าของหลังจบ ห้ามแตะ4310

**ถ้ากฎผิด ควรต่างอย่างไร:** ห้ามทดสอบผ่านAPIJSONเท่านั้นแล้วสรุปว่าrenderปลอดภัย

## V3-U24 — General ซื้อจนรับบัตร/เมลโดยไม่กรอกสมาชิก

**ส่วนระบบ:** Full General journey

**กฎที่อ้างอิง:** ["FR02","FR03","FR06","FR09","FR11","FR13","FR14","FR15","BR11","NFR01"]

**ระดับ:** P1

**เทคนิค:** ["End-to-end","Role partition"]

**ที่มาของ oracle:** {"oracle":["REQUIREMENTS.md","TEST-DATA.md","USER-STORIES.md"],"policy":"ข้อกำหนด ENCORE; คงป้าย U/A ตามเอกสาร ไม่อ้างนโยบายผู้ให้บริการจริง","contextOnly":["EXPLORATION.md","exploration/lab8/c1.md–c7.md"],"actionMappingOnly":"e2e/api.test.mjs, e2e/ui.spec.js, e2e/lab.spec.js; ไม่ใช้ assertion เป็น oracle"}

**เงื่อนไขก่อนเริ่ม:** browsercontextใหม่ขนาด375×812; โลกทดสอบส่วนตัวเวลา03:00Z; ใช้บัญชีทดลองตามTEST-DATA; บันทึกภาพ/การคลิกและrequestIDs

**ข้อมูลทดสอบ:** general/GeneralDemo!26; AURORA General เปิดตอน03:00Z; C01 Holder 1; buyer@example.test

**ขั้นตอน:**
1. เลือกGeneralทดลองlogin ดูAURORA/General
2. เข้าqueueจนactiveตรวจไม่มีmembershipinput
3. เลือกC01กรอกbuyerและholder ตรวจsummary1832
4. จ่ายQRapprove เปิดnamedticketและmail/EML

**ผลที่คาดหวัง:** ไม่ต้องเลขmembership; 1order/1ticket C01 Holder 1/1mailถึงbuyer; QRถอดได้; summary1800+30+2=1832; ทุกขั้น375pxไม่ล้น

**จังหวะตรวจ:** ตรวจไม่มีmembershipก่อนผัง และบัตร/เมลหลังชำระ

**คืนสภาพ:** เก็บ request/response ที่ตัด cookie/token และภาพขั้นสำคัญ; ปิด context; reset/คืน clock เฉพาะฐานทดสอบที่ตนเป็นเจ้าของหลังจบ ห้ามแตะ4310

**ถ้ากฎผิด ควรต่างอย่างไร:** ห้ามใช้fanซื้อGeneralแทนบัญชีGeneralจริง

## เช็กลิสต์
- ข้อมูลและexpectedจากD/A-policy/A-testที่ระบุ ไม่ลอกO
- ทุกnegativeมีpositivecontrolที่เกี่ยวข้อง
- ตรวจตามจังหวะ ไม่ให้gateอื่นบังผล
- resetเฉพาะworker/DBตน
- ไม่แก้expectedหลังรอบฝังบั๊ก

## 6. เกณฑ์เริ่มและเกณฑ์ผ่าน
เริ่มเมื่อDockerทดสอบhealthy/healthbugMode0 และworkerสร้างserver+DBของตนได้;ทุกกรณีresetและclockของตนเท่านั้น ไม่แตะ4310; P1ต้องผ่านทั้งหมดและรวม>=95% คืออย่างน้อย85จาก89ข้อ; รายงานแยกChromium ไม่อ้างว่าSafari/Firefoxผ่าน รอบฝังบั๊กเป็นnegative experimentไม่รวมในnormalpassrate

## 7. ข้อมูล การเก็บหลักฐาน และทำซ้ำ
seed/เวลา/สูตรตามTEST-DATA; API4311, tempmigration/scope4314, UIworker4600+workerIndex; รอบbug4800+workerIndex; processesแยกSQLite:memory ไม่แชร์reset. คำสั่ง npm run lab:normal และ npm run lab:bug แล้ว npm run lab:report; freezeTESTPLAN/ข้อมูล/testsด้วยSHA256ก่อนbug. ภาพ/GIFจากvideoจริงอยู่e2e/report-normalและreport-bug และe2e/index.html

## 8. คุณภาพแผนและสิ่งที่ยังไม่ยืนยัน
| หากเว็บผิดแบบนี้ | testที่ต้องล้ม | เหตุผลและค่าที่แยกได้ |
|---|---|---|
| เพดานส่วนลดหาย | A17/L01 |6400ลด640แทน500:5824ต่าง5964 ตรวจหลังholdไม่ใช่แค่localquote|
| Memberเลือกใบที่3ได้ | A14/A15/U03/L02 |2ที่นั่งเดิมกับ3แยกชัด ไม่ใช้Generalเป็นcontrol|
| scanไม่เปลี่ยนสถานะ | A36/U07/L03 |รอบ2ต้องปฏิเสธข้อความตรง ไม่จับsubstringที่successก็มี|
| เปิดห้องรอก่อนเวลา | A11 |09:44:59.999ต่าง09:45:00|
| ใช้floorคำนวณETA | A12 |ahead3ต้อง240 ไม่ใช่120|
| ปิดMemberช้า | A13/U10 |ตรง15:00Memberหมดสิทธิ์ Generalเริ่ม|
| grantข้ามaccount/event | A10 |activeทั้งสองscope;verifyเฉพาะหนึ่ง ก่อน/หลังตรวจอีกscope|
| loginผิด4ครั้งก็ล็อก | A03 |แขนงสี่ผิด+รหัสถูกต้องได้200 แยกจากห้าผิดล็อก|
| pendingออกticket/mail | A22–25 |ต้องไม่มีทั้งคู่ก่อนresolve|
| callbackซ้ำออกorderซ้ำ | A27 |สองคำขอ orderเดียว/mailเดียว ตรวจจำนวนจริง|
| ให้เงินมาช้ากลับมายึดที่ | A30 |แยกcomponentเดิมยังถือที่กับpublicresale ไม่ใช้gateอื่นบัง|
| ผู้จัดเห็น/แก้งานคนอื่น | A45/A58 |foreignorganizer403 และbefore/afterstateไม่เปลี่ยน|
| ข้อมูลHTMLกลายเป็นคำสั่ง | A55/U23 |แสดงliteralไม่มีimgที่inject/ไม่มีdialog|

คำถามอนาคต: AP01–05ต้องให้ธุรกิจยืนยันก่อนขายจริง;โควตาคงเหลือก่อนเลือกเป็นข้อเสนอUX;ผู้ให้บริการจริง/โหลดสูง/กล้อง/WCAGครบ/ทุกUnicode/diskfailureยังอยู่นอกขอบเขต ไม่อ้างผ่าน ไม่มีการถามผู้ใช้ซ้ำสำหรับสมมติฐานmockที่ประกาศไว้

### Traceability ครบ45ข้อกำหนด
|FR/BR/NFR|Tests|
|---|---|
|V3-BR01|V3-A01, V3-A60|
|V3-BR02|V3-A04|
|V3-BR03|V3-A04, V3-A13, V3-A44, V3-A56, V3-U02, V3-U10, V3-A43|
|V3-BR04|V3-A11, V3-A56, V3-A57|
|V3-BR05|V3-A05, V3-A06, V3-A44, V3-U02|
|V3-BR06|V3-A10, V3-A11, V3-A12, V3-A59, V3-U04|
|V3-BR07|V3-A07, V3-A08, V3-A09, V3-A10, V3-A59|
|V3-BR08|V3-A14, V3-A15, V3-A43, V3-A47, V3-L02, V3-U03, V3-A35, V3-A37, V3-A48, V3-U06, V3-U21|
|V3-BR09|V3-A13, V3-A56, V3-U10, V3-A18, V3-A46, V3-A47, V3-U09, V3-U18, V3-U20, V3-A28|
|V3-BR10|V3-A20, V3-A54, V3-U03|
|V3-BR11|V3-A19, V3-A20, V3-A54, V3-A34, V3-U01, V3-U24|
|V3-BR12|V3-A17, V3-L01, V3-U18, V3-A22, V3-A23, V3-A24, V3-A25, V3-A26, V3-U11, V3-U12, V3-U13, V3-U14|
|V3-BR13|V3-A17, V3-A47, V3-U03, V3-A22, V3-A23, V3-A24, V3-A25, V3-A26, V3-A31, V3-U11, V3-U12, V3-U13, V3-U14|
|V3-BR14|V3-A22, V3-A23, V3-A24, V3-A25, V3-U11, V3-U12, V3-U13, V3-U14|
|V3-BR15|V3-A27, V3-U01|
|V3-BR16|V3-A28, V3-A29, V3-A30, V3-A31, V3-A50|
|V3-BR17|V3-A32, V3-A33, V3-A36, V3-A51, V3-A58, V3-A61, V3-L03, V3-U07|
|V3-BR18|V3-A22, V3-A23, V3-A24, V3-A25, V3-A33, V3-A34, V3-U11, V3-U12, V3-U13, V3-U14|
|V3-BR19|V3-A21, V3-A54, V3-U20, V3-U05|
|V3-BR20|V3-A03, V3-A13, V3-U10, V3-A52, V3-A57, V3-U22, V3-A38, V3-A49, V3-A51, V3-A61|
|V3-FR01|V3-A01, V3-A02, V3-A45, V3-A60, V3-U02, V3-U15, V3-U16|
|V3-FR02|V3-A04, V3-A13, V3-A44, V3-A56, V3-U02, V3-U10, V3-U15, V3-A57, V3-U08, V3-U17, V3-U25, V3-U24|
|V3-FR03|V3-A05, V3-A06, V3-A13, V3-A44, V3-A56, V3-U02, V3-U24|
|V3-FR04|V3-A11, V3-A12, V3-A56, V3-A59, V3-U04, V3-A57|
|V3-FR05|V3-A05, V3-A08, V3-A09, V3-A10, V3-A59, V3-U04, V3-U19, V3-U01|
|V3-FR06|V3-A06, V3-A07, V3-A09, V3-A10, V3-U02, V3-U01, V3-U24|
|V3-FR07|V3-A04, V3-A15, V3-A16, V3-A46, V3-A52, V3-A57, V3-L02, V3-U03, V3-U08, V3-U09, V3-U17, V3-U18, V3-U22|
|V3-FR08|V3-A14, V3-A15, V3-A43, V3-A47, V3-L02, V3-U03|
|V3-FR09|V3-A19, V3-A20, V3-A54, V3-U03, V3-U08, V3-U20, V3-A34, V3-A55, V3-U01, V3-U11, V3-U12, V3-U13, V3-U14, V3-U23, V3-U24|
|V3-FR10|V3-U10, V3-A17, V3-A18, V3-A21, V3-A46, V3-A47, V3-A54, V3-L01, V3-U03, V3-U09, V3-U18, V3-U20, V3-U05, V3-U11, V3-U12, V3-U13, V3-U14|
|V3-FR11|V3-U03, V3-A22, V3-A23, V3-A24, V3-A25, V3-A26, V3-U01, V3-U11, V3-U12, V3-U13, V3-U14, V3-U24|
|V3-FR12|V3-A47, V3-A22, V3-A23, V3-A24, V3-A25, V3-A27, V3-A28, V3-A29, V3-A30, V3-A31, V3-A49, V3-A50, V3-A58, V3-U01, V3-U05, V3-U11, V3-U12, V3-U13, V3-U14|
|V3-FR13|V3-A22, V3-A23, V3-A24, V3-A25, V3-A32, V3-A33, V3-A34, V3-A55, V3-U01, V3-U06, V3-U07, V3-U11, V3-U12, V3-U13, V3-U14, V3-U21, V3-U23, V3-U24|
|V3-FR14|V3-A22, V3-A23, V3-A24, V3-A25, V3-A33, V3-A34, V3-A55, V3-U01, V3-U11, V3-U12, V3-U13, V3-U14, V3-U23, V3-U24|
|V3-FR15|V3-A45, V3-U16, V3-A21, V3-U20, V3-A27, V3-A33, V3-A50, V3-A55, V3-A58, V3-U01, V3-U05, V3-U11, V3-U12, V3-U13, V3-U14, V3-U23, V3-U24|
|V3-FR16|V3-A45, V3-A36, V3-A37, V3-A51, V3-A61, V3-L03, V3-U07|
|V3-FR17|V3-A02, V3-A03, V3-A45, V3-U16, V3-A18, V3-A46, V3-A52, V3-A57, V3-U09, V3-U18, V3-U22, V3-A35, V3-A37, V3-A38, V3-A39, V3-A41, V3-A42, V3-A48, V3-A49, V3-A50, V3-A58, V3-A61, V3-U06, V3-U21|
|V3-FR18|V3-A40, V3-A41, V3-A42, V3-A53|
|V3-NFR01|V3-U02, V3-U15, V3-U19, V3-L02, V3-U03, V3-U08, V3-U09, V3-U17, V3-U18, V3-U22, V3-U25, V3-L03, V3-U01, V3-U05, V3-U06, V3-U11, V3-U12, V3-U13, V3-U14, V3-U21, V3-U24|
|V3-NFR02|V3-A01, V3-A02, V3-A45, V3-A60, V3-U16, V3-U19, V3-A19, V3-U22, V3-A33, V3-A40, V3-A53, V3-A55, V3-A58, V3-U23|
|V3-NFR03|V3-A14, V3-A15, V3-A16, V3-A46, V3-A52, V3-L01, V3-U09, V3-A27, V3-A30, V3-A36, V3-A39, V3-A48, V3-A50|
|V3-NFR04|V3-A32, V3-U07|
|V3-NFR05|V3-A41, V3-A42|
|V3-NFR06|V3-U04|
|V3-NFR07|V3-U03, V3-A40|
