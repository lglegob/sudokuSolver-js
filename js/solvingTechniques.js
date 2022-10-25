'use strict';
import globalVar from "./globalVar.js"
import * as recurrent from "./recurrentFunctions.js"
import * as solvingFunctions from "./solvingProcessFunctions.js"

////////////////////////////////////////////////////////////////////////////////
//                             SUDOKU TECHNIQUES                             //
//////////////////////////////////////////////////////////////////////////////

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
        currentCellValue = globalVar.theMatrix[globalVar.currentStep][row][column].findIndex((one, index) => one === 1 && index > 0);
        const { theMatrixStepCellFound} = solvingFunctions.cellValueFound(row, column, currentCellValue, "Detecting Singles", "cell", [row + 1, column + 1]);
        globalVar.theMatrix[globalVar.currentStep] = JSON.parse(JSON.stringify(theMatrixStepCellFound));
        globalVar.difficulty += 1;
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
        currentCellValue = possibleCandidate;
        const {theMatrixStepCellFound} = solvingFunctions.cellValueFound(row, columnfound, currentCellValue, "Detecting Hidden Singles (row)", "row", row + 1);
        globalVar.theMatrix[globalVar.currentStep] = JSON.parse(JSON.stringify(theMatrixStepCellFound));
        globalVar.difficulty += 3;
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
        currentCellValue = possibleCandidate;
        const {theMatrixStepCellFound} = solvingFunctions.cellValueFound(rowfound, column, currentCellValue, "Detecting Hidden Singles (column)", "column", column + 1);
        globalVar.theMatrix[globalVar.currentStep] = JSON.parse(JSON.stringify(theMatrixStepCellFound));
        globalVar.difficulty += 3;
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
        currentCellValue = possibleCandidate;
        const {theMatrixStepCellFound} = solvingFunctions.cellValueFound(rowfound, columnfound, currentCellValue, "Detecting Hidden Singles (square)", "square", square);
        globalVar.theMatrix[globalVar.currentStep] = JSON.parse(JSON.stringify(theMatrixStepCellFound));
        globalVar.difficulty += 3;
        break;
      };
    if (globalVar.iterationSuccess) break;
    };
  if (globalVar.iterationSuccess) break;
  };
};

export { singleCandidate, hiddenSinglesRow, hiddenSinglesColumn, hiddenSinglesSquare };