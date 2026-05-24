(() => {
  const logger = window.SunsetSipsLogger;
  let revealObserver = null;

  function revealElementImmediately(revealElement) {
    revealElement.classList.add("is-visible");
  }

  function observeRevealElement(revealElement) {
    if (revealElement.classList.contains("is-visible")) {
      return;
    }

    if (!revealObserver) {
      revealElementImmediately(revealElement);
      return;
    }

    revealObserver.observe(revealElement);
  }

  function initializeScrollReveals() {
    const revealElements = document.querySelectorAll(".reveal-on-scroll:not(.is-visible)");

    if (!revealElements.length) {
      logger?.info("No new reveal-on-scroll elements were found for this page.");
      return;
    }

    if (!("IntersectionObserver" in window)) {
      revealElements.forEach(revealElementImmediately);
      logger?.warn("IntersectionObserver is not supported. Reveal elements were shown immediately.");
      return;
    }

    if (!revealObserver) {
      revealObserver = new IntersectionObserver((observerEntries) => {
        observerEntries.forEach((observerEntry) => {
          if (!observerEntry.isIntersecting) {
            return;
          }

          observerEntry.target.classList.add("is-visible");
          revealObserver.unobserve(observerEntry.target);
        });
      }, { threshold: 0.16 });
    }

    revealElements.forEach(observeRevealElement);
    logger?.info("Scroll reveal observer initialized or refreshed.", { revealElementCount: revealElements.length });
  }

  document.addEventListener("DOMContentLoaded", initializeScrollReveals);
  document.addEventListener("sunset-sips:dynamic-content-ready", initializeScrollReveals);
})();
