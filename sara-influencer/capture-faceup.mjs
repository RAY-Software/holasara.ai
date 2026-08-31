#!/usr/bin/env node
// Captura faceup.rayapp.ai en vista mobile (para el reel 9:16).
import puppeteer from 'puppeteer';

const PAGE_URL = 'https://faceup.rayapp.ai/';
const OUT = process.env.HOME + '/Desktop/sara-persona/set/';

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1');
await page.setViewport({ width: 393, height: 852, deviceScaleFactor: 2.75, isMobile: true, hasTouch: true });
await page.goto(PAGE_URL, { waitUntil: 'networkidle2', timeout: 60000 });
await new Promise((r) => setTimeout(r, 2500)); // que asiente el hero + widget

// hero (viewport)
await page.screenshot({ path: OUT + 'faceup-hero.png' });
console.log('OK hero');

// full page (tall) para scroll
await page.screenshot({ path: OUT + 'faceup-full.png', fullPage: true });
console.log('OK full');

// intentar abrir el widget de Sara (launcher flotante abajo-derecha)
try {
  const vp = page.viewport();
  await page.mouse.click(vp.width - 34, vp.height - 34);
  await new Promise((r) => setTimeout(r, 2500));
  await page.screenshot({ path: OUT + 'faceup-chat.png' });
  console.log('OK chat');
} catch (e) { console.log('chat skip:', e.message); }

await browser.close();
console.log('done');
