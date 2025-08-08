import { CardService } from "../services/CardService.js";

export class CardSliderModel {
  constructor() {
    this.cards = [];
    this.selectedIndex = null;
  }

  async loadCards() {
    this.cards = await CardService.fetchCards();
  }

  selectCard(index) {
    this.selectedIndex = index;
  }

  unselectCard() {
    this.selectedIndex = null;
  }

  nextCard() {
    if (this.selectedIndex === null || this.cards.length === 0) return;
    this.selectedIndex = (this.selectedIndex + 1) % this.cards.length;
  }

  prevCard() {
    if (this.selectedIndex === null || this.cards.length === 0) return;
    this.selectedIndex =
      (this.selectedIndex - 1 + this.cards.length) % this.cards.length;
  }

  getCurrentCard() {
    if (this.selectedIndex !== null && this.cards.length > 0) {
      return this.cards[this.selectedIndex];
    }
    return null;
  }
}
