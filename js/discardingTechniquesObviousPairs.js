'use strict';
import globalVar from "./globalVar.js";
import * as recurrent from "./recurrentFunctions.js";
import * as discardingFunctions from "./discardingProcessFunctions.js"
import * as notesZero from "./notesZero.js";


////////////////////////////////////////////////////////////////////////////////
//                  DISCARDING TECHNIQUES - OBVIOUS PAIRS                    //
//////////////////////////////////////////////////////////////////////////////

// Function to detect when a row has obvious pairs
const obviousPairsRow = () => {
  for (let row = 0; row <= 8; row++) { 
    const { howmanycellswiththisnote, howmanynotesinthiscell } = discardingFunctions.gettingDetailedInfo ( row, row, 0, 8, "row" );

    //third loop to define if there are cells with 2 same values.
    //column1 evaluates up to column7 to let space to compare with column8
    for (let column1 = 0; column1<= 7; column1++) {
      if (howmanynotesinthiscell[column1] === 2) {
        for (let column2 = column1+1; column2<= 8; column2++) {
          globalVar.loopsExecuted++;
          if (howmanynotesinthiscell[column2] === 2) {
            let cell1notes = globalVar.theMatrix[globalVar.currentStep][row][column1];
            let cell2notes = globalVar.theMatrix[globalVar.currentStep][row][column2];
            if (cell1notes.every((val, index) => val === cell2notes[index])) {
              let currentCellValue1 = cell1notes.indexOf(1);
              let currentCellValue2 = cell1notes.indexOf(1, currentCellValue1 + 1);
              //This if is to make sure the pair found has notes in other cells and declare them as obvious Pair
              if (howmanycellswiththisnote[currentCellValue1] > 2 || howmanycellswiththisnote[currentCellValue2] > 2) {
                discardingFunctions.discardTwoCandidates(row, "row", row, row, column1, column2, currentCellValue1, currentCellValue2, "Detecting Obvious Pair (Row)", notesZero.noteZeroRow);
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
    const { howmanycellswiththisnote, howmanynotesinthiscell } = discardingFunctions.gettingDetailedInfo ( 0, 8, column, column, "column" );

    //third loop to define if there are cells with 2 same values.
    //column1 evaluates up to row7 to let space to compare with row8
    for (let row1 = 0; row1<= 7; row1++) {
      if (howmanynotesinthiscell[row1] === 2) {
        for (let row2 = row1+1; row2<= 8; row2++) {
          globalVar.loopsExecuted++;
          if (howmanynotesinthiscell[row2] === 2) {
            let cell1notes = globalVar.theMatrix[globalVar.currentStep][row1][column];
            let cell2notes = globalVar.theMatrix[globalVar.currentStep][row2][column];
            if (cell1notes.every((val, index) => val === cell2notes[index])) {
              let currentCellValue1 = cell1notes.indexOf(1);
              let currentCellValue2 = cell1notes.indexOf(1, currentCellValue1 + 1);
              //This if is to make sure the pair found has notes in other cells and declare them as obvious Pair
              if (howmanycellswiththisnote[currentCellValue1] > 2 || howmanycellswiththisnote[currentCellValue2] > 2) {
                discardingFunctions.discardTwoCandidates(column, "column", row1, row2, column, column, currentCellValue1, currentCellValue2, "Detecting Obvious Pair (Column)", notesZero.noteZeroColumn);
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
    const {fromrow, maximumrow, fromcolumn, maximumcolumn} = recurrent.defineSquareCoordinatesSQ(square);
    const { howmanycellswiththisnote, howmanynotesinthiscell } = discardingFunctions.gettingDetailedInfo ( fromrow, maximumrow, fromcolumn, maximumcolumn, "square", square );

    //third loop to define if there are cells with 2 same values.
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
              let currentCellValue1 = cell1notes.indexOf(1);
              let currentCellValue2 = cell1notes.indexOf(1, currentCellValue1 + 1);
              //This if is to make sure the pair found has notes in other cells and declare them as obvious Pair
              if (howmanycellswiththisnote[currentCellValue1] > 2 || howmanycellswiththisnote[currentCellValue2] > 2) {
                discardingFunctions.discardTwoCandidates(square, "square", realrow1, realrow2, realcolumn1, realcolumn2, currentCellValue1, currentCellValue2, "Detecting Obvious Pair (Square)", notesZero.noteZeroSquareSQ);
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