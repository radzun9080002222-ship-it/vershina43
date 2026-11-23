import { Gift } from "lucide-react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { MAX_LINK, PHONE_HREF, TG_LINK, WA_LINK, TARIFFS } from "./data";
import { MINIMUM_VISIT_PRICE } from "./pricing";
import { certificate } from "./certificate-config";

const amount = (n: number) => n.toLocaleString("ru-RU");
const minimum = `${amount(MINIMUM_VISIT_PRICE)} ₽`;
const recipients = [
  ["Маме и родителям", "На день рождения или просто чтобы позаботиться о них."],
  ["Подруге", "Вместо ещё одной вещи — время на себя."],
  ["Молодым родителям", "Помощь с домом, когда все силы уходят на малыша."],
  ["На новоселье", "Подарок к началу жизни в новом доме."],
  ["Коллеге", "Знак внимания, который пригодится дома."],
];
const questions = [
  ["Можно подарить в другой район города?", `Да, если адрес уборки в ${certificate.city}. Конкретный адрес можно уточнить при заказе.`],
  ["Как передать сертификат?", "Перешлите электронный PDF или сообщение с сертификатом получателю."],
  ["Что, если получатель не успеет воспользоваться подарком?", "Срок действия не ограничен: получатель сам выбирает удобную дату."],
  ["Можно ли красиво оформить подарок?", "Можно переслать PDF с личным поздравлением или распечатать его и вложить в открытку."],
  ["Что, если уборка стоит дороже номинала?", "Получатель может доплатить разницу."],
];

function draft(link: string, message: string) {
  const url = new URL(link);
  url.searchParams.set("text", message);
  return url.href;
}

function OrderLinks({ value }: { value?: number }) {
  const message = value
    ? `Здравствуйте! Хочу подарочный сертификат на уборку на ${amount(value)} ₽`
    : `Здравствуйте! Хочу подарочный сертификат на уборку на свою сумму от ${minimum}.`;
  return (
    <div className="mt-5">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3 text-sm font-semibold">
        <a data-cert-order href={PHONE_HREF} className="btn-primary">Позвонить</a>
        <a data-cert-order href={draft(TG_LINK, message)} className="text-emerald underline underline-offset-4">Telegram</a>
        <a data-cert-order href={draft(WA_LINK, message)} className="text-emerald underline underline-offset-4">WhatsApp</a>
      </div>
      <details className="mt-4 text-sm text-ink/75">
        <summary className="cursor-pointer font-semibold text-emerald">Заказать в MAX</summary>
        <label className="mt-3 block text-xs" htmlFor={`max-message-${value ?? "custom"}`}>Текст для MAX — скопируйте и вставьте в чат</label>
        <textarea id={`max-message-${value ?? "custom"}`} readOnly rows={3} value={message} className="mt-1 w-full rounded-lg border border-black/10 bg-white p-2 text-sm" />
        <a data-cert-order href={MAX_LINK} className="mt-2 inline-block font-semibold text-emerald underline underline-offset-4">Открыть MAX</a>
      </details>
    </div>
  );
}

export default function CertificatePage() {
  return (
    <>
      <Header homeHref="../" />
      <main id="top" className="pt-[72px]">
        <section className="border-b border-black/5 bg-emerald/5">
          <div className="container-x grid items-center gap-8 py-12 sm:py-20 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <p className="kicker">Подарочный сертификат · в {certificate.city}</p>
              <h1 className="mt-4 text-4xl font-semibold leading-tight text-graphite sm:text-6xl">Подарите чистый дом</h1>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-ink/75 sm:text-lg">Маме, родителям, подруге или близким на новоселье. Вы выбираете сумму, а получатель — удобную дату уборки.</p>
              <a href="#nominaly" className="btn-primary mt-6">Выбрать сертификат</a>
              <p className="mt-3 text-sm text-ink/70">От {minimum} · без срока действия</p>
            </div>
            <div aria-hidden="true" className="hidden rounded-3xl bg-graphite p-10 text-white shadow-card lg:block">
              <Gift size={42} strokeWidth={1.4} />
              <p className="mt-8 text-xs font-semibold uppercase tracking-widest text-white/70">Вершина · подарок с заботой</p>
              <p className="mt-3 text-3xl font-semibold">Сертификат<br />на уборку</p>
              <p className="mt-6 text-sm text-white/70">Действует в {certificate.city}</p>
            </div>
          </div>
        </section>
        <section className="container-x py-12 sm:py-16" aria-labelledby="recipients">
          <h2 id="recipients" className="text-3xl font-semibold">Кому подарить</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {recipients.map(([who, why]) => <li key={who} className="rounded-xl border border-black/10 px-4 py-3 text-sm"><strong>{who}.</strong> {why}</li>)}
          </ul>
        </section>
        <section id="nominaly" className="scroll-mt-24 bg-emerald/5">
          <div className="container-x py-12 sm:py-16">
            <h2 className="text-3xl font-semibold">Выберите номинал</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[MINIMUM_VISIT_PRICE, 10000, 15000, undefined].map((value) => (
                <article key={value ?? "custom"} className="min-w-0 rounded-2xl border border-black/10 bg-white p-5">
                  <p className="text-sm text-ink/70">{value ? "Номинал сертификата" : "Любая сумма"}</p>
                  <h3 className="mt-2 text-2xl font-semibold">{value ? `${amount(value)} ₽` : `От ${minimum}`}</h3>
                  <OrderLinks value={value} />
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="container-x grid gap-10 py-12 sm:py-16 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-semibold">Что можно оплатить</h2>
            <ul className="mt-5 divide-y divide-black/10 text-sm">
              {TARIFFS.map((service) => (
                <li key={service.id} className="py-3">
                  <strong>{service.name}</strong>
                  <span className="mt-1 block text-ink/75">{service.rate != null
                    ? `${amount(service.rate)} ₽/м²`
                    : service.rateOptions?.map(option => `${option.name}: ${amount(option.rate)} ₽/м²`).join(" · ")}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-3xl font-semibold">Как это работает</h2>
            <ol className="mt-5 list-decimal space-y-3 pl-5 leading-relaxed">
              <li>Позвоните или напишите нам и оплатите выбранный номинал.</li>
              <li>Получите электронный сертификат в PDF или в мессенджере и передайте его близкому человеку.</li>
              <li>Получатель сам выбирает удобную дату уборки.</li>
              <li>Бригада приезжает на уборку. Сумма сертификата уже оплачена.</li>
            </ol>
          </div>
        </section>
        <section className="bg-emerald/5">
          <div className="container-x py-12 sm:py-16">
            <h2 className="text-3xl font-semibold">Условия</h2>
            <ul className="mt-5 list-disc space-y-2 pl-5">
              <li>Срок действия не ограничен.</li>
              <li>Сертификат действует в {certificate.city}.</li>
              <li>Минимальный заказ для любого вида уборки — {minimum}.</li>
              <li>Если уборка стоит дороже номинала, можно доплатить разницу.</li>
            </ul>
          </div>
        </section>
        <section className="container-x py-12 sm:py-16">
          <h2 className="text-3xl font-semibold">Частые вопросы</h2>
          <div className="mt-6 max-w-3xl divide-y divide-black/10 border-y border-black/10">
            {questions.map(([q, a]) => (
              <details key={q} className="py-4">
                <summary className="cursor-pointer font-semibold">{q}</summary>
                <p className="mt-3 text-sm leading-relaxed text-ink/75">{a}</p>
              </details>
            ))}
          </div>
          <div className="mt-12 rounded-3xl border border-black/10 bg-emerald/5 p-6 sm:p-9">
            <h2 className="text-2xl font-semibold">Подарите близким время для себя</h2>
            <a href="#nominaly" className="btn-primary mt-5">Выбрать сертификат</a>
          </div>
        </section>
      </main>
      <Footer homeHref="../" />
    </>
  );
}
