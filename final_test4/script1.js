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
    this.targetColor = color;
    this.originalColor = color; // 保存初始颜色
    this.colorTimer = 0;
    this.lifeTime = 0;
    this.status = 'stable';
    this.isMaxSize = false;
    this.isResetting = false;
  }

  update() {
    if (redParticles.length >= redParticleLimit) {
      this.moveInCircle();
    } else {
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const rx = 450;
      const ry = 150;
      const speed = 0.001 + Math.sqrt(this.speedX ** 2 + this.speedY ** 2) * 0.001;

      this.x = cx + rx * Math.cos(this.angle);
      this.y = cy + ry * Math.sin(this.angle * 2);

      this.angle += speed;
      this.angle = this.angle % (2 * Math.PI);

      if (redParticles.length >= redParticleLimit && this.status === 'stable') {
        this.moveInCircle();
        this.status = 'unstable';
      } else if (this.status === 'unstable' && redParticles.length < 5) {
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const rx = 450;
        const ry = 150;
        const speed = 0.001 + Math.sqrt(this.speedX ** 2 + this.speedY ** 2) * 0.001;

        this.x = cx + rx * Math.cos(this.angle);
        this.y = cy + ry * Math.sin(this.angle * 2);

        this.angle += speed;
        this.angle = this.angle % (2 * Math.PI);

        this.status = 'stable';
      } else if (redParticles.length < redParticleLimit && this.status === 'stable') {
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const rx = 450;
        const ry = 150;
        const speed = 0.001 + Math.sqrt(this.speedX ** 2 + this.speedY ** 2) * 0.001;

        this.x = cx + rx * Math.cos(this.angle);
        this.y = cy + ry * Math.sin(this.angle * 2);

        this.angle += speed;
        this.angle = this.angle % (2 * Math.PI);

        this.status = 'stable';
      }
    }

    if (this.color === 'rgb(139,0,0)') {
      this.elapsedTime += 1 / 60;

      if (this.elapsedTime >= 5) {
        const hue = this.hue;
        const saturation = this.saturation;
        const lightness = this.lightness;
        this.targetColor = `hsla(${hue}, ${saturation}%, ${lightness}%, 1)`;
        this.colorTimer += 1 / 60;

        if (this.colorTimer >= 5) {
          this.color = this.targetColor;

          if (this.lifeTime >= 3) {
            const redIndex = redParticles.indexOf(this);
            redParticles.splice(redIndex, 1);
          }
        }
      }
    }
  }

  moveInCircle() {
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const radius = 200;
    const speed = 0.01;

    this.x = cx + radius * Math.cos(this.angle);
    this.y = cy + radius * Math.sin(this.angle);
    this.angle += speed;
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

  resetColor() {
    this.color = this.originalColor; // 恢复为初始颜色
    this.elapsedTime = 0; // 重置计时器
  }
}

let particles = [];
let redParticles = [];
const particleLimit = 200;
const redParticleLimit = 20;
const sizeAnimationDuration = 3;
let isEnlarging = false;
let maxSizeParticle = null;

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
  const size = Math.random() * 20 + 10;
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

    if (distance <= particle.size + redParticle.size && redParticle.size > 15) {
      redParticle.color = 'rgb(139,0,0)';
      particle.color = 'rgb(139,0,0)';
      if (!maxSizeParticle || particle.size > maxSizeParticle.size) {
        if (maxSizeParticle) {
          maxSizeParticle.isMaxSize = false;
        }
        maxSizeParticle = particle;
      }
    }
  }
}

async function enlargeParticlesSize() {
  const allParticles = [...particles, ...redParticles];
  await Promise.all(allParticles.map((particle) => particle.enlargeSize(particle.size + 20, sizeAnimationDuration)));

  restartParticles();
}

function restartParticles() {
  for (let i = 0; i < particles.length; i++) {
    particles[i].resetColor(); // 重置粒子的颜色
  }
  particles = particles.filter((particle) => particle.color !== 'rgb(139,0,0)');
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

  if (maxSizeParticle) {
    maxSizeParticle.isMaxSize = false;
    maxSizeParticle.enlargeSize(maxSizeParticle.size + 20, sizeAnimationDuration).then(() => {
      createRedParticle(x, y);
    });
    maxSizeParticle = null;
  } else {
    createRedParticle(x, y);
  }
});

createParticles();
animate();