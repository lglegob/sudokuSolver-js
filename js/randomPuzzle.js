'use strict';
import initialMatrixpuzzle from "./data.js";

////////////////////////////////////////////////////////////////////////////////
//                            EVENT LISTENERS                                //
//////////////////////////////////////////////////////////////////////////////

const randomizePuzzle = () => {
  //Several functions using the Fisher-Yates-Durstenfeld shuffle based on https://stackoverflow.com/questions/3718282/javascript-shuffling-objects-inside-an-object-randomize
  let randomseed = Math.floor(Math.random() * 4) + 1;
  let randomPuzzle = eval(`initialMatrixpuzzle.seed00${randomseed}String`);
  //Ranzomize Rows
  let newRandomPuzzle = "";
  for (let blockRow=0; blockRow<=2; blockRow++) {
    let string1 = randomPuzzle.substr(27*blockRow + 0, 9);
    let string2 = randomPuzzle.substr(27*blockRow + 9, 9);
    let string3 = randomPuzzle.substr(27*blockRow + 18, 9);
    let baseArray = [string1, string2, string3];
    for (let i = 0; i < 2; i++) {
      let j = i + Math.floor(Math.random() * (3 - i));

      let temp = baseArray[j];
      baseArray[j] = baseArray[i];
      baseArray[i] = temp;
    };
    newRandomPuzzle += baseArray.join('');
  };
  let baseArray = ["a", "b", "c", "d", "e", "f", "g", "h", "i"];
  for (let i = 0; i < 8; i++) {
    let j = i + Math.floor(Math.random() * (9 - i));
    let temp = baseArray[j];
    baseArray[j] = baseArray[i];
    baseArray[i] = temp;
  };
  //replace characters
  
  for (let chr = 0; chr <= 8; chr++) {
  // This line replaces this static as reference --> newRandomPuzzle = newRandomPuzzle.replace(/a/g,"1");
  newRandomPuzzle = newRandomPuzzle.split(baseArray[chr]).join(chr + 1);
  };
  return newRandomPuzzle;
};

export { randomizePuzzle }