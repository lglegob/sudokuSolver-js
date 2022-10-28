'use strict';
import globalVar from "./globalVar.js";
import * as discardingFunctions from "./discardingProcessFunctions.js"
import * as notesZero from "./notesZero.js";
import * as gettingInfo from "./gettingInfoBlock.js";
import * as recurrent from "./recurrentFunctions.js";
import * as modifyDOM from "./modifyingDOMFunctions.js";

////////////////////////////////////////////////////////////////////////////////
//                  DISCARDING TECHNIQUES - OBVIOUS PAIRS                    //
//////////////////////////////////////////////////////////////////////////////

// Function to detect when a row has obvious pairs
const obviousTriplesRow = () => {
  for (let row = 0; row <= 8; row++) { 
    const { howmanynotesinthiscell, howmanycellswiththisnote, whereisthisnote } = gettingInfo.gettingDetailedInfoBlock ( row, row, 0, 8, "row" );
    //column1 evaluates up to column6 to let space for other two cells to compare with column7 and column8
    for (let column1 = 0; column1<= 6; column1++) {
      if (howmanynotesinthiscell[column1] === 2 || howmanynotesinthiscell[column1] === 3) {
        for (let column2 = column1+1; column2<= 7; column2++) {
          if (howmanynotesinthiscell[column2] === 2 || howmanynotesinthiscell[column2] === 3) {
            let cell1notes = globalVar.theMatrix[globalVar.currentStep][row][column1];
            let cell2notes = globalVar.theMatrix[globalVar.currentStep][row][column2];
            let cell1ORcell2Notes = cell1notes.map((candidate, index) => candidate || cell2notes[index]);
            //method reduce to obtain the sum of the candidates in this cell
            const sum1and2 = cell1ORcell2Notes.reduce(add, 0);
              function add(accumulator, a) {
                return accumulator + a;
              };
            if (sum1and2 ===3) {
              for (let column3 = column2+1; column3<= 8; column3++) {
                globalVar.loopsExecuted++;
                if (howmanynotesinthiscell[column3] === 2 || howmanynotesinthiscell[column3] === 3) {
                  let cell3notes = globalVar.theMatrix[globalVar.currentStep][row][column3];
                  let cell1ORcell2ORcell3Notes = cell3notes.map((candidate, index) => candidate || cell1ORcell2Notes[index]);
                  //method reduce to obtain the sum of the candidates in this cell
                  const sum1and2and3 = cell1ORcell2ORcell3Notes.reduce(add, 0);
                  function add(accumulator, a) {
                    return accumulator + a;
                  };
                  if (sum1and2and3 === 3) {
                    let currentCandidateValue1 = cell1ORcell2ORcell3Notes.indexOf(1);
                    let currentCandidateValue2 = cell1ORcell2ORcell3Notes.indexOf(1, currentCandidateValue1 + 1);
                    let currentCandidateValue3 = cell1ORcell2ORcell3Notes.indexOf(1, currentCandidateValue2 + 1);
                    //This section evaluates if there are still the same candidates values in other cells within the same block
                    let howManyCandidate1 = cell1notes[currentCandidateValue1] + cell2notes[currentCandidateValue1] + cell3notes[currentCandidateValue1];
                    let howManyCandidate2 = cell1notes[currentCandidateValue2] + cell2notes[currentCandidateValue2] + cell3notes[currentCandidateValue2];
                    let howManyCandidate3 = cell1notes[currentCandidateValue3] + cell2notes[currentCandidateValue3] + cell3notes[currentCandidateValue3];
                    if (howManyCandidate1 < howmanycellswiththisnote[currentCandidateValue1] || howManyCandidate2 < howmanycellswiththisnote[currentCandidateValue2] || howManyCandidate3 < howmanycellswiththisnote[currentCandidateValue3]) { 
                      discardingFunctions.discardObviousSet(row, "row", "column", {cell1:{ row: row, column: column1 }, cell2:{ row: row, column: column2 }, cell3:{ row: row, column: column3 } }, { candidate1: currentCandidateValue1, candidate2: currentCandidateValue2, candidate3: currentCandidateValue3 }, "Detecting Obvious Triples (Row)", whereisthisnote, notesZero.noteZeroRow, modifyDOM.discardObviousTripleHTML );
                      break;
                    }
                  }
                };
              };
              if (globalVar.discardNoteSuccess) break;
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
const obviousTriplesColumn = () => {
  for (let column = 0; column <= 8; column++) { 
    const { howmanynotesinthiscell, howmanycellswiththisnote, whereisthisnote } = gettingInfo.gettingDetailedInfoBlock ( 0, 8, column, column, "column" );
    //row1 evaluates up to row6 to let space for other two cells to compare with row7 and row8
    for (let row1 = 0; row1<= 6; row1++) {
      if (howmanynotesinthiscell[row1] === 2 || howmanynotesinthiscell[row1] === 3) {
        for (let row2 = row1+1; row2<= 7; row2++) {
          if (howmanynotesinthiscell[row2] === 2 || howmanynotesinthiscell[row2] === 3) {
            let cell1notes = globalVar.theMatrix[globalVar.currentStep][row1][column];
            let cell2notes = globalVar.theMatrix[globalVar.currentStep][row2][column];
            let cell1ORcell2Notes = cell1notes.map((candidate, index) => candidate || cell2notes[index]);
            //method reduce to obtain the sum of the candidates in this cell
            const sum1and2 = cell1ORcell2Notes.reduce(add, 0);
              function add(accumulator, a) {
                return accumulator + a;
              };
            if (sum1and2 ===3) {
              for (let row3 = row2+1; row3<= 8; row3++) {
                globalVar.loopsExecuted++;
                if (howmanynotesinthiscell[row3] === 2 || howmanynotesinthiscell[row3] === 3) {
                  let cell3notes = globalVar.theMatrix[globalVar.currentStep][row3][column];
                  let cell1ORcell2ORcell3Notes = cell3notes.map((candidate, index) => candidate || cell1ORcell2Notes[index]);
                  //method reduce to obtain the sum of the candidates in this cell
                  const sum1and2and3 = cell1ORcell2ORcell3Notes.reduce(add, 0);
                  function add(accumulator, a) {
                    return accumulator + a;
                  };
                  if (sum1and2and3 === 3) {
                    let currentCandidateValue1 = cell1ORcell2ORcell3Notes.indexOf(1);
                    let currentCandidateValue2 = cell1ORcell2ORcell3Notes.indexOf(1, currentCandidateValue1 + 1);
                    let currentCandidateValue3 = cell1ORcell2ORcell3Notes.indexOf(1, currentCandidateValue2 + 1);
                    //This section evaluates if there are still the same candidates values in other cells within the same block
                    let howManyCandidate1 = cell1notes[currentCandidateValue1] + cell2notes[currentCandidateValue1] + cell3notes[currentCandidateValue1];
                    let howManyCandidate2 = cell1notes[currentCandidateValue2] + cell2notes[currentCandidateValue2] + cell3notes[currentCandidateValue2];
                    let howManyCandidate3 = cell1notes[currentCandidateValue3] + cell2notes[currentCandidateValue3] + cell3notes[currentCandidateValue3];
                    if (howManyCandidate1 < howmanycellswiththisnote[currentCandidateValue1] || howManyCandidate2 < howmanycellswiththisnote[currentCandidateValue2] || howManyCandidate3 < howmanycellswiththisnote[currentCandidateValue3]) { 
                      discardingFunctions.discardObviousSet(column, "column", "row", {cell1:{ row: row1, column: column }, cell2:{ row: row2, column: column }, cell3:{ row: row3, column: column } }, { candidate1: currentCandidateValue1, candidate2: currentCandidateValue2, candidate3: currentCandidateValue3 }, "Detecting Obvious Triples (Column)", whereisthisnote, notesZero.noteZeroColumn, modifyDOM.discardObviousTripleHTML );
                      break;
                    }
                  }
                };
              };
              if (globalVar.discardNoteSuccess) break;
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
const obviousTriplesSquare = () => {
  for (let square = 1; square <= 9; square++) { 
    const {fromrow, maximumrow, fromcolumn, maximumcolumn} = recurrent.defineSquareCoordinatesSQ(square);
    const { howmanynotesinthiscell, howmanycellswiththisnote, whereisthisnote } = gettingInfo.gettingDetailedInfoBlock ( fromrow, maximumrow, fromcolumn, maximumcolumn, "square", square );
    //cell1 evaluates up to cell6 to let space for other two cells to compare with cell7 and cell8
    for (let cell1 = 0; cell1<= 6; cell1++) {
      if (howmanynotesinthiscell[cell1] === 2 || howmanynotesinthiscell[cell1] === 3) {
        for (let cell2 = cell1+1; cell2<= 7; cell2++) {
          if (howmanynotesinthiscell[cell2] === 2 || howmanynotesinthiscell[cell2] === 3) {
            let realrow1 = fromrow + Math.floor(cell1 / 3); 
            let realcolumn1 = fromcolumn + cell1 % 3;
            let realrow2 = fromrow + Math.floor(cell2 / 3);
            let realcolumn2 = fromcolumn + cell2 % 3;
            let cell1notes = globalVar.theMatrix[globalVar.currentStep][realrow1][realcolumn1];
            let cell2notes = globalVar.theMatrix[globalVar.currentStep][realrow2][realcolumn2];
            let cell1ORcell2Notes = cell1notes.map((candidate, index) => candidate || cell2notes[index]);
            //method reduce to obtain the sum of the candidates in this cell
            const sum1and2 = cell1ORcell2Notes.reduce(add, 0);
              function add(accumulator, a) {
                return accumulator + a;
              };
            if (sum1and2 ===3) {
              for (let cell3 = cell2+1; cell3<= 8; cell3++) {
                globalVar.loopsExecuted++;
                if (howmanynotesinthiscell[cell3] === 2 || howmanynotesinthiscell[cell3] === 3) {
                  let realrow3 = fromrow + Math.floor(cell3 / 3);
                  let realcolumn3 = fromcolumn + cell3 % 3;
                  let cell3notes = globalVar.theMatrix[globalVar.currentStep][realrow3][realcolumn3];
                  let cell1ORcell2ORcell3Notes = cell3notes.map((candidate, index) => candidate || cell1ORcell2Notes[index]);
                  //method reduce to obtain the sum of the candidates in this cell
                  const sum1and2and3 = cell1ORcell2ORcell3Notes.reduce(add, 0);
                  function add(accumulator, a) {
                    return accumulator + a;
                  };
                  if (sum1and2and3 === 3) {
                    let currentCandidateValue1 = cell1ORcell2ORcell3Notes.indexOf(1);
                    let currentCandidateValue2 = cell1ORcell2ORcell3Notes.indexOf(1, currentCandidateValue1 + 1);
                    let currentCandidateValue3 = cell1ORcell2ORcell3Notes.indexOf(1, currentCandidateValue2 + 1);
                    //This section evaluates if there are still the same candidates values in other cells within the same block
                    let howManyCandidate1 = cell1notes[currentCandidateValue1] + cell2notes[currentCandidateValue1] + cell3notes[currentCandidateValue1];
                    let howManyCandidate2 = cell1notes[currentCandidateValue2] + cell2notes[currentCandidateValue2] + cell3notes[currentCandidateValue2];
                    let howManyCandidate3 = cell1notes[currentCandidateValue3] + cell2notes[currentCandidateValue3] + cell3notes[currentCandidateValue3];
                    if (howManyCandidate1 < howmanycellswiththisnote[currentCandidateValue1] || howManyCandidate2 < howmanycellswiththisnote[currentCandidateValue2] || howManyCandidate3 < howmanycellswiththisnote[currentCandidateValue3]) { 
                      discardingFunctions.discardObviousSet(square, "square", "cell", {cell1:{ row: realrow1, column: realcolumn1, cell: cell1 }, cell2:{ row: realrow2, column: realcolumn2, cell: cell2 }, cell3:{ row: realrow3, column: realcolumn3, cell: cell3 } }, { candidate1: currentCandidateValue1, candidate2: currentCandidateValue2, candidate3: currentCandidateValue3 }, "Detecting Obvious Triples (Square)", whereisthisnote, notesZero.noteZeroSquareSQ, modifyDOM.discardObviousTripleHTML );
                      break;
                    }
                  }
                };
              };
              if (globalVar.discardNoteSuccess) break;
            }; 
          };
        };
        if (globalVar.discardNoteSuccess) break;
      };
    };
    if (globalVar.discardNoteSuccess) break;
  };
};

export {obviousTriplesRow, obviousTriplesColumn, obviousTriplesSquare };