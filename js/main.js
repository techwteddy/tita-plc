// ===== NAVIGATION =====
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.style.background = 'rgba(26,46,26,0.98)';
  } else {
    navbar.style.background = 'rgba(26,46,26,0.96)';
  }
});

if (hamburger) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navLinks.style.display = navLinks.classList.contains('open') ? 'flex' : 'none';
    navLinks.style.flexDirection = 'column';
    navLinks.style.position = 'absolute';
    navLinks.style.top = '72px';
    navLinks.style.left = '0'; navLinks.style.right = '0';
    navLinks.style.background = 'rgba(26,46,26,0.98)';
    navLinks.style.padding = '20px 5%';
    navLinks.style.gap = '18px';
  });
}

// ===== FADE-UP OBSERVER =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-up').forEach(el => {
  el.classList.add('animate');
  observer.observe(el);
});

// ===== PRODUCT FILTER =====
function initProductFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      productCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'block';
          card.style.animation = 'fadeIn 0.3s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// ===== ORDER CALCULATOR =====
function initCalculator() {
  // Handled by each page's own inline script
}

// ===== MODAL =====
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add('open');
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('open');
}

document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.remove('open');
  });
});

// ===== TOAST =====
function showToast(msg, duration = 3000) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.querySelector('.toast-msg').textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

// ===== FORM SUBMIT =====
function initForms() {
  document.querySelectorAll('form').forEach(form => {
    // Skip forms with their own handlers
    if (form.id === 'loginForm')      return;
    if (form.id === 'quoteForm')      return;
    if (form.id === 'modalOrderForm') return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type=submit]');
      if (btn) { btn.textContent = 'Sending...'; btn.disabled = true; }
      setTimeout(() => {
        showToast('✅ Your message has been sent successfully!');
        form.reset();
        if (btn) { btn.textContent = btn.dataset.original || 'Submit'; btn.disabled = false; }
        const modal = form.closest('.modal-overlay');
        if (modal) modal.classList.remove('open');
      }, 1200);
    });
  });
}

// ===== ADMIN TABS =====
function initAdminTabs() {
  const navItems = document.querySelectorAll('.admin-nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');
      const target = item.dataset.tab;
      document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.style.display = tab.id === target ? 'block' : 'none';
      });
    });
  });
}

// ===== TRACKING ANIMATION =====
function animateStages() {
  const stages = document.querySelectorAll('.stage-dot');
  let current = 0;
  setInterval(() => {
    stages.forEach((s, i) => {
      s.classList.remove('active', 'done', 'pending');
      if (i < current) s.classList.add('done');
      else if (i === current) s.classList.add('active');
      else s.classList.add('pending');
    });
    current = (current + 1) % stages.length;
  }, 1800);
}

// ===== COUNTER ANIMATION =====
function animateCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    let current = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current.toLocaleString() + suffix;
      if (current >= target) clearInterval(timer);
    }, 20);
  });
}

// ===== LIVE CURRENCY (USD → ETB) =====
let usdToEtb = 57;

async function fetchExchangeRate() {
  try {
    const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    const data = await res.json();
    if (data.rates && data.rates.ETB) {
      usdToEtb = data.rates.ETB;
      updateCurrencyBadge();
    }
  } catch (e) {
    updateCurrencyBadge();
  }
}

function updateCurrencyBadge() {
  document.querySelectorAll('.rate-badge').forEach(el => {
    el.textContent = '1 USD = ' + usdToEtb.toFixed(1) + ' ETB (live)';
  });
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  initProductFilter();
  initCalculator();
  initForms();
  initAdminTabs();
  animateStages();

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { animateCounters(); counterObserver.disconnect(); }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) counterObserver.observe(statsSection);

  document.querySelectorAll('button[type=submit]').forEach(btn => {
    btn.dataset.original = btn.textContent;
  });

  fetchExchangeRate();
});
