import { THEME_OBJECTS } from "./type";
import {
  gameLogic,
  boardContainer,
  bodyEl,
  gameIntroContainer,
  settingsContainer,
  updateStartButtonState,
  playerFigures,
} from "./game";

import {
  activelySelectedRadios,
  resetContainerVisuals,
  playerButtons,
  themesButtons,
  boardSizeButtons,
  settingBox,
} from "./main";

const dialogEl = document.getElementById("overlayDialog") as HTMLDialogElement;

export function openDialog() {
  const dialog = document.querySelector(".exitOverlay") as HTMLDialogElement;

  if (dialog) {
    renderDialogElements(gameLogic.currentTheme);
    dialog.showModal();
    dialogListeners();
  }
}

export function closeDialog() {
  const dialog = document.querySelector(".exitOverlay") as HTMLDialogElement;
  dialog.close();
}

export function resetGameState() {
  gameLogic.currentPlayer = "";
  gameLogic.currentCardsPair = 0;
  gameLogic.currentTheme = "";
  gameLogic.activePlayer = "";
  gameLogic.playerScore.orange = 0;
  gameLogic.playerScore.blue = 0;
  gameLogic.flippedCards = [];
  gameLogic.currentColumns = 0;
  gameLogic.lockBoard = false;
}

function resetActivelySelectedBtns() {
  activelySelectedRadios.boardSize = null;
  activelySelectedRadios.player = null;
  activelySelectedRadios.gameTheme = null;
}

function resetVisuals(
  players: NodeListOf<HTMLDivElement>,
  sizes: NodeListOf<HTMLDivElement>,
  themes: NodeListOf<HTMLDivElement>,
) {
  players.forEach((player) => {
    resetContainerVisuals(player);
  });
  sizes.forEach((size) => {
    resetContainerVisuals(size);
  });
  themes.forEach((theme) => {
    resetContainerVisuals(theme);
  });
}

export function goBackToHome() {
  hideWinnerScreen();
  boardContainer.classList.add("d-none");
  bodyEl.classList.remove("board-white");
  gameIntroContainer.classList.remove("d-none");
  resetGameState();
}

export function goBackToSettings() {
  hideWinnerScreen();
  boardContainer.classList.add("d-none");
  settingsContainer.classList.remove("d-none");
  resetSettinBoxTexts();
  settingBox.classList.remove("streched");
  resetGameState();
}

function resetSettinBoxTexts() {
  const theme = document.getElementById("game-theme-text") as HTMLSpanElement;
  const player = document.getElementById("player-text") as HTMLSpanElement;
  const size = document.getElementById("board-size-text") as HTMLSpanElement;

  theme.innerText = `Theme`;
  player.innerText = `Player`;
  size.innerText = `Board-Size`;
}

export function resetGame() {
  resetGameState();
  resetActivelySelectedBtns();
  resetVisuals(playerButtons, boardSizeButtons, themesButtons);
  resetradioButtons();
  setTimeout(() => {
    goBackToSettings();
    updateStartButtonState();
    playerFigures.forEach((figure) => {
      figure.innerText = String(0);
    });
  }, 400);
}

function resetradioButtons() {
  const allRadioInputs = document.querySelectorAll<HTMLInputElement>(
    'input[type="radio"]',
  );

  allRadioInputs.forEach((input: HTMLInputElement) => {
    input.checked = false;
  });
}

function renderDialogElements(theme: string): HTMLDialogElement {
  const dialog = document.getElementById("overlayDialog") as HTMLDialogElement;

  let backBtnText = theme === "foods" ? `No, back to game` : `Back to game`;

  dialog.innerHTML = dialogElementTemplate(backBtnText);

  return dialog;
}

function dialogElementTemplate(text: string) {
  return `
    <div class="exitOverlay__container">
        <p class="overlay-text">Are you sure you want to quit the game?</p>
        <div class="overlay-btns">
          <button class="back" type="button" id="backToGame">
            ${text}
          </button>
          <button class="exit" type="button" id="exitGame">Exit game</button>
        </div>
      </div>
    `;
}

function dialogListeners() {
  const dialog = renderDialogElements(gameLogic.currentTheme);

  const exitGame = dialog.querySelector("#exitGame") as HTMLButtonElement;
  exitGame.addEventListener("click", () => {
    closeDialog();
    resetGame();
  });
  const backToGameBtn = dialog.querySelector(
    "#backToGame",
  ) as HTMLButtonElement;
  backToGameBtn.addEventListener("click", closeDialog);
}

dialogEl.addEventListener("click", (event: MouseEvent) => {
  if (event.target === dialogEl) closeDialog();
});

export function showGameOverScreen() {
  const gameOver = renderGameOverElements();
  gameOver.classList.add("show");

  const orangeScore = document.getElementById("orangeScore") as HTMLSpanElement;
  orangeScore.innerText = String(gameLogic.playerScore.orange);
  const blueScore = document.getElementById("blueScore") as HTMLSpanElement;
  blueScore.innerText = String(gameLogic.playerScore.blue);
}

export function showWinnerScreen() {
  const winnerScreenDiv = document.querySelector(
    ".winnerScreen",
  ) as HTMLDivElement;
  if (winnerScreenDiv) {
    renderWinnerDrawScreen();
    winnerScreenDiv.classList.add("show");
    updateWinnerVisuals(winnerScreenDiv);
    const homeBtn = winnerScreenDiv.querySelector(
      ".home-btn",
    ) as HTMLButtonElement;
    homeBtn.addEventListener("click", resetGame);
  }
}

function updateWinnerVisuals(screen: HTMLDivElement) {
  const img = screen.querySelector(
    ".winner__content--figure img",
  ) as HTMLImageElement;
  const winner = screen.querySelector(".winner") as HTMLHeadingElement;
  const winnerTitle = screen.querySelector(
    ".winner-title",
  ) as HTMLHeadingElement;
  if (img) blueOrOrangeFigure(img);
  if (winner && winnerTitle) blueOrOrangeWinner(winner, winnerTitle);
}

function blueOrOrangeFigure(img: HTMLImageElement) {
  const orangeScore = gameLogic.playerScore.orange;
  const blueScore = gameLogic.playerScore.blue;

  if (orangeScore > blueScore) {
    if (gameLogic.currentTheme === "foods")
      img.src = "/assets/icons/orange-orange-winner.svg";
    else img.src = "/assets/icons/blue-orange-winner.svg";
  } else if (blueScore > orangeScore) {
    if (gameLogic.currentTheme === "foods")
      img.src = "/assets/icons/orange-blue-winner.svg";
    else img.src = "/assets/icons/blue-blue-winner.svg";
  } else {
    if (gameLogic.currentTheme === "foods")
      img.src = "/assets/icons/orange-draw-img.svg";
    else img.src = "/assets/icons/blue-draw-img.svg";
  }
}

function blueOrOrangeWinner(
  winner: HTMLHeadingElement,
  title: HTMLHeadingElement,
) {
  const orangeScore = gameLogic.playerScore.orange;
  const blueScore = gameLogic.playerScore.blue;

  if (orangeScore > blueScore) {
    title.innerText = `The winner is`;
    winner.innerText = `Orange Player`;
  } else if (orangeScore < blueScore) {
    title.innerText = `The winner is`;
    winner.innerText = `Blue Player`;
  } else {
    title.innerText = `It’s a`;
    winner.innerText = `DRAW`;
  }
}

export function hideGameOverScreen() {
  const gameOverDiv = document.querySelector(".gameOver") as HTMLDivElement;
  gameOverDiv.classList.remove("show");
}

function hideWinnerScreen() {
  const winnerScreenDiv = document.querySelector(
    ".winnerScreen",
  ) as HTMLDivElement;
  winnerScreenDiv.classList.remove("show");
}

function gameOverElementTemplate() {
  return `
  <div class="gameOver__content">
        <h1 class="gameOver__content--title">GAME OVER</h1>
        <div class="gameOver__content--scoreBox">
          <h3 class="gameOver__content--scoreBox--title">Final score</h3>
          <div class="gameOver__content--scoreBox--scores">
            <div class="orangePlayer">
              <img src="/assets/icons/orangeFigure.svg" alt="" />
              <span id="orangeScore">0</span>
            </div>

            <div class="bluePlayer">
              <img src="/assets/icons/blueFigure.svg" alt="" />
              <span id="blueScore">0</span>
            </div>
          </div>
        </div>
      </div>
  `;
}

function renderGameOverElements(): HTMLDivElement {
  const gameOverDiv = document.querySelector(".gameOver") as HTMLDivElement;

  gameOverDiv.innerHTML = gameOverElementTemplate();
  return gameOverDiv;
}

function winnerDrawScreenTemplate() {
  return `
  <div class="winner__content">
        <div class="winner__content--text">
          <h3 class="winner-title">The winner is</h3>
          <h3 class="winner"></h3>
        </div>
        <div class="winner__content--figure">
          <img src="" alt="" />
        </div>
        <button class="home-btn" type="button">Home</button>
      </div>
  `;
}

function renderWinnerDrawScreen(): HTMLDivElement {
  const winnerScreenDiv = document.querySelector(
    ".winnerScreen",
  ) as HTMLDivElement;
  winnerScreenDiv.innerHTML = winnerDrawScreenTemplate();
  return winnerScreenDiv;
}
