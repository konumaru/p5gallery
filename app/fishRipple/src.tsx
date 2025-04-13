'use client'

import p5 from 'p5';
import React, { useEffect, useRef } from 'react';
import { Fish } from './Fish';

const sketchState = {
  isDrawing: false
};

let fishes: Fish[] = [];
let tinyFishes: Fish[] = [];

class Ripple {
  x: number;
  y: number;
  dx: number;
  dy: number;
  radius: number;
  opacity: number;

  constructor(x: number, y: number, dx: number, dy: number) {
    this.x = x;
    this.y = y;
    this.dx = dx || 0;
    this.dy = dy || 0;
    this.radius = 0;
    this.opacity = 255;
  }

  update() {
    this.radius += 2;
    this.opacity -= 5;
    this.x += this.dx;
    this.y += this.dy;
  }

  display(p: p5) {
    p.fill(0, 120, 220, this.opacity);
    p.push();
    p.translate(this.x, this.y);

    const segments = 25;  // 波紋の分割数
    for (let i = 0; i < segments; i++) {
      const startAngle = (i / segments) * p.TWO_PI;
      const endAngle = ((i + 1) / segments) * p.TWO_PI;
      const midAngle = (startAngle + endAngle) / 2;

      const alpha = p.map(p.cos(midAngle - p.atan2(this.dy, this.dx)), -1, 1, 0, this.opacity);
      p.stroke(255, 255, 255, alpha);
      p.arc(0, 0, this.radius * 2, this.radius * 2, startAngle, endAngle);
    }

    p.pop();
  }

  isFinished() {
    return this.opacity <= 0;
  }
}

// 魚群を作成する関数
function createSchool(p: p5, count: number, size: number, schoolId: number) {
  const schoolFishes = [];
  // 初期位置を群れの中心点として設定
  const schoolCenterX = p.random(p.width);
  const schoolCenterY = p.random(p.height);

  for (let i = 0; i < count; i++) {
    // 群れの中心から少しランダムにずらした位置に作成
    const fish = new Fish(p, size + p.random(-size * 0.2, size * 0.2), schoolId);
    // 群れの初期位置を設定
    fish.position.set(
      schoolCenterX + p.random(-100, 100),
      schoolCenterY + p.random(-100, 100)
    );
    schoolFishes.push(fish);
  }
  return schoolFishes;
}

const setup = (p: p5) => {
  const width = p.min(p.windowWidth, 960);
  const height = p.min(p.windowHeight, 720);
  p.createCanvas(width, height);

  // 小さな魚の群れをいくつか作成
  // 黄色い魚群
  const yellowSchool = createSchool(p, 20, 25, 1);
  // 赤い魚群も残す
  const redSchool = createSchool(p, 14, 20, 2);
  // 緑の魚群
  const greenSchool = createSchool(p, 18, 22, 3);
  // 青い魚群
  const blueSchool = createSchool(p, 16, 24, 0);

  // 全ての小魚を追加
  tinyFishes = [...yellowSchool, ...redSchool, ...greenSchool, ...blueSchool];
}


let ripples: Ripple[] = [];
let yoff = 0;
let draggedAmplitude = 70;
let defaultAmplitude = 10;
let currentAmplitude = 10;

const draw = (p: p5) => {
  p.background(0, 120, 220);

  // 波紋を描画
  for (let i = ripples.length - 1; i >= 0; i--) {
    ripples[i].update();
    ripples[i].display(p);
    if (ripples[i].isFinished()) {
      ripples.splice(i, 1);
    }
  }

  // 全ての魚のリスト
  const allFishes = [...tinyFishes];

  // 小さな魚の群れの行動を更新
  tinyFishes.forEach(fish => {
    fish.flock(allFishes);
    // マウスクリック時のみ魚がマウスを避けるように
    if (p.mouseIsPressed) {
      fish.avoidMouse(100);
    }
    fish.update();
  });

  // 小魚を描画
  tinyFishes.forEach(fish => fish.display());
}

const mousePressed = (p: p5) => {
  // クリックした位置に波紋を追加
  ripples.push(new Ripple(p.mouseX, p.mouseY, 0, 0));
  sketchState.isDrawing = true;
}

const mouseReleased = () => {
  sketchState.isDrawing = false;
}

const mouseDragged = (p: p5) => {
  ripples.push(new Ripple(p.mouseX, p.mouseY, 0, 0));
}

const touchMoved = (p: p5) => {
  ripples.push(new Ripple(p.mouseX, p.mouseY, 0, 0));
  sketchState.isDrawing = true;
}

const touchStarted = (p: p5) => {
  ripples.push(new Ripple(p.mouseX, p.mouseY, 0, 0));
  sketchState.isDrawing = true;
}

const touchEnded = () => {
  sketchState.isDrawing = false;
}

const sketch = (p: p5) => {
  p.setup = () => setup(p);
  p.draw = () => draw(p);
  p.mousePressed = () => mousePressed(p);
  p.mouseDragged = () => mouseDragged(p);
  p.mouseReleased = mouseReleased;
  p.touchMoved = () => touchMoved(p);
  p.touchStarted = () => touchStarted(p);
  p.touchEnded = touchEnded;
};

const P5Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const P5Instance = new p5(sketch, canvasRef.current);
    return () => {
      P5Instance.remove();
    };
  }, []);

  return <div ref={canvasRef}></div>;
};

export default P5Canvas;
