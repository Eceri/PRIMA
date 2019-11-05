"use strict";
var L05_PongPaddle;
(function (L05_PongPaddle) {
    //constants
    const cameraDistance = 51;
    const paddleSpeed = 0.5;
    var f = FudgeCore;
    window.addEventListener("load", handleLoad);
    let viewport;
    let canvas;
    let paddleLeft;
    let paddleRight;
    let ball;
    let keysPressed = {};
    document.addEventListener("keydown", handleKeydown);
    document.addEventListener("keyup", handleKeyup);
    let ballSpeed = new f.Vector3(generateRandomNumber() / 2, generateRandomNumber() / 2, 0);
    //let ballSpeed: f.Vector3 = new f.Vector3(0, 0, 0)
    let pong = createPong();
    function createPong() {
        let pong = new f.Node("Pong");
        let mtrSolidWhite = new f.Material("SolidWhite", f.ShaderUniColor, new f.CoatColored(new f.Color(1, 1, 1, 1)));
        let meshQuad = new f.MeshQuad();
        //create game objects
        paddleLeft = createNode("paddleLeft", meshQuad, mtrSolidWhite, new f.Vector3(-23, 0, 0), new f.Vector3(1, 5, 0));
        ball = createNode("ball", meshQuad, mtrSolidWhite, new f.Vector3(0, 0, 0), new f.Vector3(1, 1, 0));
        paddleRight = createNode("paddleRight", meshQuad, mtrSolidWhite, new f.Vector3(23, 0, 0), new f.Vector3(1, 5, 0));
        pong.appendChild(paddleLeft);
        pong.appendChild(paddleRight);
        pong.appendChild(ball);
        //create walls
        let wallLeft = createNode("wallLeft", meshQuad, mtrSolidWhite, new f.Vector3(-26, 0, 0), new f.Vector3(1, 37, 0));
        let wallRight = createNode("wallRight", meshQuad, mtrSolidWhite, new f.Vector3(26, 0, 0), new f.Vector3(1, 37, 0));
        let wallTop = createNode("wallTop", meshQuad, mtrSolidWhite, new f.Vector3(0, 18, 0), new f.Vector3(53, 1, 0));
        let WallBottom = createNode("wallBottom", meshQuad, mtrSolidWhite, new f.Vector3(0, -18, 0), new f.Vector3(53, 1, 0));
        pong.appendChild(wallLeft);
        pong.appendChild(wallRight);
        pong.appendChild(wallTop);
        pong.appendChild(WallBottom);
        return pong;
    }
    //
    function createNode(_name, _mesh, _material, _translation, _scaling) {
        let node = new f.Node(_name);
        node.addComponent(new f.ComponentTransform());
        node.addComponent(new f.ComponentMaterial(_material));
        node.addComponent(new f.ComponentMesh(_mesh));
        node.cmpTransform.local.translate(_translation);
        node.cmpTransform.local.scale(_scaling);
        return node;
    }
    function handleLoad(_event) {
        f.RenderManager.initialize();
        canvas = document.querySelector("canvas");
        let cmpCamera = new f.ComponentCamera();
        cmpCamera.pivot.translateZ(cameraDistance);
        viewport = new f.Viewport();
        viewport.initialize("Viewport", pong, cmpCamera, canvas);
        f.Debug.log(viewport);
        viewport.draw();
        f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        f.Loop.start();
    }
    function update(_event) {
        //move paddles if key is pressed 
        if (keysPressed[f.KEYBOARD_CODE.ARROW_UP])
            paddleRight.cmpTransform.local.translateY(paddleSpeed);
        if (keysPressed[f.KEYBOARD_CODE.ARROW_DOWN])
            paddleRight.cmpTransform.local.translateY(-paddleSpeed);
        if (keysPressed[f.KEYBOARD_CODE.W])
            paddleLeft.cmpTransform.local.translateY(paddleSpeed);
        if (keysPressed[f.KEYBOARD_CODE.S])
            paddleLeft.cmpTransform.local.translateY(-paddleSpeed);
        //check for collision and process hit
        for (let node of pong.getChildren()) {
            if (node.name == "ball")
                continue;
            if (detectHit(ball, node))
                processHit(node);
        }
        ball.cmpTransform.local.translate(ballSpeed);
        f.RenderManager.update();
        viewport.draw();
    }
    function handleKeydown(_event) { keysPressed[_event.code] = true; }
    function handleKeyup(_event) { keysPressed[_event.code] = false; }
    //Geschwindigkeits-Vektor
    function generateRandomNumber() {
        return Math.random() * 2 - 1;
    }
    function detectHit(_object, _rect) {
        let objectTranslation = _object.cmpTransform.local.translation;
        let rectX = _rect.cmpTransform.local.translation.x;
        let rectY = _rect.cmpTransform.local.translation.y;
        let xDistance = _rect.cmpTransform.local.scaling.x / 2;
        let yDistance = _rect.cmpTransform.local.scaling.y / 2;
        let topLeftCorner = new f.Vector3(rectX - xDistance, rectY + yDistance, 0);
        let bottomRightCorner = new f.Vector3(rectX + xDistance, rectY - yDistance, 0);
        return objectTranslation.x > topLeftCorner.x &&
            objectTranslation.y < topLeftCorner.y &&
            objectTranslation.x < bottomRightCorner.x &&
            objectTranslation.y > bottomRightCorner.y;
    }
    function processHit(_node) {
        switch (_node.name) {
            case "wallTop":
            case "wallBottom":
                ballSpeed.y *= -1;
                break;
            case "paddleRight":
            case "paddleLeft":
            case "wallRight":
            case "wallLeft":
                ballSpeed.x *= -1;
                break;
            default:
                console.log("Unidentified object hit.");
                break;
        }
    }
})(L05_PongPaddle || (L05_PongPaddle = {}));
//# sourceMappingURL=Main.js.map