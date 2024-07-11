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
    p.stroke(0);
    p.strokeWeight(2);
    p.line(p.pmouseX, p.pmouseY, p.mouseX, p.mouseY);
  }
};

const mousePressed = () => {
  sketchState.isDrawing = true;
};

const mouseReleased = () => {
  sketchState.isDrawing = false;
};

// p5インスタンスを初期化する関数
const initializeSketch = (p: p5) => {
  p.setup = () => setup(p);
  p.draw = () => draw(p);
  p.mousePressed = mousePressed;
  p.mouseReleased = mouseReleased;
};

const P5Wrapper: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const p5Instance = new p5(initializeSketch, canvasRef.current);

    return () => {
      p5Instance.remove();
    };
  }, []);

  return <div ref={canvasRef}></div>;
};

export default P5Wrapper;