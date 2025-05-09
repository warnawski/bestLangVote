// --- Глобальные переменные и кэширование ---
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const themeIcon = themeToggle ? themeToggle.querySelector('i') : null; // Проверка на существование
const resultsList = document.getElementById('resultsList'); // Для страницы результатов
const votingGrid = document.getElementById('votingGrid'); // Для главной страницы голосования

// --- Логика Переключения Темы ---
const savedTheme = localStorage.getItem('theme');

function applyTheme(theme) {
  if (!body) return; // Если body еще не загружен
  body.classList.toggle('dark-mode', theme === 'dark');
  if (themeIcon) {
    themeIcon.classList.toggle('fa-sun', theme === 'dark');
    themeIcon.classList.toggle('fa-moon', theme !== 'dark');
  }
  document.querySelectorAll('.lang-logo').forEach(img => {
    // Особое правило для Assembler в .result-item уже есть в CSS
    // Это правило должно применяться ко всем лого, КРОМЕ Assembler на странице результатов
    // И ко всем лого на главной странице, КРОМЕ Assembler
    const isResultItem = img.closest('.result-item');
    const isAssemblerInResult = isResultItem && img.closest('.result-item').dataset.lang === 'assembler';

    if (!isAssemblerInResult) { // Не применяем к Assembler на странице результатов
      // Для главной страницы (не result-item) или для других языков на странице результатов
      img.style.filter = body.classList.contains('dark-mode') ? 'var(--logo-filter-dark)' : 'var(--logo-filter-light)';
    }
    // Если это главная страница и это ассемблер, нужно специальное правило из HTML
    if (!isResultItem && img.closest('.language-card[data-lang="assembler"]')) {
      // На главной странице для Assembler фильтр управляется через CSS переменную --asm-invert и стиль в HTML
      // Здесь просто убедимся, что если есть темная тема, то invert(1) применится из CSS
    }
  });
}

// Применяем тему сразу, если body уже есть
if (body) {
  applyTheme(savedTheme || 'light');
} else {
  // Если body еще нет, ждем DOMContentLoaded (но этот блок может быть избыточен, т.к. основной код в DOMContentLoaded)
  document.addEventListener('DOMContentLoaded', () => applyTheme(savedTheme || 'light'), { once: true });
}


if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const newTheme = body.classList.contains('dark-mode') ? 'light' : 'dark';
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  });
}

// --- Логика Отображения Результатов и Счетчиков Голосов ---
document.addEventListener('DOMContentLoaded', async () => {
  if (body) { // Убедимся, что body есть
    body.style.opacity = 0;
    requestAnimationFrame(() => {
      body.style.transition = 'opacity 0.5s ease-in';
      body.style.opacity = 1;
    });
    // Применяем тему еще раз, чтобы убедиться, что все стили логотипов корректны после загрузки DOM
    applyTheme(localStorage.getItem('theme') || 'light');
  }


  const allLangs = ['python', 'javascript', 'java', 'c#', 'rust', 'go', 'c++', 'swift', 'kotlin', 'php', 'ruby', 'assembler'];
  let votes = {};
  let maxVotes = 0;

  for (const lang of allLangs) {
    try {
      const response = await fetch('http://localhost:8080/api/get-count', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: lang })
      });

      if (!response.ok) {
        console.error(`Ошибка от сервера для ${lang}: ${response.status} ${response.statusText}`);
        const errorBody = await response.text();
        console.error("Тело ошибки:", errorBody);
        continue; // Переходим к следующему языку
    }

    const result = await response.json();
    // --- ИСПРАВЛЕНИЕ ЗДЕСЬ ---
    const count = parseInt(result.count_vote, 10); // Используем result.count_vote
    // --- КОНЕЦ ИСПРАВЛЕНИЯ ---


    if (!isNaN(count)) {
      const langKey = lang.toLowerCase(); // Убедимся, что langKey всегда в нижнем регистре
      // Специальная обработка для 'c#' и 'c++' для соответствия ID элементов
      let elementIdLangKey = langKey;
      if (langKey === 'c#') {
          elementIdLangKey = 'csharp';
      } else if (langKey === 'c++') {
          elementIdLangKey = 'cplusplus';
      }

      votes[langKey] = count; // Сохраняем голоса по оригинальному ключу из allLangs (в нижнем регистре)
      if (count > maxVotes) maxVotes = count;

      // --- ОБНОВЛЕНИЕ СЧЕТЧИКОВ НА ГЛАВНОЙ СТРАНИЦЕ ---
      if (votingGrid) { // Если мы на странице с сеткой голосования
        const voteCountElement = document.getElementById(`votes-${elementIdLangKey}`); // Используем elementIdLangKey
        if (voteCountElement) {
          voteCountElement.textContent = count;
        } else {
          console.warn(`Элемент для счетчика голосов votes-${elementIdLangKey} не найден для языка ${lang}`);
        }
      }
      // --- КОНЕЦ ОБНОВЛЕНИЯ СЧЕТЧИКОВ НА ГЛАВНОЙ СТРАНИЦЕ ---

    } else {
      console.warn(`Получено нечисловое значение голосов для ${lang} из result.count_vote: ${result.count_vote}`);
    }
    } catch (err) {
      console.error(`Ошибка при получении голосов для ${lang}:`, err);
    }
  }

  // --- ЛОГИКА ДЛЯ СТРАНИЦЫ РЕЗУЛЬТАТОВ (resultsList) ---
  if (resultsList) {
    const sortedResults = Object.keys(votes).map(lang => ({
      lang: lang,
      count: votes[lang]
    })).sort((a, b) => b.count - a.count);

    if (sortedResults.length === 0 && Object.keys(votes).length === 0) { // Проверяем, были ли вообще голоса
      resultsList.innerHTML = "<p>Пока никто не проголосовал или не удалось загрузить данные. Будь первым!</p>";
      resultsList.classList.add('empty');
    } else if (sortedResults.length === 0 && Object.keys(votes).length > 0) {
        resultsList.innerHTML = "<p>Похоже, голоса есть, но они нулевые или произошла ошибка при сортировке.</p>";
        resultsList.classList.add('empty');
    }
    else {
      resultsList.innerHTML = ''; // Очищаем, если там был текст "загрузка"
      const fragment = document.createDocumentFragment();
      sortedResults.forEach(result => {
        const item = document.createElement('div');
        item.classList.add('result-item');
        item.dataset.lang = result.lang;

        const logoSrc = getLanguageLogo(result.lang);
        if (logoSrc) {
          const img = document.createElement('img');
          img.src = logoSrc;
          img.alt = result.lang + " Logo";
          img.classList.add('lang-logo');
          img.loading = 'lazy';
          // Фильтр для лого на странице результатов будет применен функцией applyTheme
          item.appendChild(img);
        }

        const infoDiv = document.createElement('div');
        infoDiv.classList.add('result-info');

        const title = document.createElement('h2');
        title.classList.add('lang-title');
        title.textContent = capitalize(result.lang);

        const barContainer = document.createElement('div');
        barContainer.classList.add('vote-bar-container');

        const voteBar = document.createElement('div');
        voteBar.classList.add('vote-bar');
        const barWidth = maxVotes > 0 ? (result.count / maxVotes) * 100 : 0;
        
        // Устанавливаем начальную ширину 0 для анимации
        voteBar.style.width = '0%'; 
        barContainer.appendChild(voteBar);
        
        // Сохраняем целевую ширину для последующей анимации
        voteBar.dataset.targetWidth = barWidth;


        infoDiv.appendChild(title);
        infoDiv.appendChild(barContainer);

        const votesCountSpan = document.createElement('span');
        votesCountSpan.classList.add('result-votes');
        votesCountSpan.textContent = result.count;

        item.appendChild(infoDiv);
        item.appendChild(votesCountSpan);
        fragment.appendChild(item);
      });

      resultsList.appendChild(fragment);

      // Применяем тему, чтобы фильтры к новым логотипам применились корректно
      applyTheme(body.classList.contains('dark-mode') ? 'dark' : 'light');

      // Анимация для прогресс-баров
      setTimeout(() => {
        document.querySelectorAll('.vote-bar').forEach(bar => {
          bar.style.width = bar.dataset.targetWidth + '%'; // Анимируем к целевой ширине
        });
      }, 100); // Небольшая задержка для срабатывания transition

    }
  }
  // --- КОНЕЦ ЛОГИКИ ДЛЯ СТРАНИЦЫ РЕЗУЛЬТАТОВ ---

  // Обновление темы для логотипов после того, как все загружено (особенно актуально для главной страницы)
  // Этот вызов applyTheme важен, т.к. он обновит фильтры для уже существующих img.lang-logo на главной странице
  if (body) {
      applyTheme(body.classList.contains('dark-mode') ? 'dark' : 'light');
  }


  // MutationObserver для темы (если body существует)
  if (body) {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.attributeName === 'class') {
          applyTheme(body.classList.contains('dark-mode') ? 'dark' : 'light');
        }
      });
    });
    observer.observe(body, { attributes: true });
  }
});

// --- Вспомогательные функции ---
function getLanguageLogo(lang) {
  const logos = {
    python: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg",
    javascript: "https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png",
    java: "https://www.vectorlogo.zone/logos/java/java-icon.svg",
    csharp: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Logo_C_sharp.svg",
    rust: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Rust_programming_language_black_logo.svg",
    go: "https://upload.wikimedia.org/wikipedia/commons/0/05/Go_Logo_Blue.svg",
    cplusplus: "https://upload.wikimedia.org/wikipedia/commons/1/18/ISO_C%2B%2B_Logo.svg",
    swift: "https://upload.wikimedia.org/wikipedia/commons/9/9d/Swift_logo.svg",
    kotlin: "https://upload.wikimedia.org/wikipedia/commons/7/74/Kotlin_Icon.svg",
    php: "https://upload.wikimedia.org/wikipedia/commons/2/27/PHP-logo.svg",
    ruby: "https://upload.wikimedia.org/wikipedia/commons/7/73/Ruby_logo.svg",
    assembler: "https://www.svgrepo.com/show/475651/cpu-chip.svg"
  };
  return logos[lang.toLowerCase()] || null; // Убедимся, что lang в нижнем регистре для ключа
}

function capitalize(string) {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Добавим обработчики для кнопок голосования, если они есть на странице
document.querySelectorAll('.vote-button').forEach(button => {
  button.addEventListener('click', async (event) => {
    const lang = event.target.dataset.target;
    if (!lang) return;

    // Опционально: добавить визуальную обратную связь (например, спиннер)
    event.target.disabled = true;
    event.target.textContent = 'Голосуем...';

    try {
      const response = await fetch('http://localhost:8080/api/vote', { // Предполагаемый эндпоинт для голосования
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: capitalize(lang) }) // Бэкенд ожидает с большой буквы
      });

      if (response.ok) {
        const result = await response.json();
        const newCount = parseInt(result.votes, 10);

        if (!isNaN(newCount)) {
          const voteCountElement = document.getElementById(`votes-${lang}`);
          if (voteCountElement) {
            voteCountElement.textContent = newCount;
            // Можно добавить анимацию увеличения числа
          }
          event.target.textContent = 'Спасибо!';
          // Можно сделать кнопку неактивной на некоторое время или до перезагрузки
          // event.target.disabled = true; // Оставить неактивной
          setTimeout(() => { // Или вернуть в исходное состояние через время
             event.target.textContent = 'Голосовать!';
             event.target.disabled = false;
          }, 2000);

          // Конфетти!
          if (typeof confetti === 'function') { // Проверка, что функция confetti существует
            const rect = event.target.getBoundingClientRect();
            const x = (rect.left + rect.right) / 2 / window.innerWidth;
            const y = (rect.top + rect.bottom) / 2 / window.innerHeight;
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { x: x, y: y }
            });
          }

        } else {
          event.target.textContent = 'Ошибка!';
          console.error('Сервер вернул некорректное число голосов:', result.votes);
           setTimeout(() => {
             event.target.textContent = 'Голосовать!';
             event.target.disabled = false;
           }, 2000);
        }
      } else {
        event.target.textContent = 'Ошибка!';
        console.error('Ошибка голосования:', response.status, await response.text());
         setTimeout(() => {
           event.target.textContent = 'Голосовать!';
           event.target.disabled = false;
         }, 2000);
      }
    } catch (err) {
      event.target.textContent = 'Ошибка сети!';
      console.error('Ошибка сети при голосовании:', err);
       setTimeout(() => {
         event.target.textContent = 'Голосовать!';
         event.target.disabled = false;
       }, 2000);
    }
  });
});

// Если используете библиотеку для конфетти, например, canvas-confetti
// <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
// этот скрипт нужно подключить в HTML ПЕРЕД вашим script.js