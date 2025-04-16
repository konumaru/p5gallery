'use client'

import p5 from 'p5';
import React, { useEffect, useRef } from 'react';

interface Shape {
    type: 'circle' | 'rect' | 'line';
    x: number;
    y: number;
    size: number;
    width?: number; // 長方形の幅
    height?: number; // 長方形の高さ
    strokeWeight?: number; // 線の太さ
    angle: number;
    color: p5.Color;
}

const sketch = (p: p5) => {
    const canvasWidth = 1280;
    const canvasHeight = 670;
    let shapes: Shape[] = [];

    // モノクロのカラーパレット
    const colorPalette = [
        '#000000', // 黒
        '#222222', // ダークグレー
        '#444444', // ミディアムダークグレー
        '#666666', // ミディアムグレー
        '#888888', // グレー
        '#AAAAAA', // ライトグレー
        '#CCCCCC', // 明るいグレー
        '#FFFFFF', // 白
    ];

    p.setup = () => {
        p.createCanvas(canvasWidth, canvasHeight);
        p.angleMode(p.DEGREES);
        p.background('#f8f9fa');
        generateShapes();
        p.noLoop(); // 静止画を作成するためにループを停止
    };

    const generateShapes = () => {
        shapes = [];

        // 大きな背景となる幾何学模様 (少数)
        for (let i = 0; i < 15; i++) {
            shapes.push(createRandomShape(true));
        }

        // 小さな前景の幾何学模様 (多数)
        for (let i = 0; i < 100; i++) {
            shapes.push(createRandomShape(false));
        }

        // 大きい順に描画するためにソート
        shapes.sort((a, b) => b.size - a.size);
    };

    const createRandomShape = (isBackground: boolean): Shape => {
        const types = ['circle', 'rect', 'line'];
        const type = types[Math.floor(p.random(types.length))] as 'circle' | 'rect' | 'line';

        const x = p.random(canvasWidth);
        const y = p.random(canvasHeight);

        // 背景の図形は大きく、前景の図形は小さく
        const size = isBackground
            ? p.random(100, 300)
            : p.random(5, 50);

        const angle = p.random(360);

        // モノクロカラーパレットからランダムに選択し、透明度をつける
        const baseColor = p.color(colorPalette[Math.floor(p.random(colorPalette.length))]);
        const alpha = isBackground ? p.random(50, 120) : p.random(150, 255);
        baseColor.setAlpha(alpha);

        // 長方形のサイズ比率を事前に計算
        const width = size;
        const height = size * p.random(0.5, 1.5);

        // 線の太さを事前に計算
        const strokeWeight = p.random(1, 5);

        return {
            type,
            x,
            y,
            size,
            width,
            height,
            strokeWeight,
            angle,
            color: baseColor
        };
    };

    p.draw = () => {
        p.background('#f8f9fa');

        for (const shape of shapes) {
            p.push();
            p.translate(shape.x, shape.y);
            p.rotate(shape.angle);
            p.fill(shape.color);
            p.stroke(p.color(0, 0, 0, 20)); // 薄い黒の輪郭
            p.strokeWeight(1);

            switch (shape.type) {
                case 'circle':
                    p.ellipse(0, 0, shape.size);
                    break;
                case 'rect':
                    p.rectMode(p.CENTER);
                    p.rect(0, 0, shape.width || shape.size, shape.height || shape.size);
                    break;
                case 'line':
                    p.strokeWeight(shape.strokeWeight || 2);
                    p.stroke(shape.color);
                    p.line(-shape.size / 2, 0, shape.size / 2, 0);
                    break;
            }
            p.pop();
        }
    };

    // クリックイベントを削除
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
            <p className="text-center mt-4 text-gray-600">リロードして新しいパターンを生成</p>
        </div>
    );
};

export default GeometricCanvas;
