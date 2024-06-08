import { getActionsInfo, getBoardInfo, getBombsInfo, getFiresInfo, getPlayersInfo, getTileTypesInfo } from "../ai-info-gate.js";
// AIs are only allowed to import from ai-info-gate.js. Do not import from any other file.


// Variable to store the assigned player id when creating the AI object.
var my_id;

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
  console.log("board: ", board);
  console.log("bombs: ", bombs);
  // console.log(fire);
  // console.log(players);
  // console.log(tileTypes);
  // Sjekk om bombe er under, til høyre, venstre, over eller nedenfor
  const me = players.find((p) => p.id === my_id);
  console.log("me: ", me);
  const closestBomb = bombs.find((b) => Math.abs(b.x - me.x) <= 3 || Math.abs(b.y - me.y) <= 3);
  // console.log("closestBomb: ", closestBo;
  if (closestBomb === undefined) {
    if (ActiveFire(me, fire)) {
      return actions.no_action;
    }
    // const quadrant = getCurrentQuadrant(me);
    // switch (quadrant) {
    //   case "upperLeft":
    //     console.log("I am in the upper left quadrant");
    //     if (RightMovePossble(me, board) && me.x !== 7) {
    //       console.log("No bombs, moving right")
    //       return actions.right;
    //     }
    //     if (DownMovePossible(me, board)) {
    //       console.log("No bombs, moving down")
    //       return actions.down;
    //     }
    //     console.log("No valid moves, placing bomb")
    //     return actions.bomb;
    //   case "upperRight":
    //     console.log("I am in the upper right quadrant");
    //     if (LeftMovePossible(me, board)) {
    //       console.log("No bombs, moving left")
    //       return actions.left;
    //     }
    //     if (DownMovePossible(me, board)) {
    //       console.log("No bombs, moving down")
    //       return actions.down;
    //     }
    //     console.log("No valid moves, placing bomb")
    //     return actions.bomb;
    //   case "lowerLeft":
    //     console.log("I am in the lower left quadrant");
    //     if (RightMovePossble(me, board)) {
    //       console.log("No bombs, moving right")
    //       return actions.right;
    //     }
    //     if (UpMovePossible(me, board)) {
    //       console.log("No bombs, moving up")
    //       return actions.up;
    //     }
    //     console.log("No valid moves, placing bomb")
    //     return actions.bomb;
    //   case "lowerRight":
    //     console.log("I am in the lower right quadrant");
    //     if (LeftMovePossible(me, board)) {
    //       console.log("No bombs, moving left")
    //       return actions.left;
    //     }
    //     if (UpMovePossible(me, board)) {
    //       console.log("No bombs, moving up")
    //       return actions.up;
    //     }
    //     console.log("No valid moves, placing bomb")
    //     return actions.bomb;
    // }
    const r = Math.floor(Math.random() * 2);
    switch (r){
      case 0:
        if (RightMovePossble(me, board)) {
          console.log("No bombs, moving right")
          return actions.right;
        }
        if (DownMovePossible(me, board)) {
          console.log("No bombs, moving down")
          return actions.down;
        }
        console.log("No valid moves, placing bomb")
        return actions.bomb;
      case 1:
        if (DownMovePossible(me, board)) {
          console.log("No bombs, moving down")
          return actions.down;
        }
        if (RightMovePossble(me, board)) {
          console.log("No bombs, moving right")
          return actions.right;
        }
        console.log("No valid moves, placing bomb")
        return actions.bomb;
    }
  }
  if (!InDanger(bombs, me)) {
    return actions.no_action;
  }


  // DANGER
  const bombDirection = getBombDirection(me, closestBomb);
  switch (bombDirection) {
    case "onTop":
      console.log("I am on top of a bomb!");
      if (LeftMovePossible(me, board)) {
        return actions.left;
      }
      if (DownMovePossible(me, board)) {
        return actions.down;
      }
    case "under":
      console.log("Bomb is under me!");
      if (UpMovePossible(me, board)) {
        return actions.up;
      }
      if (RightMovePossble(me, board)) {
        return actions.right;
      }
      return actions.left;
    case "over":
      console.log("Bomb is over me!");
      if (DownMovePossible(me, board)) {
        return actions.down;
      }
      if (RightMovePossble(me, board)) {
        return actions.right;
      }
      return actions.left;
    case "right":
      console.log("Bomb is to the right of me!");
      if (LeftMovePossible(me, board)) {
        console.log("I can move left!");
        return actions.left;
      }
      if (UpMovePossible(me, board)) {
        console.log("I can move up!");
        return actions.up;
      }
      console.log("I must move down!");
      return actions.down;
    case "left":
      console.log("Bomb is to the left of me!");
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

function getCurrentQuadrant(me) { // dobbelsjekk denne
  if (me.x <= 7 && me.y <= 7) {
    return "upperLeft";
  } else if (me.x > 7 && me.y <= 7) {
    return "upperRight";
  } else if (me.x <= 7 && me.y > 7) {
    return "lowerLeft";
  } else {
    return "lowerRight";
  }
}
function decideMove(me, board, actions) {
  const possibleMoves = [
    { move: actions.right, check: RightMovePossble },
    { move: actions.down, check: DownMovePossible },
    { move: actions.left, check: LeftMovePossible },
    { move: actions.up, check: UpMovePossible }
  ];

  // Shuffle the array of moves
  shuffleArray(possibleMoves);

  for (const { move, check } of possibleMoves) {
    if (check(me, board)) {
      console.log(`No bombs, moving ${move}`);
      return move;
    }
  }

  // Default action if no conditions are met (optional)
  console.log("No valid moves available");
  return actions.stay;
}
// Function to shuffle the array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
function ActiveFire(me, fire) {
  if (fire.length === 0) {
    return false;
  }
  return true;
}

function RightMovePossble(me, board) {
  if (me.x === 14) {
    return false;
  }
  //if (board[me.x+1][me.y] === 0) {
  if (board[me.y][me.x+1] === 0) {
    console.log("Right move is possible!")
    return true;
  }
  return false;
}
function LeftMovePossible(me, board) {
  if (me.x === 0) {
    return false;
  }
  //if (board[me.x-1][me.y] === 0) {
  if (board[me.y][me.x-1] === 0) {
    return true;
  }
  return false;
}
function UpMovePossible(me, board) {
  if (me.y === 0) {
    return false;
  }
  //if (board[me.x][me.y-1] === 0) {
  if (board[me.y-1][me.x] === 0) {
    return true;
  }
  return false;
}
function DownMovePossible(me, board) {
  if (me.y === 14) {
    return false;
  }
  //if (board[me.x][me.y+1] === 0) {
  if (board[me.y+1][me.x] === 0) {
    return true;
  }
  return false;
}

function getBombDirection(me, bomb) {
  if (bomb.x === me.x && bomb.y === me.y) {
    return "onTop"
    // on top
  } else if (bomb.x == me.x) {
    // check left or right
    if (bomb.y > me.y) {
      return "under";
    }
    return "over";
  } else if (bomb.y == me.y) {
    // check up or down
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
      console.log("I am in danger!")
      return true;
    }
    if (bomb.x === me.x && Math.abs(bomb.y - me.y) <= 2) {// danger in Y direction
      console.log("I am in danger!")
      return true;
    }
  }
  console.log("I am not in danger!")
  return false;
}