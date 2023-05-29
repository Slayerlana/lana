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

  enlargeSize(targetSize, duration) {
    const initialSize = this.size;
    const sizeIncrement = (targetSize - initialSize) / (duration * 60); 
    const initialLightness = parseInt(this.color.slice(-3, -1));
    const lightnessDecrement = initialLightness / (duration * 60); 

    let currentSize = initialSize;
    let currentLightness = initialLightness;
    let elapsedTime = 0;

    return new Promise((resolve) => {
      const sizeAnimation = setInterval(() => {
        currentSize += sizeIncrement;
        currentLightness -= lightnessDecrement;
        this.size = currentSize;
        this.color = this.color.replace(/(\d{1,3})%/, `${currentLightness}%`);
        elapsedTime += 1000 / 60; 

        if (elapsedTime >= duration * 1000) {
          clearInterval(sizeAnimation);
          resolve();
        }
      }, 1000 / 60); 
    });
  }
}

let particles = [];
let redParticles = [];
const particleLimit = 300;
const redParticleLimit = 10;
const sizeAnimationDuration = 3; 
let isEnlarging = false;

function createParticles() {
  const particleCount = 100;
  const size = 10;

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
    const speedX = speeds[i] * (2 * (speeds[i] === minSpeed) - 1); 
    const speedY = speeds[i] * (2 * (speeds[i] === minSpeed) - 1);
    const hue = 240 - Math.floor(120 * (speeds[i] - minSpeed) / (maxSpeed - minSpeed)); 
    const saturation = 100; 
    const lightness = Math.floor(50 - 20 * (speeds[i] - minSpeed) / (maxSpeed - minSpeed)); 

    const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

    particles.push(new Particle(x, y, size, color, speedX, speedY));
  }
}



function createRedParticle(x, y) {
  const size = 10;
  const color = 'rgb(139,0,0)';
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
      redParticle.color = 'rgb(139,0,0)';
    }
  }
}

async function enlargeParticlesSize() {
  const allParticles = [...particles, ...redParticles];
  await Promise.all(allParticles.map(particle => particle.enlargeSize(700, sizeAnimationDuration)));

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
