// --- Весь JavaScript остается БЕЗ ИЗМЕНЕНИЙ ---
// Логика загрузки результатов, переключения темы и плавного появления уже есть

// --- Глобальные переменные и кэширование ---
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const themeIcon = themeToggle.querySelector('i');
const resultsList = document.getElementById('resultsList');

// --- Логика Переключения Темы ---
const savedTheme = localStorage.getItem('theme');
function applyTheme(theme) {
  body.classList.toggle('dark-mode', theme === 'dark');
  themeIcon.classList.toggle('fa-sun', theme === 'dark');
  themeIcon.classList.toggle('fa-moon', theme !== 'dark');
  document.querySelectorAll('.lang-logo').forEach(img => {
    if (!img.closest('.result-item') || img.closest('.result-item').dataset.lang !== 'assembler') {
      img.style.filter = body.classList.contains('dark-mode') ? 'var(--logo-filter-dark)' : 'var(--logo-filter-light)';
    } else {
      const asmLogo = document.querySelector('.result-item[data-lang="assembler"] .lang-logo');
      if (asmLogo) { /* Обновление фильтра Assembler */ }
    }
  });
}
applyTheme(savedTheme || 'light');

themeToggle.addEventListener('click', () => {
  const newTheme = body.classList.contains('dark-mode') ? 'light' : 'dark';
  applyTheme(newTheme);
  localStorage.setItem('theme', newTheme);
});

// --- Логика Отображения Результатов ---
document.addEventListener('DOMContentLoaded', () => {
  let votes = {}; let maxVotes = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('votes_')) {
      const lang = key.substring(6); const count = parseInt(localStorage.getItem(key), 10);
      if (!isNaN(count)) { votes[lang] = count; if (count > maxVotes) maxVotes = count; }
    }
  }
  const sortedResults = Object.keys(votes).map(lang => ({ lang: lang, count: votes[lang] })).sort((a, b) => b.count - a.count);

  if (sortedResults.length === 0) { resultsList.innerHTML = "<p>Пока никто не проголосовал. Будь первым!</p>"; resultsList.classList.add('empty'); }
  else {
    const fragment = document.createDocumentFragment();
    sortedResults.forEach(result => {
      const item = document.createElement('div'); item.classList.add('result-item'); item.dataset.lang = result.lang;
      const logoSrc = getLanguageLogo(result.lang);
      if (logoSrc) { const img = document.createElement('img'); img.src = logoSrc; img.alt = result.lang + " Logo"; img.classList.add('lang-logo'); img.loading = 'lazy'; img.style.filter = body.classList.contains('dark-mode') ? 'var(--logo-filter-dark)' : 'var(--logo-filter-light)'; item.appendChild(img); }
      const infoDiv = document.createElement('div'); infoDiv.classList.add('result-info');
      const title = document.createElement('h2'); title.classList.add('lang-title'); title.textContent = capitalize(result.lang);
      const barContainer = document.createElement('div'); barContainer.classList.add('vote-bar-container');
      const voteBar = document.createElement('div'); voteBar.classList.add('vote-bar');
      const barWidth = maxVotes > 0 ? (result.count / maxVotes) * 100 : 0; voteBar.style.width = barWidth + '%';
      barContainer.appendChild(voteBar); infoDiv.appendChild(title); infoDiv.appendChild(barContainer);
      const votesCountSpan = document.createElement('span'); votesCountSpan.classList.add('result-votes'); votesCountSpan.textContent = result.count;
      item.appendChild(infoDiv); item.appendChild(votesCountSpan); fragment.appendChild(item);
    });
    resultsList.appendChild(fragment);
    // Задержка небольшая, чтобы анимация баров началась после добавления в DOM
    setTimeout(() => {
      // Применяем ширину баров (JS-анимация ширины уже настроена в CSS transition)
      document.querySelectorAll('.vote-bar').forEach(bar => {
        const width = bar.style.width; // Ширина уже установлена
        // Можно вызвать reflow для гарантии старта transition, но обычно браузер справляется
        // bar.offsetHeight; // Пример reflow trick
        // Просто убедимся, что стиль применен
      });
    }, 100); // Небольшая задержка
    applyTheme(body.classList.contains('dark-mode') ? 'dark' : 'light');
  }
  const observer = new MutationObserver(mutations => { mutations.forEach(mutation => { if (mutation.attributeName === 'class') { applyTheme(body.classList.contains('dark-mode') ? 'dark' : 'light'); } }); });
  observer.observe(body, { attributes: true });
});

function getLanguageLogo(lang) { const logos = { python: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg", javascript: "https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png", java: "https://www.vectorlogo.zone/logos/java/java-icon.svg", csharp: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Logo_C_sharp.svg", rust: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Rust_programming_language_black_logo.svg", go: "https://upload.wikimedia.org/wikipedia/commons/0/05/Go_Logo_Blue.svg", cplusplus: "https://upload.wikimedia.org/wikipedia/commons/1/18/ISO_C%2B%2B_Logo.svg", swift: "https://upload.wikimedia.org/wikipedia/commons/9/9d/Swift_logo.svg", kotlin: "https://upload.wikimedia.org/wikipedia/commons/7/74/Kotlin_Icon.svg", php: "https://upload.wikimedia.org/wikipedia/commons/2/27/PHP-logo.svg", ruby: "https://upload.wikimedia.org/wikipedia/commons/7/73/Ruby_logo.svg", assembler: "https://www.svgrepo.com/show/475651/cpu-chip.svg" }; return logos[lang] || null; }
function capitalize(string) { if (!string) return ""; return string.charAt(0).toUpperCase() + string.slice(1); }

// Плавное появление при загрузке
document.addEventListener('DOMContentLoaded', () => {
  body.style.opacity = 0;
  requestAnimationFrame(() => {
    body.style.transition = 'opacity 0.5s ease-in';
    body.style.opacity = 1;
  });
});
