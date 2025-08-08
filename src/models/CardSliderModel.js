import { CardService } from "../services/CardService.js";

export class CardSliderModel {
  constructor() {
    this.cards = [];
    this.selectedIndex = null;
  }

  async load() {
    const data = await CardService.fetchCards();
    this.cards = Array.isArray(data) ? data : [];
    if (this.cards.length && this.selectedIndex == null) {
      this.selectedIndex = 0;
    }
  }

  async loadCards() {
    this.cards = await CardService.fetchCards();
    if (this.cards.length && this.selectedIndex == null) {
      this.selectedIndex = 0;
    }
  }

  selectCard(index) {
    if (!this.cards.length) return;
    const safe = Math.max(0, Math.min(index, this.cards.length - 1));
    this.selectedIndex = safe;
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
