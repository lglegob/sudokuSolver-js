'use strict';
import * as recurrent from "./recurrentFunctions.js";
import * as discardingFunctions from "./discardingProcessFunctions.js";

////////////////////////////////////////////////////////////////////////////////
//                            VALID PUZZLE CHECKS                            //
//////////////////////////////////////////////////////////////////////////////

const validPuzzleRow = (validPuzzle) => {
  if (validPuzzle) {
    for (let row = 0; row <=8; row++) {
      const { howmanycellswiththisnote, howmanynotesinthiscell, answersCurrentBlock, whereisthisnote } = discardingFunctions.gettingDetailedInfo ( row, row, 0, 8, "row" );
      let wasDuplicated = answersCurrentBlock.some((candidateRepetitions, candidate) => recurrent.areWithinBlockDuplicatedValues(candidateRepetitions, candidate, "row", row + 1));
      if (wasDuplicated) {
        validPuzzle = false;
        return validPuzzle;
      }
    }
  };
  return validPuzzle;
};

const validPuzzleColumn = (validPuzzle) => {
  if (validPuzzle) {
    for (let column = 0; column <=8; column++) {
      const { howmanycellswiththisnote, howmanynotesinthiscell, answersCurrentBlock, whereisthisnote } = discardingFunctions.gettingDetailedInfo ( 0, 8, column, column, "column" );
      let wasDuplicated = answersCurrentBlock.some((candidateRepetitions, candidate) => recurrent.areWithinBlockDuplicatedValues(candidateRepetitions, candidate, "column", column + 1));
      if (wasDuplicated) {
        validPuzzle = false;
        return validPuzzle;
      };
    };
  };
  return validPuzzle;
};

const validPuzzleSquare = (validPuzzle) => {
  if (validPuzzle) {
    for (let square = 1; square <=9; square++) {
      const {fromrow, maximumrow, fromcolumn, maximumcolumn} = recurrent.defineSquareCoordinatesSQ(square);
      const { howmanycellswiththisnote, howmanynotesinthiscell, answersCurrentBlock, whereisthisnote } = discardingFunctions.gettingDetailedInfo ( fromrow, maximumrow, fromcolumn, maximumcolumn, "square", square );
      let wasDuplicated = answersCurrentBlock.some((candidateRepetitions, candidate) => recurrent.areWithinBlockDuplicatedValues(candidateRepetitions, candidate, "square", square));
      if (wasDuplicated) {
        validPuzzle = false;
        return validPuzzle;
      };
    };
  };
  return validPuzzle;
};

export { validPuzzleRow, validPuzzleColumn, validPuzzleSquare }