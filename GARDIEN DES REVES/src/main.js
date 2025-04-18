import {
    Engine,
} from '@babylonjs/core';
import '@babylonjs/loaders';

import { SceneManager }  from './systems/sceneManager.js';
import { InputManager }  from './systems/inputManager.js';
import { Player }        from './characters/player.js';
import { Enemy }         from './characters/enemy.js';
import { CombatManager } from './systems/combatManager.js';
import { PuzzleManager } from './systems/puzzleManager.js';
import { SoundManager }  from './systems/soundManager.js';
import { UIManager }     from './systems/uiManager.js';

// On récupère directement le <canvas> en le typant et en vérifiant
const canvas = document.getElementById('renderCanvas');
if (!(canvas instanceof HTMLCanvasElement)) {
    throw new Error('Canvas #renderCanvas introuvable ou n’est pas un <canvas> !');
}

// On dispose maintenant d’un seul canvas, plus de variable redondante
const engine = new Engine(canvas, true);

// Création de la scène + environnement
const { scene, environment } = SceneManager.createMainScene(engine);

// Instanciation des managers et des entités
const inputManager  = new InputManager(scene);
const player        = new Player(scene, inputManager);
const enemy         = new Enemy(scene);
SceneManager.createPlayerCamera(scene, player);
const soundManager  = new SoundManager(scene);
const uiManager     = new UIManager();
const combatManager = new CombatManager(scene, player, enemy, soundManager, uiManager);
const puzzleManager = new PuzzleManager(scene, player, environment.lever, environment.wall, soundManager, uiManager);

// Message d’accueil
uiManager.showMessage("Utilisez les flèches, Espace pour attaquer, et cliquez sur le levier !", 5000);

// Boucle de rendu
engine.runRenderLoop(() => {
    player.update();
    enemy.update();
    combatManager.update();
    scene.render();
});

window.addEventListener('resize', () => engine.resize());
