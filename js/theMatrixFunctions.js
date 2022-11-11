'use strict';
import globalVar from "./globalVar.js";
import * as notesZero from "./notesZero.js";
import * as recurrent from "./recurrentFunctions.js";
import * as eventListeners from "./eventListeners.js";
import * as validPuzzleCheck from "./validPuzzleChecks.js";
import * as randomSudoku from "./randomPuzzle.js";
import * as modifyDOM from "./modifyingDOMFunctions.js";

////////////////////////////////////////////////////////////////////////////////
//                            MATRIX FUNCTIONS                               //
//////////////////////////////////////////////////////////////////////////////

//Function to create theMatrix Variable with generic initial values, and create the Input Fields in the HTML.
const createMatrix = () => {
  console.log("Wake Up, Neo...")
  let theMatrixStep = [];
  for (let row = 0; row <= 8; row++) {
    theMatrixStep[row] = [];
    for (let column = 0; column <= 8; column++) {
      globalVar.loopsExecuted++;
      theMatrixStep[row][column] = [0, 1, 1, 1, 1, 1, 1, 1, 1, 1]; //array of 10 numbers, the first one is for the value of the cell (if already known or zero if not known). the other 9 numbers (indexes 1-9 show the candidates for each of the cells of the sudoku array).
      //Process to create a new input field for the HTML, this time it is used append.
      let newDivInput = recurrent.createNewDivInput( row, column, 0 );
      const mainMatrix = document.querySelector(".theMatrix");
      mainMatrix.append(newDivInput);
    };
  };
  globalVar.theMatrix[0] = JSON.parse(JSON.stringify(theMatrixStep));
  //This Listener for input fields has to be loaded after HTML theMatrix structure has been already created by function createMatrix().
  const input_cellvalues = document.querySelectorAll(".theMatrix input");
  eventListeners.inputCellsListener(input_cellvalues);
  //Process to load previously created Sudokus for the user.
  let previousSudokusRegEx = new RegExp("^SudokuCreated");
  let previousSudokusStrings = findPastSudokus(previousSudokusRegEx);  
  //Process to create a dropdown list selector with the previous Sudoku Puzzles created for the user
  if (previousSudokusStrings.length > 0) {
    let previousSudokusStringsInputObject = {};
    previousSudokusStrings.forEach((puzzle) => {
      previousSudokusStringsInputObject[puzzle.key] = puzzle.val;
    });
    //If there are previous Sudokus saved in Local Storage, then we create and activate the corresponding EventListener and button
    const button_loadPastSudokus = document.querySelector("#button-loadPastSudokus");
    eventListeners.theMatrixResurrectionsListener(button_loadPastSudokus, previousSudokusStringsInputObject);
    document.querySelector("#button-loadPastSudokus").disabled = false;
    document.querySelector("#button-loadPastSudokus").classList.add("active", "visible");
    document.querySelector("#button-loadPastSudokus").classList.remove("inactive", "invisible");
  };
};

const loadMatrix = (initialMatrixValues, isThisPuzzleNew) => {
  //This section is to load the string (from load or load manually) into the inputs.
  let howManyDigits = 0;
  let validPuzzle = true;
  let quantityPerValue = [0,0,0,0,0,0,0,0,0,0]; //Array to count how many cells are filled with each Digit (the 0 index not used).
  for (let cellCounter = 0; cellCounter < 81; cellCounter++) { //By setting 81, if there are less characters, the for loop will continue trying to get a value, in such cases it will default to zero. If there are more characters, they will be simply ignored by the counter.
    globalVar.loopsExecuted++;
    let row = Math.floor(cellCounter / 9);
    let column = (cellCounter % 9);
    let itemRow = row + 1;
    let itemColumn = column + 1;
    let currentCellValue = initialMatrixValues.charAt(cellCounter);
    if (currentCellValue >= 1 && currentCellValue <=9) {
      howManyDigits++;
      quantityPerValue[currentCellValue]++
    } else {
      currentCellValue = 0;
    }
    //Process to create a new input field for the HTML, this time it is used replaceWith.
    let newDivInput = recurrent.createNewDivInput( row, column, currentCellValue );
    currentCellValue !== 0 ? newDivInput.classList.add("startingCellValue") : false;
    const mainMatrix = document.querySelector(".theMatrix .row" + itemRow +".column" + itemColumn);
    mainMatrix.replaceWith(newDivInput);
  };

  //Check if there are enough Digits
  if (howManyDigits >= 17) { //Valid unique-solution Sudokus must have at least 17 initial digits.
    let theMatrixStep = firstTimeNotesMatrix(globalVar.theMatrix[0]);
    theMatrixStep = analyzeMatrix(theMatrixStep);
    globalVar.theMatrix[0] = JSON.parse(JSON.stringify(theMatrixStep));
  } else {
    validPuzzle = false;
    console.log("--------------------------------------------");
    console.log("Not like this. Not like this – Switch");
    // alert("Ingress at least 17 digits different than zero, Not enough Digits");
    recurrent.showSweetAlert("error", "Oops...", "Ingress at least 17 digits different than zero, Not enough Digits!");
  };

  //Check if there are enough kind of digits for unique solution (At least 8 or 9 of the possible options)
  validPuzzle ? validPuzzle = validPuzzleCheck.enoughDiversityDigits(validPuzzle, quantityPerValue) : false;

  //Check if there are duplicated digits within the blocks (row, column and square)
  validPuzzle ? validPuzzle = validPuzzleCheck.validPuzzleRow(validPuzzle) : false;
  validPuzzle ? validPuzzle = validPuzzleCheck.validPuzzleColumn(validPuzzle) : false;
  validPuzzle ? validPuzzle = validPuzzleCheck.validPuzzleSquare(validPuzzle) : false;

  // Check if the puzzle has one only answer by solving it
  validPuzzle ? validPuzzle = validPuzzleCheck.validPuzzleSolvingIt(validPuzzle) : false;
  
  //Finally, check if Puzzle is valid to make decisions
  if (validPuzzle) {
    thePuzzleisValid(initialMatrixValues, isThisPuzzleNew);
  } else {
    globalVar.cellsResolved = 0;
    document.querySelector("#button-validate").disabled = false;
    document.querySelector("#button-validate").classList.remove("inactive");
    document.querySelector("#button-validate").classList.add("active");
    lightResetMatrixNotes();
  }
};

const loadMatrixManually = async () => {
  let randomPuzzle = randomSudoku.randomizePuzzle();
  let manualMatrixValues;
  document.querySelector(".theMatrix").style.opacity = "0.1"; //This line pretends to solve the Bug introduced by sweetAlerts in v0.4.21, in mobile, the sweetAlert box situated behind the Puzzle grid
  const { value: text } = await Swal.fire({

    input: 'textarea',
    title: 'INSTRUCTIONS',
    inputLabel: 'Introduce your Sudoku puzzle as a series of 81 digits between 0 and 9.',
    inputAttributes: {
      'aria-label': 'Ingress your Sudoku puzzle as a series of 81 digits between 0 and 9.',
    },
    inputValue : `${randomPuzzle}`,
    showCancelButton: true,
    footer : '0 or any different character means empty. If less than 81 will be filled with empty cells. If more than 81, the excess characters will be discarded.'
  })
  
  if (text) {
    manualMatrixValues = text
  }
  document.querySelector(".theMatrix").style.opacity = "1";
  loadMatrix(manualMatrixValues, true);
};

//Get the values from the form input into the Matrix
const createString = () => {
  let initialMatrixValues = "";   
  for (let row = 0; row <= 8; row++) {
    for (let column = 0; column <= 8; column++) {
      globalVar.loopsExecuted++;
      let itemRow = row + 1;
      let itemColumn = column + 1;
      let currentcell = document.querySelector(".theMatrix .row" + itemRow + ".column" + itemColumn);
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
    globalVar.currentStep--;
    globalVar.cellsResolved = globalVar.stepsDetail.find(step => step.currentStep === globalVar.currentStep).cellsResolved;
    globalVar.nishioGuessingActive = JSON.parse(JSON.stringify(globalVar.stepsDetail.find(step => step.currentStep === globalVar.currentStep).nishioGuessingActive));   
    const main = document.querySelector(".stepsDetails > div");
    main.removeChild(main.firstElementChild);
    //Config to remove the button of the new current step
    let currentArticle = document.querySelector(`#Step${globalVar.currentStep}`);
    currentArticle.removeChild(currentArticle.lastChild);
  };

  document.querySelector("#button-solveit").disabled = false;
  document.querySelector("#button-solveit").classList.add("active");
  document.querySelector("#button-solveit").classList.remove("inactive");
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
  rebuildTheMatrix(theMatrixDestinedStep);
  console.log("--------------------------------------------");
  console.log("Denial is the most predictable of all human responses – The Architect"); 
  recurrent.reviewNotes(theMatrixDestinedStep);
};

const rebuildTheMatrix = (theMatrixDestinedStep) => {
  for (let row = 0; row <= 8; row++) {
    for (let column = 0; column <= 8; column++) {
      globalVar.loopsExecuted++;

      let itemRow = row + 1;
      let itemColumn = column + 1;
      let newDivInput = recurrent.createNewDivInput( row, column, theMatrixDestinedStep[row][column][0] );
      const mainMatrix = document.querySelector(".theMatrix .row" + itemRow +".column" + itemColumn);
      mainMatrix.replaceWith(newDivInput);

      const newDivCandidate = recurrent.createNewDivCandidateNotes(row, column, theMatrixDestinedStep[row][column]);
      const mainMatrixNotes = document.querySelector(".theMatrixNotes " + ".row" + itemRow + ".column" + itemColumn);
      mainMatrixNotes.replaceWith(newDivCandidate);
    };
  };
};

//reset the values from the form input
const resetMatrix = () => {
  window.location.reload();
};

//////////////////////////
//Functions not exported
//////////////////////////

const thePuzzleisValid = (initialMatrixValues, isThisPuzzleNew) => {
  recurrent.reviewNotes(globalVar.theMatrix[0]);
  recurrent.deleteLastShowMe();
  modifyDOM.newSudokuPuzzleArticle();
  const instructions = document.querySelector(".instructions");
  instructions.remove();
  //stepsDetail push for step zero, so, when going back to step zero, there is information (like cellsResolved)
  globalVar.stepsDetail.push( { currentStep: globalVar.currentStep, cellValueFound: false, method: "start", cellsResolved: globalVar.cellsResolved, nishioGuessingActive: JSON.parse(JSON.stringify(globalVar.nishioGuessingActive)) } );

  //Process to save the current Sudoku Puzzle in Local Storage for future references, as first step it defines if there are more than X puzzle saved to delete the oldest one.
  if (isThisPuzzleNew) {    
    let previousSudokusRegEx = new RegExp("^SudokuCreated");
    let previousSudokusStrings =  findPastSudokus(previousSudokusRegEx);
    if (previousSudokusStrings.length >= 8) {
      //This part of the process deletes the oldest Sudoku if the number is exceded, to keep the ammount of puzzles controlled
      previousSudokusStrings = previousSudokusStrings.map( (puzzle) => puzzle.key);
      previousSudokusStrings = previousSudokusStrings.map( (puzzle) => puzzle.slice(14));
      previousSudokusStrings.sort((dateA, dateB) => Date.parse(dateA) - Date.parse(dateB));
      let oldestKey = previousSudokusStrings[0];
      localStorage.removeItem(`SudokuCreated-${oldestKey}`);
    };
    let currentDate = new Date().toString();
    let keyLocalStorage = `SudokuCreated-${currentDate}`;
    localStorage.setItem(keyLocalStorage, JSON.stringify(initialMatrixValues));
  };

  // Process to keep the empty cells and the transparency when rotating for the Notes, also to have the inputs replace as <p>s to avoid any more inputs during the solving process
  for (let row = 0; row <= 8; row++) {
    for (let column = 0; column <= 8; column++) {
      globalVar.loopsExecuted++;
      let itemRow = row + 1;
      let itemColumn = column + 1;
      let currentcell = document.querySelector(".theMatrix .row" + itemRow + ".column" + itemColumn);
      let currentCellValue = globalVar.theMatrix[0][row][column][0];
      if (currentCellValue === 0) {
      currentcell.innerHTML = `
      <div class="emptycell"></div>
      `;
      }; 
    };
  };

  //Process to activate EventListeners when hovering over any of the values set as initial values, so it shows the cells "seen" by that cell hovered.
  //Pending to be implemented

  //Activating buttons
  document.querySelector("#button-load").disabled = true;
  document.querySelector("#button-load").classList.remove("active", "visible");
  document.querySelector("#button-load").classList.add("inactive", "invisible");
  document.querySelector("#button-loadmanually").disabled = true;
  document.querySelector("#button-loadmanually").classList.remove("active", "visible");
  document.querySelector("#button-loadmanually").classList.add("inactive", "invisible");
  document.querySelector("#button-loadAPISudoku").disabled = true;
  document.querySelector("#button-loadAPISudoku").classList.remove("active", "visible");
  document.querySelector("#button-loadAPISudoku").classList.add("inactive", "invisible");
  document.querySelector("#button-validate").disabled = true;
  document.querySelector("#button-validate").classList.remove("active", "visible");
  document.querySelector("#button-validate").classList.add("inactive", "invisible");
  document.querySelector("#button-loadPastSudokus").disabled = true;
  document.querySelector("#button-loadPastSudokus").classList.remove("active", "visible");
  document.querySelector("#button-loadPastSudokus").classList.add("inactive", "invisible");
  document.querySelector("#button-solveit").disabled = false;
  document.querySelector("#button-solveit").classList.add("active", "visible");
  document.querySelector("#button-solveit").classList.remove("inactive", "invisible");
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
};

//Get the values from the form input into the Matrix
const firstTimeNotesMatrix = (theMatrixStep) => {
  let initialMatrixValues = "";   
  for (let row = 0; row <= 8; row++) {
    for (let column = 0; column <= 8; column++) {
      globalVar.loopsExecuted++;
      let itemRow = row + 1;
      let itemColumn = column + 1;
      let currentcell = document.querySelector(".theMatrix .row" + itemRow + ".column" + itemColumn);
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

//Function to load from localStorage previous created Sudokus for the user.
const findPastSudokus = (query) => {
  let puzzleKey, previousSudokusStrings = [];
  for (puzzleKey in localStorage) {
    if (localStorage.hasOwnProperty(puzzleKey)) {
      if (puzzleKey.match(query) || (!query && typeof puzzleKey === 'string')) {
        let value = JSON.parse(localStorage.getItem(puzzleKey));
        previousSudokusStrings.push({key:puzzleKey,val:value});
      };
    };
  };
  return previousSudokusStrings;
};

//reset the values from the form input
const lightResetMatrixNotes = () => {
  document.querySelector(".theMatrixNotes").innerHTML = "";
};

export { createMatrix, loadMatrix, loadMatrixManually, createString, analyzeMatrix, resetMatrix, rebuildTheMatrix, matrixReloaded };