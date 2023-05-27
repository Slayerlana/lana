const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
    constructor(x, y, size, color, speedX, speedY) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.speedX = speedX;
        this.speedY = speedY;
        this.originalSpeedX = speedX;
        this.originalSpeedY = speedY;
        this.angle = Math.random() * (2 * Math.PI); // Random initial angle
        this.ifMove = false;
        this.defX = (canvas.width / 2)+450 * Math.cos(this.angle);
        this.defY = (canvas.height / 2)+150 * Math.sin(this.angle* 2);
        this.toDef = false;
    }

    update() {
        const cx = canvas.width / 2; // x-coordinate of the center of the path
        const cy = canvas.height / 2; // y-coordinate of the center of the path
        const rx = 450; // radius for x-axis
        const ry = 150; // radius for y-axis
        const angleStep = 0.0006; // "speed"

        if (!this.ifMove){
            if (this.toDef){
                if (this.x< this.defX){
                    this.x+=1;
                    if (this.x>=this.defX){
                        this.x = this.defX
                        this.toDef =false;
                    }
                }else if (this.x> this.defX){
                    this.x-=1;
                    if (this.x<=this.defX){
                        this.x = this.defX
                        this.toDef =false;
                    }
                }
                if (this.y < this.defY){
                    this.y+=1;
                    if (this.y>=this.defY){
                        this.y = this.defY
                        this.toDef =false;
                    }
                }else if (this.y> this.defY){
                    this.y-=1;
                    if (this.y<=this.defY){
                        this.y = this.defY
                        this.toDef =false;
                    }
                }
                /*this.x = this.defX;
                this.y = this.defY;*/

            }else {
                this.x = cx + rx * Math.cos(this.angle);
                this.y = cy + ry * Math.sin(this.angle * 2);
                this.angle += angleStep;
                this.angle = this.angle % (2 * Math.PI);
                this.defX = this.x
                this.defY = this.y
            }

           /* if (this.x==this.defX && this.y ==this.defY){
                this.x = cx + rx * Math.cos(this.angle);
                this.y = cy + ry * Math.sin(this.angle * 2);
                this.angle += angleStep;
                this.angle = this.angle % (2 * Math.PI);
            }*/

        }else {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x <= 0 || this.x >= canvas.width) {
                this.speedX *= -1;
            }
            if (this.y <= 0 || this.y >= canvas.height) {
                this.speedY *= -1;
            }
        }


    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

// can be removed
    setDirection(x, y, ifMove) {
        const speed = Math.sqrt(this.speedX * this.speedX + this.speedY * this.speedY);
        const angle = Math.atan2(y - this.y, x - this.x);
        this.ifMove = ifMove
        this.speedX = Math.cos(angle) * speed;
        this.speedY = Math.sin(angle) * speed;
    }

    resetDirection() {
        this.speedX = this.originalSpeedX;
        this.speedY = this.originalSpeedY;
        this.ifMove = false;
        this.toDef = true;
    }
}

let particles = [];

function createParticles() {
    const particleCount = 150;
    const size = 10;

    for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const speedX = Math.random() * 2 - 1;
        const speedY = Math.random() * 2 - 1;
        const hue = Math.floor(Math.random() * 60 + 40); // Random hue in the range 40-100
        const saturation = Math.floor(Math.random() * 50 + 50); // Random saturation in the range 50-100
        const lightness = Math.floor(Math.random() * 10 + 70); // Random lightness in the range 70-80
        const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

        particles.push(new Particle(x, y, size, color, speedX, speedY));
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
    }


    requestAnimationFrame(animate);
}

var originalX = 0;
var originalY = 0;

canvas.addEventListener('mousemove', function (event) {
    const x = event.clientX;
    const y = event.clientY;
    originalX = x;
    originalY = y;
    let  sf = false;
    setTimeout(()=>{
        if (x==originalX&&y==originalY){
            sf = true;
        }
    },1000)
    if (sf){
        for (let i = 0; i < particles.length; i++) {
            particles[i].setDirection(x, y, false);
        }
    }else {
        for (let i = 0; i < particles.length; i++) {

            particles[i].setDirection(x, y, true);
        }
    }

});

canvas.addEventListener('mouseout', function () {
    this.ifMove = false;
    console.log("鼠标停止----------：", this.ifMove)
    for (let i = 0; i < particles.length; i++) {
        particles[i].resetDirection();
    }
});


createParticles();
animate();
