// CONSTANT VARIABLES
const RED_COLOR = 'hsla(0,100%,38%,1)';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let startMovingCircle = false;

let particles = []; // store Particle objects
let currentTrack = "eight";
const particleLimit = 300; 
const redParticles = []; // store red Particle objects
const redParticleLimit = 50;

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
    this.transitionProgress = 0; // Initialize transition progress
    this.transitionDirection = 1; // Initialize transition direction
    this.transitionProgress += 0.001 * this.transitionDirection;
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
  }

  // Linear interpolation function
  lerp(start, end, t) {
    return start * (1 - t) + end * t;
  }

  // Function to smoothly change color of the particle
  smoothChangeColor() {
    if (this.isCollpased) return;

    let min = 20;
    const max = 21;
    setInterval(() => {
      if (min >= max) {
        return;
      };
      
      min += 2;
      this.hue = 0;
      this.saturation = 100;
      this.lightness = min;
    }, 500)
    this.isCollpased = true;
  }

  // Update particle properties
  update() {
    if (this.transparency < 1) {
      this.transparency += 0.01;
    }

    if (startMovingCircle) {
      if (this.transitionProgress < 1) {
        this.transitionProgress += 0.01;
        this.moveInEightWithTransition();
      } else {
        this.moveInCircle();
      }
      this.currentTrack = "circle";
    } else {
      this.moveInEight();
      this.currentTrack = "eight";
    }

    // refernce ChatGPT
    if (this.isCollpased) {
      this.elapsedTime += 1 / 60;

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
          if (this.lifeTime >= 3) {
            this.isCollpased = false;
            this.hue = this.originHue;
            this.saturation = this.originSaturation;
            this.lightness = this.originLightness;
            console.log('fixOne', redParticles.length)
          }
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

    const eightX = cx + rx * Math.cos(this.angle);
    const eightY = cy + ry * Math.sin(this.angle * 2);
 
    // Calculate position in circle track
    const circleRadius = 200;
    const circleX = cx + circleRadius * Math.cos(this.angle);
    const circleY = cy + circleRadius * Math.sin(this.angle);
 
    // Interpolate between the two positions
    this.x = this.lerp(eightX, circleX, this.transitionProgress);
    this.y = this.lerp(eightY, circleY, this.transitionProgress);
 
    this.angle += speed;
    this.angle = this.angle % (2 * Math.PI);

      // Reverse transition direction when progress reaches 0 or 1
      if (this.transitionProgress <= 0 || this.transitionProgress >= 1) {
        this.transitionDirection *= -1;
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

    // Draw the particle on the canvas
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${this.transparency})`;
    ctx.fill();
  }
}

function createParticles() {
  const particleCount = 100;

  const speeds = [];
  for (let i = 0; i < particleCount; i++) {
    const speed = Math.random() * 2 + 0.01;
    speeds.push(speed);
  }
  // refernce ChatGPT
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
  // refernce ChatGPT
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

}

  // refernce ChatGPT
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

    // refernce ChatGPT
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

function slowShowParticles() {
  const interval = setInterval(() => {
    if (particles[0].transparency >= 1) {
      clearInterval(interval);
      initialize();
      return;
    }

    for (let i = 0; i < particles.length; i++) {
      particles[i].transparency += 0.01;
    }
  }, 100);
}

// reset
function initialize() {
  particles = [];
  redParticles = [];
  startMovingCircle = false;

  createParticles();
  slowShowParticles();
}
