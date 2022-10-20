'use strict';
import * as recurrent from "./recurrentFunctions.js";
import * as gettingInfo from "./gettingInfoBlock.js";

////////////////////////////////////////////////////////////////////////////////
//                            VALID PUZZLE CHECKS                            //
//////////////////////////////////////////////////////////////////////////////

//Are there duplicated digits within a Row
const validPuzzleRow = (validPuzzle) => {
  if (validPuzzle) {
    for (let row = 0; row <=8; row++) {
      const { answersCurrentBlock } = gettingInfo.gettingDetailedInfoBlock ( row, row, 0, 8, "row" );
      let itemRow = row + 1;
      let wasDuplicated = answersCurrentBlock.some((candidateRepetitions, candidate) => areWithinBlockDuplicatedValues(candidateRepetitions, candidate, "row", itemRow));
      if (wasDuplicated) {
        validPuzzle = false;
        return validPuzzle;
      }
    }
  };
  return validPuzzle;
};

//Are there duplicated digits within a Column
const validPuzzleColumn = (validPuzzle) => {
  if (validPuzzle) {
    for (let column = 0; column <=8; column++) {
      const { answersCurrentBlock } = gettingInfo.gettingDetailedInfoBlock ( 0, 8, column, column, "column" );
      let itemColumn = column + 1;
      let wasDuplicated = answersCurrentBlock.some((candidateRepetitions, candidate) => areWithinBlockDuplicatedValues(candidateRepetitions, candidate, "column", itemColumn));
      if (wasDuplicated) {
        validPuzzle = false;
        return validPuzzle;
      };
    };
  };
  return validPuzzle;
};

//Are there duplicated digits within a Square
const validPuzzleSquare = (validPuzzle) => {
  if (validPuzzle) {
    for (let square = 1; square <=9; square++) {
      const {fromrow, maximumrow, fromcolumn, maximumcolumn} = recurrent.defineSquareCoordinatesSQ(square);
      const { answersCurrentBlock } = gettingInfo.gettingDetailedInfoBlock ( fromrow, maximumrow, fromcolumn, maximumcolumn, "square", square );
      let wasDuplicated = answersCurrentBlock.some((candidateRepetitions, candidate) => areWithinBlockDuplicatedValues(candidateRepetitions, candidate, "square", square));
      if (wasDuplicated) {
        validPuzzle = false;
        return validPuzzle;
      };
    };
  };
  return validPuzzle;
};

const areWithinBlockDuplicatedValues = (candidateRepetitions, candidate, blockType, blockValue) => {
  if (candidateRepetitions > 1) {
    alert(`There are duplicates values within a Block, Candidate ${candidate} in ${blockType} ${blockValue} is ${candidateRepetitions} times. This is not a valid puzzle, please correct it a try to validate again`);
    return candidateRepetitions > 1;
  }
}

//Check if there are enough kind of digits for unique solution (At least 8 or 9 of the possible options)
const enoughDiversityDigits = (validPuzzle, quantityPerValue) => {
  if (validPuzzle) {
    let howManyZeros = quantityPerValue.filter(e => e === 0);
    if (howManyZeros.length >=3 ) { //Not counting the index 0, if equal or greater than 2, there are not enough candidate types
      console.log("Not Valid Puzzle, it needs to have at least 8 of the 9 posssibilities present to have an unique solution");
      let valuesMissing = [];
      quantityPerValue.shift();
      quantityPerValue.forEach((element, index) => {
        if (element === 0) {
          valuesMissing.push(index + 1);
        }
      });    

      alert(`This is Not a Valid Puzzle, it will have multiple solutions, since to have an unique solution, it needs to have at least 8 of the 9 posssibilities present . The Digits missing are ${valuesMissing}`);
      validPuzzle = false;
    };
  };
  return validPuzzle;
};

export { validPuzzleRow, validPuzzleColumn, validPuzzleSquare, enoughDiversityDigits }