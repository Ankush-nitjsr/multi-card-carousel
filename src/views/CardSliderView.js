export class CardSliderView {
  constructor(root, model) {
    this.root = root;
    this.model = model;

    this.cardClickHandler = null;
    this.arrowClickHandler = null;
    this.detailsPagerHandler = null;
    this.closeHandler = null;
  }

  onCardClick(handler) {
    this.cardClickHandler = handler;
  }
  onArrowClick(handler) {
    this.arrowClickHandler = handler;
  }
  onDetailsPagerClick(handler) {
    this.detailsPagerHandler = handler;
  }
  onClose(handler) {
    this.closeHandler = handler;
  }

  renderDeck() {
    this.root.innerHTML = `
      <div class="slider-container">
        ${this.model.cards
          .slice(0, 7)
          .map(
            (card, idx) => `
          <div class="card" data-idx="${idx}">
            <img src="${card.image}" alt="${card.title}" />
            <h3>${card.title}</h3>
          </div>
        `
          )
          .join("")}
      </div>
    `;

    this.root.querySelectorAll(".card").forEach((cardEl) => {
      cardEl.addEventListener("click", () => {
        const idx = Number(cardEl.dataset.idx);
        this.cardClickHandler && this.cardClickHandler(idx);
      });
    });
  }

  renderCarousel() {
    const cards = this.model.cards || [];
    const active = this.model.selectedIndex;
    if (active == null || !cards.length) return;

    const prev = (active - 1 + cards.length) % cards.length;
    const next = (active + 1) % cards.length;

    const card = cards[active];
    const detailsText = this.model.getCurrentDetailsContent();
    const detailsCount = this.model.detailsPageCount();
    const detailsIndex = this.model.detailsPage;

    const short = (txt, n = 90) =>
      txt && txt.length > n ? txt.slice(0, n).trim() + "…" : txt || "";
    const tags = card?.tags && card.tags.length ? card.tags : ["Featured"];

    // Build pager only if more than one detail page
    const hasPager = detailsCount > 1;
    const pagerHTML = hasPager
      ? `
      <div class="panel-pager" aria-label="Details pager">
        <button class="pager-btn" id="pager-up" aria-label="Previous details">▲</button>
        <div class="pager-index" aria-live="polite">${
          detailsIndex + 1
        } / ${detailsCount}</div>
        <button class="pager-btn" id="pager-down" aria-label="Next details">▼</button>
      </div>
    `
      : "";

    // Footer progress (only when multiple pages)
    const footerProgressHTML = hasPager
      ? `
      <div class="dp-progress">
        <span id="dp-progress-index">${detailsIndex + 1}</span> /
        <span id="dp-progress-total">${detailsCount}</span>
      </div>
    `
      : `<div class="dp-progress" aria-hidden="true"></div>`;

    this.root.innerHTML = `
      <div class="carousel-shell">
        <div class="carousel-stage">
          <button class="nav h-arrow left-arrow" id="arrow-left" aria-label="Previous">‹</button>

          ${cards
            .map(
              (c, i) => `
            <div class="slide ${
              i === active
                ? "active"
                : i === prev
                ? "prev"
                : i === next
                ? "next"
                : "faded"
            }" data-idx="${i}">
              <img src="${c.image}" alt="${c.title}" />
              <h3>${c.title}</h3>
            </div>
          `
            )
            .join("")}

          <button class="nav h-arrow right-arrow" id="arrow-right" aria-label="Next">›</button>
        </div>

        <!-- Details panel shows *pages within the selected card* -->
        <aside class="details-panel" role="dialog" aria-modal="true" aria-labelledby="dp-title" aria-describedby="dp-desc">
          <button class="panel-close" id="close-details" aria-label="Close">×</button>

          ${pagerHTML}

          <header class="dp-header">
            <img class="dp-thumb" src="${card.image}" alt="" />
            <div class="dp-headings">
              <h2 id="dp-title">${card.title}</h2>
              <p id="dp-desc" class="dp-subtitle">${short(detailsText)}</p>
              <div class="dp-tags">
                ${tags
                  .map((t) => `<span class="chip" aria-label="Tag">${t}</span>`)
                  .join("")}
              </div>
            </div>
          </header>

          <div class="dp-body">
            <ul class="panel-points">
              <li>${detailsText}</li>
            </ul>

            <div class="dp-meta">
              <div class="meta-item">
                <span class="meta-label">Card</span>
                <span class="meta-value">${active + 1} / ${cards.length}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Detail page</span>
                <span class="meta-value">${
                  hasPager ? `${detailsIndex + 1} / ${detailsCount}` : "1 / 1"
                }</span>
              </div>
            </div>
          </div>

          <footer class="dp-footer">
            ${footerProgressHTML}
            <a href="#" id="dp-view-all" class="dp-link" aria-label="View all cards">View All Cards</a>
          </footer>
        </aside>
      </div>
    `;

    // Main carousel navigation
    this.root.querySelector("#arrow-left").onclick = () =>
      this.arrowClickHandler && this.arrowClickHandler("prev");
    this.root.querySelector("#arrow-right").onclick = () =>
      this.arrowClickHandler && this.arrowClickHandler("next");

    // Jump to a specific slide by clicking it
    this.root.querySelectorAll(".slide").forEach((slide) => {
      slide.addEventListener("click", () => {
        const idx = Number(slide.dataset.idx);
        this.cardClickHandler && this.cardClickHandler(idx);
      });
    });

    // Details-only pager (bind only if it exists)
    const pagerPrev = this.root.querySelector("#pager-up");
    const pagerNext = this.root.querySelector("#pager-down");
    if (pagerPrev) {
      pagerPrev.onclick = () =>
        this.detailsPagerHandler && this.detailsPagerHandler("prev");
    }
    if (pagerNext) {
      pagerNext.onclick = () =>
        this.detailsPagerHandler && this.detailsPagerHandler("next");
    }

    // Close handlers
    const viewAll = this.root.querySelector("#dp-view-all");
    if (viewAll) {
      viewAll.onclick = (e) => {
        e.preventDefault();
        this.closeHandler && this.closeHandler();
      };
    }
    this.root.querySelector("#close-details").onclick = () =>
      this.closeHandler && this.closeHandler();

    // Keyboard navigation
    const close = () => this.closeHandler && this.closeHandler();
    const keyHandler = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft" || e.key === "ArrowUp")
        this.arrowClickHandler && this.arrowClickHandler("prev");
      if (e.key === "ArrowRight" || e.key === "ArrowDown")
        this.arrowClickHandler && this.arrowClickHandler("next");
    };
    document.addEventListener("keydown", keyHandler, { once: true });

    this.root.querySelector("#close-details")?.focus({ preventScroll: true });
  }
}
