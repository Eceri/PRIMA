"use strict";
var L03_PongPaddle;
(function (L03_PongPaddle) {
    var f = FudgeCore;
    window.addEventListener("load", handleLoad);
    let viewport;
    let canvas;
    let paddleLeft = new f.Node("Rectangle1");
    let paddleRight = new f.Node("Rectangle2");
    let ball = new f.Node("Ball");
    let keysPressed = {};
    document.addEventListener("keydown", handleKeydown);
    document.addEventListener("keyup", handleKeyup);
    let ballSpeed = new f.Vector3(generateRandomNumber(), generateRandomNumber(), 0);
    function createPong() {
        let pong = new f.Node("Pong");
        let mtrSolidWhite = new f.Material("SolidWhite", f.ShaderUniColor, new f.CoatColored(new f.Color(1, 1, 1, 1)));
        let meshQuad = new f.MeshQuad();
        paddleLeft.addComponent(new f.ComponentMaterial(mtrSolidWhite));
        paddleRight.addComponent(new f.ComponentMaterial(mtrSolidWhite));
        ball.addComponent(new f.ComponentMaterial(mtrSolidWhite));
        let ballMesh = new f.MeshQuad();
        let paddleLeftCmpMesh = new f.ComponentMesh(meshQuad);
        let paddleRightCmpMesh = new f.ComponentMesh(meshQuad);
        let ballCmpMesh = new f.ComponentMesh(ballMesh);
        paddleLeft.addComponent(paddleLeftCmpMesh);
        paddleRight.addComponent(paddleRightCmpMesh);
        ball.addComponent(ballCmpMesh);
        paddleLeft.addComponent(new f.ComponentTransform());
        paddleRight.addComponent(new f.ComponentTransform());
        ball.addComponent(new f.ComponentTransform());
        pong.appendChild(paddleLeft);
        pong.appendChild(paddleRight);
        pong.appendChild(ball);
        return pong;
    }
    function handleLoad(_event) {
        f.RenderManager.initialize();
        canvas = document.querySelector("canvas");
        let cmpCamera = new f.ComponentCamera();
        cmpCamera.pivot.translateZ(50);
        let pong = createPong();
        paddleLeft.cmpTransform.local.translateX(-24);
        paddleRight.cmpTransform.local.translateX(24);
        paddleRight.getComponent(f.ComponentMesh).pivot.scaleY(5);
        paddleLeft.getComponent(f.ComponentMesh).pivot.scaleY(5);
        viewport = new f.Viewport();
        viewport.initialize("Viewport", pong, cmpCamera, canvas);
        f.Debug.log(viewport);
        viewport.draw();
        f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        f.Loop.start();
    }
    function update(_event) {
        //f.Debug.log("Update");
        moveBall();
        if (keysPressed[f.KEYBOARD_CODE.ARROW_UP])
            paddleRight.cmpTransform.local.translateY(0.5);
        if (keysPressed[f.KEYBOARD_CODE.ARROW_DOWN])
            paddleRight.cmpTransform.local.translateY(-0.5);
        if (keysPressed[f.KEYBOARD_CODE.W])
            paddleLeft.cmpTransform.local.translateY(0.5);
        if (keysPressed[f.KEYBOARD_CODE.S])
            paddleLeft.cmpTransform.local.translateY(-0.5);
        f.RenderManager.update();
        viewport.draw();
    }
    function handleKeydown(_event) {
        keysPressed[_event.code] = true;
    }
    function handleKeyup(_event) {
        keysPressed[_event.code] = false;
    }
    function moveBall() {
        let borderX = 25;
        let borderY = 17.5;
        if (borderX < ball.cmpTransform.local.translation.x || -borderX >= ball.cmpTransform.local.translation.x)
            ballSpeed.x = ballSpeed.x * -1;
        if (borderY <= ball.cmpTransform.local.translation.y || -borderY >= ball.cmpTransform.local.translation.y)
            ballSpeed.y = ballSpeed.y * -1;
        ball.cmpTransform.local.translate(ballSpeed);
    }
    //Geschwindigkeits-Vektor
    function generateRandomNumber() {
        return Math.random() * 2 - 1;
    }
})(L03_PongPaddle || (L03_PongPaddle = {}));
//# sourceMappingURL=Main.js.map