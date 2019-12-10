"use strict";
var L07_FudgeCraft_Fragments;
(function (L07_FudgeCraft_Fragments) {
    var f = FudgeCore;
    window.addEventListener("load", hndLoad);
    let viewport;
    let game;
    let rotate = f.Vector3.ZERO();
    function hndLoad(_event) {
        const canvas = document.querySelector("canvas");
        f.RenderManager.initialize(true);
        f.Debug.log("Canvas", canvas);
        let cmpCamera = new f.ComponentCamera();
        cmpCamera.pivot.translate(new f.Vector3(2, 3, 20));
        cmpCamera.pivot.lookAt(f.Vector3.ZERO());
        game = new f.Node("FudgeCraft");
        // let cube: Cube = new Cube(CUBE_TYPE.BLUE);
        let fragment = new L07_FudgeCraft_Fragments.Fragment(0);
        // ƒ.Debug.log("Fragment", fragment);
        fragment.addComponent(new f.ComponentTransform());
        game.appendChild(fragment);
        // fragment = new Fragment(1);
        // // ƒ.Debug.log("Fragment", fragment);
        // fragment.addComponent(
        //   new f.ComponentTransform(f.Matrix4x4.TRANSLATION(f.Vector3.X(3)))
        // );
        // game.appendChild(fragment);
        fragment = new L07_FudgeCraft_Fragments.Fragment(2);
        // ƒ.Debug.log("Fragment", fragment);
        fragment.addComponent(new f.ComponentTransform(f.Matrix4x4.TRANSLATION(f.Vector3.X(-2))));
        game.appendChild(fragment);
        let cmpLight = new f.ComponentLight(new f.LightDirectional(f.Color.WHITE));
        cmpLight.pivot.lookAt(new f.Vector3(0.5, 1, 0.8));
        game.addComponent(cmpLight);
        viewport = new f.Viewport();
        viewport.initialize("Viewport", game, cmpCamera, canvas);
        f.Debug.log("Viewport", viewport);
        viewport.draw();
        f.Debug.log("Game", game);
        window.addEventListener("keydown", hndKeyDown);
    }
    function hndKeyDown(_event) {
        switch (_event.code) {
            case f.KEYBOARD_CODE.ARROW_UP:
                rotate.add(f.Vector3.X(-90));
                break;
            case f.KEYBOARD_CODE.ARROW_DOWN:
                rotate.add(f.Vector3.X(90));
                break;
            case f.KEYBOARD_CODE.ARROW_LEFT:
                rotate.add(f.Vector3.Y(-90));
                break;
            case f.KEYBOARD_CODE.ARROW_RIGHT:
                rotate.add(f.Vector3.Y(90));
                break;
        }
        for (let fragment of game.getChildren()) {
            fragment.cmpTransform.local.rotation = rotate;
        }
        f.RenderManager.update();
        viewport.draw();
    }
    // function detectHit(_object: f.Node, _rect: f.Node): boolean {
    //   // let objectTranslation = _object.cmpTransform.local.translation
    //   // let rectX = _rect.cmpTransform.local.translation.x
    //   // let rectY = _rect.cmpTransform.local.translation.y
    //   // let xDistance: number = _rect.cmpTransform.local.scaling.x / 2
    //   // let yDistance: number = _rect.cmpTransform.local.scaling.y / 2
    //   // let topLeftCorner: f.Vector3 = new f.Vector3(rectX - xDistance, rectY + yDistance, 0)
    //   // let bottomRightCorner: f.Vector3 = new f.Vector3(rectX + xDistance, rectY - yDistance, 0)
    //   // return objectTranslation.x > topLeftCorner.x &&
    //   //     objectTranslation.y < topLeftCorner.y &&
    //   //     objectTranslation.x < bottomRightCorner.x &&
    //   //     objectTranslation.y > bottomRightCorner.y &&
    //   return false;
    // }
})(L07_FudgeCraft_Fragments || (L07_FudgeCraft_Fragments = {}));
//# sourceMappingURL=Main.js.map