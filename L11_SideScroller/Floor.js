"use strict";
var L11_SideScroller;
(function (L11_SideScroller) {
    var f = FudgeCore;
    class Floor extends L11_SideScroller.CollidableObject {
        constructor(_name = "Floor") {
            super(_name);
            this.addComponent(new f.ComponentMaterial(Floor.material));
            let cmpMesh = new f.ComponentMesh(Floor.mesh);
            cmpMesh.pivot = L11_SideScroller.CollidableObject.pivot;
            this.addComponent(cmpMesh);
            this.addComponent(new f.ComponentTransform());
        }
        get moving() {
            return false;
        }
    }
    Floor.mesh = new f.MeshSprite();
    Floor.material = new f.Material("Floor", f.ShaderUniColor, new f.CoatColored(f.Color.CSS("red", 0.5)));
    L11_SideScroller.Floor = Floor;
    class MovingFloor extends Floor {
        constructor(_origin, _moveX = 1, _moveY = 0, _direction = 1, _maxMoveDistance = 5) {
            super("Floor");
            this.update = (_event) => {
                let timeFrame = f.Loop.timeFrameGame / 1000; // in seconds
                this.checkForReversal();
                let translation = this.cmpTransform.local.translation;
                this.move(translation, timeFrame);
                translation.y += this.speed.y * this.direction * timeFrame;
                this.cmpTransform.local.translation = translation;
            };
            this.originPoint = _origin;
            this.speed = new f.Vector3(_moveX, _moveY);
            this.maxMoveDistance = _maxMoveDistance;
            this.direction = _direction;
            this.cmpTransform.local.translate(this.originPoint);
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
            // _targetTranslation.y += speed.y * this.direction;
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
            ;
        }
    }
    L11_SideScroller.MovingFloor = MovingFloor;
})(L11_SideScroller || (L11_SideScroller = {}));
//# sourceMappingURL=Floor.js.map