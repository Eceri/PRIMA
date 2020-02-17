namespace L11_SideScroller {
  import f = FudgeCore;

  interface KeyPressed {
    [code: string]: boolean;
  }

  export let level: f.Node;

  let viewport: f.Viewport = new f.Viewport();
  const cameraDistance: number = 10;

  let player: Character;
  let keysPressed: KeyPressed = {};
  let lastFrameTime = 0,
    animationTime = 0.2;


  let readJson: [];
  function init(_event: Event): void {
    fetch("./Levels.json")
      .then(response => response.json())
      .then(json => {
        console.log("json responded: " + json);
        readJson = json;
      })
      .then(() => handleLoad(_event))
      .catch(error => console.log(error));
  }

  // export let game: f.Node = new f.Node("Game");
  window.addEventListener("load", init);

  function handleLoad(_event: Event): void {
    console.log("initlialising game")

    Level.levelsJSON = readJson;
    //game
    const canvas: HTMLCanvasElement = document.querySelector("canvas");
    let camera: f.ComponentCamera = new f.ComponentCamera();
    camera.backgroundColor = f.Color.CSS("lightpink");
    camera.pivot.translateZ(cameraDistance);
    camera.pivot.lookAt(f.Vector3.ZERO());
    let renderContext2D: CanvasRenderingContext2D = canvas.getContext("2d");

    //images
    let images: HTMLImageElement[] = [];
    for (let element of document.querySelectorAll("img")) {
      images.push(<HTMLImageElement>element);
    }
    //player
    let playerSpritesheet: HTMLImageElement = images.find(
      image => image.id == "player"
    );
    let playerTexture: f.TextureImage = new f.TextureImage();
    playerTexture.image = playerSpritesheet;
    Character.generateSprites(playerTexture);

    level = new Level(1);

    player = new Character("Player");
    let game: f.Node = new f.Node("Game");
    game.appendChild(level);
    game.appendChild(player);

    //background
    let backgroundImageElements: HTMLImageElement[] = images.filter(
      element => element.className == "background"
    );

    backgroundImageElements.map(element => console.log(element.id));

    let background: Background = new Background(
      "Background",
      backgroundImageElements
    );

    level.appendChild(background);

    //add listeners and start game
    document.addEventListener("keydown", handleKeyboard);
    document.addEventListener("keyup", handleKeyboard);


    //Buttons for Menus
    let menu: HTMLHtmlElement = <HTMLHtmlElement>document.getElementById("menu")
    let continueBtn = document.getElementById("continueBtn")
    let muteBtn = document.getElementById("muteBtn");
    let startBtn = document.getElementById("startBtn");
    
    muteBtn.addEventListener("click", muteMusic);
    startBtn.addEventListener("click", startGame)
    continueBtn.addEventListener("click", continueGame)

    f.RenderManager.initialize(false, false);
    viewport.initialize("Viewport", game, camera, canvas);
    viewport.draw();

    let currentTimeScale: number = 0;

    f.Time.game.setScale(currentTimeScale);
    f.Loop.addEventListener(f.EVENT.LOOP_FRAME, update);
    f.Loop.start(f.LOOP_MODE.TIME_GAME, 60);

    viewport.showSceneGraph();

    function pauseGame() {
      currentTimeScale = 0;
      f.Time.game.setScale(currentTimeScale);
      menu.style.zIndex = "1";
    }

    function continueGame() {
      currentTimeScale = 1;
      f.Time.game.setScale(currentTimeScale);
      menu.style.zIndex = "-1";
    }

    function startGame() {
      currentTimeScale = 1;
      f.Time.game.setScale(currentTimeScale);;
      startBtn.style.zIndex = "-5";
      document.getElementById("startScreen").style.display = "none";
      let audio: HTMLAudioElement = document.querySelector("audio");
      audio.loop = true;
      audio.play();
    }

    function muteMusic() {
      let audio: HTMLAudioElement = document.querySelector("audio");
      if (audio. muted){
        audio.muted = false;
        audio.innerHTML  = "Mute";
      } else {
        audio.muted = true;
        audio.innerHTML  = "Unmute";
      }
    }

    //camera update
    function update() {
      processInput();

      let timeFrame: number = f.Loop.timeFrameGame / 1000; // in seconds
      //simple limit to animation, so the game can run at higher frame rates, while animation are slower.
      lastFrameTime += timeFrame;
      while (lastFrameTime > animationTime) {
        game.broadcastEvent(new CustomEvent("showNext"));
        lastFrameTime -= animationTime;
      }

      let playerRect: f.Rectangle = player.getRectWorld();
      renderContext2D.strokeRect(
        canvas.width / 2 - (playerRect.width * 100) / 2,
        canvas.height / 2,
        playerRect.width * 111,
        playerRect.height * 111
      );

      let cameraTranslation: f.Vector3 = camera.pivot.translation;
      let playerTranslation: f.Vector3 = player.mtxWorld.translation;
      camera.pivot.translateX(playerTranslation.x - cameraTranslation.x);
      camera.pivot.translateY(playerTranslation.y - cameraTranslation.y);
      viewport.draw();
    }

    //controls
    function handleKeyboard(_event: KeyboardEvent): void {
      keysPressed[_event.code] = _event.type == "keydown";

      if(keysPressed[f.KEYBOARD_CODE.ESC]) {
        console.log("ecp TimeScale: " + currentTimeScale)
        if(currentTimeScale == 1) {
          pauseGame()
        }else {
          continueGame();
        }
      }
    }

    function processInput(): void {
      if (player.lockedInAnimation) return;

      let action: ACTION = ACTION.IDLE;
      let direction: DIRECTION;

      if (keysPressed[f.KEYBOARD_CODE.A]) {
        action = ACTION.WALK;
        direction = DIRECTION.LEFT;
      } else if (keysPressed[f.KEYBOARD_CODE.D]) {
        action = ACTION.WALK;
        direction = DIRECTION.RIGHT;
      }
      if (keysPressed[f.KEYBOARD_CODE.E]) {
        action = ACTION.ATTACK;
      }
      player.act(action, direction);
      if (keysPressed[f.KEYBOARD_CODE.W] && player.grounded) {
        player.act(ACTION.JUMP); //should be jump squat, nothing here yet.
      }
      if (keysPressed[f.KEYBOARD_CODE.Q]) player.swapWeapon();
      
    }
  }
}
