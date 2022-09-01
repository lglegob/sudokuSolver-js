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
  //Get the value from the form input
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

// Delete option from the rows
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
        console.log(`the value in row ${row}, column ${column} is ${currentcellvalue}`);
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
      maximumrow = 3
      break;
    case row <= 5:
      fromrow = 3
      maximumrow = 6
      break;
    case row <= 8:
      fromrow = 6
      maximumrow = 9
      break;
  }
  switch (true) {
    case column <= 2:
      fromcolumn = 0
      maximumcolumn = 3
      break;
    case column <= 5:
      fromcolumn = 3
      maximumcolumn = 6
      break;
    case row <= 8:
      fromcolumn = 6
      maximumcolumn = 9
      break;
  }
  for (let square_row = fromrow; square_row < maximumrow; square_row++) {
    for (let square_column = fromcolumn; square_column < maximumcolumn; square_column++) {
    theMatrix[square_row][square_column][currentcellvalue] = 0
    };
  };
}

const cellvaluefound = (row, column, currentcellvalue) => {
  cellsresolved++;
  console.log(`Cells resolved so far: ${cellsresolved}`);
  console.log(`the value in row ${row}, column ${column} is ${currentcellvalue}`);
  // here the currentcellvalue is set in theMatrix variable
  theMatrix[row][column][0] = currentcellvalue;
  optionzeroinrow(row, currentcellvalue);
  optionzeroincolumn(column, currentcellvalue);
  optionzeroinsquare(row, column, currentcellvalue);
  // here the foundvalue is set in the html document to be shown
  let itemrow = row + 1;
  let itemcolumn = column + 1;
  document.querySelector(".row" + itemrow + ".column" + itemcolumn + " input").setAttribute("value", currentcellvalue);
}

const detectsingleoptions = () => {
  for (let row = 0; row <= 8; row++) {
    for (let column = 0; column <= 8; column++) {
      loopsexecuted++;
      let currentcellvalue = theMatrix[row][column][0];
      const sum = theMatrix[row][column].reduce(add, 0);
        function add(accumulator, a) {
          return accumulator + a;
        }
        if (sum-currentcellvalue == 1) {
        //Detect which value is unique and set it as answer in currentcellvalue
        currentcellvalue = theMatrix[row][column].findIndex((one, index) => one === 1 && index > 0)
        cellvaluefound(row, column, currentcellvalue);
        }
    };
  };
}

// definining elements for Event Listeners
const button_validar = document.querySelector(".button-validar");
const button_resolver = document.querySelector(".button-resolver");
const button_clear = document.querySelector(".button-clear");

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
    console.log(theMatrix);
    console.log(`loopsexecuted: ${loopsexecuted}`);
  });
}

let theMatrix = [];
let loopsexecuted = 0;
let cellsresolved = 0;
createthematrix();
//activate the Listeners
validatethematrixListener();
clearthematrixListener();
resolvethematrixListener();