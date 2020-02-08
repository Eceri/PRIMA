"use strict";
var L11_NEW;
(function (L11_NEW) {
    var f = FudgeCore;
    window.addEventListener("load", handleLoad);
    L11_NEW.viewport = new f.Viewport();
    const cameraDistance = 50;
    function handleLoad(_event) {
        const canvas = document.querySelector("canvas");
        let camera = new f.ComponentCamera();
        camera.pivot.translateZ(cameraDistance);
        let playerNode = new f.Node("player");
        let mesh = new f.MeshQuad();
        let playerCmpMesh = new f.ComponentMesh(mesh);
        let mtrSolidWhite = new f.Material("SolidWhite", f.ShaderUniColor, new f.CoatColored(new f.Color(1, 1, 1, 1)));
        let cmpMaterial = new f.ComponentMaterial(mtrSolidWhite);
        playerNode.addComponent(playerCmpMesh);
        playerNode.addComponent(cmpMaterial);
        let levelNode = new f.Node("level");
        levelNode.appendChild(playerNode);
        f.RenderManager.initialize();
        L11_NEW.viewport.initialize("Viewport", playerNode, camera, canvas);
        f.Debug.log(L11_NEW.viewport);
        L11_NEW.viewport.draw();
    }
})(L11_NEW || (L11_NEW = {}));
//# sourceMappingURL=Main.js.map