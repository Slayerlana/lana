const canvas2 = document.getElementById('canvas2');
const ctx2 = canvas2.getContext('2d');
canvas2.width = window.innerWidth;
canvas2.height = window.innerHeight;

var points = [];
var live = 30;
var colors = [
  [0, 184, 148, 1.0],
  [250, 177, 160, 1.0],
  [0, 184, 148, 1.0],
  [214, 48, 49, 1.0]
];

window.addEventListener("mousemove", function(evt) {
  for (var i = 0; i < 5; i++) {
    var randomColor = colors[Math.floor(Math.random() * colors.length)];
    points.push({
      sx: evt.x,
      sy: evt.y,
      vx: 0.5 - Math.random(),
      vy: 0.5 - Math.random(),
      life: live,
      color: randomColor,
      size: Math.random() * 5
    });
  }
});

function drawPoints() {
  ctx2.clearRect(0, 0, canvas2.width, canvas2.height);

  for (var i = 0; i < points.length; i++) {
    var point = points[i];

    ctx2.beginPath();
    ctx2.arc(point.sx, point.sy, point.size, 0, Math.PI * 2);

    // Calculate alpha value based on point.life and live variables
    var alpha = point.life / live;

    // Set fillStyle with the correct RGBA value
    ctx2.fillStyle = "rgba(" + point.color[0] + ", " + point.color[1] + ", " + point.color[2] + ", " + point.color[3] * alpha + ")";

    ctx2.fill();

    point.life--;

    if (point.life <= 0) {
      points.splice(i, 1);
    }

    point.sx += point.vx * 3;
    point.sy += point.vy * 5;
  }
}

setInterval(drawPoints, 10);