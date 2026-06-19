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

const BLOCKED_BOOKING_RANGE_START = "2026-06-22";
const BLOCKED_BOOKING_RANGE_END = "2026-06-26";

function isBlockedBookingDate(dateString) {
  if (!dateString || !/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return false;
  return (
    dateString >= BLOCKED_BOOKING_RANGE_START &&
    dateString <= BLOCKED_BOOKING_RANGE_END
  );
}

function formatBookingDateString(year, month, day) {
  return (
    String(year).padStart(4, "0") +
    "-" +
    String(month).padStart(2, "0") +
    "-" +
    String(day).padStart(2, "0")
  );
}

function formatBookingDisplayDate(dateString) {
  const monthNames = [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro",
  ];
  const parts = dateString.split("-").map(Number);
  return parts[2] + " de " + monthNames[parts[1] - 1] + " de " + parts[0];
}

function daysInBookingMonth(year, month) {
  if (month === 2) {
    const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    return isLeap ? 29 : 28;
  }
  return [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
}

function getBookingWeekdayMondayFirst(year, month, day) {
  const weekday = new Date(year, month - 1, day).getDay();
  return weekday === 0 ? 6 : weekday - 1;
}

(function () {
  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];
  const weekdayNames = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

  function initBookingCalendar(dateInput) {
    if (!dateInput || dateInput.dataset.bookingCalendarReady === "true") return;

    const field = dateInput.closest(".schedule-field");
    if (!field) return;

    const label = field.querySelector('label[for="scheduleDate"]');
    if (label && !label.id) {
      label.id = "scheduleDateLabel";
    }

    field.classList.add("schedule-date-field");
    dateInput.type = "hidden";
    dateInput.dataset.bookingCalendarReady = "true";
    dateInput.setAttribute("aria-hidden", "true");

    const calendar = document.createElement("div");
    calendar.className = "booking-calendar";
    calendar.id = "scheduleDateCalendar";
    calendar.setAttribute("role", "application");
    calendar.setAttribute("tabindex", "-1");
    if (label && label.id) {
      calendar.setAttribute("aria-labelledby", label.id);
    }

    const header = document.createElement("div");
    header.className = "booking-calendar-header";

    const prevButton = document.createElement("button");
    prevButton.type = "button";
    prevButton.className = "booking-calendar-nav";
    prevButton.setAttribute("data-action", "prev");
    prevButton.setAttribute("aria-label", "Mês anterior");
    prevButton.textContent = "‹";

    const monthLabel = document.createElement("p");
    monthLabel.className = "booking-calendar-month";
    monthLabel.id = "scheduleDateCalendarLabel";

    const nextButton = document.createElement("button");
    nextButton.type = "button";
    nextButton.className = "booking-calendar-nav";
    nextButton.setAttribute("data-action", "next");
    nextButton.setAttribute("aria-label", "Mês seguinte");
    nextButton.textContent = "›";

    header.append(prevButton, monthLabel, nextButton);

    const weekdays = document.createElement("div");
    weekdays.className = "booking-calendar-weekdays";
    weekdays.setAttribute("aria-hidden", "true");
    weekdayNames.forEach((name) => {
      const span = document.createElement("span");
      span.textContent = name;
      weekdays.appendChild(span);
    });

    const grid = document.createElement("div");
    grid.className = "booking-calendar-grid";
    grid.setAttribute("role", "grid");
    grid.setAttribute("aria-labelledby", "scheduleDateCalendarLabel");

    const selection = document.createElement("p");
    selection.className = "booking-calendar-selection";
    selection.id = "scheduleDateSelection";
    selection.setAttribute("aria-live", "polite");

    calendar.append(header, weekdays, grid, selection);
    dateInput.insertAdjacentElement("afterend", calendar);

    const now = new Date();
    let viewYear = now.getFullYear();
    let viewMonth = now.getMonth() + 1;

    if (dateInput.value && /^\d{4}-\d{2}-\d{2}$/.test(dateInput.value)) {
      const parts = dateInput.value.split("-").map(Number);
      viewYear = parts[0];
      viewMonth = parts[1];
    }

    if (isBlockedBookingDate(dateInput.value)) {
      dateInput.value = "";
    }

    function updateSelectionMessage() {
      if (dateInput.value && !isBlockedBookingDate(dateInput.value)) {
        selection.textContent = "Data selecionada: " + formatBookingDisplayDate(dateInput.value);
      } else {
        selection.textContent = "";
      }
    }

    function renderCalendar() {
      monthLabel.textContent = monthNames[viewMonth - 1] + " " + viewYear;
      grid.textContent = "";

      const leadingEmpty = getBookingWeekdayMondayFirst(viewYear, viewMonth, 1);
      for (let index = 0; index < leadingEmpty; index += 1) {
        const spacer = document.createElement("span");
        spacer.className = "calendar-day calendar-day-empty";
        spacer.setAttribute("aria-hidden", "true");
        grid.appendChild(spacer);
      }

      const totalDays = daysInBookingMonth(viewYear, viewMonth);
      for (let day = 1; day <= totalDays; day += 1) {
        const dateString = formatBookingDateString(viewYear, viewMonth, day);
        const dayButton = document.createElement("button");
        dayButton.type = "button";
        dayButton.className = "calendar-day";
        dayButton.textContent = String(day);
        dayButton.setAttribute("role", "gridcell");

        const readableDate =
          day + " de " + monthNames[viewMonth - 1].toLowerCase() + " de " + viewYear;

        if (isBlockedBookingDate(dateString)) {
          dayButton.classList.add("is-booked");
          dayButton.disabled = true;
          dayButton.setAttribute("aria-label", readableDate + ", Ocupado");
          dayButton.title = "Ocupado";
        } else {
          dayButton.setAttribute("aria-label", readableDate);
          dayButton.addEventListener("click", () => {
            dateInput.value = dateString;
            dateInput.classList.remove("is-invalid");
            updateSelectionMessage();
            renderCalendar();
            dateInput.dispatchEvent(new Event("input", { bubbles: true }));
          });
        }

        if (dateInput.value === dateString) {
          dayButton.classList.add("is-selected");
          dayButton.setAttribute("aria-pressed", "true");
        }

        grid.appendChild(dayButton);
      }

      updateSelectionMessage();
    }

    prevButton.addEventListener("click", () => {
      viewMonth -= 1;
      if (viewMonth < 1) {
        viewMonth = 12;
        viewYear -= 1;
      }
      renderCalendar();
    });

    nextButton.addEventListener("click", () => {
      viewMonth += 1;
      if (viewMonth > 12) {
        viewMonth = 1;
        viewYear += 1;
      }
      renderCalendar();
    });

    dateInput.addEventListener("change", () => {
      if (isBlockedBookingDate(dateInput.value)) {
        dateInput.value = "";
        dateInput.classList.add("is-invalid");
        updateSelectionMessage();
        renderCalendar();
      }
    });

    renderCalendar();
  }

  function initAllBookingCalendars() {
    document.querySelectorAll("#scheduleDate").forEach(initBookingCalendar);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAllBookingCalendars);
  } else {
    initAllBookingCalendars();
  }
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

    const selectedDate = getFieldValue("scheduleDate");
    if (selectedDate !== "—" && isBlockedBookingDate(selectedDate)) {
      markInvalidFields();
      const dateField = document.getElementById("scheduleDate");
      if (dateField) dateField.classList.add("is-invalid");
      if (errorBox) {
        errorBox.hidden = false;
        errorBox.textContent =
          i18n.blockedDateError ||
          "Esta data já está ocupada. Escolha outro dia disponível.";
      }
      const calendar = document.getElementById("scheduleDateCalendar");
      if (calendar) {
        calendar.focus();
      }
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

(function () {
  const lightbox = document.getElementById("galleryLightbox");
  if (!lightbox) return;

  const lightboxImage = document.getElementById("galleryLightboxImage");
  const lightboxSource = document.getElementById("galleryLightboxSource");
  const lightboxCaption = document.getElementById("galleryLightboxCaption");
  const closeButton = lightbox.querySelector(".gallery-lightbox-close");
  const prevButton = lightbox.querySelector(".gallery-lightbox-prev");
  const nextButton = lightbox.querySelector(".gallery-lightbox-next");
  const groups = new Map();
  let activeGroup = [];
  let activeIndex = 0;
  let lastFocusedElement = null;

  document.querySelectorAll("[data-lightbox-group]").forEach((container) => {
    const groupName = container.getAttribute("data-lightbox-group");
    const items = Array.from(container.querySelectorAll(".gallery-work-photo")).map((button) => {
      const img = button.querySelector("img");
      const source = button.querySelector("source");
      return {
        button,
        src: img ? img.getAttribute("src") : "",
        webp: source ? source.getAttribute("srcset") : "",
        alt: img ? img.getAttribute("alt") : "",
        width: img ? img.getAttribute("width") : "",
        height: img ? img.getAttribute("height") : "",
      };
    });

    groups.set(groupName, items);

    items.forEach((item, index) => {
      item.button.addEventListener("click", () => {
        openLightbox(groupName, index);
      });
    });
  });

  function renderSlide(index) {
    const item = activeGroup[index];
    if (!item || !lightboxImage) return;

    activeIndex = index;
    lightboxImage.src = item.src;
    lightboxImage.alt = item.alt;

    if (item.width) lightboxImage.setAttribute("width", item.width);
    if (item.height) lightboxImage.setAttribute("height", item.height);

    if (lightboxSource) {
      if (item.webp) {
        lightboxSource.srcset = item.webp;
        lightboxSource.removeAttribute("hidden");
      } else {
        lightboxSource.srcset = "";
      }
    }

    if (lightboxCaption) {
      lightboxCaption.textContent = item.alt;
    }

    const hasMultiple = activeGroup.length > 1;
    if (prevButton) prevButton.hidden = !hasMultiple;
    if (nextButton) nextButton.hidden = !hasMultiple;
  }

  function openLightbox(groupName, index) {
    activeGroup = groups.get(groupName) || [];
    if (!activeGroup.length) return;

    lastFocusedElement = document.activeElement;
    renderSlide(index);
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("gallery-lightbox-open");
    closeButton && closeButton.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("gallery-lightbox-open");

    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
    }
  }

  function showRelativeSlide(step) {
    if (!activeGroup.length) return;
    const nextIndex = (activeIndex + step + activeGroup.length) % activeGroup.length;
    renderSlide(nextIndex);
  }

  closeButton && closeButton.addEventListener("click", closeLightbox);
  prevButton && prevButton.addEventListener("click", () => showRelativeSlide(-1));
  nextButton && nextButton.addEventListener("click", () => showRelativeSlide(1));

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("is-open")) return;

    if (event.key === "Escape") {
      closeLightbox();
      return;
    }

    if (event.key === "ArrowLeft") showRelativeSlide(-1);
    if (event.key === "ArrowRight") showRelativeSlide(1);
  });
})();

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
