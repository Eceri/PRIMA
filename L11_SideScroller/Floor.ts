namespace L11_SideScroller {
  import f = FudgeCore;

  export enum FLOORTYPE {
    RECT = "Rectangle",
    THINRECT = "ThinRectangle"
  }
  export class Floor extends CollidableObject {
    protected static sprites: Sprite[] = [];
    protected static mesh: f.MeshSprite = new f.MeshSprite();
    public static txtImage: f.TextureImage;
    // private static material: f.Material = new f.Material(
    //   "Floor",
    //   f.ShaderTexture
    // );
    public static material: f.Material;

    /**
     * @param _position position of the floor tile
     * @param _type type of the Floor: Thin or Rectangle
     */
    constructor(_position: f.Vector3, _type: FLOORTYPE) {
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

      let coat: f.CoatTextured = new f.CoatTextured();
      coat.texture = Floor.txtImage;
      let material: f.Material = new f.Material(
        "FloorMaterial",
        f.ShaderTexture,
        coat
      );
      this.addComponent(new f.ComponentMaterial(material));
      let cmpMesh: f.ComponentMesh = new f.ComponentMesh(Floor.mesh);
      cmpMesh.pivot = Floor.pivot;
      this.addComponent(cmpMesh);
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
      _moveSpeed: f.Vector3,
      _type: FLOORTYPE,
      _direction: number = 1,
      _maxMoveDistance: number = 5
    ) {
      super(_origin, _type);

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
      let speed: f.Vector3 = this.moveSpeed;
      speed.scale(_timeFrame);
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
      if (positivDistanceCheck || negativDistanceCheck) {
        this.direction *= -1;
      }
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
