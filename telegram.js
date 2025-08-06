// Telegram Bot Configuration
const TELEGRAM_CONFIG = {
  // Замените на ваш токен бота
  BOT_TOKEN: '8011987006:AAF5_fZIvveiYaWLETxii69sXRFIH0FYZG0',
  // Замените на ID чатов куда отправлять сообщения
  CHAT_IDS: ['297909649', '1069685442']
};

// Функция для отправки сообщения в Telegram
async function sendTelegramMessage(message) {
  const url = `https://api.telegram.org/bot${TELEGRAM_CONFIG.BOT_TOKEN}/sendMessage`;
  let successCount = 0;
  let errorCount = 0;
  
  // Отправляем сообщение на все CHAT_ID
  for (const chatId of TELEGRAM_CONFIG.CHAT_IDS) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML'
        })
      });

      const result = await response.json();
      
      if (result.ok) {
        console.log(`Сообщение отправлено в Telegram на chat_id: ${chatId}`);
        successCount++;
      } else {
        console.error(`Ошибка отправки в Telegram на chat_id ${chatId}:`, result);
        errorCount++;
      }
    } catch (error) {
      console.error(`Ошибка при отправке в Telegram на chat_id ${chatId}:`, error);
      errorCount++;
    }
  }
  
  // Возвращаем true если хотя бы одно сообщение отправлено успешно
  if (successCount > 0) {
    console.log(`Успешно отправлено: ${successCount}/${TELEGRAM_CONFIG.CHAT_IDS.length} сообщений`);
    return true;
  } else {
    console.error(`Не удалось отправить ни одного сообщения. Ошибок: ${errorCount}`);
    return false;
  }
}

// Функция для форматирования сообщения о RSVP
function formatRSVPMessage(formData) {
  // Получаем все ключи из FormData
  const keys = Array.from(formData.keys());
  
  // Находим данные для текущей формы
  let name = '', willAttend = '', hasChildren = '', childrenCount = '', childrenAge = '', allergies = '', creative = '', drink = '';
  
  keys.forEach(key => {
    if (key === 'name' || key.startsWith('name_')) {
      name = formData.get(key);
    } else if (key === 'willAttend' || key.startsWith('willAttend_')) {
      willAttend = formData.get(key);
    } else if (key === 'hasChildren' || key.startsWith('hasChildren_')) {
      hasChildren = formData.get(key);
    } else if (key === 'childrenCount' || key.startsWith('childrenCount_')) {
      childrenCount = formData.get(key);
    } else if (key === 'childrenAge' || key.startsWith('childrenAge_')) {
      childrenAge = formData.get(key);
    } else if (key === 'allergies' || key.startsWith('allergies_')) {
      allergies = formData.get(key);
    } else if (key === 'creative' || key.startsWith('creative_')) {
      creative = formData.get(key);
    } else if (key === 'drink' || key.startsWith('drink_')) {
      drink = formData.get(key);
    }
  });
  
  // Отладочная информация
  console.log('Данные для Telegram сообщения:', {
    name,
    willAttend,
    hasChildren,
    childrenCount,
    childrenAge,
    allergies,
    creative,
    drink
  });
  
  const emoji = willAttend === 'Обязательно буду!' ? '✅' : '❌';
  const status = willAttend === 'Обязательно буду!' ? 'ПРИДЁТ' : 'НЕ ПРИДЁТ';
  
  let message = `
🎉 <b>НОВЫЙ ОТВЕТ НА СВАДЕБНОЕ ПРИГЛАШЕНИЕ!</b>

👤 <b>Имя:</b> ${name}
${emoji} <b>Статус:</b> ${status}
🍷 <b>Напиток:</b> ${drink || 'Не указано'}`;

  if (hasChildren === 'да') {
    message += `\n👶 <b>Дети:</b> Да`;
    if (childrenCount) {
      message += ` (${childrenCount} ${childrenCount === '1' ? 'ребёнок' : childrenCount < '5' ? 'ребёнка' : 'детей'})`;
    }
    if (childrenAge) {
      message += `\n📏 <b>Возраст детей:</b> ${childrenAge}`;
    }
  } else {
    message += `\n👶 <b>Дети:</b> Нет`;
  }

  if (allergies && allergies.trim()) {
    message += `\n⚠️ <b>Аллергии:</b> ${allergies}`;
  }

  if (creative && creative.trim()) {
    message += `\n🎭 <b>Творческое поздравление:</b> ${creative}`;
  }

  message += `

📅 Дата: 25.10.2025 в 17:30
📍 Место: станица Старонижестеблиевская ул. Советская 78А

⏰ Время отправки: ${new Date().toLocaleString('ru-RU')}`;

  console.log('Сформированное Telegram сообщение:', message);
  return message.trim();
}

// Экспорт функций для использования в основном скрипте
window.TelegramService = {
  sendMessage: sendTelegramMessage,
  formatRSVPMessage: formatRSVPMessage
}; 