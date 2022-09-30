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

//This is getting to Step 15 after locked candidate Square to Row
const hard02 = [
  [1, 4, 6],[1, 6, 4],
  [2, 2, 3],[2, 7, 2],
  [3, 1, 5],[3, 3, 6],[3, 5, 1],
  [4, 2, 2],[4, 4, 7],[4, 7, 5],[4, 8, 4],
  [5, 4, 4],[5, 5, 3],[5, 7, 6],

  [7, 1, 8],[7, 3, 5],[7, 8, 1],
  [8, 2, 4],[8, 3, 3],[8, 4, 1],[8, 6, 5],
  [9, 3, 1],[9, 5, 6],[9, 9, 2]
]
const hard02str = "---6-4----3----2--5-6-1-----2-7--54----43-6-----------8-5----1--431-5-----1-6---2"

//SOLVED
const hard03 = [
  [1, 1, 7],[1, 4, 2],[1, 5, 4],
  [2, 1, 3],[2, 2, 6],
  [3, 5, 9],[3, 6, 3],[3, 7, 7],[3, 8, 8],
  [4, 1, 2],
  [5, 1, 8],[5, 2, 3],[5, 4, 4],[5, 6, 2],[5, 8, 5],[5, 9, 9],
  [6, 9, 3],
  [7, 2, 2],[7, 3, 5],[7, 4, 3],[7, 5, 1],
  [8, 8, 1],[8, 9, 7],
  [9, 5, 5],[9, 6, 8],[9, 9, 4]
]
const hard03str = "7--24----36-----------9378-2--------83-4-2-59--------3-2531-----------17----58--4"

//SOLVED with just detecting singles (No notes shown)
const expert01 = [
  [1, 4, 5],[1, 7, 1],
  [2, 1, 5],[2, 3, 6],[2, 4, 1],[2, 5, 3],[2, 6, 2],
  [3, 1, 9],[3, 9, 8],
  [4, 6, 7],[4, 7, 9],[4, 9, 3],
  [5, 4, 9],[5, 5, 1],
  [6, 1, 7],[6, 5, 8],[6, 8, 5],
  [7, 1, 3],[7, 2, 7],[7, 4, 2],
  [8, 9, 6],
  [9, 2, 2],[9, 8, 4],[9, 9, 5]
]
const expert01str = "---5--1--5-6132---9-------8-----79-3---91----7---8--5-37-2-------------6-2-----45"

//SOLVED
const expert02 = [
  [1, 3, 4],[1, 7, 7],[1, 9, 3],
  [2, 1, 8],[2, 4, 9],[2, 6, 2],
  [3, 2, 3],
  [4, 2, 8],[4, 3, 9],[4, 4, 1],
  [5, 1, 5],[5, 9, 8],
  [6, 6, 9],[6, 7, 2],[6, 8, 6],
  [7, 8, 2],
  [8, 4, 8],[8, 6, 4],[8, 9, 5],
  [9, 1, 6],[9, 3, 5],[9, 7, 1]
]
const expert02str = "--4---7-38--9-2----3--------891-----5-------8-----926--------2----8-4--56-5---1--";

//This is getting to Step 5 after locked candidate Square to Column
const expert03 = [
  [1, 1, 7],[1, 6, 2],[1, 7, 9],
  [2, 2, 3],[2, 5, 4],
  [3, 1, 2],[3, 4, 1],[3, 9, 8],
  [4, 3, 5],[4, 6, 7],
  [5, 1, 4],[5, 2, 2],[5, 8, 3],[5, 9, 5],
  [6, 4, 3],[6, 7, 8],
  [7, 1, 5],[7, 6, 4],[7, 9, 9],
  [8, 5, 8],[8, 8, 5]
  [9, 3, 1],[9, 4, 2],[9, 9, 7]
]
const expert03str = "7----29---3--4----2--1----8--5--7---42-----35---3--8--5----4--9----8--5---12----7"

//Example Locked Candidates Square to Column
const expert04str = "--9-7-----8-4-------3----281-----67--2--13-4--4---78--6---3-----1-------------284"

//hardest Sudoku Ever https://abcnews.go.com/blogs/headlines/2012/06/can-you-solve-the-hardest-ever-sudoku
const hardestSudokuEver = "8----------36------7--9-2---5---7-------457-----1---3---1----68--85---1--9----4--"

export default { hard02str, hard03str, expert01str, expert02str, expert03str, expert04str, hardestSudokuEver };