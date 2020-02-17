namespace L11_SideScroller {
  import f = FudgeCore

  export class Background extends f.Node{

    constructor(_name: string, _backgrounds: HTMLImageElement[], _zDistance: number = 35) {
      super(_name);

      let zPos: number = 0;
      for(let i = 0; i < _backgrounds.length; i++) {
        let textureImage: f.TextureImage = new f.TextureImage();
        textureImage.image = _backgrounds[i];

        let sprite: Sprite = new Sprite("BackkgroundSprite_" + i);
        sprite.generateByGrid(
          textureImage,
          f.Rectangle.GET(0 , 0 , _backgrounds[i].width, _backgrounds[i].height),
          1,
          f.Vector2.ZERO(),
          zPos,
          f.ORIGIN2D.CENTER
        );

        let nodeSprite: NodeSprite = new NodeSprite(
          sprite.name,
          sprite
        );
        
        nodeSprite.addComponent(new f.ComponentTransform());
        nodeSprite.cmpTransform.local.scale(new f.Vector3(-10 * i * i, -10 * i * i, 0))
        this.appendChild(nodeSprite);
        nodeSprite.cmpTransform.local.translateZ(zPos);
        zPos -= _zDistance;
        
        this.appendChild(nodeSprite);
      }
      this.addComponent(new f.ComponentTransform())
      this.cmpTransform.local.translateZ(-.1)
    }
  }

}