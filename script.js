function toggleMenu() {
  const menu = document.getElementById("mainMenu");
  menu.classList.toggle("open");
}

document.querySelectorAll("#mainMenu a").forEach((link) => {
  link.addEventListener("click", () => {
    document.getElementById("mainMenu").classList.remove("open");
  });
});
