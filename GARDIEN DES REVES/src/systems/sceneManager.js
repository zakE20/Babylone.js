// src/systems/sceneManager.js
import {
    Scene,
    HemisphericLight,
    DirectionalLight,
    ShadowGenerator,
    GlowLayer,
    FreeCamera,
    Vector3
} from '@babylonjs/core';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import { DefaultRenderingPipeline } from '@babylonjs/core/PostProcesses/RenderPipeline';
import { Environment } from './environment.js';

export class SceneManager {
    /**
     * Crée la scène principale avec une FreeCamera uniquement.
     */
    static createMainScene(engine) {
        const scene = new Scene(engine);

        // Caméra libre (FreeCamera) positionnée derrière et au-dessus du joueur potentiel
        const camera = new FreeCamera('freeCam', new Vector3(0, 5, -10), scene);
        camera.setTarget(Vector3.Zero());
        camera.attachControl(engine.getRenderingCanvas(), true);
        scene.activeCamera = camera;

        // Lumière directionnelle + ombres
        const dirLight = new DirectionalLight('dirLight', new Vector3(-1, -2, -1), scene);
        dirLight.intensity = 0.8;
        dirLight.diffuse   = new Color3(0.8, 0.7, 1);
        const shadowGen = new ShadowGenerator(1024, dirLight);
        shadowGen.useBlurExponentialShadowMap = true;
        shadowGen.blurKernel = 8;

        // Lumière d'ambiance
        const hemiLight = new HemisphericLight('hemiLight', new Vector3(0, 1, 0), scene);
        hemiLight.intensity = 0.2;

        // Glow layer pour les éléments émissifs
        new GlowLayer('glow', scene).intensity = 0.5;

        // Environnement (sol, mur, levier…)
        const environment = new Environment(scene);

        return { scene, environment };
    }
}
