import { sendProxyRequest } from './utils/proxy.js';

export default async function handler(req, res) {
  const API_KEY = process.env.REMOTE_CONTENT_API_KEY;
  const TARGET_URL = process.env.REMOTE_CONTENT_API_URL;
  const { proxy, ...queryParams } = req.query;

  // proxy должна быть массивом вида: ['proxy', 'tmdb', ...остальное]
  if (!Array.isArray(proxy) || proxy.length < 3 || proxy[0] !== 'proxy' || proxy[1] !== 'tmdb') {
    return res.status(400).json({ error: 'Invalid proxy path' });
  }

  // Восстанавливаем путь после /tmdb/
  const path = '/' + proxy.slice(2).join('/');

  return sendProxyRequest(res, {
    url: TARGET_URL + path,
    method: req.method,
    query: { ...queryParams, api_key: API_KEY }, // Исключаем 'proxy' из query
    body: req.body,
    errorPrefix: 'TMDB Proxy',
  });
}
