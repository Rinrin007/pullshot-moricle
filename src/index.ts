import { Application, Assets, Container, Sprite, Graphics, SCALE_MODES, Texture } from 'pixi.js';
import { IMAGES } from './assets';
import '../public/style.css';

(async () => {
  // Create a new application
  const app = new Application();

  // Initialize the application
  await app.init({ background: '#1099bb', resizeTo: window });

  // Append the application canvas to the document body
  document.body.appendChild(app.canvas);

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

  //ボール背景の円
  const circle = new Graphics();
  circle.beginFill(0xffffff, 1); // 白い円
  circle.drawCircle(0, 0, 50); // 半径60pxの円
  circle.endFill();
  circle.x = 0;
  circle.y = 0;
  ballcontainer01.addChild(circle);

  // Load the rinrin texture
  const texture = await Assets.load(IMAGES.rinrin);
  
  //ボールオブジェクトを定義
  const ball = new Sprite(texture);
  ball.texture.baseTexture.scaleMode = SCALE_MODES.NEAREST; // SCALE_MODES.NEAREST
  ball.anchor.set(0.5); 
  const scale = 100 / texture.width; // 幅100pxにスケール
  ball.scale.set(scale);
  ball.x = 0;
  ball.y = 5;
  ballcontainer01.addChild(ball);

  //イベント受付を有効に
  ballcontainer01.eventMode = 'static';
  ballcontainer01.cursor = 'pointer'; // カーソル変化（デバッグ用）

  // 状態管理
  let dragging = false;
  let startX = 0;
  let startY = 0;
  let vx = 0;
  let vy = 0;

  // ポインターダウン
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
