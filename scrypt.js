// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add active class to navigation links on scroll
window.addEventListener('scroll', () => {
    let current = '';
    document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 60) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.navbar a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Yes/No button handlers (safe: only runs if elements exist)
document.addEventListener('DOMContentLoaded', () => {
    const yes = document.getElementById('yes-btn');
    const no = document.getElementById('no-btn');
    const stopBtn = document.getElementById('stop-btn');
    let petalTimeouts = [];

    // Prevent repeated rains: guard flag
    let isRaining = false;

    function stopPetals() {
        const container = document.querySelector('.petal-container');
        if (container) container.innerHTML = '';
        // clear any scheduled removals
        petalTimeouts.forEach(id => clearTimeout(id));
        petalTimeouts = [];
        isRaining = false;
        if (yes) yes.disabled = false;
        if (stopBtn) stopBtn.style.display = 'none';
    }

    if (stopBtn) {
        stopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            stopPetals();
        });
    }

    if (yes) {
        yes.addEventListener('click', () => {
            if (isRaining) return;
            isRaining = true;
            yes.classList.add('clicked');
            yes.disabled = true;

            // swap gif to a celebratory gif (place your file as 'valentines-yes.gif')
            const gif = document.getElementById('val-gif');
            if (gif) {
                gif.src = 'tkthao219-bubududu.gif';
            }

            // create falling petals
            const container = document.querySelector('.petal-container');
            if (!container) {
                alert('She said YES! ❤️');
                isRaining = false;
                yes.disabled = false;
                return;
            }

            // clear any existing petals and timeouts
            stopPetals();
            if (stopBtn) stopBtn.style.display = 'inline-block';

            const petalChars = ['🌸','🌺','🌷','💮'];
            const count = 30;
            let maxEnd = 0;

            for (let i = 0; i < count; i++) {
                const span = document.createElement('span');
                span.className = 'petal';
                span.textContent = petalChars[Math.floor(Math.random()*petalChars.length)];

                const left = Math.random() * 100; // percent
                const size = 14 + Math.random()*30; // px
                const duration = 4 + Math.random()*4; // seconds
                const delay = Math.random()*1.5; // seconds

                span.style.left = left + '%';
                span.style.fontSize = size + 'px';
                span.style.animationDuration = duration + 's';
                span.style.animationDelay = delay + 's';

                container.appendChild(span);

                const end = (delay + duration + 0.5) * 1000;
                if (end > maxEnd) maxEnd = end;

                // remove after animation and track timeout id for clearing
                const to = setTimeout(() => {
                    span.remove();
                }, end);
                petalTimeouts.push(to);
            }

            // stop raining after the longest petal finishes
            const endTo = setTimeout(() => {
                isRaining = false;
                yes.disabled = false;
                if (stopBtn) stopBtn.style.display = 'none';
                petalTimeouts = [];
            }, maxEnd + 250);
            petalTimeouts.push(endTo);
        });
    }

    if (no) {
        const moveNo = () => {
            const container = document.querySelector('.btns');
            if (!container) return;
            const cRect = container.getBoundingClientRect();
            const bRect = no.getBoundingClientRect();
            const yes = document.getElementById('yes-btn');
            const yesRect = yes ? yes.getBoundingClientRect() : null;

            const maxLeft = Math.max(0, cRect.width - bRect.width - 8);
            const maxTop = Math.max(0, cRect.height - bRect.height - 8);

            // Try several times to find a position that doesn't overlap the Yes button
            let left = 0, top = 0;
            const attempts = 100;
            for (let i = 0; i < attempts; i++) {
                left = Math.random() * maxLeft;
                top = Math.random() * maxTop;

                if (!yesRect) break; // no yes button found, accept

                const noLeftAbs = cRect.left + left;
                const noTopAbs = cRect.top + top;
                const noRightAbs = noLeftAbs + bRect.width;
                const noBottomAbs = noTopAbs + bRect.height;

                const overlap = !(noRightAbs < yesRect.left || noLeftAbs > yesRect.right || noBottomAbs < yesRect.top || noTopAbs > yesRect.bottom);
                if (!overlap) break; // found non-overlapping position
            }

            no.style.position = 'absolute';
            no.style.left = `${left}px`;
            no.style.top = `${top}px`;
            no.style.transform = 'none';
        };

        no.addEventListener('click', (e) => {
            e.preventDefault();
            moveNo();
        });
    }
});
