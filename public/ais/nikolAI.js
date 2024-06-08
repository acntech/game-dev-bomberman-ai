// AIs are only allowed to import from ai-info-gate.js. Do not import from any other file.
import {getActionsInfo, getBoardInfo, getBombsInfo, getFiresInfo, getPlayersInfo } from "../ai-info-gate.js";

// Define possible moves
const MOVES = ["UP", "DOWN", "LEFT", "RIGHT", "BOMB", "WAIT"];
const tileTypes = {
    empty: 0,
    stone: 6,
    wood: 5,
    player1: 1,
    player2: 2,
    player3: 3,
    player4: 4,
  };

// Define a function to calculate utility for each move
function calculateUtility(board, fires, bombs, players, aiPos, move) {
    let utility = 0;

    // Example factors affecting utility
    switch (move) {
        case "UP":
            utility += evaluateUp(board, fires, bombs, players, aiPos);
            break;
        case "DOWN":
            utility += evaluateDown(board, fires, bombs, players, aiPos);
            break;
        case "LEFT":
            utility += evaluateLeft(board, fires, bombs, players, aiPos);
            break;
        case "RIGHT":
            utility += evaluateRight(board, fires, bombs, players, aiPos);
            break;
        case "BOMB":
            utility += evaluateBomb(board, fires, bombs, players, aiPos);
            break;
        case "WAIT":
            utility += evaluateWait(board, fires, bombs, players, aiPos);
            break;
    }

    return utility;
}

// Define evaluation functions for each move
function evaluateUp(board, fires, bombs, players, aiPos) {
    let utility = 0;
    const {x, y} = aiPos;

    if (y === 0 || isWall(board, x, y-1) || isFire(fires, x, y-1)) return -Infinity;

    if (tileIsEmptyAndNotFire(board, fires, x, y-1)) utility += 1;

    if (rowHasBomb(bombs, y-1)) utility -= 1;

    if (wasPrevLocation(x, y-1)) utility -= 1;

    return utility;
}

function evaluateDown(board, fires, bombs, players, aiPos) {
    let utility = 0;
    const {x, y} = aiPos;

    if (y === 14 || isWall(board, x, y+1) || isFire(fires, x, y+1)) return -Infinity;

    if (tileIsEmptyAndNotFire(board, fires, x, y+1)) utility += 1;

    if (rowHasBomb(bombs, y+1)) utility -= 1;

    if (wasPrevLocation(x, y+1)) utility -= 1;

    return utility;
}

function evaluateLeft(board, fires, bombs, players, aiPos) {
    let utility = 0;
    const {x, y} = aiPos;

    if (x === 0 || isWall(board, x-1, y) || isFire(fires, x-1, y)) return -Infinity;

    if (tileIsEmptyAndNotFire(board, fires, x-1, y)) utility += 1;

    if (colHasBomb(bombs, x-1)) utility -= 1;

    if (wasPrevLocation(x-1, y)) utility -= 1;

    return utility;
}

function evaluateRight(board, fires, bombs, players, aiPos) {
    let utility = 1;
    const {x, y} = aiPos;

    if (x === 14 || isWall(board, x+1, y) || isFire(fires, x+1, y)) return -Infinity;

    if (tileIsEmptyAndNotFire(board, fires, x+1, y)) utility += 1;

    if (colHasBomb(bombs, x+1)) utility -= 1;

    if (wasPrevLocation(x+1, y)) utility -= 1;

    return utility;
}

function evaluateBomb(board, fires, bombs, players, aiPos) {
    let utility = 0;

    if (hasEscapeRoute(board, fires, aiPos) && isNextToWood(board, aiPos) && !isOnBomb(bombs, aiPos)) utility += 5;

    // Add logic to evaluate the utility of planting a bomb
    return utility;
}

function evaluateWait(board, fires, players) {
    let utility = 0;
    // Add logic to evaluate the utility of waiting
    return utility;
}

// Main function to select the best move
function selectBestMove() {
    let bestMove = null;
    let highestUtility = -Infinity;

    // GAME STATE
    const board = getBoardInfo();
    const bombs = getBombsInfo();
    const fires = getFiresInfo();
    const players = getPlayersInfo();
    const aiPos = getAIPos(players);

    for (let move of MOVES) {
        let utility = calculateUtility(board, fires, bombs, players, aiPos, move);
        if (utility > highestUtility) {
            highestUtility = utility;
            bestMove = move;
        }
    }

    prev_pos = aiPos;

    console.log("BEST MOVE", bestMove, highestUtility);
    return bestMove;
}

// Variable to store the assigned player id when creating the AI object.
var my_id;
var prev_pos;

// Function to create the AI decision maker object. Must return an object with a get_action function.
export function makeAi(id) {
  my_id = id;
  return {
    get_action: get_action,
  };
}

// Returns the AI-s chosen action. For legal actions see the list of possible actions.
// Use methods from ai-info-gate.js to get information about the game state.
function get_action() {
    // your code goes here
    // Example usage
    const move = selectBestMove();

    switch(move) {
        case "UP":
            return getActionsInfo().up;
        case "DOWN":
            return getActionsInfo().down;
        case "LEFT":
            return getActionsInfo().left;
        case "RIGHT":
            return getActionsInfo().right;
        case "BOMB":
            return getActionsInfo().bomb;
        case "WAIT": 
            return getActionsInfo().no_action;
    }
}

function rowHasBomb(bombs, row) {
    return bombs.find(bomb => bomb.y == row);
}

function colHasBomb(bombs, col) {
    return bombs.find(bomb => bomb.x == col);
}

function tileIsEmptyAndNotFire(board, fires, x, y) {
    return board[y][x] === tileTypes.empty && !fires.some(fire => fire.x === x && fire.y === y);
}

function getAIPos(players) {
    return players.find(player => player.id == my_id);
}

function isNextToWood(board, aiPos) {
    const {x, y} = aiPos;
    const adjacentTiles = [
        {x: x-1, y: y},
        {x: x+1, y: y},
        {x: x, y: y-1},
        {x: x, y: y+1},
    ]

    return adjacentTiles.some(tile => {
        if (isOutsideBoard(tile)) return false
        if (board[tile.y][tile.x] == tileTypes.wood) return true;
        return false;
    });
}

function hasEscapeRoute(board, fires, aiPos) {
    const {x, y} = aiPos;
    const possibleEscapeRoutes = [
        [{x: x-1, y: y}, {x: x-1, y: y-1}],
        [{x: x-1, y: y}, {x: x-1, y: y+1}],
        [{x: x+1, y: y}, {x: x+1, y: y-1}],
        [{x: x+1, y: y}, {x: x+1, y: y+1}],
        [{x: x-1, y: y}, {x: x-2, y: y}, {x: x-2, y: y-1}],
        [{x: x-1, y: y}, {x: x-2, y: y}, {x: x-2, y: y+1}],
        [{x: x+1, y: y}, {x: x+2, y: y}, {x: x+2, y: y-1}],
        [{x: x+1, y: y}, {x: x+2, y: y}, {x: x+2, y: y-1}],
        [{x: x, y: y-1}, {x: x-1, y: y-1}],
        [{x: x, y: y-1}, {x: x+1, y: y-1}],
        [{x: x, y: y+1}, {x: x-1, y: y-1}],
        [{x: x, y: y+1}, {x: x+1, y: y-1}],
        [{x: x, y: y+1}, {x: x, y: y+2}, {x: x+1, y: y+2}],
        [{x: x, y: y+1}, {x: x, y: y+2}, {x: x-1, y: y+2}],
        [{x: x, y: y-1}, {x: x, y: y-2}, {x: x+1, y: y-2}],
        [{x: x, y: y-1}, {x: x, y: y-2}, {x: x-1, y: y-2}],
    ];

    return possibleEscapeRoutes.some(newPosSeq => {
        return newPosSeq.every(newPos => {
            if (isOutsideBoard(newPos)) return false;
            return tileIsEmptyAndNotFire(board, fires, newPos.x, newPos.y);
        });
    })
    /*
    return possibleEscapeRoutes.some(escapeRoute => {
        if (x + escapeRoute.xDir < 0 || x + escapeRoute.xDir > 14) return false;
        if (y + escapeRoute.yDir < 0 || y + escapeRoute.yDir > 14) return false;

        return (tileIsEmptyAndNotFire(board, fires, x + escapeRoute.xDir, y) || tileIsEmptyAndNotFire(board, fires, x, y + escapeRoute.yDir)) && tileIsEmptyAndNotFire(board, fires, x + escapeRoute.xDir, y + escapeRoute.yDir);
    })
    */
}

function wasPrevLocation(x, y) {
    if (!prev_pos) return false;

    return prev_pos.x == x && prev_pos.y == y;
}

function isWall(board, x, y) {
    return board[y][x] == tileTypes.stone;
}

function isFire(fires, x, y) {
    return fires.some(fire => fire.x == x && fire.y == y);
}

function isOutsideBoard(pos) {
    return pos.x < 0 || pos.x > 14 || pos.y < 0 || pos.y > 14;
}

function isOnBomb(bombs, aiPos) {
    return bombs.some(bomb => bomb.x === aiPos.x && bomb.y === aiPos.y);
}

////////////////// TESTS ///////////////////
const testBoard = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,6,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,5,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [5,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
]

const testFires = [{x: 0, y: 0}, {x: 1, y: 0}];

console.log("TEST1 skal være true", hasEscapeRoute(testBoard, testFires, {x: 0, y: 2}));

