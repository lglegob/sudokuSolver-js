'use strict';
import globalVar from "./globalVar.js";
import * as recurrent from "./recurrentFunctions.js";
import * as matrixFunctions from "./theMatrixFunctions.js";
import * as solving from "./solvingProcess.js";
import * as randomSudoku from "./randomPuzzle.js";
import * as sudokuFetchAPI from "./sudokuFetchAPI.js";

////////////////////////////////////////////////////////////////////////////////
//                            EVENT LISTENERS                                //
//////////////////////////////////////////////////////////////////////////////

// definining elements for Event Listeners
const button_load = document.querySelector("#button-load");
const button_loadmanually = document.querySelector("#button-loadmanually");
// const button_loadAPISudoku = document.querySelector("#button-loadAPISudoku");
const button_validate = document.querySelector("#button-validate");
const button_resolve = document.querySelector("#button-solveit");
const button_reset = document.querySelector("#button-clear");
const button_togglenotes = document.querySelector("#button-togglenotes");
const button_reload = document.querySelector("#button-reload");
const button_togglehighlights = document.querySelector("#button-togglehighlights");

// Add event listener to the Load button
const loadMatrixListener = () => {
  button_load.addEventListener("click", (e) => {
    // Stop form from reloading the page
    e.preventDefault();
    let randomPuzzle = randomSudoku.randomizePuzzle();
    matrixFunctions.loadMatrix(randomPuzzle, true);
  });
};

const loadMatrixManuallyListener = () => {
  button_loadmanually.addEventListener("click", (e) => {
    // Stop form from reloading the page
    e.preventDefault();
    let randomPuzzle = randomSudoku.randomizePuzzle();
    matrixFunctions.loadMatrixManually(randomPuzzle);
  });
};

// const loadAPISudoku = () => {
//   button_loadAPISudoku.addEventListener("click", (e) => {
//     // Stop form from reloading the page
//     e.preventDefault();
//     sudokuFetchAPI.createRequestSudokuAPI();
//   });
// };

// Add event listener to the Reload button
const reloadMatrixListener = () => {
  button_reload.addEventListener("click", (e) => {
    // Stop form from reloading the page
    e.preventDefault();
    if (globalVar.areHighlightsOn && globalVar.currentStep > 1) {
      //To load again the highlights over the sudoku puzzle, we go back one more step and run again the resolve, so the complete process rebuilds the classes accordingly.
      matrixFunctions.matrixReloaded(globalVar.theMatrix[globalVar.currentStep - 2], globalVar.currentStep - 2 );
      document.querySelector("#button-solveit").click();
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
    matrixFunctions.loadMatrix(inputString, true);
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
      // document.querySelector("#button-loadAPISudoku").disabled = true;
      // document.querySelector("#button-loadAPISudoku").classList.remove("active");
      // document.querySelector("#button-loadAPISudoku").classList.add("inactive");
      document.querySelector("#button-loadPastSudokus").disabled = true;
      document.querySelector("#button-loadPastSudokus").classList.remove("active");
      document.querySelector("#button-loadPastSudokus").classList.add("inactive");
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
    solving.solvingProcess();

    if (globalVar.cellsResolved > 1) {
      document.querySelector("#button-togglehighlights").disabled = false;
      document.querySelector("#button-togglehighlights").classList.add("active");
      document.querySelector("#button-togglehighlights").classList.remove("inactive");
    };
    //In case the Sudoku has been resolved with this last step
    if (globalVar.cellsResolved === 81) {
      document.querySelector("#button-solveit").disabled = true;
      document.querySelector("#button-solveit").classList.remove("active");
      document.querySelector("#button-solveit").classList.add("inactive");
      document.querySelector("#button-togglenotes").disabled = true;
      document.querySelector("#button-togglenotes").classList.remove("active");
      document.querySelector("#button-togglenotes").classList.add("inactive");
      console.log("--------------------------------------------");
      console.log("Never send a human to do a machine's job - Agent Smith")
      console.log("Everything that has a beginning has an end. - Oracle");
      recurrent.showSweetAlert("success", "Congratulations!!", "You have completed the Puzzle :)");
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
        document.querySelector("#button-solveit").click();
      } else {
        matrixFunctions.matrixReloaded(globalVar.theMatrix[destinedStep], destinedStep );
      };
      window.scrollTo({ top: 0, behavior: 'smooth' });
      console.log("--------------------------------------------");
      console.log("Neo, sooner or later you're going to realize just as I did that there's a difference between knowing the path and walking the path – Morpheus");
    });
};

// Add event listener to the dinamically created spans hoverings for RC coordinates
const spanRowColumnCoordinatesListener = (spanCoordinates) => {
  if (spanCoordinates.dataset.cellcoordinates) { //
    spanCoordinates.addEventListener("mouseover", (e) => {
      let rowColumnClass = spanCoordinates.dataset.cellcoordinates;
      if (globalVar.areHighlightsOn) {
        document.querySelector(".theMatrix " + rowColumnClass).classList.add("hoveredCellCoordinates")
        document.querySelector(".theMatrixNotes " + rowColumnClass).classList.add("hoveredCellCoordinates")
      };
      console.log("--------------------------------------------");
      console.log("We're not here because we're free, we're here because we are not free.  – Agent Smith");
    });
    spanCoordinates.addEventListener("mouseout", (e) => {
      let rowColumnClass = spanCoordinates.dataset.cellcoordinates;
      if (globalVar.areHighlightsOn) {
        document.querySelector(".theMatrix " + rowColumnClass).classList.remove("hoveredCellCoordinates");
        document.querySelector(".theMatrixNotes " + rowColumnClass).classList.remove("hoveredCellCoordinates");
      };
      console.log("--------------------------------------------");
      console.log("Ever have that feeling where you're not sure if you're awake or dreaming? – Neo");
    });
  };

  // Add event listener to the dinamically created spans hoverings for Row coordinates
  if (spanCoordinates.dataset.rowcoordinates) { //
    spanCoordinates.addEventListener("mouseover", (e) => {
        let rowClass = spanCoordinates.dataset.rowcoordinates;
        if (globalVar.areHighlightsOn) {
          document.querySelectorAll(rowClass).forEach(cell => {
            cell.classList.add("hoveredRowCoordinates");
          });
        };
        console.log("--------------------------------------------");
        console.log("We're not here because we're free, we're here because we are not free.  – Agent Smith");
      });

    spanCoordinates.addEventListener("mouseout", (e) => {
      let rowClass = spanCoordinates.dataset.rowcoordinates;
      if (globalVar.areHighlightsOn) {
        document.querySelectorAll(rowClass).forEach(cell => {
          cell.classList.remove("hoveredRowCoordinates");
        });
      };
      console.log("--------------------------------------------");
      console.log("Ever have that feeling where you're not sure if you're awake or dreaming? – Neo");
    });
  };

  // Add event listener to the dinamically created spans hoverings for Column coordinates
  if (spanCoordinates.dataset.columncoordinates) { //
    spanCoordinates.addEventListener("mouseover", (e) => {
        let columnClass = spanCoordinates.dataset.columncoordinates;
        if (globalVar.areHighlightsOn) {
          document.querySelectorAll(columnClass).forEach(cell => {
            cell.classList.add("hoveredColumnCoordinates");
          });
        };
        console.log("--------------------------------------------");
        console.log("We're not here because we're free, we're here because we are not free.  – Agent Smith");
      });

    spanCoordinates.addEventListener("mouseout", (e) => {
      let columnClass = spanCoordinates.dataset.columncoordinates;
      if (globalVar.areHighlightsOn) {
        document.querySelectorAll(columnClass).forEach(cell => {
          cell.classList.remove("hoveredColumnCoordinates");
        });
      };
      console.log("--------------------------------------------");
      console.log("Ever have that feeling where you're not sure if you're awake or dreaming? – Neo");
    });
  };

  // Add event listener to the dinamically created spans hoverings for Squares coordinates
  if (spanCoordinates.dataset.squarecoordinates) { //
    spanCoordinates.addEventListener("mouseover", (e) => {
        let squareClass = spanCoordinates.dataset.squarecoordinates;
        if (globalVar.areHighlightsOn) {
          document.querySelectorAll(squareClass).forEach(cell => {
            cell.classList.add("hoveredSquareCoordinates");
          });
        };
        console.log("--------------------------------------------");
        console.log("We're not here because we're free, we're here because we are not free.  – Agent Smith");
      });

    spanCoordinates.addEventListener("mouseout", (e) => {
      let squareClass = spanCoordinates.dataset.squarecoordinates;
      if (globalVar.areHighlightsOn) {
        document.querySelectorAll(squareClass).forEach(cell => {
          cell.classList.remove("hoveredSquareCoordinates");
        });
      };
      console.log("--------------------------------------------");
      console.log("Ever have that feeling where you're not sure if you're awake or dreaming? – Neo");
    });
  };
};

// Add event listener to the LoadPastSudokus button
const theMatrixResurrectionsListener = (button_loadPastSudokus, previousSudokusStringsInputObject) => {
  button_loadPastSudokus.addEventListener("click", (e) => {
    // Stop form from reloading the page
    e.preventDefault();
    recurrent.showSweetTextInput("Select one of your Previous Sudoku Puzzles", previousSudokusStringsInputObject, "Past Sudokus" );
  });
};

export { loadMatrixListener, loadMatrixManuallyListener, reloadMatrixListener, validateMatrixListener, resetMatrixListener, toggleNotesListener, togglehighlightsListener, inputCellsListener, resolveMatrixListener, goBackToStepListener, spanRowColumnCoordinatesListener, theMatrixResurrectionsListener };