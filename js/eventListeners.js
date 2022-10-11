'use strict';
import globalVar from "./globalVar.js";
import initialMatrixpuzzle from "./data.js";
import * as recurrent from "./recurrentFunctions.js";
import * as matrixFunctions from "./theMatrixFunctions.js";
import * as solvingTechniques from "./solvingTechniques.js";
import * as obviousPairs from "./discardingTechniquesObviousPairs.js";
import * as lockedCandidates from "./discardingTechniquesLockedCandidate.js";
import * as hiddenPairs from "./discardingTechniquesHiddenPairs.js";
import * as xwing from "./discardingTechniquesXWing.js"

////////////////////////////////////////////////////////////////////////////////
//                            EVENT LISTENERS                                //
//////////////////////////////////////////////////////////////////////////////

// definining elements for Event Listeners
const button_load = document.querySelector("#button-load");
const button_loadmanually = document.querySelector("#button-loadmanually");
const button_validate = document.querySelector("#button-validate");
const button_resolve = document.querySelector("#button-resolve");
const button_reset = document.querySelector("#button-clear");
const button_togglenotes = document.querySelector("#button-togglenotes");
const button_reload = document.querySelector("#button-reload");
const button_togglehighlights = document.querySelector("#button-togglehighlights");

// const input_cellvalues = document.querySelectorAll(".theMatrix input");

// Add event listener to the Load button
const loadMatrixListener = () => {
  button_load.addEventListener("click", (e) => {
    // Stop form from reloading the page
    e.preventDefault();
    matrixFunctions.loadMatrix(initialMatrixpuzzle.expert06str);
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
    if (globalVar.areHighlightsOn && globalVar.currentStep > 1) {
      //To load again the highlights over the sudoku puzzle, we go back one more step and run again the resolve, so the complete process rebuilds the classes accordingly.
      matrixFunctions.matrixReloaded(globalVar.theMatrix[globalVar.currentStep - 2], globalVar.currentStep - 2 );
      document.querySelector("#button-resolve").click();
    } else {
      matrixFunctions.matrixReloaded(globalVar.theMatrix[globalVar.currentStep - 1], globalVar.currentStep - 1 );
    };
  });
};

// Add event listener to the Validate button
const validateMatrixListener = () => {
  button_validate.addEventListener("click", (e) => {
    // Stop form from reloading the page
    e.preventDefault();
    let inputString = matrixFunctions.createString();
    matrixFunctions.loadMatrix(inputString);
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

// Add event listener to the toggleNotes button
const toggleNotesListener = () => {
  button_togglenotes.addEventListener("click", (e) => {
    // Stop form from reloading the page
    e.preventDefault();
    recurrent.toggleNotes();
  });
};

// Add event listener to the toggleNotes button
const togglehighlightsListener = () => {
  button_togglehighlights.addEventListener("click", (e) => {
    // Stop form from reloading the page
    e.preventDefault();
    recurrent.togglehighlights();
  });
};

// Add event listener to the input cells action
const inputCellsListener = (input_cellvalues) => {
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
      document.querySelector("#button-clear").disabled = false;
      document.querySelector("#button-clear").classList.add("active");
      document.querySelector("#button-clear").classList.remove("inactive");
    });
  });
};

// Add event listener to the Resolve Button
const resolveMatrixListener = () => {
  button_resolve.addEventListener("click", (e) => {
    // Stop form from reloading the page
    e.preventDefault();
    recurrent.deleteLastShowMe();

    //NAKED SINGLE METHOD
    if (globalVar.iterationSuccess === false && globalVar.discardNoteSuccess === false) {
    solvingTechniques.singleCandidate();
    };

    //HIDDEN SINGLE METHODS
    if (globalVar.iterationSuccess === false && globalVar.discardNoteSuccess === false) {
      solvingTechniques.hiddenSinglesSquare();
    };
    if (globalVar.iterationSuccess === false && globalVar.discardNoteSuccess === false) {
      solvingTechniques.hiddenSinglesRow();
    };
    if (globalVar.iterationSuccess === false && globalVar.discardNoteSuccess === false) {
      solvingTechniques.hiddenSinglesColumn();
    };

    //OBVIOUS PAIRS METHODS
    if (globalVar.iterationSuccess === false && globalVar.discardNoteSuccess === false) {
      obviousPairs.obviousPairsRow();
    };
    if (globalVar.iterationSuccess === false && globalVar.discardNoteSuccess === false) {
      obviousPairs.obviousPairsColumn();
    };
    if (globalVar.iterationSuccess === false && globalVar.discardNoteSuccess === false) {
      obviousPairs.obviousPairsSquare();
    };

    //LOCKED CANDIDATE METHODS
    if (globalVar.iterationSuccess === false && globalVar.discardNoteSuccess === false) {
      lockedCandidates.lockedCandidateRow();
    };
    if (globalVar.iterationSuccess === false && globalVar.discardNoteSuccess === false) {
      lockedCandidates.lockedCandidateColumn();
    };
    if (globalVar.iterationSuccess === false && globalVar.discardNoteSuccess === false) {
      lockedCandidates.lockedCandidateSquare();
    };

    //HIDDEN PAIRS METHODS
    if (globalVar.iterationSuccess === false && globalVar.discardNoteSuccess === false) {
      hiddenPairs.hiddenPairsRow();
    };
    if (globalVar.iterationSuccess === false && globalVar.discardNoteSuccess === false) {
      hiddenPairs.hiddenPairsColumn();
    };
    if (globalVar.iterationSuccess === false && globalVar.discardNoteSuccess === false) {
      hiddenPairs.hiddenPairsSquare();
    };

    //X-WING CANDIDATES METHOD
    if (globalVar.iterationSuccess === false && globalVar.discardNoteSuccess === false) {
      xwing.xwingRow();
    };
    if (globalVar.iterationSuccess === false && globalVar.discardNoteSuccess === false) {
      xwing.xwingColumn();
    };

    //FAILURE (NOT SOLVED)
    if (globalVar.iterationSuccess === false && globalVar.discardNoteSuccess === false) {
      console.log("--------------------------------------------");
      console.log("I'm sorry, kiddo. I really am. You have a good soul. And I hate giving good people bad news. - Oracle");
      let newLine = "\r\n";
      let prompttext = "WE ARE SORRY! :(";
      prompttext += newLine;
      prompttext += newLine;
      prompttext += "We are not able to advance any further in the resolution of this Sudoku Puzzle.";
      prompttext += newLine;
      prompttext += "However, we are in the process of adding new advance solving techniques to crack this kind of difficult puzzles.";
      prompttext += newLine;
      prompttext += newLine;
      prompttext += "Please help us by sending us your puzzle as originally ingressed to leonardogonzalezbello@gmail.com";
      prompttext += newLine;
      prompttext += newLine;
      prompttext += "BTW... if you know what should be the next step to solve it, even better :)";
      alert (prompttext);
    }

    globalVar.iterationSuccess = false;
    globalVar.discardNoteSuccess = false;
    if (globalVar.cellsResolved > 1) {
      document.querySelector("#button-togglehighlights").disabled = false;
      document.querySelector("#button-togglehighlights").classList.add("active");
      document.querySelector("#button-togglehighlights").classList.remove("inactive");
    };
    //In case the Sudoku has been resolved with this last step
    if (globalVar.cellsResolved === 81) {
      document.querySelector("#button-resolve").disabled = true;
      document.querySelector("#button-resolve").classList.remove("active");
      document.querySelector("#button-resolve").classList.add("inactive");
      document.querySelector("#button-togglenotes").disabled = true;
      document.querySelector("#button-togglenotes").classList.remove("active");
      document.querySelector("#button-togglenotes").classList.add("inactive");
      console.log("--------------------------------------------");
      console.log("Never send a human to do a machine's job - Agent Smith")
      console.log("Everything that has a beginning has an end. - Oracle");
    };
  });
};

// Add event listener to the dinamically created buttons for goBackToStepX
const goBackToStepListener = (button_goBackToStep) => {
  button_goBackToStep.addEventListener("click", (e) => {
      // Stop form from reloading the page
      e.preventDefault();
      let destinedStep = button_goBackToStep.name.slice(4);
      if (globalVar.areHighlightsOn && destinedStep > 0) {
        //To load again the highlights over the sudoku puzzle, we go back one more step and run again the resolve one time, so the complete resolution process rebuilds the classes accordingly.
        matrixFunctions.matrixReloaded(globalVar.theMatrix[destinedStep - 1], destinedStep - 1 );
        document.querySelector("#button-resolve").click();
      } else {
        matrixFunctions.matrixReloaded(globalVar.theMatrix[destinedStep], destinedStep );
      };
      window.scrollTo({ top: 0, behavior: 'smooth' });
      console.log("--------------------------------------------");
      console.log("Neo, sooner or later you're going to realize just as I did that there's a difference between knowing the path and walking the path – Morpheus");
    });
};

export { loadMatrixListener, loadMatrixManuallyListener, reloadMatrixListener, validateMatrixListener, resetMatrixListener, toggleNotesListener, togglehighlightsListener, inputCellsListener, resolveMatrixListener, goBackToStepListener }