'use strict';

////////////////////////////////////////////////////////////////////////////////
//                           GLOBAL VARIABLES                                //
//////////////////////////////////////////////////////////////////////////////

//The 4D matrix is formed with 4 dimensions
//The latest added dimension is also the biggest, and it is... Time!, expressed as the steps taken so far to resolve the Sudoku, the step 0 is the initial state and the subsequent steps represent each time a change is made in the matrix, by adding a number (cell solution) or discarding values (notes)
//The Second dimension is theMatrix itself, with 9 internal arrays, 1 array for each row in the Sudoku Matrix
//The Third dimension (each of the 9 arrays) has as well 9 arrays inside (81 nested total for the 81 cells in the sudoku array), one array for each value in the row
//The Fourth and Last dimension (each of the 81 (9*9) nested arrays) is an array of 10 numbers, the first one is for the value of the cell (if already known or zero if not known)
//the other 9 numbers (indexes 1-9 show the notes for each of the cells of the sudoku array)
// theMatrix Structure --> [[row][row]...[row][row]]
// Each row Structure  --> [[column cell][column cell]...[column cell][column cell]]
// Each Column Cell    --> [[answer][note 1][note 2][note 3]...[note 9]]
let theMatrix = [[]];
//StepsDetail [steptype, Method, [Step detailed info]]
let stepsDetail = []; 
let currentStep = 0;
let loopsExecuted = 0;
let cellsResolved = 0;
let iterationSuccess = false;
let discardNoteSuccess = false;
let areNotesShowing = false;
export default { theMatrix, stepsDetail, currentStep, loopsExecuted, cellsResolved, iterationSuccess, discardNoteSuccess, areNotesShowing };