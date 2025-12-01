'use client';

import React from 'react';

const contacts = [
  {
    name: 'Telegram',
    url: 'https://t.me/your_support',
    icon: <i className="fab fa-telegram-plane"></i>,
    color: 'bg-blue-400',
    label: '@your_support',
  },
  {
    name: 'WhatsApp',
    url: 'https://wa.me/1234567890',
    icon: <i className="fab fa-whatsapp"></i>,
    color: 'bg-green-500',
    label: '+1 234 567 890',
  },
  {
    name: 'Facebook',
    url: 'https://facebook.com/your_support',
    icon: <i className="fab fa-facebook-messenger"></i>,
    color: 'bg-blue-600',
    label: 'Facebook Messenger',
  },
  {
    name: 'Email',
    url: 'mailto:support@example.com',
    icon: <i className="fas fa-envelope"></i>,
    color: 'brand-bg',
    label: 'support@example.com',
  },
  {
    name: 'Телефон',
    url: 'tel:+1234567890',
    icon: <i className="fas fa-phone"></i>,
    color: 'brand-bg',
    label: '+1 234 567 890',
  },
];

const Support = () => {
  return (
    <div className="min-h-screen to-white flex flex-col items-center justify-center py-16 px-4">
      <div className="max-w-2xl w-full mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-amber-700 mb-4 drop-shadow">Поддержка</h1>
          <p className="text-lg md:text-xl text-gray-600 mb-2">Свяжитесь с нами удобным для вас способом</p>
          <p className="text-gray-400">Мы всегда готовы помочь вам по любым вопросам</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {contacts.map((contact) => (
            <a
              key={contact.name}
              href={contact.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 group border border-amber-100 hover:bg-gray-200"
            >
              <span className={`flex items-center justify-center w-14 h-14 rounded-full ${contact.color} text-white text-3xl mr-6 shadow group-hover:scale-110 transition-transform duration-300`}>
                {contact.icon}
              </span>
              <div>
                <div className="font-semibold text-lg text-gray-800 group-hover:text-amber-700 transition-colors duration-300">{contact.name}</div>
                <div className="text-gray-500 text-base mt-1 group-hover:text-amber-600 transition-colors duration-300">{contact.label}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Support;
