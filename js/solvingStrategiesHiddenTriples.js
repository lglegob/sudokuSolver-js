'use strict';
import globalVar from "./globalVar.js";
import * as solvingFunctions from "./solvingProcessFunctions.js";
import * as notesZero from "./notesZero.js";
import * as gettingInfo from "./gettingInfoBlock.js";
import * as modifyDOM from "./modifyingDOMFunctions.js";
import * as coordinates from "./defineCoordinates.js";

////////////////////////////////////////////////////////////////////////////////
//                     DISCARDING TECHNIQUES - HIDDEN TRIPLES                  //
//////////////////////////////////////////////////////////////////////////////
// Function to detect when a row has hidden triples
const hiddenTriplesRow = () => {
  for (let row = 0; row <= 8; row++) { 
    const { howmanycellswiththisnote, howmanynotesinthiscell, whereisthisnote } = gettingInfo.gettingDetailedInfoBlock ( row, row, 0, 8, "row" );
    //currentCandidateValue1 evaluates up to possibleCandidate 7 to let space to compare with possibleCandidates 8 and 9
    for (let currentCandidateValue1 = 1; currentCandidateValue1<= 7; currentCandidateValue1++) {
      if (howmanycellswiththisnote[currentCandidateValue1] === 2 || howmanycellswiththisnote[currentCandidateValue1] === 3) {
        for (let currentCandidateValue2 = currentCandidateValue1+1; currentCandidateValue2<= 8; currentCandidateValue2++) {
          if (howmanycellswiththisnote[currentCandidateValue2] === 2 || howmanycellswiththisnote[currentCandidateValue2] === 3) {
            let candidate1notes = whereisthisnote[currentCandidateValue1];
            let candidate2notes = whereisthisnote[currentCandidateValue2];
            let candidate1ORcandidate2Notes = candidate1notes.map((cell, index) => cell || candidate2notes[index]);
            //method reduce to obtain the sum of the cells with these candidates.
            const sum1and2 = candidate1ORcandidate2Notes.reduce(add, 0);
              function add(accumulator, a) {
                return accumulator + a;
              };
            if (sum1and2 ===3) {
              for (let currentCandidateValue3 = currentCandidateValue2+1; currentCandidateValue3<= 9; currentCandidateValue3++) {
                globalVar.loopsExecuted++;
                if (howmanycellswiththisnote[currentCandidateValue3] === 2 || howmanycellswiththisnote[currentCandidateValue3] === 3) {
                  let candidate3notes = whereisthisnote[currentCandidateValue3];
                  let candidate1ORcandidate2ORcandidate3Notes = candidate3notes.map((cell, index) => cell || candidate1ORcandidate2Notes[index]);
                  //method reduce to obtain the sum of the candidates in this cell
                  const sum1and2and3 = candidate1ORcandidate2ORcandidate3Notes.reduce(add, 0);
                    function add(accumulator, a) {
                      return accumulator + a;
                    };
                  if (sum1and2and3 === 3) {
                    let column1 = candidate1ORcandidate2ORcandidate3Notes.indexOf(1);
                    let column2 = candidate1ORcandidate2ORcandidate3Notes.indexOf(1, column1 + 1);
                    let column3 = candidate1ORcandidate2ORcandidate3Notes.indexOf(1, column2 + 1);
                    //This section evaluates if there are still the same candidates values in other cells within the same block
                    let howManyCell1 = candidate1notes[column1] + candidate2notes[column1] + candidate3notes[column1];
                    let howManyCell2 = candidate1notes[column2] + candidate2notes[column2] + candidate3notes[column2];
                    let howManyCell3 = candidate1notes[column3] + candidate2notes[column3] + candidate3notes[column3];
                    if (howManyCell1 < howmanynotesinthiscell[column1] || howManyCell2 < howmanynotesinthiscell[column2] || howManyCell3 < howmanynotesinthiscell[column3]) { 
                      solvingFunctions.discardHiddenSet(row, "row", "column", {cell1:{ row: row, column: column1 }, cell2:{ row: row, column: column2 }, cell3:{ row: row, column: column3 } }, { candidate1: currentCandidateValue1, candidate2: currentCandidateValue2, candidate3: currentCandidateValue3 }, "Detecting Hidden Triples (Row)", notesZero.noteZeroCellExcept, modifyDOM.discardHiddenTripleHTML );
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

// Function to detect when a column has hidden triples
const hiddenTriplesColumn = () => {
  for (let column = 0; column <= 8; column++) { 
    const { howmanycellswiththisnote, howmanynotesinthiscell, whereisthisnote } = gettingInfo.gettingDetailedInfoBlock ( 0, 8, column, column, "column" );
    //currentCandidateValue1 evaluates up to possibleCandidate 7 to let space to compare with possibleCandidates 8 and 9
    for (let currentCandidateValue1 = 1; currentCandidateValue1<= 7; currentCandidateValue1++) {
      if (howmanycellswiththisnote[currentCandidateValue1] === 2 || howmanycellswiththisnote[currentCandidateValue1] === 3) {
        for (let currentCandidateValue2 = currentCandidateValue1+1; currentCandidateValue2<= 8; currentCandidateValue2++) {
          if (howmanycellswiththisnote[currentCandidateValue2] === 2 || howmanycellswiththisnote[currentCandidateValue2] === 3) {
            let candidate1notes = whereisthisnote[currentCandidateValue1];
            let candidate2notes = whereisthisnote[currentCandidateValue2];
            let candidate1ORcandidate2Notes = candidate1notes.map((cell, index) => cell || candidate2notes[index]);
            //method reduce to obtain the sum of the cells with these candidates.
            const sum1and2 = candidate1ORcandidate2Notes.reduce(add, 0);
              function add(accumulator, a) {
                return accumulator + a;
              };
            if (sum1and2 ===3) {
              for (let currentCandidateValue3 = currentCandidateValue2+1; currentCandidateValue3<= 9; currentCandidateValue3++) {
                globalVar.loopsExecuted++;
                if (howmanycellswiththisnote[currentCandidateValue3] === 2 || howmanycellswiththisnote[currentCandidateValue3] === 3) {
                  let candidate3notes = whereisthisnote[currentCandidateValue3];
                  let candidate1ORcandidate2ORcandidate3Notes = candidate3notes.map((cell, index) => cell || candidate1ORcandidate2Notes[index]);
                  //method reduce to obtain the sum of the candidates in this cell
                  const sum1and2and3 = candidate1ORcandidate2ORcandidate3Notes.reduce(add, 0);
                    function add(accumulator, a) {
                      return accumulator + a;
                    };
                  if (sum1and2and3 === 3) {
                    let row1 = candidate1ORcandidate2ORcandidate3Notes.indexOf(1);
                    let row2 = candidate1ORcandidate2ORcandidate3Notes.indexOf(1, row1 + 1);
                    let row3 = candidate1ORcandidate2ORcandidate3Notes.indexOf(1, row2 + 1);
                    //This section evaluates if there are still the same candidates values in other cells within the same block
                    let howManyCell1 = candidate1notes[row1] + candidate2notes[row1] + candidate3notes[row1];
                    let howManyCell2 = candidate1notes[row2] + candidate2notes[row2] + candidate3notes[row2];
                    let howManyCell3 = candidate1notes[row3] + candidate2notes[row3] + candidate3notes[row3];
                    if (howManyCell1 < howmanynotesinthiscell[row1] || howManyCell2 < howmanynotesinthiscell[row2] || howManyCell3 < howmanynotesinthiscell[row3]) { 
                      solvingFunctions.discardHiddenSet(column, "column", "row", {cell1:{ row: row1, column: column }, cell2:{ row: row2, column: column }, cell3:{ row: row3, column: column } }, { candidate1: currentCandidateValue1, candidate2: currentCandidateValue2, candidate3: currentCandidateValue3 }, "Detecting Hidden Triples (Column)", notesZero.noteZeroCellExcept, modifyDOM.discardHiddenTripleHTML );
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

// Function to detect when an square has hidden triples
const hiddenTriplesSquare = () => {
  for (let square = 1; square <= 9; square++) { 
    const {fromrow, maximumrow, fromcolumn, maximumcolumn} = coordinates.defineInitialMaxRCFromSquare(square);
    const { howmanycellswiththisnote, howmanynotesinthiscell, whereisthisnote } = gettingInfo.gettingDetailedInfoBlock ( fromrow, maximumrow, fromcolumn, maximumcolumn, "square", square );
     //currentCandidate evaluates up to currentCandidate7 to let space for other two cells to compare with currentCandidate8 and currentCandidate9
    for (let currentCandidateValue1 = 1; currentCandidateValue1<= 7; currentCandidateValue1++) {
      if (howmanycellswiththisnote[currentCandidateValue1] === 2 || howmanycellswiththisnote[currentCandidateValue1] === 3) {
        for (let currentCandidateValue2 = currentCandidateValue1+1; currentCandidateValue2<= 8; currentCandidateValue2++) {
          if (howmanycellswiththisnote[currentCandidateValue2] === 2 || howmanycellswiththisnote[currentCandidateValue2] === 3) {
            let candidate1notes = whereisthisnote[currentCandidateValue1];
            let candidate2notes = whereisthisnote[currentCandidateValue2];
            let candidate1ORcandidate2Notes = candidate1notes.map((cell, index) => cell || candidate2notes[index]);
            //method reduce to obtain the sum of the cells with these candidates.
            const sum1and2 = candidate1ORcandidate2Notes.reduce(add, 0);
              function add(accumulator, a) {
                return accumulator + a;
              };
            if (sum1and2 ===3) {
              for (let currentCandidateValue3 = currentCandidateValue2+1; currentCandidateValue3<= 9; currentCandidateValue3++) {
                globalVar.loopsExecuted++;
                if (howmanycellswiththisnote[currentCandidateValue3] === 2 || howmanycellswiththisnote[currentCandidateValue3] === 3) {
                  let candidate3notes = whereisthisnote[currentCandidateValue3];
                  let candidate1ORcandidate2ORcandidate3Notes = candidate3notes.map((cell, index) => cell || candidate1ORcandidate2Notes[index]);
                  //method reduce to obtain the sum of the candidates in this cell
                  const sum1and2and3 = candidate1ORcandidate2ORcandidate3Notes.reduce(add, 0);
                    function add(accumulator, a) {
                      return accumulator + a;
                    };
                  if (sum1and2and3 === 3) {
                    let cell1 = candidate1ORcandidate2ORcandidate3Notes.indexOf(1);
                    let cell2 = candidate1ORcandidate2ORcandidate3Notes.indexOf(1, cell1 + 1);
                    let cell3 = candidate1ORcandidate2ORcandidate3Notes.indexOf(1, cell2 + 1);
                    //This section evaluates if there are still the same candidates values in other cells within the same block
                    let howManyCell1 = candidate1notes[cell1] + candidate2notes[cell1] + candidate3notes[cell1];
                    let howManyCell2 = candidate1notes[cell2] + candidate2notes[cell2] + candidate3notes[cell2];
                    let howManyCell3 = candidate1notes[cell3] + candidate2notes[cell3] + candidate3notes[cell3];
                    if (howManyCell1 < howmanynotesinthiscell[cell1] || howManyCell2 < howmanynotesinthiscell[cell2] || howManyCell3 < howmanynotesinthiscell[cell3]) { 
                      const { realRow:realRow1, realColumn:realColumn1 } = coordinates.defineRealRCFromSquareRelativeCell(square, cell1);
                      const { realRow:realRow2, realColumn:realColumn2 } = coordinates.defineRealRCFromSquareRelativeCell(square, cell2);
                      const { realRow:realRow3, realColumn:realColumn3 } = coordinates.defineRealRCFromSquareRelativeCell(square, cell3);
                      solvingFunctions.discardHiddenSet(square, "square", "cell", {cell1:{ row: realRow1, column: realColumn1, cell: cell1 }, cell2:{ row: realRow2, column: realColumn2, cell: cell2 }, cell3:{ row: realRow3, column: realColumn3, cell: cell3 } }, { candidate1: currentCandidateValue1, candidate2: currentCandidateValue2, candidate3: currentCandidateValue3 }, "Detecting Hidden Triples (Square)", notesZero.noteZeroCellExcept, modifyDOM.discardHiddenTripleHTML );
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

export { hiddenTriplesRow, hiddenTriplesColumn, hiddenTriplesSquare };