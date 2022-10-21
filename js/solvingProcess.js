'use strict';
import globalVar from "./globalVar.js";
import * as solvingTechniques from "./solvingTechniques.js";
import * as obviousPairs from "./discardingTechniquesObviousPairs.js";
import * as lockedCandidates from "./discardingTechniquesLockedCandidate.js";
import * as hiddenPairs from "./discardingTechniquesHiddenPairs.js";
import * as xwing from "./discardingTechniquesXWing.js";
import * as ywing from "./discardingTechniquesYWing.js";

////////////////////////////////////////////////////////////////////////////////
//                            SOLVING PROCESS                                //
//////////////////////////////////////////////////////////////////////////////

const solvingProcess = () => {

  //NAKED SINGLE METHOD
  if (globalVar.iterationSuccess === false && globalVar.discardNoteSuccess === false) {
  solvingTechniques.singleCandidate();
  };

  //HIDDEN SINGLE METHODS
  if (globalVar.iterationSuccess === false && globalVar.discardNoteSuccess === false) {
    solvingTechniques.hiddenSinglesSquare();
  };
  if (globalVar.iterationSuccess === false && globalVar.discardNoteSuccess === false) {
    solvingTechniques.hiddenSinglesRow();
  };
  if (globalVar.iterationSuccess === false && globalVar.discardNoteSuccess === false) {
    solvingTechniques.hiddenSinglesColumn();
  };

  //OBVIOUS PAIRS METHODS
  if (globalVar.iterationSuccess === false && globalVar.discardNoteSuccess === false) {
    obviousPairs.obviousPairsRow();
  };
  if (globalVar.iterationSuccess === false && globalVar.discardNoteSuccess === false) {
    obviousPairs.obviousPairsColumn();
  };
  if (globalVar.iterationSuccess === false && globalVar.discardNoteSuccess === false) {
    obviousPairs.obviousPairsSquare();
  };

  //HIDDEN PAIRS METHODS
  if (globalVar.iterationSuccess === false && globalVar.discardNoteSuccess === false) {
    hiddenPairs.hiddenPairsRow();
  };
  if (globalVar.iterationSuccess === false && globalVar.discardNoteSuccess === false) {
    hiddenPairs.hiddenPairsColumn();
  };
  if (globalVar.iterationSuccess === false && globalVar.discardNoteSuccess === false) {
    hiddenPairs.hiddenPairsSquare();
  };

  //LOCKED CANDIDATE METHODS
  if (globalVar.iterationSuccess === false && globalVar.discardNoteSuccess === false) {
    lockedCandidates.lockedCandidateRow();
  };
  if (globalVar.iterationSuccess === false && globalVar.discardNoteSuccess === false) {
    lockedCandidates.lockedCandidateColumn();
  };
  if (globalVar.iterationSuccess === false && globalVar.discardNoteSuccess === false) {
    lockedCandidates.lockedCandidateSquare();
  };

  //X-WING CANDIDATES METHOD
  if (globalVar.iterationSuccess === false && globalVar.discardNoteSuccess === false) {
    xwing.xwingRow();
  };
  if (globalVar.iterationSuccess === false && globalVar.discardNoteSuccess === false) {
    xwing.xwingColumn();
  };

  //Y-WING CANDIDATES METHOD
  if (globalVar.iterationSuccess === false && globalVar.discardNoteSuccess === false) {
    ywing.yWing();
  };

  //FAILURE (NOT SOLVED)
  if (globalVar.iterationSuccess === false && globalVar.discardNoteSuccess === false) {
    globalVar.failure = true;
    console.log("--------------------------------------------");
    console.log("I'm sorry, kiddo. I really am. You have a good soul. And I hate giving good people bad news. - Oracle");
    let newLine = "\r\n";
    let prompttext = "We are not able to advance any further in the resolution of this Sudoku Puzzle.";
    prompttext += newLine;
    prompttext += "However, we are in the process of adding new advance solving techniques to crack this kind of difficult puzzles.";
    prompttext += newLine;
    prompttext += newLine;
    prompttext += "Please help us by sending us your puzzle as originally ingressed to leonardogonzalezbello@gmail.com";
    // alert (prompttext);
    document.querySelector(".theMatrix").style.opacity = "0.1"; //This line pretends to solve the Bug introduced by sweetAlerts in v0.4.21, in mobile, the sweetAlert box situated behind the Puzzle grid
    document.querySelector(".theMatrixNotes").style.opacity = "0.1"; 
    Swal.fire({
      icon: 'error',
      title: 'WE ARE SORRY! :(',
      text: prompttext,
      footer: `BTW... if you know what should be the next step to solve it, even better :)`
    })
    document.querySelector(".theMatrix").style.opacity = "1"; 
    document.querySelector(".theMatrixNotes").style.opacity = "1"; 
  };

};

export { solvingProcess };