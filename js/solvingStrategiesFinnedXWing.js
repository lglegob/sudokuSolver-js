'use strict';
import globalVar from "./globalVar.js";
import * as solvingFunctions from "./solvingProcessFunctions.js"
import * as notesZero from "./notesZero.js";
import * as gettingInfo from "./gettingInfoBlock.js";
import * as coordinates from "./defineCoordinates.js";


////////////////////////////////////////////////////////////////////////////////
//                 DISCARDING TECHNIQUES - FINNED X-WING                     //
//////////////////////////////////////////////////////////////////////////////

// Function to detect when a row has Finned X-Wing candidate
const finnedXwingRow = () => {
  //row1 evaluates up to row8 searching for the first pattern (two cells with a candidate)
  for (let row1 = 0; row1 <= 8; row1++) { 
    const { howmanycellswiththisnote:howmanycellswiththisnoteR1, whereisthisnote:whereisthisnoteR1 } = 
      gettingInfo.gettingDetailedInfoBlock ( row1, row1, 0, 8, "row" );
    //Loop to define if there are rows with a candidate in two cells.
    for (let possibleCandidate = 1; possibleCandidate<= 9; possibleCandidate++) {
      if (howmanycellswiththisnoteR1[possibleCandidate] === 2) {
        //In this case row2 do evaluate from row 0 to row 8, avoiding only the row1, searching for the second pattern (row with fin)
        for (let row2 = 0; row2<= 8; row2++) {
          if (row2 !== row1) {
            globalVar.loopsExecuted++;
            const { howmanycellswiththisnote:howmanycellswiththisnoteR2, whereisthisnote:whereisthisnoteR2 } = 
            gettingInfo.gettingDetailedInfoBlock ( row2, row2, 0, 8, "row" );
            //Here it detects the couple of needed candidates for X-wing and also one or two additional candidates for the fin
            if (howmanycellswiththisnoteR2[possibleCandidate] === 3 || howmanycellswiththisnoteR2[possibleCandidate] === 4) {
              let candidate1notes = whereisthisnoteR1[possibleCandidate];
              let candidate2notes = whereisthisnoteR2[possibleCandidate];
              let column1 = candidate1notes.indexOf(1);
              let column2 = candidate1notes.indexOf(1, column1 + 1);
              let squareR1C1 = coordinates.defineSquareFromRC(row1, column1);
              let squareR1C2 = coordinates.defineSquareFromRC(row1, column2);
              let squareR2C1 = coordinates.defineSquareFromRC(row2, column1);
              let squareR2C2 = coordinates.defineSquareFromRC(row2, column2);
              //This if makes sure the row2 has the candidate as well in both columns and the squares forming the x-wing are in different squares froming the rectangle
              if (candidate2notes[column1] === 1 && candidate2notes[column2] === 1 && squareR1C1 !== squareR1C2 && squareR1C1 !== squareR2C1 ) {
                let firstThird = candidate2notes[0] + candidate2notes[1] + candidate2notes[2];
                let secondThird = candidate2notes[3] + candidate2notes[4] + candidate2notes[5];
                let finalThird = candidate2notes[6] + candidate2notes[7] + candidate2notes[8];
                //This if check than one of the 3 thirds is empty (No candidate), and other has just 1 candidate (one of the x-wing corners), the third one must then have 2 or 3 candidates forming the fin
                if ((firstThird === 0 || secondThird === 0 || finalThird === 0) && (firstThird === 1 || secondThird === 1 || finalThird === 1)) {
                  let fromColumn;
                  let maximumColumn;
                  let howManyFins;
                  let columnFin1;
                  let columnFin2;
                  let cellsFin = [];
                  let cornerFin;
                  let oppositeCornerFin;
                  let howManyDeletions = 0;
                  let whereAretheDeletions = [];
                  let possibleDeletionCells = [];
                  let squaresRectangle;
                  //check which third has the fin
                  switch (true) {
                    case firstThird > 1:
                      fromColumn = 0
                      maximumColumn = 2
                      howManyFins = firstThird - 1
                      break;
                    case secondThird > 1:
                      fromColumn = 3
                      maximumColumn = 5
                      howManyFins = secondThird - 1
                      break;
                    case finalThird > 1:
                      fromColumn = 6
                      maximumColumn = 8
                      howManyFins = finalThird - 1
                      break;
                  };
                  //define which columns have the fin
                  for (columnFin1 = fromColumn; columnFin1 <= maximumColumn; columnFin1++) {
                    if (candidate2notes[columnFin1] === 1 && columnFin1 !== column1 && columnFin1 !== column2) { 
                      cellsFin.push( {row: row2, column: columnFin1});
                      break; 
                    };
                  };
                  if ( howManyFins === 2 ) {
                    for (columnFin2 = columnFin1 + 1; columnFin2 <= maximumColumn; columnFin2++) {
                      if (candidate2notes[columnFin2] === 1 && columnFin2 !== column1 && columnFin2 !== column2) { 
                        cellsFin.push( {row: row2, column: columnFin2} );
                        break; 
                      };
                    };
                  };
                  let squareFin = coordinates.defineSquareFromRC(row2, columnFin1);
                  if (squareFin === squareR2C1) { //If true, corner for the Xwing is column1, if false, the corner is column2
                    cornerFin = { row: row2, column: column1};
                    oppositeCornerFin = { row: row1, column: column2};
                    squaresRectangle = { squareFin: squareR2C1, squareOppositeFin: squareR1C2};
                  } else {
                    cornerFin = { row: row2, column: column2};
                    oppositeCornerFin = { row: row1, column: column1};
                    squaresRectangle = { squareFin: squareR2C2, squareOppositeFin: squareR1C1};
                  };
                  
                  const {fromrow, maximumrow} = coordinates.defineInitialMaxRCFromSquare(squareFin);                  
                  //This if is to make sure the possibleCandidate found has notes in other cells in the corresponding columns within the same squareFin to be discarded.
                  for (let possibleFinDeletion = fromrow; possibleFinDeletion <= maximumrow; possibleFinDeletion++) {
                    possibleDeletionCells.push( {row: possibleFinDeletion, column: cornerFin.column } )
                    if ( globalVar.theMatrix[globalVar.currentStep][possibleFinDeletion][cornerFin.column][possibleCandidate] === 1 && possibleFinDeletion !== row2) {
                      howManyDeletions++; 
                      whereAretheDeletions.push( [possibleFinDeletion, cornerFin.column] );
                    };
                  }
                  howManyDeletions ? solvingFunctions.discardFinnedXWing( cornerFin, oppositeCornerFin, squaresRectangle, "row", "column", possibleCandidate, "Finned X-Wing Value in Rows to delete Candidates in Finned Column", notesZero.noteZeroCell, possibleDeletionCells, whereAretheDeletions, cellsFin ) : false;
                  break;
                };
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

// Function to detect when a column has Finned X-Wing candidate
const finnedXwingColumn = () => {
  //column1 evaluates up to column8 searching for the first pattern (two cells with a candidate)
  for (let column1 = 0; column1 <= 8; column1++) { 
    const { howmanycellswiththisnote:howmanycellswiththisnoteC1, whereisthisnote:whereisthisnoteC1 } = 
      gettingInfo.gettingDetailedInfoBlock ( 0, 8, column1, column1, "column" );
    //Loop to define if there are columns with a candidate in two cells.
    for (let possibleCandidate = 1; possibleCandidate<= 9; possibleCandidate++) {
      if (howmanycellswiththisnoteC1[possibleCandidate] === 2) {
        //In this case column2 do evaluate from column 0 to column 8, avoiding only the column1, searching for the second pattern (column with fin)
        for (let column2 = 0; column2<= 8; column2++) {
          if (column2 !== column1) {
            globalVar.loopsExecuted++;
            const { howmanycellswiththisnote:howmanycellswiththisnoteC2, whereisthisnote:whereisthisnoteC2 } = 
            gettingInfo.gettingDetailedInfoBlock ( 0, 8, column2, column2, "column" );
            //Here it detects the couple of needed candidates for X-wing and also one or two additional candidates for the fin
            if (howmanycellswiththisnoteC2[possibleCandidate] === 3 || howmanycellswiththisnoteC2[possibleCandidate] === 4) {
              let candidate1notes = whereisthisnoteC1[possibleCandidate];
              let candidate2notes = whereisthisnoteC2[possibleCandidate];
              let row1 = candidate1notes.indexOf(1);
              let row2 = candidate1notes.indexOf(1, row1 + 1);
              let squareR1C1 = coordinates.defineSquareFromRC( row1, column1);
              let squareR1C2 = coordinates.defineSquareFromRC( row1, column2);
              let squareR2C1 = coordinates.defineSquareFromRC( row2, column1);
              let squareR2C2 = coordinates.defineSquareFromRC( row2, column2);
              //This if makes sure the column2 has the candidate as well in both rows and the squares forming the x-wing are in different squares froming the rectangle
              if (candidate2notes[row1] === 1 && candidate2notes[row2] === 1 && squareR1C1 !== squareR1C2 && squareR1C1 !== squareR2C1 ) {
                let firstThird = candidate2notes[0] + candidate2notes[1] + candidate2notes[2];
                let secondThird = candidate2notes[3] + candidate2notes[4] + candidate2notes[5];
                let finalThird = candidate2notes[6] + candidate2notes[7] + candidate2notes[8];
                //This if check than one of the 3 thirds is empty (No candidate), and other has just 1 candidate (one of the x-wing corners), the third one must then have 2 or 3 candidates forming the fin
                if ((firstThird === 0 || secondThird === 0 || finalThird === 0) && (firstThird === 1 || secondThird === 1 || finalThird === 1)) {
                  let fromRow;
                  let maximumRow;
                  let howManyFins;
                  let rowFin1;
                  let rowFin2;
                  let cellsFin = [];
                  let cornerFin;
                  let oppositeCornerFin;
                  let howManyDeletions = 0;
                  let whereAretheDeletions = [];
                  let possibleDeletionCells = [];
                  let squaresRectangle;
                  //check which third has the fin
                  switch (true) {
                    case firstThird > 1:
                      fromRow = 0
                      maximumRow = 2
                      howManyFins = firstThird - 1
                      break;
                    case secondThird > 1:
                      fromRow = 3
                      maximumRow = 5
                      howManyFins = secondThird - 1
                      break;
                    case finalThird > 1:
                      fromRow = 6
                      maximumRow = 8
                      howManyFins = finalThird - 1
                      break;
                  };
                  //define which rows have the fin
                  for (rowFin1 = fromRow; rowFin1 <= maximumRow; rowFin1++) {
                    if (candidate2notes[rowFin1] === 1 && rowFin1 !== row1 && rowFin1 !== row2) { 
                      cellsFin.push( {column: column2, row: rowFin1});
                      break; 
                    };
                  };
                  if ( howManyFins === 2 ) {
                    for (rowFin2 = rowFin1 + 1; rowFin2 <= maximumRow; rowFin2++) {
                      if (candidate2notes[rowFin2] === 1 && rowFin2 !== row1 && rowFin2 !== row2) { 
                        cellsFin.push( {column: column2, row: rowFin2} );
                        break; 
                      };
                    };
                  };
                  let squareFin = coordinates.defineSquareFromRC(rowFin1, column2);
                  if (squareFin === squareR1C2) { //If true, corner for the Xwing is row1, if false, the corner is row2
                    cornerFin = { column: column2, row: row1};
                    oppositeCornerFin = { column: column1, row: row2};
                    squaresRectangle = { squareFin: squareR1C2, squareOppositeFin: squareR2C1};
                  } else {
                    cornerFin = { column: column2, row: row2};
                    oppositeCornerFin = { column: column1, row: row1};
                    squaresRectangle = { squareFin: squareR2C2, squareOppositeFin: squareR1C1};
                  };
                  
                  const {fromcolumn, maximumcolumn} = coordinates.defineInitialMaxRCFromSquare(squareFin);                  
                  //This if is to make sure the possibleCandidate found has notes in other cells in the corresponding rows within the same squareFin to be discarded.
                  for (let possibleFinDeletion = fromcolumn; possibleFinDeletion <= maximumcolumn; possibleFinDeletion++) {
                    possibleDeletionCells.push( {column: possibleFinDeletion, row: cornerFin.row } )
                    if ( globalVar.theMatrix[globalVar.currentStep][cornerFin.row][possibleFinDeletion][possibleCandidate] === 1 && possibleFinDeletion !== column2) {
                      howManyDeletions++; 
                      whereAretheDeletions.push( [ cornerFin.row, possibleFinDeletion] );
                    };
                  }
                  howManyDeletions ? solvingFunctions.discardFinnedXWing( cornerFin, oppositeCornerFin, squaresRectangle, "column", "row", possibleCandidate, "Finned X-Wing Value in Columns to delete Candidates in Finned Row", notesZero.noteZeroCell, possibleDeletionCells, whereAretheDeletions, cellsFin ) : false;
                  break;
                };
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

export { finnedXwingRow, finnedXwingColumn };