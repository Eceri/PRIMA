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
        ACTION["LAUNCH"] = "Launch";
    })(ACTION = L11_SideScroller.ACTION || (L11_SideScroller.ACTION = {}));
    let DIRECTION;
    (function (DIRECTION) {
        DIRECTION[DIRECTION["LEFT"] = 0] = "LEFT";
        DIRECTION[DIRECTION["RIGHT"] = 1] = "RIGHT";
    })(DIRECTION = L11_SideScroller.DIRECTION || (L11_SideScroller.DIRECTION = {}));
    class Character extends f.Node {
        constructor(_name = "Hare") {
            super(_name);
            // private action: ACTION;
            // private time: ƒ.Time = new ƒ.Time();
            this.speed = f.Vector3.ZERO();
            this.grounded = true;
            this.update = (_event) => {
                this.broadcastEvent(new CustomEvent("showNext"));
                let timeFrame = f.Loop.timeFrameGame / 1000;
                this.speed.y += Character.gravity.y * timeFrame;
                let distance = f.Vector3.SCALE(this.speed, timeFrame);
                this.cmpTransform.local.translate(distance);
                this.checkCollision();
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
        }
        static generateSprites(_txtImage) {
            Character.sprites = [];
            let sprite = new L11_SideScroller.Sprite(ACTION.WALK);
            sprite.generateByGrid(_txtImage, f.Rectangle.GET(2, 104, 68, 64), 6, f.Vector2.ZERO(), 64, f.ORIGIN2D.BOTTOMCENTER);
            Character.sprites.push(sprite);
            sprite = new L11_SideScroller.Sprite(ACTION.IDLE);
            sprite.generateByGrid(_txtImage, f.Rectangle.GET(8, 10, 45, 80), 4, f.Vector2.ZERO(), 64, f.ORIGIN2D.BOTTOMCENTER);
            Character.sprites.push(sprite);
            sprite = new L11_SideScroller.Sprite(ACTION.JUMP);
            sprite.generateByGrid(_txtImage, f.Rectangle.GET(200, 180, 50, 80), 1, f.Vector2.ZERO(), 64, f.ORIGIN2D.BOTTOMCENTER);
            Character.sprites.push(sprite);
            sprite = new L11_SideScroller.Sprite(ACTION.FALL);
            sprite.generateByGrid(_txtImage, f.Rectangle.GET(340, 170, 60, 80), 1, f.Vector2.ZERO(), 64, f.ORIGIN2D.BOTTOMCENTER);
            Character.sprites.push(sprite);
            sprite = new L11_SideScroller.Sprite(ACTION.LAUNCH);
            sprite.generateByGrid(_txtImage, f.Rectangle.GET(140, 180, 60, 80), 4, f.Vector2.ZERO(), 64, f.ORIGIN2D.BOTTOMCENTER);
        }
        show(_action) {
            let currentAction = _action;
            if (_action != ACTION.WALK && this.speed.y != 0) {
                currentAction = ACTION.FALL;
                this.grounded = false;
            }
            for (let child of this.getChildren())
                child.activate(child.name == currentAction);
        }
        act(_action, _direction) {
            switch (_action) {
                case ACTION.IDLE:
                    this.speed.x = 0;
                    break;
                case ACTION.WALK:
                    let direction = _direction == DIRECTION.RIGHT ? 1 : -1;
                    this.speed.x = Character.speedMax.x * direction; // * direction;
                    for (let child of this.getChildren())
                        child.cmpTransform.local.rotation = f.Vector3.Y(90 - 90 * direction);
                    // this.cmpTransform.local.rotation = f.Vector3.Y(90 - 90 * direction);
                    break;
                case ACTION.LAUNCH:
                    if (this.grounded)
                        this.speed.y = 5;
                    break;
            }
            this.show(_action);
        }
        checkCollision() {
            for (let floor of L11_SideScroller.level.getChildren()) {
                f.RenderManager.update();
                let rectFloor = floor.getRectWorld();
                let activeChild = (this.getChildren().filter(child => child.isActive)[0]);
                let rectPlayer = activeChild.getRectWorld();
                if (rectFloor.collides(rectPlayer)) {
                    let translation = this.cmpTransform.local.translation;
                    let distanceX, distanceY;
                    //calculate distance , accomodation for scalin to get proper distances
                    let rectPos = rectFloor.position;
                    distanceX =
                        (rectPlayer.x - rectPos.x) / floor.cmpTransform.local.scaling.x;
                    distanceY =
                        (rectPlayer.y - rectPos.y) / floor.cmpTransform.local.scaling.y;
                    console.log("top:" + rectFloor.top + " right: " + rectFloor.right + " bottom: " + rectFloor.bottom + " left: " + rectFloor.left + " pos: " + rectFloor.position.toString());
                    //when the absolute distance of y > then the distance of x, its a y Collision 
                    if (distanceY * distanceY > distanceX * distanceX) {
                        if (distanceY > 0) {
                            translation.y = rectFloor.bottom;
                            this.grounded = true;
                        }
                        else
                            translation.y = rectFloor.top - 1.25;
                        this.speed.y = 0;
                    }
                    else {
                        if (distanceX > 0) {
                            console.log("x Collision:  distance: X " + distanceX + "  y " + distanceY);
                            translation.x = rectFloor.left; //+ (rectPlayer.width / 2);
                        }
                        else {
                            translation.x = rectFloor.right; //- (rectPlayer.width / 2);
                            console.log("Push to right");
                        }
                        this.speed.x = 0;
                    }
                    if (floor.moving) {
                        floor.applyTranslation(translation);
                    }
                    this.cmpTransform.local.translation = translation;
                    // this.checkCollision();
                }
            }
        }
    }
    Character.speedMax = new f.Vector2(1.5, 5); // units per second
    Character.gravity = f.Vector2.Y(-5);
    L11_SideScroller.Character = Character;
})(L11_SideScroller || (L11_SideScroller = {}));
//# sourceMappingURL=Character.js.map