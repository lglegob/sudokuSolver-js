'use strict';
let easy01 = [
  [1, 2, 6], [1, 5, 8], [1, 7, 4], [1, 8, 2],
  [2, 2, 1],[2, 3, 5],[2, 5, 6],[2, 7, 3],[2, 8, 7],[2, 9, 8],
  [3, 4, 4],[3, 8, 6],
  [4, 1, 1],[4, 4, 6],[4, 6, 4],[4, 7, 8],[4, 8, 3],
  [5, 1, 3],[5, 3, 6],[5, 5, 1],[5, 7, 7],[5, 9, 5],
  [6, 2, 8],[6, 4, 3],[6, 5, 5],
  [7, 1, 8],[7, 2, 3],[7, 4, 9],[7, 5, 4],
  [8, 2, 7],[8, 3, 2],[8, 4, 1],[8, 5, 3],[8, 7, 9],
  [9, 3, 9],[9, 5, 2],[9, 7, 6],[9, 8, 1]
]

let medium01 = [
  [1, 5, 3],[1, 6, 2],[1, 7, 4],[1, 9, 9],
  [2, 1, 4],[2, 8, 6],
  [3, 1, 9],[3, 2, 1],[3, 3, 2],[3, 6, 4],[3, 9, 8],
  [4, 1, 8],[4, 2, 6],[4, 3, 5],[4, 4, 4],[4, 7, 9],
  [5, 3, 3],[5, 4, 9],[5, 6, 5],[5, 9, 7],
  [6, 5, 8],[6, 7, 2],[6, 8, 5],
  [7, 3, 9],[7, 8, 4],[7, 9, 5],

  [9, 5, 5],[9, 6, 6],[9, 8, 9],[9, 9, 1]
]

let hard01 = [
  [1, 1, 4],[1, 2, 7],[1, 3, 9],[1, 9, 5],

  [3, 1, 5],[3, 4, 7],[3, 9, 9],
  [4, 1, 9],[4, 7, 5],[4, 8, 6],[4, 9, 8],
  [5, 3, 7],[5, 5, 1],[5, 6, 5],
  [6, 3, 4],[6, 6, 3],[6, 8, 9],
  [7, 4, 8],[7, 6, 1],[7, 9, 6],
  [8, 2, 2],[8, 5, 4],
  [9, 3, 1],[9, 7, 4],[9, 8, 7]
]

//This is getting to Step 37 after locked candidate column to square (Xwing first)
const duplicatedValue = "---6-4----3-7--7-75-6-1-----2-7--54----43-6-----------8-5----1--431-5-----1-6---2";

//This is getting to Step 37 after locked candidate column to square (Xwing first)
const hard02str = "---6-4----3----2--5-6-1-----2-7--54----43-6-----------8-5----1--431-5-----1-6---2";

//SOLVED
const hard03str = "7--24----36-----------9378-2--------83-4-2-59--------3-2531-----------17----58--4";

//SOLVED with just detecting singles (No notes shown)
const expert01str = "---5--1--5-6132---9-------8-----79-3---91----7---8--5-37-2-------------6-2-----45";

//SOLVED
const expert02str = "--4---7-38--9-2----3--------891-----5-------8-----926--------2----8-4--56-5---1--";




//NOT SOLVED YET Very Difficult puzzle from https://www.7sudoku.com/very-difficult
const expert05str = "86----5------6--7-3-9--4-1----4--3--98-3-5-41--7--2----2-5--1-8-4--2------8----62";



//NOT SOLVED YET Very Difficult puzzle from https://www.7sudoku.com/very-difficult
const expert07str = "-3--45-----769--5---6-----7--1-6--3-9--5-8--1-4--1-5--6-----3---8--562-----97--6-";



//hardest Sudoku Ever https://abcnews.go.com/blogs/headlines/2012/06/can-you-solve-the-hardest-ever-sudoku
const hardestSudokuEver = "8----------36------7--9-2---5---7-------457-----1---3---1----68--85---1--9----4--";



//SEEDS

//SOLVED
const seed001Numbers = "7----29---3--4----2--1----8--5--7---42-----35---3--8--5----4--9----8--5---12----7";
const seed001String = "--i-g-----h-d-------c----bha-----fg--b--ac-d--d---gh--f---c-----a-------------bhd";

//SOLVED - Example Locked Candidates Square to Column
const seed002Numbers = "--9-7-----8-4-------3----281-----67--2--13-4--4---78--6---3-----1-------------284";
const seed002String = "--i-g-----h-d-------c----bha-----fg--b--ac-d--d---gh--f---c-----a-------------bhd";

//SOLVED - with 5 discarding in series Very Difficult puzzle from https://www.7sudoku.com/very-difficult
const seed003Numbers = "----84-7----1--5--8--5--3-45-----637-7--1--5-629-----84-5--2--1--7--1----6-89----";
const seed003String = "----hd-g----a--e--h--e--c-de-----fcg-g--a--e-fbi-----hd-e--b--a--g--a----f-hi----";

//SOLVED - with X-Wing 4 corners puzzle - Very Difficult puzzle from https://www.7sudoku.com/very-difficult
const seed004Numbers = "--65-34-----86---1-------58-28--5-7----4-1----5-7--12-43-------5---48-----73-65--"
const seed004String = "--fe-cd-----hf---a-------eh-bh--e-g----d-a----e-g--ab-dc-------e---dh-----gc-fe--"

export default { seed001String, seed002String, seed003String, seed004String, seed004Numbers, hard02str, hard03str, expert01str, expert02str, expert05str, expert07str, hardestSudokuEver, duplicatedValue };