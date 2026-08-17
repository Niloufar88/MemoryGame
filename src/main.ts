// @ts-ignore
import "./styles/main.scss";

const startBtn = document.getElementById("startBtn") as HTMLButtonElement;
const startBtnArrow = document.getElementById(
  "startBtn-arrow",
) as HTMLImageElement;
const arrowNormal = "/assets/icons/landing-page/play-arrow.svg";
const arrowHover = "/assets/icons/landing-page/play-arrow-hover.svg";

startBtn.addEventListener("mouseover", () => {
  startBtnArrow.src = arrowHover;
});

startBtn.addEventListener("mouseleave", () => {
  startBtnArrow.src = arrowNormal;
});
