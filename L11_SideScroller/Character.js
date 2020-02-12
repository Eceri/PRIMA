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
            sprite.generateByGrid(_txtImage, f.Rectangle.GET(8, 20, 45, 80), 4, f.Vector2.ZERO(), 64, f.ORIGIN2D.BOTTOMCENTER);
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
            // if (_action == ACTION.JUMP)
            //   // this.getChildrenByName()
            //   return;
            for (let child of this.getChildren())
                child.activate(child.name == _action);
            // this.action = _action;
        }
        act(_action, _direction) {
            let currentAction = _action;
            switch (currentAction) {
                case ACTION.IDLE:
                    this.speed.x = 0;
                    break;
                case ACTION.WALK:
                    let direction = _direction == DIRECTION.RIGHT ? 1 : -1;
                    this.speed.x = Character.speedMax.x; // * direction;
                    this.cmpTransform.local.rotation = f.Vector3.Y(90 - 90 * direction);
                    // console.log(direction);
                    break;
                case ACTION.LAUNCH:
                    this.speed.y = 3;
                    break;
            }
            if (this.speed.y > 0)
                currentAction = ACTION.JUMP;
            else if (this.speed.y < 0)
                currentAction = ACTION.FALL;
            this.show(currentAction);
        }
        checkCollision() {
            for (let floor of L11_SideScroller.level.getChildren()) {
                let rectFloor = floor.getRectWorld();
                //console.log(rect.toString());
                let hit = rectFloor.isInside(this.cmpTransform.local.translation.toVector2());
                let playerTranslation = this.cmpTransform.local.translation;
                let rectPlayer = f.Rectangle.GET(playerTranslation.x, playerTranslation.y, 0, 0, f.ORIGIN2D.BOTTOMCENTER);
                hit = rectFloor.collides(rectPlayer);
                console.log(rectFloor.collides(rectPlayer));
                if (hit) {
                    let translation = this.cmpTransform.local.translation;
                    let heightDifference = rectFloor.y - translation.y;
                    if (heightDifference < .2) {
                        translation.y = rectFloor.y;
                        this.speed.y = 0;
                    }
                    else
                        translation.x = rectFloor.x - .5;
                    this.cmpTransform.local.translation = translation;
                }
            }
        }
    }
    Character.speedMax = new f.Vector2(1.5, 5); // units per second
    Character.gravity = f.Vector2.Y(-3);
    L11_SideScroller.Character = Character;
})(L11_SideScroller || (L11_SideScroller = {}));
//# sourceMappingURL=Character.js.map