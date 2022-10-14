'use strict';
import globalVar from "./globalVar.js";
import * as matrixFunctions from "./theMatrixFunctions.js";

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

const defineSquareFromRC = (row, column) => {
  let square = 3 * Math.floor(row / 3) + Math.ceil((column + 1) / 3);
  return square;
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

// Function used to add html config with a 9 cells grid per each of the original divs to show the notes of each cell
const toggleNotes = () => {
  console.log("--------------------------------------------");
  if (globalVar.areNotesShowing === false) {
    console.log("I can only show you the door, you're the one that has to walk through it – Morpheus");
    document.querySelector(".card3d-body").classList.add("transform-3D-active");
    let togglebutton = document.querySelector("#button-togglenotes");
    togglebutton.innerText = "Hide Notes";
  } else {
    console.log("Ignorance is bliss – Cypher");
    document.querySelector(".card3d-body").classList.remove("transform-3D-active");
    let togglebutton = document.querySelector("#button-togglenotes");
    togglebutton.innerText = "Show Notes";
  };
  globalVar.areNotesShowing = !globalVar.areNotesShowing;
};

// Function used to define the status of highlights button
const togglehighlights = () => {
  console.log("--------------------------------------------");
  if (globalVar.areHighlightsOn === false) {
    console.log("No one can be told what the Matrix is. You have to see it for yourself - Morpheus");
    let togglebutton = document.querySelector("#button-togglehighlights");
    togglebutton.innerText = "Hide Changes";
    globalVar.areHighlightsOn = !globalVar.areHighlightsOn;
    //To load again the highlights over the sudoku puzzle, we go back an step and run again the resolve, so the complete process rebuilds the classes accordingly.
    matrixFunctions.matrixReloaded(globalVar.theMatrix[globalVar.currentStep - 1], globalVar.currentStep - 1 );
    document.querySelector("#button-resolve").click();
  } else {
    console.log("You have to let it all go, Neo - Fear, doubt, and disbelief. Free your mind! - Morpheus");
    let togglebutton = document.querySelector("#button-togglehighlights");
    togglebutton.innerText = "Show Changes";
    globalVar.areHighlightsOn = !globalVar.areHighlightsOn;
    deleteLastShowMe();
  };

};

//Function used to add html config with a 9 cells grid per each of the original divs to show the notes of each cell
const reviewNotes = (theMatrixStep) => {
  for (let row = 0; row <= 8; row++) {
    for (let column = 0; column <= 8; column++) {
      if (theMatrixStep[row][column][0] === 0) {
        let itemrow = row + 1;
        let itemcolumn = column + 1;
        const newDivCandidate = createNewDivCandidateNotes(row, column, theMatrixStep[row][column]);
        const mainMatrixNotes = document.querySelector(".theMatrixNotes " + ".row" + itemrow + ".column" + itemcolumn);
        mainMatrixNotes.replaceWith(newDivCandidate);
      };
    };
  };
};

const createNewDivInput = ( row, column, currentCellValue ) => {
  let itemrow = row + 1;
  let itemcolumn = column + 1;
  let newDivInput = document.createElement("div");
  newDivInput.classList.add("cell", "row" + itemrow, "column" + itemcolumn);
  let square = defineSquareFromRC(row, column);
  newDivInput.classList.add("square" + square);
  if (currentCellValue > 0 && currentCellValue <=9) {
    newDivInput.classList.add("value" + currentCellValue);
    newDivInput.innerHTML = `
    <input type="number" min="1" max="9" value=${currentCellValue}>
    `;
  } else {
    newDivInput.innerHTML = `
    <input type="number" min="1" max="9" value="">
    `;
  }
  return newDivInput;
};

const createNewDivCandidateNotes = (row, column, theMatrixCell) => {
  let itemrow = row + 1;
  let itemcolumn = column + 1;
  let newDivCandidate;

  if (theMatrixCell[0] === 0) {
    //This process is when the value has not been found yet, so the 9 notes have to be defined
    newDivCandidate = document.createElement("div");
    newDivCandidate.classList.add("cell", "row" + itemrow, "column" + itemcolumn, "notes");
    let square = defineSquareFromRC(row, column);
    newDivCandidate.classList.add("square" + square);
    let internaldiv = document.createElement("div");
    for (let note = 1; note <= 9; note++) {
      globalVar.loopsExecuted++;
      let newnote = document.createElement("p");
      newnote.classList.add(`note${note}`);
      if (theMatrixCell[note] !== 0) {
        newnote.innerHTML = `
        ${note}
        `;
      }

      //This If process is to prevent when going back steps, the step zero must not keep any classes related to highlights, all other steps is to prevent the deletion of the highlight classes
      if (globalVar.currentStep > 0) {
        //This If process detects if current candidate value has the class .justDeletedNote as recently deleted, to keep it in the new div created
        if (document.querySelector(".theMatrixNotes " + ".row" + itemrow + ".column" + itemcolumn + " .note" + note + ".justDeletedNote") !== null) {
          newnote.classList.add("justDeletedNote");
        };
        //This If process detects if current candidate value has the class .noteKept as recently deleted, to keep it in the new div created
        if (document.querySelector(".theMatrixNotes " + ".row" + itemrow + ".column" + itemcolumn + " .note" + note + ".noteKept") !== null) {
          newnote.classList.add("noteKept");
        };
      };

      internaldiv.append(newnote);
      newDivCandidate.append(internaldiv);
    };
  } else {
    //This process is when the value has already been found, no more notes, only the value
    let currentCellValue = theMatrixCell[0];
    newDivCandidate = document.createElement("div");
    newDivCandidate.classList.add("cell", "row" + itemrow, "column" + itemcolumn, "value" + currentCellValue);
    let square = defineSquareFromRC(row, column);
    newDivCandidate.classList.add("square" + square);
    newDivCandidate.innerHTML = `
    <input type="number" min="1" max="9" value=${currentCellValue}>
    `;
  };
  return newDivCandidate;
};

const deleteLastShowMe = () => {
  if (document.querySelector(".justFoundCell") != null) {
    document.querySelectorAll(".justFoundCell").forEach((e) => {
      e.classList.remove("justFoundCell");
    });
  };
  if (document.querySelector(".justDeletedNote") != null) {
    document.querySelectorAll(".justDeletedNote").forEach((e) => {
      e.classList.remove("justDeletedNote");
    });
  };
  if (document.querySelector(".noteKept") != null) {
    document.querySelectorAll(".noteKept").forEach((e) => {
      e.classList.remove("noteKept");
    });
  };
  if (document.querySelector(".highlightedCell") != null) {
    document.querySelectorAll(".highlightedCell").forEach((e) => {
      e.classList.remove("highlightedCell");
    });
  };  
  if (document.querySelector(".highlightedRow") != null) {
    document.querySelectorAll(".highlightedRow").forEach((e) => {
      e.classList.remove("highlightedRow");
    });
  };
  if (document.querySelector(".highlightedColumn") != null) {
    document.querySelectorAll(".highlightedColumn").forEach((e) => {
      e.classList.remove("highlightedColumn");
    });
  };
  if (document.querySelector(".highlightedSquare") != null) {
    document.querySelectorAll(".highlightedSquare").forEach((e) => {
      e.classList.remove("highlightedSquare");
    });
  };
}; 

export { defineSquareCoordinatesRC, defineSquareCoordinatesSQ, defineSquareFromRC, defineRowColumnFromSquareRelative, defineRowColumnFromCellRelative, toggleNotes, togglehighlights, reviewNotes, createNewDivInput, createNewDivCandidateNotes, deleteLastShowMe };