import { Card, GameState, THEME_OBJECTS } from "./type";
import {
  showGameOverScreen,
  hideGameOverScreen,
  showWinnerScreen,
} from "./screens-dialog-reset";

export const BODY_EL = document.querySelector("body") as HTMLBodyElement;
export const GAME_INTRO_CONTAINER = document.querySelector(
  ".game-intro",
) as HTMLDivElement;
export const BOARD_CONTAINER = document.querySelector(
  ".board",
) as HTMLDivElement;
export const SETTINGS_CONTAINER = document.querySelector(
  ".settings-main",
) as HTMLDivElement;
const CARDS_CONTAINER = document.querySelector(
  ".board__main",
) as HTMLDivElement;
const PLAYER_FIGURE_ELEMENT = document.querySelector(
  ".board__navbar--currentPlayer--figure",
) as HTMLDivElement;
const EXIT_BTN_SVG = document.getElementById("exit-svg") as HTMLImageElement;
export const PLAYER_FIGURES = document.querySelectorAll(
  ".playerFigure span",
) as NodeListOf<HTMLSpanElement>;

export let gameLogic: GameState = {
  currentPlayer: "",
  currentCardsPair: 0,
  currentRows: 0,
  currentColumns: 0,
  currentTheme: "",
  activePlayer: "",
  lockBoard: false,
  flippedCards: [],
  playerScore: {
    orange: 0,
    blue: 0,
  },
};

export function renderBoardElements(theme: string): void {
  SETTINGS_CONTAINER.classList.add("d-none");
  BODY_EL.classList.add("board-white");
  GAME_INTRO_CONTAINER.classList.add("d-none");
  BOARD_CONTAINER.classList.remove("d-none");
  startGame(theme === "foods" ? THEME_OBJECTS.foods : THEME_OBJECTS.DAProjects);
  changeGameTheme(theme);
  setCurrentPlayerColor(gameLogic.currentPlayer);
}

function changeGameTheme(theme: string): void {
  document.documentElement.setAttribute("data-theme", theme);
  if (theme === "foods")
    EXIT_BTN_SVG.src = "/assets/icons/food/exit-orange-default.svg";
  else EXIT_BTN_SVG.src = "/assets/icons/DA/exit-blue-default.svg";
}

function setCurrentPlayerColor(color: string): void {
  if (color === "blue")
    PLAYER_FIGURE_ELEMENT.style.backgroundColor = "rgba(9, 127, 197, 1)";
  else PLAYER_FIGURE_ELEMENT.style.backgroundColor = "rgba(244, 131, 46, 1)";
}

export function renderSettingsPage(): void {
  BODY_EL.classList.add("board-white");
  GAME_INTRO_CONTAINER.classList.add("d-none");
  BOARD_CONTAINER.classList.add("d-none");
  SETTINGS_CONTAINER.classList.remove("d-none");
}

export function initializeCards(array: string[]): Card[] {
  const SHUFFELED_ARRAY = shuffleFinalArray(array);
  const SLICED_ARRAY = SHUFFELED_ARRAY.slice(0, gameLogic.currentCardsPair);
  const DOUBLED_ARRAY = [...SLICED_ARRAY, ...SLICED_ARRAY];

  let newCards: Card[] = [];

  DOUBLED_ARRAY.forEach((image, index) => {
    newCards.push({
      id: `card-${index + 1}`,
      image: image,
      isFlipped: false,
      isMatched: false,
    });
  });

  return newCards;
}

export function shuffleFinalArray<T>(array: T[]): T[] {
  let shuffeledArray: T[] = [];
  let currentIndex = array.length;
  let randomIndex: number;
  for (let i = array.length; i > 0; i--) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];

    shuffeledArray.push(array[currentIndex]);
  }

  return shuffeledArray;
}

function createCardsElement(cardData: Card): HTMLDivElement {
  const CARD_ELEMENT = document.createElement("div");
  CARD_ELEMENT.classList.add("flipCard");
  CARD_ELEMENT.dataset.id = cardData.id;
  const CARD_INNER = document.createElement("div");
  CARD_INNER.classList.add("flipCard__inner");
  const CARD_BACK = document.createElement("div");
  CARD_BACK.classList.add("flipCard__inner--back");
  const CARD_FRONT = document.createElement("div");
  CARD_FRONT.classList.add("flipCard__inner--front");
  const CARD_IMG = document.createElement("img");
  CARD_IMG.src = cardData.image;
  CARD_BACK.appendChild(CARD_IMG);
  CARD_INNER.appendChild(CARD_BACK);
  CARD_INNER.appendChild(CARD_FRONT);
  CARD_ELEMENT.appendChild(CARD_INNER);
  return CARD_ELEMENT;
}

export function renderCards(cardsList: Card[]): void {
  CARDS_CONTAINER.innerHTML = "";
  updateBoardGridTemplate(gameLogic.currentTheme);
  cardsList.forEach((card) => {
    const CARD_HTML = createCardsElement(card);
    CARDS_CONTAINER.appendChild(CARD_HTML);
  });
}

function updateBoardGridTemplate(theme: string): void {
  if (theme === "foods") {
    CARDS_CONTAINER.style.gridTemplateRows = `repeat(${gameLogic.currentRows}, 120px)`;
    CARDS_CONTAINER.style.gridTemplateColumns = `repeat(${gameLogic.currentColumns}, 120px)`;
  } else if (theme === "DAProjects") {
    CARDS_CONTAINER.style.gridTemplateRows = `repeat(${gameLogic.currentRows}, 100px)`;
    CARDS_CONTAINER.style.gridTemplateColumns = `repeat(${gameLogic.currentColumns}, 120px)`;
  }
}

export function startGame(cardsArray: string[]): void {
  const CARDS_PACK = initializeCards(cardsArray);
  const SHUFFELED_PACK = shuffleFinalArray(CARDS_PACK);

  renderCards(SHUFFELED_PACK);
}

function compareCardImg(firstCard: HTMLElement, secondCard: HTMLElement): void {
  if (isImgSrcSame(firstCard, secondCard))
    handleCardsMatch(firstCard, secondCard);
  else handleCardsMismatch(firstCard, secondCard);
}

function getCardsImgSrc(card: HTMLElement): string {
  const IMG = card.querySelector(
    ".flipCard__inner--back img",
  ) as HTMLImageElement;
  return IMG.src;
}

function isImgSrcSame(
  firstCard: HTMLElement,
  secondCard: HTMLElement,
): boolean {
  const FIRST_CARD_SRC = getCardsImgSrc(firstCard);
  const SECOND_CARD_SRC = getCardsImgSrc(secondCard);
  return FIRST_CARD_SRC === SECOND_CARD_SRC;
}

function handleCardsMatch(
  firstCard: HTMLElement,
  secondCard: HTMLElement,
): void {
  scoreManager();
  setTimeout(() => {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    resetFlippedCardsArray();
  }, 400);
}

function handleCardsMismatch(
  firstCard: HTMLElement,
  secondCard: HTMLElement,
): void {
  gameLogic.lockBoard = true;
  setTimeout(() => {
    removeFlippedClass(firstCard, secondCard);
    resetFlippedCardsArray();
    changePlayerTurn();
  }, 800);
}

function changePlayerTurn(): void {
  if (gameLogic.activePlayer === "orange") gameLogic.activePlayer = "blue";
  else if (gameLogic.activePlayer === "blue") gameLogic.activePlayer = "orange";
  gameLogic.currentPlayer = gameLogic.activePlayer;
  setCurrentPlayerColor(gameLogic.currentPlayer);
}

function scoreManager(): void {
  const CURRENT_PLAYER = gameLogic.currentPlayer as "orange" | "blue";
  gameLogic.playerScore[CURRENT_PLAYER]++;
  PLAYER_FIGURES.forEach((figure) => {
    const FIGURE_COLOR = figure.getAttribute("data-color");
    if (FIGURE_COLOR && FIGURE_COLOR === CURRENT_PLAYER) {
      figure.innerText = String(gameLogic.playerScore[CURRENT_PLAYER]);
    }
  });

  checkGameOver();
}

function checkGameOver(): void {
  const TOTAL_SCORE = gameLogic.playerScore.orange + gameLogic.playerScore.blue;
  const MAX_SCORE = gameLogic.currentCardsPair;

  if (TOTAL_SCORE !== MAX_SCORE) return;
  setTimeout(() => {
    showGameOverScreen();
  }, 1000);

  setTimeout(() => {
    hideGameOverScreen();
    showWinnerScreen();
  }, 2500);
}

function resetFlippedCardsArray(): void {
  gameLogic.flippedCards = [];
  gameLogic.lockBoard = false;
}

function removeFlippedClass(
  firstCard: HTMLElement,
  secondCard: HTMLElement,
): void {
  firstCard.classList.remove("flipped");
  secondCard.classList.remove("flipped");
}

CARDS_CONTAINER.addEventListener("click", (event) => {
  const CLICKED_CARD = event.target as HTMLDivElement;
  const TARGET = CLICKED_CARD.closest(".flipCard") as HTMLDivElement;

  if (!TARGET || gameLogic.lockBoard) return;
  if (TARGET.classList.contains("flipped")) return;

  TARGET.classList.add("flipped");
  gameLogic.flippedCards.push(TARGET);

  if (gameLogic.flippedCards.length === 2) {
    gameLogic.lockBoard = true;
    compareCardImg(gameLogic.flippedCards[0], gameLogic.flippedCards[1]);
  }
});

function updateCurrentPlayer(playerColor: string): void {
  gameLogic.currentPlayer = playerColor;
  gameLogic.activePlayer = gameLogic.currentPlayer;
}

export function updateGameTheme(theme: string): void {
  gameLogic.currentTheme = theme;
}

function updateBoardSize(boardSize: string): void {
  const [ROWS, COLS] = boardSize.split("x").map(Number);
  gameLogic.currentRows = ROWS;
  gameLogic.currentColumns = COLS;
  gameLogic.currentCardsPair = (ROWS * COLS) / 2;
}

export function handleBoardSizeChange(radioBtn: HTMLInputElement): void {
  radioBtn.checked = true;
  updateBoardSize(radioBtn.value);
}

export function handleGameThemeChange(theme: string): void {
  updateGameTheme(theme);
}

// function updateBoardSetting(size: string) {
//   const [rows, cols] = size.split("x").map(Number);
//   // boardText.textContent = `${rows * cols}-Cards`;
// }

export function handlePlayerChange(playerColor: string): void {
  updateCurrentPlayer(playerColor);
}

export function isSettingsComplete(): boolean {
  const HAS_SIZE = gameLogic.currentRows > 0 && gameLogic.currentColumns > 0;
  const HAS_PLAYER = gameLogic.currentPlayer !== "";
  const HAS_THEME = gameLogic.currentTheme !== "";

  return HAS_SIZE && HAS_PLAYER && HAS_THEME;
}

export function updateStartButtonState(): void {
  const START_BTN = document.getElementById("start-Btn") as HTMLButtonElement;

  if (START_BTN) START_BTN.disabled = !isSettingsComplete();
}
