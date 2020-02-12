namespace L11_SideScroller {
  export import f = FudgeCore;

  let viewport: f.Viewport = new f.Viewport();
  const cameraDistance: number = 10;

  let player: Character;
  export let level: f.Node;
  interface KeyPressed {
    [code: string]: boolean;
  }

  let keysPressed: KeyPressed = {};

  window.addEventListener("load", handleLoad);
  function handleLoad(_event: Event): void {
    //game
    const canvas: HTMLCanvasElement = document.querySelector("canvas");
    let camera: f.ComponentCamera = new f.ComponentCamera();
    camera.backgroundColor = f.Color.CSS("lightpink");
    camera.pivot.translateZ(cameraDistance);
    camera.pivot.lookAt(f.Vector3.ZERO());
    let renderContext2D: CanvasRenderingContext2D = canvas.getContext("2d");

    //player
    let playerSpritesheet: HTMLImageElement = document.querySelector("img");
    let playerTexture: f.TextureImage = new f.TextureImage();
    playerTexture.image = playerSpritesheet;
    Character.generateSprites(playerTexture);
    Character.generateSprites(playerTexture);

    level = createLevel();
    player = new Character("Player");
    let game: f.Node = new f.Node("Game");
    game.appendChild(level);
    game.appendChild(player);

    // f.Debug.log(viewport);
    document.addEventListener("keydown", handleKeyboard);
    document.addEventListener("keyup", handleKeyboard);

    f.RenderManager.initialize(true, false);
    viewport.initialize("Viewport", game, camera, canvas);
    viewport.draw();

    f.Loop.addEventListener(f.EVENT.LOOP_FRAME, update);
    f.Loop.start(f.LOOP_MODE.TIME_GAME, 30);

    //gameloop
    function update() {
      processInput();
      camera.pivot.translateX(
        player.mtxWorld.translation.x - camera.pivot.translation.x
      ); // rethink, missing y movements
      viewport.draw();
      renderContext2D.strokeRect(-1, -1, canvas.width / 2, canvas.height + 2);
      renderContext2D.strokeRect(
        -1,
        canvas.height / 2,
        canvas.width + 2,
        canvas.height
      );
    }

    //controls
    function handleKeyboard(_event: KeyboardEvent): void {
      keysPressed[_event.code] = _event.type == "keydown";
    }

    function processInput(): void {
      let action: ACTION = ACTION.IDLE;
      let direction: DIRECTION;
      if (keysPressed[f.KEYBOARD_CODE.A]) {
        action = ACTION.WALK
        direction = DIRECTION.LEFT
      }else if (keysPressed[f.KEYBOARD_CODE.D]) {
        action = ACTION.WALK
        direction = DIRECTION.RIGHT
      }
      player.act(action, direction);
      if (keysPressed[f.KEYBOARD_CODE.W] && player.speed.y == 0) {
        player.act(ACTION.LAUNCH) //should be jump squat
      } 
    }
  }

  function createLevel(): f.Node {
    let level: f.Node = new f.Node("Level");
    let floor: Floor = new Floor();
    floor.cmpTransform.local.scaleY(0.2);
    level.appendChild(floor);

    floor = new Floor();
    floor.cmpTransform.local.scaleY(0.2);
    floor.cmpTransform.local.scaleX(2);
    floor.cmpTransform.local.translateY(0.1);
    floor.cmpTransform.local.translateX(1.5);
    level.appendChild(floor);

    floor = new Floor();
    floor.cmpTransform.local.scaleY(1.5);
    floor.cmpTransform.local.translateY(2);
    floor.cmpTransform.local.translateX(1.5);
    level.appendChild(floor)
    return level;
  }
}
