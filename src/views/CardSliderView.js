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

    this.root.innerHTML = `
      <div class="carousel-shell">
        <div class="carousel-stage">
          <!-- horizontal arrows are now INSIDE the stage and sit half OUTSIDE via CSS -->
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

        <aside class="details-panel">
          <button class="panel-close" id="close-details" aria-label="Close">×</button>

          <!-- vertical pager stays INSIDE the panel; content is padded to make room -->
          <div class="panel-pager">
            <button class="pager-btn" id="pager-up" aria-label="Previous">▲</button>
            <div class="pager-index">${active + 1} / ${cards.length}</div>
            <button class="pager-btn" id="pager-down" aria-label="Next">▼</button>
          </div>

          <div class="panel-content">
            <h2>${cards[active].title}</h2>
            <ul class="panel-points">
              <li>${cards[active].details}</li>
            </ul>
          </div>
        </aside>
      </div>
    `;

    // Arrows + pager
    this.root.querySelector("#arrow-left").onclick = () =>
      this.arrowClickHandler && this.arrowClickHandler("prev");
    this.root.querySelector("#arrow-right").onclick = () =>
      this.arrowClickHandler && this.arrowClickHandler("next");
    this.root.querySelector("#pager-up").onclick = () =>
      this.arrowClickHandler && this.arrowClickHandler("prev");
    this.root.querySelector("#pager-down").onclick = () =>
      this.arrowClickHandler && this.arrowClickHandler("next");

    // Close panel
    this.root.querySelector("#close-details").onclick = () =>
      this.closeHandler && this.closeHandler();

    // Click any slide to jump directly to it
    this.root.querySelectorAll(".slide").forEach((slide) => {
      slide.addEventListener("click", () => {
        const idx = Number(slide.dataset.idx);
        this.cardClickHandler && this.cardClickHandler(idx);
      });
    });
  }
}
