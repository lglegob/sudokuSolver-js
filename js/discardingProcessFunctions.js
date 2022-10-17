'use strict';
import globalVar from "./globalVar.js";
import * as recurrent from "./recurrentFunctions.js";
import * as modifyDOM from "./modifyingDOMFunctions.js";

////////////////////////////////////////////////////////////////////////////////
//                     DISCARDING PROCESS FUNCTIONS                          //
//////////////////////////////////////////////////////////////////////////////

//Function used by discarding methods to get the detailed info regardless of what kind of block (row, column or square) is currently in evaluation. 
const gettingDetailedInfo = ( fromrow, maximumrow, fromcolumn, maximumcolumn, blockType, square ) => { 

  //It is consolidated in one array (1*10 first index value (0) not used) the answers for this block already known
  let answersCurrentBlock = [0,0,0,0,0,0,0,0,0,0];
  //It is consolidated in one array (1*10 first index value (0) not used) how many notes for each possibleCandidate in this square
  let howmanycellswiththisnote = [0,0,0,0,0,0,0,0,0,0];
  //It is consolidated in one array (1*9) how many notes for each cell
  let howmanynotesinthiscell = [0,0,0,0,0,0,0,0,0];
  //It is consolidated in an array of subarrays, the locations where each note is located for comparison
  let whereisthisnote = [[],[],[],[],[],[],[],[],[],[]];   

  for (let infoRow = fromrow; infoRow <= maximumrow; infoRow++) { 
    for (let infoColumn = fromcolumn; infoColumn <= maximumcolumn; infoColumn++) {
      globalVar.loopsExecuted++;
      if (globalVar.theMatrix[globalVar.currentStep][infoRow][infoColumn][0] !== 0) {
        //It is consolidated in one array (1*10 first index value (0) not used) the answers for this block
        answersCurrentBlock[globalVar.theMatrix[globalVar.currentStep][infoRow][infoColumn][0]]++
      };
    };
  };

  //second loop to start evaluating possible hidden pairs for remaining values by consolidating in array howmanycellswiththiscandidate and where isthisnote the data
  for (let possibleCandidate = 1; possibleCandidate <=9; possibleCandidate++) {
    whereisthisnote[possibleCandidate] = [0,0,0,0,0,0,0,0,0];
    if (answersCurrentBlock[possibleCandidate] === 0) {
      for (let infoRow = fromrow; infoRow <= maximumrow; infoRow++) { 
        for (let infoColumn = fromcolumn; infoColumn <= maximumcolumn; infoColumn++) {
          globalVar.loopsExecuted++;
          if (globalVar.theMatrix[globalVar.currentStep][infoRow][infoColumn][possibleCandidate] === 1) {
            howmanycellswiththisnote[possibleCandidate]++;
            let relativecolumn;
            let relativerow;
            switch (blockType) {
              case "row":
                howmanynotesinthiscell[infoColumn]++;
                whereisthisnote[possibleCandidate][infoColumn]++
              break;
              case "column":
                howmanynotesinthiscell[infoRow]++;
                whereisthisnote[possibleCandidate][infoRow]++
              break;
              case "square":
                relativecolumn = infoColumn - ( 3 * ((square-1) % 3));
                relativerow = infoRow - (3 * (Math.floor((square-1) / 3)));
                howmanynotesinthiscell[(relativerow)*3 + relativecolumn]++;
                whereisthisnote[possibleCandidate][(relativerow)*3 + relativecolumn]++
              break;
            };
          };
        };
      };
    };
  };
  return { howmanycellswiththisnote, howmanynotesinthiscell, answersCurrentBlock, whereisthisnote };
};

//Consolidated function for the 3 Blocks (row, column and square), when a pair of values can be discarded
//This Function is called by OBVIOUSPAIRS Techniques
const discardTwoCandidates = (blockvalue, mainaxis, row1, row2, column1, column2, value1, value2, method, callbackNoteZero) => {
  globalVar.currentStep++;
  globalVar.stepsDetail[globalVar.currentStep] = [false, method, []];
  globalVar.theMatrix[globalVar.currentStep] = JSON.parse(JSON.stringify(globalVar.theMatrix[globalVar.currentStep - 1])); //The point where a new step is created in theMatrix, so previous state is saved in step-1. It has to be used these JSON methods to avoid the copy by reference but by value
  //Here we take advantage of the functions to delete the notes of found values, a callback function is used depending of the block (row, column or square), currently on evaluation
  let theMatrixStep = callbackNoteZero(blockvalue, value1, globalVar.theMatrix[globalVar.currentStep]);
  theMatrixStep = callbackNoteZero(blockvalue, value2, theMatrixStep);
  globalVar.theMatrix[globalVar.currentStep] = JSON.parse(JSON.stringify(theMatrixStep));
  //But here, it is restablished as notes for the pair of cells
  globalVar.theMatrix[globalVar.currentStep][row1][column1][value1] = 1;
  globalVar.theMatrix[globalVar.currentStep][row1][column1][value2] = 1;
  globalVar.theMatrix[globalVar.currentStep][row2][column2][value1] = 1;
  globalVar.theMatrix[globalVar.currentStep][row2][column2][value2] = 1;
  if(globalVar.areHighlightsOn === true) { 
    document.querySelector(".theMatrixNotes " + ".row" + (row1 + 1) + ".column" + (column1 + 1) + " .note" + value1).classList.remove("justDeletedNote");
    document.querySelector(".theMatrixNotes " + ".row" + (row1 + 1) + ".column" + (column1 + 1) + " .note" + value1).classList.add("noteKept");
    document.querySelector(".theMatrixNotes " + ".row" + (row1 + 1) + ".column" + (column1 + 1) + " .note" + value2).classList.remove("justDeletedNote");
    document.querySelector(".theMatrixNotes " + ".row" + (row1 + 1) + ".column" + (column1 + 1) + " .note" + value2).classList.add("noteKept");
    document.querySelector(".theMatrixNotes " + ".row" + (row2 + 1) + ".column" + (column2 + 1) + " .note" + value1).classList.remove("justDeletedNote");
    document.querySelector(".theMatrixNotes " + ".row" + (row2 + 1) + ".column" + (column2 + 1) + " .note" + value1).classList.add("noteKept");
    document.querySelector(".theMatrixNotes " + ".row" + (row2 + 1) + ".column" + (column2 + 1) + " .note" + value2).classList.remove("justDeletedNote");
    document.querySelector(".theMatrixNotes " + ".row" + (row2 + 1) + ".column" + (column2 + 1) + " .note" + value2).classList.add("noteKept");
  };
  globalVar.areNotesShowing = false;  //toggleNotes lo dejara en True
  recurrent.reviewNotes(globalVar.theMatrix[globalVar.currentStep]);
  recurrent.toggleNotes();
  globalVar.discardNoteSuccess = true;
  modifyDOM.discardTwoCandidatesHTML(blockvalue, mainaxis, row1, row2, column1, column2, value1, value2, method);
};

//Consolidated function for the 3 Blocks (row, column and square), when a pair of values must be kept and discard all others in one cell
//This Function is called by HIDDENPAIRS Techniques
const discardAllExcept = (blockvalue, mainaxis, row1, row2, column1, column2, value1, value2, method, callbackNoteZero) => {
  globalVar.currentStep++;
  globalVar.stepsDetail[globalVar.currentStep] = [false, method, []];
  globalVar.theMatrix[globalVar.currentStep] = JSON.parse(JSON.stringify(globalVar.theMatrix[globalVar.currentStep - 1])); //The point where a new step is created in theMatrix, so previous state is saved in step-1. It has to be used these JSON methods to avoid the copy by reference but by value
  //Here we take advantage of the functions to delete the notes of found values, a callback function is used depending of the block (row, column or square), currently on evaluation
  let theMatrixStep = callbackNoteZero(row1, column1, value1, value2, globalVar.theMatrix[globalVar.currentStep]);
  theMatrixStep = callbackNoteZero(row2, column2, value1, value2, theMatrixStep);
  globalVar.theMatrix[globalVar.currentStep] = JSON.parse(JSON.stringify(theMatrixStep));
  
  globalVar.areNotesShowing = false;  //toggleNotes lo dejara en True
  recurrent.reviewNotes(globalVar.theMatrix[globalVar.currentStep]);
  recurrent.toggleNotes();
  globalVar.discardNoteSuccess = true;
  modifyDOM.discardAllExceptHTML(blockvalue, mainaxis, row1, row2, column1, column2, value1, value2, method);
};

//Consolidated function for the 3 Blocks (row, column and square), when one value can be discarded
//This Function is called by LOCKEDCANDIDATE Techniques
const discardOneCandidate = (mainaxisvalue, mainaxis, secondaryaxisvalue, secondaryaxis, value, method, callbackNoteZero) => {

  let fromRowD;
  let maximumRowD;
  let fromColumnD;
  let maximumColumnD;
  //Section to copy the cells of the corresponding secondary Axis

  switch (true) {
    case (mainaxis === "square"):
      const {fromrow, maximumrow, fromcolumn, maximumcolumn} = recurrent.defineSquareCoordinatesSQ(mainaxisvalue);
      fromRowD = fromrow;
      fromColumnD = fromcolumn;
      maximumRowD = maximumrow;
      maximumColumnD = maximumcolumn;

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
      const {fromrow:fromRowR, maximumrow:maximumrowR, fromcolumn:fromcolumnR, maximumcolumn:maximumcolumnR} = recurrent.defineSquareCoordinatesSQ(secondaryaxisvalue);
      fromRowD = mainaxisvalue;
      fromColumnD = fromcolumnR;
      maximumRowD = mainaxisvalue;
      maximumColumnD = maximumcolumnR;
    break;

    case (mainaxis === "column"):
      const {fromrow:fromrowC, maximumrow:maximumrowC, fromcolumn:fromcolumnC, maximumcolumn:maximumcolumnC} = recurrent.defineSquareCoordinatesSQ(secondaryaxisvalue);
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
  recurrent.reviewNotes(globalVar.theMatrix[globalVar.currentStep]);
  recurrent.toggleNotes();
  globalVar.discardNoteSuccess = true;
  modifyDOM.discardOneCandidateHTML(mainaxisvalue, mainaxis, secondaryaxisvalue, secondaryaxis, value, method);
};

//Consolidated function for the 2 Blocks (row, column), when one value can be discarded in X-Wing Detection technique
//This Function is called by X-WING Techniques
const discardOneCandidateFrom2Blocks = (mainaxisvalues, mainaxis, secondaryaxisvalues, secondaryaxis, value, method, callbackNoteZero) => {
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
  recurrent.reviewNotes(globalVar.theMatrix[globalVar.currentStep]);
  recurrent.toggleNotes();
  globalVar.discardNoteSuccess = true;
  modifyDOM.discardOneCandidateFrom2BlocksHTML(mainaxisvalues, mainaxis, secondaryaxisvalues, secondaryaxis, value, method);
};

//Consolidated function for the Y-Wing Combinations, where one value can be discarded in one or several cells
//This Function is called by Y-WING Techniques
const discardYWing = (pincer1AxisValues, pincer1Axis, pincer2AxisValues, pincer2Axis, pincerX, pincerY, pincerZ, method, callbackNoteZero) => {
  globalVar.currentStep++;
  globalVar.stepsDetail[globalVar.currentStep] = [false, method, []];
  globalVar.theMatrix[globalVar.currentStep] = JSON.parse(JSON.stringify(globalVar.theMatrix[globalVar.currentStep - 1])); //The point where a new step is created in theMatrix, so previous state is saved in step-1. It has to be used these JSON methods to avoid the copy by reference but by value

  //This process deletes the candidate from the cells determined
  if (pincer2Axis !== "square") { //This case is for the pincers found in Row-Column
    //Here we take advantage of the functions to delete the notes of found values, a callback function is used depending of the block (row, column or square), currently on evaluation
    let theMatrixStep = callbackNoteZero(pincer1AxisValues[1], pincer2AxisValues[1], pincerZ, globalVar.theMatrix[globalVar.currentStep]);
    globalVar.theMatrix[globalVar.currentStep] = JSON.parse(JSON.stringify(theMatrixStep));
  };

  if(globalVar.areHighlightsOn === true) { 
    document.querySelector(".theMatrixNotes " + ".row" + (pincer1AxisValues[0] + 1) + ".column" + (pincer2AxisValues[0] + 1) + " .note" + pincerX).classList.add("noteKept");
    document.querySelector(".theMatrixNotes " + ".row" + (pincer1AxisValues[0] + 1) + ".column" + (pincer2AxisValues[0] + 1) + " .note" + pincerY).classList.add("noteKept");
    document.querySelector(".theMatrixNotes " + ".row" + (pincer1AxisValues[0] + 1) + ".column" + (pincer2AxisValues[1] + 1) + " .note" + pincerX).classList.add("noteKept");
    document.querySelector(".theMatrixNotes " + ".row" + (pincer1AxisValues[0] + 1) + ".column" + (pincer2AxisValues[1] + 1) + " .note" + pincerZ).classList.add("noteKept");
    document.querySelector(".theMatrixNotes " + ".row" + (pincer1AxisValues[1] + 1) + ".column" + (pincer2AxisValues[0] + 1) + " .note" + pincerY).classList.add("noteKept");
    document.querySelector(".theMatrixNotes " + ".row" + (pincer1AxisValues[1] + 1) + ".column" + (pincer2AxisValues[0] + 1) + " .note" + pincerZ).classList.add("noteKept");
  };

  globalVar.areNotesShowing = false;  //toggleNotes lo dejara en True
  recurrent.reviewNotes(globalVar.theMatrix[globalVar.currentStep]);
  recurrent.toggleNotes();
  globalVar.discardNoteSuccess = true;
  modifyDOM.discardYWingHTML(pincer1AxisValues, pincer1Axis, pincer2AxisValues, pincer2Axis, pincerX, pincerY, pincerZ, method);
};

export { gettingDetailedInfo, discardOneCandidate, discardOneCandidateFrom2Blocks, discardTwoCandidates, discardAllExcept, discardYWing }