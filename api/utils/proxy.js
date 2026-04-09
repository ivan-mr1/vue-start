export async function sendProxyRequest(
  res,
  {
    url,
    method = 'GET',
    query = {},
    body = null,
    headers = {},
    timeout = 5000,
    errorPrefix = 'API Proxy Error',
  },
) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const apiUrl = new URL(url);

    // Добавляем query-параметры
    Object.entries(query).forEach(([key, value]) => {
      if (value != null) apiUrl.searchParams.set(key, String(value).trim());
    });

    const fetchOptions = { method: method.toUpperCase(), headers, signal: controller.signal };

    if (body && !['GET', 'HEAD'].includes(fetchOptions.method)) {
      fetchOptions.body = typeof body === 'object' ? JSON.stringify(body) : body;
      if (typeof body === 'object' && !fetchOptions.headers['Content-Type']) {
        fetchOptions.headers['Content-Type'] = 'application/json';
      }
    }

    const response = await fetch(apiUrl, fetchOptions);
    const data = await response.json();

    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(500).json({ error: `[${errorPrefix}] ${error.message}` });
  } finally {
    clearTimeout(timeoutId);
  }
}
