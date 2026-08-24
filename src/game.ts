import { Card, foods, GameState, DAProjects, themeObject } from "./type";

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

let flippedCards: HTMLElement[] = [];
let lockBoard: boolean = false;

export let gameLogic: GameState = {
  currentPlayer: "blue",
  changePlayer: false,
  currentCardsPair: 8,
  currentRows: 4,
  currentColumns: 4,
  currentTheme: "foods",
};

export function renderBoardElements(theme: string) {
  bodyEl.innerHTML = "";
  bodyEl.classList.add("board-white");
  gameIntroContainer.classList.add("d-none");
  startGame(theme === "foods" ? themeObject.foods : themeObject.DAProjects);
}

export function renderSettingsPage() {
  // bodyEl.innerHTML = "";
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

  updateBoardGridTemplate();

  cardsList.forEach((card) => {
    const cardHtml = createCardsElement(card);
    cardsContainer.appendChild(cardHtml);
  });
}

function updateBoardGridTemplate() {
  cardsContainer.style.gridTemplateRows = `repeat(${gameLogic.currentRows}, "120px")`;
  cardsContainer.style.gridTemplateColumns = `repeat(${gameLogic.currentColumns}, "120px")`;
}

export function startGame(foodsArray: string[]) {
  const cardsPack = initializeCards(foodsArray);
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
    setTimeout(() => {
      resetFlippedCardsArray();
    }, 300);
  } else {
    lockBoard = true;
    setTimeout(() => {
      removeFlippedClass();
      resetFlippedCardsArray();
    }, 800);
  }
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
  console.log("Current Player:", gameLogic.currentPlayer);
}

export function updateGameTheme(theme: string): void {
  gameLogic.currentTheme = theme;
  console.log("Current Theme:", gameLogic.currentTheme);
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
