import { CardService } from "../services/CardService.js";

export class CardSliderModel {
  /**
   * Constructs a new instance of the CardSliderModel.
   *
   * Initially, the model is empty, with an empty array of cards and a
   * null selected index.
   */
  constructor() {
    this.cards = [];
    this.selectedIndex = null;
  }

  /**
   * Fetches the cards from the CardService and populates the model
   * with the received data. If the model is empty after loading, the
   * selected index is set to 0.
   *
   * @returns {Promise<void>}
   */
  async load() {
    const data = await CardService.fetchCards();
    this.cards = Array.isArray(data) ? data : [];
    if (this.cards.length && this.selectedIndex == null) {
      this.selectedIndex = 0;
    }
  }

  /**
   * Fetches the cards from the CardService and populates the model
   * with the received data. If the model is empty after loading, the
   * selected index is set to 0.
   *
   * @returns {Promise<void>}
   */
  async loadCards() {
    this.cards = await CardService.fetchCards();
    if (this.cards.length && this.selectedIndex == null) {
      this.selectedIndex = 0;
    }
  }

  /**
   * Sets the selected index to the given index, or the nearest valid
   * index if the given index is out of range.
   *
   * @param {number} index The index to select. If negative, 0 is used,
   *     while if greater than the length of the cards array, the last
   *     valid index is used.
   */
  selectCard(index) {
    if (!this.cards.length) return;
    const safe = Math.max(0, Math.min(index, this.cards.length - 1));
    this.selectedIndex = safe;
  }

  /**
   * Deselects any currently selected card by setting the selected index to null.
   */

  unselectCard() {
    this.selectedIndex = null;
  }

  /**
   * Advances the selected index to the next card in the list, wrapping
   * around to the beginning of the list if the current index is the last
   * valid index.
   *
   * @returns {void}
   */
  nextCard() {
    if (this.selectedIndex === null || this.cards.length === 0) return;
    this.selectedIndex = (this.selectedIndex + 1) % this.cards.length;
  }

  /**
   * Advances the selected index to the previous card in the list,
   * wrapping around to the end of the list if the current index is
   * the first valid index.
   *
   * @returns {void}
   */
  prevCard() {
    if (this.selectedIndex === null || this.cards.length === 0) return;
    this.selectedIndex =
      (this.selectedIndex - 1 + this.cards.length) % this.cards.length;
  }

  /**
   * Retrieves the currently selected card from the list of cards.
   *
   * @returns {Object|null} The card object at the selected index,
   * or null if no card is selected or the list is empty.
   */

  getCurrentCard() {
    if (this.selectedIndex !== null && this.cards.length > 0) {
      return this.cards[this.selectedIndex];
    }
    return null;
  }
}
