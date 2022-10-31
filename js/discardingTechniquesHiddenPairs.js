'use strict';
import globalVar from "./globalVar.js";
import * as recurrent from "./recurrentFunctions.js";
import * as discardingFunctions from "./discardingProcessFunctions.js"
import * as notesZero from "./notesZero.js";
import * as gettingInfo from "./gettingInfoBlock.js";
import * as modifyDOM from "./modifyingDOMFunctions.js";

////////////////////////////////////////////////////////////////////////////////
//                     DISCARDING TECHNIQUES - HIDDEN PAIRS                  //
//////////////////////////////////////////////////////////////////////////////
// Function to detect when a row has hidden pairs
const hiddenPairsRow = () => {
  for (let row = 0; row <= 8; row++) { 
    const { howmanycellswiththisnote, howmanynotesinthiscell, whereisthisnote } = gettingInfo.gettingDetailedInfoBlock ( row, row, 0, 8, "row" );
    //currentCandidateValue1 evaluates up to possibleCandidate 8 to let space to compare with possibleCandidate 9
    for (let currentCandidateValue1 = 1; currentCandidateValue1<= 8; currentCandidateValue1++) {
      if (howmanycellswiththisnote[currentCandidateValue1] === 2) {
        for (let currentCandidateValue2 = currentCandidateValue1+1; currentCandidateValue2<= 9; currentCandidateValue2++) {
          globalVar.loopsExecuted++;
          if (howmanycellswiththisnote[currentCandidateValue2] === 2) {
            let candidate1notes = whereisthisnote[currentCandidateValue1];
            let candidate2notes = whereisthisnote[currentCandidateValue2];
            if (candidate1notes.every((val, index) => val === candidate2notes[index])) {
              let column1 = candidate1notes.indexOf(1);
              let column2 = candidate1notes.indexOf(1, column1 + 1);
              //This if is to make sure the cell has more candidates and declare them as hidden Pair
              if (howmanynotesinthiscell[column1] > 2 || howmanynotesinthiscell[column2] > 2) {
                discardingFunctions.discardHiddenSet(row, "row", "column", {cell1:{ row: row, column: column1 }, cell2:{ row: row, column: column2 } }, { candidate1: currentCandidateValue1, candidate2: currentCandidateValue2 }, "Detecting Hidden Pair (Row)", notesZero.noteZeroCellExcept, modifyDOM.discardHiddenPairHTML);
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

// Function to detect when a column has hidden pairs
const hiddenPairsColumn = () => {
  for (let column = 0; column <= 8; column++) { 
    const { howmanycellswiththisnote, howmanynotesinthiscell, whereisthisnote } = gettingInfo.gettingDetailedInfoBlock ( 0, 8, column, column, "column" );
    //currentCandidateValue1 evaluates up to possibleCandidate 8 to let space to compare with possibleCandidate 9
    for (let currentCandidateValue1 = 1; currentCandidateValue1<= 8; currentCandidateValue1++) {
      if (howmanycellswiththisnote[currentCandidateValue1] === 2) {
        for (let currentCandidateValue2 = currentCandidateValue1+1; currentCandidateValue2<= 9; currentCandidateValue2++) {
          globalVar.loopsExecuted++;
          if (howmanycellswiththisnote[currentCandidateValue2] === 2) {
            let candidate1notes = whereisthisnote[currentCandidateValue1];
            let candidate2notes = whereisthisnote[currentCandidateValue2];
            if (candidate1notes.every((val, index) => val === candidate2notes[index])) {
              let row1 = candidate1notes.indexOf(1);
              let row2 = candidate1notes.indexOf(1, row1 + 1);
              //This if is to make sure the cell has more candidates and declare them as hidden Pair
              if (howmanynotesinthiscell[row1] > 2 || howmanynotesinthiscell[row2] > 2) {
                discardingFunctions.discardHiddenSet(column, "column", "row", {cell1:{ row: row1, column: column }, cell2:{ row: row2, column: column } }, { candidate1: currentCandidateValue1, candidate2: currentCandidateValue2 }, "Detecting Hidden Pair (Column)", notesZero.noteZeroCellExcept, modifyDOM.discardHiddenPairHTML);
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

// Function to detect when a column has hidden pairs
const hiddenPairsSquare = () => {
  for (let square = 1; square <= 9; square++) { 
    const {fromrow, maximumrow, fromcolumn, maximumcolumn} = recurrent.defineInitialMaxRCFromSquare(square);
    const { howmanycellswiththisnote, howmanynotesinthiscell, whereisthisnote } = gettingInfo.gettingDetailedInfoBlock ( fromrow, maximumrow, fromcolumn, maximumcolumn, "square", square );
    //currentCandidateValue1 evaluates up to possibleCandidate 8 to let space to compare with possibleCandidate 9
    for (let currentCandidateValue1 = 1; currentCandidateValue1<= 8; currentCandidateValue1++) {
      if (howmanycellswiththisnote[currentCandidateValue1] === 2) {
        for (let currentCandidateValue2 = currentCandidateValue1+1; currentCandidateValue2<= 9; currentCandidateValue2++) {
          globalVar.loopsExecuted++;
          if (howmanycellswiththisnote[currentCandidateValue2] === 2) {
            let candidate1notes = whereisthisnote[currentCandidateValue1];
            let candidate2notes = whereisthisnote[currentCandidateValue2];
            if (candidate1notes.every((val, index) => val === candidate2notes[index])) {
              let cell1 = candidate1notes.indexOf(1);
              let cell2 = candidate1notes.indexOf(1, cell1 + 1);
              //This if is to make sure the cell has more candidates and declare them as hidden Pair
              if (howmanynotesinthiscell[cell1] > 2 || howmanynotesinthiscell[cell2] > 2) {
                const { realRow:realRow1, realColumn:realColumn1 } = recurrent.defineRealRCFromSquareRelativeCell(square, cell1);
                const { realRow:realRow2, realColumn:realColumn2 } = recurrent.defineRealRCFromSquareRelativeCell(square, cell2);
                discardingFunctions.discardHiddenSet(square, "square", "cell", {cell1:{ row: realRow1, column: realColumn1 }, cell2:{ row: realRow2, column: realColumn2 } }, { candidate1: currentCandidateValue1, candidate2: currentCandidateValue2 }, "Detecting Hidden Pair (Square)", notesZero.noteZeroCellExcept, modifyDOM.discardHiddenPairHTML);
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

export { hiddenPairsRow, hiddenPairsColumn, hiddenPairsSquare };