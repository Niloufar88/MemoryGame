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

/**
 * overlay dialog element
 */
const DIALOG_EL = document.getElementById("overlayDialog") as HTMLDialogElement;

/**
 * finding and opening the overlay dialog for exiting the game
 * and runs accordingly the listeners for the dialog
 */
export function openDialog(): void {
  const DIALOG = document.querySelector(".exitOverlay") as HTMLDialogElement;

  if (DIALOG) {
    renderDialogElements(gameLogic.currentTheme);
    DIALOG.showModal();
    dialogListeners();
  }
}

/**
 * closing the overlay dialog for exiting the game
 */
export function closeDialog(): void {
  const DIALOG = document.querySelector(".exitOverlay") as HTMLDialogElement;
  DIALOG.close();
}

/**
 * reseting all factors in gameLogic by returning to settings page
 */
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

/**
 * reset all actively selected buttons to return to their default state by returning to settings page
 */
function resetActivelySelectedBtns(): void {
  ACTIVELY_SELECTED_RADIOS.boardSize = null;
  ACTIVELY_SELECTED_RADIOS.player = null;
  ACTIVELY_SELECTED_RADIOS.gameTheme = null;
}

/**
 * making a loop on all provided radio input elements and resetting their visuals
 * @param players radio input elements
 * @param sizes radio input elements
 * @param themes radio input elements
 */
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

/**
 * managing going back to the home screen by adding or removing necessary classes and resetting the game state
 */
export function goBackToHome(): void {
  hideWinnerScreen();
  BOARD_CONTAINER.classList.add("d-none");
  BODY_EL.classList.remove("board-white");
  GAME_INTRO_CONTAINER.classList.remove("d-none");
  resetGameState();
}

/**
 * managing the reset process by adding or removing classes to main containers and resetting game state
 */
export function goBackToSettings(): void {
  hideWinnerScreen();
  BOARD_CONTAINER.classList.add("d-none");
  SETTINGS_CONTAINER.classList.remove("d-none");
  resetSettinBoxTexts();
  SETTING_BOX.classList.remove("streched");
  resetGameState();
}

/**
 * returning the text in the setting box to their default phase
 */
function resetSettinBoxTexts() {
  const THEME = document.getElementById("game-theme-text") as HTMLSpanElement;
  const PLAYER = document.getElementById("player-text") as HTMLSpanElement;
  const SIZE = document.getElementById("board-size-text") as HTMLSpanElement;

  THEME.innerText = `Theme`;
  PLAYER.innerText = `Player`;
  SIZE.innerText = `Board-Size`;
}

/**
 * managing reset game by setting different factors to their default phase and returning to the settings page
 */
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

/**
 * oresetting all radio input buttons to their deafult phase by setting their attribute checked to false.
 */
function resetradioButtons(): void {
  const ALL_RADIO_INPUTS = document.querySelectorAll<HTMLInputElement>(
    'input[type="radio"]',
  );

  ALL_RADIO_INPUTS.forEach((input: HTMLInputElement) => {
    input.checked = false;
  });
}

/**
 * making a dialog ready to be rendered on the screen scoordingly to the selected theme of the game.
 * @param theme game theme which saved in gameLogic
 * @returns a dialog accordingly to the selected theme of the game
 */
function renderDialogElements(theme: string): HTMLDialogElement {
  const DIALOG = document.getElementById("overlayDialog") as HTMLDialogElement;
  let backBtnText = theme === "foods" ? `No, back to game` : `Back to game`;
  DIALOG.innerHTML = dialogElementTemplate(backBtnText);
  return DIALOG;
}

/**
 * generate a template to be shown on the screen when exit button clicked.
 * @param text the text to be displayed on the back button in the dialog accordingly to the selected theme of the game
 * @returns a HTML-Template to be shown on the screen when exit button clicked
 */
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

/**
 * adding event listeners to the dialog buttons for exiting the game or going back to the game.
 */
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

/**
 * managing a click listener to close a dialog when it is open by ckicking outside of the dialog everywhere on the screen.
 */
DIALOG_EL.addEventListener("click", (event: MouseEvent) => {
  if (event.target === DIALOG_EL) closeDialog();
});

/**
 * showing the game over screen with the final scores of both players.
 */
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

/**
 * show winnerscreen and updating its visuals and managing a click listener for home button.
 */
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

/**
 * updating the image and the text on the winner screen
 * @param screen winner screen div.
 */
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

/**
 * checking teh scores to see which figure should be rendered on the winner screen
 * @param img image of the winner figure
 */
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

/**
 * checks if there is any winner or should it display a draw.
 * @param winner winner text or draw text
 * @param title winner title or draw title
 */
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

/**
 * manage to hide game over screen by removing show class of it.
 */
export function hideGameOverScreen(): void {
  const GAME_OVER_DIV = document.querySelector(".gameOver") as HTMLDivElement;
  GAME_OVER_DIV.classList.remove("show");
}

/**
 * managing to hide the winner screen by removing show class of it
 */
function hideWinnerScreen(): void {
  const WINNER_SCREEN_DIV = document.querySelector(
    ".winnerScreen",
  ) as HTMLDivElement;
  WINNER_SCREEN_DIV.classList.remove("show");
}

/**
 * generate content of the game over screen
 * @returns HTML-Template which holds the content of game over screen
 */
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

/**
 * rendering game over elmenets by generating its inner html.
 * @returns a div which holds game over content
 */
function renderGameOverElements(): HTMLDivElement {
  const GAME_OVER_DIV = document.querySelector(".gameOver") as HTMLDivElement;

  GAME_OVER_DIV.innerHTML = gameOverElementTemplate();
  return GAME_OVER_DIV;
}

/**
 * generating html content of the winner screen
 * @returns HTML-Template of the winner screen
 */
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

/**
 * rendering winner screen by generating its inner html.
 * @returns a div which holds winner screen content
 */
function renderWinnerDrawScreen(): HTMLDivElement {
  const WINNER_SCREEN_DIV = document.querySelector(
    ".winnerScreen",
  ) as HTMLDivElement;
  WINNER_SCREEN_DIV.innerHTML = winnerDrawScreenTemplate();
  return WINNER_SCREEN_DIV;
}
