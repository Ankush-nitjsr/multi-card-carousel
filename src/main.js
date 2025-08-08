import { CardSliderModel } from "./models/CardSliderModel.js";
import { CardSliderView } from "./views/CardSliderView.js";
import { CardSliderController } from "./controllers/CardSliderController.js";

document.addEventListener("DOMContentLoaded", async () => {
  const root = document.getElementById("slider-root");
  const model = new CardSliderModel();
  const view = new CardSliderView(root, model);
  const controller = new CardSliderController(model, view);
  await controller.init(); // Load cards and render
});
