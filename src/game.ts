import { Card, GameState, THEME_OBJECTS } from "./type";
import {
  showGameOverScreen,
  hideGameOverScreen,
  showWinnerScreen,
} from "./screens-dialog-reset";

/**
 * body element on page load
 */
export const BODY_EL = document.querySelector("body") as HTMLBodyElement;

/**
 * game intro container element
 */
export const GAME_INTRO_CONTAINER = document.querySelector(
  ".game-intro",
) as HTMLDivElement;

/**
 * board container element
 */
export const BOARD_CONTAINER = document.querySelector(
  ".board",
) as HTMLDivElement;

/**
 * settings container element
 */
export const SETTINGS_CONTAINER = document.querySelector(
  ".settings-main",
) as HTMLDivElement;

/**
 * cards container element in board section
 */
const CARDS_CONTAINER = document.querySelector(
  ".board__main",
) as HTMLDivElement;

/**
 * current player figure element in board navbar
 */
const PLAYER_FIGURE_ELEMENT = document.querySelector(
  ".board__navbar--currentPlayer--figure",
) as HTMLDivElement;

/**
 * exit button SVG element  in board navbar
 */
const EXIT_BTN_SVG = document.getElementById("exit-svg") as HTMLImageElement;
export const PLAYER_FIGURES = document.querySelectorAll(
  ".playerFigure span",
) as NodeListOf<HTMLSpanElement>;

/**
 * managing game logic which contains the current state of the game, including players, cards, and scores
 */
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

/**
 * managing to show or hide dirrefent sections due to the selected game theme
 * and updating current player color
 * @param theme which will be used from gameLogic as gameTheme
 */
export function renderBoardElements(theme: string): void {
  SETTINGS_CONTAINER.classList.add("d-none");
  BODY_EL.classList.add("board-white");
  GAME_INTRO_CONTAINER.classList.add("d-none");
  BOARD_CONTAINER.classList.remove("d-none");
  startGame(theme === "foods" ? THEME_OBJECTS.foods : THEME_OBJECTS.DAProjects);
  changeGameTheme(theme);
  setCurrentPlayerColor(gameLogic.currentPlayer);
}

/**
 * sets theme of the game based on data-theme attribute
 * @param theme which will be used from gameLogic as gameTheme
 */
function changeGameTheme(theme: string): void {
  document.documentElement.setAttribute("data-theme", theme);
  if (theme === "foods")
    EXIT_BTN_SVG.src = "/assets/icons/food/exit-orange-default.svg";
  else EXIT_BTN_SVG.src = "/assets/icons/DA/exit-blue-default.svg";
}

/**
 * sets the current player figure element's color based on the current player's color
 * @param color which will be used from gameLogic as current player
 */
function setCurrentPlayerColor(color: string): void {
  if (color === "blue")
    PLAYER_FIGURE_ELEMENT.style.backgroundColor = "rgba(9, 127, 197, 1)";
  else PLAYER_FIGURE_ELEMENT.style.backgroundColor = "rgba(244, 131, 46, 1)";
}

/**
 * renders the settings page by showing the settings container and hiding other sections
 */
export function renderSettingsPage(): void {
  BODY_EL.classList.add("board-white");
  GAME_INTRO_CONTAINER.classList.add("d-none");
  BOARD_CONTAINER.classList.add("d-none");
  SETTINGS_CONTAINER.classList.remove("d-none");
}

/**
 * gets a base array, shuffle it once, slice it based on the current cards pair, and double it to create a new array of cards
 * do a loop to create new card objects with unique ids, images, and initial states for flipping and matching,
 * @param array the base array depends on selected theme
 * @returns array of new cards
 */
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

/**
 * gets an array and returns a shuffled version of it
 * @param array
 * @returns shuffeled array of cards
 */
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

/**
 * create HTML-Elements of a single card
 * @param cardData a div element which contains some information about the card
 * @returns a complete card element which will be rendered at board
 */
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

/**
 * clears the game board each time before rendering the new set of cards
 * updating the game theme
 * renders the given array of cards on the game board
 * @param cardsList array of cards which will be rendered at board
 */
export function renderCards(cardsList: Card[]): void {
  CARDS_CONTAINER.innerHTML = "";
  updateBoardGridTemplate(gameLogic.currentTheme);
  cardsList.forEach((card) => {
    const CARD_HTML = createCardsElement(card);
    CARDS_CONTAINER.appendChild(CARD_HTML);
  });
}

/**
 * updates the board grid template based on the current game theme
 * @param theme theme of the game which will be used from gameLogic gameTheme
 */
function updateBoardGridTemplate(theme: string): void {
  if (theme === "foods") {
    CARDS_CONTAINER.style.gridTemplateRows = `repeat(${gameLogic.currentRows}, 120px)`;
    CARDS_CONTAINER.style.gridTemplateColumns = `repeat(${gameLogic.currentColumns}, 120px)`;
  } else if (theme === "DAProjects") {
    CARDS_CONTAINER.style.gridTemplateRows = `repeat(${gameLogic.currentRows}, 100px)`;
    CARDS_CONTAINER.style.gridTemplateColumns = `repeat(${gameLogic.currentColumns}, 120px)`;
  }
}

/**
 * gets array of images srcs , shuffle theme and render them on the board. so the game can be start.
 * @param cardsArray array of card images which will be rendered later on board
 */
export function startGame(cardsArray: string[]): void {
  const CARDS_PACK = initializeCards(cardsArray);
  const SHUFFELED_PACK = shuffleFinalArray(CARDS_PACK);
  renderCards(SHUFFELED_PACK);
}

/**
 * comparing image srcs of the two flipped cards which have beed saved in an array and accordingly handling match or mismatch scenarios
 * @param firstCard HTML Element which will be saved in gameLogic flippedCards array
 * @param secondCard HTML Element which will be saved in gameLogic flippedCards array
 */
function compareCardImg(firstCard: HTMLElement, secondCard: HTMLElement): void {
  if (isImgSrcSame(firstCard, secondCard))
    handleCardsMatch(firstCard, secondCard);
  else handleCardsMismatch(firstCard, secondCard);
}

/**
 * gets the image src of the given card element
 * @param card clicked Card Element which has been saved as HTMLElement in an array
 * @returns
 */
function getCardsImgSrc(card: HTMLElement): string {
  const IMG = card.querySelector(
    ".flipCard__inner--back img",
  ) as HTMLImageElement;
  return IMG.src;
}

/**
 * comparing src of images of the two flipped cards
 * @param firstCard first clicked Card Element which has been saved as HTMLElement in an array
 * @param secondCard second clicked Card Element which has been saved as HTMLElement in an array
 * @returns true or false accordingly on the comparison
 */
function isImgSrcSame(
  firstCard: HTMLElement,
  secondCard: HTMLElement,
): boolean {
  const FIRST_CARD_SRC = getCardsImgSrc(firstCard);
  const SECOND_CARD_SRC = getCardsImgSrc(secondCard);
  return FIRST_CARD_SRC === SECOND_CARD_SRC;
}

/**
 * handeling as if two src images are the same, runs score manager and reset flipped cards array after 400ms
 * @param firstCard first clicked Card Element which has been saved as HTMLElement in an array
 * @param secondCardsecond clicked Card Element which has been saved as HTMLElement in an array
 */
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

/**
 * handeling as if two src images are not the same, lock the board, reset flipped cards array and change player turn after 800ms
 * @param firstCard first clicked Card Element which has been saved as HTMLElement in an array
 * @param secondCardsecond clicked Card Element which has been saved as HTMLElement in an array
 */
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

/**
 * checks which player is now active and set it as current player in gameLogic
 * and updates current player color acoordingly
 */
function changePlayerTurn(): void {
  if (gameLogic.activePlayer === "orange") gameLogic.activePlayer = "blue";
  else if (gameLogic.activePlayer === "blue") gameLogic.activePlayer = "orange";
  gameLogic.currentPlayer = gameLogic.activePlayer;
  setCurrentPlayerColor(gameLogic.currentPlayer);
}

/**
 * saves the current player and add scores accordingly and save it in gameLogic
 * and checks each time after adding a score if the game is over
 */
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

/**
 * comparing total scores of the two players with the max score which can be reached
 * and checks if the game over screen and winner draw screen should be run
 *
 */
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

/**
 * resets the array of flipped cards and unlocks the board
 */
function resetFlippedCardsArray(): void {
  gameLogic.flippedCards = [];
  gameLogic.lockBoard = false;
}

/**
 * removing flipped card class from the clicked cards
 * @param firstCard first clicked Card Element which has been saved as HTMLElement in an array
 * @param secondCard second clicked Card Element which has been saved as HTMLElement in an array
 */
function removeFlippedClass(
  firstCard: HTMLElement,
  secondCard: HTMLElement,
): void {
  firstCard.classList.remove("flipped");
  secondCard.classList.remove("flipped");
}

/**
 * managing click event on a card, gives them the flipped class so they will appear in flippedCards array as well and see if comparing cards images funtion should be run
 */
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

/**
 * gets the seleceted color and save it as a current player
 * @param playerColor player color which will be saved in gmaeLogic as currentPlayer
 */
function updateCurrentPlayer(playerColor: string): void {
  gameLogic.currentPlayer = playerColor;
  gameLogic.activePlayer = gameLogic.currentPlayer;
}

/**
 * gets the game theme and save it into gameLogic as current theme
 * @param theme game theme
 */
export function updateGameTheme(theme: string): void {
  gameLogic.currentTheme = theme;
}

/**
 * updating rows and columns of the board based on selected board size in setting page and update different variables in gameLogic
 * @param boardSize a string which was selected by user in setting section
 */
function updateBoardSize(boardSize: string): void {
  const [ROWS, COLS] = boardSize.split("x").map(Number);
  gameLogic.currentRows = ROWS;
  gameLogic.currentColumns = COLS;
  gameLogic.currentCardsPair = (ROWS * COLS) / 2;
}

/**
 * runs update board size function and sets the attribute check by input button as true
 * @param radioBtn an input element
 */
export function handleBoardSizeChange(radioBtn: HTMLInputElement): void {
  radioBtn.checked = true;
  updateBoardSize(radioBtn.value);
}

/**
 * updates game theme accordingly to selected theme by user
 * @param theme game theme
 */
export function handleGameThemeChange(theme: string): void {
  updateGameTheme(theme);
}

/**
 * updates current player by gameLogic
 * @param playerColor which will be saved as current player in gameLogic
 */
export function handlePlayerChange(playerColor: string): void {
  updateCurrentPlayer(playerColor);
}

/**
 * checks if all 3 parameters are saved in gameLogic so the button can be enable
 * @returns true or false
 */
export function isSettingsComplete(): boolean {
  const HAS_SIZE = gameLogic.currentRows > 0 && gameLogic.currentColumns > 0;
  const HAS_PLAYER = gameLogic.currentPlayer !== "";
  const HAS_THEME = gameLogic.currentTheme !== "";
  return HAS_SIZE && HAS_PLAYER && HAS_THEME;
}

/**
 * updating start button visually and sets its attribute to disabled or enabled accordingly
 */
export function updateStartButtonState(): void {
  const START_BTN = document.getElementById("start-Btn") as HTMLButtonElement;
  if (START_BTN) START_BTN.disabled = !isSettingsComplete();
}
