'use strict';
import globalVar from "./globalVar.js";
import * as discardingFunctions from "./discardingProcessFunctions.js"
import * as notesZero from "./notesZero.js";


////////////////////////////////////////////////////////////////////////////////
//                     DISCARDING TECHNIQUES - Y-WING                        //
//////////////////////////////////////////////////////////////////////////////

// Function to detect when a row has X-Wing candidate
const yWingRow = () => {
  //Process to detect a possible pivot cell (Cell with 2 candidates)
  for (let row1 = 0; row1 <= 8; row1++) { 
    const { howmanycellswiththisnote, howmanynotesinthiscell:howmanynotesinthiscellR1, answersCurrentBlock, whereisthisnote } = 
      discardingFunctions.gettingDetailedInfo ( row1, row1, 0, 8, "row" );
    for (let column1index = 0; column1index <= 8; column1index++) {
      if (howmanynotesinthiscellR1[column1index] === 2) {
        //It got a possible pivot, let's evaluate cells in the same row for the first pincer
        for (let column2index = column1index + 1; column2index <= 8; column2index++) {
          let pincerX;
          let pincerY;
          let pincerZ;
          let firstPincer = false;

          if (howmanynotesinthiscellR1[column2index] === 2) {
            //This process is to detect if 1 of the candidates is shared by the two cells
            let cell1candidate1 = globalVar.theMatrix[globalVar.currentStep][row1][column1index].indexOf(1);
            let cell1candidate2 = globalVar.theMatrix[globalVar.currentStep][row1][column1index].indexOf(1,cell1candidate1 + 1);
            let cell2candidate1 = globalVar.theMatrix[globalVar.currentStep][row1][column2index].indexOf(1);
            let cell2candidate2 = globalVar.theMatrix[globalVar.currentStep][row1][column2index].indexOf(1,cell2candidate1 + 1);
            if ((cell1candidate1 === cell2candidate1) && (cell1candidate2 !== cell2candidate2)) {
              pincerX = cell1candidate1;
              pincerY = cell1candidate2;
              pincerZ = cell2candidate2;
              firstPincer = true;
            };
            if ((cell1candidate1 !== cell2candidate1) && (cell1candidate2 === cell2candidate2)) {
              pincerX = cell1candidate2;
              pincerY = cell1candidate1;
              pincerZ = cell2candidate1;
              firstPincer = true;
            };
            if ((cell1candidate1 === cell2candidate2)) {
              pincerX = cell1candidate1;
              pincerY = cell1candidate2;
              pincerZ = cell2candidate1;
              firstPincer = true;
            }
            if ((cell1candidate2 === cell2candidate1)) {
              pincerX = cell1candidate2;
              pincerY = cell1candidate1;
              pincerZ = cell2candidate2;
              firstPincer = true;
            };
          };
          if (firstPincer) {
            let cellToLookFor = [0,0,0,0,0,0,0,0,0,0];
            cellToLookFor[pincerY] = 1;
            cellToLookFor[pincerZ] = 1;
            //look for the second Pincer in the same column as columnindex1 where it is located the pivot
            for (let row2 = 0; row2 <= 8; row2++) {
              //.every method evaluates if the target array and the cellToLookFor are identical
              if (cellToLookFor.every((val, index) => val === globalVar.theMatrix[globalVar.currentStep][row2][column1index][index])) {
                //Here the second pincer have been found, now it needs to verify that the cells seen by bot pincers contain the pincerz value. In this case just 1 cell defined by row2 and column2index
                let buddycell = globalVar.theMatrix[globalVar.currentStep][row2][column2index];
                if (buddycell[pincerZ] === 1) {
                  console.log(`Y-Wing Found with Pivot cell in Row ${row1 + 1}, Column ${column1index + 1} with candidates ${pincerX} and ${pincerY}.`);
                  console.log(`First Pincer (Same Row) in Row ${row1 + 1}, Column ${column2index + 1}, Second Pincer (Same Column) in Row ${row2 + 1}, Column ${column1index + 1}`);
                  console.log(`the buddy cell located in Row ${row2 + 1}, Column ${column2index + 1} contains a Z value ${pincerZ} that will be deleted`);
                  discardingFunctions.discardYWing([row1, row2], "row", [column1index, column2index], "column", pincerX, pincerY, pincerZ, "Y-Wing Value with Pincer Cells in Row and Column", notesZero.noteZeroCell );
                  break;
                };
              };
            };
            if (globalVar.discardNoteSuccess) break;
          };
        };
        if (globalVar.discardNoteSuccess) break;
      };
    };
    if (globalVar.discardNoteSuccess) break;
  };
};
export { yWingRow };