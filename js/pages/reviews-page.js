(() => {
  const logger = window.SunsetSipsLogger;

  function renderReviews() {
    const reviewsGrid = document.querySelector("[data-reviews-grid]");
    const reviews = window.SunsetSipsReviews || [];

    if (!reviewsGrid) {
      logger?.error("Reviews grid was not found. Reviews could not be rendered.");
      return;
    }

    reviewsGrid.innerHTML = reviews.map((reviewItem) => `
      <article class="review-card reveal-on-scroll">
        <img src="${reviewItem.image}" alt="Recommendation from ${reviewItem.author}" loading="lazy">
        <p>${reviewItem.quote}</p>
        <p class="review-author">— ${reviewItem.author}</p>
      </article>
    `).join("");

    logger?.info("Rendered review cards.", { reviewCount: reviews.length });
    document.dispatchEvent(new Event("sunset-sips:dynamic-content-ready"));
  }

  document.addEventListener("DOMContentLoaded", renderReviews);
})();
