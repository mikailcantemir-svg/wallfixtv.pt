"use strict";

const fs = require("fs");
const path = require("path");
const { LANGUAGES } = require("./i18n-data.js");

const ROOT = path.resolve(__dirname, "..");
const SITE = "https://www.wallfixtv.pt";
const LANG_ORDER = ["pt", "en", "es", "fr", "ro"];
const HREFLANG = {
  pt: "pt-PT",
  en: "en",
  es: "es",
  fr: "fr",
  ro: "ro",
};

const WHY_ICONS = [
  "assets/icon-vantagem-seguranca.png",
  "assets/icon-vantagem-diamante.svg",
  "assets/icon-vantagem-pessoa.png",
  "assets/icon-vantagem-relogio.png",
  "assets/icon-vantagem-like.png",
];

const SERVICE_ICONS = [
  "assets/icons/service-montagem-tv.png",
  "assets/icons/service-suporte-tv.png",
  "assets/icons/service-cabos-tv.png",
  "assets/icons/service-parede.png",
];

const PROCESS_ICONS = [
  "assets/icons/icon-whatsapp-processo.png",
  "assets/icons/icon-calendario.png",
  "assets/icons/icon-berbequim.png",
];

const GALLERY_IMAGES = [
  "assets/images/trabalho-tv-1.webp",
  "assets/images/trabalho-tv-2.webp",
  "assets/images/trabalho-tv-3.webp",
  "assets/images/trabalho-tv-4.webp",
  "assets/images/trabalho-tv-5.webp",
];

const SVG_SPRITE = `  <svg class="svg-sprite" aria-hidden="true" focusable="false" width="0" height="0" style="position:absolute;width:0;height:0;overflow:hidden;opacity:0;pointer-events:none;">
    <symbol id="icon-whatsapp" viewBox="0 0 24 24">
      <path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </symbol>
    <symbol id="icon-calendar" viewBox="0 0 24 24">
      <rect x="3" y="5" width="18" height="16" rx="2"></rect>
      <line x1="3" y1="10" x2="21" y2="10"></line>
      <line x1="8" y1="3" x2="8" y2="7"></line>
      <line x1="16" y1="3" x2="16" y2="7"></line>
      <line x1="8" y1="14" x2="8" y2="14.01"></line>
      <line x1="12" y1="14" x2="12" y2="14.01"></line>
      <line x1="16" y1="14" x2="16" y2="14.01"></line>
    </symbol>
    <symbol id="icon-shield" viewBox="0 0 24 24">
      <path d="M12 2l8 4v6c0 5-3.4 9.4-8 10-4.6-.6-8-5-8-10V6l8-4z"></path>
      <path d="M9 12l2 2 4-4"></path>
    </symbol>
    <symbol id="icon-shield-bolt" viewBox="0 0 24 24">
      <path d="M12 2l8 4v6c0 5-3.4 9.4-8 10-4.6-.6-8-5-8-10V6l8-4z"></path>
      <path d="M12.8 7.8 10 12h2.5l-1.1 4.2 3.8-5.5h-2.6l.2-2.9z"></path>
    </symbol>
    <symbol id="icon-cable" viewBox="0 0 24 24">
      <path d="M4 8c0-1.1.9-2 2-2h2"></path>
      <path d="M20 16c0 1.1-.9 2-2 2h-2"></path>
      <path d="M8 6v4"></path>
      <path d="M16 14v4"></path>
      <path d="M8 10c2 0 3 1 4 3s2 3 4 3"></path>
    </symbol>
    <symbol id="icon-check" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9"></circle>
      <path d="M8 12l3 3 5-5"></path>
    </symbol>
    <symbol id="icon-drill" viewBox="0 0 24 24">
      <path d="M3 12h6l2-4 4 8 2-4h4"></path>
      <rect x="2" y="10" width="4" height="4" rx="1"></rect>
    </symbol>
    <symbol id="icon-star" viewBox="0 0 24 24">
      <path d="M12 3l2.6 5.8 6.2.6-4.7 4 1.4 6.1L12 17.8 6.5 19.5l1.4-6.1-4.7-4 6.2-.6L12 3z"></path>
    </symbol>
    <symbol id="icon-user" viewBox="0 0 24 24">
      <circle cx="12" cy="8" r="4"></circle>
      <path d="M4 20c1.5-4 14.5-4 16 0"></path>
    </symbol>
    <symbol id="icon-clock" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9"></circle>
      <path d="M12 7v5l3 2"></path>
    </symbol>
    <symbol id="icon-like" viewBox="0 0 24 24">
      <path d="M7 11v9"></path>
      <path d="M17 11c1.5 0 3-1.2 3-3.5S18 4 16.5 4 14 6 14 8v3H9V8c0-3 1.5-5 3.5-5S16 5 16 7.5 16 11h1z"></path>
    </symbol>
    <symbol id="icon-thumb-up" viewBox="0 0 24 24">
      <path d="M10 10V6.8c0-1.2.7-2.2 1.8-2.7L13 3v6.5h5.3c1.2 0 2.1 1.1 1.9 2.3l-.8 5.1c-.2 1-1 1.7-2 1.7H10"></path>
      <rect x="4" y="10" width="4" height="10" rx="1"></rect>
    </symbol>
    <symbol id="icon-gallery" viewBox="0 0 24 24">
      <rect x="3" y="5" width="18" height="14" rx="2"></rect>
      <circle cx="9" cy="10" r="2"></circle>
      <path d="M21 15l-5-5-4 4-2-2-5 5"></path>
    </symbol>
    <symbol id="icon-mail" viewBox="0 0 24 24">
      <rect x="3" y="6" width="18" height="12" rx="2"></rect>
      <path d="M3 8l9 6 9-6"></path>
    </symbol>
    <symbol id="icon-pin" viewBox="0 0 24 24">
      <path d="M12 21s6-5.2 6-10a6 6 0 10-12 0c0 4.8 6 10 6 10z"></path>
      <circle cx="12" cy="11" r="2.5"></circle>
    </symbol>
    <symbol id="icon-facebook" viewBox="0 0 24 24">
      <path d="M14 8h3V5h-3c-2.2 0-4 1.8-4 4v2H8v3h3v7h3v-7h3l1-3h-4V9c0-.6.4-1 1-1z"></path>
    </symbol>
    <symbol id="icon-instagram" viewBox="0 0 24 24">
      <rect x="4" y="4" width="16" height="16" rx="4"></rect>
      <circle cx="12" cy="12" r="3.5"></circle>
      <circle cx="17.5" cy="6.5" r="1"></circle>
    </symbol>
    <symbol id="icon-phone" viewBox="0 0 24 24">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"></path>
    </symbol>
    <symbol id="icon-bolt" viewBox="0 0 24 24">
      <path d="M13 2L5 14h6l-1 8 8-12h-6l1-8z"></path>
    </symbol>
  </svg>`;

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function waUrl(message) {
  return `https://wa.me/351932504112?text=${encodeURIComponent(message)}`;
}

function langUrl(langKey) {
  const prefix = LANGUAGES[langKey].pathPrefix;
  return prefix ? `${SITE}${prefix}/` : `${SITE}/`;
}

function assetPrefix(langKey) {
  return langKey === "pt" ? "./" : "../";
}

function assetPath(langKey, relativePath) {
  return `${assetPrefix(langKey)}${relativePath}`;
}

function langPageHref(currentKey, targetKey) {
  if (targetKey === "pt") {
    return currentKey === "pt" ? "./" : "../";
  }
  if (currentKey === "pt") {
    return `${targetKey}/`;
  }
  if (currentKey === targetKey) {
    return "./";
  }
  return `../${targetKey}/`;
}

function buildHreflangLinks() {
  return LANG_ORDER.map((key) => {
    const hreflang = HREFLANG[key];
    const href = langUrl(key);
    return `  <link rel="alternate" hreflang="${hreflang}" href="${href}">`;
  })
    .concat(`  <link rel="alternate" hreflang="x-default" href="${langUrl("pt")}">`)
    .join("\n");
}

function buildLanguageSwitcher(activeKey) {
  const links = LANG_ORDER.map((key) => {
    const t = LANGUAGES[key];
    const href = langPageHref(activeKey, key);
    const activeClass = key === activeKey ? ' class="active"' : "";
    return `          <a href="${href}"${activeClass} hreflang="${HREFLANG[key]}">${t.activeLang}</a>`;
  }).join("\n");

  return `        <nav class="language-switcher" aria-label="${escapeHtml(LANGUAGES[activeKey].header.langSwitcherAria)}">
${links}
        </nav>`;
}

function buildSelectOptions(options, placeholder) {
  const items = [
    `            <option value="">${escapeHtml(placeholder)}</option>`,
    ...options.map(
      (opt) =>
        `            <option value="${escapeHtml(opt.value)}">${escapeHtml(opt.label)}</option>`
    ),
  ];
  return items.join("\n");
}

function buildI18nScript(t) {
  const payload = {
    scheduleIntro: t.whatsapp.scheduleIntro,
    scheduleFieldLabels: t.whatsapp.scheduleFieldLabels,
    scheduleClosing: t.whatsapp.scheduleClosing,
    error: t.modal.error,
    quote: t.whatsapp.quote,
  };
  return `  <script>window.WALLFIXTV_I18N = ${JSON.stringify(payload)};</script>`;
}

function buildLocalBusinessJsonLd(t) {
  const offers = t.jsonLd.services
    .map(
      (name) => `      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": ${JSON.stringify(name)}
        }
      }`
    )
    .join(",\n");

  return `  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "WallFixTV.pt",
    "url": ${JSON.stringify(t.canonical)},
    "telephone": "+351932504112",
    "image": "https://www.wallfixtv.pt/assets/images/og-wallfixtv.jpg",
    "logo": "https://www.wallfixtv.pt/assets/logos/wallfixtv-logo.png",
    "description": ${JSON.stringify(t.jsonLd.businessDescription)},
    "areaServed": [
      "Lisboa",
      "Grande Lisboa",
      "Odivelas",
      "Loures",
      "Amadora",
      "Sintra",
      "Cascais",
      "Almada",
      "Seixal",
      "Margem Sul"
    ],
    "makesOffer": [
${offers}
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+351932504112",
      "contactType": "customer service",
      "areaServed": "PT",
      "availableLanguage": ["Portuguese", "English", "Spanish", "French", "Romanian"]
    }
  }
  </script>`;
}

function buildFaqJsonLd(t) {
  const entities = t.faq.items
    .map(
      (item) => `      {
        "@type": "Question",
        "name": ${JSON.stringify(item.q)},
        "acceptedAnswer": {
          "@type": "Answer",
          "text": ${JSON.stringify(item.a)}
        }
      }`
    )
    .join(",\n");

  return `  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
${entities}
    ]
  }
  </script>`;
}

function buildPage(langKey) {
  const t = LANGUAGES[langKey];
  const nav = t.header.nav;
  const prefix = assetPrefix(langKey);

  const serviceCards = t.services.cards
    .map(
      (card, i) => `          <article class="service-card">
            <div class="service-icon">
              <img src="${assetPath(langKey, SERVICE_ICONS[i])}" alt="${escapeHtml(card.imgAlt)}" width="82" height="72" loading="lazy" />
            </div>
            <h3>${escapeHtml(card.title)}</h3>
            <p>${escapeHtml(card.desc)}</p>
            <a class="service-link" href="#contacto">${escapeHtml(card.learnMore)} <span aria-hidden="true">→</span></a>
          </article>`
    )
    .join("\n\n");

  const includedItems = t.included.items
    .map((item) => `          <li>${escapeHtml(item)}</li>`)
    .join("\n");

  const processSteps = t.process.steps
    .map(
      (step, i) => `          <div class="process-step">
            <div class="process-number">${i + 1}</div>
            <div class="process-icon">
              <img class="process-icon-img" src="${assetPath(langKey, PROCESS_ICONS[i])}" alt="${escapeHtml(step.iconAlt)}" width="88" height="88" />
            </div>
            <h3>${escapeHtml(step.title)}</h3>
            <p>${escapeHtml(step.desc)}</p>
          </div>`
    )
    .join("\n\n");

  const whyItems = t.why.items
    .map(
      (item, i) => `          <article class="why-item">
            <img class="why-icon-img" src="${assetPath(langKey, WHY_ICONS[i])}" alt="${escapeHtml(item.iconAlt)}" width="30" height="30" />
            <div>
              <h3>${escapeHtml(item.h3)}</h3>
              <p>${escapeHtml(item.p)}</p>
            </div>
          </article>`
    )
    .join("\n\n");

  const galleryImages = t.gallery.alts
    .map(
      (alt, i) =>
        `          <img src="${assetPath(langKey, GALLERY_IMAGES[i])}" alt="${escapeHtml(alt)}" width="400" height="260" loading="lazy" />`
    )
    .join("\n");

  const faqItems = t.faq.items
    .map(
      (item) => `          <details class="faq-item">
            <summary>${escapeHtml(item.q)}</summary>
            <p>${escapeHtml(item.a)}</p>
          </details>`
    )
    .join("\n\n");

  const heroTrust = t.hero.trust
    .map((text, i) => {
      const icons = ["#icon-shield", "#icon-cable", "#icon-check"];
      return `            <div class="hero-trust-item">
              <svg viewBox="0 0 24 24" aria-hidden="true"><use href="${icons[i]}"></use></svg>
              <span>${escapeHtml(text)}</span>
            </div>`;
    })
    .join("\n");

  const modalInfoItems = t.modal.infoItems
    .map((item) => `            <li>${escapeHtml(item)}</li>`)
    .join("\n");

  return `<!DOCTYPE html>
<html lang="${escapeHtml(t.htmlLang)}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />

  <title>${escapeHtml(t.meta.title)}</title>
  <meta name="description" content="${escapeHtml(t.meta.description)}">
  <link rel="canonical" href="${escapeHtml(t.canonical)}">
${buildHreflangLinks()}

  <meta name="robots" content="index, follow">
  <meta name="author" content="WallFixTV.pt">
  <meta name="theme-color" content="#075fc7">

  <meta property="og:title" content="${escapeHtml(t.meta.ogTitle)}">
  <meta property="og:description" content="${escapeHtml(t.meta.ogDescription)}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${escapeHtml(t.canonical)}">
  <meta property="og:image" content="https://www.wallfixtv.pt/assets/images/og-wallfixtv.jpg">
  <meta property="og:locale" content="${escapeHtml(t.meta.ogLocale)}">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(t.meta.twitterTitle)}">
  <meta name="twitter:description" content="${escapeHtml(t.meta.twitterDescription)}">
  <meta name="twitter:image" content="https://www.wallfixtv.pt/assets/images/og-wallfixtv.jpg">

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="${prefix}styles.css" />
</head>

<body>
${SVG_SPRITE}

  <header class="site-header">
    <div class="container header-inner">
      <a class="brand" href="#inicio" aria-label="${escapeHtml(t.header.brandAria)}">
        <img src="${prefix}assets/logos/wallfixtv-logo.png" alt="${escapeHtml(t.header.brandImgAlt)}" width="200" height="78" />
      </a>

      <button class="menu-button" type="button" aria-label="${escapeHtml(t.header.menuOpenLabel)}" aria-expanded="false" aria-controls="mainMenu">
        <span></span>
        <span></span>
        <span></span>
      </button>

      <nav id="mainMenu" aria-label="${escapeHtml(t.header.navAria)}">
        <a href="#inicio" class="active">${escapeHtml(nav.home)}</a>
        <a href="#servicos">${escapeHtml(nav.services)}</a>
        <a href="#como-funciona">${escapeHtml(nav.howItWorks)}</a>
        <a href="#zonas">${escapeHtml(nav.areas)}</a>
        <a href="#trabalhos">${escapeHtml(nav.work)}</a>
        <a href="#faq">${escapeHtml(nav.faq)}</a>
        <a href="#contacto">${escapeHtml(nav.contact)}</a>
      </nav>

      <div class="header-actions">
${buildLanguageSwitcher(langKey)}
        <a class="header-whatsapp" href="${waUrl(t.whatsapp.headerQuick)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(t.header.whatsappAria)}">
          <svg viewBox="0 0 24 24" aria-hidden="true"><use href="#icon-whatsapp"></use></svg>
          <span class="header-whatsapp-number">${escapeHtml(t.header.whatsappHeaderText)}</span>
        </a>
      </div>
    </div>
  </header>

  <main id="inicio">
    <section class="hero">
      <div class="container hero-grid">
        <div class="hero-copy">
          <h1>
            ${escapeHtml(t.hero.h1Line1)}
            <span class="hero-highlight">${escapeHtml(t.hero.heroHighlight)}</span>
          </h1>
          <p class="hero-subtitle">
            ${escapeHtml(t.hero.subtitle)}
          </p>

          <div class="hero-actions">
            <a class="btn btn-primary" href="${waUrl(t.whatsapp.quote)}" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" aria-hidden="true"><use href="#icon-whatsapp"></use></svg>
              ${escapeHtml(t.hero.btnQuote)}
            </a>
            <button type="button" class="btn btn-outline open-schedule-modal" id="openScheduleModal">
              <svg viewBox="0 0 24 24" aria-hidden="true"><use href="#icon-calendar"></use></svg>
              ${escapeHtml(t.hero.btnSchedule)}
            </button>
          </div>

          <div class="hero-trust">
${heroTrust}
          </div>
        </div>

        <div class="hero-media">
          <img src="${prefix}assets/images/hero-tv-wall.webp" alt="${escapeHtml(t.hero.heroImgAlt)}" width="800" height="600" fetchpriority="high" />
        </div>
      </div>

      <div class="hero-wave" aria-hidden="true">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d="M0,40 C180,80 360,0 540,35 C720,70 900,10 1080,40 C1260,70 1380,20 1440,45 L1440,80 L0,80 Z" fill="#ffffff"/>
        </svg>
      </div>
    </section>

    <section id="servicos" class="section services-section">
      <div class="container">
        <header class="section-heading">
          <h2>${escapeHtml(t.services.titlePrefix)}<span class="accent-text">${escapeHtml(t.services.titleAccent)}</span></h2>
        </header>

        <div class="service-grid">
${serviceCards}
        </div>
      </div>
    </section>

    <section id="zonas" class="section zones-section">
      <div class="container zones-content">
        <header class="section-heading left">
          <h2>${escapeHtml(t.zones.title)}</h2>
        </header>
        <p>
          ${escapeHtml(t.zones.text)}
        </p>
        <a class="btn btn-primary" href="${waUrl(t.whatsapp.quote)}" target="_blank" rel="noopener noreferrer">
          <svg viewBox="0 0 24 24" aria-hidden="true"><use href="#icon-whatsapp"></use></svg>
          ${escapeHtml(t.zones.btn)}
        </a>
      </div>
    </section>

    <section id="incluido" class="section included-section">
      <div class="container">
        <header class="section-heading">
          <h2>${escapeHtml(t.included.titleBefore)}<span class="accent-text">${escapeHtml(t.included.titleAccent)}</span>${escapeHtml(t.included.titleAfter)}</h2>
        </header>
        <p class="included-intro">
          ${escapeHtml(t.included.intro)}
        </p>
        <ul class="included-list">
${includedItems}
        </ul>
      </div>
    </section>

    <section id="como-funciona" class="section process-section">
      <div class="container">
        <header class="section-heading">
          <h2>${escapeHtml(t.process.titlePrefix)}<span class="accent-text">${escapeHtml(t.process.titleAccent)}</span></h2>
        </header>

        <div class="process-flow">
${processSteps}
        </div>
      </div>
    </section>

    <section id="vantagens" class="why-section">
      <div class="container">
        <header class="why-heading">
          <h2>${escapeHtml(t.why.titlePrefix)}<span class="accent-text light">${escapeHtml(t.why.titleAccent)}</span></h2>
        </header>

        <div class="why-grid">
${whyItems}
        </div>
      </div>
    </section>

    <section id="trabalhos" class="section gallery-section">
      <div class="container">
        <header class="section-heading">
          <h2>${escapeHtml(t.gallery.titlePrefix)}<span class="accent-text">${escapeHtml(t.gallery.titleAccent)}</span></h2>
        </header>

        <div class="gallery-grid">
${galleryImages}
        </div>

        <div class="gallery-action">
          <a class="btn btn-outline" href="#contacto">
            <svg viewBox="0 0 24 24" aria-hidden="true"><use href="#icon-gallery"></use></svg>
            ${escapeHtml(t.gallery.viewMore)}
          </a>
        </div>
      </div>
    </section>

    <section id="faq" class="section faq-section">
      <div class="container">
        <header class="section-heading">
          <h2>${escapeHtml(t.faq.titlePrefix)}<span class="accent-text">${escapeHtml(t.faq.titleAccent)}</span></h2>
        </header>

        <div class="faq-list">
${faqItems}
        </div>
      </div>
    </section>
  </main>

  <footer id="contacto" class="site-footer">
    <div class="container footer-grid">
      <div class="footer-brand">
        <img src="${prefix}assets/logos/wallfixtv-logo.png" alt="${escapeHtml(t.footer.brandImgAlt)}" class="footer-logo" width="180" height="70" />
        <p>${escapeHtml(t.footer.brandDesc)}</p>
      </div>

      <div class="footer-col">
        <h3>${escapeHtml(t.footer.navHeading)}</h3>
        <nav aria-label="${escapeHtml(t.footer.navAria)}">
          <a href="#inicio">${escapeHtml(nav.home)}</a>
          <a href="#servicos">${escapeHtml(nav.services)}</a>
          <a href="#como-funciona">${escapeHtml(nav.howItWorks)}</a>
          <a href="#zonas">${escapeHtml(nav.areas)}</a>
          <a href="#trabalhos">${escapeHtml(nav.work)}</a>
          <a href="#faq">${escapeHtml(nav.faq)}</a>
          <a href="#contacto">${escapeHtml(nav.contact)}</a>
        </nav>
      </div>

      <div class="footer-col">
        <h3>${escapeHtml(t.footer.contactHeading)}</h3>
        <a class="footer-contact" href="https://wa.me/351932504112" target="_blank" rel="noopener noreferrer">
          <svg viewBox="0 0 24 24" aria-hidden="true"><use href="#icon-whatsapp"></use></svg>
          ${escapeHtml(t.footer.whatsappLabel)}
        </a>
        <a class="footer-contact" href="tel:+351932504112">
          <svg viewBox="0 0 24 24" aria-hidden="true"><use href="#icon-phone"></use></svg>
          +351 932 504 112
        </a>
        <p class="footer-contact">
          <svg viewBox="0 0 24 24" aria-hidden="true"><use href="#icon-pin"></use></svg>
          ${escapeHtml(t.footer.location)}
        </p>
      </div>

      <div class="footer-col footer-cta">
        <h3>${escapeHtml(t.footer.talkHeading)}</h3>
        <p>${escapeHtml(t.footer.talkText)}</p>
        <a class="btn btn-whatsapp" href="${waUrl(t.whatsapp.quote)}" target="_blank" rel="noopener noreferrer">
          <svg viewBox="0 0 24 24" aria-hidden="true"><use href="#icon-whatsapp"></use></svg>
          ${escapeHtml(t.footer.openWhatsapp)}
        </a>
      </div>
    </div>

    <div class="copyright">
      <div class="container">
        <p>${escapeHtml(t.footer.copyright)} <a href="${prefix}politica-privacidade.html">${escapeHtml(t.footer.privacyLink)}</a></p>
      </div>
    </div>
  </footer>

${buildLocalBusinessJsonLd(t)}

${buildFaqJsonLd(t)}

  <div class="schedule-modal-overlay" id="scheduleModal" aria-hidden="true" role="dialog" aria-modal="true" aria-labelledby="scheduleModalTitle">
    <div class="schedule-modal" role="document">
      <button type="button" class="schedule-modal-close" aria-label="${escapeHtml(t.modal.closeAria)}">&times;</button>

      <header class="schedule-modal-header">
        <h2 id="scheduleModalTitle">${escapeHtml(t.modal.title)}</h2>
        <p>${escapeHtml(t.modal.intro)}</p>
      </header>

      <form id="scheduleForm" class="schedule-form" novalidate>
        <div class="schedule-field">
          <label for="scheduleName">${escapeHtml(t.modal.fields.name)} <span aria-hidden="true">*</span></label>
          <input type="text" id="scheduleName" name="name" required autocomplete="name" />
        </div>

        <div class="schedule-field">
          <label for="schedulePhone">${escapeHtml(t.modal.fields.phone)} <span aria-hidden="true">*</span></label>
          <input type="tel" id="schedulePhone" name="phone" required autocomplete="tel" inputmode="tel" />
        </div>

        <div class="schedule-field">
          <label for="scheduleLocation">${escapeHtml(t.modal.fields.location)} <span aria-hidden="true">*</span></label>
          <input type="text" id="scheduleLocation" name="location" required placeholder="${escapeHtml(t.modal.placeholders.location)}" />
        </div>

        <div class="schedule-row">
          <div class="schedule-field">
            <label for="scheduleDate">${escapeHtml(t.modal.fields.date)} <span aria-hidden="true">*</span></label>
            <input type="date" id="scheduleDate" name="date" required />
          </div>
          <div class="schedule-field">
            <label for="scheduleTime">${escapeHtml(t.modal.fields.time)} <span aria-hidden="true">*</span></label>
            <input type="time" id="scheduleTime" name="time" required />
          </div>
        </div>

        <div class="schedule-field">
          <label for="scheduleTvSize">${escapeHtml(t.modal.fields.tvSize)} <span aria-hidden="true">*</span></label>
          <select id="scheduleTvSize" name="tvSize" required>
${buildSelectOptions(t.modal.tvSizeOptions, t.modal.selectPlaceholder)}
          </select>
        </div>

        <div class="schedule-field">
          <label for="scheduleWall">${escapeHtml(t.modal.fields.wall)}</label>
          <select id="scheduleWall" name="wallType">
${buildSelectOptions(t.modal.wallOptions, t.modal.selectPlaceholder)}
          </select>
        </div>

        <div class="schedule-field">
          <label for="scheduleSupport">${escapeHtml(t.modal.fields.support)}</label>
          <select id="scheduleSupport" name="supportType">
${buildSelectOptions(t.modal.supportOptions, t.modal.selectPlaceholder)}
          </select>
        </div>

        <div class="schedule-field">
          <label for="scheduleCables">${escapeHtml(t.modal.fields.cables)}</label>
          <select id="scheduleCables" name="cables">
${buildSelectOptions(t.modal.cableOptions, t.modal.selectPlaceholder)}
          </select>
        </div>

        <div class="schedule-field">
          <label for="scheduleNotes">${escapeHtml(t.modal.fields.notes)}</label>
          <textarea id="scheduleNotes" name="notes" rows="3" placeholder="${escapeHtml(t.modal.placeholders.notes)}"></textarea>
        </div>

        <aside class="schedule-info" aria-label="${escapeHtml(t.modal.infoAria)}">
          <p><strong>${escapeHtml(t.modal.infoTitle)}</strong></p>
          <ul>
${modalInfoItems}
          </ul>
        </aside>

        <p class="schedule-error" id="scheduleError" role="alert" hidden>${escapeHtml(t.modal.error)}</p>

        <div class="schedule-actions">
          <button type="submit" class="btn btn-primary schedule-submit">
            <svg viewBox="0 0 24 24" aria-hidden="true"><use href="#icon-whatsapp"></use></svg>
            ${escapeHtml(t.modal.submit)}
          </button>
          <button type="button" class="btn btn-outline schedule-cancel">${escapeHtml(t.modal.cancel)}</button>
        </div>
      </form>
    </div>
  </div>

${buildI18nScript(t)}
  <script src="${prefix}script.js"></script>
</body>
</html>
`;
}

function writePage(langKey) {
  const t = LANGUAGES[langKey];
  const html = buildPage(langKey);
  const outPath =
    langKey === "pt"
      ? path.join(ROOT, "index.html")
      : path.join(ROOT, langKey, "index.html");

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, html, "utf8");
  return outPath;
}

function main() {
  const written = LANG_ORDER.map((key) => writePage(key));
  console.log("Generated i18n pages:");
  written.forEach((file) => console.log(" -", path.relative(ROOT, file)));
}

main();
