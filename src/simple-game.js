const cellsX = 100;
const cellsY = 80;
const cellChar = "*";
const liveCellCharColor = "#fc0";
const deadCellCharColor = "#eee";
const cellTemplate = "<span style='color: cell-color; with-shadow;'>cell-char</span>"
const shadowTemplate = "text-shadow: 1px 1px 2px black"
let timer = null;
let round = 0;
let canvas = [];

/**
 * Initialize a multi-dimensional array(matrix) with a random state.
 * Y represents the matrix height.
 * X represents the matrix width.
 * false is dead cell.
 * true is a living cell.
 *
 * E.g with a Matrix(4y, 4x)
 * [
 *  [false, false, false, false],
 *  [false, false, false, false],
 *  [false, false, false, false],
 *  [false, false, false, false],
 * ]
 */
function initialize() {
  for (let y = 0; y < cellsY; y++) {
    canvas[y] = [];
    for (let x = 0; x < cellsX; x++) {
      canvas[y][x] = Math.random() < 0.4;
    }
  }
}

/**
 * Clear the current canvas and reset the round
 */
function clear() {
  canvas = [];
  round = 0;
}

/**
 * Calculate the next generation of cells
 *
 * Rules:
 *  - Any live cell with two or three live neighbours lives
 *  - Any live cell with fewer than two live neighbours dies
 *  - Any live cell with more than three live neighbours dies
 *  - Any dead cell with exactly three live neighbours becomes a live cell
 */
function nextGeneration() {
  const nextGenerationCanvas = new Array(cellsY);

  for (let i = 0; i < cellsY; i++) {
    nextGenerationCanvas[i] = new Array(cellsX);

    for (let j = 0; j < cellsX; j++) {
      let neighbours = countNeighbours(i, j);
      nextGenerationCanvas[i][j] = canvas[i][j];

      if (canvas[i][j]) {
        if (neighbours === 2 || neighbours === 3)
          nextGenerationCanvas[i][j] = true;
        if (neighbours < 2 || neighbours > 3)
          nextGenerationCanvas[i][j] = false;
      } else {
        if (neighbours === 3) nextGenerationCanvas[i][j] = true;
      }
    }
  }

  return nextGenerationCanvas;
}

/**
 * Count the number of neighbours for each
 * cell, based on its coordinates, y(i) and x(j)
 */
function countNeighbours(cellPositionY, cellPositionX) {
  let count = 0;

  for (let y = cellPositionY - 1; y <= cellPositionY + 1; y++) {
    for (let x = cellPositionX - 1; x <= cellPositionX + 1; x++) {
      if (y === cellPositionY && x === cellPositionX) continue;
      if (y < 0 || y >= cellsY || x < 0 || x >= cellsX) continue;
      if (canvas[y][x]) count++;
    }
  }

  return count;
}

/**
 * Forward one generation in canvas
 */
function forwardGeneration() {
  canvas = nextGeneration();
  round++;
}

/**
 * Display de current generation on html
 */
function show() {
  let board = "";
  let row = "";

  for (let y = 0; y < cellsY; y++) {
    for (let x = 0; x < cellsX; x++) {
      const cell = renderCell(canvas[y][x]);
      row = row + cell;
    }

    board = board + "</br>" + row;
    row = "";
  }

  document.getElementById("canvas").innerHTML = board;
  document.getElementById("round").innerHTML = round;
}

function renderCell(alive) {
  let color = deadCellCharColor;
  let shadow = "";

  if(alive) {
    color = liveCellCharColor;
    shadow = shadowTemplate;
  }

  return cellTemplate
  .replace("cell-char", cellChar)
  .replace("cell-color", color)
  .replace("with-shadow", shadow);
}

/**
 * Run one iteration of the game
 */
function play() {
  forwardGeneration();
  show();
}

/**
 * Start the game
 */
function start() {
  clear();
  initialize();
  timer = setInterval(play, 10);
}

/**
 * Stop the game
 */
function stop() {
  clearInterval(timer);
  timer = undefined;
}

/**
 * Game Controls
 */
document.getElementById("start").addEventListener("click", function() {
  if (timer) {
    stop();
    this.textContent = "Start";
    document.getElementById("next-generation").disabled = false;
  } else {
    start();
    this.textContent = "Stop";
    document.getElementById("next-generation").disabled = true;
  }
});

document.getElementById("new-game").addEventListener("click", function() {
  stop();
  clear();
  initialize();
  show();
  document.getElementById("start").textContent = "Start";
  document.getElementById("next-generation").disabled = false;
});

document
  .getElementById("next-generation")
  .addEventListener("click", function() {
    play();
  });
