'use strict';
import globalVar from "./globalVar.js";
import * as recurrent from "./recurrentFunctions.js";

////////////////////////////////////////////////////////////////////////////////
//                     DISCARDING PROCESS FUNCTIONS                          //
//////////////////////////////////////////////////////////////////////////////

//Function used by discarding methods to get the detailed info regardless of what kind of block (row, column or square) is currently in evaluation. 
const gettingDetailedInfo = ( fromrow, maximumrow, fromcolumn, maximumcolumn, blockType, square ) => { 

  //It is consolidated in one array (1*10 first index value (0) not used) the answers for this square already known
  let answersCurrentBlock = [0,0,0,0,0,0,0,0,0,0];
  //It is consolidated in one array (1*10 first index value (0) not used) how many notes for each possibleCandidate in this square
  let howmanycellswiththisnote = [0,0,0,0,0,0,0,0,0,0];
  //It is consolidated in one array (1*9) how many notes for each cell
  let howmanynotesinthiscell = [0,0,0,0,0,0,0,0,0];
  //It is consolidated in an array of subarrays, the locations where each note is located for comparison
  let whereisthisnote = [[],[],[],[],[],[],[],[],[],[]];   

  for (let infoRow = fromrow; infoRow <= maximumrow; infoRow++) { 
    for (let infoColumn = fromcolumn; infoColumn <= maximumcolumn; infoColumn++) {
      globalVar.loopsExecuted++;
      if (globalVar.theMatrix[globalVar.currentStep][infoRow][infoColumn][0] !== 0) {
        //It is consolidated in one array (1*10 first index value (0) not used) the answers for this block
        answersCurrentBlock[globalVar.theMatrix[globalVar.currentStep][infoRow][infoColumn][0]] = 1
        
      };
    };
  };

  //second loop to start evaluating possible hidden pairs for remaining values by consolidating in array howmanycellswiththiscandidate and where isthisnote the data
  for (let possibleCandidate = 1; possibleCandidate <=9; possibleCandidate++) {
    whereisthisnote[possibleCandidate] = [0,0,0,0,0,0,0,0,0];
    if (answersCurrentBlock[possibleCandidate] === 0) {
      for (let infoRow = fromrow; infoRow <= maximumrow; infoRow++) { 
        for (let infoColumn = fromcolumn; infoColumn <= maximumcolumn; infoColumn++) {
          globalVar.loopsExecuted++;
          if (globalVar.theMatrix[globalVar.currentStep][infoRow][infoColumn][possibleCandidate] === 1) {
            howmanycellswiththisnote[possibleCandidate]++;
            let relativecolumn;
            let relativerow;
            switch (blockType) {
              case "row":
                howmanynotesinthiscell[infoColumn]++;
                whereisthisnote[possibleCandidate][infoColumn]++
              break;
              case "column":
                howmanynotesinthiscell[infoRow]++;
                whereisthisnote[possibleCandidate][infoRow]++
              break;
              case "square":
                relativecolumn = infoColumn - ( 3 * ((square-1) % 3));
                relativerow = infoRow - (3 * (Math.floor((square-1) / 3)));
                howmanynotesinthiscell[(relativerow)*3 + relativecolumn]++;
                whereisthisnote[possibleCandidate][(relativerow)*3 + relativecolumn]++
              break;
            };
          };
        };
      };
    };
  };
  return { howmanycellswiththisnote, howmanynotesinthiscell, answersCurrentBlock, whereisthisnote };
};

//Consolidated function for the 3 Blocks (row, column and square), when a pair of values can be discarded
const discardOneCandidate = (mainaxisvalue, mainaxis, secondaryaxisvalue, secondaryaxis, value, method, callbackNoteZero) => {

  let fromRowD;
  let maximumRowD;
  let fromColumnD;
  let maximumColumnD;
  //Section to copy the cells of the corresponding secondary Axis

  switch (true) {
    case (mainaxis === "square"):
      const {fromrow, maximumrow, fromcolumn, maximumcolumn} = recurrent.defineSquareCoordinatesSQ(mainaxisvalue);
      fromRowD = fromrow;
      fromColumnD = fromcolumn;
      maximumRowD = maximumrow;
      maximumColumnD = maximumcolumn;
    break;
  };
  switch (true) {
    case (secondaryaxis === "row"):
      fromRowD = secondaryaxisvalue;
      maximumRowD = secondaryaxisvalue;
    break;
    case (secondaryaxis === "column"):
      fromColumnD = secondaryaxisvalue;
      maximumColumnD = secondaryaxisvalue;
    break;
  };
  //This process saves in a temporal variable (the3Cells), the 3 intersecting values where the candadites must not change, to recover them after the notesZero process
  let the3Cells = [];
  for (let the3CellsRow = fromRowD; the3CellsRow <= maximumRowD; the3CellsRow++) { 
    for (let the3CellsColumn = fromColumnD; the3CellsColumn <= maximumColumnD; the3CellsColumn++) {
      the3Cells.push(globalVar.theMatrix[globalVar.currentStep][the3CellsRow][the3CellsColumn]); 
    };
  };

  globalVar.currentStep++;
  globalVar.stepsDetail[globalVar.currentStep] = [false, method, []];
  globalVar.theMatrix[globalVar.currentStep] = JSON.parse(JSON.stringify(globalVar.theMatrix[globalVar.currentStep - 1])); //The point where a new step is created in theMatrix, so previous state is saved in step-1. It has to be used these JSON methods to avoid the copy by reference but by value
  //Here we take advantage of the functions to delete the notes of found values, a callback function is used depending of the block (row, column or square), currently on evaluation
  let theMatrixStep = callbackNoteZero(mainaxisvalue, value, globalVar.theMatrix[globalVar.currentStep]);
  globalVar.theMatrix[globalVar.currentStep] = JSON.parse(JSON.stringify(theMatrixStep));
  //But here, it is restablished as notes for the 3 cells based on the temporal variable the3Cells
  for (let the3CellsRow = fromRowD; the3CellsRow <= maximumRowD; the3CellsRow++) { 
    for (let the3CellsColumn = fromColumnD; the3CellsColumn <= maximumColumnD; the3CellsColumn++) {
      globalVar.theMatrix[globalVar.currentStep][the3CellsRow][the3CellsColumn] = the3Cells.shift();
    };
  };

  if (globalVar.areNotesShowing === true) {
    recurrent.hideNotes(globalVar.theMatrix[globalVar.currentStep]);
    };
  globalVar.areNotesShowing = true;
  recurrent.showNotes(globalVar.theMatrix[globalVar.currentStep]);
  globalVar.discardNoteSuccess = true;
  discardOneCandidateHTML(mainaxisvalue, mainaxis, secondaryaxisvalue, secondaryaxis, value, method);
};

//Consolidated function for the 3 Blocks (row, column and square), when a pair of values can be discarded
const discardTwoCandidates = (blockvalue, mainaxis, row1, row2, column1, column2, value1, value2, method, callbackNoteZero) => {
  globalVar.currentStep++;
  globalVar.stepsDetail[globalVar.currentStep] = [false, method, []];
  globalVar.theMatrix[globalVar.currentStep] = JSON.parse(JSON.stringify(globalVar.theMatrix[globalVar.currentStep - 1])); //The point where a new step is created in theMatrix, so previous state is saved in step-1. It has to be used these JSON methods to avoid the copy by reference but by value
  //Here we take advantage of the functions to delete the notes of found values, a callback function is used depending of the block (row, column or square), currently on evaluation
  let theMatrixStep = callbackNoteZero(blockvalue, value1, globalVar.theMatrix[globalVar.currentStep]);
  theMatrixStep = callbackNoteZero(blockvalue, value2, theMatrixStep);
  globalVar.theMatrix[globalVar.currentStep] = JSON.parse(JSON.stringify(theMatrixStep));
  //But here, it is restablished as notes for the pair of cells
  globalVar.theMatrix[globalVar.currentStep][row1][column1][value1] = 1;
  globalVar.theMatrix[globalVar.currentStep][row1][column1][value2] = 1;
  globalVar.theMatrix[globalVar.currentStep][row2][column2][value1] = 1;
  globalVar.theMatrix[globalVar.currentStep][row2][column2][value2] = 1;
  if (globalVar.areNotesShowing === true) {
    recurrent.hideNotes(globalVar.theMatrix[globalVar.currentStep]);
    };
  globalVar.areNotesShowing = true;
  recurrent.showNotes(globalVar.theMatrix[globalVar.currentStep]);
  globalVar.discardNoteSuccess = true;
  discardTwoCandidatesHTML(blockvalue, mainaxis, row1, row2, column1, column2, value1, value2, method);
};

const discardOneCandidateHTML = (mainaxisvalue, mainaxis, secondaryaxisvalue, secondaryaxis, value, method) => {
  console.log("--------------------------------------------");
  console.log(`Cells resolved so far: ${globalVar.cellsResolved}`);
  console.log(`Loops executed so far: ${globalVar.loopsExecuted}`);  
  console.log("We found a locked Candidate!")
  if (mainaxis === "square") { mainaxisvalue--} //To adjust in the case of squares, which go from 1 to 9 instead of 0 to 8;
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
  <p>Notes Discarded in ${mainaxis} ${mainaxisvalue + 1}, all candidates with value ${value} that do not belong to ${secondaryaxis} ${secondaryaxisvalue + 1} have been deleted</p>
  `;
  const main = document.querySelector(".found-values > div");
  main.prepend(newdiscardOneCandidateArticle);
};

const discardTwoCandidatesHTML = (blockvalue, mainaxis, row1, row2, column1, column2, value1, value2, method) => {
  console.log("--------------------------------------------");
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
  <p>Notes Discarded in ${mainaxis} ${blockvalue + 1}, the first cell is row${row1 + 1} column${column1 + 1}, and the second cell is row${row2 + 1} column${column2 + 1}, The notes discarded are ${value1} and ${value2}, they have been deleted from other cells in the ${mainaxis} ${blockvalue + 1}</p>
  `;
  const main = document.querySelector(".found-values > div");
  main.prepend(newdiscardTwoCandidatesArticle);
};

export { gettingDetailedInfo, discardOneCandidate, discardTwoCandidates, discardOneCandidateHTML, discardTwoCandidatesHTML }