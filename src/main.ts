// @ts-ignore
import "./styles/main.scss";

import {
  renderSettingsPage,
  renderBoardElements,
  gameLogic,
  handlePlayerChange,
  handleBoardSizeChange,
  handleGameThemeChange,
  updateStartButtonState,
  isSettingsComplete,
} from "./game";

import { openDialog } from "./screens-dialog-reset";

/**
 * play button element
 */
const PLAY_BTN = document.getElementById("playBtn") as HTMLButtonElement;

/**
 * play button arrow container
 */
const PLAY_BUTTON_ARROW = document.getElementById(
  "playBtn-arrow",
) as HTMLImageElement;

/**
 * play button svg in default mode
 */
const ARROW_NORMAL = "/assets/icons/landing-page/play-arrow.svg";

/**
 * play button arrow in hover mode
 */
const ARROW_HOVER = "/assets/icons/landing-page/play-arrow-hover.svg";

/**
 * start button element
 */
const START_BTN = document.getElementById("start-Btn") as HTMLButtonElement;

/**
 * exit button element
 */
const EXIT_BTN = document.querySelector(".exit-button") as HTMLButtonElement;

/**
 * exit button icon container
 */
const EXIT_BTN_ICON = EXIT_BTN.querySelector("img") as HTMLImageElement;

/**
 * exit button svg in default mode by food theme
 */
const EXIT_NORMAL_ORANGE = "/assets/icons/food/exit-default.svg";

/**
 * exit button svg in default mode by DA Projects theme
 */
const EXIT_NORMAL_BLUE = "/assets/icons/DA/exit-blue-default.svg";

/**
 * exit button svg in hover mode by both themes
 */
const EXIT_HOVER = "/assets/icons/food/exit-hover.svg";

/**
 * choose player input container
 */
const CHOOSE_PLAYER_DIV = document.querySelector(
  ".details__player--options",
) as HTMLDivElement;

/**
 * board size input container
 */
const SET_BORAD_SIZE_DIV = document.querySelector(
  ".details__size--options",
) as HTMLDivElement;

/**
 * game theme input container
 */
const CHOOSE_GAME_THEME_DIV = document.querySelector(
  ".details__themes--options",
) as HTMLDivElement;

/**
 * game theme preview img container
 */
const THEME_PREVIEW_IMG = document.querySelector(
  ".theme-img img",
) as HTMLImageElement;

/**
 * game theme images
 */
const THEME_IMAGES: Record<string, string> = {
  DAProjects: "/assets/icons/settings/DA-Projects-Theme Visual .svg",
  foods: "/assets/icons/settings/Food-Theme Visual.svg",
};

/**
 * selected settings container
 */
export const SETTING_BOX = document.getElementById(
  "setting-box",
) as HTMLDivElement;

/**
 * an object which saves actively selected options in setting page
 */
export const ACTIVELY_SELECTED_RADIOS = {
  player: null as HTMLInputElement | null,
  boardSize: null as HTMLInputElement | null,
  gameTheme: null as HTMLInputElement | null,
};

/**
 * resetting visuals by selected conatiner to default phase
 * @param container one of 3 conatiners which conatins radio inputs
 */
export function resetContainerVisuals(container: HTMLDivElement): void {
  const RADIO_BTN = container.querySelector(
    'input[type="radio"]',
  ) as HTMLInputElement;
  const LABEL = container.querySelector("label") as HTMLLabelElement;
  const IMG = container.querySelector("img") as HTMLImageElement;
  if (RADIO_BTN) RADIO_BTN.checked = false;
  if (LABEL) LABEL.style.fontWeight = "normal";
  if (IMG) IMG.style.visibility = "hidden";
}

/**
 * making changes to visual of each input sets
 * @param container one of 3 conatiners which conatins radio inputs
 */
function activateVisualls(container: HTMLDivElement): void {
  const LABEL = container.querySelector("label") as HTMLLabelElement;
  const IMG = container.querySelector("img") as HTMLImageElement;
  if (LABEL) LABEL.style.fontWeight = "bold";
  if (IMG) IMG.style.visibility = "visible";
}

/**
 * making a loop on all containers to make necessary chenages to their visuals and checked attribute
 * @param target input target
 * @param containers html div container which contains input radios
 */
function handleRadioBtnSelection(
  target: HTMLInputElement,
  containers: NodeListOf<HTMLDivElement>,
): void {
  containers.forEach((container) => {
    const RADIO_BTN = container.querySelector('input[type="radio"]');
    if (RADIO_BTN !== target) resetContainerVisuals(container);
  });
  const CURRENT_CONTAINER = target.closest(
    ".options-container",
  ) as HTMLDivElement;
  if (CURRENT_CONTAINER) {
    target.checked = true;
    activateVisualls(CURRENT_CONTAINER);
  }
}

/**
 * running a click listener on player conatiner and get a value of target to save it for board and make necessary visual changes
 */
CHOOSE_PLAYER_DIV.addEventListener("click", (event) => {
  const TARGET = event.target as HTMLInputElement;
  if (TARGET && TARGET.type === "radio") {
    handlePlayerChange(TARGET.value);
    ACTIVELY_SELECTED_RADIOS.player = TARGET;
    handleRadioBtnSelection(TARGET, PLAYER_BUTTONS);
    updatePlayerText();
    updateStartButtonState();
  }
});

/**
 * running a click listener on board size conatiner and get a value of target to save it for board and make necessary visual changes
 */
SET_BORAD_SIZE_DIV.addEventListener("click", (event) => {
  const TARGET = event.target as HTMLInputElement;
  if (TARGET && TARGET.type === "radio") {
    handleBoardSizeChange(TARGET);
    ACTIVELY_SELECTED_RADIOS.boardSize = TARGET;
    handleRadioBtnSelection(TARGET, BOARD_SIZE_BUTTONS);
    updateBoardSizeText();
    updateStartButtonState();
  }
});

/**
 * running a click listener on game theme conatiner and get a value of target to save it for board and make necessary visual changes
 */
CHOOSE_GAME_THEME_DIV.addEventListener("click", (event) => {
  const TARGET = event.target as HTMLInputElement;
  if (TARGET && TARGET.type === "radio") {
    handleGameThemeChange(TARGET.value);
    ACTIVELY_SELECTED_RADIOS.gameTheme = TARGET;
    if (THEME_PREVIEW_IMG && THEME_IMAGES[TARGET.value])
      THEME_PREVIEW_IMG.src = THEME_IMAGES[TARGET.value];
    handleRadioBtnSelection(TARGET, THEMES_BUTTONS);
    updateGameThemeText();
    updateStartButtonState();
  }
});

/**
 * all input buttons in player container
 */
export const PLAYER_BUTTONS = CHOOSE_PLAYER_DIV.querySelectorAll(
  ".options-container",
) as NodeListOf<HTMLDivElement>;

/**
 * all input buttons in game theme container
 */
export const THEMES_BUTTONS = CHOOSE_GAME_THEME_DIV.querySelectorAll(
  ".options-container",
) as NodeListOf<HTMLDivElement>;

/**
 * all input buttons in board size container
 */
export const BOARD_SIZE_BUTTONS = SET_BORAD_SIZE_DIV.querySelectorAll(
  ".options-container",
) as NodeListOf<HTMLDivElement>;

/**
 * handeling 2 event listeners on a set of input buttons in player container
 */
PLAYER_BUTTONS.forEach((container) => {
  container.addEventListener("mouseenter", () => {
    handleMouseEnter(container, ACTIVELY_SELECTED_RADIOS.player);
  });
  container.addEventListener("mouseleave", () => {
    handleMouseLeave(container, ACTIVELY_SELECTED_RADIOS.player);
  });
});

/**
 * handeling 2 event listeners on a set of input buttons in game theme container
 */
THEMES_BUTTONS.forEach((container) => {
  container.addEventListener("mouseenter", () => {
    handleMouseEnter(container, ACTIVELY_SELECTED_RADIOS.gameTheme);
  });
  container.addEventListener("mouseleave", () => {
    handleMouseLeave(container, ACTIVELY_SELECTED_RADIOS.gameTheme);
  });
});

/**
 * handeling 2 event listeners on a set of input buttons in board size container
 */
BOARD_SIZE_BUTTONS.forEach((container) => {
  container.addEventListener("mouseenter", () => {
    handleMouseEnter(container, ACTIVELY_SELECTED_RADIOS.boardSize);
  });
  container.addEventListener("mouseleave", () => {
    handleMouseLeave(container, ACTIVELY_SELECTED_RADIOS.boardSize);
  });
});

/**
 * handeling mouse enter event on a set of input buttons in setting page containers and activate their visuals
 * @param container one of three html-div containers in setting page
 * @param selectedElement
 * @returns
 */
function handleMouseEnter(
  container: HTMLDivElement,
  selectedElement: HTMLInputElement | null,
): void {
  if (selectedElement !== null) return;
  const RADIO_BUTTON = container.querySelector(
    'input[type="radio"]',
  ) as HTMLInputElement;
  if (RADIO_BUTTON && THEME_PREVIEW_IMG && THEME_IMAGES[RADIO_BUTTON.value]) {
    RADIO_BUTTON.checked = true;
    THEME_PREVIEW_IMG.src = THEME_IMAGES[RADIO_BUTTON.value];
  }
  activateVisualls(container);
}

/**
 * handeling mouse leave event on a set of input buttons in setting page containers and accordingly reset their visuals
 * @param container one of three html-div containers in setting page
 * @param selectedElement
 * @returns
 */
function handleMouseLeave(
  container: HTMLDivElement,
  selectedElement: HTMLInputElement | null,
): void {
  const RADIO_BUTTON = container.querySelector(
    'input[type="radio"]',
  ) as HTMLInputElement;
  if (RADIO_BUTTON !== selectedElement) {
    resetContainerVisuals(container);
    if (THEME_PREVIEW_IMG) {
      if (ACTIVELY_SELECTED_RADIOS.gameTheme)
        THEME_PREVIEW_IMG.src =
          THEME_IMAGES[ACTIVELY_SELECTED_RADIOS.gameTheme.value];
      else THEME_PREVIEW_IMG.src = THEME_IMAGES["DAProjects"];
    }
  }
}

/**
 * handeling mouse over event on play button on intro page
 */
PLAY_BTN.addEventListener("mouseover", () => {
  PLAY_BUTTON_ARROW.src = ARROW_HOVER;
});

/**
 * handeling mouse leave event on play button on intro page
 */
PLAY_BTN.addEventListener("mouseleave", () => {
  PLAY_BUTTON_ARROW.src = ARROW_NORMAL;
});

/**
 * handeling click event on play button on intro page
 */
PLAY_BTN.addEventListener("click", () => {
  renderSettingsPage();
});

/**
 * handeling click event on selected setting box to make necessary visual changes
 */
SETTING_BOX.addEventListener("click", () => {
  if (isSettingsComplete() && !SETTING_BOX.classList.contains("stretched")) {
    // updateSettingBoxTexts();
    updateSettingBoxVisuals();
    SETTING_BOX.classList.add("stretched");
  }
});

/**
 * updating selected settings box text after clicking on it and show the selected options
 */
function updateGameThemeText(): void {
  const THEME = document.getElementById("game-theme-text") as HTMLSpanElement;
  THEME.innerText = `Theme: ${gameLogic.currentTheme}`;
}

/**
 * updating selected settings box text after clicking on it and show the selected options
 */
function updatePlayerText(): void {
  const PLAYER = document.getElementById("player-text") as HTMLSpanElement;
  PLAYER.innerText = `Player: ${gameLogic.currentPlayer}`;
}

/**
 * updating selected settings box text after clicking on it and show the selected options
 */
function updateBoardSizeText(): void {
  const SIZE = document.getElementById("board-size-text") as HTMLSpanElement;
  SIZE.innerText = `Board: ${gameLogic.currentRows * gameLogic.currentColumns}-Cards`;
}

/**
 * updating selected settings box visuals after clicking on it
 */
function updateSettingBoxVisuals(): void {
  const YELLOW_LINES = SETTING_BOX.querySelectorAll(
    ".selected-setting img",
  ) as NodeListOf<HTMLImageElement>;
  YELLOW_LINES.forEach((line) => {
    line.src = "/assets/icons/settings/line-selected.svg";
  });
}

/**
 * handeling click event on start button to lead to board page
 */
START_BTN.addEventListener("click", () => {
  renderBoardElements(gameLogic.currentTheme);
});

/**
 * handeling mouse over event on exit button to make visual changes
 */
EXIT_BTN?.addEventListener("mouseover", () => {
  if (EXIT_BTN_ICON) EXIT_BTN_ICON.src = EXIT_HOVER;
});

/**
 * handeling mouse leave event on exit button to make visual changes
 */
EXIT_BTN?.addEventListener("mouseleave", () => {
  if (EXIT_BTN_ICON && gameLogic.currentTheme === "DAProjects")
    EXIT_BTN_ICON.src = EXIT_NORMAL_BLUE;
  else if (EXIT_BTN_ICON && gameLogic.currentTheme === "foods")
    EXIT_BTN_ICON.src = EXIT_NORMAL_ORANGE;
});

/**
 * handeling click event on exit button to open the dialog.
 */
EXIT_BTN?.addEventListener("click", openDialog);
