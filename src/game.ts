import { Card, cards, GameState } from "./type";

const bodyEl = document.querySelector("body") as HTMLBodyElement;
const mainContainer = document.querySelector(".game-intro") as HTMLDivElement;
const cardsContainer = document.querySelector(".board__main") as HTMLDivElement;

let flippedCards: HTMLElement[] = [];
let lockBoard: boolean = false;

let gameLogic: GameState = {
  currentPlayer: "blue",
};

export function renderBoardElements() {
  bodyEl.innerHTML = "";
  bodyEl.classList.add("board-body");
  mainContainer.classList.add("d-none");
  startGame(cards);
}

export function initializeCards(array: string[]) {
  const doubledArray = [...cards, ...cards];

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

  cardsList.forEach((card) => {
    const cardHtml = createCardsElement(card);
    cardsContainer.appendChild(cardHtml);
  });
}

export function startGame(cardsArray: string[]) {
  const cardsPack = initializeCards(cardsArray);
  const shuffeldPack = shuffleFinalArray(cardsPack);

  renderCards(shuffeldPack);
}

function compareCardImg() {
  const firstCard = flippedCards[0];
  const secondCard = flippedCards[1];

  const firstCardImg = firstCard.querySelector(
    ".flipCard__inner--back img",
  ) as HTMLImageElement;
  const secondCardImg = secondCard.querySelector(
    ".flipCard__inner--back img",
  ) as HTMLImageElement;

  if (firstCardImg.src === secondCardImg.src) flippedCards = [];
  else {
    lockBoard = true;
    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      flippedCards = [];
      lockBoard = false;
    }, 800);
  }
}

cardsContainer.addEventListener("click", (event) => {
  const clickedCard = event.target as HTMLDivElement;
  const target = clickedCard.closest(".flipCard") as HTMLDivElement;

  if (!target || lockBoard) return;
  if (target.classList.contains("flipped")) return;

  if (target) target.classList.add("flipped");
  flippedCards.push(target);

  if (flippedCards.length === 2) compareCardImg();
});
