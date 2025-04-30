import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { Texture as BabylonTexture } from '@babylonjs/core/Materials/Textures/texture';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';

export class Environment {
    constructor(scene) {
        this.scene = scene;

        // Sol étendu (100x100) pour accueillir tous les personnages
        this.ground = MeshBuilder.CreateGround('ground', { width: 5000, height: 5000 }, scene);
        const groundMat = new StandardMaterial('groundMat', scene);
        groundMat.diffuseTexture = new BabylonTexture('textures/ground.jpg', scene);
        this.ground.material = groundMat;
        this.ground.position.y = 0;
        this.ground.receiveShadows = true;
        this.ground.checkCollisions = true;

        // Mur initial
        this.wall = MeshBuilder.CreateBox('wall', { width: 3, depth: 0.5, height: 3 }, scene);
        this.wall.position = new Vector3(0, 1.5, 5);
        const wallMat = new StandardMaterial('wallMat', scene);
        wallMat.diffuseColor = new Color3(0.7, 0.7, 0.7);
        this.wall.material = wallMat;
        this.wall.checkCollisions = true;

        // Levier initial
        this.lever = MeshBuilder.CreateBox('lever', { width: 0.2, depth: 0.2, height: 1 }, scene);
        this.lever.position = new Vector3(-1, 0.5, 4.5);
        const leverMat = new StandardMaterial('leverMat', scene);
        leverMat.diffuseColor = new Color3(1, 0.6, 0);
        leverMat.emissiveColor = new Color3(0.2, 0.1, 0);
        this.lever.material = leverMat;
        this.lever.setPivotPoint(new Vector3(0, -0.5, 0));

        // Méthodes de remplacement
        this.replaceWall = newWall => {
            this.wall.dispose();
            newWall.position = new Vector3(0, 1.5, 5);
            this.wall = newWall;
        };
        this.replaceLever = newLever => {
            this.lever.dispose();
            newLever.position = new Vector3(-1, 0.5, 4.5);
            newLever.setPivotPoint(new Vector3(0, -0.5, 0));
            this.lever = newLever;
        };
    }
}