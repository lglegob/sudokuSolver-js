'use strict';
import globalVar from "./globalVar.js";
import * as eventListeners from "./eventListeners.js";
import * as recurrent from "./recurrentFunctions.js";
import * as coordinates from "./defineCoordinates.js";

////////////////////////////////////////////////////////////////////////////////
//                       MODIFYING DOM FUNCTIONS                             //
//////////////////////////////////////////////////////////////////////////////

//This Function is called by SOLVING Techniques where a Cell Value is now certain. It can by NAKED Singles or HIDDEN Singles
const newFoundValueHTML = (itemRow, itemColumn, currentCellValue, theMatrixStep, method, mainBlock, mainBlockValue) => {
  console.log("--------------------------------------------");
  console.log(`Cells resolved so far: ${globalVar.cellsResolved}`);
  console.log(`Loops executed so far: ${globalVar.loopsExecuted}`);
  console.log(`the value in row ${itemRow}, column ${itemColumn} is ${currentCellValue} by ${method} method`);
  
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

  //Config for adding the description and card in stackedCardsSection Section
  let newfoundvalueArticle = document.createElement("article");
  newfoundvalueArticle.classList.add("newfoundvalue");
  newfoundvalueArticle.setAttribute("id", "Step" + globalVar.currentStep );
  newfoundvalueArticle.style.zIndex = -globalVar.currentStep;
  //At this point, it is defined if the value Found was by NAKED singles technique or by HIDDEN singles technique to give the appropiate message in stackedCardsSection
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
      within the ${recurrent.capitalizeFirstLetter(mainBlock)} 
      <strong><span data-${mainBlock}coordinates=".${mainBlock}${mainBlockValue}">${recurrent.getFirstLetterCapitalized(mainBlock)}${mainBlockValue}</span></strong> 
      was the only cell with Candidate (${currentCellValue}).
    </p>
    <p>The certain Value for this Cell is <strong>${currentCellValue}.</strong></p>
    `;
  } else if (method.includes("Nishio Guessing")) {
    newfoundvalueArticle.innerHTML = `
    <h3>Step ${globalVar.currentStep}</h3>
    <h4>${method}</h4>
    <p>We don't like it, and are working hard to include strategies to avoid getting to this point, but for now, for your puzzle, we need to make a guess.</p>
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
  const main = document.querySelector(".stackedCardsSection > div");
  main.prepend(newfoundvalueArticle);

  //creating the Event Listeners to the recently created RC spans
  const spanRowColumnCoordinates = document.querySelectorAll(`#Step${globalVar.currentStep} span`);
  spanRowColumnCoordinates.forEach(spanCoordinates => {eventListeners.spanRowColumnCoordinatesListener(spanCoordinates)});

  recurrent.reviewNotes(theMatrixStep);
  addGoBackToStepButton();
  settingHighlightedBlock(mainBlock, mainBlockValue, "highlighted");
};

//This Function is called by OBVIOUSPAIRS Techniques
const discardObviousPairsHTML = (mainAxisValue, mainAxis, cellsIdentified, currentCandidates, method) => {
  console.log("--------------------------------------------");
  console.log("There are only two possible explanations: either no one told me, or no one knows. - Neo");
  console.log(`Cells resolved so far: ${globalVar.cellsResolved}`);
  console.log(`Loops executed so far: ${globalVar.loopsExecuted}`);  
  console.log("We found an Obvious Pair!!")
  mainAxis === "square" ? mainAxisValue-- : false; //To adjust in the case of squares, which go from 1 to 9 instead of 0 to 8;
  console.log(`We are looking at ${mainAxis} ${mainAxisValue + 1}, the first cell is row${cellsIdentified.cell1.row + 1} column${cellsIdentified.cell1.column + 1}, and the second cell is row${cellsIdentified.cell2.row + 1} column${cellsIdentified.cell2.column + 1}`)
  console.log(`The common pair notes are ${currentCandidates.candidate1} and ${currentCandidates.candidate2}, they have been deleted from other cells in the ${mainAxis} ${mainAxisValue + 1}`);
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
    contain an obvious pair (Cells with the same two only candidates).
  </p>
  <p>
    The two cells are within the same    
    ${recurrent.capitalizeFirstLetter(mainAxis)} 
    <strong><span data-${mainAxis}coordinates=".${mainAxis}${mainAxisValue + 1}">${recurrent.getFirstLetterCapitalized(mainAxis)}${mainAxisValue + 1}</span></strong>, 
    and the candidates are ${currentCandidates.candidate1} and ${currentCandidates.candidate2}. 
    No matter the order, these two candidates will be the solution for these two cells and cannot be a possibility for any other cell within 
    ${recurrent.capitalizeFirstLetter(mainAxis)} 
    <strong><span data-${mainAxis}coordinates=".${mainAxis}${mainAxisValue + 1}">${recurrent.getFirstLetterCapitalized(mainAxis)}${mainAxisValue + 1}</span></strong>.
  </p>
  <p>
    These Candidates, ${currentCandidates.candidate1} and ${currentCandidates.candidate2}, have been deleted from other cells within the 
    ${recurrent.capitalizeFirstLetter(mainAxis)} 
    <strong><span data-${mainAxis}coordinates=".${mainAxis}${mainAxisValue + 1}">${recurrent.getFirstLetterCapitalized(mainAxis)}${mainAxisValue + 1}</span></strong>
  </p>
  `;
  const main = document.querySelector(".stackedCardsSection > div");
  main.prepend(newDiscardArticle);

  //creating the Event Listeners to the recently created RC spans
  const spanRowColumnCoordinates = document.querySelectorAll(`#Step${globalVar.currentStep} span`);
  spanRowColumnCoordinates.forEach(spanCoordinates => {eventListeners.spanRowColumnCoordinatesListener(spanCoordinates)});

  addGoBackToStepButton();
  settingHighlightedBlock(mainAxis, mainAxisValue + 1, "highlighted");
};

//This Function is called by HIDDENPAIRS Techniques
const discardHiddenPairHTML = (mainAxisValue, mainAxis, cellsIdentified, currentCandidates, method) => {
  console.log("--------------------------------------------");
  console.log("We are still here! – Morpheus");
  console.log(`Cells resolved so far: ${globalVar.cellsResolved}`);
  console.log(`Loops executed so far: ${globalVar.loopsExecuted}`);  
  console.log("We found an Hidden Pair!!")
  mainAxis === "square" ? mainAxisValue-- : false; //To adjust in the case of squares, which go from 1 to 9 instead of 0 to 8;
  console.log(`We are looking at ${mainAxis} ${mainAxisValue + 1}, the first cell is row${cellsIdentified.cell1.row + 1} column${cellsIdentified.cell1.column + 1}, and the second cell is row${cellsIdentified.cell2.row + 1} column${cellsIdentified.cell2.column + 1}`)
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
    contain a hidden pair (The only two Cells within a block with the same two candidates).
  </p>
  <p>
    The two cells are within the same 
    ${recurrent.capitalizeFirstLetter(mainAxis)} 
    <strong><span data-${mainAxis}coordinates=".${mainAxis}${mainAxisValue + 1}">${recurrent.getFirstLetterCapitalized(mainAxis)}${mainAxisValue + 1}</span></strong>, 
    and the candidates are ${currentCandidates.candidate1} and ${currentCandidates.candidate2}.
    No matter the order, these two candidates will be the solution for these two cells and no other candidates can be an option for these couple of cells within 
    ${recurrent.capitalizeFirstLetter(mainAxis)} 
    <strong><span data-${mainAxis}coordinates=".${mainAxis}${mainAxisValue + 1}">${recurrent.getFirstLetterCapitalized(mainAxis)}${mainAxisValue + 1}</span></strong>.
    </p>
  <p>
    These Candidates, ${currentCandidates.candidate1} and ${currentCandidates.candidate2}, are the only ones kept, all other candidates have been deleted within the 
    ${recurrent.capitalizeFirstLetter(mainAxis)} 
    <strong><span data-${mainAxis}coordinates=".${mainAxis}${mainAxisValue + 1}">${recurrent.getFirstLetterCapitalized(mainAxis)}${mainAxisValue + 1}</span></strong> 
    in those two cells
  </p>
  `;
  const main = document.querySelector(".stackedCardsSection > div");
  main.prepend(newDiscardArticle);

  //creating the Event Listeners to the recently created RC spans
  const spanRowColumnCoordinates = document.querySelectorAll(`#Step${globalVar.currentStep} span`);
  spanRowColumnCoordinates.forEach(spanCoordinates => {eventListeners.spanRowColumnCoordinatesListener(spanCoordinates)});

  addGoBackToStepButton();
  settingHighlightedBlock(mainAxis, mainAxisValue + 1, "highlighted");
};

//This Function is called by OBVIOUSTRIPLES Techniques
const discardObviousTripleHTML = (mainAxisValue, mainAxis, cellsIdentified, currentCandidates, method) => {
  console.log("--------------------------------------------");
  console.log("The answer is out there, Neo. It's looking for you.. - Trinity");
  console.log(`Cells resolved so far: ${globalVar.cellsResolved}`);
  console.log(`Loops executed so far: ${globalVar.loopsExecuted}`);  
  console.log("We found an Obvious Triple!!!")
  mainAxis === "square" ? mainAxisValue-- : false; //To adjust in the case of squares, which go from 1 to 9 instead of 0 to 8;
  console.log(`We are looking at ${mainAxis} ${mainAxisValue + 1}, the first Cell is row${cellsIdentified.cell1.row + 1} column${cellsIdentified.cell1.column + 1}, the second Cell is row${cellsIdentified.cell2.row + 1} column${cellsIdentified.cell2.column + 1} and the Third Cell is row${cellsIdentified.cell3.row + 1} column${cellsIdentified.cell3.column + 1}`)
  console.log(`The common triple notes are ${currentCandidates.candidate1}, ${currentCandidates.candidate2} and ${currentCandidates.candidate3}, they have been deleted from other cells in the ${mainAxis} ${mainAxisValue + 1}`);
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
    contain an obvious triple (Cells with the same three only candidates).
  </p>
  <p>
    The three cells are within the same  
    ${recurrent.capitalizeFirstLetter(mainAxis)} 
    <strong><span data-${mainAxis}coordinates=".${mainAxis}${mainAxisValue + 1}">${recurrent.getFirstLetterCapitalized(mainAxis)}${mainAxisValue + 1}</span></strong>,  
    and the candidates are ${currentCandidates.candidate1}, ${currentCandidates.candidate2} and ${currentCandidates.candidate3}.
    No matter the order, these three candidates will be the solution for these three cells and cannot be a possibility for any other cell within 
    ${recurrent.capitalizeFirstLetter(mainAxis)} 
    <strong><span data-${mainAxis}coordinates=".${mainAxis}${mainAxisValue + 1}">${recurrent.getFirstLetterCapitalized(mainAxis)}${mainAxisValue + 1}</span></strong>.
  </p>
  <p>
    These Candidates, ${currentCandidates.candidate1}, ${currentCandidates.candidate2} and ${currentCandidates.candidate3}, have been deleted from other cells within the 
    ${recurrent.capitalizeFirstLetter(mainAxis)} 
    <strong><span data-${mainAxis}coordinates=".${mainAxis}${mainAxisValue + 1}">${recurrent.getFirstLetterCapitalized(mainAxis)}${mainAxisValue + 1}</span></strong>
  </p>
  `;
  const main = document.querySelector(".stackedCardsSection > div");
  main.prepend(newDiscardArticle);

  //creating the Event Listeners to the recently created RC spans
  const spanRowColumnCoordinates = document.querySelectorAll(`#Step${globalVar.currentStep} span`);
  spanRowColumnCoordinates.forEach(spanCoordinates => {eventListeners.spanRowColumnCoordinatesListener(spanCoordinates)});

  addGoBackToStepButton();
  settingHighlightedBlock(mainAxis, mainAxisValue + 1, "highlighted");
};

const discardHiddenTripleHTML = (mainAxisValue, mainAxis, cellsIdentified, currentCandidates, method) => {
  console.log("--------------------------------------------");
  console.log("The Best Thing About Being Me... There Are So MANY Me's! – Agent Smith");
  console.log(`Cells resolved so far: ${globalVar.cellsResolved}`);
  console.log(`Loops executed so far: ${globalVar.loopsExecuted}`);  
  console.log("We found an Hidden Triple!!!")
  mainAxis === "square" ? mainAxisValue-- : false; //To adjust in the case of squares, which go from 1 to 9 instead of 0 to 8;
  console.log(`We are looking at ${mainAxis} ${mainAxisValue + 1}, the first cell is row${cellsIdentified.cell1.row + 1} column${cellsIdentified.cell1.column + 1}, the second cell is row${cellsIdentified.cell2.row + 1} column${cellsIdentified.cell2.column + 1} and the third cell is row${cellsIdentified.cell3.row + 1} column${cellsIdentified.cell3.column + 1}`)
  console.log(`The hidden triple notes are ${currentCandidates.candidate1}, ${currentCandidates.candidate2} and ${currentCandidates.candidate3}, these are kept and all other notes in those three cells have been deleted`);
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
    contain a hidden triple (The only three Cells within a block with the same three candidates).
  </p>
  <p>
    The three cells are within the same 
    ${recurrent.capitalizeFirstLetter(mainAxis)} 
    <strong><span data-${mainAxis}coordinates=".${mainAxis}${mainAxisValue + 1}">${recurrent.getFirstLetterCapitalized(mainAxis)}${mainAxisValue + 1}</span></strong>, 
    and the candidates are ${currentCandidates.candidate1}, ${currentCandidates.candidate2} and ${currentCandidates.candidate3}.
    No matter the order, these three candidates will be the solution for these three cells and no other candidates can be an option for these trio of cells within 
    ${recurrent.capitalizeFirstLetter(mainAxis)} 
    <strong><span data-${mainAxis}coordinates=".${mainAxis}${mainAxisValue + 1}">${recurrent.getFirstLetterCapitalized(mainAxis)}${mainAxisValue + 1}</span></strong>.
  </p>
  <p>
    These Candidates, ${currentCandidates.candidate1}, ${currentCandidates.candidate2} and ${currentCandidates.candidate3}, are the only ones kept, all other candidates have been deleted within the 
    ${recurrent.capitalizeFirstLetter(mainAxis)} 
    <strong><span data-${mainAxis}coordinates=".${mainAxis}${mainAxisValue + 1}">${recurrent.getFirstLetterCapitalized(mainAxis)}${mainAxisValue + 1}</span></strong> 
    in those three cells
  </p>
  `;
  const main = document.querySelector(".stackedCardsSection > div");
  main.prepend(newDiscardArticle);

  //creating the Event Listeners to the recently created RC spans
  const spanRowColumnCoordinates = document.querySelectorAll(`#Step${globalVar.currentStep} span`);
  spanRowColumnCoordinates.forEach(spanCoordinates => {eventListeners.spanRowColumnCoordinatesListener(spanCoordinates)});

  addGoBackToStepButton();
  settingHighlightedBlock(mainAxis, mainAxisValue + 1, "highlighted");
};

//This Function is called by OBVIOUSTRIPLES Techniques
const discardObviousQuadHTML = (mainAxisValue, mainAxis, cellsIdentified, currentCandidates, method) => {
  console.log("--------------------------------------------");
  console.log("I Never Believed I Was The One. But She Did. She Believed In Me. It's My Turn To Believe In Her. - Neo");
  console.log(`Cells resolved so far: ${globalVar.cellsResolved}`);
  console.log(`Loops executed so far: ${globalVar.loopsExecuted}`);  
  console.log("We found an Obvious Quad!!!!")
  mainAxis === "square" ? mainAxisValue-- : false; //To adjust in the case of squares, which go from 1 to 9 instead of 0 to 8;
  console.log(`We are looking at ${mainAxis} ${mainAxisValue + 1}, the first Cell is row${cellsIdentified.cell1.row + 1} column${cellsIdentified.cell1.column + 1}, the second Cell is row${cellsIdentified.cell2.row + 1} column${cellsIdentified.cell2.column + 1}, the Third Cell is row${cellsIdentified.cell3.row + 1} column${cellsIdentified.cell3.column + 1} and the fourth Cell is row${cellsIdentified.cell4.row + 1} column${cellsIdentified.cell4.column + 1}`)
  console.log(`The common Quad notes are ${currentCandidates.candidate1}, ${currentCandidates.candidate2}, ${currentCandidates.candidate3} and ${currentCandidates.candidate4}, they have been deleted from other cells in the ${mainAxis} ${mainAxisValue + 1}`);
  document.querySelector("#button-reload").disabled = false; //applies only to step 1, but the if is unnecesary
  document.querySelector("#button-reload").classList.add("active");
  document.querySelector("#button-reload").classList.remove("inactive");
  let newDiscardArticle = document.createElement("article");
  newDiscardArticle.classList.add("newdiscardQuadCandidates");
  newDiscardArticle.setAttribute("id", "Step" + globalVar.currentStep);
  newDiscardArticle.style.zIndex = -globalVar.currentStep;
  newDiscardArticle.innerHTML = `
  <h3>Step ${globalVar.currentStep}</h3>
  <h4>${method}</h4>
  <p>Cells 
    <strong><span data-cellcoordinates=".row${cellsIdentified.cell1.row + 1}.column${cellsIdentified.cell1.column  + 1}">R${cellsIdentified.cell1.row + 1}C${cellsIdentified.cell1.column + 1}</span></strong>,  
    <strong><span data-cellcoordinates=".row${cellsIdentified.cell2.row + 1}.column${cellsIdentified.cell2.column  + 1}">R${cellsIdentified.cell2.row + 1}C${cellsIdentified.cell2.column + 1}</span></strong>,   
    <strong><span data-cellcoordinates=".row${cellsIdentified.cell3.row + 1}.column${cellsIdentified.cell3.column  + 1}">R${cellsIdentified.cell3.row + 1}C${cellsIdentified.cell3.column + 1}</span></strong> and
    <strong><span data-cellcoordinates=".row${cellsIdentified.cell4.row + 1}.column${cellsIdentified.cell4.column  + 1}">R${cellsIdentified.cell4.row + 1}C${cellsIdentified.cell4.column + 1}</span></strong>
    contain an obvious Quadruple (Cells with the same four only candidates).
  </p>
  <p>
    The four cells are within the same 
    ${recurrent.capitalizeFirstLetter(mainAxis)} 
    <strong><span data-${mainAxis}coordinates=".${mainAxis}${mainAxisValue + 1}">${recurrent.getFirstLetterCapitalized(mainAxis)}${mainAxisValue + 1}</span></strong>,  
    and the candidates are ${currentCandidates.candidate1}, ${currentCandidates.candidate2}, ${currentCandidates.candidate3} and ${currentCandidates.candidate4}.
    No matter the order, these four candidates will be the solution for these four cells and cannot be a possibility for any other cell within 
    ${recurrent.capitalizeFirstLetter(mainAxis)} 
    <strong><span data-${mainAxis}coordinates=".${mainAxis}${mainAxisValue + 1}">${recurrent.getFirstLetterCapitalized(mainAxis)}${mainAxisValue + 1}</span></strong>.
  </p>
  <p>
    These Candidates, ${currentCandidates.candidate1}, ${currentCandidates.candidate2}, ${currentCandidates.candidate3} and ${currentCandidates.candidate4}, have been deleted from other cells within the 
    ${recurrent.capitalizeFirstLetter(mainAxis)} 
    <strong><span data-${mainAxis}coordinates=".${mainAxis}${mainAxisValue + 1}">${recurrent.getFirstLetterCapitalized(mainAxis)}${mainAxisValue + 1}</span></strong>
  </p>
  `;
  const main = document.querySelector(".stackedCardsSection > div");
  main.prepend(newDiscardArticle);

  //creating the Event Listeners to the recently created RC spans
  const spanRowColumnCoordinates = document.querySelectorAll(`#Step${globalVar.currentStep} span`);
  spanRowColumnCoordinates.forEach(spanCoordinates => {eventListeners.spanRowColumnCoordinatesListener(spanCoordinates)});

  addGoBackToStepButton();
  settingHighlightedBlock(mainAxis, mainAxisValue + 1, "highlighted");
};

const discardHiddenQuadrupleHTML = (mainAxisValue, mainAxis, cellsIdentified, currentCandidates, method) => {
  console.log("--------------------------------------------");
  console.log("I didn't know. But I believed... I believed – Oracle");
  console.log(`Cells resolved so far: ${globalVar.cellsResolved}`);
  console.log(`Loops executed so far: ${globalVar.loopsExecuted}`);  
  console.log("We found an Hidden Quadruple!!!!")
  mainAxis === "square" ? mainAxisValue-- : false; //To adjust in the case of squares, which go from 1 to 9 instead of 0 to 8;
  console.log(`We are looking at ${mainAxis} ${mainAxisValue + 1}, the first cell is row${cellsIdentified.cell1.row + 1} column${cellsIdentified.cell1.column + 1}, the second cell is row${cellsIdentified.cell2.row + 1} column${cellsIdentified.cell2.column + 1}, the third cell is row${cellsIdentified.cell3.row + 1} column${cellsIdentified.cell3.column + 1} and the fourth cell is row${cellsIdentified.cell4.row + 1} column${cellsIdentified.cell4.column + 1}`)
  console.log(`The hidden quadruple notes are ${currentCandidates.candidate1}, ${currentCandidates.candidate2}, ${currentCandidates.candidate3} and ${currentCandidates.candidate4}, these are kept and all other notes in those four cells have been deleted`);
  document.querySelector("#button-reload").disabled = false; //applies only to step 1, but the if is unnecesary
  document.querySelector("#button-reload").classList.add("active");
  document.querySelector("#button-reload").classList.remove("inactive");
  let newDiscardArticle = document.createElement("article");
  newDiscardArticle.classList.add("newDiscarHiddenQuadruple");
  newDiscardArticle.setAttribute("id", "Step" + globalVar.currentStep);
  newDiscardArticle.style.zIndex = -globalVar.currentStep;
  newDiscardArticle.innerHTML = `
  <h3>Step ${globalVar.currentStep}</h3>
  <h4>${method}</h4>
  <p>Cells 
    <strong><span data-cellcoordinates=".row${cellsIdentified.cell1.row + 1}.column${cellsIdentified.cell1.column + 1}">R${cellsIdentified.cell1.row + 1}C${cellsIdentified.cell1.column + 1}</span></strong>,  
    <strong><span data-cellcoordinates=".row${cellsIdentified.cell2.row + 1}.column${cellsIdentified.cell2.column + 1}">R${cellsIdentified.cell2.row + 1}C${cellsIdentified.cell2.column + 1}</span></strong>,  
    <strong><span data-cellcoordinates=".row${cellsIdentified.cell3.row + 1}.column${cellsIdentified.cell3.column + 1}">R${cellsIdentified.cell3.row + 1}C${cellsIdentified.cell3.column + 1}</span></strong> and 
    <strong><span data-cellcoordinates=".row${cellsIdentified.cell4.row + 1}.column${cellsIdentified.cell4.column + 1}">R${cellsIdentified.cell4.row + 1}C${cellsIdentified.cell4.column + 1}</span></strong> 
    contain a hidden quadruple (The only four Cells within a block with the same four candidates).
  </p>
  <p>
    The four cells are within the same 
    ${recurrent.capitalizeFirstLetter(mainAxis)} 
    <strong><span data-${mainAxis}coordinates=".${mainAxis}${mainAxisValue + 1}">${recurrent.getFirstLetterCapitalized(mainAxis)}${mainAxisValue + 1}</span></strong>, 
    and the candidates are ${currentCandidates.candidate1}, ${currentCandidates.candidate2}, ${currentCandidates.candidate3} and ${currentCandidates.candidate4}.
    No matter the order, these four candidates will be the solution for these four cells and no other candidates can be an option for these quadruple of cells within 
    ${recurrent.capitalizeFirstLetter(mainAxis)} 
    <strong><span data-${mainAxis}coordinates=".${mainAxis}${mainAxisValue + 1}">${recurrent.getFirstLetterCapitalized(mainAxis)}${mainAxisValue + 1}</span></strong>.
  </p>
  <p>
    These Candidates, ${currentCandidates.candidate1}, ${currentCandidates.candidate2}, ${currentCandidates.candidate3} and ${currentCandidates.candidate4}, are the only ones kept, all other candidates have been deleted within the 
    ${recurrent.capitalizeFirstLetter(mainAxis)} 
    <strong><span data-${mainAxis}coordinates=".${mainAxis}${mainAxisValue + 1}">${recurrent.getFirstLetterCapitalized(mainAxis)}${mainAxisValue + 1}</span></strong> 
    in those four cells
  </p>
  `;
  const main = document.querySelector(".stackedCardsSection > div");
  main.prepend(newDiscardArticle);

  //creating the Event Listeners to the recently created RC spans
  const spanRowColumnCoordinates = document.querySelectorAll(`#Step${globalVar.currentStep} span`);
  spanRowColumnCoordinates.forEach(spanCoordinates => {eventListeners.spanRowColumnCoordinatesListener(spanCoordinates)});

  addGoBackToStepButton();
  settingHighlightedBlock(mainAxis, mainAxisValue + 1, "highlighted");
};

//This Function is called by LOCKEDCANDIDATE Techniques
const discardLockedCandidateHTML = (mainAxisValue, mainAxis, secondaryAxisValue, secondaryAxis, value, method) => {
  console.log("--------------------------------------------");
  console.log("Remember, all I’m offering is the truth. Nothing more. - Morpheus");
  console.log(`Cells resolved so far: ${globalVar.cellsResolved}`);
  console.log(`Loops executed so far: ${globalVar.loopsExecuted}`);  
  console.log("We found a locked Candidate!")
  mainAxis === "square" ? mainAxisValue-- : false; //To adjust in the case of squares, which go from 1 to 9 instead of 0 to 8;
  secondaryAxis === "square" ? secondaryAxisValue-- : false //To adjust in the case of squares, which go from 1 to 9 instead of 0 to 8;
  console.log(`For the ${secondaryAxis} ${secondaryAxisValue + 1}, all the candidates value of ${value} are contained in the ${mainAxis} ${mainAxisValue + 1}`)
  console.log(`Candidates notes for ${value} in other ${secondaryAxis}s within the same ${mainAxis} ${mainAxisValue + 1} have been deleted`);
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
  <p>
    If you take a look at  
    ${recurrent.capitalizeFirstLetter(secondaryAxis)} 
    <strong><span data-${secondaryAxis}coordinates=".${secondaryAxis}${ secondaryAxisValue + 1 }">${recurrent.getFirstLetterCapitalized(secondaryAxis)}${ secondaryAxisValue + 1 }</span></strong>, 
    all the cells with the candidate ${value}, are confined to the same 
    ${recurrent.capitalizeFirstLetter(mainAxis)} 
    <strong><span data-${mainAxis}coordinates=".${mainAxis}${ mainAxisValue + 1 }">${recurrent.getFirstLetterCapitalized(mainAxis)}${ mainAxisValue + 1 }</span></strong>  
    as well.
  </p>
  <p>
    For 
    ${recurrent.capitalizeFirstLetter(secondaryAxis)} 
    <strong><span data-${secondaryAxis}coordinates=".${secondaryAxis}${ secondaryAxisValue + 1 }">${recurrent.getFirstLetterCapitalized(secondaryAxis)}${ secondaryAxisValue + 1 }</span></strong>  
    to have a ${value}, it must be in one of those cells shared with 
    ${recurrent.capitalizeFirstLetter(mainAxis)} 
    <strong><span data-${mainAxis}coordinates=".${mainAxis}${ mainAxisValue + 1 }">${recurrent.getFirstLetterCapitalized(mainAxis)}${ mainAxisValue + 1 }</span></strong> 
    fulfilling also the requirement of 
    ${recurrent.capitalizeFirstLetter(mainAxis)} 
    <strong><span data-${mainAxis}coordinates=".${mainAxis}${ mainAxisValue + 1 }">${recurrent.getFirstLetterCapitalized(mainAxis)}${ mainAxisValue + 1 }</span></strong>
    to have a ${value}, making it not possible to have a candidate ${value} in any cell not shared between these two blocks.
  </p>
  <p>
    So, all candidates with value ${value} within 
    ${recurrent.capitalizeFirstLetter(mainAxis)} 
    <strong><span data-${mainAxis}coordinates=".${mainAxis}${ mainAxisValue + 1 }">${recurrent.getFirstLetterCapitalized(mainAxis)}${ mainAxisValue + 1 }</span></strong>,  
    that do not belong to 
    ${recurrent.capitalizeFirstLetter(secondaryAxis)} 
    <strong><span data-${secondaryAxis}coordinates=".${secondaryAxis}${ secondaryAxisValue + 1 }">${recurrent.getFirstLetterCapitalized(secondaryAxis)}${ secondaryAxisValue + 1 }</span></strong> 
    have been deleted.
  </p>
  `;
  const main = document.querySelector(".stackedCardsSection > div");
  main.prepend(newDiscardArticle);

  //creating the Event Listeners to the recently created RC spans
  const spanRowColumnCoordinates = document.querySelectorAll(`#Step${globalVar.currentStep} span`);
  spanRowColumnCoordinates.forEach(spanCoordinates => {eventListeners.spanRowColumnCoordinatesListener(spanCoordinates)});

  addGoBackToStepButton();
  settingHighlightedBlock(secondaryAxis, secondaryAxisValue + 1, "highlighted");
  settingHighlightedBlock(mainAxis, mainAxisValue + 1, "deletion");
};

//This Function is called by X-WING Techniques
const discardXWingHTML = ( cornertopleft, cornerbottomright, mainAxis, secondaryAxis, value, method) => {
  console.log("--------------------------------------------");
  console.log("All the time. It's called mescaline, it's the only way to fly. - Choi");
  console.log(`Cells resolved so far: ${globalVar.cellsResolved}`);
  console.log(`Loops executed so far: ${globalVar.loopsExecuted}`);  
  console.log("We found an X-Wing Candidate!")
  console.log(`For the ${mainAxis}s ${ eval(`cornertopleft.${mainAxis}`) + 1 } and ${ eval(`cornerbottomright.${mainAxis}`) + 1}, the candidate note ${value} is chained in X-Wing`)
  console.log(`Candidates notes for ${value} in ${secondaryAxis}s ${ eval(`cornertopleft.${secondaryAxis}`) + 1} and ${ eval(`cornerbottomright.${secondaryAxis}`) + 1} other than the ${mainAxis}s specified above have been deleted`);
  document.querySelector("#button-reload").disabled = false; //applies only to step 1, but the if is unnecesary
  document.querySelector("#button-reload").classList.add("active");
  document.querySelector("#button-reload").classList.remove("inactive");
  let newDiscardArticle = document.createElement("article");
  newDiscardArticle.classList.add("newdiscardXWing");
  newDiscardArticle.setAttribute("id", "Step" + globalVar.currentStep);
  newDiscardArticle.style.zIndex = -globalVar.currentStep;
  newDiscardArticle.innerHTML =  `
  <h3>Step ${globalVar.currentStep}</h3>
  <h4>${method}</h4>
  <p>
    4 Cells in X-Wing configuration shared a candidate (option ${value}), the cells are 
    <strong><span data-cellcoordinates=".row${ cornertopleft.row + 1}.column${ cornertopleft.column + 1}">R${ cornertopleft.row + 1 }C${ cornertopleft.column + 1 }</span></strong>, 
    <strong><span data-cellcoordinates=".row${ cornertopleft.row + 1}.column${ cornerbottomright.column + 1}">R${ cornertopleft.row + 1 }C${ cornerbottomright.column + 1 }</span></strong>, 
    <strong><span data-cellcoordinates=".row${ cornerbottomright.row + 1}.column${ cornertopleft.column + 1}">R${ cornerbottomright.row + 1 }C${ cornertopleft.column + 1 }</span></strong> and 
    <strong><span data-cellcoordinates=".row${ cornerbottomright.row + 1}.column${ cornerbottomright.column + 1}">R${ cornerbottomright.row + 1 }C${ cornerbottomright.column + 1 }</span></strong>.
  </p>
  <p>
    These 4 cells are the crosspoints between 
    ${recurrent.capitalizeFirstLetter(mainAxis)}s 
    <strong><span data-${mainAxis}coordinates=".${mainAxis}${ eval(`cornertopleft.${mainAxis}`) + 1 }">${recurrent.getFirstLetterCapitalized(mainAxis)}${ eval(`cornertopleft.${mainAxis}`) + 1 }</span></strong> and 
    <strong><span data-${mainAxis}coordinates=".${mainAxis}${ eval(`cornerbottomright.${mainAxis}`) + 1 }">${recurrent.getFirstLetterCapitalized(mainAxis)}${ eval(`cornerbottomright.${mainAxis}`) + 1 }</span></strong> with 
    ${recurrent.capitalizeFirstLetter(secondaryAxis)}s 
    <strong><span data-${secondaryAxis}coordinates=".${secondaryAxis}${ eval(`cornertopleft.${secondaryAxis}`) + 1 }">${recurrent.getFirstLetterCapitalized(secondaryAxis)}${ eval(`cornertopleft.${secondaryAxis}`) + 1 }</span></strong> and 
    <strong><span data-${secondaryAxis}coordinates=".${secondaryAxis}${ eval(`cornerbottomright.${secondaryAxis}`) + 1 }">${recurrent.getFirstLetterCapitalized(secondaryAxis)}${ eval(`cornerbottomright.${secondaryAxis}`) + 1 }</span></strong>.
  </p>
  <p>
    Since no more candidates with option ${value} exist within the two 
    ${recurrent.capitalizeFirstLetter(mainAxis)}s, 
    we know for sure those two ${value}s must exist in two of those 4 cells in a diagonal, either 
    (<strong><span data-cellcoordinates=".row${ cornertopleft.row + 1 }.column${ cornertopleft.column + 1 }">R${ cornertopleft.row + 1 }C${ cornertopleft.column + 1 }</span></strong> and 
    <strong><span data-cellcoordinates=".row${ cornerbottomright.row + 1 }.column${ cornerbottomright.column + 1 }">R${ cornerbottomright.row + 1}C${ cornerbottomright.column + 1 }</span></strong>)
    will be ${value} OR
    (<strong><span data-cellcoordinates=".row${ cornertopleft.row + 1 }.column${ cornerbottomright.column + 1 }">R${ cornertopleft.row + 1}C${ cornerbottomright.column + 1 }</span></strong> and 
    <strong><span data-cellcoordinates=".row${ cornerbottomright.row + 1 }.column${ cornertopleft.column + 1 }">R${ cornerbottomright.row + 1}C${ cornertopleft.column + 1 }</span></strong>  
    will be ${value})
  </p>
  <p>Because having those two mandatory ${value}s in two of the cells in a diagonal, we are sure that the two 
  ${recurrent.capitalizeFirstLetter(secondaryAxis)}s 
  will already have the ${value} as well and other cells are not a possibility anymore for option ${value}.</p>
  <p>So, all candidates with value ${value} in 
  ${recurrent.capitalizeFirstLetter(secondaryAxis)}s 
  <strong><span data-${secondaryAxis}coordinates=".${secondaryAxis}${ eval(`cornertopleft.${secondaryAxis}`) + 1 }">${recurrent.getFirstLetterCapitalized(secondaryAxis)}${ eval(`cornertopleft.${secondaryAxis}`) + 1 }</span></strong> and 
  <strong><span data-${secondaryAxis}coordinates=".${secondaryAxis}${ eval(`cornerbottomright.${secondaryAxis}`) + 1 }">${recurrent.getFirstLetterCapitalized(secondaryAxis)}${ eval(`cornerbottomright.${secondaryAxis}`) + 1 }</span></strong>, 
  that do not belong to 
  ${recurrent.capitalizeFirstLetter(mainAxis)}s 
  <strong><span data-${mainAxis}coordinates=".${mainAxis}${ eval(`cornertopleft.${mainAxis}`) + 1 }">${recurrent.getFirstLetterCapitalized(mainAxis)}${ eval(`cornertopleft.${mainAxis}`) + 1 }</span></strong> and 
  <strong><span data-${mainAxis}coordinates=".${mainAxis}${ eval(`cornerbottomright.${mainAxis}`) + 1 }">${recurrent.getFirstLetterCapitalized(mainAxis)}${ eval(`cornerbottomright.${mainAxis}`) + 1 }</span></strong>, 
  have been deleted.`;


  const main = document.querySelector(".stackedCardsSection > div");
  main.prepend(newDiscardArticle);

  //creating the Event Listeners to the recently created RC spans
  const spanRowColumnCoordinates = document.querySelectorAll(`#Step${globalVar.currentStep} span`);
  spanRowColumnCoordinates.forEach(spanCoordinates => {eventListeners.spanRowColumnCoordinatesListener(spanCoordinates)});

  addGoBackToStepButton();
  settingHighlightedBlock(mainAxis, eval(`cornertopleft.${mainAxis}`) + 1, "highlighted");
  settingHighlightedBlock(mainAxis, eval(`cornerbottomright.${mainAxis}`) + 1, "highlighted");
  settingHighlightedBlock(secondaryAxis, eval(`cornertopleft.${secondaryAxis}`) + 1, "deletion");
  settingHighlightedBlock(secondaryAxis, eval(`cornerbottomright.${secondaryAxis}`) + 1, "deletion");
  settingHighlightedBlock("cell", [ cornertopleft.row + 1, cornertopleft.column + 1 ], "finned");
  settingHighlightedBlock("cell", [ cornertopleft.row + 1, cornerbottomright.column + 1 ], "finned");
  settingHighlightedBlock("cell", [ cornerbottomright.row + 1, cornertopleft.column + 1 ], "finned");
  settingHighlightedBlock("cell", [ cornerbottomright.row + 1, cornerbottomright.column + 1 ], "finned");
};

//This Function is called by Y-WING Techniques
const discardYWingHTML = (pivotCell, pincer1Cell, pincer1Axis, pincer2Cell, pincer2Axis, pincerX, pincerY, pincerZ, method, positiveforZCells, testingforZCells) => {
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

  // <strong><span data-${pincer1Axis}coordinates=".${pincer1Axis}${ eval(`cornertopleft.${pincer1Axis}`) + 1 }">${recurrent.getFirstLetterCapitalized(pincer1Axis)}${ eval(`cornertopleft.${pincer1Axis}`) + 1 }</span></strong>

  newDiscardArticle.innerHTML =  `
  <h3>Step ${globalVar.currentStep}</h3>
  <h4>${method}</h4>
  <p>
    Cells in Y-Wing configuration have been found. First, we have a Cell we will call the Pivot which is 
    <strong><span data-cellcoordinates=".row${pivotCell.row + 1}.column${pivotCell.column + 1}">R${pivotCell.row  + 1}C${pivotCell.column + 1}</span></strong>, 
    with only 2 Candidates, which are ${pincerX} and ${pincerY}.
  </p>
  <p>
    Then, we find the cell
    <strong><span data-cellcoordinates=".row${pincer1Cell.row + 1}.column${pincer1Cell.column + 1}">R${pincer1Cell.row + 1}C${pincer1Cell.column + 1}</span></strong>, 
    with two candidates, and sharing one of the candidates (${pincerX}) with the Pivot. We will call this one the First Pincer and is found in the same 
    ${recurrent.capitalizeFirstLetter(pincer1Axis)} 
    <strong><span data-${pincer1Axis}coordinates=".${pincer1Axis}${ eval(`pincer1Cell.${pincer1Axis}`) + 1 }">${recurrent.getFirstLetterCapitalized(pincer1Axis)}${ eval(`pincer1Cell.${pincer1Axis}`) + 1 }</span></strong> 
    as the Pivot.
  </p>
  <p>
    Now, let's see the cell 
    <strong><span data-cellcoordinates=".row${pincer2Cell.row + 1}.column${pincer2Cell.column + 1}">R${pincer2Cell.row + 1}C${pincer2Cell.column + 1}</span></strong>, 
    which will be our Second Pincer (Hence forming a Y between the 3 cells). This one is located in the same 
    ${recurrent.capitalizeFirstLetter(pincer2Axis)} 
    <strong><span data-${pincer2Axis}coordinates=".${pincer2Axis}${ eval(`pincer2Cell.${pincer2Axis}`) + 1 }">${recurrent.getFirstLetterCapitalized(pincer2Axis)}${ eval(`pincer2Cell.${pincer2Axis}`) + 1 }</span></strong> 
    as the Pivot and sharing the Candidate ${pincerY} with it.
    </p>
  <p>
    No matter the case, the candidate ${pincerZ} which is shared by both Pincer cells must be the solution either in 
    <strong><span data-cellcoordinates=".row${pincer1Cell.row + 1}.column${pincer1Cell.column + 1}">R${pincer1Cell.row + 1}C${pincer1Cell.column + 1}</span></strong> 
    OR in 
    <strong><span data-cellcoordinates=".row${pincer2Cell.row + 1}.column${pincer2Cell.column + 1}">R${pincer2Cell.row + 1}C${pincer2Cell.column + 1}</span></strong>.
  </p>
  <p>
    Why? Let's check the possibilities for the Pivot. If the solution for the Pivot 
    <strong><span data-cellcoordinates=".row${pivotCell.row + 1}.column${pivotCell.column + 1}">R${pivotCell.row  + 1}C${pivotCell.column + 1}</span></strong>
    is ${pincerX}, then the first Pincer 
    <strong><span data-cellcoordinates=".row${pincer1Cell.row + 1}.column${pincer1Cell.column + 1}">R${pincer1Cell.row + 1}C${pincer1Cell.column + 1}</span></strong>  
    must be ${pincerZ}. On the contrary if the solution for the Pivot
    <strong><span data-cellcoordinates=".row${pivotCell.row + 1}.column${pivotCell.column + 1}">R${pivotCell.row  + 1}C${pivotCell.column + 1}</span></strong>
    is ${pincerY}, then the second Pincer 
    <strong><span data-cellcoordinates=".row${pincer2Cell.row + 1}.column${pincer2Cell.column + 1}">R${pincer2Cell.row + 1}C${pincer2Cell.column + 1}</span></strong>, 
    must be ${pincerZ}.
  </p>
  <p>
    Either case, for Cells "seen" by both Pincers, it is not possible to have the value ${pincerZ} as option, since it must already be the solution for one of the Pincers. ${pincerZ} has been deleted as candidate in those cells (As reference, it has been highlighted those cells where if present, it would have been deleted as well).
  </p>
  `;

  const main = document.querySelector(".stackedCardsSection > div");
  main.prepend(newDiscardArticle);

  //creating the Event Listeners to the recently created RC spans
  const spanRowColumnCoordinates = document.querySelectorAll(`#Step${globalVar.currentStep} span`);
  spanRowColumnCoordinates.forEach(spanCoordinates => {eventListeners.spanRowColumnCoordinatesListener(spanCoordinates)});

  addGoBackToStepButton();
  settingHighlightedBlock("cell", [pivotCell.row + 1, pivotCell.column + 1], "finned");
  settingHighlightedBlock("cell", [pincer1Cell.row + 1, pincer1Cell.column + 1], "highlighted");
  settingHighlightedBlock("cell", [pincer2Cell.row + 1, pincer2Cell.column + 1], "highlighted");
  testingforZCells.forEach(possibleDeletionCell => { settingHighlightedBlock("cell", [ possibleDeletionCell.row + 1, possibleDeletionCell.column + 1 ], `deletion`) });

};

//This Function is called by SwordFish Techniques
const discardSwordFishHTML = (mainAxisValues, mainAxis, secondaryAxisValues, secondaryAxis, value, method) => {
  console.log("--------------------------------------------");
  console.log("That's exactly my point. Exactly. Because you have to wonder: how do the machines know what Tasty Wheat tasted like? Maybe they got it wrong. Maybe what I think Tasty Wheat tasted like actually tasted like oatmeal, or swordfish.. - Mouse");
  console.log(`Cells resolved so far: ${globalVar.cellsResolved}`);
  console.log(`Loops executed so far: ${globalVar.loopsExecuted}`);  
  console.log("We found a SwordFish Candidate!")
  console.log(`For the ${mainAxis}s ${mainAxisValues[0] + 1}, ${mainAxisValues[1] + 1} and ${mainAxisValues[2] + 1}, the candidate note ${value} is chained in SwordFish Configuration`)
  console.log(`Candidates notes for ${value} in ${secondaryAxis}s ${secondaryAxisValues[0] + 1}, ${secondaryAxisValues[1] + 1} and ${secondaryAxisValues[2] + 1} other than the ${mainAxis}s specified above have been deleted`);
  document.querySelector("#button-reload").disabled = false; //applies only to step 1, but the if is unnecesary
  document.querySelector("#button-reload").classList.add("active");
  document.querySelector("#button-reload").classList.remove("inactive");
  let newDiscardArticle = document.createElement("article");
  newDiscardArticle.classList.add("newdiscardSwordFish");
  newDiscardArticle.setAttribute("id", "Step" + globalVar.currentStep);
  newDiscardArticle.style.zIndex = -globalVar.currentStep;
  
  if (mainAxis === "row") {
    newDiscardArticle.innerHTML =  `
    <h3>Step ${globalVar.currentStep}</h3>
    <h4>${method}</h4>
    <p>
      The candidate (fish Digit) ${value} is present only 2 times per each of the following 3 Rows: 
      row R${mainAxisValues[0] + 1}, row R${mainAxisValues[1] + 1} and row R${mainAxisValues[2] + 1}.
    </p>
    <p>
    The cells where candidate (fish Digit) ${value} is present are:      
    </p>
    <p>
    </p>
    `;
    mainAxisValues.forEach((mainAxisValue) => {
      secondaryAxisValues.forEach((secondaryAxisValue) => {
        if (globalVar.theMatrix[globalVar.currentStep - 1][mainAxisValue][secondaryAxisValue][value] === 1) { 
          let newDiscardArticleLastP = newDiscardArticle.lastElementChild;
          newDiscardArticleLastP.insertAdjacentHTML("beforeend",
          `
          <strong><span data-cellcoordinates=".row${mainAxisValue + 1}.column${secondaryAxisValue + 1}">R${mainAxisValue + 1}C${secondaryAxisValue + 1}</span></strong> 
          `
          );       
        };
      });
    });
    newDiscardArticle.insertAdjacentHTML("beforeend", 
    `
    <p>
      Also those candidates align perfectly in only 3 columns: column C${secondaryAxisValues[0] + 1}, column C${secondaryAxisValues[1] + 1} and column C${secondaryAxisValues[2] + 1}.
    </p>
    <p>
      The fish Digit is marked in green for each of the 6 cells where they are present for these Columns. Any combination where this digit is marked as certain value, it will be sure that the three rows will have already this candidate covered, so, any other cell with candidate ${value} within the same rows (R${secondaryAxisValues[0] + 1}, R${secondaryAxisValues[1] + 1} and R${secondaryAxisValues[2] + 1}) has been discarded.
    </p>
    `
    );
  } else {
    newDiscardArticle.innerHTML =  `
    <h3>Step ${globalVar.currentStep}</h3>
    <h4>${method}</h4>
    <p>
      The candidate (fish Digit) ${value} is present only 2 times per each of the following 3 Columns: 
      column C${mainAxisValues[0] + 1}, column C${mainAxisValues[1] + 1} and column C${mainAxisValues[2] + 1}. 
    </p>
    <p>
      The cells where candidate (fish Digit) ${value} is present are:      
    </p>
    <p>
    </p>
    `;
    mainAxisValues.forEach((mainAxisValue) => {
      secondaryAxisValues.forEach((secondaryAxisValue) => {
        if (globalVar.theMatrix[globalVar.currentStep - 1][secondaryAxisValue][mainAxisValue][value] === 1) {
          let newDiscardArticleLastP = newDiscardArticle.lastElementChild;
          newDiscardArticleLastP.insertAdjacentHTML("beforeend",
          `
          <strong><span data-cellcoordinates=".row${secondaryAxisValue + 1}.column${mainAxisValue + 1}">R${secondaryAxisValue + 1}C${mainAxisValue + 1}</span></strong> 
          `
          );
        };
      });
    });
    newDiscardArticle.insertAdjacentHTML("beforeend", 
    `
    <p>
      Also those candidates align perfectly in only 3 rows: row R${secondaryAxisValues[0] + 1}, row R${secondaryAxisValues[1] + 1} and Row R${secondaryAxisValues[2] + 1}.
    </p>
    <p>
      The fish Digit is marked in green for each of the 6 cells where they are present for these Columns. Any combination where this digit is marked as certain value, it will be sure that the three rows will have already this candidate covered, so, any other cell with candidate ${value} within the same rows (R${secondaryAxisValues[0] + 1}, R${secondaryAxisValues[1] + 1} and R${secondaryAxisValues[2] + 1}) has been discarded.
    </p>
    `
    );
  };

  const main = document.querySelector(".stackedCardsSection > div");
  main.prepend(newDiscardArticle);

  //creating the Event Listeners to the recently created RC spans
  const spanRowColumnCoordinates = document.querySelectorAll(`#Step${globalVar.currentStep} span`);
  spanRowColumnCoordinates.forEach(spanCoordinates => {eventListeners.spanRowColumnCoordinatesListener(spanCoordinates)});

  addGoBackToStepButton();
  settingHighlightedBlock(mainAxis, mainAxisValues[0] + 1, "highlighted");
  settingHighlightedBlock(mainAxis, mainAxisValues[1] + 1, "highlighted");
  settingHighlightedBlock(mainAxis, mainAxisValues[2] + 1, "highlighted");
};

//This Function is called by X-WING Techniques
const discardFinnedXWingHTML = (cornerFin, oppositeCornerFin, squaresRectangle, mainAxis, secondaryAxis, value, method, possibleDeletionCells, cellsFin) => {
  console.log("--------------------------------------------");
  console.log("This is your last chance. After this, there is no turning back. You take the blue pill, the story ends. You wake up in your bed and believe whatever you want to believe. You take the red pill, you stay in Wonderland and I show you how deep the rabbit hole goes. - Morpheus");
  console.log(`Cells resolved so far: ${globalVar.cellsResolved}`);
  console.log(`Loops executed so far: ${globalVar.loopsExecuted}`);  
  console.log("We found a Finned X-Wing Candidate!")
  console.log(`the fin is formed with cells R${cellsFin[0].row + 1}C${cellsFin[0].column + 1}`)
  console.log(`Candidates notes for ${value} within the same square as the fin, and the same column as the corner have been deleted`);
  document.querySelector("#button-reload").disabled = false; //applies only to step 1, but the if is unnecesary
  document.querySelector("#button-reload").classList.add("active");
  document.querySelector("#button-reload").classList.remove("inactive");
  let newDiscardArticle = document.createElement("article");
  newDiscardArticle.classList.add("newdiscardFinnedXWing");
  newDiscardArticle.setAttribute("id", "Step" + globalVar.currentStep);
  newDiscardArticle.style.zIndex = -globalVar.currentStep;

  //${ eval(`oppositeCornerFin.${mainAxis}`) + 1 } traslates to ${ oppositeCornerFin.row + 1 } if mainAxis is row, and to ${ oppositeCornerFin.column + 1 } for column, and hence allows to use the same structure for both cases. Repeated use of the eval function to achieve this.
  newDiscardArticle.innerHTML =  
    `
    <h3>Step ${globalVar.currentStep}</h3>
    <h4>${method}</h4>
    <p>
      4 Cells in X-Wing configuration shared a candidate (option ${value}), the cells are 
      <strong><span data-cellcoordinates=".row${ oppositeCornerFin.row + 1 }.column${ oppositeCornerFin.column + 1}">R${ oppositeCornerFin.row + 1 }C${ oppositeCornerFin.column + 1 }</span></strong>, 
      <strong><span data-cellcoordinates=".row${ oppositeCornerFin.row + 1 }.column${ cornerFin.column + 1 }">R${ oppositeCornerFin.row + 1 }C${ cornerFin.column + 1}</span></strong>, 
      <strong><span data-cellcoordinates=".row${ cornerFin.row + 1 }.column${ oppositeCornerFin.column + 1 }">R${ cornerFin.row + 1 }C${ oppositeCornerFin.column + 1 }</span></strong> and 
      <strong><span data-cellcoordinates=".row${ cornerFin.row + 1}.column${ cornerFin.column + 1 }">R${ cornerFin.row + 1}C${ cornerFin.column + 1}</span></strong>.
    </p>
    <p>
      These 4 cells are the crosspoints between 
      ${recurrent.capitalizeFirstLetter(mainAxis)}s 
      <strong><span data-${mainAxis}coordinates=".${mainAxis}${ eval(`oppositeCornerFin.${mainAxis}`) + 1 }">${recurrent.getFirstLetterCapitalized(mainAxis)}${ eval(`oppositeCornerFin.${mainAxis}`) + 1 }</span></strong> and 
      <strong><span data-${mainAxis}coordinates=".${mainAxis}${ eval(`cornerFin.${mainAxis}`) + 1 }">${recurrent.getFirstLetterCapitalized(mainAxis)}${ eval(`cornerFin.${mainAxis}`) + 1 }</span></strong> with 
      ${recurrent.capitalizeFirstLetter(secondaryAxis)}s 
      <strong><span data-${secondaryAxis}coordinates=".${secondaryAxis}${ eval(`oppositeCornerFin.${secondaryAxis}`) + 1 }">${recurrent.getFirstLetterCapitalized(secondaryAxis)}${ eval(`oppositeCornerFin.${secondaryAxis}`) + 1 }</span></strong> and 
      <strong><span data-${secondaryAxis}coordinates=".${secondaryAxis}${ eval(`cornerFin.${secondaryAxis}`) + 1 }">${recurrent.getFirstLetterCapitalized(secondaryAxis)}${ eval(`cornerFin.${secondaryAxis}`) + 1 }</span></strong>.
      Let's imagine these four cells are part of an imaginary rectangle, with four corners, each located in a different square of the puzzle (This will become important).
    </p>
    <p>
      However, this is not a perfect X-Wing, because 
      ${recurrent.capitalizeFirstLetter(mainAxis)} 
      <strong><span data-${mainAxis}coordinates=".${mainAxis}${ eval(`cornerFin.${mainAxis}`) + 1 }">${recurrent.getFirstLetterCapitalized(mainAxis)}${ eval(`cornerFin.${mainAxis}`) + 1 }</span></strong> 
      has more than two cells with the candidate ${value}, invalidating the X-Wing analysis, being the additional cell(s) 
    </p>
    <p></p>
    `;
  cellsFin.forEach((cellFin) => {
    let newDiscardArticleLastP = newDiscardArticle.lastElementChild;
    newDiscardArticleLastP.insertAdjacentHTML("beforeend",
      `
      <strong><span data-cellcoordinates=".row${ cellFin.row + 1 }.column${ cellFin.column + 1 }">R${ cellFin.row + 1 }C${ cellFin.column + 1 }</span></strong>  
      `
    );       
  });
  newDiscardArticle.insertAdjacentHTML("beforeend",
    `<p>
      These additional cells are located in square 
      <strong><span data-squarecoordinates=".square${ squaresRectangle.squareFin }">S${ squaresRectangle.squareFin }</span></strong> 
      and we will call these additional cells the FIN.
      Now, let's analyze ${recurrent.capitalizeFirstLetter(mainAxis)} 
      <strong><span data-${mainAxis}coordinates=".${mainAxis}${ eval(`oppositeCornerFin.${mainAxis}`) + 1 }">${recurrent.getFirstLetterCapitalized(mainAxis)}${ eval(`oppositeCornerFin.${mainAxis}`) + 1 }</span></strong>  
      which has only two possible options for candidate ${value}. 
    </p>
    <p>
      First possibility, let's say cell 
      <strong><span data-cellcoordinates=".row${ oppositeCornerFin.row + 1 }.column${cornerFin.column + 1}">R${ oppositeCornerFin.row + 1 }C${ cornerFin.column + 1 }</span></strong> 
      is the solution for candidate ${value}, which is the cell in different ${recurrent.capitalizeFirstLetter(mainAxis)} 
      (<strong><span data-${mainAxis}coordinates=".${mainAxis}${ eval(`oppositeCornerFin.${mainAxis}`) + 1 }">${recurrent.getFirstLetterCapitalized(mainAxis)}${ eval(`oppositeCornerFin.${mainAxis}`) + 1 }</span></strong>) 
      with the same ${recurrent.capitalizeFirstLetter(secondaryAxis)} 
      (<strong><span data-${secondaryAxis}coordinates=".${secondaryAxis}${ eval(`cornerFin.${secondaryAxis}`) + 1 }">${recurrent.getFirstLetterCapitalized(secondaryAxis)}${ eval(`cornerFin.${secondaryAxis}`) + 1 }</span></strong>) 
      as the corner with the fin (square 
      <strong><span data-squarecoordinates=".square${ squaresRectangle.squareFin }">S${ squaresRectangle.squareFin }</span></strong>). 
      For that case should be clear that any cell in that same 
      ${recurrent.capitalizeFirstLetter(secondaryAxis)} 
      <strong><span data-${secondaryAxis}coordinates=".${secondaryAxis}${ eval(`cornerFin.${secondaryAxis}`) + 1 }">${recurrent.getFirstLetterCapitalized(secondaryAxis)}${ eval(`cornerFin.${secondaryAxis}`) + 1 }</span></strong> 
      cannot be anymore solution for option ${value}.
    </p>
    <p>
      Let's evaluate the second possibility, that cell
      <strong><span data-cellcoordinates=".row${ oppositeCornerFin.row + 1 }.column${oppositeCornerFin.column + 1}">R${ oppositeCornerFin.row + 1 }C${ oppositeCornerFin.column + 1 }</span></strong> 
      is the solution for candidate ${value}. In that case should be clear that neither 
      <strong><span data-cellcoordinates=".row${ oppositeCornerFin.row + 1 }.column${cornerFin.column + 1}">R${ oppositeCornerFin.row + 1 }C${ cornerFin.column + 1 }</span></strong> or 
      <strong><span data-cellcoordinates=".row${ cornerFin.row + 1 }.column${oppositeCornerFin.column + 1}">R${ cornerFin.row + 1 }C${ oppositeCornerFin.column + 1 }</span></strong> 
      cannot be a possibility for candidate ${value}. Based on this, for ${recurrent.capitalizeFirstLetter(mainAxis)} 
      <strong><span data-${mainAxis}coordinates=".${mainAxis}${ eval(`cornerFin.${mainAxis}`) + 1 }">${recurrent.getFirstLetterCapitalized(mainAxis)}${ eval(`cornerFin.${mainAxis}`) + 1 }</span></strong>,  
      the only possible cells for candidate ${value} to be possible, are those cells within Square 
      <strong><span data-squarecoordinates=".square${ squaresRectangle.squareFin }">S${ squaresRectangle.squareFin }</span></strong>  
      fulfilling as well the requirement for that square to have a ${value}, so, any other cell with candidate ${value} within Square 
      <strong><span data-squarecoordinates=".square${ squaresRectangle.squareFin }">S${ squaresRectangle.squareFin }</span></strong> 
      that don't belong to the fin ${recurrent.capitalizeFirstLetter(mainAxis)}, can be discarded. 
    </p>
    <p>
      Either case, the cells common for ${recurrent.capitalizeFirstLetter(secondaryAxis)} 
      <strong><span data-${secondaryAxis}coordinates=".${secondaryAxis}${ eval(`cornerFin.${secondaryAxis}`) + 1 }">${recurrent.getFirstLetterCapitalized(secondaryAxis)}${ eval(`cornerFin.${secondaryAxis}`) + 1 }</span></strong> 
      and Square 
      <strong><span data-squarecoordinates=".square${ squaresRectangle.squareFin }">S${ squaresRectangle.squareFin }</span></strong> 
      (excluding the imaginary rectangle corner cell) can be safely deleted as possible cells for candidate ${value}.
    </p>
    `
  );

  const main = document.querySelector(".stackedCardsSection > div");
  main.prepend(newDiscardArticle);

  //creating the Event Listeners to the recently created RC spans
  const spanRowColumnCoordinates = document.querySelectorAll(`#Step${globalVar.currentStep} span`);
  spanRowColumnCoordinates.forEach(spanCoordinates => {eventListeners.spanRowColumnCoordinatesListener(spanCoordinates)});

  addGoBackToStepButton();
  settingHighlightedBlock("cell", [ oppositeCornerFin.row + 1, oppositeCornerFin.column + 1 ], "highlighted");
  settingHighlightedBlock("cell", [ oppositeCornerFin.row + 1, cornerFin.column + 1 ], "highlighted");
  settingHighlightedBlock("cell", [ cornerFin.row + 1, oppositeCornerFin.column + 1], "highlighted");
  settingHighlightedBlock("cell", [ cornerFin.row + 1, cornerFin.column + 1], "highlighted");
  cellsFin.forEach(finCell => { settingHighlightedBlock("cell", [ finCell.row + 1, finCell.column + 1 ], "finned") });
  possibleDeletionCells.forEach(possibleDeletionCell => { settingHighlightedBlock("cell", [ possibleDeletionCell.row + 1, possibleDeletionCell.column + 1 ], `finnedDeletion${recurrent.capitalizeFirstLetter(secondaryAxis)}`) });
};

//This Function is called by Nishio Techniques
const discardNishioCandidateProvenWrongHTML = (row, column, wrongCandidate, method, mainAxis, mainAxisValue ) => {
  console.log("--------------------------------------------");
  console.log("Don't think you are, know you are! - Morpheus");
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
    <strong><span data-cellcoordinates=".row${mainAxisValue[0] + 1}.column${mainAxisValue[1] + 1}">R${mainAxisValue[0] + 1}C${mainAxisValue[1] + 1}</span></strong>, 
    in step ${globalVar.nishioGuessingActive.step + 1}, and testing its validity, it was found as a wrong guessing.
  </p>
  <p>
    In previous Step, after ${globalVar.currentStep - globalVar.nishioGuessingActive.step - 2} steps, the cell
    <strong><span data-cellcoordinates=".row${row + 1}.column${column + 1}">R${row + 1}C${column + 1}</span></strong>
    was left with NO possible candidates with no certain value yet, which is not possible in a valid sudoku.
  </p>
  <p>
    This shows the guessing made in step ${globalVar.nishioGuessingActive.step + 1} was incorrect and the puzzle has been returned to the state in that step.
  </p>
  <p>
    So, now for certain, candidate ${wrongCandidate} has been discarded as option in cell
    <strong><span data-cellcoordinates=".row${mainAxisValue[0] + 1}.column${mainAxisValue[1] + 1}">R${mainAxisValue[0] + 1}C${mainAxisValue[1] + 1}</span></strong>.
  </p>
  `;

  const main = document.querySelector(".stackedCardsSection > div");
  main.prepend(newDiscardArticle);

  //creating the Event Listeners to the recently created RC spans
  const spanRowColumnCoordinates = document.querySelectorAll(`#Step${globalVar.currentStep} span`);
  spanRowColumnCoordinates.forEach(spanCoordinates => {eventListeners.spanRowColumnCoordinatesListener(spanCoordinates)});

  addGoBackToStepButton();
  // settingHighlightedBlock("cell", [pivotValues[0] + 1, pivotValues[1] + 1]);
};

const discardNishioGuessDeadEndHTML = (wrongCandidate, method, mainAxis, mainAxisValue ) => {
  console.log("--------------------------------------------");
  console.log("I'm sorry, this is a dead end - Agent Smith");
  console.log(`Cells resolved so far: ${globalVar.cellsResolved}`);
  console.log(`Loops executed so far: ${globalVar.loopsExecuted}`);  
  console.log("We got to a dead end (Double guess?!")
  document.querySelector("#button-reload").disabled = false; //applies only to step 1, but the if is unnecesary
  document.querySelector("#button-reload").classList.add("active");
  document.querySelector("#button-reload").classList.remove("inactive");
  let newDiscardArticle = document.createElement("article");
  newDiscardArticle.classList.add("deadEndNishio");
  newDiscardArticle.setAttribute("id", "Step" + globalVar.currentStep);
  newDiscardArticle.style.zIndex = -globalVar.currentStep;
  
  newDiscardArticle.innerHTML =  `
  <h3>Step ${globalVar.currentStep}</h3>
  <h4>${method}</h4>
  <p>
    After guessing the candidate ${wrongCandidate} as the possible certain value for cell 
    <strong><span data-cellcoordinates=".row${mainAxisValue[0] + 1}.column${mainAxisValue[1] + 1}">R${mainAxisValue[0] + 1}C${mainAxisValue[1] + 1}</span></strong>, 
    in step ${globalVar.nishioGuessingActive.step + 1}, and testing its validity, it got us to a dead end, where we would have to do a nested guess.
  </p>
  <p>
    Let's try other way by testing the next available candidate in a cell with only two candidates.
  </p>
  <p>
  To do that, in this step, the puzzle has been returned to the state in step ${globalVar.nishioGuessingActive.step}.</p>
  `;

  const main = document.querySelector(".stackedCardsSection > div");
  main.prepend(newDiscardArticle);

  //creating the Event Listeners to the recently created RC spans
  const spanRowColumnCoordinates = document.querySelectorAll(`#Step${globalVar.currentStep} span`);
  spanRowColumnCoordinates.forEach(spanCoordinates => {eventListeners.spanRowColumnCoordinatesListener(spanCoordinates)});

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

const settingHighlightedBlock = (mainBlock, mainBlockValue, classtoadd) => {
  //It evaluates which Block (cell, row, column or square involved in finding the value for this cell)
  if (globalVar.areHighlightsOn) {
    switch (mainBlock) {
      //These cases will add a class based on the parameter sent by the DOM modyfying function adding at the end the type of block (cell, row, column or square for CSS to handle)
      case "cell":
        let highlightedCell = document.querySelectorAll(`.row${mainBlockValue[0]}.column${mainBlockValue[1]}`);
        highlightedCell.forEach( (cell) => {cell.classList.add(`${classtoadd}Cell`)});
      break;
      case "row":
        let highlightedRow = document.querySelectorAll(`.row${mainBlockValue}`);
        highlightedRow.forEach( (cell) => {cell.classList.add(`${classtoadd}Row`)});
      break;
      case "column":
        let highlightedColumn = document.querySelectorAll(`.column${mainBlockValue}`);
        highlightedColumn.forEach( (cell) => {cell.classList.add(`${classtoadd}Column`)});
      break;
      case "square":
        let highlightedSquare = document.querySelectorAll(`.square${mainBlockValue}`);
        highlightedSquare.forEach( (cell) => {cell.classList.add(`${classtoadd}Square`)});
      break;
    };
  };
};

const newSudokuPuzzleArticle = () => {
  //Config for adding the description and card in stackedCardsSection Section
  let newfoundvalueArticle = document.createElement("article");
  newfoundvalueArticle.classList.add("newsudokupuzzle");
  newfoundvalueArticle.setAttribute("id", "Step" + globalVar.currentStep );
  newfoundvalueArticle.style.zIndex = -globalVar.currentStep;
  newfoundvalueArticle.innerHTML = `
  <h3>Step ${globalVar.currentStep}</h3>
  <h4>New Sudoku Puzzle</h4>
  <p>A new Sudoku Puzzle has been created for you. In this space you will find one card for each step you advance in the tutorial for your personalized Sudoku Puzzle</p>
  <p>Please use the buttons above the Puzzle to resolve or go back. You can return to the initial state of the puzzle by coming back to this card.</p>
  <p>In all these cards you will find these labels, which you can hover your mouse or click on touch screens, to guide you about which block the description is refering. For example: </p> 
  <p>
    Cell <strong><span data-cellcoordinates=".row1.column1">R1C1</span></strong>,
    Row <strong><span data-rowcoordinates=".row1">R1</span></strong>, 
    Column <strong><span data-columncoordinates=".column1">C1</span></strong>, 
    Square <strong><span data-squarecoordinates=".square1">S1</span></strong>.  
  </p>
  <p>
    Cell <strong><span data-cellcoordinates=".row9.column9">R9C9</span></strong>,
    Row <strong><span data-rowcoordinates=".row9">R9</span></strong>, 
    Column <strong><span data-columncoordinates=".column9">C9</span></strong>, 
    Square <strong><span data-squarecoordinates=".square9">S9</span></strong>.  
  </p>
  <p>Enjoy it and learn a lot about how solving your puzzle.</p>
  <p>The calculated difficulty for this puzzle is: ${globalVar.difficulty}</p>
  `;
  const main = document.querySelector(".stackedCardsSection > div");
  main.prepend(newfoundvalueArticle);

  //creating the Event Listeners to the recently created RC spans
  const spanRowColumnCoordinates = document.querySelectorAll(`#Step${globalVar.currentStep} span`);
  spanRowColumnCoordinates.forEach(spanCoordinates => {eventListeners.spanRowColumnCoordinatesListener(spanCoordinates)});
};

const fromThisStepNotesAreNeededArticle = () => {
  //Config for adding the description and card in stackedCardsSection Section
  let newArticle = document.createElement("article");
  newArticle.classList.add("weneednotes");
  newArticle.setAttribute("id", "Step" + globalVar.currentStep );
  newArticle.style.zIndex = -globalVar.currentStep;
  newArticle.innerHTML = `
  <h3>Step ${globalVar.currentStep}</h3>
  <h4>Notes are needed</h4>
  <p>For this step, it has not been possible to find a new solution value for any cell directly. From this point forward, to keep solving the Sudoku puzzle, it is necessary to have in each cell, the possible candidates marked.</p>
  <p>Those notes will be used to try and discard possible candidates for the cells, by using more advanced techniques.</p>
  <p>It has been marked for you all the possible candidates for each cell, based on the current status of the puzzle. This has been done by taking each cell already solved, and discarding that solved value in all the cells "seen" by that solved cell.</p>
  <p>"seen" means those cells located in the same row, column or square than the cell with the value already defined, which by the rules of Sudoku, cannot be a possibility for that value.</p>
  <p>The values left as candidates, are those which at this point cannot be discarded yet. Let's try and discard more, so we continue finding more cells to be solved.</p>
  `;
  const main = document.querySelector(".stackedCardsSection > div");
  main.prepend(newArticle);
  addGoBackToStepButton();
};

export { newFoundValueHTML, discardLockedCandidateHTML, discardXWingHTML, discardObviousPairsHTML, discardHiddenPairHTML, discardObviousTripleHTML, discardHiddenTripleHTML, discardObviousQuadHTML, discardHiddenQuadrupleHTML, discardYWingHTML, discardSwordFishHTML, discardFinnedXWingHTML, discardNishioCandidateProvenWrongHTML, discardNishioGuessDeadEndHTML, addGoBackToStepButton, newSudokuPuzzleArticle, fromThisStepNotesAreNeededArticle };