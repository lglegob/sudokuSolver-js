'use strict';
import globalVar from "./globalVar.js";
import * as solvingFunctions from "./solvingProcessFunctions.js";
import * as notesZero from "./notesZero.js";
import * as gettingInfo from "./gettingInfoBlock.js";
import * as modifyDOM from "./modifyingDOMFunctions.js";
import * as coordinates from "./defineCoordinates.js";

////////////////////////////////////////////////////////////////////////////////
//                  DISCARDING TECHNIQUES - HIDDEN QUADRUPLES                //
//////////////////////////////////////////////////////////////////////////////
// Function to detect when a row has hidden Quadruples
const hiddenQuadruplesRow = () => {
  for (let row = 0; row <= 8; row++) { 
    const { howmanycellswiththisnote, howmanynotesinthiscell, whereisthisnote } = gettingInfo.gettingDetailedInfoBlock ( row, row, 0, 8, "row" );
    //currentCandidateValue1 evaluates up to possibleCandidate 6 to let space to compare with possibleCandidates 7, 8 and 9
    for (let currentCandidateValue1 = 1; currentCandidateValue1<= 6; currentCandidateValue1++) {
      if (howmanycellswiththisnote[currentCandidateValue1] === 2 || howmanycellswiththisnote[currentCandidateValue1] === 3 || howmanycellswiththisnote[currentCandidateValue1] === 4) {
        for (let currentCandidateValue2 = currentCandidateValue1+1; currentCandidateValue2<= 7; currentCandidateValue2++) {
          if (howmanycellswiththisnote[currentCandidateValue2] === 2 || howmanycellswiththisnote[currentCandidateValue2] === 3 || howmanycellswiththisnote[currentCandidateValue2] === 4) {
            let candidate1notes = whereisthisnote[currentCandidateValue1];
            let candidate2notes = whereisthisnote[currentCandidateValue2];
            let candidate1ORcandidate2Notes = candidate1notes.map((cell, index) => cell || candidate2notes[index]);
            //method reduce to obtain the sum of the cells with these candidates.
            const sum1and2 = candidate1ORcandidate2Notes.reduce(add, 0);
              function add(accumulator, a) {
                return accumulator + a;
              };
            if (sum1and2 === 3 || sum1and2 === 4) {
              for (let currentCandidateValue3 = currentCandidateValue2+1; currentCandidateValue3<= 8; currentCandidateValue3++) {
                if (howmanycellswiththisnote[currentCandidateValue3] === 2 || howmanycellswiththisnote[currentCandidateValue3] === 3 || howmanycellswiththisnote[currentCandidateValue3] === 4) {
                  let candidate3notes = whereisthisnote[currentCandidateValue3];
                  let candidate1ORcandidate2ORcandidate3Notes = candidate3notes.map((cell, index) => cell || candidate1ORcandidate2Notes[index]);
                  //method reduce to obtain the sum of the candidates in this cell
                  const sum1and2and3 = candidate1ORcandidate2ORcandidate3Notes.reduce(add, 0);
                    function add(accumulator, a) {
                      return accumulator + a;
                    };
                  if (sum1and2and3 === 4) {
                    for (let currentCandidateValue4 = currentCandidateValue3+1; currentCandidateValue4<= 9; currentCandidateValue4++) {
                      globalVar.loopsExecuted++;
                      if (howmanycellswiththisnote[currentCandidateValue4] === 2 || howmanycellswiththisnote[currentCandidateValue4] === 3 || howmanycellswiththisnote[currentCandidateValue4] === 4) {
                        let candidate4notes = whereisthisnote[currentCandidateValue4];
                        let candidate1ORcandidate2ORcandidate3ORcandidate4Notes = candidate4notes.map((cell, index) => cell || candidate1ORcandidate2ORcandidate3Notes[index]);
                        //method reduce to obtain the sum of the candidates in this cell
                        const sum1and2and3and4 = candidate1ORcandidate2ORcandidate3ORcandidate4Notes.reduce(add, 0);
                          function add(accumulator, a) {
                            return accumulator + a;
                          };
                        if (sum1and2and3and4 === 4) {
                          let column1 = candidate1ORcandidate2ORcandidate3ORcandidate4Notes.indexOf(1);
                          let column2 = candidate1ORcandidate2ORcandidate3ORcandidate4Notes.indexOf(1, column1 + 1);
                          let column3 = candidate1ORcandidate2ORcandidate3ORcandidate4Notes.indexOf(1, column2 + 1);
                          let column4 = candidate1ORcandidate2ORcandidate3ORcandidate4Notes.indexOf(1, column3 + 1);
                          //This section evaluates if there are still the same candidates values in other cells within the same block
                          let howManyCell1 = candidate1notes[column1] + candidate2notes[column1] + candidate3notes[column1] + candidate4notes[column1];
                          let howManyCell2 = candidate1notes[column2] + candidate2notes[column2] + candidate3notes[column2] + candidate4notes[column2];
                          let howManyCell3 = candidate1notes[column3] + candidate2notes[column3] + candidate3notes[column3] + candidate4notes[column3];
                          let howManyCell4 = candidate1notes[column4] + candidate2notes[column4] + candidate3notes[column4] + candidate4notes[column4];
                          if (howManyCell1 < howmanynotesinthiscell[column1] || howManyCell2 < howmanynotesinthiscell[column2] || howManyCell3 < howmanynotesinthiscell[column3] || howManyCell4 < howmanynotesinthiscell[column4]) { 
                            solvingFunctions.discardHiddenSet(row, "row", "column", {cell1:{ row: row, column: column1 }, cell2:{ row: row, column: column2 }, cell3:{ row: row, column: column3 }, cell4:{ row: row, column: column4 } }, { candidate1: currentCandidateValue1, candidate2: currentCandidateValue2, candidate3: currentCandidateValue3, candidate4: currentCandidateValue4 }, "Detecting Hidden Quadruples (Row)", notesZero.noteZeroCellExcept, modifyDOM.discardHiddenQuadrupleHTML );
                            break;
                          };
                        };
                      };      
                    };
                    if (globalVar.discardNoteSuccess) break;
                  };
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

// Function to detect when a column has hidden Quadruples
const hiddenQuadruplesColumn = () => {
  for (let column = 0; column <= 8; column++) { 
    const { howmanycellswiththisnote, howmanynotesinthiscell, whereisthisnote } = gettingInfo.gettingDetailedInfoBlock ( 0, 8, column, column, "column" );
    //currentCandidateValue1 evaluates up to possibleCandidate 6 to let space to compare with possibleCandidates 7, 8 and 9
    for (let currentCandidateValue1 = 1; currentCandidateValue1<= 6; currentCandidateValue1++) {
      if (howmanycellswiththisnote[currentCandidateValue1] === 2 || howmanycellswiththisnote[currentCandidateValue1] === 3 || howmanycellswiththisnote[currentCandidateValue1] === 4) {
        for (let currentCandidateValue2 = currentCandidateValue1+1; currentCandidateValue2<= 7; currentCandidateValue2++) {
          if (howmanycellswiththisnote[currentCandidateValue2] === 2 || howmanycellswiththisnote[currentCandidateValue2] === 3 || howmanycellswiththisnote[currentCandidateValue2] === 4) {
            let candidate1notes = whereisthisnote[currentCandidateValue1];
            let candidate2notes = whereisthisnote[currentCandidateValue2];
            let candidate1ORcandidate2Notes = candidate1notes.map((cell, index) => cell || candidate2notes[index]);
            //method reduce to obtain the sum of the cells with these candidates.
            const sum1and2 = candidate1ORcandidate2Notes.reduce(add, 0);
              function add(accumulator, a) {
                return accumulator + a;
              };
            if (sum1and2 === 3 || sum1and2 === 4) {
              for (let currentCandidateValue3 = currentCandidateValue2+1; currentCandidateValue3<= 8; currentCandidateValue3++) {
                if (howmanycellswiththisnote[currentCandidateValue3] === 2 || howmanycellswiththisnote[currentCandidateValue3] === 3 || howmanycellswiththisnote[currentCandidateValue3] === 4) {
                  let candidate3notes = whereisthisnote[currentCandidateValue3];
                  let candidate1ORcandidate2ORcandidate3Notes = candidate3notes.map((cell, index) => cell || candidate1ORcandidate2Notes[index]);
                  //method reduce to obtain the sum of the candidates in this cell
                  const sum1and2and3 = candidate1ORcandidate2ORcandidate3Notes.reduce(add, 0);
                    function add(accumulator, a) {
                      return accumulator + a;
                    };
                  if (sum1and2and3 === 4) {
                    for (let currentCandidateValue4 = currentCandidateValue3+1; currentCandidateValue4<= 9; currentCandidateValue4++) {
                      globalVar.loopsExecuted++;
                      if (howmanycellswiththisnote[currentCandidateValue4] === 2 || howmanycellswiththisnote[currentCandidateValue4] === 3 || howmanycellswiththisnote[currentCandidateValue4] === 4) {
                        let candidate4notes = whereisthisnote[currentCandidateValue4];
                        let candidate1ORcandidate2ORcandidate3ORcandidate4Notes = candidate4notes.map((cell, index) => cell || candidate1ORcandidate2ORcandidate3Notes[index]);
                        //method reduce to obtain the sum of the candidates in this cell
                        const sum1and2and3and4 = candidate1ORcandidate2ORcandidate3ORcandidate4Notes.reduce(add, 0);
                          function add(accumulator, a) {
                            return accumulator + a;
                          };
                        if (sum1and2and3and4 === 4) {
                          let row1 = candidate1ORcandidate2ORcandidate3ORcandidate4Notes.indexOf(1);
                          let row2 = candidate1ORcandidate2ORcandidate3ORcandidate4Notes.indexOf(1, row1 + 1);
                          let row3 = candidate1ORcandidate2ORcandidate3ORcandidate4Notes.indexOf(1, row2 + 1);
                          let row4 = candidate1ORcandidate2ORcandidate3ORcandidate4Notes.indexOf(1, row3 + 1);
                          //This section evaluates if there are still the same candidates values in other cells within the same block
                          let howManyCell1 = candidate1notes[row1] + candidate2notes[row1] + candidate3notes[row1] + candidate4notes[row1];
                          let howManyCell2 = candidate1notes[row2] + candidate2notes[row2] + candidate3notes[row2] + candidate4notes[row2];
                          let howManyCell3 = candidate1notes[row3] + candidate2notes[row3] + candidate3notes[row3] + candidate4notes[row3];
                          let howManyCell4 = candidate1notes[row4] + candidate2notes[row4] + candidate3notes[row4] + candidate4notes[row4];
                          if (howManyCell1 < howmanynotesinthiscell[row1] || howManyCell2 < howmanynotesinthiscell[row2] || howManyCell3 < howmanynotesinthiscell[row3] || howManyCell4 < howmanynotesinthiscell[row4]) { 
                            solvingFunctions.discardHiddenSet(column, "column", "row", {cell1:{ column: column, row: row1 }, cell2:{ column: column, row: row2 }, cell3:{ column: column, row: row3 }, cell4:{ column: column, row: row4 } }, { candidate1: currentCandidateValue1, candidate2: currentCandidateValue2, candidate3: currentCandidateValue3, candidate4: currentCandidateValue4 }, "Detecting Hidden Quadruples (Column)", notesZero.noteZeroCellExcept, modifyDOM.discardHiddenQuadrupleHTML );
                            break;
                          };
                        };
                      };      
                    };
                    if (globalVar.discardNoteSuccess) break;
                  };
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

// Function to detect when an square has hidden Quadruples
const hiddenQuadruplesSquare = () => {
  for (let square = 1; square <= 9; square++) { 
    const {fromrow, maximumrow, fromcolumn, maximumcolumn} = coordinates.defineInitialMaxRCFromSquare(square);
    const { howmanycellswiththisnote, howmanynotesinthiscell, whereisthisnote } = gettingInfo.gettingDetailedInfoBlock ( fromrow, maximumrow, fromcolumn, maximumcolumn, "square", square );
     //currentCandidate evaluates up to currentCandidate6 to let space for other three cells to compare with currentCandidate7, currentCandidate8 and currentCandidate9
    for (let currentCandidateValue1 = 1; currentCandidateValue1<= 6; currentCandidateValue1++) {
      if (howmanycellswiththisnote[currentCandidateValue1] === 2 || howmanycellswiththisnote[currentCandidateValue1] === 3 || howmanycellswiththisnote[currentCandidateValue1] === 4) {
        for (let currentCandidateValue2 = currentCandidateValue1+1; currentCandidateValue2<= 7; currentCandidateValue2++) {
          if (howmanycellswiththisnote[currentCandidateValue2] === 2 || howmanycellswiththisnote[currentCandidateValue2] === 3 || howmanycellswiththisnote[currentCandidateValue2] === 4) {
            let candidate1notes = whereisthisnote[currentCandidateValue1];
            let candidate2notes = whereisthisnote[currentCandidateValue2];
            let candidate1ORcandidate2Notes = candidate1notes.map((cell, index) => cell || candidate2notes[index]);
            //method reduce to obtain the sum of the cells with these candidates.
            const sum1and2 = candidate1ORcandidate2Notes.reduce(add, 0);
              function add(accumulator, a) {
                return accumulator + a;
              };
            if (sum1and2 ===3 || sum1and2 === 4) {
              for (let currentCandidateValue3 = currentCandidateValue2+1; currentCandidateValue3<= 8; currentCandidateValue3++) {
                if (howmanycellswiththisnote[currentCandidateValue3] === 2 || howmanycellswiththisnote[currentCandidateValue3] === 3 || howmanycellswiththisnote[currentCandidateValue3] === 4) {
                  let candidate3notes = whereisthisnote[currentCandidateValue3];
                  let candidate1ORcandidate2ORcandidate3Notes = candidate3notes.map((cell, index) => cell || candidate1ORcandidate2Notes[index]);
                  //method reduce to obtain the sum of the candidates in this cell
                  const sum1and2and3 = candidate1ORcandidate2ORcandidate3Notes.reduce(add, 0);
                    function add(accumulator, a) {
                      return accumulator + a;
                    };
                  if (sum1and2and3 === 4) {
                    for (let currentCandidateValue4 = currentCandidateValue3+1; currentCandidateValue4<= 9; currentCandidateValue4++) {
                      globalVar.loopsExecuted++;
                      if (howmanycellswiththisnote[currentCandidateValue4] === 2 || howmanycellswiththisnote[currentCandidateValue4] === 3 || howmanycellswiththisnote[currentCandidateValue4] === 4) {
                        let candidate4notes = whereisthisnote[currentCandidateValue4];
                        let candidate1ORcandidate2ORcandidate3ORcandidate4Notes = candidate4notes.map((cell, index) => cell || candidate1ORcandidate2ORcandidate3Notes[index]);
                        //method reduce to obtain the sum of the candidates in this cell
                        const sum1and2and3and4 = candidate1ORcandidate2ORcandidate3ORcandidate4Notes.reduce(add, 0);
                          function add(accumulator, a) {
                            return accumulator + a;
                          };
                        if (sum1and2and3and4 === 4) {
                          let cell1 = candidate1ORcandidate2ORcandidate3ORcandidate4Notes.indexOf(1);
                          let cell2 = candidate1ORcandidate2ORcandidate3ORcandidate4Notes.indexOf(1, cell1 + 1);
                          let cell3 = candidate1ORcandidate2ORcandidate3ORcandidate4Notes.indexOf(1, cell2 + 1);
                          let cell4 = candidate1ORcandidate2ORcandidate3ORcandidate4Notes.indexOf(1, cell3 + 1);
                          //This section evaluates if there are still the same candidates values in other cells within the same block
                          let howManyCell1 = candidate1notes[cell1] + candidate2notes[cell1] + candidate3notes[cell1] + candidate4notes[cell1];
                          let howManyCell2 = candidate1notes[cell2] + candidate2notes[cell2] + candidate3notes[cell2] + candidate4notes[cell2];
                          let howManyCell3 = candidate1notes[cell3] + candidate2notes[cell3] + candidate3notes[cell3] + candidate4notes[cell3];
                          let howManyCell4 = candidate1notes[cell4] + candidate2notes[cell4] + candidate3notes[cell4] + candidate4notes[cell4];
                          if (howManyCell1 < howmanynotesinthiscell[cell1] || howManyCell2 < howmanynotesinthiscell[cell2] || howManyCell3 < howmanynotesinthiscell[cell3] || howManyCell4 < howmanynotesinthiscell[cell4]) { 
                            const { realRow:realRow1, realColumn:realColumn1 } = coordinates.defineRealRCFromSquareRelativeCell(square, cell1);
                            const { realRow:realRow2, realColumn:realColumn2 } = coordinates.defineRealRCFromSquareRelativeCell(square, cell2);
                            const { realRow:realRow3, realColumn:realColumn3 } = coordinates.defineRealRCFromSquareRelativeCell(square, cell3);
                            const { realRow:realRow4, realColumn:realColumn4 } = coordinates.defineRealRCFromSquareRelativeCell(square, cell4);
                            solvingFunctions.discardHiddenSet(square, "square", "cell", {cell1:{ row: realRow1, column: realColumn1, cell: cell1 }, cell2:{ row: realRow2, column: realColumn2, cell: cell2 }, cell3:{ row: realRow3, column: realColumn3, cell: cell3 }, cell4:{ row: realRow4, column: realColumn4, cell: cell4 } }, { candidate1: currentCandidateValue1, candidate2: currentCandidateValue2, candidate3: currentCandidateValue3, candidate4: currentCandidateValue4 }, "Detecting Hidden Quadruples (Square)", notesZero.noteZeroCellExcept, modifyDOM.discardHiddenQuadrupleHTML );
                            break;
                          };
                        };
                      };
                    };
                    if (globalVar.discardNoteSuccess) break;
                  };
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

export { hiddenQuadruplesRow, hiddenQuadruplesColumn, hiddenQuadruplesSquare };