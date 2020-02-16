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
    private static sprites: Sprite[] = [];

    private static projectileSprite: Sprite;

    private static speedMax: f.Vector2 = new f.Vector2(2.5, 10); // units per second
    private static gravity: f.Vector2 = f.Vector2.Y(-10);
    public speed: f.Vector3 = f.Vector3.ZERO();

    private framesSinceLock: number = 0;
    public lockedInAnimation: boolean = false;

    private direction: number = 1;

    public grounded: boolean = true;

    private currentWeapon: WEAPON = WEAPON.AXE;
    private lastWeaponSwapTime: number = 1;

    constructor(_name: string = "Player") {
      super(_name);
      this.addComponent(new f.ComponentTransform());

      for (let sprite of Character.sprites) {
        //frameLock needs to be somewhere else
        let frameLock: number;
        if (sprite.name == ACTION.ATTACK + WEAPON.AXE) {
          frameLock = 3;
        } else if (sprite.name == ACTION.ATTACK + WEAPON.SCEPTER) {
          frameLock = 4;
        }
        let nodeSprite: NodeSprite = new NodeSprite(
          sprite.name,
          sprite,
          frameLock
        );
        nodeSprite.activate(false);
        nodeSprite.addComponent(new f.ComponentTransform());
        
        this.appendChild(nodeSprite);
      }
      this.addEventListener(
        "showNext",
        this.showNextFrame,
        true
      );

      this.show(ACTION.IDLE);
      f.Loop.addEventListener(f.EVENT.LOOP_FRAME, this.update);
    }

    private showNextFrame = () => {
      this.getActiveNodeSprite().showFrameNext();
      this.framesSinceLock += 1;

    }

    public static generateSprites(_txtImage: f.TextureImage): void {
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

      sprite = new Sprite(ACTION.ATTACK + WEAPON.AXE);
      sprite.generateByGrid(
        _txtImage,
        f.Rectangle.GET(40, 395, 110, 80),
        4,
        f.Vector2.X(55),
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

      sprite = new Sprite(ACTION.ATTACK + WEAPON.SCEPTER);
      sprite.generateByGrid(
        _txtImage,
        f.Rectangle.GET(40, 875, 110, 80),
        4,
        f.Vector2.X(55),
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

      //projectile Sprite
      sprite = new Sprite(WEAPON.SCEPTER + "PROJECTILE");
      sprite.generateByGrid(
        _txtImage,
        f.Rectangle.GET(5, 1255, 75, 25),
        4,
        f.Vector2.X(85),
        150,
        f.ORIGIN2D.BOTTOMCENTER
      );
      Character.projectileSprite = sprite;
    }

    private update = (_event: f.Eventƒ): void => {
      let timeFrame: number = f.Loop.timeFrameGame / 1000; // in seconds

      
      this.lastWeaponSwapTime += timeFrame;      
      let activeNodeSprite: NodeSprite = this.getActiveNodeSprite();
      if (this.framesSinceLock > activeNodeSprite.lockedFrames) {
        if (activeNodeSprite.name == ACTION.ATTACK + WEAPON.SCEPTER) {
          this.spawnScepterProjectile();
        }
        this.lockedInAnimation = false;
      };
      this.speed.y += Character.gravity.y * timeFrame;
      let distance: f.Vector3 = f.Vector3.SCALE(this.speed, timeFrame);

      this.cmpTransform.local.translate(distance);
      this.checkCollision();
    };

    private getActiveNodeSprite(): NodeSprite {
      return <NodeSprite>this.getChildren().find(child => child.isActive);
    }

    public swapWeapon(): void {
      if (this.lastWeaponSwapTime > 1) {
        this.currentWeapon =
          this.currentWeapon == WEAPON.AXE ? WEAPON.SCEPTER : WEAPON.AXE;
        this.lastWeaponSwapTime = 0;
      }
    }

    public show(_action: ACTION): void {
      let actionName: string = _action + this.currentWeapon;
      for (let child of this.getChildren())
        child.activate(child.name == actionName);
    }

    public act(_action: ACTION, _direction?: DIRECTION): void {
      if (!this.lockedInAnimation) {
        let currentAction = _action;

        if (_direction != undefined) {
          this.direction = _direction == DIRECTION.RIGHT ? 1 : -1;
        }
        switch (currentAction) {
          case ACTION.IDLE:
            this.speed.x = 0;
            break;
          case ACTION.JUMP:
            if (this.grounded) this.speed.y = 5;
            this.framesSinceLock = 0;
            break;
          case ACTION.WALK:
            this.speed.x = Character.speedMax.x * this.direction;
            for (let child of this.getChildren())
              child.cmpTransform.local.rotation = f.Vector3.Y(
                90 - 90 * this.direction
              );
            break;
          case ACTION.ATTACK:
            this.framesSinceLock = 0;
            this.getActiveNodeSprite().resetFrames();
            this.lockedInAnimation = true;
            if (this.speed.y != 0 && this.currentWeapon == WEAPON.AXE)
              this.speed.x *= 2;
            break;
        }
        if (this.speed.y != 0) {
          this.grounded = false;
          if (_action != ACTION.WALK && _action != ACTION.ATTACK)
            currentAction = ACTION.FALL;
        }
        this.show(currentAction);
      }
    }

    private spawnScepterProjectile(): void {
      let translation: f.Vector3 = this.cmpTransform.local.translation;
      translation.y -= this.getRectWorld().height / 2;
      let projectile: Projectile = new Projectile(
        "ScepterAttack",
        Character.projectileSprite,
        translation,
        this.direction,
        f.Vector3.X(5)
      );
      this.getParent().appendChild(projectile)
    }

    public getRectWorld(): f.Rectangle {
      return this.getActiveNodeSprite().getRectWorld();
    }

    private checkCollision(): void {
      f.RenderManager.update();
      for (let floor of level.getChildrenByName("Floor")) {
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
