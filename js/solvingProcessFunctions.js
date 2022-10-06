'use strict';
import globalVar from "./globalVar.js";
import * as recurrent from "./recurrentFunctions.js";
import * as notesZero from "./notesZero.js";

////////////////////////////////////////////////////////////////////////////////
//                      SOLVING PROCESSES FUNCTIONS                          //
//////////////////////////////////////////////////////////////////////////////

//function called each time a new value is found by any method
const cellValueFound = (row, column, currentCellValue, method) => {
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
  let itemrow = row + 1;
  let itemcolumn = column + 1;
  newfoundvalueHTML(itemrow, itemcolumn, currentCellValue, theMatrixStepCellFound, method);
  return { theMatrixStepCellFound}
};

const newfoundvalueHTML = (itemrow, itemcolumn, currentCellValue, theMatrixStep, method) => {
  console.log("--------------------------------------------");
  console.log(`Cells resolved so far: ${globalVar.cellsResolved}`);
  console.log(`Loops executed so far: ${globalVar.loopsExecuted}`);
  console.log(`the value in row ${itemrow}, column ${itemcolumn} is ${currentCellValue} by ${method} method`);
  // document.querySelector(".row" + itemrow + ".column" + itemcolumn + " input").setAttribute("value", currentCellValue);
  // document.querySelector(".theMatrix " + ".row" + itemrow + ".column" + itemcolumn + " input").value = currentCellValue;

  //Config for modifying the html matrixes
  let newfoundInput = document.createElement("div");
  newfoundInput.classList.add("cell", "row" + itemrow, "column" + itemcolumn, "value" + currentCellValue);
  if(document.querySelector("#highlightChanges").checked) {
    newfoundInput.innerHTML = `
    <input type="number" min="1" max="9" value=${currentCellValue} class="justFoundCell">
    `;
  } else {
    newfoundInput.innerHTML = `
    <input type="number" min="1" max="9" value=${currentCellValue}>
    `;
  };
  const mainMatrix = document.querySelector(".theMatrix .row" + itemrow +".column" + itemcolumn);
  mainMatrix.replaceWith(newfoundInput);

  let newfoundInputNotes = document.createElement("div");
  newfoundInputNotes.classList.add("cell", "row" + itemrow, "column" + itemcolumn, "value" + currentCellValue);
  if(document.querySelector("#highlightChanges").checked) {
    newfoundInputNotes.innerHTML = `
    <input type="number" min="1" max="9" value=${currentCellValue} class="justFoundCell">
    `;
  } else {
    newfoundInputNotes.innerHTML = `
    <input type="number" min="1" max="9" value=${currentCellValue}>
    `;
  };
  const mainMatrixNotes = document.querySelector(".theMatrixNotes .row" + itemrow +".column" + itemcolumn);
  mainMatrixNotes.replaceWith(newfoundInputNotes);

  //Config for adding the description and card in stepsDetails Section
  let newfoundvalueArticle = document.createElement("article");
  newfoundvalueArticle.classList.add("newfoundvalue");
  newfoundvalueArticle.setAttribute("id", "Step" + globalVar.currentStep );
  newfoundvalueArticle.innerHTML = `
  <h3>Step ${globalVar.currentStep}</h3>
  <h4>Method ${method}</h4>
  <p>New Value Found in row ${itemrow}, column ${itemcolumn}.</p>
  <p>The Value is ${currentCellValue}.</p>
  `;
  const main = document.querySelector(".stepsDetails > div");
  main.prepend(newfoundvalueArticle);
  recurrent.reviewNotes(theMatrixStep);
};

export { cellValueFound, newfoundvalueHTML };