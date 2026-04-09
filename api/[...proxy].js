import { sendProxyRequest } from './utils/proxy.js';

export default async function handler(req, res) {
  const API_KEY = process.env.REMOTE_CONTENT_API_KEY;
  const TARGET_URL = process.env.REMOTE_CONTENT_API_URL;
  const { proxy, ...queryParams } = req.query;

  // Логирование
  console.log('[Proxy Handler]', {
    proxy,
    method: req.method,
    hasApiKey: !!API_KEY,
    hasTargetUrl: !!TARGET_URL,
  });

  // Проверяем наличие обязательных переменных окружения
  if (!API_KEY || !TARGET_URL) {
    return res.status(500).json({
      error: 'Server configuration error: Missing REMOTE_CONTENT_API_KEY or REMOTE_CONTENT_API_URL',
    });
  }

  // proxy должна быть массивом вида: ['proxy', 'tmdb', ...остальное]
  if (!Array.isArray(proxy) || proxy.length < 3) {
    return res.status(400).json({ error: 'Invalid proxy path format' });
  }

  if (proxy[0] !== 'proxy' || proxy[1] !== 'tmdb') {
    return res
      .status(400)
      .json({ error: `Expected /api/proxy/tmdb/..., got /api/${proxy.join('/')}` });
  }

  // Восстанавливаем путь после /tmdb/
  const path = '/' + proxy.slice(2).join('/');

  console.log('[Proxy Handler] Requesting:', TARGET_URL + path);

  return sendProxyRequest(res, {
    url: TARGET_URL + path,
    method: req.method,
    query: { ...queryParams, api_key: API_KEY },
    body: req.body,
    errorPrefix: 'TMDB Proxy',
  });
}
