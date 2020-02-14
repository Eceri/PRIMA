// / <reference path="../L14_ScrollerFoundation/SpriteGenerator.ts"/>
namespace L11_SideScroller {
  import f = FudgeCore;

  export enum ACTION {
    IDLE = "Idle",
    WALK = "Walk",
    JUMP = "Jump",
    FALL = "Fall",
    LAUNCH = "Launch"
  }
  export enum DIRECTION {
    LEFT,
    RIGHT
  }

  export class Character extends f.Node {
    private static sprites: Sprite[];
    private static speedMax: f.Vector2 = new f.Vector2(1.5, 5); // units per second
    private static gravity: f.Vector2 = f.Vector2.Y(-5);
    // private action: ACTION;
    // private time: ƒ.Time = new ƒ.Time();
    public speed: f.Vector3 = f.Vector3.ZERO();
    public grounded: boolean = true;

    constructor(_name: string = "Hare") {
      super(_name);
      this.addComponent(new f.ComponentTransform());

      for (let sprite of Character.sprites) {
        let nodeSprite: NodeSprite = new NodeSprite(sprite.name, sprite);
        nodeSprite.activate(false);
        nodeSprite.addComponent(new f.ComponentTransform());
        nodeSprite.addEventListener(
          "showNext",
          (_event: Event) => {
            (<NodeSprite>_event.currentTarget).showFrameNext();
          },
          true
        );

        this.appendChild(nodeSprite);
      }

      this.show(ACTION.IDLE);
      f.Loop.addEventListener(f.EVENT.LOOP_FRAME, this.update);
    }

    public static generateSprites(_txtImage: f.TextureImage): void {
      Character.sprites = [];
      let sprite: Sprite = new Sprite(ACTION.WALK);
      sprite.generateByGrid(
        _txtImage,
        f.Rectangle.GET(2, 104, 68, 64),
        6,
        f.Vector2.ZERO(),
        64,
        f.ORIGIN2D.BOTTOMCENTER
      );
      Character.sprites.push(sprite);

      sprite = new Sprite(ACTION.IDLE);
      sprite.generateByGrid(
        _txtImage,
        f.Rectangle.GET(8, 10, 45, 80),
        4,
        f.Vector2.ZERO(),
        64,
        f.ORIGIN2D.BOTTOMCENTER
      );
      Character.sprites.push(sprite);

      sprite = new Sprite(ACTION.JUMP);
      sprite.generateByGrid(
        _txtImage,
        f.Rectangle.GET(200, 180, 50, 80),
        1,
        f.Vector2.ZERO(),
        64,
        f.ORIGIN2D.BOTTOMCENTER
      );
      Character.sprites.push(sprite);

      sprite = new Sprite(ACTION.FALL);
      sprite.generateByGrid(
        _txtImage,
        f.Rectangle.GET(340, 170, 60, 80),
        1,
        f.Vector2.ZERO(),
        64,
        f.ORIGIN2D.BOTTOMCENTER
      );
      Character.sprites.push(sprite);

      sprite = new Sprite(ACTION.LAUNCH);
      sprite.generateByGrid(
        _txtImage,
        f.Rectangle.GET(140, 180, 60, 80),
        4,
        f.Vector2.ZERO(),
        64,
        f.ORIGIN2D.BOTTOMCENTER
      );
    }

    public show(_action: ACTION): void {
      let currentAction: ACTION = _action;

      if (_action != ACTION.WALK && this.speed.y != 0) {
        currentAction = ACTION.FALL;
        this.grounded = false;
      }
      for (let child of this.getChildren())
        child.activate(child.name == currentAction);
    }

    public act(_action: ACTION, _direction?: DIRECTION): void {
      switch (_action) {
        case ACTION.IDLE:
          this.speed.x = 0;
          break;
        case ACTION.WALK:
          let direction: number = _direction == DIRECTION.RIGHT ? 1 : -1;
          this.speed.x = Character.speedMax.x * direction; // * direction;
          for (let child of this.getChildren())
            child.cmpTransform.local.rotation = f.Vector3.Y(
              90 - 90 * direction
            );
          // this.cmpTransform.local.rotation = f.Vector3.Y(90 - 90 * direction);
          break;
        case ACTION.LAUNCH:
          if (this.grounded) this.speed.y = 5;
          break;
      }
      this.show(_action);
    }

    private update = (_event: f.Eventƒ): void => {
      this.broadcastEvent(new CustomEvent("showNext"));
      let timeFrame: number = f.Loop.timeFrameGame / 1000;
      this.speed.y += Character.gravity.y * timeFrame;
      let distance: f.Vector3 = f.Vector3.SCALE(this.speed, timeFrame);

      this.cmpTransform.local.translate(distance);
      this.checkCollision();
    };
    private checkCollision(): void {
      for (let floor of level.getChildren()) {
        f.RenderManager.update();
        let rectFloor: f.Rectangle = (<Floor>floor).getRectWorld();
        let activeChild: NodeSprite = <NodeSprite>(
          this.getChildren().filter(child => child.isActive)[0]
        );
        let rectPlayer: f.Rectangle = (<NodeSprite>activeChild).getRectWorld();

        if (rectFloor.collides(rectPlayer)) {
          let translation: f.Vector3 = this.cmpTransform.local.translation;

          let distanceX: number, distanceY: number;
          //calculate distance , accomodation for scalin to get proper distances
          let rectPos = rectFloor.position
          distanceX =
            (rectPlayer.x - rectPos.x) / floor.cmpTransform.local.scaling.x;
          distanceY =
            (rectPlayer.y - rectPos.y) / floor.cmpTransform.local.scaling.y;

            console.log("top:" + rectFloor.top + " right: " + rectFloor.right + " bottom: " + rectFloor.bottom + " left: " + rectFloor.left +  " pos: " + rectFloor.position.toString())

          //when the absolute distance of y > then the distance of x, its a y Collision 
          if (distanceY * distanceY > distanceX * distanceX) {
            if (distanceY > 0) {
              translation.y = rectFloor.bottom;
              this.grounded = true;
            } else translation.y = rectFloor.top - 1.25;
            this.speed.y = 0;
          } else {
            if (distanceX > 0) {
              console.log("x Collision:  distance: X " + distanceX + "  y "+  distanceY);
              translation.x = rectFloor.left; //+ (rectPlayer.width / 2);
            } else {
              translation.x = rectFloor.right; //- (rectPlayer.width / 2);
              console.log("Push to right")
            }
              this.speed.x = 0;
          }
          if ((<Floor>floor).moving) {
            (<MovingFloor>floor).applyTranslation(translation);
          }

          this.cmpTransform.local.translation = translation;
          // this.checkCollision();
        }
      }
    }
  }
}
