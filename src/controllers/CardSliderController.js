export class CardSliderController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    // Event handlers
    this.view.onCardClick((idx) => this.handleCardClick(idx));
    this.view.onArrowClick((dir) => this.handleArrow(dir)); // moves main carousel
    this.view.onDetailsPagerClick((dirOrIndex) =>
      this.handleDetailsPager(dirOrIndex)
    ); // pages within card
    this.view.onClose(() => this.handleClose());

    this.mq = window.matchMedia("(max-width: 600px)");
    this.mq.addEventListener?.("change", () => this.renderForViewport());
  }

  async init() {
    await this.model.load();
    if (this.model.selectedIndex == null && this.model.cards.length) {
      this.model.selectedIndex = 0;
    }
    this.renderForViewport();
  }

  isMobile() {
    return window.matchMedia("(max-width: 600px)").matches;
  }

  renderForViewport() {
    if (!this.model.cards.length) return;
    if (this.isMobile()) {
      if (this.model.selectedIndex == null) this.model.selectCard(0);
      this.view.renderCarousel(); // details hidden until tap
      document.querySelector(".details-panel")?.classList.remove("is-open");
    } else {
      this.view.renderDeck();
    }
  }

  handleCardClick(idx) {
    this.model.selectCard(idx);
    this.view.renderCarousel();
    if (this.isMobile()) {
      document.querySelector(".details-panel")?.classList.add("is-open");
    }
  }

  handleArrow(dir) {
    if (dir === "next") this.model.nextCard();
    else this.model.prevCard();
    this.view.renderCarousel();
    // keep current open/close state on mobile
  }

  handleDetailsPager(dirOrIndex) {
    if (typeof dirOrIndex === "number") this.model.setDetailsPage(dirOrIndex);
    else if (dirOrIndex === "next") this.model.nextDetails();
    else this.model.prevDetails();

    const wasOpen = !!document.querySelector(".details-panel.is-open");
    this.view.renderCarousel();
    if (this.isMobile() && wasOpen) {
      document.querySelector(".details-panel")?.classList.add("is-open");
    }
  }

  handleClose() {
    if (this.isMobile()) {
      document.querySelector(".details-panel")?.classList.remove("is-open");
    } else {
      this.view.renderDeck();
    }
  }
}
