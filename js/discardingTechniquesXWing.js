'use strict';
import globalVar from "./globalVar.js";
import * as discardingFunctions from "./discardingProcessFunctions.js"
import * as notesZero from "./notesZero.js";
import * as gettingInfo from "./gettingInfoBlock.js";


////////////////////////////////////////////////////////////////////////////////
//                     DISCARDING TECHNIQUES - X-WING                        //
//////////////////////////////////////////////////////////////////////////////

// Function to detect when a row has X-Wing candidate
const xwingRow = () => {
  //row1 evaluates up to row7 to let space to compare with row8
  for (let row1 = 0; row1 <= 7; row1++) { 
    const { howmanycellswiththisnote:howmanycellswiththisnoteR1, howmanynotesinthiscell, answersCurrentBlock, whereisthisnote:whereisthisnoteR1 } = 
      gettingInfo.gettingDetailedInfoBlock ( row1, row1, 0, 8, "row" );
    //third loop to define if there are rows with a candidate in two cells.
    for (let possibleCandidate = 1; possibleCandidate<= 9; possibleCandidate++) {
      if (howmanycellswiththisnoteR1[possibleCandidate] === 2) {
        for (let row2 = row1+1; row2<= 8; row2++) {
          globalVar.loopsExecuted++;
          const { howmanycellswiththisnote:howmanycellswiththisnoteR2, howmanynotesinthiscell, answersCurrentBlock, whereisthisnote:whereisthisnoteR2 } = 
          gettingInfo.gettingDetailedInfoBlock ( row2, row2, 0, 8, "row" );
          if (howmanycellswiththisnoteR2[possibleCandidate] === 2) {
            let candidate1notes = whereisthisnoteR1[possibleCandidate];
            let candidate2notes = whereisthisnoteR2[possibleCandidate];
            if (candidate1notes.every((val, index) => val === candidate2notes[index])) {
              let column1 = candidate1notes.indexOf(1);
              let column2 = candidate1notes.indexOf(1, column1 + 1);
              //This if is to make sure the possibleCandidate found has notes in other cells in the corresponding columns to be discarded.
              const { howmanycellswiththisnote:howmanycellswiththisnoteC1 } = 
              gettingInfo.gettingDetailedInfoBlock ( 0, 8, column1, column1, "column" );
              const { howmanycellswiththisnote:howmanycellswiththisnoteC2 } = 
              gettingInfo.gettingDetailedInfoBlock ( 0, 8, column2, column2, "column" );
              if (howmanycellswiththisnoteC1[possibleCandidate] > 2 || howmanycellswiththisnoteC2[possibleCandidate] > 2) {
                console.log(`X-Wing Found in Rows ${row1 + 1} and ${row2 + 1} for candidate ${possibleCandidate}. There are still other notes in Columns ${column1 + 1} and ${column2 + 1}`);
                discardingFunctions.discardOneCandidateFrom2Blocks([row1, row2], "row", [column1, column2], "column", possibleCandidate, "X-Wing Value in Rows to delete Candidates in Columns", notesZero.noteZeroColumn );
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

// Function to detect when a column has X-Wing candidate
const xwingColumn = () => {
  //column1 evaluates up to column7 to let space to compare with column8
  for (let column1 = 0; column1 <= 7; column1++) { 
    const { howmanycellswiththisnote:howmanycellswiththisnoteC1, howmanynotesinthiscell, answersCurrentBlock, whereisthisnote:whereisthisnoteC1 } = 
      gettingInfo.gettingDetailedInfoBlock ( 0, 8, column1, column1, "column" );
    //third loop to define if there are rows with a candidate in two cells.
    for (let possibleCandidate = 1; possibleCandidate<= 9; possibleCandidate++) {
      if (howmanycellswiththisnoteC1[possibleCandidate] === 2) {
        for (let column2 = column1+1; column2<= 8; column2++) {
          globalVar.loopsExecuted++;
          const { howmanycellswiththisnote:howmanycellswiththisnoteC2, howmanynotesinthiscell, answersCurrentBlock, whereisthisnote:whereisthisnoteC2 } = 
          gettingInfo.gettingDetailedInfoBlock ( 0, 8, column2, column2, "column" );
          if (howmanycellswiththisnoteC2[possibleCandidate] === 2) {
            let candidate1notes = whereisthisnoteC1[possibleCandidate];
            let candidate2notes = whereisthisnoteC2[possibleCandidate];
            if (candidate1notes.every((val, index) => val === candidate2notes[index])) {
              let row1 = candidate1notes.indexOf(1);
              let row2 = candidate1notes.indexOf(1, row1 + 1);
              //This if is to make sure the possibleCandidate found has notes in other cells in the corresponding columns to be discarded.
              const { howmanycellswiththisnote:howmanycellswiththisnoteR1 } = 
              gettingInfo.gettingDetailedInfoBlock ( row1, row1, 0, 8, "row" );
              const { howmanycellswiththisnote:howmanycellswiththisnoteR2 } = 
              gettingInfo.gettingDetailedInfoBlock ( row2, row2, 0, 8, "row" );
              if (howmanycellswiththisnoteR1[possibleCandidate] > 2 || howmanycellswiththisnoteR2[possibleCandidate] > 2) {
                console.log(`X-Wing Found in Columns ${column1 + 1} and ${column2 + 1} for candidate ${possibleCandidate}. There are still other notes in Rows ${row1 + 1} and ${row2 + 1}`);
                discardingFunctions.discardOneCandidateFrom2Blocks( [column1, column2], "column", [row1, row2], "row", possibleCandidate, "X-Wing Value in Columns to delete Candidates in Rows", notesZero.noteZeroRow );
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

export { xwingRow, xwingColumn };