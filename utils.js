function randomNum(lower, upper) {
    let num = lower + Math.random()*(upper-lower);
    return num;
  }

function makeCircle(x, y, radius) {
    let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y);
    circle.setAttribute("r", radius);
    circle.setAttribute("fill", "white");
    return circle;
  }
  