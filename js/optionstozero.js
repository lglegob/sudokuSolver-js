import * as recurrent from "./recurrentfunctions.js"

//Here, it is mark as zero, each cell in the same row, which contains the currentcellvalue as option yet
const optionzeroinrow = (row, currentcellvalue, theMatrixStep) => {
  theMatrixStep[row].forEach(function(column_item) {
    column_item[currentcellvalue] = 0;
  });
return theMatrixStep;
}

//Here, it is mark as zero, each cell in the same column, which contains the currentcellvalue as option yet
const optionzeroincolumn = (column, currentcellvalue, theMatrixStep) => {
  for (let row_within_column = 0; row_within_column < 9; row_within_column++) {
    theMatrixStep[row_within_column][column][currentcellvalue] = 0;
  };
  return theMatrixStep;
};

//Here, it is mark as zero, each cell in the same block(square), which contains the currentcellvalue as option yet
const optionzeroinsquare = (row, column, currentcellvalue, theMatrixStep) => {
  const {fromrow, maximumrow, fromcolumn, maximumcolumn} = recurrent.definesquarecoordinatesRC(row, column);
  for (let square_row = fromrow; square_row <= maximumrow; square_row++) {
    for (let square_column = fromcolumn; square_column <= maximumcolumn; square_column++) {
      theMatrixStep[square_row][square_column][currentcellvalue] = 0;
    };
  };
  return theMatrixStep;
};

export { optionzeroinrow, optionzeroincolumn, optionzeroinsquare };