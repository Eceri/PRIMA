"use strict";
var L11_SideScroller;
(function (L11_SideScroller) {
    L11_SideScroller.f = FudgeCore;
    let viewport = new L11_SideScroller.f.Viewport();
    const cameraDistance = 10;
    let player;
    let keysPressed = {};
    window.addEventListener("load", handleLoad);
    function handleLoad(_event) {
        //game
        const canvas = document.querySelector("canvas");
        let camera = new L11_SideScroller.f.ComponentCamera();
        camera.backgroundColor = L11_SideScroller.f.Color.CSS("lightpink");
        camera.pivot.translateZ(cameraDistance);
        camera.pivot.lookAt(L11_SideScroller.f.Vector3.ZERO());
        let renderContext2D = canvas.getContext("2d");
        //player
        let playerSpritesheet = document.querySelector("img");
        let playerTexture = new L11_SideScroller.f.TextureImage();
        playerTexture.image = playerSpritesheet;
        L11_SideScroller.Character.generateSprites(playerTexture);
        L11_SideScroller.Character.generateSprites(playerTexture);
        L11_SideScroller.level = createLevel();
        player = new L11_SideScroller.Character("Player");
        let game = new L11_SideScroller.f.Node("Game");
        game.appendChild(L11_SideScroller.level);
        game.appendChild(player);
        // f.Debug.log(viewport);
        document.addEventListener("keydown", handleKeyboard);
        document.addEventListener("keyup", handleKeyboard);
        L11_SideScroller.f.RenderManager.initialize(true, false);
        viewport.initialize("Viewport", game, camera, canvas);
        viewport.draw();
        L11_SideScroller.f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        L11_SideScroller.f.Loop.start(L11_SideScroller.f.LOOP_MODE.TIME_GAME, 30);
        //gameloop
        function update() {
            processInput();
            camera.pivot.translateX(player.mtxWorld.translation.x - camera.pivot.translation.x); // rethink, missing y movements
            viewport.draw();
            renderContext2D.strokeRect(-1, -1, canvas.width / 2, canvas.height + 2);
            renderContext2D.strokeRect(-1, canvas.height / 2, canvas.width + 2, canvas.height);
        }
        //controls
        function handleKeyboard(_event) {
            keysPressed[_event.code] = _event.type == "keydown";
        }
        function processInput() {
            let action = L11_SideScroller.ACTION.IDLE;
            let direction;
            if (keysPressed[L11_SideScroller.f.KEYBOARD_CODE.A]) {
                action = L11_SideScroller.ACTION.WALK;
                direction = L11_SideScroller.DIRECTION.LEFT;
            }
            else if (keysPressed[L11_SideScroller.f.KEYBOARD_CODE.D]) {
                action = L11_SideScroller.ACTION.WALK;
                direction = L11_SideScroller.DIRECTION.RIGHT;
            }
            if (keysPressed[L11_SideScroller.f.KEYBOARD_CODE.W] && player.speed.y == 0) {
                player.act(L11_SideScroller.ACTION.LAUNCH); //should be jump squat
            }
            player.act(action, direction);
        }
    }
    function createLevel() {
        let level = new L11_SideScroller.f.Node("Level");
        let floor = new L11_SideScroller.Floor();
        floor.cmpTransform.local.scaleY(0.2);
        level.appendChild(floor);
        floor = new L11_SideScroller.Floor();
        floor.cmpTransform.local.scaleY(0.2);
        floor.cmpTransform.local.scaleX(2);
        floor.cmpTransform.local.translateY(0.1);
        floor.cmpTransform.local.translateX(1.5);
        level.appendChild(floor);
        floor = new L11_SideScroller.Floor();
        floor.cmpTransform.local.scaleY(1.5);
        floor.cmpTransform.local.translateY(2);
        floor.cmpTransform.local.translateX(1.5);
        level.appendChild(floor);
        return level;
    }
})(L11_SideScroller || (L11_SideScroller = {}));
//# sourceMappingURL=Main.js.map