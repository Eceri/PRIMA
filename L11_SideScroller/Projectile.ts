namespace L11_SideScroller {
  import f = FudgeCore;

  export class Projectile extends CollidableObject {
    private sprite: Sprite;
    private originPoint: f.Vector3;
    private travelDistance: f.Vector2 = f.Vector2.X(5);
    private speed: f.Vector3;
    private direction: number;

    constructor(
      _name: string = "projectile",
      _sprites: Sprite,
      _playerPosition: f.Vector3,
      _direction: DIRECTION,
      _speed: f.Vector3 = new f.Vector3(2, 0),
      _travelDistance?: f.Vector2
    ) {
      super(_name);

      this.sprite = _sprites;
      this.speed = _speed;
      this.direction =_direction == DIRECTION.RIGHT ? 1 : -1
      this.speed.scale(this.direction)
      let nodeSprite: NodeSprite = new NodeSprite(
        this.sprite.name,
        this.sprite
      );
      this.addComponent(new f.ComponentTransform());
      this.originPoint = _playerPosition;
      this.cmpTransform.local.translate(this.originPoint);
      nodeSprite.addComponent(new f.ComponentTransform())
      nodeSprite.cmpTransform.local.rotate(f.Vector3.Y(90 - 90 * this.direction))
      nodeSprite.addEventListener(
        "showNext",
        (_event: Event) => {
          (<NodeSprite>_event.currentTarget).showFrameNext();
        },
        true
      );
      this.appendChild(nodeSprite);
      f.Loop.addEventListener(f.EVENT.LOOP_FRAME, this.update);
      this.cmpTransform.local.scale(new f.Vector3(.4,.4))
    }

    private update = (): void => {
      let timeFrame: number = f.Loop.timeFrameGame / 1000; // in seconds
      
      let translation: f.Vector3 = f.Vector3.SCALE(this.speed, timeFrame)
      this.cmpTransform.local.translate(translation);
      let maxDistance: number = this.originPoint.x + this.travelDistance.x;

      if ( maxDistance < this.cmpTransform.local.translation.x) {
        f.Loop.removeEventListener(f.EVENT.LOOP_FRAME, this.update);
        this.getParent().removeChild(this);
      }else this.checkCollision();
    }

    private checkCollision() {
      let projectileRect: f.Rectangle = this.getRectWorld();
      for(let floor of level.getChildrenByName("Floor")) {
        if((<Floor>floor).getRectWorld().collides(projectileRect) ) {
          
          console.log(projectileRect.position.toString())
          console.log(projectileRect.height + "   " + projectileRect.width)
          console.log(floor.cmpTransform.local.translation.toString())

          f.Loop.removeEventListener(f.EVENT.LOOP_FRAME, this.update);
          this.getParent().removeChild(this);
        }
      }
    }
  }
}
