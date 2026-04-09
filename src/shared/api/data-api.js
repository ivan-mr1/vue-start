import { apiClient } from './base';
import { buildApiParams } from './utils';

const isDev = import.meta.env.DEV;

// Dev-конфигурация (ключи и реальные URL)
const TMDB_URL = import.meta.env.VITE_REMOTE_CONTENT_API_URL;
const TMDB_KEY = import.meta.env.VITE_REMOTE_CONTENT_API_KEY;

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
