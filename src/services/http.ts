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
    'Request failed with status code 401': 'Необходима авторизация.',
    'Request failed with status code 403': 'Доступ запрещен.',
    'Request failed with status code 404': 'Ресурс не найден.',
    'Request failed with status code 500': 'Внутренняя ошибка сервера.',
    'Invalid credentials': 'Неверный логин или пароль.',
    'User not found': 'Пользователь не найден.',
    'Email already exists': 'Пользователь с таким email уже существует.',
    'Phone already exists': 'Пользователь с таким номером телефона уже существует.',
    'Cannot read properties of undefined': 'Ошибка при обработке данных.',
    'Cannot read property': 'Ошибка при обработке данных.',
    'undefined is not an object': 'Ошибка при обработке данных.',
    'null is not an object': 'Ошибка при обработке данных.',
};

// Функция для проверки, содержит ли строка только английские буквы
function isEnglishText(text: string): boolean {
    return /^[a-zA-Z\s\d\(\)'\-\.,:;!?]+$/.test(text);
}

function translateError(error: any): any {
    // Переводим основное сообщение ошибки
    if (error.message) {
        // Проверяем точное совпадение
        if (errorTranslations[error.message]) {
            error.message = errorTranslations[error.message];
        } else {
            // Проверяем частичное совпадение
            for (const [key, value] of Object.entries(errorTranslations)) {
                if (error.message.includes(key)) {
                    error.message = value;
                    break;
                }
            }
        }
    }
    
    // Переводим сообщение от backend
    if (error.response?.data?.message) {
        const backendMessage = error.response.data.message;
        if (typeof backendMessage === 'string') {
            // Специальные паттерны для перевода
            if (backendMessage.includes('Account is locked')) {
                // Извлекаем количество минут из сообщения
                const minutesMatch = backendMessage.match(/(\d+)\s+minute/);
                if (minutesMatch) {
                    const minutes = minutesMatch[1];
                    error.response.data.message = `Аккаунт заблокирован. Попробуйте снова через ${minutes} мин.`;
                } else {
                    error.response.data.message = 'Аккаунт заблокирован. Попробуйте позже.';
                }
            } else if (backendMessage.includes('Invalid password')) {
                // Извлекаем количество оставшихся попыток
                const attemptsMatch = backendMessage.match(/(\d+)\s+attempt/);
                if (attemptsMatch) {
                    const attempts = attemptsMatch[1];
                    error.response.data.message = `Неверный пароль. Осталось попыток: ${attempts}`;
                } else {
                    error.response.data.message = 'Неверный пароль.';
                }
            } else if (backendMessage.includes('Too many failed attempts')) {
                error.response.data.message = 'Слишком много неудачных попыток. Аккаунт заблокирован на 5 минут.';
            } else if (errorTranslations[backendMessage]) {
                // Проверяем точное совпадение
                error.response.data.message = errorTranslations[backendMessage];
            } else {
                // Проверяем частичное совпадение
                let translated = false;
                for (const [key, value] of Object.entries(errorTranslations)) {
                    if (backendMessage.includes(key)) {
                        error.response.data.message = value;
                        translated = true;
                        break;
                    }
                }
                // Если не нашли перевод и текст на английском, оставляем как есть
                // (бекенд может отправлять уже переведенные сообщения)
            }
        }
    }
    
    return error;
}

http.interceptors.response.use(
    (response) => response,
    async (error) => {
        console.log('=== HTTP INTERCEPTOR ERROR ===');
        console.log('Error:', error);
        console.log('Error response:', error.response);
        console.log('Error response data:', error.response?.data);
        console.log('Error response status:', error.response?.status);
        
        const token = getCookie('token');
        const originalRequest = error.config;
        if (!token) {
            console.log('No token, translating error');
            return Promise.reject(translateError(error));
        }

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

        console.log('Translating error before reject');
        const translatedError = translateError(error);
        console.log('Translated error:', translatedError);
        console.log('Translated error response data:', translatedError.response?.data);
        return Promise.reject(translatedError);
    }
);

export default http;
