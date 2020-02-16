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
            this.grounded = true;
            this.currentWeapon = WEAPON.AXE;
            this.lastFrameTime = 0;
            this.activeActions = [];
            this.framesSinceLock = 0;
            this.lockedInAnimation = false;
            this.animationFPS = 0.2; // .2 = 5 FPS
            this.update = (_event) => {
                let timeFrame = f.Loop.timeFrameGame / 1000; // in seconds
                //simple limit to animation, so the game can run at higher frame rates
                this.lastFrameTime += timeFrame;
                while (this.lastFrameTime > this.animationFPS) {
                    this.broadcastEvent(new CustomEvent("showNext"));
                    this.framesSinceLock += 1;
                    let activeNodeSprite = (this.getChildren().find(child => child.isActive));
                    this.lockedInAnimation =
                        this.framesSinceLock < activeNodeSprite.lockedFrames;
                    this.lastFrameTime -= this.animationFPS;
                }
                this.speed.y += Character.gravity.y * timeFrame;
                let distance = f.Vector3.SCALE(this.speed, timeFrame);
                this.cmpTransform.local.translate(distance);
                this.checkCollision();
            };
            this.releaseAnimationLock = () => {
                this.activeActions.pop();
            };
            this.addComponent(new f.ComponentTransform());
            for (let sprite of Character.sprites) {
                let nodeSprite = new L11_SideScroller.NodeSprite(sprite.name, sprite);
                nodeSprite.activate(false);
                nodeSprite.addComponent(new f.ComponentTransform());
                nodeSprite.addEventListener("showNext", (_event) => {
                    _event.currentTarget.showFrameNext();
                }, true);
                this.appendChild(nodeSprite);
            }
            this.show(ACTION.IDLE);
            f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
            this.addEventListener("lockFramesEnded", this.releaseAnimationLock);
        }
        static generateSprites(_txtImage) {
            Character.sprites = [];
            //Axe Sprites
            let sprite = new L11_SideScroller.Sprite(ACTION.IDLE + WEAPON.AXE);
            sprite.generateByGrid(_txtImage, f.Rectangle.GET(55, 245, 70, 70), 4, f.Vector2.X(90), 90, f.ORIGIN2D.BOTTOMCENTER);
            Character.sprites.push(sprite);
            sprite = new L11_SideScroller.Sprite(ACTION.WALK + WEAPON.AXE);
            sprite.generateByGrid(_txtImage, f.Rectangle.GET(45, 75, 80, 80), 4, f.Vector2.X(85), 90, f.ORIGIN2D.BOTTOMCENTER);
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
            sprite = new L11_SideScroller.Sprite(ACTION.JUMP + WEAPON.SCEPTER);
            sprite.generateByGrid(_txtImage, f.Rectangle.GET(40, 75, 80, 80), 1, f.Vector2.X(80), 90, f.ORIGIN2D.BOTTOMCENTER);
            Character.sprites.push(sprite);
            sprite = new L11_SideScroller.Sprite(ACTION.FALL + WEAPON.SCEPTER);
            sprite.generateByGrid(_txtImage, f.Rectangle.GET(40, 1035, 80, 80), 2, f.Vector2.X(80), 90, f.ORIGIN2D.BOTTOMCENTER);
            Character.sprites.push(sprite);
        }
        swapWeapon() {
            this.currentWeapon =
                this.currentWeapon == WEAPON.AXE ? WEAPON.SCEPTER : WEAPON.AXE;
            console.log("WeaponSwap! new Weapon: " + this.currentWeapon);
        }
        show(_action) {
            let actionName = _action + this.currentWeapon;
            console.log(actionName);
            for (let child of this.getChildren())
                child.activate(child.name == actionName);
        }
        act(_action, _direction) {
            // if (!this.lockedInAnimation) {
            let currentAction = _action;
            if (this.speed.y != 0) {
                this.grounded = false;
                if (_action != ACTION.WALK)
                    currentAction = ACTION.FALL;
            }
            switch (currentAction) {
                case ACTION.IDLE:
                    this.speed.x = 0;
                    break;
                case ACTION.JUMP:
                    console.log("JUMPED");
                    if (this.grounded)
                        this.speed.y = 5;
                    this.lockedInAnimation = true;
                    console.log(this.lockedInAnimation);
                    this.framesSinceLock = 0;
                    break;
                case ACTION.WALK:
                    let direction = _direction == DIRECTION.RIGHT ? 1 : -1;
                    this.speed.x = Character.speedMax.x * direction;
                    for (let child of this.getChildren())
                        child.cmpTransform.local.rotation = f.Vector3.Y(90 - 90 * direction);
                    break;
            }
            this.show(currentAction);
            // }
        }
        getRectWorld() {
            let activeChild = (this.getChildren().find(child => child.isActive));
            return activeChild.getRectWorld();
            // return this.hitRect.copy
        }
        checkCollision() {
            for (let floor of L11_SideScroller.level.getChildren()) {
                f.RenderManager.update();
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
    Character.speedMax = new f.Vector2(2.5, 10); // units per second
    Character.gravity = f.Vector2.Y(-9);
    L11_SideScroller.Character = Character;
})(L11_SideScroller || (L11_SideScroller = {}));
//# sourceMappingURL=Character.js.map