import {
    FreeCamera,
    UniversalCamera,
    ArcRotateCamera,
    FollowCamera,
    FlyCamera,
    Vector3
} from '@babylonjs/core';

/**
 * Instancie les caméras desktop compatibles.
 * @param {Scene} scene
 * @param {AbstractMesh} playerMesh
 * @returns {Array} liste des caméras créées
 */
export function createAllCameras(scene, playerMesh) {
    const cams = [];

    // 1. FreeCamera (clavier + souris)
    const freeCam = new FreeCamera('freeCam', new Vector3(0, 5, -10), scene);
    freeCam.setTarget(Vector3.Zero());
    freeCam.attachControl(scene.getEngine().getRenderingCanvas(), true);
    cams.push(freeCam);

    // 2. UniversalCamera (souris + gamepad + clavier)
    const uniCam = new UniversalCamera('uniCam', new Vector3(0, 5, -10), scene);
    uniCam.setTarget(Vector3.Zero());
    uniCam.attachControl(scene.getEngine().getRenderingCanvas(), true);
    cams.push(uniCam);

    // 3. ArcRotateCamera (orbite autour du joueur)
    const arcCam = new ArcRotateCamera(
        'arcCam',
        -Math.PI / 2,
        Math.PI / 3,
        10,
        playerMesh.position,
        scene
    );
    arcCam.attachControl(scene.getEngine().getRenderingCanvas(), true);
    // Désactivation des warnings axes multiples
    arcCam.warningEnable = false;
    cams.push(arcCam);

    // 4. FollowCamera (suit le joueur)
    const followCam = new FollowCamera(
        'followCam',
        playerMesh.position.add(new Vector3(0, 10, -20)),
        scene
    );
    followCam.lockedTarget = playerMesh;
    followCam.attachControl(scene.getEngine().getRenderingCanvas(), true);
    cams.push(followCam);

    // 5. FlyCamera (vol libre)
    const flyCam = new FlyCamera('flyCam', new Vector3(0, 5, -10), scene);
    flyCam.attachControl(scene.getEngine().getRenderingCanvas(), true);
    cams.push(flyCam);

    return cams;
}
