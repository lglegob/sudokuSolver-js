'use strict';
import globalVar from "./globalVar.js";
import * as notesZero from "./notesZero.js";
import * as recurrent from "./recurrentFunctions.js";
import * as eventListeners from "./eventListeners.js";
import * as solvingFunctions from "./solvingProcessFunctions.js";
import * as validPuzzleCheck from "./validPuzzleChecks.js";
import * as randomSudoku from "./randomPuzzle.js";
import { solvingProcess } from "./solvingProcess.js";

////////////////////////////////////////////////////////////////////////////////
//                            MATRIX FUNCTIONS                               //
//////////////////////////////////////////////////////////////////////////////

//Function to create theMatrix Variable with generic values, and create the Input Fields in the HTML
const createMatrix = () => {
  console.log("Wake Up, Neo...")
  let theMatrixStep = [];
  for (let row = 0; row <= 8; row++) {
    theMatrixStep[row] = [];
    for (let column = 0; column <= 8; column++) {
      globalVar.loopsExecuted++;
      theMatrixStep[row][column] = [0, 1, 1, 1, 1, 1, 1, 1, 1, 1];
      //Function to create a new input field for the HTML
      let newDivInput = recurrent.createNewDivInput( row, column, 0 );
      const mainMatrix = document.querySelector(".theMatrix");
      mainMatrix.append(newDivInput);
    };
  };
  globalVar.theMatrix[0] = JSON.parse(JSON.stringify(theMatrixStep));
  //This Listener for input fields has to be loaded after HTML theMatrix structure has been already create by function createMatrix()
  const input_cellvalues = document.querySelectorAll(".theMatrix input");
  eventListeners.inputCellsListener(input_cellvalues);
};

const loadMatrix = (initialMatrixValues) => {
  //This section is to load the string (from load or load manually) into the inputs
  let howManyDigits = 0;
  let validPuzzle = true;
  let quantityPerValue = [0,0,0,0,0,0,0,0,0,0]; //Array to count how many cells are filled with each Digit (the 0 index not used)
  //By setting 81, if there are less characters, the for loop will continue trying to get a value, in such cases it will default to zero. If there are more characters, they will be simply ignored by the counter
  for (let cellCounter = 0; cellCounter < 81; cellCounter++) {
    globalVar.loopsExecuted++;
    let row = Math.floor(cellCounter / 9);
    let column = (cellCounter % 9);
    let itemrow = row + 1;
    let itemcolumn = column + 1;
    let currentCellValue = initialMatrixValues.charAt(cellCounter);
    
    if (currentCellValue >= 1 && currentCellValue <=9) {
      howManyDigits++;
      quantityPerValue[currentCellValue]++
    } else {
      currentCellValue = 0;
    } 
    let newDivInput = recurrent.createNewDivInput( row, column, currentCellValue );
    currentCellValue !== 0 ? newDivInput.classList.add("startingCellValue") : false;
    const mainMatrix = document.querySelector(".theMatrix .row" + itemrow +".column" + itemcolumn);
    mainMatrix.replaceWith(newDivInput);
  };

  //Check if there are enough Digits
  if (howManyDigits >= 17) {
    let theMatrixStep = firstTimeNotesMatrix(globalVar.theMatrix[0]);
    theMatrixStep = analyzeMatrix(theMatrixStep);
    globalVar.theMatrix[0] = JSON.parse(JSON.stringify(theMatrixStep));
  } else {
    validPuzzle = false;
    console.log("--------------------------------------------");
    console.log("Not like this. Not like this – Switch");
    alert("Ingress at least 17 digits different than zero, Not enough Digits");
  };

  //Check if there are enough kind of digits for unique solution (At least 8 or 9 of the possible options)
  validPuzzle = validPuzzleCheck.enoughDiversityDigits(validPuzzle, quantityPerValue);

  //Check if there are duplicated digits within the blocks (row, column and square)
  validPuzzle = validPuzzleCheck.validPuzzleRow(validPuzzle);
  validPuzzle = validPuzzleCheck.validPuzzleColumn(validPuzzle);
  validPuzzle = validPuzzleCheck.validPuzzleSquare(validPuzzle);

  //Check if the puzzle has one only answer by solving it
  // while (globalVar.cellsResolved <81 && globalVar.failure === false ) {
  //   solvingProcess();
  // };

  //Finally, check if Puzzle is valid
  if (validPuzzle) {
    thePuzzleisValid();
  } else {
    globalVar.cellsResolved = 0;
    document.querySelector("#button-validate").disabled = false;
    document.querySelector("#button-validate").classList.remove("inactive");
    document.querySelector("#button-validate").classList.add("active");
    lightResetMatrixNotes();
  }
};

const loadMatrixManually = () => {
  let randomPuzzle = randomSudoku.randomizePuzzle();
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
  let manualMatrixValues = prompt(prompttext, randomPuzzle)
  loadMatrix(manualMatrixValues);
};

const thePuzzleisValid = () => {
  recurrent.reviewNotes(globalVar.theMatrix[0]);
  recurrent.deleteLastShowMe();
  solvingFunctions.newSudokuPuzzleArticle();
  const instructions = document.querySelector(".instructions");
  instructions.remove();
  // Process to keep the empty cells and the transparency when rotating for the Notes, also to have the inputs replace as <p>s to avoid any more inputs during the solving process
  for (let row = 0; row <= 8; row++) {
    for (let column = 0; column <= 8; column++) {
      globalVar.loopsExecuted++;
      let itemrow = row + 1;
      let itemcolumn = column + 1;
      let currentcell = document.querySelector(".theMatrix .row" + itemrow + ".column" + itemcolumn);
      let currentCellValue = globalVar.theMatrix[0][row][column][0];
      if (currentCellValue === 0) {
      currentcell.innerHTML = `
      <div class="emptycell"></div>
      `;
      }; 
    };
  };
  
  //Activating buttons
  document.querySelector("#button-load").disabled = true;
  document.querySelector("#button-load").classList.remove("active", "visible");
  document.querySelector("#button-load").classList.add("inactive", "invisible");
  document.querySelector("#button-loadmanually").disabled = true;
  document.querySelector("#button-loadmanually").classList.remove("active", "visible");
  document.querySelector("#button-loadmanually").classList.add("inactive", "invisible");
  document.querySelector("#button-validate").disabled = true;
  document.querySelector("#button-validate").classList.remove("active", "visible");
  document.querySelector("#button-validate").classList.add("inactive", "invisible");
  document.querySelector("#button-resolve").disabled = false;
  document.querySelector("#button-resolve").classList.add("active", "visible");
  document.querySelector("#button-resolve").classList.remove("inactive", "invisible");
  document.querySelector("#button-togglenotes").disabled = false;
  document.querySelector("#button-togglenotes").classList.add("active", "visible");
  document.querySelector("#button-togglenotes").classList.remove("inactive", "invisible");
  document.querySelector("#button-clear").disabled = false;
  document.querySelector("#button-clear").classList.add("active");
  document.querySelector("#button-clear").classList.remove("inactive");
  //ToggleHighlights and is just made visible, but not yet active
  document.querySelector("#button-togglehighlights").classList.add("visible");
  document.querySelector("#button-togglehighlights").classList.remove("invisible");
  document.querySelector("#button-reload").classList.remove("invisible");
  document.querySelector("#button-reload").classList.add("visible");
  console.log("--------------------------------------------");
  console.log("The Matrix has you...")
  
}


//Get the values from the form input into the Matrix
const createString = () => {
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
    };
  };
  return initialMatrixValues;
};

//Get the values from the form input into the Matrix
const firstTimeNotesMatrix = (theMatrixStep) => {
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

      let newDivInputNotes = recurrent.createNewDivCandidateNotes(row, column, theMatrixStep[row][column]);
      const mainMatrixNotes = document.querySelector(".theMatrixNotes");
      mainMatrixNotes.append(newDivInputNotes);

    };
  };
  console.log("--------------------------------------------");
  console.log("But there's way too much information to decode the Matrix. You get used to it. – Cypher");
  console.log(`The string chain you ingressed was: ${initialMatrixValues}`);
  console.log(`lenght is: ${initialMatrixValues.length}`);
  return theMatrixStep;
};

//reset the values from the form input
const resetMatrix = () => {
  window.location.reload();
};

//reset the values from the form input
const lightResetMatrixNotes = () => {
  document.querySelector(".theMatrixNotes").innerHTML = "";
};

// Analzying puzzle for notes
const analyzeMatrix = (theMatrixStep) => {
  for (let row = 0; row <= 8; row++) {
    for (let column = 0; column <= 8; column++) {
      globalVar.loopsExecuted++;
      let currentCellValue = theMatrixStep[row][column][0];
      // If the value is different than zero, it has to set as zero that position in every element of the same row, same column and same square
      if (currentCellValue != 0) {
        // since this cell already has a value, all the posibilities are marked zero
        theMatrixStep[row][column] = [currentCellValue, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        theMatrixStep = notesZero.noteZeroRow(row, currentCellValue, theMatrixStep);
        theMatrixStep = notesZero.noteZeroColumn(column, currentCellValue, theMatrixStep);
        theMatrixStep = notesZero.noteZeroSquareRC(row, column, currentCellValue, theMatrixStep);
        globalVar.cellsResolved++;
        console.log("--------------------------------------------");
        console.log(`Cells resolved so far: ${globalVar.cellsResolved}`);
        console.log(`the value in row ${row+1}, column ${column+1} is ${currentCellValue}`);
      };
    };
  };
  return theMatrixStep;
};

//Reload the Matrix (html values and notes) based on a previous step
const matrixReloaded = (theMatrixDestinedStep, GoBackToStep) => {
  //Loop to go bask as many steps as needed
  for (let stepsBack = globalVar.currentStep - GoBackToStep; stepsBack >0; stepsBack--) {
    if (globalVar.stepsDetail[globalVar.currentStep][0] === true) globalVar.cellsResolved--;   
    globalVar.currentStep--;
    const main = document.querySelector(".stepsDetails > div");
    main.removeChild(main.firstElementChild);
    //Config to remove the button of the new current step
    let currentArticle = document.querySelector(`#Step${globalVar.currentStep}`);
    currentArticle.removeChild(currentArticle.lastChild);

  };

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
    document.querySelector("#button-togglehighlights").disabled = true;
    document.querySelector("#button-togglehighlights").classList.remove("active");
    document.querySelector("#button-togglehighlights").classList.add("inactive");
  }
  for (let row = 0; row <= 8; row++) {
    for (let column = 0; column <= 8; column++) {
      globalVar.loopsExecuted++;

      let itemrow = row + 1;
      let itemcolumn = column + 1;
      let newDivInput = recurrent.createNewDivInput( row, column, theMatrixDestinedStep[row][column][0] );
      const mainMatrix = document.querySelector(".theMatrix .row" + itemrow +".column" + itemcolumn);
      mainMatrix.replaceWith(newDivInput);

      const newDivCandidate = recurrent.createNewDivCandidateNotes(row, column, theMatrixDestinedStep[row][column]);
      const mainMatrixNotes = document.querySelector(".theMatrixNotes " + ".row" + itemrow + ".column" + itemcolumn);
      mainMatrixNotes.replaceWith(newDivCandidate);

    };
  };
  console.log("--------------------------------------------");
  console.log("Denial is the most predictable of all human responses – The Architect"); 
  recurrent.reviewNotes(theMatrixDestinedStep);
};

export { createMatrix, loadMatrix, loadMatrixManually, createString, analyzeMatrix, resetMatrix, matrixReloaded };