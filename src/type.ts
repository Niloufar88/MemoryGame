export interface Card {
  id: string;
  image: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface GameState {
  currentPlayer: string;
}

export const cards: string[] = [
  "/assets/img/foods/food-01.svg",
  "/assets/img/foods/food-02.svg",
  "/assets/img/foods/food-03.svg",
  "/assets/img/foods/food-04.svg",
  "/assets/img/foods/food-05.svg",
  "/assets/img/foods/food-06.svg",
  "/assets/img/foods/food-07.svg",
  "/assets/img/foods/food-08.svg",
  "/assets/img/foods/food-09.svg",
  "/assets/img/foods/food-10.svg",
  "/assets/img/foods/food-11.svg",
  "/assets/img/foods/food-12.svg",
  "/assets/img/foods/food-13.svg",
  "/assets/img/foods/food-14.svg",
  "/assets/img/foods/food-15.svg",
  "/assets/img/foods/food-16.svg",
  "/assets/img/foods/food-17.svg",
  "/assets/img/foods/food-18.svg",
];
