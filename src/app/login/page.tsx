'use client';

import React, {useState, useEffect} from 'react';
import {useMutation} from '@tanstack/react-query';
import {useRouter} from 'next/navigation';
import {useDispatch} from 'react-redux';

import {setAuthToken} from '@/hooks/cookies';
import {useToast} from '@/hooks/use-toast';
import {api} from '@/services';
import {loginSuccess} from '@/store/slices/authSlice';

const Login = () => {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const {toast} = useToast();
    const dispatch = useDispatch();
    const router = useRouter();

    const {mutate: loginMutate, isLoading}: any = useMutation<
        { user: any; accessToken: string },
        Error,
        { phone: string; password: string },
        unknown
    >({
        mutationFn: api.login,
        onSuccess: (data) => {
            console.log('=== LOGIN SUCCESS ===');
            console.log('Response data:', data);
            console.log('Data keys:', Object.keys(data || {}));
            
            if (!data || !data.user || !data.accessToken) {
                console.error('Invalid response format:', data);
                toast({
                    variant: 'destructive',
                    title: 'Ошибка',
                    description: 'Неверный формат ответа от сервера',
                });
                return;
            }
            
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
            console.log('=== LOGIN ERROR ===');
            console.log('Error object:', error);
            console.log('Error response:', error.response);
            console.log('Error response data:', error.response?.data);
            console.log('Error response status:', error.response?.status);
            console.log('Error message:', error.message);
            
            // Бекенд теперь управляет блокировкой и счетчиком попыток
            let errorMessage = 'Произошла ошибка при входе.';
                
            // Функция для проверки английского текста
            const isEnglishText = (text: string) => /^[a-zA-Z\s\d\(\)'\-\.,:;!?]+$/.test(text);
            
            if (error.response?.data?.message) {
                const backendMessage = error.response.data.message;
                console.log('Backend message:', backendMessage);
                // Бекенд уже отправляет сообщения на русском с информацией о попытках
                if (isEnglishText(backendMessage)) {
                    // Переводим только если сообщение на английском
                    if (backendMessage.includes('Invalid password')) {
                        errorMessage = 'Неверный пароль.';
                    } else if (backendMessage.includes('User not found')) {
                        errorMessage = 'Пользователь не найден.';
                    } else if (backendMessage.includes('Account is locked')) {
                        errorMessage = 'Аккаунт заблокирован.';
                    } else if (backendMessage.includes('Too many failed attempts')) {
                        errorMessage = 'Слишком много неудачных попыток.';
                    } else {
                        errorMessage = 'Произошла ошибка при входе.';
                    }
                } else {
                    // Используем сообщение от бекенда как есть
                    errorMessage = backendMessage;
                }
            } else if (error.message) {
                if (!isEnglishText(error.message)) {
                    errorMessage = error.message;
                }
            }

            toast({
                variant: 'destructive',
                title: 'Ошибка входа',
                description: errorMessage,
            });
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Убираем все нецифровые символы перед отправкой
        const cleanPhone = phone.replace(/\D/g, '');
        const formattedPhone = `+${cleanPhone}`;
        
        console.log('=== LOGIN SUBMIT ===');
        console.log('Original phone:', phone);
        console.log('Clean phone:', cleanPhone);
        console.log('Formatted phone:', formattedPhone);
        console.log('Password length:', password.length);
        console.log('Payload:', {phone: formattedPhone, password: '[HIDDEN]'});
        
        loginMutate({phone: formattedPhone, password});
    };

    return (
        <div className="h-[calc(100vh-170px)] flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 mx-2">
                <h2 className="text-2xl mb-6 text-center text-gray-900">Вход</h2>

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
                        disabled={isLoading}
                    >
                        {isLoading ? 'Вход...' : 'Войти'}
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
