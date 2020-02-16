"use strict";
var L11_SideScroller;
(function (L11_SideScroller) {
    var f = FudgeCore;
    let viewport = new f.Viewport();
    const cameraDistance = 10;
    let player;
    let keysPressed = {};
    window.addEventListener("load", handleLoad);
    function handleLoad(_event) {
        //game
        const canvas = document.querySelector("canvas");
        let camera = new f.ComponentCamera();
        camera.backgroundColor = f.Color.CSS("lightpink");
        camera.pivot.translateZ(cameraDistance);
        camera.pivot.lookAt(f.Vector3.ZERO());
        let renderContext2D = canvas.getContext("2d");
        //player
        let playerSpritesheet = document.querySelector("img");
        let playerTexture = new f.TextureImage();
        playerTexture.image = playerSpritesheet;
        L11_SideScroller.Character.generateSprites(playerTexture);
        L11_SideScroller.Character.generateSprites(playerTexture);
        L11_SideScroller.level = createLevel();
        player = new L11_SideScroller.Character("Player");
        let game = new f.Node("Game");
        game.appendChild(L11_SideScroller.level);
        game.appendChild(player);
        // f.Debug.log(viewport);
        document.addEventListener("keydown", handleKeyboard);
        document.addEventListener("keyup", handleKeyboard);
        f.RenderManager.initialize(true, false);
        viewport.initialize("Viewport", game, camera, canvas);
        viewport.draw();
        f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        f.Loop.start(f.LOOP_MODE.TIME_GAME, 60);
        //camera update
        function update() {
            processInput();
            let cameraTranslation = camera.pivot.translation;
            let playerTranslation = player.mtxWorld.translation;
            camera.pivot.translateX(playerTranslation.x - cameraTranslation.x);
            camera.pivot.translateY(playerTranslation.y - cameraTranslation.y); //rethink
            viewport.draw();
            renderContext2D.strokeRect(-1, -1, canvas.width / 2, canvas.height + 2);
            renderContext2D.strokeRect(-1, canvas.height / 2, canvas.width + 2, canvas.height);
            let playerRect = player.getRectWorld();
            renderContext2D.strokeRect(canvas.width / 2 - (playerRect.width * 100) / 2, canvas.height / 2, playerRect.width * 111, playerRect.height * 111);
        }
        //controls
        function handleKeyboard(_event) {
            keysPressed[_event.code] = _event.type == "keydown";
        }
        function processInput() {
            if (player.lockedInAnimation)
                return;
            let action = L11_SideScroller.ACTION.IDLE;
            let direction;
            if (keysPressed[f.KEYBOARD_CODE.A]) {
                action = L11_SideScroller.ACTION.WALK;
                direction = L11_SideScroller.DIRECTION.LEFT;
            }
            else if (keysPressed[f.KEYBOARD_CODE.D]) {
                action = L11_SideScroller.ACTION.WALK;
                direction = L11_SideScroller.DIRECTION.RIGHT;
            }
            if (keysPressed[f.KEYBOARD_CODE.E]) {
                action = L11_SideScroller.ACTION.ATTACK;
            }
            player.act(action, direction);
            if (keysPressed[f.KEYBOARD_CODE.W] && player.grounded) {
                player.act(L11_SideScroller.ACTION.JUMP); //should be jump squat, nothing here yet.
            }
            if (keysPressed[f.KEYBOARD_CODE.Q])
                player.swapWeapon();
        }
    }
    function createLevel() {
        let level = new f.Node("Level");
        let floor = new L11_SideScroller.Floor();
        floor.cmpTransform.local.scaleY(1);
        level.appendChild(floor);
        floor = new L11_SideScroller.Floor();
        floor.cmpTransform.local.scaleY(1);
        floor.cmpTransform.local.scaleX(2);
        floor.cmpTransform.local.translateY(0.1);
        floor.cmpTransform.local.translateX(2);
        level.appendChild(floor);
        floor = new L11_SideScroller.Floor();
        floor.cmpTransform.local.scaleY(1);
        floor.cmpTransform.local.scaleX(1);
        floor.cmpTransform.local.translateY(2.5);
        level.appendChild(floor);
        floor = new L11_SideScroller.Floor();
        floor.cmpTransform.local.scaleY(1);
        floor.cmpTransform.local.scaleX(0.5);
        floor.cmpTransform.local.translateX(2);
        floor.cmpTransform.local.translateY(1);
        level.appendChild(floor);
        let movingFloor = new L11_SideScroller.MovingFloor(new f.Vector3(2, 1.5), 1, 0);
        movingFloor.cmpTransform.local.scaleY(0.2);
        movingFloor.cmpTransform.local.scaleX(2);
        level.appendChild(movingFloor);
        movingFloor = new L11_SideScroller.MovingFloor(new f.Vector3(-2, -1.5), 0, 1);
        movingFloor.cmpTransform.local.scaleY(0.2);
        movingFloor.cmpTransform.local.scaleX(2);
        level.appendChild(movingFloor);
        // movingFloor = new MovingFloor(new f.Vector3(0, 0), 0, 1);
        // movingFloor.cmpTransform.local.scaleY(.2);
        // movingFloor.cmpTransform.local.scaleX(2);
        // level.appendChild(movingFloor);
        return level;
    }
})(L11_SideScroller || (L11_SideScroller = {}));
//# sourceMappingURL=Main.js.map