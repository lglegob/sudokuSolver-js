'use strict';
import globalVar from "./globalVar.js";
import * as recurrent from "./recurrentFunctions.js";
import * as notesZero from "./notesZero.js";
import * as modifyDOM from "./modifyingDOMFunctions.js";
import * as eventListeners from "./eventListeners.js";

////////////////////////////////////////////////////////////////////////////////
//                      SOLVING PROCESSES FUNCTIONS                          //
//////////////////////////////////////////////////////////////////////////////

//function called each time a new value is found by any method
const cellValueFound = (row, column, currentCellValue, method, mainBlock, mainBlockValue) => {
  globalVar.cellsResolved++;
  globalVar.currentStep++;
  globalVar.stepsDetail[globalVar.currentStep] = [true, method, [row, column, currentCellValue]];
  let theMatrixStepCellFound = JSON.parse(JSON.stringify(globalVar.theMatrix[globalVar.currentStep - 1])); //The point where a new step is created in theMatrix, so previous state is saved in step-1. It has to be used these JSON methods to avoid the copy by reference but by value
  document.querySelector("#button-reload").disabled = false; //applies only to step 1, but the if is unnecesary
  document.querySelector("#button-reload").classList.add("active");
  document.querySelector("#button-reload").classList.remove("inactive");
  // here the currentCellValue is set in theMatrix variable, and the corresponding notes in the cells of the same row, column and squatre deleted
  theMatrixStepCellFound[row][column] = [currentCellValue, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  let theMatrixStep = notesZero.noteZeroRow(row, currentCellValue, theMatrixStepCellFound);
  theMatrixStep = notesZero.noteZeroColumn(column, currentCellValue, theMatrixStep);
  theMatrixStep = notesZero.noteZeroSquareRC(row, column, currentCellValue, theMatrixStep);
  theMatrixStepCellFound = JSON.parse(JSON.stringify(theMatrixStep));
  // here the foundvalue is set in the html document to be shown, by calling the function newfoundvalueHTML
  let itemRow = row + 1;
  let itemColumn = column + 1;
  newfoundvalueHTML(itemRow, itemColumn, currentCellValue, theMatrixStepCellFound, method, mainBlock, mainBlockValue);
  return { theMatrixStepCellFound};
};

//This Function is called by SOLVING Techniques where a Cell Value is now certain. It can by NAKED Singles or HIDDEN Singles
const newfoundvalueHTML = (itemRow, itemColumn, currentCellValue, theMatrixStep, method, mainBlock, mainBlockValue) => {
  console.log("--------------------------------------------");
  console.log(`Cells resolved so far: ${globalVar.cellsResolved}`);
  console.log(`Loops executed so far: ${globalVar.loopsExecuted}`);
  console.log(`the value in row ${itemRow}, column ${itemColumn} is ${currentCellValue} by ${method} method`);
  // document.querySelector(".row" + itemRow + ".column" + itemColumn + " input").setAttribute("value", currentCellValue);
  // document.querySelector(".theMatrix " + ".row" + itemRow + ".column" + itemColumn + " input").value = currentCellValue;

  //Config for modifying the html matrixes
  let newfoundInput = document.createElement("div");
  newfoundInput.classList.add("cell", "row" + itemRow, "column" + itemColumn);
  let square = recurrent.defineSquareFromRC(itemRow - 1, itemColumn - 1);
  newfoundInput.classList.add("square" + square);
  newfoundInput.classList.add("value" + currentCellValue);
  if(globalVar.areHighlightsOn === true) {
    newfoundInput.innerHTML = `
    <input type="number" min="1" max="9" value=${currentCellValue} class="justFoundCell">
    `;
  } else {
    newfoundInput.innerHTML = `
    <input type="number" min="1" max="9" value=${currentCellValue}>
    `;
  };
  const mainMatrix = document.querySelector(".theMatrix .row" + itemRow +".column" + itemColumn);
  mainMatrix.replaceWith(newfoundInput);

  let newfoundInputNotes = document.createElement("div");
  newfoundInputNotes.classList.add("cell", "row" + itemRow, "column" + itemColumn);
  newfoundInputNotes.classList.add("square" + square);
  newfoundInputNotes.classList.add("value" + currentCellValue);
  if(globalVar.areHighlightsOn === true) {
    newfoundInputNotes.innerHTML = `
    <input type="number" min="1" max="9" value=${currentCellValue} class="justFoundCell">
    `;
  } else {
    newfoundInputNotes.innerHTML = `
    <input type="number" min="1" max="9" value=${currentCellValue}>
    `;
  };
  const mainMatrixNotes = document.querySelector(".theMatrixNotes .row" + itemRow +".column" + itemColumn);
  mainMatrixNotes.replaceWith(newfoundInputNotes);

  //Config for adding the description and card in stepsDetails Section
  let newfoundvalueArticle = document.createElement("article");
  newfoundvalueArticle.classList.add("newfoundvalue");
  newfoundvalueArticle.setAttribute("id", "Step" + globalVar.currentStep );
  newfoundvalueArticle.style.zIndex = -globalVar.currentStep;
  //At this point, it is defined if the value Found was by NAKED singles technique or by HIDDEN singles technique to give the appropiate message in stepsDetails
  if (method === "Detecting Singles") {
    newfoundvalueArticle.innerHTML = `
    <h3>Step ${globalVar.currentStep}</h3>
    <h4>${method}</h4>
    <p>Cell 
      <strong><span data-cellcoordinates=".row${itemRow}.column${itemColumn}">R${itemRow}C${itemColumn}</span></strong> 
      had just one possible Candidate (${currentCellValue}) left.
    </p>
    <p>The certain Value for this Cell is <strong>${currentCellValue}.</strong></p>
    `;
  } else {
    newfoundvalueArticle.innerHTML = `
    <h3>Step ${globalVar.currentStep}</h3>
    <h4>${method}</h4>
    <p>Cell 
      <strong><span data-cellcoordinates=".row${itemRow}.column${itemColumn}">R${itemRow}C${itemColumn}</span></strong> 
      within the ${mainBlock} ${mainBlockValue} was the only cell with Candidate (${currentCellValue}).
    </p>
    <p>The certain Value for this Cell is <strong>${currentCellValue}.</strong></p>
    `;
  };
  const main = document.querySelector(".stepsDetails > div");
  main.prepend(newfoundvalueArticle);

  //creating the Event Listeners to the recently created RC spans
  const spanRowColumnCoordinates = document.querySelectorAll(`#Step${globalVar.currentStep} span`);
  spanRowColumnCoordinates.forEach(rcSpan => {eventListeners.spanRowColumnCoordinatesListener(rcSpan)});

  recurrent.reviewNotes(theMatrixStep);
  modifyDOM.addGoBackToStepButton();
  modifyDOM.settingHighlightedBlock(mainBlock, mainBlockValue);
};

const newSudokuPuzzleArticle = () => {
  //Config for adding the description and card in stepsDetails Section
  let newfoundvalueArticle = document.createElement("article");
  newfoundvalueArticle.classList.add("newsudokupuzzle");
  newfoundvalueArticle.setAttribute("id", "Step" + globalVar.currentStep );
  newfoundvalueArticle.style.zIndex = -globalVar.currentStep;
  newfoundvalueArticle.innerHTML = `
  <h3>Step ${globalVar.currentStep}</h3>
  <h4>New Sudoku Puzzle</h4>
  <p>A new Sudoku Puzzle has been created. In this space you will find one card for each step you advance in the tutorial for your personalized Sudoku Puzzle</p>
  <p>Please use the buttons above the Puzzle to resolve or go back.</p>
  <p>You can return to the initial state of the puzzle by coming back to this card.</p>
  <p>Enjoy it and learn a lot about how solving your puzzle.</p>

  `;
  const main = document.querySelector(".stepsDetails > div");
  main.prepend(newfoundvalueArticle);
};

export { cellValueFound, newfoundvalueHTML, newSudokuPuzzleArticle };