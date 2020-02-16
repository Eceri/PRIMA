namespace L11_SideScroller {
  import f = FudgeCore;

  export class Projectile extends CollidableObject {
    private sprite: Sprite;
    private speed: f.Vector3;

    constructor(
      _name: string = "projectile",
      _sprites: Sprite,
      _playerPosition: f.Vector3,
      _direction: DIRECTION,
      _speed: f.Vector3 = new f.Vector3(5, 0)
    ) {
      super(_name);

      this.sprite = _sprites;
      this.speed = _speed;
      let diretion: number =_direction == DIRECTION.RIGHT ? 1 : -1
      this.speed.scale(diretion)
      let nodeSprite: NodeSprite = new NodeSprite(
        this.sprite.name,
        this.sprite
      );
      this.addComponent(new f.ComponentTransform());
      this.cmpTransform.local.translate(_playerPosition);
      nodeSprite.addComponent(new f.ComponentTransform())
      nodeSprite.cmpTransform.local.rotate(f.Vector3.Y(90 - 90 * diretion))
      nodeSprite.addEventListener(
        "showNext",
        (_event: Event) => {
          (<NodeSprite>_event.currentTarget).showFrameNext();
        },
        true
      );
      this.appendChild(nodeSprite);
      f.Loop.addEventListener(f.EVENT.LOOP_FRAME, this.update);
    }

    private update = (): void => {
      let timeFrame: number = f.Loop.timeFrameGame / 1000; // in seconds
      
      let translation: f.Vector3 = f.Vector3.SCALE(this.speed, timeFrame)
      this.cmpTransform.local.translate(translation);

      this.checkCollision();
    }

    private checkCollision() {
      let projectileRect: f.Rectangle = this.getRectWorld();
      for(let floor of level.getChildrenByName("Floor")) {
        if((<Floor>floor).getRectWorld().collides(projectileRect) ) {
          
          console.log(projectileRect.position.toString())
          console.log(projectileRect.height + "   " + projectileRect.width)
          console.log(floor.cmpTransform.local.translation.toString())
          // f.Loop.removeEventListener(f.EVENT.LOOP_FRAME, this.update);
          
          // this.getParent().removeChild(this);
        }
      }
    }
  }
}
