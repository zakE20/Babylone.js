// src/characters/enemy.js
import {MeshBuilder} from '@babylonjs/core/Meshes/meshBuilder';
import {StandardMaterial} from '@babylonjs/core/Materials/standardMaterial';
import {Color3} from '@babylonjs/core/Maths/math.color';
import {Vector3} from '@babylonjs/core/Maths/math.vector';

export class Enemy {
    constructor(scene) {
        this.scene = scene;
        this.active = true;    // Indique si l'ennemi est actif (pas encore neutralisé)
        this.speed = 0.05;    // Vitesse de patrouille de l’ennemi
        this.direction = 1;    // Direction actuelle de déplacement (1 ou -1)

        // Création du mesh de l'ennemi (une sphère rouge de diamètre 1)
        this.mesh = MeshBuilder.CreateSphere('enemySphere', {diameter: 1}, scene);
        // Position initiale de l'ennemi sur le terrain
        this.mesh.position = new Vector3(-5, 1, 5);
        // Couleur rouge pour l'ennemi (matériau diffus rouge)
        const mat = new StandardMaterial('enemyMat', scene);
        mat.diffuseColor = new Color3(0.9, 0.3, 0.2);
        this.mesh.material = mat;

        // Définition de la zone de patrouille en X (entre xMin et xMax autour de la position initiale)
        this.xMin = this.mesh.position.x;
        this.xMax = this.mesh.position.x + 10;  // l'ennemi ira 10 unités plus à droite avant de revenir
    }

    // Mise à jour de l'ennemi à chaque frame (déplacement de patrouille)
    update() {
        if (!this.active) {
            return; // Si l'ennemi a été neutralisé, il ne bouge plus (on peut éventuellement le faire disparaître)
        }
        // Déplacement en X selon la direction actuelle
        this.mesh.position.x += this.speed * this.direction;
        // Si la sphère atteint l'une des bornes, on inverse la direction pour repartir dans l'autre sens
        if (this.mesh.position.x >= this.xMax) {
            this.direction = -1;
        } else if (this.mesh.position.x <= this.xMin) {
            this.direction = 1;
        }
    }

    // Neutralisation de l'ennemi (appelée lorsqu'il est touché par l'attaque du joueur)
    neutralize() {
        this.active = false;
        // On peut changer son apparence pour indiquer sa neutralisation (facultatif, ici on le rend gris)
        if (this.mesh.material) {
            this.mesh.material.diffuseColor = new Color3(0.5, 0.5, 0.5);
        }
        // Éventuellement, on le rend invisible ou on le supprime de la scène
        this.mesh.setEnabled(false);  // rend le mesh invisible tout en le gardant en scène
        // (On pourrait aussi faire this.mesh.dispose() pour le supprimer complètement)
    }
}
