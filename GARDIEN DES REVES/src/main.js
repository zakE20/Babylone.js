import './style.css'
// Importer Babylon.js et la fonction de création de scène
import { Engine } from "@babylonjs/core";
import { createScene } from "./scenes/MainScene.js";

// Récupérer le canvas dans ton index.html
const canvas = document.getElementById("gameCanvas");

// Créer le moteur Babylon.js
const engine = new Engine(canvas, true);

// Créer la scène en appelant notre fonction dédiée
const scene = createScene(engine, canvas);

// Démarrer la boucle de rendu
engine.runRenderLoop(() => {
    scene.render();
});

// Assurer le redimensionnement du canvas lors du resize de la fenêtre
window.addEventListener("resize", () => {
    engine.resize();
});
