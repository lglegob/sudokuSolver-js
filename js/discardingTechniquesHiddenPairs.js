'use strict';
import globalVar from "./globalVar.js";
import * as recurrent from "./recurrentFunctions.js";
import * as discardingFunctions from "./discardingProcessFunctions.js"
import * as notesZero from "./notesZero.js";
import * as gettingInfo from "./gettingInfoBlock.js";

////////////////////////////////////////////////////////////////////////////////
//                     DISCARDING TECHNIQUES - HIDDEN PAIRS                  //
//////////////////////////////////////////////////////////////////////////////
// Function to detect when a row has hidden pairs
const hiddenPairsRow = () => {
  for (let row = 0; row <= 8; row++) { 
    const { howmanycellswiththisnote, howmanynotesinthiscell, answersCurrentBlock, whereisthisnote } = gettingInfo.gettingDetailedInfoBlock ( row, row, 0, 8, "row" );
    //possibleCandidate1 evaluates up to possibleCandidate 8 to let space to compare with possibleCandidate 9
    for (let possibleCandidate1 = 1; possibleCandidate1<= 8; possibleCandidate1++) {
      if (howmanycellswiththisnote[possibleCandidate1] === 2) {
        for (let possibleCandidate2 = possibleCandidate1+1; possibleCandidate2<= 9; possibleCandidate2++) {
          globalVar.loopsExecuted++;
          if (howmanycellswiththisnote[possibleCandidate2] === 2) {
            let candidate1notes = whereisthisnote[possibleCandidate1];
            let candidate2notes = whereisthisnote[possibleCandidate2];
            if (candidate1notes.every((val, index) => val === candidate2notes[index])) {
              let currentCell1 = candidate1notes.indexOf(1);
              let currentCell2 = candidate1notes.indexOf(1, currentCell1 + 1);
              //This if is to make sure the pair found has notes in other cells and declare them as obvious Pair
              if (howmanynotesinthiscell[currentCell1] > 2 || howmanynotesinthiscell[currentCell2] > 2) {
                console.log(`we have found a hidden Pair in Row ${row}, columns ${currentCell1} and ${currentCell2}, the candidates are ${possibleCandidate1} and ${possibleCandidate2} `);
                discardingFunctions.discardHiddenPair(row, "row", row, row, currentCell1, currentCell2, possibleCandidate1, possibleCandidate2, "Detecting Hidden Pair (Row)", notesZero.noteZeroCellExcept);
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
    const { howmanycellswiththisnote, howmanynotesinthiscell, answersCurrentBlock, whereisthisnote } = gettingInfo.gettingDetailedInfoBlock ( 0, 8, column, column, "column" );
    //possibleCandidate1 evaluates up to possibleCandidate 8 to let space to compare with possibleCandidate 9
    for (let possibleCandidate1 = 1; possibleCandidate1<= 8; possibleCandidate1++) {
      if (howmanycellswiththisnote[possibleCandidate1] === 2) {
        for (let possibleCandidate2 = possibleCandidate1+1; possibleCandidate2<= 9; possibleCandidate2++) {
          globalVar.loopsExecuted++;
          if (howmanycellswiththisnote[possibleCandidate2] === 2) {
            let candidate1notes = whereisthisnote[possibleCandidate1];
            let candidate2notes = whereisthisnote[possibleCandidate2];
            if (candidate1notes.every((val, index) => val === candidate2notes[index])) {
              let currentCell1 = candidate1notes.indexOf(1);
              let currentCell2 = candidate1notes.indexOf(1, currentCell1 + 1);
              //This if is to make sure the pair found has notes in other cells and declare them as obvious Pair
              if (howmanynotesinthiscell[currentCell1] > 2 || howmanynotesinthiscell[currentCell2] > 2) {
                discardingFunctions.discardHiddenPair(column, "column", currentCell1, currentCell2, column, column, possibleCandidate1, possibleCandidate2, "Detecting Hidden Pair (Column)", notesZero.noteZeroCellExcept);
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
    const {fromrow, maximumrow, fromcolumn, maximumcolumn} = recurrent.defineSquareCoordinatesSQ(square);
    const { howmanycellswiththisnote, howmanynotesinthiscell, answersCurrentBlock, whereisthisnote } = gettingInfo.gettingDetailedInfoBlock ( fromrow, maximumrow, fromcolumn, maximumcolumn, "square", square  );
    //possibleCandidate1 evaluates up to possibleCandidate 8 to let space to compare with possibleCandidate 9
    for (let possibleCandidate1 = 1; possibleCandidate1<= 8; possibleCandidate1++) {
      if (howmanycellswiththisnote[possibleCandidate1] === 2) {
        for (let possibleCandidate2 = possibleCandidate1+1; possibleCandidate2<= 9; possibleCandidate2++) {
          globalVar.loopsExecuted++;
          if (howmanycellswiththisnote[possibleCandidate2] === 2) {
            let candidate1notes = whereisthisnote[possibleCandidate1];
            let candidate2notes = whereisthisnote[possibleCandidate2];
            if (candidate1notes.every((val, index) => val === candidate2notes[index])) {
              let currentCell1 = candidate1notes.indexOf(1);
              let currentCell2 = candidate1notes.indexOf(1, currentCell1 + 1);
              //This if is to make sure the pair found has notes in other cells and declare them as obvious Pair
              if (howmanynotesinthiscell[currentCell1] > 2 || howmanynotesinthiscell[currentCell2] > 2) {
                const { realRow:realRow1, realColumn:realColumn1 } = recurrent.defineRowColumnFromCellRelative(square, currentCell1);
                const { realRow:realRow2, realColumn:realColumn2 } = recurrent.defineRowColumnFromCellRelative(square, currentCell2);
                discardingFunctions.discardHiddenPair(square, "square", realRow1, realRow2, realColumn1, realColumn2, possibleCandidate1, possibleCandidate2, "Detecting Hidden Pair (Square)", notesZero.noteZeroCellExcept);
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