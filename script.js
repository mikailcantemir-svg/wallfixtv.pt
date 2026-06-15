function toggleMenu() {
  const menu = document.getElementById("menu");
  menu.classList.toggle("open");
}

document.querySelectorAll("#menu a").forEach((link) => {
  link.addEventListener("click", () => {
    document.getElementById("menu").classList.remove("open");
  });
});
