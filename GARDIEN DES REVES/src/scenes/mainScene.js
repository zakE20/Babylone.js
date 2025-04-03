// Importation des modules Babylon nécessaires
import { Scene, ArcRotateCamera, HemisphericLight, MeshBuilder, Vector3 } from "@babylonjs/core";

// La fonction createScene reçoit l'engine et le canvas, pour être entièrement modulable
export const createScene = (engine, canvas) => {
    // Créer une nouvelle scène
    const scene = new Scene(engine);

    // Créer une caméra ArcRotate et l'attacher au canvas pour le contrôle utilisateur
    const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 3, new Vector3(0, 0, 0), scene);
    camera.attachControl(canvas, true);

    // Créer une lumière hémisphérique pour éclairer la scène
    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);

    // Créer un simple box pour tester
    const box = MeshBuilder.CreateBox("box", {}, scene);

    return scene;
};
