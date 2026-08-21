// @ts-ignore
import "./styles/main.scss";

import { cards } from "./type";
import { renderBoardElements, startGame } from "./game";

const startBtn = document.getElementById("startBtn") as HTMLButtonElement;
const startBtnArrow = document.getElementById(
  "startBtn-arrow",
) as HTMLImageElement;
const arrowNormal = "/assets/icons/landing-page/play-arrow.svg";
const arrowHover = "/assets/icons/landing-page/play-arrow-hover.svg";

const exitBtn = document.querySelector(".exit-button") as HTMLButtonElement;
const exitBtnIcon = exitBtn.querySelector("img") as HTMLImageElement;
const exitNormal = "/assets/icons/food/exit-default.svg";
const exitHover = "/assets/icons/food/exit-hover.svg";

startBtn.addEventListener("mouseover", () => {
  startBtnArrow.src = arrowHover;
});

startBtn.addEventListener("mouseleave", () => {
  startBtnArrow.src = arrowNormal;
});

startBtn.addEventListener("click", () => {
  renderBoardElements();
});

exitBtn?.addEventListener("mouseover", () => {
  if (exitBtnIcon) exitBtnIcon.src = exitHover;
});

exitBtn?.addEventListener("mouseleave", () => {
  if (exitBtnIcon) exitBtnIcon.src = exitNormal;
});
