'use strict';
import sudokuvalues_expert02 from "./data.js";
import globalVar from "./globalVar.js";
import * as notesZero from "./notesZero.js";
import * as recurrent from "./theRecurrentFunctions.js";

////////////////////////////////////////////////////////////////////////////////
//                            MATRIX FUNCTIONS                               //
//////////////////////////////////////////////////////////////////////////////

const createMatrix = () => {
  console.log("Wake Up, Neo...")
  let theMatrixStep = [];
  for (let row = 0; row <= 8; row++) {
    theMatrixStep[row] = [];
    for (let column = 0; column <= 8; column++) {
      theMatrixStep[row][column] = [0, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    };
  };
  return theMatrixStep;
};

const loadMatrix = () => {
  for (let cellvalue = 0; cellvalue < sudokuvalues_expert02.length; cellvalue++) {
    document.querySelector(".row" + sudokuvalues_expert02[cellvalue][0] + ".column" + sudokuvalues_expert02[cellvalue][1] + " input").setAttribute("value", sudokuvalues_expert02[cellvalue][2]);
  };
};

//Get the values from the form input into the Matrix
const validateMatrix = (theMatrixStep) => {
  for (let row = 0; row <= 8; row++) {
    for (let column = 0; column <= 8; column++) {
      let itemrow = row + 1;
      let itemcolumn = column + 1;
      let currentcell = document.querySelector(".row" + itemrow + ".column" + itemcolumn);
      let currentcellvalue = Number(currentcell.querySelector("input").value);
      theMatrixStep[row][column] = [currentcellvalue, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    };
  };
  return theMatrixStep;
};

//reset the values from the form input
const resetMatrix = () => {
  window.location.reload();
};

// Initial validation used in validateMatrixListener
const analyzeMatrix = (theMatrixStepanalysis) => {
  // First select each row
  for (let row = 0; row <= 8; row++) {
    for (let column = 0; column <= 8; column++) {
      globalVar.loopsExecuted++;
      let currentcellvalue = theMatrixStepanalysis[row][column][0];
      // If the value is different than zero, it has to set as zero that position in every element of the same row, same column and same square
      if (currentcellvalue != 0) {
        // since this cell already has a value, all the posibilities are marked zero
        theMatrixStepanalysis[row][column] = [currentcellvalue, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        theMatrixStepanalysis = notesZero.noteZeroRow(row, currentcellvalue, theMatrixStepanalysis);
        theMatrixStepanalysis = notesZero.noteZeroColumn(column, currentcellvalue, theMatrixStepanalysis);
        theMatrixStepanalysis = notesZero.noteZeroSquare(row, column, currentcellvalue, theMatrixStepanalysis);
        globalVar.cellsResolved++;
        console.log(`Cells resolved so far: ${globalVar.cellsResolved}`);
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
  console.log("The Matrix has you...")
  return { theMatrixStepanalysis };
};

//Reload the Matrix (html values and notes) based on a previous step
const matrixReloaded = (theMatrixDestinedStep) => {
  if (globalVar.stepsDetail[globalVar.currentStep][0] === true) globalVar.cellsResolved--;   
  globalVar.currentStep--;
  document.querySelector("#button-resolve").disabled = false;
  document.querySelector("#button-resolve").classList.add("active");
  document.querySelector("#button-resolve").classList.remove("inactive");
  document.querySelector("#button-togglenotes").disabled = false;
  document.querySelector("#button-togglenotes").classList.add("active");
  document.querySelector("#button-togglenotes").classList.remove("inactive");
  if (globalVar.areNotesShowing === true) recurrent.hideNotes(theMatrixDestinedStep);
  if (globalVar.currentStep === 0) {
    document.querySelector("#button-reload").disabled = true;
    document.querySelector("#button-reload").classList.remove("active");
    document.querySelector("#button-reload").classList.add("inactive");
  }
  for (let row = 0; row <= 8; row++) {
    for (let column = 0; column <= 8; column++) {
      let itemrow = row + 1;
      let itemcolumn = column + 1;
      if (theMatrixDestinedStep[row][column][0] !== 0) {
        document.querySelector(".row" + itemrow + ".column" + itemcolumn + " input").setAttribute("value", theMatrixDestinedStep[row][column][0]);
      } else {
        document.querySelector(".row" + itemrow + ".column" + itemcolumn + " input").setAttribute("value", "");
      };
    };
  };
  if (globalVar.areNotesShowing === true) recurrent.showNotes(theMatrixDestinedStep);
};

export { createMatrix, loadMatrix, validateMatrix, analyzeMatrix, resetMatrix, matrixReloaded };