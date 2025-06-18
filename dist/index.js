var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Application, Assets, Container, Sprite, Graphics, SCALE_MODES } from 'pixi.js';
import { sound } from '@pixi/sound';
import { IMAGES } from './assets';
import '../public/style.css';
(() => __awaiter(void 0, void 0, void 0, function* () {
    // Create a new application
    const app = new Application();
    // Initialize the application
    yield app.init({ background: '#1099bb', resizeTo: window });
    // Append the application canvas to the document body
    document.body.appendChild(app.canvas);
    const balls = [];
    const radius = 30;
    const scale = 60 / 32;
    const ballTextures = [
        yield Assets.load(IMAGES.rinrin),
        yield Assets.load(IMAGES.Recycle),
        yield Assets.load(IMAGES.mgsn)
    ];
    sound.add('col01', 'sounds/cursor-move.mp3');
    // 初期配置座標
    const positions = [
        { x: app.screen.width / 2, y: app.screen.height * 2 / 3 },
        { x: app.screen.width / 3, y: app.screen.height / 3 },
        { x: app.screen.width * 2 / 3, y: app.screen.height / 3 },
    ];
    //ボール生成
    for (let i = 0; i < 3; i++) {
        const ballContainer = new Container();
        ballContainer.x = positions[i].x;
        ballContainer.y = positions[i].y;
        app.stage.addChild(ballContainer);
        const circle = new Graphics();
        circle.beginFill(0x00f0f0, 1); // 白い円
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
    // ドラッグパスのグラフィックスを作成
    const dragPath = new Graphics();
    app.stage.addChild(dragPath);
    // ドラッグ状態管理
    let dragging = false;
    let dragTarget = null;
    let startX = 0;
    let startY = 0;
    // ドラッグ開始
    for (const ball of balls) {
        ball.container.eventMode = 'static';
        ball.container.cursor = 'pointer';
        ball.container.on('pointerdown', (event) => {
            dragging = true;
            dragTarget = ball;
            ball.vx = 0;
            ball.vy = 0;
            const pos = event.global;
            startX = pos.x;
            startY = pos.y;
            ball.container.x = pos.x;
            ball.container.y = pos.y;
        });
    }
    window.addEventListener('pointerup', (event) => {
        if (dragging && dragTarget) {
            dragging = false;
            dragPath.clear();
            const dx = dragTarget.container.x - startX;
            const dy = dragTarget.container.y - startY;
            dragTarget.vx = -dx * 0.2;
            dragTarget.vy = -dy * 0.2;
            dragTarget = null;
        }
    });
    // ドラッグ中：ボールをマウスに追従させる
    window.addEventListener('pointermove', (event) => {
        if (dragging && dragTarget) {
            const rect = app.canvas.getBoundingClientRect();
            const posX = event.clientX - rect.left;
            const posY = event.clientY - rect.top;
            dragTarget.container.x = posX;
            dragTarget.container.y = posY;
            dragPath.clear();
            const dx = posX - startX;
            const dy = posY - startY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const steps = Math.floor(dist / 10);
            for (let i = 1; i <= steps; i++) {
                const t = i / steps;
                const x = startX + dx * t;
                const y = startY + dy * t;
                dragPath.beginFill(0xffa500);
                dragPath.drawCircle(x, y, 2.5);
                dragPath.endFill();
            }
        }
    });
    // フレーム更新で移動処理
    app.ticker.add(() => {
        for (const ball of balls) {
            if (dragTarget === ball)
                continue;
            ball.container.x += ball.vx;
            ball.container.y += ball.vy;
            ball.vx *= 0.98;
            ball.vy *= 0.98;
            if (ball.container.x < radius) {
                ball.container.x = radius;
                ball.vx *= -1;
                sound.play('col01');
            }
            if (ball.container.x > app.screen.width - radius) {
                ball.container.x = app.screen.width - radius;
                ball.vx *= -1;
                sound.play('col01');
            }
            if (ball.container.y < radius) {
                ball.container.y = radius;
                ball.vy *= -1;
                sound.play('col01');
            }
            if (ball.container.y > app.screen.height - radius) {
                ball.container.y = app.screen.height - radius;
                ball.vy *= -1;
                sound.play('col01');
            }
        }
        // ボール同士の衝突判定と反射
        for (let i = 0; i < balls.length; i++) {
            for (let j = i + 1; j < balls.length; j++) {
                const a = balls[i];
                const b = balls[j];
                // 距離を計算
                const dx = a.container.x - b.container.x;
                const dy = a.container.y - b.container.y;
                const distSq = dx * dx + dy * dy;
                if (distSq < Math.pow((radius * 2), 2)) {
                    const dvx = a.vx - b.vx;
                    const dvy = a.vy - b.vy;
                    const dot = (dx * dvx + dy * dvy) / distSq;
                    // 相手に与える速度成分（法線方向のみ）
                    const impulseX = dx * dot;
                    const impulseY = dy * dot;
                    // 反映（速度を調整）
                    a.vx -= impulseX;
                    a.vy -= impulseY;
                    b.vx += impulseX;
                    b.vy += impulseY;
                    // 重なり解消（めり込み防止）
                    const dist = Math.sqrt(distSq);
                    const overlap = radius * 2 - dist;
                    const pushX = (dx / dist) * (overlap / 2);
                    const pushY = (dy / dist) * (overlap / 2);
                    a.container.x += pushX;
                    a.container.y += pushY;
                    b.container.x -= pushX;
                    b.container.y -= pushY;
                    // 音を鳴らす
                    sound.play('col01');
                }
            }
        }
    });
}))();
