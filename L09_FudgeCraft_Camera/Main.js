"use strict";
var L09_FudgeCraft_Camera;
(function (L09_FudgeCraft_Camera) {
    L09_FudgeCraft_Camera.ƒ = FudgeCore;
    L09_FudgeCraft_Camera.game = new L09_FudgeCraft_Camera.ƒ.Node("FudgeCraft");
    L09_FudgeCraft_Camera.grid = new L09_FudgeCraft_Camera.Grid();
    let control = new L09_FudgeCraft_Camera.Control();
    let viewport;
    const cameraControl = new L09_FudgeCraft_Camera.CameraControl();
    window.addEventListener("load", hndLoad);
    L09_FudgeCraft_Camera.ƒ.RenderManager.initialize(true);
    function hndLoad(_event) {
        const canvas = document.querySelector("canvas");
        canvas.addEventListener("click", canvas.requestPointerLock);
        L09_FudgeCraft_Camera.ƒ.Debug.log("Canvas", canvas);
        let cmpLight = new L09_FudgeCraft_Camera.ƒ.ComponentLight(new L09_FudgeCraft_Camera.ƒ.LightDirectional(L09_FudgeCraft_Camera.ƒ.Color.WHITE));
        cmpLight.pivot.lookAt(new L09_FudgeCraft_Camera.ƒ.Vector3(0.5, 1, 0.8));
        L09_FudgeCraft_Camera.game.addComponent(cmpLight);
        let cmpLightAmbient = new L09_FudgeCraft_Camera.ƒ.ComponentLight(new L09_FudgeCraft_Camera.ƒ.LightAmbient(L09_FudgeCraft_Camera.ƒ.Color.DARK_GREY));
        L09_FudgeCraft_Camera.game.addComponent(cmpLightAmbient);
        viewport = new L09_FudgeCraft_Camera.ƒ.Viewport();
        viewport.initialize("Viewport", L09_FudgeCraft_Camera.game, cameraControl.cmpCamera, canvas);
        L09_FudgeCraft_Camera.ƒ.Debug.log("Viewport", viewport);
        viewport.draw();
        startRandomFragment();
        L09_FudgeCraft_Camera.game.appendChild(control);
        L09_FudgeCraft_Camera.game.appendChild(cameraControl);
        viewport.draw();
        L09_FudgeCraft_Camera.ƒ.Debug.log("Game", L09_FudgeCraft_Camera.game);
        window.addEventListener("keydown", hndKeyDown);
        window.addEventListener("wheel", hndWheelEvent);
        window.addEventListener("mousemove", hndMouseMovement);
        //test();
    }
    function hndMouseMovement(_event) {
        cameraControl.rotateX(_event.movementY);
        cameraControl.rotateY(_event.movementX);
        viewport.draw();
    }
    function hndWheelEvent(_event) {
        cameraControl.translate(_event.deltaY);
        viewport.draw();
    }
    function hndKeyDown(_event) {
        if (_event.code == L09_FudgeCraft_Camera.ƒ.KEYBOARD_CODE.SPACE) {
            control.freeze();
            startRandomFragment();
            console.log("fragment moved!");
        }
        let transformation = L09_FudgeCraft_Camera.Control.transformations[_event.code];
        if (transformation)
            move(transformation);
        // ƒ.RenderManager.update();
        viewport.draw();
    }
    function move(_transformation) {
        let animationSteps = 10;
        let fullRotation = 90;
        let fullTranslation = 1;
        let move = {
            rotation: _transformation.rotation ? L09_FudgeCraft_Camera.ƒ.Vector3.SCALE(_transformation.rotation, fullRotation) : new L09_FudgeCraft_Camera.ƒ.Vector3(),
            translation: _transformation.translation ? L09_FudgeCraft_Camera.ƒ.Vector3.SCALE(_transformation.translation, fullTranslation) : new L09_FudgeCraft_Camera.ƒ.Vector3()
        };
        let timers = L09_FudgeCraft_Camera.ƒ.Time.game.getTimers();
        if (Object.keys(timers).length > 0)
            return;
        let collisions = control.checkCollisions(move);
        if (collisions.length > 0)
            return;
        move.translation.scale(1 / animationSteps);
        move.rotation.scale(1 / animationSteps);
        L09_FudgeCraft_Camera.ƒ.Time.game.setTimer(10, animationSteps, function () {
            control.move(move);
            // ƒ.RenderManager.update();
            viewport.draw();
        });
    }
    function startRandomFragment() {
        let fragment = L09_FudgeCraft_Camera.Fragment.getRandom();
        control.cmpTransform.local = L09_FudgeCraft_Camera.ƒ.Matrix4x4.IDENTITY;
        control.setFragment(fragment);
    }
    L09_FudgeCraft_Camera.startRandomFragment = startRandomFragment;
})(L09_FudgeCraft_Camera || (L09_FudgeCraft_Camera = {}));
//# sourceMappingURL=Main.js.map