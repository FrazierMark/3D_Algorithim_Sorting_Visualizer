import '../css/main.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'lil-gui';
// // Calls init() on load
// document.addEventListener('DOMContentLoaded', function () {
//     init();
// }, false);

// /*----- DOM Elements -----*/
// const player1_TurnToken = document.querySelector(".player1_token")
// const player2_TurnToken = document.querySelector(".player2_token")

// const musicBtn = document.querySelector('.music')
// const startResetBtn = document.querySelector(".start_reset")
// const winLoseDrawMsg = document.querySelector('.win_lose_draw')

// const column0 = document.getElementsByClassName('column0')
// const column1 = document.getElementsByClassName('column1')
// const column2 = document.getElementsByClassName('column2')
// const column3 = document.getElementsByClassName('column3')
// const column4 = document.getElementsByClassName('column4')
// const column5 = document.getElementsByClassName('column5')
// const column6 = document.getElementsByClassName('column6')


// /*----- State Variables -----*/
// let gameBoard = [];
// // 2D Matrix - 6 x 7, after init() gameBoard filled with 0s to represent empty/blank cells
// // [
// //     [0,0,0,0,0,0,0] = gameBoard[0]
// //     [0,0,0,0,0,0,0] = gameBoard[1]
// //     [0,0,0,0,0,0,0] = gameBoard[3]
// //     [0,0,0,0,0,0,0] = gameBoard[4]
// //     [0,0,0,0,0,0,0] = gameBoard[5]
// //     [0,0,0,0,0,0,0] = gameBoard[6]
// // ]

// let winner = false;
// let draw = false;

// let player1_Turn = true;
// let player2_Turn = false;

// const rowHeight = 6
// const columnLength = 7

// let lastColumnClicked = [];

// let soundTrackPlaying = false;
// let music = new Audio(soundTrack);
// music.loop = true
// music.volume = 0.7
// let yellowSound = new Audio(yellowTrack)
// yellowSound.loop = false
// yellowSound.volume = 0.3
// let redSound = new Audio(redTrack)
// redSound.loop = false
// redSound.volume = 0.3
// let winSound = new Audio(winTone)
// winSound.loop = false
// winSound.volume = 0.5
// let drawSound = new Audio(drawTone)
// drawSound.loop = false
// drawSound.volume = 0.5
// let allColumns = [column0, column1, column2, column3, column4, column5, column6]

// /*-----Event Listeners-----*/
// startResetBtn.addEventListener('click', init);
// musicBtn.addEventListener('click', playMusic);

// // Adds eventListener on each cell
// for (const column of allColumns) {
//     for (const cell of column) {
//         cell.addEventListener('click', dropToken);
//     }
// }

// // Sets initial state variables 
// function init(e) {
//     startResetBtn.innerText = 'Restart Game?'
//     // If another game just ended, this clears the board
//     clearGameBoard()

//     // Initialize 2D matrix of (0)s
//     for (let i = 0; i < 6; i++) {
//         gameBoard.push(new Array(7).fill(0))
//     }
// }

// //aka handleClick, fires when a column/cell is clicked
// function dropToken(e) {
//     // Gets specific clicked cell (an array of [Row, Column])
//     const cellIdx = getCellIdx(e)
//     // Gets Column index from that array
//     const columnIdxClicked = cellIdx[1]
//     // Returns an Index of lowest available slot if any
//     let indexToUpdate = getAvailableSlot(columnIdxClicked)
//     // checkPlayerTurn() returns either 1 or -1, indicating player's move
//     // We record the player's move to gameBoard at the lowest available slot
//     gameBoard[indexToUpdate[0]][indexToUpdate[1]] = checkPlayerTurn()
//     // We save this cellIdx in a global variable to later be used in the render function to color red or yellow (over-written each click)
//     lastColumnClicked = [indexToUpdate[0], indexToUpdate[1]]
//     render()
// }

// function render() {
//     //Colors each cell based on player's move
//     updateDomGameBoard()
//     updateTurn()
//     //Renders a display message if there's a Winner or a Draw
//     winLoseDrawMsg.innerText = displayEndMessage(checkWinner(), checkDraw())
//     if (winner == true || draw == true) {
//         winLoseDrawMsg.classList.remove('endGameMsgDisable')
//         playSoundFX()
//         startResetBtn.innerText = `Play again?`
//     }
// }

// function updateDomGameBoard() {
//     // We construct the classNames of approprite Idx from the lastColumnClicked
//     let classNames = [`row${lastColumnClicked[0]}`, `column${lastColumnClicked[1]}`]
//     // We use those 2 classNames to grab the correct DOM element/cell 
//     let cellToColor = document.getElementsByClassName(`${classNames[0]} ${classNames[1]}`)
//     // Color that cell based on player's turn
//     if (player1_Turn) {
//         cellToColor[0].classList.add('red')
//     } else {
//         cellToColor[0].classList.add('yellow')
//     }
//     // Play Sci-fi sound on color change
//     playSoundFX()
// }

// // Takes 2 functions as arguments, functions indicate winner or draw
// function displayEndMessage(winner, draw) {
//     if (winner) {
//         if (winner[0] == 1) {
//             //Highlights winning 4 cells in blue if there is a winner
//             highlightWinner(winner)
//             return `Player 1 WINS!!`
//         } else if (winner[0] == -1) {
//             highlightWinner(winner)
//             return `Player 2 WINS!!`
//         }
//     } else if (draw) {
//         return `DRAW! Play again?`
//     }
// }

// // Called by displayEndMessage(), indicates if there is a draw or not
// function checkDraw() {
//     // check if we have no 0s in gameBoard AND no winner
//     let checkNums = []
//     // Collects all current gameBoard cell info into an array
//     for (let i = rowHeight - 1; i > -1; i--) {
//         for (let j = columnLength - 1; j > -1; j--) {
//             checkNums.push(gameBoard[i][j])
//         }
//     }
//     if (!checkNums.includes(0) && winner == false) {
//         draw = true
//         return true
//     } else {
//         return false
//     }
// }

// // Called by displayEndMessage(), indicates if there is a winner by finding 4 identical cells in a row
// function checkWinner() {
//     /*-----Horizontal Check-----*/
//     // Check every single row...
//     for (let i = 0; i < rowHeight; i++) {
//         // Then check the first 4 cells in the row (no need to check past column 4 cause grid is not that large)
//         for (let j = 0; j < columnLength - 3; j++) {
//             // If four sequential cells add up to either -4 (player 2) or 4 (player 1), we have a winner
//             if (gameBoard[i][j] + gameBoard[i][j + 1] + gameBoard[i][j + 2] + gameBoard[i][j + 3] == -4 ||
//                 gameBoard[i][j] + gameBoard[i][j + 1] + gameBoard[i][j + 2] + gameBoard[i][j + 3] == 4) {
//                 winner = true;
//                 // returns -1 or 1 to indicate winner, AND an array of Indexs to later highLightWinner()
//                 return [gameBoard[i][j], `${i}${j}`, `${i}${j + 1}`, `${i}${j + 2}`, `${i}${j + 3}`]
//             }
//         }
//     }

//     /*-----Vertical Check-----*/
//     for (let i = 0; i < rowHeight - 3; i++) {
//         for (let j = 0; j < columnLength; j++) {
//             if (gameBoard[i][j] + gameBoard[i + 1][j] + gameBoard[i + 2][j] + gameBoard[i + 3][j] == -4 ||
//                 gameBoard[i][j] + gameBoard[i + 1][j] + gameBoard[i + 2][j] + gameBoard[i + 3][j] == 4) {
//                 winner = true;
//                 return [gameBoard[i][j], `${i}${j}`, `${i + 1}${j}`, `${i + 2}${j}`, `${i + 3}${j}`]
//             }
//         }
//     }

//     /*-----Diagonal Check (top-left to bottom-right) -----*/
//     for (let i = 3; i < rowHeight; i++) {
//         for (let j = 0; j < columnLength - 2; j++) {
//             if (gameBoard[i][j] + gameBoard[i - 1][j + 1] + gameBoard[i - 2][j + 2] + gameBoard[i - 3][j + 3] == -4 ||
//                 gameBoard[i][j] + gameBoard[i - 1][j + 1] + gameBoard[i - 2][j + 2] + gameBoard[i - 3][j + 3] == 4) {
//                 winner = true;
//                 return [gameBoard[i][j], `${i}${j}`, `${i - 1}${j + 1}`, `${i - 2}${j + 2}`, `${i - 3}${j + 3}`]
//             }
//         }
//     }

//     /*-----Diagonal Check (top-right to bottom-left) -----*/
//     for (let i = 0; i < rowHeight - 3; i++) {
//         for (let j = 0; j < columnLength - 2; j++) {
//             if (gameBoard[i][j] + gameBoard[i + 1][j + 1] + gameBoard[i + 2][j + 2] + gameBoard[i + 3][j + 3] == -4 ||
//                 gameBoard[i][j] + gameBoard[i + 1][j + 1] + gameBoard[i + 2][j + 2] + gameBoard[i + 3][j + 3] == 4) {
//                 winner = true;
//                 return [gameBoard[i][j], `${i}${j}`, `${i + 1}${j + 1}`, `${i + 2}${j + 2}`, `${i + 3}${j + 3}`];
//             }
//         }
//     }

// }

// // Accepts an array of winning Indexs from checkWinner()
// function highlightWinner(winningFour) {
//     // We remove 1st element (not needed)
//     winningFour.shift()
//     // We get the classNames of the winning cells
//     winningFour.forEach(cell => {
//         let winningCellClassNames = [`row${cell[0]}`, `column${cell[1]}`]
//         // We grab the correct DOM cell based on those classes
//         let cellToHighlight = document.getElementsByClassName(`${winningCellClassNames[0]} ${winningCellClassNames[1]} `)
//         // We highlight winning cells by adding a css class
//         cellToHighlight[0].classList.add('winningHighlight')
//     })
// }

// // Resets our state variables when the init() function runs
// function clearGameBoard() {
//     gameBoard = []
//     winner = false;
//     draw = false;
//     lastColumnClicked = [];
//     // Removes endGame message if it's displayed
//     if (!winLoseDrawMsg.classList.contains('endGameMsgDisable')) {
//         winLoseDrawMsg.classList.add('endGameMsgDisable')
//     }
//     // Resets game button text
//     startResetBtn.innerText = `Restart Game?`
//     // Removes colored cells from DOM gameBoard
//     for (const column of allColumns) {
//         for (const cell of column) {
//             cell.classList.remove('yellow');
//             cell.classList.remove('red');
//             cell.classList.remove('winningHighlight')
//         }
//     }
// }

// // Checks for available space in Column clicked,
// // Returns lowest available cell if it's not full 
// function getAvailableSlot(columnIdxClicked) {
//     // Iterates through each row of the column clicked and searches for 0 (indicating empty)
//     for (let i = 5; i > -1; i--) {
//         if (gameBoard[i][columnIdxClicked] == 0) {
//             return [i, columnIdxClicked]
//         }
//     }
//     // Displays an alert if column is full
//     alert(`Column full, dummy.`)
// }

// // (e) past from dropToken(e) to getCellIdx
// // Returns an array of [Row, Column]
// function getCellIdx(cell) {
//     // gets classList of DOM object clicked
//     const classArray = cell.target.classList
//     // we can get the index of the cell from the classList
//     const rowClass = classArray[1];
//     const colClass = classArray[2];
//     // string to int
//     const rowIdx = parseInt(rowClass[3]);
//     const colIdx = parseInt(colClass[6]);
//     return [rowIdx, colIdx];
// };

// // Simply returns 1 (red) if it's player 1's turn or 2 (yellow) if player 2's
// function checkPlayerTurn() {
//     if (player1_Turn == true) {
//         return 1 // red
//     } else {
//         return -1 // yellow
//     }
// }

// // Updates the player's turn indicator on the DOM
// function updateTurn() {
//     if (player1_Turn == true) {
//         player1_Turn = false;
//         player1_TurnToken.classList.remove('red')
//         player2_Turn = true;
//         player2_TurnToken.classList.add('yellow')
//     } else {
//         player2_Turn = false;
//         player2_TurnToken.classList.remove('yellow')
//         player1_Turn = true;
//         player1_TurnToken.classList.add('red')
//     }
// }

// // If music button pressed, we play music!
// function playMusic() {
//     if (soundTrackPlaying == false) {
//         music.load()
//         music.play()
//             .then(() => {
//                 soundTrackPlaying = true
//             }).catch(error => {
//                 console.log(error)
//             })
//     } else if (soundTrackPlaying == true) {
//         music.pause()
//         soundTrackPlaying = false
//     }
// }

// // 4 SoundFXs that play at each player's turn AND at Win or Draw
// function playSoundFX() {
//     if (player1_Turn == true && winner == false) {
//         redSound.load()
//         redSound.play()
//             .then(() => {
//                 // sound fx played
//             }).catch(error => {
//                 console.log(error)
//             })
//     } else if (player2_Turn == true && winner == false) {
//         yellowSound.load()
//         yellowSound.play()
//             .then(() => {
//                 // sound fx played
//             }).catch(error => {
//                 console.log(error)
//             })
//     } else if (winner == true) {
//         winSound.load()
//         winSound.play()
//             .then(() => {
//                 // sound fx played
//             }).catch(error => {
//                 console.log(error)
//             })
//     } else if (draw == true) {
//         drawSound.load()
//         drawSound.play()
//             .then(() => {
//                 // sound fx played
//             }).catch(error => {
//                 console.log(error)
//             })
//     }
// }



/*
 * WebGL / ThreeJS - Background Animation
 */

// Some of this is derived from Bruno Simon's 3JS Journey, 
// Source: https://threejs-journey.com/

// Canvas
const canvas = document.querySelector('canvas.webgl')

