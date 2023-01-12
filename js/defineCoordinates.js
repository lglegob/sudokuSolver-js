'use strict';

////////////////////////////////////////////////////////////////////////////////
//                         COORDINATES FUNCTIONS                             //
//////////////////////////////////////////////////////////////////////////////

//Here, it is defined depending of the current cell in analysis, the range of rows and columns to evaluate in the same square
const defineInitialMaxRCFromRC = (row, column) => {
  let fromrow;
  let maximumrow;
  let fromcolumn;
  let maximumcolumn;
  switch (true) {
    case row <= 2:
      fromrow = 0
      maximumrow = 2
      break;
    case row <= 5:
      fromrow = 3
      maximumrow = 5
      break;
    case row <= 8:
      fromrow = 6
      maximumrow = 8
      break;
  };
  switch (true) {
    case column <= 2:
      fromcolumn = 0
      maximumcolumn = 2
      break;
    case column <= 5:
      fromcolumn = 3
      maximumcolumn = 5
      break;
    case row <= 8:
      fromcolumn = 6
      maximumcolumn = 8
      break;
  };
  return {fromrow, maximumrow, fromcolumn, maximumcolumn};
};

//Here, it is defined depending of the square in analysis, the range of rows and columns to evaluate
const defineInitialMaxRCFromSquare = (square) => {
  let fromrow;
  let maximumrow;
  let fromcolumn;
  let maximumcolumn;
  switch (true) {
    case ((square - 1) % 3 == 0 ): //Detects Squares 1, 4 and 7
      fromcolumn = 0
      maximumcolumn = 2
      break;
    case ((square - 1) % 3 == 1): //Detects Squares 2, 5 and 8
      fromcolumn = 3
      maximumcolumn = 5
      break;
    case ((square - 1) % 3 == 2): //Detects Squares 3, 6 and 9
      fromcolumn = 6
      maximumcolumn = 8
      break;
  }
  switch (true) {
    case square <= 3:   //Detects Squares 1, 2 and 3
      fromrow = 0
      maximumrow = 2
      break;
    case square <= 6:   //Detects Squares 4, 5 and 6
      fromrow = 3
      maximumrow = 5
      break;
    case square <= 9:   //Detects Squares 7, 8 and 9
      fromrow = 6
      maximumrow = 8
      break;
  };
  return {fromrow, maximumrow, fromcolumn, maximumcolumn};
};

const defineSquareFromRC = (row, column) => {
  const square = 3 * Math.floor(row / 3) + Math.ceil((column + 1) / 3);
  return square;
};

const defineRealRCFromSquareRelativeRC = (square, relativeRow, relativeColumn) => {
  const realRow = (3 *(Math.floor((square-1) / 3))) + relativeRow;
  const realColumn = ( 3 * ((square-1) % 3)) + relativeColumn;
  return { realRow, realColumn };
};

const defineRealRCFromSquareRelativeCell = (square, relativeCell) => {
  const realRow = (3 *(Math.floor((square-1) / 3))) + Math.floor(relativeCell / 3);
  const realColumn = ( 3 * ((square-1) % 3)) + (relativeCell % 3);
  return { realRow, realColumn };
};

//If available, square with above function should the function to use instead
const defineRealRCFromInitialRCRelativeCell = (fromRow, fromColumn, relativeCell) => {
  const realRow = fromRow + Math.floor(relativeCell / 3); 
  const realColumn = fromColumn + relativeCell % 3;
  return { realRow, realColumn };
};

//This function receives row and column (0 to 8) and returns the relative Cell (1 to 81)
const defineRelativeCellFromRC = (row, column) => {
  const relativeCell = row * 9 + column + 1;
  return { relativeCell };
};

export { defineInitialMaxRCFromRC, defineInitialMaxRCFromSquare, defineSquareFromRC, defineRealRCFromSquareRelativeRC, defineRealRCFromSquareRelativeCell, defineRealRCFromInitialRCRelativeCell, defineRelativeCellFromRC }