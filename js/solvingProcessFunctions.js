'use strict';
import globalVar from "./globalVar.js";
import * as notesZero from "./notesZero.js";
import * as modifyDOM from "./modifyingDOMFunctions.js";
import * as recurrent from "./recurrentFunctions.js";
import * as coordinates from "./defineCoordinates.js";
import * as matrixFunctions from "./theMatrixFunctions.js";

////////////////////////////////////////////////////////////////////////////////
//                      SOLVING PROCESSES FUNCTIONS                          //
//////////////////////////////////////////////////////////////////////////////

//function called each time a new value is found by any method
const cellValueFound = (row, column, currentCellValue, method, mainBlock, mainBlockValue) => {
  globalVar.cellsResolved++;
  globalVar.currentStep++;
  globalVar.iterationSuccess = true;
  globalVar.stepsDetail.push( { currentStep: globalVar.currentStep, cellValueFound: true, method: method, cellsResolved: globalVar.cellsResolved, areNotesNeeded: globalVar.areNotesNeeded, nishioGuessingActive: JSON.parse(JSON.stringify(globalVar.nishioGuessingActive)), valueFound: currentCellValue, cellRC: {row: row, column: column} } );
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
  if (method.includes("Nishio")) {
    globalVar.areNotesShowing = false;  //toggleNotes lo dejara en True
    globalVar.stepByStep ? true : recurrent.reviewNotes(theMatrixStepCellFound);
    globalVar.stepByStep ? true : recurrent.toggleNotes();
    globalVar.discardNoteSuccess = true;
  };
  globalVar.stepByStep ? true : modifyDOM.newFoundValueHTML(itemRow, itemColumn, currentCellValue, theMatrixStepCellFound, method, mainBlock, mainBlockValue);
  return { theMatrixStepCellFound};
};

const setNeedNotes = () => {
  globalVar.currentStep++;
  globalVar.discardNoteSuccess = true;
  globalVar.areNotesNeeded = true;
  globalVar.stepsDetail.push( { currentStep: globalVar.currentStep, cellValueFound: false, method: "NotesNeeded", cellsResolved: globalVar.cellsResolved, areNotesNeeded: globalVar.areNotesNeeded, nishioGuessingActive: JSON.parse(JSON.stringify(globalVar.nishioGuessingActive)) } );
  globalVar.theMatrix[globalVar.currentStep] = JSON.parse(JSON.stringify(globalVar.theMatrix[globalVar.currentStep - 1])); //The point where a new step is created in theMatrix, so previous state is saved in step-1. It has to be used these JSON methods to avoid the copy by reference but by value
  document.querySelector("#button-reload").disabled = false; //applies only to step 1, but the if is unnecesary
  document.querySelector("#button-reload").classList.add("active");
  document.querySelector("#button-reload").classList.remove("inactive");
  globalVar.areNotesShowing = false;  //toggleNotes lo dejara en True
  globalVar.stepByStep ? true : recurrent.reviewNotes(globalVar.theMatrix[globalVar.currentStep]);
  globalVar.stepByStep ? true : recurrent.toggleNotes();
  globalVar.discardNoteSuccess = true;
  globalVar.stepByStep ? true : modifyDOM.fromThisStepNotesAreNeededArticle();
};

//Consolidated function for the 3 Blocks (row, column and square) and two discarding strategies (Pairs and Triples)
//This Function is called by OBVIOUSPAIRS and OBVIOUSTRIPLES
const discardObviousSet = (mainAxisValue, mainAxis, secondaryAxis, cellsIdentified, currentCandidates, method, whereisthisnote, callbackNoteZero, callbackModifyDOM ) => {
  globalVar.currentStep++;
  globalVar.stepsDetail.push( { currentStep: globalVar.currentStep, cellValueFound: false, method: method, cellsResolved: globalVar.cellsResolved, areNotesNeeded: globalVar.areNotesNeeded, nishioGuessingActive: JSON.parse(JSON.stringify(globalVar.nishioGuessingActive)) } );
  globalVar.theMatrix[globalVar.currentStep] = JSON.parse(JSON.stringify(globalVar.theMatrix[globalVar.currentStep - 1])); //The point where a new step is created in theMatrix, so previous state is saved in step-1. It has to be used these JSON methods to avoid the copy by reference but by value
  //Here we take advantage of the functions to delete the notes of found values, a callback function is used depending of the block (row, column or square), currently on evaluation
  let theMatrixStep = globalVar.theMatrix[globalVar.currentStep];
  //This for loop is created, so the same function can work with pairs, triples and quadruples, by detecting how many candidates have been received.
  for (let candidate = 1; candidate <= Object.keys(currentCandidates).length; candidate++) {
    theMatrixStep = callbackNoteZero(mainAxisValue, eval(`currentCandidates.candidate${candidate}`), theMatrixStep);
  };
  globalVar.theMatrix[globalVar.currentStep] = JSON.parse(JSON.stringify(theMatrixStep));

  //But here, it is restablished as notes for the triple of cells, executing a double for for the cells and for the candidates.
  //Within the for, the .lenght are used to define if it is an obvious pair or obvious triple, it will depend of which discarding method was the one that called this function
  for (let cellIdentified = 1; cellIdentified <= Object.keys(cellsIdentified).length; cellIdentified++) {
    for (let currentCandidate = 1; currentCandidate <= Object.keys(currentCandidates).length; currentCandidate++) {
      //secondaryAxis is to define which is the axis that defines the order in whereisthisnote
      whereisthisnote[eval(`currentCandidates.candidate${currentCandidate}`)][eval(`cellsIdentified.cell${cellIdentified}.${secondaryAxis}`)] === 1 ? globalVar.theMatrix[globalVar.currentStep][eval(`cellsIdentified.cell${cellIdentified}.row`)][eval(`cellsIdentified.cell${cellIdentified}.column`)][eval(`currentCandidates.candidate${currentCandidate}`)] = 1 : false;
    };
  };

  if(globalVar.areHighlightsOn === true) { 
    //these couple of fors reset the noteKept and justDeleteNote classes for the cells identified for the current discarding strategy
    for (let cellIdentified = 1; cellIdentified <= Object.keys(cellsIdentified).length; cellIdentified++) {
      for (let currentCandidate = 1; currentCandidate <= Object.keys(currentCandidates).length; currentCandidate++) {
        //secondaryAxis is to define which is the axis that defines the order in whereisthisnote
        whereisthisnote[eval(`currentCandidates.candidate${currentCandidate}`)][eval(`cellsIdentified.cell${cellIdentified}.${secondaryAxis}`)] === 1 ? document.querySelector(".theMatrixNotes " + ".row" + (eval(`cellsIdentified.cell${cellIdentified}.row`) + 1) + ".column" + (eval(`cellsIdentified.cell${cellIdentified}.column`) + 1) + " .note" + eval(`currentCandidates.candidate${currentCandidate}`)).classList.remove("justDeletedNote") : false;
        whereisthisnote[eval(`currentCandidates.candidate${currentCandidate}`)][eval(`cellsIdentified.cell${cellIdentified}.${secondaryAxis}`)] === 1 ? document.querySelector(".theMatrixNotes " + ".row" + (eval(`cellsIdentified.cell${cellIdentified}.row`) + 1) + ".column" + (eval(`cellsIdentified.cell${cellIdentified}.column`) + 1) + " .note" + eval(`currentCandidates.candidate${currentCandidate}`)).classList.add("noteKept") : false;
      };
    };
  };
  globalVar.areNotesShowing = false;  //toggleNotes lo dejara en True
  globalVar.stepByStep ? true : recurrent.reviewNotes(globalVar.theMatrix[globalVar.currentStep]);
  globalVar.stepByStep ? true : recurrent.toggleNotes();
  globalVar.discardNoteSuccess = true;
  method.includes("Pair") ? globalVar.difficulty += 8 : false;
  method.includes("Triple") ? globalVar.difficulty += 12 : false;
  method.includes("Quadruple") ? globalVar.difficulty += 21 : false;
  globalVar.stepByStep ? true : callbackModifyDOM(mainAxisValue, mainAxis, cellsIdentified, currentCandidates, method);
};

//Consolidated function for the 3 Blocks (row, column and square), when a pair of values must be kept and discard all others in one cell
//This Function is called by HIDDENPAIRS and HIDDENTRIPLES Techniques
const discardHiddenSet = (mainAxisValue, mainAxis, secondaryAxis, cellsIdentified, currentCandidates, method, callbackNoteZero, callbackModifyDOM) => {
  globalVar.currentStep++;
  globalVar.stepsDetail.push( { currentStep: globalVar.currentStep, cellValueFound: false, method: method, cellsResolved: globalVar.cellsResolved, areNotesNeeded: globalVar.areNotesNeeded, nishioGuessingActive: JSON.parse(JSON.stringify(globalVar.nishioGuessingActive)) } );
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
  method.includes("Quadruple") ? globalVar.difficulty += 38 : false;
  globalVar.stepByStep ? true : callbackModifyDOM(mainAxisValue, mainAxis, cellsIdentified, currentCandidates, method);
};

//Consolidated function for the 3 Blocks (row, column and square), when one value can be discarded
//This Function is called by LOCKEDCANDIDATE Techniques
const discardLockedCandidate = (mainAxisValue, mainAxis, secondaryAxisValue, secondaryAxis, value, method, callbackNoteZero) => {
  let fromRowD;
  let maximumRowD;
  let fromColumnD;
  let maximumColumnD;
  //Section to copy the cells of the corresponding secondary Axis

  switch (true) {
    case (mainAxis === "square"):
      const { fromrow:fromRowS, maximumrow:maximumRowS, fromcolumn:fromColumnS, maximumcolumn:maximumColumnS } = coordinates.defineInitialMaxRCFromSquare(mainAxisValue);
      fromRowD = fromRowS;
      fromColumnD = fromColumnS;
      maximumRowD = maximumRowS;
      maximumColumnD = maximumColumnS;

      switch (true) {
        case (secondaryAxis === "row"):
          fromRowD = secondaryAxisValue;
          maximumRowD = secondaryAxisValue;
        break;
        case (secondaryAxis === "column"):
          fromColumnD = secondaryAxisValue;
          maximumColumnD = secondaryAxisValue;
        break;
      };
    break;

    case (mainAxis === "row"):
      const { fromcolumn:fromcolumnR, maximumcolumn:maximumcolumnR } = coordinates.defineInitialMaxRCFromSquare(secondaryAxisValue);
      fromRowD = mainAxisValue;
      fromColumnD = fromcolumnR;
      maximumRowD = mainAxisValue;
      maximumColumnD = maximumcolumnR;
    break;

    case (mainAxis === "column"):
      const { fromrow:fromrowC, maximumrow:maximumrowC } = coordinates.defineInitialMaxRCFromSquare(secondaryAxisValue);
      fromRowD = fromrowC;
      fromColumnD = mainAxisValue;
      maximumRowD = maximumrowC;
      maximumColumnD = mainAxisValue;
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
  globalVar.stepsDetail.push( { currentStep: globalVar.currentStep, cellValueFound: false, method: method, cellsResolved: globalVar.cellsResolved, areNotesNeeded: globalVar.areNotesNeeded, nishioGuessingActive: JSON.parse(JSON.stringify(globalVar.nishioGuessingActive)) } );
  globalVar.theMatrix[globalVar.currentStep] = JSON.parse(JSON.stringify(globalVar.theMatrix[globalVar.currentStep - 1])); //The point where a new step is created in theMatrix, so previous state is saved in step-1. It has to be used these JSON methods to avoid the copy by reference but by value
  //Here we take advantage of the functions to delete the notes of found values, a callback function is used depending of the block (row, column or square), currently on evaluation
  let theMatrixStep = callbackNoteZero(mainAxisValue, value, globalVar.theMatrix[globalVar.currentStep]);
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
  globalVar.stepByStep ? true : modifyDOM.discardLockedCandidateHTML(mainAxisValue, mainAxis, secondaryAxisValue, secondaryAxis, value, method);
};

//Consolidated function for the 2 Blocks (row, column), when one value can be discarded in X-Wing Detection technique
//This Function is called by X-WING Techniques
const discardXWing = (cornertopleft, cornerbottomright, mainAxis, secondaryAxis, value, method, callbackNoteZero) => {
  globalVar.currentStep++;
  globalVar.stepsDetail.push( { currentStep: globalVar.currentStep, cellValueFound: false, method: method, cellsResolved: globalVar.cellsResolved, areNotesNeeded: globalVar.areNotesNeeded, nishioGuessingActive: JSON.parse(JSON.stringify(globalVar.nishioGuessingActive)) } );
  globalVar.theMatrix[globalVar.currentStep] = JSON.parse(JSON.stringify(globalVar.theMatrix[globalVar.currentStep - 1])); //The point where a new step is created in theMatrix, so previous state is saved in step-1. It has to be used these JSON methods to avoid the copy by reference but by value

  //This process deletes the candidate from the two secondaryAxis blocks
  let secondaryAxisValues = [ eval(`cornertopleft.${secondaryAxis}`), eval(`cornerbottomright.${secondaryAxis}`)];
  secondaryAxisValues.forEach((secondaryAxisValue)  => {
    //Here we take advantage of the functions to delete the notes of found values, a callback function is used depending of the block (row, column or square), currently on evaluation
    let theMatrixStep = callbackNoteZero(secondaryAxisValue, value, globalVar.theMatrix[globalVar.currentStep]);
    globalVar.theMatrix[globalVar.currentStep] = JSON.parse(JSON.stringify(theMatrixStep));
  });
  //Here we restablished the candidate in the 4 cells
  globalVar.theMatrix[globalVar.currentStep][cornertopleft.row][cornertopleft.column][value] = 1;
  globalVar.theMatrix[globalVar.currentStep][cornertopleft.row][cornerbottomright.column][value] = 1;
  globalVar.theMatrix[globalVar.currentStep][cornerbottomright.row][cornertopleft.column][value] = 1;
  globalVar.theMatrix[globalVar.currentStep][cornerbottomright.row][cornerbottomright.column][value] = 1;
  if(globalVar.areHighlightsOn === true) {
    document.querySelector(".theMatrixNotes " + ".row" + (cornertopleft.row + 1) + ".column" + (cornertopleft.column + 1) + " .note" + value).classList.remove("justDeletedNote");
    document.querySelector(".theMatrixNotes " + ".row" + (cornertopleft.row + 1) + ".column" + (cornertopleft.column + 1) + " .note" + value).classList.add("noteKept");
    document.querySelector(".theMatrixNotes " + ".row" + (cornertopleft.row + 1) + ".column" + (cornerbottomright.column + 1) + " .note" + value).classList.remove("justDeletedNote");
    document.querySelector(".theMatrixNotes " + ".row" + (cornertopleft.row + 1) + ".column" + (cornerbottomright.column + 1) + " .note" + value).classList.add("noteKept");
    document.querySelector(".theMatrixNotes " + ".row" + (cornerbottomright.row + 1) + ".column" + (cornertopleft.column + 1) + " .note" + value).classList.remove("justDeletedNote");
    document.querySelector(".theMatrixNotes " + ".row" + (cornerbottomright.row + 1) + ".column" + (cornertopleft.column + 1) + " .note" + value).classList.add("noteKept");
    document.querySelector(".theMatrixNotes " + ".row" + (cornerbottomright.row + 1) + ".column" + (cornerbottomright.column + 1) + " .note" + value).classList.remove("justDeletedNote");
    document.querySelector(".theMatrixNotes " + ".row" + (cornerbottomright.row + 1) + ".column" + (cornerbottomright.column + 1) + " .note" + value).classList.add("noteKept");
  };


  globalVar.areNotesShowing = false;  //toggleNotes lo dejara en True
  globalVar.stepByStep ? true : recurrent.reviewNotes(globalVar.theMatrix[globalVar.currentStep]);
  globalVar.stepByStep ? true : recurrent.toggleNotes();
  globalVar.discardNoteSuccess = true;
  globalVar.difficulty += 65;
  globalVar.stepByStep ? true : modifyDOM.discardXWingHTML( cornertopleft, cornerbottomright, mainAxis, secondaryAxis, value, method);
};

//Consolidated function for the 2 Blocks (row, column), when one value can be discarded in Finned X-Wing Detection technique
//This Function is called by Finned X-WING Techniques
const discardFinnedXWing = (cornerFin, oppositeCornerFin, squaresRectangle, mainAxis, secondaryAxis, value, method, callbackNoteZero, possibleDeletionCells, whereAretheDeletions, cellsFin) => {
  globalVar.currentStep++;
  globalVar.stepsDetail.push( { currentStep: globalVar.currentStep, cellValueFound: false, method: method, cellsResolved: globalVar.cellsResolved, areNotesNeeded: globalVar.areNotesNeeded, nishioGuessingActive: JSON.parse(JSON.stringify(globalVar.nishioGuessingActive)) } );
  globalVar.theMatrix[globalVar.currentStep] = JSON.parse(JSON.stringify(globalVar.theMatrix[globalVar.currentStep - 1])); //The point where a new step is created in theMatrix, so previous state is saved in step-1. It has to be used these JSON methods to avoid the copy by reference but by value

  //This process deletes the candidate from the cells defined to be deleted
  //Here we take advantage of the functions to delete the notes of found values, a callback function is used depending of the block (row, column or square), currently on evaluation
  let theMatrixStep = callbackNoteZero(whereAretheDeletions, value, globalVar.theMatrix[globalVar.currentStep]);
  globalVar.theMatrix[globalVar.currentStep] = JSON.parse(JSON.stringify(theMatrixStep));

  if(globalVar.areHighlightsOn === true) {
    document.querySelector(".theMatrixNotes " + ".row" + (oppositeCornerFin.row + 1) + ".column" + (oppositeCornerFin.column + 1) + " .note" + value).classList.add("noteKept");
    document.querySelector(".theMatrixNotes " + ".row" + (oppositeCornerFin.row + 1) + ".column" + (cornerFin.column + 1) + " .note" + value).classList.add("noteKept");
    document.querySelector(".theMatrixNotes " + ".row" + (cornerFin.row + 1) + ".column" + (oppositeCornerFin.column + 1) + " .note" + value).classList.add("noteKept");
    document.querySelector(".theMatrixNotes " + ".row" + (cornerFin.row + 1) + ".column" + (cornerFin.column + 1) + " .note" + value).classList.add("noteKept");
    cellsFin.forEach(finCell => { document.querySelector(".theMatrixNotes " + ".row" + (finCell.row + 1) + ".column" + (finCell.column + 1) + " .note" + value).classList.add("noteKept");
    });
  };

  globalVar.areNotesShowing = false;  //toggleNotes lo dejara en True
  globalVar.stepByStep ? true : recurrent.reviewNotes(globalVar.theMatrix[globalVar.currentStep]);
  globalVar.stepByStep ? true : recurrent.toggleNotes();
  globalVar.discardNoteSuccess = true;
  globalVar.difficulty += 105;
  globalVar.stepByStep ? true : modifyDOM.discardFinnedXWingHTML(cornerFin, oppositeCornerFin, squaresRectangle, mainAxis, secondaryAxis, value, method, possibleDeletionCells, cellsFin);
};

//Consolidated function for the Y-Wing Combinations, where one value can be discarded in one or several cells
//This Function is called by Y-WING Techniques
const discardYWing = ( pivotCell, pincer1Cell, pincer1Axis, pincer2Cell, pincer2Axis, pincerX, pincerY, pincerZ, method, callbackNoteZero, positiveforZCells, positiveforZvalue, testingforZCells) => {
  globalVar.currentStep++;
  globalVar.stepsDetail.push( { currentStep: globalVar.currentStep, cellValueFound: false, method: method, cellsResolved: globalVar.cellsResolved, areNotesNeeded: globalVar.areNotesNeeded, nishioGuessingActive: JSON.parse(JSON.stringify(globalVar.nishioGuessingActive)) } );
  globalVar.theMatrix[globalVar.currentStep] = JSON.parse(JSON.stringify(globalVar.theMatrix[globalVar.currentStep - 1])); //The point where a new step is created in theMatrix, so previous state is saved in step-1. It has to be used these JSON methods to avoid the copy by reference but by value

  //This process deletes the candidate from the cells determined
  //Here we take advantage of the functions to delete the notes of found values, a callback function is used in loop for all the cells set as positive for PincerZ
  let theMatrixStep = callbackNoteZero(positiveforZvalue, pincerZ, globalVar.theMatrix[globalVar.currentStep]);
  globalVar.theMatrix[globalVar.currentStep] = JSON.parse(JSON.stringify(theMatrixStep));

  if(globalVar.areHighlightsOn === true) { 
    document.querySelector(".theMatrixNotes " + ".row" + (pivotCell.row + 1) + ".column" + (pivotCell.column + 1) + " .note" + pincerX).classList.add("noteKept");
    document.querySelector(".theMatrixNotes " + ".row" + (pivotCell.row + 1) + ".column" + (pivotCell.column + 1) + " .note" + pincerY).classList.add("noteKept");
    document.querySelector(".theMatrixNotes " + ".row" + (pincer1Cell.row + 1) + ".column" + (pincer1Cell.column + 1) + " .note" + pincerX).classList.add("noteKept");
    document.querySelector(".theMatrixNotes " + ".row" + (pincer1Cell.row + 1) + ".column" + (pincer1Cell.column + 1) + " .note" + pincerZ).classList.add("noteKept");
    document.querySelector(".theMatrixNotes " + ".row" + (pincer2Cell.row + 1) + ".column" + (pincer2Cell.column + 1) + " .note" + pincerY).classList.add("noteKept");
    document.querySelector(".theMatrixNotes " + ".row" + (pincer2Cell.row + 1) + ".column" + (pincer2Cell.column + 1) + " .note" + pincerZ).classList.add("noteKept");
  };

  globalVar.areNotesShowing = false;  //toggleNotes lo dejara en True
  globalVar.stepByStep ? true : recurrent.reviewNotes(globalVar.theMatrix[globalVar.currentStep]);
  globalVar.stepByStep ? true : recurrent.toggleNotes();
  globalVar.discardNoteSuccess = true;
  globalVar.difficulty += 85;
  globalVar.stepByStep ? true : modifyDOM.discardYWingHTML(pivotCell, pincer1Cell, pincer1Axis, pincer2Cell, pincer2Axis, pincerX, pincerY, pincerZ, method, positiveforZCells, testingforZCells);
};

//Consolidated function for the 2 Blocks (row, column), when one value can be discarded in SwordFish Detection technique
//This Function is called by SwordFish Techniques
const discardSwordFish = (mainAxisValues, mainAxis, secondaryAxisValues, secondaryAxis, value, method, callbackNoteZero) => {
  globalVar.currentStep++;
  globalVar.stepsDetail.push( { currentStep: globalVar.currentStep, cellValueFound: false, method: method, cellsResolved: globalVar.cellsResolved, areNotesNeeded: globalVar.areNotesNeeded, nishioGuessingActive: JSON.parse(JSON.stringify(globalVar.nishioGuessingActive)) } );
  globalVar.theMatrix[globalVar.currentStep] = JSON.parse(JSON.stringify(globalVar.theMatrix[globalVar.currentStep - 1])); //The point where a new step is created in theMatrix, so previous state is saved in step-1. It has to be used these JSON methods to avoid the copy by reference but by value

  //This process deletes the candidate from the three mainAxis blocks
  secondaryAxisValues.forEach((secondaryAxisValue)  => {
      //Here we take advantage of the functions to delete the notes of found values, a callback function is used depending of the block (row, column or square), currently on evaluation
      let theMatrixStep = callbackNoteZero(secondaryAxisValue, value, globalVar.theMatrix[globalVar.currentStep]);
      globalVar.theMatrix[globalVar.currentStep] = JSON.parse(JSON.stringify(theMatrixStep));
  });
  //Here we restablished the candidate in the 6 corresponding cells evaluating the 9 cells (3 of them did not have the candidate) for SwordFish Technique
  if (mainAxis === "row") {
    mainAxisValues.forEach((mainAxisValue) => {
      secondaryAxisValues.forEach((secondaryAxisValue) => {
        if (globalVar.theMatrix[globalVar.currentStep - 1][mainAxisValue][secondaryAxisValue][value] === 1) {
          globalVar.theMatrix[globalVar.currentStep][mainAxisValue][secondaryAxisValue][value] = 1;
          if(globalVar.areHighlightsOn === true) {
            document.querySelector(".theMatrixNotes " + ".row" + (mainAxisValue + 1) + ".column" + (secondaryAxisValue + 1) + " .note" + value).classList.remove("justDeletedNote");
            document.querySelector(".theMatrixNotes " + ".row" + (mainAxisValue + 1) + ".column" + (secondaryAxisValue + 1) + " .note" + value).classList.add("noteKept");
          };
        };
      });
    });
  } else { //mainAxis is column
    mainAxisValues.forEach((mainAxisValue) => {
      secondaryAxisValues.forEach((secondaryAxisValue) => {
        if (globalVar.theMatrix[globalVar.currentStep - 1][secondaryAxisValue][mainAxisValue][value] === 1) {
          globalVar.theMatrix[globalVar.currentStep][secondaryAxisValue][mainAxisValue][value] = 1;
          if(globalVar.areHighlightsOn === true) {
            document.querySelector(".theMatrixNotes " + ".row" + (secondaryAxisValue + 1) + ".column" + (mainAxisValue + 1) + " .note" + value).classList.remove("justDeletedNote");
            document.querySelector(".theMatrixNotes " + ".row" + (secondaryAxisValue + 1) + ".column" + (mainAxisValue + 1) + " .note" + value).classList.add("noteKept");
          };
        };
      });
    });
  };

  globalVar.areNotesShowing = false;  //toggleNotes lo dejara en True
  globalVar.stepByStep ? true : recurrent.reviewNotes(globalVar.theMatrix[globalVar.currentStep]);
  globalVar.stepByStep ? true : recurrent.toggleNotes();
  globalVar.discardNoteSuccess = true;
  globalVar.difficulty += 95;
  globalVar.stepByStep ? true : modifyDOM.discardSwordFishHTML(mainAxisValues, mainAxis, secondaryAxisValues, secondaryAxis, value, method);
};

const nishioGuessInvalid = (row, column, method) => {
  globalVar.currentStep++;
  globalVar.theMatrix[globalVar.currentStep] = JSON.parse(JSON.stringify(globalVar.theMatrix[globalVar.nishioGuessingActive.step])); //The point where a new step is created in theMatrix, In this case based on the step when the guessing was made. It has to be used these JSON methods to avoid the copy by reference but by value
  let wrongCandidate = globalVar.nishioGuessingActive.currentValue;
  globalVar.nishioGuessingActive.evaluating = false;
  globalVar.nishioGuessingActive.previousNishioResult = "invalidGuess";
  matrixFunctions.rebuildTheMatrix(globalVar.theMatrix[globalVar.currentStep]);
  recurrent.deleteLastShowMe();
  //Here the candidate that has been proven wrong can be deleted from that specific cell
  let theMatrixStep = notesZero.noteZeroCell( [[globalVar.nishioGuessingActive.currentCell.row, globalVar.nishioGuessingActive.currentCell.column]] , wrongCandidate, globalVar.theMatrix[globalVar.currentStep]);
  theMatrixStep = JSON.parse(JSON.stringify(theMatrixStep));
  globalVar.areNotesShowing = false;  //toggleNotes lo dejara en True
  globalVar.stepByStep ? true : recurrent.reviewNotes(globalVar.theMatrix[globalVar.currentStep]);
  globalVar.stepByStep ? true : recurrent.toggleNotes();
  globalVar.discardNoteSuccess = true;
  globalVar.difficulty += 200;
  globalVar.cellsResolved = globalVar.stepsDetail.find(step => step.currentStep === globalVar.nishioGuessingActive.step).cellsResolved;
  // here the foundvalue is set in the html document to be shown, by calling the function newFoundValueHTML
  globalVar.stepByStep ? true : modifyDOM.discardNishioCandidateProvenWrongHTML( row, column, wrongCandidate, method, "cell", [globalVar.nishioGuessingActive.currentCell.row, globalVar.nishioGuessingActive.currentCell.column] );
  globalVar.nishioGuessingActive.step = "";
  globalVar.nishioGuessingActive.currentCell = "";
  globalVar.nishioGuessingActive.currentValue = "";
  globalVar.nishioGuessingActive.currentDiscardedCandidate = "";
  globalVar.stepsDetail.push( { currentStep: globalVar.currentStep, cellValueFound: false, method: method, cellsResolved: globalVar.cellsResolved, areNotesNeeded: globalVar.areNotesNeeded, nishioGuessingActive: JSON.parse(JSON.stringify(globalVar.nishioGuessingActive)) } );
  return { theMatrixStep};
};

const nishioGuessDeadEnd = (method) => {
  globalVar.currentStep++;
  let theMatrixStep = JSON.parse(JSON.stringify(globalVar.theMatrix[globalVar.nishioGuessingActive.step])); //The point where a new step is created in theMatrix, In this case based on the step when the guessing was made. It has to be used these JSON methods to avoid the copy by reference but by value
  let wrongCandidate = globalVar.nishioGuessingActive.currentValue;
  globalVar.nishioGuessingActive.evaluating = false;
  globalVar.nishioGuessingActive.previousNishioResult = "nishioDeadEnd"
  matrixFunctions.rebuildTheMatrix(theMatrixStep);
  recurrent.deleteLastShowMe();
  globalVar.cellsResolved = globalVar.stepsDetail.find(step => step.currentStep === globalVar.nishioGuessingActive.step).cellsResolved;
  // here the foundvalue is set in the html document to be shown, by calling the function newFoundValueHTML
  globalVar.stepByStep ? true : modifyDOM.discardNishioGuessDeadEndHTML( wrongCandidate, method, "cell", [globalVar.nishioGuessingActive.currentCell.row, globalVar.nishioGuessingActive.currentCell.column] );
  globalVar.nishioGuessingActive.step = "";
  globalVar.nishioGuessingActive.currentDiscardedCandidate = "";
  globalVar.stepsDetail.push( { currentStep: globalVar.currentStep, cellValueFound: false, method: method, cellsResolved: globalVar.cellsResolved, areNotesNeeded: globalVar.areNotesNeeded, nishioGuessingActive: JSON.parse(JSON.stringify(globalVar.nishioGuessingActive)) } );
  return { theMatrixStep};
};

export { cellValueFound, setNeedNotes, discardLockedCandidate, discardXWing, discardFinnedXWing, discardHiddenSet, discardYWing, discardSwordFish, discardObviousSet, nishioGuessInvalid, nishioGuessDeadEnd };