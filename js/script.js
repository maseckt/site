document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.createElement('canvas');
    canvas.className = 'background-canvas';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    const blackScreen = document.querySelector(".black-screen");
    const musicIcon = document.querySelector(".music-icon");
    const audio = new Audio("music/Durnojj_Vkus-Plastinki.mp3");

    let particleCount = window.innerWidth < 768 ? 100 : 150;
    let particles = [];
    let currentColor = '#4B6F91';
    const cards = document.querySelectorAll('.card');

    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        particles.forEach(p => {
            p.x = Math.min(p.x, canvas.width);
            p.y = Math.min(p.y, canvas.height);
        });
    };

    const createParticle = () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 5 + 1,
        speedX: (Math.random() - 0.5) * 2,
        speedY: (Math.random() - 0.5) * 2,
        alpha: Math.random() * 0.5 + 0.5,
    });

    const updateParticles = () => {
        particles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;
            p.alpha -= 0.01;
            if (p.alpha <= 0) p.alpha = 0;
        });

        particles = particles.filter(p => p.alpha > 0);
        while (particles.length < particleCount) particles.push(createParticle());
    };

    const drawParticles = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            ctx.globalAlpha = p.alpha;
            const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
            gradient.addColorStop(0, currentColor);
            gradient.addColorStop(1, 'rgba(75, 110, 145, 0)');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.globalAlpha = 1;
    };

    const fadeInMusic = () => {
        audio.volume = 0;
        audio.play().catch(error => console.error("Ошибка воспроизведения трека:", error));
        
        const fadeInterval = setInterval(() => {
            if (audio.volume < 0.1) {
                audio.volume += 0.01;
            } else {
                clearInterval(fadeInterval);
            }
        }, 50);
    };

    const showCards = () => {
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('visible');
            }, index * 150);
        });
    };

    blackScreen.addEventListener("click", () => {
        blackScreen.style.opacity = '0';
        fadeInMusic();
        showCards();
        setTimeout(() => {
            blackScreen.classList.add("hidden");
        }, 1000);
        
        musicIcon.classList.remove("hidden");
    });

    audio.loop = true;
    audio.volume = 0.1;

    musicIcon.addEventListener("click", () => {
        if (audio.paused) {
            fadeInMusic();
            musicIcon.classList.add("playing");
        } else {
            audio.pause();
            musicIcon.classList.remove("playing");
        }
    });

    window.addEventListener('resize', () => {
        particleCount = window.innerWidth < 768 ? 100 : 150;
        resizeCanvas();
    });
    
    resizeCanvas();
    animate();

    function animate() {
        updateParticles();
        drawParticles();
        requestAnimationFrame(animate);
    }
});
