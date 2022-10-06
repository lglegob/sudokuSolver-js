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

//Consolidated function for the 3 Blocks (row, column and square), when one value can be discarded
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
    break;

    case (mainaxis === "row"):
      const {fromrow:fromRowR, maximumrow:maximumrowR, fromcolumn:fromcolumnR, maximumcolumn:maximumcolumnR} = recurrent.defineSquareCoordinatesSQ(secondaryaxisvalue);
      fromRowD = mainaxisvalue;
      fromColumnD = fromcolumnR;
      maximumRowD = mainaxisvalue;
      maximumColumnD = maximumcolumnR;
    break;

    case (mainaxis === "column"):
      const {fromrow:fromrowC, maximumrow:maximumrowC, fromcolumn:fromcolumnC, maximumcolumn:maximumcolumnC} = recurrent.defineSquareCoordinatesSQ(secondaryaxisvalue);
      fromRowD = fromrowC;
      fromColumnD = mainaxisvalue;
      maximumRowD = maximumrowC;
      maximumColumnD = mainaxisvalue;
    break;
  };

  //This process saves in a temporal variable (the3Cells), the 3 intersecting values where the candadites must not change, to recover them after the notesZero process
  let the3Cells = [];
  for (let the3CellsRow = fromRowD; the3CellsRow <= maximumRowD; the3CellsRow++) { 
    for (let the3CellsColumn = fromColumnD; the3CellsColumn <= maximumColumnD; the3CellsColumn++) {
      globalVar.loopsExecuted++;
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
      globalVar.loopsExecuted++;
      globalVar.theMatrix[globalVar.currentStep][the3CellsRow][the3CellsColumn] = the3Cells.shift();
    };
  };

  globalVar.areNotesShowing = false;  //toggleNotes lo dejara en True
  recurrent.reviewNotes(globalVar.theMatrix[globalVar.currentStep]);
  recurrent.toggleNotes();
  globalVar.discardNoteSuccess = true;
  discardOneCandidateHTML(mainaxisvalue, mainaxis, secondaryaxisvalue, secondaryaxis, value, method);
};

//Consolidated function for the 2 Blocks (row, column), when one value can be discarded in X-Wing Detection technique
const discardOneCandidateFrom2Blocks = (mainaxisvalues, mainaxis, secondaryaxisvalues, secondaryaxis, value, method, callbackNoteZero) => {
  globalVar.currentStep++;
  globalVar.stepsDetail[globalVar.currentStep] = [false, method, []];
  globalVar.theMatrix[globalVar.currentStep] = JSON.parse(JSON.stringify(globalVar.theMatrix[globalVar.currentStep - 1])); //The point where a new step is created in theMatrix, so previous state is saved in step-1. It has to be used these JSON methods to avoid the copy by reference but by value

  //This process deletes the candidate from the two mainaxis blocks
  secondaryaxisvalues.forEach((secondaryaxisvalue)  => {
      //Here we take advantage of the functions to delete the notes of found values, a callback function is used depending of the block (row, column or square), currently on evaluation
      let theMatrixStep = callbackNoteZero(secondaryaxisvalue, value, globalVar.theMatrix[globalVar.currentStep]);
      globalVar.theMatrix[globalVar.currentStep] = JSON.parse(JSON.stringify(theMatrixStep));
  });
  //Here we restablished the candidate in the 4 cells
  if (mainaxis === "row") {
    globalVar.theMatrix[globalVar.currentStep][mainaxisvalues[0]][secondaryaxisvalues[0]][value] = 1;
    globalVar.theMatrix[globalVar.currentStep][mainaxisvalues[0]][secondaryaxisvalues[1]][value] = 1;
    globalVar.theMatrix[globalVar.currentStep][mainaxisvalues[1]][secondaryaxisvalues[0]][value] = 1;
    globalVar.theMatrix[globalVar.currentStep][mainaxisvalues[1]][secondaryaxisvalues[1]][value] = 1;
  } else { //mainaxis is column
    globalVar.theMatrix[globalVar.currentStep][secondaryaxisvalues[0]][mainaxisvalues[0]][value] = 1;
    globalVar.theMatrix[globalVar.currentStep][secondaryaxisvalues[0]][mainaxisvalues[1]][value] = 1;
    globalVar.theMatrix[globalVar.currentStep][secondaryaxisvalues[1]][mainaxisvalues[0]][value] = 1;
    globalVar.theMatrix[globalVar.currentStep][secondaryaxisvalues[1]][mainaxisvalues[1]][value] = 1;
  };

  globalVar.areNotesShowing = false;
  recurrent.reviewNotes(globalVar.theMatrix[globalVar.currentStep]);
  recurrent.toggleNotes();
  globalVar.discardNoteSuccess = true;
  discardOneCandidateFrom2BlocksHTML(mainaxisvalues, mainaxis, secondaryaxisvalues, secondaryaxis, value, method);
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
  globalVar.areNotesShowing = false;
  recurrent.reviewNotes(globalVar.theMatrix[globalVar.currentStep]);
  recurrent.toggleNotes();
  globalVar.discardNoteSuccess = true;
  discardTwoCandidatesHTML(blockvalue, mainaxis, row1, row2, column1, column2, value1, value2, method);
};

//Consolidated function for the 3 Blocks (row, column and square), when a pair of values must be kept and discard all others in one cell
const discardAllExcept = (blockvalue, mainaxis, row1, row2, column1, column2, value1, value2, method, callbackNoteZero) => {
  globalVar.currentStep++;
  globalVar.stepsDetail[globalVar.currentStep] = [false, method, []];
  globalVar.theMatrix[globalVar.currentStep] = JSON.parse(JSON.stringify(globalVar.theMatrix[globalVar.currentStep - 1])); //The point where a new step is created in theMatrix, so previous state is saved in step-1. It has to be used these JSON methods to avoid the copy by reference but by value
  //Here we take advantage of the functions to delete the notes of found values, a callback function is used depending of the block (row, column or square), currently on evaluation
  let theMatrixStep = callbackNoteZero(row1, column1, value1, value2, globalVar.theMatrix[globalVar.currentStep]);
  theMatrixStep = callbackNoteZero(row2, column2, value1, value2, theMatrixStep);
  globalVar.theMatrix[globalVar.currentStep] = JSON.parse(JSON.stringify(theMatrixStep));
  globalVar.areNotesShowing = false;
  recurrent.reviewNotes(globalVar.theMatrix[globalVar.currentStep]);
  recurrent.toggleNotes();
  globalVar.discardNoteSuccess = true;
  discardAllExceptHTML(blockvalue, mainaxis, row1, row2, column1, column2, value1, value2, method);
};

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
};

export { gettingDetailedInfo, discardOneCandidate, discardOneCandidateFrom2Blocks, discardTwoCandidates, discardAllExcept, discardOneCandidateHTML, discardTwoCandidatesHTML, discardAllExceptHTML }