// AIs are only allowed to import from ai-info-gate.js. Do not import from any other file.


// Variable to store the assigned player id when creating the AI object.
import {
    getActionsInfo,
    getBoardInfo,
    getBombsInfo,
    getFiresInfo,
    getPlayersInfo,
    getTileTypesInfo
  } from "../ai-info-gate.js";
  import {actions} from "../game-state.js";
  
  var my_id;
  let startingMoves = [];
  let startingMoveIndex = 0;
  let bomb_placed = 0
  
  // Function to create the AI decision maker object. Must return an object with a get_action function.
  export function makeAi(id) {
    my_id = id;
  
    return {
      get_action: get_action,
    };
  }
  
  // Generates a set of starting moves based on the initial position
  function generateStartingMoves(position, actions) {
    if (position.x === 0 && position.y === 0){
      return [actions.right, actions.right, actions.bomb, actions.left, actions.left, actions.down, actions.down, actions.no_action,
        actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action,
        actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action,
        actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action,
        actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action,
        actions.bomb, actions.up, actions.up, actions.right, actions.right, actions.down, actions.down, actions.no_action,
        actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action,
        actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action,
        actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action,
        actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action,actions.bomb, actions.up,
      actions.up, actions.left, actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action,
        actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action,
        actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action,
        actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action];
    }
    if (position.x === 14 && position.y === 0){
      return [actions.left, actions.left, actions.bomb, actions.right, actions.right, actions.down, actions.down, actions.no_action,
        actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action,
        actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action,
        actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action,
        actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action,
        actions.bomb, actions.up, actions.up, actions.left, actions.left, actions.down, actions.down, actions.no_action,
        actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action,
        actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action,
        actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action,
        actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action,actions.bomb, actions.up,
        actions.up, actions.right, actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action,
        actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action,
        actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action,
        actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action];
    }
    if (position.x === 0 && position.y === 14){
      return [actions.right, actions.right, actions.bomb, actions.left, actions.left, actions.up, actions.up, actions.no_action,
        actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action,
        actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action,
        actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action,
        actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action,
        actions.bomb, actions.down, actions.down, actions.right, actions.right, actions.up, actions.up, actions.no_action,
        actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action,
        actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action,
        actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action,
        actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action,
        actions.bomb, actions.down,
        actions.down, actions.left, actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action,
        actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action,
        actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action,
        actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action];
    }
    if (position.x === 14 && position.y === 14){
      return [actions.left, actions.left, actions.bomb, actions.right, actions.right, actions.up, actions.up, actions.no_action,
        actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action,
        actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action,
        actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action,
        actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action,
        actions.bomb, actions.down, actions.down, actions.left, actions.left, actions.up, actions.up, actions.no_action,
        actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action,
        actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action,
        actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action,
        actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action,actions.bomb, actions.down,
        actions.down, actions.right, actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action,
        actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action,
        actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action,
        actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action, actions.no_action];
    }
    // Example strategy: Move right 3 times and then down 2 times
    return actions.bomb;
  }
  
  let currentDirection = { x: 1, y: 0 };
  
  // Returns the AI-s chosen action. For legal actions see the list of possible actions.
  // Use methods from ai-info-gate.js to get information about the game state.
  function get_action() {
    if (startingMoves.length === 0) {
      const players = getPlayersInfo();
      const actions = getActionsInfo();
      const ai = players.find((p) => p.id === my_id);
  
      if (ai) {
        const aiPosition = {x: ai.x, y: ai.y};
        startingMoves = generateStartingMoves(aiPosition, actions);
        console.log("Generated Starting Moves:", startingMoves);
      }
    }
  
    const board = getBoardInfo();
    const actions = getActionsInfo();
    const bombs = getBombsInfo();
    const fire = getFiresInfo();
    const players = getPlayersInfo();
    const tileTypes = getTileTypesInfo();
  
    console.log("Starting Move Index:", startingMoveIndex);
    console.log("Starting Moves:", startingMoves);
  
    // Execute starting moves if any
    if (startingMoveIndex < startingMoves.length) {
      const move = startingMoves[startingMoveIndex];
      console.log("Executing Starting Move:", move);
      startingMoveIndex++;
      return move;
    }
  
    const aiPosition = players.find((p) => p.id === my_id);
  
    console.log("AI Position:", aiPosition);
  
    // Check for nearby bombs
    const isBombNearby = bombs.some((bomb) => {
      const distance = Math.abs(bomb.x - aiPosition.x) + Math.abs(bomb.y - aiPosition.y);
      return distance <= 4;
    });
  
    const isFireNearby = fire.some((fire) => {
      const distance = Math.abs(fire.x - aiPosition.x) + Math.abs(fire.y - aiPosition.y);
      return distance <= 2;
    });
  
    const isMovePossible = (direction) => {
      const {x, y} = direction;
      const newX = aiPosition.x + x;
      console.log(newX)
      const newY = aiPosition.y + y;
      console.log(newY)
      return newX >= 0 && newX < board[0].length && newY >= 0 && newY < board.length && board[newY][newX] === tileTypes.empty;
    };
  
    if (isFireNearby) {
      if (isMovePossible({
        x: 1,
        y: 0
      }) && fire.some((fire) => fire.x < aiPosition.x && Math.abs(fire.y - aiPosition.y) <= 1)) {
        currentDirection = {x: 1, y: 0};
        return actions.right; // Move right to avoid bomb to the left
      } else if (isMovePossible({
        x: -1,
        y: 0
      }) && fire.some((fire) => fire.x > aiPosition.x && Math.abs(fire.y - aiPosition.y) <= 1)) {
        currentDirection = {x: -1, y: 0};
        return actions.left; // Move left to avoid bomb to the right
      } else if (isMovePossible({
        x: 0,
        y: 1
      }) && fire.some((fire) => fire.y < aiPosition.y && Math.abs(fire.x - aiPosition.x) <= 1)) {
        currentDirection = {x: 0, y: 1};
        return actions.down; // Move down to avoid bomb above
      } else if (isMovePossible({
        x: 0,
        y: -1
      }) && fire.some((fire) => fire.y > aiPosition.y && Math.abs(fire.x - aiPosition.x) <= 1)) {
        currentDirection = {x: 0, y: -1};
        return actions.up; // Move up to avoid bomb below
      }
    }
  
    if (isBombNearby) {
      if (isMovePossible({
        x: 1,
        y: 0
      }) && bombs.some((bomb) => bomb.x < aiPosition.x && Math.abs(bomb.y - aiPosition.y) <= 1)) {
        currentDirection = {x: 1, y: 0};
        return actions.right; // Move right to avoid bomb to the left
      } else if (isMovePossible({
        x: -1,
        y: 0
      }) && bombs.some((bomb) => bomb.x > aiPosition.x && Math.abs(bomb.y - aiPosition.y) <= 1)) {
        currentDirection = {x: -1, y: 0};
        return actions.left; // Move left to avoid bomb to the right
      } else if (isMovePossible({
        x: 0,
        y: 1
      }) && bombs.some((bomb) => bomb.y < aiPosition.y && Math.abs(bomb.x - aiPosition.x) <= 1)) {
        currentDirection = {x: 0, y: 1};
        return actions.down; // Move down to avoid bomb above
      } else if (isMovePossible({
        x: 0,
        y: -1
      }) && bombs.some((bomb) => bomb.y > aiPosition.y && Math.abs(bomb.x - aiPosition.x) <= 1)) {
        currentDirection = {x: 0, y: -1};
        return actions.up; // Move up to avoid bomb below
      }
    }
  
    const isPlayerNearby = players.some((player) => {
      if (player.id === my_id) return false; // Skip checking against self
      const distance = Math.abs(player.x - aiPosition.x) + Math.abs(player.y - aiPosition.y);
      return distance <= 2;
    });
  
    if (isPlayerNearby) {
      return actions.bomb
    }
  
    const isMoveSafe = (direction) => {
      const { x, y } = direction;
      const newX = aiPosition.x + x;
      const newY = aiPosition.y + y;
  
      // Check if the move is within the board bounds and not a wood tile
      if (
          newX >= 0 &&
          newX < board[0].length &&
          newY >= 0 &&
          newY < board.length &&
          board[newY][newX] !== tileTypes.wood
      ) {
        // Check if there is a bomb nearby the destination tile
        return !bombs.some((bomb) => Math.abs(bomb.x - newX) <= 1 && Math.abs(bomb.y - newY) <= 1);
         // Safe move
      }
      return false; // Move outside the board or onto a wood tile
    };
  
    const r = Math.floor(Math.random() * 4);
  
    if (aiPosition.x === 4 && (aiPosition.y === 0 || aiPosition.y ===14) && currentDirection.y === 0 && r===1 && isMoveSafe({x: 0, y: 1})){
      currentDirection = {x: 0, y: 1};
      return actions.down
    }
    else if (aiPosition.x === 6 && (aiPosition.y === 0 || aiPosition.y ===14) && currentDirection.y === 0 && r===2 && isMoveSafe({x: 0, y: 1})){
      currentDirection = {x: 0, y: 1};
      return actions.down
    }
    else if (aiPosition.x === 8 && (aiPosition.y === 0 || aiPosition.y ===14) && currentDirection.y === 0 && r===3 && isMoveSafe({x: 0, y: 1})){
      currentDirection = {x: 0, y: 1};
      return actions.down
    }
  
    if (aiPosition.y === 4 && (aiPosition.x === 0 || aiPosition.x === 14) && currentDirection.x === 0 && r===1 && isMoveSafe({x: 1, y: 0})){
      currentDirection = {x: 1, y: 0};
      return actions.right
    }
    else if (aiPosition.y === 6 && (aiPosition.x === 0 || aiPosition.x === 14) && currentDirection.x === 0 && r===2 && isMoveSafe({x: 1, y: 0})){
      currentDirection = {x: 1, y: 0};
      return actions.right
    }
    else if (aiPosition.y === 8 && (aiPosition.x === 0 || aiPosition.x === 14) && currentDirection.x === 0 && r===3 && isMoveSafe({x: 1, y: 0})){
      currentDirection = {x: 1, y: 0};
      return actions.right
    }
  
  
      while (isMovePossible(currentDirection)) {
        if (!isBombNearby && !isFireNearby && !isMoveSafe(currentDirection)){
          return actions.no_action
        }
        else if (currentDirection.x === 1) {
          return actions.right;
        } else if (currentDirection.y === 1) {
          return actions.down;
        } else if (currentDirection.x === -1) {
          return actions.left;
        } else if (currentDirection.y === -1) {
          return actions.up;
        }
      }
  
      if (currentDirection.x === 1) {
        if (isMovePossible({x: 0, y: -1})){
          currentDirection = {x: 0, y: -1};
        }
        else {currentDirection = {x: 0, y: 1};}
        if (aiPosition.x === 14){
          return actions.down
        }
        return actions.bomb
      }
      if (currentDirection.y === -1){
        if (isMovePossible({x: -1, y: 0})){
          currentDirection = {x: -1, y: 0}
        }
        else {currentDirection = {x: 1, y: 0}}
        if (aiPosition.y === 0){
          return actions.right
        }
        return actions.bomb}
      if (currentDirection.x === -1) {
        if (isMovePossible({x: 0, y: 1})){
          currentDirection = {x: 0, y: 1}
        }
        else {currentDirection = {x: 0, y: -1}}
        if (aiPosition.x === 0){
          return actions.down
        }
        return actions.bomb
      }
      if (currentDirection.y === 1) {
        if (isMovePossible({x: 1, y: 0})){
          currentDirection = {x: 1, y: 0}
        }
        else {currentDirection = {x: -1, y: 0}}
        if (aiPosition.y === 14){
          return actions.left
        }
        return actions.bomb
      }
  
      if (isMovePossible({x: 1, y: 0})) {
        currentDirection = {x: 1, y: 0};
        return actions.right
      } else if (isMovePossible({x: 0, y: 1})) {
        currentDirection = {x: 0, y: 1};
        return actions.down
      } else if (isMovePossible({x: -1, y: 0})) {
        currentDirection = {x: -1, y: 0};
        return actions.left
      } else if (isMovePossible({x: 0, y: 1})) {
        currentDirection = {x: 0, y: 1};
        return actions.down
      } else if (isMovePossible({x: 0, y: -1})) {
        currentDirection = {x: 0, y: -1};
        return actions.up
      }
  
      return actions.down;
  
    }