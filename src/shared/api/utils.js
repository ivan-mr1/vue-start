/**
 * Формирует URLSearchParams для запроса
 * Можно добавлять API ключи и фильтровать пустые значения
 *
 * @param {Object} params - параметры запроса
 * @param {string|null} apiKey - ключ API (опционально)
 * @param {string|null} keyName - имя ключа в URL (например, 'api_key')
 * @returns {URLSearchParams}
 */
export const buildApiParams = (params = {}, apiKey = null, keyName = null) => {
  const searchParams = new URLSearchParams();

  // Добавляем обычные параметры
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value);
    }
  });

  // Добавляем ключ, если передан
  if (apiKey && keyName) {
    searchParams.append(keyName, apiKey);
  }

  return searchParams;
};
