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
  }

  function buildWhatsAppMessage() {
    return [
      "Olá, gostaria de agendar uma instalação de TV na parede.",
      "",
      "Nome: " + getFieldValue("scheduleName"),
      "Contacto: " + getFieldValue("schedulePhone"),
      "Localidade: " + getFieldValue("scheduleLocation"),
      "Data pretendida: " + getFieldValue("scheduleDate"),
      "Hora pretendida: " + getFieldValue("scheduleTime"),
      "Tamanho da TV: " + getFieldValue("scheduleTvSize"),
      "Tipo de parede: " + getFieldValue("scheduleWall"),
      "Tipo de suporte: " + getFieldValue("scheduleSupport"),
      "Organização de cabos: " + getFieldValue("scheduleCables"),
      "Observações: " + getFieldValue("scheduleNotes"),
      "",
      "Por favor confirme disponibilidade. Obrigado.",
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

    if (!form.checkValidity()) {
      markInvalidFields();
      if (errorBox) errorBox.hidden = false;
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
      errorBox.hidden = true;
    }

    form.querySelectorAll(".is-invalid").forEach((field) => {
      if (field.value.trim()) {
        field.classList.remove("is-invalid");
      }
    });
  });
})();
