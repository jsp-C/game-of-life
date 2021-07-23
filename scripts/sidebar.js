const sidebars = document.querySelectorAll(".sidebar");
const gameSettingsBtn = document.querySelector("#game-settings-button");
const gameSidebar = document.querySelector("#game-sidebar");
const colorpickerBtn = document.querySelector("#color-picker-button");
const colorpickerSidebar = document.querySelector("#color-picker-sidebar");
const patternShowcaseBtn = document.querySelector("#pattern-showcase-button");
const patternShowcaseSidebar = document.querySelector(
    "#pattern-showcase-sidebar"
);
const sidebarBackground = document.querySelectorAll(".sidebar-bg");
const sidebarTogglerBtns = document.querySelectorAll(
    "#sidebar-togglebar ul>li>a"
);

sidebarBackground.forEach((n) => n.addEventListener("click", hideAllSidebars));
gameSettingsBtn.addEventListener("click", gameruleToggleHandler);
colorpickerBtn.addEventListener("click", colorpickerToggleHandler);
patternShowcaseBtn.addEventListener("click", patternShowcaseToggleHandler);
sidebarTogglerBtns.forEach((n) =>
    n.addEventListener("mouseenter", activeClassToggler)
);
sidebarTogglerBtns.forEach((n) =>
    n.addEventListener("mouseleave", activeClassToggler)
);

function hideAllSidebars() {
    [...sidebars].forEach((n) => n.classList.add("hide"));
}

function gameruleToggleHandler(e) {
    e.preventDefault();

    gameSidebar.matches(".hide")
        ? gameSidebar.classList.remove("hide")
        : gameSidebar.classList.add("hide");
}

function colorpickerToggleHandler(e) {
    e.preventDefault();

    colorpickerSidebar.matches(".hide")
        ? colorpickerSidebar.classList.remove("hide")
        : colorpickerSidebar.classList.add("hide");
}

function patternShowcaseToggleHandler(e) {
    e.preventDefault();

    patternShowcaseSidebar.matches(".hide")
        ? patternShowcaseSidebar.classList.remove("hide")
        : patternShowcaseSidebar.classList.add("hide");
}

function activeClassToggler(e) {
    e.currentTarget.classList.toggle("active");
}
