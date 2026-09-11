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

const PLAY_BTN = document.getElementById("playBtn") as HTMLButtonElement;
const PLAY_BUTTON_ARROW = document.getElementById(
  "playBtn-arrow",
) as HTMLImageElement;
const ARROW_NORMAL = "/assets/icons/landing-page/play-arrow.svg";
const ARROW_HOVER = "/assets/icons/landing-page/play-arrow-hover.svg";

const START_BTN = document.getElementById("start-Btn") as HTMLButtonElement;

const EXIT_BTN = document.querySelector(".exit-button") as HTMLButtonElement;
const EXIT_BTN_ICON = EXIT_BTN.querySelector("img") as HTMLImageElement;
const EXIT_NORMAL_ORANGE = "/assets/icons/food/exit-default.svg";
const EXIT_NORMAL_BLUE = "/assets/icons/DA/exit-blue-default.svg";
const EXIT_HOVER = "/assets/icons/food/exit-hover.svg";

const CHOOSE_PLAYER_DIV = document.querySelector(
  ".details__player--options",
) as HTMLDivElement;

const SET_BORAD_SIZE_DIV = document.querySelector(
  ".details__size--options",
) as HTMLDivElement;

const CHOOSE_GAME_THEME_DIV = document.querySelector(
  ".details__themes--options",
) as HTMLDivElement;

const THEME_PREVIEW_IMG = document.querySelector(
  ".theme-img img",
) as HTMLImageElement;

const THEME_IMAGES: Record<string, string> = {
  DAProjects: "/assets/icons/settings/DA-Projects-Theme Visual .svg",
  foods: "/assets/icons/settings/Food-Theme Visual.svg",
};

export const SETTING_BOX = document.getElementById(
  "setting-box",
) as HTMLDivElement;

export const ACTIVELY_SELECTED_RADIOS = {
  player: null as HTMLInputElement | null,
  boardSize: null as HTMLInputElement | null,
  gameTheme: null as HTMLInputElement | null,
};

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

function activateVisualls(container: HTMLDivElement): void {
  const LABEL = container.querySelector("label") as HTMLLabelElement;
  const IMG = container.querySelector("img") as HTMLImageElement;

  if (LABEL) LABEL.style.fontWeight = "bold";
  if (IMG) IMG.style.visibility = "visible";
}

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

CHOOSE_PLAYER_DIV.addEventListener("click", (event) => {
  const TARGET = event.target as HTMLInputElement;
  if (TARGET && TARGET.type === "radio") {
    handlePlayerChange(TARGET.value);
    ACTIVELY_SELECTED_RADIOS.player = TARGET;
    handleRadioBtnSelection(TARGET, PLAYER_BUTTONS);
    updateStartButtonState();
  }
});

SET_BORAD_SIZE_DIV.addEventListener("click", (event) => {
  const TARGET = event.target as HTMLInputElement;
  if (TARGET && TARGET.type === "radio") {
    handleBoardSizeChange(TARGET);
    ACTIVELY_SELECTED_RADIOS.boardSize = TARGET;
    handleRadioBtnSelection(TARGET, BOARD_SIZE_BUTTONS);
    updateStartButtonState();
  }
});

CHOOSE_GAME_THEME_DIV.addEventListener("click", (event) => {
  const TARGET = event.target as HTMLInputElement;
  if (TARGET && TARGET.type === "radio") {
    handleGameThemeChange(TARGET.value);
    ACTIVELY_SELECTED_RADIOS.gameTheme = TARGET;
    if (THEME_PREVIEW_IMG && THEME_IMAGES[TARGET.value])
      THEME_PREVIEW_IMG.src = THEME_IMAGES[TARGET.value];
    handleRadioBtnSelection(TARGET, THEMES_BUTTONS);
    updateStartButtonState();
  }
});

export const PLAYER_BUTTONS = CHOOSE_PLAYER_DIV.querySelectorAll(
  ".options-container",
) as NodeListOf<HTMLDivElement>;
export const THEMES_BUTTONS = CHOOSE_GAME_THEME_DIV.querySelectorAll(
  ".options-container",
) as NodeListOf<HTMLDivElement>;
export const BOARD_SIZE_BUTTONS = SET_BORAD_SIZE_DIV.querySelectorAll(
  ".options-container",
) as NodeListOf<HTMLDivElement>;

PLAYER_BUTTONS.forEach((container) => {
  container.addEventListener("mouseenter", () => {
    handleMouseEnter(container, ACTIVELY_SELECTED_RADIOS.player);
  });
  container.addEventListener("mouseleave", () => {
    handleMouseLeave(container, ACTIVELY_SELECTED_RADIOS.player);
  });
});

THEMES_BUTTONS.forEach((container) => {
  container.addEventListener("mouseenter", () => {
    handleMouseEnter(container, ACTIVELY_SELECTED_RADIOS.gameTheme);
  });
  container.addEventListener("mouseleave", () => {
    handleMouseLeave(container, ACTIVELY_SELECTED_RADIOS.gameTheme);
  });
});

BOARD_SIZE_BUTTONS.forEach((container) => {
  container.addEventListener("mouseenter", () => {
    handleMouseEnter(container, ACTIVELY_SELECTED_RADIOS.boardSize);
  });
  container.addEventListener("mouseleave", () => {
    handleMouseLeave(container, ACTIVELY_SELECTED_RADIOS.boardSize);
  });
});

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
      if (ACTIVELY_SELECTED_RADIOS.gameTheme) {
        THEME_PREVIEW_IMG.src =
          THEME_IMAGES[ACTIVELY_SELECTED_RADIOS.gameTheme.value];
      } else {
        THEME_PREVIEW_IMG.src = THEME_IMAGES["DAProjects"];
      }
    }
  }
}

PLAY_BTN.addEventListener("mouseover", () => {
  PLAY_BUTTON_ARROW.src = ARROW_HOVER;
});

PLAY_BTN.addEventListener("mouseleave", () => {
  PLAY_BUTTON_ARROW.src = ARROW_NORMAL;
});

PLAY_BTN.addEventListener("click", () => {
  renderSettingsPage();
});

SETTING_BOX.addEventListener("click", () => {
  if (isSettingsComplete() && !SETTING_BOX.classList.contains("streched")) {
    updateSettingBoxTexts();
    updateSettingBoxVisuals();
    SETTING_BOX.classList.add("streched");
  }
});

function updateSettingBoxTexts(): void {
  const THEME = document.getElementById("game-theme-text") as HTMLSpanElement;
  const PLAYER = document.getElementById("player-text") as HTMLSpanElement;
  const SIZE = document.getElementById("board-size-text") as HTMLSpanElement;

  THEME.innerText = gameLogic.currentTheme;
  PLAYER.innerText = gameLogic.currentPlayer;
  SIZE.innerText = `${gameLogic.currentRows}x${gameLogic.currentColumns}-Cards`;
}

function updateSettingBoxVisuals(): void {
  const YELLOW_LINES = SETTING_BOX.querySelectorAll(
    ".selected-setting img",
  ) as NodeListOf<HTMLImageElement>;
  YELLOW_LINES.forEach((line) => {
    line.src = "/assets/icons/settings/line-selected.svg";
  });
}

START_BTN.addEventListener("click", () => {
  renderBoardElements(gameLogic.currentTheme);
});

EXIT_BTN?.addEventListener("mouseover", () => {
  if (EXIT_BTN_ICON) EXIT_BTN_ICON.src = EXIT_HOVER;
});

EXIT_BTN?.addEventListener("mouseleave", () => {
  if (EXIT_BTN_ICON && gameLogic.currentTheme === "DAProjects")
    EXIT_BTN_ICON.src = EXIT_NORMAL_BLUE;
  else if (EXIT_BTN_ICON && gameLogic.currentTheme === "foods")
    EXIT_BTN_ICON.src = EXIT_NORMAL_ORANGE;
});

EXIT_BTN?.addEventListener("click", openDialog);
