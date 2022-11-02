'use strict';
import globalVar from "./globalVar.js";
import * as coordinates from "./defineCoordinates.js";

////////////////////////////////////////////////////////////////////////////////
//                       NOTES to ZERO FUNCTIONS                             //
//////////////////////////////////////////////////////////////////////////////

//Here, it is mark as zero, each cell in the same row, which contains the currentCellValue as candidate yet
const noteZeroRow = (row, currentCellValue, theMatrixStep) => {
  theMatrixStep[row].forEach(function(columnCellArray, columnindex) {
    globalVar.loopsExecuted++;
    if (columnCellArray[currentCellValue] !== 0 && columnCellArray[0] === 0) {
      columnCellArray[currentCellValue] = 0;
      if(globalVar.areHighlightsOn === true) {
        document.querySelector(".theMatrixNotes " + ".row" + (row + 1) + ".column" + (columnindex + 1) + " .note" + currentCellValue).classList.add("justDeletedNote");
      };
    };
  });

  return theMatrixStep;
}

//Here, it is mark as zero, each cell in the same column, which contains the currentCellValue as candidate yet
const noteZeroColumn = (column, currentCellValue, theMatrixStep) => {
  for (let rowWithinColumn = 0; rowWithinColumn < 9; rowWithinColumn++) {
    globalVar.loopsExecuted++;
    if (theMatrixStep[rowWithinColumn][column][currentCellValue] !== 0 && theMatrixStep[rowWithinColumn][column][0] === 0) {
      theMatrixStep[rowWithinColumn][column][currentCellValue] = 0;
      if(globalVar.areHighlightsOn === true) {
        document.querySelector(".theMatrixNotes " + ".row" + (rowWithinColumn + 1) + ".column" + (column + 1) + " .note" + currentCellValue).classList.add("justDeletedNote");
      };
    };
  };
  return theMatrixStep;
};

//Here, it is mark as zero, each cell in the same block(square), which contains the currentCellValue as candidate yet
const noteZeroSquareSQ = (square, currentCellValue, theMatrixStep) => {
  const {fromrow, maximumrow, fromcolumn, maximumcolumn} = coordinates.defineInitialMaxRCFromSquare(square);
  for (let square_row = fromrow; square_row <= maximumrow; square_row++) {
    for (let square_column = fromcolumn; square_column <= maximumcolumn; square_column++) {
      globalVar.loopsExecuted++;
      if (theMatrixStep[square_row][square_column][currentCellValue] !== 0 && theMatrixStep[square_row][square_column][0] === 0) {
        theMatrixStep[square_row][square_column][currentCellValue] = 0;
        if(globalVar.areHighlightsOn === true) {
          document.querySelector(".theMatrixNotes " + ".row" + (square_row + 1) + ".column" + (square_column + 1) + " .note" + currentCellValue).classList.add("justDeletedNote");
        };
      };
    };
  };
  return theMatrixStep;
};

//Here, it is mark as zero, each cell in the same block(square), which contains the currentCellValue as candidate yet
const noteZeroSquareRC = (row, column, currentCellValue, theMatrixStep) => {
  const {fromrow, maximumrow, fromcolumn, maximumcolumn} = coordinates.defineInitialMaxRCFromRC(row, column);
  for (let square_row = fromrow; square_row <= maximumrow; square_row++) {
    for (let square_column = fromcolumn; square_column <= maximumcolumn; square_column++) {
      globalVar.loopsExecuted++;
      if (theMatrixStep[square_row][square_column][currentCellValue] !== 0 && theMatrixStep[square_row][square_column][0] === 0) {
        theMatrixStep[square_row][square_column][currentCellValue] = 0;
        if(globalVar.areHighlightsOn === true) {
          document.querySelector(".theMatrixNotes " + ".row" + (square_row + 1) + ".column" + (square_column + 1) + " .note" + currentCellValue).classList.add("justDeletedNote");
        };
      };
    };
  };
  return theMatrixStep;
};

//Here, focused in one specific cell, to delete the notes except the ones specified
const noteZeroCellExcept = (row, column, currentCandidates, theMatrixStep) => {
  for (let possibleCandidate = 1; possibleCandidate <=9; possibleCandidate++) {
    // if (possibleCandidate !== currentCandidates.candidate1 && possibleCandidate !== currentCandidates.candidate2)
    if (Object.values(currentCandidates).every((val) => val !== possibleCandidate)) {
      if(globalVar.areHighlightsOn === true && theMatrixStep[row][column][possibleCandidate] !== 0) {
        document.querySelector(".theMatrixNotes " + ".row" + (row + 1) + ".column" + (column + 1) + " .note" + possibleCandidate).classList.add("justDeletedNote");
      };
      theMatrixStep[row][column][possibleCandidate] = 0;
    } else if (globalVar.areHighlightsOn === true && theMatrixStep[row][column][possibleCandidate] !== 0) {
        document.querySelector(".theMatrixNotes " + ".row" + (row + 1) + ".column" + (column + 1) + " .note" + possibleCandidate).classList.add("noteKept");
    };
  };
  return theMatrixStep;
};

//Here, focused in one specific cell, to delete one specific note
const noteZeroCell = (cellsToDelete, candidate, theMatrixStep) => {
  cellsToDelete.forEach(cellCoordinates => {
    if(globalVar.areHighlightsOn === true) {
      document.querySelector(".theMatrixNotes " + ".row" + (cellCoordinates[0] + 1) + ".column" + (cellCoordinates[1] + 1) + " .note" + candidate).classList.add("justDeletedNote");
    };
    theMatrixStep[cellCoordinates[0]][cellCoordinates[1]][candidate] = 0;
  });
  return theMatrixStep;
};

export { noteZeroRow, noteZeroColumn, noteZeroSquareSQ, noteZeroSquareRC, noteZeroCellExcept, noteZeroCell };