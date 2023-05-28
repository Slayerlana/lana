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

  enlargeSize(targetSize, duration) {
    const initialSize = this.size;
    const sizeIncrement = (targetSize - initialSize) / (duration * 60); // Assuming 60 frames per second

    let currentSize = initialSize;
    let elapsedTime = 0;

    return new Promise((resolve) => {
      const sizeAnimation = setInterval(() => {
        currentSize += sizeIncrement;
        this.size = currentSize;
        elapsedTime += 1000 / 60; // Assuming 60 frames per second

        if (elapsedTime >= duration * 1000) {
          clearInterval(sizeAnimation);
          resolve();
        }
      }, 1000 / 60); // Assuming 60 frames per second
    });
  }
}

let particles = [];
let redParticles = [];
const particleLimit = 300;
const redParticleLimit = 10;
const sizeAnimationDuration = 5; // In seconds
let isEnlarging = false;

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

function createRedParticle(x, y) {
  const size = 10;
  const color = 'red';
  const speedX = Math.random() * 2 - 1;
  const speedY = Math.random() * 2 - 1;

  redParticles.push(new Particle(x, y, size, color, speedX, speedY));

  if (redParticles.length === redParticleLimit) {
    if (!isEnlarging) {
      isEnlarging = true;
      enlargeParticlesSize();
    } else {
      restartParticles();
    }
  }
}

function checkCollision(particle) {
  for (let i = 0; i < redParticles.length; i++) {
    const redParticle = redParticles[i];
    const dx = particle.x - redParticle.x;
    const dy = particle.y - redParticle.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance <= particle.size + redParticle.size) {
      redParticle.color = 'red';
    }
  }
}

async function enlargeParticlesSize() {
  const allParticles = [...particles, ...redParticles];
  await Promise.all(allParticles.map(particle => particle.enlargeSize(50, sizeAnimationDuration)));

  restartParticles();
}

function restartParticles() {
  particles = [];
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
