import { sendProxyRequest } from '@/utils/proxy'; // путь к твоей функции

export default async function handler(req, res) {
  // 1. Конфигурация целевого API (скрываем здесь)
  const TARGET_URL = 'https://api.service.com/v1/endpoint';
  const API_KEY = process.env.MY_SECRET_KEY;

  // 2. Пробрасываем запрос
  return sendProxyRequest(res, {
    url: TARGET_URL,
    method: req.method, // Автоматически подхватит GET, POST и т.д.
    query: {
      ...req.query,
      appid: API_KEY, // Примешиваем ключ в query (или в headers ниже)
    },
    body: req.body, // Пробрасываем тело (актуально для POST)
    headers: {
      // 'Authorization': `Bearer ${API_KEY}` // Если ключ нужен в заголовках
    },
    errorPrefix: 'ExternalService',
  });
}
