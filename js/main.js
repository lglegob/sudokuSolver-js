'use strict';
import * as matrixFunctions from "./theMatrixFunctions.js";
import * as eventListeners from "./eventListeners.js";

////////////////////////////////////////////////////////////////////////////////
//                                 MAIN JS                                   //
//////////////////////////////////////////////////////////////////////////////

matrixFunctions.createMatrix();

//Initial state defined in the html, no need to change classes
document.querySelector("#button-validate").disabled = true
document.querySelector("#button-reload").disabled = true
document.querySelector("#button-solveit").disabled = true
document.querySelector("#button-togglenotes").disabled = true
document.querySelector("#button-clear").disabled = true
document.querySelector("#button-togglehighlights").disabled = true

//activate the Listeners
eventListeners.validateMatrixListener();
eventListeners.resetMatrixListener();
eventListeners.resolveMatrixListener();
eventListeners.reloadMatrixListener();
eventListeners.loadMatrixListener();
eventListeners.loadMatrixManuallyListener();
eventListeners.toggleNotesListener();
eventListeners.togglehighlightsListener();
// eventListeners.loadAPISudoku();