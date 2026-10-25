const $ = (s, all) => all ? document.querySelectorAll(s) : document.querySelector(s);

/* 1. Responsive navigation menu */
const menuBtn = $('#menuBtn'), nav = $('nav');
menuBtn.addEventListener('click', () => nav.classList.toggle('open'));

/* 2. Dark mode (remembered via localStorage) */
const themeBtn = $('#themeBtn');
if (localStorage.getItem('theme') === 'dark') { document.body.classList.add('dark'); themeBtn.textContent = '☀️'; }
themeBtn.addEventListener('click', () => {
  const dark = document.body.classList.toggle('dark');
  themeBtn.textContent = dark ? '☀️' : '🌙';
  localStorage.setItem('theme', dark ? 'dark' : 'light');
});

/* 3. Scroll-to-top button */
const topBtn = $('#topBtn');
window.addEventListener('scroll', () => { topBtn.style.display = window.scrollY > 300 ? 'block' : 'none'; });
topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* 4. Typing animation */
const typing = $('#typing');
if (typing) {
  const words = ['Bedsheets', 'Pillows', 'Aprons', 'Hair Towels'];
  let w = 0, c = 0, del = false;
  (function type() {
    const word = words[w];
    typing.textContent = word.slice(0, c);
    if (!del && c < word.length) c++;
    else if (!del) { del = true; return setTimeout(type, 1200); }
    else if (c > 0) c--;
    else { del = false; w = (w + 1) % words.length; }
    setTimeout(type, del ? 60 : 110);
  })();
}

/* 5. Image slider */
const slides = $('.slide', true);
if (slides.length) {
  let i = 0;
  const show = n => { slides[i].classList.remove('active'); i = (n + slides.length) % slides.length; slides[i].classList.add('active'); };
  $('#next').addEventListener('click', () => show(i + 1));
  $('#prev').addEventListener('click', () => show(i - 1));
  setInterval(() => show(i + 1), 4000);
}

/* 6. FAQ accordion */
$('.faq-q', true).forEach(q => q.addEventListener('click', () => {
  const item = q.parentElement, wasOpen = item.classList.contains('open');
  $('.faq-item', true).forEach(f => f.classList.remove('open'));
  if (!wasOpen) item.classList.add('open');
}));

/* 7. Animated counters (start when visible) */
const counters = $('.counter', true);
if (counters.length) {
  const obs = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, target = +el.dataset.target;
    let n = 0; const step = Math.max(1, Math.ceil(target / 80));
    const t = setInterval(() => { n = Math.min(n + step, target); el.textContent = n + '+'; if (n >= target) clearInterval(t); }, 25);
    obs.unobserve(el);
  }), { threshold: .5 });
  counters.forEach(c => obs.observe(c));
}

/* 8. Form validation */
const form = $('#contactForm');
if (form) {
  const rules = {
    name: v => v.trim().length >= 3 || 'Enter your full name (at least 3 letters).',
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Enter a valid email, like name@example.com.',
    phone: v => /^[0-9+\s-]{10,15}$/.test(v) || 'Enter a valid phone number (10-15 digits).',
    message: v => v.trim().length >= 10 || 'Message must be at least 10 characters.'
  };
  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    Object.keys(rules).forEach(f => {
      const input = form[f], res = rules[f](input.value);
      input.nextElementSibling.textContent = res === true ? '' : res;
      input.classList.toggle('invalid', res !== true);
      if (res !== true) ok = false;
    });
    $('#formMsg').textContent = ok ? 'Thank you! Your message has been sent.' : '';
    if (ok) form.reset();
  });
}
