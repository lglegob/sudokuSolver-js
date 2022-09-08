
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

export { definesquarecoordinatesRC, definesquarecoordinatesSQ };

