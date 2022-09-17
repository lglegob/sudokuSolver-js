'use strict';
////////////////////////////////////////////////////////////////////////////////
//                      SOLVING PROCESSES FUNCTIONS                          //
//////////////////////////////////////////////////////////////////////////////

import * as recurrent from "./theRecurrentFunctions.js"
import * as notesZero from "./notesZero.js"

//function called each time a new value is found by any method
const cellvaluefound = (cellsresolvedCellFound, stepCellFound, theMatrixPreviousStep, row, column, currentcellvalue, areweshowingnotes, method) => {
  cellsresolvedCellFound++;
  stepCellFound++;
  let stepsinfoStepCellFound = [true, method, [row, column, currentcellvalue]];
  let theMatrixStepCellFound = JSON.parse(JSON.stringify(theMatrixPreviousStep)); //The point where a new step is created in theMatrix, so previous state is saved in step-1. It has to be used these JSON methods to avoid the copy by reference but by value
  console.log(`Cells resolved so far: ${cellsresolvedCellFound}`);
  document.querySelector("#button-reload").disabled = false; //applies only to step 1, but the if is unnecesary
  document.querySelector("#button-reload").classList.add("active");
  document.querySelector("#button-reload").classList.remove("inactive");
  if (areweshowingnotes === true)  recurrent.hideNotes(theMatrixStepCellFound);
  // here the currentcellvalue is set in theMatrix variable, and the corresponding notes in the cells of the same row, column and squatre deleted
  theMatrixStepCellFound[row][column] = [currentcellvalue, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  let theMatrixStep = notesZero.noteZeroRow(row, currentcellvalue, theMatrixStepCellFound);
  theMatrixStep = notesZero.noteZeroColumn(column, currentcellvalue, theMatrixStep);
  theMatrixStep = notesZero.noteZeroSquare(row, column, currentcellvalue, theMatrixStep);
  theMatrixStepCellFound = JSON.parse(JSON.stringify(theMatrixStep));
  // here the foundvalue is set in the html document to be shown, by calling the function newfoundvalueHTML
  let itemrow = row + 1;
  let itemcolumn = column + 1;
  newfoundvalueHTML(itemrow, itemcolumn, currentcellvalue, areweshowingnotes, theMatrixStepCellFound, method);
  return {cellsresolvedCellFound, stepCellFound, theMatrixStepCellFound, stepsinfoStepCellFound}
};

const newfoundvalueHTML = (itemrow, itemcolumn, currentcellvalue, areweshowingnotes, theMatrixStep, method) => {
  console.log(`the value in row ${itemrow}, column ${itemcolumn} is ${currentcellvalue} by ${method} method`);
  document.querySelector(".row" + itemrow + ".column" + itemcolumn + " input").setAttribute("value", currentcellvalue);
  let newfoundvalueArticle = document.createElement("article");
  newfoundvalueArticle.classList.add("newfoundvalue");
  // newfoundvalueArticle.setAttribute("id", DEFINE-ID);
  newfoundvalueArticle.innerHTML = `
  <p>New Found Value in row ${itemrow}, column ${itemcolumn}, the Value is ${currentcellvalue}, and was found using ${method} method</p>
  `;
  const main = document.querySelector(".found-values > div");
  main.prepend(newfoundvalueArticle);
  if (areweshowingnotes === true) recurrent.showNotes(theMatrixStep);
};

export { cellvaluefound, newfoundvalueHTML };