'use strict';
import globalVar from "./globalVar.js";
import * as notesZero from "./notesZero.js";
import * as modifyDOM from "./modifyingDOMFunctions.js";
import * as recurrent from "./recurrentFunctions.js";
import * as coordinates from "./defineCoordinates.js";

////////////////////////////////////////////////////////////////////////////////
//                      SOLVING PROCESSES FUNCTIONS                          //
//////////////////////////////////////////////////////////////////////////////

//function called each time a new value is found by any method
const cellValueFound = (row, column, currentCellValue, method, mainBlock, mainBlockValue) => {
  globalVar.cellsResolved++;
  globalVar.currentStep++;
  globalVar.iterationSuccess = true;
  globalVar.stepsDetail[globalVar.currentStep] = [true, method, [row, column, currentCellValue]];
  let theMatrixStepCellFound = JSON.parse(JSON.stringify(globalVar.theMatrix[globalVar.currentStep - 1])); //The point where a new step is created in theMatrix, so previous state is saved in step-1. It has to be used these JSON methods to avoid the copy by reference but by value
  document.querySelector("#button-reload").disabled = false; //applies only to step 1, but the if is unnecesary
  document.querySelector("#button-reload").classList.add("active");
  document.querySelector("#button-reload").classList.remove("inactive");
  // here the currentCellValue is set in theMatrix variable, and the corresponding notes in the cells of the same row, column and squatre deleted
  theMatrixStepCellFound[row][column] = [currentCellValue, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  let theMatrixStep = notesZero.noteZeroRow(row, currentCellValue, theMatrixStepCellFound);
  theMatrixStep = notesZero.noteZeroColumn(column, currentCellValue, theMatrixStep);
  theMatrixStep = notesZero.noteZeroSquareRC(row, column, currentCellValue, theMatrixStep);
  theMatrixStepCellFound = JSON.parse(JSON.stringify(theMatrixStep));
  // here the foundvalue is set in the html document to be shown, by calling the function newFoundValueHTML
  let itemRow = row + 1;
  let itemColumn = column + 1;
  globalVar.stepByStep ? true : modifyDOM.newFoundValueHTML(itemRow, itemColumn, currentCellValue, theMatrixStepCellFound, method, mainBlock, mainBlockValue);
  return { theMatrixStepCellFound};
};

//Consolidated function for the 3 Blocks (row, column and square) and two discarding strategies (Pairs and Triples)
//This Function is called by OBVIOUSPAIRS and OBVIOUSTRIPLES
const discardObviousSet = (mainaxisvalue, mainaxis, secondaryaxis, cellsIdentified, currentCandidates, method, whereisthisnote, callbackNoteZero, callbackModifyDOM ) => {
  globalVar.currentStep++;
  globalVar.stepsDetail[globalVar.currentStep] = [false, method, []];
  globalVar.theMatrix[globalVar.currentStep] = JSON.parse(JSON.stringify(globalVar.theMatrix[globalVar.currentStep - 1])); //The point where a new step is created in theMatrix, so previous state is saved in step-1. It has to be used these JSON methods to avoid the copy by reference but by value
  //Here we take advantage of the functions to delete the notes of found values, a callback function is used depending of the block (row, column or square), currently on evaluation
  let theMatrixStep = globalVar.theMatrix[globalVar.currentStep];
  //This for loop is created, so the same function can work with pairs, triples and quadruples, by detecting how many candidates have been received.
  for (let candidate = 1; candidate <= Object.keys(currentCandidates).length; candidate++) {
    theMatrixStep = callbackNoteZero(mainaxisvalue, eval(`currentCandidates.candidate${candidate}`), theMatrixStep);
  };
  globalVar.theMatrix[globalVar.currentStep] = JSON.parse(JSON.stringify(theMatrixStep));

  //But here, it is restablished as notes for the triple of cells, executing a double for for the cells and for the candidates.
  //Within the for, the .lenght are used to define if it is an obvious pair or obvious triple, it will depend of which discarding method was the one that called this function
  for (let cellIdentified = 1; cellIdentified <= Object.keys(cellsIdentified).length; cellIdentified++) {
    for (let currentCandidate = 1; currentCandidate <= Object.keys(currentCandidates).length; currentCandidate++) {
      //secondaryaxis is to define which is the axis that defines the order in whereisthisnote
      whereisthisnote[eval(`currentCandidates.candidate${currentCandidate}`)][eval(`cellsIdentified.cell${cellIdentified}.${secondaryaxis}`)] === 1 ? globalVar.theMatrix[globalVar.currentStep][eval(`cellsIdentified.cell${cellIdentified}.row`)][eval(`cellsIdentified.cell${cellIdentified}.column`)][eval(`currentCandidates.candidate${currentCandidate}`)] = 1 : false;
    };
  };

  if(globalVar.areHighlightsOn === true) { 
    //these couple of fors reset the noteKept and justDeleteNote classes for the cells identified for the current discarding strategy
    for (let cellIdentified = 1; cellIdentified <= Object.keys(cellsIdentified).length; cellIdentified++) {
      for (let currentCandidate = 1; currentCandidate <= Object.keys(currentCandidates).length; currentCandidate++) {
        //secondaryaxis is to define which is the axis that defines the order in whereisthisnote
        whereisthisnote[eval(`currentCandidates.candidate${currentCandidate}`)][eval(`cellsIdentified.cell${cellIdentified}.${secondaryaxis}`)] === 1 ? document.querySelector(".theMatrixNotes " + ".row" + (eval(`cellsIdentified.cell${cellIdentified}.row`) + 1) + ".column" + (eval(`cellsIdentified.cell${cellIdentified}.column`) + 1) + " .note" + eval(`currentCandidates.candidate${currentCandidate}`)).classList.remove("justDeletedNote") : false;
        whereisthisnote[eval(`currentCandidates.candidate${currentCandidate}`)][eval(`cellsIdentified.cell${cellIdentified}.${secondaryaxis}`)] === 1 ? document.querySelector(".theMatrixNotes " + ".row" + (eval(`cellsIdentified.cell${cellIdentified}.row`) + 1) + ".column" + (eval(`cellsIdentified.cell${cellIdentified}.column`) + 1) + " .note" + eval(`currentCandidates.candidate${currentCandidate}`)).classList.add("noteKept") : false;
      };
    };
  };
  globalVar.areNotesShowing = false;  //toggleNotes lo dejara en True
  globalVar.stepByStep ? true : recurrent.reviewNotes(globalVar.theMatrix[globalVar.currentStep]);
  globalVar.stepByStep ? true : recurrent.toggleNotes();
  globalVar.discardNoteSuccess = true;
  method.includes("Pair") ? globalVar.difficulty += 8 : false;
  method.includes("Triple") ? globalVar.difficulty += 12 : false;
  globalVar.stepByStep ? true : callbackModifyDOM(mainaxisvalue, mainaxis, cellsIdentified, currentCandidates, method);
};

//Consolidated function for the 3 Blocks (row, column and square), when a pair of values must be kept and discard all others in one cell
//This Function is called by HIDDENPAIRS and HIDDENTRIPLES Techniques
const discardHiddenSet = (mainaxisvalue, mainaxis, secondaryaxis, cellsIdentified, currentCandidates, method, callbackNoteZero, callbackModifyDOM) => {
  globalVar.currentStep++;
  globalVar.stepsDetail[globalVar.currentStep] = [false, method, []];
  globalVar.theMatrix[globalVar.currentStep] = JSON.parse(JSON.stringify(globalVar.theMatrix[globalVar.currentStep - 1])); //The point where a new step is created in theMatrix, so previous state is saved in step-1. It has to be used these JSON methods to avoid the copy by reference but by value
  //Here we take advantage of the functions to delete the notes of found values, a callback function is used depending of the block (row, column or square), currently on evaluation
  let theMatrixStep = globalVar.theMatrix[globalVar.currentStep];
  for (let cellIdentified = 1; cellIdentified <= Object.keys(cellsIdentified).length; cellIdentified++) {
    theMatrixStep = callbackNoteZero(eval(`cellsIdentified.cell${cellIdentified}.row`), eval(`cellsIdentified.cell${cellIdentified}.column`), currentCandidates, theMatrixStep);
  }; 
  globalVar.theMatrix[globalVar.currentStep] = JSON.parse(JSON.stringify(theMatrixStep));
  
  globalVar.areNotesShowing = false;  //toggleNotes lo dejara en True
  globalVar.stepByStep ? true : recurrent.reviewNotes(globalVar.theMatrix[globalVar.currentStep]);
  globalVar.stepByStep ? true : recurrent.toggleNotes();
  globalVar.discardNoteSuccess = true;
  method.includes("Pair") ? globalVar.difficulty += 20 : false;
  method.includes("Triple") ? globalVar.difficulty += 28 : false;
  globalVar.stepByStep ? true : callbackModifyDOM(mainaxisvalue, mainaxis, cellsIdentified, currentCandidates, method);
};

//Consolidated function for the 3 Blocks (row, column and square), when one value can be discarded
//This Function is called by LOCKEDCANDIDATE Techniques
const discardLockedCandidate = (mainaxisvalue, mainaxis, secondaryaxisvalue, secondaryaxis, value, method, callbackNoteZero) => {
  let fromRowD;
  let maximumRowD;
  let fromColumnD;
  let maximumColumnD;
  //Section to copy the cells of the corresponding secondary Axis

  switch (true) {
    case (mainaxis === "square"):
      const { fromrow:fromRowS, maximumrow:maximumRowS, fromcolumn:fromColumnS, maximumcolumn:maximumColumnS } = coordinates.defineInitialMaxRCFromSquare(mainaxisvalue);
      fromRowD = fromRowS;
      fromColumnD = fromColumnS;
      maximumRowD = maximumRowS;
      maximumColumnD = maximumColumnS;

      switch (true) {
        case (secondaryaxis === "row"):
          fromRowD = secondaryaxisvalue;
          maximumRowD = secondaryaxisvalue;
        break;
        case (secondaryaxis === "column"):
          fromColumnD = secondaryaxisvalue;
          maximumColumnD = secondaryaxisvalue;
        break;
      };
    break;

    case (mainaxis === "row"):
      const { fromcolumn:fromcolumnR, maximumcolumn:maximumcolumnR } = coordinates.defineInitialMaxRCFromSquare(secondaryaxisvalue);
      fromRowD = mainaxisvalue;
      fromColumnD = fromcolumnR;
      maximumRowD = mainaxisvalue;
      maximumColumnD = maximumcolumnR;
    break;

    case (mainaxis === "column"):
      const { fromrow:fromrowC, maximumrow:maximumrowC } = coordinates.defineInitialMaxRCFromSquare(secondaryaxisvalue);
      fromRowD = fromrowC;
      fromColumnD = mainaxisvalue;
      maximumRowD = maximumrowC;
      maximumColumnD = mainaxisvalue;
    break;
  };

  //This process saves in a temporal variable (the3Cells), the 3 intersecting values where the candidates must not change, to recover them after the notesZero process
  let the3Cells = [];
  for (let the3CellsRow = fromRowD; the3CellsRow <= maximumRowD; the3CellsRow++) { 
    for (let the3CellsColumn = fromColumnD; the3CellsColumn <= maximumColumnD; the3CellsColumn++) {
      globalVar.loopsExecuted++;
      the3Cells.push(globalVar.theMatrix[globalVar.currentStep][the3CellsRow][the3CellsColumn]); 

    };
  };

  globalVar.currentStep++;
  globalVar.stepsDetail[globalVar.currentStep] = [false, method, []];
  globalVar.theMatrix[globalVar.currentStep] = JSON.parse(JSON.stringify(globalVar.theMatrix[globalVar.currentStep - 1])); //The point where a new step is created in theMatrix, so previous state is saved in step-1. It has to be used these JSON methods to avoid the copy by reference but by value
  //Here we take advantage of the functions to delete the notes of found values, a callback function is used depending of the block (row, column or square), currently on evaluation
  let theMatrixStep = callbackNoteZero(mainaxisvalue, value, globalVar.theMatrix[globalVar.currentStep]);
  globalVar.theMatrix[globalVar.currentStep] = JSON.parse(JSON.stringify(theMatrixStep));
  //But here, it is restablished as notes for the 3 cells based on the temporal variable the3Cells
  for (let the3CellsRow = fromRowD; the3CellsRow <= maximumRowD; the3CellsRow++) { 
    for (let the3CellsColumn = fromColumnD; the3CellsColumn <= maximumColumnD; the3CellsColumn++) {
      globalVar.loopsExecuted++;
      globalVar.theMatrix[globalVar.currentStep][the3CellsRow][the3CellsColumn] = the3Cells.shift();
      if (globalVar.theMatrix[globalVar.currentStep][the3CellsRow][the3CellsColumn][value] !== 0 && globalVar.theMatrix[globalVar.currentStep][the3CellsRow][the3CellsColumn][0] === 0) {
        if(globalVar.areHighlightsOn === true) {
          document.querySelector(".theMatrixNotes " + ".row" + (the3CellsRow + 1) + ".column" + (the3CellsColumn + 1) + " .note" + value).classList.remove("justDeletedNote");
          document.querySelector(".theMatrixNotes " + ".row" + (the3CellsRow + 1) + ".column" + (the3CellsColumn + 1) + " .note" + value).classList.add("noteKept");
        };
      };
    };
  };

  globalVar.areNotesShowing = false;  //toggleNotes lo dejara en True
  globalVar.stepByStep ? true : recurrent.reviewNotes(globalVar.theMatrix[globalVar.currentStep]);
  globalVar.stepByStep ? true : recurrent.toggleNotes();
  globalVar.discardNoteSuccess = true;
  globalVar.difficulty += 40;
  globalVar.stepByStep ? true : modifyDOM.discardLockedCandidateHTML(mainaxisvalue, mainaxis, secondaryaxisvalue, secondaryaxis, value, method);
};

//Consolidated function for the 2 Blocks (row, column), when one value can be discarded in X-Wing Detection technique
//This Function is called by X-WING Techniques
const discardXWing = (mainaxisvalues, mainaxis, secondaryaxisvalues, secondaryaxis, value, method, callbackNoteZero) => {
  globalVar.currentStep++;
  globalVar.stepsDetail[globalVar.currentStep] = [false, method, []];
  globalVar.theMatrix[globalVar.currentStep] = JSON.parse(JSON.stringify(globalVar.theMatrix[globalVar.currentStep - 1])); //The point where a new step is created in theMatrix, so previous state is saved in step-1. It has to be used these JSON methods to avoid the copy by reference but by value

  //This process deletes the candidate from the two mainaxis blocks
  secondaryaxisvalues.forEach((secondaryaxisvalue)  => {
      //Here we take advantage of the functions to delete the notes of found values, a callback function is used depending of the block (row, column or square), currently on evaluation
      let theMatrixStep = callbackNoteZero(secondaryaxisvalue, value, globalVar.theMatrix[globalVar.currentStep]);
      globalVar.theMatrix[globalVar.currentStep] = JSON.parse(JSON.stringify(theMatrixStep));
  });
  //Here we restablished the candidate in the 4 cells
  if (mainaxis === "row") {
    globalVar.theMatrix[globalVar.currentStep][mainaxisvalues[0]][secondaryaxisvalues[0]][value] = 1;
    globalVar.theMatrix[globalVar.currentStep][mainaxisvalues[0]][secondaryaxisvalues[1]][value] = 1;
    globalVar.theMatrix[globalVar.currentStep][mainaxisvalues[1]][secondaryaxisvalues[0]][value] = 1;
    globalVar.theMatrix[globalVar.currentStep][mainaxisvalues[1]][secondaryaxisvalues[1]][value] = 1;
    if(globalVar.areHighlightsOn === true) {
      document.querySelector(".theMatrixNotes " + ".row" + (mainaxisvalues[0] + 1) + ".column" + (secondaryaxisvalues[0] + 1) + " .note" + value).classList.remove("justDeletedNote");
      document.querySelector(".theMatrixNotes " + ".row" + (mainaxisvalues[0] + 1) + ".column" + (secondaryaxisvalues[0] + 1) + " .note" + value).classList.add("noteKept");
      document.querySelector(".theMatrixNotes " + ".row" + (mainaxisvalues[0] + 1) + ".column" + (secondaryaxisvalues[1] + 1) + " .note" + value).classList.remove("justDeletedNote");
      document.querySelector(".theMatrixNotes " + ".row" + (mainaxisvalues[0] + 1) + ".column" + (secondaryaxisvalues[1] + 1) + " .note" + value).classList.add("noteKept");
      document.querySelector(".theMatrixNotes " + ".row" + (mainaxisvalues[1] + 1) + ".column" + (secondaryaxisvalues[0] + 1) + " .note" + value).classList.remove("justDeletedNote");
      document.querySelector(".theMatrixNotes " + ".row" + (mainaxisvalues[1] + 1) + ".column" + (secondaryaxisvalues[0] + 1) + " .note" + value).classList.add("noteKept");
      document.querySelector(".theMatrixNotes " + ".row" + (mainaxisvalues[1] + 1) + ".column" + (secondaryaxisvalues[1] + 1) + " .note" + value).classList.remove("justDeletedNote");
      document.querySelector(".theMatrixNotes " + ".row" + (mainaxisvalues[1] + 1) + ".column" + (secondaryaxisvalues[1] + 1) + " .note" + value).classList.add("noteKept");
    };
  } else { //mainaxis is column
    globalVar.theMatrix[globalVar.currentStep][secondaryaxisvalues[0]][mainaxisvalues[0]][value] = 1;
    globalVar.theMatrix[globalVar.currentStep][secondaryaxisvalues[0]][mainaxisvalues[1]][value] = 1;
    globalVar.theMatrix[globalVar.currentStep][secondaryaxisvalues[1]][mainaxisvalues[0]][value] = 1;
    globalVar.theMatrix[globalVar.currentStep][secondaryaxisvalues[1]][mainaxisvalues[1]][value] = 1;
    if(globalVar.areHighlightsOn === true) {    
      document.querySelector(".theMatrixNotes " + ".row" + (secondaryaxisvalues[0] + 1) + ".column" + (mainaxisvalues[0] + 1) + " .note" + value).classList.remove("justDeletedNote");
      document.querySelector(".theMatrixNotes " + ".row" + (secondaryaxisvalues[0] + 1) + ".column" + (mainaxisvalues[0] + 1) + " .note" + value).classList.add("noteKept");
      document.querySelector(".theMatrixNotes " + ".row" + (secondaryaxisvalues[0] + 1) + ".column" + (mainaxisvalues[1] + 1) + " .note" + value).classList.remove("justDeletedNote");
      document.querySelector(".theMatrixNotes " + ".row" + (secondaryaxisvalues[0] + 1) + ".column" + (mainaxisvalues[1] + 1) + " .note" + value).classList.add("noteKept");
      document.querySelector(".theMatrixNotes " + ".row" + (secondaryaxisvalues[1] + 1) + ".column" + (mainaxisvalues[0] + 1) + " .note" + value).classList.remove("justDeletedNote");
      document.querySelector(".theMatrixNotes " + ".row" + (secondaryaxisvalues[1] + 1) + ".column" + (mainaxisvalues[0] + 1) + " .note" + value).classList.add("noteKept");
      document.querySelector(".theMatrixNotes " + ".row" + (secondaryaxisvalues[1] + 1) + ".column" + (mainaxisvalues[1] + 1) + " .note" + value).classList.remove("justDeletedNote");
      document.querySelector(".theMatrixNotes " + ".row" + (secondaryaxisvalues[1] + 1) + ".column" + (mainaxisvalues[1] + 1) + " .note" + value).classList.add("noteKept");
    };
  };

  globalVar.areNotesShowing = false;  //toggleNotes lo dejara en True
  globalVar.stepByStep ? true : recurrent.reviewNotes(globalVar.theMatrix[globalVar.currentStep]);
  globalVar.stepByStep ? true : recurrent.toggleNotes();
  globalVar.discardNoteSuccess = true;
  globalVar.difficulty += 65;
  globalVar.stepByStep ? true : modifyDOM.discardXWingHTML(mainaxisvalues, mainaxis, secondaryaxisvalues, secondaryaxis, value, method);
};

//Consolidated function for the Y-Wing Combinations, where one value can be discarded in one or several cells
//This Function is called by Y-WING Techniques
const discardYWing = (pivotValues, pincer1Values, pincer1Axis, pincer2Values, pincer2Axis, pincerX, pincerY, pincerZ, method, callbackNoteZero, positiveforZvalue) => {
  globalVar.currentStep++;
  globalVar.stepsDetail[globalVar.currentStep] = [false, method, []];
  globalVar.theMatrix[globalVar.currentStep] = JSON.parse(JSON.stringify(globalVar.theMatrix[globalVar.currentStep - 1])); //The point where a new step is created in theMatrix, so previous state is saved in step-1. It has to be used these JSON methods to avoid the copy by reference but by value

  //This process deletes the candidate from the cells determined
  //Here we take advantage of the functions to delete the notes of found values, a callback function is used in loop for all the cells set as positive for PincerZ
  let theMatrixStep = callbackNoteZero(positiveforZvalue, pincerZ, globalVar.theMatrix[globalVar.currentStep]);
  globalVar.theMatrix[globalVar.currentStep] = JSON.parse(JSON.stringify(theMatrixStep));

  if(globalVar.areHighlightsOn === true) { 
    document.querySelector(".theMatrixNotes " + ".row" + (pivotValues[0] + 1) + ".column" + (pivotValues[1] + 1) + " .note" + pincerX).classList.add("noteKept");
    document.querySelector(".theMatrixNotes " + ".row" + (pivotValues[0] + 1) + ".column" + (pivotValues[1] + 1) + " .note" + pincerY).classList.add("noteKept");
    document.querySelector(".theMatrixNotes " + ".row" + (pincer1Values[0] + 1) + ".column" + (pincer1Values[1] + 1) + " .note" + pincerX).classList.add("noteKept");
    document.querySelector(".theMatrixNotes " + ".row" + (pincer1Values[0] + 1) + ".column" + (pincer1Values[1] + 1) + " .note" + pincerZ).classList.add("noteKept");
    document.querySelector(".theMatrixNotes " + ".row" + (pincer2Values[0] + 1) + ".column" + (pincer2Values[1] + 1) + " .note" + pincerY).classList.add("noteKept");
    document.querySelector(".theMatrixNotes " + ".row" + (pincer2Values[0] + 1) + ".column" + (pincer2Values[1] + 1) + " .note" + pincerZ).classList.add("noteKept");
  };

  globalVar.areNotesShowing = false;  //toggleNotes lo dejara en True
  globalVar.stepByStep ? true : recurrent.reviewNotes(globalVar.theMatrix[globalVar.currentStep]);
  globalVar.stepByStep ? true : recurrent.toggleNotes();
  globalVar.discardNoteSuccess = true;
  globalVar.difficulty += 85;
  globalVar.stepByStep ? true : modifyDOM.discardYWingHTML(pivotValues, pincer1Values, pincer1Axis, pincer2Values, pincer2Axis, pincerX, pincerY, pincerZ, method);
};

export { cellValueFound, discardLockedCandidate, discardXWing, discardHiddenSet, discardYWing, discardObviousSet };