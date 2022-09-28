'use strict';
import globalVar from "./globalVar.js"
import * as recurrent from "./recurrentFunctions.js"
import * as solvingFunctions from "./solvingProcessFunctions.js"

////////////////////////////////////////////////////////////////////////////////
//                             SUDOKU TECHNIQUES                             //
//////////////////////////////////////////////////////////////////////////////

// SOLUTION PHASES
// Check NO repeated numbers per row, column and square

// DONE - Delete notes from rows, columns and squares

// Nested Loops
// DONE Second Step - check cells with just one note
// DONE Third Step - hidden singles - check rows, columns and squares where any number appears just once
// DONE Fourth step - check for obvious pairs per row, column and square
// Fifth Step - check numbers per row and column, that appear only in one of the squares, and delete the possibilities in any other cell in the square
// Sixth Step - hidden pairs - square
// Sixth Step - Obvious Triples (even with doubles)

// Function to detect when a cell has just 1 candidate (note)
const singleCandidate = () => {
  for (let row = 0; row <= 8; row++) {
    for (let column = 0; column <= 8; column++) {
      globalVar.loopsExecuted++;
      let currentCellValue = globalVar.theMatrix[globalVar.currentStep][row][column][0];
      //method reduce to obtain the sum of the candidates in this cell
      const sum = globalVar.theMatrix[globalVar.currentStep][row][column].reduce(add, 0);
        function add(accumulator, a) {
          return accumulator + a;
        };
        if (sum-currentCellValue === 1) {
        //cell solved! iterationsuccess! Detect which value is unique and set it as answer in currentCellValue
        globalVar.iterationSuccess = true;
        currentCellValue = globalVar.theMatrix[globalVar.currentStep][row][column].findIndex((one, index) => one === 1 && index > 0);
        const { theMatrixStepCellFound} = solvingFunctions.cellValueFound(row, column, currentCellValue, "Detecting Singles");
        globalVar.theMatrix[globalVar.currentStep] = JSON.parse(JSON.stringify(theMatrixStepCellFound));
        break;
        };
    };
    if (globalVar.iterationSuccess) break;
  };
};

// Function to detect when a row has a possible value just in one of the 9 cells
const hiddenSinglesRow = () => {
  for (let row = 0; row <= 8; row++) {
    for (let possibleCandidate = 1; possibleCandidate <=9; possibleCandidate++) {
      let ishiddensingle = 0;
      let currentCellValue;
      let columnfound;
      for (let column = 0; column <= 8; column++) {
        globalVar.loopsExecuted++;
        currentCellValue = globalVar.theMatrix[globalVar.currentStep][row][column][0];
        //this if evalutes the cell does not have a solved value yet and that the possiblevalue in evaluation is present in this cell
        if (currentCellValue === 0 && globalVar.theMatrix[globalVar.currentStep][row][column][possibleCandidate] === 1) {
          //This cell has not yet been resolved, it sums the values of each candidate position to find a hidden single
          ishiddensingle++;
          // si ya existen mas de una celda con el possiblevalue, salir del loop y pasar al siguiente possiblevalue
          if (ishiddensingle > 1) break;
          columnfound = column;
        }
      };
      if (ishiddensingle === 1) {
        //cell solved! iterationsuccess! Detect which value is unique and set it as answer in currentCellValue
        globalVar.iterationSuccess = true;
        currentCellValue = possibleCandidate;
        const {theMatrixStepCellFound} = solvingFunctions.cellValueFound(row, columnfound, currentCellValue, "Detecting Hidden Singles (row)");
        globalVar.theMatrix[globalVar.currentStep] = JSON.parse(JSON.stringify(theMatrixStepCellFound));
        break;
      };
    };
    if (globalVar.iterationSuccess) break;
  };
}

// Function to detect when a column has a possible value just in one of the 9 cells
const hiddenSinglesColumn = () => {
  for (let column = 0; column <= 8; column++) {
    for (let possibleCandidate = 1; possibleCandidate <=9; possibleCandidate++) {
      let ishiddensingle = 0;
      let currentCellValue;
      let rowfound;
      for (let row = 0; row <= 8; row++) {
        globalVar.loopsExecuted++;
        currentCellValue = globalVar.theMatrix[globalVar.currentStep][row][column][0];
        //this if evalutes the cell does not have a solved value yet and that the possiblevalue in evaluation is present in this cell
        if (currentCellValue === 0 && globalVar.theMatrix[globalVar.currentStep][row][column][possibleCandidate] === 1) {
          //This cell has not yet been resolved, it sums the values of each candidate position to find a hidden single
          ishiddensingle++;
          // si ya existen mas de una celda con el possiblevalue, salir del loop y pasar al siguiente possiblevalue
          if (ishiddensingle > 1) break;
          rowfound = row;
        }
      };
      if (ishiddensingle === 1) {
        //cell solved! iterationsuccess! Detect which value is unique and set it as answer in currentCellValue
        globalVar.iterationSuccess = true;
        currentCellValue = possibleCandidate;
        const {theMatrixStepCellFound} = solvingFunctions.cellValueFound(rowfound, column, currentCellValue, "Detecting Hidden Singles (column)");
        globalVar.theMatrix[globalVar.currentStep] = JSON.parse(JSON.stringify(theMatrixStepCellFound));
        break;
      };
    };
    if (globalVar.iterationSuccess) break;
  };
}

// Function to detect when an square has a possible value just in one of the 9 cells
const hiddenSinglesSquare = () => {
  for (let square = 1; square <= 9; square++) {
    const { fromrow, maximumrow, fromcolumn, maximumcolumn } = recurrent.defineSquareCoordinatesSQ(square);
    for (let possibleCandidate = 1; possibleCandidate <=9; possibleCandidate++) {
      let ishiddensingle = 0;
      let currentCellValue;
      let rowfound;
      let columnfound;
      for (let square_row = fromrow; square_row <= maximumrow; square_row++) {
        for (let square_column = fromcolumn; square_column <= maximumcolumn; square_column++) {
          globalVar.loopsExecuted++;
          currentCellValue = globalVar.theMatrix[globalVar.currentStep][square_row][square_column][0];
          //this if evalutes the cell does not have a solved value yet and that the possiblevalue in evaluation is present in this cell
          if (currentCellValue === 0 && globalVar.theMatrix[globalVar.currentStep][square_row][square_column][possibleCandidate] === 1) {
            //This cell has not yet been resolved, it sums the values of each candidate position to find a hidden single
            ishiddensingle++;
            // si ya existen mas de una celda con el possiblevalue, salir del loop y pasar al siguiente possiblevalue
            if (ishiddensingle > 1) break;
            rowfound = square_row;
            columnfound = square_column;
          }
        };
        if (ishiddensingle > 1) break;
      };
      if (ishiddensingle === 1) {
        //cell solved! iterationsuccess! Detect which value is unique and set it as answer in currentCellValue
        globalVar.iterationSuccess = true;
        currentCellValue = possibleCandidate;
        const {theMatrixStepCellFound} = solvingFunctions.cellValueFound(rowfound, columnfound, currentCellValue, "Detecting Hidden Singles (square)");
        globalVar.theMatrix[globalVar.currentStep] = JSON.parse(JSON.stringify(theMatrixStepCellFound));
        break;
      };
    if (globalVar.iterationSuccess) break;
    };
  if (globalVar.iterationSuccess) break; //so, it just find one solution per loop
  };
};

export { singleCandidate, hiddenSinglesRow, hiddenSinglesColumn, hiddenSinglesSquare };