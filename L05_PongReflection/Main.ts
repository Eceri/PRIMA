namespace L05_PongPaddle {

    interface KeyPress{
        [code: string]: boolean;
    }

    //constants
    const cameraDistance: number = 51
    const paddleSpeed: number = 0.5

    import f = FudgeCore;
    window.addEventListener("load", handleLoad);
    let viewport: f.Viewport
    let canvas: HTMLCanvasElement
    let paddleLeft: f.Node
    let paddleRight: f.Node
    let ball: f.Node

    let keysPressed: KeyPress = {};
    document.addEventListener("keydown", handleKeydown);
    document.addEventListener("keyup", handleKeyup);

    let ballSpeed: f.Vector3 = new f.Vector3(generateRandomNumber() / 2, generateRandomNumber() / 2, 0)
    //let ballSpeed: f.Vector3 = new f.Vector3(0, 0, 0)
   

    let pong = createPong();
    function createPong(){
        let pong: f.Node = new f.Node("Pong");    

        let mtrSolidWhite: f.Material = new f.Material("SolidWhite", f.ShaderUniColor, new f.CoatColored(new f.Color(1, 1, 1, 1)));
        let meshQuad: f.MeshQuad = new f.MeshQuad();
        
        //create game objects
        paddleLeft = createNode("paddleLeft", meshQuad, mtrSolidWhite, new f.Vector3(-23,0,0), new f.Vector3(1,5,0))
        ball = createNode("ball", meshQuad, mtrSolidWhite, new f.Vector3(0,0,0), new f.Vector3(1,1,0))
        paddleRight = createNode("paddleRight", meshQuad, mtrSolidWhite, new f.Vector3(23,0,0), new f.Vector3(1,5,0))
        pong.appendChild(paddleLeft)
        pong.appendChild(paddleRight)
        pong.appendChild(ball)

        //create walls
        let wallLeft: f.Node = createNode("wallLeft", meshQuad, mtrSolidWhite, new f.Vector3(-26,0,0), new f.Vector3(1,37,0))
        let wallRight: f.Node = createNode("wallRight", meshQuad, mtrSolidWhite, new f.Vector3(26,0,0), new f.Vector3(1,37,0))
        let wallTop: f.Node = createNode("wallTop", meshQuad, mtrSolidWhite, new f.Vector3(0,18,0), new f.Vector3(53,1,0))
        let WallBottom: f.Node = createNode("wallBottom", meshQuad, mtrSolidWhite, new f.Vector3(0,-18,0), new f.Vector3(53,1,0))
        pong.appendChild(wallLeft)
        pong.appendChild(wallRight)
        pong.appendChild(wallTop)
        pong.appendChild(WallBottom)

        return pong
    }
    //
    function createNode(_name: string, _mesh: f.Mesh, _material: f.Material, _translation: f.Vector3, _scaling: f.Vector3): f.Node {
        let node: f.Node = new f.Node(_name)
        node.addComponent(new f.ComponentTransform())
        node.addComponent(new f.ComponentMaterial(_material))
        node.addComponent(new f.ComponentMesh(_mesh))
        node.cmpTransform.local.translate(_translation)
        node.cmpTransform.local.scale(_scaling)
        return node
    }   

    function handleLoad(_event: Event): void {
        f.RenderManager.initialize();
        canvas = document.querySelector("canvas");
        let cmpCamera: f.ComponentCamera = new f.ComponentCamera();
        cmpCamera.pivot.translateZ(cameraDistance);

        viewport = new f.Viewport();
        viewport.initialize("Viewport", pong, cmpCamera, canvas);
        f.Debug.log(viewport);

        viewport.draw();

        f.Loop.addEventListener(f.EVENT.LOOP_FRAME, update);
        f.Loop.start();   
    
    }
   
    function update(_event: Event): void {
        //move paddles if key is pressed 
        if(keysPressed[f.KEYBOARD_CODE.ARROW_UP])
            paddleRight.cmpTransform.local.translateY(paddleSpeed)
        if(keysPressed[f.KEYBOARD_CODE.ARROW_DOWN])
            paddleRight.cmpTransform.local.translateY(-paddleSpeed)
        if(keysPressed[f.KEYBOARD_CODE.W])
            paddleLeft.cmpTransform.local.translateY(paddleSpeed)
        if(keysPressed[f.KEYBOARD_CODE.S])
            paddleLeft.cmpTransform.local.translateY(-paddleSpeed)
        //check for collision and process hit
        for(let node of pong.getChildren()){
            if(node.name == "ball") continue
            if(detectHit(ball, node)) processHit(node)
        }
        ball.cmpTransform.local.translate(ballSpeed)

        f.RenderManager.update()
        viewport.draw()
    }

    function handleKeydown(_event: KeyboardEvent): void{keysPressed[_event.code] = true}
    function handleKeyup(_event: KeyboardEvent): void {keysPressed[_event.code] = false}
    
    //Geschwindigkeits-Vektor
    function generateRandomNumber(): number{
        return Math.random() * 2 -1
    }

    function detectHit(_object: f.Node, _rect: f.Node): boolean {
        let objectTranslation = _object.cmpTransform.local.translation

        let rectX = _rect.cmpTransform.local.translation.x
        let rectY = _rect.cmpTransform.local.translation.x
        let xDistance: number = _rect.cmpTransform.local.scaling.x / 2
        let yDistance: number = _rect.cmpTransform.local.scaling.x / 2
        let topLeftCorner: f.Vector3 = new f.Vector3(rectX - xDistance, rectY + yDistance, 0)
        let bottomRightCorner: f.Vector3 = new f.Vector3(rectX + xDistance, rectY - yDistance, 0)
        
        return objectTranslation.x > topLeftCorner.x &&
            objectTranslation.x < topLeftCorner.x &&
            objectTranslation.x < bottomRightCorner.x &&
            objectTranslation.x > bottomRightCorner.x
    }
    function processHit(_node: f.Node){
        switch(_node.name){
            case "wallTop":
            case "wallBottom":
                ballSpeed.x *= -1
                break
            case "paddleRight":
            case "paddleLeft":
            case "wallRight":
            case "wallLeft":
                ballSpeed.x *= -1
                break
            default:
                console.log("Unidentified object hit.")
                break
        }
    }
}