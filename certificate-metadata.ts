import type { Plugin } from "vite";
import { certificate, certificateTitle, certificateDescription } from "./src/certificate-config";

export function certificateMetadata(): Plugin {
  return {
    name: "certificate-metadata",
    apply: "build",
    generateBundle: {
      order: "post",
      handler(_, bundle) {
        const file = bundle["sertifikat/index.html"] ?? bundle["sertifikat\\index.html"];
        if (!file || file.type !== "asset" || typeof file.source !== "string") {
          this.error("Certificate prerender did not emit sertifikat/index.html");
        }
        const canonical = `https://${certificate.domain}${certificate.path}`;
        file.source = file.source.replace(/<head>([\s\S]*?)<\/head>/i, (_, head: string) => {
          // The nested route inherits the root Vite template. Keep fonts and assets,
          // but replace its home-specific metadata and rebase relative build URLs.
          const common = head
            .replace(/<title>[\s\S]*?<\/title>/i, "")
            .replace(/<meta\b[^>]*(?:name="(?:description|twitter:[^"]+)"|property="og:[^"]+")[^>]*>/gi, "")
            .replace(/<link\b[^>]*rel="canonical"[^>]*>/gi, "")
            .replace(/<script\b[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/gi, "")
            .replace(/(src|href)="\.\/assets\//g, '$1="../assets/')
            .replace(/src="(?:\.\/|\/)metrika\.js(?:\?[^"]*)?"/, 'src="../metrika.js?v=cert-1"');
          return `<head>${common}<title>${certificateTitle}</title>
<meta name="description" content="${certificateDescription}">
<link rel="canonical" href="${canonical}">
<meta property="og:title" content="${certificateTitle}">
<meta property="og:description" content="${certificateDescription}">
<meta property="og:url" content="${canonical}">
<meta property="og:type" content="website">
</head>`;
        });
      },
    },
  };
}
