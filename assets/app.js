/* Mobile nav toggle */
const navToggle = document.querySelector('.nav-toggle');
const header = document.querySelector('.site-header');
if (navToggle) {
	navToggle.addEventListener('click', () => {
		header.classList.toggle('open');
	});
}

/* Year in footer */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* Image loading with fade-in (optional enhancement) */
const images = document.querySelectorAll('img:not(.hero__video)');
images.forEach(img => {
	if (img.complete && img.naturalHeight !== 0) {
		img.classList.add('loaded');
	} else {
		img.classList.add('loading');
		img.addEventListener('load', () => {
			img.classList.remove('loading');
			img.classList.add('loaded');
		}, { once: true });
		img.addEventListener('error', () => {
			img.classList.remove('loading');
			img.classList.add('loaded'); // Show even if error
		}, { once: true });
	}
});

/* Reveal-on-scroll */
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
	entries.forEach(e => {
		if (e.isIntersecting) {
			e.target.classList.add('in');
			io.unobserve(e.target);
		}
	});
}, { threshold: 0.12 });
revealEls.forEach(el => io.observe(el));

/* Light parallax for elements with .parallax */
const parallaxEls = [...document.querySelectorAll('.parallax')];
if (parallaxEls.length) {
	let lastY = window.scrollY;
	const onScroll = () => {
		const y = window.scrollY;
		const dy = y - lastY;
		lastY = y;
		parallaxEls.forEach(el => {
			const speed = 0.15;
			const rect = el.getBoundingClientRect();
			if (rect.top < window.innerHeight && rect.bottom > 0) {
				const offset = (y + rect.top) * speed;
				el.style.transform = `translateY(${offset * -0.02}px)`;
			}
		});
	};
	window.addEventListener('scroll', onScroll, { passive: true });
	onScroll();
}

/* Calligraphy-like overlay canvas for hero */
const overlay = document.getElementById('calligraphyOverlay');
if (overlay) {
	const ctx = overlay.getContext('2d');
	let w, h, id;
	const strokes = [];
	function resize() {
		w = overlay.width = overlay.offsetWidth;
		h = overlay.height = overlay.offsetHeight;
		strokes.length = 0;
		for (let i = 0; i < 70; i++) {
			strokes.push({
				x: Math.random() * w,
				y: Math.random() * h,
				l: 40 + Math.random() * 240,
				a: Math.random() * Math.PI * 2,
				w: 0.4 + Math.random() * 1.6,
				opacity: 0.06 + Math.random() * 0.2,
				speed: 0.2 + Math.random() * 0.6
			});
		}
	}
	function draw() {
		ctx.clearRect(0, 0, w, h);
		for (const s of strokes) {
			const x2 = s.x + Math.cos(s.a) * s.l;
			const y2 = s.y + Math.sin(s.a) * s.l;
			const grad = ctx.createLinearGradient(s.x, s.y, x2, y2);
			grad.addColorStop(0, `rgba(36,225,213,${0})`);
			grad.addColorStop(0.15, `rgba(36,225,213,${s.opacity * 0.5})`);
			grad.addColorStop(0.85, `rgba(36,225,213,${s.opacity})`);
			grad.addColorStop(1, `rgba(36,225,213,${0})`);
			ctx.strokeStyle = grad;
			ctx.lineWidth = s.w;
			ctx.beginPath();
			ctx.moveTo(s.x, s.y);
			ctx.lineTo(x2, y2);
			ctx.stroke();
			// drift
			s.a += (Math.sin((s.x + s.y) * 0.0006) - 0.5) * 0.02;
			s.x += Math.cos(s.a) * s.speed * 0.4;
			s.y += Math.sin(s.a) * s.speed * 0.4;
			if (s.x < -50 || s.y < -50 || s.x > w + 50 || s.y > h + 50) {
				s.x = (s.x + w) % w;
				s.y = (s.y + h) % h;
			}
		}
		id = requestAnimationFrame(draw);
	}
	const ro = new ResizeObserver(resize);
	ro.observe(overlay);
	resize();
	draw();
}

/* Simple gallery filter (for portfolio page) */
const filterBar = document.querySelector('[data-filter-bar]');
if (filterBar) {
	const items = document.querySelectorAll('[data-filter-item]');
	filterBar.addEventListener('click', e => {
		const btn = e.target.closest('[data-filter]');
		if (!btn) return;
		const tag = btn.getAttribute('data-filter');
		document.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
		btn.classList.add('active');
		items.forEach(it => {
			const tags = (it.getAttribute('data-tags') || '').split(',');
			it.classList.toggle('hidden', tag !== 'all' && !tags.includes(tag));
		});
	});
}

/* Basic fake form submit */
const form = document.querySelector('form[data-booking]');
if (form) {
	form.addEventListener('submit', (e) => {
		e.preventDefault();
		const btn = form.querySelector('button[type="submit"]');
		const old = btn.textContent;
		btn.disabled = true;
		btn.textContent = 'Отправляем...';
		setTimeout(() => {
			btn.disabled = false;
			btn.textContent = old;
			alert('Спасибо! Мы свяжемся с вами в ближайшее время.');
			form.reset();
		}, 900);
	});
}


