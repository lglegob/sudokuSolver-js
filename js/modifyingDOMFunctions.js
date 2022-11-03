'use strict';
import globalVar from "./globalVar.js";
import * as eventListeners from "./eventListeners.js";
import * as recurrent from "./recurrentFunctions.js";
import * as coordinates from "./defineCoordinates.js";

////////////////////////////////////////////////////////////////////////////////
//                       DISCARDING DOM FUNCTIONS                            //
//////////////////////////////////////////////////////////////////////////////

//This Function is called by SOLVING Techniques where a Cell Value is now certain. It can by NAKED Singles or HIDDEN Singles
const newFoundValueHTML = (itemRow, itemColumn, currentCellValue, theMatrixStep, method, mainBlock, mainBlockValue) => {
  console.log("--------------------------------------------");
  console.log(`Cells resolved so far: ${globalVar.cellsResolved}`);
  console.log(`Loops executed so far: ${globalVar.loopsExecuted}`);
  console.log(`the value in row ${itemRow}, column ${itemColumn} is ${currentCellValue} by ${method} method`);
  // document.querySelector(".row" + itemRow + ".column" + itemColumn + " input").setAttribute("value", currentCellValue);
  // document.querySelector(".theMatrix " + ".row" + itemRow + ".column" + itemColumn + " input").value = currentCellValue;

  //Config for modifying the html matrixes
  let newfoundInput = document.createElement("div");
  newfoundInput.classList.add("cell", "row" + itemRow, "column" + itemColumn);
  let square = coordinates.defineSquareFromRC(itemRow - 1, itemColumn - 1);
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
  } else if (method.includes("Hidden Singles")) {
    newfoundvalueArticle.innerHTML = `
    <h3>Step ${globalVar.currentStep}</h3>
    <h4>${method}</h4>
    <p>Cell 
      <strong><span data-cellcoordinates=".row${itemRow}.column${itemColumn}">R${itemRow}C${itemColumn}</span></strong> 
      within the ${mainBlock} ${mainBlockValue} was the only cell with Candidate (${currentCellValue}).
    </p>
    <p>The certain Value for this Cell is <strong>${currentCellValue}.</strong></p>
    `;
  } else if (method.includes("Nishio Guessing")) {
    newfoundvalueArticle.innerHTML = `
    <h3>Step ${globalVar.currentStep}</h3>
    <h4>${method}</h4>
    <p>We need to do a guess</p>
    <p>Cell 
    <strong><span data-cellcoordinates=".row${itemRow}.column${itemColumn}">R${itemRow}C${itemColumn}</span></strong> 
    had two possible candidates (${currentCellValue} and ${globalVar.nishioGuessingActive.currentDiscardedCandidate}).
    </p>
    <p>Let's suppose for Cell 
      <strong><span data-cellcoordinates=".row${itemRow}.column${itemColumn}">R${itemRow}C${itemColumn}</span></strong> 
      that the certain value is Candidate (${currentCellValue}) and discard for the moment, the Candidate ${globalVar.nishioGuessingActive.currentDiscardedCandidate}.
    </p>
    <p>The guessed Value for this Cell is <strong>${currentCellValue}.</strong> which can be proven wrong or right in the next few steps</p>
    `;
  };
  const main = document.querySelector(".stepsDetails > div");
  main.prepend(newfoundvalueArticle);

  //creating the Event Listeners to the recently created RC spans
  const spanRowColumnCoordinates = document.querySelectorAll(`#Step${globalVar.currentStep} span`);
  spanRowColumnCoordinates.forEach(rcSpan => {eventListeners.spanRowColumnCoordinatesListener(rcSpan)});

  recurrent.reviewNotes(theMatrixStep);
  addGoBackToStepButton();
  settingHighlightedBlock(mainBlock, mainBlockValue);
};

//This Function is called by OBVIOUSPAIRS Techniques
const discardObviousPairsHTML = (mainaxisvalue, mainaxis, cellsIdentified, currentCandidates, method) => {
  console.log("--------------------------------------------");
  console.log("There are only two possible explanations: either no one told me, or no one knows. - Neo");
  console.log(`Cells resolved so far: ${globalVar.cellsResolved}`);
  console.log(`Loops executed so far: ${globalVar.loopsExecuted}`);  
  console.log("We found an Obvious Pair!")
  mainaxis === "square" ? mainaxisvalue-- : false; //To adjust in the case of squares, which go from 1 to 9 instead of 0 to 8;
  console.log(`We are looking at ${mainaxis} ${mainaxisvalue + 1}, the first cell is row${cellsIdentified.cell1.row + 1} column${cellsIdentified.cell1.column + 1}, and the second cell is row${cellsIdentified.cell2.row + 1} column${cellsIdentified.cell2.column + 1}`)
  console.log(`The common pair notes are ${currentCandidates.candidate1} and ${currentCandidates.candidate2}, they have been deleted from other cells in the ${mainaxis} ${mainaxisvalue + 1}`);
  document.querySelector("#button-reload").disabled = false; //applies only to step 1, but the if is unnecesary
  document.querySelector("#button-reload").classList.add("active");
  document.querySelector("#button-reload").classList.remove("inactive");
  let newDiscardArticle = document.createElement("article");
  newDiscardArticle.classList.add("newDiscardObviousPairs");
  newDiscardArticle.setAttribute("id", "Step" + globalVar.currentStep);
  newDiscardArticle.style.zIndex = -globalVar.currentStep;
  newDiscardArticle.innerHTML = `
  <h3>Step ${globalVar.currentStep}</h3>
  <h4>${method}</h4>
  <p>Cells 
    <strong><span data-cellcoordinates=".row${cellsIdentified.cell1.row + 1}.column${cellsIdentified.cell1.column  + 1}">R${cellsIdentified.cell1.row + 1}C${cellsIdentified.cell1.column + 1}</span></strong> and 
    <strong><span data-cellcoordinates=".row${cellsIdentified.cell2.row + 1}.column${cellsIdentified.cell2.column  + 1}">R${cellsIdentified.cell2.row + 1}C${cellsIdentified.cell2.column + 1}</span></strong> 
    contain an obvious pair (Cells with the same two only candidates)
  </p>
  <p>The two cells are within the same Block (${mainaxis} ${mainaxisvalue + 1}), and the candidates are ${currentCandidates.candidate1} and ${currentCandidates.candidate2}</p>
  <p>These Candidates, ${currentCandidates.candidate1} and ${currentCandidates.candidate2}, have been deleted from other cells within the ${mainaxis} ${mainaxisvalue + 1}</p>
  `;
  const main = document.querySelector(".stepsDetails > div");
  main.prepend(newDiscardArticle);

  //creating the Event Listeners to the recently created RC spans
  const spanRowColumnCoordinates = document.querySelectorAll(`#Step${globalVar.currentStep} span`);
  spanRowColumnCoordinates.forEach(rcSpan => {eventListeners.spanRowColumnCoordinatesListener(rcSpan)});

  addGoBackToStepButton();
  settingHighlightedBlock(mainaxis, mainaxisvalue + 1);
};

//This Function is called by HIDDENPAIRS Techniques
const discardHiddenPairHTML = (mainaxisvalue, mainaxis, cellsIdentified, currentCandidates, method) => {
  console.log("--------------------------------------------");
  console.log("We are still here! – Morpheus");
  console.log(`Cells resolved so far: ${globalVar.cellsResolved}`);
  console.log(`Loops executed so far: ${globalVar.loopsExecuted}`);  
  console.log("We found an Hidden Pair!")
  mainaxis === "square" ? mainaxisvalue-- : false; //To adjust in the case of squares, which go from 1 to 9 instead of 0 to 8;
  console.log(`We are looking at ${mainaxis} ${mainaxisvalue + 1}, the first cell is row${cellsIdentified.cell1.row + 1} column${cellsIdentified.cell1.column + 1}, and the second cell is row${cellsIdentified.cell2.row + 1} column${cellsIdentified.cell2.column + 1}`)
  console.log(`The hidden pair notes are ${currentCandidates.candidate1} and ${currentCandidates.candidate2}, these are kept and all other notes in those two cells have been deleted`);
  document.querySelector("#button-reload").disabled = false; //applies only to step 1, but the if is unnecesary
  document.querySelector("#button-reload").classList.add("active");
  document.querySelector("#button-reload").classList.remove("inactive");
  let newDiscardArticle = document.createElement("article");
  newDiscardArticle.classList.add("newDiscarHiddenPair");
  newDiscardArticle.setAttribute("id", "Step" + globalVar.currentStep);
  newDiscardArticle.style.zIndex = -globalVar.currentStep;
  newDiscardArticle.innerHTML = `
  <h3>Step ${globalVar.currentStep}</h3>
  <h4>${method}</h4>
  <p>Cells 
    <strong><span data-cellcoordinates=".row${cellsIdentified.cell1.row + 1}.column${cellsIdentified.cell1.column + 1}">R${cellsIdentified.cell1.row + 1}C${cellsIdentified.cell1.column + 1}</span></strong> and 
    <strong><span data-cellcoordinates=".row${cellsIdentified.cell2.row + 1}.column${cellsIdentified.cell2.column + 1}"> R${cellsIdentified.cell2.row + 1}C${cellsIdentified.cell2.column + 1}</span></strong> 
    contain a hidden pair (The only two Cells within a block with the same two candidates)
  </p>
  <p>The two cells are within the same Block (${mainaxis} ${mainaxisvalue + 1}), and the candidates are ${currentCandidates.candidate1} and ${currentCandidates.candidate2}</p>
  <p>These Candidates, ${currentCandidates.candidate1} and ${currentCandidates.candidate2}, are the only ones kept, all other candidates have been deleted within the ${mainaxis} ${mainaxisvalue + 1} in those two cells</p>
  `;
  const main = document.querySelector(".stepsDetails > div");
  main.prepend(newDiscardArticle);

  //creating the Event Listeners to the recently created RC spans
  const spanRowColumnCoordinates = document.querySelectorAll(`#Step${globalVar.currentStep} span`);
  spanRowColumnCoordinates.forEach(rcSpan => {eventListeners.spanRowColumnCoordinatesListener(rcSpan)});

  addGoBackToStepButton();
  settingHighlightedBlock(mainaxis, mainaxisvalue + 1);
};

//This Function is called by OBVIOUSTRIPLES Techniques
const discardObviousTripleHTML = (mainaxisvalue, mainaxis, cellsIdentified, currentCandidates, method) => {
  console.log("--------------------------------------------");
  console.log("The answer is out there, Neo. It's looking for you.. - Trinity");
  console.log(`Cells resolved so far: ${globalVar.cellsResolved}`);
  console.log(`Loops executed so far: ${globalVar.loopsExecuted}`);  
  console.log("We found an Obvious Triple!")
  mainaxis === "square" ? mainaxisvalue-- : false; //To adjust in the case of squares, which go from 1 to 9 instead of 0 to 8;
  console.log(`We are looking at ${mainaxis} ${mainaxisvalue + 1}, the first Cell is row${cellsIdentified.cell1.row + 1} column${cellsIdentified.cell1.column + 1}, the second Cell is row${cellsIdentified.cell2.row + 1} column${cellsIdentified.cell2.column + 1} and the Third Cell is row${cellsIdentified.cell3.row + 1} column${cellsIdentified.cell3.column + 1}`)
  console.log(`The common triple notes are ${currentCandidates.candidate1}, ${currentCandidates.candidate2} and ${currentCandidates.candidate1}, they have been deleted from other cells in the ${mainaxis} ${mainaxisvalue + 1}`);
  document.querySelector("#button-reload").disabled = false; //applies only to step 1, but the if is unnecesary
  document.querySelector("#button-reload").classList.add("active");
  document.querySelector("#button-reload").classList.remove("inactive");
  let newDiscardArticle = document.createElement("article");
  newDiscardArticle.classList.add("newdiscardTripleCandidates");
  newDiscardArticle.setAttribute("id", "Step" + globalVar.currentStep);
  newDiscardArticle.style.zIndex = -globalVar.currentStep;
  newDiscardArticle.innerHTML = `
  <h3>Step ${globalVar.currentStep}</h3>
  <h4>${method}</h4>
  <p>Cells 
    <strong><span data-cellcoordinates=".row${cellsIdentified.cell1.row + 1}.column${cellsIdentified.cell1.column  + 1}">R${cellsIdentified.cell1.row + 1}C${cellsIdentified.cell1.column + 1}</span></strong>,  
    <strong><span data-cellcoordinates=".row${cellsIdentified.cell2.row + 1}.column${cellsIdentified.cell2.column  + 1}">R${cellsIdentified.cell2.row + 1}C${cellsIdentified.cell2.column + 1}</span></strong> and 
    <strong><span data-cellcoordinates=".row${cellsIdentified.cell3.row + 1}.column${cellsIdentified.cell3.column  + 1}">R${cellsIdentified.cell3.row + 1}C${cellsIdentified.cell3.column + 1}</span></strong>
    contain an obvious triple (Cells with the same three only candidates)
  </p>
  <p>The three cells are within the same Block (${mainaxis} ${mainaxisvalue + 1}), and the candidates are ${currentCandidates.candidate1}, ${currentCandidates.candidate2} and ${currentCandidates.candidate3}</p>
  <p>These Candidates, ${currentCandidates.candidate1}, ${currentCandidates.candidate2} and ${currentCandidates.candidate3}, have been deleted from other cells within the ${mainaxis} ${mainaxisvalue + 1}</p>
  `;
  const main = document.querySelector(".stepsDetails > div");
  main.prepend(newDiscardArticle);

  //creating the Event Listeners to the recently created RC spans
  const spanRowColumnCoordinates = document.querySelectorAll(`#Step${globalVar.currentStep} span`);
  spanRowColumnCoordinates.forEach(rcSpan => {eventListeners.spanRowColumnCoordinatesListener(rcSpan)});

  addGoBackToStepButton();
  settingHighlightedBlock(mainaxis, mainaxisvalue + 1);
};

const discardHiddenTripleHTML = (mainaxisvalue, mainaxis, cellsIdentified, currentCandidates, method) => {
  console.log("--------------------------------------------");
  console.log("The Best Thing About Being Me... There Are So MANY Me's! – Agent Smith");
  console.log(`Cells resolved so far: ${globalVar.cellsResolved}`);
  console.log(`Loops executed so far: ${globalVar.loopsExecuted}`);  
  console.log("We found an Hidden Triple!")
  mainaxis === "square" ? mainaxisvalue-- : false; //To adjust in the case of squares, which go from 1 to 9 instead of 0 to 8;
  console.log(`We are looking at ${mainaxis} ${mainaxisvalue + 1}, the first cell is row${cellsIdentified.cell1.row + 1} column${cellsIdentified.cell1.column + 1}, the second cell is row${cellsIdentified.cell2.row + 1} column${cellsIdentified.cell2.column + 1} and the third cell is row${cellsIdentified.cell3.row + 1} column${cellsIdentified.cell3.column + 1}`)
  console.log(`The hidden triple notes are ${currentCandidates.candidate1}, ${currentCandidates.candidate2} and ${currentCandidates.candidate3}, these are kept and all other notes in those two cells have been deleted`);
  document.querySelector("#button-reload").disabled = false; //applies only to step 1, but the if is unnecesary
  document.querySelector("#button-reload").classList.add("active");
  document.querySelector("#button-reload").classList.remove("inactive");
  let newDiscardArticle = document.createElement("article");
  newDiscardArticle.classList.add("newDiscarHiddenTriple");
  newDiscardArticle.setAttribute("id", "Step" + globalVar.currentStep);
  newDiscardArticle.style.zIndex = -globalVar.currentStep;
  newDiscardArticle.innerHTML = `
  <h3>Step ${globalVar.currentStep}</h3>
  <h4>${method}</h4>
  <p>Cells 
    <strong><span data-cellcoordinates=".row${cellsIdentified.cell1.row + 1}.column${cellsIdentified.cell1.column + 1}">R${cellsIdentified.cell1.row + 1}C${cellsIdentified.cell1.column + 1}</span></strong>,  
    <strong><span data-cellcoordinates=".row${cellsIdentified.cell2.row + 1}.column${cellsIdentified.cell2.column + 1}"> R${cellsIdentified.cell2.row + 1}C${cellsIdentified.cell2.column + 1}</span></strong> and 
    <strong><span data-cellcoordinates=".row${cellsIdentified.cell3.row + 1}.column${cellsIdentified.cell3.column + 1}"> R${cellsIdentified.cell3.row + 1}C${cellsIdentified.cell3.column + 1}</span></strong> 
    contain a hidden triple (The only three Cells within a block with the same three candidates)
  </p>
  <p>The three cells are within the same Block (${mainaxis} ${mainaxisvalue + 1}), and the candidates are ${currentCandidates.candidate1}, ${currentCandidates.candidate2} and ${currentCandidates.candidate3}</p>
  <p>These Candidates, ${currentCandidates.candidate1}, ${currentCandidates.candidate2} and ${currentCandidates.candidate3}, are the only ones kept, all other candidates have been deleted within the ${mainaxis} ${mainaxisvalue + 1} in those three cells</p>
  `;
  const main = document.querySelector(".stepsDetails > div");
  main.prepend(newDiscardArticle);

  //creating the Event Listeners to the recently created RC spans
  const spanRowColumnCoordinates = document.querySelectorAll(`#Step${globalVar.currentStep} span`);
  spanRowColumnCoordinates.forEach(rcSpan => {eventListeners.spanRowColumnCoordinatesListener(rcSpan)});

  addGoBackToStepButton();
  settingHighlightedBlock(mainaxis, mainaxisvalue + 1);
};

//This Function is called by LOCKEDCANDIDATE Techniques
const discardLockedCandidateHTML = (mainaxisvalue, mainaxis, secondaryaxisvalue, secondaryaxis, value, method) => {
  console.log("--------------------------------------------");
  console.log("Remember, all I’m offering is the truth. Nothing more. - Morpheus");
  console.log(`Cells resolved so far: ${globalVar.cellsResolved}`);
  console.log(`Loops executed so far: ${globalVar.loopsExecuted}`);  
  console.log("We found a locked Candidate!")
  mainaxis === "square" ? mainaxisvalue-- : false; //To adjust in the case of squares, which go from 1 to 9 instead of 0 to 8;
  secondaryaxis === "square" ? secondaryaxisvalue-- : false //To adjust in the case of squares, which go from 1 to 9 instead of 0 to 8;
  console.log(`For the ${secondaryaxis} ${secondaryaxisvalue + 1}, all the candidates value of ${value} are contained in the ${mainaxis} ${mainaxisvalue + 1}`)
  console.log(`Candidates notes for ${value} in other ${secondaryaxis}s within the same ${mainaxis} ${mainaxisvalue + 1} have been deleted`);
  document.querySelector("#button-reload").disabled = false; //applies only to step 1, but the if is unnecesary
  document.querySelector("#button-reload").classList.add("active");
  document.querySelector("#button-reload").classList.remove("inactive");
  let newDiscardArticle = document.createElement("article");
  newDiscardArticle.classList.add("newdiscardLockedCandidate");
  newDiscardArticle.setAttribute("id", "Step" + globalVar.currentStep);
  newDiscardArticle.style.zIndex = -globalVar.currentStep;
  newDiscardArticle.innerHTML = `
  <h3>Step ${globalVar.currentStep}</h3>
  <h4>${method}</h4>
  <p>In ${secondaryaxis} ${secondaryaxisvalue + 1}, all the cells with the candidate ${value}, are confined to the same ${mainaxis} ${mainaxisvalue + 1}</p>
  <p>For ${secondaryaxis} ${secondaryaxisvalue + 1} to have a ${value}, it must be in one of those cells shared with ${mainaxis} ${mainaxisvalue + 1} fulfilling also the requirement of ${mainaxis} ${mainaxisvalue + 1} to have a ${value}</p>
  <p>So, all candidates with value ${value} within ${mainaxis} ${mainaxisvalue + 1}, that do not belong to ${secondaryaxis} ${secondaryaxisvalue + 1} have been deleted</p>
  `;
  const main = document.querySelector(".stepsDetails > div");
  main.prepend(newDiscardArticle);

  addGoBackToStepButton();
  settingHighlightedBlock(secondaryaxis, secondaryaxisvalue + 1);
};

//This Function is called by X-WING Techniques
const discardXWingHTML = (mainaxisvalues, mainaxis, secondaryaxisvalues, secondaryaxis, value, method) => {
  console.log("--------------------------------------------");
  console.log("All the time. It's called mescaline, it's the only way to fly. - Choi");
  console.log(`Cells resolved so far: ${globalVar.cellsResolved}`);
  console.log(`Loops executed so far: ${globalVar.loopsExecuted}`);  
  console.log("We found an X-Wing Candidate!")
  console.log(`For the ${mainaxis}s ${mainaxisvalues[0] + 1} and ${mainaxisvalues[1] + 1}, the candidate note ${value} is chained in X-Wing`)
  console.log(`Candidates notes for ${value} in ${secondaryaxis}s ${secondaryaxisvalues[0] + 1} and ${secondaryaxisvalues[1] + 1} other other than the ${mainaxis}s specified above have been deleted`);
  document.querySelector("#button-reload").disabled = false; //applies only to step 1, but the if is unnecesary
  document.querySelector("#button-reload").classList.add("active");
  document.querySelector("#button-reload").classList.remove("inactive");
  let newDiscardArticle = document.createElement("article");
  newDiscardArticle.classList.add("newdiscardXWing");
  newDiscardArticle.setAttribute("id", "Step" + globalVar.currentStep);
  newDiscardArticle.style.zIndex = -globalVar.currentStep;
  
  if (mainaxis === "row") {
    newDiscardArticle.innerHTML =  `
    <h3>Step ${globalVar.currentStep}</h3>
    <h4>${method}</h4>
    <p>
      4 Cells in X-Wing configuration shared a candidate, the cells are 
      <strong><span data-cellcoordinates=".row${mainaxisvalues[0] + 1}.column${secondaryaxisvalues[0] + 1}">R${mainaxisvalues[0] + 1}C${secondaryaxisvalues[0] + 1}</span></strong>, 
      <strong><span data-cellcoordinates=".row${mainaxisvalues[0] + 1}.column${secondaryaxisvalues[1] + 1}">R${mainaxisvalues[0] + 1}C${secondaryaxisvalues[1] + 1}</span></strong>, 
      <strong><span data-cellcoordinates=".row${mainaxisvalues[1] + 1}.column${secondaryaxisvalues[0] + 1}">R${mainaxisvalues[1] + 1}C${secondaryaxisvalues[0] + 1}</span></strong> and 
      <strong><span data-cellcoordinates=".row${mainaxisvalues[1] + 1}.column${secondaryaxisvalues[1] + 1}">R${mainaxisvalues[1] + 1}C${secondaryaxisvalues[1] + 1}</span></strong>.
    </p>
    <p>These 4 cells are the crosspoints between Rows R${mainaxisvalues[0] + 1} and R${mainaxisvalues[1] + 1}, and Columns C${secondaryaxisvalues[0] + 1} and C${secondaryaxisvalues[1] + 1}</p>
    <p>Since no more candidates with option ${value} exist within the two Rows, we know for sure those two ${value}s must exist in two of those 4 cells in a diagonal (R${mainaxisvalues[0] + 1}C${secondaryaxisvalues[0] + 1} and R${mainaxisvalues[1] + 1}C${secondaryaxisvalues[1] + 1} will be ${value} OR R${mainaxisvalues[0] + 1}C${secondaryaxisvalues[1] + 1} and R${mainaxisvalues[1] + 1}C${secondaryaxisvalues[0] + 1} will be ${value})</p>
    <p>Because having those two mandatory ${value}s in two of the cells, we are sure that the two Columns will already have the ${value}</p>
    <p>So, all candidates with value ${value} in Columns C${secondaryaxisvalues[0] + 1} and C${secondaryaxisvalues[1] + 1}, that do not belong to Rows R${mainaxisvalues[0] + 1} and R${mainaxisvalues[1] + 1} have been deleted</p>
    `;
  } else {
    newDiscardArticle.innerHTML =  `
    <h3>Step ${globalVar.currentStep}</h3>
    <h4>${method}</h4>
    <p>
      4 Cells in X-Wing configuration shared a candidate, the cells are 
      <strong><span data-cellcoordinates=".row${secondaryaxisvalues[0] + 1}.column${mainaxisvalues[0] + 1}">R${secondaryaxisvalues[0] + 1}C${mainaxisvalues[0] + 1}</span></strong>, 
      <strong><span data-cellcoordinates=".row${secondaryaxisvalues[0] + 1}.column${mainaxisvalues[1] + 1}">R${secondaryaxisvalues[0] + 1}C${mainaxisvalues[1] + 1}</span></strong>, 
      <strong><span data-cellcoordinates=".row${secondaryaxisvalues[1] + 1}.column${mainaxisvalues[0] + 1}">R${secondaryaxisvalues[1] + 1}C${mainaxisvalues[0] + 1}</span></strong> and 
      <strong><span data-cellcoordinates=".row${secondaryaxisvalues[1] + 1}.column${mainaxisvalues[1] + 1}">R${secondaryaxisvalues[1] + 1}C${mainaxisvalues[1] + 1}</span></strong>.
    </p>
    <p>These 4 cells are the crosspoints between Rows R${secondaryaxisvalues[0] + 1} and R${secondaryaxisvalues[1] + 1}, and Columns C${mainaxisvalues[0] + 1} and C${mainaxisvalues[1] + 1}</p>
    <p>
      Since no more candidates with option ${value} exist within the two Columns, we know for sure those two ${value}s must exist in two of those 4 cells in a diagonal, either  
      (<strong><span data-cellcoordinates=".row${secondaryaxisvalues[0] + 1}.column${mainaxisvalues[0] + 1}">R${secondaryaxisvalues[0] + 1}C${mainaxisvalues[0] + 1}</span></strong> and 
      <strong><span data-cellcoordinates=".row${secondaryaxisvalues[1] + 1}.column${mainaxisvalues[1] + 1}">R${secondaryaxisvalues[1] + 1}C${mainaxisvalues[1] + 1}</span></strong> 
      will be ${value}) OR 
      (<strong><span data-cellcoordinates=".row${secondaryaxisvalues[0] + 1}.column${mainaxisvalues[1] + 1}">R${secondaryaxisvalues[0] + 1}C${mainaxisvalues[1] + 1}</span></strong> and 
      <strong><span data-cellcoordinates=".row${secondaryaxisvalues[1] + 1}.column${mainaxisvalues[0] + 1}">R${secondaryaxisvalues[1] + 1}C${mainaxisvalues[0] + 1}</span></strong> will be ${value})
    </p>
    <p>Because having those two mandatory ${value}s in two of the cells, we are sure that the two Rows will already have the ${value}</p>
    <p>So, all candidates with value ${value} in Rows R${secondaryaxisvalues[0] + 1} and R${secondaryaxisvalues[1] + 1}, that do not belong to Columns C${mainaxisvalues[0] + 1} and C${mainaxisvalues[1] + 1} have been deleted</p>
    `;
  };

  const main = document.querySelector(".stepsDetails > div");
  main.prepend(newDiscardArticle);

  //creating the Event Listeners to the recently created RC spans
  const spanRowColumnCoordinates = document.querySelectorAll(`#Step${globalVar.currentStep} span`);
  spanRowColumnCoordinates.forEach(rcSpan => {eventListeners.spanRowColumnCoordinatesListener(rcSpan)});

  addGoBackToStepButton();
  settingHighlightedBlock(mainaxis, mainaxisvalues[0] + 1);
  settingHighlightedBlock(mainaxis, mainaxisvalues[1] + 1);
};

//This Function is called by Y-WING Techniques
const discardYWingHTML = (pivotValues, pincer1Values, pincer1Axis, pincer2Values, pincer2Axis, pincerX, pincerY, pincerZ, method) => {
  console.log("--------------------------------------------");
  console.log("You must know it by now! You can't win! It's pointless to keep fighting! Why, Mr. Anderson?! Why? WHY DO YOU PERSIST?. - Agent Smith");
  console.log(`Cells resolved so far: ${globalVar.cellsResolved}`);
  console.log(`Loops executed so far: ${globalVar.loopsExecuted}`);  
  console.log("We found an Y-Wing Candidate!")
  document.querySelector("#button-reload").disabled = false; //applies only to step 1, but the if is unnecesary
  document.querySelector("#button-reload").classList.add("active");
  document.querySelector("#button-reload").classList.remove("inactive");
  let newDiscardArticle = document.createElement("article");
  newDiscardArticle.classList.add("newdiscardYWing");
  newDiscardArticle.setAttribute("id", "Step" + globalVar.currentStep);
  newDiscardArticle.style.zIndex = -globalVar.currentStep;
  
  newDiscardArticle.innerHTML =  `
  <h3>Step ${globalVar.currentStep}</h3>
  <h4>${method}</h4>
  <p>
    Cells in Y-Wing configuration have been found, Pivot cell is 
    <strong><span data-cellcoordinates=".row${pivotValues[0] + 1}.column${pivotValues[1] + 1}">R${pivotValues[0] + 1}C${pivotValues[1] + 1}</span></strong>, 
    with Candidates ${pincerX} and ${pincerY}.
  </p>
  <p>
    First Pincer found in the same ${pincer1Axis} in cell 
    <strong><span data-cellcoordinates=".row${pincer1Values[0] + 1}.column${pincer1Values[1] + 1}">R${pincer1Values[0] + 1}C${pincer1Values[1] + 1}</span></strong>, 
    sharing the Candidate ${pincerX}.
  </p>
  <p>
    Second Pincer found in the same ${pincer2Axis} in cell 
    <strong><span data-cellcoordinates=".row${pincer2Values[0] + 1}.column${pincer2Values[1] + 1}">R${pincer2Values[0] + 1}C${pincer2Values[1] + 1}</span></strong>, 
    sharing the Candidate ${pincerY}.
    </p>
  <p>
    No matter the case, the candidate ${pincerZ} present in both Pincer cells will be either in 
    <strong><span data-cellcoordinates=".row${pincer1Values[0] + 1}.column${pincer1Values[1] + 1}">R${pincer1Values[0] + 1}C${pincer1Values[1] + 1}</span></strong> 
    OR in 
    <strong><span data-cellcoordinates=".row${pincer2Values[0] + 1}.column${pincer2Values[1] + 1}">R${pincer2Values[0] + 1}C${pincer2Values[1] + 1}</span></strong>.
  </p>
  <p>Either case, for Cells "seen" by both Pincers is not possible to have the value ${pincerZ}, so, it has been deleted as candidate in those cells.</p>
  `;

  const main = document.querySelector(".stepsDetails > div");
  main.prepend(newDiscardArticle);

  //creating the Event Listeners to the recently created RC spans
  const spanRowColumnCoordinates = document.querySelectorAll(`#Step${globalVar.currentStep} span`);
  spanRowColumnCoordinates.forEach(rcSpan => {eventListeners.spanRowColumnCoordinatesListener(rcSpan)});

  addGoBackToStepButton();
  settingHighlightedBlock("cell", [pivotValues[0] + 1, pivotValues[1] + 1]);
  settingHighlightedBlock("cell", [pincer1Values[0] + 1, pincer1Values[1] + 1]);
  settingHighlightedBlock("cell", [pincer2Values[0] + 1, pincer2Values[1] + 1]);
};

//This Function is called by Y-WING Techniques
const discardNishioCandidateProvenWrongHTML = (row, column, wrongCandidate, method, mainaxis, mainaxisvalue ) => {
  console.log("--------------------------------------------");
  console.log("Don'd think you are, know you are! - Morpheus");
  console.log(`Cells resolved so far: ${globalVar.cellsResolved}`);
  console.log(`Loops executed so far: ${globalVar.loopsExecuted}`);  
  console.log("We prove a nishio candidate wrong!")
  document.querySelector("#button-reload").disabled = false; //applies only to step 1, but the if is unnecesary
  document.querySelector("#button-reload").classList.add("active");
  document.querySelector("#button-reload").classList.remove("inactive");
  let newDiscardArticle = document.createElement("article");
  newDiscardArticle.classList.add("newdiscardNishioCandidate");
  newDiscardArticle.setAttribute("id", "Step" + globalVar.currentStep);
  newDiscardArticle.style.zIndex = -globalVar.currentStep;
  
  newDiscardArticle.innerHTML =  `
  <h3>Step ${globalVar.currentStep}</h3>
  <h4>${method}</h4>
  <p>
    After guessing the candidate ${wrongCandidate} as the possible certain value for cell 
    <strong><span data-cellcoordinates=".row${mainaxisvalue[0] + 1}.column${mainaxisvalue[1] + 1}">R${mainaxisvalue[0] + 1}C${mainaxisvalue[1] + 1}</span></strong>, 
    in step ${globalVar.nishioGuessingActive.step + 1}, and testing its validity, it was found as a wrong guessing.
  </p>
  <p>In previous Step, after ${globalVar.currentStep - globalVar.nishioGuessingActive.step - 2} steps, the cell
  <strong><span data-cellcoordinates=".row${row + 1}.column${column + 1}">R${row + 1}C${column + 1}</span></strong>
  was left with NO possible candidates with no certain value yet, which is not possible in a valid sudoku.
  </p>
  <p>
  This shows the guessing made in step ${globalVar.nishioGuessingActive.step + 1} was incorrect and the puzzle has been returned to the state in that step.</p>
  <p>So, now for certain, candidate ${wrongCandidate} has been discarded as option in cell
  <strong><span data-cellcoordinates=".row${mainaxisvalue[0] + 1}.column${mainaxisvalue[1] + 1}">R${mainaxisvalue[0] + 1}C${mainaxisvalue[1] + 1}</span></strong>.
  </p>
  `;

  const main = document.querySelector(".stepsDetails > div");
  main.prepend(newDiscardArticle);

  //creating the Event Listeners to the recently created RC spans
  const spanRowColumnCoordinates = document.querySelectorAll(`#Step${globalVar.currentStep} span`);
  spanRowColumnCoordinates.forEach(rcSpan => {eventListeners.spanRowColumnCoordinatesListener(rcSpan)});

  addGoBackToStepButton();
  // settingHighlightedBlock("cell", [pivotValues[0] + 1, pivotValues[1] + 1]);
};

const addGoBackToStepButton = () => {
  if (globalVar.currentStep > 0) {
    let newbackToStepButton = document.createElement("button");
    newbackToStepButton.classList.add("hoverMeButton", "active", "goBackToStep", `goBackToStep${globalVar.currentStep -1}`);
    newbackToStepButton.setAttribute("name", `step${globalVar.currentStep -1}`)
    newbackToStepButton.innerHTML = `
    Go back to <strong>Step ${globalVar.currentStep - 1}</strong>
    `;
    const previousArticleStep = document.querySelector(`#Step${globalVar.currentStep - 1}`);
    previousArticleStep.append(newbackToStepButton);
    //creating the Event Listeners to the recently created button
    const button_goBackToStep = document.querySelector(`.goBackToStep${globalVar.currentStep -1}`);
    eventListeners.goBackToStepListener(button_goBackToStep);
  };
};

const settingHighlightedBlock = (mainBlock, mainBlockValue) => {
  //It evaluates which Block (cell, row, column or square involved in finding the value for this cell)
  if (globalVar.areHighlightsOn) {
    switch (mainBlock) {
      case "cell":
        let highlightedCell = document.querySelectorAll(`.row${mainBlockValue[0]}.column${mainBlockValue[1]}`);
        highlightedCell.forEach( (cell) => {cell.classList.add("highlightedCell")});
      break;
      case "row":
        let highlightedRow = document.querySelectorAll(`.row${mainBlockValue}`);
        highlightedRow.forEach( (cell) => {cell.classList.add("highlightedRow")});
      break;
      case "column":
        let highlightedColumn = document.querySelectorAll(`.column${mainBlockValue}`);
        highlightedColumn.forEach( (cell) => {cell.classList.add("highlightedColumn")});
      break;
      case "square":
        let highlightedSquare = document.querySelectorAll(`.square${mainBlockValue}`);
        highlightedSquare.forEach( (cell) => {cell.classList.add("highlightedSquare")});
      break;
    };
  };
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

export { newFoundValueHTML, discardLockedCandidateHTML, discardXWingHTML, discardObviousPairsHTML, discardHiddenPairHTML, discardObviousTripleHTML, discardHiddenTripleHTML, discardYWingHTML, discardNishioCandidateProvenWrongHTML, addGoBackToStepButton, settingHighlightedBlock, newSudokuPuzzleArticle };