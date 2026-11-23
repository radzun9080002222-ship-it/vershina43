import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { runInNewContext } from "node:vm";

const page = readFileSync("dist/sertifikat/index.html", "utf8");
const home = readFileSync("dist/index.html", "utf8");
assert.match(page, /<h1[^>]*>Подарите чистый дом<\/h1>/);
assert.equal([...page.matchAll(/rel="canonical"/g)].length, 1);
const canonical = page.match(/rel="canonical" href="([^"]+)"/)[1];
assert.ok(canonical.endsWith("/sertifikat/"));
assert.ok(readFileSync("dist/sitemap.xml", "utf8").includes(`<loc>${canonical}</loc>`));
assert.equal([...home.matchAll(/href="\.\/sertifikat\/"/g)].length, 1);
assert.ok(!home.includes("Подарите чистый дом"));
assert.match(page, /src="\.\.\/metrika\.js\?v=cert-1"/);
for (const [, url] of page.matchAll(/(?:href|src)="(\.\.\/(?:assets|images)\/[^"]+)"/g)) {
  assert.ok(existsSync(resolve("dist/sertifikat", url)), url);
}
const buttons = [...page.matchAll(/<a data-cert-order="true" href="([^"]+)"/g)];
assert.equal(buttons.length, 16);
const calls = [];
const handlers = [];
const context = {
  location: { pathname: "/sertifikat/" },
  window: { ym: (...args) => calls.push(args) },
  document: {
    addEventListener: (event, cb) => { if (event === "click") handlers.push(cb); },
    createElement: () => ({}),
    head: { appendChild() {} },
  },
};
runInNewContext(readFileSync("dist/metrika.js", "utf8"), context);
const channels = ["click_phone", "click_telegram", "click_whatsapp", "click_max"];
for (const [i, [, href]] of buttons.entries()) {
  const link = { hasAttribute: () => true, getAttribute: () => href };
  const event = { target: { closest: (selector) => selector.startsWith("a[") ? link : null } };
  calls.length = 0;
  handlers.forEach(cb => cb(event));
  const goals = calls.map(call => call.slice(1));
  assert.deepEqual(goals, [["reachGoal", "cert_order"], ["reachGoal", channels[i % 4]]]);
  if ([1, 2].includes(i % 4)) {
    const draft = new URL(href).searchParams.get("text");
    const amount = ["6 000", "10 000", "15 000", "6 000"][Math.floor(i / 4)];
    assert.ok(draft.replace(/\s/g, " ").includes(amount + " ₽"));
  }
}
context.location.pathname = "/";
calls.length = 0;
handlers.forEach(cb => cb({ target: { closest: (selector) => selector.startsWith("a[") ? { hasAttribute: () => true, getAttribute: () => "tel:+7" } : null } }));
assert.ok(!calls.some(call => call[2] === "cert_order"));
console.log("Certificate: static HTML, SEO, 16 order links, drafts and cert_order + channel goals passed");
