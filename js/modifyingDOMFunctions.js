'use strict';
import globalVar from "./globalVar.js";
import * as eventListeners from "./eventListeners.js";

////////////////////////////////////////////////////////////////////////////////
//                       DISCARDING DOM FUNCTIONS                            //
//////////////////////////////////////////////////////////////////////////////

//This Function is called by OBVIOUSPAIRS Techniques
const discardTwoCandidatesHTML = (blockvalue, mainaxis, row1, row2, column1, column2, value1, value2, method) => {
  console.log("--------------------------------------------");
  console.log("There are only two possible explanations: either no one told me, or no one knows. - Neo");
  console.log(`Cells resolved so far: ${globalVar.cellsResolved}`);
  console.log(`Loops executed so far: ${globalVar.loopsExecuted}`);  
  console.log("We found an Obvious Pair!")
  mainaxis === "square" ? blockvalue-- : false; //To adjust in the case of squares, which go from 1 to 9 instead of 0 to 8;
  console.log(`We are looking at ${mainaxis} ${blockvalue + 1}, the first cell is row${row1 + 1} column${column1 + 1}, and the second cell is row${row2 + 1} column${column2 + 1}`)
  console.log(`The common pair notes are ${value1} and ${value2}, they have been deleted from other cells in the ${mainaxis} ${blockvalue + 1}`);
  document.querySelector("#button-reload").disabled = false; //applies only to step 1, but the if is unnecesary
  document.querySelector("#button-reload").classList.add("active");
  document.querySelector("#button-reload").classList.remove("inactive");
  let newdiscardTwoCandidatesArticle = document.createElement("article");
  newdiscardTwoCandidatesArticle.classList.add("newdiscardTwoCandidates");
  newdiscardTwoCandidatesArticle.setAttribute("id", "Step" + globalVar.currentStep);
  newdiscardTwoCandidatesArticle.style.zIndex = -globalVar.currentStep;
  newdiscardTwoCandidatesArticle.innerHTML = `
  <h3>Step ${globalVar.currentStep}</h3>
  <h4>${method}</h4>
  <p>Cells R${row1 + 1}C${column1 + 1} (Row ${row1 + 1}, Column ${column1 + 1}) and R${row2 + 1}C${column2 + 1} (Row ${row2 + 1}, Column ${column2 + 1}) contain an obvious pair (Cells with the same two only candidates)</p>
  <p>The two cells are within the same Block (${mainaxis} ${blockvalue + 1}), and the candidates are ${value1} and ${value2}</p>
  <p>These Candidates, ${value1} and ${value2}, have been deleted from other cells within the ${mainaxis} ${blockvalue + 1}</p>
  `;
  const main = document.querySelector(".stepsDetails > div");
  main.prepend(newdiscardTwoCandidatesArticle);
  addGoBackToStepButton();
  settingHighlightedBlock(mainaxis, blockvalue + 1);
};

//This Function is called by HIDDENPAIRS Techniques
const discardAllExceptHTML = (blockvalue, mainaxis, row1, row2, column1, column2, value1, value2, method) => {
  console.log("--------------------------------------------");
  console.log("We are still here! – Morpheus");
  console.log(`Cells resolved so far: ${globalVar.cellsResolved}`);
  console.log(`Loops executed so far: ${globalVar.loopsExecuted}`);  
  console.log("We found an Hidden Pair!")
  mainaxis === "square" ? blockvalue-- : false; //To adjust in the case of squares, which go from 1 to 9 instead of 0 to 8;
  console.log(`We are looking at ${mainaxis} ${blockvalue + 1}, the first cell is row${row1 + 1} column${column1 + 1}, and the second cell is row${row2 + 1} column${column2 + 1}`)
  console.log(`The hidden pair notes are ${value1} and ${value2}, these are kept and all other notes in those two cells have been deleted`);
  document.querySelector("#button-reload").disabled = false; //applies only to step 1, but the if is unnecesary
  document.querySelector("#button-reload").classList.add("active");
  document.querySelector("#button-reload").classList.remove("inactive");
  let newdiscardAllExceptArticle = document.createElement("article");
  newdiscardAllExceptArticle.classList.add("newdiscardAllExceptHiddenPair");
  newdiscardAllExceptArticle.setAttribute("id", "Step" + globalVar.currentStep);
  newdiscardAllExceptArticle.style.zIndex = -globalVar.currentStep;
  newdiscardAllExceptArticle.innerHTML = `
  <h3>Step ${globalVar.currentStep}</h3>
  <h4>${method}</h4>
  <p>Cells R${row1 + 1}C${column1 + 1} (Row ${row1 + 1}, Column ${column1 + 1}) and R${row2 + 1}C${column2 + 1} (Row ${row2 + 1}, Column ${column2 + 1}) contain a hidden pair (The only two Cells within a block with the same two candidates)</p>
  <p>The two cells are within the same Block (${mainaxis} ${blockvalue + 1}), and the candidates are ${value1} and ${value2}</p>
  <p>These Candidates, ${value1} and ${value2}, are the only ones kept, all other candidates have been deleted within the ${mainaxis} ${blockvalue + 1} in those two cells</p>
  `;
  const main = document.querySelector(".stepsDetails > div");
  main.prepend(newdiscardAllExceptArticle);
  addGoBackToStepButton();
  settingHighlightedBlock(mainaxis, blockvalue + 1);
};

//This Function is called by LOCKEDCANDIDATE Techniques
const discardOneCandidateHTML = (mainaxisvalue, mainaxis, secondaryaxisvalue, secondaryaxis, value, method) => {
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
  let newdiscardOneCandidateArticle = document.createElement("article");
  newdiscardOneCandidateArticle.classList.add("newdiscardOneCandidate");
  newdiscardOneCandidateArticle.setAttribute("id", "Step" + globalVar.currentStep);
  newdiscardOneCandidateArticle.style.zIndex = -globalVar.currentStep;
  newdiscardOneCandidateArticle.innerHTML = `
  <h3>Step ${globalVar.currentStep}</h3>
  <h4>${method}</h4>
  <p>In ${secondaryaxis} ${secondaryaxisvalue + 1}, all the cells with the candidate ${value}, are confined to the same ${mainaxis} ${mainaxisvalue + 1}</p>
  <p>For ${secondaryaxis} ${secondaryaxisvalue + 1} to have a ${value}, it must be in one of those cells shared with ${mainaxis} ${mainaxisvalue + 1} fulfilling also the requirement of ${mainaxis} ${mainaxisvalue + 1} to have a ${value}</p>
  <p>So, all candidates with value ${value} within ${mainaxis} ${mainaxisvalue + 1}, that do not belong to ${secondaryaxis} ${secondaryaxisvalue + 1} have been deleted</p>
  `;
  const main = document.querySelector(".stepsDetails > div");
  main.prepend(newdiscardOneCandidateArticle);
  addGoBackToStepButton();
  settingHighlightedBlock(secondaryaxis, secondaryaxisvalue + 1);
};

//This Function is called by X-WING Techniques
const discardOneCandidateFrom2BlocksHTML = (mainaxisvalues, mainaxis, secondaryaxisvalues, secondaryaxis, value, method) => {
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
  let newdiscardOneCandidateArticle = document.createElement("article");
  newdiscardOneCandidateArticle.classList.add("newdiscardOneCandidate");
  newdiscardOneCandidateArticle.setAttribute("id", "Step" + globalVar.currentStep);
  newdiscardOneCandidateArticle.style.zIndex = -globalVar.currentStep;
  
  if (mainaxis === "row") {
    newdiscardOneCandidateArticle.innerHTML =  `
    <h3>Step ${globalVar.currentStep}</h3>
    <h4>${method}</h4>
    <p>4 Cells in X-Wing configuration shared a candidate, the cells are R${mainaxisvalues[0] + 1}C${secondaryaxisvalues[0] + 1}, R${mainaxisvalues[0] + 1}C${secondaryaxisvalues[1] + 1}, R${mainaxisvalues[1] + 1}C${secondaryaxisvalues[0] + 1} and R${mainaxisvalues[1] + 1}C${secondaryaxisvalues[1] + 1}</p>
    <p>These 4 cells are the crosspoints between Rows R${mainaxisvalues[0] + 1} and R${mainaxisvalues[1] + 1}, and Columns C${secondaryaxisvalues[0] + 1} and C${secondaryaxisvalues[1] + 1}</p>
    <p>Since no more candidates with option ${value} exist within the two Rows, we know for sure those two ${value}s must exist in two of those 4 cells in a diagonal (R${mainaxisvalues[0] + 1}C${secondaryaxisvalues[0] + 1} and R${mainaxisvalues[1] + 1}C${secondaryaxisvalues[1] + 1} will be ${value} OR R${mainaxisvalues[0] + 1}C${secondaryaxisvalues[1] + 1} and R${mainaxisvalues[1] + 1}C${secondaryaxisvalues[0] + 1} will be ${value})</p>
    <p>Because having those two mandatory ${value}s in two of the cells, we are sure that the two Columns will already have the ${value}</p>
    <p>So, all candidates with value ${value} in Columns C${secondaryaxisvalues[0] + 1} and C${secondaryaxisvalues[1] + 1}, that do not belong to Rows R${mainaxisvalues[0] + 1} and R${mainaxisvalues[1] + 1} have been deleted</p>
    `;
  } else {
    newdiscardOneCandidateArticle.innerHTML =  `
    <h3>Step ${globalVar.currentStep}</h3>
    <h4>${method}</h4>
    <p>4 Cells in X-Wing configuration shared a candidate, the cells are R${secondaryaxisvalues[0] + 1}C${mainaxisvalues[0] + 1}, R${secondaryaxisvalues[0] + 1}C${mainaxisvalues[1] + 1}, R${secondaryaxisvalues[1] + 1}C${mainaxisvalues[0] + 1} and R${secondaryaxisvalues[1] + 1}C${mainaxisvalues[1] + 1}</p>
    <p>These 4 cells are the crosspoints between Rows R${secondaryaxisvalues[0] + 1} and R${secondaryaxisvalues[1] + 1}, and Columns C${mainaxisvalues[0] + 1} and C${mainaxisvalues[1] + 1}</p>
    <p>Since no more candidates with option ${value} exist within the two Columns, we know for sure those two ${value}s must exist in two of those 4 cells in a diagonal (R${secondaryaxisvalues[0] + 1}C${mainaxisvalues[0] + 1} and R${secondaryaxisvalues[1] + 1}C${mainaxisvalues[1] + 1} will be ${value} OR R${secondaryaxisvalues[0] + 1}C${mainaxisvalues[1] + 1} and R${secondaryaxisvalues[1] + 1}C${mainaxisvalues[0] + 1} will be ${value})</p>
    <p>Because having those two mandatory ${value}s in two of the cells, we are sure that the two Rows will already have the ${value}</p>
    <p>So, all candidates with value ${value} in Rows R${secondaryaxisvalues[0] + 1} and R${secondaryaxisvalues[1] + 1}, that do not belong to Columns C${mainaxisvalues[0] + 1} and C${mainaxisvalues[1] + 1} have been deleted</p>
    `;
  };

  const main = document.querySelector(".stepsDetails > div");
  main.prepend(newdiscardOneCandidateArticle);
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
  let newdiscardOneCandidateArticle = document.createElement("article");
  newdiscardOneCandidateArticle.classList.add("newdiscardOneCandidate");
  newdiscardOneCandidateArticle.setAttribute("id", "Step" + globalVar.currentStep);
  newdiscardOneCandidateArticle.style.zIndex = -globalVar.currentStep;
  
  newdiscardOneCandidateArticle.innerHTML =  `
  <h3>Step ${globalVar.currentStep}</h3>
  <h4>${method}</h4>
  <p>Cells in Y-Wing configuration have been found, Pivot cell is R${pivotValues[0] + 1}C${pivotValues[1] + 1} (Row ${pivotValues[0] + 1}, Column ${pivotValues[1] + 1}), with Candidates ${pincerX} and ${pincerY}.</p>
  <p>First Pincer found in the same ${pincer1Axis} in cell R${pincer1Values[0] + 1}C${pincer1Values[1] + 1}, sharing the Candidate ${pincerX}.</p>
  <p>Second Pincer found in the same ${pincer2Axis} in cell R${pincer2Values[0] + 1}C${pincer2Values[1] + 1}, sharing the Candidate ${pincerY}.</p>
  <p>No matter the case, the candidate ${pincerZ} present in both Pincer cells will be either in R${pincer1Values[0] + 1}C${pincer1Values[1] + 1} OR in R${pincer2Values[0] + 1}C${pincer2Values[1] + 1}</p>
  <p>Either case, for Cells "seen" by both Pincers is not possible to have the value ${pincerZ}, so, it has been deleted as candidate in those cells</p>
  `;

  const main = document.querySelector(".stepsDetails > div");
  main.prepend(newdiscardOneCandidateArticle);
  addGoBackToStepButton();
  settingHighlightedBlock("cell", [pivotValues[0] + 1, pivotValues[1] + 1]);
  settingHighlightedBlock("cell", [pincer1Values[0] + 1, pincer1Values[1] + 1]);
  settingHighlightedBlock("cell", [pincer2Values[0] + 1, pincer2Values[1] + 1]);
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

export { discardOneCandidateHTML, discardOneCandidateFrom2BlocksHTML, discardTwoCandidatesHTML, discardAllExceptHTML, discardYWingHTML, addGoBackToStepButton, settingHighlightedBlock }