"use strict";
// / <reference path="../L14_ScrollerFoundation/SpriteGenerator.ts"/>
var L11_SideScroller;
// / <reference path="../L14_ScrollerFoundation/SpriteGenerator.ts"/>
(function (L11_SideScroller) {
    var f = FudgeCore;
    let ACTION;
    (function (ACTION) {
        ACTION["IDLE"] = "Idle";
        ACTION["WALK"] = "Walk";
        ACTION["JUMP"] = "Jump";
        ACTION["FALL"] = "Fall";
        ACTION["ATTACK"] = "Attack";
    })(ACTION = L11_SideScroller.ACTION || (L11_SideScroller.ACTION = {}));
    let WEAPON;
    (function (WEAPON) {
        WEAPON["AXE"] = "Axe";
        WEAPON["SCEPTER"] = "Scepter";
    })(WEAPON || (WEAPON = {}));
    let DIRECTION;
    (function (DIRECTION) {
        DIRECTION[DIRECTION["LEFT"] = 0] = "LEFT";
        DIRECTION[DIRECTION["RIGHT"] = 1] = "RIGHT";
    })(DIRECTION = L11_SideScroller.DIRECTION || (L11_SideScroller.DIRECTION = {}));
    class Character extends f.Node {
        constructor(_name = "Player") {
            super(_name);
            this.speed = f.Vector3.ZERO();
            this.framesSinceLock = 0;
            this.lockedInAnimation = false;
            this.direction = 1;
            this.grounded = true;
            this.currentWeapon = WEAPON.AXE;
            this.lastWeaponSwapTime = 1;
            this.showNextFrame = () => {
                this.getActiveNodeSprite().showFrameNext();
                this.framesSinceLock += 1;
            };
            this.update = (_event) => {
                let timeFrame = f.Loop.timeFrameGame / 1000; // in seconds
                this.lastWeaponSwapTime += timeFrame;
                let activeNodeSprite = this.getActiveNodeSprite();
                if (this.framesSinceLock > activeNodeSprite.lockedFrames) {
                    if (activeNodeSprite.name == ACTION.ATTACK + WEAPON.SCEPTER) {
                        this.spawnScepterProjectile();
                    }
                    this.lockedInAnimation = false;
                }
                this.speed.y += Math.min(Character.gravity.y * timeFrame, Character.speedMax.y);
                let distance = f.Vector3.SCALE(this.speed, timeFrame);
                this.cmpTransform.local.translate(distance);
                this.checkCollision();
                // console.log(this.cmpTransform.local.translation.y)
                if (this.cmpTransform.local.translation.y <= -25) {
                    this.cmpTransform.local.translation = f.Vector3.Y(1);
                }
            };
            this.addComponent(new f.ComponentTransform());
            for (let sprite of Character.sprites) {
                //frameLock needs to be somewhere else
                let frameLock;
                if (sprite.name == ACTION.ATTACK + WEAPON.AXE) {
                    frameLock = 3;
                }
                else if (sprite.name == ACTION.ATTACK + WEAPON.SCEPTER) {
                    frameLock = 4;
                }
                let nodeSprite = new L11_SideScroller.NodeSprite(sprite.name, sprite, frameLock);
                nodeSprite.activate(false);
                nodeSprite.addComponent(new f.ComponentTransform());
                this.appendChild(nodeSprite);
            }
            this.addEventListener("showNext", this.showNextFrame, true);
            this.show(ACTION.IDLE);
            f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
        }
        static generateSprites(_txtImage) {
            //Axe Sprites
            let sprite = new L11_SideScroller.Sprite(ACTION.IDLE + WEAPON.AXE);
            sprite.generateByGrid(_txtImage, f.Rectangle.GET(55, 245, 70, 70), 4, f.Vector2.X(90), 90, f.ORIGIN2D.BOTTOMCENTER);
            Character.sprites.push(sprite);
            sprite = new L11_SideScroller.Sprite(ACTION.WALK + WEAPON.AXE);
            sprite.generateByGrid(_txtImage, f.Rectangle.GET(45, 75, 80, 80), 4, f.Vector2.X(85), 90, f.ORIGIN2D.BOTTOMCENTER);
            Character.sprites.push(sprite);
            sprite = new L11_SideScroller.Sprite(ACTION.ATTACK + WEAPON.AXE);
            sprite.generateByGrid(_txtImage, f.Rectangle.GET(40, 395, 110, 80), 4, f.Vector2.X(55), 90, f.ORIGIN2D.BOTTOMCENTER);
            Character.sprites.push(sprite);
            sprite = new L11_SideScroller.Sprite(ACTION.JUMP + WEAPON.AXE);
            sprite.generateByGrid(_txtImage, f.Rectangle.GET(40, 75, 80, 80), 1, f.Vector2.X(80), 90, f.ORIGIN2D.BOTTOMCENTER);
            Character.sprites.push(sprite);
            sprite = new L11_SideScroller.Sprite(ACTION.FALL + WEAPON.AXE);
            sprite.generateByGrid(_txtImage, f.Rectangle.GET(40, 1035, 80, 80), 2, f.Vector2.X(80), 90, f.ORIGIN2D.BOTTOMCENTER);
            Character.sprites.push(sprite);
            //Scepter Sprites
            sprite = new L11_SideScroller.Sprite(ACTION.WALK + WEAPON.SCEPTER);
            sprite.generateByGrid(_txtImage, f.Rectangle.GET(45, 555, 80, 80), 4, f.Vector2.X(85), 90, f.ORIGIN2D.BOTTOMCENTER);
            Character.sprites.push(sprite);
            sprite = new L11_SideScroller.Sprite(ACTION.IDLE + WEAPON.SCEPTER);
            sprite.generateByGrid(_txtImage, f.Rectangle.GET(55, 725, 70, 70), 4, f.Vector2.X(90), 90, f.ORIGIN2D.BOTTOMCENTER);
            Character.sprites.push(sprite);
            sprite = new L11_SideScroller.Sprite(ACTION.ATTACK + WEAPON.SCEPTER);
            sprite.generateByGrid(_txtImage, f.Rectangle.GET(40, 875, 110, 80), 4, f.Vector2.X(55), 90, f.ORIGIN2D.BOTTOMCENTER);
            Character.sprites.push(sprite);
            sprite = new L11_SideScroller.Sprite(ACTION.JUMP + WEAPON.SCEPTER);
            sprite.generateByGrid(_txtImage, f.Rectangle.GET(40, 75, 80, 80), 1, f.Vector2.X(80), 90, f.ORIGIN2D.BOTTOMCENTER);
            Character.sprites.push(sprite);
            sprite = new L11_SideScroller.Sprite(ACTION.FALL + WEAPON.SCEPTER);
            sprite.generateByGrid(_txtImage, f.Rectangle.GET(40, 1035, 80, 80), 2, f.Vector2.X(80), 90, f.ORIGIN2D.BOTTOMCENTER);
            Character.sprites.push(sprite);
            //projectile Sprite
            sprite = new L11_SideScroller.Sprite(WEAPON.SCEPTER + "PROJECTILE");
            sprite.generateByGrid(_txtImage, f.Rectangle.GET(5, 1255, 75, 25), 4, f.Vector2.X(85), 20, f.ORIGIN2D.BOTTOMCENTER);
            Character.projectileSprite = sprite;
        }
        getActiveNodeSprite() {
            return this.getChildren().find(child => child.isActive);
        }
        swapWeapon() {
            if (this.lastWeaponSwapTime > 1) {
                this.currentWeapon =
                    this.currentWeapon == WEAPON.AXE ? WEAPON.SCEPTER : WEAPON.AXE;
                this.lastWeaponSwapTime = 0;
            }
        }
        show(_action) {
            let actionName = _action + this.currentWeapon;
            for (let child of this.getChildren())
                child.activate(child.name == actionName);
        }
        act(_action, _direction) {
            if (!this.lockedInAnimation) {
                let currentAction = _action;
                if (_direction != undefined) {
                    this.direction = _direction == DIRECTION.RIGHT ? 1 : -1;
                }
                switch (currentAction) {
                    case ACTION.IDLE:
                        this.speed.x = 0;
                        break;
                    case ACTION.JUMP:
                        if (this.grounded)
                            this.speed.y = 5;
                        this.framesSinceLock = 0;
                        break;
                    case ACTION.WALK:
                        this.speed.x = Character.speedMax.x * this.direction;
                        for (let child of this.getChildren())
                            child.cmpTransform.local.rotation = f.Vector3.Y(90 - 90 * this.direction);
                        break;
                    case ACTION.ATTACK:
                        this.framesSinceLock = 0;
                        this.getActiveNodeSprite().resetFrames();
                        this.lockedInAnimation = true;
                        if (this.speed.y != 0 && this.currentWeapon == WEAPON.AXE)
                            this.speed.x *= 2;
                        break;
                }
                if (this.speed.y != 0) {
                    this.grounded = false;
                    if (_action != ACTION.WALK && _action != ACTION.ATTACK)
                        currentAction = ACTION.FALL;
                }
                this.show(currentAction);
            }
        }
        spawnScepterProjectile() {
            let translation = this.cmpTransform.local.translation;
            translation.y -= this.getRectWorld().height / 2;
            let projectile = new L11_SideScroller.Projectile("ScepterAttack", Character.projectileSprite, translation, this.direction, f.Vector3.X(5));
            this.getParent().appendChild(projectile);
            Character.projectileSound.play();
        }
        getRectWorld() {
            return this.getActiveNodeSprite().getRectWorld();
        }
        checkCollision() {
            f.RenderManager.update();
            for (let floor of L11_SideScroller.level.getChildrenByName("Floor")) {
                let rectFloor = floor.getRectWorld();
                let rectPlayer = this.getRectWorld();
                if (rectFloor.collides(rectPlayer)) {
                    let translation = this.cmpTransform.local.translation;
                    let distanceX, distanceY;
                    // let movingFloor: boolean = (<Floor>floor).moving;
                    if (floor.moving)
                        floor.move(translation, f.Loop.timeFrameGame / 1000);
                    //calculate distances, with regards to width and height to get relative values
                    let rectPos = rectFloor.position;
                    distanceX = (rectPlayer.x - rectPos.x) / rectFloor.width;
                    distanceY = (rectPlayer.y - rectPos.y) / rectFloor.height;
                    //higher distance deternmins direction. if distances are equal, resolve in x direction first
                    if (distanceY * distanceY > distanceX * distanceX) {
                        if (distanceY < 0) {
                            //ground hit
                            translation.y = rectFloor.bottom;
                            this.grounded = true;
                            this.speed.y = 0;
                        }
                        else {
                            //ceiling hit
                            translation.y = rectFloor.top + rectPlayer.height;
                            if (this.speed.y > 0)
                                this.speed.y = 0;
                        }
                    }
                    else {
                        if (distanceX > 0) {
                            //left player sides hits
                            translation.x = rectFloor.right + rectPlayer.width / 2;
                        }
                        else {
                            //right player side hits
                            translation.x = rectFloor.left - rectPlayer.width / 2;
                        }
                        this.speed.x = 0;
                    }
                    this.cmpTransform.local.translation = translation;
                }
            }
        }
    }
    Character.sprites = [];
    Character.speedMax = new f.Vector2(2.5, 10); // units per second
    Character.gravity = f.Vector2.Y(-10);
    L11_SideScroller.Character = Character;
})(L11_SideScroller || (L11_SideScroller = {}));
//# sourceMappingURL=Character.js.map