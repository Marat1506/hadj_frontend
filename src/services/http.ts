import axios from 'axios';

import {getCookie, setAuthToken} from '@/hooks/cookies';

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

const http = axios.create({
    baseURL,
    withCredentials: true,
    timeout: 10000,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
});

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Уведомляем всех ожидающих запросов о новом токене
function onRefreshed(token: string) {
    refreshSubscribers.forEach((cb) => cb(token));
    refreshSubscribers = [];
}

// Добавляем запрос к очереди
function addRefreshSubscriber(callback: (token: string) => void) {
    refreshSubscribers.push(callback);
}

http.interceptors.request.use((config) => {
    const token = getCookie('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

// Словарь для перевода ошибок
const errorTranslations: Record<string, string> = {
    'Network Error': 'Ошибка сети. Проверьте подключение к интернету.',
    'timeout': 'Превышено время ожидания ответа от сервера.',
    'Request failed with status code 400': 'Неверный запрос.',
    'Request failed with status code 401': 'Необходима авторизация.',
    'Request failed with status code 403': 'Доступ запрещен.',
    'Request failed with status code 404': 'Ресурс не найден.',
    'Request failed with status code 500': 'Внутренняя ошибка сервера.',
    'Invalid credentials': 'Неверный логин или пароль.',
    'User not found': 'Пользователь не найден.',
    'Email already exists': 'Пользователь с таким email уже существует.',
    'Phone already exists': 'Пользователь с таким номером телефона уже существует.',
};

function translateError(error: any): any {
    if (error.message && errorTranslations[error.message]) {
        error.message = errorTranslations[error.message];
    }
    
    if (error.response?.data?.message) {
        const backendMessage = error.response.data.message;
        if (typeof backendMessage === 'string' && errorTranslations[backendMessage]) {
            error.response.data.message = errorTranslations[backendMessage];
        }
    }
    
    return error;
}

http.interceptors.response.use(
    (response) => response,
    async (error) => {
        const token = getCookie('token');
        const originalRequest = error.config;
        if (!token) return translateError(error);

        if ((error.response && error.response.status === 401) && !originalRequest._retry) {
            originalRequest._retry = true;

            if (isRefreshing) {
                // если уже идёт refresh-запрос, ждём, пока он завершится
                return new Promise((resolve) => {
                    addRefreshSubscriber((newToken) => {
                        originalRequest.headers.Authorization = `Bearer ${newToken}`;
                        resolve(http(originalRequest));
                    });
                });
            }

            isRefreshing = true;

            try {
                // Запрос на обновление токена
                const refreshResponse = await axios.get(`${baseURL}/users/refresh`, {
                    withCredentials: true,
                    headers: {'Content-Type': 'application/json'},
                });


                const newAccessToken = refreshResponse.data.accessToken;
                console.log(newAccessToken);
                setAuthToken(newAccessToken);

                // Обновляем заголовки
                http.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
                onRefreshed(newAccessToken);


                // Повторяем оригинальный запрос
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return http(originalRequest);
            } catch (refreshError) {
                console.error('Refresh token error:', refreshError);
                return Promise.reject(translateError(refreshError));
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(translateError(error));
    }
);

export default http;
