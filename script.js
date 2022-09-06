'use strict';
// First Step - check NO repeated numbers per row, column and square

// Delete options from rows, columns and squares
// Nested Loops
// Second Step -  check cells with just one option
// Third Step - hidden singles - check rows, columns and squares where any number appears just once
// Fourth Step - check numbers per row and column, that appear only in one of the squares, amd delete the possibilities in any other cell in the square
// Fifth step - check for obvious pairs per row, column and square
// Sixth Step - hidden pairs - square
// Sixth Step - Obvious Triples (even with doubles)

const sudokuvalues = [
  [1, 3, 4],
  [1, 7, 7],
  [1, 9, 3],
  
  [2, 1, 8],
  [2, 4, 9],
  [2, 6, 2],

  [3, 2, 3],
  
  [4, 2, 8],
  [4, 3, 9],
  [4, 4, 1],
  
  [5, 1, 5],
  [5, 9, 8],
  
  [6, 6, 9],
  [6, 7, 2],
  [6, 8, 6],

  [7, 8, 2],
  
  [8, 4, 8],
  [8, 6, 4],
  [8, 9, 5],

  [9, 1, 6],
  [9, 3, 5],
  [9, 7, 1]
]

//For loop to create the base 3D Matrix
//The 3D matrix is formed with 3 dimensions, the first dimension with 9 internal arrays, 1 array for each row in the Sudoku Matrix
//The second dimension (each of the 9 arrays) has as well 9 arrays inside (81 nested total for the 81 cells in the sudoku array), one array for each value in the row
//The third dimension (each of the 81 (9*9) nested arrays) is an array of 10 numbers, the first one is for the value of the cell (if already known or zero if not known)
//the other 9 numbers (indexes 1-9 show the notes for each of the cells of the sudoku array)
// theMatrix Structure --> [[row][row]...[row][row]]
// Each row Structure  --> [[column cell][column cell]...[column cell][column cell]]
// Each Column Cell    --> [[answer][note 1][note 2][note 3]...[note 9]]

const createthematrix = () => {
  console.log("Wake Up, Neo...")
  for (let row = 0; row <= 8; row++) {
    theMatrix[row] = [];
    for (let column = 0; column <= 8; column++) {
      theMatrix[row][column] = [0, 1, 1, 1, 1, 1, 1, 1, 1, 1];
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

//reset the values from the form input
const resetthematrix = () => {
  window.location.reload();
  // for (let row = 0; row <= 8; row++) {
  //   for (let column = 0; column <= 8; column++) {
  //     let itemrow = row + 1;
  //     let itemcolumn = column + 1;
  //     document.querySelector(".row" + itemrow + ".column" + itemcolumn + " input").value = undefined;
  //   };
  // };
  // document.querySelector("#button-load").disabled = false
  // document.querySelector("#button-validate").disabled = true
  // document.querySelector("#button-resolve").disabled = true
  // document.querySelector("#button-shownotes").disabled = true
  // document.querySelector("#button-reset").disabled = true
  // let theMatrix = [];
  // let loopsexecuted = 0;
  // let cellsresolved = 0;
  // let areweshowingnotes = false;
};

//Get the values from the form input into the Matrix
const validatethematrix = () => {
  for (let row = 0; row <= 8; row++) {
    for (let column = 0; column <= 8; column++) {
      let itemrow = row + 1;
      let itemcolumn = column + 1;
      let currentcell = document.querySelector(".row" + itemrow + ".column" + itemcolumn);
      let currentcellvalue = Number(currentcell.querySelector("input").value);
      theMatrix[row][column] = [currentcellvalue, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    };
  };
};

// Initial validation used in validatethematrixListener
const cellbycellanalysis = () => {
  // First select each row
  for (let row = 0; row <= 8; row++) {
    for (let column = 0; column <= 8; column++) {
      loopsexecuted++;
      let currentcellvalue = theMatrix[row][column][0];
      // If the value is different than zero, it has to set as zero that position in every element of the same row, same column and same square
      if (currentcellvalue != 0) {
        // since this cell already has a value, all the posibilities are marked zero
        theMatrix[row][column] = [currentcellvalue, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        optionzeroinrow(row, currentcellvalue);
        optionzeroincolumn(column, currentcellvalue);
        optionzeroinsquare(row, column, currentcellvalue);
        cellsresolved++;
        console.log(`Cells resolved so far: ${cellsresolved}`);
        console.log(`the value in row ${row+1}, column ${column+1} is ${currentcellvalue}`);
      };
    };
  };
  document.querySelector("#button-load").disabled = true
  document.querySelector("#button-validate").disabled = true
  document.querySelector("#button-resolve").disabled = false
  document.querySelector("#button-togglenotes").disabled = false
  document.querySelector("#button-reset").disabled = false
};

//Here, it is mark as zero, each cell in the same row, which contains the currentcellvalue as option yet
const optionzeroinrow = (row, currentcellvalue) => {
  theMatrix[row].forEach(function(column_item) {
    column_item[currentcellvalue] = 0
  });
}

//Here, it is mark as zero, each cell in the same column, which contains the currentcellvalue as option yet
const optionzeroincolumn = (column, currentcellvalue) => {
  for (let row_within_column = 0; row_within_column < 9; row_within_column++) {
    theMatrix[row_within_column][column][currentcellvalue] = 0
  };
};

//Here, it is mark as zero, each cell in the same block(square), which contains the currentcellvalue as option yet
const optionzeroinsquare = (row, column, currentcellvalue) => {
  let fromrow;
  let maximumrow;
  let fromcolumn;
  let maximumcolumn;
  switch (true) {
    case row <= 2:
      fromrow = 0
      maximumrow = 2
      break;
    case row <= 5:
      fromrow = 3
      maximumrow = 5
      break;
    case row <= 8:
      fromrow = 6
      maximumrow = 8
      break;
  }
  switch (true) {
    case column <= 2:
      fromcolumn = 0
      maximumcolumn = 2
      break;
    case column <= 5:
      fromcolumn = 3
      maximumcolumn = 5
      break;
    case row <= 8:
      fromcolumn = 6
      maximumcolumn = 8
      break;
  }
  for (let square_row = fromrow; square_row <= maximumrow; square_row++) {
    for (let square_column = fromcolumn; square_column <= maximumcolumn; square_column++) {
    theMatrix[square_row][square_column][currentcellvalue] = 0
    };
  };
};

//function called each time a new value is found by any method
const cellvaluefound = (row, column, currentcellvalue, method) => {
  cellsresolved++;
  console.log(`Cells resolved so far: ${cellsresolved}`);
  if (areweshowingnotes === true) hidenotes();
  // here the currentcellvalue is set in theMatrix variable, and the corresponding notes in the cells of the same row, column and squatre deleted
  theMatrix[row][column] = [currentcellvalue, 0, 0, 0, 0, 0, 0, 0, 0, 0]
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

const discardedvaluesHTML = (mainaxis, mainaxisvalue, secondaryaxis, secondaryaxisvalue1, secondaryaxisvalue2, value1, value2, method) => {
  console.log("We found an Obvious Pair!")
  console.log(`We are looking at ${mainaxis} ${mainaxisvalue + 1}, the first cell is ${secondaryaxis} ${secondaryaxisvalue1 + 1}, and the second cell is ${secondaryaxis} ${secondaryaxisvalue2 + 1}`)
  console.log(`The notes are ${value1} and ${value2}, they have been deleted from the ${mainaxis} ${mainaxisvalue + 1}`);
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
      let currentcellvalue = theMatrix[row][column][0];
      //method reduce to obtain the sum of the options in this cell
      const sum = theMatrix[row][column].reduce(add, 0);
        function add(accumulator, a) {
          return accumulator + a;
        };
        if (sum-currentcellvalue === 1) {
        //cell solved! iterationsuccess! Detect which value is unique and set it as answer in currentcellvalue
        iterationsuccess = true;
        currentcellvalue = theMatrix[row][column].findIndex((one, index) => one === 1 && index > 0)
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
        currentcellvalue = theMatrix[row][column][0];
        //this if evalutes the cell does not have a solved value yet and that the possiblevalue in evaluation is present in this cell
        if (currentcellvalue === 0 && theMatrix[row][column][possibleoption] === 1) {
          //This cell has not yet been resolved, it sums the values of each option position to find a hidden single
          ishiddensingle++
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
        currentcellvalue = theMatrix[row][column][0];
        //this if evalutes the cell does not have a solved value yet and that the possiblevalue in evaluation is present in this cell
        if (currentcellvalue === 0 && theMatrix[row][column][possibleoption] === 1) {
          //This cell has not yet been resolved, it sums the values of each option position to find a hidden single
          ishiddensingle++
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
    //Here, it is defined depending the square the range of rows and columns to evaluate
    let fromrow;
    let maximumrow;
    let fromcolumn;
    let maximumcolumn;
    switch (true) {
      case (square === 1 || square === 4 || square == 7):
        fromcolumn = 0
        maximumcolumn = 2
        break;
      case (square === 2 || square === 5 || square == 8):
        fromcolumn = 3
        maximumcolumn = 5
        break;
      case (square === 3 || square === 6 || square == 9):
        fromcolumn = 6
        maximumcolumn = 8
        break;
    }
    switch (true) {
      case square <= 3:
        fromrow = 0
        maximumrow = 2
        break;
      case square <= 6:
        fromrow = 3
        maximumrow = 5
        break;
      case square <= 9:
        fromrow = 6
        maximumrow = 8
        break;
    }
    
    for (let possibleoption = 1; possibleoption <=9; possibleoption++) {
      let ishiddensingle = 0;
      let currentcellvalue;
      let rowfound;
      let columnfound;
      loopsexecuted++;

      for (let square_row = fromrow; square_row <= maximumrow; square_row++) {
        for (let square_column = fromcolumn; square_column <= maximumcolumn; square_column++) {
          currentcellvalue = theMatrix[square_row][square_column][0];
          //this if evalutes the cell does not have a solved value yet and that the possiblevalue in evaluation is present in this cell
          if (currentcellvalue === 0 && theMatrix[square_row][square_column][possibleoption] === 1) {
            //This cell has not yet been resolved, it sums the values of each option position to find a hidden single
            ishiddensingle++
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
      if (theMatrix[row][column][0] !== 0) {
        //It is consolidated in one array (1*10 first index value (0) not used) the answers for this row
        answersrow[theMatrix[row][column][0]] = 1
        
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
          if (theMatrix[row][column][possibleoption] === 1) {
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
            let cell1notes = theMatrix[row][column1];
            let cell2notes = theMatrix[row][column2];
            if (cell1notes.every((val, index) => val === cell2notes[index])) {
              const isthenotehere = (note) => note === 1;
              let currentcellvalue1 = cell1notes.indexOf(1);
              let currentcellvalue2 = cell1notes.indexOf(1, currentcellvalue1 + 1);
              //This if is to make sure the pair found has notes in other cells and declare them as obvious Pair
              if (howmanycellswiththisnote[currentcellvalue1] > 2 || howmanycellswiththisnote[currentcellvalue2] > 2) {
                // console.log("I found an Obvious Pair!")
                // console.log(`I am looking at row ${row + 1}, the first cell is column ${column1 + 1}, and the second cell is column ${column2 + 1}`)
                // console.log(`The notes are ${currentcellvalue1} and ${currentcellvalue2}, they have been deleted from the row ${row}`);
                //Here we take advantage of the functions to delete the notes of found values
                optionzeroinrow(row, currentcellvalue1);
                optionzeroinrow(row, currentcellvalue2);
                //But here, it is restablished as notes for the pair of cells
                theMatrix[row][column1][currentcellvalue1] = 1;
                theMatrix[row][column1][currentcellvalue2] = 1;
                theMatrix[row][column2][currentcellvalue1] = 1;
                theMatrix[row][column2][currentcellvalue2] = 1;
                if (areweshowingnotes === true) {
                hidenotes();
                };
                areweshowingnotes = true;
                shownotes();
                discardnotessuccess = true;
                discardedvaluesHTML("row", row, "column", column1, column2, currentcellvalue1, currentcellvalue2, "Detecting Obvius Pair (Row)");
                break;
              };
            };
          };
        };
        if (discardnotessuccess) break;
      };
    };
    if (discardnotessuccess) break;
  };
};

// Function to detect when a column has obvious pairs
const obviouspairscolumn = () => {
  
  for (let column = 0; column <= 8; column++) { 
    let answerscolumn = [0,0,0,0,0,0,0,0,0,0];
    for (let row = 0; row <= 8; row++) {
      if (theMatrix[row][column][0] !== 0) {
        //It is consolidated in one array (1*10 first index value (0) not used) the answers for this column
        answerscolumn[theMatrix[row][column][0]] = 1
      }
    }

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
          if (theMatrix[row][column][possibleoption] === 1) {
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
            let cell1notes = theMatrix[row1][column];
            let cell2notes = theMatrix[row2][column];
            if (cell1notes.every((val, index) => val === cell2notes[index])) {
              const isthenotehere = (note) => note === 1;
              let currentcellvalue1 = cell1notes.indexOf(1);
              let currentcellvalue2 = cell1notes.indexOf(1, currentcellvalue1 + 1);
              //This if is to make sure the pair found has notes in other cells and declare them as obvious Pair
              if (howmanycellswiththisnote[currentcellvalue1] > 2 || howmanycellswiththisnote[currentcellvalue2] > 2) {
                //Here we take advantage of the functions to delete the notes of found values
                optionzeroincolumn(column, currentcellvalue1);
                optionzeroincolumn(column, currentcellvalue2);
                //But here, it is restablished as notes for the pair of cells
                theMatrix[row1][column][currentcellvalue1] = 1;
                theMatrix[row1][column][currentcellvalue2] = 1;
                theMatrix[row2][column][currentcellvalue1] = 1;
                theMatrix[row2][column][currentcellvalue2] = 1;
                if (areweshowingnotes === true) {
                  hidenotes();
                  };
                  areweshowingnotes = true;
                  shownotes();
                discardnotessuccess = true;
                discardedvaluesHTML("column", column, "row", row1, row2, currentcellvalue1, currentcellvalue2, "Detecting Obvius Pair (Column)");
                break;
              };
            };
          };
        };
        if (discardnotessuccess) break;
      };
    };
    if (discardnotessuccess) break;
  };
};

// Function to detect when an square has obvious pairs
const obviouspairssquare = () => {
  
  for (let square = 1; square <= 9; square++) {
    //Here, it is defined depending the square the range of rows and columns to evaluate
    let fromrow;
    let maximumrow;
    let fromcolumn;
    let maximumcolumn;
    switch (true) {
      case (square === 1 || square === 4 || square == 7):
        fromcolumn = 0
        maximumcolumn = 2
        break;
      case (square === 2 || square === 5 || square == 8):
        fromcolumn = 3
        maximumcolumn = 5
        break;
      case (square === 3 || square === 6 || square == 9):
        fromcolumn = 6
        maximumcolumn = 8
        break;
    }
    switch (true) {
      case square <= 3:
        fromrow = 0
        maximumrow = 2
        break;
      case square <= 6:
        fromrow = 3
        maximumrow = 5
        break;
      case square <= 9:
        fromrow = 6
        maximumrow = 8
        break;
    }

    //It is consolidated in one array (1*10 first index value (0) not used) how many notes for each possibleoption in this square
    let answerssquare = [0,0,0,0,0,0,0,0,0,0];
    for (let square_column = fromcolumn; square_column <= maximumcolumn; square_column++) { 
      for (let square_row = fromrow; square_row <= maximumrow; square_row++) {
        if (theMatrix[square_row][square_column][0] !== 0) {
          //It is consolidated in one array (1*10 first index value (0) not used) the answers for this column
          answerssquare[theMatrix[square_row][square_column][0]] = 1
          
        }
      }
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
            if (theMatrix[square_row][square_column][possibleoption] === 1) {
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
            let cell1notes = theMatrix[realrow1][realcolumn1];
            let cell2notes = theMatrix[realrow2][realcolumn2];
            if (cell1notes.every((val, index) => val === cell2notes[index])) {
              let currentcellvalue1 = cell1notes.indexOf(1);
              let currentcellvalue2 = cell1notes.indexOf(1, currentcellvalue1 + 1);
              //This if is to make sure the pair found has notes in other cells and declare them as obvious Pair
              if (howmanycellswiththisnote[currentcellvalue1] > 2 || howmanycellswiththisnote[currentcellvalue2] > 2) {
                //Here we take advantage of the functions to delete the notes of found values
                optionzeroinsquare(realrow1, realcolumn2, currentcellvalue1);
                optionzeroinsquare(realrow2, realcolumn2, currentcellvalue2);
                //But here, it is restablished as notes for the pair of cells
                theMatrix[realrow1][realcolumn1][currentcellvalue1] = 1;
                theMatrix[realrow1][realcolumn1][currentcellvalue2] = 1;
                theMatrix[realrow2][realcolumn2][currentcellvalue1] = 1;
                theMatrix[realrow2][realcolumn2][currentcellvalue2] = 1;
                if (areweshowingnotes === true) {
                  hidenotes();
                  };
                  areweshowingnotes = true;
                  shownotes();
                discardnotessuccess = true;
                discardedvaluesHTML("square", square - 1, "row", realrow1, realrow2, currentcellvalue1, currentcellvalue2, "Detecting Obvius Pair (Square)");
                break;
              };
            };
          };
        };
        if (discardnotessuccess) break;
      };
    };
    if (discardnotessuccess) break;
  };
};

//Function used to add html config with a 9 cells grid per each of the original divs to show the notes of each cell
const shownotes = () => {
  for (let row = 0; row <= 8; row++) {
    let newdivoption;
    for (let column = 0; column <= 8; column++) {
      let itemrow = row + 1;
      let itemcolumn = column + 1;
      if (theMatrix[row][column][0] === 0) {
        document.querySelector(".row" + itemrow + ".column" + itemcolumn + " input").remove();
        document.querySelector(".row" + itemrow + ".column" + itemcolumn).classList.add("notes")
        let newdivoption = document.createElement("div");
        for (let note = 1; note <= 9; note++) {
          let newnote = document.createElement("p");
          if (theMatrix[row][column][note] !== 0) {
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
  togglebutton.innerText = "Hide Notas";
};

const hidenotes = () => {
  for (let row = 0; row <= 8; row++) {
    for (let column = 0; column <= 8; column++) {
      if (theMatrix[row][column][0] === 0) {
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
  togglebutton.innerText = "Show Notas";
};

// definining elements for Event Listeners
const button_load = document.querySelector("#button-load");
const button_validate = document.querySelector("#button-validate");
const button_resolve = document.querySelector("#button-resolve");
const button_reset = document.querySelector("#button-reset");
const button_togglenotes = document.querySelector("#button-togglenotes");
const input_cellvalues = document.querySelectorAll(".theMatrix input");

// Add event listener to the Load button
const loadthematrixListener = () => {
  button_load.addEventListener("click", (e) => {
    // Stop form from reloading the page
    e.preventDefault();
    loadthematrix();
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
      document.querySelector("#button-validate").disabled = false;
      document.querySelector("#button-reset").disabled = false;
    });
  });
};


// Add event listener to the Resolve Button
const resolvethematrixListener = () => {
  button_resolve.addEventListener("click", (e) => {
    // Stop form from reloading the page
    e.preventDefault();
    singleoptions();
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
      document.querySelector("#button-resolve").disabled = true
      document.querySelector("#button-togglenotes").disabled = true
    }
    // console.log(theMatrix);
    // console.log(`loopsexecuted: ${loopsexecuted}`);
  });
};

let theMatrix = [];
let loopsexecuted = 0;
let cellsresolved = 0;
let iterationsuccess = false;
let discardnotessuccess = false;
let areweshowingnotes = false;

document.querySelector("#button-validate").disabled = true
document.querySelector("#button-resolve").disabled = true
document.querySelector("#button-togglenotes").disabled = true
document.querySelector("#button-reset").disabled = true

createthematrix();
//activate the Listeners
validatethematrixListener();
resetthematrixListener();
resolvethematrixListener();
loadthematrixListener();
togglenotesListener();
inputListener();