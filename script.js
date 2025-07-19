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

// Таймер обратного отсчета
function updateCountdown() {
  const weddingDate = new Date('2025-09-05T15:00:00');
  const now = new Date();
  const difference = weddingDate - now;

  if (difference > 0) {
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = days;
    document.getElementById('hours').textContent = hours;
    document.getElementById('minutes').textContent = minutes;
    document.getElementById('seconds').textContent = seconds;
  } else {
    document.getElementById('countdown').innerHTML = '<p style="font-size: 1.2rem; color: #e74c3c;">Сегодня наш день! 🎉</p>';
  }
}

// Обновляем таймер каждую секунду
setInterval(updateCountdown, 1000);
updateCountdown(); // Запускаем сразу

// Обработка формы
document.getElementById('rsvp-form').addEventListener('submit', async e => {
  e.preventDefault();
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
    return;
  }

  // Отправка в Google таблицу
  const googleResponse = await fetch('https://script.google.com/macros/s/AKfycbzr_G1g10OMvbNQ5Xb3aizFUrCnxGwqpQ-boM8suhzWX4AHK0Yay5I5_-bhpsIvGuK5/exec', {
    method: 'POST',
    body: params
  });

  if (googleResponse.ok) {
    console.log('Данные успешно отправлены в Google таблицу');
    
    // Отправка сообщения в Telegram
    const telegramMessage = TelegramService.formatRSVPMessage(formData);
    const telegramSent = await TelegramService.sendMessage(telegramMessage);
    
    // Показываем результат пользователю
    const thanksElement = document.getElementById('thanks');
    if (telegramSent) {
      thanksElement.textContent = 'Спасибо! Ваш ответ сохранён и отправлен в Telegram.';
    } else {
      thanksElement.textContent = 'Спасибо! Ваш ответ сохранён.';
    }
    thanksElement.style.display = '';
    
    // Скрываем сообщение через 3 секунды
    setTimeout(() => {
      thanksElement.style.display = 'none';
    }, 3000);
    
    e.target.reset();
  } else {
    console.error('Ошибка отправки в Google таблицу:', googleResponse.status, googleResponse.statusText);
    const responseText = await googleResponse.text();
    console.error('Ответ сервера:', responseText);
    alert('Ошибка, попробуйте позже');
  }
});

// Инициализация обработки фотографий после загрузки страницы
document.addEventListener('DOMContentLoaded', handleImageLoad);
