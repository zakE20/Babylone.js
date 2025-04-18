// src/systems/puzzleManager.js
import {ActionManager, ExecuteCodeAction} from '@babylonjs/core';
import {Animation} from '@babylonjs/core/Animations/animation';
import {Color3} from '@babylonjs/core/Maths/math.color';

export class PuzzleManager {
    constructor(scene, player, leverMesh, wallMesh, soundManager, uiManager) {
        this.scene = scene;
        this.player = player;
        this.lever = leverMesh;
        this.wall = wallMesh;
        this.soundManager = soundManager;
        this.uiManager = uiManager;
        this.solved = false;  // indique si le puzzle (mur ouvert) est déjà résolu

        // On attache un actionManager au levier pour détecter les clics utilisateur
        this.lever.actionManager = new ActionManager(scene);
        this.lever.actionManager.registerAction(
            new ExecuteCodeAction(ActionManager.OnPickTrigger, () => {
                // Appelé lorsque le levier est cliqué
                this.activateLever();
            })
        );
    }

    // Méthode appelée lors du clic sur le levier pour activer le mécanisme
    activateLever() {
        if (this.solved) {
            return; // si le levier a déjà été utilisé, on ne refait rien
        }
        this.solved = true;

        // 1. Animation du levier qui bascule (rotation de 90° vers l'avant)
        Animation.CreateAndStartAnimation('leverTurn', this.lever, 'rotation.x', 30, 30,
            this.lever.rotation.x, this.lever.rotation.x + Math.PI / 2, 0);
        // 2. Changement de couleur du levier pour indiquer son activation (il passe au vert après l'animation)
        setTimeout(() => {
            if (this.lever.material) {
                this.lever.material.diffuseColor = new Color3(0, 1, 0); // vert (activé)
            }
        }, 1000); // on change la couleur après 1 seconde, supposant que l'animation dure ~1s

        // 3. Disparition du mur (on le "désintègre" visuellement puis on le désactive)
        Animation.CreateAndStartAnimation('wallDown', this.wall, 'scaling', 30, 30,
            this.wall.scaling.clone(),        // échelle initiale (1,1,1)
            {x: 0.1, y: 0.1, z: 0.1},       // échelle finale très petite (presque invisible)
            0);
        // Après l'animation, on rend le mur effectivement inactif dans la scène
        setTimeout(() => {
            this.wall.setEnabled(false); // désactive le mesh du mur (il "disparaît" du jeu)
        }, 1000);

        // 4. Son du levier qui s'actionne
        this.soundManager.playLever();
        // 5. Message à l'écran pour informer que le passage est ouvert
        this.uiManager.showMessage("Passage dégagé !", 3000);
    }
}
