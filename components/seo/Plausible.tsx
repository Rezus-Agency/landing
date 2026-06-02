import Script from "next/script";

/**
 * Plausible Analytics — privacy-first, no cookies, no consent banner needed.
 * Format v2 (script obfusqué pa-XXXX.js, résistance ad-blockers améliorée).
 * Le domaine est encodé dans le nom du script (pas besoin de data-domain).
 * Script ignore localhost par défaut — no events fired during dev.
 */
export function Plausible() {
  return (
    <>
      <Script
        async
        src="https://plausible.io/js/pa-5Z1hY6LXCAQ0P4hkcS9pZ.js"
        strategy="afterInteractive"
      />
      <Script id="plausible-init" strategy="afterInteractive">
        {`window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init()`}
      </Script>
    </>
  );
}
