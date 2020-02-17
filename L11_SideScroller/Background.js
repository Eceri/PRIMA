"use strict";
var L11_SideScroller;
(function (L11_SideScroller) {
    var f = FudgeCore;
    class Background extends f.Node {
        constructor(_name, _backgrounds, _zDistance = 35) {
            super(_name);
            let zPos = 0;
            for (let i = 0; i < _backgrounds.length; i++) {
                let textureImage = new f.TextureImage();
                textureImage.image = _backgrounds[i];
                let sprite = new L11_SideScroller.Sprite("BackkgroundSprite_" + i);
                sprite.generateByGrid(textureImage, f.Rectangle.GET(0, 0, _backgrounds[i].width, _backgrounds[i].height), 1, f.Vector2.ZERO(), zPos, f.ORIGIN2D.CENTER);
                let nodeSprite = new L11_SideScroller.NodeSprite(sprite.name, sprite);
                nodeSprite.addComponent(new f.ComponentTransform());
                nodeSprite.cmpTransform.local.scale(new f.Vector3(-10 * i * i, -10 * i * i, 0));
                this.appendChild(nodeSprite);
                nodeSprite.cmpTransform.local.translateZ(zPos);
                zPos -= _zDistance;
                this.appendChild(nodeSprite);
            }
            this.addComponent(new f.ComponentTransform());
            this.cmpTransform.local.translateZ(-.1);
        }
    }
    L11_SideScroller.Background = Background;
})(L11_SideScroller || (L11_SideScroller = {}));
//# sourceMappingURL=Background.js.map