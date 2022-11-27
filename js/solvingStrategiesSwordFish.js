'use strict';
import globalVar from "./globalVar.js";
import * as solvingFunctions from "./solvingProcessFunctions.js"
import * as notesZero from "./notesZero.js";
import * as gettingInfo from "./gettingInfoBlock.js";


////////////////////////////////////////////////////////////////////////////////
//                    DISCARDING TECHNIQUES - SWORDFISH                      //
//////////////////////////////////////////////////////////////////////////////

// Function to detect when a row has X-Wing candidate
const swordFishRow = () => {
  //row1 evaluates up to row6 to let space to compare with row7 and row8
  for (let row1 = 0; row1 <= 6; row1++) { 
    const { howmanycellswiththisnote:howmanycellswiththisnoteR1, whereisthisnote:whereisthisnoteR1 } = 
      gettingInfo.gettingDetailedInfoBlock ( row1, row1, 0, 8, "row" );
    //loop to define if there are rows with a candidate in two cells.
    for (let possibleCandidate = 1; possibleCandidate<= 9; possibleCandidate++) {
      if (howmanycellswiththisnoteR1[possibleCandidate] === 2) {
        for (let row2 = row1+1; row2<= 7; row2++) {
          const { howmanycellswiththisnote:howmanycellswiththisnoteR2, whereisthisnote:whereisthisnoteR2 } = 
          gettingInfo.gettingDetailedInfoBlock ( row2, row2, 0, 8, "row" );
          if (howmanycellswiththisnoteR2[possibleCandidate] === 2) {
            let candidate1notes = whereisthisnoteR1[possibleCandidate];
            let candidate2notes = whereisthisnoteR2[possibleCandidate];
            let row1column1 = candidate1notes.indexOf(1);
            let row1column2 = candidate1notes.indexOf(1, row1column1 + 1);
            let row2column1 = candidate2notes.indexOf(1);
            let row2column2 = candidate2notes.indexOf(1, row2column1 + 1);
            if ((row1column1 === row2column1 && row1column2 !== row2column2) || (row1column1 !== row2column1 && row1column2 === row2column2) || (row1column1 === row2column2 && row1column2 !== row2column1) || (row1column1 !== row2column2 && row1column2 === row2column1)) {
              //Process to define the cells for row3 where possibleCandidate Must be located to be defined as swordFish configuration
              let thirdRowPattern = [0,0,0,0,0,0,0,0,0];
              let column1;
              let column2;
              let column3;
              switch (true) {
                case row1column1 === row2column1 && row1column2 !== row2column2:
                  thirdRowPattern[row1column2] = 1;
                  thirdRowPattern[row2column2] = 1;
                  //if the first column of both rows is the common, it is know that one is the forst column, the other two need to be defined by min/max
                  column1 = row1column1;
                  column2 = Math.min(row1column2, row2column2);
                  column3 = Math.max(row1column2, row2column2);
                  break;
                case row1column1 !== row2column1 && row1column2 === row2column2:
                  thirdRowPattern[row1column1] = 1;
                  thirdRowPattern[row2column1] = 1;
                  //if the second column of both rows is the common, it is know that one is the last column, the other two need to be defined by min/max
                  column1 = Math.min(row1column1, row2column1);
                  column2 = Math.max(row1column1, row2column1);
                  column3 = row1column2;
                  break;
                case row1column1 === row2column2 && row1column2 !== row2column1:
                  thirdRowPattern[row1column2] = 1;
                  thirdRowPattern[row2column1] = 1;
                  //if the column in common is different, it is known that one is the middle column, and the positions of the other two can easily be defined.
                  column1 = row2column1;
                  column2 = row1column1;
                  column3 = row1column2;
                  break;
                case row1column1 !== row2column2 && row1column2 === row2column1:
                  thirdRowPattern[row1column1] = 1;
                  thirdRowPattern[row2column2] = 1;
                  //if the column in common is different, it is known that one is the middle column, and the positions of the other two can easily be defined.
                  column1 = row1column1;
                  column2 = row1column2;
                  column3 = row2column2;
                  break;
              };
              for (let row3 = row2+1; row3<= 8; row3++) {
                globalVar.loopsExecuted++;
                const { howmanycellswiththisnote:howmanycellswiththisnoteR3, whereisthisnote:whereisthisnoteR3 } = 
                gettingInfo.gettingDetailedInfoBlock ( row3, row3, 0, 8, "row" );
                if (howmanycellswiththisnoteR3[possibleCandidate] === 2) {
                  let candidate3notes = whereisthisnoteR3[possibleCandidate];
                  let row3column1 = candidate3notes.indexOf(1);
                  let row3column2 = candidate3notes.indexOf(1, row3column1 + 1);
                  //This line validates that the possible candidate already confirmed to be in just two cells for row3, are located accordingly with the pattern defined by the first two rows
                  if (thirdRowPattern.every((val, index) => val === candidate3notes[index])) {
                    //This if is to make sure the possibleCandidate found has notes in other cells in the corresponding columns to be discarded.
                    const { howmanycellswiththisnote:howmanycellswiththisnoteC1 } = 
                    gettingInfo.gettingDetailedInfoBlock ( 0, 8, column1, column1, "column" );
                    const { howmanycellswiththisnote:howmanycellswiththisnoteC2 } = 
                    gettingInfo.gettingDetailedInfoBlock ( 0, 8, column2, column2, "column" );
                    const { howmanycellswiththisnote:howmanycellswiththisnoteC3 } = 
                    gettingInfo.gettingDetailedInfoBlock ( 0, 8, column3, column3, "column" );
                    if (howmanycellswiththisnoteC1[possibleCandidate] > 2 || howmanycellswiththisnoteC2[possibleCandidate] > 2 || howmanycellswiththisnoteC3[possibleCandidate] > 2) {
                      solvingFunctions.discardSwordFish([row1, row2, row3], "row", [column1, column2, column3], "column", possibleCandidate, "SwordFish Value in Rows to delete Candidate in Columns", notesZero.noteZeroColumn );
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
    if (globalVar.discardNoteSuccess) break;
  };
};

// Function to detect when a row has X-Wing candidate
const swordFishColumn = () => {
  //column1 evaluates up to column6 to let space to compare with column7 and column8
  for (let column1 = 0; column1 <= 6; column1++) { 
    const { howmanycellswiththisnote:howmanycellswiththisnoteC1, whereisthisnote:whereisthisnoteC1 } = 
      gettingInfo.gettingDetailedInfoBlock ( 0, 8, column1, column1, "column" );
    //loop to define if there are columns with a candidate in two cells.
    for (let possibleCandidate = 1; possibleCandidate<= 9; possibleCandidate++) {
      if (howmanycellswiththisnoteC1[possibleCandidate] === 2) {
        for (let column2 = column1+1; column2<= 7; column2++) {
          const { howmanycellswiththisnote:howmanycellswiththisnoteC2, whereisthisnote:whereisthisnoteC2 } = 
          gettingInfo.gettingDetailedInfoBlock ( 0, 8, column2, column2, "column" );
          if (howmanycellswiththisnoteC2[possibleCandidate] === 2) {
            let candidate1notes = whereisthisnoteC1[possibleCandidate];
            let candidate2notes = whereisthisnoteC2[possibleCandidate];
            let column1row1 = candidate1notes.indexOf(1);
            let column1row2 = candidate1notes.indexOf(1, column1row1 + 1);
            let column2row1 = candidate2notes.indexOf(1);
            let column2row2 = candidate2notes.indexOf(1, column2row1 + 1);
            if ((column1row1 === column2row1 && column1row2 !== column2row2) || (column1row1 !== column2row1 && column1row2 === column2row2) || (column1row1 === column2row2 && column1row2 !== column2row1) || (column1row1 !== column2row2 && column1row2 === column2row1)) {
              //Process to define the cells for column3 where possibleCandidate Must be located to be defined as swordFish configuration
              let thirdColumnPattern = [0,0,0,0,0,0,0,0,0];
              let row1;
              let row2;
              let row3;
              switch (true) {
                case column1row1 === column2row1 && column1row2 !== column2row2:
                  thirdColumnPattern[column1row2] = 1;
                  thirdColumnPattern[column2row2] = 1;
                  //if the first column of both rows is the common, it is know that one is the forst column, the other two need to be defined by min/max
                  row1 = column1row1;
                  row2 = Math.min(column1row2, column2row2);
                  row3 = Math.max(column1row2, column2row2);
                  break;
                case column1row1 !== column2row1 && column1row2 === column2row2:
                  thirdColumnPattern[column1row1] = 1;
                  thirdColumnPattern[column2row1] = 1;
                  //if the second column of both rows is the common, it is know that one is the last column, the other two need to be defined by min/max
                  row1 = Math.min(column1row1, column2row1);
                  row2 = Math.max(column1row1, column2row1);
                  row3 = column1row2;
                  break;
                case column1row1 === column2row2 && column1row2 !== column2row1:
                  thirdColumnPattern[column1row2] = 1;
                  thirdColumnPattern[column2row1] = 1;
                  //if the column in common is different, it is known that one is the middle column, and the positions of the other two can easily be defined.
                  row1 = column2row1;
                  row2 = column1row1;
                  row3 = column1row2;
                  break;
                case column1row1 !== column2row2 && column1row2 === column2row1:
                  thirdColumnPattern[column1row1] = 1;
                  thirdColumnPattern[column2row2] = 1;
                  //if the column in common is different, it is known that one is the middle column, and the positions of the other two can easily be defined.
                  row1 = column1row1;
                  row2 = column1row2;
                  row3 = column2row2;
                  break;
              };
              for (let column3 = column2+1; column3<= 8; column3++) {
                globalVar.loopsExecuted++;
                const { howmanycellswiththisnote:howmanycellswiththisnoteC3, whereisthisnote:whereisthisnoteC3 } = 
                gettingInfo.gettingDetailedInfoBlock ( 0, 8, column3, column3, "column" );
                if (howmanycellswiththisnoteC3[possibleCandidate] === 2) {
                  let candidate3notes = whereisthisnoteC3[possibleCandidate];
                  let column3row1 = candidate3notes.indexOf(1);
                  let column3row2 = candidate3notes.indexOf(1, column3row1 + 1);
                  //This line validates that the possible candidate already confirmed to be in just two cells for column3, are located accordingly with the pattern defined by the first two columns
                  if (thirdColumnPattern.every((val, index) => val === candidate3notes[index])) {
                    //This if is to make sure the possibleCandidate found has notes in other cells in the corresponding columns to be discarded.
                    const { howmanycellswiththisnote:howmanycellswiththisnoteR1 } = 
                    gettingInfo.gettingDetailedInfoBlock ( row1, row1, 0, 8, "row" );
                    const { howmanycellswiththisnote:howmanycellswiththisnoteR2 } = 
                    gettingInfo.gettingDetailedInfoBlock ( row2, row2, 0, 8, "row" );
                    const { howmanycellswiththisnote:howmanycellswiththisnoteR3 } = 
                    gettingInfo.gettingDetailedInfoBlock ( row3, row3, 0, 8, "row" );
                    if (howmanycellswiththisnoteR1[possibleCandidate] > 2 || howmanycellswiththisnoteR2[possibleCandidate] > 2 || howmanycellswiththisnoteR3[possibleCandidate] > 2) {
                      solvingFunctions.discardSwordFish([column1, column2, column3], "column", [row1, row2, row3], "row", possibleCandidate, "SwordFish Value in Columns to delete Candidate in Rows", notesZero.noteZeroRow );
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
    if (globalVar.discardNoteSuccess) break;
  };
};

export { swordFishRow, swordFishColumn };