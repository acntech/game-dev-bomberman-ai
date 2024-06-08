// AIs are only allowed to import from ai-info-gate.js. Do not import from any other file.
import { getActionsInfo, getBoardInfo, getBombsInfo, getFiresInfo, getPlayersInfo, getTileTypesInfo } from "../ai-info-gate.js";

// Variable to store the assigned player id when creating the AI object.
var my_id;
var last_bomb_time = 0;

var current_path = null;

var board = null;


const actions = getActionsInfo();
const types = getTileTypesInfo();

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

  board = getBoardInfo();

  if(is_in_danger()){
    if( current_path == null)
    {
      // find path to safe tile
      var [x, y] = get_current_coordinate();
      var tile_path = find_first_reachable_safe_tile({x: x, y: y});

      console.log(`Tile path: ${JSON.stringify(tile_path)}`);

      if (tile_path == null || tile_path.path == null) {
        console.log("no tile path")
        return actions.no_action;
      }

      current_path = tile_path.path;
    }
    return follow_path();

    //return get_direction_to_first_tile(tile_path.path);
  }

  current_path = null;

  if(should_place_bomb()){
    last_bomb_time = Date.now();
    return actions.bomb;
  }

  return select_random_safe_movement();
}

function follow_path() {
  if (current_path == null || current_path.length < 2) {
    current_path = null; // Reset path if it's invalid
    return actions.no_action;
  }
  const next_action = get_direction_to_first_tile(current_path);
  current_path.shift(); // Remove the first tile as we move towards it

  if (current_path.length < 2) {
    current_path = null; // Reset path if we've reached the destination
  }

  return next_action;
}

function select_random_safe_movement() {
  const [x, y] = get_current_coordinate();
  const directions = [
    { action: actions.up, dx: 0, dy: -1 },
    { action: actions.down, dx: 0, dy: 1 },
    { action: actions.left, dx: -1, dy: 0 },
    { action: actions.right, dx: 1, dy: 0 }
  ];

  const safe_directions = directions.filter(({ dx, dy }) => is_safe_tile(x + dx, y + dy));
  
  if (safe_directions.length == 0) {
    return actions.no_action; // No safe movements available
  }

  const random_index = Math.floor(Math.random() * safe_directions.length);
  return safe_directions[random_index].action;
}

function is_safe_tile(x, y) {
  const fires = getDeadlyTiles();

  if (x >= 0 && x < board.length && y >= 0 && y < board[0].length) {
    return board[x][y] === types.empty && !fires.some(fire => fire.x === x && fire.y === y);
  }
  return false;
}

function select_random_movement()
{
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

function get_direction_to_first_tile(path) {
  if (path.length < 2) {
    console.warn("Path must contain at least the start and one additional tile. Returning default action.");
    return actions.no_action;
  }

  const currentTile = path[0];
  const nextTile = path[1];

  if (nextTile.x < currentTile.x) {
    return actions.left;
  } else if (nextTile.x > currentTile.x) {
    return actions.right;
  } else if (nextTile.y < currentTile.y) {
    return actions.up;
  } else if (nextTile.y > currentTile.y) {
    return actions.down;
  } else {
    console.warn("The first two tiles in the path are the same. Returning default action.");
    return actions.no_action;
  }
}

function find_first_reachable_safe_tile(start) {
  const fires = getDeadlyTiles();
  const rows = board.length;
  const cols = board[0].length;

  const directions = [
    { dx: -1, dy: 0 }, // West
    { dx: 1, dy: 0 }, // East
    { dx: 0, dy: -1 }, // North
    { dx: 0, dy: 1 } // South
  ];

  const queue = [[start]];
  const visited = new Set();
  visited.add(`${start.x},${start.y}`);

  while (queue.length > 0) {
    const path = queue.shift();
    const { x, y } = path[path.length - 1];

    if (board[x][y] === types.empty && !is_tile_in_bomb_range(x, y)) {
      return { x, y, path };
    }

    for (const { dx, dy } of directions) {
      const nx = x + dx;
      const ny = y + dy;
      if (
        nx >= 0 &&
        ny >= 0 &&
        nx < rows &&
        ny < cols &&
        board[nx][ny] === types.empty &&
        !visited.has(`${nx},${ny}`) &&
        !fires.some(fire => fire.x === nx && fire.y === ny)
      ) {
        visited.add(`${nx},${ny}`);
        queue.push([...path, { x: nx, y: ny }]);
      }
    }
  }

  return { x: null, y: null, path: null };
}

function is_in_danger(){
  var [x, y] = get_current_coordinate();
  return is_tile_in_bomb_range(x,y);
}

function is_tile_in_bomb_range(x, y) {
  const bombs = getBombsInfo();

  for (const bomb of bombs) {
    // Check if the tile is in the same column as the bomb and within 2 tiles vertically
    if (bomb.x === x && Math.abs(bomb.y - y) <= 2) {
      return true;
    } else if (bomb.y === y && Math.abs(bomb.x - x) <= 2) {
      // Check if the tile is in the same row as the bomb and within 2 tiles horizontally
      return true;
    }
  }

  return false;
}

function should_place_bomb() {
  return ((is_near_living_player() || is_near_type(types.wood)) && can_place_bomb());
}

function is_near_type(type){
  var [x, y] = get_current_coordinate();

  // Check the tiles north, south, east, and west of the player
  if (
    is_tile_type(x, y - 1, type) ||
    is_tile_type(x, y + 1, type) ||
    is_tile_type(x + 1, y, type) ||
    is_tile_type(x - 1, y, type)
  ) {
    return true;
  }
  return false;
}

function is_tile_type(x, y, type) {
  // Check if coordinates are within the bounds of the board
  if (x >= 0 && x < board.length && y >= 0 && y < board[0].length) {
    return board[x][y] === type;
  }
  return false;
}

function is_near_living_player() {
  var players = getPlayersInfo();
  var other_players = players.filter(p => p.id !== my_id);

  return other_players.some(player => {
    var [px, py] = [player.x, player.y];
    var [x, y] = get_current_coordinate();
    return (
      (Math.abs(px - x) <= 1 && py == y) || // Horizontal proximity
      (Math.abs(py - y) <= 1 && px == x)    // Vertical proximity
    );
  });
}

function can_place_bomb(){
  return Date.now() > (last_bomb_time + 3200);
}

function get_current_coordinate(){
  var players = getPlayersInfo();
  var player = players.find(p => p.id===my_id)
  return [player.x, player.y];
}

function getDeadlyTiles() {

  return getFiresInfo();

  const fires = getFiresInfo();
  const bombs = getBombsInfo();
  const deadlyTiles = [];

  // Add fire tiles to deadly tiles
  fires.forEach(fire => deadlyTiles.push(`${fire.x},${fire.y}`));

  // Add tiles with bombs about to explode to deadly tiles
  const explosionThreshold = 500; // Adjust this value as needed
  bombs.forEach(bomb => {
    if (Date.now() - bomb.explosion < explosionThreshold) {
      deadlyTiles.push(`${bomb.x},${bomb.y}`);
      // Add blast zone tiles (assuming blast range is 2 tiles)
      const blastRange = 2;
      for (let i = 1; i <= blastRange; i++) {
        deadlyTiles.push(`${bomb.x + i},${bomb.y}`);
        deadlyTiles.push(`${bomb.x - i},${bomb.y}`);
        deadlyTiles.push(`${bomb.x},${bomb.y + i}`);
        deadlyTiles.push(`${bomb.x},${bomb.y - i}`);
      }
    }
  });

  return deadlyTiles;
}