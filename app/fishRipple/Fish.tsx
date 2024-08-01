import p5 from 'p5';

interface FishProps {
    p: p5;
}


export class Fish {
    position: p5.Vector;
    velocity: p5.Vector;
    acceleration: p5.Vector;
    maxSpeed: number;
    maxForce: number;
    size: number;
    color: p5.Color;
    segments: number;
    segmentOffsets: number[];
    p: p5;

    constructor(p: p5) {
        this.p = p;
        this.position = p.createVector(p.random(p.width), p.random(p.height));
        this.velocity = p5.Vector.random2D().mult(p.random(1, 2));
        this.acceleration = p.createVector();
        this.maxSpeed = p.random(2, 4);
        this.maxForce = 0.1;
        this.size = p.random(50, 80);
        this.color = p.color(p.random(200, 255), p.random(200, 255), p.random(200, 255), 200);
        this.segments = 6;
        this.segmentOffsets = Array(this.segments).fill(0).map(() => p.random(p.TWO_PI));
    }

    update() {
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.position.add(this.velocity);
        this.acceleration.mult(0);
        this.edges();
    }

    avoidMouse(repelForce: number) {
        let mouse = this.p.createVector(this.p.mouseX, this.p.mouseY);
        let dir = p5.Vector.sub(this.position, mouse);
        let d = dir.mag();
        if (d < repelForce) {
            dir.setMag(this.p.map(d, 0, repelForce, this.maxSpeed, 0));
            this.applyForce(dir);
        }
    }

    applyForce(force: p5.Vector) {
        this.acceleration.add(force);
    }

    edges() {
        if (this.position.x < -this.size) this.position.x = this.p.width + this.size;
        if (this.position.x > this.p.width + this.size) this.position.x = -this.size;
        if (this.position.y < -this.size) this.position.y = this.p.height + this.size;
        if (this.position.y > this.p.height + this.size) this.position.y = -this.size;
    }

    display() {
        this.p.push();
        this.p.translate(this.position.x, this.position.y);
        this.p.rotate(this.velocity.heading() + this.p.PI);

        this.p.stroke(this.color);
        this.p.noFill();

        // 頭蓋骨（三角形）
        this.p.strokeWeight(2);
        this.p.triangle(-this.size * 0.5, 0, -this.size * 0.3, this.size * 0.1, -this.size * 0.3, -this.size * 0.1);

        // 背骨
        this.p.strokeWeight(2);
        this.p.beginShape();
        for (let i = 0; i < this.segments; i++) {
            let x = this.p.map(i, 0, this.segments - 1, -this.size * 0.3, this.size * 0.4);
            let y = this.p.sin(this.p.frameCount * 0.1 + this.segmentOffsets[i]) * (this.size * 0.03);
            this.p.vertex(x, y);
        }
        this.p.endShape();

        // 肋骨
        this.p.strokeWeight(1);
        for (let i = 1; i < this.segments - 1; i++) {
            let x = this.p.map(i, 0, this.segments - 1, -this.size * 0.3, this.size * 0.4);
            let y = this.p.sin(this.p.frameCount * 0.1 + this.segmentOffsets[i]) * (this.size * 0.03);
            let ribLength = this.p.map(i, 0, this.segments - 1, this.size * 0.15, this.size * 0.05);
            this.p.line(x, y - ribLength / 2, x, y + ribLength / 2);
        }

        // 尾骨（三角形）
        let tailAngle = this.p.sin(this.p.frameCount * 0.2) * 0.3;
        this.p.push();
        this.p.translate(this.size * 0.4, 0);
        this.p.rotate(tailAngle);
        this.p.triangle(0, 0, this.size * 0.1, this.size * 0.08, this.size * 0.1, -this.size * 0.08);
        this.p.pop();
        this.p.pop();
    }
}

