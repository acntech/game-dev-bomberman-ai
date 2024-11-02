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

// Returns the AI-s chosen action. For legal actions see the list of possible actions.
// Use methods from ai-info-gate.js to get information about the game state.
function get_action() {
  const board = getBoardInfo();
  const actions = getActionsInfo();
  const bombs = getBombsInfo();
  const fire = getFiresInfo();
  const players = getPlayersInfo();
  const tileTypes = getTileTypesInfo();
    // your code goes here
}

//Examples of functions that could be useful, feel free to change them to suit your own needs or make something
// entirely different:
function getAIPos(players) {
  return players.find((p) => p.id === my_id);
}
function isOutsideBoard(x, y) {
  return x < 0 || x > 14 || y < 0 || y > 14;
}
function isBombInRange(x, y) {
  const bombs = getBombsInfo();
  for (const bomb of bombs) {
    // Check if the tile is in the same column as the bomb and within 3 tiles vertically
    if (bomb.x === x && Math.abs(bomb.y - y) <= 3) {
      return true;
    } else if (bomb.y === y && Math.abs(bomb.x - x) <= 3) {
      // Check if the tile is in the same row as the bomb and within 3 tiles horizontally
      return true;
    }
  }
  return false;
}
function isFireInRange(x, y) {
  const fires = getFiresInfo();
  for (const fire of fires) {
    // Check if the tile is in the same column as the fire and within 2 tiles vertically
    if (fire.x === x && Math.abs(fire.y - y) <= 2) {
      return true;
    } else if (fire.y === y && Math.abs(fire.x - x) <= 2) {
      // Check if the tile is in the same row as the fire and within 2 tiles horizontally
      return true;
    }
  }
  return false;
}
function isPlayerNearby(x, y){
  const players = getPlayersInfo();
  for (const player of players){
    const distance = Math.abs(player.x - x) + Math.abs(player.y - y);
    if (distance <=2 && player.id !== my_id){ // Skip checking against self
      return true;
    }
  }
}