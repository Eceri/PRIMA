"use strict";
var L11_SideScroller;
(function (L11_SideScroller) {
    var f = FudgeCore;
    class CollidableObject extends f.Node {
        constructor(_name) {
            super(_name);
        }
        getRectWorld() {
            let rect = f.Rectangle.GET(0, 0, 100, 100, f.ORIGIN2D.BOTTOMCENTER);
            let topleft = new f.Vector3(-0.5, 0.5, 0);
            let bottomright = new f.Vector3(0.5, -0.5, 0);
            let mtxResult = this.mtxWorld;
            topleft.transform(mtxResult, true);
            bottomright.transform(mtxResult, true);
            let size = new f.Vector2(bottomright.x - topleft.x, bottomright.y - topleft.y);
            rect.position = topleft.toVector2();
            rect.size = size;
            return rect;
        }
    }
    CollidableObject.pivot = f.Matrix4x4.TRANSLATION(f.Vector3.ZERO());
    L11_SideScroller.CollidableObject = CollidableObject;
})(L11_SideScroller || (L11_SideScroller = {}));
//# sourceMappingURL=CollidableObject.js.map