import { chromium } from "playwright";

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));

await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.screenshot({ path: "/tmp/screenshots/01-start-desktop.png", fullPage: true });
console.log("1. Start screen (desktop) ✓");

const shortBtn = page.locator("button", { hasText: "Short answers · 10 questions" });
await shortBtn.click();
await page.waitForTimeout(500);
await page.screenshot({ path: "/tmp/screenshots/02-short-q1.png", fullPage: true });
console.log("2. Short answer Q1 ✓");

const showBtn = page.locator("button", { hasText: "Show answer" });
await showBtn.click();
await page.waitForTimeout(500);
await page.screenshot({ path: "/tmp/screenshots/03-short-q1-revealed.png", fullPage: true });
console.log("3. Short answer Q1 revealed ✓");

const nextBtn = page.locator("button", { hasText: "Next question" });
await nextBtn.click();
await page.waitForTimeout(300);
await page.screenshot({ path: "/tmp/screenshots/04-short-q2.png", fullPage: true });
console.log("4. Short answer Q2 ✓");

for (let i = 0; i < 9; i++) {
  const show = page.locator("button", { hasText: "Show answer" });
  if (await show.isVisible().catch(() => false)) {
    await show.click();
    await page.waitForTimeout(200);
  }
  const next = page.locator("button", { hasText: /Next question|Finish/ });
  if (await next.isVisible().catch(() => false)) {
    await next.click();
    await page.waitForTimeout(200);
  }
}
await page.waitForTimeout(500);
await page.screenshot({ path: "/tmp/screenshots/05-back-to-start.png", fullPage: true });
console.log("5. Back to start ✓");

const dsaBtn = page.locator("button", { hasText: "DSA Practice · 50 problems" });
await dsaBtn.click();
await page.waitForTimeout(500);
await page.screenshot({ path: "/tmp/screenshots/06-dsa-levels.png", fullPage: true });
console.log("6. DSA level picker ✓");

const level1 = page.locator("button", { hasText: "Very Easy" }).first();
await level1.click();
await page.waitForTimeout(500);
await page.screenshot({ path: "/tmp/screenshots/07-dsa-level1.png", fullPage: true });
console.log("7. DSA Level 1 ✓");

const firstProblem = page.locator("button").filter({ hasText: "Write a function that takes an array" }).first();
await firstProblem.click();
await page.waitForTimeout(500);
await page.screenshot({ path: "/tmp/screenshots/08-dsa-expanded.png", fullPage: true });
console.log("8. DSA problem expanded ✓");

await page.setViewportSize({ width: 390, height: 844 });
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.screenshot({ path: "/tmp/screenshots/09-start-mobile.png", fullPage: true });
console.log("9. Start screen (mobile) ✓");

if (errors.length > 0) console.log("Console errors:", errors);
else console.log("\nNo console errors ✓");

await browser.close();
