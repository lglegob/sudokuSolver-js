'use strict';
import globalVar from "./globalVar.js";
import * as recurrent from "./theRecurrentFunctions.js";
import * as notesZero from "./notesZero.js";

////////////////////////////////////////////////////////////////////////////////
//                            DISCARDING TECHNIQUES                          //
//////////////////////////////////////////////////////////////////////////////

// Function to detect when a row has obvious pairs
const obviousPairsRow = () => {
  for (let row = 0; row <= 8; row++) { 
    let answersrow = [0,0,0,0,0,0,0,0,0,0];
    for (let column = 0; column <= 8; column++) {
      globalVar.loopsExecuted++;
      if (globalVar.theMatrix[globalVar.currentStep][row][column][0] !== 0) {
        //It is consolidated in one array (1*10 first index value (0) not used) the answers for this row already known
        answersrow[globalVar.theMatrix[globalVar.currentStep][row][column][0]] = 1;
      }
    }

    //It is consolidated in one array (1*10 first index value (0) not used) how many notes for each possibleoption in this row
    let howmanycellswiththisnote = [0,0,0,0,0,0,0,0,0,0];
    //It is consolidated in one array (1*9) how many notes for each cell
    let howmanynotesinthiscell = [0,0,0,0,0,0,0,0,0];
    //It is consolidated in an array of subarrays, the locations where each note is located for comparison
    let whereisthisnote = [[],[],[],[],[],[],[],[],[],[]];

    //second loop to start evaluating possible hidden pairs for remaining values by consolidating in array howmanycellswiththisoption and where isthisnote the data
    for (let possibleoption = 1; possibleoption <=9; possibleoption++) {
      whereisthisnote[possibleoption] = [0,0,0,0,0,0,0,0,0];
      if (answersrow[possibleoption] === 0) {
        for (let column = 0; column <= 8; column++) {
          globalVar.loopsExecuted++;
          if (globalVar.theMatrix[globalVar.currentStep][row][column][possibleoption] === 1) {
            howmanycellswiththisnote[possibleoption]++;
            howmanynotesinthiscell[column]++;
            whereisthisnote[possibleoption][column]++
          };
        };
      };
    };

    //third loop to define if there are cells with 2 same values.
    //column1 evaluates up to column7 to let space to compare with column8
    for (let column1 = 0; column1<= 7; column1++) {
      if (howmanynotesinthiscell[column1] === 2) {
        for (let column2 = column1+1; column2<= 8; column2++) {
          globalVar.loopsExecuted++;
          if (howmanynotesinthiscell[column2] === 2) {
            let cell1notes = globalVar.theMatrix[globalVar.currentStep][row][column1];
            let cell2notes = globalVar.theMatrix[globalVar.currentStep][row][column2];
            if (cell1notes.every((val, index) => val === cell2notes[index])) {
              const isthenotehere = (note) => note === 1;
              let currentcellvalue1 = cell1notes.indexOf(1);
              let currentcellvalue2 = cell1notes.indexOf(1, currentcellvalue1 + 1);
              //This if is to make sure the pair found has notes in other cells and declare them as obvious Pair
              if (howmanycellswiththisnote[currentcellvalue1] > 2 || howmanycellswiththisnote[currentcellvalue2] > 2) {
                globalVar.currentStep++;
                globalVar.stepsDetail[globalVar.currentStep] = [false, "Detecting Obvious Pair (Row)", []];
                globalVar.theMatrix[globalVar.currentStep] = JSON.parse(JSON.stringify(globalVar.theMatrix[globalVar.currentStep - 1])); //The point where a new step is created in theMatrix, so previous state is saved in step-1. It has to be used these JSON methods to avoid the copy by reference but by value
                //Here we take advantage of the functions to delete the notes of found values
                let theMatrixStep = notesZero.noteZeroRow(row, currentcellvalue1, globalVar.theMatrix[globalVar.currentStep]);
                theMatrixStep = notesZero.noteZeroRow(row, currentcellvalue2, theMatrixStep);
                globalVar.theMatrix[globalVar.currentStep] = JSON.parse(JSON.stringify(theMatrixStep));
                //But here, it is restablished as notes for the pair of cells
                globalVar.theMatrix[globalVar.currentStep][row][column1][currentcellvalue1] = 1;
                globalVar.theMatrix[globalVar.currentStep][row][column1][currentcellvalue2] = 1;
                globalVar.theMatrix[globalVar.currentStep][row][column2][currentcellvalue1] = 1;
                globalVar.theMatrix[globalVar.currentStep][row][column2][currentcellvalue2] = 1;
                if (globalVar.areNotesShowing === true) {
                  recurrent.hideNotes(globalVar.theMatrix[globalVar.currentStep]);
                };
                globalVar.areNotesShowing = true;
                recurrent.showNotes(globalVar.theMatrix[globalVar.currentStep]);
                globalVar.discardNoteSuccess = true;
                discardedvalue("row", row, "column", column1, column2, currentcellvalue1, currentcellvalue2, "Detecting Obvious Pair (Row)");
                break;
              };
            };
          };
        };
        if (globalVar.discardNoteSuccess) break;
      };
    };
    if (globalVar.discardNoteSuccess) break;
    // lockedcandidate(answersrow, whereisthisnote);
  };
};

// Function to detect when a column has obvious pairs
const obviousPairsColumn = () => {
  
  for (let column = 0; column <= 8; column++) { 
    let answerscolumn = [0,0,0,0,0,0,0,0,0,0];
    for (let row = 0; row <= 8; row++) {
      globalVar.loopsExecuted++;
      if (globalVar.theMatrix[globalVar.currentStep][row][column][0] !== 0) {
        //It is consolidated in one array (1*10 first index value (0) not used) the answers for this column already known
        answerscolumn[globalVar.theMatrix[globalVar.currentStep][row][column][0]] = 1
      };
    };

    //It is consolidated in one array (1*10 first index value (0) not used) how many notes for each possibleoption in this column
    let howmanycellswiththisnote = [0,0,0,0,0,0,0,0,0,0];
    //It is consolidated in one array (1*9) how many notes for each cell
    let howmanynotesinthiscell = [0,0,0,0,0,0,0,0,0];
    //It is consolidated in an array of subarrays, the locations where each note is located for comparison
    let whereisthisnote = [[],[],[],[],[],[],[],[],[],[]];

    //second loop to start evaluating possible hidden pairs for remaining values by consolidating in array howmanycellswiththisoption and where isthisnote the data
    for (let possibleoption = 1; possibleoption <=9; possibleoption++) {
      whereisthisnote[possibleoption] = [0,0,0,0,0,0,0,0,0];
      if (answerscolumn[possibleoption] === 0) {
        for (let row = 0; row <= 8; row++) {
          globalVar.loopsExecuted++;
          if (globalVar.theMatrix[globalVar.currentStep][row][column][possibleoption] === 1) {
            howmanycellswiththisnote[possibleoption]++;
            howmanynotesinthiscell[row]++;
            whereisthisnote[possibleoption][row]++
          };
        };
      };
    };

    //third loop to define if there are cells with 2 same values.
    //column1 evaluates up to row7 to let space to compare with row8
    for (let row1 = 0; row1<= 7; row1++) {
      if (howmanynotesinthiscell[row1] === 2) {
        for (let row2 = row1+1; row2<= 8; row2++) {
          globalVar.loopsExecuted++;
          if (howmanynotesinthiscell[row2] === 2) {
            let cell1notes = globalVar.theMatrix[globalVar.currentStep][row1][column];
            let cell2notes = globalVar.theMatrix[globalVar.currentStep][row2][column];
            if (cell1notes.every((val, index) => val === cell2notes[index])) {
              const isthenotehere = (note) => note === 1;
              let currentcellvalue1 = cell1notes.indexOf(1);
              let currentcellvalue2 = cell1notes.indexOf(1, currentcellvalue1 + 1);
              //This if is to make sure the pair found has notes in other cells and declare them as obvious Pair
              if (howmanycellswiththisnote[currentcellvalue1] > 2 || howmanycellswiththisnote[currentcellvalue2] > 2) {
                globalVar.currentStep++;
                globalVar.stepsDetail[globalVar.currentStep] = [false, "Detecting Obvious Pair (Column)", []];
                globalVar.theMatrix[globalVar.currentStep] = JSON.parse(JSON.stringify(globalVar.theMatrix[globalVar.currentStep - 1])); //The point where a new step is created in theMatrix, so previous state is saved in step-1. It has to be used these JSON methods to avoid the copy by reference but by value
                //Here we take advantage of the functions to delete the notes of found values
                let theMatrixStep = notesZero.noteZeroColumn(column, currentcellvalue1, globalVar.theMatrix[globalVar.currentStep]);
                theMatrixStep = notesZero.noteZeroColumn(column, currentcellvalue2, theMatrixStep);
                globalVar.theMatrix[globalVar.currentStep] = JSON.parse(JSON.stringify(theMatrixStep));
                //But here, it is restablished as notes for the pair of cells
                globalVar.theMatrix[globalVar.currentStep][row1][column][currentcellvalue1] = 1;
                globalVar.theMatrix[globalVar.currentStep][row1][column][currentcellvalue2] = 1;
                globalVar.theMatrix[globalVar.currentStep][row2][column][currentcellvalue1] = 1;
                globalVar.theMatrix[globalVar.currentStep][row2][column][currentcellvalue2] = 1;
                if (globalVar.areNotesShowing === true) {
                  recurrent.hideNotes(globalVar.theMatrix[globalVar.currentStep]);
                  };
                globalVar.areNotesShowing = true;
                recurrent.showNotes(globalVar.theMatrix[globalVar.currentStep]);
                globalVar.discardNoteSuccess = true;
                discardedvalue("column", column, "row", row1, row2, currentcellvalue1, currentcellvalue2, "Detecting Obvious Pair (Column)");
                break;
              };
            };
          };
        };
        if (globalVar.discardNoteSuccess) break;
      };
    };
    if (globalVar.discardNoteSuccess) break;
    // lockedcandidate(answerscolumn, whereisthisnote);
  };
};

// Function to detect when an square has obvious pairs
const obviousPairsSquare = () => {
  
  for (let square = 1; square <= 9; square++) {
    const {fromrow, maximumrow, fromcolumn, maximumcolumn} = recurrent.defineSquareCoordinatesSQ(square);
    //It is consolidated in one array (1*10 first index value (0) not used) the answers for this square already known
    let answerssquare = [0,0,0,0,0,0,0,0,0,0];
    for (let square_column = fromcolumn; square_column <= maximumcolumn; square_column++) { 
      for (let square_row = fromrow; square_row <= maximumrow; square_row++) {
        globalVar.loopsExecuted++;
        if (globalVar.theMatrix[globalVar.currentStep][square_row][square_column][0] !== 0) {
          //It is consolidated in one array (1*10 first index value (0) not used) the answers for this column
          answerssquare[globalVar.theMatrix[globalVar.currentStep][square_row][square_column][0]] = 1
          
        };
      };
    };

    //It is consolidated in one array (1*10 first index value (0) not used) how many notes for each possibleoption in this square
    let howmanycellswiththisnote = [0,0,0,0,0,0,0,0,0,0];
    //It is consolidated in one array (1*9) how many notes for each cell
    let howmanynotesinthiscell = [0,0,0,0,0,0,0,0,0];
    //It is consolidated in an array of subarrays, the locations where each note is located for comparison
    let whereisthisnote = [[],[],[],[],[],[],[],[],[],[]];

    //second loop to start evaluating possible hidden pairs for remaining values by consolidating in array howmanycellswiththisoption and where isthisnote the data
    for (let possibleoption = 1; possibleoption <=9; possibleoption++) {
      whereisthisnote[possibleoption] = [0,0,0,0,0,0,0,0,0];
      if (answerssquare[possibleoption] === 0) {
        for (let square_column = fromcolumn; square_column <= maximumcolumn; square_column++) { 
          for (let square_row = fromrow; square_row <= maximumrow; square_row++) {
            globalVar.loopsExecuted++;
            if (globalVar.theMatrix[globalVar.currentStep][square_row][square_column][possibleoption] === 1) {
              howmanycellswiththisnote[possibleoption]++;
              let relativecolumn = square_column - ( 3 * ((square-1) % 3));
              let relativerow = square_row - (3 * (Math.floor((square-1) / 3)));
              howmanynotesinthiscell[(relativerow)*3 + relativecolumn]++;
              whereisthisnote[possibleoption][(relativerow)*3 + relativecolumn]++
            };
          };
        };
      };
    };

    //third loop to define if there are cells with 2 same values.
    //cell1 evaluates up to cell7 to let space to compare with cell8
    for (let cell1 = 0; cell1<= 7; cell1++) {
      if (howmanynotesinthiscell[cell1] === 2) {
        for (let cell2 = cell1+1; cell2<= 8; cell2++) {
          globalVar.loopsExecuted++;
          if (howmanynotesinthiscell[cell2] === 2) {
            let realrow1 = fromrow + Math.floor(cell1 / 3); 
            let realcolumn1 = fromcolumn + cell1 % 3;
            let realrow2 = fromrow + Math.floor(cell2 / 3);
            let realcolumn2 = fromcolumn + cell2 % 3;
            let cell1notes = globalVar.theMatrix[globalVar.currentStep][realrow1][realcolumn1];
            let cell2notes = globalVar.theMatrix[globalVar.currentStep][realrow2][realcolumn2];
            if (cell1notes.every((val, index) => val === cell2notes[index])) {
              let currentcellvalue1 = cell1notes.indexOf(1);
              let currentcellvalue2 = cell1notes.indexOf(1, currentcellvalue1 + 1);
              //This if is to make sure the pair found has notes in other cells and declare them as obvious Pair
              if (howmanycellswiththisnote[currentcellvalue1] > 2 || howmanycellswiththisnote[currentcellvalue2] > 2) {
                globalVar.currentStep++;
                globalVar.stepsDetail[globalVar.currentStep] = [false, "Detecting Obvious Pair (Square)", []];
                globalVar.theMatrix[globalVar.currentStep] = JSON.parse(JSON.stringify(globalVar.theMatrix[globalVar.currentStep - 1])); //The point where a new step is created in theMatrix, so previous state is saved in step-1. It has to be used these JSON methods to avoid the copy by reference but by value
                //Here we take advantage of the functions to delete the notes of found values, we just need the 2 currentcellvalues, it does not matter which cell (of the 2 checked as equal) is taken as reference.
                let theMatrixStep = notesZero.noteZeroSquare(realrow1, realcolumn1, currentcellvalue1, globalVar.theMatrix[globalVar.currentStep]);
                theMatrixStep = notesZero.noteZeroSquare(realrow1, realcolumn1, currentcellvalue2, theMatrixStep);
                globalVar.theMatrix[globalVar.currentStep] = JSON.parse(JSON.stringify(theMatrixStep));
                //But here, it is restablished as notes for the pair of cells
                globalVar.theMatrix[globalVar.currentStep][realrow1][realcolumn1][currentcellvalue1] = 1;
                globalVar.theMatrix[globalVar.currentStep][realrow1][realcolumn1][currentcellvalue2] = 1;
                globalVar.theMatrix[globalVar.currentStep][realrow2][realcolumn2][currentcellvalue1] = 1;
                globalVar.theMatrix[globalVar.currentStep][realrow2][realcolumn2][currentcellvalue2] = 1;
                if (globalVar.areNotesShowing === true) {
                  recurrent.hideNotes(globalVar.theMatrix[globalVar.currentStep]);
                  };
                globalVar.areNotesShowing = true;
                recurrent.showNotes(globalVar.theMatrix[globalVar.currentStep]);
                globalVar.discardNoteSuccess = true;
                discardedvalue("square", square - 1, "row", realrow1, realrow2, currentcellvalue1, currentcellvalue2, "Detecting Obvious Pair (Square)");
                break;
              };
            };
          };
        };
        if (globalVar.discardNoteSuccess) break;
      };
    };
    if (globalVar.discardNoteSuccess) break;
    // lockedcandidate(answerssquare, whereisthisnote);
  };
};

const lockedCandidate = (answers, whereisthisnote) => {
  for (let possibleoption = 1; possibleoption <= 9; possibleoption++) {
    globalVar.loopsExecuted++;
    if (answers[possibleoption] === 0) {
      let firstthird = whereisthisnote[possibleoption][0] + whereisthisnote[possibleoption][1] + whereisthisnote[possibleoption][2];
      let secondthird = whereisthisnote[possibleoption][3] + whereisthisnote[possibleoption][4] + whereisthisnote[possibleoption][5];
      let finalthird = whereisthisnote[possibleoption][6] + whereisthisnote[possibleoption][7] + whereisthisnote[possibleoption][8];
      if (firstthird > 1 && secondthird === 0 && finalthird === 0) {console.log("It is located in the first third only")};
      if (firstthird === 0 && secondthird > 1 && finalthird === 0) {console.log("It is located in the second third only")};
      if (firstthird === 0 && secondthird === 0 && finalthird > 1) {console.log("It is located in the final third only")};
    };
  };
};

const discardedvalue = (mainaxis, mainaxisvalue, secondaryaxis, secondaryaxisvalue1, secondaryaxisvalue2, value1, value2, method) => {
  // AQUI debe ir la creacion del step nuevo de theMatrix y modificacion de las variables para unificar funcion, por ahora esta distribuido en las 3 funciones de obvious
  discardedvaluesHTML(mainaxis, mainaxisvalue, secondaryaxis, secondaryaxisvalue1, secondaryaxisvalue2, value1, value2, method);
};

const discardedvaluesHTML = (mainaxis, mainaxisvalue, secondaryaxis, secondaryaxisvalue1, secondaryaxisvalue2, value1, value2, method) => {
  console.log("We found an Obvious Pair!")
  console.log(`We are looking at ${mainaxis} ${mainaxisvalue + 1}, the first cell is ${secondaryaxis} ${secondaryaxisvalue1 + 1}, and the second cell is ${secondaryaxis} ${secondaryaxisvalue2 + 1}`)
  console.log(`The notes are ${value1} and ${value2}, they have been deleted from the ${mainaxis} ${mainaxisvalue + 1}`);
  document.querySelector("#button-reload").disabled = false; //applies only to step 1, but the if is unnecesary
  document.querySelector("#button-reload").classList.add("active");
  document.querySelector("#button-reload").classList.remove("inactive");
  let newdiscardedvalueArticle = document.createElement("article");
  newdiscardedvalueArticle.classList.add("newdiscardedvalue");
  // newfoundvalueArticle.setAttribute("id", DEFINE-ID);
  newdiscardedvalueArticle.innerHTML = `
  <p>Notes Discarded in ${mainaxis} ${mainaxisvalue + 1}, the first cell is ${secondaryaxis} ${secondaryaxisvalue1 + 1}, and the second cell is ${secondaryaxis} ${secondaryaxisvalue2 + 1}, The notes discarded are ${value1} and ${value2}, they have been deleted from the ${mainaxis} ${mainaxisvalue + 1}, using ${method} method</p>
  `;
  const main = document.querySelector(".found-values > div");
  main.prepend(newdiscardedvalueArticle);
};

export {obviousPairsRow, obviousPairsColumn, obviousPairsSquare, lockedCandidate};