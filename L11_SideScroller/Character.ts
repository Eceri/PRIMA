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
    private static gravity: f.Vector2 = f.Vector2.Y(-3);
    // private action: ACTION;
    // private time: ƒ.Time = new ƒ.Time();
    public speed: f.Vector3 = f.Vector3.ZERO();

    constructor(_name: string = "Hare") {
      super(_name);
      this.addComponent(new f.ComponentTransform());

      for (let sprite of Character.sprites) {
        let nodeSprite: NodeSprite = new NodeSprite(sprite.name, sprite);
        nodeSprite.activate(false);
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
        f.Rectangle.GET(8, 20, 45, 80),
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
      // if (_action == ACTION.JUMP)
      //   // this.getChildrenByName()
      //   return;
      for (let child of this.getChildren())
        child.activate(child.name == _action);
      // this.action = _action;
    }

    public act(_action: ACTION, _direction?: DIRECTION): void {
      let currentAction: ACTION = _action;
      switch (currentAction) {
        case ACTION.IDLE:
          this.speed.x = 0;
          break;
        case ACTION.WALK:
          let direction: number = _direction == DIRECTION.RIGHT ? 1 : -1;
          this.speed.x = Character.speedMax.x; // * direction;
          this.cmpTransform.local.rotation = f.Vector3.Y(90 - 90 * direction);
          // console.log(direction);
          break;
        case ACTION.LAUNCH:
          this.speed.y = 3;
          break;
        }
        if(this.speed.y > 0) currentAction = ACTION.JUMP;
        else if(this.speed.y < 0) currentAction = ACTION.FALL;
      this.show(currentAction);
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
        let rectFloor: f.Rectangle = (<Floor>floor).getRectWorld();
        //console.log(rect.toString());
        let hit: boolean = rectFloor.isInside(
          this.cmpTransform.local.translation.toVector2()
        );
        let playerTranslation: f.Vector3 = this.cmpTransform.local.translation
        let rectPlayer: f.Rectangle = f.Rectangle.GET(playerTranslation.x, playerTranslation.y, 0, 0, f.ORIGIN2D.BOTTOMCENTER)
        hit = rectFloor.collides(rectPlayer)
        console.log(rectFloor.collides(rectPlayer))
        if (hit) {
          let translation: f.Vector3 = this.cmpTransform.local.translation;
          let heightDifference: number = rectFloor.y - translation.y
          if (heightDifference < .2) {
            translation.y = rectFloor.y;
            this.speed.y = 0;
          } else translation.x = rectFloor.x - .5
          this.cmpTransform.local.translation = translation;
        }
      }
    }
  }
}
