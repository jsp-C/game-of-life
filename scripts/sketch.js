// Settings Buttons
const restartButton = document.querySelector("#restart-btn");
const pauseButton = document.querySelector("#pause-btn");
const birthRuleCells = document.querySelectorAll(".birth-rule");
const aliveRuleCells = document.querySelectorAll(".alive-rule");
const aliveCellColorSelector = document.querySelector("#alive-cell-color");
const deathCellColorSelector = document.querySelector("#death-cell-color");
const stableCellColorSelector = document.querySelector("#stable-cell-color");
const syncColorBtn = document.querySelector("#sync-color-btn");
const separatorColorSelector = document.querySelector("#separator-color");
const syncDeathColorBtn = document.querySelector("#sync-death-color-btn");
const cellSizeSelector = document.querySelector("#cell-size-list");
const cellShapeSelector = document.querySelector("#cell-shape-list");
const autostartSelector = document.querySelector("#auto-start-list");
const drawModeSelector = document.querySelector("#draw-mode-list");
const cellQuantitySelector = document.querySelector("#cell-quantity-list");
const resetSettingsBtn = document.querySelector("#resetSettingsBtn");

// Custom Pattern
const customPatternInput = document.querySelector("#customPatternText");
const customPatternInputBtn = document.querySelector("#customPatternBtn");
const customPatternValues = document.querySelectorAll(
    "#customPatternBox input, #customPatternBox textarea, #customPatternBox select"
);
const customPatternSelectList = document.querySelector(
    "#customPatternSelectList"
);
const customPatternActivateBtn = document.querySelector(
    "#customPatternActivateBtn"
);
const customPatternRemoveBtn = document.querySelector(
    "#customPatternRemoveBtn"
);

const customPatternEditBtn = document.querySelector("#customPatternEditBtn");
const customPatternNameError = document.querySelector("#patternNameError");
const customPatternDisplay = document.querySelector("#patternNameDisplay");

customPatternInputBtn.addEventListener("click", submitCustomInput);
customPatternActivateBtn.addEventListener("click", customPatternToggler);
customPatternRemoveBtn.addEventListener("click", customPatternRemover);
customPatternDisplayBtn.addEventListener("click", displayCustomPattern);

// Canvas and cell size
let canvas = document.querySelector("#canvas");
let GRID;
let NEXTGRID;
let SIZE = parseInt(cellSizeSelector.value);
let SHAPE = cellShapeSelector.value;
let widthRatio = 0.75;
let heightRatio = 0.75;
let COLS;
let ROWS;

let initialSpeed = 30;
let speedSlider;
let aliveCellColor = aliveCellColorSelector.value;
let deathCellColor = deathCellColorSelector.value;
let stableCellColor = stableCellColorSelector.value;
let separatorColor = separatorColorSelector.value;

let autoStart = autostartSelector.checked ? true : false;
let eraseMode = drawModeSelector.checked ? true : false;

let cellQuantity = parseFloat(cellQuantitySelector.value);
let pauseStatusDisplay;
let extinctionDisplay;
let numOfTurn = 0;
let showcaseMode = false;
let showcasePattern;

// state
let drawing = false;
let placePatternTimer = false;
let showcaseFirstRun = true;

// Allow drawing on mobile
canvas.addEventListener("touchstart", function (event) {
    event.preventDefault();
});
canvas.addEventListener("touchmove", function (event) {
    event.preventDefault();
});
canvas.addEventListener("touchend", function (event) {
    event.preventDefault();
});
canvas.addEventListener("touchcancel", function (event) {
    event.preventDefault();
});

// Reset Button
resetSettingsBtn.addEventListener("click", resetAllSetingsHandler);

function resetAllSetingsHandler() {
    // reset buttons and variables
    autoStart = autostartSelector.checked = true;
    eraseMode = drawModeSelector.checked = false;
    showcaseMode = false;
    resetCellRules();
    cellQuantity = cellQuantitySelector.value = 0.2;
    SHAPE = cellShapeSelector.value = "rect";
    aliveCellColor = aliveCellColorSelector.value = "#000000";
    deathCellColor = deathCellColorSelector.value = "#FFFFFF";
    stableCellColor = stableCellColorSelector.value = "#000000";
    separatorColor = separatorColorSelector.value = "#FFFFFF";

    initialSpeed = 30;
    speedSlider.value(initialSpeed);
    valueDisplayer.html("FPS: " + speedSlider.value());

    showcaseFirstRun = true;

    if (SIZE !== cellSizeSelector.value) {
        SIZE = parseInt(cellSizeSelector.value);
        windowResizeHandler();
        init();
    }
    loop();
}

// Showcase Patterns
const showcaseBtns = document.querySelectorAll(".showcase-btn");
const backToNormalBtn = document.querySelector("#showcase-normal-game");

showcaseBtns.forEach((btn) =>
    btn.addEventListener("mousedown", showcaseBtnPressed)
);
showcaseBtns.forEach((btn) =>
    btn.addEventListener("touchstart", showcaseBtnPressed)
);

showcaseBtns.forEach((btn) =>
    btn.addEventListener("mouseup", showcaseBtnReleased)
);
showcaseBtns.forEach((btn) =>
    btn.addEventListener("touchend", showcaseBtnReleased)
);

backToNormalBtn.addEventListener("click", backToNormalModeHandler);

let longpressed = false;
let timeLongpress;

function showcaseBtnPressed(e) {
    timeLongpress = setTimeout(() => {
        longpressed = true;
        let selectedPattern = showcasePatternList[e.target.value].pattern;
        const textDisplay = blueprintReverser(selectedPattern);

        customPatternDisplay.innerHTML = textDisplay;
        customPatternDisplay.classList.add("show");
    }, 1000);
}

window.addEventListener("mouseup", () => {
    clearTimeout(timeLongpress);
    if (longpressed) {
        longpressed = false;
        customPatternDisplay.classList.remove("show");
        customPatternDisplay.innerText = "";
    }
});

window.addEventListener("touchend", () => {
    clearTimeout(timeLongpress);
    if (longpressed) {
        longpressed = false;
        customPatternDisplay.classList.remove("show");
        customPatternDisplay.innerText = "";
    }
});

function showcaseBtnReleased(e) {
    if (!longpressed) {
        showcaseToggle(e);
    }
    clearTimeout(timeLongpress);
}

function showcaseToggle(e) {
    e.preventDefault();

    showcaseMode = true;
    // SIZE = showcasePatternList[e.target.value].cellsize;
    showcasePattern = showcasePatternList[e.target.value].pattern;
    if (showcaseFirstRun) {
        resetCellRules();
        windowResizeHandler();
        init();
        cellQuantity = 0;
        showcaseFirstRun = false;
    }

    // Autostart even game paused
    // if (autoStart) {
    loop();
    pauseButton.classList.remove("paused");
    pauseButton.children[0].classList.remove("fa-play-circle");
    pauseButton.children[0].classList.add("fa-pause-circle");
    // }
}

function resetCellRules() {
    birthRuleCells.forEach((btn, i) => {
        i === 3 ? (btn.checked = false) : (btn.checked = true);
    });

    aliveRuleCells.forEach((btn, i) => {
        i === 2 || i === 3 ? (btn.checked = false) : (btn.checked = true);
    });
}

function backToNormalModeHandler() {
    showcasePattern = undefined;
    showcaseMode = false;
    cellQuantity = parseFloat(cellQuantitySelector.value);
    showcaseFirstRun = true;
    init();
    loop();
}

// User Custom Patterns

function submitCustomInput(e) {
    e.preventDefault();

    const patternName = customPatternValues[0].value;
    const pattern = customPatternValues[1].value;
    // const translateX = parseInt(customPatternValues[2].value);
    // const translateY = parseInt(customPatternValues[3].value);
    // const cellsize = parseInt(customPatternValues[4].value);
    const storedPatterns = localStorage.getItem("customPattern");
    let parsedStoredPatterns;
    const isDuplicated =
        [...customPatternSelectList.children].filter(
            (text) => text.innerText === patternName
        ).length > 0;

    if (patternName === "" || pattern === "") {
        customPatternNameError.textContent =
            "Cannot input empty name/empty pattern";
        setTimeout(() => {
            customPatternNameError.textContent = "";
        }, 5000);
        return;
    }
    if (isDuplicated) {
        customPatternNameError.textContent = "Name already existed";
        setTimeout(() => {
            customPatternNameError.textContent = "";
        }, 5000);
        return;
    }

    if (
        storedPatterns != null &&
        storedPatterns != undefined &&
        storedPatterns != ""
    ) {
        parsedStoredPatterns = JSON.parse(storedPatterns);
    } else {
        parsedStoredPatterns = [];
    }

    let newCustomPattern = {
        patternName,
        pattern: blueprintConvertor(pattern),
    };

    let customPatterns = [...parsedStoredPatterns, newCustomPattern];

    localStorage.setItem("customPattern", JSON.stringify(customPatterns));

    customPatternAdder();
}

function customPatternAdder() {
    let saves = localStorage.getItem("customPattern");
    let parseSaves = JSON.parse(saves);

    if (parseSaves != null && parseSaves != undefined && parseSaves != "") {
        for (let index in parseSaves) {
            let option = document.createElement("option");
            let patternName = parseSaves[index].patternName;
            let isDuplicated =
                [...customPatternSelectList.children].filter(
                    (text) => text.innerText === patternName
                ).length > 0;
            option.value = patternName;
            option.innerText = patternName;
            if (isDuplicated) {
                continue;
            } else {
                customPatternSelectList.appendChild(option);
                customPatternValues[0].value = "";
                customPatternValues[1].value = "";
                // customPatternValues[2].value = 0;
                // customPatternValues[3].value = 0;
                // customPatternValues[4].value = 15;
            }
        }
    }
}

customPatternAdder();

function customPatternRemover(e) {
    e.preventDefault();
    let customPatternName = customPatternSelectList.value;
    if (customPatternName === "") {
        return;
    }
    const listOption = document.querySelectorAll(
        "#customPatternSelectList option"
    );
    let saves = localStorage.getItem("customPattern");
    let parseSaves = JSON.parse(saves);
    let filteredSaves = parseSaves.filter(
        (list) => list.patternName !== customPatternName
    );
    listOption.forEach((option) => {
        if (option.value === customPatternName) {
            option.remove();
        }
    });
    localStorage.setItem("customPattern", JSON.stringify(filteredSaves));
}

function blueprintReverser(patternArray) {
    let textBlueprint;
    let maxPosX = 0;
    let maxPosY = 0;
    let minPosX = 10000;
    let minPosY = 10000;
    let columns;
    let rows;
    let grid;

    if (!patternArray instanceof Object || patternArray.length < 1) {
        return;
    }

    for (let coordination of patternArray) {
        if (coordination[0] > maxPosX) {
            maxPosX = coordination[0];
        }
        if (coordination[0] < minPosX) {
            minPosX = coordination[0];
        }
        if (coordination[1] > maxPosY) {
            maxPosY = coordination[1];
        }
        if (coordination[1] < minPosY) {
            minPosY = coordination[1];
        }
    }
    columns = maxPosX - minPosX + 1;
    rows = maxPosY - minPosY + 1;
    // console.log(columns, rows);

    grid = new Array(rows);

    // console.log(grid);

    for (let i = 0; i < grid.length; i++) {
        grid[i] = new Array(columns);
    }

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            grid[i][j] = "-";
        }
    }

    patternArray.forEach((coor) => {
        let x = coor[1] - minPosY;
        let y = coor[0] - minPosX;
        // console.log("coor", [x, y]);
        grid[x][y] = "x";
    });

    let blueprintRows = grid.map((col) => col.join(""));
    textBlueprint = blueprintRows.join("<br/>");

    return textBlueprint;
}

function customPatternToggler(e) {
    e.preventDefault();
    if (customPatternSelectList.value === "") {
        return;
    }
    let chosenPatternName = customPatternSelectList.value;
    let saves = localStorage.getItem("customPattern");
    let parseSaves;
    if (saves != null && saves != undefined && saves != "") {
        parseSaves = JSON.parse(saves);
    }

    let chosenPatternObject = parseSaves.filter(
        (obj) => obj.patternName === chosenPatternName
    )[0].pattern;

    let { cellsize, pattern } = chosenPatternObject;

    showcaseMode = true;
    showcasePattern = pattern;
    if (showcaseFirstRun) {
        resetCellRules();
        windowResizeHandler();
        init();
        cellQuantity = 0;
        showcaseFirstRun = false;
    }
    // SIZE = cellsize;

    // Autostart even game paused
    // if (autoStart) {
    loop();
    pauseButton.classList.remove("paused");
    pauseButton.children[0].classList.remove("fa-play-circle");
    pauseButton.children[0].classList.add("fa-pause-circle");
    // }
}

function displayCustomPattern(e) {
    e.preventDefault();
    let patternName = customPatternSelectList.value;
    if (patternName === "") {
        return;
    }
    const storedPatterns = localStorage.getItem("customPattern");
    const parsedStoredPatterns = JSON.parse(storedPatterns);
    const pattern = parsedStoredPatterns.filter(
        (obj) => obj.patternName === patternName
    )[0].pattern.pattern;
    // console.log(pattern);
    // console.log(blueprintReverser(pattern));
    const textDisplay = blueprintReverser(pattern);

    customPatternDisplay.innerHTML = textDisplay;
    customPatternDisplay.classList.add("show");

    setTimeout(() => {
        customPatternDisplay.innerText = "";
        customPatternDisplay.classList.remove("show");
    }, 3000);
}

// Create Canvas and initiate

function gridArray(cols, rows) {
    let arr = new Array(cols);
    // NEXTGRID = new Array(cols);
    for (let i = 0; i < arr.length; i++) {
        arr[i] = new Array(rows);
        // NEXTGRID[i] = new Array(rows);
    }
    return arr;
}

function init() {
    numOfTurn = 0;

    for (let i = 0; i < COLS; i++) {
        for (let j = 0; j < ROWS; j++) {
            NEXTGRID[i][j] = 0;
            GRID[i][j] = 0;

            // if (showcaseMode) {
            //     for (let indexs of showcasePattern) {
            //         if (i === indexs[0] || j === indexs[1]) {
            //             GRID[indexs[0]][indexs[1]] = 1;
            //         } else {
            //             GRID[i][j] = 0;
            //         }
            //     }
            // }

            // Showcase Mode
            // if (showcaseMode) {
            //     GRID[i][j] = 0;
            //     showcasePattern.forEach((indexs) => {
            //         GRID[indexs[0]][indexs[1]] = 1;
            //     });
            // }
            if (!showcaseMode) {
                GRID[i][j] = Math.random() < cellQuantity ? 1 : 0;
            }
        }
    }
    frameRate(initialSpeed);
}

function generate() {
    for (let x = 0; x < COLS; x++) {
        for (let y = 0; y < ROWS; y++) {
            let neighbour = 0;

            for (let i of [-1, 0, 1]) {
                for (let j of [-1, 0, 1]) {
                    if (i === 0 && j === 0) {
                        continue;
                    }

                    if (showcaseMode) {
                        if (GRID[x + i] && GRID[x + i][y + j] > 0) {
                            neighbour += 1;
                        }
                    } else {
                        neighbour +=
                            GRID[(x + i + COLS) % COLS][(y + j + ROWS) % ROWS] >
                            0
                                ? 1
                                : 0;
                    }
                }
            }

            //
            // let CellX = x+dx
            // let CellY = y+dy
            // if currentB[y] && currentB[y][x] ==1
            // neighbour++

            // Normal Rules
            // if (GRID[x][y] === 1 && neighbour < 2) {
            //     NEXTGRID[x][y] = 0;
            // } else if (GRID[x][y] === 1 && neighbour > 3) {
            //     NEXTGRID[x][y] = 0;
            // } else if (GRID[x][y] === 0 && neighbour === 3) {
            //     NEXTGRID[x][y] = 1;
            // } else {
            //     NEXTGRID[x][y] = GRID[x][y];
            // }

            // Loop and change NEXTGRID[x][y] value only if the rules setting is checked
            for (let i = 0; i < 9; i++) {
                if (neighbour === i) {
                    if (
                        (GRID[x][y] === 1 || GRID[x][y] === 2) &&
                        aliveRuleCells[i].checked
                    ) {
                        NEXTGRID[x][y] = 0;
                    } else if (GRID[x][y] === 0 && !birthRuleCells[i].checked) {
                        NEXTGRID[x][y] = 1;
                    } else if (
                        NEXTGRID[x][y] === GRID[x][y] &&
                        GRID[x][y] !== 0
                    ) {
                        NEXTGRID[x][y] = 2;
                    } else {
                        NEXTGRID[x][y] = GRID[x][y];
                    }
                }
            }

            // Showcasemode add collision against walls
            // if (
            //     showcaseMode &&
            //     showcasePattern !== biBlockPufferPattern.pattern &&
            //     showcasePattern !== flyPattern.pattern
            // ) {
            //     if (x === 0 || y === ROWS - 1) {
            //         NEXTGRID[x][y] = 0;
            //     }
            // }
        }
    }

    [GRID, NEXTGRID] = [NEXTGRID, GRID];
}

p5.disableFriendlyErrors = true;

function setup() {
    // Create Canvas
    canvas = createCanvas(
        Math.floor((windowWidth * widthRatio) / SIZE) * SIZE,
        Math.floor((windowHeight * heightRatio) / SIZE) * SIZE
    );
    canvas.parent(document.querySelector("#canvas"));
    canvas.style("margin-left", "1rem");
    canvas.style("margin-right", "1rem");
    // canvas.style("margin-right", "2.5rem");
    canvas.style("margin-top", "4.5rem");
    canvas.style("margin-bottom", "2.5rem");
    canvas.style("border", "1px solid #ccc");
    background(255);
    // Create grid
    COLS = width / SIZE;
    ROWS = height / SIZE;
    GRID = gridArray(COLS, ROWS);
    NEXTGRID = gridArray(COLS, ROWS);
    init();

    // FPS Slider
    speedSlider = createSlider(0, 60, 30, 5);
    speedSlider.position(90, height + 90);
    speedSlider.style("width", "150px");
    speedSlider.input(updateFPS);
    valueDisplayer = createP();
    valueDisplayer.position(250, height + 90);
    valueDisplayer.html("FPS: " + speedSlider.value());
    valueDisplayer.style("font-size", "16px");
    valueDisplayer.style("font-weight", "bold");
    valueDisplayer.style("color", "#fff");
    // console.log(speedSlider);

    // Scoreboard
    aliveNumberDisplay = createP();
    aliveNumberDisplay.position(width - 65, 20);
    aliveNumberDisplay.style("color", "#fff");
    aliveNumberDisplay.style("font-size", "0.8rem");
    turnNumberDisplay = createP();
    turnNumberDisplay.position(width - 65, 35);
    turnNumberDisplay.style("color", "#fff");
    turnNumberDisplay.style("font-size", "0.8rem");

    // PauseStatus
    let paused = pauseButton.matches(".paused");
    pauseStatusDisplay = createP();
    pauseStatusDisplay.position(90, 20);
    pauseStatusDisplay.style("color", "#fff");
    pauseStatusDisplay.style("font-weight", "bold");
    pauseStatusDisplay.style("font-size", "1rem");
    pauseStatusDisplay.html(`${paused ? "Paused" : "--- Running ---"}`);

    // ExtinctionStatus
    extinctionDisplay = createP();
    // extinctionDisplay.position(windowWidth - width + 200, height + 80);
    extinctionDisplay.position(windowWidth - width, height / 4);
    extinctionDisplay.style("color", "#000");
    extinctionDisplay.style("font-weight", "bold");
    extinctionDisplay.style("font-size", "1rem");
    extinctionDisplay.style("width", width * widthRatio - 100);
    extinctionDisplay.style("margin", "0 10px");
    extinctionDisplay.style("user-select", "none");

    // Canvas Interaction - Draw cells
    canvas.mousePressed(canvasPressed);
    canvas.touchStarted(canvasPressed);
}

function draw() {
    let numOfAlive = 0;

    generate();
    background("transparent");
    stroke(separatorColor);

    for (let x = 0; x < COLS; x++) {
        for (let y = 0; y < ROWS; y++) {
            if (GRID[x][y] === 1) {
                numOfAlive += 1;
                fill(aliveCellColor);
            } else if (GRID[x][y] === 2) {
                numOfAlive += 1;
                fill(stableCellColor);
            } else {
                fill(deathCellColor);
            }
            switch (SHAPE) {
                case "rect":
                    rect(x * SIZE, y * SIZE, SIZE, SIZE);
                    break;
                case "circle":
                    ellipse(
                        x * SIZE + SIZE / 2,
                        y * SIZE + SIZE / 2,
                        SIZE,
                        SIZE
                    );
                    break;
                default:
                    break;
            }
        }
    }

    // Show blurred image of pattern on gameboard
    if (showcaseMode) {
        // fill(deathCellColor);
        rect(0, 0, SIZE, SIZE);
        for (let array of showcasePattern) {
            let PosX = mouseX + array[0] * SIZE - 40;
            let PosY = mouseY + array[1] * SIZE - 40;

            if (PosX !== 0 && PosY !== 0) {
                fill(220, 220, 220);
                rect(PosX, PosY, SIZE, SIZE);
            }
        }
    }

    aliveNumberDisplay.html("Number of Alive: " + numOfAlive);
    turnNumberDisplay.html("Generation: " + numOfTurn);
    let paused = pauseButton.matches(".paused");
    pauseStatusDisplay.html(`${paused ? "Paused" : "--- Running---"}`);

    if (numOfAlive === 0) {
        if (!showcaseMode) {
            noLoop();
            extinctionDisplay.html(
                `Extinction...
                after ${numOfTurn} turns.`
            );
        } else {
            extinctionDisplay.html(
                `Extinction...after ${numOfTurn} turns.<br/>
                If no cells generated at game start,<br/>
                either your pattern sucks or the<br/>
               cell size/window size is too small.`
            );
        }
        // alert(`Extinction...\n after ${numOfTurn} turns.`);
        numOfTurn = 0;
    } else {
        extinctionDisplay.html("");
    }

    numOfTurn += 1;
}

function windowResizeHandler() {
    resizeCanvas(
        Math.floor((windowWidth * widthRatio) / SIZE) * SIZE,
        Math.floor((windowHeight * heightRatio) / SIZE) * SIZE,
        false
    );
    COLS = width / SIZE;
    ROWS = height / SIZE;

    GRID = gridArray(COLS, ROWS);
    NEXTGRID = gridArray(COLS, ROWS);
    init();
}

function windowResized() {
    windowResizeHandler();
    init();

    speedSlider.position(90, height + 90);
    valueDisplayer.position(250, height + 90);
    aliveNumberDisplay.position(width - 65, 20);
    turnNumberDisplay.position(width - 65, 35);
    pauseStatusDisplay.position(90, 20);
    extinctionDisplay.position(windowWidth - width, height / 4);
}

// Game features
function updateFPS() {
    initialSpeed = speedSlider.value();
    valueDisplayer.html("FPS: " + speedSlider.value());
    frameRate(initialSpeed);
}

function canvasPressed() {
    drawing = true;
    placePattern();
    noLoop();
}

function doubleClicked() {
    if (showcaseMode) {
        for (let i = 0; i < COLS; i++) {
            for (let j = 0; j < ROWS; j++) {
                for (let array of showcasePattern) {
                    let PosX = Math.floor(mouseX / SIZE + array[0] - 20 / SIZE);
                    let PosY = Math.floor(mouseY / SIZE + array[1] - 20 / SIZE);
                    GRID[PosX][PosY] = 1;
                }
            }
        }
    }
}

function placePattern() {
    if (showcaseMode) {
        placePatternTimer = setTimeout(() => {
            // if (pmouseX === mouseX && pmouseY === mouseY) {   //not work on phone
            for (let i = 0; i < COLS; i++) {
                for (let j = 0; j < ROWS; j++) {
                    for (let array of showcasePattern) {
                        let PosX = Math.floor(
                            pmouseX / SIZE + array[0] - 20 / SIZE
                        );
                        let PosY = Math.floor(
                            pmouseY / SIZE + array[1] - 20 / SIZE
                        );
                        GRID[PosX][PosY] = 1;
                    }
                }
            }
            // }
        }, 300);
    }
}

function touchEnded() {
    if (drawing && !pauseButton.matches(".paused")) {
        clearTimeout(placePatternTimer);
        loop();
        drawing = false;
    }
}

function touchMoved() {
    if (mouseX > SIZE * COLS || mouseY > SIZE * ROWS) {
        return;
    }

    if (!showcaseMode) {
        let x = Math.floor(mouseX / SIZE);
        let y = Math.floor(mouseY / SIZE);

        // Draw/Erace base on erase mode
        if (eraseMode === true) {
            GRID[x][y] = 0;
            fill(deathCellColor);
        } else if (eraseMode === false) {
            GRID[x][y] = 1;
            fill(aliveCellColor);
        }

        stroke(separatorColor);

        switch (SHAPE) {
            case "rect":
                rect(x * SIZE, y * SIZE, SIZE, SIZE);
                break;
            case "circle":
                ellipse(x * SIZE + SIZE / 2, y * SIZE + SIZE / 2, SIZE, SIZE);
                break;
            default:
                break;
        }
    }
}

// Obsolete function : mouseReleased
// function mouseReleased() {
//     if (drawing && !pauseButton.matches(".paused")) {
//         loop();
//         drawing = false;
//     }
// }

function keyPressed() {
    if (keyCode === 32 && showcaseMode) {
        for (let i = 0; i < COLS; i++) {
            for (let j = 0; j < ROWS; j++) {
                for (let array of showcasePattern) {
                    let PosX = Math.floor(mouseX / SIZE + array[0] - 20 / SIZE);
                    let PosY = Math.floor(mouseY / SIZE + array[1] - 20 / SIZE);
                    GRID[PosX][PosY] = 1;
                }
            }
        }
    }
    if (keyIsDown(16) && showcaseMode) {
        noLoop();
    }
}

function keyReleased() {
    if (keyCode === 16 && showcaseMode) {
        loop();
    }
}

// Obsolete function : mouseDragged
// function mouseDragged() {
//     if (mouseX > SIZE * COLS || mouseY > SIZE * ROWS) {
//         return;
//     }
//     let x = Math.floor(mouseX / SIZE);
//     let y = Math.floor(mouseY / SIZE);

//     if (eraseMode === true) {
//         GRID[x][y] = 0;
//         fill(deathCellColor);
//     } else if (eraseMode === false) {
//         GRID[x][y] = 1;
//         fill(aliveCellColor);
//     }

//     stroke(separatorColor);

//     switch (SHAPE) {
//         case "rect":
//             rect(x * SIZE, y * SIZE, SIZE, SIZE);
//             break;
//         case "circle":
//             ellipse(x * SIZE + SIZE / 2, y * SIZE + SIZE / 2, SIZE, SIZE);
//             break;
//         default:
//             break;
//     }
// }

// Setting Buttons Functions

restartButton.addEventListener("click", () => {
    if (showcaseMode) {
        for (let i = 0; i < COLS; i++) {
            for (let j = 0; j < ROWS; j++) {
                GRID[i][j] = 0;
            }
        }
    }

    init();
    if (autoStart === true) {
        loop();
        pauseButton.classList.remove("paused");
        pauseButton.children[0].classList.remove("fa-play-circle");
        pauseButton.children[0].classList.add("fa-pause-circle");
    } else {
        noLoop();
        pauseButton.classList.add("paused");
        pauseButton.children[0].classList.remove("fa-pause-circle");
        pauseButton.children[0].classList.add("fa-play-circle");
    }
});

pauseButton.addEventListener("click", (e) => {
    if (e.currentTarget.matches(".paused")) {
        loop();
        e.currentTarget.classList.remove("paused");
        e.target.classList.remove("fa-play-circle");
        e.target.classList.add("fa-pause-circle");
    } else {
        noLoop();
        e.currentTarget.classList.add("paused");
        e.target.classList.remove("fa-pause-circle");
        e.target.classList.add("fa-play-circle");
    }
});

aliveCellColorSelector.addEventListener("input", (e) => {
    aliveCellColor = e.target.value;
});

deathCellColorSelector.addEventListener("input", (e) => {
    deathCellColor = e.target.value;
});

stableCellColorSelector.addEventListener("input", (e) => {
    stableCellColor = e.target.value;
});

syncColorBtn.addEventListener("click", () => {
    stableCellColor = stableCellColorSelector.value = aliveCellColor;
});

syncDeathColorBtn.addEventListener("click", () => {
    separatorColor = separatorColorSelector.value = deathCellColor;
});

separatorColorSelector.addEventListener("input", (e) => {
    separatorColor = e.target.value;
});

cellSizeSelector.addEventListener("change", (e) => {
    SIZE = parseInt(e.target.value);

    // Resize Canvas
    resizeCanvas(
        Math.floor((windowWidth * widthRatio) / SIZE) * SIZE,
        Math.floor((windowHeight * heightRatio) / SIZE) * SIZE
    );

    COLS = width / SIZE;
    ROWS = height / SIZE;

    GRID = gridArray(COLS, ROWS);
    NEXTGRID = gridArray(COLS, ROWS);
    init();
});

cellShapeSelector.addEventListener("change", (e) => {
    SHAPE = e.target.value;

    resizeCanvas(
        Math.floor((windowWidth * widthRatio) / SIZE) * SIZE,
        Math.floor((windowHeight * heightRatio) / SIZE) * SIZE
    );

    COLS = width / SIZE;
    ROWS = height / SIZE;

    GRID = gridArray(COLS, ROWS);
    NEXTGRID = gridArray(COLS, ROWS);

    init();
});

autostartSelector.addEventListener("change", (e) => {
    autoStart = e.target.checked ? true : false;
});

drawModeSelector.addEventListener("change", (e) => {
    eraseMode = e.target.checked ? true : false;
});

cellQuantitySelector.addEventListener("change", (e) => {
    cellQuantity = e.target.value;
});
