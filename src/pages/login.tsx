'use client';

import React, {useState} from 'react';
// @ts-ignore
import InputMask from 'react-input-mask';
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
            dispatch(loginSuccess({user: data.user, accessToken: data.accessToken}));
            setAuthToken(data.accessToken);

            toast({
                variant: 'default',
                title: 'Вход выполнен успешно',
                description: 'Вы успешно вошли в систему.',
            });

            router.push('/');
        },
        onError: (error) => {
            toast({
                variant: 'destructive',
                title: 'Ошибка входа',
                description: error.message || 'Произошла ошибка при входе.',
            });
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Убираем все нецифровые символы перед отправкой
        const cleanPhone = phone.replace(/\D/g, '');

        loginMutate({phone: `+${cleanPhone}`, password});
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
                        <InputMask
                            mask="+7 (999) 999-99-99"
                            id="phone"
                            type="text"
                            value={phone}
                            onChange={(e: any) => setPhone(e.target.value)}
                            placeholder="+7 (___) ___-__-__"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
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
                        className="w-full brand-bg text-white py-2 rounded-lg font-semibold hover:bg-amber-700 transition-colors"
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
