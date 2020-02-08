namespace L11_NEW {
  import f = FudgeCore;
  window.addEventListener("load", handleLoad);
  export let viewport: f.Viewport = new f.Viewport();
  const cameraDistance: number = 50;

  function handleLoad(_event: Event): void {
    const canvas: HTMLCanvasElement = document.querySelector("canvas");
    let camera:f.ComponentCamera = new f.ComponentCamera()
    camera.pivot.translateZ(cameraDistance)
    let playerNode: f.Node = new f.Node("player")

    
    let mesh: f.MeshQuad = new f.MeshQuad();
    let playerCmpMesh: f.ComponentMesh = new f.ComponentMesh(mesh);
    let mtrSolidWhite: f.Material = new f.Material("SolidWhite", f.ShaderUniColor, new f.CoatColored(new f.Color(1, 1, 1, 1)));
    let cmpMaterial: f.ComponentMaterial = new f.ComponentMaterial(mtrSolidWhite);
    playerNode.addComponent(playerCmpMesh)
    playerNode.addComponent(cmpMaterial)
    
    let levelNode: f.Node = new f.Node("level")
    levelNode.appendChild(playerNode);
    
    f.RenderManager.initialize();
    viewport.initialize("Viewport", playerNode, camera, canvas);
    f.Debug.log(viewport);
    viewport.draw();
  }
}
