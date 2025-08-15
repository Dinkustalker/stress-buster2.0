const canvas = document.getElementById('emojiCanvas');
if (!canvas) {
    console.warn('emojiCanvas not found');
} else {
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

const emojis = ["😂", "✨", "💖", "🌸", "🎈", "🌈"];
let particles = [];

class FallingEmoji {
    constructor(x, y, emoji, speed) {
        this.x = x;
        this.y = y;
        this.emoji = emoji;
        this.speed = speed;
    }
    draw() {
        ctx.font = "24px Arial";
        ctx.fillText(this.emoji, this.x, this.y);
    }
    update() {
        this.y += this.speed;
        if (this.y > canvas.height) {
            this.y = 0;
            this.x = Math.random() * canvas.width;
        }
        this.draw();
    }
}

function init() {
    particles = [];
    for (let i = 0; i < 50; i++) {
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        let emoji = emojis[Math.floor(Math.random() * emojis.length)];
        let speed = 1 + Math.random() * 2;
        particles.push(new FallingEmoji(x, y, emoji, speed));
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => p.update());
    requestAnimationFrame(animate);
}

    init();
    animate();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        init();
    });
}
