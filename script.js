// ================================
// SCROLL REVEAL
// ================================
function initReveal() {
  const reveals = document.querySelectorAll(".section, .game-card, .skill-group, .contact-link, .about-grid > *");
  reveals.forEach(el => el.classList.add("reveal"));

  function check() {
    reveals.forEach(el => {
      const top = el.getBoundingClientRect().top;
      if (top < window.innerHeight - 80) {
        el.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", check, { passive: true });
  check();
}

initReveal();

// ================================
// STARFIELD CANVAS
// ================================
const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");

const DPR = window.devicePixelRatio || 1;
let W, H;

function resize() {
  W = window.innerWidth;
  H = window.innerHeight;
  canvas.width = W * DPR;
  canvas.height = H * DPR;
  canvas.style.width = W + "px";
  canvas.style.height = H + "px";
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
}

resize();
window.addEventListener("resize", () => { resize(); initStars(); });

// Two layers: deep stars (slow, small) + near stars (fast, larger)
let stars = [];

function initStars() {
  stars = [];
  // Deep background stars
  for (let i = 0; i < 180; i++) {
    stars.push({
      x: Math.random() * W,
      y: Math.random() * H,
      size: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 0.2 + 0.05,
      opacity: Math.random() * 0.5 + 0.1,
      layer: 0
    });
  }
  // Nearer stars
  for (let i = 0; i < 60; i++) {
    stars.push({
      x: Math.random() * W,
      y: Math.random() * H,
      size: Math.random() * 1.5 + 0.8,
      speed: Math.random() * 0.5 + 0.3,
      opacity: Math.random() * 0.6 + 0.3,
      layer: 1
    });
  }
}

initStars();

// Occasional shooting star
let shootingStars = [];

function spawnShootingStar() {
  if (Math.random() > 0.015) return;
  shootingStars.push({
    x: Math.random() * W,
    y: Math.random() * H * 0.5,
    length: Math.random() * 120 + 60,
    speed: Math.random() * 6 + 4,
    angle: Math.PI / 4 + (Math.random() - 0.5) * 0.4,
    opacity: 1,
    life: 1
  });
}

function animate() {
  ctx.clearRect(0, 0, W, H);

  spawnShootingStar();

  // Draw stars
  stars.forEach(s => {
    s.y += s.speed;
    if (s.y > H) {
      s.y = -2;
      s.x = Math.random() * W;
    }
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
    ctx.fillStyle = s.layer === 1
      ? `rgba(200,220,255,${s.opacity})`
      : `rgba(180,190,220,${s.opacity})`;
    ctx.fill();
  });

  // Draw shooting stars
  shootingStars = shootingStars.filter(ss => ss.life > 0);
  shootingStars.forEach(ss => {
    ss.x += Math.cos(ss.angle) * ss.speed;
    ss.y += Math.sin(ss.angle) * ss.speed;
    ss.life -= 0.025;

    const tail = {
      x: ss.x - Math.cos(ss.angle) * ss.length,
      y: ss.y - Math.sin(ss.angle) * ss.length
    };

    const grad = ctx.createLinearGradient(tail.x, tail.y, ss.x, ss.y);
    grad.addColorStop(0, `rgba(0,255,194,0)`);
    grad.addColorStop(1, `rgba(0,255,194,${ss.life * 0.9})`);

    ctx.beginPath();
    ctx.moveTo(tail.x, tail.y);
    ctx.lineTo(ss.x, ss.y);
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  });

  requestAnimationFrame(animate);
}

animate();
