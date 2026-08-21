// @ts-ignore
import "./styles/main.scss";

import { cards } from "./type";
import { renderBoardElements, startGame } from "./game";

const playBtn = document.getElementById("playBtn") as HTMLButtonElement;
const playBtnArrow = document.getElementById(
  "playBtn-arrow",
) as HTMLImageElement;
const arrowNormal = "/assets/icons/landing-page/play-arrow.svg";
const arrowHover = "/assets/icons/landing-page/play-arrow-hover.svg";

const exitBtn = document.querySelector(".exit-button") as HTMLButtonElement;
const exitBtnIcon = exitBtn.querySelector("img") as HTMLImageElement;
const exitNormal = "/assets/icons/food/exit-default.svg";
const exitHover = "/assets/icons/food/exit-hover.svg";

const radioButtonsContainer = document.querySelectorAll(
  ".options-container",
) as NodeListOf<HTMLDivElement>;

radioButtonsContainer.forEach((container) => {
  container.addEventListener("mouseenter", () => {
    const radioButton = container.querySelector(
      'input[type="radio"]',
    ) as HTMLInputElement;
    const labelText = container.querySelector("label") as HTMLLabelElement;
    if (radioButton) {
      radioButton.checked = true;
      labelText.style.fontWeight = "bold";
    }
  });
});

radioButtonsContainer.forEach((container) => {
  container.addEventListener("mouseleave", () => {
    const radioButton = container.querySelector(
      'input[type="radio"]',
    ) as HTMLInputElement;
    const labelText = container.querySelector("label") as HTMLLabelElement;
    if (radioButton) {
      radioButton.checked = false;
      labelText.style.fontWeight = "normal";
    }
  });
});

playBtn.addEventListener("mouseover", () => {
  playBtnArrow.src = arrowHover;
});

playBtn.addEventListener("mouseleave", () => {
  playBtnArrow.src = arrowNormal;
});

// playBtn.addEventListener("click", () => {
//   renderBoardElements();
// });

exitBtn?.addEventListener("mouseover", () => {
  if (exitBtnIcon) exitBtnIcon.src = exitHover;
});

exitBtn?.addEventListener("mouseleave", () => {
  if (exitBtnIcon) exitBtnIcon.src = exitNormal;
});
