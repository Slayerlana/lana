// CONSTANT VARIABLES
const RED_COLOR = 'hsla(0,100%,38%,1)';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let startMovingCircle = false;

class Particle {
  constructor(x, y, size, speedX, speedY, hue, saturation, lightness, isCollpased = false) {
    this.transparency = 0;

    this.x = x;
    this.y = y;
    this.size = size;
    this.speedX = speedX;
    this.speedY = speedY;
    this.originalSpeedX = speedX;
    this.originalSpeedY = speedY;
    this.angle = Math.random() * (2 * Math.PI);
    this.hue = hue;
    this.saturation = saturation;
    this.elapsedTime = 0;
    this.colorTimer = 0;
    this.lifeTime = 0;
    this.isFormingCircle = false;
    this.circleRadius = 200;
    this.circleSpeed = 0.01;
    this.circleAngle = 0;
    this.lightness = lightness;

    this.originHue = hue;
    this.originSaturation = saturation;
    this.originLightness = lightness;

    this.isCollpased = isCollpased;

    this.transitionProgress = 0;
    this.transitionDirection = 1; // Initialize transition direction
    this.transitionProgress += 0.001 * this.transitionDirection;
  }

  smoothChangeColor() {
    if (this.isCollpased) return;
  
    let min = 20;
    const max = 38;
  
    const updateColor = () => {
      if (min >= max) return;
  
      min += 2;
      this.hue = 0;
      this.saturation = 100;
      this.lightness = min;
  
      setTimeout(updateColor, 500);
    };
  
    updateColor();
  
    this.isCollpased = true;
  }
  
  update() {
    if (this.transparency < 1) {
      this.transparency += 0.01;
    }

    if (startMovingCircle) {
      if (this.transitionProgress < 1) {
        this.transitionProgress += 0.01;
      }
      this.moveInEightWithTransition();
      this.currentTrack = "circle";
    } else {
      this.moveInEight();
      this.currentTrack = "eight"
    } 
    
    if (this.isCollpased) {
      this.elapsedTime += 1 / 60;
      this.lifeTime += 1 / 60;
    
      if (this.lifeTime >= redParticleLifetime) {
        const redIndex = particles.indexOf(this);
        particles.splice(redIndex, 1);
      }

      if (this.elapsedTime >= 100) {
        const hue = this.hue;
        const saturation = this.saturation;
        const lightness = this.lightness;
        this.targetColor = `hsla(${hue}, ${saturation}%, ${lightness}%, ${this.transparency})`;
        this.colorTimer += 1 / 60;
        this.isCollpased = false;
        this.hue = this.originHue;
        this.saturation = this.originSaturation;
        this.lightness = this.originLightness;

        if (this.colorTimer >= 5) {
          this.color = this.targetColor;
        }
      }
    }
  }

  moveInEight() {
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const rx = 450;
    const ry = 150;
    const speed = 0.001 + Math.sqrt(this.speedX ** 2 + this.speedY ** 2) * 0.002;

    this.x = cx + rx * Math.cos(this.angle);
    this.y = cy + ry * Math.sin(this.angle * 2);

    this.angle += speed;
    this.angle = this.angle % (2 * Math.PI);
  }

  moveInEightWithTransition() {
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const rx = 450;
    const ry = 150;
    const speed = 0.001 + Math.sqrt(this.speedX ** 2 + this.speedY ** 2) * 0.002;
  
    const transitionOffset = Math.PI / 2;
  
    if (this.transitionProgress < 0.5) {
      // Fade out moveInEight
      const transitionFactor = this.transitionProgress * 2;
      this.angle += speed;
      this.angle = this.angle % (2 * Math.PI);
      const fadeOutAngle = this.angle + transitionFactor * Math.PI + transitionOffset;
      this.x = cx + rx * Math.cos(fadeOutAngle);
      this.y = cy + ry * Math.sin(fadeOutAngle * 2);
    } else {
      // Fade in moveInCircle
      const transitionFactor = (this.transitionProgress - 0.5) * 2;
      const fadeInAngle = this.angle + Math.PI + transitionFactor * Math.PI + transitionOffset;
      const radius = 200;
      const speed = 0.01;
  
      this.x = cx + radius * Math.cos(fadeInAngle);
      this.y = cy + radius * Math.sin(fadeInAngle);
      this.angle += speed;

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
    ctx.fillStyle = `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${this.transparency})`;
    ctx.fill();
  }
}

let particles = [];
let currentTrack = "eight";
const particleLimit = 300;
let redParticles = [];
const redParticleLimit = 15;
const sizeAnimationDuration = 3;
const redParticleLifetime = Math.random() * 2 + 5;

if (this.colorTimer >= 5) {
        this.color = this.targetColor;

        if (this.lifeTime >= redParticleLifetime) {
          const redIndex = redParticles.indexOf(this);
          redParticles.splice(redIndex, 1);
        }
      }

const filterRedParticles = () => {
  return particles.filter((p) => p.isCollpased);
}

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

    particles.push(new Particle(x, y, size, speedX, speedY, hue, saturation, lightness));
  }
}

function createLightParticles() {
  const particleCount = Math.floor(Math.random() * 4) + 1;

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

    particles.push(new Particle(x, y, size, speedX, speedY, hue, saturation, lightness));
  }
}

function createRedParticle(x, y) {
  const size = Math.random() * 20 + 10;
  const speedX = Math.random() * 1 - 0.01;
  const speedY = Math.random() * 1 - 0.01;

  const newParticle = new Particle(x, y, size, speedX, speedY, 0, 100, 38, true);
  particles.push(newParticle);
  redParticles.push(newParticle);
}

function removeRedParticle(particle) {
  const index = particles.findIndex(p => p === particle);
  if (index !== -1) {
    particles.splice(index, 1);
    if (particle.isCollpased) {
      redParticles.length -= 1;
      startMovingCircle = redParticles.length >= redParticleLimit;
    }
  }
}

function findAndRestoreRedParticles() {
  for (let i = 0; i < particles.length; i++) {
    const particle = particles[i];
    if (particle.isCollpased) {
      // 将红色粒子的颜色恢复为正常颜色
      particle.isCollpased = false;
      particle.hue = particle.originHue;
      particle.saturation = particle.originSaturation;
      particle.lightness = particle.originLightness;
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < particles.length; i++) {
    const particle = particles[i];
    particle.update();
    particle.draw();
  }

  if (particles.length < particleLimit) {
    createParticles();
  }

  requestAnimationFrame(animate);
}

canvas.addEventListener('click', (event) => {
  const x = event.clientX;
  const y = event.clientY;
  clickSound();

  if(currentTrack == "eight"){
    createRedParticle(x, y);
    redParticles.length += 1;
    if(redParticles.length >= redParticleLimit){
      startMovingCircle= true;
      currentTrack = "circle";
    }
  } else if (currentTrack == "circle"){
    redParticles.length -= 1;
    const particleToRemove = particles.shift();
    createLightParticles();
    if(redParticles.length == 0){
      startMovingCircle= false;
      currentTrack = "eight";
      initialize();
    }
  } else {
    console.log("error")
  }
});


// function slowShowParticles() {
//   const interval = setInterval(() => {
//     if (particles[0].transparency >= 1) {
//       clearInterval(interval);
//       initialize();
//       return;
//     }

//     for (let i = 0; i < particles.length; i++) {
//       particles[i].transparency += 0.01;
//     }
//   }, 100);
// }

function initialize() {
  // 进行程序的初始化操作
  particles = [];
  redParticles = [];
  startMovingCircle = false;

  createParticles();
  slowShowParticles();
}

