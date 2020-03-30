let matrix = [];
let rows = 11;
let cols = 200;
let openingCells = 0; //(rows * cols) / 4;
let cellW = window.innerWidth / cols;
let cellH = cellW; //window.innerHeight / rows;
let delta = [];

let inertval;
let countKeyPressed = 0;

function initListener() {
  document.body.onclick = function() {
    let c = floor(mouseX / cellW);
    let r = floor(mouseY / cellH);

    matrix[r][c] = matrix[r][c] == 1 ? 0 : 1;
    drawMatrix();
  };

  document.body.onkeypress = function() {
    countKeyPressed++;
    if (countKeyPressed % 2 == 0) clearInterval(interval);
    else {
      interval = setInterval(function() {
        execWrapper();
      }, 50);
    }
  };
}

function initMatrix() {
  for (let r = 0; r < rows; r++) matrix[r] = new Array(cols);

  for (let oc = 0; oc < openingCells; oc++) {
    var rR = floor(random(rows));
    var rC = floor(random(cols));
    if (matrix[rR][rC] == 1) oc--;
    matrix[rR][rC] = 1;
  }
}

function setFigure1() {
  initMatrix();

  let startRow = floor(rows / 2);
  let startCol = cols - 1;

  // punti della prima riga + simmetrica
  matrix[startRow + 5][startCol - 6] = 1;
  matrix[startRow - 5][startCol - 6] = 1;

  // punti della seconda riga + simmetrica
  matrix[startRow + 4][startCol - 7] = 1;
  matrix[startRow + 4][startCol - 8] = 1;
  matrix[startRow - 4][startCol - 7] = 1;
  matrix[startRow - 4][startCol - 8] = 1;

  // punti della terza riga + simmetrica
  matrix[startRow + 3][startCol] = 1;
  matrix[startRow + 3][startCol - 3] = 1;
  matrix[startRow + 3][startCol - 4] = 1;
  matrix[startRow + 3][startCol - 5] = 1;
  matrix[startRow + 3][startCol - 8] = 1;

  matrix[startRow - 3][startCol] = 1;
  matrix[startRow - 3][startCol - 3] = 1;
  matrix[startRow - 3][startCol - 4] = 1;
  matrix[startRow - 3][startCol - 5] = 1;
  matrix[startRow - 3][startCol - 8] = 1;

  // punti della quarta riga + simmetrica
  matrix[startRow + 2][startCol - 1] = 1;
  matrix[startRow + 2][startCol - 2] = 1;
  matrix[startRow + 2][startCol - 3] = 1;
  matrix[startRow + 2][startCol - 8] = 1;

  matrix[startRow - 2][startCol - 1] = 1;
  matrix[startRow - 2][startCol - 2] = 1;
  matrix[startRow - 2][startCol - 3] = 1;
  matrix[startRow - 2][startCol - 8] = 1;

  // punti della quinta riga + simmetrica
  matrix[startRow - 1][startCol - 1] = 1;
  matrix[startRow - 1][startCol - 2] = 1;
  matrix[startRow - 1][startCol - 5] = 1;
  matrix[startRow - 1][startCol - 6] = 1;
  matrix[startRow - 1][startCol - 7] = 1;

  matrix[startRow + 1][startCol - 1] = 1;
  matrix[startRow + 1][startCol - 2] = 1;
  matrix[startRow + 1][startCol - 5] = 1;
  matrix[startRow + 1][startCol - 6] = 1;
  matrix[startRow + 1][startCol - 7] = 1;
}

function drawMatrix() {
  translate(0, 0);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      matrix[r][c] == 1 ? fill(51, 204, 51) : fill(50);
      rect(c * cellW, r * cellH, cellW, cellH);
    }
  }
}

function countNeighbors(r, c) {
  let aliveNeighbors = 0;

  if (r > 0 && c > 0 && matrix[r - 1][c - 1] == 1) {
    //console.log(r + ", " + c + " case 1");
    aliveNeighbors++;
  }
  if (r > 0 && matrix[r - 1][c] == 1) {
    // console.log(r + ", " + c + " case 2");
    aliveNeighbors++;
  }
  if (r > 0 && c < cols - 1 && matrix[r - 1][c + 1] == 1) {
    // console.log(r + ", " + c + " case 3");
    aliveNeighbors++;
  }
  if (c > 0 && matrix[r][c - 1] == 1) {
    // console.log(r + ", " + c + " case 4");
    aliveNeighbors++;
  }
  if (c < cols - 1 && matrix[r][c + 1] == 1) {
    // console.log(r + ", " + c + " case 5");
    aliveNeighbors++;
  }
  if (r < rows - 1 && c > 0 && matrix[r + 1][c - 1] == 1) {
    // console.log(r + ", " + c + " case 6");
    aliveNeighbors++;
  }
  if (r < rows - 1 && matrix[r + 1][c] == 1) {
    // console.log(r + ", " + c + " case 7");
    aliveNeighbors++;
  }
  if (r < rows - 1 && c < cols - 1 && matrix[r + 1][c + 1] == 1) {
    // console.log(r + ", " + c + " case 8");
    aliveNeighbors++;
  }

  return aliveNeighbors;
}

function nextGeneration() {
  //Any live cell with two or three neighbors survives.
  //Any dead cell with three live neighbors becomes a live cell.
  //All other live cells die in the next generation. Similarly, all other dead cells stay dead.

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let neighbors = countNeighbors(r, c);
      if (matrix[r][c] == 1 && (neighbors != 2 && neighbors != 3)) {
        // console.log("died " + r + ", " + c);
        delta.push([r, c]);
      }
      if (matrix[r][c] != 1 && neighbors == 3) {
        // console.log("zombie " + r + ", " + c);
        delta.push([r, c]);
      }
    }
  }
}

function execWrapper() {
  nextGeneration();
  applyDelta();
  drawMatrix();
}

function applyDelta() {
  for (let i = 0; i < delta.length; i++) {
    let r = delta[i][0];
    let c = delta[i][1];

    matrix[r][c] = matrix[r][c] == 1 ? 0 : 1;
  }

  // console.log("last applied delta: ");
  // console.log(delta);
  delta = [];
}

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.position(0, 0);
  noStroke();

  background(111);

  //initMatrix();
  setFigure1();
  drawMatrix();
  initListener();
}
