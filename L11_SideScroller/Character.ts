// / <reference path="../L14_ScrollerFoundation/SpriteGenerator.ts"/>
namespace L11_SideScroller {
  import f = FudgeCore;

  export enum ACTION {
    IDLE = "Idle",
    WALK = "Walk",
    JUMP = "Jump",
    FALL = "Fall",
    ATTACK = "Attack"
  }
  enum WEAPON {
    AXE = "Axe",
    SCEPTER = "Scepter"
  }
  export enum DIRECTION {
    LEFT,
    RIGHT
  }

  export class Character extends f.Node {
    private static sprites: Sprite[];

    private static speedMax: f.Vector2 = new f.Vector2(2.5, 10); // units per second
    private static gravity: f.Vector2 = f.Vector2.Y(-9);
    public speed: f.Vector3 = f.Vector3.ZERO();

    public grounded: boolean = true;

    private currentWeapon: WEAPON = WEAPON.AXE;

    private lastFrameTime: number = 0;

    private activeActions: ACTION[] = [];
    private framesSinceLock: number = 0;
    private lockedInAnimation: boolean = false;

    private animationFPS: number = 0.2; // .2 = 5 FPS

    constructor(_name: string = "Player") {
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
      this.addEventListener("lockFramesEnded", this.releaseAnimationLock);
    }

    public static generateSprites(_txtImage: f.TextureImage): void {
      Character.sprites = [];

      //Axe Sprites
      let sprite: Sprite = new Sprite(ACTION.IDLE + WEAPON.AXE);
      sprite.generateByGrid(
        _txtImage,
        f.Rectangle.GET(55, 245, 70, 70),
        4,
        f.Vector2.X(90),
        90,
        f.ORIGIN2D.BOTTOMCENTER
      );
      Character.sprites.push(sprite);

      sprite = new Sprite(ACTION.WALK + WEAPON.AXE);
      sprite.generateByGrid(
        _txtImage,
        f.Rectangle.GET(45, 75, 80, 80),
        4,
        f.Vector2.X(85),
        90,
        f.ORIGIN2D.BOTTOMCENTER
      );
      Character.sprites.push(sprite);

      sprite = new Sprite(ACTION.JUMP + WEAPON.AXE);
      sprite.generateByGrid(
        _txtImage,
        f.Rectangle.GET(40, 75, 80, 80),
        1,
        f.Vector2.X(80),
        90,
        f.ORIGIN2D.BOTTOMCENTER
      );
      Character.sprites.push(sprite);

      sprite = new Sprite(ACTION.FALL + WEAPON.AXE);
      sprite.generateByGrid(
        _txtImage,
        f.Rectangle.GET(40, 1035, 80, 80),
        2,
        f.Vector2.X(80),
        90,
        f.ORIGIN2D.BOTTOMCENTER
      );
      Character.sprites.push(sprite);

      //Scepter Sprites
      sprite = new Sprite(ACTION.WALK + WEAPON.SCEPTER);
      sprite.generateByGrid(
        _txtImage,
        f.Rectangle.GET(45, 555, 80, 80),
        4,
        f.Vector2.X(85),
        90,
        f.ORIGIN2D.BOTTOMCENTER
      );
      Character.sprites.push(sprite);

      sprite = new Sprite(ACTION.IDLE + WEAPON.SCEPTER);
      sprite.generateByGrid(
        _txtImage,
        f.Rectangle.GET(55, 725, 70, 70),
        4,
        f.Vector2.X(90),
        90,
        f.ORIGIN2D.BOTTOMCENTER
      );
      Character.sprites.push(sprite);

      sprite = new Sprite(ACTION.JUMP + WEAPON.SCEPTER);
      sprite.generateByGrid(
        _txtImage,
        f.Rectangle.GET(40, 75, 80, 80),
        1,
        f.Vector2.X(80),
        90,
        f.ORIGIN2D.BOTTOMCENTER
      );
      Character.sprites.push(sprite);

      sprite = new Sprite(ACTION.FALL + WEAPON.SCEPTER);
      sprite.generateByGrid(
        _txtImage,
        f.Rectangle.GET(40, 1035, 80, 80),
        2,
        f.Vector2.X(80),
        90,
        f.ORIGIN2D.BOTTOMCENTER
      );
      Character.sprites.push(sprite);
    }

    public swapWeapon(): void {
      this.currentWeapon =
        this.currentWeapon == WEAPON.AXE ? WEAPON.SCEPTER : WEAPON.AXE;
      console.log("WeaponSwap! new Weapon: " + this.currentWeapon)
    }

    public show(_action: ACTION): void {
      let actionName: string = _action + this.currentWeapon;
      console.log(actionName)
      for (let child of this.getChildren())
        child.activate(child.name == actionName);
    }

    public act(_action: ACTION, _direction?: DIRECTION): void {
      // if (!this.lockedInAnimation) {
      let currentAction = _action;
      
      if (this.speed.y != 0) {
        this.grounded = false;
        if (_action != ACTION.WALK) currentAction = ACTION.FALL;
      }
      switch (currentAction) {
        case ACTION.IDLE:
          this.speed.x = 0;
          break;
        case ACTION.JUMP:
          console.log("JUMPED");
          if (this.grounded) this.speed.y = 5;
          this.lockedInAnimation = true;
          console.log(this.lockedInAnimation);
          this.framesSinceLock = 0;
          break;
        case ACTION.WALK:
          let direction: number = _direction == DIRECTION.RIGHT ? 1 : -1;
          this.speed.x = Character.speedMax.x * direction;
          for (let child of this.getChildren())
            child.cmpTransform.local.rotation = f.Vector3.Y(
              90 - 90 * direction
            );
          break;
      }
      this.show(currentAction);
      // }
    }

    private update = (_event: f.Eventƒ): void => {
      let timeFrame: number = f.Loop.timeFrameGame / 1000; // in seconds

      //simple limit to animation, so the game can run at higher frame rates
      this.lastFrameTime += timeFrame;
      while (this.lastFrameTime > this.animationFPS) {
        this.broadcastEvent(new CustomEvent("showNext"));
        this.framesSinceLock += 1;

        let activeNodeSprite: NodeSprite = <NodeSprite>(
          this.getChildren().find(child => child.isActive)
        );

        this.lockedInAnimation =
          this.framesSinceLock < activeNodeSprite.lockedFrames;

        this.lastFrameTime -= this.animationFPS;
      }
      this.speed.y += Character.gravity.y * timeFrame;
      let distance: f.Vector3 = f.Vector3.SCALE(this.speed, timeFrame);

      this.cmpTransform.local.translate(distance);
      this.checkCollision();
    };

    public getRectWorld(): f.Rectangle {
      let activeChild: NodeSprite = <NodeSprite>(
        this.getChildren().find(child => child.isActive)
      );
      return activeChild.getRectWorld();
      // return this.hitRect.copy
    }

    public releaseAnimationLock = () => {
      this.activeActions.pop();
    };

    private checkCollision(): void {
      for (let floor of level.getChildren()) {
        f.RenderManager.update();
        let rectFloor: f.Rectangle = (<Floor>floor).getRectWorld();
        let rectPlayer: f.Rectangle = this.getRectWorld();

        if (rectFloor.collides(rectPlayer)) {
          let translation: f.Vector3 = this.cmpTransform.local.translation;
          let distanceX: number, distanceY: number;

          // let movingFloor: boolean = (<Floor>floor).moving;

          if ((<Floor>floor).moving)
            (<MovingFloor>floor).move(translation, f.Loop.timeFrameGame / 1000);

          //calculate distances, with regards to width and height to get relative values
          let rectPos = rectFloor.position;
          distanceX = (rectPlayer.x - rectPos.x) / rectFloor.width;
          distanceY = (rectPlayer.y - rectPos.y) / rectFloor.height;

          //higher distance deternmins direction. if distances are equal, resolve in x direction first
          if (distanceY * distanceY > distanceX * distanceX) {
            if (distanceY < 0) {
              //ground hit
              translation.y = rectFloor.bottom;
              this.grounded = true;
              this.speed.y = 0;
            } else {
              //ceiling hit
              translation.y = rectFloor.top + rectPlayer.height;
              if (this.speed.y > 0) this.speed.y = 0;
            }
          } else {
            if (distanceX > 0) {
              //left player sides hits
              translation.x = rectFloor.right + rectPlayer.width / 2;
            } else {
              //right player side hits
              translation.x = rectFloor.left - rectPlayer.width / 2;
            }
            this.speed.x = 0;
          }
          this.cmpTransform.local.translation = translation;
        }
      }
    }
  }
}
