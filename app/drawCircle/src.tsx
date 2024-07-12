'use client'

import p5 from 'p5';
import React, { useEffect, useRef } from 'react';



const P5Wrapper: React.FC = () => {
  const p5ContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!p5ContainerRef.current) return;

    const sketch = (p: p5) => {
      p.setup = () => {
        p.createCanvas(window.innerWidth, window.innerHeight);
        p.background(243, 244, 246);
      };

      p.draw = () => {
        // 描画ループは空のままにします
      };

      p.mousePressed = () => {
        p.fill(p.random(255), p.random(255), p.random(255));
        p.ellipse(p.mouseX, p.mouseY, 50, 50);
      };
    };

    const p5Instance = new p5(sketch, p5ContainerRef.current);

    return () => {
      p5Instance.remove();
    };
  }, []);

  return <div ref={p5ContainerRef}></div>;
};

export default P5Wrapper;
