namespace L02_First_Fudge {
    import f = FudgeCore;
    window.addEventListener("load", handleLoad);
    export let viewport: f.Viewport;

    function handleLoad(_event: Event): void {
        const canvas: HTMLCanvasElement = document.querySelector("canvas");
        f.RenderManager.initialize();
        console.log(canvas);

        let player1: f.Node = new f.Node("Rectangle1");
        let player2: f.Node = new f.Node("Rectangle2");
        let ball: f.Node = new f.Node("Ball");

        let mtrSolidWhite: f.Material = new f.Material("SolidWhite", f.ShaderUniColor, new f.CoatColored(new f.Color(1, 1, 1, 1)));
        let mtrMaterial: f.ComponentMaterial = new f.ComponentMaterial(mtrSolidWhite);
        let mtrMaterial2: f.ComponentMaterial = new f.ComponentMaterial(mtrSolidWhite);
        let mtrMaterialBall: f.ComponentMaterial = new f.ComponentMaterial(mtrSolidWhite);

        player1.addComponent(mtrMaterial);
        player2.addComponent(mtrMaterial2);
        ball.addComponent(mtrMaterialBall);

        let zPos: number = 5;
        let cmpCamera: f.ComponentCamera = new f.ComponentCamera();
        cmpCamera.pivot.translateZ(zPos);

        let mesh: f.MeshQuad = new f.MeshQuad();
        let meshBall: f.MeshQuad = new f.MeshQuad();
        let player1CmpMesh: f.ComponentMesh = new f.ComponentMesh(mesh);
        let player2CmpMesh: f.ComponentMesh = new f.ComponentMesh(mesh);
        let cmpMeshBall: f.ComponentMesh = new f.ComponentMesh(meshBall);
        player1.addComponent(player1CmpMesh);
        player2.addComponent(player2CmpMesh);
        ball.addComponent(cmpMeshBall);

        let topNode: f.Node = new f.Node("top");

        topNode.appendChild(player1);
        topNode.appendChild(player2);
        topNode.appendChild(ball);

        player1CmpMesh.pivot.translateX(-2);
        player2CmpMesh.pivot.translateX(2);

        viewport = new f.Viewport();
        viewport.initialize("Viewport", topNode, cmpCamera, canvas);
        f.Debug.log(viewport);

        viewport.draw();

    }
}


