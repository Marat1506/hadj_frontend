'use client';

import React, {useState} from 'react';

import {faChevronDown} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import PageHeader from '@/components/PageHeader';

const faqs = [
    {
        q: 'Что такое хадж и умра?',
        a: 'Хадж — это обязательное паломничество в Мекку, совершаемое мусульманами раз в жизни. Умра — малое паломничество, которое можно совершать в любое время года.'
    },
    {
        q: 'Как записаться на тур?',
        a: 'Вы можете оставить заявку на сайте или связаться с нами по телефону или email. Мы поможем подобрать подходящую программу.'
    },
    {
        q: 'Какие документы нужны для поездки?',
        a: 'Для поездки необходим действующий заграничный паспорт, медицинская справка и, в некоторых случаях, виза.'
    },
    {
        q: 'Можно ли поехать с семьёй?',
        a: 'Да, мы организуем семейные туры и учитываем индивидуальные пожелания участников.'
    }
];

const FAQPage = () => {
    const [open, setOpen] = useState<number | null>(null);

    return (
        <div className="min-h-screen">
            <div className="container mx-auto px-4 py-8">
                <PageHeader title="Часто задаваемые вопросы" />

                <div className="space-y-4">
                    {faqs.map((item, idx) => (
                        <div
                            key={idx}
                            className="bg-white rounded-2xl shadow-md overflow-hidden"
                        >
                            <button
                                className="w-full flex justify-between items-center px-5 py-4 text-left font-semibold text-gray-800 focus:outline-none hover:bg-gray-50"
                                onClick={() => setOpen(open === idx ? null : idx)}
                            >
                                <span>{item.q}</span>
                                <FontAwesomeIcon
                                    icon={faChevronDown}
                                    className={`ml-2 transform transition-transform duration-300 ${
                                        open === idx ? 'rotate-180 brand-col' : 'text-gray-400'
                                    }`}
                                />
                            </button>
                            <div
                                className={`px-5 text-gray-600 text-sm transition-all duration-300 ease-in-out ${
                                    open === idx
                                        ? 'max-h-96 opacity-100 pb-4 pt-4'
                                        : 'max-h-0 opacity-0 overflow-hidden'
                                }`}
                            >
                                {item.a}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FAQPage;
