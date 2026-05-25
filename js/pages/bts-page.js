(() => {
  const logger = window.SunsetSipsLogger;

  function normalizeBtsImages(btsItem) {
    if (Array.isArray(btsItem.images) && btsItem.images.length) {
      return btsItem.images;
    }

    if (btsItem.image) {
      logger?.warn("BTS item used the legacy single image field. Falling back to that image.", {
        title: btsItem.title,
        image: btsItem.image
      });
      return [btsItem.image];
    }

    logger?.warn("BTS item did not include any image paths.", { title: btsItem.title });
    return [];
  }

  function createBtsCarousel(btsItem, btsIndex) {
    const images = normalizeBtsImages(btsItem);
    const carouselId = `bts-carousel-${btsIndex}`;
    const hasMultipleImages = images.length > 1;
    const imageFitClassName = btsItem.imageFit === "contain" ? " bts-carousel-contain" : "";

    if (!images.length) {
      return `
        <div class="bts-carousel bts-carousel-empty" aria-label="No images available for ${btsItem.title}">
          <p>No BTS images available yet.</p>
        </div>
      `;
    }

    const carouselSlides = images.map((imagePath, imageIndex) => {
      const activeClassName = imageIndex === 0 ? " is-active" : "";

      return `
        <img
          class="bts-carousel-image${activeClassName}"
          src="${imagePath}"
          alt="${btsItem.title} behind-the-scenes image ${imageIndex + 1} of ${images.length}"
          loading="lazy"
          data-bts-carousel-image
        >
      `;
    }).join("");

    const controlsMarkup = hasMultipleImages
      ? `
        <button class="bts-carousel-button bts-carousel-button-previous" type="button" data-bts-carousel-previous aria-label="Show previous image for ${btsItem.title}">‹</button>
        <button class="bts-carousel-button bts-carousel-button-next" type="button" data-bts-carousel-next aria-label="Show next image for ${btsItem.title}">›</button>
        <span class="bts-carousel-count" data-bts-carousel-count>1 / ${images.length}</span>
      `
      : `<span class="bts-carousel-count">1 / 1</span>`;

    return `
            <div class="bts-carousel${imageFitClassName}" id="${carouselId}" data-bts-carousel data-current-image-index="0" aria-label="${btsItem.title} image carousel">
        ${carouselSlides}
        ${controlsMarkup}
      </div>
    `;
  }

  function updateBtsCarousel(carouselElement, nextImageIndex) {
    const carouselImages = Array.from(carouselElement.querySelectorAll("[data-bts-carousel-image]"));
    const carouselCount = carouselElement.querySelector("[data-bts-carousel-count]");
    const totalImageCount = carouselImages.length;

    if (!totalImageCount) {
      logger?.warn("BTS carousel update was skipped because no images were found.");
      return;
    }

    const wrappedImageIndex = (nextImageIndex + totalImageCount) % totalImageCount;

    carouselImages.forEach((carouselImage, imageIndex) => {
      carouselImage.classList.toggle("is-active", imageIndex === wrappedImageIndex);
    });

    carouselElement.dataset.currentImageIndex = String(wrappedImageIndex);

    if (carouselCount) {
      carouselCount.textContent = `${wrappedImageIndex + 1} / ${totalImageCount}`;
    }

    logger?.info("BTS carousel image changed.", {
      wrappedImageIndex,
      totalImageCount
    });
  }

  function initializeBtsCarousels() {
    const carouselElements = document.querySelectorAll("[data-bts-carousel]");

    carouselElements.forEach((carouselElement) => {
      const previousButton = carouselElement.querySelector("[data-bts-carousel-previous]");
      const nextButton = carouselElement.querySelector("[data-bts-carousel-next]");

      if (previousButton) {
        previousButton.addEventListener("click", () => {
          const currentImageIndex = Number(carouselElement.dataset.currentImageIndex || "0");
          updateBtsCarousel(carouselElement, currentImageIndex - 1);
        });
      }

      if (nextButton) {
        nextButton.addEventListener("click", () => {
          const currentImageIndex = Number(carouselElement.dataset.currentImageIndex || "0");
          updateBtsCarousel(carouselElement, currentImageIndex + 1);
        });
      }
    });

    logger?.info("BTS carousel controls initialized.", { carouselCount: carouselElements.length });
  }

  function renderBtsItems() {
    const btsGrid = document.querySelector("[data-bts-grid]");
    const btsItems = window.SunsetSipsBtsItems || [];

    if (!btsGrid) {
      logger?.error("BTS grid was not found. BTS items could not be rendered.");
      return;
    }

    btsGrid.innerHTML = btsItems.map((btsItem, btsIndex) => {
      const reelLink = btsItem.reelUrl
        ? `<a class="button button-secondary" href="${btsItem.reelUrl}" target="_blank" rel="noopener">Watch BTS Reel</a>`
        : "";

      return `
        <article class="bts-card reveal-on-scroll">
          ${createBtsCarousel(btsItem, btsIndex)}
          <h2>${btsItem.title}</h2>
          <p>${btsItem.description}</p>
          <p><strong>Behind the bar:</strong> ${btsItem.detail}</p>
          <div class="hero-actions">${reelLink}</div>
        </article>
      `;
    }).join("");

    initializeBtsCarousels();
    logger?.info("Rendered BTS cards.", { btsItemCount: btsItems.length });
    document.dispatchEvent(new Event("sunset-sips:dynamic-content-ready"));
  }

  document.addEventListener("DOMContentLoaded", renderBtsItems);
})();
