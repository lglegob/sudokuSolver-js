'use strict';
import globalVar from "./globalVar.js";
import * as gettingInfo from "./gettingInfoBlock.js";
import * as solvingFunctions from "./solvingProcessFunctions.js";

////////////////////////////////////////////////////////////////////////////////
//                     GUESSING TECHNIQUES - BOWMAN                          //
//////////////////////////////////////////////////////////////////////////////

const nishioGuessing = () => {
  
  for (let row = 0; row <= 8; row++) {
    const { howmanynotesinthiscell } = gettingInfo.gettingDetailedInfoBlock( row, row, 0, 8, "row");
    for (let column = 0; column <= 8; column++) {
      globalVar.loopsExecuted++;
      if (howmanynotesinthiscell[column] === 2) {
        let currentCandidateValue1 = globalVar.theMatrix[globalVar.currentStep][row][column].indexOf(1);
        let currentCandidateValue2 = globalVar.theMatrix[globalVar.currentStep][row][column].indexOf(1, currentCandidateValue1 + 1);
        globalVar.nishioGuessingActive.evaluating = true;
        globalVar.nishioGuessingActive.step = globalVar.currentStep;
        globalVar.nishioGuessingActive.currentCell = { row: row, column: column };
        globalVar.nishioGuessingActive.currentValue = currentCandidateValue1;
        globalVar.nishioGuessingActive.currentDiscardedCandidate = currentCandidateValue2;
        globalVar.nishioGuessingActive.cellsResolved = globalVar.cellsResolved;
        let currentCellValue = currentCandidateValue1;
        const { theMatrixStepCellFound } = solvingFunctions.cellValueFound(row, column, currentCellValue, "Nishio Guessing", "cell", [row + 1, column + 1]);
        globalVar.theMatrix[globalVar.currentStep] = JSON.parse(JSON.stringify(theMatrixStepCellFound));
        globalVar.difficulty += 200;
        break;
      };
    };
    if (globalVar.iterationSuccess) break;
  };

};

const nishioChecking = () => {
  //Check if the Solving process has made any cell empty of candidates, in which case the puzzle is not valid, and needs to return to another guessing
  for (let row = 0; row <= 8; row++) {
    for (let column = 0; column <= 8; column++) {
      globalVar.loopsExecuted++;
      let currentCellValue = globalVar.theMatrix[globalVar.currentStep][row][column][0];
      //method reduce to obtain the sum of the candidates in this cell
      const sum = globalVar.theMatrix[globalVar.currentStep][row][column].reduce(add, 0);
      function add(accumulator, a) {
        return accumulator + a;
      };
      if (currentCellValue === 0 && sum-currentCellValue === 0) {
        //cell invalid, the cell has no certain value yet and it does not have any more candidates, we need to go back to the guess and mark the guessing as invalid.
        // globalVar.failure = true;
        const { theMatrixStep } = solvingFunctions.nishioGuessInvalid(row, column, "Nishio Discarding");
          globalVar.theMatrix[globalVar.currentStep] = JSON.parse(JSON.stringify(theMatrixStep));
        break;
      };
    };
    //If False, it means, it has already passed the nishioGuessInvalid process and no more cells need to be verified
    if (globalVar.nishioGuessingActive.evaluating === false) break;
  };
};

export { nishioGuessing, nishioChecking };
