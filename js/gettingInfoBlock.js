'use strict';
import globalVar from "./globalVar.js";

////////////////////////////////////////////////////////////////////////////////
//                     DISCARDING PROCESS FUNCTIONS                          //
//////////////////////////////////////////////////////////////////////////////

//Unified Function to get the detailed info regardless of what kind of block (row, column or square) is currently in evaluation. 
const gettingDetailedInfoBlock = ( fromrow, maximumrow, fromcolumn, maximumcolumn, blockType, square ) => { 

  //It is consolidated in one array (1*10 first index value (0) not used) the answers for this block already known
  let answersCurrentBlock = [0,0,0,0,0,0,0,0,0,0];
  //It is consolidated in one array (1*10 first index value (0) not used) how many notes for each possibleCandidate in this square
  let howmanycellswiththisnote = [0,0,0,0,0,0,0,0,0,0];
  //It is consolidated in one array (1*9) how many notes for each cell
  let howmanynotesinthiscell = [0,0,0,0,0,0,0,0,0];
  //It is consolidated in an array of subarrays, the locations where each note is located for comparison, index array (0) not used.
  let whereisthisnote = [[],[],[],[],[],[],[],[],[],[]];   

  for (let infoRow = fromrow; infoRow <= maximumrow; infoRow++) { 
    for (let infoColumn = fromcolumn; infoColumn <= maximumcolumn; infoColumn++) {
      globalVar.loopsExecuted++;
      if (globalVar.theMatrix[globalVar.currentStep][infoRow][infoColumn][0] !== 0) {
        //It is consolidated in one array (1*10 first index value (0) not used) the answers for this block
        answersCurrentBlock[globalVar.theMatrix[globalVar.currentStep][infoRow][infoColumn][0]]++
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

export { gettingDetailedInfoBlock };