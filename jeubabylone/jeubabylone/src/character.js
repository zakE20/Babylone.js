import * as BABYLON from "@babylonjs/core/Legacy/legacy";
import * as GUI from "@babylonjs/gui";

export default class Character {
    constructor(game) {
        this.game = game;
        this.scene = game.scene;
        this.camera = game.camera;
        this.camera.position.z = 5;
        this.gunLoadout = [];
        this.health = 20;
        this.energy = 20;
        this.running = false;
        this.walking = false;
        this.standing = true;
        this.currentWeapon = 0;
        this.cameraImpostor = this.camera.getChildren();
        this.hud = game.hud;
        this.scoreText = new GUI.TextBlock();

        this.debug = false;
        this.score = 0;
        this.scoreText = new GUI.TextBlock();
        this.scoreText.color = "white";
        this.scoreText.fontSize = 24;
        this.scoreText.text = "Score: 0";
        this.scoreText.top = "10px";
        this.scoreText.left = "10px";
        this.scoreText.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.scoreText.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        game.hudTexture.addControl(this.scoreText);    }

    healthUp() {
        if (this.health < 20) {
            this.health += 5;
            this.hud[0].width = this.health / 100;
        }
    }

    healthDown(amount) {
        if (this.health > 0) {
            this.health -= amount;
            this.hud[0].width = this.health / 100;
        }

        if (this.health <= 0) {
            console.log("Game Over");
            // alert("Game Over");
            // location.reload();
        }
    }

    energyUp() {
        if (this.energy < 20) {
            this.energy += 5;
            this.hud[1].width = this.energy / 100;
        }
    }

    energyDown() {
        if (this.energy > 0) {
            this.energy -= 0.05;
            this.hud[1].width = this.energy / 100;
            return true;
        } else {
            return false;
        }
    }

    addScore(points) {
        this.score += points;
        this.scoreText.text = "Score: " + this.score;
    }

    ammoUp(weapon) {
        switch (weapon) {
            case "pistolAmmo":
                this.gunLoadout[0].ammo += 20;
                break;
            case "shotgunAmmo":
                this.gunLoadout[1].ammo += 10;
                break;
            case "akAmmo":
                this.gunLoadout[2].ammo += 10;
                break;
            case "raygunAmmo":
                this.gunLoadout[3].ammo += 15;
                break;
            case "lightninggunAmmo":
                this.gunLoadout[4].ammo += 5;
                break;
        }

        this.hud[2].text = String(this.gunLoadout[this.currentWeapon].ammo);
    }

    characterController() {
        let scene = this.scene;
        let player = this;

        // Bullet collision damage
        this.cameraImpostor[0].physicsImpostor.onCollideEvent = (e, t) => {
            if (t.object.name.startsWith("Bullet")) {
                t.object.dispose();
                this.healthDown(2);
            }
        };

        // Keyboard Input Class
        var FreeCameraKeyboardRotateInput = function () {
            this._keys = [];
            this.keysLeft = [65];     // A
            this.keysRight = [68];    // D
            this.keysForward = [87];  // W
            this.keysBackward = [83]; // S
        };

        FreeCameraKeyboardRotateInput.prototype.attachControl = function (element, noPreventDefault) {
            var _this = this;
            element.tabIndex = 1;

            this._onKeyDown = function (evt) {
                if (_this.keysLeft.includes(evt.keyCode) || _this.keysRight.includes(evt.keyCode) ||
                    _this.keysForward.includes(evt.keyCode) || _this.keysBackward.includes(evt.keyCode)) {

                    player.walking = true;
                    player.standing = false;

                    if (!_this._keys.includes(evt.keyCode)) {
                        _this._keys.push(evt.keyCode);
                    }
                    if (!noPreventDefault) evt.preventDefault();
                }
            };

            this._onKeyUp = function (evt) {
                if (_this._keys.includes(evt.keyCode)) {
                    _this._keys.splice(_this._keys.indexOf(evt.keyCode), 1);
                }

                player.walking = false;
                player.standing = true;

                if (!noPreventDefault) evt.preventDefault();
            };

            element.addEventListener("keydown", this._onKeyDown);
            element.addEventListener("keyup", this._onKeyUp);
        };

        FreeCameraKeyboardRotateInput.prototype.detachControl = function (element) {
            element.removeEventListener("keydown", this._onKeyDown);
            element.removeEventListener("keyup", this._onKeyUp);
            this._keys = [];
        };

        FreeCameraKeyboardRotateInput.prototype.checkInputs = function () {
            for (var index = 0; index < this._keys.length; index++) {
                var keyCode = this._keys[index];
                var speed = this.camera._computeLocalCameraSpeed();

                if (this.keysLeft.includes(keyCode)) {
                    this.camera._localDirection.copyFromFloats(-speed, 0, 0);
                } else if (this.keysRight.includes(keyCode)) {
                    this.camera._localDirection.copyFromFloats(speed, 0, 0);
                } else if (this.keysBackward.includes(keyCode)) {
                    this.camera._localDirection.copyFromFloats(0, 0, -speed);
                } else if (this.keysForward.includes(keyCode)) {
                    this.camera._localDirection.copyFromFloats(0, 0, speed);
                }

                if (this.camera.getScene().useRightHandedSystem) {
                    this.camera._localDirection.z *= -1;
                }

                this.camera.getViewMatrix().invertToRef(this.camera._cameraTransformMatrix);
                BABYLON.Vector3.TransformNormalToRef(this.camera._localDirection, this.camera._cameraTransformMatrix, this.camera._transformedDirection);
                this.camera.cameraDirection.addInPlace(this.camera._transformedDirection);
            }
        };

        FreeCameraKeyboardRotateInput.prototype.getTypeName = () => "FreeCameraKeyboardRotateInput";
        FreeCameraKeyboardRotateInput.prototype.getSimpleName = () => "keyboardRotate";
        FreeCameraKeyboardRotateInput.prototype._onLostFocus = function () {
            this._keys = [];
        };

        this.camera.inputs.add(new FreeCameraKeyboardRotateInput());

        // Weapon switching + Debug
        scene.onKeyboardObservable.add((kbInfo) => {
            switch (kbInfo.type) {
                case BABYLON.KeyboardEventTypes.KEYDOWN:
                    switch (kbInfo.event.key) {
                        case "1": player.currentWeapon = 0; break;
                        case "2": player.currentWeapon = 1; break;
                        case "3": player.currentWeapon = 2; break;
                        case "4": player.currentWeapon = 3; break;
                        case "5": player.currentWeapon = 4; break;
                        case "Shift": player.running = true; break;
                        case "`":
                            player.debug = !player.debug;
                            player.scene.debugLayer[player.debug ? "show" : "hide"]();
                            break;
                    }
                    player.hud[2].text = String(player.gunLoadout[player.currentWeapon].ammo);
                    weaponSwitch(player.gunLoadout, player.currentWeapon);
                    break;
                case BABYLON.KeyboardEventTypes.KEYUP:
                    if (kbInfo.event.key === "Shift") {
                        player.running = false;
                    }
                    break;
            }
        });

        // Speed control
        scene.onBeforeRenderObservable.add(() => {
            player.camera.speed = (player.running && !player.standing && player.walking && player.energyDown()) ? 0.8 : 0.4;
        });
    }
}

function weaponSwitch(gunLoadout, currentWeapon) {
    gunLoadout.forEach(w => w.mesh.setEnabled(false));
    gunLoadout[currentWeapon].mesh.setEnabled(true);
}
