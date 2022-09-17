'use strict';
import globalVar from "./globalVar.js";
import * as recurrent from "./theRecurrentFunctions.js"
import * as notesZero from "./notesZero.js"
import * as matrixFunctions from "./theMatrixFunctions.js"
import * as processFunctions from "./solvingProcessFunctions.js"


// SOLUTION PHASES
// Check NO repeated numbers per row, column and square

// DONE - Delete notes from rows, columns and squares

// Nested Loops
// DONE Second Step - check cells with just one note
// DONE Third Step - hidden singles - check rows, columns and squares where any number appears just once
// Fourth Step - check numbers per row and column, that appear only in one of the squares, and delete the possibilities in any other cell in the square
// DONE Fifth step - check for obvious pairs per row, column and square
// Sixth Step - hidden pairs - square
// Sixth Step - Obvious Triples (even with doubles)

//For loop to create the base 4D Matrix
//The 4D matrix is formed with 4 dimensions
//The latest added dimension is also the biggest, and it is... Time!, expressed as the steps taken so far to resolve the Sudoku, the step 0 is the initial state and the subsequent steps represent each time a change is made in the matrix, by adding a number (cell solution) or discarding values (notes)
//The Second dimension is theMatrix itself, with 9 internal arrays, 1 array for each row in the Sudoku Matrix
//The Third dimension (each of the 9 arrays) has as well 9 arrays inside (81 nested total for the 81 cells in the sudoku array), one array for each value in the row
//The Fourth and Last dimension (each of the 81 (9*9) nested arrays) is an array of 10 numbers, the first one is for the value of the cell (if already known or zero if not known)
//the other 9 numbers (indexes 1-9 show the notes for each of the cells of the sudoku array)
// theMatrix Structure --> [[row][row]...[row][row]]
// Each row Structure  --> [[column cell][column cell]...[column cell][column cell]]
// Each Column Cell    --> [[answer][note 1][note 2][note 3]...[note 9]]


////////////////////////////////////////////////////////////////////////////////
//                             BASIC FUNCTIONS                               //
//////////////////////////////////////////////////////////////////////////////

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

////////////////////////////////////////////////////////////////////////////////
//                             SUDOKU TECHNIQUES                             //
//////////////////////////////////////////////////////////////////////////////

// Function to detect when a cell has just 1 option (note)
const singleoptions = () => {
  for (let row = 0; row <= 8; row++) {
    for (let column = 0; column <= 8; column++) {
      globalVar.loopsExecuted++;
      let currentcellvalue = theMatrix[step][row][column][0];
      //method reduce to obtain the sum of the options in this cell
      const sum = theMatrix[step][row][column].reduce(add, 0);
        function add(accumulator, a) {
          return accumulator + a;
        };
        if (sum-currentcellvalue === 1) {
        //cell solved! iterationsuccess! Detect which value is unique and set it as answer in currentcellvalue
        globalVar.iterationSuccess = true;
        currentcellvalue = theMatrix[step][row][column].findIndex((one, index) => one === 1 && index > 0);
        const { stepCellFound, theMatrixStepCellFound, stepsinfoStepCellFound} = processFunctions.cellvaluefound(step, theMatrix[step], row, column, currentcellvalue, areweshowingnotes, "Detecting Singles");
        step = stepCellFound;
        theMatrix[step] = JSON.parse(JSON.stringify(theMatrixStepCellFound));
        stepsinfo[step] = JSON.parse(JSON.stringify(stepsinfoStepCellFound));
        break;
        };
    };
    if (globalVar.iterationSuccess) break;
  };
};

// Function to detect when a row has a possible value just in one of the 9 cells
const hiddensinglesrow = () => {
  for (let row = 0; row <= 8; row++) {
    for (let possibleoption = 1; possibleoption <=9; possibleoption++) {
      let ishiddensingle = 0;
      let currentcellvalue;
      let columnfound;
      for (let column = 0; column <= 8; column++) {
        globalVar.loopsExecuted++;
        currentcellvalue = theMatrix[step][row][column][0];
        //this if evalutes the cell does not have a solved value yet and that the possiblevalue in evaluation is present in this cell
        if (currentcellvalue === 0 && theMatrix[step][row][column][possibleoption] === 1) {
          //This cell has not yet been resolved, it sums the values of each option position to find a hidden single
          ishiddensingle++;
          // si ya existen mas de una celda con el possiblevalue, salir del loop y pasar al siguiente possiblevalue
          if (ishiddensingle > 1) break;
          columnfound = column;
        }
      };
      if (ishiddensingle === 1) {
        //cell solved! iterationsuccess! Detect which value is unique and set it as answer in currentcellvalue
        globalVar.iterationSuccess = true;
        currentcellvalue = possibleoption;
        const {stepCellFound, theMatrixStepCellFound, stepsinfoStepCellFound} = processFunctions.cellvaluefound(step, theMatrix[step], row, columnfound, currentcellvalue, areweshowingnotes, "Detecting Hidden Singles (row)");
        step = stepCellFound;
        theMatrix[step] = JSON.parse(JSON.stringify(theMatrixStepCellFound));
        stepsinfo[step] = JSON.parse(JSON.stringify(stepsinfoStepCellFound));
        break;
      };
    };
    if (globalVar.iterationSuccess) break;
  };
}

// Function to detect when a column has a possible value just in one of the 9 cells
const hiddensinglescolumn = () => {
  for (let column = 0; column <= 8; column++) {
    for (let possibleoption = 1; possibleoption <=9; possibleoption++) {
      let ishiddensingle = 0;
      let currentcellvalue;
      let rowfound;
      for (let row = 0; row <= 8; row++) {
        globalVar.loopsExecuted++;
        currentcellvalue = theMatrix[step][row][column][0];
        //this if evalutes the cell does not have a solved value yet and that the possiblevalue in evaluation is present in this cell
        if (currentcellvalue === 0 && theMatrix[step][row][column][possibleoption] === 1) {
          //This cell has not yet been resolved, it sums the values of each option position to find a hidden single
          ishiddensingle++;
          // si ya existen mas de una celda con el possiblevalue, salir del loop y pasar al siguiente possiblevalue
          if (ishiddensingle > 1) break;
          rowfound = row;
        }
      };
      if (ishiddensingle === 1) {
        //cell solved! iterationsuccess! Detect which value is unique and set it as answer in currentcellvalue
        globalVar.iterationSuccess = true;
        currentcellvalue = possibleoption;
        const {stepCellFound, theMatrixStepCellFound, stepsinfoStepCellFound} = processFunctions.cellvaluefound(step, theMatrix[step], rowfound, column, currentcellvalue, areweshowingnotes, "Detecting Hidden Singles (column)");
        step = stepCellFound;
        theMatrix[step] = JSON.parse(JSON.stringify(theMatrixStepCellFound));
        stepsinfo[step] = JSON.parse(JSON.stringify(stepsinfoStepCellFound));
        break;
      };
    };
    if (globalVar.iterationSuccess) break;
  };
}

// Function to detect when an square has a possible value just in one of the 9 cells
const hiddensinglessquare = () => {
  for (let square = 1; square <= 9; square++) {
    const { fromrow, maximumrow, fromcolumn, maximumcolumn } = recurrent.defineSquareCoordinatesSQ(square);
    for (let possibleoption = 1; possibleoption <=9; possibleoption++) {
      let ishiddensingle = 0;
      let currentcellvalue;
      let rowfound;
      let columnfound;
      for (let square_row = fromrow; square_row <= maximumrow; square_row++) {
        for (let square_column = fromcolumn; square_column <= maximumcolumn; square_column++) {
          globalVar.loopsExecuted++;
          currentcellvalue = theMatrix[step][square_row][square_column][0];
          //this if evalutes the cell does not have a solved value yet and that the possiblevalue in evaluation is present in this cell
          if (currentcellvalue === 0 && theMatrix[step][square_row][square_column][possibleoption] === 1) {
            //This cell has not yet been resolved, it sums the values of each option position to find a hidden single
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
        //cell solved! iterationsuccess! Detect which value is unique and set it as answer in currentcellvalue
        globalVar.iterationSuccess = true;
        currentcellvalue = possibleoption;
        const {stepCellFound, theMatrixStepCellFound, stepsinfoStepCellFound} = processFunctions.cellvaluefound(step, theMatrix[step], rowfound, columnfound, currentcellvalue, areweshowingnotes, "Detecting Hidden Singles (square)");
        step = stepCellFound;
        theMatrix[step] = JSON.parse(JSON.stringify(theMatrixStepCellFound));
        stepsinfo[step] = JSON.parse(JSON.stringify(stepsinfoStepCellFound));
        break;
      };
    if (globalVar.iterationSuccess) break;
    };
  if (globalVar.iterationSuccess) break; //so, it just find one solution per loop
  };
};

// Function to detect when a row has obvious pairs
const obviouspairsrow = () => {
  
  for (let row = 0; row <= 8; row++) { 
    let answersrow = [0,0,0,0,0,0,0,0,0,0];
    for (let column = 0; column <= 8; column++) {
      globalVar.loopsExecuted++;
      if (theMatrix[step][row][column][0] !== 0) {
        //It is consolidated in one array (1*10 first index value (0) not used) the answers for this row already known
        answersrow[theMatrix[step][row][column][0]] = 1;
        
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
          if (theMatrix[step][row][column][possibleoption] === 1) {
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
            let cell1notes = theMatrix[step][row][column1];
            let cell2notes = theMatrix[step][row][column2];
            if (cell1notes.every((val, index) => val === cell2notes[index])) {
              const isthenotehere = (note) => note === 1;
              let currentcellvalue1 = cell1notes.indexOf(1);
              let currentcellvalue2 = cell1notes.indexOf(1, currentcellvalue1 + 1);
              //This if is to make sure the pair found has notes in other cells and declare them as obvious Pair
              if (howmanycellswiththisnote[currentcellvalue1] > 2 || howmanycellswiththisnote[currentcellvalue2] > 2) {
                step++;
                stepsinfo[step] = [false, "Detecting Obvious Pair (Row)", []];
                theMatrix[step] = JSON.parse(JSON.stringify(theMatrix[step - 1])); //The point where a new step is created in theMatrix, so previous state is saved in step-1. It has to be used these JSON methods to avoid the copy by reference but by value
                //Here we take advantage of the functions to delete the notes of found values
                let theMatrixStep = notesZero.noteZeroRow(row, currentcellvalue1, theMatrix[step]);
                theMatrixStep = notesZero.noteZeroRow(row, currentcellvalue2, theMatrixStep);
                theMatrix[step] = JSON.parse(JSON.stringify(theMatrixStep));
                //But here, it is restablished as notes for the pair of cells
                theMatrix[step][row][column1][currentcellvalue1] = 1;
                theMatrix[step][row][column1][currentcellvalue2] = 1;
                theMatrix[step][row][column2][currentcellvalue1] = 1;
                theMatrix[step][row][column2][currentcellvalue2] = 1;
                if (areweshowingnotes === true) {
                  recurrent.hideNotes(theMatrix[step]);
                };
                areweshowingnotes = true;
                recurrent.showNotes(theMatrix[step]);
                discardnotessuccess = true;
                discardedvalue("row", row, "column", column1, column2, currentcellvalue1, currentcellvalue2, "Detecting Obvious Pair (Row)");
                break;
              };
            };
          };
        };
        if (discardnotessuccess) break;
      };
    };
    if (discardnotessuccess) break;
    // lockedcandidate(answersrow, whereisthisnote);
  };
};

// Function to detect when a column has obvious pairs
const obviouspairscolumn = () => {
  
  for (let column = 0; column <= 8; column++) { 
    let answerscolumn = [0,0,0,0,0,0,0,0,0,0];
    for (let row = 0; row <= 8; row++) {
      globalVar.loopsExecuted++;
      if (theMatrix[step][row][column][0] !== 0) {
        //It is consolidated in one array (1*10 first index value (0) not used) the answers for this column already known
        answerscolumn[theMatrix[step][row][column][0]] = 1
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
          if (theMatrix[step][row][column][possibleoption] === 1) {
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
            let cell1notes = theMatrix[step][row1][column];
            let cell2notes = theMatrix[step][row2][column];
            if (cell1notes.every((val, index) => val === cell2notes[index])) {
              const isthenotehere = (note) => note === 1;
              let currentcellvalue1 = cell1notes.indexOf(1);
              let currentcellvalue2 = cell1notes.indexOf(1, currentcellvalue1 + 1);
              //This if is to make sure the pair found has notes in other cells and declare them as obvious Pair
              if (howmanycellswiththisnote[currentcellvalue1] > 2 || howmanycellswiththisnote[currentcellvalue2] > 2) {
                step++;
                stepsinfo[step] = [false, "Detecting Obvious Pair (Column)", []];
                theMatrix[step] = JSON.parse(JSON.stringify(theMatrix[step - 1])); //The point where a new step is created in theMatrix, so previous state is saved in step-1. It has to be used these JSON methods to avoid the copy by reference but by value
                //Here we take advantage of the functions to delete the notes of found values
                let theMatrixStep = notesZero.noteZeroColumn(column, currentcellvalue1, theMatrix[step]);
                theMatrixStep = notesZero.noteZeroColumn(column, currentcellvalue2, theMatrixStep);
                theMatrix[step] = JSON.parse(JSON.stringify(theMatrixStep));
                //But here, it is restablished as notes for the pair of cells
                theMatrix[step][row1][column][currentcellvalue1] = 1;
                theMatrix[step][row1][column][currentcellvalue2] = 1;
                theMatrix[step][row2][column][currentcellvalue1] = 1;
                theMatrix[step][row2][column][currentcellvalue2] = 1;
                if (areweshowingnotes === true) {
                  recurrent.hideNotes(theMatrix[step]);
                  };
                areweshowingnotes = true;
                recurrent.showNotes(theMatrix[step]);
                discardnotessuccess = true;
                discardedvalue("column", column, "row", row1, row2, currentcellvalue1, currentcellvalue2, "Detecting Obvious Pair (Column)");
                break;
              };
            };
          };
        };
        if (discardnotessuccess) break;
      };
    };
    if (discardnotessuccess) break;
    // lockedcandidate(answerscolumn, whereisthisnote);
  };
};

// Function to detect when an square has obvious pairs
const obviouspairssquare = () => {
  
  for (let square = 1; square <= 9; square++) {
    const {fromrow, maximumrow, fromcolumn, maximumcolumn} = recurrent.defineSquareCoordinatesSQ(square);
    //It is consolidated in one array (1*10 first index value (0) not used) the answers for this square already known
    let answerssquare = [0,0,0,0,0,0,0,0,0,0];
    for (let square_column = fromcolumn; square_column <= maximumcolumn; square_column++) { 
      for (let square_row = fromrow; square_row <= maximumrow; square_row++) {
        globalVar.loopsExecuted++;
        if (theMatrix[step][square_row][square_column][0] !== 0) {
          //It is consolidated in one array (1*10 first index value (0) not used) the answers for this column
          answerssquare[theMatrix[step][square_row][square_column][0]] = 1
          
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
            if (theMatrix[step][square_row][square_column][possibleoption] === 1) {
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
            let cell1notes = theMatrix[step][realrow1][realcolumn1];
            let cell2notes = theMatrix[step][realrow2][realcolumn2];
            if (cell1notes.every((val, index) => val === cell2notes[index])) {
              let currentcellvalue1 = cell1notes.indexOf(1);
              let currentcellvalue2 = cell1notes.indexOf(1, currentcellvalue1 + 1);
              //This if is to make sure the pair found has notes in other cells and declare them as obvious Pair
              if (howmanycellswiththisnote[currentcellvalue1] > 2 || howmanycellswiththisnote[currentcellvalue2] > 2) {
                step++;
                stepsinfo[step] = [false, "Detecting Obvious Pair (Square)", []];
                theMatrix[step] = JSON.parse(JSON.stringify(theMatrix[step - 1])); //The point where a new step is created in theMatrix, so previous state is saved in step-1. It has to be used these JSON methods to avoid the copy by reference but by value
                //Here we take advantage of the functions to delete the notes of found values, we just need the 2 currentcellvalues, it does not matter which cell (of the 2 checked as equal) is taken as reference.
                let theMatrixStep = notesZero.noteZeroSquare(realrow1, realcolumn1, currentcellvalue1, theMatrix[step]);
                theMatrixStep = notesZero.noteZeroSquare(realrow1, realcolumn1, currentcellvalue2, theMatrixStep);
                theMatrix[step] = JSON.parse(JSON.stringify(theMatrixStep));
                //But here, it is restablished as notes for the pair of cells
                theMatrix[step][realrow1][realcolumn1][currentcellvalue1] = 1;
                theMatrix[step][realrow1][realcolumn1][currentcellvalue2] = 1;
                theMatrix[step][realrow2][realcolumn2][currentcellvalue1] = 1;
                theMatrix[step][realrow2][realcolumn2][currentcellvalue2] = 1;
                if (areweshowingnotes === true) {
                  recurrent.hideNotes(theMatrix[step]);
                  };
                areweshowingnotes = true;
                recurrent.showNotes(theMatrix[step]);
                discardnotessuccess = true;
                discardedvalue("square", square - 1, "row", realrow1, realrow2, currentcellvalue1, currentcellvalue2, "Detecting Obvious Pair (Square)");
                break;
              };
            };
          };
        };
        if (discardnotessuccess) break;
      };
    };
    if (discardnotessuccess) break;
    // lockedcandidate(answerssquare, whereisthisnote);
  };
};

const lockedcandidate = (answers, whereisthisnote) => {
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

// definining elements for Event Listeners
const button_load = document.querySelector("#button-load");
const button_validate = document.querySelector("#button-validate");
const button_resolve = document.querySelector("#button-resolve");
const button_reset = document.querySelector("#button-reset");
const button_togglenotes = document.querySelector("#button-togglenotes");
const button_reload = document.querySelector("#button-reload");
const input_cellvalues = document.querySelectorAll(".theMatrix input");


// Add event listener to the Load button
const loadMatrixListener = () => {
  button_load.addEventListener("click", (e) => {
    // Stop form from reloading the page
    e.preventDefault();
    matrixFunctions.loadMatrix();
    theMatrixStep = matrixFunctions.validateMatrix(theMatrix[0]);
    const { theMatrixStepanalysis } = matrixFunctions.analyzeMatrix(theMatrixStep);
    theMatrix[0] = JSON.parse(JSON.stringify(theMatrixStepanalysis));
  });
};

// Add event listener to the Load button
const reloadMatrixListener = () => {
  button_reload.addEventListener("click", (e) => {
    // Stop form from reloading the page
    e.preventDefault();
    const { stepReloaded } = matrixFunctions.matrixReloaded(step, areweshowingnotes, theMatrix[step - 1], stepsinfo);
    step = stepReloaded;
  });
};

// Add event listener to the Validate button
const validateMatrixListener = () => {
  button_validate.addEventListener("click", (e) => {
    // Stop form from reloading the page
    e.preventDefault();
    theMatrixStep = matrixFunctions.validateMatrix(theMatrix[0]);
    const {theMatrixStepanalysis } = matrixFunctions.analyzeMatrix(theMatrixStep);
    theMatrix[0] = JSON.parse(JSON.stringify(theMatrixStepanalysis));
  });
};

// Add event listener to the reset button
const resetMatrixListener = () => {
  button_reset.addEventListener("click", (e) => {
    // Stop form from reloading the page
    e.preventDefault();
    matrixFunctions.resetMatrix();
  });
};

// Add event listener to the showNotes button
const toggleNotesListener = () => {
  button_togglenotes.addEventListener("click", (e) => {
    // Stop form from reloading the page
    e.preventDefault();
    if (areweshowingnotes === false) {
      areweshowingnotes = true;
      recurrent.showNotes(theMatrix[step]);
    } else {
      areweshowingnotes = false;
      recurrent.hideNotes(theMatrix[step]);
    };
  });
};

// Add event listener to the showNotes button
const inputCellsListener = () => {
  input_cellvalues.forEach(item => {
    item.addEventListener("change", () => {
      document.querySelector("#button-load").disabled = true;
      document.querySelector("#button-load").classList.remove("active");
      document.querySelector("#button-load").classList.add("inactive");
      document.querySelector("#button-validate").disabled = false;
      document.querySelector("#button-validate").classList.add("active");
      document.querySelector("#button-validate").classList.remove("inactive");
      document.querySelector("#button-reset").disabled = false;
      document.querySelector("#button-reset").classList.add("active");
      document.querySelector("#button-reset").classList.remove("inactive");
    });
  });
};


// Add event listener to the Resolve Button
const resolveMatrixListener = () => {
  button_resolve.addEventListener("click", (e) => {
    // Stop form from reloading the page
    e.preventDefault();
    singleoptions();

    if (globalVar.iterationSuccess === false && discardnotessuccess === false) {
      hiddensinglessquare();
    };
    if (globalVar.iterationSuccess === false && discardnotessuccess === false) {
      hiddensinglesrow();
    };
    if (globalVar.iterationSuccess === false && discardnotessuccess === false) {
      hiddensinglescolumn();
    };
    if (globalVar.iterationSuccess === false && discardnotessuccess === false) {
      obviouspairsrow();
    };
    if (globalVar.iterationSuccess === false && discardnotessuccess === false) {
      obviouspairscolumn();
    };
    if (globalVar.iterationSuccess === false && discardnotessuccess === false) {
      obviouspairssquare();
    };

    globalVar.iterationSuccess = false;
    discardnotessuccess = false;
    if (globalVar.cellsResolved === 81) {
      document.querySelector("#button-resolve").disabled = true;
      document.querySelector("#button-resolve").classList.remove("active");
      document.querySelector("#button-resolve").classList.add("inactive");
      document.querySelector("#button-togglenotes").disabled = true;
      document.querySelector("#button-togglenotes").classList.remove("active");
      document.querySelector("#button-togglenotes").classList.add("inactive");
    };
  });
};

let theMatrix = [[]];
let step = 0;
let stepsinfo = []; //Stepsinfo [steptype, Method, [Step detailed info]]
let discardnotessuccess = false;
let areweshowingnotes = false;

//Initial state defined in the html, no need to change classes
document.querySelector("#button-validate").disabled = true
document.querySelector("#button-reload").disabled = true
document.querySelector("#button-resolve").disabled = true
document.querySelector("#button-togglenotes").disabled = true
document.querySelector("#button-reset").disabled = true

let theMatrixStep = matrixFunctions.createMatrix();
theMatrix[0] = JSON.parse(JSON.stringify(theMatrixStep));

//activate the Listeners
validateMatrixListener();
resetMatrixListener();
resolveMatrixListener();
reloadMatrixListener();
loadMatrixListener();
toggleNotesListener();
inputCellsListener();