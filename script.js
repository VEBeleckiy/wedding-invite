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
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    // Обновляем элементы таймера в hero секции
    const heroWeeksElement = document.getElementById('hero-weeks');
    const heroDaysElement = document.getElementById('hero-days');
    const heroHoursElement = document.getElementById('hero-hours');
    const heroMinutesElement = document.getElementById('hero-minutes');
    
    if (heroWeeksElement) heroWeeksElement.textContent = weeks;
    if (heroDaysElement) heroDaysElement.textContent = days;
    if (heroHoursElement) heroHoursElement.textContent = hours;
    if (heroMinutesElement) heroMinutesElement.textContent = minutes;
    
    // Обновляем основной таймер
    const mainDaysElement = document.getElementById('main-days');
    const mainHoursElement = document.getElementById('main-hours');
    const mainMinutesElement = document.getElementById('main-minutes');
    const mainSecondsElement = document.getElementById('main-seconds');
    
    if (mainDaysElement) mainDaysElement.textContent = days;
    if (mainHoursElement) mainHoursElement.textContent = hours;
    if (mainMinutesElement) mainMinutesElement.textContent = minutes;
    if (mainSecondsElement) mainSecondsElement.textContent = seconds;
  } else {
    // Если свадьба уже прошла
    const heroCountdown = document.getElementById('hero-countdown');
    const mainCountdown = document.getElementById('main-countdown');
    
    if (heroCountdown) {
      heroCountdown.innerHTML = '<p style="font-size: 1.2rem; color: #000;">Сегодня наш день! 🎉</p>';
    }
    if (mainCountdown) {
      mainCountdown.innerHTML = '<p style="font-size: 1.2rem; color: #000;">Сегодня наш день! 🎉</p>';
    }
  }
}

// Обновляем таймер каждую секунду
setInterval(updateCountdown, 1000);
updateCountdown(); // Запускаем сразу

// Обработка полей с детьми
function handleChildrenFields() {
  document.addEventListener('change', function(e) {
    if (e.target.name && e.target.name.startsWith('hasChildren_')) {
      const form = e.target.closest('form');
      const childrenFields = form.querySelectorAll('.children-fields');
      
      if (e.target.value === 'да') {
        childrenFields.forEach(field => {
          field.style.display = 'block';
        });
      } else {
        childrenFields.forEach(field => {
          field.style.display = 'none';
          // Очищаем поля
          const inputs = field.querySelectorAll('input, textarea');
          inputs.forEach(input => input.value = '');
        });
      }
    }
  });
}

// Функция для создания новой формы гостя
function createGuestForm(index) {
  const isAdditionalGuest = index > 0;
  const attendanceGroup = isAdditionalGuest ? `
    <div class="form-group attendance-group">
      <label>Подтвердите присутствие</label>
      <div class="radio-group">
        <label class="radio-option">
          <input type="radio" name="willAttend_${index}" value="Обязательно буду!" required checked>
          <span>Обязательно буду!</span>
        </label>
      </div>
    </div>
  ` : `
    <div class="form-group attendance-group">
      <label>Подтвердите присутствие</label>
      <div class="radio-group">
        <label class="radio-option">
          <input type="radio" name="willAttend_${index}" value="Обязательно буду!" required>
          <span>Обязательно буду!</span>
        </label>
        <label class="radio-option">
          <input type="radio" name="willAttend_${index}" value="К сожалению, не смогу">
          <span>К сожалению, не смогу</span>
        </label>
      </div>
    </div>
  `;

  return `
    <form class="guest-form-single" data-form-index="${index}">
      <div class="form-group">
        <label for="name-${index}">Имя и фамилия</label>
        <input type="text" id="name-${index}" name="name_${index}" required>
      </div>

      ${attendanceGroup}

      <div class="form-group">
        <label>Будет ли с вами на празднике ребенок?</label>
        <div class="radio-group">
          <label class="radio-option">
            <input type="radio" name="hasChildren_${index}" value="да">
            <span>Да</span>
          </label>
          <label class="radio-option">
            <input type="radio" name="hasChildren_${index}" value="нет" checked>
            <span>Нет</span>
          </label>
        </div>
      </div>

      <div class="form-group children-fields" style="display: none;">
        <label for="childrenCount-${index}">Сколько детей?</label>
        <input type="number" id="childrenCount-${index}" name="childrenCount_${index}" min="1" max="10">
      </div>

      <div class="form-group children-fields" style="display: none;">
        <label for="childrenAge-${index}">Какого возраста?</label>
        <textarea id="childrenAge-${index}" name="childrenAge_${index}" placeholder="Например: 5 лет, 8 лет"></textarea>
      </div>

      <div class="form-group">
        <label for="allergies-${index}">Есть ли аллергические реакции?</label>
        <textarea id="allergies-${index}" name="allergies_${index}" placeholder="Если да, то напишите какие, чтобы мы позаботились о вас."></textarea>
      </div>

      <div class="form-group">
        <label for="creative-${index}">Планируете поздравлять творчески?</label>
        <textarea id="creative-${index}" name="creative_${index}" placeholder="Если да то оставьте ваш номер телефона."></textarea>
      </div>

      <div class="form-group">
        <label>Ваши предпочтения по напиткам</label>
        <div class="radio-group">
          <label class="radio-option">
            <input type="radio" name="drink_${index}" value="Крепкий алкоголь">
            <span>Крепкий алкоголь</span>
          </label>
          <label class="radio-option">
            <input type="radio" name="drink_${index}" value="Красное вино">
            <span>Красное вино</span>
          </label>
          <label class="radio-option">
            <input type="radio" name="drink_${index}" value="Белое вино">
            <span>Белое вино</span>
          </label>
          <label class="radio-option">
            <input type="radio" name="drink_${index}" value="Безалкогольные напитки">
            <span>Безалкогольные напитки</span>
          </label>
        </div>
      </div>

      <div class="form-buttons">
        <button type="button" class="add-guest-btn">Добавить гостя</button>
      </div>
    </form>
  `;
}

// Функция для обновления текста кнопки отправки
function updateSubmitButtonText() {
  const formsContainer = document.getElementById('forms-container');
  const forms = formsContainer.querySelectorAll('.guest-form-single');
  const submitBtn = document.querySelector('.submit-all-btn');
  
  if (forms.length === 1) {
    submitBtn.textContent = 'ОТПРАВИТЬ';
  } else {
    submitBtn.textContent = 'ОТПРАВИТЬ ВСЕ АНКЕТЫ';
  }
}

// Обработка добавления гостей
function handleAddGuest() {
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('add-guest-btn')) {
      const formsContainer = document.getElementById('forms-container');
      const currentForms = formsContainer.querySelectorAll('.guest-form-single');
      const newIndex = currentForms.length;
      
      const newFormHTML = createGuestForm(newIndex);
      formsContainer.insertAdjacentHTML('beforeend', newFormHTML);
      
      // Удаляем кнопку "Добавить гостя" из предыдущей формы
      const previousForm = currentForms[currentForms.length - 1];
      const previousAddBtn = previousForm.querySelector('.add-guest-btn');
      if (previousAddBtn) {
        previousAddBtn.remove();
      }
      
      // Обновляем текст кнопки отправки
      updateSubmitButtonText();
    }
  });
}

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

// Функция для отправки одной формы
async function submitSingleForm(form) {
  const params = new URLSearchParams();
  
  // Получаем индекс формы
  const formIndex = form.getAttribute('data-form-index');
  
  // Собираем данные только из текущей формы
  const dataToSend = {};
  
  // Принудительно добавляем все поля, даже пустые
  const allFields = ['name', 'willAttend', 'hasChildren', 'childrenCount', 'childrenAge', 'allergies', 'creative', 'drink'];
  
  allFields.forEach(field => {
    const fieldName = field === 'name' ? `name_${formIndex}` : `${field}_${formIndex}`;
    
    if (field === 'drink') {
      // Для напитков ищем выбранную radio кнопку
      const selectedDrink = form.querySelector(`input[name="${fieldName}"]:checked`);
      const value = selectedDrink ? selectedDrink.value : '';
      params.append(field, value);
      dataToSend[field] = value;
    } else {
      const input = form.querySelector(`[name="${fieldName}"]`);
      const value = input ? (input.type === 'radio' ? (input.checked ? input.value : '') : input.value) : '';
      params.append(field, value);
      dataToSend[field] = value;
    }
  });

  // Проверяем, что все обязательные поля заполнены
  const requiredFields = ['name'];
  const missingFields = requiredFields.filter(field => !dataToSend[field]);
  
  if (missingFields.length > 0) {
    throw new Error('Пожалуйста, заполните все обязательные поля: ' + missingFields.join(', '));
  }

  // Отправка в Google таблицу
  const googleResponse = await retryAsync(() => fetch('https://script.google.com/macros/s/AKfycbzr_G1g10OMvbNQ5Xb3aizFUrCnxGwqpQ-boM8suhzWX4AHK0Yay5I5_-bhpsIvGuK5/exec', {
    method: 'POST',
    body: params
  }), 10, 1000);

  if (!googleResponse.ok) {
    throw new Error('Ошибка отправки в Google таблицу');
  }

  // Создаем FormData только для текущей формы для Telegram
  const formDataForTelegram = new FormData();
  allFields.forEach(field => {
    const fieldName = field === 'name' ? `name_${formIndex}` : `${field}_${formIndex}`;
    
    if (field === 'drink') {
      // Для напитков ищем выбранную radio кнопку
      const selectedDrink = form.querySelector(`input[name="${fieldName}"]:checked`);
      const value = selectedDrink ? selectedDrink.value : '';
      formDataForTelegram.append(fieldName, value);
    } else {
      const input = form.querySelector(`[name="${fieldName}"]`);
      const value = input ? (input.type === 'radio' ? (input.checked ? input.value : '') : input.value) : '';
      formDataForTelegram.append(fieldName, value);
    }
  });

  // Отправка в Telegram
  const telegramMessage = TelegramService.formatRSVPMessage(formDataForTelegram);
  await retryAsync(() => TelegramService.sendMessage(telegramMessage), 10, 1000);
  
  return true;
}

// Валидация формы
function validateForm(form) {
  const errors = [];
  const formIndex = form.getAttribute('data-form-index');
  
  // Проверяем обязательные поля
  const nameField = form.querySelector(`[name="name_${formIndex}"]`);
  
  // Сбрасываем стили ошибок
  form.querySelectorAll('.form-group').forEach(group => {
    group.classList.remove('error');
  });
  
  if (!nameField.value.trim()) {
    errors.push('Имя и фамилия');
    nameField.closest('.form-group').classList.add('error');
  }
  
  return errors;
}

// Отправка всех форм
async function submitAllForms() {
  const formsContainer = document.getElementById('forms-container');
  const forms = formsContainer.querySelectorAll('.guest-form-single');
  const submitBtn = document.querySelector('.submit-all-btn');
  
  // Валидируем все формы
  const allErrors = [];
  forms.forEach((form, index) => {
    const errors = validateForm(form);
    if (errors.length > 0) {
      allErrors.push(`Форма ${index + 1}: ${errors.join(', ')}`);
    }
  });
  
  if (allErrors.length > 0) {
    alert('Пожалуйста, исправьте ошибки:\n' + allErrors.join('\n'));
    return;
  }
  
  // Блокируем кнопку
  submitBtn.disabled = true;
  submitBtn.textContent = 'Отправка...';
  
  try {
    // Отправляем каждую форму отдельно
    for (let i = 0; i < forms.length; i++) {
      await submitSingleForm(forms[i]);
    }
    
    // Показываем результат пользователю
    const thanksElement = document.getElementById('thanks');
    thanksElement.textContent = 'Спасибо! Все анкеты сохранены и отправлены в Telegram.';
    thanksElement.style.display = '';

    // Делаем все поля форм только для чтения/disabled
    forms.forEach(form => {
      form.querySelectorAll('input, textarea').forEach(el => {
        if (el.type === 'radio' || el.type === 'checkbox') {
          el.disabled = true;
        } else {
          el.readOnly = true;
        }
      });
    });
    
    // Скрываем кнопки добавления гостей
    document.querySelectorAll('.add-guest-btn').forEach(btn => {
      btn.style.display = 'none';
    });

    setTimeout(() => {
      thanksElement.style.display = 'none';
    }, 5000);
    
  } catch (error) {
    console.error('Ошибка отправки:', error);
    alert(error.message || 'Ошибка, попробуйте позже');
    submitBtn.disabled = false;
    updateSubmitButtonText(); // Восстанавливаем правильный текст кнопки
  }
}

// Обработка отправки всех форм
function handleFormSubmission() {
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('submit-all-btn')) {
      e.preventDefault();
      submitAllForms();
    }
  });
}

// Обработка выбора "не смогу"
function handleWillNotAttend() {
  document.addEventListener('change', function(e) {
    if (e.target.name && e.target.name.startsWith('willAttend_') && e.target.value === 'К сожалению, не смогу') {
      const form = e.target.closest('form');
      
      // Скрываем все поля кроме имени и подтверждения присутствия
      const fieldsToHide = form.querySelectorAll('.form-group:not(:has(input[name*="name"])):not(:has(input[name*="willAttend"]))');
      fieldsToHide.forEach(field => {
        field.style.display = 'none';
        // Очищаем скрытые поля
        const inputs = field.querySelectorAll('input, textarea');
        inputs.forEach(input => {
          if (input.type === 'radio') {
            input.checked = false;
          } else {
            input.value = '';
          }
        });
      });
      
      // Скрываем кнопку "Добавить гостя"
      const addGuestBtn = form.querySelector('.add-guest-btn');
      if (addGuestBtn) {
        addGuestBtn.style.display = 'none';
      }
    } else if (e.target.name && e.target.name.startsWith('willAttend_') && e.target.value === 'Обязательно буду!') {
      const form = e.target.closest('form');
      
      // Показываем все поля обратно
      const fieldsToShow = form.querySelectorAll('.form-group');
      fieldsToShow.forEach(field => {
        field.style.display = 'block';
      });
      
      // Показываем кнопку "Добавить гостя" только в первой форме
      const formIndex = form.getAttribute('data-form-index');
      if (formIndex === '0') {
        const addGuestBtn = form.querySelector('.add-guest-btn');
        if (addGuestBtn) {
          addGuestBtn.style.display = 'block';
        }
      }
    }
  });
}

// Инициализация обработки фотографий и адаптации размера шрифта после загрузки страницы
document.addEventListener('DOMContentLoaded', function() {
  handleImageLoad();
  adjustFontSize();
  handleChildrenFields();
  handleAddGuest();
  handleFormSubmission();
  handleWillNotAttend();
  updateSubmitButtonText(); // Устанавливаем правильный текст кнопки при загрузке
  
  // Адаптируем размер при изменении размера окна
  window.addEventListener('resize', adjustFontSize);
});
