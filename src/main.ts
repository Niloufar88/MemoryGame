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
} from "./game";

import { openDialog } from "./screens-dialog-reset";

const playBtn = document.getElementById("playBtn") as HTMLButtonElement;
const playBtnArrow = document.getElementById(
  "playBtn-arrow",
) as HTMLImageElement;
const arrowNormal = "/assets/icons/landing-page/play-arrow.svg";
const arrowHover = "/assets/icons/landing-page/play-arrow-hover.svg";

const startBtn = document.getElementById("start-Btn") as HTMLButtonElement;

const exitBtn = document.querySelector(".exit-button") as HTMLButtonElement;
const exitBtnIcon = exitBtn.querySelector("img") as HTMLImageElement;
const exitNormalOrange = "/assets/icons/food/exit-default.svg";
const exitNormalBlue = "/assets/icons/DA/exit-blue-default.svg";
const exitHover = "/assets/icons/food/exit-hover.svg";

const choosePlayerDiv = document.querySelector(
  ".details__player--options",
) as HTMLDivElement;

const setBoardSizeDiv = document.querySelector(
  ".details__size--options",
) as HTMLDivElement;

const chooseGameThemeDiv = document.querySelector(
  ".details__themes--options",
) as HTMLDivElement;

const themePreviewImg = document.querySelector(
  ".theme-img img",
) as HTMLImageElement;

const THEME_IMAGES: Record<string, string> = {
  DAProjects: "/assets/icons/settings/DA-Projects-Theme Visual .svg",
  foods: "/assets/icons/settings/Food-Theme Visual.svg",
};

export const activelySelectedRadios = {
  player: null as HTMLInputElement | null,
  boardSize: null as HTMLInputElement | null,
  gameTheme: null as HTMLInputElement | null,
};

export function resetContainerVisuals(container: HTMLDivElement): void {
  const radioBtn = container.querySelector(
    'input[type="radio"]',
  ) as HTMLInputElement;
  const label = container.querySelector("label") as HTMLLabelElement;
  const img = container.querySelector("img") as HTMLImageElement;

  if (radioBtn) radioBtn.checked = false;
  if (label) label.style.fontWeight = "normal";
  if (img) img.style.visibility = "hidden";
}

function activateVisualls(container: HTMLDivElement): void {
  const label = container.querySelector("label") as HTMLLabelElement;
  const img = container.querySelector("img") as HTMLImageElement;

  if (label) label.style.fontWeight = "bold";
  if (img) img.style.visibility = "visible";
}

function handleRadioBtnSelection(
  target: HTMLInputElement,
  containers: NodeListOf<HTMLDivElement>,
): void {
  containers.forEach((container) => {
    const radioBtn = container.querySelector('input[type="radio"]');
    if (radioBtn !== target) resetContainerVisuals(container);
  });

  const currentContainer = target.closest(
    ".options-container",
  ) as HTMLDivElement;
  if (currentContainer) {
    target.checked = true;
    activateVisualls(currentContainer);
  }
}

choosePlayerDiv.addEventListener("click", (event) => {
  const target = event.target as HTMLInputElement;
  if (target && target.type === "radio") {
    handlePlayerChange(target.value);
    activelySelectedRadios.player = target;
    handleRadioBtnSelection(target, playerButtons);
    updateStartButtonState();
  }
});

setBoardSizeDiv.addEventListener("click", (event) => {
  const target = event.target as HTMLInputElement;
  if (target && target.type === "radio") {
    handleBoardSizeChange(target);
    activelySelectedRadios.boardSize = target;
    handleRadioBtnSelection(target, boardSizeButtons);
    updateStartButtonState();
  }
});

chooseGameThemeDiv.addEventListener("click", (event) => {
  const target = event.target as HTMLInputElement;
  if (target && target.type === "radio") {
    handleGameThemeChange(target.value);
    activelySelectedRadios.gameTheme = target;
    if (themePreviewImg && THEME_IMAGES[target.value])
      themePreviewImg.src = THEME_IMAGES[target.value];
    handleRadioBtnSelection(target, themesButtons);
    updateStartButtonState();
  }
});

export const playerButtons = choosePlayerDiv.querySelectorAll(
  ".options-container",
) as NodeListOf<HTMLDivElement>;
export const themesButtons = chooseGameThemeDiv.querySelectorAll(
  ".options-container",
) as NodeListOf<HTMLDivElement>;
export const boardSizeButtons = setBoardSizeDiv.querySelectorAll(
  ".options-container",
) as NodeListOf<HTMLDivElement>;

playerButtons.forEach((container) => {
  container.addEventListener("mouseenter", () => {
    handleMouseEnter(container, activelySelectedRadios.player);
  });
  container.addEventListener("mouseleave", () => {
    handleMouseLeave(container, activelySelectedRadios.player);
  });
});

themesButtons.forEach((container) => {
  container.addEventListener("mouseenter", () => {
    handleMouseEnter(container, activelySelectedRadios.gameTheme);
  });
  container.addEventListener("mouseleave", () => {
    handleMouseLeave(container, activelySelectedRadios.gameTheme);
  });
});

boardSizeButtons.forEach((container) => {
  container.addEventListener("mouseenter", () => {
    handleMouseEnter(container, activelySelectedRadios.boardSize);
  });
  container.addEventListener("mouseleave", () => {
    handleMouseLeave(container, activelySelectedRadios.boardSize);
  });
});

function handleMouseEnter(
  container: HTMLDivElement,
  selectedElement: HTMLInputElement | null,
): void {
  if (selectedElement !== null) return;
  const radioButton = container.querySelector(
    'input[type="radio"]',
  ) as HTMLInputElement;
  if (radioButton && themePreviewImg && THEME_IMAGES[radioButton.value]) {
    radioButton.checked = true;
    themePreviewImg.src = THEME_IMAGES[radioButton.value];
  }
  activateVisualls(container);
}

function handleMouseLeave(
  container: HTMLDivElement,
  selectedElement: HTMLInputElement | null,
): void {
  const radioButton = container.querySelector(
    'input[type="radio"]',
  ) as HTMLInputElement;

  if (radioButton !== selectedElement) {
    resetContainerVisuals(container);
    if (themePreviewImg) {
      if (activelySelectedRadios.gameTheme) {
        themePreviewImg.src =
          THEME_IMAGES[activelySelectedRadios.gameTheme.value];
      } else {
        themePreviewImg.src = THEME_IMAGES["DAProjects"];
      }
    }
  }
}

// radioButtonsContainer.forEach((container) => {
//   container.addEventListener("mouseenter", () => {
//     const radioButton = container.querySelector(
//       'input[type="radio"]',
//     ) as HTMLInputElement;
//     const labelText = container.querySelector("label") as HTMLLabelElement;
//     if (radioButton) {
//       // Prüfen, ob in der Gruppe dieses Buttons bereits ein Klick stattgefunden hat
//       const currentActiveForGroup =
//         activelySelectedRadios.player?.name === radioButton.name
//           ? activelySelectedRadios.player
//           : activelySelectedRadios.boardSize?.name === radioButton.name
//             ? activelySelectedRadios.boardSize
//             : activelySelectedRadios.gameTheme?.name === radioButton.name
//               ? activelySelectedRadios.gameTheme
//               : null;

//       // Wenn in dieser Kategorie bereits ein Button FEST geklickt wurde,
//       // ignorieren wir den Hover für ALLE anderen Buttons dieser Gruppe!
//       if (currentActiveForGroup) {
//         return;
//       }

//       // Wenn in dieser Gruppe noch gar nichts geklickt wurde, ist Hover erlaubt
//       radioButton.checked = true;
//       labelText.style.fontWeight = "bold";
//     }
//   });
// });

playBtn.addEventListener("mouseover", () => {
  playBtnArrow.src = arrowHover;
});

playBtn.addEventListener("mouseleave", () => {
  playBtnArrow.src = arrowNormal;
});

playBtn.addEventListener("click", () => {
  renderSettingsPage();
});

startBtn.addEventListener("click", () => {
  renderBoardElements(gameLogic.currentTheme);
});

exitBtn?.addEventListener("mouseover", () => {
  if (exitBtnIcon) exitBtnIcon.src = exitHover;
});

exitBtn?.addEventListener("mouseleave", () => {
  if (exitBtnIcon && gameLogic.currentTheme === "DAProjects")
    exitBtnIcon.src = exitNormalBlue;
  else if (exitBtnIcon && gameLogic.currentTheme === "foods")
    exitBtnIcon.src = exitNormalOrange;
});

exitBtn?.addEventListener("click", openDialog);
