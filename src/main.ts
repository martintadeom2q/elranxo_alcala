import "@fontsource/barlow-condensed/latin-700.css";
import "@fontsource/barlow-condensed/latin-800.css";
import "@fontsource/dm-sans/latin-400.css";
import "@fontsource/dm-sans/latin-500.css";
import "@fontsource/dm-sans/latin-700.css";
import "./style.css";

const menuToggle = document.querySelector<HTMLButtonElement>(".menu-toggle")!;
const mobileNav = document.querySelector<HTMLElement>("#mobile-nav")!;
function closeMenu() {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Abrir menú");
  mobileNav.hidden = true;
}
menuToggle.addEventListener("click", () => {
  const opening = menuToggle.getAttribute("aria-expanded") !== "true";
  menuToggle.setAttribute("aria-expanded", String(opening));
  menuToggle.setAttribute("aria-label", opening ? "Cerrar menú" : "Abrir menú");
  mobileNav.hidden = !opening;
});
mobileNav
  .querySelectorAll("a")
  .forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMenu();
});
window.matchMedia("(min-width: 901px)").addEventListener("change", (e) => {
  if (e.matches) closeMenu();
});

const orderDialog = document.querySelector<HTMLDialogElement>(".order-dialog")!;
const privacyDialog =
  document.querySelector<HTMLDialogElement>(".privacy-dialog")!;
let previousFocus: HTMLElement | null = null;
function openDialog(dialog: HTMLDialogElement) {
  previousFocus = document.activeElement as HTMLElement;
  closeMenu();
  dialog.showModal();
  document.body.classList.add("dialog-open");
}
document.querySelectorAll<HTMLElement>("[data-order]").forEach((button) =>
  button.addEventListener("click", (event) => {
    event.preventDefault();
    openDialog(orderDialog);
  }),
);
document
  .querySelector<HTMLButtonElement>("[data-privacy]")!
  .addEventListener("click", () => openDialog(privacyDialog));
[orderDialog, privacyDialog].forEach((dialog) => {
  dialog.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;
    const focusable = Array.from(
      dialog.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"),
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  dialog
    .querySelector<HTMLButtonElement>("[data-close]")!
    .addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (e) => {
    const bounds = dialog.getBoundingClientRect();
    if (
      e.target === dialog &&
      (e.clientX < bounds.left ||
        e.clientX > bounds.right ||
        e.clientY < bounds.top ||
        e.clientY > bounds.bottom)
    )
      dialog.close();
  });
  dialog.addEventListener("close", () => {
    document.body.classList.remove("dialog-open");
    // A mobile menu trigger is hidden after closing its menu: use the visible toggle instead.
    if (previousFocus && previousFocus.getClientRects().length > 0)
      previousFocus.focus();
    else menuToggle.focus();
  });
});

// Collapsible answers stay native and functional without extra scripts.
document
  .querySelectorAll<HTMLDetailsElement>(".faq-list details")
  .forEach((details) =>
    details.addEventListener("toggle", () => {
      if (details.open)
        document
          .querySelectorAll<HTMLDetailsElement>(".faq-list details")
          .forEach((other) => {
            if (other !== details) other.open = false;
          });
    }),
  );
