"use strict";
var L11_SideScroller;
(function (L11_SideScroller) {
    var f = FudgeCore;
    let viewport = new f.Viewport();
    const cameraDistance = 10;
    let player;
    let keysPressed = {};
    let lastFrameTime = 0, animationTime = 0.2;
    let readJson;
    function init(_event) {
        fetch("./Levels.json")
            .then(response => response.json())
            .then(json => {
            console.log("json responded: " + json);
            readJson = json;
        })
            .then(() => handleLoad(_event))
            .catch(error => console.log(error));
    }
    // export let game: f.Node = new f.Node("Game");
    window.addEventListener("load", init);
    function handleLoad(_event) {
        console.log("initlialising game");
        L11_SideScroller.Level.levelsJSON = readJson;
        //game
        const canvas = document.querySelector("canvas");
        let camera = new f.ComponentCamera();
        camera.backgroundColor = f.Color.CSS("lightpink");
        camera.pivot.translateZ(cameraDistance);
        camera.pivot.lookAt(f.Vector3.ZERO());
        let renderContext2D = canvas.getContext("2d");
        //images
        let images = [];
        for (let element of document.querySelectorAll("img")) {
            images.push(element);
        }
        //player
        let playerSpritesheet = images.find(image => image.id == "player");
        let playerTexture = new f.TextureImage();
        playerTexture.image = playerSpritesheet;
        L11_SideScroller.Character.generateSprites(playerTexture);
        L11_SideScroller.level = new L11_SideScroller.Level(1);
        player = new L11_SideScroller.Character("Player");
        let game = new f.Node("Game");
        game.appendChild(L11_SideScroller.level);
        game.appendChild(player);
        //background
        let backgroundImageElements = images.filter(element => element.className == "background");
        backgroundImageElements.map(element => console.log(element.id));
        let background = new L11_SideScroller.Background("Background", backgroundImageElements);
        L11_SideScroller.level.appendChild(background);
        //add listeners and start game
        document.addEventListener("keydown", handleKeyboard);
        document.addEventListener("keyup", handleKeyboard);
        //Buttons for Menus
        let menu = document.getElementById("menu");
        let continueBtn = document.getElementById("continueBtn");
        let muteBtn = document.getElementById("muteBtn");
        let startBtn = document.getElementById("startBtn");
        muteBtn.addEventListener("click", muteMusic);
        startBtn.addEventListener("click", startGame);
        continueBtn.addEventListener("click", continueGame);
        f.RenderManager.initialize(false, false);
        viewport.initialize("Viewport", game, camera, canvas);
        viewport.draw();
        let currentTimeScale = 0;
        f.Time.game.setScale(currentTimeScale);
        f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        f.Loop.start(f.LOOP_MODE.TIME_GAME, 60);
        viewport.showSceneGraph();
        function pauseGame() {
            currentTimeScale = 0;
            f.Time.game.setScale(currentTimeScale);
            menu.style.zIndex = "1";
        }
        function continueGame() {
            currentTimeScale = 1;
            f.Time.game.setScale(currentTimeScale);
            menu.style.zIndex = "-1";
        }
        function startGame() {
            currentTimeScale = 1;
            f.Time.game.setScale(currentTimeScale);
            ;
            startBtn.style.zIndex = "-5";
            document.getElementById("startScreen").style.display = "none";
            let audio = document.querySelector("audio");
            audio.loop = true;
            audio.play();
        }
        function muteMusic() {
            let audio = document.querySelector("audio");
            if (audio.muted) {
                audio.muted = false;
                audio.innerHTML = "Mute";
            }
            else {
                audio.muted = true;
                audio.innerHTML = "Unmute";
            }
        }
        //camera update
        function update() {
            processInput();
            let timeFrame = f.Loop.timeFrameGame / 1000; // in seconds
            //simple limit to animation, so the game can run at higher frame rates, while animation are slower.
            lastFrameTime += timeFrame;
            while (lastFrameTime > animationTime) {
                game.broadcastEvent(new CustomEvent("showNext"));
                lastFrameTime -= animationTime;
            }
            let playerRect = player.getRectWorld();
            renderContext2D.strokeRect(canvas.width / 2 - (playerRect.width * 100) / 2, canvas.height / 2, playerRect.width * 111, playerRect.height * 111);
            let cameraTranslation = camera.pivot.translation;
            let playerTranslation = player.mtxWorld.translation;
            camera.pivot.translateX(playerTranslation.x - cameraTranslation.x);
            camera.pivot.translateY(playerTranslation.y - cameraTranslation.y);
            viewport.draw();
        }
        //controls
        function handleKeyboard(_event) {
            keysPressed[_event.code] = _event.type == "keydown";
            if (keysPressed[f.KEYBOARD_CODE.ESC]) {
                console.log("ecp TimeScale: " + currentTimeScale);
                if (currentTimeScale == 1) {
                    pauseGame();
                }
                else {
                    continueGame();
                }
            }
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
})(L11_SideScroller || (L11_SideScroller = {}));
//# sourceMappingURL=Main.js.map