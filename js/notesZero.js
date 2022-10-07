'use strict';
import globalVar from "./globalVar.js";
import * as recurrent from "./recurrentFunctions.js";

////////////////////////////////////////////////////////////////////////////////
//                       NOTES to ZERO FUNCTIONS                             //
//////////////////////////////////////////////////////////////////////////////

//Here, it is mark as zero, each cell in the same row, which contains the currentCellValue as candidate yet
const noteZeroRow = (row, currentCellValue, theMatrixStep) => {
  theMatrixStep[row].forEach(function(column_item, columnindex) {
    globalVar.loopsExecuted++;
    if (column_item[currentCellValue] !== 0 && column_item[0] === 0) {
      column_item[currentCellValue] = 0;
      if(document.querySelector("#highlightChanges").checked) {
        document.querySelector(".theMatrixNotes " + ".row" + (row + 1) + ".column" + (columnindex + 1) + " .note" + currentCellValue).classList.add("justDeletedNote");
      };
    };
  });

  return theMatrixStep;
}

//Here, it is mark as zero, each cell in the same column, which contains the currentCellValue as candidate yet
const noteZeroColumn = (column, currentCellValue, theMatrixStep) => {
  for (let row_within_column = 0; row_within_column < 9; row_within_column++) {
    globalVar.loopsExecuted++;
    if (theMatrixStep[row_within_column][column][currentCellValue] !== 0 && theMatrixStep[row_within_column][column][0] === 0) {
      theMatrixStep[row_within_column][column][currentCellValue] = 0;
      if(document.querySelector("#highlightChanges").checked) {
        document.querySelector(".theMatrixNotes " + ".row" + (row_within_column + 1) + ".column" + (column + 1) + " .note" + currentCellValue).classList.add("justDeletedNote");
      };
    };
  };
  return theMatrixStep;
};

//Here, it is mark as zero, each cell in the same block(square), which contains the currentCellValue as candidate yet
const noteZeroSquareSQ = (square, currentCellValue, theMatrixStep) => {
  const {fromrow, maximumrow, fromcolumn, maximumcolumn} = recurrent.defineSquareCoordinatesSQ(square);
  for (let square_row = fromrow; square_row <= maximumrow; square_row++) {
    for (let square_column = fromcolumn; square_column <= maximumcolumn; square_column++) {
      globalVar.loopsExecuted++;
      if (theMatrixStep[square_row][square_column][currentCellValue] !== 0 && theMatrixStep[square_row][square_column][0] === 0) {
        theMatrixStep[square_row][square_column][currentCellValue] = 0;
        if(document.querySelector("#highlightChanges").checked) {
          document.querySelector(".theMatrixNotes " + ".row" + (square_row + 1) + ".column" + (square_column + 1) + " .note" + currentCellValue).classList.add("justDeletedNote");
        };
      };
    };
  };
  return theMatrixStep;
};

//Here, it is mark as zero, each cell in the same block(square), which contains the currentCellValue as candidate yet
const noteZeroSquareRC = (row, column, currentCellValue, theMatrixStep) => {
  const {fromrow, maximumrow, fromcolumn, maximumcolumn} = recurrent.defineSquareCoordinatesRC(row, column);
  for (let square_row = fromrow; square_row <= maximumrow; square_row++) {
    for (let square_column = fromcolumn; square_column <= maximumcolumn; square_column++) {
      globalVar.loopsExecuted++;
      if (theMatrixStep[square_row][square_column][currentCellValue] !== 0 && theMatrixStep[square_row][square_column][0] === 0) {
        theMatrixStep[square_row][square_column][currentCellValue] = 0;
        if(document.querySelector("#highlightChanges").checked) {
          document.querySelector(".theMatrixNotes " + ".row" + (square_row + 1) + ".column" + (square_column + 1) + " .note" + currentCellValue).classList.add("justDeletedNote");
        };
      };
    };
  };
  return theMatrixStep;
};

//Here, focused in one specific cell, to delete the notes except the ones specified
const noteZeroCellExcept = (row, column, candidate1, candidate2, theMatrixStep) => {
  for (let possibleCandidate = 1; possibleCandidate <=9; possibleCandidate++) {
    if (possibleCandidate !== candidate1 && possibleCandidate !== candidate2) {
      if(document.querySelector("#highlightChanges").checked && theMatrixStep[row][column][possibleCandidate] !== 0) {
        document.querySelector(".theMatrixNotes " + ".row" + (row + 1) + ".column" + (column + 1) + " .note" + possibleCandidate).classList.add("justDeletedNote");
      };
      theMatrixStep[row][column][possibleCandidate] = 0;
    } else {
      theMatrixStep[row][column][possibleCandidate] = 1;
      if(document.querySelector("#highlightChanges").checked) {
        document.querySelector(".theMatrixNotes " + ".row" + (row + 1) + ".column" + (column + 1) + " .note" + possibleCandidate).classList.add("noteKept");
      };
    };
  };
  return theMatrixStep;
};

export { noteZeroRow, noteZeroColumn, noteZeroSquareSQ, noteZeroSquareRC, noteZeroCellExcept };