'use strict';

//SUDOKU PUZZLE SEEDS

//SOLVED 133
const seed001Numbers = "7----29---3--4----2--1----8--5--7---42-----35---3--8--5----4--9----8--5---12----7";
const seed001String = "g----bi---c--d----b--a----h--e--g---db-----ce---c--h--e----d--i----h--e---ab----g";

//SOLVED - Example Locked Candidates Square to Column 119
const seed002Numbers = "--9-7-----8-4-------3----281-----67--2--13-4--4---78--6---3-----1-------------284";
const seed002String = "--i-g-----h-d-------c----bha-----fg--b--ac-d--d---gh--f---c-----a-------------bhd";

//SOLVED 7svd07 - with 5 discarding in series Very Difficult puzzle 96
const seed003Numbers = "----84-7----1--5--8--5--3-45-----637-7--1--5-629-----84-5--2--1--7--1----6-89----";
const seed003String = "----hd-g----a--e--h--e--c-de-----fcg-g--a--e-fbi-----hd-e--b--a--g--a----f-hi----";

//SOLVED 7svd09 with X-Wing 4 corners puzzle 219
const seed004Numbers = "--65-34-----86---1-------58-28--5-7----4-1----5-7--12-43-------5---48-----73-65--";
const seed004String = "--fe-cd-----hf---a-------eh-bh--e-g----d-a----e-g--ab-dc-------e---dh-----gc-fe--";

//SOLVED - Solvable only with several Y-Wings 416
const seed005Numbers = "9---4-------6---31-2-----9----7---2---29356---7---2----6-----7351---9-------8---9";
const seed005String = "i---d-------f---ca-b-----i----g---b---bicef---g---b----f-----gcea---i-------h---i";

//SOLVED - Triple Hidden Row. Without it, it is unsolvable https://www.youtube.com/watch?v=o3PQrNecoag
const seed006Numbers = "9-----7----84-5----5---2--38---9------4---6------1---25--8---4----7-98----2-----7";
const seed006String = "i-----g----hd-e----e---b--ch---i------d---f------a---be--h---d----g-ih----b-----g";

//SOLVED! Very Difficult puzzle
const seed007Numbers = "-3--45-----769--5---6-----7--1-6--3-9--5-8--1-4--1-5--6-----3---8--562-----97--6-";
const seed007String = "-c--de-----gfi--e---f-----g--a-f--c-i--e-h--a-d--a-e--f-----c---h--efb-----ig--f-";

//SOLVED Obvious and Hidden Triples IPAD app
const seed008Numbers = "--4----57------39----1-6---1-59-----94-2----1-----3---26---8----8----7-----5---2-";

//SOLVED 7svd05 141
const seed009Numbers = "---9--315-31-2--8-----3-4----38------6-----4------61----8-6-----7--8-52-615--9---";



//=======================================

//Testing Duplicated Values
const duplicatedValue = "---6-4----3-7--7-75-6-1-----2-7--54----43-6-----------8-5----1--431-5-----1-6---2";

//SOLVED
const hard03str = "7--24----36-----------9378-2--------83-4-2-59--------3-2531-----------17----58--4";

//SOLVED with just detecting singles (No notes shown)
const expert01str = "---5--1--5-6132---9-------8-----79-3---91----7---8--5-37-2-------------6-2-----45";

//SOLVED
const expert02str = "--4---7-38--9-2----3--------891-----5-------8-----926--------2----8-4--56-5---1--";

//SOLVED 157 Steps, mutiple Nishios!
const multipleNishios = "000208006900050800020000090037080000500040003000070680010000040009030002400507000"

//SOLVED 214 Steps, multiple Nishios!
const multipleNishios214 = "000000167000300090009002003001500300300941008004008900100200500040005000758000000"

//SOLVED 93 steps, 7 Dead Ends Nishios
const sevenDeadEnds = "800004006030600070006020300300107080008040700060208009003070900010002050700400003"


//=======================================

//NOT SOLVED YET This is getting to Step 37 after locked candidate column to square (Xwing first)
const hard02str = "---6-4----3----2--5-6-1-----2-7--54----43-6-----------8-5----1--431-5-----1-6---2";

//NOT SOLVED YET Very Difficult puzzle
const expert05str = "86----5------6--7-3-9--4-1----4--3--98-3-5-41--7--2----2-5--1-8-4--2------8----62";

//NOT SOLVED YET Hardest Sudoku Ever https://abcnews.go.com/blogs/headlines/2012/06/can-you-solve-the-hardest-ever-sudoku
const hardestSudokuEver = "8----------36------7--9-2---5---7-------457-----1---3---1----68--85---1--9----4--";

//NOT SOLVED (IPad app) need guessing
const ipadsudoku = "-4--932---------6-1--4----5-----6-------38-9-----4-8---7-5--9-642-----5-5-------7";

export default { seed001String, seed002String, seed003String, seed004String, seed005String, seed006String, seed007String, seed004Numbers };