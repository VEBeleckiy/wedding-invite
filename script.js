// Обработка фотографий
function handleImageLoad() {
  const images = document.querySelectorAll('.couple-photo');
  images.forEach(img => {
    img.addEventListener('load', function() {
      // Фото загрузилось успешно, скрываем эмодзи
      const placeholder = this.parentElement.querySelector('.photo-placeholder');
      if (placeholder) {
        placeholder.style.display = 'none';
      }
    });
    
    img.addEventListener('error', function() {
      // Фото не загрузилось, показываем эмодзи
      const placeholder = this.parentElement.querySelector('.photo-placeholder');
      if (placeholder) {
        placeholder.style.display = 'flex';
      }
      this.style.display = 'none';
    });
  });
}

// Функция для автоматического уменьшения размера шрифта
function adjustFontSize() {
  const names = document.querySelectorAll('.groom-name, .bride-name');
  const container = document.querySelector('.names-container');
  
  if (!container) return;
  
  const containerWidth = container.offsetWidth - 20; // Учитываем padding
  
  names.forEach(name => {
    // Сбрасываем размер к базовому
    name.style.fontSize = '';
    
    // Проверяем, помещается ли текст
    while (name.scrollWidth > containerWidth && parseInt(getComputedStyle(name).fontSize) > 20) {
      const currentSize = parseInt(getComputedStyle(name).fontSize);
      name.style.fontSize = (currentSize - 5) + 'px';
    }
  });
}

// Таймер обратного отсчета
function updateCountdown() {
  const weddingDate = new Date('2025-10-25T18:00:00');
  const now = new Date();
  const difference = weddingDate - now;

  if (difference > 0) {
    const weeks = Math.floor(difference / (1000 * 60 * 60 * 24 * 7));
    const days = Math.floor((difference % (1000 * 60 * 60 * 24 * 7)) / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

    // Обновляем элементы таймера в hero секции
    const weeksElement = document.getElementById('weeks');
    const daysElement = document.getElementById('days');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    
    if (weeksElement) weeksElement.textContent = weeks;
    if (daysElement) daysElement.textContent = days;
    if (hoursElement) hoursElement.textContent = hours;
    if (minutesElement) minutesElement.textContent = minutes;
    
    // Также обновляем старый таймер если он есть
    const oldDaysElement = document.querySelector('#countdown .countdown-item:nth-child(1) .number');
    const oldHoursElement = document.querySelector('#countdown .countdown-item:nth-child(2) .number');
    const oldMinutesElement = document.querySelector('#countdown .countdown-item:nth-child(3) .number');
    const oldSecondsElement = document.querySelector('#countdown .countdown-item:nth-child(4) .number');
    
    if (oldDaysElement) oldDaysElement.textContent = days;
    if (oldHoursElement) oldHoursElement.textContent = hours;
    if (oldMinutesElement) oldMinutesElement.textContent = minutes;
    if (oldSecondsElement) {
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      oldSecondsElement.textContent = seconds;
    }
  } else {
    // Если свадьба уже прошла
    const countdownElements = document.querySelectorAll('#countdown, .countdown-section');
    countdownElements.forEach(element => {
      element.innerHTML = '<p style="font-size: 1.2rem; color: #000;">Сегодня наш день! 🎉</p>';
    });
  }
}

// Обновляем таймер каждую секунду
setInterval(updateCountdown, 1000);
updateCountdown(); // Запускаем сразу

// Обработка формы
const rsvpForm = document.getElementById('rsvp-form');
const submitBtn = rsvpForm.querySelector('.submit-btn');

// Универсальная функция с повторными попытками
async function retryAsync(fn, maxAttempts = 10, delay = 500) {
  let lastError;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const result = await fn();
      if (result !== false && result !== undefined) return result;
    } catch (err) {
      lastError = err;
    }
    await new Promise(res => setTimeout(res, delay));
  }
  throw lastError || new Error('Не удалось выполнить операцию после нескольких попыток');
}

rsvpForm.addEventListener('submit', async e => {
  e.preventDefault();
  submitBtn.disabled = true;
  const formData = new FormData(e.target);
  const params = new URLSearchParams();
  
  // Собираем данные для отправки
  const dataToSend = {};
  
  // Принудительно добавляем все поля, даже пустые
  const allFields = ['name', 'willAttend', 'allergies', 'creative', 'drink'];
  
  allFields.forEach(field => {
    const value = formData.get(field) || '';
    params.append(field, value);
    dataToSend[field] = value;
  });

  // Отладочная информация - показываем что отправляется
  console.log('Данные для отправки в Google таблицу:', dataToSend);
  console.log('URL параметры:', params.toString());
  
  // Проверяем, что все обязательные поля заполнены
  const requiredFields = ['name', 'willAttend'];
  const missingFields = requiredFields.filter(field => !dataToSend[field]);
  
  if (missingFields.length > 0) {
    alert('Пожалуйста, заполните все обязательные поля: ' + missingFields.join(', '));
    submitBtn.disabled = false;
    return;
  }

  // Retry отправка в Google таблицу
  let googleResponse;
  try {
    googleResponse = await retryAsync(() => fetch('https://script.google.com/macros/s/AKfycbzr_G1g10OMvbNQ5Xb3aizFUrCnxGwqpQ-boM8suhzWX4AHK0Yay5I5_-bhpsIvGuK5/exec', {
      method: 'POST',
      body: params
    }), 10, 1000);
  } catch (err) {
    console.error('Ошибка отправки в Google таблицу:', err);
    alert('Ошибка, попробуйте позже');
    submitBtn.disabled = false;
    return;
  }

  if (googleResponse.ok) {
    console.log('Данные успешно отправлены в Google таблицу');
    
    // Retry отправка в Telegram
    const telegramMessage = TelegramService.formatRSVPMessage(formData);
    let telegramSent = false;
    try {
      telegramSent = await retryAsync(() => TelegramService.sendMessage(telegramMessage), 10, 1000);
    } catch (err) {
      console.error('Ошибка отправки в Telegram:', err);
    }
    
    // Показываем результат пользователю
    const thanksElement = document.getElementById('thanks');
    if (telegramSent) {
      thanksElement.textContent = 'Спасибо! Ваш ответ сохранён и отправлен в Telegram.';
    } else {
      thanksElement.textContent = 'Спасибо! Ваш ответ сохранён.';
    }
    thanksElement.style.display = '';

    // Делаем все поля формы только для чтения/disabled
    rsvpForm.querySelectorAll('input, textarea').forEach(el => {
      if (el.type === 'radio' || el.type === 'checkbox') {
        el.disabled = true;
      } else {
        el.readOnly = true;
      }
    });
    submitBtn.classList.add('sent'); // на всякий случай для кастомных стилей
    submitBtn.disabled = true;

    setTimeout(() => {
      thanksElement.style.display = 'none';
    }, 3000);
    // e.target.reset(); // Не сбрасываем, чтобы показать введённые данные
  } else {
    console.error('Ошибка отправки в Google таблицу:', googleResponse.status, googleResponse.statusText);
    const responseText = await googleResponse.text();
    console.error('Ответ сервера:', responseText);
    alert('Ошибка, попробуйте позже');
    submitBtn.disabled = false;
  }
});

// Инициализация обработки фотографий и адаптации размера шрифта после загрузки страницы
document.addEventListener('DOMContentLoaded', function() {
  handleImageLoad();
  adjustFontSize();
  
  // Адаптируем размер при изменении размера окна
  window.addEventListener('resize', adjustFontSize);
});
