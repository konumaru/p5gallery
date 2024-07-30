'use client'

import p5 from 'p5';
import React, { useEffect, useRef } from 'react';

// スケッチの状態を管理するオブジェクト
const sketchState = {
  isDrawing: false
};

// 各機能を独立した関数として定義
const setup = (p: p5) => {
  p.createCanvas(window.innerWidth, window.innerHeight);
  p.background(255);
};

const draw = (p: p5) => {
  if (sketchState.isDrawing) {
    drawLine(p);
  }
};

const mousePressed = () => {
  sketchState.isDrawing = true;
};

const mouseReleased = () => {
  sketchState.isDrawing = false;
};

function drawLine(p: p5) {
  p.stroke(0);
  p.strokeWeight(2);
  p.line(p.pmouseX, p.pmouseY, p.mouseX, p.mouseY);
}

const touchMoved = (p: p5) => {
  drawLine(p);
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
