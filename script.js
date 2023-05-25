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
    this.angle = Math.random() * (2 * Math.PI);
  }

  update() {
    const cx = canvas.width / 2; 
    const cy = canvas.height / 2; 
    const rx = 450; 
    const ry = 150; 
    const speed = 0.0006; 

    this.x = cx + rx * Math.cos(this.angle);
    this.y = cy + ry * Math.sin(this.angle * 2);

    this.angle += speed;
    this.angle = this.angle % (2 * Math.PI);

    if (this.x <= 0 || this.x >= canvas.width) {
      this.speedX *= -1; // Reverse horizontal direction
    }
    if (this.y <= 0 || this.y >= canvas.height) {
      this.speedY *= -1; // Reverse vertical direction
    }

    // Apply 45-degree angle bounce
    if (this.x <= 0 && this.y >= canvas.height) {
      this.speedX = Math.abs(this.speedX);
      this.speedY = -Math.abs(this.speedY);
    }
    if (this.x <= 0 && this.y <= 0) {
      this.speedX = Math.abs(this.speedX);
      this.speedY = Math.abs(this.speedY);
    }
    if (this.x >= canvas.width && this.y <= 0) {
      this.speedX = -Math.abs(this.speedX);
      this.speedY = Math.abs(this.speedY);
    }
    if (this.x >= canvas.width && this.y >= canvas.height) {
      this.speedX = -Math.abs(this.speedX);
      this.speedY = -Math.abs(this.speedY);
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  setDirection(x, y) {
    const speed = Math.sqrt(this.speedX * this.speedX + this.speedY * this.speedY);
    const angle = Math.atan2(y - this.y, x - this.x);

    this.speedX = Math.cos(angle) * speed;
    this.speedY = Math.sin(angle) * speed;
  }

  resetDirection() {
    this.speedX = this.originalSpeedX;
    this.speedY = this.originalSpeedY;
  }
}

let particles = [];

function createParticles() {
  const particleCount = 100;
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

canvas.addEventListener('mousemove', function (event) {
  const x = event.clientX;
  const y = event.clientY;

  for (let i = 0; i < particles.length; i++) {
    particles[i].setDirection(x, y);
  }
});

canvas.addEventListener('mouseout', function () {
  for (let i = 0; i < particles.length; i++) {
    particles[i].resetDirection();
  }
});

createParticles();
animate();