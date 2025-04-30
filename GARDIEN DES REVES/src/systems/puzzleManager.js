import { ActionManager, ExecuteCodeAction } from '@babylonjs/core';
import { Animation } from '@babylonjs/core/Animations/animation';
import { Color3 } from '@babylonjs/core/Maths/math.color';

export class PuzzleManager {
    constructor(scene, player, leverMesh, wallMesh, soundManager, uiManager) {
        this.scene = scene;
        this.player = player;
        this.lever = leverMesh;
        this.wall = wallMesh;
        this.soundManager = soundManager;
        this.uiManager = uiManager;
        this.solved = false;

        this.lever.actionManager = new ActionManager(scene);
        this.lever.actionManager.registerAction(
            new ExecuteCodeAction(ActionManager.OnPickTrigger, () => this.activateLever())
        );
    }

    activateLever() {
        if (this.solved) return;
        this.solved = true;

        Animation.CreateAndStartAnimation('leverTurn', this.lever, 'rotation.x', 30, 30,
            this.lever.rotation.x, this.lever.rotation.x + Math.PI / 2, 0);
        setTimeout(() => {
            if (this.lever.material) this.lever.material.diffuseColor = new Color3(0, 1, 0);
        }, 1000);

        Animation.CreateAndStartAnimation('wallDown', this.wall, 'scaling', 30, 30,
            this.wall.scaling.clone(), { x: 0.1, y: 0.1, z: 0.1 }, 0);
        setTimeout(() => this.wall.setEnabled(false), 1000);

        this.soundManager.playLever();
        this.uiManager.showMessage('Passage dégagé !', 3000);

        // Transition narrative et sonore
        setTimeout(() => {
            const dirLight = this.scene.getLightByName('dirLight');
            dirLight.diffuse = new BABYLON.Color3(0.6, 1, 0.7);
            this.soundManager.playMusic('sounds/ambience2.mp3');
            this.uiManager.showMessage('Une nouvelle clarté inonde les lieux…', 4000);
        }, 1200);
    }

    update() {
        // Rien à faire ici pour l'instant
    }
}

