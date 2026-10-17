
/* ==========================================================
   TIGER HOME HEALTH CARE, LLC
   Website interactions — no external JavaScript libraries
   ========================================================== */

(() => {
  "use strict";

  // Find the elements needed for the interactive features.
  const menuToggle = document.querySelector(".menu-toggle");
  const mobileMenu = document.querySelector("#mobile-menu");
  const desktopLinks = document.querySelectorAll(
    ".desktop-nav .nav-link"
  );
  const yearNode = document.querySelector("#current-year");

  // Update the copyright year automatically.
  if (yearNode) {
    yearNode.textContent = String(new Date().getFullYear());
  }

  // ---------------- MOBILE NAVIGATION ----------------
  if (menuToggle && mobileMenu) {
    const mobileLinks = mobileMenu.querySelectorAll("a");

    // Keep the menu's visible state and accessibility attributes in sync.
    function setMenuOpen(shouldOpen) {
      menuToggle.setAttribute(
        "aria-expanded",
        String(shouldOpen)
      );

      menuToggle.setAttribute(
        "aria-label",
        shouldOpen
          ? "Close navigation menu"
          : "Open navigation menu"
      );

      mobileMenu.hidden = !shouldOpen;
    }

    // Open or close the menu when the menu button is clicked.
    menuToggle.addEventListener("click", () => {
      const isOpen =
        menuToggle.getAttribute("aria-expanded") === "true";

      setMenuOpen(!isOpen);
    });

    // Close the menu after a visitor selects a destination.
    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
        setMenuOpen(false);
      });
    });

    // Allow keyboard users to close the menu with Escape.
    document.addEventListener("keydown", (event) => {
      const isOpen =
        menuToggle.getAttribute("aria-expanded") === "true";

      if (event.key === "Escape" && isOpen) {
        setMenuOpen(false);
        menuToggle.focus();
      }
    });

    // Reset the menu if the browser changes to desktop width.
    const desktopBreakpoint = window.matchMedia(
      "(min-width: 901px)"
    );

    desktopBreakpoint.addEventListener("change", (event) => {
      if (event.matches) {
        setMenuOpen(false);
      }
    });
  }

  // ---------------- ACTIVE DESKTOP NAVIGATION ----------------
  // Highlight the navigation link for the section being viewed.
  // The page still works normally if IntersectionObserver is unavailable.
  if (
    desktopLinks.length &&
    "IntersectionObserver" in window
  ) {
    const sections = Array.from(desktopLinks)
      .map((link) => {
        return document.querySelector(
          link.getAttribute("href")
        );
      })
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              b.intersectionRatio - a.intersectionRatio
          );

        // Home is active when the visitor is at the top of the page.
        const currentId =
          window.scrollY < 80
            ? "#home"
            : visibleSections.length
              ? `#${visibleSections[0].target.id}`
              : null;

        if (!currentId) return;

        desktopLinks.forEach((link) => {
          const isActive =
            link.getAttribute("href") === currentId;

          link.classList.toggle("is-active", isActive);

          if (isActive) {
            link.setAttribute("aria-current", "location");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      },
      {
        root: null,
        rootMargin: "-12% 0px -72% 0px",
        threshold: [0, 0.15, 0.35, 0.6]
      }
    );

    sections.forEach((section) => {
      observer.observe(section);
    });
  }
})();
