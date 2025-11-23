'use client';

import {useState} from 'react';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const LoginModal = ({isOpen, onClose}: LoginModalProps) => {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle login logic here
    };

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
            onClick={handleOverlayClick}
        >
            <div className="bg-white rounded-xl w-full max-w-md mx-4">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl">Вход / Регистрация</h3>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                            <i className="fas fa-times"></i>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                Номер телефона
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                                placeholder="+7 (___) ___-__-__"
                            />
                        </div>

                        <div className="mb-6">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Пароль
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                                placeholder="Введите пароль"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full brand-bg text-white py-3 rounded-lg font-medium mb-4 hover:bg-amber-700 transition-colors"
                        >
                            Войти
                        </button>

                        <div className="text-center">
                            <a href="#" className="text-sm hover:underline">
                                Забыли пароль?
                            </a>
                            <p className="text-sm text-gray-500 mt-2">
                                Нет аккаунта?{' '}
                                <a href="#" className="hover:underline">
                                    Зарегистрироваться
                                </a>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;
