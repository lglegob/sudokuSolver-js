'use strict';
import * as recurrent from "./recurrentFunctions.js";

////////////////////////////////////////////////////////////////////////////////
//                       NOTES to ZERO FUNCTIONS                             //
//////////////////////////////////////////////////////////////////////////////

//Here, it is mark as zero, each cell in the same row, which contains the currentCellValue as candidate yet
const noteZeroRow = (row, currentCellValue, theMatrixStep) => {
  theMatrixStep[row].forEach(function(column_item) {
    column_item[currentCellValue] = 0;
  });
return theMatrixStep;
}

//Here, it is mark as zero, each cell in the same column, which contains the currentCellValue as candidate yet
const noteZeroColumn = (column, currentCellValue, theMatrixStep) => {
  for (let row_within_column = 0; row_within_column < 9; row_within_column++) {
    theMatrixStep[row_within_column][column][currentCellValue] = 0;
  };
  return theMatrixStep;
};

//Here, it is mark as zero, each cell in the same block(square), which contains the currentCellValue as candidate yet
const noteZeroSquareSQ = (square, currentCellValue, theMatrixStep) => {
  const {fromrow, maximumrow, fromcolumn, maximumcolumn} = recurrent.defineSquareCoordinatesSQ(square);
  for (let square_row = fromrow; square_row <= maximumrow; square_row++) {
    for (let square_column = fromcolumn; square_column <= maximumcolumn; square_column++) {
      theMatrixStep[square_row][square_column][currentCellValue] = 0;
    };
  };
  return theMatrixStep;
};

//Here, it is mark as zero, each cell in the same block(square), which contains the currentCellValue as candidate yet
const noteZeroSquareRC = (row, column, currentCellValue, theMatrixStep) => {
  const {fromrow, maximumrow, fromcolumn, maximumcolumn} = recurrent.defineSquareCoordinatesRC(row, column);
  for (let square_row = fromrow; square_row <= maximumrow; square_row++) {
    for (let square_column = fromcolumn; square_column <= maximumcolumn; square_column++) {
      theMatrixStep[square_row][square_column][currentCellValue] = 0;
    };
  };
  return theMatrixStep;
};

export { noteZeroRow, noteZeroColumn, noteZeroSquareSQ, noteZeroSquareRC };