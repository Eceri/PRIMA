"use strict";
var L10_FudgeCraft_Combos;
(function (L10_FudgeCraft_Combos) {
    var ƒ = FudgeCore;
    class CameraControl extends ƒ.Node {
        constructor(_maxAngle) {
            super("CameraControl"); //also camera rotation
            this.maxAngle = 89;
            this.minDistance = 5;
            this.camera = new ƒ.ComponentCamera();
            this.camera.pivot.translate(new ƒ.Vector3(0, 0, 20)); // default view angle
            this.camera.pivot.lookAt(ƒ.Vector3.ZERO());
            this.camera.backgroundColor = ƒ.Color.CSS("WHITE");
            this.xAxisRotator = new ƒ.Node("xAxisRotation");
            this.addComponent(new ƒ.ComponentTransform());
            this.xAxisRotator.addComponent(new ƒ.ComponentTransform());
            this.appendChild(this.xAxisRotator);
            this.xAxisRotator.addComponent(this.camera);
        }
        get cmpCamera() {
            return this.camera;
        }
        get xRotator() {
            return this.xAxisRotator;
        }
        translate(_distanceDelta) {
            this.setDistance(this.camera.pivot.translation.z + _distanceDelta * 0.5);
        }
        setDistance(_distance) {
            let newDistance = Math.max(_distance, this.minDistance);
            this.camera.pivot.translation = ƒ.Vector3.Z(newDistance);
        }
        setRotationY(_angle) {
            this.cmpTransform.local.rotation = ƒ.Vector3.Y(_angle);
        }
        setRotationX(_angle) {
            _angle = Math.min(Math.max(-this.maxAngle, _angle), this.maxAngle);
            this.xRotator.cmpTransform.local.rotation = ƒ.Vector3.X(_angle);
        }
        rotateY(_delta) {
            this.cmpTransform.local.rotateY(_delta);
        }
        rotateX(_delta) {
            let angle = this.xRotator.cmpTransform.local.rotation.x + _delta;
            this.setRotationX(angle);
        }
    }
    L10_FudgeCraft_Combos.CameraControl = CameraControl;
})(L10_FudgeCraft_Combos || (L10_FudgeCraft_Combos = {}));
//# sourceMappingURL=CameraControl.js.map