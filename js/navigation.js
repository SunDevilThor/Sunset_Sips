(() => {
  const logger = window.SunsetSipsLogger;

  function normalizePath(pathValue) {
    const fileName = pathValue.split("/").filter(Boolean).pop();
    return fileName || "index.html";
  }

  function setCurrentNavigationLink() {
    const currentFileName = normalizePath(window.location.pathname);
    const navigationLinks = document.querySelectorAll("[data-nav-link]");

    navigationLinks.forEach((navigationLink) => {
      const linkFileName = normalizePath(navigationLink.getAttribute("href") || "index.html");

      if (linkFileName === currentFileName) {
        navigationLink.setAttribute("aria-current", "page");
      }
    });

    logger?.info("Navigation current page state updated.", { currentFileName, navigationLinkCount: navigationLinks.length });
  }

  function initializeMobileNavigation() {
    const navigationToggleButton = document.querySelector("[data-nav-toggle]");
    const navigationLinksContainer = document.querySelector("[data-nav-links]");

    if (!navigationToggleButton || !navigationLinksContainer) {
      logger?.warn("Mobile navigation controls were not found.", {
        hasNavigationToggleButton: Boolean(navigationToggleButton),
        hasNavigationLinksContainer: Boolean(navigationLinksContainer)
      });
      return;
    }

    navigationToggleButton.addEventListener("click", () => {
      const navigationIsOpen = document.body.classList.toggle("nav-open");
      navigationToggleButton.setAttribute("aria-expanded", String(navigationIsOpen));
      logger?.info("Mobile navigation toggled.", { navigationIsOpen });
    });

    navigationLinksContainer.addEventListener("click", (event) => {
      const clickedLink = event.target.closest("a");

      if (!clickedLink) {
        return;
      }

      document.body.classList.remove("nav-open");
      navigationToggleButton.setAttribute("aria-expanded", "false");
      logger?.info("Mobile navigation closed after link click.", { clickedHref: clickedLink.href });
    });
  }

  function initializeHeaderScrollState() {
    const siteHeader = document.querySelector("[data-site-header]");

    if (!siteHeader) {
      logger?.warn("Site header was not found for scroll state handling.");
      return;
    }

    function updateHeaderScrollState() {
      siteHeader.classList.toggle("is-scrolled", window.scrollY > 8);
    }

    updateHeaderScrollState();
    window.addEventListener("scroll", updateHeaderScrollState, { passive: true });
  }

  document.addEventListener("DOMContentLoaded", () => {
    setCurrentNavigationLink();
    initializeMobileNavigation();
    initializeHeaderScrollState();
  });
})();
