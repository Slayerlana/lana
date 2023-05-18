class Particle {
    constructor(xPos, yPos, radius) {
      this.x = xPos;
      this.y = yPos;
      this.r = radius;
      this.svgElement;
      this.animDuration = randomNum(3, 5);
      this.targetX = randomNum(0, width);
      this.targetY = height + this.r; 
      this.color = `rgb(${randomNum(0, 255)}, ${randomNum(0, 255)}, ${randomNum(0, 255)})`;
    }
  
    drawParticle() {
      this.svgElement = makeCircle(this.x, this.y, this.r, this.color);
      svg.appendChild(this.svgElement);
      this.addAnimateX();
      this.addAnimateY();
    }
  
    addAnimateX() {
      let animElement = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
      animElement.setAttribute('attributeName', 'cx');
      animElement.setAttribute('values', `${this.x}; ${this.targetX};`);
      animElement.setAttribute('dur', `${this.animDuration}`);
      animElement.setAttribute('repeatCount', 'indefinite');
      this.svgElement.appendChild(animElement);
    }
  
    addAnimateY() {
      let animElement = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
      animElement.setAttribute('attributeName', 'cy');
      animElement.setAttribute('values', `${this.y}; ${this.targetY};`);
      animElement.setAttribute('dur', `${this.animDuration}`);
      animElement.setAttribute('repeatCount', 'indefinite');
      this.svgElement.appendChild(animElement);
    }
  }
  
  function createParticlesArray(num) {
    let particleInstances = [];
  
    for (let i = 0; i < num; i++) {
      let particleX = width / 2;
      let particleY = height / 2;
      let particleSize = randomNum(width * 0.001, width * 0.005);
      particleInstances.push(new Particle(particleX, particleY, particleSize));
    }
  
    return particleInstances;
  }
  
  function makeCircle(x, y, r, color) {
    let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y);
    circle.setAttribute("r", r);
    circle.setAttribute("fill", color); 
    return circle;
  }
  
  let width, height;
  const svg = document.getElementById("base-svg");
  
  function setDimensions() {
    width = window.innerWidth;
    height = window.innerHeight;
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  }
  
  function resizeSvg() {
    setDimensions();
    for (let particle of particles) {
      particle.targetX = randomNum(0, width);
      particle.targetY = height + particle.r;
    }
  }
  
  let particles;
  
  function update() {
    for (let particle of particles) {
      particle.updatePosition();
      particle.svgElement.setAttribute("cy", particle.y);
    }
  
    requestAnimationFrame(update);
  }
  
  window.addEventListener("resize", resizeSvg);
  setDimensions();
  particles = createParticlesArray(50);
  requestAnimationFrame(update);
  
  for (let particle of particles) {
    particle.drawParticle();
  }
  