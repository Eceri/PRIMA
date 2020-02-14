namespace L11_SideScroller {
  import f = FudgeCore;

  export class Floor extends CollidableObject {
    protected static mesh: f.MeshSprite = new f.MeshSprite();
    private static material: f.Material = new f.Material(
      "Floor",
      f.ShaderUniColor,
      new f.CoatColored(f.Color.CSS("red", 0.5))
    );
    public constructor(_name: string = "StaticFloor") {
      super(_name);
      this.addComponent(new f.ComponentMaterial(Floor.material));
      let cmpMesh: f.ComponentMesh = new f.ComponentMesh(Floor.mesh);
      cmpMesh.pivot = CollidableObject.pivot;
      this.addComponent(cmpMesh);
      this.addComponent(new f.ComponentTransform());
    }

    public get moving(): boolean {
      return false;
    }
  }

  export class MovingFloor extends Floor {
    private speed: f.Vector3;
    private originPoint: f.Vector3;
    private maxMoveDistance: number;
    private direction: number;
    public constructor(
      _origin: f.Vector3,
      _moveX: number = 0.1,
      _moveY: number = 0,
      _direction: number = 1,
      _maxMoveDistance: number = 5
    ) {
      super("MovingFloor");
      this.originPoint = _origin;
      this.speed = new f.Vector3(_moveX, _moveY);
      this.maxMoveDistance = _maxMoveDistance;
      this.direction = _direction;
      this.cmpTransform.local.translate(this.originPoint);
      f.Loop.addEventListener(f.EVENT.LOOP_FRAME, this.update);
    }

    public get moving(): boolean {
      return true;
    }

    public get moveSpeed(): f.Vector3 {
      return this.speed.copy;
    }

    public applyTranslation(_targetTranslation: f.Vector3): void {
      _targetTranslation.x += this.moveSpeed.x * this.direction;
      _targetTranslation.y += this.moveSpeed.y * this.direction;
    }

    private checkForReversal(): boolean {
      let positivDistanceCheck: boolean =
        this.direction == 1 &&
        (this.cmpTransform.local.translation.x >
          this.originPoint.x + this.maxMoveDistance ||
          this.cmpTransform.local.translation.y >
            this.originPoint.y + this.maxMoveDistance);
      let negativDistanceCheck;
      this.direction == -1 &&
        (this.cmpTransform.local.translation.x < this.originPoint.x ||
          this.cmpTransform.local.translation.y < this.originPoint.y);
      return positivDistanceCheck || negativDistanceCheck;
    }

    private update = (_event: f.Eventƒ): void => {
      if (this.checkForReversal()) this.direction *= -1;
      let translation: f.Vector3 = this.cmpTransform.local.translation;
      this.applyTranslation(translation);
      this.cmpTransform.local.translation = translation;
    };
  }
}
