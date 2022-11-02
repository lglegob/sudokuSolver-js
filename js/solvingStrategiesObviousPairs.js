'use strict';
import globalVar from "./globalVar.js";
import * as solvingFunctions from "./solvingProcessFunctions.js";
import * as notesZero from "./notesZero.js";
import * as gettingInfo from "./gettingInfoBlock.js";
import * as modifyDOM from "./modifyingDOMFunctions.js";
import * as coordinates from "./defineCoordinates.js";

////////////////////////////////////////////////////////////////////////////////
//                  DISCARDING TECHNIQUES - OBVIOUS PAIRS                    //
//////////////////////////////////////////////////////////////////////////////

// Function to detect when a row has obvious pairs
const obviousPairsRow = () => {
  for (let row = 0; row <= 8; row++) { 
    const { howmanycellswiththisnote, howmanynotesinthiscell, whereisthisnote } = gettingInfo.gettingDetailedInfoBlock ( row, row, 0, 8, "row" );
    //column1 evaluates up to column7 to let space to compare with column8
    for (let column1 = 0; column1<= 7; column1++) {
      if (howmanynotesinthiscell[column1] === 2) {
        for (let column2 = column1+1; column2<= 8; column2++) {
          globalVar.loopsExecuted++;
          if (howmanynotesinthiscell[column2] === 2) {
            let cell1notes = globalVar.theMatrix[globalVar.currentStep][row][column1];
            let cell2notes = globalVar.theMatrix[globalVar.currentStep][row][column2];
            if (cell1notes.every((val, index) => val === cell2notes[index])) {
              let currentCandidateValue1 = cell1notes.indexOf(1);
              let currentCandidateValue2 = cell1notes.indexOf(1, currentCandidateValue1 + 1);
              //This if is to make sure the pair found has notes in other cells and declare them as obvious Pair
              if (howmanycellswiththisnote[currentCandidateValue1] > 2 || howmanycellswiththisnote[currentCandidateValue2] > 2) {
                solvingFunctions.discardObviousSet( row, "row", "column", {cell1:{ row: row, column: column1 }, cell2:{ row: row, column: column2 } }, { candidate1: currentCandidateValue1, candidate2: currentCandidateValue2 }, "Detecting Obvious Pair (Row)", whereisthisnote, notesZero.noteZeroRow, modifyDOM.discardObviousPairsHTML);
                break;
              };
            };
          };
        };
        if (globalVar.discardNoteSuccess) break;
      };
    };
    if (globalVar.discardNoteSuccess) break;
  };
};

// Function to detect when a column has obvious pairs
const obviousPairsColumn = () => {
  
  for (let column = 0; column <= 8; column++) { 
    const { howmanycellswiththisnote, howmanynotesinthiscell, whereisthisnote } = gettingInfo.gettingDetailedInfoBlock ( 0, 8, column, column, "column" );
    //column1 evaluates up to row7 to let space to compare with row8
    for (let row1 = 0; row1<= 7; row1++) {
      if (howmanynotesinthiscell[row1] === 2) {
        for (let row2 = row1+1; row2<= 8; row2++) {
          globalVar.loopsExecuted++;
          if (howmanynotesinthiscell[row2] === 2) {
            let cell1notes = globalVar.theMatrix[globalVar.currentStep][row1][column];
            let cell2notes = globalVar.theMatrix[globalVar.currentStep][row2][column];
            if (cell1notes.every((val, index) => val === cell2notes[index])) {
              let currentCandidateValue1 = cell1notes.indexOf(1);
              let currentCandidateValue2 = cell1notes.indexOf(1, currentCandidateValue1 + 1);
              //This if is to make sure the pair found has notes in other cells and declare them as obvious Pair
              if (howmanycellswiththisnote[currentCandidateValue1] > 2 || howmanycellswiththisnote[currentCandidateValue2] > 2) {
                solvingFunctions.discardObviousSet( column, "column", "row", {cell1:{ row: row1, column: column }, cell2:{ row: row2, column: column } }, { candidate1: currentCandidateValue1, candidate2: currentCandidateValue2 }, "Detecting Obvious Pair (Column)", whereisthisnote, notesZero.noteZeroColumn, modifyDOM.discardObviousPairsHTML);
                break;
              };
            };
          };
        };
        if (globalVar.discardNoteSuccess) break;
      };
    };
    if (globalVar.discardNoteSuccess) break;
  };
};

// Function to detect when an square has obvious pairs
const obviousPairsSquare = () => {
  
  for (let square = 1; square <= 9; square++) {
    const {fromrow, maximumrow, fromcolumn, maximumcolumn} = coordinates.defineInitialMaxRCFromSquare(square);
    const { howmanycellswiththisnote, howmanynotesinthiscell, whereisthisnote } = gettingInfo.gettingDetailedInfoBlock ( fromrow, maximumrow, fromcolumn, maximumcolumn, "square", square );
    //cell1 evaluates up to cell7 to let space to compare with cell8
    for (let cell1 = 0; cell1<= 7; cell1++) {
      if (howmanynotesinthiscell[cell1] === 2) {
        for (let cell2 = cell1+1; cell2<= 8; cell2++) {
          globalVar.loopsExecuted++;
          if (howmanynotesinthiscell[cell2] === 2) {
            let realrow1 = fromrow + Math.floor(cell1 / 3); 
            let realcolumn1 = fromcolumn + cell1 % 3;
            let realrow2 = fromrow + Math.floor(cell2 / 3);
            let realcolumn2 = fromcolumn + cell2 % 3;
            let cell1notes = globalVar.theMatrix[globalVar.currentStep][realrow1][realcolumn1];
            let cell2notes = globalVar.theMatrix[globalVar.currentStep][realrow2][realcolumn2];
            if (cell1notes.every((val, index) => val === cell2notes[index])) {
              let currentCandidateValue1 = cell1notes.indexOf(1);
              let currentCandidateValue2 = cell1notes.indexOf(1, currentCandidateValue1 + 1);
              //This if is to make sure the pair found has notes in other cells and declare them as obvious Pair
              if (howmanycellswiththisnote[currentCandidateValue1] > 2 || howmanycellswiththisnote[currentCandidateValue2] > 2) {
                solvingFunctions.discardObviousSet( square, "square", "cell", {cell1:{ row: realrow1, column: realcolumn1, cell: cell1 }, cell2:{ row: realrow2, column: realcolumn2, cell: cell2 } }, { candidate1: currentCandidateValue1, candidate2: currentCandidateValue2 }, "Detecting Obvious Pair (Square)", whereisthisnote, notesZero.noteZeroSquareSQ, modifyDOM.discardObviousPairsHTML);
                break;
              };
            };
          };
        };
        if (globalVar.discardNoteSuccess) break;
      };
    };
    if (globalVar.discardNoteSuccess) break;
  };
};

export {obviousPairsRow, obviousPairsColumn, obviousPairsSquare };