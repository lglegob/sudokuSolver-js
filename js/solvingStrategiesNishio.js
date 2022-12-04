'use strict';
import globalVar from "./globalVar.js";
import * as gettingInfo from "./gettingInfoBlock.js";
import * as solvingFunctions from "./solvingProcessFunctions.js";
import * as eventListeners from "./eventListeners.js";
import * as coordinates from "./defineCoordinates.js";

////////////////////////////////////////////////////////////////////////////////
//                     GUESSING TECHNIQUES - BOWMAN                          //
//////////////////////////////////////////////////////////////////////////////

const nishioGuessing = () => {
  
  for (let row = 0; row <= 8; row++) {
    //This series of ifs statements prevents the process to take the same nishio guess as previous failed attempt
    //Shortcut to jump directly to the corresponding row, there are no changes if last nishio was nishioDeadEnd
    // globalVar.nishioGuessingActive.previousNishioResult === "nishioDeadEnd" ? row = globalVar.nishioGuessingActive.currentCell.row : false;
    const { howmanynotesinthiscell } = gettingInfo.gettingDetailedInfoBlock( row, row, 0, 8, "row");
    for (let column = 0; column <= 8; column++) {
    //This series of ifs statements prevents the process to take the same nishio guess as previous failed attempt
    //If I make the same shortcut with column, create an infinite loop
    // globalVar.nishioGuessingActive.previousNishioResult === "nishioDeadEnd" ? column = globalVar.nishioGuessingActive.currentCell.column : false;
      globalVar.loopsExecuted++;
      if (howmanynotesinthiscell[column] === 2) {
        let currentCandidateValue1 = globalVar.theMatrix[globalVar.currentStep][row][column].indexOf(1);
        let currentCandidateValue2 = globalVar.theMatrix[globalVar.currentStep][row][column].indexOf(1, currentCandidateValue1 + 1);
        //This series of ifs statements prevents the process to take the same nishio guess as previous failed attempt
        //This first case is when no nishio guess has been made, or previous guess resulted in a value discarded, so this is not related
        if (globalVar.nishioGuessingActive.previousNishioResult !== "nishioDeadEnd") {
          globalVar.nishioGuessingActive.evaluating = true;
          globalVar.nishioGuessingActive.step = globalVar.currentStep;
          globalVar.nishioGuessingActive.currentCell = { row: row, column: column };
          globalVar.nishioGuessingActive.currentValue = currentCandidateValue1;
          globalVar.nishioGuessingActive.currentDiscardedCandidate = currentCandidateValue2;
          let currentCellValue = currentCandidateValue1;
          const { theMatrixStepCellFound } = solvingFunctions.cellValueFound(row, column, currentCellValue, "Nishio Guessing", "cell", [row + 1, column + 1]);
          globalVar.theMatrix[globalVar.currentStep] = JSON.parse(JSON.stringify(theMatrixStepCellFound));
          globalVar.difficulty += 200;
          break;
        } else { // globalVar.nishioGuessingActive.previousNishioResult = "nishioDeadEnd"
          const { relativeCell:relativeCellCurrentCell } = coordinates.defineRelativeCellFromRC(row, column);
          const { relativeCell:relativeCellPreviousGuess } = coordinates.defineRelativeCellFromRC(globalVar.nishioGuessingActive.currentCell.row, globalVar.nishioGuessingActive.currentCell.column);
          if (relativeCellCurrentCell >= relativeCellPreviousGuess) {
            globalVar.nishioGuessingActive.evaluating = true;
            globalVar.nishioGuessingActive.step = globalVar.currentStep;
            globalVar.nishioGuessingActive.currentCell = { row: row, column: column };
            if (relativeCellCurrentCell > relativeCellPreviousGuess) {
              globalVar.nishioGuessingActive.currentValue = currentCandidateValue1;
              globalVar.nishioGuessingActive.currentDiscardedCandidate = currentCandidateValue2;
              let currentCellValue = currentCandidateValue1;
              const { theMatrixStepCellFound } = solvingFunctions.cellValueFound(row, column, currentCellValue, "Nishio Guessing", "cell", [row + 1, column + 1]);
              globalVar.theMatrix[globalVar.currentStep] = JSON.parse(JSON.stringify(theMatrixStepCellFound));
              globalVar.difficulty += 200;
              break;
            } else if (relativeCellCurrentCell === relativeCellPreviousGuess && currentCandidateValue1 === globalVar.nishioGuessingActive.currentValue) {
              // This if adds the comparison between currentCandidateValue1 and tye previous value taken as guess (globalVar.nishioGuessingActive.currentValue), so
              // In case they are equal, it can take the second candidate as guess, if not, it should go to look for the next cell with two candidates.
              globalVar.nishioGuessingActive.currentValue = currentCandidateValue2;
              globalVar.nishioGuessingActive.currentDiscardedCandidate = currentCandidateValue1;
              let currentCellValue = currentCandidateValue2;
              const { theMatrixStepCellFound } = solvingFunctions.cellValueFound(row, column, currentCellValue, "Nishio Guessing", "cell", [row + 1, column + 1]);
              globalVar.theMatrix[globalVar.currentStep] = JSON.parse(JSON.stringify(theMatrixStepCellFound));
              globalVar.difficulty += 200;
              break;
            };
          };
        };
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
        if (globalVar.iterationSuccess === false && globalVar.discardNoteSuccess === false) {
          const { theMatrixStep } = solvingFunctions.nishioGuessInvalid(row, column, "Nishio Discarding");
          globalVar.theMatrix[globalVar.currentStep] = JSON.parse(JSON.stringify(theMatrixStep));
        } else {
          //This option will be selected only when the function is being executed at the end of the solvingProcess to modify teh current step when a cell was left empty, but leaves the next step, at the start of the solving process to be true and call nishioGuessInvalid
          let newWarningP = document.createElement("p");
          newWarningP.innerHTML = `<strong>Ooops!!! Be aware!!</strong> this step has created a cell 
          <strong><span data-cellcoordinates=".row${row + 1}.column${column + 1}">R${row + 1}C${column + 1}</span></strong> 
          with no Certain value and no candidates, review your Nishio Guess from step ${globalVar.nishioGuessingActive.step + 1}.
          `;
          const latestArticle = document.querySelector(".stepsDetails > div article:first-child");
          latestArticle.append(newWarningP);
          //creating the Event Listeners to the recently created RC spans
          const spanRowColumnCoordinates = document.querySelectorAll(`#Step${globalVar.currentStep} span`);
          spanRowColumnCoordinates.forEach(spanCoordinates => {eventListeners.spanRowColumnCoordinatesListener(spanCoordinates)});
        };
        break;
      };
    };
    if (globalVar.nishioGuessingActive.evaluating === false) break;
  };
};

const previousNishioUnderEvaluation = () => {
  //If the process got here, it means that there is already a Nishio guess under evaluation, and the solving process has failed and trying to do a nested guess. This function will leave the things as they were in the original Nishio guess, and try a second option.
  const { theMatrixStep } = solvingFunctions.nishioGuessDeadEnd("Nishio Dead End");
  globalVar.theMatrix[globalVar.currentStep] = JSON.parse(JSON.stringify(theMatrixStep));
  //discardNoteSuccess set to true temporarily to avoid the execution of the final failure solving cycle for this step
  globalVar.discardNoteSuccess = true;
};

export { nishioGuessing, nishioChecking, previousNishioUnderEvaluation };
