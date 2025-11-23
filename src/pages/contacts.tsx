'use client';

import React from 'react';

import {faChevronLeft, faEnvelope, faMapMarkerAlt, faPhone} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {useRouter} from 'next/navigation';

const ContactsPage = () => {
    const router = useRouter();

    return (
        <div className="min-h-screen py-4 px-4 sm:px-6 lg:px-8">
            <header className="max-w-[700px] mx-auto flex items-center pb-2 border-gray-200">
                <div className="flex items-center">
                    <button
                        className="mr-2 text-blue-800  text-xl p-2 rounded-full transition-colors"
                        onClick={() => router.push('/')}
                    >
                        <FontAwesomeIcon icon={faChevronLeft}/>
                    </button>
                    <h1 className="text-1xl font-bold text-gray-900">Контакты</h1>
                </div>
            </header>

            <div className="max-w-[700px] mx-auto">
                <p className="text-center text-gray-600 mb-10">
                    Свяжитесь с нами по любым вопросам, связанным с турами, паломничеством и сервисом
                </p>

                {/* Контактные данные */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
                    {/* Телефон */}
                    <div className="bg-white shadow rounded-2xl p-4 flex items-center">
          <span className="flex items-center justify-center w-10 h-10 rounded-full text-white brand-bg mb-1">
            <FontAwesomeIcon icon={faPhone} className="text-1xl"/>
          </span>
                        <div className="flex flex-col ml-4">
                            <p className="text-gray-700 font-medium">Телефон</p>
                            <a
                                href="tel:+79999999999"
                                className="brand-col font-semibold hover:underline mt-1 text-[14px]"
                            >
                                +7 (999) 999-99-99
                            </a>
                        </div>
                    </div>

                    {/* Email */}
                    <div className="bg-white shadow rounded-2xl p-4 flex items-center">
          <span className="flex items-center justify-center w-10 h-10 rounded-full text-white brand-bg mb-1">
            <FontAwesomeIcon icon={faEnvelope} className="text-1xl"/>
          </span>
                        <div className="flex flex-col ml-4">
                            <p className="text-gray-700 font-medium">Email</p>
                            <a
                                href="mailto:info@nhk.ru"
                                className="brand-col font-semibold hover:underline mt-1 text-[14px]"
                            >
                                info@nhk.ru
                            </a>
                        </div>
                    </div>

                    {/* Адрес */}
                    <div className="bg-white shadow rounded-2xl p-4 flex items-center">
          <span className="flex items-center justify-center  w-10 h-10 min-w-10 rounded-full text-white brand-bg mb-1">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-1xl"/>
          </span>
                        <div className="flex flex-col ml-4">
                            <p className="text-gray-700 font-medium">Адрес</p>
                            <p className="text-gray-600 mt-1 text-[12px]">г. Москва, ул. Примерная, д. 1</p>
                        </div>
                    </div>
                </div>

                {/* Форма обратной связи */}
                <div className="bg-white shadow rounded-2xl p-5">
                    <h2 className="text-xl text-gray-800 mb-6">Форма обратной связи</h2>
                    <form className="space-y-5">
                        <div>
                            <input
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                                placeholder="Ваше имя"
                                required
                            />
                        </div>
                        <div>
                            <input
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                                placeholder="Email"
                                type="email"
                                required
                            />
                        </div>
                        <div>
            <textarea
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                placeholder="Ваш вопрос"
                rows={4}
                required
            />
                        </div>
                        <button
                            type="submit"
                            className="w-full sm:w-auto brand-bg text-white px-6 py-3 rounded-xl font-semibold transition"
                        >
                            Отправить
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContactsPage;
