(function () {
  const menuButton = document.querySelector(".menu-button");
  const menu = document.getElementById("mainMenu");
  const navLinks = document.querySelectorAll("#mainMenu a, .footer-col nav a");

  if (menuButton && menu) {
    menuButton.addEventListener("click", () => {
      const isOpen = menu.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (menu) menu.classList.remove("open");
      if (menuButton) menuButton.setAttribute("aria-expanded", "false");
    });
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
