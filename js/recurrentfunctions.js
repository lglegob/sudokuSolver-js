//Here, it is defined depending of the current cell in analysis, the range of rows and columns to evaluate
const definesquarecoordinatesRC = (row, column) => {
  let fromrow;
  let maximumrow;
  let fromcolumn;
  let maximumcolumn;
  switch (true) {
    case row <= 2:
      fromrow = 0
      maximumrow = 2
      break;
    case row <= 5:
      fromrow = 3
      maximumrow = 5
      break;
    case row <= 8:
      fromrow = 6
      maximumrow = 8
      break;
  };
  switch (true) {
    case column <= 2:
      fromcolumn = 0
      maximumcolumn = 2
      break;
    case column <= 5:
      fromcolumn = 3
      maximumcolumn = 5
      break;
    case row <= 8:
      fromcolumn = 6
      maximumcolumn = 8
      break;
  };
  return {fromrow, maximumrow, fromcolumn, maximumcolumn};
};

//Here, it is defined depending of the square in analysis, the range of rows and columns to evaluate
const definesquarecoordinatesSQ = (square) => {
  let fromrow;
  let maximumrow;
  let fromcolumn;
  let maximumcolumn;
  switch (true) {
    case (square === 1 || square === 4 || square == 7):
      fromcolumn = 0
      maximumcolumn = 2
      break;
    case (square === 2 || square === 5 || square == 8):
      fromcolumn = 3
      maximumcolumn = 5
      break;
    case (square === 3 || square === 6 || square == 9):
      fromcolumn = 6
      maximumcolumn = 8
      break;
  }
  switch (true) {
    case square <= 3:
      fromrow = 0
      maximumrow = 2
      break;
    case square <= 6:
      fromrow = 3
      maximumrow = 5
      break;
    case square <= 9:
      fromrow = 6
      maximumrow = 8
      break;
  };
  return {fromrow, maximumrow, fromcolumn, maximumcolumn};
};

//Function used to add html config with a 9 cells grid per each of the original divs to show the notes of each cell
const shownotes = (theMatrixStep) => {
  for (let row = 0; row <= 8; row++) {
    for (let column = 0; column <= 8; column++) {
      let itemrow = row + 1;
      let itemcolumn = column + 1;
      if (theMatrixStep[row][column][0] === 0) {
        document.querySelector(".row" + itemrow + ".column" + itemcolumn + " input").remove();
        document.querySelector(".row" + itemrow + ".column" + itemcolumn).classList.add("notes")
        let newdivoption = document.createElement("div");
        for (let note = 1; note <= 9; note++) {
          let newnote = document.createElement("p");
          newnote.classList.add(`note${note}`);
          if (theMatrixStep[row][column][note] !== 0) {
            newnote.innerHTML = `
            ${note}
            `;
          }
          newdivoption.append(newnote);
        };
        const main = document.querySelector(".row" + itemrow + ".column" + itemcolumn);
        main.append(newdivoption);
      };
    };
  };
  let togglebutton = document.querySelector("#button-togglenotes");
  togglebutton.innerText = "Hide Notes";
};

//Function used to remove the notes and replace them with the div reserved to the final number (currently blank)
const hidenotes = (theMatrixStep) => {
  for (let row = 0; row <= 8; row++) {
    for (let column = 0; column <= 8; column++) {
      if (theMatrixStep[row][column][0] === 0) {
        let itemrow = row + 1;
        let itemcolumn = column + 1;
        let newdivoption;
        document.querySelector(".row" + itemrow + ".column" + itemcolumn).classList.remove("notes");
        newdivoption = document.createElement("div");
        newdivoption.classList.add("cell", `row${itemrow}`, `column${itemcolumn}`);
        newdivoption.innerHTML = `
        <input type="number" min="1" max="9">
        `;
        const main = document.querySelector(".row" + itemrow + ".column" + itemcolumn);
        main.replaceWith(newdivoption);
      };
    };
  };
  let togglebutton = document.querySelector("#button-togglenotes");
  togglebutton.innerText = "Show Notes";
};

export { definesquarecoordinatesRC, definesquarecoordinatesSQ, shownotes, hidenotes };