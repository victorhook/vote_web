class Vec2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    magnitude() {
        return Math.hypot(this.x, this.y);
    }
    normalize() {
        return this.div(this.magnitude());
    }
    add(vec) {
        return new Vec2(this.x + vec.x, this.y + vec.y);
    }
    sub(vec) {
        return new Vec2(this.x - vec.x, this.y - vec.y);
    }
    div(scalar) {
        return new Vec2(this.x / scalar, this.y / scalar);
    }
    mul(scalar) {
        return new Vec2(this.x * scalar, this.y * scalar);
    }
    distanceTo(vec) {
        return new Vec2(this.x - vec.x, this.y - vec.y);
    }
}

$(document).ready(() => {
    const canvas = $('#snow-canvas')[0];
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    const ctx = canvas.getContext('2d');

    class Snow {
        constructor(balls) {
            this.lastTime = 0;
            this.countTime = 0;
            this.leftWind = true;
            this.maxWindStrength = .3;
            this.windStep = .1;
            this.wind = 0;

            this.balls = [];
            for (let i = 0; i < balls; i++) {
                this.balls.push(new SnowBall());
            }

            this.cane = new CandyCane();
        }
        render(time) {
            if (!snowing) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                requestAnimationFrame(time => this.render(time));
                return;
            }

            let elapsedTime = time - this.lastTime;
            this.countTime += elapsedTime;
            this.lastTime = time;

            let useWind = (this.countTime/1000) > 1;
            let accX = 0;
            useWind = false;

            if (useWind) {
                this.countTime = 0;

                let sign = this.leftWind ? -1 : 1;
                this.wind += sign * Math.random() * this.windStep;
                accX = this.wind;

                if (Math.abs(this.wind) > this.maxWindStrength) {
                    this.leftWind = !this.leftWind;
                }
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            this.balls.forEach(ball => {
                ball.dx += accX;
                ball.move(elapsedTime);
                ball.render(ctx);
            });

            this.cane.render(ctx);
            requestAnimationFrame(time => this.render(time));
        }
    }

    let cursor = new Vec2(0, 0);
    let cursorDown = false;

    function getSnowing() {
        for (let part of document.cookie.split(';')) {
            part = part.trim();
            if (part.startsWith('snowing=') && part.endsWith('path=/')) {
                return part.split('=')[1].split(' ')[0].trim() == 'true';
            }
        }
        setSnowing('true');
        return true;
    }

    function setSnowing(value) {
        document.cookie = `snowing=${value} path=/`
    }

    let snowing = getSnowing();
    updateSnowToggler();

    $('#snow-toggler').click(() => {
        snowing = !snowing;
        setSnowing(snowing ? 'true' : 'false');
        console.log(document.cookie)
        updateSnowToggler();
    })

    function updateSnowToggler() {
        if (snowing) {
            $('#cross').hide();
        } else {
            $('#cross').show();
        }
    }

    document.addEventListener('mousedown', () => cursorDown = true);
    document.addEventListener('mouseup', () => cursorDown = false);
    window.addEventListener('mousemove', move => {
        cursor.x = move.clientX;
        cursor.y = move.clientY;
    })


    class SnowBall {
        constructor() {

            this.MARGIN = 5;
            this.MARGIN_CURSOR = 100;

            this.impact = false;
            this.counter = 0;

            let rMax = 1;
            this.angle = Math.random() * 360;

            // Vectors
            this.pos = new Vec2(
                Math.random() * canvas.width,
                Math.random() * canvas.height
            )
            this.velocity = new Vec2(
                (Math.random() * rMax) - (rMax * Math.random()),
                Math.random() * 3
            );

            // Other stuff
            this.gravity = .5;
            this.size = 2 + Math.random() * 8;
            this.rotation = Math.random() * Math.PI * 2;

            let cMin = 10;
            let color = cMin + Math.round(Math.random() * (15-cMin));
            let r = (color).toString(16);
            let g = r;
            let b = color < 16 ? color + 1 : color;
            b = (b).toString(16);
            this.color = '#' + r + g + b;
        }
        move(elapsedTime) {
            if (cursorDown) {
                let distance = this.pos.distanceTo(cursor);
                if (distance.magnitude() < this.MARGIN_CURSOR) {
                    let dir = distance.normalize();
                    this.velocity = this.velocity.add(dir);
                }
            }

            let dx = this.velocity.x;
            let dy = this.velocity.y + this.gravity;

            this.constrain();

            this.pos.x += dx;
            this.pos.y += dy;
        }
        constrain() {
            if (this.velocity.magnitude() > 3) {
                this.velocity = this.velocity.div(2);
            }
            if (this.pos.x < 0) {
                this.pos.x = canvas.width;
            }
            else if (this.pos.x > canvas.width) {
                this.pos.x = 0;
            }
            if (this.pos.y < 0) {
                this.pos.y = canvas.height;
            }
            else if (this.pos.y > canvas.height) {
                this.pos.y = 0;
            }
        }
        render(ctx) {
            ctx.beginPath();
            ctx.fillStyle  = this.color;
            ctx.arc(this.pos.x, this.pos.y, this.size, 0, 2 * Math.PI);
            ctx.fill();
        }
    }


    class CandyCane {
        constructor() {
            this.pos = new Vec2(0, 0);
            this.image = new Image();
            this.image.src = '/static/images/cane.svg';
        }
            render(ctx) {
                if (cursorDown) {
                    ctx.drawImage(this.image, cursor.x-this.image.width/2, cursor.y-this.image.height/2);
                }
            }
    }

    const snow = new Snow(200);
    snow.render(0);

});