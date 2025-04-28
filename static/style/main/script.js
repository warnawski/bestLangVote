// --- Весь JavaScript остается без изменений ---
// ... (включая переключение темы, инициализацию, голосование, конфетти, observer'ы) ...

// --- Глобальные переменные и кэширование ---
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const themeIcon = themeToggle.querySelector('i');
const votingGrid = document.getElementById('votingGrid');
const confettiContainer = document.querySelector('.confetti-container');
let votes = {};

// --- Логика Переключения Темы ---
const savedTheme = localStorage.getItem('theme');
function applyTheme(theme) {
  body.classList.toggle('dark-mode', theme === 'dark');
  themeIcon.classList.toggle('fa-sun', theme === 'dark');
  themeIcon.classList.toggle('fa-moon', theme !== 'dark');
  // Обновляем фильтр логотипов
  document.querySelectorAll('.lang-logo').forEach(img => {
    if (!img.parentElement.classList.contains('language-card') || img.parentElement.dataset.lang !== 'assembler') {
      img.style.filter = body.classList.contains('dark-mode') ? 'var(--logo-filter-dark)' : 'var(--logo-filter-light)';
    } else {
      // Принудительно пересчитываем стиль для Ассемблера при смене темы
      const asmLogo = document.querySelector('.language-card[data-lang="assembler"] .lang-logo');
      if (asmLogo) {
        const currentFilter = getComputedStyle(asmLogo).filter; // Получаем текущий вычисленный фильтр
        // Можно добавить проверку, чтобы не переписывать каждый раз, но пока так для простоты
      }
    }
  });
}
applyTheme(savedTheme || 'light');

themeToggle.addEventListener('click', () => {
  const newTheme = body.classList.contains('dark-mode') ? 'light' : 'dark';
  applyTheme(newTheme);
  localStorage.setItem('theme', newTheme);
});

// --- Инициализация Голосов ---
document.querySelectorAll('.language-card').forEach(card => {
  const lang = card.dataset.lang;
  if (!lang) return;
  const savedVotes = localStorage.getItem(`votes_${lang}`);
  votes[lang] = savedVotes ? parseInt(savedVotes, 10) : 0;
  const countElement = document.getElementById(`votes-${lang}`);
  if (countElement) countElement.textContent = votes[lang];
  else console.error(`Element with ID votes-${lang} not found!`);
});

// --- Логика Голосования (Event Delegation) ---
votingGrid.addEventListener('click', (event) => {
  const button = event.target.closest('.vote-button');
  if (!button) return;
  const lang = button.dataset.target;
  const countElement = document.getElementById(`votes-${lang}`);
  const cardElement = button.closest('.language-card');
  if (lang && votes.hasOwnProperty(lang) && countElement && cardElement) {
    votes[lang]++;
    countElement.textContent = votes[lang];
    localStorage.setItem(`votes_${lang}`, votes[lang]);
    countElement.classList.add('updated');
    setTimeout(() => countElement.classList.remove('updated'), 500);
    launchFullscreenConfetti();
    cardElement.classList.add('highlight-vote');
    setTimeout(() => cardElement.classList.remove('highlight-vote'), 600);
    body.classList.add('flash-effect');
    requestAnimationFrame(() => { setTimeout(() => { body.classList.remove('flash-effect'); }, 50); });
  } else { console.error(`Vote error: lang=${lang}, countElement=${!!countElement}, cardElement=${!!cardElement}, votes[lang]=${votes.hasOwnProperty(lang)}`); }
});

// --- Функция создания Полноэкранного Конфетти ---
function launchFullscreenConfetti() {
  const confettiCount = 100; const fragment = document.createDocumentFragment(); const colors = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6'];
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div'); const randomColorClass = colors[Math.floor(Math.random() * colors.length)];
    confetti.className = `confetti ${randomColorClass}`; confetti.style.left = Math.random() * 100 + 'vw'; confetti.style.top = -20 - (Math.random() * 30) + 'px';
    const randomDuration = Math.random() * 3 + 3; const randomDelay = Math.random() * 1.5;
    confetti.style.animation = `fall ${randomDuration}s ${randomDelay}s linear forwards`; confetti.style.transform = `rotate(${Math.random() * 720 - 360}deg)`;
    fragment.appendChild(confetti); setTimeout(() => confetti.remove(), (randomDuration + randomDelay + 0.1) * 1000);
  } confettiContainer.appendChild(fragment);
}

// Плавное появление при загрузке
document.addEventListener('DOMContentLoaded', () => {
  body.style.opacity = 0; requestAnimationFrame(() => { body.style.transition = 'opacity 0.5s ease-in'; body.style.opacity = 1; });
  applyTheme(body.classList.contains('dark-mode') ? 'dark' : 'light');
});

// Observer для обновления фильтров
const observer = new MutationObserver(mutations => { mutations.forEach(mutation => { if (mutation.attributeName === 'class') { applyTheme(body.classList.contains('dark-mode') ? 'dark' : 'light'); } }); });
observer.observe(body, { attributes: true });