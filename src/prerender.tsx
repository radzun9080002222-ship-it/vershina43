import { renderToString } from "react-dom/server";
import App from "./App";
import CertificatePage from "./CertificatePage";
import { certificate } from "./certificate-config";

// Вызывается плагином vite-prerender-plugin на этапе сборки.
// Возвращает готовый HTML, который вшивается внутрь <div id="root"> в index.html,
// чтобы поисковики (в первую очередь Яндекс) видели контент без выполнения JS.
export async function prerender({ url }: { url: string }) {
  const html = renderToString(url === certificate.path ? <CertificatePage /> : <App />);
  return { html };
}
