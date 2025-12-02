'use client';

import React, {useState, useEffect} from 'react';
import {useMutation} from '@tanstack/react-query';
import {useRouter} from 'next/navigation';
import {useDispatch} from 'react-redux';

import {setAuthToken} from '@/hooks/cookies';
import {useToast} from '@/hooks/use-toast';
import {api} from '@/services';
import {loginSuccess} from '@/store/slices/authSlice';

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 20 * 60 * 1000; // 20 минут в миллисекундах

const Login = () => {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [loginAttempts, setLoginAttempts] = useState(0);
    const [isLocked, setIsLocked] = useState(false);
    const [lockoutEndTime, setLockoutEndTime] = useState<number | null>(null);
    const [remainingTime, setRemainingTime] = useState<string>('');
    const {toast} = useToast();
    const dispatch = useDispatch();
    const router = useRouter();

    // Проверяем блокировку при загрузке компонента
    useEffect(() => {
        const storedAttempts = localStorage.getItem('loginAttempts');
        const storedLockoutEnd = localStorage.getItem('lockoutEndTime');

        if (storedAttempts) {
            setLoginAttempts(parseInt(storedAttempts));
        }

        if (storedLockoutEnd) {
            const lockoutEnd = parseInt(storedLockoutEnd);
            const now = Date.now();

            if (now < lockoutEnd) {
                setIsLocked(true);
                setLockoutEndTime(lockoutEnd);
            } else {
                // Блокировка истекла, очищаем данные
                localStorage.removeItem('loginAttempts');
                localStorage.removeItem('lockoutEndTime');
            }
        }
    }, []);

    // Таймер обратного отсчета
    useEffect(() => {
        if (!isLocked || !lockoutEndTime) return;

        const interval = setInterval(() => {
            const now = Date.now();
            const remaining = lockoutEndTime - now;

            if (remaining <= 0) {
                setIsLocked(false);
                setLockoutEndTime(null);
                setLoginAttempts(0);
                localStorage.removeItem('loginAttempts');
                localStorage.removeItem('lockoutEndTime');
                setRemainingTime('');
            } else {
                const minutes = Math.floor(remaining / 60000);
                const seconds = Math.floor((remaining % 60000) / 1000);
                setRemainingTime(`${minutes}:${seconds.toString().padStart(2, '0')}`);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [isLocked, lockoutEndTime]);

    const {mutate: loginMutate, isLoading}: any = useMutation<
        { user: any; accessToken: string },
        Error,
        { phone: string; password: string },
        unknown
    >({
        mutationFn: api.login,
        onSuccess: (data) => {
            // Успешный вход - сбрасываем счетчик попыток
            setLoginAttempts(0);
            localStorage.removeItem('loginAttempts');
            localStorage.removeItem('lockoutEndTime');

            dispatch(loginSuccess({user: data.user, accessToken: data.accessToken}));
            setAuthToken(data.accessToken);

            toast({
                variant: 'default',
                title: 'Вход выполнен успешно',
                description: 'Вы успешно вошли в систему.',
            });

            router.push('/');
        },
        onError: (error: any) => {
            // Увеличиваем счетчик неудачных попыток
            const newAttempts = loginAttempts + 1;
            setLoginAttempts(newAttempts);
            localStorage.setItem('loginAttempts', newAttempts.toString());

            // Проверяем, достигнут ли лимит попыток
            if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
                const lockoutEnd = Date.now() + LOCKOUT_DURATION;
                setIsLocked(true);
                setLockoutEndTime(lockoutEnd);
                localStorage.setItem('lockoutEndTime', lockoutEnd.toString());

                toast({
                    variant: 'destructive',
                    title: 'Превышен лимит попыток входа',
                    description: 'Ваш аккаунт заблокирован на 20 минут из-за множественных неудачных попыток входа.',
                });
            } else {
                // Переводим ошибки на русский
                let errorMessage = 'Произошла ошибка при входе.';
                
                // Функция для проверки английского текста
                const isEnglishText = (text: string) => /^[a-zA-Z\s\d\(\)'\-\.,:;!?]+$/.test(text);
                
                if (error.response?.data?.message) {
                    const backendMessage = error.response.data.message;
                    if (backendMessage.includes('Invalid credentials') || backendMessage.includes('Неверные учетные данные')) {
                        errorMessage = 'Неверный телефон или пароль.';
                    } else if (backendMessage.includes('User not found') || backendMessage.includes('Пользователь не найден')) {
                        errorMessage = 'Пользователь с таким номером телефона не найден.';
                    } else if (backendMessage.includes('Cannot read properties')) {
                        errorMessage = 'Ошибка при обработке данных.';
                    } else if (isEnglishText(backendMessage)) {
                        // Если сообщение на английском и мы не знаем как его перевести
                        errorMessage = 'Произошла ошибка при входе.';
                    } else {
                        // Если сообщение уже на русском
                        errorMessage = backendMessage;
                    }
                } else if (error.message) {
                    if (isEnglishText(error.message)) {
                        errorMessage = 'Произошла ошибка при входе.';
                    } else {
                        errorMessage = error.message;
                    }
                }

                const attemptsLeft = MAX_LOGIN_ATTEMPTS - newAttempts;
                toast({
                    variant: 'destructive',
                    title: 'Ошибка входа',
                    description: `${errorMessage} Осталось попыток: ${attemptsLeft}`,
                });
            }
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isLocked) {
            toast({
                variant: 'destructive',
                title: 'Аккаунт заблокирован',
                description: `Попробуйте снова через ${remainingTime}`,
            });
            return;
        }

        // Убираем все нецифровые символы перед отправкой
        const cleanPhone = phone.replace(/\D/g, '');

        loginMutate({phone: `+${cleanPhone}`, password});
    };

    return (
        <div className="h-[calc(100vh-170px)] flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 mx-2">
                <h2 className="text-2xl mb-6 text-center text-gray-900">Вход</h2>
                
                {isLocked && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-800 text-sm text-center">
                            Аккаунт заблокирован на {remainingTime}
                        </p>
                        <p className="text-red-600 text-xs text-center mt-1">
                            Слишком много неудачных попыток входа
                        </p>
                    </div>
                )}

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-gray-700 mb-1" htmlFor="phone">
                            Телефон
                        </label>
                        <input
                            id="phone"
                            type="tel"
                            value={phone}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '');
                                let formatted = '+7';
                                if (value.length > 1) {
                                    formatted += ' (' + value.substring(1, 4);
                                }
                                if (value.length >= 5) {
                                    formatted += ') ' + value.substring(4, 7);
                                }
                                if (value.length >= 8) {
                                    formatted += '-' + value.substring(7, 9);
                                }
                                if (value.length >= 10) {
                                    formatted += '-' + value.substring(9, 11);
                                }
                                setPhone(formatted);
                            }}
                            placeholder="+7 (___) ___-__-__"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                            maxLength={18}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-1" htmlFor="password">
                            Пароль
                        </label>
                        <input
                            id="password"
                            type="password"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                            placeholder="Введите пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full brand-bg text-white py-2 rounded-lg font-semibold hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isLoading || isLocked}
                    >
                        {isLoading ? 'Вход...' : isLocked ? 'Заблокировано' : 'Войти'}
                    </button>
                    <div className="text-center mt-4">
                        <a href="/register" className="hover:underline">
                            Нет аккаунта? Зарегистрироваться
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
