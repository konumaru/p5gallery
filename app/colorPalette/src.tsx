'use client'

import p5 from 'p5';
import React, { useEffect, useRef } from 'react';

interface ColorCell {
    x: number;
    y: number;
    size: number;
    color: p5.Color;
}

const sketch = (p: p5) => {
    // 改良パレット - ベージュを減らし、赤と青の中間色を追加
    const palette = [
        '#C7DCA7', // みずみずしい若葉グリーン（柔らかく明るい）
        '#F2C6B4', // 明るいダスティピンク（落ち着きと優しさ）
        '#D1B6E1', // ラベンダー（赤と青の中間色）
        '#BFD8D2', // 淡いブルーグリーン（爽やかで静か）
        '#E8DED2'  // ナチュラルベージュ（中間の中和色）
    ];

    let cells: ColorCell[] = [];
    const gridSize = 5;
    const cellPadding = 5;

    p.setup = () => {
        const width = p.min(p.windowWidth, 960);
        const height = p.min(p.windowHeight, 720);
        p.createCanvas(width, height);
        p.noLoop();
        initGrid();
    };

    const initGrid = () => {
        cells = [];
        // セルのサイズを計算（キャンバスサイズに合わせて調整）
        const cellSize = Math.min(
            (p.width - (gridSize + 1) * cellPadding) / gridSize,
            (p.height - (gridSize + 1) * cellPadding) / gridSize
        );

        // キャンバスの中央に配置するためのオフセットを計算
        const gridWidth = gridSize * cellSize + (gridSize - 1) * cellPadding;
        const gridHeight = gridSize * cellSize + (gridSize - 1) * cellPadding;
        const startX = (p.width - gridWidth) / 2;
        const startY = (p.height - gridHeight) / 2;

        // セルを作成
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                const x = startX + col * (cellSize + cellPadding);
                const y = startY + row * (cellSize + cellPadding);

                // 基本となる色のインデックスを選択（列ごとに変える）
                const baseColorIndex = col % palette.length;

                // 行ごとに透明度を変える（上から下へ透明度が下がる）
                const alpha = p.map(row, 0, gridSize - 1, 1.0, 0.4); // 透明度を1.0から0.4の範囲で変化

                // 元の色を取得し、透明度を設定
                const baseColor = p.color(palette[baseColorIndex]);
                baseColor.setAlpha(alpha * 255); // p5.jsでは透明度は0-255の範囲

                cells.push({
                    x: x,
                    y: y,
                    size: cellSize,
                    color: baseColor
                });
            }
        }
    };

    p.draw = () => {
        p.background('#F5F5F5'); // 明るいグレージュの背景

        // すべてのセルを描画
        for (const cell of cells) {
            p.fill(cell.color);
            p.noStroke();
            p.rect(cell.x, cell.y, cell.size, cell.size, 10); // 角丸の四角形
        }
    };

    p.windowResized = () => {
        const width = p.min(p.windowWidth, 960);
        const height = p.min(p.windowHeight, 720);
        p.resizeCanvas(width, height);
        initGrid();
        p.redraw();
    };
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
