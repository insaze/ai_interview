/**
 * Форматирует дату в удобочитаемый формат.
 * @param {Date|string} date - Дата для форматирования.
 * @returns {string} Отформатированная строка вида "YYYY-MM-DD HH:mm".
 */
export const formatDate = (date) => {
    const d = new Date(date);
    const datePart = d.toISOString().split('T')[0];
    const timePart = d.toTimeString().split(' ')[0];
    return `${datePart} ${timePart}`;
};

/**
 * Проверяет, является ли значение числом и больше нуля.
 * @param {*} value - Значение для проверки.
 * @returns {boolean}
 */
export const isPositiveNumber = (value) => {
    return typeof value === 'number' && !isNaN(value) && value > 0;
};

/**
 * Обрезает строку до заданной длины и добавляет "..." если она длиннее.
 * @param {string} str - Строка для обрезания.
 * @param {number} maxLength - Максимальная длина строки.
 * @returns {string}
 */
export const truncateText = (str, maxLength) => {
    if (typeof str !== 'string') return '';
    return str.length > maxLength ? str.slice(0, maxLength) + '...' : str;
};
