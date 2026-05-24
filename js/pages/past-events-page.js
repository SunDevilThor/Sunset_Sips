(() => {
  const logger = window.SunsetSipsLogger;
  const allFilterValue = "All";

  function createEventCard(eventItem) {
    const eventCard = document.createElement("article");
    eventCard.className = "event-card reveal-on-scroll";
    eventCard.dataset.category = eventItem.category;

    const watchReelLink = eventItem.reelUrl
      ? `<a class="button button-secondary" href="${eventItem.reelUrl}" target="_blank" rel="noopener">Watch Reel</a>`
      : "";

    eventCard.innerHTML = `
      <img src="${eventItem.image}" alt="${eventItem.title} event preview" loading="lazy">
      <div class="event-card-body">
        <div class="event-meta">
          <span class="pill">${eventItem.category}</span>
          <span class="pill">${eventItem.dateLabel}</span>
        </div>
        <h2>${eventItem.title}</h2>
        <p>${eventItem.description}</p>
        <p><strong>Why it matters:</strong> ${eventItem.highlight}</p>
        <div class="tag-list">
          ${eventItem.tags.map((tagText) => `<span class="pill">${tagText}</span>`).join("")}
        </div>
        <div class="hero-actions">
          ${watchReelLink}
          <a class="button button-primary" href="contact.html">Plan Something Similar</a>
        </div>
      </div>
    `;

    return eventCard;
  }

  function renderFilterButtons(events) {
    const filterBar = document.querySelector("[data-event-filters]");

    if (!filterBar) {
      logger?.warn("Event filter bar was not found.");
      return;
    }

    const categories = [allFilterValue, ...new Set(events.map((eventItem) => eventItem.category))];
    filterBar.innerHTML = categories.map((categoryName) => {
      const activeClassName = categoryName === allFilterValue ? " is-active" : "";
      return `<button class="filter-button${activeClassName}" type="button" data-filter-value="${categoryName}">${categoryName}</button>`;
    }).join("");

    logger?.info("Rendered event filter buttons.", { categories });
  }

  function renderEvents(events) {
    const eventsGrid = document.querySelector("[data-events-grid]");

    if (!eventsGrid) {
      logger?.error("Past events grid was not found. Event cards could not be rendered.");
      return;
    }

    eventsGrid.innerHTML = "";
    events.forEach((eventItem) => eventsGrid.appendChild(createEventCard(eventItem)));
    logger?.info("Rendered past event cards.", { eventCount: events.length });
  }

  function initializeFiltering() {
    const filterBar = document.querySelector("[data-event-filters]");
    const emptyState = document.querySelector("[data-events-empty]");

    if (!filterBar) {
      return;
    }

    filterBar.addEventListener("click", (event) => {
      const clickedFilterButton = event.target.closest("[data-filter-value]");

      if (!clickedFilterButton) {
        return;
      }

      const selectedFilter = clickedFilterButton.dataset.filterValue;
      const eventCards = document.querySelectorAll(".event-card");
      let visibleCardCount = 0;

      filterBar.querySelectorAll(".filter-button").forEach((filterButton) => {
        filterButton.classList.toggle("is-active", filterButton === clickedFilterButton);
      });

      eventCards.forEach((eventCard) => {
        const shouldShowCard = selectedFilter === allFilterValue || eventCard.dataset.category === selectedFilter;
        eventCard.hidden = !shouldShowCard;

        if (shouldShowCard) {
          visibleCardCount += 1;
        }
      });

      emptyState?.classList.toggle("is-visible", visibleCardCount === 0);
      logger?.info("Past events filter applied.", { selectedFilter, visibleCardCount });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    const events = window.SunsetSipsPastEvents || [];
    renderFilterButtons(events);
    renderEvents(events);
    initializeFiltering();
    document.dispatchEvent(new Event("sunset-sips:dynamic-content-ready"));
  });
})();
