'use strict';
import globalVar from "./globalVar.js";
import * as solvingFunctions from "./solvingProcessFunctions.js";
import * as notesZero from "./notesZero.js";
import * as gettingInfo from "./gettingInfoBlock.js";
import * as modifyDOM from "./modifyingDOMFunctions.js";
import * as coordinates from "./defineCoordinates.js";

////////////////////////////////////////////////////////////////////////////////
//                  DISCARDING TECHNIQUES - OBVIOUS QUADS                    //
//////////////////////////////////////////////////////////////////////////////

// Function to detect when a row has obvious Quads
const obviousQuadsRow = () => {
  for (let row = 0; row <= 8; row++) { 
    const { howmanynotesinthiscell, howmanycellswiththisnote, whereisthisnote } = gettingInfo.gettingDetailedInfoBlock ( row, row, 0, 8, "row" );
    //column1 evaluates up to column5 to let space for other three cells to compare with column6, column7 and column8
    for (let column1 = 0; column1<= 5; column1++) {
      if (howmanynotesinthiscell[column1] === 2 || howmanynotesinthiscell[column1] === 3 || howmanynotesinthiscell[column1] === 4) {
        for (let column2 = column1+1; column2<= 6; column2++) {
          if (howmanynotesinthiscell[column2] === 2 || howmanynotesinthiscell[column2] === 3 || howmanynotesinthiscell[column2] === 4) {
            let cell1notes = globalVar.theMatrix[globalVar.currentStep][row][column1];
            let cell2notes = globalVar.theMatrix[globalVar.currentStep][row][column2];
            let cell1ORcell2Notes = cell1notes.map((candidate, index) => candidate || cell2notes[index]);
            //method reduce to obtain the sum of the candidates in this cell
            const sum1and2 = cell1ORcell2Notes.reduce(add, 0);
              function add(accumulator, a) {
                return accumulator + a;
              };
            if (sum1and2 === 3 || sum1and2 === 4) {
              for (let column3 = column2+1; column3<= 7; column3++) {
                if (howmanynotesinthiscell[column3] === 2 || howmanynotesinthiscell[column3] === 3 || howmanynotesinthiscell[column3] === 4) {
                  let cell3notes = globalVar.theMatrix[globalVar.currentStep][row][column3];
                  let cell1ORcell2ORcell3Notes = cell3notes.map((candidate, index) => candidate || cell1ORcell2Notes[index]);
                  //method reduce to obtain the sum of the candidates in this cell
                  const sum1and2and3 = cell1ORcell2ORcell3Notes.reduce(add, 0);
                    function add(accumulator, a) {
                      return accumulator + a;
                    };
                  if (sum1and2and3 === 4) {
                    for (let column4 = column3+1; column3<= 8; column3++) {
                      globalVar.loopsExecuted++;
                      if (howmanynotesinthiscell[column4] === 2 || howmanynotesinthiscell[column4] === 3 || howmanynotesinthiscell[column4] === 4) {
                        let cell4notes = globalVar.theMatrix[globalVar.currentStep][row][column4];
                        let cell1ORcell2ORcell3ORcell4Notes = cell4notes.map((candidate, index) => candidate || cell1ORcell2ORcell3Notes[index]);
                        //method reduce to obtain the sum of the candidates in this cell
                        const sum1and2and3and4 = cell1ORcell2ORcell3ORcell4Notes.reduce(add, 0);
                          function add(accumulator, a) {
                            return accumulator + a;
                          };
                        if (sum1and2and3and4 === 4) {
                          let currentCandidateValue1 = cell1ORcell2ORcell3ORcell4Notes.indexOf(1);
                          let currentCandidateValue2 = cell1ORcell2ORcell3ORcell4Notes.indexOf(1, currentCandidateValue1 + 1);
                          let currentCandidateValue3 = cell1ORcell2ORcell3ORcell4Notes.indexOf(1, currentCandidateValue2 + 1);
                          let currentCandidateValue4 = cell1ORcell2ORcell3ORcell4Notes.indexOf(1, currentCandidateValue3 + 1);
                          //This section evaluates if there are still the same candidates values in other cells within the same block
                          let howManyCandidate1 = cell1notes[currentCandidateValue1] + cell2notes[currentCandidateValue1] + cell3notes[currentCandidateValue1] + cell4notes[currentCandidateValue1];
                          let howManyCandidate2 = cell1notes[currentCandidateValue2] + cell2notes[currentCandidateValue2] + cell3notes[currentCandidateValue2] + cell4notes[currentCandidateValue2];
                          let howManyCandidate3 = cell1notes[currentCandidateValue3] + cell2notes[currentCandidateValue3] + cell3notes[currentCandidateValue3] + cell4notes[currentCandidateValue3];
                          let howManyCandidate4 = cell1notes[currentCandidateValue4] + cell2notes[currentCandidateValue4] + cell3notes[currentCandidateValue4] + cell4notes[currentCandidateValue4];
                          if (howManyCandidate1 < howmanycellswiththisnote[currentCandidateValue1] || howManyCandidate2 < howmanycellswiththisnote[currentCandidateValue2] || howManyCandidate3 < howmanycellswiththisnote[currentCandidateValue3] || howManyCandidate4 < howmanycellswiththisnote[currentCandidateValue4]) { 
                            solvingFunctions.discardObviousSet(row, "row", "column", {cell1:{ row: row, column: column1 }, cell2:{ row: row, column: column2 }, cell3:{ row: row, column: column3 }, cell4:{ row: row, column: column4 } }, { candidate1: currentCandidateValue1, candidate2: currentCandidateValue2, candidate3: currentCandidateValue3, candidate4: currentCandidateValue4 }, "Detecting Obvious Quadruple (Row)", whereisthisnote, notesZero.noteZeroRow, modifyDOM.discardObviousQuadHTML );
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

// Function to detect when a column has obvious Quads
const obviousQuadsColumn = () => {
  for (let column = 0; column <= 8; column++) { 
    const { howmanynotesinthiscell, howmanycellswiththisnote, whereisthisnote } = gettingInfo.gettingDetailedInfoBlock ( 0, 8, column, column, "column" );
    //row1 evaluates up to row5 to let space for other three cells to compare with row6, row7 and row8
    for (let row1 = 0; row1<= 5; row1++) {
      if (howmanynotesinthiscell[row1] === 2 || howmanynotesinthiscell[row1] === 3 || howmanynotesinthiscell[row1] === 4) {
        for (let row2 = row1+1; row2<= 6; row2++) {
          if (howmanynotesinthiscell[row2] === 2 || howmanynotesinthiscell[row2] === 3 || howmanynotesinthiscell[row2] === 4) {
            let cell1notes = globalVar.theMatrix[globalVar.currentStep][row1][column];
            let cell2notes = globalVar.theMatrix[globalVar.currentStep][row2][column];
            let cell1ORcell2Notes = cell1notes.map((candidate, index) => candidate || cell2notes[index]);
            //method reduce to obtain the sum of the candidates in this cell
            const sum1and2 = cell1ORcell2Notes.reduce(add, 0);
              function add(accumulator, a) {
                return accumulator + a;
              };
            if (sum1and2 ===3 || sum1and2 === 4) {
              for (let row3 = row2+1; row3<= 7; row3++) {
                if (howmanynotesinthiscell[row3] === 2 || howmanynotesinthiscell[row3] === 3 || howmanynotesinthiscell[row3] === 4) {
                  let cell3notes = globalVar.theMatrix[globalVar.currentStep][row3][column];
                  let cell1ORcell2ORcell3Notes = cell3notes.map((candidate, index) => candidate || cell1ORcell2Notes[index]);
                  //method reduce to obtain the sum of the candidates in this cell
                  const sum1and2and3 = cell1ORcell2ORcell3Notes.reduce(add, 0);
                    function add(accumulator, a) {
                      return accumulator + a;
                    };
                  if (sum1and2and3 === 4) {
                    for (let row4 = row3+1; row4<= 8; row4++) {
                      globalVar.loopsExecuted++;
                      if (howmanynotesinthiscell[row4] === 2 || howmanynotesinthiscell[row4] === 3 || howmanynotesinthiscell[row4] === 4) {
                        let cell4notes = globalVar.theMatrix[globalVar.currentStep][row4][column];
                        let cell1ORcell2ORcell3ORcell4Notes = cell4notes.map((candidate, index) => candidate || cell1ORcell2ORcell3Notes[index]);
                        //method reduce to obtain the sum of the candidates in this cell
                        const sum1and2and3and4 = cell1ORcell2ORcell3ORcell4Notes.reduce(add, 0);
                          function add(accumulator, a) {
                            return accumulator + a;
                          };
                        if (sum1and2and3and4 === 4) {
                          let currentCandidateValue1 = cell1ORcell2ORcell3ORcell4Notes.indexOf(1);
                          let currentCandidateValue2 = cell1ORcell2ORcell3ORcell4Notes.indexOf(1, currentCandidateValue1 + 1);
                          let currentCandidateValue3 = cell1ORcell2ORcell3ORcell4Notes.indexOf(1, currentCandidateValue2 + 1);
                          let currentCandidateValue4 = cell1ORcell2ORcell3ORcell4Notes.indexOf(1, currentCandidateValue3 + 1);
                          //This section evaluates if there are still the same candidates values in other cells within the same block
                          let howManyCandidate1 = cell1notes[currentCandidateValue1] + cell2notes[currentCandidateValue1] + cell3notes[currentCandidateValue1] + cell4notes[currentCandidateValue1];
                          let howManyCandidate2 = cell1notes[currentCandidateValue2] + cell2notes[currentCandidateValue2] + cell3notes[currentCandidateValue2] + cell4notes[currentCandidateValue2];
                          let howManyCandidate3 = cell1notes[currentCandidateValue3] + cell2notes[currentCandidateValue3] + cell3notes[currentCandidateValue3] + cell4notes[currentCandidateValue3];
                          let howManyCandidate4 = cell1notes[currentCandidateValue4] + cell2notes[currentCandidateValue4] + cell3notes[currentCandidateValue4] + cell4notes[currentCandidateValue4];
                          if (howManyCandidate1 < howmanycellswiththisnote[currentCandidateValue1] || howManyCandidate2 < howmanycellswiththisnote[currentCandidateValue2] || howManyCandidate3 < howmanycellswiththisnote[currentCandidateValue3] || howManyCandidate4 < howmanycellswiththisnote[currentCandidateValue4]) { 
                            solvingFunctions.discardObviousSet(column, "column", "row", {cell1:{ row: row1, column: column }, cell2:{ row: row2, column: column }, cell3:{ row: row3, column: column }, cell4:{ row: row4, column: column } }, { candidate1: currentCandidateValue1, candidate2: currentCandidateValue2, candidate3: currentCandidateValue3, candidate4: currentCandidateValue4 }, "Detecting Obvious Quadruple (Column)", whereisthisnote, notesZero.noteZeroColumn, modifyDOM.discardObviousQuadHTML );
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

// Function to detect when a column has obvious Triples
const obviousQuadsSquare = () => {
  for (let square = 1; square <= 9; square++) { 
    const {fromrow, maximumrow, fromcolumn, maximumcolumn} = coordinates.defineInitialMaxRCFromSquare(square);
    const { howmanynotesinthiscell, howmanycellswiththisnote, whereisthisnote } = gettingInfo.gettingDetailedInfoBlock ( fromrow, maximumrow, fromcolumn, maximumcolumn, "square", square );
    //cell1 evaluates up to cell5 to let space for other two cells to compare with cell6, cell7 and cell8
    for (let cell1 = 0; cell1<= 5; cell1++) {
      if (howmanynotesinthiscell[cell1] === 2 || howmanynotesinthiscell[cell1] === 3 || howmanynotesinthiscell[cell1] === 4) {
        for (let cell2 = cell1+1; cell2<= 6; cell2++) {
          if (howmanynotesinthiscell[cell2] === 2 || howmanynotesinthiscell[cell2] === 3 || howmanynotesinthiscell[cell2] === 4) {
            const { realRow:realrow1, realColumn:realcolumn1 } = coordinates.defineRealRCFromSquareRelativeCell(square, cell1);
            const { realRow:realrow2, realColumn:realcolumn2 } = coordinates.defineRealRCFromSquareRelativeCell(square, cell2);
            let cell1notes = globalVar.theMatrix[globalVar.currentStep][realrow1][realcolumn1];
            let cell2notes = globalVar.theMatrix[globalVar.currentStep][realrow2][realcolumn2];
            let cell1ORcell2Notes = cell1notes.map((candidate, index) => candidate || cell2notes[index]);
            //method reduce to obtain the sum of the candidates in this cell
            const sum1and2 = cell1ORcell2Notes.reduce(add, 0);
              function add(accumulator, a) {
                return accumulator + a;
              };
            if (sum1and2 === 3 || sum1and2 === 4) {
              for (let cell3 = cell2+1; cell3<= 7; cell3++) {
                if (howmanynotesinthiscell[cell3] === 2 || howmanynotesinthiscell[cell3] === 3 || howmanynotesinthiscell[cell3] === 4) {
                  const { realRow:realrow3, realColumn:realcolumn3 } = coordinates.defineRealRCFromSquareRelativeCell(square, cell3);
                  let cell3notes = globalVar.theMatrix[globalVar.currentStep][realrow3][realcolumn3];
                  let cell1ORcell2ORcell3Notes = cell3notes.map((candidate, index) => candidate || cell1ORcell2Notes[index]);
                  //method reduce to obtain the sum of the candidates in this cell
                  const sum1and2and3 = cell1ORcell2ORcell3Notes.reduce(add, 0);
                    function add(accumulator, a) {
                      return accumulator + a;
                    };
                  if (sum1and2and3 === 4) {
                    for (let cell4 = cell3+1; cell4<= 8; cell4++) {
                      globalVar.loopsExecuted++;
                      if (howmanynotesinthiscell[cell4] === 2 || howmanynotesinthiscell[cell4] === 3 || howmanynotesinthiscell[cell4] === 4) {
                        const { realRow:realrow4, realColumn:realcolumn4 } = coordinates.defineRealRCFromSquareRelativeCell(square, cell4);
                        let cell4notes = globalVar.theMatrix[globalVar.currentStep][realrow4][realcolumn4];
                        let cell1ORcell2ORcell3ORcell4Notes = cell4notes.map((candidate, index) => candidate || cell1ORcell2ORcell3Notes[index]);
                        //method reduce to obtain the sum of the candidates in this cell
                        const sum1and2and3and4 = cell1ORcell2ORcell3ORcell4Notes.reduce(add, 0);
                          function add(accumulator, a) {
                            return accumulator + a;
                          };
                          if (sum1and2and3and4 === 4) {
                            let currentCandidateValue1 = cell1ORcell2ORcell3ORcell4Notes.indexOf(1);
                            let currentCandidateValue2 = cell1ORcell2ORcell3ORcell4Notes.indexOf(1, currentCandidateValue1 + 1);
                            let currentCandidateValue3 = cell1ORcell2ORcell3ORcell4Notes.indexOf(1, currentCandidateValue2 + 1);
                            let currentCandidateValue4 = cell1ORcell2ORcell3ORcell4Notes.indexOf(1, currentCandidateValue3 + 1);
                            //This section evaluates if there are still the same candidates values in other cells within the same block
                            let howManyCandidate1 = cell1notes[currentCandidateValue1] + cell2notes[currentCandidateValue1] + cell3notes[currentCandidateValue1] + cell4notes[currentCandidateValue1];
                            let howManyCandidate2 = cell1notes[currentCandidateValue2] + cell2notes[currentCandidateValue2] + cell3notes[currentCandidateValue2] + cell4notes[currentCandidateValue2];
                            let howManyCandidate3 = cell1notes[currentCandidateValue3] + cell2notes[currentCandidateValue3] + cell3notes[currentCandidateValue3] + cell4notes[currentCandidateValue3];
                            let howManyCandidate4 = cell1notes[currentCandidateValue4] + cell2notes[currentCandidateValue4] + cell3notes[currentCandidateValue4] + cell4notes[currentCandidateValue4];
                            if (howManyCandidate1 < howmanycellswiththisnote[currentCandidateValue1] || howManyCandidate2 < howmanycellswiththisnote[currentCandidateValue2] || howManyCandidate3 < howmanycellswiththisnote[currentCandidateValue3] || howManyCandidate4 < howmanycellswiththisnote[currentCandidateValue4]) { 
                              solvingFunctions.discardObviousSet(square, "square", "cell", {cell1:{ row: realrow1, column: realcolumn1, cell: cell1 }, cell2:{ row: realrow2, column: realcolumn2, cell: cell2 }, cell3:{ row: realrow3, column: realcolumn3, cell: cell3 }, cell4:{ row: realrow4, column: realcolumn4, cell: cell4 } }, { candidate1: currentCandidateValue1, candidate2: currentCandidateValue2, candidate3: currentCandidateValue3, candidate4: currentCandidateValue4 }, "Detecting Obvious Quadruple (Square)", whereisthisnote, notesZero.noteZeroSquareSQ, modifyDOM.discardObviousQuadHTML );
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

export {obviousQuadsRow, obviousQuadsColumn, obviousQuadsSquare };