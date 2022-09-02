# sudokuSolver-js

Repository dedicated for the building of a Sudoku Solver based on JavaScript

![Sudoku Image](/images/6710716.jpg)

## Change Control and Versioning

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
