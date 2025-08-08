import { CardSliderModel } from "../models/CardSliderModel.js";
import { CardSliderView } from "../views/CardSliderView.js";

export class CardSliderController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    // Bind handlers
    this.view.onCardClick(this.handleCardClick.bind(this));
    this.view.onArrowClick(this.handleArrowClick.bind(this));
    this.view.onClose(this.handleClose.bind(this));
  }

  async init() {
    await this.model.loadCards();
    this.view.renderDeck();
  }

  handleCardClick(idx) {
    this.model.selectCard(idx);
    this.view.renderCarousel();
  }

  handleArrowClick(direction) {
    if (direction === "next") {
      this.model.nextCard();
    } else if (direction === "prev") {
      this.model.prevCard();
    }
    this.view.renderCarousel();
  }

  handleClose() {
    this.model.unselectCard();
    this.view.renderDeck();
  }
}
