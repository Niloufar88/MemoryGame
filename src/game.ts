import { Card, cards, GameState } from "./type";

const bodyEl = document.querySelector("body") as HTMLBodyElement;
const mainContainer = document.querySelector(".game-intro") as HTMLDivElement;
const cardsContainer = document.querySelector(".board__main") as HTMLDivElement;

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

  // const cardsDeck = shuffleFinalArray(initializeCards(cards));

  // cardsDeck.forEach((card) => {
  //   const cardHtml = createCardsElement(card);
  //   cardsContainer.appendChild(cardHtml);
  // });
}

export function startGame(cardsArray: string[]) {
  const cardsPack = initializeCards(cardsArray);
  const shuffeldPack = shuffleFinalArray(cardsPack);

  renderCards(shuffeldPack);
}

// function createBoardElements(): HTMLDivElement {
//   const mainContainer = document.createElement("div");
//   mainContainer.classList.add("board-main-container");

//   const boardNavBar = document.createElement("div");
//   boardNavBar.classList.add("board-navbar");

//   const navPlayers = document.createElement("div");
//   const navCurrentPlayer = document.createElement("div");

//   const navExitBtn = document.createElement("button");
//   navExitBtn.classList.add("exit-button");

//   boardNavBar.appendChild(navPlayers);
//   boardNavBar.appendChild(navCurrentPlayer);
//   boardNavBar.appendChild(navExitBtn);

//   mainContainer.appendChild(boardNavBar);
//   bodyEl.appendChild(mainContainer);

//   return mainContainer;
// }
