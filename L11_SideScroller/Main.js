"use strict";
var L11_SideScroller;
(function (L11_SideScroller) {
    L11_SideScroller.f = FudgeCore;
    window.addEventListener("load", handleLoad);
    let viewport = new L11_SideScroller.f.Viewport();
    const cameraDistance = 10;
    function handleLoad(_event) {
        const canvas = document.querySelector("canvas");
        let camera = new L11_SideScroller.f.ComponentCamera();
        camera.backgroundColor = L11_SideScroller.f.Color.CSS("lightpink");
        camera.pivot.translateZ(cameraDistance);
        camera.pivot.lookAt(L11_SideScroller.f.Vector3.ZERO());
        let renderContext2D = canvas.getContext("2d");
        let playerSpritesheet = document.querySelector("img");
        let playerTexture = new L11_SideScroller.f.TextureImage();
        playerTexture.image = playerSpritesheet;
        let playerSprite = new L11_SideScroller.Sprite("player");
        playerSprite.generateByGrid(playerTexture, L11_SideScroller.f.Rectangle.GET(2, 102, 68, 64), 6, L11_SideScroller.f.Vector2.ZERO(), 64, L11_SideScroller.f.ORIGIN2D.BOTTOMCENTER);
        let player = new L11_SideScroller.NodeSprite("player", playerSprite);
        player.setFrameDirection(1);
        player.addComponent(new L11_SideScroller.f.ComponentTransform());
        player.addEventListener("showNext", (event) => { event.currentTarget.showFrameNext(); }, true);
        let game = new L11_SideScroller.f.Node("Game");
        game.appendChild(player);
        // f.Debug.log(viewport);
        L11_SideScroller.f.RenderManager.initialize(true, false);
        viewport.initialize("Viewport", game, camera, canvas);
        viewport.draw();
        L11_SideScroller.f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        L11_SideScroller.f.Loop.start(L11_SideScroller.f.LOOP_MODE.TIME_GAME, 10);
        function update() {
            game.broadcastEvent(new CustomEvent("showNext"));
            viewport.draw();
            renderContext2D.strokeRect(-1, -1, canvas.width / 2, canvas.height + 2);
            renderContext2D.strokeRect(-1, canvas.height / 2, canvas.width + 2, canvas.height);
        }
    }
})(L11_SideScroller || (L11_SideScroller = {}));
//# sourceMappingURL=Main.js.map