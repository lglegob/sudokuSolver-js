'use strict';
import * as recurrent from "./theRecurrentFunctions.js";

////////////////////////////////////////////////////////////////////////////////
//                       NOTES to ZERO FUNCTIONS                             //
//////////////////////////////////////////////////////////////////////////////

//Here, it is mark as zero, each cell in the same row, which contains the currentcellvalue as candidate yet
const noteZeroRow = (row, currentcellvalue, theMatrixStep) => {
  theMatrixStep[row].forEach(function(column_item) {
    column_item[currentcellvalue] = 0;
  });
return theMatrixStep;
}

//Here, it is mark as zero, each cell in the same column, which contains the currentcellvalue as candidate yet
const noteZeroColumn = (column, currentcellvalue, theMatrixStep) => {
  for (let row_within_column = 0; row_within_column < 9; row_within_column++) {
    theMatrixStep[row_within_column][column][currentcellvalue] = 0;
  };
  return theMatrixStep;
};

//Here, it is mark as zero, each cell in the same block(square), which contains the currentcellvalue as candidate yet
const noteZeroSquareSQ = (square, currentcellvalue, theMatrixStep) => {
  const {fromrow, maximumrow, fromcolumn, maximumcolumn} = recurrent.defineSquareCoordinatesSQ(square);
  for (let square_row = fromrow; square_row <= maximumrow; square_row++) {
    for (let square_column = fromcolumn; square_column <= maximumcolumn; square_column++) {
      theMatrixStep[square_row][square_column][currentcellvalue] = 0;
    };
  };
  return theMatrixStep;
};

//Here, it is mark as zero, each cell in the same block(square), which contains the currentcellvalue as candidate yet
const noteZeroSquareRC = (row, column, currentcellvalue, theMatrixStep) => {
  const {fromrow, maximumrow, fromcolumn, maximumcolumn} = recurrent.defineSquareCoordinatesRC(row, column);
  for (let square_row = fromrow; square_row <= maximumrow; square_row++) {
    for (let square_column = fromcolumn; square_column <= maximumcolumn; square_column++) {
      theMatrixStep[square_row][square_column][currentcellvalue] = 0;
    };
  };
  return theMatrixStep;
};

export { noteZeroRow, noteZeroColumn, noteZeroSquareSQ, noteZeroSquareRC };