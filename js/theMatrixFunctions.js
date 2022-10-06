'use strict';
import globalVar from "./globalVar.js";
import initialMatrixpuzzle from "./data.js";
import * as notesZero from "./notesZero.js";
import * as recurrent from "./recurrentFunctions.js";

////////////////////////////////////////////////////////////////////////////////
//                            MATRIX FUNCTIONS                               //
//////////////////////////////////////////////////////////////////////////////

const createMatrix = () => {
  console.log("Wake Up, Neo...")
  let theMatrixStep = [];
  for (let row = 0; row <= 8; row++) {
    theMatrixStep[row] = [];
    for (let column = 0; column <= 8; column++) {
      globalVar.loopsExecuted++;
      theMatrixStep[row][column] = [0, 1, 1, 1, 1, 1, 1, 1, 1, 1];
      let itemrow = row + 1;
      let itemcolumn = column + 1;
      let newDivInput = document.createElement("div");
      let newDivInputNotes = document.createElement("div");
      newDivInput.classList.add("cell", "row" + itemrow, "column" + itemcolumn);
      newDivInputNotes.classList.add("cell", "row" + itemrow, "column" + itemcolumn);
      newDivInput.innerHTML = `
      <input type="number" min="1" max="9" value="">
      `;
      newDivInputNotes.innerHTML = `
      <input type="number" min="1" max="9" value="">
      `;
      const mainMatrix = document.querySelector(".theMatrix");
      mainMatrix.append(newDivInput);
      const mainMatrixNotes = document.querySelector(".theMatrixNotes");
      mainMatrixNotes.append(newDivInputNotes);
    };
  };
  globalVar.theMatrix[0] = JSON.parse(JSON.stringify(theMatrixStep));
};

const loadMatrix = (initialMatrixValues) => {
  console.log(`La cadena que ingresaste fue: ${initialMatrixValues}`)
  console.log(`lenght is: ${initialMatrixValues.length}`)
  if (initialMatrixValues.length >= 17) {
    let howManyDigits = 0;
    for (let cellCounter = 0; cellCounter < Math.min(initialMatrixValues.length, 81); cellCounter++) {
      globalVar.loopsExecuted++;
      let row = Math.floor(cellCounter / 9) + 1;
      let column = (cellCounter % 9) + 1;
      let cellValue = initialMatrixValues.charAt(cellCounter);
      if (cellValue > 0 && cellValue <=9) {
        howManyDigits++;
        // console.log(`Value at row ${row}, column ${column} is ${cellValue}`);
        document.querySelector(".theMatrix " + ".row" + row + ".column" + column + " input").setAttribute("value", cellValue);
        document.querySelector(".theMatrix " + ".row" + row + ".column" + column).classList.add("value" + cellValue);
        document.querySelector(".theMatrixNotes " + ".row" + row + ".column" + column + " input").setAttribute("value", cellValue);
        document.querySelector(".theMatrixNotes " + ".row" + row + ".column" + column).classList.add("value" + cellValue);
      } else {
        //In case the user had inserted any value in the inputs
        document.querySelector(".theMatrix " + ".row" + row + ".column" + column + " input").value = "";
        document.querySelector(".theMatrixNotes " + ".row" + row + ".column" + column + " input").value = "";
      } 
    };
    if (howManyDigits < 17) {
      console.log("--------------------------------------------");
      console.log("Not like this. Not like this – Switch");
      alert("Ingress at least 17 digits different than zero, Not enough Digits");
      resetMatrix();
    } else {
      let theMatrixStep = validateMatrix(globalVar.theMatrix[0]);
      const { theMatrixStepanalysis } = analyzeMatrix(theMatrixStep);
      globalVar.theMatrix[0] = JSON.parse(JSON.stringify(theMatrixStepanalysis));
      recurrent.reviewNotes(globalVar.theMatrix[0]);
    }
  } else {
    console.log("--------------------------------------------");
    console.log("Not like this. Not like this – Switch");
    alert("Ingress at least 17 digits different than zero, Not enough Digits");
  };
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
  let manualMatrixValues = prompt(prompttext, initialMatrixpuzzle.hard03str)
  loadMatrix(manualMatrixValues);
};

//Get the values from the form input into the Matrix
const validateMatrix = (theMatrixStep) => {
  let initialMatrixValues = "";   
  for (let row = 0; row <= 8; row++) {
    for (let column = 0; column <= 8; column++) {
      globalVar.loopsExecuted++;
      let itemrow = row + 1;
      let itemcolumn = column + 1;
      let currentcell = document.querySelector(".theMatrix .row" + itemrow + ".column" + itemcolumn);
      let currentCellValue = Number(currentcell.querySelector("input").value);
      if (currentCellValue !== 0) {
        initialMatrixValues += currentCellValue;
      }
      else {
        initialMatrixValues += "-";
      };
      currentcell.classList.add("value" + currentCellValue);
      theMatrixStep[row][column] = [currentCellValue, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    };
  };
  console.log(`La cadena que ingresaste fue: ${initialMatrixValues}`);
  console.log(`lenght is: ${initialMatrixValues.length}`);
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
      let currentCellValue = theMatrixStepanalysis[row][column][0];
      // If the value is different than zero, it has to set as zero that position in every element of the same row, same column and same square
      if (currentCellValue != 0) {
        // since this cell already has a value, all the posibilities are marked zero
        theMatrixStepanalysis[row][column] = [currentCellValue, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        theMatrixStepanalysis = notesZero.noteZeroRow(row, currentCellValue, theMatrixStepanalysis);
        theMatrixStepanalysis = notesZero.noteZeroColumn(column, currentCellValue, theMatrixStepanalysis);
        theMatrixStepanalysis = notesZero.noteZeroSquareRC(row, column, currentCellValue, theMatrixStepanalysis);
        globalVar.cellsResolved++;
        console.log("--------------------------------------------");
        console.log(`Cells resolved so far: ${globalVar.cellsResolved}`);
        console.log(`the value in row ${row+1}, column ${column+1} is ${currentCellValue}`);
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
    console.log("--------------------------------------------");
    console.log("Not like this. Not like this – Switch");
    alert("Ingress at least 17 digits different than zero, Not enough Digits");
  }
  return { theMatrixStepanalysis };
};

//Reload the Matrix (html values and notes) based on a previous step
const matrixReloaded = (theMatrixDestinedStep) => {
  if (globalVar.stepsDetail[globalVar.currentStep][0] === true) globalVar.cellsResolved--;   
  globalVar.currentStep--;
  const main = document.querySelector(".stepsDetails > div");
  main.removeChild(main.firstElementChild);
  document.querySelector("#button-resolve").disabled = false;
  document.querySelector("#button-resolve").classList.add("active");
  document.querySelector("#button-resolve").classList.remove("inactive");
  document.querySelector("#button-togglenotes").disabled = false;
  document.querySelector("#button-togglenotes").classList.add("active");
  document.querySelector("#button-togglenotes").classList.remove("inactive");
  if (globalVar.currentStep === 0) {
    document.querySelector("#button-reload").disabled = true;
    document.querySelector("#button-reload").classList.remove("active");
    document.querySelector("#button-reload").classList.add("inactive");
  }
  for (let row = 0; row <= 8; row++) {
    for (let column = 0; column <= 8; column++) {
      globalVar.loopsExecuted++;
      let itemrow = row + 1;
      let itemcolumn = column + 1;
      let newfoundInput = document.createElement("div");
      newfoundInput.classList.add("cell", "row" + itemrow, "column" + itemcolumn);
      let newfoundInputNotes = document.createElement("div");
      newfoundInputNotes.classList.add("cell", "row" + itemrow, "column" + itemcolumn);
      if (theMatrixDestinedStep[row][column][0] !== 0) {
        let currentCellValue = theMatrixDestinedStep[row][column][0];
        //Config for modifying the html matrixes
        newfoundInput.classList.add("value" + currentCellValue);
        newfoundInput.innerHTML = `
          <input type="number" min="1" max="9" value=${currentCellValue}>
        `;
        newfoundInputNotes.classList.add("value" + currentCellValue);
        newfoundInputNotes.innerHTML = `
        <input type="number" min="1" max="9" value=${currentCellValue}>
      `;
      } else {
        newfoundInput.innerHTML = `
        <input type="number" min="1" max="9" value="">
        `;
        newfoundInputNotes.innerHTML = `
        <input type="number" min="1" max="9" value="">
        `;
      };
      document.querySelector(".theMatrix .row" + itemrow +".column" + itemcolumn).replaceWith(newfoundInput);
      document.querySelector(".theMatrixNotes .row" + itemrow +".column" + itemcolumn).replaceWith(newfoundInputNotes);
    };
  };
  console.log("--------------------------------------------");
  console.log("Denial is the most predictable of all human responses – The Architect"); 
  recurrent.reviewNotes(theMatrixDestinedStep);
};

export { createMatrix, loadMatrix, loadMatrixManually, validateMatrix, analyzeMatrix, resetMatrix, matrixReloaded };