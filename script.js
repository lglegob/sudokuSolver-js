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
  [1, 4, 5],
  [1, 7, 1],
  
  [2, 1, 5],
  [2, 3, 6],
  [2, 4, 1],
  [2, 5, 3],
  [2, 6, 2],

  [3, 1, 9],
  [3, 9, 8],
  
  [4, 6, 7],
  [4, 7, 9],
  [4, 9, 3],
  
  [5, 4, 9],
  [5, 5, 1],
  
  [6, 1, 7],
  [6, 5, 8],
  [6, 8, 5],

  [7, 1, 3],
  [7, 2, 7],
  [7, 4, 2],
  
  [8, 9, 6],

  [9, 2, 2],
  [9, 8, 4],
  [9, 9, 5]
]

//For loop to create the base 3D Matrix
const loadthematrix = () => {
  console.log("...Wake Up Neo")
  for (let cellvalue = 0; cellvalue < sudokuvalues.length; cellvalue++) {
    document.querySelector(".row" + sudokuvalues[cellvalue][0] + ".column" + sudokuvalues[cellvalue][1] + " input").setAttribute("value", sudokuvalues[cellvalue][2]);
  };
};

//For loop to create the base 3D Matrix
const createthematrix = () => {
  for (let row = 0; row <= 8; row++) {
    theMatrix[row] = [];
    for (let column = 0; column <= 8; column++) {
      theMatrix[row][column] = [0, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    };
  };
};

//Clear the values from the form input
const clearthematrix = () => {
  for (let row = 0; row <= 8; row++) {
    for (let column = 0; column <= 8; column++) {
      let itemrow = row + 1;
      let itemcolumn = column + 1;
      document.querySelector(".row" + itemrow + ".column" + itemcolumn + " input").value = undefined;
    };
  };
};

const validatethematrix = () => {
  //Get the values from the form input into the Matrix
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
};

const optionzeroinrow = (row, currentcellvalue) => {
  //Here, we mark as zero, each cell in the same row, which contains the currentcellvalue as option yet
  theMatrix[row].forEach(function(column_item) {
    column_item[currentcellvalue] = 0
  });
}

const optionzeroincolumn = (column, currentcellvalue) => {
  for (let row_within_column = 0; row_within_column < 9; row_within_column++) {
    theMatrix[row_within_column][column][currentcellvalue] = 0
  };
};

const optionzeroinsquare = (row, column, currentcellvalue) => {
  let fromrow;
  let maximumrow;
  let fromcolumn;
  let maximumcolumn;
  //Here, we marked zero, each cell in the same square, which contains the currentcellvalue as option yet
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

const cellvaluefound = (row, column, currentcellvalue, method) => {
  cellsresolved++;
  console.log(`Cells resolved so far: ${cellsresolved}`);
  console.log(`the value in row ${row+1}, column ${column+1} is ${currentcellvalue} by ${method} method`);
  // here the currentcellvalue is set in theMatrix variable
  theMatrix[row][column] = [currentcellvalue, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  optionzeroinrow(row, currentcellvalue);
  optionzeroincolumn(column, currentcellvalue);
  optionzeroinsquare(row, column, currentcellvalue);
  // here the foundvalue is set in the html document to be shown
  let itemrow = row + 1;
  let itemcolumn = column + 1;
  document.querySelector(".row" + itemrow + ".column" + itemcolumn + " input").setAttribute("value", currentcellvalue);
};

const detectsingleoptions = () => {
  for (let row = 0; row <= 8; row++) {
    for (let column = 0; column <= 8; column++) {
      loopsexecuted++;
      let currentcellvalue = theMatrix[row][column][0];
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
}

const detecthiddensinglesrow = () => {
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

const detecthiddensinglescolumn = () => {
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

const detecthiddensinglessquare = () => {
  for (let square = 1; square <= 9; square++) {
    for (let possibleoption = 1; possibleoption <=9; possibleoption++) {
      let ishiddensingle = 0;
      let currentcellvalue;
      let rowfound;
      let columnfound;
      loopsexecuted++;

      let fromrow;
      let maximumrow;
      let fromcolumn;
      let maximumcolumn;
      //Here, it is defined depending the square the range of rows and columns to evaluate
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
  };
};

// definining elements for Event Listeners
const button_cargar = document.querySelector(".button-cargar");
const button_validar = document.querySelector(".button-validar");
const button_resolver = document.querySelector(".button-resolver");
const button_clear = document.querySelector(".button-clear");

// Add event listener to the Load button
const loadthematrixListener = () => {
  button_cargar.addEventListener("click", (e) => {
    // Stop form from reloading the page
    e.preventDefault();
    loadthematrix();
  });
};

// Add event listener to the Validate button
const validatethematrixListener = () => {
  button_validar.addEventListener("click", (e) => {
    // Stop form from reloading the page
    e.preventDefault();
    validatethematrix();
    cellbycellanalysis();
  });
};

// Add event listener to the Clear button
const clearthematrixListener = () => {
  button_clear.addEventListener("click", (e) => {
    // Stop form from reloading the page
    e.preventDefault();
    clearthematrix();
  });
};

// Add event listener to the Resolve Button
const resolvethematrixListener = () => {
  button_resolver.addEventListener("click", (e) => {
    // Stop form from reloading the page
    e.preventDefault();
    detectsingleoptions();
    if (iterationsuccess === false) {
      detecthiddensinglesrow();
    };
    if (iterationsuccess === false) {
      detecthiddensinglescolumn();
    };
    if (iterationsuccess === false) {
      detecthiddensinglessquare();
    };
    iterationsuccess = false;
    // console.log(theMatrix);
    // console.log(`loopsexecuted: ${loopsexecuted}`);
  });
};

let theMatrix = [];
let loopsexecuted = 0;
let cellsresolved = 0;
let iterationsuccess = false;
createthematrix();
//activate the Listeners
validatethematrixListener();
clearthematrixListener();
resolvethematrixListener();
loadthematrixListener();