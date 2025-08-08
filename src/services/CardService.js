import { CARDS_DATA } from "../endpoints/endpoints.js";

export class CardService {
  /**
   * Fetch card data from a local JSON file (or API in the future)
   * @returns {Promise<Array>} Array of card objects
   */
  static async fetchCards() {
    try {
      const response = await fetch(CARDS_DATA);
      const data = await response.json();
      if (data && data.statusCode === 201) {
        return data.data;
      } else {
        console.error("Unexpected response structure:", data);
        return [];
      }
    } catch (error) {
      console.error("Failed to fetch cards:", error);
      return [];
    }
  }
}
