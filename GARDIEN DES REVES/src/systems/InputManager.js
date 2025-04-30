import { ActionManager, ExecuteCodeAction } from '@babylonjs/core';

export class InputManager {
    constructor(scene) {
        this.inputMap = {};
        scene.actionManager = new ActionManager(scene);
        scene.actionManager.registerAction(
            new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, evt => {
                this.inputMap[evt.sourceEvent.key] = true;
            })
        );
        scene.actionManager.registerAction(
            new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, evt => {
                this.inputMap[evt.sourceEvent.key] = false;
            })
        );
    }
}