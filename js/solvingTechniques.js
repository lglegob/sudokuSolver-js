////////////////////////////////////////////////////////////////////////////////
//                             SUDOKU TECHNIQUES                             //
//////////////////////////////////////////////////////////////////////////////

import globalVar from "./globalVar.js"

// Function to detect when a cell has just 1 option (note)
const singleoptions = ( theMatrixStep, stepsingleoptions, areweshowingnotes) => {
  let theMatrixStepsingleoptions;
  let stepsinfoStepsingleoptions;
  for (let row = 0; row <= 8; row++) {
    for (let column = 0; column <= 8; column++) {
      globalVar.loopsExecuted++;
      let currentcellvalue = theMatrixStep[row][column][0];
      //method reduce to obtain the sum of the options in this cell
      const sum = theMatrixStep[row][column].reduce(add, 0);
        function add(accumulator, a) {
          return accumulator + a;
        };
        if (sum-currentcellvalue === 1) {
        //cell solved! iterationsuccess! Detect which value is unique and set it as answer in currentcellvalue
        globalVar.iterationSuccess = true;
        currentcellvalue = theMatrixStep[row][column].findIndex((one, index) => one === 1 && index > 0);
        const {stepCellFound, theMatrixStepCellFound, stepsinfoStepCellFound} = processFunctions.cellvaluefound(stepsingleoptions, theMatrixStep, row, column, currentcellvalue, areweshowingnotes, "Detecting Singles");
        stepsingleoptions = stepCellFound;
        theMatrixStepsingleoptions = JSON.parse(JSON.stringify(theMatrixStepCellFound));
        stepsinfoStepsingleoptions = JSON.parse(JSON.stringify(stepsinfoStepCellFound));
        break;
        };
    };
    if (globalVar.iterationSuccess) break;
  };
  return { theMatrixStepsingleoptions, stepsinfoStepsingleoptions, stepsingleoptions};
};

export { singleoptions };