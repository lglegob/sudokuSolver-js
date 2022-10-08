'use strict';
import globalVar from "./globalVar.js";
import * as eventListeners from "./eventListeners.js";

////////////////////////////////////////////////////////////////////////////////
//                       DISCARDING DOM FUNCTIONS                            //
//////////////////////////////////////////////////////////////////////////////

const discardOneCandidateHTML = (mainaxisvalue, mainaxis, secondaryaxisvalue, secondaryaxis, value, method) => {
  console.log("--------------------------------------------");
  console.log("Remember, all I’m offering is the truth. Nothing more. - Morpheus");
  console.log(`Cells resolved so far: ${globalVar.cellsResolved}`);
  console.log(`Loops executed so far: ${globalVar.loopsExecuted}`);  
  console.log("We found a locked Candidate!")
  if (mainaxis === "square") { mainaxisvalue--} //To adjust in the case of squares, which go from 1 to 9 instead of 0 to 8;
  if (secondaryaxis === "square") { secondaryaxisvalue--} //To adjust in the case of squares, which go from 1 to 9 instead of 0 to 8;
  console.log(`For the ${secondaryaxis} ${secondaryaxisvalue + 1}, all the candidates value of ${value} are contained in the ${mainaxis} ${mainaxisvalue + 1}`)
  console.log(`Candidates notes for ${value} in other ${secondaryaxis}s within the same ${mainaxis} ${mainaxisvalue + 1} have been deleted`);
  document.querySelector("#button-reload").disabled = false; //applies only to step 1, but the if is unnecesary
  document.querySelector("#button-reload").classList.add("active");
  document.querySelector("#button-reload").classList.remove("inactive");
  let newdiscardOneCandidateArticle = document.createElement("article");
  newdiscardOneCandidateArticle.classList.add("newdiscardOneCandidate");
  newdiscardOneCandidateArticle.setAttribute("id", "Step" + globalVar.currentStep);
  newdiscardOneCandidateArticle.innerHTML = `
  <h3>Step ${globalVar.currentStep}</h3>
  <h4>Method ${method}</h4>
  <p>Notes Discarded in ${mainaxis} ${mainaxisvalue + 1}</p>
  <p>All candidates with value ${value} that do not belong to ${secondaryaxis} ${secondaryaxisvalue + 1} have been deleted</p>
  `;
  const main = document.querySelector(".stepsDetails > div");
  main.prepend(newdiscardOneCandidateArticle);
  addGoBackToStepButton();
};

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
  newdiscardOneCandidateArticle.innerHTML = `
  <h3>Step ${globalVar.currentStep}</h3>
  <h4>Method ${method}</h4>
  <p>Notes Discarded in ${secondaryaxis}s ${secondaryaxisvalues[0] + 1} and ${secondaryaxisvalues[1] + 1}</p>
  <p>All candidates with value ${value} that do not belong to ${mainaxis}s ${mainaxisvalues[0] + 1} and ${mainaxisvalues[1] + 1} have been deleted</p>
  `;
  const main = document.querySelector(".stepsDetails > div");
  main.prepend(newdiscardOneCandidateArticle);
  addGoBackToStepButton();
};

const discardTwoCandidatesHTML = (blockvalue, mainaxis, row1, row2, column1, column2, value1, value2, method) => {
  console.log("--------------------------------------------");
  console.log("There are only two possible explanations: either no one told me, or no one knows. - Neo");
  console.log(`Cells resolved so far: ${globalVar.cellsResolved}`);
  console.log(`Loops executed so far: ${globalVar.loopsExecuted}`);  
  console.log("We found an Obvious Pair!")
  if (mainaxis === "square") { blockvalue--} //To adjust in the case of squares, which go from 1 to 9 instead of 0 to 8;
  console.log(`We are looking at ${mainaxis} ${blockvalue + 1}, the first cell is row${row1 + 1} column${column1 + 1}, and the second cell is row${row2 + 1} column${column2 + 1}`)
  console.log(`The common pair notes are ${value1} and ${value2}, they have been deleted from other cells in the ${mainaxis} ${blockvalue + 1}`);
  document.querySelector("#button-reload").disabled = false; //applies only to step 1, but the if is unnecesary
  document.querySelector("#button-reload").classList.add("active");
  document.querySelector("#button-reload").classList.remove("inactive");
  let newdiscardTwoCandidatesArticle = document.createElement("article");
  newdiscardTwoCandidatesArticle.classList.add("newdiscardTwoCandidates");
  newdiscardTwoCandidatesArticle.setAttribute("id", "Step" + globalVar.currentStep);
  newdiscardTwoCandidatesArticle.innerHTML = `
  <h3>Step ${globalVar.currentStep}</h3>
  <h4>Method ${method}</h4>
  <p>Notes Discarded in ${mainaxis} ${blockvalue + 1}.</p>
  <p>The notes discarded are ${value1} and ${value2}, they have been deleted from other cells in the ${mainaxis} ${blockvalue + 1}</p>
  <p> the first cell is row${row1 + 1} column${column1 + 1}, and the second cell is row${row2 + 1} column${column2 + 1}.</p>
  `;
  const main = document.querySelector(".stepsDetails > div");
  main.prepend(newdiscardTwoCandidatesArticle);
  addGoBackToStepButton();
};

const discardAllExceptHTML = (blockvalue, mainaxis, row1, row2, column1, column2, value1, value2, method) => {
  console.log("--------------------------------------------");
  console.log("We are still here! – Morpheus");
  console.log(`Cells resolved so far: ${globalVar.cellsResolved}`);
  console.log(`Loops executed so far: ${globalVar.loopsExecuted}`);  
  console.log("We found an Hidden Pair!")
  if (mainaxis === "square") { blockvalue--} //To adjust in the case of squares, which go from 1 to 9 instead of 0 to 8;
  console.log(`We are looking at ${mainaxis} ${blockvalue + 1}, the first cell is row${row1 + 1} column${column1 + 1}, and the second cell is row${row2 + 1} column${column2 + 1}`)
  console.log(`The hidden pair notes are ${value1} and ${value2}, these are kept and all other notes in those two cells have been deleted`);
  document.querySelector("#button-reload").disabled = false; //applies only to step 1, but the if is unnecesary
  document.querySelector("#button-reload").classList.add("active");
  document.querySelector("#button-reload").classList.remove("inactive");
  let newdiscardAllExceptArticle = document.createElement("article");
  newdiscardAllExceptArticle.classList.add("newdiscardAllExceptHiddenPair");
  newdiscardAllExceptArticle.setAttribute("id", "Step" + globalVar.currentStep);
  newdiscardAllExceptArticle.innerHTML = `
  <h3>Step ${globalVar.currentStep}</h3>
  <h4>Method ${method}</h4>
  <p>Notes Discarded in ${mainaxis} ${blockvalue + 1}.</p>
  <p>The notes kept are ${value1} and ${value2}, all other candidates in these cells have been deleted</p>
  <p> the first cell is row${row1 + 1} column${column1 + 1}, and the second cell is row${row2 + 1} column${column2 + 1}.</p>
  `;
  const main = document.querySelector(".stepsDetails > div");
  main.prepend(newdiscardAllExceptArticle);
  addGoBackToStepButton();
};

const addGoBackToStepButton = () => {
  if (globalVar.currentStep > 1) {
    let newbackToStepButton = document.createElement("button");
    newbackToStepButton.classList.add("button-rectangle", "active", "goBackToStep", `goBackToStep${globalVar.currentStep -1}`);
    newbackToStepButton.setAttribute("name", `step${globalVar.currentStep -1}`)
    newbackToStepButton.innerHTML = `
    Go back to Step ${globalVar.currentStep - 1}
    `;
    const previousArticleStep = document.querySelector(`#Step${globalVar.currentStep - 1}`);
    previousArticleStep.append(newbackToStepButton);
    //creating the Event Listeners to the recently created button
    const button_goBackToStep = document.querySelector(`.goBackToStep${globalVar.currentStep -1}`);
    eventListeners.goBackToStepListener(button_goBackToStep);
  };
};

export { discardOneCandidateHTML, discardOneCandidateFrom2BlocksHTML, discardTwoCandidatesHTML, discardAllExceptHTML, addGoBackToStepButton }