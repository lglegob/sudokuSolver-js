'use strict';
import globalVar from "./globalVar.js";
import * as recurrent from "./recurrentFunctions.js";
import * as singles from "./solvingStrategiesSingles.js";
import * as obviousPairs from "./solvingStrategiesObviousPairs.js";
import * as hiddenPairs from "./solvingStrategiesHiddenPairs.js";
import * as obviousTriples from "./solvingStrategiesObviousTriples.js";
import * as hiddenTriples from "./solvingStrategiesHiddenTriples.js";
import * as obviousQuads from "./solvingStrategiesObviousQuadruples.js";
import * as hiddenQuads from "./solvingStrategiesHiddenQuadruples.js";
import * as lockedCandidates from "./solvingStrategiesLockedCandidate.js";
import * as xwing from "./solvingStrategiesXWing.js";
import * as ywing from "./solvingStrategiesYWing.js";
import * as swordFish from "./solvingStrategiesSwordFish.js";
import * as finnedXWing from "./solvingStrategiesFinnedXWing.js";
import * as nishio from "./solvingStrategiesNishio.js";



////////////////////////////////////////////////////////////////////////////////
//                            SOLVING PROCESS                                //
//////////////////////////////////////////////////////////////////////////////

const solvingProcess = () => {

  //NISHIO GUESSING METHOD
  if (globalVar.nishioGuessingActive.evaluating === true) {
    nishio.nishioChecking();
  };

  //NAKED SINGLE METHOD
  if (globalVar.iterationSuccess === false && globalVar.discardNoteSuccess === false) {
    singles.singleCandidate();
  };

  //HIDDEN SINGLE METHODS
  if (globalVar.iterationSuccess === false && globalVar.discardNoteSuccess === false) {
    singles.hiddenSinglesRow();
  };
  if (globalVar.iterationSuccess === false && globalVar.discardNoteSuccess === false) {
    singles.hiddenSinglesColumn();
  };
  if (globalVar.iterationSuccess === false && globalVar.discardNoteSuccess === false) {
    singles.hiddenSinglesSquare();
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

  //OBVIOUS TRIPLE METHODS
  if (globalVar.iterationSuccess === false && globalVar.discardNoteSuccess === false) {
    obviousTriples.obviousTriplesRow();
  };
  if (globalVar.iterationSuccess === false && globalVar.discardNoteSuccess === false) {
    obviousTriples.obviousTriplesColumn();
  };
  if (globalVar.iterationSuccess === false && globalVar.discardNoteSuccess === false) {
    obviousTriples.obviousTriplesSquare();
  };

  //HIDDEN TRIPLE METHODS
  if (globalVar.iterationSuccess === false && globalVar.discardNoteSuccess === false) {
    hiddenTriples.hiddenTriplesRow();
  };
  if (globalVar.iterationSuccess === false && globalVar.discardNoteSuccess === false) {
    hiddenTriples.hiddenTriplesColumn();
  };
  if (globalVar.iterationSuccess === false && globalVar.discardNoteSuccess === false) {
    hiddenTriples.hiddenTriplesSquare();
  };

  //OBVIOUS QUADRUPLE METHODS
  if (globalVar.iterationSuccess === false && globalVar.discardNoteSuccess === false) {
    obviousQuads.obviousQuadsRow();
  };
  if (globalVar.iterationSuccess === false && globalVar.discardNoteSuccess === false) {
    obviousQuads.obviousQuadsColumn();
  };
  if (globalVar.iterationSuccess === false && globalVar.discardNoteSuccess === false) {
    obviousQuads.obviousQuadsSquare();
  };

  //HIDDEN QUADRUPLE METHODS
  if (globalVar.iterationSuccess === false && globalVar.discardNoteSuccess === false) {
    hiddenQuads.hiddenQuadruplesRow();
  };
  if (globalVar.iterationSuccess === false && globalVar.discardNoteSuccess === false) {
    hiddenQuads.hiddenQuadruplesColumn();
  };
  if (globalVar.iterationSuccess === false && globalVar.discardNoteSuccess === false) {
    hiddenQuads.hiddenQuadruplesSquare();
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

  //SWORDFISH METHOD
  if (globalVar.iterationSuccess === false && globalVar.discardNoteSuccess === false) {
    swordFish.swordFishColumn();
  };
  if (globalVar.iterationSuccess === false && globalVar.discardNoteSuccess === false) {
    swordFish.swordFishRow();
  };

  //FINNED X-WING CANDIDATES METHOD
  if (globalVar.iterationSuccess === false && globalVar.discardNoteSuccess === false) {
    finnedXWing.finnedXwingRow();
  };
  if (globalVar.iterationSuccess === false && globalVar.discardNoteSuccess === false) {
    finnedXWing.finnedXwingColumn();
  };

  //NISHIO GUESSING METHOD
  if (globalVar.iterationSuccess === false && globalVar.discardNoteSuccess === false && globalVar.nishioGuessingActive.evaluating === true) {
    nishio.previousNishioUnderEvaluation();
  };
  if (globalVar.iterationSuccess === false && globalVar.discardNoteSuccess === false) {
    nishio.nishioGuessing();
  };
  if (globalVar.nishioGuessingActive.evaluating === true) {
    nishio.nishioChecking();
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
    globalVar.stepByStep ? true : recurrent.showSweetAlert("error", "WE ARE SORRY! :(", prompttext, "BTW... if you know what should be the next step to solve it, even better :)");
  };

  globalVar.iterationSuccess = false;
  globalVar.discardNoteSuccess = false;
};

export { solvingProcess };