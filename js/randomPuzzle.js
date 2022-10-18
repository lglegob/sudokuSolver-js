'use strict';
import initialMatrixpuzzle from "./data.js"; //This import is needed as it is used in eval() function.

////////////////////////////////////////////////////////////////////////////////
//                       RANDOM SUDOKU PUZZLE                                //
//////////////////////////////////////////////////////////////////////////////

const randomizePuzzle = () => {
  //Several functions using the Fisher-Yates-Durstenfeld shuffle based on https://stackoverflow.com/questions/3718282/javascript-shuffling-objects-inside-an-object-randomize
  //First Step, we get a random seed from data.js
  let randomseed = Math.floor(Math.random() * 5) + 1;
  let randomPuzzle = eval(`initialMatrixpuzzle.seed00${randomseed}String`);
  console.log(`seed puzzle is ${randomseed}`)
  let newRandomPuzzle = "";
  console.log(`The Seed puzzle is: ${randomPuzzle}`);

  //Ranzomize Rows
  //Second Step, process to randomize the rows per block. Meaning, rows 0, 1 and 2 can be randomize between them and mantain tha puzzle validity, then rows 3, 4 and 5, and finally rows 6, 7 and 8
  for (let blockRow=0; blockRow<=2; blockRow++) {
    let string0 = randomPuzzle.substr(27*blockRow + 0, 9);
    let string1 = randomPuzzle.substr(27*blockRow + 9, 9);
    let string2 = randomPuzzle.substr(27*blockRow + 18, 9);
    let baseArray = [string0, string1, string2];
    for (let i = 0; i < 2; i++) {
      let j = i + Math.floor(Math.random() * (3 - i));
      let temp = baseArray[j];
      baseArray[j] = baseArray[i];
      baseArray[i] = temp;
    };
    newRandomPuzzle += baseArray.join('');
  };
  randomPuzzle = newRandomPuzzle;

  //Ranzomize Columns
  //Third Step, process to randomize the columns per block. Meaning, columns 0, 1 and 2 can be randomize between them and mantain tha puzzle validity, then columns 3, 4 and 5, and finally columns 6, 7 and 8
  newRandomPuzzle = ""
  for (let blockColumn=0; blockColumn<=2; blockColumn++) {
    let string0 = "";
    let string1 = "";
    let string2 = "";
    for (let character=0; character<=8; character++) { //Here, it is form the 3 strings (per column) by jumping 9 characters every time
      let indexString = blockColumn * 3 + character * 9;
      string0 += randomPuzzle.charAt(indexString + 0);
      string1 += randomPuzzle.charAt(indexString + 1);
      string2 += randomPuzzle.charAt(indexString + 2);
    };
    let baseArray = [string0, string1, string2];
    for (let i = 0; i < 2; i++) {
      let j = i + Math.floor(Math.random() * (3 - i));
      let temp = baseArray[j];
      baseArray[j] = baseArray[i];
      baseArray[i] = temp;
    };
    for (let character=0; character<=8; character++) {
      let indexString = blockColumn * 3 + character * 9;

      //Method to replace an specific character taken from https://stackoverflow.com/questions/1431094/how-do-i-replace-a-character-at-a-particular-index-in-javascript
      //The process takes 3 components (the string up to just before the character to be replaced, the character, and finally the end of the string starting by the next character)
      randomPuzzle = randomPuzzle.substring(0,indexString + 0) + baseArray[0][character] + randomPuzzle.substring(indexString + 0 + 1);
      randomPuzzle = randomPuzzle.substring(0,indexString + 1) + baseArray[1][character] + randomPuzzle.substring(indexString + 1 + 1);
      randomPuzzle = randomPuzzle.substring(0,indexString + 2) + baseArray[2][character] + randomPuzzle.substring(indexString + 2 + 1);
    };
  };

  //Randomize characters
  //Final Step, to randomize the character assignments, up to this point characters from a to i have been used, at this function the mapping from thos charcaters to numbers 1 to 9 is made randomly as well
  let baseArray = ["a", "b", "c", "d", "e", "f", "g", "h", "i"];
  for (let i = 0; i < 8; i++) {
    let j = i + Math.floor(Math.random() * (9 - i));
    let temp = baseArray[j];
    baseArray[j] = baseArray[i];
    baseArray[i] = temp;
  };
  for (let chr = 0; chr <= 8; chr++) {
    //Solution to replace every character in the string taken from https://stackoverflow.com/questions/542232/in-javascript-how-can-i-perform-a-global-replace-on-string-with-a-variable-insi
    //At first, it was tested the replace global, and considered the regex solution, but this split/join is pretty clever and simple to implement with the same result
  randomPuzzle = randomPuzzle.split(baseArray[chr]).join(chr + 1);    // This line replaces this static as reference --> newRandomPuzzle = newRandomPuzzle.replace(/a/g,"1");
  };

  //Return Final randomPuzzle
  return randomPuzzle;
};

export { randomizePuzzle }