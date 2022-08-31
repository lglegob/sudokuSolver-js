// First Step - check NO repeated numbers per row, column and square

// Delete options from rows, columns and squares
// Nested Loops
// Second Step -  check cells with just one option
// Third Step - hidden singles - check rows, columns and squares where any number appears just once
// Fourth Step - check numbers per row and column, that appear only in one of the squares, amd delete the possibilities in any other cell in the square
// Fifth step - check for obvious pairs per row, column and square
// Sixth Step - hidden pairs - square
// Sixth Step - Obvious Triples (even with doubles)

//Loop to create Variables
for (let row = 0; row <= 9; row++) {
    for (let column = 0; column <= 9; column++) {
            window['item' + row + column] = [0, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    };
};

var row1 = [item11, item12, item13, item14, item15, item16, item17, item18, item19]
var row2 = [item21, item22, item23, item24, item25, item26, item27, item28, item29]
var row3 = [item31, item32, item33, item34, item35, item36, item37, item38, item39]
var row4 = [item41, item42, item43, item44, item45, item46, item47, item48, item49]
var row5 = [item51, item52, item53, item54, item55, item56, item57, item58, item59]
var row6 = [item61, item62, item63, item64, item65, item66, item67, item68, item69]
var row7 = [item71, item72, item73, item74, item75, item76, item77, item78, item79]
var row8 = [item81, item82, item83, item84, item85, item86, item87, item88, item89]
var row9 = [item91, item92, item93, item94, item95, item96, item97, item98, item99]

var theMatrix = [row1, row2, row3, row4, row5, row6, row7, row8, row9]

const button_validar = document.querySelector(".button-validar");
const button_resolver = document.querySelector(".button-resolver");
const button_clear = document.querySelector(".button-clear");


// Add event listener to the form submit action
button_validar.addEventListener("click", (e) => {
    // Stop form from reloading the page
    e.preventDefault();
    //Get the value from the form input
    for (let row = 0; row < 9; row++) {
        for (let column = 0; column < 9; column++) {
            itemrow = row + 1;
            itemcolumn = column + 1;
            console.log((".row" + itemrow + ".column" + itemcolumn));
            console.log(document.querySelector(".row" + itemrow + ".column" + itemcolumn));
            let currentCell = document.querySelector(".row" + itemrow + ".column" + itemcolumn);
            currentValue = Number(currentCell.querySelector("input").value);
            theMatrix[row][column] = [currentValue, 1, 1, 1, 1, 1, 1, 1, 1, 1];
        };
    };
    console.log(theMatrix);
});

// Add event listener to the form submit action
button_clear.addEventListener("click", (e) => {
    // Stop form from reloading the page
    e.preventDefault();
    //Get the value from the form input
    for (let row = 0; row < 9; row++) {
        for (let column = 0; column < 9; column++) {
            itemrow = row + 1;
            itemcolumn = column + 1;
            document.querySelector(".row" + itemrow + ".column" + itemcolumn + " input").value = undefined;
        };
    };
});

button_resolver.addEventListener("click", (e) => {
    // Stop form from reloading the page
    e.preventDefault();
    let loopsexecuted = 0

    // Delete notes for the rows
    // First select each row
    for (let row = 0; row < theMatrix.length; row++) {
        for (let column = 0; column < theMatrix[row].length; column++) {
            let currentcellvalue = theMatrix[row][column][0];
                // If the value is different than zero, it has to set as zero that position in every element of the row
            if (currentcellvalue != 0) {
                // since this cell already has a value, all the posibilities are marked zero
                theMatrix[row][column] = [currentcellvalue, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                //Here, we marked zero, each cell in the same row, which contains the currentcellvalue as option yet
                theMatrix[row].forEach(function(column_item) {
                    column_item[currentcellvalue] = 0
                    loopsexecuted++;
                });
            }
        }
    }

    // Delete notes for the columns
    // First select each row
    for (let row = 0; row < theMatrix.length; row++) {
        for (let column = 0; column < theMatrix[row].length; column++) {
            let currentcellvalue = theMatrix[row][column][0];
                // If the value is different than zero, it has to set as zero that position in every element of the column
            if (currentcellvalue != 0) {
                //Here, we marked zero, each cell in the same column, which contains the currentcellvalue as option yet
                for (let row_within_column = 0; row_within_column < theMatrix.length; row_within_column++) {
                    theMatrix[row_within_column][column][currentcellvalue] = 0
                    loopsexecuted++;
                };
            }
        }
    }

    // Delete notes for the squares
    // First select each row
    for (let row = 0; row < theMatrix.length; row++) {
        for (let column = 0; column < theMatrix[row].length; column++) {
            let currentcellvalue = theMatrix[row][column][0];
                // If the value is different than zero, it has to set as zero that position in every element of the same square
            if (currentcellvalue != 0) {
                //Here, we marked zero, each cell in the same column, which contains the currentcellvalue as option yet
                switch (true) {
                    case row <= 2:
                        fromrow = 0
                        maximumrow = 3
                        break;
                    case row <= 5:
                        fromrow = 3
                        maximumrow = 6
                        break;
                    case row <= 8:
                        fromrow = 6
                        maximumrow = 9
                        break;
                }
                switch (true) {
                    case column <= 2:
                        fromcolumn = 0
                        maximumcolumn = 3
                        break;
                    case column <= 5:
                        fromcolumn = 3
                        maximumcolumn = 6
                        break;
                    case row <= 8:
                        fromcolumn = 6
                        maximumcolumn = 9
                        break;
                }

                for (let square_row = fromrow; square_row < maximumrow; square_row++) {
                    for (let square_column = fromcolumn; square_column < maximumcolumn; square_column++) {
                    theMatrix[square_row][square_column][currentcellvalue] = 0
                    loopsexecuted++;
                    };
                };
            }
        }
    }

    for (let row = 0; row < theMatrix.length; row++) {
        for (let column = 0; column < theMatrix[row].length; column++) {
            let currentcellvalue = theMatrix[row][column][0];
            const sum = theMatrix[row][column].reduce(add, 0);
                function add(accumulator, a) {
                return accumulator + a;
                }
                console.log(theMatrix[row][column]);
                console.log(sum-currentcellvalue);
                if (sum-currentcellvalue == 1) {
                    console.log("This item is unique");
                
                //Detect which value is unique and set it as answer
                
                thiscellfoundvalue = theMatrix[row][column].findIndex(
                    (one, index) => one === 1 && index > 0
                )
                console.log(`the value is ${thiscellfoundvalue}`);
                // here the foundvalue is set in theMatrix variable
                theMatrix[row][column][0] = thiscellfoundvalue;
                itemrow = row + 1;
                itemcolumn = column + 1;
                // here the foundvalue is set in the html document to be shown
                document.querySelector(".row" + itemrow + ".column" + itemcolumn + " input").setAttribute("value", thiscellfoundvalue);

                }
                loopsexecuted++;
        };
    };
    console.log(theMatrix);
    console.log(loopsexecuted);
});




