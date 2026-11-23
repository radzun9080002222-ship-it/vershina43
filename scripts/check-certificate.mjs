import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { runInNewContext } from "node:vm";

const page = readFileSync("dist/sertifikat/index.html", "utf8");
const home = readFileSync("dist/index.html", "utf8");
assert.match(page, /<h1[^>]*>Подарите чистый дом<\/h1>/);
assert.match(page, /<figure aria-label="Образец подарочного сертификата"[^>]*>[\s\S]*?>Образец<\/span>[\s\S]*?<\/figure>/);
assert.ok(!home.includes('Образец подарочного сертификата'));
assert.equal([...page.matchAll(/rel="canonical"/g)].length, 1);
const canonical = page.match(/rel="canonical" href="([^"]+)"/)[1];
assert.ok(canonical.endsWith("/sertifikat/"));
assert.ok(readFileSync("dist/sitemap.xml", "utf8").includes(`<loc>${canonical}</loc>`));
assert.equal([...home.matchAll(/href="\.\/sertifikat\/"/g)].length, 2);
const services = home.match(/<section id="services"[\s\S]*?<\/section>/)?.[0] ?? "";
assert.match(services, /<a href="\.\/sertifikat\/"[^>]*>[\s\S]*?Подарочный сертификат на уборку[\s\S]*?Подробнее[\s\S]*?<\/a>/);
assert.ok(!home.includes("Подарите чистый дом"));
assert.match(page, /src="\.\.\/metrika\.js\?v=cert-1"/);
for (const [, url] of page.matchAll(/(?:href|src)="(\.\.\/(?:assets|images)\/[^"]+)"/g)) {
  assert.ok(existsSync(resolve("dist/sertifikat", url)), url);
}
const buttons = [...page.matchAll(/<a data-cert-order="true" href="([^"]+)"/g)];
assert.equal(buttons.length, 4);
assert.equal([...page.matchAll(/<a data-cert-order="true" href="tel:[^"]+"[^>]*>Заказать<\/a>/g)].length, 2);
assert.match(page, /Менеджер поможет подобрать номинал по площади квартиры/);
assert.doesNotMatch(page, /Выбрать сертификат|Номинал сертификата<\/p><h3/);
assert.ok(!home.includes('data-cert-order'));
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
const channels = ["click_phone", "click_max", "click_phone", "click_phone"];
for (const [i, [, href]] of buttons.entries()) {
  const link = { hasAttribute: () => true, getAttribute: () => href };
  const event = { target: { closest: (selector) => selector.startsWith("a[") ? link : null } };
  calls.length = 0;
  handlers.forEach(cb => cb(event));
  const goals = calls.map(call => call.slice(1));
  assert.deepEqual(goals, [["reachGoal", "cert_order"], ["reachGoal", channels[i]]]);
}
context.location.pathname = "/";
calls.length = 0;
handlers.forEach(cb => cb({ target: { closest: (selector) => selector.startsWith("a[") ? { hasAttribute: () => true, getAttribute: () => "tel:+7" } : null } }));
assert.ok(!calls.some(call => call[2] === "cert_order"));
console.log("Certificate: static HTML, SEO, phone CTAs, contact pill and cert_order + channel goals passed");
