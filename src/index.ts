import { Application, Assets, Container, Sprite, Graphics, SCALE_MODES } from 'pixi.js';
import { IMAGES } from './assets';
import '../public/style.css';

(async () => {
  // Create a new application
  const app = new Application();

  // Initialize the application
  await app.init({ background: '#1099bb', resizeTo: window });

  // Append the application canvas to the document body
  document.body.appendChild(app.canvas);

  // ボール情報を保持する構造体
  type Ball = {
    container: Container;
    sprite: Sprite;
    vx: number;
    vy: number;
  };

  const balls: Ball[] = [];
  const radius = 50;
  const scale = 100 / 32;
  const ballTextures = [
    await Assets.load(IMAGES.rinrin),
    await Assets.load(IMAGES.Recycle),
    await Assets.load(IMAGES.mgsn)
  ];

  //ボール生成
  for (let i = 0; i < 3; i++) {
    const ballContainer = new Container();
    ballContainer.x = app.screen.width / (i + 1);
    ballContainer.y = app.screen.height / 3;
    app.stage.addChild(ballContainer);

    const circle = new Graphics();
    circle.beginFill(0xffffff, 1); // 白い円
    circle.drawCircle(0, 0, radius); // 半径60pxの円
    circle.endFill();
    circle.x = 0;
    circle.y = 0;
    ballContainer.addChild(circle);

    const ballSprite = new Sprite(ballTextures[i]);
    ballSprite.texture.baseTexture.scaleMode = SCALE_MODES.NEAREST; // SCALE_MODES.NEAREST
    ballSprite.anchor.set(0.5);
    ballSprite.scale.set(scale);
    ballSprite.x = 0;
    ballSprite.y = radius * 0.1; // 少し上に配置
    ballContainer.addChild(ballSprite);

    balls.push({
      container: ballContainer,
      sprite: ballSprite,
      vx: 0,
      vy: 0
    });
  }

  // 一つ目のボールコンテナを作成
  const ballcontainer01 = new Container();
  ballcontainer01.x = app.screen.width / 2;
  ballcontainer01.y = app.screen.height * 2 / 3;
  app.stage.addChild(ballcontainer01);
  // 二つ目と三つ目のボールコンテナを作成
  const ballcontainer02 = new Container();
  ballcontainer02.x = app.screen.width / 3;
  ballcontainer02.y = app.screen.height / 3;
  app.stage.addChild(ballcontainer02);
  // 三つ目のボールコンテナを作成
  const ballcontainer03 = new Container();
  ballcontainer03.x = app.screen.width * 2 / 3;
  ballcontainer03.y = app.screen.height / 3;
  app.stage.addChild(ballcontainer03);
  // ドラッグパスのグラフィックスを作成
  const dragPath = new Graphics();
  app.stage.addChild(dragPath);

  //一つ目のボール背景の円
  const circle01 = new Graphics();
  circle01.beginFill(0xffffff, 1); // 白い円
  circle01.drawCircle(0, 0, 50); // 半径60pxの円
  circle01.endFill();
  circle01.x = 0;
  circle01.y = 0;
  ballcontainer01.addChild(circle01);

  //二つ目のボール背景の円
  const circle02 = new Graphics();
  circle02.beginFill(0xffffff, 1); // 白い円
  circle02.drawCircle(0, 0, 50); // 半径60pxの円
  circle02.endFill();
  circle02.x = 0;
  circle02.y = 0;
  ballcontainer02.addChild(circle02);

  //三つ目のボール背景の円
  const circle03 = new Graphics();
  circle03.beginFill(0xffffff, 1); // 白い円
  circle03.drawCircle(0, 0, 50); // 半径60pxの円
  circle03.endFill();
  circle03.x = 0;
  circle03.y = 0;
  ballcontainer03.addChild(circle03);
  
  //一つ目のボールオブジェクトを定義
  const ball01 = new Sprite(ballTextures[0]);
  ball01.texture.baseTexture.scaleMode = SCALE_MODES.NEAREST; // SCALE_MODES.NEAREST
  ball01.anchor.set(0.5); 
  //const scale01 = 100 / texture01.width; // 幅100pxにスケール
  ball01.scale.set(scale);
  ball01.x = 0;
  ball01.y = 5;
  ballcontainer01.addChild(ball01);

  //二つ目のボールオブジェクトを定義
  const ball02 = new Sprite(ballTextures[1]);
  ball02.texture.baseTexture.scaleMode = SCALE_MODES.NEAREST; // SCALE_MODES.NEAREST
  ball02.anchor.set(0.5); 
  //const scale02 = 100 / texture02.width; // 幅100pxにスケール
  ball02.scale.set(scale);
  ball02.x = 0;
  ball02.y = 5;
  ballcontainer02.addChild(ball02);

  //三つ目のボールオブジェクトを定義
  const ball03 = new Sprite(ballTextures[2]);
  ball03.texture.baseTexture.scaleMode = SCALE_MODES.NEAREST; // SCALE_MODES.NEAREST
  ball03.anchor.set(0.5); 
  //const scale03 = 100 / texture03.width; // 幅100pxにスケール
  ball03.scale.set(scale);
  ball03.x = 0;
  ball03.y = 5;
  ballcontainer03.addChild(ball03);

  //イベント受付を有効に
  ballcontainer01.eventMode = 'static';
  ballcontainer01.cursor = 'pointer'; // カーソル変化（デバッグ用）
  ballcontainer02.eventMode = 'static';
  ballcontainer02.cursor = 'pointer'; // カーソル変化（デバッグ用）
  ballcontainer03.eventMode = 'static';
  ballcontainer03.cursor = 'pointer'; // カーソル変化（デバッグ用）

  // 状態管理
  let dragging = false;
  let startX = 0;
  let startY = 0;
  let vx = 0;
  let vy = 0;

  // 一つ目ポインターダウン
  ballcontainer01.on('pointerdown', (event) => {
    dragging = true;
    vx = 0;
    vy = 0;
    const s_pos = event.global;
    startX = s_pos.x;
    startY = s_pos.y;
    ballcontainer01.x = s_pos.x;
    ballcontainer01.y = s_pos.y;
  });
  // 二つ目ポインターダウン
  ballcontainer02.on('pointerdown', (event) => {
    dragging = true;
    vx = 0;
    vy = 0;
    const s_pos = event.global;
    startX = s_pos.x;
    startY = s_pos.y;
    ballcontainer02.x = s_pos.x;
    ballcontainer02.y = s_pos.y;
  });
  // 三つ目ポインターダウン
  ballcontainer03.on('pointerdown', (event) => {
    dragging = true;
    vx = 0;
    vy = 0;
    const s_pos = event.global;
    startX = s_pos.x;
    startY = s_pos.y;
    ballcontainer03.x = s_pos.x;
    ballcontainer03.y = s_pos.y;
  });

  window.addEventListener('pointerup', (event) => {
    if (!dragging) return;
    dragging = false;

    dragPath.removeChildren(); // ← 点をすべて削除

    // pointerup時の座標を取得
    // Pixiのeventではないため clientX/Y を使う
    //const rect = app.canvas.getBoundingClientRect();
    const posX = ballcontainer01.x;//event.clientX - rect.left;
    const posY = ballcontainer01.y;//event.clientY - rect.top;

    const dx = posX - startX;
    const dy = posY - startY;

    vx = dx * -0.2;
    vy = dy * -0.2;
  });

  // ドラッグ中：ボールをマウスに追従させる
  window.addEventListener('pointermove', (event) => {
    if (dragging) {
      //const pos = event.global;
      const rect = app.canvas.getBoundingClientRect();
      const posX = event.clientX -rect.left; // Pixiのeventではないため clientX/Y を使う
      const posY = event.clientY - rect.top;
      const pos = { x: posX, y: posY };
      ballcontainer01.x = pos.x;
      ballcontainer01.y = pos.y;

      // 点を全削除してから再描画
      dragPath.removeChildren();

      const dx = pos.x - startX;
      const dy = pos.y - startY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      const steps = Math.floor(distance / 10);
      for (let i = 1; i <= steps; i++) {
        const t = i / steps;
        const x = startX + dx * t;
        const y = startY + dy * t;

        const dot = new Graphics();
        dot.beginFill(0xffa500); // オレンジ
        dot.drawCircle(0, 0, 2.5); // 半径2.5pxで直径5px
        dot.endFill();
        dot.x = x;
        dot.y = y;
        dragPath.addChild(dot);
      }
    }
  });

  // フレーム更新で移動処理
  app.ticker.add((time) => {
    if (!dragging) {
      ballcontainer01.x += vx;
      ballcontainer01.y += vy;

      // 簡易的な減速（摩擦）
      vx *= 0.98;
      vy *= 0.98;

      // 画面外に出ないように制御
      if (ballcontainer01.x < 50) {
        ballcontainer01.x = 50;
        vx *= -1; // 反発
      }
      if (ballcontainer01.x > app.screen.width - 50) {
        ballcontainer01.x = app.screen.width - 50;
        vx *= -1; // 反発
      }
      if (ballcontainer01.y < 50) {
        ballcontainer01.y = 50;
        vy *= -1; // 反発
      }
      if (ballcontainer01.y > app.screen.height - 50) {
        ballcontainer01.y = app.screen.height - 50;
        vy *= -1; // 反発
      }
    }
  });

})();
