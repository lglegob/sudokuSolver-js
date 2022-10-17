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
    ywing.yWingRow();
  };
};

export { solvingProcess };