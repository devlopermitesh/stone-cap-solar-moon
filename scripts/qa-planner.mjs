#!/usr/bin/env node
// QA drill: open CareersHub, click into the Day Planner, assert it renders.
import { mkdirSync } from "node:fs";
import { chromium } from "playwright";

const base = process.argv[2] || "http://127.0.0.1:8080/";
const outDir = process.argv[3] || "screenshots/planner-ui";
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });

async function drill(name, viewport) {
  const page = await browser.newPage({ viewport });
  const errs = { console: [], page: [] };
  page.on("console", (m) => m.type() === "error" && errs.console.push(m.text()));
  page.on("pageerror", (e) => errs.page.push(String(e?.message || e)));

  await page.goto(base, { waitUntil: "domcontentloaded" });
  // Let React (dev fast, prod ~7s due to async hydrateRoot) actually attach
  // before interacting — the loaded page is SSR-inert until then.
  await page.waitForFunction(
    () => {
      const btn = [...document.querySelectorAll("button")].find((x) =>
        (x.textContent || "").includes("Day Planner"),
      );
      return btn != null && Object.keys(btn).some((k) => k.startsWith("__react"));
    },
    { timeout: 30000 },
  ).catch(() => {});

  const card = page.getByRole("button", { name: /Day Planner|day planner/i }).first();
  const cardVisible = await card.isVisible().catch(() => false);
  if (!cardVisible) return { name, ok: false, reason: "planner card not visible", errs, body: (await page.locator("body").innerText()).slice(0, 200) };

  await card.click();
  await page.waitForTimeout(2500); // allow plannerDefaults server fn + first paint

  const body = (await page.locator("body").innerText()).replace(/\s+/g, " ").trim();
  const hasPlannerMarkers = /next|planner|plan|today/i.test(body);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);

  await page.screenshot({ path: `${outDir}/${name}.png`, fullPage: false });
  await page.close();

  return { name, ok: hasPlannerMarkers && !overflow && errs.console.length === 0 && errs.page.length === 0, hasPlannerMarkers, overflow, errs, bodyLen: body.length, body: body.slice(0, 220) };
}

const desktop = await drill("desktop", { width: 1280, height: 800 });
const mobile = await drill("mobile", { width: 390, height: 844 });

console.log(JSON.stringify({ desktop, mobile }, null, 2));
await browser.close();
process.exit(desktop.ok && mobile.ok ? 0 : 1);