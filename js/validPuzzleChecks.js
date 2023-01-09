'use strict';
import globalVar from "./globalVar.js";
import * as recurrent from "./recurrentFunctions.js";
import * as gettingInfo from "./gettingInfoBlock.js";
import * as coordinates from "./defineCoordinates.js";
import { solvingProcess } from "./solvingProcess.js";

////////////////////////////////////////////////////////////////////////////////
//                            VALID PUZZLE CHECKS                            //
//////////////////////////////////////////////////////////////////////////////

//Are there duplicated digits within a Row
const validPuzzleRow = (validPuzzle) => {
  for (let row = 0; row <=8; row++) {
    const { answersCurrentBlock } = gettingInfo.gettingDetailedInfoBlock ( row, row, 0, 8, "row" );
    let itemRow = row + 1;
    let wasDuplicated = answersCurrentBlock.some((candidateRepetitions, candidate) => areWithinBlockDuplicatedValues(candidateRepetitions, candidate, "row", itemRow));
    if (wasDuplicated) {
      validPuzzle = false;
      return validPuzzle;
    };
  };
  return validPuzzle;
};

//Are there duplicated digits within a Column
const validPuzzleColumn = (validPuzzle) => {
  for (let column = 0; column <=8; column++) {
    const { answersCurrentBlock } = gettingInfo.gettingDetailedInfoBlock ( 0, 8, column, column, "column" );
    let itemColumn = column + 1;
    let wasDuplicated = answersCurrentBlock.some((candidateRepetitions, candidate) => areWithinBlockDuplicatedValues(candidateRepetitions, candidate, "column", itemColumn));
    if (wasDuplicated) {
      validPuzzle = false;
      return validPuzzle;
    };
  };
  return validPuzzle;
};

//Are there duplicated digits within a Square
const validPuzzleSquare = (validPuzzle) => {
    for (let square = 1; square <=9; square++) {
      const {fromrow, maximumrow, fromcolumn, maximumcolumn} = coordinates.defineInitialMaxRCFromSquare(square);
      const { answersCurrentBlock } = gettingInfo.gettingDetailedInfoBlock ( fromrow, maximumrow, fromcolumn, maximumcolumn, "square", square );
      let wasDuplicated = answersCurrentBlock.some((candidateRepetitions, candidate) => areWithinBlockDuplicatedValues(candidateRepetitions, candidate, "square", square));
      if (wasDuplicated) {
        validPuzzle = false;
        return validPuzzle;
      };
    };
  return validPuzzle;
};

//Check if there are enough kind of digits for unique solution (At least 8 or 9 of the possible options)
const enoughDiversityDigits = (validPuzzle, quantityPerValue) => {
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
    validPuzzle = false; 
    recurrent.showSweetAlert("error", "Oops...", `This is Not a Valid Puzzle, it will have multiple solutions, since to have an unique solution, it needs to have at least 8 of the 9 posssibilities present . The Digits missing are ${valuesMissing}`);
    // alert(`This is Not a Valid Puzzle, it will have multiple solutions, since to have an unique solution, it needs to have at least 8 of the 9 posssibilities present . The Digits missing are ${valuesMissing}`);
  };
return validPuzzle;
};

const validPuzzleSolvingIt = (validPuzzle) => {
  globalVar.stepByStep = true;
  globalVar.failure = false;
  let tempCellsResolved = globalVar.cellsResolved;
  let tempCurrentStep = globalVar.currentStep;
  while (globalVar.cellsResolved <81 && globalVar.failure === false ) {
    solvingProcess();
    //Check if the Solving process has made any cell empty of candidates, in which case the puzzle is not valid, this applies if the step is not in the middle of a nishio guessing.
    if (globalVar.nishioGuessingActive.evaluating === false) {    
      for (let row = 0; row <= 8; row++) {
        for (let column = 0; column <= 8; column++) {
          globalVar.loopsExecuted++;
          let currentCellValue = globalVar.theMatrix[globalVar.currentStep][row][column][0];
          //method reduce to obtain the sum of the candidates in this cell
          const sum = globalVar.theMatrix[globalVar.currentStep][row][column].reduce((acc, a) => acc + a, 0);
          if (currentCellValue === 0 && sum-currentCellValue === 0) {
            //cell invalid, the cell has no certain value yet and it does not have any more candidates
            globalVar.failure = true;
            console.log(`We have taken a sneak peek of your puzzle, and unfortunately Cell R${row + 1}C${column + 1} has been left with no candidates and no Certain values in Step ${globalVar.currentStep}. The puzzle is not valid`)
            validPuzzle = false;
            recurrent.showSweetAlert("error", "Oops...", `We have taken a sneak peek of your puzzle, and unfortunately Cell R${row + 1}C${column + 1} has been left with no candidates and no Certain values in Step ${globalVar.currentStep} after following several logical resolutions. The puzzle is not valid.`);
            return validPuzzle;
          };
        };
        if (globalVar.failure) break;
      };
    };
    // console.log(globalVar.cellsResolved);
  };
  console.log("--------------------------------------------");
  if (globalVar.failure) {
    console.log(`Failure to solve it`);
  } else {
    console.log(`The calculated difficulty for this puzzle is ${globalVar.difficulty}`);
  };
  globalVar.theMatrixSolved = JSON.parse(JSON.stringify(globalVar.theMatrix[globalVar.currentStep]));
  globalVar.stepByStep = false;
  globalVar.cellsResolved = tempCellsResolved;
  globalVar.currentStep = tempCurrentStep;
  globalVar.nishioGuessingActive = { evaluating: false, previousNishioResult: "notExecuted" };
  return validPuzzle;
};

//             NOT EXPORTED               //

const areWithinBlockDuplicatedValues = (candidateRepetitions, candidate, blockType, blockValue) => {
  if (candidateRepetitions > 1) {
    recurrent.showSweetAlert("error", "Oops...",`There are duplicates values within a Block, Candidate ${candidate} in ${blockType} ${blockValue} is ${candidateRepetitions} times. This is not a valid puzzle, please correct it a try to validate again`);
    // alert(`There are duplicates values within a Block, Candidate ${candidate} in ${blockType} ${blockValue} is ${candidateRepetitions} times. This is not a valid puzzle, please correct it a try to validate again`);
    return candidateRepetitions > 1;
  };
};

export { validPuzzleRow, validPuzzleColumn, validPuzzleSquare, enoughDiversityDigits, validPuzzleSolvingIt };