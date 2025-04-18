// src/systems/inputManager.js
import {ActionManager, ExecuteCodeAction} from '@babylonjs/core';

export class InputManager {
    constructor(scene) {
        // Dictionnaire des états des touches : true si enfoncée, false si relâchée
        this.inputMap = {};

        // Configuration de l'action manager de la scène pour écouter les événements clavier
        scene.actionManager = new ActionManager(scene);
        scene.actionManager.registerAction(
            // Action déclenchée à l'appui d'une touche du clavier
            new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, evt => {
                this.inputMap[evt.sourceEvent.key] = true;
            })
        );
        scene.actionManager.registerAction(
            // Action déclenchée au relâchement d'une touche du clavier
            new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, evt => {
                this.inputMap[evt.sourceEvent.key] = false;
            })
        );
    }
}
