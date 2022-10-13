'use strict';
import globalVar from "./globalVar.js";
import * as recurrent from "./recurrentFunctions.js";
import * as discardingFunctions from "./discardingProcessFunctions.js"
import * as notesZero from "./notesZero.js";

////////////////////////////////////////////////////////////////////////////////
//                   DISCARDING TECHNIQUES - LOCKED CANDIDATES               //
//////////////////////////////////////////////////////////////////////////////
const lockedCandidateRow = () => {
  for (let row = 0; row <= 8; row++) {
    const { howmanycellswiththisnote, howmanynotesinthiscell, answersCurrentBlock, whereisthisnote } = discardingFunctions.gettingDetailedInfo ( row, row, 0, 8, "row" );
    //TO REVIEW why the scope does not let these properties to reach the second if
    let howmanycellswiththisnoteRow = howmanycellswiththisnote;
    for (let possibleCandidate = 1; possibleCandidate <= 9; possibleCandidate++) {
      globalVar.loopsExecuted++;
      if (answersCurrentBlock[possibleCandidate] === 0) {
        let firstThird = whereisthisnote[possibleCandidate][0] + whereisthisnote[possibleCandidate][1] + whereisthisnote[possibleCandidate][2];
        let secondThird = whereisthisnote[possibleCandidate][3] + whereisthisnote[possibleCandidate][4] + whereisthisnote[possibleCandidate][5];
        let finalThird = whereisthisnote[possibleCandidate][6] + whereisthisnote[possibleCandidate][7] + whereisthisnote[possibleCandidate][8];
        let firstThirdOnly = (firstThird > 1 && secondThird === 0 && finalThird === 0);
        let secondThirdOnly = (firstThird === 0 && secondThird > 1 && finalThird === 0);
        let finalThirdOnly = (firstThird === 0 && secondThird === 0 && finalThird > 1);      
        if ( firstThirdOnly || secondThirdOnly || finalThirdOnly ) {
          //This calculation will give the left column of the square where the third with candidadates is located
          let baseColumn = (3*secondThirdOnly + 6*finalThirdOnly);
          //And the to define which is the current Square
          let locatedSquare = (3 * Math.floor(row / 3) + Math.floor(baseColumn / 3) + 1);
          // console.log(`candidate ${possibleCandidate} in row ${row + 1 } has ${howmanycellswiththisnoteRow[possibleCandidate]} ocurrences in the square ${locatedSquare}`);
          const {fromrow, maximumrow, fromcolumn, maximumcolumn} = recurrent.defineSquareCoordinatesSQ(locatedSquare);
          const { howmanycellswiththisnote, howmanynotesinthiscellSquare, answersCurrentBlockSquare, whereisthisnoteSquare } = discardingFunctions.gettingDetailedInfo ( fromrow, maximumrow, fromcolumn, maximumcolumn, "square", locatedSquare );
          if ( howmanycellswiththisnoteRow[possibleCandidate] != howmanycellswiththisnote[possibleCandidate]) {
            // console.log(`Tenemos un Locked Candidate, option ${possibleCandidate} in row ${row + 1} have other notes in square ${locatedSquare} that can be deleted`)
            discardingFunctions.discardOneCandidate(locatedSquare, "square", row, "row", possibleCandidate, "Locked Candidate (Type2) From Row confined in Square", notesZero.noteZeroSquareSQ );
            break;
          };
        };
      };
    };
    if (globalVar.discardNoteSuccess) break;
  };
};

const lockedCandidateColumn = () => {
  for (let column = 0; column <= 8; column++) {
    const { howmanycellswiththisnote, howmanynotesinthiscell, answersCurrentBlock, whereisthisnote } = discardingFunctions.gettingDetailedInfo ( 0, 8, column, column, "column" );
    let howmanycellswiththisnoteColumn = howmanycellswiththisnote;
    for (let possibleCandidate = 1; possibleCandidate <= 9; possibleCandidate++) {
      globalVar.loopsExecuted++;
      if (answersCurrentBlock[possibleCandidate] === 0) {
        let firstThird = whereisthisnote[possibleCandidate][0] + whereisthisnote[possibleCandidate][1] + whereisthisnote[possibleCandidate][2];
        let secondThird = whereisthisnote[possibleCandidate][3] + whereisthisnote[possibleCandidate][4] + whereisthisnote[possibleCandidate][5];
        let finalThird = whereisthisnote[possibleCandidate][6] + whereisthisnote[possibleCandidate][7] + whereisthisnote[possibleCandidate][8];
        let firstThirdOnly = (firstThird > 1 && secondThird === 0 && finalThird === 0);
        let secondThirdOnly = (firstThird === 0 && secondThird > 1 && finalThird === 0);
        let finalThirdOnly = (firstThird === 0 && secondThird === 0 && finalThird > 1);       
        if ( firstThirdOnly || secondThirdOnly || finalThirdOnly ) {
          //This calculation will give the upper row of the square where the third with candidadates is located
          let baseRow = (3*secondThirdOnly + 6*finalThirdOnly);
          //And the to define which is the current Square
          let locatedSquare = (3 * Math.floor(baseRow / 3) + Math.floor(column / 3) + 1);
          // console.log(`candidate ${possibleCandidate} in row ${row + 1 } has ${howmanycellswiththisnoteRow[possibleCandidate]} ocurrences in the square ${locatedSquare}`);
          const {fromrow, maximumrow, fromcolumn, maximumcolumn} = recurrent.defineSquareCoordinatesSQ(locatedSquare);
          const { howmanycellswiththisnote, howmanynotesinthiscellSquare, answersCurrentBlockSquare, whereisthisnoteSquare } = discardingFunctions.gettingDetailedInfo ( fromrow, maximumrow, fromcolumn, maximumcolumn, "square", locatedSquare );
          if ( howmanycellswiththisnoteColumn[possibleCandidate] != howmanycellswiththisnote[possibleCandidate]) {
            // console.log(`Tenemos un Locked Candidate, option ${possibleCandidate} in column ${column + 1} have other notes in square ${locatedSquare} that can be deleted`)
            discardingFunctions.discardOneCandidate(locatedSquare, "square", column, "column", possibleCandidate, "Locked Candidate (Type2) From Column confined in Square", notesZero.noteZeroSquareSQ );
            break;
          };
        };
      };
    };
    if (globalVar.discardNoteSuccess) break;
  };
};

const lockedCandidateSquare = () => {
  for (let square = 1; square <= 9; square++) {
    const {fromrow, maximumrow, fromcolumn, maximumcolumn} = recurrent.defineSquareCoordinatesSQ(square);
    const { howmanycellswiththisnote, howmanynotesinthiscell, answersCurrentBlock, whereisthisnote } = discardingFunctions.gettingDetailedInfo ( fromrow, maximumrow, fromcolumn, maximumcolumn, "square", square );
    let howmanycellswiththisnoteSquare = howmanycellswiththisnote;
    for (let possibleCandidate = 1; possibleCandidate <= 9; possibleCandidate++) {
      globalVar.loopsExecuted++;
      if (answersCurrentBlock[possibleCandidate] === 0) {
        let firstThirdRow = whereisthisnote[possibleCandidate][0] + whereisthisnote[possibleCandidate][1] + whereisthisnote[possibleCandidate][2];
        let secondThirdRow = whereisthisnote[possibleCandidate][3] + whereisthisnote[possibleCandidate][4] + whereisthisnote[possibleCandidate][5];
        let finalThirdRow = whereisthisnote[possibleCandidate][6] + whereisthisnote[possibleCandidate][7] + whereisthisnote[possibleCandidate][8];
        let firstThirdColumn = whereisthisnote[possibleCandidate][0] + whereisthisnote[possibleCandidate][3] + whereisthisnote[possibleCandidate][6];
        let secondThirdColumn = whereisthisnote[possibleCandidate][1] + whereisthisnote[possibleCandidate][4] + whereisthisnote[possibleCandidate][7];
        let finalThirdColumn = whereisthisnote[possibleCandidate][2] + whereisthisnote[possibleCandidate][5] + whereisthisnote[possibleCandidate][8];
        let firstThirdRowOnly = (firstThirdRow > 1 && secondThirdRow === 0 && finalThirdRow === 0);
        let secondThirdRowOnly = (firstThirdRow === 0 && secondThirdRow > 1 && finalThirdRow === 0);
        let finalThirdRowOnly = (firstThirdRow === 0 && secondThirdRow === 0 && finalThirdRow > 1);
        let firstThirdColumnOnly = (firstThirdColumn > 1 && secondThirdColumn === 0 && finalThirdColumn === 0);
        let secondThirdColumnOnly = (firstThirdColumn === 0 && secondThirdColumn > 1 && finalThirdColumn === 0);
        let finalThirdColumnOnly = (firstThirdColumn === 0 && secondThirdColumn === 0 && finalThirdColumn > 1);        
        if ( firstThirdRowOnly || secondThirdRowOnly || finalThirdRowOnly ) {
          //This calculation will give the real row and real column of the square where the third with candidadates is located
          const { realRow, realColumn } = recurrent.defineRowColumnFromSquareRelative(square, secondThirdRowOnly+2*finalThirdRowOnly, secondThirdColumnOnly+2*finalThirdColumnOnly);
          const { howmanycellswiththisnote, howmanynotesinthiscellSquare, answersCurrentBlockSquare, whereisthisnoteSquare } = discardingFunctions.gettingDetailedInfo ( realRow, realRow, 0, 8, "row" );
          if ( howmanycellswiththisnoteSquare[possibleCandidate] != howmanycellswiththisnote[possibleCandidate]) {
            console.log(`Tenemos un Locked Candidate, option ${possibleCandidate} in square ${square} have other notes in row ${realRow + 1} that can be deleted`)
            discardingFunctions.discardOneCandidate(realRow, "row", square, "square", possibleCandidate, "Locked Candidate (Type1) From Square confined in Row", notesZero.noteZeroRow );
            break;
          };
        };
        if ( firstThirdColumnOnly || secondThirdColumnOnly || finalThirdColumnOnly ) {
          //This calculation will give the real row and real column of the square where the third with candidadates is located
          const { realRow, realColumn } = recurrent.defineRowColumnFromSquareRelative(square, secondThirdRowOnly+2*finalThirdRowOnly, secondThirdColumnOnly+2*finalThirdColumnOnly);
          const { howmanycellswiththisnote, howmanynotesinthiscellSquare, answersCurrentBlockSquare, whereisthisnoteSquare } = discardingFunctions.gettingDetailedInfo ( 0, 8, realColumn, realColumn, "column" );
          if ( howmanycellswiththisnoteSquare[possibleCandidate] != howmanycellswiththisnote[possibleCandidate]) {
            console.log(`Tenemos un Locked Candidate, option ${possibleCandidate} in square ${square} have other notes in column ${realColumn + 1} that can be deleted`)
            discardingFunctions.discardOneCandidate(realColumn, "column", square, "square", possibleCandidate, "Locked Candidate (Type1) From Square confined in Column", notesZero.noteZeroColumn );
            break;
          };
        };
      };
    };
    if (globalVar.discardNoteSuccess) break;
  };
};

export { lockedCandidateRow, lockedCandidateColumn, lockedCandidateSquare };