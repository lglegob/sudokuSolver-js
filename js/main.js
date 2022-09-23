'use strict';
import globalVar from "./globalVar.js";
import * as recurrent from "./theRecurrentFunctions.js"
import * as matrixFunctions from "./theMatrixFunctions.js"
import * as solvingTechniques from "./solvingTechniques.js"
import * as discardingTechniques from "./discardingTechniques.js"

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
    theMatrixStep = matrixFunctions.validateMatrix(globalVar.theMatrix[0]);
    const { theMatrixStepanalysis } = matrixFunctions.analyzeMatrix(theMatrixStep);
    globalVar.theMatrix[0] = JSON.parse(JSON.stringify(theMatrixStepanalysis));
  });
};

// Add event listener to the Load button
const reloadMatrixListener = () => {
  button_reload.addEventListener("click", (e) => {
    // Stop form from reloading the page
    e.preventDefault();
    matrixFunctions.matrixReloaded(globalVar.theMatrix[globalVar.currentStep - 1]);
  });
};

// Add event listener to the Validate button
const validateMatrixListener = () => {
  button_validate.addEventListener("click", (e) => {
    // Stop form from reloading the page
    e.preventDefault();
    theMatrixStep = matrixFunctions.validateMatrix(globalVar.theMatrix[0]);
    const {theMatrixStepanalysis } = matrixFunctions.analyzeMatrix(theMatrixStep);
    globalVar.theMatrix[0] = JSON.parse(JSON.stringify(theMatrixStepanalysis));
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
    if (globalVar.areNotesShowing === false) {
      globalVar.areNotesShowing = true;
      recurrent.showNotes(globalVar.theMatrix[globalVar.currentStep]);
    } else {
      globalVar.areNotesShowing = false;
      recurrent.hideNotes(globalVar.theMatrix[globalVar.currentStep]);
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
    solvingTechniques.singleOptions();

    if (globalVar.iterationSuccess === false && globalVar.discardNoteSuccess === false) {
      solvingTechniques.hiddenSinglesSquare();
    };
    if (globalVar.iterationSuccess === false && globalVar.discardNoteSuccess === false) {
      solvingTechniques.hiddenSinglesRow();
    };
    if (globalVar.iterationSuccess === false && globalVar.discardNoteSuccess === false) {
      solvingTechniques.hiddenSinglesColumn();
    };
    if (globalVar.iterationSuccess === false && globalVar.discardNoteSuccess === false) {
      discardingTechniques.obviousPairsRow();
    };
    if (globalVar.iterationSuccess === false && globalVar.discardNoteSuccess === false) {
      discardingTechniques.obviousPairsColumn();
    };
    if (globalVar.iterationSuccess === false && globalVar.discardNoteSuccess === false) {
      discardingTechniques.obviousPairsSquare();
    };

    globalVar.iterationSuccess = false;
    globalVar.discardNoteSuccess = false;
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

//Initial state defined in the html, no need to change classes
document.querySelector("#button-validate").disabled = true
document.querySelector("#button-reload").disabled = true
document.querySelector("#button-resolve").disabled = true
document.querySelector("#button-togglenotes").disabled = true
document.querySelector("#button-reset").disabled = true

let theMatrixStep = matrixFunctions.createMatrix();
globalVar.theMatrix[0] = JSON.parse(JSON.stringify(theMatrixStep));

//activate the Listeners
validateMatrixListener();
resetMatrixListener();
resolveMatrixListener();
reloadMatrixListener();
loadMatrixListener();
toggleNotesListener();
inputCellsListener();