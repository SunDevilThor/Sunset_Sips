(() => {
  const logger = window.SunsetSipsLogger;

  function renderUpcomingEvents() {
    const upcomingEventsGrid = document.querySelector("[data-upcoming-events-grid]");
    const upcomingEvents = window.SunsetSipsUpcomingEvents || [];

    if (!upcomingEventsGrid) {
      logger?.error("Upcoming events grid was not found. Upcoming events could not be rendered.");
      return;
    }

    upcomingEventsGrid.innerHTML = upcomingEvents.map((upcomingEvent) => `
      <article class="content-card reveal-on-scroll">
        <span class="pill">${upcomingEvent.category}</span>
        <h2>${upcomingEvent.title}</h2>
        <p><strong>${upcomingEvent.dateLabel}</strong></p>
        <p>${upcomingEvent.description}</p>
        <a class="button button-primary" href="contact.html">${upcomingEvent.callToAction}</a>
      </article>
    `).join("");

    logger?.info("Rendered upcoming event cards.", { upcomingEventCount: upcomingEvents.length });
    document.dispatchEvent(new Event("sunset-sips:dynamic-content-ready"));
  }

  document.addEventListener("DOMContentLoaded", renderUpcomingEvents);
})();
