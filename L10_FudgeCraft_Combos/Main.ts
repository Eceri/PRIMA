namespace L10_FudgeCraft_Combos {
  export import ƒ = FudgeCore;

  export let game: ƒ.Node = new ƒ.Node("FudgeCraft");
  export let grid: Grid = new Grid();
  let control: Control = new Control();
  let viewport: ƒ.Viewport;
  const cameraControl: CameraControl = new CameraControl();

  window.addEventListener("load", hndLoad);
  ƒ.RenderManager.initialize(true);

  function hndLoad(_event: Event): void {
    const canvas: HTMLCanvasElement = document.querySelector("canvas");
    canvas.addEventListener("click", canvas.requestPointerLock);
    ƒ.Debug.log("Canvas", canvas);

    let cmpLight: ƒ.ComponentLight = new ƒ.ComponentLight(
      new ƒ.LightDirectional(ƒ.Color.CSS("WHITE"))
    );
    cmpLight.pivot.lookAt(new ƒ.Vector3(0.5, 1, 0.8));
    game.addComponent(cmpLight);
    let cmpLightAmbient: ƒ.ComponentLight = new ƒ.ComponentLight(
      new ƒ.LightAmbient(ƒ.Color.CSS("DARK_GREY"))
    );
    game.addComponent(cmpLightAmbient);

    viewport = new ƒ.Viewport();
    viewport.initialize("Viewport", game, cameraControl.cmpCamera, canvas);

    ƒ.Debug.log("Viewport", viewport);
    viewport.draw();

    startRandomFragment();
    game.appendChild(control);
    game.appendChild(cameraControl);

    viewport.draw();
    ƒ.Debug.log("Game", game);

    window.addEventListener("keydown", hndKeyDown);
    window.addEventListener("wheel", hndWheelEvent);
    window.addEventListener("mousemove", hndMouseMovement);

    //test();
  }

  function hndMouseMovement(_event: MouseEvent) {
    cameraControl.rotateX(_event.movementY);
    cameraControl.rotateY(_event.movementX);
    viewport.draw();
  }

  function hndWheelEvent(_event: WheelEvent) {
    cameraControl.translate(_event.deltaY);
    viewport.draw();
  }

  function hndKeyDown(_event: KeyboardEvent): void {
    if (_event.code == ƒ.KEYBOARD_CODE.SPACE) {
      let frozen: GridElement[] = control.freeze();
      let combos: Combos = new Combos(frozen);
      handleCombos(combos);
      startRandomFragment();
      console.log("fragment moved!");
    }

    let transformation: Transformation = Control.transformations[_event.code];
    if (transformation) move(transformation);

    // ƒ.RenderManager.update();
    viewport.draw();
  }

  function move(_transformation: Transformation): void {
    let animationSteps: number = 10;
    let fullRotation: number = 90;
    let fullTranslation: number = 1;
    let move: Transformation = {
      rotation: _transformation.rotation
        ? ƒ.Vector3.SCALE(_transformation.rotation, fullRotation)
        : new ƒ.Vector3(),
      translation: _transformation.translation
        ? ƒ.Vector3.SCALE(_transformation.translation, fullTranslation)
        : new ƒ.Vector3()
    };

    let timers: ƒ.Timers = ƒ.Time.game.getTimers();
    if (Object.keys(timers).length > 0) return;

    let collisions: GridElement[] = control.checkCollisions(move);
    if (collisions.length > 0) return;

    move.translation.scale(1 / animationSteps);
    move.rotation.scale(1 / animationSteps);

    ƒ.Time.game.setTimer(10, animationSteps, function(): void {
      control.move(move);
      // ƒ.RenderManager.update();
      viewport.draw();
    });
  }

  function handleCombos(_combos: Combos): void {
    for (let combo of _combos.found)
      if (combo.length > 2)
        for (let element of combo) {
          let mtxLocal: ƒ.Matrix4x4 = element.cube.cmpTransform.local;
          console.log(element.cube.name, mtxLocal.translation.getMutator());
          // mtxLocal.rotateX(45);
          // mtxLocal.rotateY(45);
          // mtxLocal.rotateY(45, true);
          mtxLocal.scale(ƒ.Vector3.ONE(0.5));
        }
  }

  export function startRandomFragment(): void {
    let fragment: Fragment = Fragment.getRandom();
    control.cmpTransform.local = ƒ.Matrix4x4.IDENTITY;
    control.setFragment(fragment);
  }
}
