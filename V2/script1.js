const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
  constructor(x, y, size, color, speedX, speedY, hue, saturation) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.speedX = speedX;
    this.speedY = speedY;
    this.originalSpeedX = speedX;
    this.originalSpeedY = speedY;
    this.angle = Math.random() * (2 * Math.PI);
    this.hue = hue;
    this.saturation = saturation;
    this.elapsedTime = 0;
  }

  update() {
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const rx = 450;
    const ry = 150;
    const speed = 0.001 + Math.sqrt(this.speedX ** 2 + this.speedY ** 2) * 0.001;

    this.x = cx + rx * Math.cos(this.angle);
    this.y = cy + ry * Math.sin(this.angle * 2);

    this.angle += speed;
    this.angle = this.angle % (2 * Math.PI);
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

let particles = [];
let redParticles = [];
const particleLimit = 200;
const redParticleLimit = 20;
const sizeAnimationDuration = 3;
let isEnlarging = false;

function createParticles() {
  const particleCount = 100;

  const speeds = [];
  for (let i = 0; i < particleCount; i++) {
    const speed = Math.random() * 2 + 0.01;
    speeds.push(speed);
  }

  const minSpeed = Math.min(...speeds);
  const maxSpeed = Math.max(...speeds);

  for (let i = 0; i < particleCount; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const size = Math.random() * 15 + 5;
    const speedX = speeds[i] * (1 * (speeds[i] === minSpeed) - 0.01);
    const speedY = speeds[i] * (1 * (speeds[i] === minSpeed) - 0.5);
    const hue = 240 - Math.floor(120 * (speeds[i] - minSpeed) / (maxSpeed - minSpeed));
    const saturation = 100;
    const lightness = Math.floor(50 - 20 * (speeds[i] - minSpeed) / (maxSpeed - minSpeed));
    const color = `hsla(${hue}, ${saturation}%, ${lightness}%, 1)`;

    particles.push(new Particle(x, y, size, color, speedX, speedY, hue, saturation));
  }
}

function createRedParticle(x, y) {
  const size = Math.random() * 2 + 10;
  const color = 'rgb(139,0,0)';
  const speedX = Math.random() * 1 - 0.01;
  const speedY = Math.random() * 1 - 0.01;

  redParticles.push(new Particle(x, y, size, color, speedX, speedY, null, null));

  if (redParticles.length >= redParticleLimit && !isEnlarging) {
    isEnlarging = true;
    enlargeParticlesSize();
  }
}

function checkCollision(particle) {
  for (let i = 0; i < redParticles.length; i++) {
    const redParticle = redParticles[i];
    const dx = particle.x - redParticle.x;
    const dy = particle.y - redParticle.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance <= particle.size + redParticle.size && redParticle.size > 20) {
      redParticle.color = 'rgb(139,0,0)';
      particle.color = 'rgb(139,0,0)';
    }
  }
}

async function enlargeParticlesSize() {
  const allParticles = [...particles, ...redParticles];
  await Promise.all(allParticles.map(particle => particle.enlargeSize(700, sizeAnimationDuration)));

  restartParticles();
}

function restartParticles() {
  particles = particles.filter(particle => particle.color !== 'rgb(139,0,0)');
  redParticles = [];
  isEnlarging = false;
  createParticles();
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < particles.length; i++) {
    const particle = particles[i];
    particle.update();
    particle.draw();
    checkCollision(particle);
  }

  for (let i = 0; i < redParticles.length; i++) {
    const redParticle = redParticles[i];
    redParticle.update();
    redParticle.draw();
  }

  if (particles.length < particleLimit) {
    createParticles();
  }

  requestAnimationFrame(animate);
}

canvas.addEventListener('click', (event) => {
  const x = event.clientX;
  const y = event.clientY;

  createRedParticle(x, y);
});

createParticles();
animate();