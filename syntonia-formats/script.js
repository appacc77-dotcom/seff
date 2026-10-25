/* Syntonia — script.js
   Итерация 1: выпадающее меню, мобильное меню, кнопка видео. */

function closeDropdown(toggle) {
  const panel = document.getElementById(toggle.getAttribute('aria-controls'));
  if (!panel) return;
  toggle.setAttribute('aria-expanded', 'false');
  panel.hidden = true;
}

function initDropdowns() {
  const toggles = document.querySelectorAll('[data-dropdown-toggle]');
  if (!toggles.length) return;

  toggles.forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const panel = document.getElementById(toggle.getAttribute('aria-controls'));
      if (!panel) return;
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!isOpen));
      panel.hidden = isOpen;
    });
  });

  document.addEventListener('click', (event) => {
    toggles.forEach((toggle) => {
      if (toggle.parentElement.contains(event.target)) return;
      closeDropdown(toggle);
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    toggles.forEach(closeDropdown);
  });
}

function initMobileMenu() {
  const toggle = document.querySelector('[data-menu-toggle]');
  if (!toggle) return;
  const menu = document.getElementById(toggle.getAttribute('aria-controls'));
  if (!menu) return;

  const setOpen = (isOpen) => {
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
    menu.hidden = !isOpen;
  };

  toggle.addEventListener('click', () => {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    setOpen(false);
  });
}

function initVideoButton() {
  const button = document.querySelector('[data-video-play]');
  if (!button) return;
  // Видео для hero пока не передано — в Figma только постер.
  // Когда появится файл, сюда добавляется открытие модального плеера.
  button.addEventListener('click', () => {
    console.info('Syntonia: видео для hero ещё не подключено.');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initDropdowns();
  initMobileMenu();
  initVideoButton();
});

/* ---------- Итерация 2: секции главной ---------- */

function createEl(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text) el.textContent = text;
  return el;
}

function initFormats() {
  const root = document.querySelector('[data-formats]');
  const formats = window.SYNTONIA_FORMATS;
  if (!root || !Array.isArray(formats) || !formats.length) return;

  const slidesBox = root.querySelector('[data-formats-slides]');
  const tabsBox = root.querySelector('[data-formats-tabs]');
  const counter = root.querySelector('[data-formats-counter]');
  const tabs = [];
  const slides = [];
  let current = 0;

  formats.forEach((item, index) => {
    const slide = createEl('img', 'formats__slide');
    slide.src = item.image;
    slide.alt = item.imageAlt;
    slide.width = 1672;
    slide.height = 941;
    slide.loading = 'lazy';
    slidesBox.append(slide);
    slides.push(slide);

    const tab = createEl('button', 'format-tab');
    tab.type = 'button';
    tab.id = `format-tab-${item.id}`;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', `format-panel-${item.id}`);

    const head = createEl('span', 'format-tab__head');
    head.append(createEl('span', 'format-tab__num', item.number), createEl('span', 'format-tab__title', item.title));
    const meta = createEl('span', 'format-tab__meta');
    meta.append(createEl('span', 'format-tab__duration', item.duration), createEl('span', 'format-tab__price', item.price));
    tab.append(head, meta);

    const panel = createEl('div', 'format-tab__panel');
    panel.id = `format-panel-${item.id}`;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tab.id);
    const desc = createEl('p', 'format-tab__text', item.description);
    if (item.draft) desc.dataset.draft = '';
    const panelMeta = createEl('p', 'format-tab__panel-meta', `${item.duration} · ${item.price}`);
    const link = createEl('a', 'btn btn--primary btn--textured format-tab__btn', 'Перейти к записи ');
    link.href = `booking.html#${item.id}`;
    link.append(createEl('span', 'icon-arrow'));
    link.lastChild.setAttribute('aria-hidden', 'true');
    panel.append(desc, panelMeta, link);

    const cell = createEl('div', 'formats__cell');
    cell.append(tab, panel);
    tabsBox.append(cell);
    tabs.push({ tab, panel, cell });

    tab.addEventListener('click', () => select(index));
    tab.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight') { select((index + 1) % formats.length, true); }
      if (event.key === 'ArrowLeft') { select((index - 1 + formats.length) % formats.length, true); }
    });
  });

  function select(index, focus) {
    current = index;
    tabs.forEach(({ tab, panel, cell }, i) => {
      const active = i === index;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      panel.hidden = !active;
      cell.classList.toggle('formats__cell--active', active);
      slides[i].classList.toggle('formats__slide--active', active);
    });
    counter.textContent = `${index + 1}/${formats.length}`;
    if (focus) tabs[index].tab.focus();
  }

  root.querySelector('[data-formats-prev]').addEventListener('click', () => select((current - 1 + formats.length) % formats.length));
  root.querySelector('[data-formats-next]').addEventListener('click', () => select((current + 1) % formats.length));
  select(0);
}

function initVoices() {
  const root = document.querySelector('[data-voices]');
  const voices = window.SYNTONIA_VOICES;
  if (!root || !Array.isArray(voices) || !voices.length) return;

  const track = root.querySelector('[data-voices-track]');
  const dotsBox = document.querySelector('[data-voices-dots]');
  const cards = [];
  const dots = [];
  let current = 0;

  voices.forEach((voice, index) => {
    const card = createEl('li', 'voice-card');
    card.setAttribute('aria-label', `Отзыв ${index + 1} из ${voices.length}`);
    card.append(
      createEl('p', 'voice-card__label', voice.label),
      createEl('p', 'voice-card__note', voice.note)
    );
    const quote = createEl('blockquote', 'voice-card__quote');
    quote.append(createEl('p', '', voice.text));
    card.append(quote, createEl('p', 'voice-card__author', `— ${voice.author}`));
    track.append(card);
    cards.push(card);

    const dot = createEl('button', 'leaf-dots__dot');
    dot.type = 'button';
    dot.setAttribute('aria-label', `Показать отзыв ${index + 1}`);
    dot.addEventListener('click', () => go(index));
    dotsBox.append(dot);
    dots.push(dot);
  });

  function go(index) {
    current = Math.max(0, Math.min(index, voices.length - 1));
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    track.scrollTo({ left: cards[current].offsetLeft - track.offsetLeft - parseFloat(getComputedStyle(track).paddingLeft), behavior: reduce ? 'auto' : 'smooth' });
    dots.forEach((dot, i) => dot.setAttribute('aria-current', i === current ? 'true' : 'false'));
  }

  let scrollTimer;
  track.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      const pad = parseFloat(getComputedStyle(track).paddingLeft);
      let nearest = 0;
      cards.forEach((card, i) => {
        if (Math.abs(card.offsetLeft - track.offsetLeft - pad - track.scrollLeft) < Math.abs(cards[nearest].offsetLeft - track.offsetLeft - pad - track.scrollLeft)) nearest = i;
      });
      current = nearest;
      dots.forEach((dot, i) => dot.setAttribute('aria-current', i === current ? 'true' : 'false'));
    }, 120);
  });

  document.querySelector('[data-voices-prev]').addEventListener('click', () => go(current - 1));
  document.querySelector('[data-voices-next]').addEventListener('click', () => go(current + 1));
  dots.forEach((dot, i) => dot.setAttribute('aria-current', i === 0 ? 'true' : 'false'));
}

document.addEventListener('DOMContentLoaded', () => {
  initFormats();
  initVoices();
});

/* ---------- Итерация 3: внутренние страницы ---------- */

/* Уведомление-заглушка для функций, которым ещё не переданы данные (аудио, cookie, оплата). */
function notify(message) {
  let toast = document.querySelector('[data-toast]');
  if (!toast) {
    toast = createEl('p', 'toast');
    toast.setAttribute('data-toast', '');
    toast.setAttribute('role', 'status');
    document.body.append(toast);
  }
  toast.textContent = message;
  toast.classList.add('toast--visible');
  clearTimeout(notify.timer);
  notify.timer = setTimeout(() => toast.classList.remove('toast--visible'), 3200);
}

function initStubs() {
  document.querySelectorAll('[data-audio-stub]').forEach((btn) => {
    btn.addEventListener('click', () => notify('Аудиозапись ещё не загружена — появится после передачи файлов.'));
  });
  document.querySelectorAll('[data-cookie-settings]').forEach((btn) => {
    btn.addEventListener('click', () => notify('Сайт пока не использует cookie-трекеры. Настройки появятся вместе с аналитикой.'));
  });
  document.querySelectorAll('[data-buy-stub]').forEach((btn) => {
    btn.addEventListener('click', () => notify('Оплата ещё не подключена.'));
  });
}

/* Практики: карточки из SYNTONIA_PRACTICES */
function practiceCard(item, group) {
  const li = createEl('li', `practice-card practice-card--${group}`);
  const img = createEl('img', 'practice-card__image');
  img.src = item.image;
  img.alt = '';
  img.loading = 'lazy';
  img.width = 400;
  img.height = 300;
  const body = createEl('div', 'practice-card__body');
  body.append(createEl('h3', 'practice-card__title', item.title));
  if (item.text) body.append(createEl('p', 'practice-card__text', item.text));
  if (item.points) {
    const ul = createEl('ul', 'practice-card__points');
    item.points.forEach((p) => ul.append(createEl('li', '', p)));
    body.append(ul);
  }
  const foot = createEl('div', 'practice-card__foot');
  const meta = createEl('p', 'practice-card__meta');
  if (item.duration) meta.append(createEl('span', '', item.duration));
  if (item.oldPrice) meta.append(createEl('s', 'practice-card__old', item.oldPrice));
  meta.append(createEl('span', item.price ? 'practice-card__price' : '', item.price || 'Бесплатно'));
  foot.append(meta);
  const btn = createEl('button', group === 'free' ? 'practice-card__listen' : 'practice-card__buy');
  btn.type = 'button';
  if (group === 'free') {
    btn.append(createEl('span', 'practice-card__play'), document.createTextNode('Слушать'));
    btn.setAttribute('aria-label', `Слушать: ${item.title}`);
    btn.setAttribute('data-audio-stub', '');
  } else {
    btn.append(document.createTextNode(group === 'packages' ? 'Подробнее' : 'Купить'), createEl('span', 'icon-arrow'));
    btn.setAttribute('aria-label', `${group === 'packages' ? 'Подробнее' : 'Купить'}: ${item.title}`);
    btn.setAttribute('data-buy-stub', '');
  }
  foot.append(btn);
  body.append(foot);
  li.append(img, body);
  return li;
}

function initPractices() {
  const data = window.SYNTONIA_PRACTICES;
  const lists = document.querySelectorAll('[data-practices]');
  if (!data || !lists.length) return;
  lists.forEach((list) => {
    const group = list.dataset.practices;
    (data[group] || []).forEach((item) => list.append(practiceCard(item, group)));
  });
}

/* Запись: выбор формата + форма */
function initBooking() {
  const list = document.querySelector('[data-booking-list]');
  const formats = window.SYNTONIA_FORMATS;
  if (!list || !Array.isArray(formats)) return;
  list.id = 'formats-list';
  const title = document.querySelector('[data-booking-title]');
  const about = document.querySelector('[data-booking-about]');
  const points = document.querySelector('[data-booking-points]');
  const input = document.querySelector('[data-booking-input]');
  const items = [];

  function select(id, focus) {
    const index = Math.max(0, formats.findIndex((f) => f.id === id));
    const f = formats[index];
    items.forEach((el, i) => {
      el.setAttribute('aria-checked', String(i === index));
      el.tabIndex = i === index ? 0 : -1;
    });
    if (focus) items[index].focus();
    title.textContent = `${f.title} · ${f.duration} · ${f.price}`;
    about.textContent = f.about || f.description;
    points.replaceChildren(...(f.points || []).map((p) => createEl('li', '', p)));
    input.value = f.id;
  }

  formats.forEach((f, i) => {
    const el = createEl('div', 'booking-item');
    el.setAttribute('role', 'radio');
    el.dataset.id = f.id;
    el.append(createEl('span', 'booking-item__num', f.number));
    const body = createEl('span', 'booking-item__body');
    body.append(createEl('span', 'booking-item__title', f.title));
    body.append(createEl('span', 'booking-item__text', f.description));
    body.append(createEl('span', 'booking-item__meta', `${f.duration}  ·  ${f.price}`));
    el.append(body, createEl('span', 'booking-item__check'));
    el.addEventListener('click', () => select(f.id));
    el.addEventListener('keydown', (e) => {
      const keys = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
      if (keys[e.key]) {
        e.preventDefault();
        select(formats[(i + keys[e.key] + formats.length) % formats.length].id, true);
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        select(f.id);
      }
    });
    items.push(el);
    list.append(el);
  });

  const fromHash = () => {
    const id = location.hash.slice(1);
    if (formats.some((f) => f.id === id)) select(id);
  };
  select('entry');
  fromHash();
  window.addEventListener('hashchange', fromHash);
  document.querySelectorAll('[data-booking-pick]').forEach((btn) => {
    btn.addEventListener('click', () => select(btn.dataset.bookingPick, true));
  });

  const form = document.querySelector('[data-booking-form]');
  const success = document.querySelector('[data-booking-success]');
  const rules = {
    name: (v) => v.trim().length > 1,
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
    phone: (v) => v.replace(/\D/g, '').length >= 10
  };
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let firstInvalid = null;
    Object.keys(rules).forEach((name) => {
      const field = form.elements[name];
      const error = document.getElementById(`${field.id}-error`);
      const ok = rules[name](field.value);
      field.setAttribute('aria-invalid', String(!ok));
      if (ok) field.removeAttribute('aria-describedby');
      else field.setAttribute('aria-describedby', error.id);
      error.hidden = ok;
      if (!ok && !firstInvalid) firstInvalid = field;
    });
    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }
    // Бэкенд не подключён: здесь будет отправка заявки (CRM / почта).
    success.hidden = false;
    form.reset();
    select(input.value);
  });
}

/* Тест состояния */
function initQuiz() {
  const form = document.querySelector('[data-quiz-form]');
  const quiz = window.SYNTONIA_QUIZ;
  if (!form || !quiz) return;
  const qs = quiz.questions;
  const total = qs.length;
  const answers = new Array(total).fill(null);
  let step = 0;
  const $ = (sel) => document.querySelector(sel);
  const intro = $('[data-quiz-intro]');
  const result = $('[data-quiz-result]');
  const back = $('[data-quiz-back]');
  const next = $('[data-quiz-next]');
  $('[data-quiz-count]').textContent = `${quiz.totalPlanned} вопросов`;

  function render() {
    const q = qs[step];
    const pct = Math.round(((step + 1) / total) * 100);
    $('[data-quiz-step]').textContent = `Вопрос ${step + 1} из ${total}`;
    $('[data-quiz-percent]').textContent = `${pct}% пройдено`;
    $('[data-quiz-bar]').setAttribute('aria-valuenow', String(pct));
    $('[data-quiz-fill]').style.setProperty('--progress', `${pct}%`);
    $('[data-quiz-question]').textContent = q.text;
    const box = $('[data-quiz-options]');
    box.replaceChildren();
    q.options.forEach((opt, i) => {
      const label = createEl('label', 'quiz-option');
      const radio = createEl('input', 'quiz-option__input');
      radio.type = 'radio';
      radio.name = 'answer';
      radio.value = String(i);
      radio.checked = answers[step] === i;
      radio.addEventListener('change', () => { answers[step] = i; next.disabled = false; });
      label.append(radio, createEl('span', 'quiz-option__text', opt.text));
      box.append(label);
    });
    back.disabled = step === 0;
    next.disabled = answers[step] === null;
    next.firstChild.textContent = step === total - 1 ? 'Узнать результат ' : 'Далее ';
  }

  function showResult() {
    const score = {};
    answers.forEach((a, i) => {
      const code = qs[i].options[a].code;
      score[code] = (score[code] || 0) + 1;
    });
    const key = Object.keys(score).sort((a, b) => score[b] - score[a])[0];
    const r = quiz.results[key];
    $('[data-result-title]').textContent = r.title;
    $('[data-result-subtitle]').textContent = r.subtitle;
    $('[data-result-lead]').textContent = r.lead;
    $('[data-result-state]').textContent = r.stateTitle || r.subtitle;
    $('[data-result-meaning]').replaceChildren(...r.meaning.map((t) => createEl('p', '', t)));
    const changes = $('[data-result-changes]');
    changes.replaceChildren(...(r.changes || []).map((t) => createEl('li', '', t)));
    $('[data-result-changes-wrap]').hidden = !(r.changes && r.changes.length);
    $('[data-result-quote]').textContent = r.quote;
    $('[data-result-quote-wrap]').hidden = !r.quote;
    $('[data-result-gift]').textContent = r.gift.title;
    $('[data-result-gift-meta]').textContent = r.gift.meta;
    $('[data-result-gift-text]').textContent = r.gift.text || '';
    if (r.draft) result.setAttribute('data-draft', '');
    else result.removeAttribute('data-draft');
    form.hidden = true;
    intro.hidden = true;
    result.hidden = false;
    result.focus();
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (answers[step] === null) return;
    if (step < total - 1) { step += 1; render(); form.querySelector('legend').focus?.(); }
    else showResult();
  });
  back.addEventListener('click', () => { if (step > 0) { step -= 1; render(); } });
  $('[data-quiz-restart]').addEventListener('click', () => {
    answers.fill(null);
    step = 0;
    result.hidden = true;
    form.hidden = false;
    intro.hidden = false;
    render();
    form.scrollIntoView({ block: 'start' });
  });

  const gift = $('[data-gift-form]');
  gift.addEventListener('submit', (e) => {
    e.preventDefault();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(gift.elements.email.value.trim()) && gift.elements.consent.checked;
    $('[data-gift-error]').hidden = ok;
    gift.elements.email.setAttribute('aria-invalid', String(!ok));
    if (!ok) return;
    // Бэкенд не подключён: здесь будет регистрация и выдача практики.
    $('[data-gift-success]').hidden = false;
    gift.reset();
  });

  render();
}

/* Мастера: прокрутка карточек */
function initMasters() {
  const track = document.querySelector('[data-masters-track]');
  if (!track) return;
  const step = () => (track.firstElementChild ? track.firstElementChild.getBoundingClientRect().width + 24 : 300);
  const behavior = matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
  document.querySelector('[data-masters-prev]').addEventListener('click', () => track.scrollBy({ left: -step(), behavior }));
  document.querySelector('[data-masters-next]').addEventListener('click', () => track.scrollBy({ left: step(), behavior }));
}

document.addEventListener('DOMContentLoaded', () => {
  initPractices();
  initStubs();
  initBooking();
  initQuiz();
  initMasters();
});
