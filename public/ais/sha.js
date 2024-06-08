// AIs are only allowed to import from ai-info-gate.js. Do not import from any other file.

import { getActionsInfo, getBoardInfo, getBombsInfo, getFiresInfo, getPlayersInfo, getTileTypesInfo} from "../ai-info-gate.js";


// Variable to store the assigned player id when creating the AI object.
var my_id;

// Function to create the AI decision maker object. Must return an object with a get_action function.
export function makeAi(id) {
  my_id = id;
  return {
    get_action: get_action,
  };
}

let movesSinceLastCloseBomb = 0;
    const boardInfo = getBoardInfo();
    const tileTypesInfo = getTileTypesInfo();
    const playersInfo = getPlayersInfo();
    const actionsInfo = getActionsInfo();
    const bombsInfo = getBombsInfo();
    const firesInfo = getFiresInfo();
    // define 2D array
    var playerPos = [];
  const possibleMoves = [];
  const recommendedMoves = [];
// Returns the AI-s chosen action. For legal actions see the list of possible actions.
// Use methods from ai-info-gate.js to get information about the game state.
function get_action() {

for (let i = 0; i < boardInfo.length; i++) {
  const row = boardInfo[i];
  for (let j = 0; j < row.length; j++) {
    switch (j) {
      case my_id:
        playerPos = [i,j];
        break;
      case tileTypesInfo.wall:
    
      default:
        break;
    }
  }
 checkTilesInRadius(); 
 findBombsCloseBy();

if (movesSinceLastCloseBomb > 10) {
  movesSinceLastCloseBomb = 0;
  return actionsInfo.bomb;
}
 if (recommendedMoves.length > 0) {
  return recommendedMoves[Math.floor(Math.random() * recommendedMoves.length)];
 }
 return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
}
}

function checkTilesInRadius() {
  // check up
  if (checkTile(playerPos[0] - 1, playerPos[1])) {
    possibleMoves.push(actionsInfo.up);
  }
  // check right
  if (checkTile(playerPos[0], playerPos[1] + 1)) {
    possibleMoves.push(actionsInfo.right);
  }

  // check down
  if (checkTile(playerPos[0] + 1, playerPos[1])) {
    possibleMoves.push(actionsInfo.down);
  }

  // check left
  if (checkTile(playerPos[0], playerPos[1] - 1)) {
    possibleMoves.push(actionsInfo.left);
  }
}

function checkTile(x, y) {
  if (x < 0 || x > 14 || y < 0 || y > 14) {
    return false;
  }
  return boardInfo[x][y] === tileTypesInfo.empty;
}

function findBombsCloseBy() {
  if (bombsInfo.length === 0) {
    movesSinceLastCloseBomb++;
    return;
  }

  for (let bomb of bombsInfo) {
    if (bomb.x < playerPos[0] + 3 && bomb.x > playerPos[0] - 3 && bomb.y < playerPos[1] + 3 && bomb.y > playerPos[1] - 3) {
      continue;
    }

      let highestScoringMove = 0;
      let highestMove = -1;
    for (let move of possibleMoves) {
      const moveCoordinates = getCoordinatesOfMove(move);
      if (getAbsoluteDistanceFromBomb(bomb, moveCoordinates[0], moveCoordinates[1]) > highestScoringMove) {
        highestMove = move;
      }
    }
    if (getAbsoluteDistanceFromBomb(bomb, playerPos[0], playerPos[1]) > highestScoringMove) {
      highestMove = actionsInfo.no_action;
    }

    if (highestMove !== -1) {
      recommendedMoves.push(highestMove);
    }
  }
}
function getAbsoluteDistanceFromBomb(bomb, moveX, moveY) {
  return Math.abs(bomb.x - moveX) + Math.abs(bomb.y - moveY);
}

function getCoordinatesOfMove(move) {
  switch (move) {
    case actionsInfo.up:
      return [playerPos[0] - 1, playerPos[1]];
    case actionsInfo.right:
      return [playerPos[0], playerPos[1] + 1];
    case actionsInfo.down:
      return [playerPos[0] + 1, playerPos[1]];
    case actionsInfo.left:
      return [playerPos[0], playerPos[1] - 1];
  }
}