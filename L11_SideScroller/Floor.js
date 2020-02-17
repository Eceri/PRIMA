"use strict";
var L11_SideScroller;
(function (L11_SideScroller) {
    var f = FudgeCore;
    let FLOORTYPE;
    (function (FLOORTYPE) {
        FLOORTYPE["RECT"] = "Rectangle";
        FLOORTYPE["THINRECT"] = "ThinRectangle";
    })(FLOORTYPE = L11_SideScroller.FLOORTYPE || (L11_SideScroller.FLOORTYPE = {}));
    class Floor extends L11_SideScroller.CollidableObject {
        /**
         * @param _position position of the floor tile
         * @param _type type of the Floor: Thin or Rectangle
         */
        constructor(_position, _type) {
            super("Floor");
            this.addComponent(new f.ComponentTransform());
            this.cmpTransform.local.translation = _position;
            switch (_type) {
                case FLOORTYPE.RECT:
                    break;
                case FLOORTYPE.THINRECT:
                    this.cmpTransform.local.scaleY(0.2);
                    break;
            }
            let coat = new f.CoatTextured();
            coat.texture = Floor.txtImage;
            let material = new f.Material("FloorMaterial", f.ShaderTexture, coat);
            this.addComponent(new f.ComponentMaterial(material));
            let cmpMesh = new f.ComponentMesh(Floor.mesh);
            cmpMesh.pivot = Floor.pivot;
            this.addComponent(cmpMesh);
        }
        get moving() {
            return false;
        }
    }
    Floor.sprites = [];
    Floor.mesh = new f.MeshSprite();
    L11_SideScroller.Floor = Floor;
    class MovingFloor extends Floor {
        constructor(_origin, _moveSpeed, _type, _direction = 1, _maxMoveDistance = 5) {
            super(_origin, _type);
            this.update = (_event) => {
                let timeFrame = f.Loop.timeFrameGame / 1000; // in seconds
                this.checkForReversal();
                let translation = this.cmpTransform.local.translation;
                this.move(translation, timeFrame);
                // translation.y += this.speed.y * this.direction * timeFrame;
                this.cmpTransform.local.translation = translation;
            };
            this.originPoint = _origin;
            this.speed = _moveSpeed;
            this.maxMoveDistance = _maxMoveDistance;
            this.direction = _direction;
            this.cmpTransform.local.translation = this.originPoint;
            f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
        }
        get moving() {
            return true;
        }
        get moveSpeed() {
            return this.speed.copy;
        }
        move(_targetTranslation, _timeFrame) {
            let speed = this.moveSpeed;
            speed.scale(_timeFrame);
            _targetTranslation.x += speed.x * this.direction;
            _targetTranslation.y += speed.y * this.direction;
        }
        checkForReversal() {
            let positivDistanceCheck = this.direction == 1 &&
                (this.cmpTransform.local.translation.x >
                    this.originPoint.x + this.maxMoveDistance ||
                    this.cmpTransform.local.translation.y >
                        this.originPoint.y + this.maxMoveDistance);
            let negativDistanceCheck = this.direction == -1 &&
                (this.cmpTransform.local.translation.x < this.originPoint.x ||
                    this.cmpTransform.local.translation.y < this.originPoint.y);
            if (positivDistanceCheck || negativDistanceCheck) {
                this.direction *= -1;
            }
        }
    }
    L11_SideScroller.MovingFloor = MovingFloor;
})(L11_SideScroller || (L11_SideScroller = {}));
//# sourceMappingURL=Floor.js.map