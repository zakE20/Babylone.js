// src/systems/environment.js
import {MeshBuilder} from '@babylonjs/core/Meshes/meshBuilder';
import {StandardMaterial} from '@babylonjs/core/Materials/standardMaterial';
import {Texture} from '@babylonjs/core/Materials/Textures/texture';
import {Color3} from '@babylonjs/core/Maths/math.color';
import {Vector3} from '@babylonjs/core/Maths/math.vector';

export class Environment {
    constructor(scene) {
        // 1. Création du sol de la scène (20x20 unités)
        this.ground = MeshBuilder.CreateGround('ground', {width: 20, height: 20}, scene);
        // Application d'une texture sur le sol (par exemple 'ground.jpg')
        const groundMat = new StandardMaterial('groundMat', scene);
        groundMat.diffuseTexture = new Texture('textures/ground.jpg', scene);
        // Si la texture n'est pas disponible, on peut simplement donner une couleur unie :
        // groundMat.diffuseColor = new Color3(0.3, 0.6, 0.3);
        this.ground.material = groundMat;
        // Position verticale du sol (on peut le laisser à y=0)
        this.ground.position.y = 0;

        // 2. Création d'un mur (par exemple une porte ou barrière) qui sera supprimé via le levier
        // Le mur est un cube aplati (largeur 3, épaisseur 0.5, hauteur 3) placé quelque part sur le sol
        this.wall = MeshBuilder.CreateBox('wall', {width: 3, depth: 0.5, height: 3}, scene);
        // Positionner le mur (par exemple, un peu devant le joueur au début)
        this.wall.position = new Vector3(0, 1.5, 5);
        // Matériau gris pour le mur
        const wallMat = new StandardMaterial('wallMat', scene);
        wallMat.diffuseColor = new Color3(0.7, 0.7, 0.7);
        this.wall.material = wallMat;

        // 3. Création du levier que le joueur pourra actionner
        // On représente le levier par un petit cylindre ou cube vertical
        this.lever = MeshBuilder.CreateBox('lever', {width: 0.2, depth: 0.2, height: 1}, scene);
        // Position du levier près du mur, au sol
        this.lever.position = new Vector3(-1, 0.5, 4.5);
        // Matériau orange pour le levier au départ
        const leverMat = new StandardMaterial('leverMat', scene);
        leverMat.diffuseColor = new Color3(1, 0.6, 0); // orange
        this.lever.material = leverMat;
        // On ajuste le point de pivot du levier à sa base, afin qu'il tourne autour de son pied lorsqu'on l'actionne.
        this.lever.setPivotPoint(new Vector3(0, -0.5, 0)); // pivot déplacé vers la base (le levier fait 1 de haut, donc -0.5 en Y depuis le centre)
    }
}
