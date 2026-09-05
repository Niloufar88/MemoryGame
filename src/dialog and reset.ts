import { themeObject } from "./type";
import {
  gameLogic,
  hideWinnerScreen,
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
} from "./main";

const homeBtn = document.querySelector(".home-btn") as HTMLButtonElement;

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
  resetGameState();
}

export function resetGame() {
  resetGameState();
  resetActivelySelectedBtns();
  resetVisuals(playerButtons, boardSizeButtons, themesButtons);
  resetradioButtons();
  goBackToSettings();
  updateStartButtonState();
  playerFigures.forEach((figure) => {
    figure.innerText = String(0);
  });
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

homeBtn?.addEventListener("click", resetGame);

dialogEl.addEventListener("click", (event: MouseEvent) => {
  if (event.target === dialogEl) closeDialog();
});
