import { sendProxyRequest } from '@/utils/proxy';

export default async function handler(req, res) {
  const API_KEY = process.env.REMOTE_CONTENT_API_KEY;
  const TARGET_URL = process.env.REMOTE_CONTENT_API_URL;

  return sendProxyRequest(res, {
    url: TARGET_URL,
    method: req.method,
    query: { ...req.query, appid: API_KEY },
    body: req.body,
    errorPrefix: 'ExternalService',
  });
}
