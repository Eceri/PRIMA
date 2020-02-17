namespace L11_SideScroller {
  import f = FudgeCore;

  export class Floor extends CollidableObject {
    protected static sprite: Sprite;
    protected static mesh: f.MeshSprite = new f.MeshSprite();
    private static material: f.Material = new f.Material(
      "Floor",
      f.ShaderUniColor,
      new f.CoatColored(f.Color.CSS("red", 0.5))
    );

    /**
     * @param _position position of the floor tile,
     */
    constructor(_position: f.Vector3) {
      super("Floor");
      this.addComponent(new f.ComponentMaterial(Floor.material));
      let cmpMesh: f.ComponentMesh = new f.ComponentMesh(Floor.mesh);
      cmpMesh.pivot = CollidableObject.pivot;
      this.addComponent(cmpMesh);
      this.addComponent(new f.ComponentTransform());
      this.cmpTransform.local.translate(_position)
    }

    public get moving(): boolean {
      return false;
    }
    public static generateSprites(_txtImage: f.TextureImage): void {
      this.sprite = new Sprite("FloorSprite");
       this.sprite.generateByGrid(
        _txtImage,
        f.Rectangle.GET(55, 245, 70, 70),
        4,
        f.Vector2.X(90),
        90,
        f.ORIGIN2D.BOTTOMCENTER
      );
    }
  }


  export class MovingFloor extends Floor {
    private speed: f.Vector3;
    private originPoint: f.Vector3;
    private maxMoveDistance: number;
    private direction: number;
    public constructor(
      _origin: f.Vector3,
      _moveSpeed: f.Vector3,
      _direction: number = 1,
      _maxMoveDistance: number = 5
    ) {
      super(_origin);

      this.originPoint = _origin;
      this.speed = _moveSpeed;
      this.maxMoveDistance = _maxMoveDistance;
      this.direction = _direction;
      this.cmpTransform.local.translation = this.originPoint;
      f.Loop.addEventListener(f.EVENT.LOOP_FRAME, this.update);
    }

    public get moving(): boolean {
      return true;
    }

    public get moveSpeed(): f.Vector3 {
      return this.speed.copy;
    }

    public move(_targetTranslation: f.Vector3, _timeFrame: number): void {
      let speed: f.Vector3 = this.moveSpeed
      speed.scale(_timeFrame)
      _targetTranslation.x += speed.x * this.direction;
      _targetTranslation.y += speed.y * this.direction;
    }

    private checkForReversal(): void {
      let positivDistanceCheck: boolean =
        this.direction == 1 &&
        (this.cmpTransform.local.translation.x >
          this.originPoint.x + this.maxMoveDistance ||
          this.cmpTransform.local.translation.y >
            this.originPoint.y + this.maxMoveDistance);
      let negativDistanceCheck =
        this.direction == -1 &&
        (this.cmpTransform.local.translation.x < this.originPoint.x ||
          this.cmpTransform.local.translation.y < this.originPoint.y);
      if(positivDistanceCheck || negativDistanceCheck) {
        this.direction *= -1
      };
    }

    private update = (_event: f.Eventƒ): void => {
      let timeFrame: number = f.Loop.timeFrameGame / 1000; // in seconds
      this.checkForReversal();
      let translation: f.Vector3 = this.cmpTransform.local.translation;
      this.move(translation, timeFrame);
      
      // translation.y += this.speed.y * this.direction * timeFrame;
      this.cmpTransform.local.translation = translation;
    };
  }
}
