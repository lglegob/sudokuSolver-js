'use strict';
import globalVar from "./globalVar.js";
import * as recurrent from "./recurrentFunctions.js";
import * as discardingFunctions from "./discardingProcessFunctions.js"
import * as notesZero from "./notesZero.js";

////////////////////////////////////////////////////////////////////////////////
//                            DISCARDING TECHNIQUES                          //
//////////////////////////////////////////////////////////////////////////////
const lockedCandidateRow = () => {
  for (let row = 0; row <= 8; row++) {
    const { howmanycellswiththisnote, howmanynotesinthiscell, answersCurrentBlock, whereisthisnote } = discardingFunctions.gettingDetailedInfo ( row, row, 0, 8, "row" );
    //TO REVIEW why the scope does not let these properties to reach the second if
    let howmanycellswiththisnoteRow = howmanycellswiththisnote;
    for (let possibleCandidate = 1; possibleCandidate <= 9; possibleCandidate++) {
      globalVar.loopsExecuted++;
      if (answersCurrentBlock[possibleCandidate] === 0) {
        let firstthird = whereisthisnote[possibleCandidate][0] + whereisthisnote[possibleCandidate][1] + whereisthisnote[possibleCandidate][2];
        let secondthird = whereisthisnote[possibleCandidate][3] + whereisthisnote[possibleCandidate][4] + whereisthisnote[possibleCandidate][5];
        let finalthird = whereisthisnote[possibleCandidate][6] + whereisthisnote[possibleCandidate][7] + whereisthisnote[possibleCandidate][8];
        let firstThirdOnly = (firstthird > 1 && secondthird === 0 && finalthird === 0);
        let secondThirdOnly = (firstthird === 0 && secondthird > 1 && finalthird === 0);
        let finalThirdOnly = (firstthird === 0 && secondthird === 0 && finalthird > 1);
        
        // switch (true) {
        //   case firstThirdOnly:
        //     // console.log(`${possibleCandidate} in row ${row + 1 } is located in the first third only`);
        //   break;
        //   case secondThirdOnly:
        //     // console.log(`${possibleCandidate} in row ${row + 1 } is located in the second third only`);
        //   break;
        //   case finalThirdOnly:
        //     // console.log(`${possibleCandidate} in row ${row + 1 } is located in the final third only`);
        //   break;
        // };
        
        if ( firstThirdOnly || secondThirdOnly || finalThirdOnly ) {
          //This calculation will give the left column of the square where the third with candidadates is located
          let baseColumn = (3*secondThirdOnly + 6*finalThirdOnly);
          //And the to define which is the current Square
          let locatedSquare = (3 * Math.floor(row / 3) + Math.floor(baseColumn / 3) + 1);
          // console.log(`candidate ${possibleCandidate} in row ${row + 1 } has ${howmanycellswiththisnoteRow[possibleCandidate]} ocurrences in the square ${locatedSquare}`);
          const {fromrow, maximumrow, fromcolumn, maximumcolumn} = recurrent.defineSquareCoordinatesSQ(locatedSquare);
          const { howmanycellswiththisnote, howmanynotesinthiscellSquare, answersCurrentBlockSquare, whereisthisnoteSquare } = discardingFunctions.gettingDetailedInfo ( fromrow, maximumrow, fromcolumn, maximumcolumn, "square", locatedSquare );
          if ( howmanycellswiththisnoteRow[possibleCandidate] != howmanycellswiththisnote[possibleCandidate]) {
            console.log("--------------------------------------------");
            console.log(`Tenemos un Locked Candidate, option ${possibleCandidate} in row ${row} have other notes in square ${locatedSquare} that can be deleted`)
            discardingFunctions.discardOneCandidate(locatedSquare, "square", row, "row", possibleCandidate, "Detecting Locked Candidate in Row to delete in Square", notesZero.noteZeroSquareSQ );
          };
        };

      };
    };
  };
};

export { lockedCandidateRow };