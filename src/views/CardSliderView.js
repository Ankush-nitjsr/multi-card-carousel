export class CardSliderView {
  constructor(root, model) {
    this.root = root;
    this.model = model;
    this.cardClickHandler = null;
    this.arrowClickHandler = null;
    this.closeHandler = null;
  }

  onCardClick(handler) {
    this.cardClickHandler = handler;
  }
  onArrowClick(handler) {
    this.arrowClickHandler = handler;
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
    const active = this.model.selectedIndex;
    const cards = this.model.cards;
    if (active == null || !cards.length) return;

    const prev = (active - 1 + cards.length) % cards.length;
    const next = (active + 1) % cards.length;

    const card = cards[active];
    const short = (txt, n = 90) =>
      txt && txt.length > n ? txt.slice(0, n).trim() + "…" : txt || "";
    const tags = card.tags && card.tags.length ? card.tags : ["Featured"];

    this.root.innerHTML = `
      <div class="carousel-shell">
        <div class="carousel-stage">
          <button class="nav h-arrow left-arrow" id="arrow-left" aria-label="Previous">‹</button>

          ${cards
            .map(
              (c, i) => `
            <div
              class="slide ${
                i === active
                  ? "active"
                  : i === prev
                  ? "prev"
                  : i === next
                  ? "next"
                  : "faded"
              }"
              data-idx="${i}"
            >
              <img src="${c.image}" alt="${c.title}" />
              <h3>${c.title}</h3>
            </div>
          `
            )
            .join("")}

          <button class="nav h-arrow right-arrow" id="arrow-right" aria-label="Next">›</button>
        </div>

        <aside class="details-panel" role="dialog" aria-modal="true" aria-labelledby="dp-title" aria-describedby="dp-desc">
          <button class="panel-close" id="close-details" aria-label="Close">×</button>

          <div class="panel-pager" aria-label="Slide pager">
            <button class="pager-btn" id="pager-up" aria-label="Previous">▲</button>
            <div class="pager-index" aria-live="polite">${active + 1} / ${
      cards.length
    }</div>
            <button class="pager-btn" id="pager-down" aria-label="Next">▼</button>
          </div>

          <header class="dp-header">
            <img class="dp-thumb" src="${card.image}" alt="" />
            <div class="dp-headings">
              <h2 id="dp-title">${card.title}</h2>
              <p id="dp-desc" class="dp-subtitle">${short(card.details)}</p>
              <div class="dp-tags">
                ${tags
                  .map((t) => `<span class="chip" aria-label="Tag">${t}</span>`)
                  .join("")}
              </div>
            </div>
          </header>

          <div class="dp-body">
            <ul class="panel-points">
              <li>${card.details}</li>
            </ul>
            <div class="dp-meta">
              <div class="meta-item">
                <span class="meta-label">Index</span>
                <span class="meta-value">${active + 1}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Total</span>
                <span class="meta-value">${cards.length}</span>
              </div>
            </div>
          </div>

          <footer class="dp-footer">
            <div class="dp-progress">
              <span id="dp-progress-index">${
                active + 1
              }</span> / <span id="dp-progress-total">${cards.length}</span>
            </div>
            <a href="#" id="dp-view-all" class="dp-link" aria-label="View all cards">View All Cards</a>
            <button class="dp-random" id="dp-random" aria-label="Show a random card">🎲 Surprise Me</button>
          </footer>
        </aside>
      </div>
    `;

    // Helpers
    const close = () => this.closeHandler && this.closeHandler();

    // Arrows + pager
    this.root.querySelector("#arrow-left").onclick = () =>
      this.arrowClickHandler && this.arrowClickHandler("prev");
    this.root.querySelector("#arrow-right").onclick = () =>
      this.arrowClickHandler && this.arrowClickHandler("next");
    this.root.querySelector("#pager-up").onclick = () =>
      this.arrowClickHandler && this.arrowClickHandler("prev");
    this.root.querySelector("#pager-down").onclick = () =>
      this.arrowClickHandler && this.arrowClickHandler("next");

    // Footer actions
    const viewAll = this.root.querySelector("#dp-view-all");
    const randomBtn = this.root.querySelector("#dp-random");
    if (viewAll) {
      viewAll.onclick = (e) => {
        e.preventDefault();
        close();
      };
    }
    if (randomBtn) {
      randomBtn.onclick = () => {
        const len = cards.length;
        if (!len) return;
        let r = Math.floor(Math.random() * len);
        if (r === active && len > 1) r = (r + 1) % len;
        this.cardClickHandler && this.cardClickHandler(r);
      };
    }

    // Close panel
    this.root.querySelector("#close-details").onclick = close;

    // Click any slide to jump directly to it
    this.root.querySelectorAll(".slide").forEach((slide) => {
      slide.addEventListener("click", () => {
        const idx = Number(slide.dataset.idx);
        this.cardClickHandler && this.cardClickHandler(idx);
      });
    });

    // Accessibility: focus + keys
    const closeBtn = this.root.querySelector("#close-details");
    closeBtn?.focus({ preventScroll: true });
    const keyHandler = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft" || e.key === "ArrowUp")
        this.arrowClickHandler && this.arrowClickHandler("prev");
      if (e.key === "ArrowRight" || e.key === "ArrowDown")
        this.arrowClickHandler && this.arrowClickHandler("next");
    };
    document.addEventListener("keydown", keyHandler, { once: true });
  }
}
