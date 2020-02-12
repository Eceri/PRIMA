namespace L11_SideScroller {
  export import f = FudgeCore;

  window.addEventListener("load", handleLoad);
  let viewport: f.Viewport = new f.Viewport();
  const cameraDistance: number = 10;
  const maxPlayerSpeed: number = .15;
  let playerSpeed: number = 0;

  function handleLoad(_event: Event): void {
    const canvas: HTMLCanvasElement = document.querySelector("canvas");
    let camera: f.ComponentCamera = new f.ComponentCamera();
    camera.backgroundColor = f.Color.CSS("lightpink");
    camera.pivot.translateZ(cameraDistance);
    camera.pivot.lookAt(f.Vector3.ZERO());

    let renderContext2D: CanvasRenderingContext2D = canvas.getContext("2d");

    let playerSpritesheet: HTMLImageElement = document.querySelector("img");
    let playerTexture: f.TextureImage = new f.TextureImage();
    playerTexture.image = playerSpritesheet;
    let playerSprite: Sprite = new Sprite("player");
    playerSprite.generateByGrid(
      playerTexture,
      f.Rectangle.GET(2, 102, 68, 64),
      6,
      f.Vector2.ZERO(),
      64,
      f.ORIGIN2D.BOTTOMCENTER
    );

    let player: NodeSprite = new NodeSprite("player", playerSprite);
    player.setFrameDirection(1);
    player.addComponent(new f.ComponentTransform());
    player.addEventListener(
      "showNext",
      (event: Event) => { (<NodeSprite>event.currentTarget).showFrameNext();},
      true);
    let game: f.Node = new f.Node("Game");
    game.appendChild(player);

    // f.Debug.log(viewport);
    window.addEventListener("keydown", hndKeyDown)
    window.addEventListener("keyup", hndKeyUp)
    
    f.RenderManager.initialize(true, false);
    viewport.initialize("Viewport", game, camera, canvas);
    viewport.draw();
    
    f.Loop.addEventListener(f.EVENT.LOOP_FRAME, update);
    f.Loop.start(f.LOOP_MODE.TIME_GAME, 15, true);

    //gameloop
    function update(){
      game.broadcastEvent(new CustomEvent("showNext"));

      viewport.draw()
      
      renderContext2D.strokeRect(-1, -1, canvas.width / 2, canvas.height + 2);
      renderContext2D.strokeRect(-1, canvas.height / 2, canvas.width + 2, canvas.height);
    }

    //controls
    function hndKeyDown(_event: KeyboardEvent): void {
      switch(_event.code) {
        case f.KEYBOARD_CODE.ARROW_LEFT:
          if (playerSpeed < maxPlayerSpeed) playerSpeed += .05; //bad idea
          player.cmpTransform.local.translateX(-playerSpeed);
          console.log(playerSpeed)
          break;
        case f.KEYBOARD_CODE.ARROW_RIGHT:
          player.cmpTransform.local.translateX(.1)
          break;
        default:
          break;
      }
    }
    function hndKeyUp(_event: KeyboardEvent): void {
      switch(_event.code) {
        case f.KEYBOARD_CODE.ARROW_LEFT:
        case f.KEYBOARD_CODE.ARROW_RIGHT:
          playerSpeed = 0;
      }
    }
  }
}
