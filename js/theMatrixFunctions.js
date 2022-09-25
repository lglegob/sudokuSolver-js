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
  globalVar.theMatrix[0] = JSON.parse(JSON.stringify(theMatrixStep));
};

const loadMatrix = () => {
  for (let cellvalue = 0; cellvalue < sudokuvalues_expert02.length; cellvalue++) {
    document.querySelector(".row" + sudokuvalues_expert02[cellvalue][0] + ".column" + sudokuvalues_expert02[cellvalue][1] + " input").setAttribute("value", sudokuvalues_expert02[cellvalue][2]);
  };
  let theMatrixStep = validateMatrix(globalVar.theMatrix[0]);
  const { theMatrixStepanalysis } = analyzeMatrix(theMatrixStep);
  globalVar.theMatrix[0] = JSON.parse(JSON.stringify(theMatrixStepanalysis));
};

const loadMatrixManually = () => {
  let newLine = "\r\n";
  let prompttext = "INSTRUCTIONS";
  prompttext += newLine;
  prompttext += "Introduce your Sudoku puzzle as a series of 81 digits between 0 and 9.";
  prompttext += newLine;
  prompttext += "0 or any different character means empty.";
  prompttext += newLine;
  prompttext += "Less than 81 will be filled with empty cells";
  prompttext += newLine;
  prompttext += "More than 81 will be discarded";
  let manualMatrixValues = prompt(prompttext, "--4---7-38--9-2----3--------891-----5-------8-----926--------2----8-4--56-5---1--")
  console.log(`La cadena que ingresaste fue: ${manualMatrixValues}`)
  console.log(`lenght is: ${manualMatrixValues.length}`)
  if (manualMatrixValues.length >= 17) {
    let howManyDigits = 0;
    for (let cellCounter = 0; cellCounter < Math.min(manualMatrixValues.length, 81); cellCounter++) {
      let row = Math.floor(cellCounter / 9) + 1;
      let column = (cellCounter % 9) + 1;
      let cellValue = manualMatrixValues.charAt(cellCounter);
      if (cellValue > 0 && cellValue <=9) {
        howManyDigits++;
        console.log(`Value at row ${row}, column ${column} is ${cellValue}`);
        document.querySelector(".row" + row + ".column" + column + " input").setAttribute("value", cellValue);
      } else {
        //In case the user had inserted any value in the inputs
        document.querySelector(".row" + row + ".column" + column + " input").value = "";
      } 
    };
    if (howManyDigits < 17) {
      alert("Ingress at least 17 digits different than zero, Not enough Digits");
      resetMatrix();
    } else {
      let theMatrixStep = validateMatrix(globalVar.theMatrix[0]);
      const { theMatrixStepanalysis } = analyzeMatrix(theMatrixStep);
      globalVar.theMatrix[0] = JSON.parse(JSON.stringify(theMatrixStepanalysis));
    }
  } else {
    alert("Ingress at least 17 digits different than zero, Not enough Digits");
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
        console.log("--------------------------------------------");
        console.log(`Cells resolved so far: ${globalVar.cellsResolved}`);
        console.log(`the value in row ${row+1}, column ${column+1} is ${currentcellvalue}`);
      };
    };
  };
  if (globalVar.cellsResolved >= 17) {
    document.querySelector("#button-load").disabled = true;
    document.querySelector("#button-load").classList.remove("active");
    document.querySelector("#button-load").classList.add("inactive");
    document.querySelector("#button-loadmanually").disabled = true;
    document.querySelector("#button-loadmanually").classList.remove("active");
    document.querySelector("#button-loadmanually").classList.add("inactive");
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
    console.log("--------------------------------------------");
    console.log("The Matrix has you...")
  } else {
    globalVar.cellsResolved = 0;
    alert("Ingress at least 17 digits different than zero, Not enough Digits");
  }
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
        // document.querySelector(".row" + itemrow + ".column" + itemcolumn + " input").setAttribute("value", theMatrixDestinedStep[row][column][0]);
        document.querySelector(".row" + itemrow + ".column" + itemcolumn + " input").value = theMatrixDestinedStep[row][column][0];
      } else {
        // document.querySelector(".row" + itemrow + ".column" + itemcolumn + " input").setAttribute("value", "");
        document.querySelector(".row" + itemrow + ".column" + itemcolumn + " input").value = "";
      };
    };
  };
  if (globalVar.areNotesShowing === true) recurrent.showNotes(theMatrixDestinedStep);
};

export { createMatrix, loadMatrix, loadMatrixManually, validateMatrix, analyzeMatrix, resetMatrix, matrixReloaded };