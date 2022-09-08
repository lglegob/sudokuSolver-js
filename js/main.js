'use strict';
import sudokuvalues from "./data.js";
import * as recurrent from "./recurrentfunctions.js"

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

const createthematrix = () => {
  console.log("Wake Up, Neo...")
  for (let row = 0; row <= 8; row++) {
    theMatrix[step][row] = [];
    for (let column = 0; column <= 8; column++) {
      theMatrix[step][row][column] = [0, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    };
  };
};

//Load the values from sudokuvalues variable into de html input fields
const loadthematrix = () => {
  for (let cellvalue = 0; cellvalue < sudokuvalues.length; cellvalue++) {
    document.querySelector(".row" + sudokuvalues[cellvalue][0] + ".column" + sudokuvalues[cellvalue][1] + " input").setAttribute("value", sudokuvalues[cellvalue][2]);
  };
  validatethematrix();
  cellbycellanalysis();
};

//Reload the Matrix (html values and notes) based on a previous step
const thematrixreloaded = () => {
  if (stepsinfo[step][0] === true) cellsresolved--;   
  step--;
  document.querySelector("#button-resolve").disabled = false;
  document.querySelector("#button-resolve").classList.add("active");
  document.querySelector("#button-resolve").classList.remove("inactive");
  document.querySelector("#button-togglenotes").disabled = false;
  document.querySelector("#button-togglenotes").classList.add("active");
  document.querySelector("#button-togglenotes").classList.remove("inactive");
  if (areweshowingnotes === true) hidenotes();
  if (step === 0) {
    document.querySelector("#button-reload").disabled = true;
    document.querySelector("#button-reload").classList.remove("active");
    document.querySelector("#button-reload").classList.add("inactive");
  }
  for (let row = 0; row <= 8; row++) {
    for (let column = 0; column <= 8; column++) {
      let itemrow = row + 1;
      let itemcolumn = column + 1;
      if (theMatrix[step][row][column][0] !== 0) {
        document.querySelector(".row" + itemrow + ".column" + itemcolumn + " input").setAttribute("value", theMatrix[step][row][column][0]);
      } else {
        document.querySelector(".row" + itemrow + ".column" + itemcolumn + " input").setAttribute("value", "");
      };
    };
  };
  if (areweshowingnotes === true) shownotes();
};

//reset the values from the form input
const resetthematrix = () => {
  window.location.reload();
};

//Get the values from the form input into the Matrix
const validatethematrix = () => {
  for (let row = 0; row <= 8; row++) {
    for (let column = 0; column <= 8; column++) {
      let itemrow = row + 1;
      let itemcolumn = column + 1;
      let currentcell = document.querySelector(".row" + itemrow + ".column" + itemcolumn);
      let currentcellvalue = Number(currentcell.querySelector("input").value);
      theMatrix[step][row][column] = [currentcellvalue, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    };
  };
};

// Initial validation used in validatethematrixListener
const cellbycellanalysis = () => {
  // First select each row
  for (let row = 0; row <= 8; row++) {
    for (let column = 0; column <= 8; column++) {
      loopsexecuted++;
      let currentcellvalue = theMatrix[step][row][column][0];
      // If the value is different than zero, it has to set as zero that position in every element of the same row, same column and same square
      if (currentcellvalue != 0) {
        // since this cell already has a value, all the posibilities are marked zero
        theMatrix[step][row][column] = [currentcellvalue, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        optionzeroinrow(row, currentcellvalue);
        optionzeroincolumn(column, currentcellvalue);
        optionzeroinsquare(row, column, currentcellvalue);
        cellsresolved++;
        console.log(`Cells resolved so far: ${cellsresolved}`);
        console.log(`the value in row ${row+1}, column ${column+1} is ${currentcellvalue}`);
      };
    };
  };
  document.querySelector("#button-load").disabled = true;
  document.querySelector("#button-load").classList.remove("active");
  document.querySelector("#button-load").classList.add("inactive");
  document.querySelector("#button-validate").disabled = true;
  document.querySelector("#button-validate").classList.remove("active");
  document.querySelector("#button-validate").classList.add("inactive");
  document.querySelector("#button-resolve").disabled = false;
  document.querySelector("#button-resolve").classList.add("active");
  document.querySelector("#button-resolve").classList.remove("inactive");
  document.querySelector("#button-togglenotes").disabled = false;
  document.querySelector("#button-togglenotes").classList.add("active");
  document.querySelector("#button-togglenotes").classList.remove("inactive");
  document.querySelector("#button-reset").disabled = false;
  document.querySelector("#button-reset").classList.add("active");
  document.querySelector("#button-reset").classList.remove("inactive");
};

//Here, it is mark as zero, each cell in the same row, which contains the currentcellvalue as option yet
const optionzeroinrow = (row, currentcellvalue) => {
  theMatrix[step][row].forEach(function(column_item) {
    column_item[currentcellvalue] = 0
  });
}

//Here, it is mark as zero, each cell in the same column, which contains the currentcellvalue as option yet
const optionzeroincolumn = (column, currentcellvalue) => {
  for (let row_within_column = 0; row_within_column < 9; row_within_column++) {
    theMatrix[step][row_within_column][column][currentcellvalue] = 0
  };
};

//Here, it is mark as zero, each cell in the same block(square), which contains the currentcellvalue as option yet
const optionzeroinsquare = (row, column, currentcellvalue) => {
  const {fromrow, maximumrow, fromcolumn, maximumcolumn} = recurrent.definesquarecoordinatesRC(row, column);
  for (let square_row = fromrow; square_row <= maximumrow; square_row++) {
    for (let square_column = fromcolumn; square_column <= maximumcolumn; square_column++) {
    theMatrix[step][square_row][square_column][currentcellvalue] = 0
    };
  };
};

//function called each time a new value is found by any method
const cellvaluefound = (row, column, currentcellvalue, method) => {
  cellsresolved++;
  step++;
  stepsinfo[step] = [true, method, [row, column, currentcellvalue]];
  theMatrix[step] = JSON.parse(JSON.stringify(theMatrix[step - 1])); //The point where a new step is created in theMatrix, so previous state is saved in step-1. It has to be used these JSON methods to avoid the copy by reference but by value
  console.log(`Cells resolved so far: ${cellsresolved}`);
  document.querySelector("#button-reload").disabled = false; //applies only to step 1, but the if is unnecesary
  document.querySelector("#button-reload").classList.add("active");
  document.querySelector("#button-reload").classList.remove("inactive");
  if (areweshowingnotes === true) hidenotes();
  // here the currentcellvalue is set in theMatrix variable, and the corresponding notes in the cells of the same row, column and squatre deleted
  theMatrix[step][row][column] = [currentcellvalue, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  optionzeroinrow(row, currentcellvalue);
  optionzeroincolumn(column, currentcellvalue);
  optionzeroinsquare(row, column, currentcellvalue);
  // here the foundvalue is set in the html document to be shown, by calling the function newfoundvalueHTML
  let itemrow = row + 1;
  let itemcolumn = column + 1;
  newfoundvalueHTML(itemrow,itemcolumn,currentcellvalue, method);
};

const newfoundvalueHTML = (itemrow, itemcolumn, currentcellvalue, method) => {
  console.log(`the value in row ${itemrow}, column ${itemcolumn} is ${currentcellvalue} by ${method} method`);
  document.querySelector(".row" + itemrow + ".column" + itemcolumn + " input").setAttribute("value", currentcellvalue);
  let newfoundvalueArticle = document.createElement("article");
  newfoundvalueArticle.classList.add("newfoundvalue");
  // newfoundvalueArticle.setAttribute("id", DEFINE-ID);
  newfoundvalueArticle.innerHTML = `
  <p>New Found Value in row ${itemrow}, column ${itemcolumn}, the Value is ${currentcellvalue}, and was found using ${method} method</p>
  `;
  const main = document.querySelector(".found-values > div");
  main.prepend(newfoundvalueArticle);
  if (areweshowingnotes === true) shownotes();
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

////////////////////////////////////////////////////////////////////////////////
//                             SUDOKU TECHNIQUES                             //
//////////////////////////////////////////////////////////////////////////////

// Function to detect when a cell has just 1 option (note)
const singleoptions = () => {
  for (let row = 0; row <= 8; row++) {
    for (let column = 0; column <= 8; column++) {
      loopsexecuted++;
      let currentcellvalue = theMatrix[step][row][column][0];
      //method reduce to obtain the sum of the options in this cell
      const sum = theMatrix[step][row][column].reduce(add, 0);
        function add(accumulator, a) {
          return accumulator + a;
        };
        if (sum-currentcellvalue === 1) {
        //cell solved! iterationsuccess! Detect which value is unique and set it as answer in currentcellvalue
        iterationsuccess = true;
        currentcellvalue = theMatrix[step][row][column].findIndex((one, index) => one === 1 && index > 0);
        cellvaluefound(row, column, currentcellvalue, "Detecting Singles");
        break;
        };
    };
    if (iterationsuccess) break;
  };
};

// Function to detect when a row has a possible value just in one of the 9 cells
const hiddensinglesrow = () => {
  for (let row = 0; row <= 8; row++) {
    for (let possibleoption = 1; possibleoption <=9; possibleoption++) {
      let ishiddensingle = 0;
      let currentcellvalue;
      let columnfound;
      loopsexecuted++;
      for (let column = 0; column <= 8; column++) {
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
        iterationsuccess = true;
        currentcellvalue = possibleoption;
        cellvaluefound(row, columnfound, currentcellvalue, "Detecting Hidden Singles (row)");
        break;
      };
    };
    if (iterationsuccess) break;
  };
}

// Function to detect when a column has a possible value just in one of the 9 cells
const hiddensinglescolumn = () => {
  for (let column = 0; column <= 8; column++) {
    for (let possibleoption = 1; possibleoption <=9; possibleoption++) {
      let ishiddensingle = 0;
      let currentcellvalue;
      let rowfound;
      loopsexecuted++;
      for (let row = 0; row <= 8; row++) {
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
        iterationsuccess = true;
        currentcellvalue = possibleoption;
        cellvaluefound(rowfound, column, currentcellvalue, "Detecting Hidden Singles (column)");
        break;
      };
    };
    if (iterationsuccess) break;
  };
}

// Function to detect when an square has a possible value just in one of the 9 cells
const hiddensinglessquare = () => {
  for (let square = 1; square <= 9; square++) {
    const { fromrow, maximumrow, fromcolumn, maximumcolumn } = recurrent.definesquarecoordinatesSQ(square);
    for (let possibleoption = 1; possibleoption <=9; possibleoption++) {
      let ishiddensingle = 0;
      let currentcellvalue;
      let rowfound;
      let columnfound;
      loopsexecuted++;

      for (let square_row = fromrow; square_row <= maximumrow; square_row++) {
        for (let square_column = fromcolumn; square_column <= maximumcolumn; square_column++) {
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
        iterationsuccess = true;
        currentcellvalue = possibleoption;
        cellvaluefound(rowfound, columnfound, currentcellvalue, "Detecting Hidden Singles (square)");
        break;
      };
    if (iterationsuccess) break;
    };
  if (iterationsuccess) break; //so, it just find one solution per loop
  };
};

// Function to detect when a row has obvious pairs
const obviouspairsrow = () => {
  
  for (let row = 0; row <= 8; row++) { 
    let answersrow = [0,0,0,0,0,0,0,0,0,0];
    for (let column = 0; column <= 8; column++) {
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
                optionzeroinrow(row, currentcellvalue1);
                optionzeroinrow(row, currentcellvalue2);
                //But here, it is restablished as notes for the pair of cells
                theMatrix[step][row][column1][currentcellvalue1] = 1;
                theMatrix[step][row][column1][currentcellvalue2] = 1;
                theMatrix[step][row][column2][currentcellvalue1] = 1;
                theMatrix[step][row][column2][currentcellvalue2] = 1;
                if (areweshowingnotes === true) {
                  hidenotes();
                };
                areweshowingnotes = true;
                shownotes();
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
    lockedcandidate(answersrow, whereisthisnote);
    if (discardnotessuccess) break;
  };
};

// Function to detect when a column has obvious pairs
const obviouspairscolumn = () => {
  
  for (let column = 0; column <= 8; column++) { 
    let answerscolumn = [0,0,0,0,0,0,0,0,0,0];
    for (let row = 0; row <= 8; row++) {
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
                optionzeroincolumn(column, currentcellvalue1);
                optionzeroincolumn(column, currentcellvalue2);
                //But here, it is restablished as notes for the pair of cells
                theMatrix[step][row1][column][currentcellvalue1] = 1;
                theMatrix[step][row1][column][currentcellvalue2] = 1;
                theMatrix[step][row2][column][currentcellvalue1] = 1;
                theMatrix[step][row2][column][currentcellvalue2] = 1;
                if (areweshowingnotes === true) {
                  hidenotes();
                  };
                areweshowingnotes = true;
                shownotes();
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
    lockedcandidate(answerscolumn, whereisthisnote);
    if (discardnotessuccess) break;
  };
};

// Function to detect when an square has obvious pairs
const obviouspairssquare = () => {
  
  for (let square = 1; square <= 9; square++) {
    const {fromrow, maximumrow, fromcolumn, maximumcolumn} = recurrent.definesquarecoordinatesSQ(square);
    //It is consolidated in one array (1*10 first index value (0) not used) the answers for this square already known
    let answerssquare = [0,0,0,0,0,0,0,0,0,0];
    for (let square_column = fromcolumn; square_column <= maximumcolumn; square_column++) { 
      for (let square_row = fromrow; square_row <= maximumrow; square_row++) {
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
                //Here we take advantage of the functions to delete the notes of found values
                optionzeroinsquare(realrow1, realcolumn2, currentcellvalue1);
                optionzeroinsquare(realrow2, realcolumn2, currentcellvalue2);
                //But here, it is restablished as notes for the pair of cells
                theMatrix[step][realrow1][realcolumn1][currentcellvalue1] = 1;
                theMatrix[step][realrow1][realcolumn1][currentcellvalue2] = 1;
                theMatrix[step][realrow2][realcolumn2][currentcellvalue1] = 1;
                theMatrix[step][realrow2][realcolumn2][currentcellvalue2] = 1;
                if (areweshowingnotes === true) {
                  hidenotes();
                  };
                areweshowingnotes = true;
                shownotes();
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
    lockedcandidate(answerssquare, whereisthisnote);
    if (discardnotessuccess) break;
  };
};

const lockedcandidate = (answers, whereisthisnote) => {
  for (let possibleoption = 1; possibleoption <= 9; possibleoption++) {
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


//Function used to add html config with a 9 cells grid per each of the original divs to show the notes of each cell
const shownotes = () => {
  for (let row = 0; row <= 8; row++) {
    let newdivoption;
    for (let column = 0; column <= 8; column++) {
      let itemrow = row + 1;
      let itemcolumn = column + 1;
      if (theMatrix[step][row][column][0] === 0) {
        document.querySelector(".row" + itemrow + ".column" + itemcolumn + " input").remove();
        document.querySelector(".row" + itemrow + ".column" + itemcolumn).classList.add("notes")
        let newdivoption = document.createElement("div");
        for (let note = 1; note <= 9; note++) {
          let newnote = document.createElement("p");
          newnote.classList.add(`note${note}`);
          if (theMatrix[step][row][column][note] !== 0) {
            newnote.innerHTML = `
            ${note}
            `;
          }
          newdivoption.append(newnote);
        };
        const main = document.querySelector(".row" + itemrow + ".column" + itemcolumn);
        main.append(newdivoption);
      };
    };
  };
  let togglebutton = document.querySelector("#button-togglenotes");
  togglebutton.innerText = "Hide Notes";
};

const hidenotes = () => {
  for (let row = 0; row <= 8; row++) {
    for (let column = 0; column <= 8; column++) {
      if (theMatrix[step][row][column][0] === 0) {
        let itemrow = row + 1;
        let itemcolumn = column + 1;
        let newdivoption;
        document.querySelector(".row" + itemrow + ".column" + itemcolumn).classList.remove("notes");
        newdivoption = document.createElement("div");
        newdivoption.classList.add("cell", `row${itemrow}`, `column${itemcolumn}`);
        newdivoption.innerHTML = `
        <input type="number" min="1" max="9">
        `;
        const main = document.querySelector(".row" + itemrow + ".column" + itemcolumn);
        main.replaceWith(newdivoption);
      };
    };
  };
  let togglebutton = document.querySelector("#button-togglenotes");
  togglebutton.innerText = "Show Notes";
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
const loadthematrixListener = () => {
  button_load.addEventListener("click", (e) => {
    // Stop form from reloading the page
    e.preventDefault();
    loadthematrix();
  });
};

// Add event listener to the Load button
const reloadthematrixListener = () => {
  button_reload.addEventListener("click", (e) => {
    // Stop form from reloading the page
    e.preventDefault();
    thematrixreloaded();
  });
};

// Add event listener to the Validate button
const validatethematrixListener = () => {
  button_validate.addEventListener("click", (e) => {
    // Stop form from reloading the page
    e.preventDefault();
    validatethematrix();
    cellbycellanalysis();
  });
};

// Add event listener to the reset button
const resetthematrixListener = () => {
  button_reset.addEventListener("click", (e) => {
    // Stop form from reloading the page
    e.preventDefault();
    resetthematrix();
  });
};

// Add event listener to the ShowNotes button
const togglenotesListener = () => {
  button_togglenotes.addEventListener("click", (e) => {
    // Stop form from reloading the page
    e.preventDefault();
    if (areweshowingnotes === false) {
      areweshowingnotes = true;
      shownotes();
    } else {
      areweshowingnotes = false;
      hidenotes();
    };
  });
};

// Add event listener to the ShowNotes button
const inputListener = () => {
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
const resolvethematrixListener = () => {
  button_resolve.addEventListener("click", (e) => {
    // Stop form from reloading the page
    e.preventDefault();
    singleoptions(loopsexecuted, iterationsuccess, theMatrix, step);
    if (iterationsuccess === false && discardnotessuccess === false) {
      hiddensinglessquare();
    };
    if (iterationsuccess === false && discardnotessuccess === false) {
      hiddensinglesrow();
    };
    if (iterationsuccess === false && discardnotessuccess === false) {
      hiddensinglescolumn();
    };
    if (iterationsuccess === false && discardnotessuccess === false) {
      obviouspairsrow();
    };
    if (iterationsuccess === false && discardnotessuccess === false) {
      obviouspairscolumn();
    };
    if (iterationsuccess === false && discardnotessuccess === false) {
      obviouspairssquare();
    };

    iterationsuccess = false;
    discardnotessuccess = false;
    if (cellsresolved === 81) {
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
let loopsexecuted = 0;
let cellsresolved = 0;
let step = 0;
let stepsinfo = []; //Stepsinfo [steptype, Method, [Step detailed info]]
let iterationsuccess = false;
let discardnotessuccess = false;
let areweshowingnotes = false;

//Initial state defined in the html, no need to change classes
document.querySelector("#button-validate").disabled = true
document.querySelector("#button-reload").disabled = true
document.querySelector("#button-resolve").disabled = true
document.querySelector("#button-togglenotes").disabled = true
document.querySelector("#button-reset").disabled = true

createthematrix();
//activate the Listeners
validatethematrixListener();
resetthematrixListener();
resolvethematrixListener();
reloadthematrixListener();
loadthematrixListener();
togglenotesListener();
inputListener();