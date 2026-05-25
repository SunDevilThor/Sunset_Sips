(() => {
  const logger = window.SunsetSipsLogger;
  const allFilterValue = "All";

  function getEventImages(eventItem) {
    if (Array.isArray(eventItem.images) && eventItem.images.length) {
      return eventItem.images;
    }

    if (eventItem.image) {
      return [eventItem.image];
    }

    logger?.warn("Past event was missing image data.", { title: eventItem.title });
    return [];
  }

  function createCarouselMarkup(eventItem, eventImages) {
    if (!eventImages.length) {
      return "";
    }

    const imageSlides = eventImages.map((imagePath, imageIndex) => {
      const activeClassName = imageIndex === 0 ? " is-active" : "";
      const lazyLoading = imageIndex === 0 ? "eager" : "lazy";

      return `
        <img
          class="event-carousel-image${activeClassName}"
          src="${imagePath}"
          alt="${eventItem.title} event preview ${imageIndex + 1} of ${eventImages.length}"
          loading="${lazyLoading}"
          data-carousel-image
        >
      `;
    }).join("");

    const controlsMarkup = eventImages.length > 1
      ? `
        <button class="event-carousel-button event-carousel-button-previous" type="button" data-carousel-direction="-1" aria-label="Show previous image for ${eventItem.title}">‹</button>
        <button class="event-carousel-button event-carousel-button-next" type="button" data-carousel-direction="1" aria-label="Show next image for ${eventItem.title}">›</button>
        <span class="event-carousel-count" data-carousel-count>1 / ${eventImages.length}</span>
      `
      : "";

    const imageFitClassName = eventItem.imageFit === "contain" ? " event-carousel-contain" : "";

    return `
      <div class="event-carousel${imageFitClassName}" data-event-carousel>
        ${imageSlides}
        ${controlsMarkup}
      </div>
    `;
  }

  function createEventCard(eventItem) {
    const eventCard = document.createElement("article");
    const eventImages = getEventImages(eventItem);
    eventCard.className = "event-card reveal-on-scroll";
    eventCard.dataset.category = eventItem.category;

    const watchReelLink = eventItem.reelUrl
      ? `<a class="button button-secondary" href="${eventItem.reelUrl}" target="_blank" rel="noopener">Watch Reel</a>`
      : "";

    eventCard.innerHTML = `
      ${createCarouselMarkup(eventItem, eventImages)}
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

  function showCarouselImage(carouselElement, nextImageIndex) {
    const carouselImages = [...carouselElement.querySelectorAll("[data-carousel-image]")];
    const carouselCount = carouselElement.querySelector("[data-carousel-count]");

    if (!carouselImages.length) {
      logger?.warn("Carousel navigation was requested but no carousel images were found.");
      return;
    }

    const normalizedImageIndex = (nextImageIndex + carouselImages.length) % carouselImages.length;

    carouselImages.forEach((carouselImage, imageIndex) => {
      carouselImage.classList.toggle("is-active", imageIndex === normalizedImageIndex);
    });

    if (carouselCount) {
      carouselCount.textContent = `${normalizedImageIndex + 1} / ${carouselImages.length}`;
    }

    logger?.info("Past event carousel image changed.", {
      normalizedImageIndex,
      carouselImageCount: carouselImages.length
    });
  }

  function initializeCarouselControls() {
    const eventsGrid = document.querySelector("[data-events-grid]");

    if (!eventsGrid) {
      logger?.warn("Past events grid was not found. Carousel controls were not initialized.");
      return;
    }

    eventsGrid.addEventListener("click", (event) => {
      const carouselButton = event.target.closest("[data-carousel-direction]");

      if (!carouselButton) {
        return;
      }

      const carouselElement = carouselButton.closest("[data-event-carousel]");
      const carouselImages = [...carouselElement.querySelectorAll("[data-carousel-image]")];
      const activeImageIndex = carouselImages.findIndex((carouselImage) => carouselImage.classList.contains("is-active"));
      const direction = Number(carouselButton.dataset.carouselDirection);

      if (!Number.isFinite(direction)) {
        logger?.warn("Carousel direction was invalid.", { directionValue: carouselButton.dataset.carouselDirection });
        return;
      }

      showCarouselImage(carouselElement, activeImageIndex + direction);
    });

    logger?.info("Past event carousel controls initialized.");
  }

  document.addEventListener("DOMContentLoaded", () => {
    const events = window.SunsetSipsPastEvents || [];
    renderFilterButtons(events);
    renderEvents(events);
    initializeFiltering();
    initializeCarouselControls();
    document.dispatchEvent(new Event("sunset-sips:dynamic-content-ready"));
  });
})();
