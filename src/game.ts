import { Card, cards, GameState } from "./type";

const bodyEl = document.querySelector("body") as HTMLBodyElement;
const mainContainer = document.querySelector(".game-intro") as HTMLDivElement;

let gameLogic: GameState = {
  currentPlayer: "blue",
};

export function renderBoardElements() {
  bodyEl.innerHTML = "";
  bodyEl.classList.add("board-body");
  mainContainer.classList.add("d-none");
}

function createBoardElements(): HTMLDivElement {
  const mainContainer = document.createElement("div");
  mainContainer.classList.add("board-main-container");

  const boardNavBar = document.createElement("div");
  boardNavBar.classList.add("board-navbar");

  const navPlayers = document.createElement("div");
  const navCurrentPlayer = document.createElement("div");
  navCurrentPlayer.innerHTML = rendercurrentPlayerTemplate();
  const navExitBtn = document.createElement("button");
  navExitBtn.classList.add("exit-button");

  boardNavBar.appendChild(navPlayers);
  boardNavBar.appendChild(navCurrentPlayer);
  boardNavBar.appendChild(navExitBtn);

  mainContainer.appendChild(boardNavBar);
  bodyEl.appendChild(mainContainer);

  return mainContainer;
}

function rendercurrentPlayerTemplate() {
  return `
  <div class="current-player">
    <span>Current Player:</span>
    <img src="/assets/icons/blue-figure.svg" alt="player figure" />
  </div>
`;
}
