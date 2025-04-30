// main.js
import { Engine } from '@babylonjs/core';
import '@babylonjs/loaders';
import { Vector3 } from '@babylonjs/core';

import { SceneManager }   from './systems/sceneManager.js';
import { InputManager }   from './systems/inputManager.js';
import { EffectsManager } from './systems/effectsManager.js';
import { Player }         from './characters/player.js';
import { Enemy }          from './characters/enemy.js';
import { CombatManager }  from './systems/combatManager.js';
import { PuzzleManager }  from './systems/puzzleManager.js';
import { SoundManager }   from './systems/soundManager.js';
import { UIManager }      from './systems/uiManager.js';
import { AssetLoader }    from './systems/assetLoader.js';

import { createAllCameras } from './systems/cameras.js';

// Helpers pour mesh
function normalizeMeshHeight(mesh, h) {
    const bb = mesh.getBoundingInfo().boundingBox;
    const curH = bb.maximumWorld.y - bb.minimumWorld.y;
    const s = h / curH;
    mesh.scaling = mesh.scaling.multiplyByFloats(s, s, s);
}
function findValidMesh(meshes) {
    return meshes.find(m => m.getTotalVertices && m.getTotalVertices() > 0) || meshes[0];
}

window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('renderCanvas');
    if (!canvas) throw new Error('Canvas introuvable !');

    const engine = new Engine(canvas, true);
    const { scene, environment } = SceneManager.createMainScene(engine);

    const loader = new AssetLoader(scene, '/public/');
    loader.addMesh('playerMesh', null, 'models/', 'hero.glb');
    loader.addMesh('enemyMesh',  null, 'models/', 'spirit.glb');
    loader.addMesh('leverMesh',  null, 'models/', 'crystal_lever.glb');
    loader.addMesh('wallMesh',   null, 'models/', 'portal_door.glb');

    loader.loadAll().then(tasks => {
        const inputMgr  = new InputManager(scene);
        const effects   = new EffectsManager(scene);
        const player    = new Player(scene, inputMgr);
        const enemy     = new Enemy(scene);

        // Création des caméras et sélection
        const cams = createAllCameras(scene, player.mesh);
        scene.activeCamera = cams[2];

        const soundMgr  = new SoundManager(scene);
        const uiMgr     = new UIManager();

        // Remplacement & scale
        const pt = tasks.find(t => t.name === 'playerMesh');
        if (pt?.loadedMeshes.length) {
            const m = findValidMesh(pt.loadedMeshes);
            player.replaceMesh(m);
            normalizeMeshHeight(player.mesh, 2);
        }
        const et = tasks.find(t => t.name === 'enemyMesh');
        if (et?.loadedMeshes.length) {
            const m = findValidMesh(et.loadedMeshes);
            enemy.replaceMesh(m);
            normalizeMeshHeight(enemy.mesh, 2);
        }
        const lt = tasks.find(t => t.name === 'leverMesh');
        if (lt?.loadedMeshes.length) {
            const m = findValidMesh(lt.loadedMeshes);
            environment.replaceLever(m);
            normalizeMeshHeight(environment.lever, 1);
        }
        const wt = tasks.find(t => t.name === 'wallMesh');
        if (wt?.loadedMeshes.length) {
            const m = findValidMesh(wt.loadedMeshes);
            environment.replaceWall(m);
            normalizeMeshHeight(environment.wall, 3);
        }

        // Gameplay
        const combatMgr = new CombatManager(
            scene, player, enemy, soundMgr, uiMgr, effects
        );
        const puzzleMgr = new PuzzleManager(
            scene, player, environment.lever, environment.wall,
            soundMgr, uiMgr, scene
        );

        uiMgr.showMessage(
            "Utilisez flèches, Espace pour attaquer, et cliquez sur le levier !",
            5000
        );

        engine.runRenderLoop(() => {
            player.update();
            enemy.update();
            combatMgr.update();
            puzzleMgr.update();
            scene.render();
        });

        window.addEventListener('resize', () => engine.resize());
    });
});