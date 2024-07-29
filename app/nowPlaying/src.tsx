'use client'

import p5 from 'p5';
import React, { useEffect, useRef } from 'react';


const setup = (p: p5) => {
    p.createCanvas(window.innerWidth, window.innerHeight);
    p.background(255);
};

const draw = (p: p5) => {
    p.textSize(24);
    p.text('artist', 100, 100);
};

const initializeSketch = (p: p5) => {
    p.setup = () => setup(p);
    p.draw = () => draw(p);
};

const P5Canvas: React.FC = () => {
    const canvasRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        const P5Instance = new p5(initializeSketch, canvasRef.current);

        return () => {
            P5Instance.remove();
        };
    }, []);

    return <div ref={canvasRef}></div>;
};

export default P5Canvas;
