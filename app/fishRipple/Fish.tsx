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
    segmentPoints: p5.Vector[];
    bodyWidth: number;
    tailWaveSpeed: number;
    tailWaveAmplitude: number;
    finSize: number;
    finWaveSpeed: number;
    p: p5;
    bodyColor: p5.Color;
    finColor: p5.Color;
    accentColor: p5.Color;
    trailPositions: p5.Vector[];
    trailMaxSize: number;
    lastTime: number;
    schoolId: number;
    isTiny: boolean;
    uniqueOffset: number;
    colorShift: number;

    constructor(p: p5, size?: number, schoolId?: number) {
        this.p = p;
        this.position = p.createVector(p.random(p.width), p.random(p.height));
        this.velocity = p5.Vector.random2D().mult(p.random(1, 2));
        this.acceleration = p.createVector();
        this.isTiny = size !== undefined && size < 30;
        this.maxSpeed = this.isTiny ? p.random(1.2, 2.2) : p.random(2, 4);
        this.maxForce = this.isTiny ? 0.1 : 0.1;
        this.size = size || p.random(60, 100);
        this.bodyWidth = this.size * 0.2;
        this.schoolId = schoolId || 0;
        this.uniqueOffset = p.random(0, p.TWO_PI);
        this.colorShift = p.random(-15, 15);

        // ベースカラーを設定 (学校IDに基づいて色を変える)
        let hue = p.random(190, 220);  // デフォルトは青系
        let saturation = p.random(60, 85);
        let brightness = p.random(70, 90);

        // 学校IDに基づいて色調を決定
        if (this.schoolId === 1) {
            hue = p.random(20, 40) + this.colorShift; // 黄色/金色系
        } else if (this.schoolId === 2) {
            hue = p.random(0, 15) + this.colorShift; // 赤系
        } else if (this.schoolId === 3) {
            hue = p.random(70, 150) + this.colorShift; // 緑系
        }

        // 抽象的な色使い - 個体差あり
        this.color = p.color(hue, saturation, brightness, 220);
        this.bodyColor = p.color(hue, saturation, brightness, 180);
        this.finColor = p.color(hue, saturation - 10, brightness + 10, 150);
        this.accentColor = p.color((hue + 180) % 360, saturation, brightness, 150); // 補色でアクセント

        this.segments = this.isTiny ? 4 : 6; // セグメント数を減らしてシンプルに
        this.segmentPoints = [];

        // 初期のセグメントポイントを計算
        for (let i = 0; i < this.segments; i++) {
            this.segmentPoints.push(p.createVector(0, 0));
        }

        // 残像効果用の位置履歴
        this.trailPositions = [];
        this.trailMaxSize = this.isTiny ? 3 : 5;

        this.tailWaveSpeed = p.random(0.05, 0.15);
        this.tailWaveAmplitude = p.random(0.2, 0.5);
        this.finSize = this.size * p.random(0.15, 0.25);
        this.finWaveSpeed = p.random(0.1, 0.2);
        this.lastTime = p.millis();
    }

    update() {
        // デルタタイムを計算して一定の動きにする
        const currentTime = this.p.millis();
        const deltaTime = (currentTime - this.lastTime) / 16.7; // 60fpsを基準
        this.lastTime = currentTime;

        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);

        // 残像用に現在位置を保存
        if (this.p.frameCount % 3 === 0) {
            this.trailPositions.push(this.position.copy());
            if (this.trailPositions.length > this.trailMaxSize) {
                this.trailPositions.shift();
            }
        }

        // 修正：Vector.mult の使い方を修正
        const velocityStep = this.velocity.copy().mult(deltaTime);
        this.position.add(velocityStep);

        this.acceleration.mult(0);

        // セグメントポイントの更新
        this.updateSegments(deltaTime);

        this.edges();
    }

    // 群れの仲間の平均位置に向かって泳ぐ力を計算
    cohesion(fishes: Fish[], perceptionRadius: number): p5.Vector {
        let steering = this.p.createVector(0, 0);
        let total = 0;

        for (let other of fishes) {
            if (other !== this && other.schoolId === this.schoolId) {
                let d = this.position.dist(other.position);
                if (d < perceptionRadius && d > 0) {
                    steering.add(other.position);
                    total++;
                }
            }
        }

        if (total > 0) {
            steering.div(total);
            steering.sub(this.position);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }

        return steering;
    }

    // 群れの仲間との距離を保つ力を計算
    separation(fishes: Fish[], perceptionRadius: number): p5.Vector {
        let steering = this.p.createVector(0, 0);
        let total = 0;

        for (let other of fishes) {
            if (other !== this) {
                let d = this.position.dist(other.position);
                if (d < perceptionRadius && d > 0) {
                    let diff = p5.Vector.sub(this.position, other.position);
                    diff.normalize();
                    diff.div(d); // 距離が近いほど強い力が働く
                    steering.add(diff);
                    total++;
                }
            }
        }

        if (total > 0) {
            steering.div(total);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }

        return steering;
    }

    // 群れの仲間と同じ方向に泳ぐ力を計算
    alignment(fishes: Fish[], perceptionRadius: number): p5.Vector {
        let steering = this.p.createVector(0, 0);
        let total = 0;

        for (let other of fishes) {
            if (other !== this && other.schoolId === this.schoolId) {
                let d = this.position.dist(other.position);
                if (d < perceptionRadius && d > 0) {
                    steering.add(other.velocity);
                    total++;
                }
            }
        }

        if (total > 0) {
            steering.div(total);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }

        return steering;
    }

    // 群れの行動を更新
    flock(fishes: Fish[]) {
        const alignForce = this.alignment(fishes, this.size * 3);
        const cohesionForce = this.cohesion(fishes, this.size * 5);
        const separationForce = this.separation(fishes, this.size * 2);

        // 小さい魚ほど群れ行動に強く影響される
        const alignWeight = this.isTiny ? 1.5 : 1.0;
        const cohesionWeight = this.isTiny ? 1.2 : 1.0;
        const separationWeight = this.isTiny ? 1.8 : 1.5;

        alignForce.mult(alignWeight);
        cohesionForce.mult(cohesionWeight);
        separationForce.mult(separationWeight);

        this.applyForce(alignForce);
        this.applyForce(cohesionForce);
        this.applyForce(separationForce);
    }

    updateSegments(deltaTime: number) {
        // 頭部（先頭のセグメント）は魚の現在位置
        const heading = this.velocity.heading();

        // 先頭のセグメントを原点に設定
        if (this.segmentPoints[0]) {
            this.segmentPoints[0].set(0, 0);
        }

        // 残りのセグメントを更新
        for (let i = 1; i < this.segments; i++) {
            // 前のセグメントからの相対位置を計算
            const segment = this.segmentPoints[i];

            // 体の曲がり具合を計算（後ろに行くほど大きい）
            const bendFactor = this.p.map(i, 0, this.segments - 1, 0, this.tailWaveAmplitude);
            const waveOffset = this.p.sin(this.p.frameCount * this.tailWaveSpeed - i * 0.3) * bendFactor * this.size * 0.04;

            // 各セグメントの位置を計算
            const segmentLength = this.size / this.segments;
            const x = i * segmentLength;
            const y = waveOffset * i;

            if (segment) {
                segment.set(x, y);
            }
        }
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
        // 残像の描画
        this.drawTrail();

        this.p.push();
        this.p.translate(this.position.x, this.position.y);
        this.p.rotate(this.velocity.heading());

        // 魚の体を描画
        this.drawBody();
        // 魚の尾を描画
        this.drawTail();

        this.p.pop();
    }

    drawTrail() {
        // 残像を描画
        if (this.trailPositions.length > 0) {
            const trailColor = this.bodyColor; // 残像の色

            for (let i = 0; i < this.trailPositions.length; i++) {
                const pos = this.trailPositions[i];
                const alpha = this.p.map(i, 0, this.trailPositions.length - 1, 30, 100);
                const size = this.p.map(i, 0, this.trailPositions.length - 1, this.size * 0.2, this.size * 0.6);

                this.p.noStroke();
                const c = this.p.color(this.p.hue(trailColor), this.p.saturation(trailColor), this.p.brightness(trailColor), alpha);
                this.p.fill(c);

                this.p.push();
                this.p.translate(pos.x, pos.y);
                this.p.rotate(this.velocity.heading());
                this.p.ellipse(0, 0, size * 0.6, size * 0.4);
                this.p.pop();
            }
        }
    }

    drawBody() {
        // 抽象的な魚の体 - シンプルな楕円
        this.p.noStroke();
        this.p.fill(this.bodyColor);

        // 簡略化した魚の体 - 楕円ベース
        const bodyLength = this.size * 0.8;
        const bodyHeight = this.bodyWidth * 1.8;

        // メインボディを描画
        this.p.ellipse(this.size * 0.25, 0, bodyLength, bodyHeight);

        // アクセントの縞模様（抽象的なデザイン）
        if (!this.isTiny) {
            this.p.fill(this.accentColor);
            const stripeCount = 3;
            const stripeWidth = bodyLength / (stripeCount * 3);

            for (let i = 0; i < stripeCount; i++) {
                const xPos = this.size * 0.1 + i * (bodyLength / stripeCount);
                this.p.rect(xPos, -bodyHeight * 0.25, stripeWidth, bodyHeight * 0.5);
            }
        }

        // 目を描画
        this.p.fill(255);
        this.p.ellipse(this.size * 0.5, -this.bodyWidth * 0.3, this.bodyWidth * 0.25, this.bodyWidth * 0.25);
        this.p.fill(0);
        this.p.ellipse(this.size * 0.52, -this.bodyWidth * 0.3, this.bodyWidth * 0.12, this.bodyWidth * 0.12);
    }

    drawTail() {
        if (this.segments <= 0 || !this.segmentPoints[this.segments - 1]) return;

        const tailBase = this.segmentPoints[this.segments - 1];
        const tailSize = this.size * 0.3;

        this.p.push();
        this.p.translate(tailBase.x, tailBase.y);

        const tailWave = this.p.sin(this.p.frameCount * this.tailWaveSpeed * 1.5 + this.uniqueOffset) * 0.4;
        this.p.rotate(tailWave);

        // 尾ひれ - 抽象的な三角形や扇形
        this.p.fill(this.finColor);
        this.p.noStroke();

        if (this.isTiny) {
            // 小さい魚は三角形の尾
            this.p.triangle(
                0, 0,
                -tailSize * 0.8, -this.bodyWidth * 0.8,
                -tailSize * 0.8, this.bodyWidth * 0.8
            );
        } else {
            // 大きい魚は扇形の尾
            this.p.beginShape();
            // 上部
            this.p.vertex(0, -this.bodyWidth * 0.5);
            this.p.bezierVertex(
                -tailSize * 0.5, -this.bodyWidth * 1.0,
                -tailSize * 0.8, -this.bodyWidth * 0.8,
                -tailSize, 0
            );
            // 下部
            this.p.bezierVertex(
                -tailSize * 0.8, this.bodyWidth * 0.8,
                -tailSize * 0.5, this.bodyWidth * 1.0,
                0, this.bodyWidth * 0.5
            );
            this.p.endShape(this.p.CLOSE);

            // アクセントライン
            this.p.stroke(this.accentColor);
            this.p.strokeWeight(1);
            this.p.noFill();
            this.p.arc(
                -tailSize * 0.3, 0,
                tailSize * 0.8, this.bodyWidth * 1.2,
                -this.p.PI * 0.4, this.p.PI * 0.4
            );
        }

        this.p.pop();
    }
}

