import Cookies from 'js-cookie';

// Cookie management utilities
export const getCookie = (name: string): string | null => {
    return Cookies.get(name) || null;
};

export const setCookie = (name: string, value: string, days: number = 7): void => {
    Cookies.set(name, value, {expires: days, path: '/', sameSite: 'Strict'});
};

export const deleteCookie = (name: string): void => {
    Cookies.remove(name, {path: '/'});
};

export const createCookies = (name: string, value: string, days: number = 7): void => {
    setCookie(name, value, days);
};

export const deleteCookies = (name: string): void => {
    deleteCookie(name);
};

// Token-specific utilities
export const getAuthToken = (): string | null => {
    return getCookie('token');
};

export const setAuthToken = (token: string, days: number = 7): void => {
    setCookie('token', token, days);
};

export const removeAuthToken = (): void => {
    deleteCookie('token');
};

export const isAuthenticated = (): boolean => {
    return getAuthToken() !== null;
};
