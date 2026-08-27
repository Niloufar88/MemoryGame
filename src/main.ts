// @ts-ignore
import "./styles/main.scss";

import { themeObject } from "./type";
import {
  renderSettingsPage,
  renderBoardElements,
  startGame,
  gameLogic,
  handlePlayerChange,
  updateGameTheme,
  handleBoardSizeChange,
  handleGameThemeChange,
  updateStartButtonState,
} from "./game";

const playBtn = document.getElementById("playBtn") as HTMLButtonElement;
const playBtnArrow = document.getElementById(
  "playBtn-arrow",
) as HTMLImageElement;
const arrowNormal = "/assets/icons/landing-page/play-arrow.svg";
const arrowHover = "/assets/icons/landing-page/play-arrow-hover.svg";

const startBtn = document.getElementById("start-Btn") as HTMLButtonElement;

const exitBtn = document.querySelector(".exit-button") as HTMLButtonElement;
const exitBtnIcon = exitBtn.querySelector("img") as HTMLImageElement;
const exitNormal = "/assets/icons/food/exit-default.svg";
const exitHover = "/assets/icons/food/exit-hover.svg";

const radioButtonsContainer = document.querySelectorAll(
  ".options-container",
) as NodeListOf<HTMLDivElement>;

const cardSetsContainer = document.querySelectorAll(
  ".options-container.size-set",
) as NodeListOf<HTMLDivElement>;

const boardSizeSetting = document.getElementById(
  "board-size-text",
) as HTMLSpanElement;

const choosePlayerDiv = document.querySelector(
  ".details__player--options",
) as HTMLDivElement;

const setBoardSizeDiv = document.querySelector(
  ".details__size--options",
) as HTMLDivElement;

const chooseGameThemeDiv = document.querySelector(
  ".details__themes--options",
) as HTMLDivElement;

choosePlayerDiv.addEventListener("change", (event) => {
  const target = event.target as HTMLInputElement;
  if (target && target.type === "radio") handlePlayerChange(target.value);

  updateStartButtonState();
});

setBoardSizeDiv.addEventListener("change", (event) => {
  const target = event.target as HTMLInputElement;
  if (target && target.type === "radio") handleBoardSizeChange(target);

  updateStartButtonState();
});

chooseGameThemeDiv.addEventListener("change", (event) => {
  const target = event.target as HTMLInputElement;
  if (target && target.type === "radio") handleGameThemeChange(target.value);

  updateStartButtonState();
});

// radioButtonsContainer.forEach((container) => {
//   container.addEventListener("mouseenter", () => {
//     const radioButton = container.querySelector(
//       'input[type="radio"]',
//     ) as HTMLInputElement;
//     const labelText = container.querySelector("label") as HTMLLabelElement;
//     if (radioButton) {
//       radioButton.checked = true;
//       labelText.style.fontWeight = "bold";
//     }
//   });
// });

// radioButtonsContainer.forEach((container) => {
//   container.addEventListener("mouseleave", () => {
//     const radioButton = container.querySelector(
//       'input[type="radio"]',
//     ) as HTMLInputElement;
//     const labelText = container.querySelector("label") as HTMLLabelElement;
//     if (radioButton) {
//       radioButton.checked = false;
//       labelText.style.fontWeight = "normal";
//     }
//   });
// });

playBtn.addEventListener("mouseover", () => {
  playBtnArrow.src = arrowHover;
});

playBtn.addEventListener("mouseleave", () => {
  playBtnArrow.src = arrowNormal;
});

playBtn.addEventListener("click", () => {
  renderSettingsPage();
});

startBtn.addEventListener("click", () => {
  renderBoardElements(gameLogic.currentTheme);
});

exitBtn?.addEventListener("mouseover", () => {
  if (exitBtnIcon) exitBtnIcon.src = exitHover;
});

exitBtn?.addEventListener("mouseleave", () => {
  if (exitBtnIcon) exitBtnIcon.src = exitNormal;
});
