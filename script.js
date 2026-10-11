
/* ==========================================================
   TIGER HOME HEALTH CARE — JAVASCRIPT
   Mobile menu, navigation accessibility, and copyright year.
   ========================================================== */

(() => {
  // Find the website elements we need to control.
  const header = document.querySelector(".site-header");
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#primary-nav");
  const year = document.querySelector("#current-year");

  // Automatically show the current year in the footer.
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // Open and close the navigation menu on smaller screens.
  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      // Read the current open/closed state of the menu.
      const isOpen =
        menuButton.getAttribute("aria-expanded") === "true";

      // Update the accessibility state and button label.
      menuButton.setAttribute("aria-expanded", String(!isOpen));
      menuButton.setAttribute(
        "aria-label",
        isOpen ? "Open navigation" : "Close navigation"
      );

      // Show the menu when opening, hide it when closing.
      nav.classList.toggle("open", !isOpen);
    });

    // Close the mobile menu after a visitor selects a link.
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Open navigation");
        nav.classList.remove("open");
      });
    });

    // Let keyboard users close the menu with Escape.
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Open navigation");
        nav.classList.remove("open");
      }
    });
  }

  // Add a subtle shadow to the header after scrolling down.
  const setHeaderShadow = () => {
    if (header) {
      header.classList.toggle("scrolled", window.scrollY > 8);
    }
  };

  // Run the header check while the page scrolls.
  window.addEventListener("scroll", setHeaderShadow, {
    passive: true
  });

  // Set the correct initial header appearance.
  setHeaderShadow();
})();
