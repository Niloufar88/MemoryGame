import { Card, GameState, themeObject } from "./type";

const bodyEl = document.querySelector("body") as HTMLBodyElement;
const gameIntroContainer = document.querySelector(
  ".game-intro",
) as HTMLDivElement;
const boardContainer = document.querySelector(".board") as HTMLDivElement;
const settingsContainer = document.querySelector(
  ".settings-main",
) as HTMLDivElement;
const cardsContainer = document.querySelector(".board__main") as HTMLDivElement;
const themeText = document.getElementById("game-theme-text") as HTMLSpanElement;
const boardText = document.getElementById("board-size-text") as HTMLSpanElement;
const playerText = document.getElementById("player-text") as HTMLSpanElement;
const playerFigureElement = document.querySelector(
  ".board__navbar--currentPlayer--figure",
) as HTMLDivElement;
const exitBtnSvg = document.getElementById("exit-svg") as HTMLImageElement;
const orangeScore = document.getElementById("OScore") as HTMLSpanElement;
const blueScore = document.getElementById("BScore") as HTMLSpanElement;
const playerFigures = document.querySelectorAll(
  ".playerFigure span",
) as NodeListOf<HTMLSpanElement>;
const gameOverDialog = document.querySelector(".gameOver") as HTMLDialogElement;

let flippedCards: HTMLElement[] = [];
let lockBoard: boolean = false;
let activePlayer: string;
let maxScore: number;

export let gameLogic: GameState = {
  currentPlayer: "",
  currentCardsPair: 0,
  currentRows: 0,
  currentColumns: 0,
  currentTheme: "",
  playerScore: {
    orange: 0,
    blue: 0,
  },
};

export function renderBoardElements(theme: string) {
  settingsContainer.classList.add("d-none");
  bodyEl.classList.add("board-white");
  gameIntroContainer.classList.add("d-none");
  boardContainer.classList.remove("d-none");
  startGame(theme === "foods" ? themeObject.foods : themeObject.DAProjects);
  changeGameTheme(theme);
  setCurrentPlayerColor(gameLogic.currentPlayer);
}

function changeGameTheme(theme: string) {
  document.documentElement.setAttribute("data-theme", theme);
  if (theme === "foods")
    exitBtnSvg.src = "/assets/icons/food/exit-orange-default.svg";
  else exitBtnSvg.src = "/assets/icons/DA/exit-blue-default.svg";
}

function setCurrentPlayerColor(color: string) {
  if (color === "blue")
    playerFigureElement.style.backgroundColor = "rgba(9, 127, 197, 1)";
  else playerFigureElement.style.backgroundColor = "rgba(244, 131, 46, 1)";
}

export function renderSettingsPage() {
  bodyEl.classList.add("board-white");
  gameIntroContainer.classList.add("d-none");
  boardContainer.classList.add("d-none");
  settingsContainer.classList.remove("d-none");
}

export function initializeCards(array: string[]) {
  const shuffeledArray = shuffleFinalArray(array);
  const slicedArray = shuffeledArray.slice(0, gameLogic.currentCardsPair);
  const doubledArray = [...slicedArray, ...slicedArray];

  let newCards: Card[] = [];

  doubledArray.forEach((image, index) => {
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
  const cardElement = document.createElement("div");
  cardElement.classList.add("flipCard");
  cardElement.dataset.id = cardData.id;
  const cardInner = document.createElement("div");
  cardInner.classList.add("flipCard__inner");
  const cardBack = document.createElement("div");
  cardBack.classList.add("flipCard__inner--back");
  const cardFront = document.createElement("div");
  cardFront.classList.add("flipCard__inner--front");
  const cardImg = document.createElement("img");
  cardImg.src = cardData.image;
  cardBack.appendChild(cardImg);
  cardInner.appendChild(cardBack);
  cardInner.appendChild(cardFront);
  cardElement.appendChild(cardInner);
  return cardElement;
}

export function renderCards(cardsList: Card[]) {
  cardsContainer.innerHTML = "";
  updateBoardGridTemplate(gameLogic.currentTheme);
  cardsList.forEach((card) => {
    const cardHtml = createCardsElement(card);
    cardsContainer.appendChild(cardHtml);
  });
}

function updateBoardGridTemplate(theme: string) {
  if (theme === "foods") {
    cardsContainer.style.gridTemplateRows = `repeat(${gameLogic.currentRows}, 120px)`;
    cardsContainer.style.gridTemplateColumns = `repeat(${gameLogic.currentColumns}, 120px)`;
  } else if (theme === "DAProjects") {
    cardsContainer.style.gridTemplateRows = `repeat(${gameLogic.currentRows}, 100px)`;
    cardsContainer.style.gridTemplateColumns = `repeat(${gameLogic.currentColumns}, 120px)`;
  }
}

export function startGame(cardsArray: string[]) {
  const cardsPack = initializeCards(cardsArray);
  const shuffeldPack = shuffleFinalArray(cardsPack);

  renderCards(shuffeldPack);
}

function compareCardImg() {
  const firstCardImg = flippedCards[0].querySelector(
    ".flipCard__inner--back img",
  ) as HTMLImageElement;
  const secondCardImg = flippedCards[1].querySelector(
    ".flipCard__inner--back img",
  ) as HTMLImageElement;

  if (firstCardImg.src === secondCardImg.src) {
    scoreManager();
    setTimeout(() => {
      flippedCards[0].classList.add("matched");
      flippedCards[1].classList.add("matched");
      resetFlippedCardsArray();
    }, 400);
  } else {
    lockBoard = true;
    setTimeout(() => {
      removeFlippedClass();
      resetFlippedCardsArray();
      changePlayerTurn();
    }, 800);
  }
}

function changePlayerTurn() {
  if (activePlayer === "orange") activePlayer = "blue";
  else if (activePlayer === "blue") activePlayer = "orange";
  gameLogic.currentPlayer = activePlayer;
  setCurrentPlayerColor(gameLogic.currentPlayer);
}

function scoreManager() {
  const currentPlayer = gameLogic.currentPlayer as "orange" | "blue";
  gameLogic.playerScore[currentPlayer]++;
  playerFigures.forEach((figure) => {
    const figureColor = figure.getAttribute("data-color");
    if (figureColor && figureColor === currentPlayer) {
      figure.innerText = String(gameLogic.playerScore[currentPlayer]);
    }
  });

  checkGameOver();
}

function checkGameOver() {
  const totalScore = gameLogic.playerScore.orange + gameLogic.playerScore.blue;
  const maxScore = gameLogic.currentCardsPair;

  if (totalScore !== maxScore) return;
  setTimeout(() => {
    showGameOverScreen();
  }, 1000);

  // setTimeout(() => {
  //   hideGameOverScreen();
  //   if (
  //     gameLogic.playerScore.orange > gameLogic.playerScore.blue ||
  //     gameLogic.playerScore.orange < gameLogic.playerScore.blue
  //   )
  //     showWinnerScreen();
  //   else showDrawScreen();
  // }, 2000);
}

function showGameOverScreen() {
  gameOverDialog.classList.add("show");

  const orangeScore = document.getElementById("orangeScore") as HTMLSpanElement;
  orangeScore.innerText = String(gameLogic.playerScore.orange);
  const blueScore = document.getElementById("blueScore") as HTMLSpanElement;
  blueScore.innerText = String(gameLogic.playerScore.blue);
}

function hideGameOverScreen() {
  gameOverDialog.classList.remove("show");
}

function resetFlippedCardsArray() {
  flippedCards = [];
  lockBoard = false;
}

function removeFlippedClass() {
  flippedCards[0].classList.remove("flipped");
  flippedCards[1].classList.remove("flipped");
}

cardsContainer.addEventListener("click", (event) => {
  const clickedCard = event.target as HTMLDivElement;
  const target = clickedCard.closest(".flipCard") as HTMLDivElement;

  if (!target || lockBoard) return;
  if (target.classList.contains("flipped")) return;

  target.classList.add("flipped");
  flippedCards.push(target);

  if (flippedCards.length === 2) {
    lockBoard = true;
    compareCardImg();
  }
});

function updateCurrentPlayer(playerColor: string): void {
  gameLogic.currentPlayer = playerColor;
  activePlayer = gameLogic.currentPlayer;
}

export function updateGameTheme(theme: string): void {
  gameLogic.currentTheme = theme;
}

function updateBoardSize(boardSize: string): void {
  const [rows, cols] = boardSize.split("x").map(Number);
  gameLogic.currentRows = rows;
  gameLogic.currentColumns = cols;
  gameLogic.currentCardsPair = (rows * cols) / 2;
}

export function handleBoardSizeChange(radioBtn: HTMLInputElement) {
  radioBtn.checked = true;
  updateBoardSize(radioBtn.value);
  updateBoardSetting(radioBtn.value);
}

export function handleGameThemeChange(theme: string): void {
  updateGameTheme(theme);
  themeText.textContent = theme;
}

function updateBoardSetting(size: string) {
  const [rows, cols] = size.split("x").map(Number);
  boardText.textContent = `${rows * cols}-Cards`;
}

export function handlePlayerChange(playerColor: string): void {
  updateCurrentPlayer(playerColor);
  playerText.textContent = playerColor;
}

function isSettingsComplete(): boolean {
  const hasSize = gameLogic.currentRows > 0 && gameLogic.currentColumns > 0;
  const hasPlayer = gameLogic.currentPlayer !== "";
  const hasTheme = gameLogic.currentTheme !== "";

  return hasSize && hasPlayer && hasTheme;
}

export function updateStartButtonState(): void {
  const startBtn = document.getElementById("start-Btn") as HTMLButtonElement;

  if (startBtn) startBtn.disabled = !isSettingsComplete();
}
