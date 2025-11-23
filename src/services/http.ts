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

http.interceptors.response.use(
    (response) => response,
    async (error) => {
        const token = getCookie('token');
        const originalRequest = error.config;
        if (!token) return

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
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default http;
