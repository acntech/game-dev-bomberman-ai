// AIs are only allowed to import from ai-info-gate.js. Do not import from any other file.
import { getActionsInfo, getBoardInfo, getBombsInfo, getFiresInfo, getPlayersInfo, getTileTypesInfo } from "../ai-info-gate.js";



// Variable to store the assigned player id when creating the AI object.
var my_id;

// Function to create the AI decision maker object. Must return an object with a get_action function.
export function makeAi(id) {
var aftenFucker = 0;
  my_id = id;
  return {
    get_action: () => {
      const action = get_action(id, aftenFucker);
      aftenFucker++;
      return action;
    },
  };
}
function get_action(id, aftenFucker) {
  const array = getArray(id) 
  return array[aftenFucker % array.length];
};

// const doAction = (swapLeftRight, swapUpDown) => {

//   const actions = getActionsInfo();

//   const right = swapLeftRight ? actions.right : actions.left
//   const left = swapLeftRight ? actions.left : actions.right
//   const up = swapUpDown ? actions.up : actions.down
//   const down = swapUpDown ? actions.down : actions.up

//   const initialArray = [
//       right, right, right, right, right,
//   ]
// }

function getArray(id) {
  console.log(id);
  switch(id) {
      case 1:
          return generateArray(true, true);
      case 2:
          return generateArray(false, false);
      case 3:
          return generateArray(false, true);
      case 4:
          return generateArray(true, false);
      default:
          return null; // or you can return an empty array or another value to indicate an invalid id
  }

function generateArray(swapLeftRight, swapUpDown) {
  const actions = getActionsInfo();
  const right = swapLeftRight ? actions.right : actions.left
  const left = swapLeftRight ? actions.left : actions.right
  const up = swapUpDown ? actions.up : actions.down
  const down = swapUpDown ? actions.down : actions.up
  const bomb = actions.bomb;

  const initialArray = [
    right, right, right, right, right, right, right, right, right, right,
    right, right, right, right, right, right, bomb, left, left, left,
    left, left, left, left, left, left, left, left, left, left, left,
    left, left, left, down, down, down, down, down, down, down, down, down,
    down, down, down, up, up, right, right, down, down, bomb, up, up,
    right, right, right, right, right, right, right, right, right, bomb,
    left, left, left, left, left, left, left, down, down, down, down,
    down, down, down, down, bomb, up, up, up, up, up, up, up, up,
    up, up, right, right, right, right, right, right, right, right, right,
    right, right, right, right, right, bomb, left, left, left, left, left,
    left, left, left, left, down, down, down, down, down, down, down, 
    down, bomb, up, up, up, up, up, up, up, up, up, up, right, right,
    right, right, right, right, right, right, right, bomb, left, left, left,
    left, left, left, left, left, left, down, down, down, down, down, down,
    down, down, down, down, down, down, bomb, up, up, up, up, up, up,
    up, up, up, up, right, right, right, right, right, right, right, right,
    right, bomb, left, left, left, left, left, left, left, left, left, down,
    down, down, down, down, down, down, down, down, down, down, down, bomb,
    up, up, up, up, up, up, up, up, up, up, right, right, right, right,
    right, right, right, right, right, right, right, right, right, right, right,
    right, right, right, right, bomb, left, left, left, left, left, left, left, left,
    left, left, left, left, left, left, left, left, left, left, down, down,
    down, down, down, down, down, down, down, down, down, down, down, down,
    down, down, down, down, down, down, down, down, down, down, bomb, up, 
    up, up, up, up, up, up, up, up, up, up, up, up, up, up, up, up, up,
    up, up, up, bomb, right
  ];

  const repeatingSequence = [
      ...Array(19).fill(right), bomb,
      ...Array(19).fill(left), bomb,
      ...Array(19).fill(down), bomb,
      ...Array(19).fill(up), bomb
  ];

  const resultArray = [...initialArray];

  while (resultArray.length < 10000) {
      resultArray.push(...repeatingSequence);
  }
  return resultArray;

  // If the array is longer than 10000, truncate it to exactly 10000
  //return resultArray.slice(0, 10000);
}

}
// function get_my_position() {
//   switch
//   const players = getPlayersInfo();
//   for (let i = 0; i < players.length; i++) { // Corrected 'lenght()' to 'length'
//     console.log(players.id); 
//     if (players[i].agent.id === my_id) { // Corrected '=' to '===' for comparison
//       console.log("aften fucker")
//       return [players[i].agent.x, players[i].agent.y]; // Corrected the second 'x' to 'y'
//     }
//   }

