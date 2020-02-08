"use strict";
var L10_FudgeCraft_Combos;
(function (L10_FudgeCraft_Combos) {
    L10_FudgeCraft_Combos.ƒ = FudgeCore;
    L10_FudgeCraft_Combos.game = new L10_FudgeCraft_Combos.ƒ.Node("FudgeCraft");
    L10_FudgeCraft_Combos.grid = new L10_FudgeCraft_Combos.Grid();
    let control = new L10_FudgeCraft_Combos.Control();
    let viewport;
    const cameraControl = new L10_FudgeCraft_Combos.CameraControl();
    window.addEventListener("load", hndLoad);
    L10_FudgeCraft_Combos.ƒ.RenderManager.initialize(true);
    function hndLoad(_event) {
        const canvas = document.querySelector("canvas");
        canvas.addEventListener("click", canvas.requestPointerLock);
        L10_FudgeCraft_Combos.ƒ.Debug.log("Canvas", canvas);
        let cmpLight = new L10_FudgeCraft_Combos.ƒ.ComponentLight(new L10_FudgeCraft_Combos.ƒ.LightDirectional(L10_FudgeCraft_Combos.ƒ.Color.CSS("WHITE")));
        cmpLight.pivot.lookAt(new L10_FudgeCraft_Combos.ƒ.Vector3(0.5, 1, 0.8));
        L10_FudgeCraft_Combos.game.addComponent(cmpLight);
        let cmpLightAmbient = new L10_FudgeCraft_Combos.ƒ.ComponentLight(new L10_FudgeCraft_Combos.ƒ.LightAmbient(L10_FudgeCraft_Combos.ƒ.Color.CSS("DARK_GREY")));
        L10_FudgeCraft_Combos.game.addComponent(cmpLightAmbient);
        viewport = new L10_FudgeCraft_Combos.ƒ.Viewport();
        viewport.initialize("Viewport", L10_FudgeCraft_Combos.game, cameraControl.cmpCamera, canvas);
        L10_FudgeCraft_Combos.ƒ.Debug.log("Viewport", viewport);
        viewport.draw();
        startRandomFragment();
        L10_FudgeCraft_Combos.game.appendChild(control);
        L10_FudgeCraft_Combos.game.appendChild(cameraControl);
        viewport.draw();
        L10_FudgeCraft_Combos.ƒ.Debug.log("Game", L10_FudgeCraft_Combos.game);
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
        if (_event.code == L10_FudgeCraft_Combos.ƒ.KEYBOARD_CODE.SPACE) {
            let frozen = control.freeze();
            let combos = new L10_FudgeCraft_Combos.Combos(frozen);
            handleCombos(combos);
            startRandomFragment();
            console.log("fragment moved!");
        }
        let transformation = L10_FudgeCraft_Combos.Control.transformations[_event.code];
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
            rotation: _transformation.rotation
                ? L10_FudgeCraft_Combos.ƒ.Vector3.SCALE(_transformation.rotation, fullRotation)
                : new L10_FudgeCraft_Combos.ƒ.Vector3(),
            translation: _transformation.translation
                ? L10_FudgeCraft_Combos.ƒ.Vector3.SCALE(_transformation.translation, fullTranslation)
                : new L10_FudgeCraft_Combos.ƒ.Vector3()
        };
        let timers = L10_FudgeCraft_Combos.ƒ.Time.game.getTimers();
        if (Object.keys(timers).length > 0)
            return;
        let collisions = control.checkCollisions(move);
        if (collisions.length > 0)
            return;
        move.translation.scale(1 / animationSteps);
        move.rotation.scale(1 / animationSteps);
        L10_FudgeCraft_Combos.ƒ.Time.game.setTimer(10, animationSteps, function () {
            control.move(move);
            // ƒ.RenderManager.update();
            viewport.draw();
        });
    }
    function handleCombos(_combos) {
        for (let combo of _combos.found)
            if (combo.length > 2)
                for (let element of combo) {
                    let mtxLocal = element.cube.cmpTransform.local;
                    console.log(element.cube.name, mtxLocal.translation.getMutator());
                    // mtxLocal.rotateX(45);
                    // mtxLocal.rotateY(45);
                    // mtxLocal.rotateY(45, true);
                    mtxLocal.scale(L10_FudgeCraft_Combos.ƒ.Vector3.ONE(0.5));
                }
    }
    function startRandomFragment() {
        let fragment = L10_FudgeCraft_Combos.Fragment.getRandom();
        control.cmpTransform.local = L10_FudgeCraft_Combos.ƒ.Matrix4x4.IDENTITY;
        control.setFragment(fragment);
    }
    L10_FudgeCraft_Combos.startRandomFragment = startRandomFragment;
})(L10_FudgeCraft_Combos || (L10_FudgeCraft_Combos = {}));
//# sourceMappingURL=Main.js.map