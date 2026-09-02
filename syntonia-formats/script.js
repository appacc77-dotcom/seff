// ===== Данные форматов (тексты 02–05 — редактируемые заглушки) =====
const FORMATS = {
  entry: {
    name: 'Точка входа', duration: '30 минут', price: '$40',
    text: 'Точка входа — первая встреча, когда важно не начинать сразу с глубокой работы, а спокойно разобраться, что происходит сейчас и куда лучше двигаться дальше.',
    points: [
      'проясняем запрос и то, что сейчас действительно важно;',
      'определяем основное направление работы;',
      'смотрим, какой формат может подойти дальше.',
    ],
  },
  master: {
    name: 'Индивидуальная мастер-сессия', duration: '2 часа', price: '$200',
    text: 'Глубокая индивидуальная работа с одним запросом или конкретной темой — время полностью принадлежит вашей ситуации.',
    points: [
      'погружаемся в один запрос или тему;',
      'работаем с тем, что происходит сейчас;',
      'фиксируем опоры и следующие шаги.',
    ],
  },
  p3: {
    name: 'Программа — 3 встречи', duration: '3 × 2 часа', price: '$570',
    text: 'Последовательная работа с запросом в трёх индивидуальных встречах: от прояснения к устойчивым изменениям.',
    points: [
      'выстраиваем маршрут работы на три встречи;',
      'отслеживаем динамику между встречами;',
      'закрепляем результат и опоры на будущее.',
    ],
  },
  p5: {
    name: 'Программа — 5 встреч', duration: '5 × 2 часа', price: '$930',
    text: 'Более глубокий цикл для системной работы и интеграции изменений в повседневную жизнь.',
    points: [
      'системно исследуем запрос и его контекст;',
      'интегрируем изменения шаг за шагом;',
      'формируем устойчивые опоры после завершения.',
    ],
  },
  support: {
    name: 'Сопровождение', duration: '60 минут', price: '$100',
    text: 'Поддерживающая встреча для продолжения процесса и работы с текущими изменениями.',
    points: [
      'смотрим на текущее состояние и динамику;',
      'поддерживаем процесс между этапами;',
      'корректируем направление при необходимости.',
    ],
  },
};

// ===== Выбор формата =====
const cards = document.querySelectorAll('.format-card');
const hiddenInput = document.getElementById('f-format');

function selectFormat(key, scroll = false) {
  const data = FORMATS[key];
  if (!data) return;

  cards.forEach((card) =>
    card.classList.toggle('is-active', card.dataset.format === key));

  document.querySelector('[data-chosen-name]').textContent = data.name;
  document.querySelector('[data-chosen-duration]').textContent = data.duration;
  document.querySelector('[data-chosen-price]').textContent = data.price;
  document.querySelector('[data-format-text]').textContent = data.text;
  document.querySelector('[data-format-points]').innerHTML =
    data.points.map((p) => `<li>${p}</li>`).join('');
  hiddenInput.value = key;

  if (scroll && window.innerWidth < 1080) {
    document.getElementById('request').scrollIntoView({ behavior: 'smooth' });
  }
}

cards.forEach((card) => {
  const key = card.dataset.format;
  card.addEventListener('click', () => selectFormat(key, true));
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      selectFormat(key, true);
    }
  });
});

document.querySelectorAll('[data-select-format]').forEach((btn) =>
  btn.addEventListener('click', () => selectFormat(btn.dataset.selectFormat)));

selectFormat('entry'); // формат по умолчанию

// ===== Мобильное меню =====
const toggle = document.querySelector('.menu-toggle');
const nav = document.getElementById('main-nav');

toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
});
nav.querySelectorAll('a').forEach((link) =>
  link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }));

// ===== Валидация формы =====
const form = document.getElementById('request-form');
const success = document.getElementById('form-success');

function setError(id, message) {
  const input = document.getElementById(id);
  input.closest('.field').classList.toggle('is-invalid', Boolean(message));
  document.querySelector(`[data-error-for="${id}"]`).textContent = message || '';
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  success.hidden = true;
  let valid = true;

  const name = form.name.value.trim();
  if (name.length < 2) { setError('f-name', 'Укажите, как к вам обращаться'); valid = false; }
  else setError('f-name');

  const email = form.email.value.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    setError('f-email', 'Проверьте формат email'); valid = false;
  } else setError('f-email');

  const phone = form.phone.value.trim();
  if (phone && !/^[+\d][\d\s()\-]{6,}$/.test(phone)) {
    setError('f-phone', 'Проверьте формат телефона'); valid = false;
  } else setError('f-phone');

  if (!valid) return;

  // Здесь позже будет fetch() к API (Payload CMS)
  console.log('Заявка:', Object.fromEntries(new FormData(form)));
  form.reset();
  selectFormat('entry');
  success.hidden = false;
});

// ===== Cookie-баннер =====
const banner = document.getElementById('cookie-banner');
const COOKIE_KEY = 'cookie-consent';

if (!localStorage.getItem(COOKIE_KEY)) banner.hidden = false;

function setConsent(value) {
  localStorage.setItem(COOKIE_KEY, value);
  banner.hidden = true;
}
document.getElementById('cookie-accept').addEventListener('click', () => setConsent('accepted'));
document.getElementById('cookie-decline').addEventListener('click', () => setConsent('declined'));
document.getElementById('cookie-link').addEventListener('click', () => { banner.hidden = false; });

// ===== Reveal-анимации при скролле =====
const revealEls = document.querySelectorAll(
  '.format-card, .sidebar__card, .formats__cta, .hero__content, .site-footer__grid');
revealEls.forEach((el) => el.classList.add('reveal'));

const observer = new IntersectionObserver(
  (entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  }),
  { threshold: 0.12 });
revealEls.forEach((el) => observer.observe(el));
