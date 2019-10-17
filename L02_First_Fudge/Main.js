"use strict";
var L02_First_Fudge;
(function (L02_First_Fudge) {
    var f = FudgeCore;
    window.addEventListener("load", handleLoad);
    function handleLoad(_event) {
        const canvas = document.querySelector("canvas");
        f.RenderManager.initialize();
        console.log(canvas);
        let player1 = new f.Node("Rectangle1");
        let player2 = new f.Node("Rectangle2");
        let ball = new f.Node("Ball");
        let mtrSolidWhite = new f.Material("SolidWhite", f.ShaderUniColor, new f.CoatColored(new f.Color(1, 1, 1, 1)));
        let mtrMaterial = new f.ComponentMaterial(mtrSolidWhite);
        let mtrMaterial2 = new f.ComponentMaterial(mtrSolidWhite);
        let mtrMaterialBall = new f.ComponentMaterial(mtrSolidWhite);
        player1.addComponent(mtrMaterial);
        player2.addComponent(mtrMaterial2);
        ball.addComponent(mtrMaterialBall);
        let zPos = 5;
        let cmpCamera = new f.ComponentCamera();
        cmpCamera.pivot.translateZ(zPos);
        let mesh = new f.MeshQuad();
        let meshBall = new f.MeshQuad();
        let player1CmpMesh = new f.ComponentMesh(mesh);
        let player2CmpMesh = new f.ComponentMesh(mesh);
        let cmpMeshBall = new f.ComponentMesh(meshBall);
        player1.addComponent(player1CmpMesh);
        player2.addComponent(player2CmpMesh);
        ball.addComponent(cmpMeshBall);
        let topNode = new f.Node("top");
        topNode.appendChild(player1);
        topNode.appendChild(player2);
        topNode.appendChild(ball);
        player1CmpMesh.pivot.translateX(-2);
        player2CmpMesh.pivot.translateX(2);
        L02_First_Fudge.viewport = new f.Viewport();
        L02_First_Fudge.viewport.initialize("Viewport", topNode, cmpCamera, canvas);
        f.Debug.log(L02_First_Fudge.viewport);
        L02_First_Fudge.viewport.draw();
    }
})(L02_First_Fudge || (L02_First_Fudge = {}));
//# sourceMappingURL=Main.js.map