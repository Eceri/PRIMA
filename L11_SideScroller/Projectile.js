"use strict";
var L11_SideScroller;
(function (L11_SideScroller) {
    var f = FudgeCore;
    class Projectile extends L11_SideScroller.CollidableObject {
        constructor(_name = "projectile", _sprites, _playerPosition, _direction, _speed = new f.Vector3(5, 0)) {
            super(_name);
            this.update = () => {
                let timeFrame = f.Loop.timeFrameGame / 1000; // in seconds
                let translation = f.Vector3.SCALE(this.speed, timeFrame);
                this.cmpTransform.local.translate(translation);
                this.checkCollision();
            };
            this.sprite = _sprites;
            this.speed = _speed;
            let diretion = _direction == L11_SideScroller.DIRECTION.RIGHT ? 1 : -1;
            this.speed.scale(diretion);
            let nodeSprite = new L11_SideScroller.NodeSprite(this.sprite.name, this.sprite);
            this.addComponent(new f.ComponentTransform());
            this.cmpTransform.local.translate(_playerPosition);
            nodeSprite.addComponent(new f.ComponentTransform());
            nodeSprite.cmpTransform.local.rotate(f.Vector3.Y(90 - 90 * diretion));
            nodeSprite.addEventListener("showNext", (_event) => {
                _event.currentTarget.showFrameNext();
            }, true);
            this.appendChild(nodeSprite);
            f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
        }
        checkCollision() {
            let projectileRect = this.getRectWorld();
            for (let floor of L11_SideScroller.level.getChildrenByName("Floor")) {
                if (floor.getRectWorld().collides(projectileRect)) {
                    console.log(projectileRect.position.toString());
                    console.log(projectileRect.height + "   " + projectileRect.width);
                    console.log(floor.cmpTransform.local.translation.toString());
                    // f.Loop.removeEventListener(f.EVENT.LOOP_FRAME, this.update);
                    // this.getParent().removeChild(this);
                }
            }
        }
    }
    L11_SideScroller.Projectile = Projectile;
})(L11_SideScroller || (L11_SideScroller = {}));
//# sourceMappingURL=Projectile.js.map