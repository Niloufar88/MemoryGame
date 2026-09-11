import { THEME_OBJECTS } from "./type";
import {
  gameLogic,
  BOARD_CONTAINER,
  BODY_EL,
  GAME_INTRO_CONTAINER,
  SETTINGS_CONTAINER,
  updateStartButtonState,
  PLAYER_FIGURES,
} from "./game";

import {
  ACTIVELY_SELECTED_RADIOS,
  resetContainerVisuals,
  PLAYER_BUTTONS,
  THEMES_BUTTONS,
  BOARD_SIZE_BUTTONS,
  SETTING_BOX,
} from "./main";

const DIALOG_EL = document.getElementById("overlayDialog") as HTMLDialogElement;

export function openDialog(): void {
  const DIALOG = document.querySelector(".exitOverlay") as HTMLDialogElement;

  if (DIALOG) {
    renderDialogElements(gameLogic.currentTheme);
    DIALOG.showModal();
    dialogListeners();
  }
}

export function closeDialog(): void {
  const DIALOG = document.querySelector(".exitOverlay") as HTMLDialogElement;
  DIALOG.close();
}

export function resetGameState(): void {
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

function resetActivelySelectedBtns(): void {
  ACTIVELY_SELECTED_RADIOS.boardSize = null;
  ACTIVELY_SELECTED_RADIOS.player = null;
  ACTIVELY_SELECTED_RADIOS.gameTheme = null;
}

function resetVisuals(
  players: NodeListOf<HTMLDivElement>,
  sizes: NodeListOf<HTMLDivElement>,
  themes: NodeListOf<HTMLDivElement>,
): void {
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

export function goBackToHome(): void {
  hideWinnerScreen();
  BOARD_CONTAINER.classList.add("d-none");
  BODY_EL.classList.remove("board-white");
  GAME_INTRO_CONTAINER.classList.remove("d-none");
  resetGameState();
}

export function goBackToSettings(): void {
  hideWinnerScreen();
  BOARD_CONTAINER.classList.add("d-none");
  SETTINGS_CONTAINER.classList.remove("d-none");
  resetSettinBoxTexts();
  SETTING_BOX.classList.remove("streched");
  resetGameState();
}

function resetSettinBoxTexts() {
  const THEME = document.getElementById("game-theme-text") as HTMLSpanElement;
  const PLAYER = document.getElementById("player-text") as HTMLSpanElement;
  const SIZE = document.getElementById("board-size-text") as HTMLSpanElement;

  THEME.innerText = `Theme`;
  PLAYER.innerText = `Player`;
  SIZE.innerText = `Board-Size`;
}

export function resetGame(): void {
  resetGameState();
  resetActivelySelectedBtns();
  resetVisuals(PLAYER_BUTTONS, BOARD_SIZE_BUTTONS, THEMES_BUTTONS);
  resetradioButtons();
  setTimeout(() => {
    goBackToSettings();
    updateStartButtonState();
    PLAYER_FIGURES.forEach((figure) => {
      figure.innerText = String(0);
    });
  }, 400);
}

function resetradioButtons(): void {
  const ALL_RADIO_INPUTS = document.querySelectorAll<HTMLInputElement>(
    'input[type="radio"]',
  );

  ALL_RADIO_INPUTS.forEach((input: HTMLInputElement) => {
    input.checked = false;
  });
}

function renderDialogElements(theme: string): HTMLDialogElement {
  const DIALOG = document.getElementById("overlayDialog") as HTMLDialogElement;

  let backBtnText = theme === "foods" ? `No, back to game` : `Back to game`;

  DIALOG.innerHTML = dialogElementTemplate(backBtnText);

  return DIALOG;
}

function dialogElementTemplate(text: string): string {
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

function dialogListeners(): void {
  const DIALOG = renderDialogElements(gameLogic.currentTheme);

  const EXIT_GAME = DIALOG.querySelector("#exitGame") as HTMLButtonElement;
  EXIT_GAME.addEventListener("click", () => {
    closeDialog();
    resetGame();
  });
  const BACK_TO_GAME_BTN = DIALOG.querySelector(
    "#backToGame",
  ) as HTMLButtonElement;
  BACK_TO_GAME_BTN.addEventListener("click", closeDialog);
}

DIALOG_EL.addEventListener("click", (event: MouseEvent) => {
  if (event.target === DIALOG_EL) closeDialog();
});

export function showGameOverScreen(): void {
  const GAME_OVER = renderGameOverElements();
  GAME_OVER.classList.add("show");

  const ORANGE_SCORE = document.getElementById(
    "orangeScore",
  ) as HTMLSpanElement;
  ORANGE_SCORE.innerText = String(gameLogic.playerScore.orange);
  const BLUE_SCORE = document.getElementById("blueScore") as HTMLSpanElement;
  BLUE_SCORE.innerText = String(gameLogic.playerScore.blue);
}

export function showWinnerScreen(): void {
  const WINNER_SCREEN_DIV = document.querySelector(
    ".winnerScreen",
  ) as HTMLDivElement;
  if (WINNER_SCREEN_DIV) {
    renderWinnerDrawScreen();
    WINNER_SCREEN_DIV.classList.add("show");
    updateWinnerVisuals(WINNER_SCREEN_DIV);
    const HOME_BTN = WINNER_SCREEN_DIV.querySelector(
      ".home-btn",
    ) as HTMLButtonElement;
    HOME_BTN.addEventListener("click", resetGame);
  }
}

function updateWinnerVisuals(screen: HTMLDivElement): void {
  const IMG = screen.querySelector(
    ".winner__content--figure img",
  ) as HTMLImageElement;
  const WINNER = screen.querySelector(".winner") as HTMLHeadingElement;
  const WINNER_TITLE = screen.querySelector(
    ".winner-title",
  ) as HTMLHeadingElement;
  if (IMG) blueOrOrangeFigure(IMG);
  if (WINNER && WINNER_TITLE) blueOrOrangeWinner(WINNER, WINNER_TITLE);
}

function blueOrOrangeFigure(img: HTMLImageElement): void {
  const ORANGE_SCORE = gameLogic.playerScore.orange;
  const BLUE_SCORE = gameLogic.playerScore.blue;

  if (ORANGE_SCORE > BLUE_SCORE) {
    if (gameLogic.currentTheme === "foods")
      img.src = "/assets/icons/orange-orange-winner.svg";
    else img.src = "/assets/icons/blue-orange-winner.svg";
  } else if (BLUE_SCORE > ORANGE_SCORE) {
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
): void {
  const ORANGE_SCORE = gameLogic.playerScore.orange;
  const BLUE_SCORE = gameLogic.playerScore.blue;

  if (ORANGE_SCORE > BLUE_SCORE) {
    title.innerText = `The winner is`;
    winner.innerText = `Orange Player`;
  } else if (ORANGE_SCORE < BLUE_SCORE) {
    title.innerText = `The winner is`;
    winner.innerText = `Blue Player`;
  } else {
    title.innerText = `It’s a`;
    winner.innerText = `DRAW`;
  }
}

export function hideGameOverScreen(): void {
  const GAME_OVER_DIV = document.querySelector(".gameOver") as HTMLDivElement;
  GAME_OVER_DIV.classList.remove("show");
}

function hideWinnerScreen(): void {
  const WINNER_SCREEN_DIV = document.querySelector(
    ".winnerScreen",
  ) as HTMLDivElement;
  WINNER_SCREEN_DIV.classList.remove("show");
}

function gameOverElementTemplate(): string {
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
  const GAME_OVER_DIV = document.querySelector(".gameOver") as HTMLDivElement;

  GAME_OVER_DIV.innerHTML = gameOverElementTemplate();
  return GAME_OVER_DIV;
}

function winnerDrawScreenTemplate(): string {
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
  const WINNER_SCREEN_DIV = document.querySelector(
    ".winnerScreen",
  ) as HTMLDivElement;
  WINNER_SCREEN_DIV.innerHTML = winnerDrawScreenTemplate();
  return WINNER_SCREEN_DIV;
}
