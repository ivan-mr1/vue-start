import { apiClient } from './base';
import { buildApiParams } from './utils';

const isDev = import.meta.env.DEV;

// Dev-конфигурация (ключи и реальные URL)
const TMDB_URL = import.meta.env.VITE_REMOTE_CONTENT_API_URL;
const TMDB_KEY = import.meta.env.VITE_REMOTE_CONTENT_API_KEY;
const MOKKI_URL = import.meta.env.VITE_REMOTE_STORAGE_API_URL;
const MOKKI_TOKEN = import.meta.env.VITE_REMOTE_STORAGE_API_TOKEN;

/**
 * Универсальная функция для запросов к TMDB
 * Dev → прямой запрос с ключом
 * Prod → через серверный proxy
 */
const callTmdbApi = (path, params = {}) => {
  if (isDev) {
    // Dev режим: ключ виден
    const devParams = buildApiParams(params, TMDB_KEY, 'api_key');
    return apiClient.get(`${TMDB_URL}${path}`, { params: devParams });
  }

  // Prod режим: proxy скрывает ключ
  return apiClient.get(`/proxy/tmdb${path}`, { params });
};

/** Поиск фильмов */
export const searchMovie = (query) => {
  const params = { language: 'ru-RU', query };
  return callTmdbApi('/3/search/movie', params);
};

/** Универсальная функция для работы с Mokki */
const callMokkiApi = (path, method = 'get', data = null) => {
  if (isDev) {
    const headers = { Authorization: `Bearer ${MOKKI_TOKEN}` };
    if (['post', 'put', 'patch'].includes(method)) {
      return apiClient[method](`${MOKKI_URL}${path}`, data, { headers });
    }
    return apiClient[method](`${MOKKI_URL}${path}`, { headers });
  }

  // Prod режим: proxy скрывает ключ и URL
  return apiClient[method](`/proxy/mokki${path}`, data);
};

/** Работа со списком (Mokki) */
export const storageApi = {
  getList: () => callMokkiApi('/mylist'),
  addItem: (item) => callMokkiApi('/mylist', 'post', item),
  removeItem: (id) => callMokkiApi(`/mylist/${id}`, 'delete'),
};

// import { apiClient } from './base';
// import { buildApiParams } from './utils';

// const isDev = import.meta.env.DEV;

// // Конфигурация для Dev-режима
// const TMDB_URL = import.meta.env.VITE_REMOTE_CONTENT_API_URL;
// const TMDB_KEY = import.meta.env.VITE_REMOTE_CONTENT_API_KEY;
// const MOKKI_URL = import.meta.env.VITE_REMOTE_STORAGE_API_URL;
// const MOKKI_TOKEN = import.meta.env.VITE_REMOTE_STORAGE_API_TOKEN;

// /**
//  * Вспомогательная функция для переключения между Dev и Prod
//  */
// const callApi = async (prodUrl, devUrl, method = 'get', config = {}) => {
//   const url = isDev ? devUrl : prodUrl;

//   // Добавляем авторизацию для Mokki в Dev-режиме, если URL совпадает
//   if (isDev && devUrl.includes(MOKKI_URL)) {
//     config.headers = {
//       ...config.headers,
//       Authorization: `Bearer ${MOKKI_TOKEN}`,
//     };
//   }

//   // Axios: params/data зависят от метода
//   if (['post', 'put', 'patch'].includes(method.toLowerCase())) {
//     const { data, ...restConfig } = config;
//     return apiClient[method](url, data, restConfig);
//   }

//   return apiClient[method](url, config);
// };

// /** Поиск фильмов */
// export const searchMovie = (query) => {
//   const params = { language: 'ru-RU' };

//   if (isDev) {
//     const devParams = buildApiParams({ query, ...params }, TMDB_KEY, 'api_key');
//     return apiClient.get(`${TMDB_URL}/3/search/movie`, { params: devParams });
//   }

//   return apiClient.get('/search', { params: { q: query } });
// };

// /** Взаимодействие со списком (Mokki) */
// export const storageApi = {
//   getList: () => callApi('/mylist', MOKKI_URL),

//   addItem: (data) => callApi('/mylist', MOKKI_URL, 'post', { data }),

//   removeItem: (id) => callApi('/mylist', `${MOKKI_URL}/${id}`, 'delete', { params: { id } }),
// };
