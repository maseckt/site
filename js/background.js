document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.createElement('canvas');
    canvas.className = 'background-canvas';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    const particleCount = 150;
    const particleColors = {
        default: '#FFFFFF',
    };

    let currentColor = particleColors.default;
    let animationFrameId;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createParticle() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 3 + 1,
            speedX: (Math.random() - 0.5) * 2,
            speedY: (Math.random() - 0.5) * 2,
            alpha: Math.random() * 0.5 + 0.5
        };
    }

    function updateParticles() {
        for (let particle of particles) {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            particle.alpha -= 0.01;
            if (particle.alpha <= 0) {
                particle.alpha = 0;
            }
        }

        particles = particles.filter(p => p.alpha > 0);
        while (particles.length < particleCount) {
            particles.push(createParticle());
        }
    }

    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = currentColor;

        for (let particle of particles) {
            ctx.globalAlpha = particle.alpha;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.globalAlpha = 1;
    }

    function animate() {
        updateParticles();
        drawParticles();
        animationFrameId = requestAnimationFrame(animate);
    }

    function init() {
        for (let i = 0; i < particleCount; i++) {
            particles.push(createParticle());
        }
        animate();
    }

    function startAnimation() {
        if (!animationFrameId) {
            init();
        }
    }

    function stopAnimation() {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
    }

    window.addEventListener('resize', resizeCanvas);
    document.addEventListener('trackChange', (event) => {
        const trackColor = event.detail.color || particleColors.default;
        currentColor = trackColor;
    });

    startAnimation();

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopAnimation();
        } else {
            startAnimation();
        }
    });
});
