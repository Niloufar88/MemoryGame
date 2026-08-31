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
const gameOverDiv = document.querySelector(".gameOver") as HTMLDivElement;
const winnerScreenDiv = document.querySelector(
  ".winnerScreen",
) as HTMLDivElement;
const winnerImg = document.querySelector(
  ".winner__content--figure img",
) as HTMLImageElement;

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
  const firstCardImg = gameLogic.flippedCards[0].querySelector(
    ".flipCard__inner--back img",
  ) as HTMLImageElement;
  const secondCardImg = gameLogic.flippedCards[1].querySelector(
    ".flipCard__inner--back img",
  ) as HTMLImageElement;

  if (firstCardImg.src === secondCardImg.src) {
    scoreManager();
    setTimeout(() => {
      gameLogic.flippedCards[0].classList.add("matched");
      gameLogic.flippedCards[1].classList.add("matched");
      resetFlippedCardsArray();
    }, 400);
  } else {
    gameLogic.lockBoard = true;
    setTimeout(() => {
      removeFlippedClass();
      resetFlippedCardsArray();
      changePlayerTurn();
    }, 800);
  }
}

function changePlayerTurn() {
  if (gameLogic.activePlayer === "orange") gameLogic.activePlayer = "blue";
  else if (gameLogic.activePlayer === "blue") gameLogic.activePlayer = "orange";
  gameLogic.currentPlayer = gameLogic.activePlayer;
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

  setTimeout(() => {
    hideGameOverScreen();
    showWinnerScreen();
  }, 2500);
}

function showGameOverScreen() {
  gameOverDiv.classList.add("show");

  const orangeScore = document.getElementById("orangeScore") as HTMLSpanElement;
  orangeScore.innerText = String(gameLogic.playerScore.orange);
  const blueScore = document.getElementById("blueScore") as HTMLSpanElement;
  blueScore.innerText = String(gameLogic.playerScore.blue);
}

function showWinnerScreen() {
  winnerScreenDiv.classList.add("show");
  blueOrOrangeFigure();
  blueOrOrangeWinner();
}

function hideWinnerScreen() {
  winnerScreenDiv.classList.remove("show");
}

function blueOrOrangeFigure() {
  const orangeScore = gameLogic.playerScore.orange;
  const blueScore = gameLogic.playerScore.blue;

  if (orangeScore > blueScore) {
    if (gameLogic.currentTheme === "orange")
      winnerImg.src = "/assets/icons/orange-orange-winner.svg";
    else winnerImg.src = "/assets/icons/blue-orange-winner.svg";
  } else if (blueScore > orangeScore) {
    if (gameLogic.currentTheme === "orange")
      winnerImg.src = "/assets/icons/orange-blue-winner.svg";
    else winnerImg.src = "/assets/icons/blue-blue-winner.svg";
  } else {
    if (gameLogic.currentTheme === "orange")
      winnerImg.src = "/assets/icons/orange-draw-img.svg";
    else winnerImg.src = "/assets/icons/blue-draw-img.svg";
  }
}

function blueOrOrangeWinner() {
  const winner = document.querySelector(".winner") as HTMLHeadingElement;
  const winnerTitle = document.querySelector(
    ".winner-title",
  ) as HTMLHeadingElement;

  const orangeScore = gameLogic.playerScore.orange;
  const blueScore = gameLogic.playerScore.blue;

  if (orangeScore > blueScore) {
    winnerTitle.innerText = `The winner is`;
    winner.innerText = `Orange Player`;
  } else if (orangeScore < blueScore) {
    winnerTitle.innerText = `The winner is`;
    winner.innerText = `Blue Player`;
  } else {
    winnerTitle.innerText = `It’s a`;
    winner.innerText = `DRAW`;
  }
}

function hideGameOverScreen() {
  gameOverDiv.classList.remove("show");
}

function resetFlippedCardsArray() {
  gameLogic.flippedCards = [];
  gameLogic.lockBoard = false;
}

function removeFlippedClass() {
  gameLogic.flippedCards[0].classList.remove("flipped");
  gameLogic.flippedCards[1].classList.remove("flipped");
}

cardsContainer.addEventListener("click", (event) => {
  const clickedCard = event.target as HTMLDivElement;
  const target = clickedCard.closest(".flipCard") as HTMLDivElement;

  if (!target || gameLogic.lockBoard) return;
  if (target.classList.contains("flipped")) return;

  target.classList.add("flipped");
  gameLogic.flippedCards.push(target);

  if (gameLogic.flippedCards.length === 2) {
    gameLogic.lockBoard = true;
    compareCardImg();
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

export function goBackToHome() {
  hideWinnerScreen();
  boardContainer.classList.add("d-none");
  bodyEl.classList.remove("board-white");
  gameIntroContainer.classList.remove("d-none");
}
