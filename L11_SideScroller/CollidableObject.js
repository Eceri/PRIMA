"use strict";
var L11_SideScroller;
(function (L11_SideScroller) {
    class CollidableObject extends L11_SideScroller.f.Node {
        constructor(_name) {
            super(_name);
        }
        getRectWorld() {
            let rect = L11_SideScroller.f.Rectangle.GET(0, 0, 100, 100, L11_SideScroller.f.ORIGIN2D.BOTTOMCENTER);
            let topleft = new L11_SideScroller.f.Vector3(-0.5, 0.5, 0);
            let bottomright = new L11_SideScroller.f.Vector3(0.5, -0.5, 0);
            let mtxResult = this.mtxWorld;
            topleft.transform(mtxResult, true);
            bottomright.transform(mtxResult, true);
            let size = new L11_SideScroller.f.Vector2(bottomright.x - topleft.x, bottomright.y - topleft.y);
            rect.position = topleft.toVector2();
            rect.size = size;
            return rect;
        }
    }
    CollidableObject.pivot = L11_SideScroller.f.Matrix4x4.TRANSLATION(L11_SideScroller.f.Vector3.ZERO());
    L11_SideScroller.CollidableObject = CollidableObject;
})(L11_SideScroller || (L11_SideScroller = {}));
//# sourceMappingURL=CollidableObject.js.map