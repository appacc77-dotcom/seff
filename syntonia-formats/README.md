# Syntonia — статический сайт

HTML5 + CSS3 + Vanilla JS, без фреймворков, библиотек и сборки.

Запуск: `python3 -m http.server 8000` → http://localhost:8000

## Структура

```
index.html            главная (по фреймам Figma Home)
method.html           Метод Syntonia
masters.html          Мастера (тёмная тема)
library.html          Библиотека
practice.html         Практики
booking.html          Форматы работы и заявка (#entry, #master-session, … — предвыбор формата)
quiz.html             Тест состояния + результат
offer.html, privacy.html, consent.html   правовые документы (заглушки)
404.html              страница ошибки
styles.css            токены + компоненты, mobile-first (768 / 1200)
script.js             меню, слайдеры, практики, запись, тест, заглушки
data/formats.js       форматы работы — единый источник (главная + booking)
data/practices.js     практики (practice.html)
data/quiz.js          вопросы и результаты теста
data/voices.js        отзывы
assets/img, assets/icons
docs/report-site.md   отчёт по страницам: что готово и что нужно
```

Шапка и подвал одинаковые на всех страницах; при правке меняйте их во всех HTML-файлах
(или генератором из исходной папки разработки — в архив он не входит).

Элементы с атрибутом `data-draft` подсвечены пунктирной рамкой — это черновые тексты/данные,
которые нужно заменить. Чтобы убрать подсветку перед запуском, удалите правило `[data-draft]` в styles.css.
