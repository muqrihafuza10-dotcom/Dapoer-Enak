/* ================================================
   script.js — Dapur Wenak Poll UMKM
   Enhancement JS: animasi, interaktif, UX polish
   Tidak mengubah struktur HTML/CSS asli
   ================================================ */

/* ── IMAGE MAP: set src from data-img attributes ── */
const imageMap = {
  'hero':       'images/Menu.png',
  'ayam-bkr':   'images/ayam bkr.png',
  'liwet':      'images/Liwet.png',
  'rendang':    'images/rendang.png',
  'es-kelapa':  'images/EsKelapa.png',
  'cendol':     'images/cendol.png',
  'es-kuwut':   'images/Es kuwut.png',
  'review-1':   'images/image copy.png',
  'review-2':   'images/image copy 2.png',
  'review-3':   'images/image copy 3.png',
  'review-4':   'images/image copy 4.png',
  'review-5':   'images/image copy 5.png',
  'review-6':   'images/image copy 6.png',
};

document.querySelectorAll('[data-img]').forEach(img => {
  const key = img.getAttribute('data-img');
  if (imageMap[key]) img.src = imageMap[key];
});

/* ── 1. NAVBAR: shrink on scroll + active link highlight ── */
const header = document.querySelector('header');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
  highlightActiveNav();
});

function highlightActiveNav() {
  const sections = document.querySelectorAll('section[id], footer[id]');
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 100) {
      current = sec.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
}

/* ── 2. HAMBURGER MENU (Mobile) ── */
const navbar = document.querySelector('.navbar');
const navLinksEl = document.querySelector('.nav-links');

// Buat tombol hamburger
const hamburger = document.createElement('button');
hamburger.className = 'hamburger';
hamburger.setAttribute('aria-label', 'Toggle menu');
hamburger.innerHTML = `<span></span><span></span><span></span>`;
navbar.insertBefore(hamburger, navLinksEl);

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinksEl.classList.toggle('mobile-open');
});

// Tutup menu saat klik link
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinksEl.classList.remove('mobile-open');
  });
});

/* ── 3. SCROLL REVEAL ANIMATIONS ── */
const revealElements = document.querySelectorAll(
  '.menu-card, .list-item, .promo-card, .review-card, .stat, .stat-box, .hero-stats'
);

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('revealed');
      }, i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealElements.forEach(el => {
  el.classList.add('reveal-hidden');
  revealObserver.observe(el);
});

/* ── 4. COUNTER ANIMATION pada hero stats ── */
function animateCounter(el, target, duration = 1800) {
  const isFloat = target % 1 !== 0;
  const start = performance.now();
  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const value = isFloat ? (ease * target).toFixed(1) : Math.floor(ease * target);
    el.textContent = isFloat ? value + '★' : value.toLocaleString('id-ID') + (el.dataset.suffix || '');
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const statNumbers = document.querySelectorAll('.stat h3');
let statsAnimated = false;

const statsObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !statsAnimated) {
    statsAnimated = true;
    statNumbers.forEach(el => {
      const text = el.textContent.trim();
      if (text.includes('5000')) { el.textContent = '0'; el.dataset.suffix = '+'; animateCounter(el, 5000); }
      else if (text.includes('4.8')) { el.textContent = '0★'; animateCounter(el, 4.8); }
      else if (text.includes('7')) { el.textContent = '7 Hari'; }
    });
  }
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

/* ── 5. TOAST NOTIFICATION saat klik "Pesan Sekarang" ── */
// Buat container toast
const toastContainer = document.createElement('div');
toastContainer.className = 'toast-container';
document.body.appendChild(toastContainer);

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i> ${message}`;
  toastContainer.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

document.querySelectorAll('.btn-order, .btn-primary[href*="wa.me"]').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const cardTitle = btn.closest('.card-body, .promo-card')?.querySelector('h3')?.textContent;
    if (cardTitle) {
      showToast(`Mengarahkan ke WhatsApp untuk "${cardTitle}"... 🍽️`);
    }
  });
});

/* ── 6. BACK-TO-TOP BUTTON ── */
const backToTop = document.createElement('button');
backToTop.className = 'back-to-top';
backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
backToTop.setAttribute('aria-label', 'Kembali ke atas');
document.body.appendChild(backToTop);

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── 7. SMOOTH HOVER TILT pada menu card ── */
document.querySelectorAll('.menu-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotateX = ((y - cy) / cy) * -5;
    const rotateY = ((x - cx) / cx) * 5;
    card.style.transform = `translateY(-10px) perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ── 8. SEARCH / FILTER Menu Satuan ── */
const satuanSection = document.querySelector('#satuan');
if (satuanSection) {
  const searchBox = document.createElement('div');
  searchBox.className = 'menu-search-wrap';
  searchBox.innerHTML = `
    <div class="menu-search">
      <i class="fas fa-search"></i>
      <input type="text" id="menuSearch" placeholder="Cari menu satuan..." autocomplete="off">
    </div>
  `;
  const menuList = satuanSection.querySelector('.menu-list');
  satuanSection.querySelector('.section-title').after(searchBox);

  const searchInput = document.getElementById('menuSearch');
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    const items = menuList.querySelectorAll('.list-item');
    let found = 0;
    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      const match = text.includes(query);
      item.style.display = match ? '' : 'none';
      if (match) found++;
    });
    // Pesan jika tidak ada hasil
    let noResult = menuList.querySelector('.no-result');
    if (found === 0) {
      if (!noResult) {
        noResult = document.createElement('p');
        noResult.className = 'no-result';
        noResult.textContent = 'Menu tidak ditemukan 😔';
        menuList.appendChild(noResult);
      }
    } else {
      if (noResult) noResult.remove();
    }
  });
}

/* ── 9. PROMO COUNTDOWN TIMER ── */
const promoCards = document.querySelectorAll('.promo-card');
if (promoCards.length > 0) {
  // Target: 48 jam dari sekarang
  const deadline = new Date(Date.now() + 48 * 60 * 60 * 1000);

  function formatTime(ms) {
    const total = Math.max(0, Math.floor(ms / 1000));
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  }

  promoCards.forEach(card => {
    const timerEl = document.createElement('div');
    timerEl.className = 'promo-timer';
    timerEl.innerHTML = `<i class="fas fa-clock"></i> Berakhir dalam: <span class="countdown">${formatTime(deadline - Date.now())}</span>`;
    card.querySelector('.btn-order').before(timerEl);
  });

  setInterval(() => {
    const remaining = deadline - Date.now();
    document.querySelectorAll('.countdown').forEach(el => {
      el.textContent = formatTime(remaining);
    });
  }, 1000);
}

/* ── 10. LOADING SCREEN ── */
const loader = document.createElement('div');
loader.className = 'page-loader';
loader.innerHTML = `
  <div class="loader-content">
    <div class="loader-logo">Dapur<span> Wenak</span></div>
    <div class="loader-spinner"></div>
  </div>
`;
document.body.prepend(loader);

window.addEventListener('load', () => {
  setTimeout(() => {
    loader.classList.add('hide');
    setTimeout(() => loader.remove(), 600);
  }, 800);
});

/* ── 11. RIPPLE EFFECT pada tombol ── */
document.querySelectorAll('.btn-primary, .btn-secondary, .btn-order').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    ripple.className = 'ripple-effect';
    const rect = this.getBoundingClientRect();
    ripple.style.left = (e.clientX - rect.left) + 'px';
    ripple.style.top = (e.clientY - rect.top) + 'px';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

/* ── 12. STICKY NAV HIGHLIGHT saat klik ── */
navLinks.forEach(link => {
  link.addEventListener('click', function() {
    navLinks.forEach(l => l.classList.remove('active'));
    this.classList.add('active');
  });
});
