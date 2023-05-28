const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
  constructor(x, y, size, color, angle, speed, circleIndex) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.angle = angle;
    this.speed = speed;
    this.distance = 100;
    this.maxDistance = 200;
    this.scattered = false;
    this.circleIndex = circleIndex;
    this.circleRadius = 300;
    this.circleSpeed = 0.01;
    this.circleAngle = Math.random() * (2 * Math.PI);
  }

  update() {
    if (!this.scattered) {
      this.x = canvas.width / 2 + Math.cos(this.angle) * this.distance;
      this.y = canvas.height / 2 + Math.sin(this.angle * 2) * this.distance;
    } else {
      this.circleAngle += this.circleSpeed;
      const circleX = canvas.width / 2 + Math.cos(this.circleIndex * (2 * Math.PI / 10)) * this.circleRadius;
      const circleY = canvas.height / 2 + Math.sin(this.circleIndex * (2 * Math.PI / 10)) * this.circleRadius;
      this.x = circleX + Math.cos(this.circleAngle) * this.distance;
      this.y = circleY + Math.sin(this.circleAngle) * this.distance;
    }
    this.angle += this.speed;
  }

  scatter(mouseX, mouseY) {
    const dx = this.x - mouseX;
    const dy = this.y - mouseY;
    const dist = Math.hypot(dx, dy);
    if (dist < 100) {
      this.distance += 5;
    }
    if (this.distance > this.maxDistance) {
      this.distance = this.maxDistance;
      this.scattered = true;
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

let particles = [];

function createParticles() {
  const particleCount = 600;
  const size = 4;
  const circleCount = 10;

  for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * (2 * Math.PI);
    const hue = Math.floor(Math.random() * 60 + 40);
    const saturation = Math.floor(Math.random() * 50 + 50);
    const lightness = Math.floor(Math.random() * 10 + 70);
    const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    const speed = 0.01;
    const circleIndex = Math.floor(i / (particleCount / circleCount));
    particles.push(new Particle(canvas.width / 2, canvas.height / 2, size, color, angle, speed, circleIndex));
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(particle => {
    particle.update();
    particle.draw();
  });
  requestAnimationFrame(animate);
}

canvas.addEventListener('mousemove', function (event) {
  const x = event.clientX;
  const y = event.clientY;
  particles.forEach(particle => {
    particle.scatter(x, y);
  });
});

createParticles();
animate();
