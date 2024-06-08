// AIs are only allowed to import from ai-info-gate.js. Do not import from any other file.


// Variable to store the assigned player id when creating the AI object.
import {getActionsInfo, getBoardInfo, getBombsInfo,getTileTypesInfo} from "../ai-info-gate.js";
import {tileTypes} from "../game-state.js";

var my_id;

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
    const board = getBoardInfo();
    const actions = getActionsInfo();
    const bombs = getBombsInfo();
    // const fire = getFiresInfo();
    // const players = getPlayersInfo();
    const tileTypes = getTileTypesInfo();

    const myPosition = getMyPosition(board);

    const closeBombs = checkIfBombsAreClose(bombs, myPosition);


    if (closeBombs !== null) {
        if (closeBombs.x === myPosition.x) {
            if (closeBombs.y < myPosition.y) {
                return actions.down;
            } else {
                return actions.up;
            }
        }
        if (closeBombs.x < myPosition.x) {
            return actions.right;
        } else {
            return actions.left;
        }
    }
    const isWoodToLeft = checkIfWood(tileTypes, [(myPosition.x-1), myPosition.y]);
    const isWoodToRight = checkIfWood(tileTypes, [(myPosition.x+1), myPosition.y]);
    const isWoodUp = checkIfWood(tileTypes, [myPosition.x, (myPosition.y-1)]);
    const isWoodDown = checkIfWood(tileTypes, [myPosition.x, (myPosition.y+1)]);

    if (isWoodToRight || isWoodToLeft || isWoodUp || isWoodDown) {
        return actions.bomb;
    }

    // return random action
    const r = Math.floor(Math.random() * 4);
    switch (r) {
        case 0:
            return actions.up;
        case 1:
            return actions.down;
        case 2:
            return actions.left;
        case 3:
            return actions.right;
    }

}

function getMyPosition(board) {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
            if (board[i][j] === my_id) {
                return [i, j];
            }
        }
    }
    return null;
}

function checkIfBombsAreClose(bombs, myPosition) {

    const myPositionX = myPosition.x;
    const myPositionY = myPosition.y;

    for (let k = 0; k < bombs.length; k++) {

        if (bombs[k].x === myPositionX && subtract(bombs[k].y, myPositionY) < 3)
            return bombs[k];

        if (bombs[k].y === myPositionY && subtract(bombs[k].x, myPositionX) < 3)
            return bombs[k];
    }
    return null;
}

function subtract(a, b) {
    return Math.abs(a - b);
}

function checkIfOtherPlayerClose() {

}

function checkIfWood(board, pos) {
    return board[pos.x, pos.y] === tileTypes.wood;
}





