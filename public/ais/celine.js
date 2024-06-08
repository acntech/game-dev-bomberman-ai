import { getActionsInfo, getBoardInfo, getBombsInfo, getFiresInfo, getPlayersInfo, getTileTypesInfo } from "../ai-info-gate.js";
// AIs are only allowed to import from ai-info-gate.js. Do not import from any other file.


// Variable to store the assigned player id when creating the AI object.
var my_id;
var activeCorner;

// Function to create the AI decision maker object. Must return an object with a get_action function.
export function makeAi(id) {
  my_id = id;
  return {
    get_action: get_action,
  };
}
const corner = {
  upperLeft: 0,
  upperRight: 1,
  lowerLeft: 2,
  lowerRight: 3,
}

// Returns the AI-s chosen action. For legal actions see the list of possible actions.
// Use methods from ai-info-gate.js to get information about the game state.
function get_action() {
  const board = getBoardInfo(); // Wood = 5, Stone = 6
  const actions = getActionsInfo(); // Up, Down, Left, Right, Bomb
  const bombs = getBombsInfo();
  const fire = getFiresInfo();
  const players = getPlayersInfo();
  const tileTypes = getTileTypesInfo();
  const me = players.find((p) => p.id === my_id);
  activeCorner = getActiveCorner(me, activeCorner);
  console.log("Active corner: ", activeCorner);
  const closestBomb = bombs.find((b) => Math.abs(b.x - me.x) <= 3 || Math.abs(b.y - me.y) <= 3);
  if (closestBomb === undefined) {
    if (ActiveFire(me, fire)) {
      return actions.no_action;
    }
    const r = Math.floor(Math.random() * 2);
    switch (activeCorner) {
      case "upperLeft":
        switch (r){
          case 0:
            if (RightMovePossble(me, board)) {
              // console.log("No bombs, moving right")
              return actions.right;
            }
            if (DownMovePossible(me, board)) {
              // console.log("No bombs, moving down")
              return actions.down;
            }
            // console.log("No valid moves, placing bomb")
            return actions.bomb;
          case 1:
            if (DownMovePossible(me, board)) {
              // console.log("No bombs, moving down")
              return actions.down;
            }
            if (RightMovePossble(me, board)) {
              // console.log("No bombs, moving right")
              return actions.right;
            }
            // console.log("No valid moves, placing bomb")
            return actions.bomb;
        }
      case "upperRight":
        switch (r){
          case 0:
            if (LeftMovePossible(me, board)) {
              // console.log("No bombs, moving left")
              return actions.left;
            }
            if (DownMovePossible(me, board)) {
              // console.log("No bombs, moving down")
              return actions.down;
            }
            // console.log("No valid moves, placing bomb")
            return actions.bomb;
          case 1:
            if (DownMovePossible(me, board)) {
              // console.log("No bombs, moving down")
              return actions.down;
            }
            if (LeftMovePossible(me, board)) {
              // console.log("No bombs, moving left")
              return actions.left;
            }
            // console.log("No valid moves, placing bomb")
            return actions.bomb;
        }
      case "lowerLeft":
        switch (r){
          case 0:
            if (RightMovePossble(me, board)) {
              // console.log("No bombs, moving right")
              return actions.right;
            }
            if (UpMovePossible(me, board)) {
              // console.log("No bombs, moving up")
              return actions.up;
            }
            // console.log("No valid moves, placing bomb")
            return actions.bomb;
          case 1:
            if (UpMovePossible(me, board)) {
              // console.log("No bombs, moving up")
              return actions.up;
            }
            if (RightMovePossble(me, board)) {
              // console.log("No bombs, moving right")
              return actions.right;
            }
            // console.log("No valid moves, placing bomb")
            return actions.bomb;
        }
      case "lowerRight":
        switch (r) {
          case 0:
            if (LeftMovePossible(me, board)) {
              // console.log("No bombs, moving left")
              return actions.left;
            }
            if (UpMovePossible(me, board)) {
              // console.log("No bombs, moving up")
              return actions.up;
            }
            // console.log("No valid moves, placing bomb")
            return actions.bomb;
          case 1:
            if (UpMovePossible(me, board)) {
              // console.log("No bombs, moving up")
              return actions.up;
            }
            if (LeftMovePossible(me, board)) {
              // console.log("No bombs, moving left")
              return actions.left;
            }
            // console.log("No valid moves, placing bomb")
            return actions.bomb;
        }
    }
  }
  if (!InDanger(bombs, me)) {
    return actions.no_action;
  }

  // DANGER
  const bombDirection = getBombDirection(me, closestBomb);
  switch (bombDirection) {
    case "onTop":
      // console.log("I am on top of a bomb!");
      if (LeftMovePossible(me, board)) {
        return actions.left;
      }
      if (DownMovePossible(me, board)) {
        return actions.down;
      }
    case "under":
      // console.log("Bomb is under me!");
      if (UpMovePossible(me, board)) {
        return actions.up;
      }
      if (RightMovePossble(me, board)) {
        return actions.right;
      }
      return actions.left;
    case "over":
      // console.log("Bomb is over me!");
      if (DownMovePossible(me, board)) {
        return actions.down;
      }
      if (RightMovePossble(me, board)) {
        return actions.right;
      }
      return actions.left;
    case "right":
      // console.log("Bomb is to the right of me!");
      if (LeftMovePossible(me, board)) {
        // console.log("I can move left!");
        return actions.left;
      }
      if (UpMovePossible(me, board)) {
        // console.log("I can move up!");
        return actions.up;
      }
      // console.log("I must move down!");
      return actions.down;
    case "left":
      // console.log("Bomb is to the left of me!");
      if (RightMovePossble(me, board)) {
        return actions.right;
      }
      if (UpMovePossible(me, board)) {
        return actions.up;
      }
      return actions.down;
  }
}

// UTILS
function getActiveCorner(me, activeCorner) {
  // console.log("in getActiveCorner, last active corner: ", activeCorner)
  if (me.x === 0 && me.y === 0) {
    return "upperLeft";
  }
  else if (me.x === 14 && me.y === 0) {
    return "upperRight";
  }
  else if (me.x === 0 && me.y === 14) {
    return "lowerLeft";
  }
  else if (me.x === 14 && me.y === 14) {
    return "lowerRight";
  }
  return activeCorner;
}

function ActiveFire(me, fire) { // TODO: Only check danger in the direction of the fire
  if (fire.length === 0) {
    console.log("No fire!")
    return false;
  }
  if (!FireInMyRadius(me, fire)) {
    return false;
  }
  return true;
}
function FireInMyRadius(me, fire) {
  let xMin = me.x - 3;
  let xMax = me.x + 3;
  let yMin = me.y - 3;
  let yMax = me.y + 3;
  
  for (const f of fire) {
    if (f.x <= xMax && f.x >= xMin) {
      console.log("Fire in my radius!")
      return true;
    } else if (f.y <= yMax && f.y >= yMin) {
      console.log("Fire in my radius!")
      return true;
    }
  }
  console.log("No fire in my radius!")
  return false;
}
function FireDangerXmin(fire) {
  return fire.x + 3;
}
function FireDangerXmax(fire) {
  return fire.x - 3;
}
function FireDangerYmin(fire) {
  return fire.y + 3;
}
function FireDangerYmax(fire) {
  return fire.y - 3;
}


function RightMovePossble(me, board) {
  if (me.x === 14) {
    return false;
  }
  if (board[me.y][me.x+1] === 0) {
    return true;
  }
  return false;
}
function LeftMovePossible(me, board) {
  if (me.x === 0) {
    return false;
  }
  if (board[me.y][me.x-1] === 0) {
    return true;
  }
  return false;
}
function UpMovePossible(me, board) {
  if (me.y === 0) {
    return false;
  }
  if (board[me.y-1][me.x] === 0) {
    return true;
  }
  return false;
}
function DownMovePossible(me, board) {
  if (me.y === 14) {
    return false;
  }
  if (board[me.y+1][me.x] === 0) {
    return true;
  }
  return false;
}

function getBombDirection(me, bomb) {
  if (bomb.x === me.x && bomb.y === me.y) {
    return "onTop"
  } else if (bomb.x == me.x) {
    if (bomb.y > me.y) {
      return "under";
    }
    return "over";
  } else if (bomb.y == me.y) {
    if (bomb.x > me.x) {
      return "right";
    }
    return "left";
  }
}

function InDanger(bombs, me) {
  for (const bomb of bombs)
  {
    if (bomb.y === me.y && Math.abs(bomb.x - me.x) <= 2) { // danger in X direction
      // console.log("I am in danger!")
      return true;
    }
    if (bomb.x === me.x && Math.abs(bomb.y - me.y) <= 2) {// danger in Y direction
      // console.log("I am in danger!")
      return true;
    }
  }
  // console.log("I am not in danger!")
  return false;
}