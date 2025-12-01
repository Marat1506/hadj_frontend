'use client';

import React, { useState } from 'react';

import Link from 'next/link';

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setMessage('Инструкции по сбросу пароля отправлены на ваш email (это заглушка).');
            setError('');
        } catch (err: any) {
            setError('Ошибка при отправке запроса. Пожалуйста, попробуйте еще раз.');
            setMessage('');
        }
    };
 
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg rounded-lg">
                <h3 className="text-2xl  text-center">Забыли пароль?</h3>
                <p className="text-center text-gray-600 mt-2">
                    Введите ваш email, чтобы сбросить пароль.
                </p>
                <form onSubmit={handleSubmit}>
                    <div className="mt-4">
                        <div>
                            <label className="block" htmlFor="email">Email</label>
                            <input
                                type="email"
                                placeholder="Ваш email"
                                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-amber-600"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex items-baseline justify-between">
                            <button
                                type="submit"
                                className="px-6 py-2 mt-4 text-white brand-bg rounded-lg hover:bg-amber-900"
                            >
                                Сбросить пароль
                            </button>
                        </div>
                        {message && <p className="text-green-500 text-sm mt-2">{message}</p>}
                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                        <div className="mt-4 text-center">
                            <Link href="/login" className="text-sm hover:underline">Вернуться ко входу</Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
