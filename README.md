# sudokuSolver-js

Repository dedicated for the configuration and development of a Sudoku Solver based on JavaScript

![Sudoku Image](/images/6710716.jpg)

## Change Control and Versioning

### Version 0.0.6a (Branch adding-rollback - Time Dimension) 2022-09-06

- Variable step created to define the rollback steps the user can go back
- Time Dimension added to the Matrix, with the definition of step
- step 0 is the initial state of the sudoku, subsequent steps are each of the changes on theMatrix, by adding cell solutions or discarding notes values

### Version 0.0.6 (Input Listener, initial styling) 2022-09-05

- A new input listener with loop is define to "listen" when the matrix is initially changed to enable the validate a custom matrix option
- The algorithms to enable or disable the action buttons are defined, depending in which state is the Matrix and possible actions.
- It is define in the HTML a new section to show the messages.
- Initial Styling is applied to the Matrix to show the blocks, and to resize with a 1:1 ratio all the cells
- The show notes is change to be a toggle button to be able to show or hide the notes of the matrix at will.

### Version 0.0.5 (Discard methods, notes shown) 2022-09-04

- 3 new discard methods defined, to find obvious pairs per Row, per Column and per square
- New function newfoundvalueHTML for showing in the html, the information for each new value
- New function discardedvaluesHTML for showing logs when finding possibles values to discard
- New feature of showing in screen the snotes for each cell, Button and Listener added.
- New function to hide temporarily the notes and return to the main matrix in screen
- Variable discardnotessucces added to also detect one pair of related values to be discarded per iteration
- Internal grid (3x3) per each cell added to show the notes

### Version 0.0.4 (Row, column and square methods) 2022-09-02

- 3 new solving methods defined (hidden singles per row, hidden singles pero column, and hidden singles per square)
- Solving already tested with an expert sudoku game succesfully.
- Se elimina el juego de numeros por defecto del html, y ahora se carga por JS
- Para la carga se agrega boton de carga, y se define const con los valores en el JS
- Se agrega variable iterationsuccess para detener la resolucion paso a paso, y no por olas de metodo

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
