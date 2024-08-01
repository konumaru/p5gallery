'use client'

import p5 from 'p5';
import React, { useEffect, useRef } from 'react';
import { Fish } from './Fish';

const sketchState = {
  isDrawing: false
};

let fishes: Fish[] = [];

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

const setup = (p: p5) => {
  const width = p.min(p.windowWidth, 960);
  const height = p.min(p.windowHeight, 720);
  p.createCanvas(width, height);

  for (let i = 0; i < 10; i++) {
    fishes.push(new Fish(p));
  }
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
  // 魚を描画
  fishes.forEach(fish => {
    fish.avoidMouse(100);
    fish.update();
    fish.display();
  });
}

const mousePressed = () => {
  sketchState.isDrawing = true;
}

const mouseReleased = () => {
  sketchState.isDrawing = false;
}

const touchMoved = (p: p5) => {
  ripples.push(new Ripple(p.mouseX, p.mouseY, 0, 0));
  sketchState.isDrawing = true;
}

const touchStarted = () => {
  sketchState.isDrawing = true;
}

const touchEnded = () => {
  sketchState.isDrawing = false;
}

const sketch = (p: p5) => {
  p.setup = () => setup(p);
  p.draw = () => draw(p);
  p.mousePressed = mousePressed;
  p.mouseReleased = mouseReleased;
  p.touchMoved = () => touchMoved(p);
  p.touchStarted = touchStarted;
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
