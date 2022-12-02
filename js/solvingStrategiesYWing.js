'use strict';
import globalVar from "./globalVar.js";
import * as solvingFunctions from "./solvingProcessFunctions.js"
import * as notesZero from "./notesZero.js";
import * as gettingInfo from "./gettingInfoBlock.js";
import * as coordinates from "./defineCoordinates.js";


////////////////////////////////////////////////////////////////////////////////
//                     DISCARDING TECHNIQUES - Y-WING                        //
//////////////////////////////////////////////////////////////////////////////

// Function to detect when a puzzle has Y-Wing candidate
// The Y-Wing combination can be detected combining two types of blocks from the three (row, column and square)
// The process is defined to find a possible Pivot first, then evaluate if a first Pincer is found in the same row.
const yWing = () => {
  //Process to detect a possible pivot cell (Cell with 2 candidates)
  for (let rowPivot = 0; rowPivot <= 8; rowPivot++) { 
    const { howmanynotesinthiscell:howmanynotesinthiscellR1 } = 
      gettingInfo.gettingDetailedInfoBlock ( rowPivot, rowPivot, 0, 8, "row" );
    for (let colPivot = 0; colPivot <= 8; colPivot++) {
      if (howmanynotesinthiscellR1[colPivot] === 2) {
        let pivotCellCandidate1 = globalVar.theMatrix[globalVar.currentStep][rowPivot][colPivot].indexOf(1);
        let pivotCellCandidate2 = globalVar.theMatrix[globalVar.currentStep][rowPivot][colPivot].indexOf(1,pivotCellCandidate1 + 1);
        //It got a possible pivot, let's evaluate cells in the same row for the first pincer
        for (let colPincer1 = colPivot + 1; colPincer1 <= 8; colPincer1++) {
          if (howmanynotesinthiscellR1[colPincer1] === 2) {
            const {pincer1Candidate1, pincer1Candidate2, doWeHaveFirstPincer, pincerX, pincerY, pincerZ} = detectPincer1 (rowPivot, colPincer1, pivotCellCandidate1, pivotCellCandidate2);
            if (doWeHaveFirstPincer) { //If the process found a First pincer in the same Row
              let cellToLookFor = [0,0,0,0,0,0,0,0,0,0];
              cellToLookFor[pincerY] = 1;
              cellToLookFor[pincerZ] = 1;
              //Look for the second Pincer in the same column as columnindex1 where it is located the pivot
              for (let rowPincer2 = 0; rowPincer2 <= 8; rowPincer2++) {
                //.every method evaluates if the target array and the cellToLookFor are identical
                if (cellToLookFor.every((val, index) => val === globalVar.theMatrix[globalVar.currentStep][rowPincer2][colPivot][index])) {
                  //Here the second pincer have been found, now it needs to verify that the cells seen by bot pincers contain the pincerz value. In this case just 1 cell defined by rowPincer2 and colPincer1
                  let buddycell = globalVar.theMatrix[globalVar.currentStep][rowPincer2][colPincer1];
                  if (buddycell[pincerZ] === 1) {
                    // console.log(`Y-Wing Found with Pivot cell in Row ${rowPivot + 1}, Column ${colPivot + 1} with candidates ${pincerX} and ${pincerY}.`);
                    // console.log(`First Pincer (Same Row) in Row ${rowPivot + 1}, Column ${colPincer1 + 1}, Second Pincer (Same Column) in Row ${rowPincer2 + 1}, Column ${colPivot + 1}`);
                    // console.log(`the buddy cell located in Row ${rowPincer2 + 1}, Column ${colPincer1 + 1} contains a Z value ${pincerZ} that will be deleted`);
                    solvingFunctions.discardYWing([rowPivot, colPivot], [rowPivot, colPincer1], "row", [rowPincer2, colPivot], "column", pincerX, pincerY, pincerZ, "Y-Wing Value with Pincer Cells in Row and Column", notesZero.noteZeroCell, [[rowPincer2, colPincer1]] );
                    break;
                  };
                };
              };
              if (globalVar.discardNoteSuccess) break;
            };
          };
        };
        if (globalVar.discardNoteSuccess) {
          break
        } else {
        // It did not find a Y-Wing trying Combination ROW-COLUMN, this process will try to find a first Pincer in the same square to later find a second pincer in row or column.
        // The process is still working with the same possible Pivot cell
        // First, let's determine the square to analyze
        let square = coordinates.defineSquareFromRC(rowPivot, colPivot);
        const {fromrow, maximumrow, fromcolumn, maximumcolumn} = coordinates.defineInitialMaxRCFromSquare(square);
        const { howmanynotesinthiscell:howmanynotesinthiscellS1 } = 
          gettingInfo.gettingDetailedInfoBlock ( fromrow, maximumrow, fromcolumn, maximumcolumn, "square", square );
          for (let cell = 0; cell <= 8; cell++) {
            if (howmanynotesinthiscellS1[cell] === 2) {
              const {realRow:rowPincer1, realColumn:colPincer1} = coordinates.defineRealRCFromSquareRelativeCell (square, cell);
              const {pincer1Candidate1, pincer1Candidate2, doWeHaveFirstPincer, pincerX, pincerY, pincerZ} = detectPincer1 (rowPincer1, colPincer1, pivotCellCandidate1, pivotCellCandidate2);
              if (doWeHaveFirstPincer && colPincer1 !== colPivot && rowPincer1 !== rowPivot) { //If the process found a First pincer in the same Square. The second and third conditions evaluates it is not located in the same row or column to avoid the 3 cells within the same square, if it finds another pincer in the same column or row, they will be in line and possibly in the same square, and the case to evaluate row-column match should have been already covered by the first scenario row-column above. 
                let cellToLookFor = [0,0,0,0,0,0,0,0,0,0];
                cellToLookFor[pincerY] = 1;
                cellToLookFor[pincerZ] = 1;
                //Look for the second Pincer in the same column as colPivot where it is located the pivot
                for (let rowPincer2 = 0; rowPincer2 <= 8; rowPincer2++) {
                  //.every method evaluates if the target array and the cellToLookFor are identical
                  if (cellToLookFor.every((val, index) => val === globalVar.theMatrix[globalVar.currentStep][rowPincer2][colPivot][index])) {
                    //Here the second pincer have been found, let's confirm it is not located in the same square as Pivot and Pincer1
                      let squarePincer2 = coordinates.defineSquareFromRC(rowPincer2, colPivot);
                      if (square !== squarePincer2) {  
                      //Now it needs to verify that the cells seen by bot pincers contain the pincerZ value.
                      //We need to evaluate 5 possible cells seen by both pincers base on diagram below.
                      //  ----------------
                      //  |    |    | Z  |
                      //  ----------------
                      //  | YZ |    | Z  |  rowPincer2
                      //  ----------------
                      //  |    |    | Z  |
                      //  ================
                      //  ----------------
                      //  | Z  |    |    |
                      //  ----------------
                      //  | XY |    |    |  rowPivot
                      //  ----------------
                      //  | Z  |    | XZ |  rowPincer1
                      //  ----------------
                      // colPivot  colPincer1                  
                      const { fromrow:fromRowPivotSquare, maximumrow:maximumRowPivotSquare } = coordinates.defineInitialMaxRCFromRC(rowPivot, colPivot);
                      const { fromrow:fromRowPincer2Square, maximumrow:maximumRowPincer2Square } = coordinates.defineInitialMaxRCFromRC(rowPincer2, colPincer1);       
                      let positiveforZvalue = [];
                      for (let row = fromRowPivotSquare; row<=maximumRowPivotSquare; row++) {
                        if (globalVar.theMatrix[globalVar.currentStep][row][colPivot][pincerZ] !==0) { //The second argument (&& row !== rowPincer1) of the If statement (has been deleted for evaluation) is to avoid issues in case the first pincer found (same square) also is in the same column. This case should also be already discarded before by Obvious Triples. It has been deleted
                          positiveforZvalue.push([row, colPivot]);
                        };
                      };
                      for (let row = fromRowPincer2Square; row<=maximumRowPincer2Square; row++) {
                        if (globalVar.theMatrix[globalVar.currentStep][row][colPincer1][pincerZ] !==0) { //The second argument (&& row !== rowPincer2) of the If statement is to avoid issues in case the first pincer found (same square) also is in the same column. This case should also be already discarded before by Obvious Triples. It has been deleted
                          positiveforZvalue.push([row, colPincer1]);
                        };
                      };
                      if (positiveforZvalue.length !== 0) {
                        // console.log(`Y-Wing Found with Pivot cell in Row ${rowPivot + 1}, Column ${colPivot + 1} with candidates ${pincerX} and ${pincerY}.`);
                        // console.log(`First Pincer (Same Square) in Row ${rowPincer1 + 1}, Column ${colPincer1 + 1}, Second Pincer (Same Column) in Row ${rowPincer2 + 1}, Column ${colPivot + 1}`);
                        // console.log(`All those cells seen by both pincer cells that contains a Z value ${pincerZ} have been be deleted`);                  
                        solvingFunctions.discardYWing([rowPivot, colPivot], [rowPincer1, colPincer1], "square", [rowPincer2, colPivot], "column", pincerX, pincerY, pincerZ, "Y-Wing Value with Pincer Cells in Square and Column", notesZero.noteZeroCell, positiveforZvalue );
                        break;
                      };
                    };
                  };
                };
                if (globalVar.discardNoteSuccess) {
                  break;
                } else {
                  //Look for the second Pincer in the same row as rowPivot where it is located the pivot
                  for (let colPincer2 = 0; colPincer2 <= 8; colPincer2++) {
                    //.every method evaluates if the target array and the cellToLookFor are identical
                    if (cellToLookFor.every((val, index) => val === globalVar.theMatrix[globalVar.currentStep][rowPivot][colPincer2][index])) {
                      //Here the second pincer have been found, let's confirm it is not located in the same square as Pivot and Pincer1
                      let squarePincer2 = coordinates.defineSquareFromRC(rowPivot, colPincer2);
                      if (square !== squarePincer2) {  
                        //Now it needs to verify that the cells seen by bot pincers contain the pincerZ value.
                        //We need to evaluate 5 possible cells seen by both pincers base on diagram below.
                        //      colPivot
                        //  --------------------------------
                        //  | Z  | XY | Z  ||    | YZ |    |   rowPivot
                        //  --------------------------------
                        //  |    |    |    ||    |    |    |  
                        //  --------------------------------
                        //  | XZ |    |    || Z  | Z  | Z  |   rowPincer1
                        //  --------------------------------
                        //colPincer1           colPincer2
                        const { fromcolumn:fromColumnPivotSquare, maximumcolumn:maximumColumnPivotSquare} = coordinates.defineInitialMaxRCFromRC(rowPivot, colPivot);
                        const { fromcolumn:fromColumnPincer2Square, maximumcolumn:maximumColumnPincer2Square} = coordinates.defineInitialMaxRCFromRC(rowPincer1, colPincer2);
                        let positiveforZvalue = [];
                        for (let column = fromColumnPivotSquare; column<=maximumColumnPivotSquare; column++) {
                          if (globalVar.theMatrix[globalVar.currentStep][rowPivot][column][pincerZ] !==0) { //The second argument (&& column !==colPincer1) of the If statement is to avoid issues in case the first pincer found (same square) also is in the same row. This case should also be already discarded before by Obvious Triples. It has been deleted
                            positiveforZvalue.push([rowPivot, column]);
                          };
                        };
                        for (let column = fromColumnPincer2Square; column<=maximumColumnPincer2Square; column++) {
                          if (globalVar.theMatrix[globalVar.currentStep][rowPincer1][column][pincerZ] !==0) { //The second argument (&& column !== colPincer2) of the If statement is to avoid issues in case the first pincer found (same square) also is in the same row. This case should also be already discarded before by Obvious Triples. It has been deleted
                            positiveforZvalue.push([rowPincer1, column]);
                          };
                        };
                        if (positiveforZvalue.length !== 0) {
                          // console.log(`Y-Wing Found with Pivot cell in Row ${rowPivot + 1}, Column ${colPivot + 1} with candidates ${pincerX} and ${pincerY}.`);
                          // console.log(`First Pincer (Same Square) in Row ${rowPincer1 + 1}, Column ${colPincer1 + 1}, Second Pincer (Same Row) in Row ${rowPivot + 1}, Column ${colPincer2 + 1}`);
                          // console.log(`All those cells seen by both pincer cells that contains a Z value ${pincerZ} have been be deleted`);                  
                          solvingFunctions.discardYWing([rowPivot, colPivot], [rowPincer1, colPincer1], "square", [rowPivot, colPincer2], "row", pincerX, pincerY, pincerZ, "Y-Wing Value with Pincer Cells in Square and Row", notesZero.noteZeroCell, positiveforZvalue );
                          break;
                        };
                      };
                    };
                  };
                  if (globalVar.discardNoteSuccess) break;
                };
              };
            };
          };
          if (globalVar.discardNoteSuccess) break;
        }
      };
    };
    if (globalVar.discardNoteSuccess) break;
  };
};

//This process is to detect if 1 of the candidates is shared by the two cells
const detectPincer1 = (rowPivot, colPincer1, pivotCellCandidate1, pivotCellCandidate2) => {
  let pincer1Candidate1 = globalVar.theMatrix[globalVar.currentStep][rowPivot][colPincer1].indexOf(1);
  let pincer1Candidate2 = globalVar.theMatrix[globalVar.currentStep][rowPivot][colPincer1].indexOf(1,pincer1Candidate1 + 1);
  let doWeHaveFirstPincer = false;
  let pincerX;
  let pincerY;
  let pincerZ;
  if ((pivotCellCandidate1 === pincer1Candidate1) && (pivotCellCandidate2 !== pincer1Candidate2)) {
    pincerX = pivotCellCandidate1;
    pincerY = pivotCellCandidate2;
    pincerZ = pincer1Candidate2;
    doWeHaveFirstPincer = true;
  };
  if ((pivotCellCandidate1 !== pincer1Candidate1) && (pivotCellCandidate2 === pincer1Candidate2)) {
    pincerX = pivotCellCandidate2;
    pincerY = pivotCellCandidate1;
    pincerZ = pincer1Candidate1;
    doWeHaveFirstPincer = true;
  };
  if ((pivotCellCandidate1 === pincer1Candidate2)) {
    pincerX = pivotCellCandidate1;
    pincerY = pivotCellCandidate2;
    pincerZ = pincer1Candidate1;
    doWeHaveFirstPincer = true;
  }
  if ((pivotCellCandidate2 === pincer1Candidate1)) {
    pincerX = pivotCellCandidate2;
    pincerY = pivotCellCandidate1;
    pincerZ = pincer1Candidate2;
    doWeHaveFirstPincer = true;
  };
  return {pincer1Candidate1, pincer1Candidate2, doWeHaveFirstPincer, pincerX, pincerY, pincerZ};
}
export { yWing };