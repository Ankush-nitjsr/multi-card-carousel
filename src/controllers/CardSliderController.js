import { CardSliderModel } from "../models/CardSliderModel.js";
import { CardSliderView } from "../views/CardSliderView.js";

export class CardSliderController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    // handlers
    this.view.onCardClick((idx) => this.handleCardClick(idx));
    this.view.onArrowClick((dir) => this.handleArrow(dir));
    this.view.onClose(() => this.handleClose());

    // react to viewport changes too
    this.mq = window.matchMedia("(max-width: 600px)");
    this.mq.addEventListener?.("change", () => this.renderForViewport());
  }

  async init() {
    await this.model.load(); // fetch cards
    this.renderForViewport();
  }

  renderForViewport() {
    if (this.isMobile()) {
      if (this.model.selectedIndex == null) this.model.selectedIndex = 0;
      this.view.renderCarousel(); // ← mobile = carousel by default
      // ensure details panel is hidden until user taps a slide
      const panel = document.querySelector(".details-panel");
      panel?.classList.remove("is-open");
    } else {
      this.view.renderDeck(); // ← desktop/tablet = deck first
    }
  }

  isMobile() {
    return window.matchMedia("(max-width: 600px)").matches;
  }

  handleCardClick(idx) {
    this.model.selectedIndex = idx;
    // On mobile: tapping a card should show details pop-up
    if (this.isMobile()) {
      this.view.renderCarousel();
      document.querySelector(".details-panel")?.classList.add("is-open");
    } else {
      // Desktop: clicking a card switches to carousel + details
      this.view.renderCarousel();
    }
  }

  handleArrow(dir) {
    if (!this.model.cards?.length) return;
    const len = this.model.cards.length;
    const i = this.model.selectedIndex ?? 0;
    this.model.selectedIndex =
      dir === "prev" ? (i - 1 + len) % len : (i + 1) % len;
    this.view.renderCarousel();
    // On mobile, arrows should NOT auto-open details
    if (this.isMobile()) {
      document.querySelector(".details-panel")?.classList.remove("is-open");
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
