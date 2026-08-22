// @ts-ignore
import "./styles/main.scss";

import { cards } from "./type";
import { renderBoardElements, startGame, gameLogic } from "./game";

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
  const target = event.target as HTMLElement;
  if (target) gameLogic.currentPlayer = (target as HTMLInputElement).value;
  console.log("Current Player:", gameLogic.currentPlayer);
});

setBoardSizeDiv.addEventListener("change", (event) => {
  const target = event.target as HTMLElement;
  const [rows, cols] = (target as HTMLInputElement).value
    .split("x")
    .map(Number);
  if (target) {
    gameLogic.currentRows = rows;
    gameLogic.currentColumns = cols;
    gameLogic.currentCardsPair = (rows * cols) / 2;
  }
});

chooseGameThemeDiv.addEventListener("change", (event) => {
  const target = event.target as HTMLElement;
  if (target) gameLogic.currentTheme = (target as HTMLInputElement).value;

  console.log("Current Theme:", gameLogic.currentTheme);
});

// cardSetsContainer.forEach((setsContainer) => {
//   setsContainer.addEventListener("change", (event) => {
//     const target = event.target as HTMLInputElement;
//     if (target && target.type === "radio") {
//       const boardSize = target.value;
//       const [rows, columns] = boardSize.split("x").map(Number);
//       const totalCards = rows * columns;
//       const totalPairs = totalCards / 2;
//       gameLogic.currentCardsPair = totalPairs;
//       gameLogic.currentRows = rows;
//       gameLogic.currentColumns = columns;
//       boardSizeSetting.innerText = `${rows * columns}-Cards`;
//       console.log(boardSizeSetting.innerText);
//     }
//   });
// });

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

// playBtn.addEventListener("click", () => {
//   renderBoardElements();
// });

exitBtn?.addEventListener("mouseover", () => {
  if (exitBtnIcon) exitBtnIcon.src = exitHover;
});

exitBtn?.addEventListener("mouseleave", () => {
  if (exitBtnIcon) exitBtnIcon.src = exitNormal;
});
