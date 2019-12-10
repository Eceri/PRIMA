namespace L09_FudgeCraft_Camera {
  import ƒ = FudgeCore;
  export class CameraControl extends ƒ.Node {
    private camera: ƒ.ComponentCamera;
    private xAxisRotator: ƒ.Node;
    private maxAngle: number = 89;
    public minDistance: number = 5;

    constructor(_maxAngle?: number) {
      super("CameraControl"); //also camera rotation

      this.camera = new ƒ.ComponentCamera();
      this.camera.pivot.translate(new ƒ.Vector3(0, 0, 20)); // default view angle
      this.camera.pivot.lookAt(ƒ.Vector3.ZERO());
      this.camera.backgroundColor = ƒ.Color.WHITE;

      this.xAxisRotator = new ƒ.Node("xAxisRotation");

      this.addComponent(new ƒ.ComponentTransform());
      this.xAxisRotator.addComponent(new ƒ.ComponentTransform());
      this.appendChild(this.xAxisRotator);
      this.xAxisRotator.addComponent(this.camera);
    }

    get cmpCamera(): ƒ.ComponentCamera {
      return this.camera;
    }
    get xRotator(): ƒ.Node {
      return this.xAxisRotator;
    }

    public translate(_distanceDelta: number) {
      this.setDistance(this.camera.pivot.translation.z + _distanceDelta * 0.5);
    }
    public setDistance(_distance: number): void {
      let newDistance: number = Math.max(_distance, this.minDistance);
      this.camera.pivot.translation = ƒ.Vector3.Z(newDistance);
    }
    setRotationY(_angle: number): void {
      this.cmpTransform.local.rotation = ƒ.Vector3.Y(_angle);
    }

    setRotationX(_angle: number): void {
      _angle = Math.min(Math.max(-this.maxAngle, _angle), this.maxAngle);
      this.xRotator.cmpTransform.local.rotation = ƒ.Vector3.X(_angle);
    }

    rotateY(_delta: number): void {
      this.cmpTransform.local.rotateY(_delta);
    }

    rotateX(_delta: number): void {
      let angle: number = this.xRotator.cmpTransform.local.rotation.x + _delta;
      this.setRotationX(angle);
    }
  }
}
