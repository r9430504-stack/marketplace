import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const p = await b.newPage({ viewport: { width: 1100, height: 1000 } });
await p.addInitScript(() => { try { localStorage.setItem('welcome-seen','1'); } catch {} });
await p.goto('http://localhost:3232/phones', { waitUntil: 'domcontentloaded' });
await p.waitForTimeout(2000);
// dismiss any overlay just in case
await p.mouse.click(10, 10).catch(()=>{});
await p.waitForTimeout(300);
const card = p.locator('a.group').nth(1);
await card.scrollIntoViewIfNeeded();
await p.waitForTimeout(400);
await p.screenshot({ path: 'rest.png' });
await card.hover({ force: true });
await p.waitForTimeout(900);
await p.screenshot({ path: 'hover.png' });
console.log('shots done');
await b.close();
