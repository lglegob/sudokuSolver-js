'use strict';
import globalVar from "./globalVar.js";

////////////////////////////////////////////////////////////////////////////////
//                         RECURRENT FUNCTIONS                               //
//////////////////////////////////////////////////////////////////////////////

//Here, it is defined depending of the current cell in analysis, the range of rows and columns to evaluate
const defineSquareCoordinatesRC = (row, column) => {
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
  };
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
  };
  return {fromrow, maximumrow, fromcolumn, maximumcolumn};
};

//Here, it is defined depending of the square in analysis, the range of rows and columns to evaluate
const defineSquareCoordinatesSQ = (square) => {
  let fromrow;
  let maximumrow;
  let fromcolumn;
  let maximumcolumn;
  switch (true) {
    case ((square - 1) % 3 == 0 ): //Detects Squares 1, 4 and 7
      fromcolumn = 0
      maximumcolumn = 2
      break;
    case ((square - 1) % 3 == 1): //Detects Squares 2, 5 and 8
      fromcolumn = 3
      maximumcolumn = 5
      break;
    case ((square - 1) % 3 == 2): //Detects Squares 3, 6 and 9
      fromcolumn = 6
      maximumcolumn = 8
      break;
  }
  switch (true) {
    case square <= 3:   //Detects Squares 1, 2 and 3
      fromrow = 0
      maximumrow = 2
      break;
    case square <= 6:   //Detects Squares 4, 5 and 6
      fromrow = 3
      maximumrow = 5
      break;
    case square <= 9:   //Detects Squares 7, 8 and 9
      fromrow = 6
      maximumrow = 8
      break;
  };
  return {fromrow, maximumrow, fromcolumn, maximumcolumn};
};

const defineRowColumnFromSquareRelative = (square, relativeRow, relativeColumn) => {
  let realRow = (3 *(Math.floor((square-1) / 3))) + relativeRow;
  let realColumn = ( 3 * ((square-1) % 3)) + relativeColumn;
  return { realRow, realColumn }
};

const defineRowColumnFromCellRelative = (square, relativeCell) => {
  let realRow = (3 *(Math.floor((square-1) / 3))) + Math.floor(relativeCell / 3);
  let realColumn = ( 3 * ((square-1) % 3)) + (relativeCell % 3);
  return { realRow, realColumn }
};

//Function used to add html config with a 9 cells grid per each of the original divs to show the notes of each cell
const showNotes = (theMatrixStep) => {
  for (let row = 0; row <= 8; row++) {
    for (let column = 0; column <= 8; column++) {
      let itemrow = row + 1;
      let itemcolumn = column + 1;
      if (theMatrixStep[row][column][0] === 0) {
        document.querySelector(".theMatrixNotes " + ".row" + itemrow + ".column" + itemcolumn + " input").remove();
        document.querySelector(".theMatrixNotes " + ".row" + itemrow + ".column" + itemcolumn).classList.add("notes")
        let newdivcandidate = document.createElement("div");
        for (let note = 1; note <= 9; note++) {
          globalVar.loopsExecuted++;
          let newnote = document.createElement("p");
          newnote.classList.add(`note${note}`);
          if (theMatrixStep[row][column][note] !== 0) {
            newnote.innerHTML = `
            ${note}
            `;
          }
          newdivcandidate.append(newnote);
        };
        const main = document.querySelector(".theMatrixNotes " + ".row" + itemrow + ".column" + itemcolumn);
        main.append(newdivcandidate);
      };
    };
  };
  let togglebutton = document.querySelector("#button-togglenotes");
  togglebutton.innerText = "Hide Notes";
};

//Function used to add html config with a 9 cells grid per each of the original divs to show the notes of each cell
const reviewNotes = (theMatrixStep) => {
  for (let row = 0; row <= 8; row++) {
    for (let column = 0; column <= 8; column++) {
      let itemrow = row + 1;
      let itemcolumn = column + 1;
      if (theMatrixStep[row][column][0] === 0) {
        let newdivcandidate = document.createElement("div");
        newdivcandidate.classList.add("cell", "row" + itemrow, "column" + itemcolumn, "notes");
        let internaldiv = document.createElement("div");
        for (let note = 1; note <= 9; note++) {
          globalVar.loopsExecuted++;
          let newnote = document.createElement("p");
          newnote.classList.add(`note${note}`);
          if (theMatrixStep[row][column][note] !== 0) {
            newnote.innerHTML = `
            ${note}
            `;
          }
          internaldiv.append(newnote);
          newdivcandidate.append(internaldiv);

        };
        const main = document.querySelector(".theMatrixNotes " + ".row" + itemrow + ".column" + itemcolumn);
        main.replaceWith(newdivcandidate);
      };
    };
  };
};

//Function used to remove the notes and replace them with the div reserved to the final number (currently blank)
const hideNotes = (theMatrixStep) => {
  for (let row = 0; row <= 8; row++) {
    for (let column = 0; column <= 8; column++) {
      globalVar.loopsExecuted++;
      if (theMatrixStep[row][column][0] === 0) {
        let itemrow = row + 1;
        let itemcolumn = column + 1;
        let newdivcandidate;
        document.querySelector(".theMatrixNotes " + ".row" + itemrow + ".column" + itemcolumn).classList.remove("notes");
        newdivcandidate = document.createElement("div");
        newdivcandidate.classList.add("cell", `row${itemrow}`, `column${itemcolumn}`);
        newdivcandidate.innerHTML = `
        <input type="number" min="1" max="9">
        `;
        const main = document.querySelector(".theMatrixNotes " + ".row" + itemrow + ".column" + itemcolumn);
        main.replaceWith(newdivcandidate);
      };
    };
  };
  let togglebutton = document.querySelector("#button-togglenotes");
  togglebutton.innerText = "Show Notes";
};

export { defineSquareCoordinatesRC, defineSquareCoordinatesSQ, defineRowColumnFromSquareRelative, defineRowColumnFromCellRelative, showNotes, reviewNotes, hideNotes };