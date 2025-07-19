function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // Отладочная информация - логируем все параметры
  console.log('Полученные параметры:', e.parameter);
  
  // Получаем все параметры из формы
  var timestamp = new Date();
  var name = e.parameter.name || '';
  var willAttend = e.parameter.willAttend || '';
  var allergies = e.parameter.allergies || '';
  var creative = e.parameter.creative || '';
  var drink = e.parameter.drink || '';
  
  // Логируем обработанные данные
  console.log('Обработанные данные:', {
    timestamp: timestamp,
    name: name,
    willAttend: willAttend,
    allergies: allergies,
    creative: creative,
    drink: drink
  });
  
  // Добавляем строку с данными
  sheet.appendRow([
    timestamp,        // Время отправки
    name,            // Имя и фамилия
    willAttend,      // Статус участия
    allergies,       // Аллергии
    creative,        // Творческое поздравление
    drink            // Предпочтения по напиткам
  ]);
  
  console.log('Данные успешно добавлены в таблицу');
  return ContentService.createTextOutput("OK");
}

// Функция для создания заголовков таблицы (запустите один раз)
function createHeaders() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // Устанавливаем заголовки столбцов
  sheet.getRange(1, 1, 1, 6).setValues([
    ['Время отправки', 'Имя и фамилия', 'Статус участия', 'Аллергии', 'Творческое поздравление', 'Напиток']
  ]);
  
  // Делаем заголовки жирными
  sheet.getRange(1, 1, 1, 6).setFontWeight('bold');
  
  // Автоматически подгоняем ширину столбцов
  sheet.autoResizeColumns(1, 6);
  
  console.log('Заголовки таблицы созданы');
}

// Функция для тестирования (запустите для проверки)
function testFunction() {
  console.log('Google Apps Script работает корректно');
  return 'OK';
} 