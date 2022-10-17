# sudokuSolver-js

Repository dedicated for the configuration and development of a Sudoku Solver based on JavaScript, by using logical solution methods like a human would solve it. This is to be able to solve each sudoku puzzle that a user ingress, like a tutorial, with step and step explanations and methods definitios. No backtracking algorithm. No brute Force algorithm.

![Sudoku Image](/images/6710716.jpg)

## Change Control and Versioning

### Version 0.4.15 (Y-Wing Discarding) 2022-10-17

- WHAT'S NEW!?

  - Y-Wing discarding strategy added. At this instance it is detecting the row-column pattern. Pending for implementation to include y-Wings that include pincers in squares.
  - For this discarding strategy to work a new js file created for Y-Wing strategies (discardingTechniquesYWing.js), a new notesZero function (noteZeroCell), a new discardProcessFunction (discardYWing), and a new modifyingDOMFunction (discardYWingHTML).

---

### Version 0.4.14 (Randomizing by Columns) 2022-10-16

- WHAT'S NEW!?
- Added the randomize process by Columns

---

### Version 0.4.13 (Random Sudokus! and Checks) 2022-10-16

- WHAT'S NEW!? (Major Upgrade. This one should have been a pull request and change of Numbering)
- The functionality to generate "random" sudokus based on several seeds has been defined. The randomness comes for now from mixing the rows order (between blocks of rows) and mixing the values, by assiging first as letters from a to i, and then randomly assigning them to the 9 numbers.
- Several improvements in code, base on the first flow chart drawn as a draft, where several optimizations have been found like (not creating the divs for theMatrixNotes before really needed)
- The solving process has been defined in a new file (out of the Listeners file) to be give the future functionality of solving the puzzle beforehand and give the users warnings before starting
- The process to check if the puzzle inserted by user is valid has started, the app will show an alert if there are duplicated values within a block (row, column or square)
- The page is no longer hard resetted when encountering with a problem with the initial puzzle, a light reset (Deleting everything inside .theMatrixNotes) is executed to give the user the opportunity to build a right initial puzzle using as base the digits already inserted.

---

### Version 0.4.12 (borders Highlighted) 2022-10-13

- WHAT'S NEW!?
- Dynamic DOM - >The process to highlight by borders the block (cell, row, column or square) currently in evaluation has been defined. It is already showing for each of the current solving processes.
- To execute this highlighting, a new function has been defined (modifyDOM.settingHighlightedBlock)
- Wide modifications in SCSS to achieve the highlighting
- the internal process of reloadMatrix, now use the functions already defined (recurrent.createNewDivInput and recurrent.createNewDivCandidateNotes) to modify theMatrix and theMatrixNotes divs.
- First draft for the color palette defined and used by the highlighting.

---

### Version 0.4.11 (stepsDetails fine tuning) 2022-10-12

- WHAT'S NEW!?
- Dynamic DOM - Giving more details in the DOM for each of the solving steps, so the user understands why some of the sudoku steps
- Styles - Bigger fonts for the GoBack stepDetails buttons
- Code Optimization - Within matrixFunctions.createMatrix, the process to create the divs for theMatrixNotes is not necessary, redundant and duplicated at this point. They are created later when loading the information for the puzzle.

---

### Version 0.4.10 (Standardize ingress Data) 2022-10-11

- Starting to standardize the data ingress process, specifically when the data is ingressed using the input fields, now a new function matrixFunctions.createString creates the string from the input fields. Then it is inserted into the same process (loadMatrix) as when the data is ingressed from pre-defined puzzles or manual (prompt).
- The functions to create the internal div (with input) for theMatrix and the div (with p) for the MatrixNotes are standardized to be using the same in the creation, the load and the normal flow, it just changes if after calling the functions (recurrent.createNewDivInput and recurrent.createNewDivCandidateNotes), we execute an append or a replaceWith.
- recurrent.createNewDivCertainValue and recurrent.reviewCertainValues are deprecated.

---

### Version 0.4.9 (Current Card StepsDetail Format) 2022-10-10

- The format for the current Card has been changed to show it is the most recent.
- The Empty cells in the Matrix with No notes have been filled with an empty div and class "emptycell" so they show transparent when rotating to/from Notes
- Main color nos has been declared as SCSS variable

---

### Version 0.4.8 (Step 0 card) 2022-10-09

- New Step 0 card in stepDetails added, to give clarity about the Sudoku procedure, to standardize the way to go back to a previousstep (including original sudoku) and to have a card already in place for format.
- Grid sizes and distribution changes
- Instructions to fill the sudoku are deleted once the user has executed that process, and the sudoku puzzle is ready to start
- Initial instructions are shown in a card style, so all the time that space is occupied, and the format is standard.

---

### Version 0.4.7 (Highlight last Step) 2022-10-08

- The process to highlight with Colours the changes of the last solving step has been redefined and improved
- Instead of using a checkbox, a new button with its corresponding EventListener togglehighlightsListener has been defined.
- In order to toggle the highlights when reversing steps as well, the already built functions have been used to go back one more step than needed and then solve just one step, so the solving process takes care of defining again the classes needed for highlighting the sudoku puzzle last step changes.
- The buttons style was redefine (new SCSS file hoverMeButton.scss) to match the shadows of the sudoku puzzle
- The Steps details sections styles were redefined to match the shadows of the sudoku puzzle
- The SCSS files (matrixbuttons.scss and placeholders.scss) were eliminated, they contained the rectangular button styles no longer in use

---

### Version 0.4.6 (Go Back to Step X) 2022-10-08

- The whole process to go back to an Specific Step has been defined. Not only limited to previous Step but any previous Step from 1 to currentStep
- For this process a new EventListener goBackToStepListener has been defined, and activate on demand each time a new step is created.

---

### Version 0.4.5 (Font Adjustment) 2022-10-07

- When the scheme changes to a grid of two columns, the fonts were reduced to be growth again in XL size.

---

### Version 0.4.4 (Puzzle Width Adjustment) 2022-10-07

- Light Adjustment to the width of the puzzle to give some margin at the sides
- Light adjustment to the grid, to make the "go back" and Resolve" buttons centered related to the puzzle

---

### Version 0.4.3 (Minor Changes) 2022-10-06

- Separated New discardingDOMFunctions.js file for the DOM related functions
- CSS grid changed to have in large screens the steps below the buttons, and leave only two columns
- Minor changes and improvements to code structure.

---

### Version 0.4.3 (Steps Highlights) 2022-10-06

- WHAT'S NEW?!
- The process to highlight the changes in previous step is extended to highlight the candidates deleted at each step, being careful of also showing those candidate notes not deleted by green.

- FIXED BUGs
- Previous Update broke the capability to fill the sudoku puzzle directly in the cells, since now the HTML is dinamically created at the start, and the event listener did not find anymore the input fields. This has been solved by recolating the event listener position and input-cellvalues const definition

---

### Version 0.4.2 (Dynamic Matrix, highlights) 2022-10-05

- WHAT'S NEW?!
- Solution Methods - 2 New Discarding Techniques added based on the X-Wing Method (for rows, and for columns)
- Visual Highlights - Dynamic class .justFoundCell added when a new cell is solved to be highlighted using CSS
- Automation - The process of creating the HTML code for theMatrix and theMatrixNotes is now added to the function createMatrix, so all that code is deleted from the HTML
- Outputs - The manual method to add a Sudoku Puzzle using the Input cells directly in the HTML, has been improved by showing the ingressed puzzle in console. This way any new puzzle can be copied and pasted for future loads
- Functions - recurrent Function deleteLastShowMe added to help with the visualization process
- Functions - recurrent Function reviewCertainValues added to the Validation process of already certain values. Function to be used to standardize other validation process during the solving in the future.
- Visual Highlights - Code for a Test with Function noteZeroRow added, to add visual highlights to those candidates deleted in previous step _Not yet operational _

- FIXED BUGs
- Previous update broke the process to show notes and certain values when the sudoku puzzle was inserted using the cells in the HTML. To solve it the new function reviewCertainValues as well as reviewnotes and togglenotes are using during the validation process to solve it.

---

### Version 0.4.1 (Sudoku 3D rotate) 2022-10-03

- the 3d Rotation is limited to the complete Sudoku board, as with the individual cells, it became kind of slugish in mobile and it is not that pretty.

---

### Version 0.4.0 (Merge Branch rotateNotes) 2022-10-02

- rotateNotes branch changes integrated to main branch.

---

### Version 0.3.4c (branch rotateNotes Operational) 2022-10-02

- ** This version is ALREADY operational **
- in the HTML, the Matrix and MatrixNotes definitions were optmized to not used one div level and section level to be able to manipulate (if wanted) the 3D effect per value
- Process added to have in the class of each cell the current value
- Changes in CSS to have the rotation based on class .transform-3D-active instead of depending on hover
- Changes in CSS file to rotate based in current value
- Rebuilt of show/hide notes was completed
- the processes to modify the DOM when a value was found or when reloading 1 step, was redefined based on several bugs encounter during the coding process

---

### Version 0.3.4b (branch rotateNotes - Rebuilding Notes) 2022-10-02

- ** This version is not operational **
- In order for the 3D rotation of the Sudoku game to work (and show notes in the back of the card), the whole process of show/hide notes is being rebuilt
- CSS - theMatrixCard3d is being adjusted to work with the Sudoku Game, several sections not applicable in comments
- Several points of the code, the querySelector for .theMatrix was complemented or replace with .theMatrixNotes depending of each case.
- New Function created (recurrent.reviewNotes) to replace the previous functions showNotes and hideNotes, and optimize the process by not calling but functions to refresh the candidates Notes

---

### Version 0.3.4a (branch rotateNotes 3D card introduction) 2022-09-30

- ** This branch version is not operational **
- the 3D model card for the Matrix has been initially introduced

---

### Version 0.3.4 (3 Hidden Pairs Methods) 2022-09-29

- The 3 new methods for Hidden Pairs defined. All candidates in a couple of cells are deleted except for the hidden pair

---

### Version 0.3.3 (New Square Discard Method) 2022-09-28

- The Third Discard Method focused on finding locked candidates has been added (In this case is based on finding locked candidates in squares and delete candidates in rows or columns)
- Configuration added to CSS to avoid arrows in input fields.
- CSS grid added to the configuration and corresponding responsive design for distribution of the buttons, the matrix and the Steps Details (Which are added by js with each resolution step)
- Technique applied in the destructuring of objects to rename them on the fly (CoderAsk tip), based on the following format: const {fromRow:newFromRowName} = functionName(parameters);

---

### Version 0.3.2 (New Discard Method) 2022-09-28

- A new Discard Candidates method has been added. The method of finding locked candidates (from Square to Column), and deleting the candidates within the same square not belonging to that Column. This is complementary to previous method (version updated).

---

### Version 0.3.1 (New Discard Method) 2022-09-27

- A new Discard Candidates method has been added. The method of finding locked candidates (from Square to Row), and deleting the candidates within the same square not belonging to that Row

---

### Version 0.3.0 (Merge Branch optimizeDiscards) 2022-09-27

- optimizeDiscards branch changes integrated to main branch.

---

### Version 0.2.5a (Branch optimizeDiscards) 2022-09-27

- For the 3 Discard obviousPairs Techniques, the first two loops, where the current status is gathered, were consolidated in just 1 function for a general block (row, column or square) called discardingFunctions.gettingDetailedInfo.
- Several other name optimizations for variables to follow bem naming scheme and for the file names.
- Based on the optimization for the 3 obviousPairs discarding techniques, a new technique is being added, which finds the locked candidates (only row for now), this release shows in console the result, next release will discard the corresponding candidates/notes from the Matrix and expand to column and square.

---

### Version 0.2.5 (HTML Found Values Format) 2022-09-26

- Light formatting to the Found Values section in the HTML (New article created for each step solved)
- ID given for each step in the Found Values Section, to be used with the tutorial component to be implemented in future releases.

---

### Version 0.2.4 (2 Main Features) 2022-09-26

- The format for loading the sudoku values from file, was standardized with the one used for the manual method
- The discardTwoCandidates function now consolidates the code for the 3 blocks (row, column and square) when a couple of candidates can be discarded by ObviousPairs process. It probably will be used for hiddenPairs in a future release as well

---

### Version 0.2.3 (Bug Fix) 2022-09-24

- Bug introduced by previous feature added has been fixed
- The functionality to go back one step had stopped working by adding the feature to manually load the sudoku values. To fix it, now the update of values when using going back one step function uses this method: "document.querySelector(".row" + itemrow + ".column" + itemcolumn + " input").value" instead of modifying the attribute
- A new Alert has been added in those cases when the Sudoku cannot be solved yet.

---

### Version 0.2.2 (Manual Sudoku ingress) 2022-09-24

- A new process to ingress the Sudoku by a string of 81 characteres is added with prompt and alert functionality, this also includes a new EventListener and a new function (matrixFunctions.loadMatrixManually)

---

### Version 0.2.1 (eventListeners.js file) 2022-09-23

- EventListeners taken to a new file (eventListeners.js) for simplicity of the main.js file

---

### Version 0.2.0 (Branch Merge convertMatrixes) 2022-09-23

- convertMatrixes branch changes integrated to main branch.

---

### Version 0.1.9a (Branch convertMatrixes Matrix Variables) 2022-09-23

- theMatrix and stepsDetail variables moved to globalVar.js file
- Solving Techniques Functions moved to solvingTechniques.js file
- discarding functions were moved to a new file (discradingTechniques.js)
- With the changes made since v0.1.1 (when the javascript was contained in just one file) main.js file was reduced from more than 900 lines to 146 lines, and disagragated in several lines for organization and code cleanliness.

---

### Version 0.1.9 (Variable areNotesShowing) 2022-09-22

- one more variable (areNotesShowing) migrated to globalVar.js and corresponding changes in the functions, to control the notes shown or not shown.

---

### Version 0.1.8 (Global Variables globalVar.js) 2022-09-22

- two more variables (currentStep and discardNoteSuccess) migrated to globalVar.js and corresponding changes in the functions

---

### Version 0.1.7 (Global Variables globalVar.js) 2022-09-16

- globalVar.js is added to host several real global variables, with this, the process of migrating functions to other files will be easier and cleaner.

---

### Version 0.1.6 (solvingProcessFunctions.js file) 2022-09-16

- The functions cellValueFound and newfoundvalueHTML were taken out to a new file solvingProcessFunctions.js

---

### Version 0.1.5a (fixing Naming files Bug) 2022-09-16

- The files where a letter went from lowercase to uppercase, were not changed in github, so the links broke. The situation is fixed with this commit changing the names of couple of files.

---

### Version 0.1.5 (bem naming) 2022-09-16

- The functions in separated files renamed to bem convention

---

### Version 0.1.4 (matrixFunctions to separate js file) 2022-09-10

- The functions related to the whole Matrix like create, load, validate, have been taken out to a different js file (theMatrixFunctions.js)
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
- New function discardTwoCandidatesHTML for showing logs when finding possibles values to discard
- New feature of showing in screen the snotes for each cell, Button and Listener added.
- New function to hide temporarily the notes and return to the main matrix in screen
- Variable discardnotessucces added to also detect one pair of related values to be discarded per iteration
- Internal grid (3x3) per each cell added to show the notes

---

### Version 0.0.4 (Row, column and square methods) 2022-09-02

- 3 new solving methods defined (hidden singles per row, hidden singles pero column, and hidden singles per square)
- Solving already tested with an expert sudoku game succesfully.
- The default set of numbers is deleted from the html, and now it is loaded using js
- For loading the values a new button is added, a const is defined with the values in the js
- A new variable (iterationsuccess) is added to stop the resolution step by step and not by method waves.

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

---
