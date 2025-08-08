# Multi Card Carousel

This project is a responsive **Multi Card Carousel** implemented in **vanilla JavaScript (ES6 classes)**, **SCSS**, and **static JSON** data.

## 📌 Features

### 1. Data & Structure

- **Static JSON** as the data source (`cards.json` in the `src/data` folder).
- Card fields follow the **UI sample** provided:
  - `image` – card image URL
  - `title` – card title text
  - `details` – description or bullet points

### 2. Views

- **Deck View (Desktop default)**:
  - Displays multiple cards in a grid.
  - Clicking a card switches to **Carousel View** at that card’s position.
- **Carousel View**:
  - Central active card with blurred smaller left/right previews.
  - Left/right **horizontal arrows** positioned outside the cards.
  - **Right-side details panel** with:
    - Vertical pager buttons inside.
    - Close button.
  - On mobile devices, **Carousel View is the default initial view**.

### 3. Mobile Behavior

- **Mobile-first adjustments**:
  - Carousel is the initial view (Deck hidden).
  - Details panel opens in overlay mode.
  - Layout and paddings optimized for smaller screens.

### 4. Navigation

- Horizontal navigation:
  - Left/right arrows outside the card stack.
- Vertical navigation inside details panel:
  - Pager buttons with index display (`X / total`).
- Click on any preview slide to jump directly to that card.

### 5. Styling

- Written in **SCSS** (`styles/styles.scss`) with variables for colors, typography, and spacing.
- Matching **color scheme, spacing, and design style** from the provided PDF.
- Responsive layout with clean z-index layering (arrows outside, pager inside panel).

---

## 🛠 Tech Stack

- **JavaScript (ES6)**
  - `CardSliderModel` – manages card data and state.
  - `CardSliderView` – handles rendering of Deck & Carousel.
  - `CardSliderController` – connects model and view, handles events.
  - `CardService` – loads static JSON.
- **SCSS** for styling, compiled to CSS.
- **Static JSON** for card data.
- **No frameworks** – pure HTML, JS, SCSS.

---

## 📂 Project Structure

```
src/
  controllers/
    CardSliderController.js
  models/
    CardSliderModel.js
  services/
    CardService.js
  views/
    CardSliderView.js
  data/
    cards.json
  styles/
    styles.scss
    styles.css   // compiled from SCSS
  main.js
index.html
```

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/Ankush-nitjsr/multi-card-carousel
cd capital-numbers-assignment
```

### 2. Install Sass (if not already installed)

```bash
npm install -g sass
```

### 3. Compile SCSS → CSS

```bash
sass styles/styles.scss styles/styles.css --watch
```

### 4. Run locally

- Open `index.html` with **Live Server** extension in VS Code or serve with any static file server.

---

## 📱 Mobile Testing

To verify mobile behavior:

1. Open project in Chrome/Edge.
2. Press `F12` → Toggle device toolbar.
3. Select any mobile preset (iPhone 12, Pixel 5, etc.).
4. Refresh – **Carousel View** should load by default.
5. Test:
   - Horizontal arrows move slides.
   - Vertical pager inside panel updates index.
   - Details panel opens/closes correctly.

---

## ✅ Cross-Browser Compatibility

- Tested on:
  - Chrome (latest)
  - Firefox (latest)
  - Edge (latest)
  - Safari (latest macOS & iOS)

---

## 🔍 Accessibility

- Buttons have `aria-label`s.
- Logical keyboard navigation.
- Semantic HTML structure for better screen reader support.
