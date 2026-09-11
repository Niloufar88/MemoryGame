export interface Card {
  id: string;
  image: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface GameState {
  currentPlayer: string;
  currentCardsPair: number;
  currentRows: number;
  currentColumns: number;
  currentTheme: string;
  activePlayer: string;
  lockBoard: boolean;
  flippedCards: HTMLElement[];
  playerScore: Record<string, number>;
}

export const THEME_OBJECTS: Record<string, string[]> = {
  foods: [
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
  ],
  DAProjects: [
    "/assets/img/DA Projects/DA-01.svg",
    "/assets/img/DA Projects/DA-02.svg",
    "/assets/img/DA Projects/DA-03.svg",
    "/assets/img/DA Projects/DA-04.svg",
    "/assets/img/DA Projects/DA-05.svg",
    "/assets/img/DA Projects/DA-06.svg",
    "/assets/img/DA Projects/DA-07.svg",
    "/assets/img/DA Projects/DA-08.svg",
    "/assets/img/DA Projects/DA-09.svg",
    "/assets/img/DA Projects/DA-10.svg",
    "/assets/img/DA Projects/DA-11.svg",
    "/assets/img/DA Projects/DA-12.svg",
    "/assets/img/DA Projects/DA-13.svg",
    "/assets/img/DA Projects/DA-14.svg",
    "/assets/img/DA Projects/DA-15.svg",
    "/assets/img/DA Projects/DA-16.svg",
    "/assets/img/DA Projects/DA-17.svg",
    "/assets/img/DA Projects/DA-18.svg",
  ],
};
