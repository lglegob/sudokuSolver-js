'use strict';
import * as matrixFunctions from "./theMatrixFunctions.js";

////////////////////////////////////////////////////////////////////////////////
//                             SUDOKU FETCH API                              //
//////////////////////////////////////////////////////////////////////////////

const options = {
	method: 'GET',
	headers: {
    'X-RapidAPI-Key': '92ba18c8d0msh245e4fc33af8192p12a49ajsn566308def067',
	// 'X-RapidAPI-Key': '',
	'X-RapidAPI-Host': 'sudoku-generator1.p.rapidapi.com'
	}
};

const sudokuAPIURL = 'https://sudoku-generator1.p.rapidapi.com/sudoku/generate?difficulty=hard';

const handleSudokuAPIErrors = (response) => {
	if(!response.ok) {
    throw new Error((response.status + ': ' + response.statusText));
	}
	return response.json();
	}

const createRequestSudokuAPI = () => {
	fetch(sudokuAPIURL, options)
		.then(response => handleSudokuAPIErrors(response))
		.then(response => sudokuRequestAPISuccess(response))
		.catch(err => console.error(err))
		.finally(function() {
			console.log("An API request was executed");
		});
};

const sudokuRequestAPISuccess = (response) => {
  let puzzleAPI = response.puzzle;
  console.log(`The original puzzle from rapidAPI was: ${puzzleAPI}`);
  matrixFunctions.loadMatrix(puzzleAPI, true);
};

export { createRequestSudokuAPI };