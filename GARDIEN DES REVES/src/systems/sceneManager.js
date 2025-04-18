
import {
    Scene,
    HemisphericLight,
    UniversalCamera,
    Vector3
} from '@babylonjs/core';
import { Environment } from './environment.js';

export class SceneManager {
    /**
     * Crée la scène principale et son décor.
     * @param {Engine} engine
     * @returns {{ scene: Scene, environment: Environment }}
     */
    static createMainScene(engine) {
        const scene = new Scene(engine);

        // Lumière ambiante
        new HemisphericLight('hemiLight', new Vector3(0, 1, 0), scene);

        // Décor (sol, mur, levier…)
        const environment = new Environment(scene);

        // On ne fait plus de loader.loadAll(), donc pas de Promise
        return { scene, environment };
    }


    static createPlayerCamera(scene, player) {
        const camera = new UniversalCamera(
            'playerCam',
            new Vector3(0, 5, 10),
            scene
        );
        camera.setTarget(player.mesh.position);
        camera.parent = player.mesh;
        scene.activeCamera = camera;
    }
}