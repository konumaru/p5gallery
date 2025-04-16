'use client'

import p5 from 'p5';
import React, { useEffect, useRef } from 'react';

// Moldクラスの定義
class Mold {
    x: number;
    y: number;
    r: number;
    heading: number;
    vx: number;
    vy: number;
    rotAngle: number;
    rSensorPos: p5.Vector;
    lSensorPos: p5.Vector;
    fSensorPos: p5.Vector;
    sensorAngle: number;
    sensorDist: number;
    p: p5;

    constructor(p: p5, width: number, height: number) {
        this.p = p;
        // キャンバス全体からランダムに初期位置を決定
        this.x = p.random(width);
        this.y = p.random(height);
        this.r = 0.7;
        this.heading = p.random(360);
        this.vx = p.cos(this.heading);
        this.vy = p.sin(this.heading);
        this.rotAngle = 45;
        this.rSensorPos = p.createVector(0, 0);
        this.lSensorPos = p.createVector(0, 0);
        this.fSensorPos = p.createVector(0, 0);
        this.sensorAngle = 45;
        this.sensorDist = 10;
    }

    update(width: number, height: number) {
        this.vx = this.p.cos(this.heading);
        this.vy = this.p.sin(this.heading);
        this.x = (this.x + this.vx + width) % width;
        this.y = (this.y + this.vy + height) % height;
        this.getSensorPos(this.rSensorPos, this.heading + this.sensorAngle, width, height);
        this.getSensorPos(this.lSensorPos, this.heading - this.sensorAngle, width, height);
        this.getSensorPos(this.fSensorPos, this.heading, width, height);
        // センサーの値によるランダムな方向転換（シンプル化）
        if (this.p.random(1) < 0.03) {
            if (this.p.random(1) < 0.5) {
                this.heading += this.rotAngle;
            } else {
                this.heading -= this.rotAngle;
            }
        }
    }

    display() {
        this.p.noStroke();
        this.p.fill(30, 30, 30, 120);
        this.p.ellipse(this.x, this.y, this.r * 2, this.r * 2);
    }

    getSensorPos(sensor: p5.Vector, angle: number, width: number, height: number) {
        sensor.x = (this.x + this.sensorDist * this.p.cos(angle) + width) % width;
        sensor.y = (this.y + this.sensorDist * this.p.sin(angle) + height) % height;
    }
}

const sketch = (p: p5) => {
    const canvasWidth = 1280;
    const canvasHeight = 670;
    let molds: Mold[] = [];
    const moldCount = 120;
    let isPaused = false;

    p.setup = () => {
        p.createCanvas(canvasWidth, canvasHeight);
        p.background('#f8f9fa');
        for (let i = 0; i < moldCount; i++) {
            molds.push(new Mold(p, canvasWidth, canvasHeight));
        }
        p.frameRate(60);
    };

    p.draw = () => {
        if (isPaused) return;
        p.fill(248, 249, 250, 10);
        p.noStroke();
        p.rect(0, 0, canvasWidth, canvasHeight);
        for (const mold of molds) {
            mold.update(canvasWidth, canvasHeight);
            mold.display();
        }
    };

    p.mousePressed = () => {
        isPaused = !isPaused;
    };
};

const GeometricCanvas: React.FC = () => {
    const canvasRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        const p5Instance = new p5(sketch, canvasRef.current);

        return () => {
            p5Instance.remove();
        };
    }, []);

    return (
        <div>
            <div ref={canvasRef}></div>
            <p className="text-center mt-4 text-gray-600">クリックで一時停止／再開</p>
        </div>
    );
};

export default GeometricCanvas;
