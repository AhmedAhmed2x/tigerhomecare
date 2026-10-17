
/* ==========================================================
   TIGER HOME HEALTH CARE, LLC
   Main website JavaScript
   Compatible with index.html and style.css from Steps 1–2.
   No external JavaScript libraries required.
   ========================================================== */

(() => {
  "use strict";

  /* --------------------------------------------------------
     1. SELECT PAGE ELEMENTS
     -------------------------------------------------------- */

  const menuToggle = document.querySelector(".menu-toggle");
  const mobileMenu = document.querySelector("#mobile-menu");

  const desktopLinks = Array.from(
    document.querySelectorAll(".desktop-nav .nav-link")
  );

  const yearElement = document.querySelector("#current-year");


  /* --------------------------------------------------------
     2. AUTOMATIC COPYRIGHT YEAR
     -------------------------------------------------------- */

  if (yearElement) {
    yearElement.textContent = String(new Date().getFullYear());
  }


  /* --------------------------------------------------------
     3. MOBILE NAVIGATION
     Open and close the mobile menu safely.
     -------------------------------------------------------- */

  if (menuToggle && mobileMenu) {
    const mobileLinks = Array.from(
      mobileMenu.querySelectorAll("a")
    );

    /**
     * Updates the mobile menu's visibility, button label,
     * and ARIA state together.
     *
     * @param {boolean} shouldOpen - Whether the menu should open.
     */
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


    // Toggle the menu when the visitor presses the menu button.
    menuToggle.addEventListener("click", () => {
      const currentlyOpen =
        menuToggle.getAttribute("aria-expanded") === "true";

      setMenuOpen(!currentlyOpen);
    });


    // Close the menu when the visitor chooses a navigation link.
    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
        setMenuOpen(false);
      });
    });


    // Allow keyboard users to close the menu using Escape.
    document.addEventListener("keydown", (event) => {
      const currentlyOpen =
        menuToggle.getAttribute("aria-expanded") === "true";

      if (event.key === "Escape" && currentlyOpen) {
        setMenuOpen(false);
        menuToggle.focus();
      }
    });


    // Close the mobile menu if the viewport changes to desktop.
    const desktopBreakpoint = window.matchMedia(
      "(min-width: 901px)"
    );

    function handleBreakpointChange(event) {
      if (event.matches) {
        setMenuOpen(false);
      }
    }

    // Support modern browsers and older browser implementations.
    if (desktopBreakpoint.addEventListener) {
      desktopBreakpoint.addEventListener(
        "change",
        handleBreakpointChange
      );
    } else {
      desktopBreakpoint.addListener(handleBreakpointChange);
    }
  }


  /* --------------------------------------------------------
     4. ACTIVE DESKTOP NAVIGATION
     Highlight the link corresponding to the visible section.
     -------------------------------------------------------- */

  if (desktopLinks.length > 0) {
    const sections = desktopLinks
      .map((link) => {
        const targetId = link.getAttribute("href");

        // Only observe valid in-page links.
        if (!targetId || !targetId.startsWith("#")) {
          return null;
        }

        return document.querySelector(targetId);
      })
      .filter(Boolean);

    /**
     * Applies the active state to the correct desktop link.
     *
     * @param {string} sectionId - ID of the current section.
     */
    function setActiveNavigation(sectionId) {
      desktopLinks.forEach((link) => {
        const isActive =
          link.getAttribute("href") === `#${sectionId}`;

        link.classList.toggle("is-active", isActive);

        if (isActive) {
          link.setAttribute("aria-current", "location");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    }


    // Start with Home active.
    setActiveNavigation("home");


    // Observe visible sections without running a scroll handler
    // on every single pixel of movement.
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          // When several sections intersect, choose the one
          // nearest the top of the viewport.
          const visibleSections = entries
            .filter((entry) => entry.isIntersecting)
            .sort(
              (a, b) =>
                a.boundingClientRect.top -
                b.boundingClientRect.top
            );

          if (visibleSections.length > 0) {
            setActiveNavigation(
              visibleSections[0].target.id
            );
          }
        },
        {
          root: null,
          rootMargin: "-15% 0px -72% 0px",
          threshold: [0, 0.1, 0.25, 0.5]
        }
      );

      sections.forEach((section) => {
        observer.observe(section);
      });

      // Keep Home active when the visitor returns to the top.
      window.addEventListener(
        "scroll",
        () => {
          if (window.scrollY < 80) {
            setActiveNavigation("home");
          }
        },
        { passive: true }
      );
    } else {
      // Fallback for browsers without IntersectionObserver.
      window.addEventListener(
        "scroll",
        () => {
          if (window.scrollY < 80) {
            setActiveNavigation("home");
          }
        },
        { passive: true }
      );
    }
  }


  /* --------------------------------------------------------
     5. IMAGE ERROR DIAGNOSTICS
     Log missing image paths so they can be identified easily.
     This does not replace missing photos with fake content.
     -------------------------------------------------------- */

  document.querySelectorAll("img").forEach((imageElement) => {
    imageElement.addEventListener("error", () => {
      console.error(
        "[Tiger Home Health Care] Image failed to load:",
        imageElement.getAttribute("src")
      );
    });
  });


  /* --------------------------------------------------------
     6. INITIALIZATION CHECK
     Confirms that the script loaded successfully.
     -------------------------------------------------------- */

  console.info(
    "Tiger Home Health Care website JavaScript initialized."
  );

})();
