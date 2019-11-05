namespace L03_PongPaddle {

    interface KeyPress{
        [code: string]: boolean;
    }

    import f = FudgeCore;
    window.addEventListener("load", handleLoad);
    let viewport: f.Viewport;
    let canvas: HTMLCanvasElement;
    let paddleLeft: f.Node = new f.Node("Rectangle1");
    let paddleRight: f.Node = new f.Node("Rectangle2");
    let ball: f.Node = new f.Node("Ball");
    
    let keysPressed: KeyPress = {};
    document.addEventListener("keydown", handleKeydown);
    document.addEventListener("keyup", handleKeyup);

    let ballSpeed: f.Vector3 = new f.Vector3(generateRandomNumber(), generateRandomNumber(), 0);
    function createPong(){
        let pong: f.Node = new f.Node("Pong");    
    
        let mtrSolidWhite: f.Material = new f.Material("SolidWhite", f.ShaderUniColor, new f.CoatColored(new f.Color(1, 1, 1, 1)));
        let meshQuad: f.MeshQuad = new f.MeshQuad();
    
        paddleLeft.addComponent(new f.ComponentMaterial(mtrSolidWhite));
        paddleRight.addComponent(new f.ComponentMaterial(mtrSolidWhite));
        ball.addComponent(new f.ComponentMaterial(mtrSolidWhite));    
     
        let ballMesh: f.MeshQuad = new f.MeshQuad();

        let paddleLeftCmpMesh: f.ComponentMesh = new f.ComponentMesh(meshQuad);
        let paddleRightCmpMesh: f.ComponentMesh = new f.ComponentMesh(meshQuad);
        let ballCmpMesh: f.ComponentMesh = new f.ComponentMesh(ballMesh);
        
        paddleLeft.addComponent(paddleLeftCmpMesh);
        paddleRight.addComponent(paddleRightCmpMesh);
        ball.addComponent(ballCmpMesh);
        paddleLeft.addComponent(new f.ComponentTransform());
        paddleRight.addComponent(new f.ComponentTransform());
        ball.addComponent(new f.ComponentTransform());
    
        pong.appendChild(paddleLeft);
        pong.appendChild(paddleRight);
        pong.appendChild(ball);
        
        return pong
    }
    function handleLoad(_event: Event): void {
        f.RenderManager.initialize();
        canvas = document.querySelector("canvas");
        let cmpCamera: f.ComponentCamera = new f.ComponentCamera();
        cmpCamera.pivot.translateZ(50);

        let pong = createPong();

        paddleLeft.cmpTransform.local.translateX(-24);
        paddleRight.cmpTransform.local.translateX(24);

        (<f.ComponentMesh> paddleRight.getComponent(f.ComponentMesh)).pivot.scaleY(5);
        (<f.ComponentMesh> paddleLeft.getComponent(f.ComponentMesh)).pivot.scaleY(5);

        viewport = new f.Viewport();
        viewport.initialize("Viewport", pong, cmpCamera, canvas);
        f.Debug.log(viewport);

        viewport.draw();

        f.Loop.addEventListener(f.EVENT.LOOP_FRAME, update);
        f.Loop.start();   
    
    }
   
    function update(_event: Event): void {
        //f.Debug.log("Update");
        moveBall();
        if(keysPressed[f.KEYBOARD_CODE.ARROW_UP])
            paddleRight.cmpTransform.local.translateY(0.5)
        if(keysPressed[f.KEYBOARD_CODE.ARROW_DOWN])
            paddleRight.cmpTransform.local.translateY(-0.5)
        if(keysPressed[f.KEYBOARD_CODE.W])
            paddleLeft.cmpTransform.local.translateY(0.5)
        if(keysPressed[f.KEYBOARD_CODE.S])
            paddleLeft.cmpTransform.local.translateY(-0.5)
        f.RenderManager.update()
        viewport.draw()
    }

    function handleKeydown(_event: KeyboardEvent): void{
        keysPressed[_event.code] = true
    }
    function handleKeyup(_event: KeyboardEvent): void{
        keysPressed[_event.code] = false
    }

    function moveBall(){
        let borderX = 25
        let borderY = 17.5   
        if(borderX < ball.cmpTransform.local.translation.x || -borderX >= ball.cmpTransform.local.translation.x)
            ballSpeed.x = ballSpeed.x * -1
        if(borderY <= ball.cmpTransform.local.translation.y || -borderY >= ball.cmpTransform.local.translation.y)
            ballSpeed.y = ballSpeed.y * -1
        ball.cmpTransform.local.translate(ballSpeed)
    }
    //Geschwindigkeits-Vektor
    function generateRandomNumber(): number{
        return Math.random() * 2 -1
    }
}