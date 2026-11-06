import {test,expect} from '@playwright/test';
test.beforeEach(async({request})=>{await request.post('/api/test/reset',{headers:{'x-test-token':'encore-e2e'},data:{}});});
test('TC-19 desktop booking, failed payment, retry, ticket persists',async({page})=>{
await page.goto('/');await expect(page.getByTestId('event-neon')).toBeVisible();await page.screenshot({path:'exploration/desktop.png',fullPage:true});
await page.getByTestId('event-neon').getByRole('button',{name:'จองบัตร'}).click();
await page.getByRole('button',{name:/ที่นั่ง C01 /}).click();await expect(page.getByTestId('total')).toHaveText('฿1,832');
await page.getByRole('textbox',{name:'โค้ดส่วนลด'}).fill('STAGE10');await expect(page.getByTestId('total')).toHaveText('฿1,652');
await page.getByRole('button',{name:'ยืนยันที่นั่ง'}).click();await page.getByLabel('อีเมลสำหรับรับบัตร').fill('music@example.com');
await page.getByRole('button',{name:'ทดลองชำระไม่สำเร็จ'}).click();await expect(page.getByRole('alert')).toContainText('ชำระเงินไม่สำเร็จ');
await page.getByRole('button',{name:/ชำระเงินจำลอง/}).click();await expect(page.getByRole('heading',{name:'เจอกันหน้าเวที!'})).toBeVisible();
await page.getByRole('button',{name:'ดูบัตรของฉัน'}).click();await expect(page.locator('.ticket')).toContainText('C01');await expect(page.locator('.ticket')).toContainText('฿1,652');await page.screenshot({path:'exploration/ticket.png'});
await page.reload();await page.getByRole('button',{name:'บัตรของฉัน'}).click();await expect(page.locator('.ticket')).toHaveCount(1);
});
test('TC-20 mobile 375px, search, filters, four-seat cap, no overflow',async({page})=>{
await page.setViewportSize({width:375,height:812});await page.goto('/');await expect(page.locator('.event-card')).toHaveCount(3);
await page.screenshot({path:'exploration/mobile.png',fullPage:true});
expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
await page.getByRole('searchbox').fill('luna');await expect(page.locator('.event-card')).toHaveCount(1);await page.getByRole('searchbox').fill('no-match');await expect(page.locator('#events')).toContainText('ไม่พบคอนเสิร์ต');await page.getByRole('searchbox').fill('');
await page.locator('[data-filter="upcoming"]').click();await expect(page.locator('.event-card')).toHaveCount(1);await page.getByRole('button',{name:'ทั้งหมด',exact:true}).click();
await page.getByTestId('event-neon').getByRole('button',{name:'จองบัตร'}).click();for(const s of ['A01','A02','A05','A06','A07'])await page.getByRole('button',{name:new RegExp(`ที่นั่ง ${s} `)}).click();await expect(page.locator('.seat.selected')).toHaveCount(4);await expect(page.getByRole('status')).toContainText('สูงสุด 4');
await page.screenshot({path:'exploration/mobile-booking.png'});expect(await page.locator('#booking').evaluate(e=>e.scrollWidth<=e.clientWidth)).toBe(true);
});
test('TC-21 keyboard modal, escape releases held seats',async({page,request})=>{
await page.goto('/');await page.getByTestId('event-neon').getByRole('button',{name:'จองบัตร'}).click();await page.getByRole('button',{name:/ที่นั่ง A01 /}).focus();await page.keyboard.press('Space');await expect(page.locator('[data-seat="A01"]')).toHaveAttribute('aria-pressed','true');await page.getByRole('button',{name:'ยืนยันที่นั่ง'}).click();await expect(page.getByLabel('อีเมลสำหรับรับบัตร')).toBeVisible();await page.keyboard.press('Escape');await expect(page.locator('#booking')).not.toBeVisible();const d=await (await request.get('/api/seats?event=neon')).json();expect(d.seats.find(s=>s.id==='A01').status).toBe('available');
});
test('TC-22 timeout exact boundary disables pay and allows reselection',async({page,request})=>{
await page.goto('/');await page.getByTestId('event-neon').getByRole('button',{name:'จองบัตร'}).click();await page.getByRole('button',{name:/ที่นั่ง A01 /}).click();await page.getByRole('button',{name:'ยืนยันที่นั่ง'}).click();await request.post('/api/test/clock',{headers:{'x-test-token':'encore-e2e'},data:{now:'2026-11-06T03:10:00Z'}});await page.getByLabel('อีเมลสำหรับรับบัตร').fill('fan@example.com');await page.getByRole('button',{name:/ชำระเงินจำลอง/}).click();await expect(page.getByRole('alert')).toContainText('หมดเวลาจอง');await expect(page.getByRole('button',{name:/ชำระเงินจำลอง/})).toBeDisabled();await page.getByRole('button',{name:'กลับไปเลือกที่นั่ง'}).click();await expect(page.getByRole('button',{name:/ที่นั่ง A01 /})).toBeEnabled();
});

test('TC-23 closing while reservation is in flight releases late hold',async({page,request})=>{
let unlock,ready;const gate=new Promise(r=>unlock=r),received=new Promise(r=>ready=r);
await page.route('**/api/holds',async route=>{const response=await route.fetch();ready();await gate;await route.fulfill({response});});
await page.goto('/');await page.getByTestId('event-neon').getByRole('button',{name:'จองบัตร'}).click();await page.getByRole('button',{name:/ที่นั่ง A01 /}).click();await page.getByRole('button',{name:'ยืนยันที่นั่ง'}).click();await received;await page.keyboard.press('Escape');await expect(page.locator('#booking')).not.toBeVisible();unlock();
await expect.poll(async()=>{const d=await(await request.get('/api/seats?event=neon')).json();return d.seats.find(s=>s.id==='A01').status;}).toBe('available');
});
