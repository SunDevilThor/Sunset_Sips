(() => {
  const logger = window.SunsetSipsLogger;

  function renderBtsItems() {
    const btsGrid = document.querySelector("[data-bts-grid]");
    const btsItems = window.SunsetSipsBtsItems || [];

    if (!btsGrid) {
      logger?.error("BTS grid was not found. BTS items could not be rendered.");
      return;
    }

    btsGrid.innerHTML = btsItems.map((btsItem) => {
      const reelLink = btsItem.reelUrl
        ? `<a class="button button-secondary" href="${btsItem.reelUrl}" target="_blank" rel="noopener">Watch BTS Reel</a>`
        : "";

      return `
        <article class="bts-card reveal-on-scroll">
          <img src="${btsItem.image}" alt="${btsItem.title}" loading="lazy">
          <h2>${btsItem.title}</h2>
          <p>${btsItem.description}</p>
          <p><strong>Behind the bar:</strong> ${btsItem.detail}</p>
          <div class="hero-actions">${reelLink}</div>
        </article>
      `;
    }).join("");

    logger?.info("Rendered BTS cards.", { btsItemCount: btsItems.length });
    document.dispatchEvent(new Event("sunset-sips:dynamic-content-ready"));
  }

  document.addEventListener("DOMContentLoaded", renderBtsItems);
})();
