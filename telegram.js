// Telegram Bot Configuration
const TELEGRAM_CONFIG = {
  // Замените на ваш токен бота
  BOT_TOKEN: '8011987006:AAF5_fZIvveiYaWLETxii69sXRFIH0FYZG0',
  // Замените на ID чата куда отправлять сообщения
  CHAT_ID: '297909649'
};

// Функция для отправки сообщения в Telegram
async function sendTelegramMessage(message) {
  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_CONFIG.BOT_TOKEN}/sendMessage`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CONFIG.CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      })
    });

    const result = await response.json();
    
    if (result.ok) {
      console.log('Сообщение отправлено в Telegram');
      return true;
    } else {
      console.error('Ошибка отправки в Telegram:', result);
      return false;
    }
  } catch (error) {
    console.error('Ошибка при отправке в Telegram:', error);
    return false;
  }
}

// Функция для форматирования сообщения о RSVP
function formatRSVPMessage(formData) {
  const name = formData.get('name');
  const willAttend = formData.get('willAttend');
  const allergies = formData.get('allergies');
  const creative = formData.get('creative');
  const drink = formData.get('drink');
  
  // Отладочная информация
  console.log('Данные для Telegram сообщения:', {
    name,
    willAttend,
    allergies,
    creative,
    drink
  });
  
  const emoji = willAttend === 'Обязательно буду!' ? '✅' : '❌';
  const status = willAttend === 'Обязательно буду!' ? 'ПРИДЁТ' : 'НЕ ПРИДЁТ';
  
  let message = `
🎉 <b>НОВЫЙ ОТВЕТ НА СВАДЬБУ!</b>

👤 <b>Имя:</b> ${name}
${emoji} <b>Статус:</b> ${status}
🍷 <b>Напиток:</b> ${drink || 'Не указано'}`;

  if (allergies && allergies.trim()) {
    message += `\n⚠️ <b>Аллергии:</b> ${allergies}`;
  }

  if (creative && creative.trim()) {
    message += `\n🎭 <b>Творческое поздравление:</b> ${creative}`;
  }

  message += `

    📅 Дата: 25.10.2025 в 18:00
📍 Место: Zagarro Club Resort, Краснодар

⏰ Время отправки: ${new Date().toLocaleString('ru-RU')}`;

  console.log('Сформированное Telegram сообщение:', message);
  return message.trim();
}

// Экспорт функций для использования в основном скрипте
window.TelegramService = {
  sendMessage: sendTelegramMessage,
  formatRSVPMessage: formatRSVPMessage
}; 