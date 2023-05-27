const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
  constructor(x, y, size, speedX, speedY) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speedX = speedX;
    this.speedY = speedY;
    this.fadeOutTime = Math.random() * 5000 + 6000; // Random fade out time between 2-7 seconds
    this.alpha = 1;
    this.color = this.calculateColor();
    this.angle = Math.random() * (2 * Math.PI);
    this.isHovered = false;
  }

  calculateColor() {
    const minSpeed = 0.1; // Minimum speed value for determining color
    const maxSpeed = 2; // Maximum speed value for determining color
    const normalizedSpeed = (Math.sqrt(this.speedX ** 2 + this.speedY ** 2) - minSpeed) / (maxSpeed - minSpeed);
    const hue = (1 - normalizedSpeed) * 120; // Ranges from 0 (green) to 120 (red)
    return `hsl(${hue}, 100%, 50%)`;
  }

  update() {
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const rx = 450;
    const ry = 150;
    const speed = 0.001 + Math.sqrt(this.speedX ** 2 + this.speedY ** 2) * 0.001; // Adjust the multiplication factor to control the speed

    this.angle += speed;
    this.angle = this.angle % (2 * Math.PI);

    this.x = cx + rx * Math.cos(this.angle);
    this.y = cy + ry * Math.sin(this.angle * 2);

    if (this.isHovered) {
      this.color = 'red';
    } else {
      this.alpha -= 1 / (this.fadeOutTime / 3); // Adjust the division factor to control the fading speed

      if (this.alpha <= 0) {
        this.alpha = 0;
        this.reset();
      }
    }
  }

  draw() {
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  reset() {
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const rx = 450;
    const ry = 150;

    this.x = cx + rx * Math.cos(this.angle);
    this.y = cy + ry * Math.sin(this.angle * 2);
    this.speedX = Math.random() * 2 - 1; // Customize the range of speedX according to your needs
    this.speedY = Math.random() * 2 - 1; // Customize the range of speedY according to your needs
    this.fadeOutTime = Math.random() * 5000 + 2000; // Customize the range of fadeOutTime according to your needs
    this.alpha = 1;
    this.color = this.calculateColor();
    this.isHovered = false;
  }
}

let particles = [];

function createParticles() {
  const particleCount = 150;
  const size = 10;

  for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * (2 * Math.PI);
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const rx = 450;
    const ry = 150;
    const x = cx + rx * Math.cos(angle);
    const y = cy + ry * Math.sin(angle * 2);
    const speedX = Math.random() * 2 - 1; // Customize the range of speedX according to your needs
    const speedY = Math.random() * 2 - 1; // Customize the range of speedY according to your needs

    particles.push(new Particle(x, y, size, speedX, speedY));
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

function handleMouseMove(event) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  for (let i = 0; i < particles.length; i++) {
    const particle = particles[i];
    const distance = Math.sqrt((mouseX - particle.x) ** 2 + (mouseY - particle.y) ** 2);

    if (distance <= particle.size) {
      particle.isHovered = true;
    } else {
      particle.isHovered = false;
    }
  }
}

createParticles();
animate();

canvas.addEventListener('mousemove', handleMouseMove);
