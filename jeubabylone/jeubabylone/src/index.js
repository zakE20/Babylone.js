import * as BABYLON from "@babylonjs/core/Legacy/legacy";
import "@babylonjs/core/Meshes/meshBuilder";
import "@babylonjs/loaders/OBJ";

import Engine from "./engine";
import Character from "./character";

let game, player;

function main() {    
    game = new Engine();
    player = new Character(game);        
    game.player = player;
    
    game.assetManager();
    game.pointerLock();
    player.characterController();  
    
    game.render();  
}

main();
