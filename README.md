# sudokuSolver-js

Repository dedicated for the configuration and development of a Sudoku Solver based on JavaScript, by using solution methods like a human would solve it, so to be able to solve each sudoku puzzle like a tutorial, no backtracking algorith.

![Sudoku Image](/images/6710716.jpg)

## Change Control and Versioning

### Version 0.1.5 (bem naming) 2022-09-16

- The functions in separated files renamed to bem convention

---

### Version 0.1.4 (matrixFunctions to separate js file) 2022-09-10

- The functions related to the whole Matrix like create, load, validate, have been taken out to a different js file (matrixFunctions.js)
- there were several parts where the JSON methods for arrays were used several times, they were reduce to just one time, to avoid unnecesary CPU cycles.

---

### Version 0.1.3 (Taking functions to js files) 2022-09-09

- functions showNotes and hideNotes were taken from main.js to recurrentFunctions.js
- new js file created (optionszero.js) where the functions noteZeroRow, noteZeroColumn and noteZeroSquare were taken from main.js to this disagregated file

---

### Version 0.1.2 (type="module" changes) 2022-09-08

- type="module" added to the script, so it can split in several js files
- two recurrent minor functions (defineSquareCoordinatesRC and defineSquareCoordinatesSQ) were taken out to an external js file for testing purposes.
- the data to pre-load the sudoku game is now taken from data.js file
  script.js renamed to main.js

---

### Version 0.1.1 (Minor Style Changes) 2022-09-07

- Small changes to make it more responsive
- Style added to buttons
- active and inactive classes added, to be modified by js, and define different possible actions at each stage

---

### Version 0.1.0 (Branch Merge adding-rollback) 2022-09-06

- adding-rollback branch changes integrated to main branch.

---

### Version 0.0.6b (Branch adding-rollback - Rollback Config) 2022-09-06

- New Function matrixReloaded defined to reload a previous status of the Matrix (previous Steps)
- New Variable defined as stepsinfo, to saved status and infomration of each step towards a final resolution of the Sudoku
- Adjusted configuration to decrease the number of steps and resolvedcells according to the new capability og going back to previous steps
- Correction of theMatrix previous steps (it was being referenced instead of cloned, so any change in the latest state was replicated to all other previous steps in the Matrix (time dimension)), now with the use of JSON methods (parse and stringfy), each of the steps in time of the Matrix is isolated and can be modified.
- overflow-y scroll added to avoid the jump in size ehen the ammount of steps documented in the HTML made the width of the screen to change
- Several changes in style and breakpoints added to change font sizes.

---

### Version 0.0.6a (Branch adding-rollback - Time Dimension) 2022-09-06

- Variable step created to define the rollback steps the user can go back
- Time Dimension added to the Matrix, with the definition of step
- step 0 is the initial state of the sudoku, subsequent steps are each of the changes on theMatrix, by adding cell solutions or discarding notes values

---

### Version 0.0.6 (Input Listener, initial styling) 2022-09-05

- A new input listener with loop is define to "listen" when the matrix is initially changed to enable the validate a custom matrix option
- The algorithms to enable or disable the action buttons are defined, depending in which state is the Matrix and possible actions.
- It is define in the HTML a new section to show the messages.
- Initial Styling is applied to the Matrix to show the blocks, and to resize with a 1:1 ratio all the cells
- The show notes is change to be a toggle button to be able to show or hide the notes of the matrix at will.

---

### Version 0.0.5 (Discard methods, notes shown) 2022-09-04

- 3 new discard methods defined, to find obvious pairs per Row, per Column and per square
- New function newfoundvalueHTML for showing in the html, the information for each new value
- New function discardedvaluesHTML for showing logs when finding possibles values to discard
- New feature of showing in screen the snotes for each cell, Button and Listener added.
- New function to hide temporarily the notes and return to the main matrix in screen
- Variable discardnotessucces added to also detect one pair of related values to be discarded per iteration
- Internal grid (3x3) per each cell added to show the notes

---

### Version 0.0.4 (Row, column and square methods) 2022-09-02

- 3 new solving methods defined (hidden singles per row, hidden singles pero column, and hidden singles per square)
- Solving already tested with an expert sudoku game succesfully.
- Se elimina el juego de numeros por defecto del html, y ahora se carga por JS
- Para la carga se agrega boton de carga, y se define const con los valores en el JS
- Se agrega variable iterationsuccess para detener la resolucion paso a paso, y no por olas de metodo

---

### Version 0.0.3 (Functions and Scope) 2022-09-01

- The complete process is redefined and partitioned in functions to be called.
- Scope of the variables reviewed and statically defined (so, not everything defaults to global variables).
- Use of the 'use strict' to validate previous point.

---

### Version 0.0.2 (Creation of the 3D Matrix is optimized) 2022-08-31

- The 3D Matrix now is created exclusevely by the use of for loops without the use of intermediate variables

---

### Version 0.0.1 (First Functional version) 2022-08-31

- Base structure defined
- the values from the Sudoku grid are being captured in theMatrix variable
- the first resolution series of loops focus on cells with single value options. Just for really Easy Sudokus
