'use client'

import p5 from 'p5';
import React, { useEffect, useRef } from 'react';

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
    p.noFill();
    for (let i = 0; i < p.TWO_PI; i += 0.1) {
      let x = this.x + p.cos(i) * this.radius;
      let y = this.y + p.sin(i) * this.radius;
      let alpha = p.map(p.cos(i - p.atan2(this.dy, this.dx)), -1, 1, 0, this.opacity);
      p.stroke(255, 255, 255, alpha);
      p.point(x, y);
    }
  }

  isFinished() {
    return this.opacity <= 0;
  }
}

const P5Canvas: React.FC = () => {
  const sketchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ripples: Ripple[] = [];
    let yoff = 0;

    const sketch = (p: p5) => {
      p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
      };

      p.draw = () => {
        p.background(0, 100, 200);
        // 水面の揺らぎを描画
        p.beginShape();
        p.fill(0, 120, 220, 50);
        let xoff = 0;
        for (let x = 0; x <= p.width; x += 10) {
          let y = p.map(p.noise(xoff, yoff), 0, 1, p.height / 2 - 20, p.height / 2 + 20);
          if (ripples.length > 0 && ripples.length < 20) {
            p.stroke(255, 255, 255);
          } else {
            let alpha = p.map(p.abs(p.width / 2 - x), 0, p.width / 2, 255, 0);
            p.stroke(255, 255, 255, 100);
          };
          p.vertex(x, y);
          xoff += 0.05;
        }
        p.vertex(p.width, p.height);
        p.vertex(0, p.height);
        p.endShape(p.CLOSE);
        yoff += 0.01;
        // 波紋を描画
        for (let i = ripples.length - 1; i >= 0; i--) {
          ripples[i].update();
          ripples[i].display(p);
          if (ripples[i].isFinished()) {
            ripples.splice(i, 1);
          }
        }
      };

      p.mouseDragged = () => {
        ripples.push(new Ripple(p.mouseX, p.mouseY, 0, 0));
      };
    };

    const p5Instance = new p5(sketch, sketchRef.current!);

    return () => {
      p5Instance.remove();
    };
  }, []);

  return <div ref={sketchRef}></div>;
};

export default P5Canvas;
