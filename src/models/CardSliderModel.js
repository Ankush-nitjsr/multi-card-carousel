import { CardService } from "../services/CardService.js";

export class CardSliderModel {
  constructor() {
    this.cards = [];
    this.selectedIndex = null; // main carousel index
    this.detailsPage = 0; // page inside the selected card
  }

  async load() {
    const data = await CardService.fetchCards();
    this.setCards(Array.isArray(data) ? data : []);
  }

  async loadCards() {
    await this.load();
  }

  setCards(cards) {
    this.cards = cards || [];
    if (this.cards.length) {
      if (this.selectedIndex == null) this.selectedIndex = 0;
      this.selectedIndex = this._clamp(this.selectedIndex);
      this.detailsPage = 0;
    } else {
      this.selectedIndex = null;
      this.detailsPage = 0;
    }
  }

  // ----- Main carousel selection -----
  selectCard(index) {
    if (!this.cards.length) return;
    this.selectedIndex = this._clamp(index);
    this.detailsPage = 0; // reset panel paging when card changes
  }
  unselectCard() {
    this.selectedIndex = null;
    this.detailsPage = 0;
  }
  nextCard() {
    if (this.selectedIndex == null || !this.cards.length) return;
    this.selectedIndex = (this.selectedIndex + 1) % this.cards.length;
    this.detailsPage = 0;
  }
  prevCard() {
    if (this.selectedIndex == null || !this.cards.length) return;
    this.selectedIndex =
      (this.selectedIndex - 1 + this.cards.length) % this.cards.length;
    this.detailsPage = 0;
  }

  // ----- Details paging within the selected card -----
  _detailsPagesFor(card) {
    // Supports multiple shapes:
    // - card.details: string OR string[]
    // - card.points / card.sections / card.features: string[]
    if (!card) return [];
    if (Array.isArray(card.details)) return card.details;
    if (Array.isArray(card.points)) return card.points;
    if (Array.isArray(card.sections)) return card.sections;
    if (Array.isArray(card.features)) return card.features;
    // Fallback to single page from string
    return card.details ? [card.details] : [];
  }

  detailsPageCount() {
    const card = this.getCurrentCard();
    return this._detailsPagesFor(card).length || 1;
  }

  getCurrentDetailsContent() {
    const card = this.getCurrentCard();
    const pages = this._detailsPagesFor(card);
    if (!pages.length) return "";
    const i = Math.max(0, Math.min(this.detailsPage, pages.length - 1));
    return pages[i];
  }

  nextDetails() {
    const count = this.detailsPageCount();
    if (count <= 1) return;
    this.detailsPage = (this.detailsPage + 1) % count;
  }
  prevDetails() {
    const count = this.detailsPageCount();
    if (count <= 1) return;
    this.detailsPage = (this.detailsPage - 1 + count) % count;
  }
  setDetailsPage(i) {
    const count = this.detailsPageCount();
    if (count <= 1) return;
    this.detailsPage = Math.max(0, Math.min(i ?? 0, count - 1));
  }

  // ----- Getters -----
  getCurrentCard() {
    if (this.selectedIndex != null && this.cards.length) {
      return this.cards[this.selectedIndex];
    }
    return null;
  }

  // ----- utils -----
  _clamp(i) {
    const len = this.cards.length;
    return Math.max(0, Math.min(i ?? 0, len - 1));
  }
}
