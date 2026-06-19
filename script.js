(function () {
  const menuButton = document.querySelector(".menu-button");
  const menu = document.getElementById("mainMenu");
  const navLinks = document.querySelectorAll("#mainMenu a, .footer-col nav a");

  function closeMenu() {
    if (menu) menu.classList.remove("open");
    if (menuButton) menuButton.setAttribute("aria-expanded", "false");
  }

  if (menuButton && menu) {
    menuButton.addEventListener("click", (event) => {
      event.stopPropagation();
      const isOpen = menu.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
    });

    document.addEventListener("click", (event) => {
      if (!menu.classList.contains("open")) return;
      if (menu.contains(event.target) || menuButton.contains(event.target)) return;
      closeMenu();
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  const sections = document.querySelectorAll("section[id], main[id]");
  const headerLinks = document.querySelectorAll("#mainMenu a");

  function setActiveNav() {
    let current = "inicio";

    sections.forEach((section) => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) {
        current = section.id;
      }
    });

    headerLinks.forEach((link) => {
      const href = link.getAttribute("href");
      link.classList.toggle("active", href === "#" + current);
    });
  }

  window.addEventListener("scroll", setActiveNav, { passive: true });
  setActiveNav();
})();

(function () {
  const WHATSAPP_URL = "https://wa.me/351932504112";
  const modal = document.getElementById("scheduleModal");
  const form = document.getElementById("scheduleForm");
  const errorBox = document.getElementById("scheduleError");
  const openButtons = document.querySelectorAll(".open-schedule-modal");
  const closeButton = modal ? modal.querySelector(".schedule-modal-close") : null;
  const cancelButton = modal ? modal.querySelector(".schedule-cancel") : null;
  const firstField = document.getElementById("scheduleName");
  let lastFocusedElement = null;

  if (!modal || !form) return;

  function openModal() {
    const mobileMenu = document.getElementById("mainMenu");
    const mobileMenuButton = document.querySelector(".menu-button");
    if (mobileMenu) mobileMenu.classList.remove("open");
    if (mobileMenuButton) mobileMenuButton.setAttribute("aria-expanded", "false");

    lastFocusedElement = document.activeElement;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    if (errorBox) errorBox.hidden = true;
    window.setTimeout(() => firstField && firstField.focus(), 50);
  }

  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
    }
  }

  function getFieldValue(id) {
    const field = document.getElementById(id);
    return field && field.value.trim() ? field.value.trim() : "—";
  }

  function markInvalidFields() {
    const requiredIds = [
      "scheduleName",
      "schedulePhone",
      "scheduleLocation",
      "scheduleDate",
      "scheduleTime",
      "scheduleTvSize",
    ];

    requiredIds.forEach((id) => {
      const field = document.getElementById(id);
      if (!field) return;
      field.classList.toggle("is-invalid", !field.value.trim());
    });

    const privacyCheckbox = document.getElementById("schedulePrivacy");
    if (privacyCheckbox) {
      privacyCheckbox.classList.toggle("is-invalid", !privacyCheckbox.checked);
    }
  }

  function buildWhatsAppMessage() {
    const i18n = window.WALLFIXTV_I18N || {};
    const labels = i18n.scheduleFieldLabels || {
      name: "Nome",
      phone: "Contacto",
      location: "Localidade",
      date: "Data pretendida",
      time: "Hora pretendida",
      tvSize: "Tamanho da TV",
      wall: "Tipo de parede",
      support: "Tipo de suporte",
      cables: "Organização de cabos",
      notes: "Observações",
    };
    const intro = i18n.scheduleIntro || "Olá, gostaria de agendar uma instalação de TV na parede.";
    const closing = i18n.scheduleClosing || "Por favor confirme disponibilidade. Obrigado.";

    return [
      intro,
      "",
      labels.name + ": " + getFieldValue("scheduleName"),
      labels.phone + ": " + getFieldValue("schedulePhone"),
      labels.location + ": " + getFieldValue("scheduleLocation"),
      labels.date + ": " + getFieldValue("scheduleDate"),
      labels.time + ": " + getFieldValue("scheduleTime"),
      labels.tvSize + ": " + getFieldValue("scheduleTvSize"),
      labels.wall + ": " + getFieldValue("scheduleWall"),
      labels.support + ": " + getFieldValue("scheduleSupport"),
      labels.cables + ": " + getFieldValue("scheduleCables"),
      labels.notes + ": " + getFieldValue("scheduleNotes"),
      "",
      closing,
    ].join("\n");
  }

  openButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      openModal();
    });
  });

  closeButton && closeButton.addEventListener("click", closeModal);
  cancelButton && cancelButton.addEventListener("click", closeModal);

  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const i18n = window.WALLFIXTV_I18N || {};
    const privacyCheckbox = document.getElementById("schedulePrivacy");

    if (privacyCheckbox && !privacyCheckbox.checked) {
      markInvalidFields();
      if (errorBox) {
        errorBox.hidden = false;
        errorBox.textContent =
          i18n.privacyError || "Aceite a Política de Privacidade para continuar.";
      }
      return;
    }

    if (!form.checkValidity()) {
      markInvalidFields();
      if (errorBox) {
        errorBox.hidden = false;
        if (i18n.error) errorBox.textContent = i18n.error;
      }
      form.reportValidity();
      return;
    }

    if (errorBox) errorBox.hidden = true;
    const message = buildWhatsAppMessage();
    const url = WHATSAPP_URL + "?text=" + encodeURIComponent(message);
    window.open(url, "_blank", "noopener,noreferrer");
    closeModal();
  });

  form.addEventListener("input", () => {
    if (errorBox && form.checkValidity()) {
      const privacyCheckbox = document.getElementById("schedulePrivacy");
      if (!privacyCheckbox || privacyCheckbox.checked) {
        errorBox.hidden = true;
      }
    }

    form.querySelectorAll(".is-invalid").forEach((field) => {
      if (field.type === "checkbox") {
        if (field.checked) field.classList.remove("is-invalid");
        return;
      }
      if (field.value.trim()) {
        field.classList.remove("is-invalid");
      }
    });
  });

  const privacyCheckbox = document.getElementById("schedulePrivacy");
  if (privacyCheckbox) {
    privacyCheckbox.addEventListener("change", () => {
      if (privacyCheckbox.checked) {
        privacyCheckbox.classList.remove("is-invalid");
        if (errorBox && form.checkValidity()) {
          errorBox.hidden = true;
        }
      }
    });
  }
})();

const currentYear = document.getElementById("currentYear");
if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

document.querySelectorAll(".language-dropdown").forEach((dropdown) => {
  const toggle = dropdown.querySelector(".language-toggle");

  if (!toggle) return;

  toggle.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    const isOpen = dropdown.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  document.addEventListener("click", (event) => {
    if (!dropdown.contains(event.target)) {
      dropdown.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
});

(function () {
  const CTA_EVENT_MAP = {
    "local-whatsapp": "cta_whatsapp_click",
    "local-quote-checklist": "cta_whatsapp_click",
    "mobile-sticky-whatsapp": "cta_mobile_whatsapp_click",
    "local-price": "cta_price_click",
    "local-google-reviews": "cta_google_reviews_click",
    "cta_phone_click": "cta_phone_click",
  };

  function trackCta(eventName, location) {
    const eventData = { location: location || "" };
    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, eventData);
    }
    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event: eventName, ...eventData });
    }
  }

  document.addEventListener("click", (event) => {
    const target = event.target.closest("[data-cta]");
    if (!target) return;

    const cta = target.getAttribute("data-cta");
    const location = target.getAttribute("data-location") || "";
    const eventName = CTA_EVENT_MAP[cta];
    if (eventName) {
      trackCta(eventName, location);
    }
  });
})();
