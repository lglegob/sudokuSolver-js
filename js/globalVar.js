'use strict';

////////////////////////////////////////////////////////////////////////////////
//                           GLOBAL VARIABLES                                //
//////////////////////////////////////////////////////////////////////////////

//The 4D matrix is formed with 4 nested dimensions
//The latest added dimension is also the biggest, and it is... Time!, expressed as the steps taken so far to resolve the Sudoku, the step 0 is the initial state and the subsequent steps represent each time a change is made in the matrix, by adding a number (cell solution) or discarding values (notes).
//The Second dimension is theMatrix itself, with 9 internal arrays, 1 array for each row in the Sudoku Matrix. One Matrix status is defined for each one of the steps above.
//The Third dimension (each of the 9 arrays) has as well 9 arrays inside (81 nested total for the 81 cells in the sudoku array), one array for each value in the row.
//The Fourth and Last dimension (each of the 81 (9*9) nested arrays) is an array of 10 numbers, the first one is for the value of the cell (if already known or zero if not known).
//the other 9 numbers (indexes 1-9 show the notes for each of the cells of the sudoku array)
// theMatrix Structure --> [[row][row]...[row][row]]
// Each row Structure  --> [[column cell][column cell]...[column cell][column cell]]
// Each Column Cell    --> [[answer][note 1][note 2][note 3]...[note 9]]
let theMatrix = [[]];
let theMatrixSolved;

//stepsDetail format by pushing with each step the following info =   { currentStep: number, cellValueFound: boolean, method: string, cellsResolved: number, valueFound: number, cellRC: {row: number, column: number}} );
let stepsDetail = []; 

//Several Variables needed globally available
let currentStep = 0;
let loopsExecuted = 0;
let cellsResolved = 0;
let difficulty = 0;

let iterationSuccess = false;
let discardNoteSuccess = false;
let areNotesShowing = false;
let areNotesNeeded = false;
let areHighlightsOn = true;
let stepByStep = false;
let failure = false;

// nishioGuessingActive format
// evaluating: true when nishio process is in progress
// step: defines the step when the guess is made based on globalVar.currentStep;
// currentCell defines cell coordinates where guess is made { row: row, column: column };
// currentValue: defines the candidate taken as guessed certain with currentCandidateValue1;
// currentDiscardedCandidate: defines the other candidate with currentCandidateValue2;
// previousNishioResult: defines the latest nishio guess outcome with possible values ("notExecuted", "invalidGuess", "nishioDeadEnd" )
let nishioGuessingActive = { evaluating: false, previousNishioResult: "notExecuted" };

export default { theMatrix, theMatrixSolved, stepsDetail, currentStep, loopsExecuted, cellsResolved, iterationSuccess, discardNoteSuccess, areNotesShowing, areNotesNeeded, areHighlightsOn, stepByStep, failure, difficulty, nishioGuessingActive };