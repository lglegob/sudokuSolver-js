'use strict';
import globalVar from "./globalVar.js";
import initialMatrixpuzzle from "./data.js";
import * as recurrent from "./recurrentFunctions.js";
import * as matrixFunctions from "./theMatrixFunctions.js";
import * as solvingTechniques from "./solvingTechniques.js";
import * as obviousPairs from "./discardingTechniquesObviousPairs.js";
import * as lockedCandidates from "./discardingTechniquesLockedCandidate.js"

////////////////////////////////////////////////////////////////////////////////
//                            EVENT LISTENERS                                //
//////////////////////////////////////////////////////////////////////////////

// definining elements for Event Listeners
const button_load = document.querySelector("#button-load");
const button_loadmanually = document.querySelector("#button-loadmanually");
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
    matrixFunctions.loadMatrix(initialMatrixpuzzle.hard03str);
  });
};

const loadMatrixManuallyListener = () => {
  button_loadmanually.addEventListener("click", (e) => {
    // Stop form from reloading the page
    e.preventDefault();
    matrixFunctions.loadMatrixManually();
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
    let theMatrixStep = matrixFunctions.validateMatrix(globalVar.theMatrix[0]);
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
      console.log("--------------------------------------------");
      console.log("I can only show you the door, you're the one that has to walk through it – Morpheus");
      recurrent.showNotes(globalVar.theMatrix[globalVar.currentStep]);
    } else {
      globalVar.areNotesShowing = false;
      console.log("--------------------------------------------");
      console.log("Ignorance is bliss – Cypher");
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
      document.querySelector("#button-loadmanually").disabled = true;
      document.querySelector("#button-loadmanually").classList.remove("active");
      document.querySelector("#button-loadmanually").classList.add("inactive");
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
    solvingTechniques.singleCandidate();

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
      obviousPairs.obviousPairsRow();
    };
    if (globalVar.iterationSuccess === false && globalVar.discardNoteSuccess === false) {
      obviousPairs.obviousPairsColumn();
    };
    if (globalVar.iterationSuccess === false && globalVar.discardNoteSuccess === false) {
      obviousPairs.obviousPairsSquare();
    };
    if (globalVar.iterationSuccess === false && globalVar.discardNoteSuccess === false) {
      lockedCandidates.lockedCandidateRow();
    };
    if (globalVar.iterationSuccess === false && globalVar.discardNoteSuccess === false) {
      lockedCandidates.lockedCandidateColumn();
    };
    if (globalVar.iterationSuccess === false && globalVar.discardNoteSuccess === false) {
      let newLine = "\r\n";
      let prompttext = "WE ARE SORRY! :(";
      prompttext += newLine;
      prompttext += "We are not able to advance any further in the resolution of this Sudoku Puzzle.";
      prompttext += newLine;
      prompttext += "However, we are in the process of adding new advance solving techniques to crack this kind of difficult puzzles.";
      prompttext += newLine;
      prompttext += "Please help us by sending us your puzzle as originally ingressed to leonardogonzalezbello@gmail.com";
      alert (prompttext);
    }

    globalVar.iterationSuccess = false;
    globalVar.discardNoteSuccess = false;
    if (globalVar.cellsResolved === 81) {
      document.querySelector("#button-resolve").disabled = true;
      document.querySelector("#button-resolve").classList.remove("active");
      document.querySelector("#button-resolve").classList.add("inactive");
      document.querySelector("#button-togglenotes").disabled = true;
      document.querySelector("#button-togglenotes").classList.remove("active");
      document.querySelector("#button-togglenotes").classList.add("inactive");
      console.log("--------------------------------------------");
      console.log("Never send a human to do a machine's job - Agent Smith")
    };
  });
};

export { loadMatrixListener, loadMatrixManuallyListener, reloadMatrixListener, validateMatrixListener, resetMatrixListener, toggleNotesListener, inputCellsListener, resolveMatrixListener }