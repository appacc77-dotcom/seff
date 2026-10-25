# Итерация 1 — Header + Hero главной

Источник: Figma «Website Syntonia» → Home → `main` → `header` (167:641, theme=dark, shape=floating) и `hero` (79:105).

## Снятые параметры

| Элемент | Значение из Figma |
|---|---|
| Header | 1424×92, отступ 8px от краёв, radius 16, обводка 0.5px #8A8560, фон rgba(58,51,35,.85) + blur 10 |
| Внутренние поля header | 16 / 32 |
| Навигация | Golos Text 400, 20/34, gap 24, иконка-шеврон 14×14 |
| Логотип | logo-evolution-gold-gradient 168×60, строго по центру |
| «Личная встреча» | 45px, padding 8/16, radius 4, текстура-штукатурка, UPPERCASE 17/28.9, ls 0.51 |
| Кнопка профиля | 45×45, обводка 1.5px, radius 4; gap до кнопки 8 |
| Бургер | 38×25, линии 3px, шаг 8; gap 16 |
| Hero | 1440×780, padding 64, overlay rgba(0,0,0,.12) |
| H1 | Literata 300, 64/64 |
| Lead | Golos Text 400, 20/34 |
| Контент | ширина 600, gap 32, прижат к низу слева |
| CTA | #8A8560, 303×45, «Узнать свой код реальности» |
| Play | 47×47, справа снизу на линии CTA |

## Ассеты
- `assets/img/hero-home.jpg` — постер hero (в Figma 1280×720, нужен оригинал ≥2560px или видео)
- `assets/img/btn-texture.jpg` — текстура кнопки
- `assets/icons/logo-gold.svg`, `icon-arrow.svg`, `icon-chevron.svg`, `icon-profile.svg`, `icon-play.svg` — экспорт из Figma

## Открытые вопросы
- Видео для hero (слой называется `hero-video`, но в файле только изображение).
- Пункты выпадающего меню «О проекте» в Figma не нарисованы — временно «Метод Syntonia», «Мастера».
- Мобильные/планшетные макеты отсутствуют — адаптив сделан по временным правилам.
