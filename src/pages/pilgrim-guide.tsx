import React, { useState } from 'react';

const MAIN = 'main';
const UMRA = 'umra';
const HAJJ = 'hajj';
const BOOK = 'book';
const VIDEO = 'video';

export default function PilgrimGuide() {
  const [screen, setScreen] = useState(MAIN);
  // Для деталок
  const [detail, setDetail] = useState<string>('');

  // Главная 
  if (screen === MAIN) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col pb-16">
        {/* Header */}
        <header className="flex items-center px-4 py-4 border-b border-gray-100 justify-between bg-white">
          <h1 className="text-[1.3rem]  text-gray-900">Гид паломника</h1>
          <div className="flex gap-3 text-xl text-gray-400">
            <i className="far fa-question-circle"></i>
            <i className="far fa-user-circle"></i>
          </div>
        </header>
        {/* Main buttons */}
        <div className="flex-1 flex flex-col justify-center items-center px-4">
          <div className="grid grid-cols-2 gap-5 w-full max-w-2xl">
            <button 
              className="rounded-xl p-6 flex flex-col items-center min-h-[120px] relative overflow-hidden"
              style={{
                background: 'linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), linear-gradient(0deg, rgba(0, 91, 254, 0.07), rgba(0, 91, 254, 0.07)), linear-gradient(0deg, rgba(14, 54, 98, 0.01), rgba(14, 54, 98, 0.01))',
                border: '1px solid transparent',
                backgroundClip: 'padding-box',
                borderImage: 'linear-gradient(90deg, #052E70 0%, #042253 100%) 1'
              }}
              onClick={() => setScreen(UMRA)}
            >
              <i className="fas fa-file-alt text-4xl text-amber-600 mb-2"></i>
              <span className="text-sm font-medium text-gray-800">Гид по Умре</span>
            </button>
            <button 
              className="rounded-xl p-6 flex flex-col items-center min-h-[120px] relative overflow-hidden"
              style={{
                background: 'linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), linear-gradient(0deg, rgba(0, 91, 254, 0.07), rgba(0, 91, 254, 0.07)), linear-gradient(0deg, rgba(14, 54, 98, 0.01), rgba(14, 54, 98, 0.01))',
                border: '1px solid transparent',
                backgroundClip: 'padding-box',
                borderImage: 'linear-gradient(90deg, #052E70 0%, #042253 100%) 1'
              }}
              onClick={() => setScreen(HAJJ)}
            >
              <i className="fas fa-mountain text-4xl text-amber-600 mb-2"></i>
              <span className="text-sm font-medium text-gray-800">Гид по Хаджу</span>
            </button>
            <button 
              className="rounded-xl p-6 flex flex-col items-center min-h-[120px] relative overflow-hidden"
              style={{
                background: 'linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), linear-gradient(0deg, rgba(0, 91, 254, 0.07), rgba(0, 91, 254, 0.07)), linear-gradient(0deg, rgba(14, 54, 98, 0.01), rgba(14, 54, 98, 0.01))',
                border: '1px solid transparent',
                backgroundClip: 'padding-box',
                borderImage: 'linear-gradient(90deg, #052E70 0%, #042253 100%) 1'
              }}
              onClick={() => setScreen(BOOK)}
            >
              <i className="fas fa-book-open text-4xl text-amber-600 mb-2"></i>
              <span className="text-sm font-medium text-gray-800">Пособие</span>
            </button>
            <button 
              className="rounded-xl p-6 flex flex-col items-center min-h-[120px] relative overflow-hidden"
              style={{
                background: 'linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), linear-gradient(0deg, rgba(0, 91, 254, 0.07), rgba(0, 91, 254, 0.07)), linear-gradient(0deg, rgba(14, 54, 98, 0.01), rgba(14, 54, 98, 0.01))',
                border: '1px solid transparent',
                backgroundClip: 'padding-box',
                borderImage: 'linear-gradient(90deg, #052E70 0%, #042253 100%) 1'
              }}
              onClick={() => setScreen(VIDEO)}
            >
              <i className="fas fa-video text-4xl text-amber-600 mb-2"></i>
              <span className="text-sm font-medium text-gray-800">Видео уроки</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Гид по Умре
  if (screen === UMRA && !detail) {
    return (
      <div className="min-h-screen bg-white flex flex-col pb-16">
        <header className="flex items-center px-4 py-4 border-b border-gray-100 bg-white">
          <button className="mr-3 text-amber-600 text-xl" onClick={() => setScreen(MAIN)}>
            <i className="fas fa-chevron-left"></i>
          </button>
          <h1 className="text-[1.1rem]  text-gray-900">Гид по Умре</h1>
        </header>
        <div className="flex-1 px-4 py-6">
          <ul className="divide-y divide-gray-100 rounded-xl bg-amber-50">
            <li className="px-4 py-3 cursor-pointer" onClick={() => setDetail('umra1')}>Введение</li>
            <li className="px-4 py-3 cursor-pointer" onClick={() => setDetail('umra2')}>Ихрам</li>
            <li className="px-4 py-3 cursor-pointer" onClick={() => setDetail('umra3')}>Таваф вокруг Каабы</li>
            <li className="px-4 py-3 cursor-pointer" onClick={() => setDetail('umra4')}>Сай между Сафа и Марва</li>
            <li className="px-4 py-3 cursor-pointer" onClick={() => setDetail('umra5')}>Подстригание волос</li>
          </ul>
        </div>
      </div>
    );
  }
  // Деталка по Умре
  if (screen === UMRA && detail) {
    return (
      <div className="min-h-screen bg-white flex flex-col pb-16">
        <header className="flex items-center px-4 py-4 border-b border-gray-100 bg-white">
          <button className="mr-3 text-amber-600 text-xl" onClick={() => setDetail('')}>
            <i className="fas fa-chevron-left"></i>
          </button>
          <h1 className="text-[1.1rem]  text-gray-900">Детали</h1>
        </header>
        <div className="flex-1 px-4 py-6">
          <div className="bg-amber-50 rounded-xl p-6 min-h-[200px]">Тут будет текст по теме: {detail}</div>
        </div>
      </div>
    );
  }

  // Гид по Хаджу
  if (screen === HAJJ && !detail) {
    return (
      <div className="min-h-screen bg-white flex flex-col pb-16">
        <header className="flex items-center px-4 py-4 border-b border-gray-100 bg-white">
          <button className="mr-3 text-amber-600 text-xl" onClick={() => setScreen(MAIN)}>
            <i className="fas fa-chevron-left"></i>
          </button>
          <h1 className="text-[1.1rem]  text-gray-900">Гид по Хаджу</h1>
        </header>
        <div className="flex-1 px-4 py-6">
          <ul className="divide-y divide-gray-100 rounded-xl bg-amber-50">
            <li className="px-4 py-3 cursor-pointer" onClick={() => setDetail('hajj0')}>Введение</li>
            <li className="px-4 py-3 cursor-pointer" onClick={() => setDetail('hajj1')}>Виды Хаджа</li>
            <li className="px-4 py-3 cursor-pointer" onClick={() => setDetail('hajj2')}>Ихрам</li>
            <li className="px-4 py-3 cursor-pointer" onClick={() => setDetail('hajj3')}>День 1 - Таравва</li>
            <li className="px-4 py-3 cursor-pointer" onClick={() => setDetail('hajj4')}>День 2 - Арафа</li>
            <li className="px-4 py-3 cursor-pointer" onClick={() => setDetail('hajj5')}>День 3 - Первый день Ид аль-Адха</li>
            <li className="px-4 py-3 cursor-pointer" onClick={() => setDetail('hajj6')}>День 4 - Второй день Ид аль-Адха</li>
            <li className="px-4 py-3 cursor-pointer" onClick={() => setDetail('hajj7')}>День 5 - Третий день Ид аль-Адха</li>
            <li className="px-4 py-3 cursor-pointer" onClick={() => setDetail('hajj8')}>День 6 - Дополнительно</li>
          </ul>
        </div>
      </div>
    );
  }
  // Деталка по Хаджу
  if (screen === HAJJ && detail) {
    return (
      <div className="min-h-screen bg-white flex flex-col pb-16">
        <header className="flex items-center px-4 py-4 border-b border-gray-100 bg-white">
          <button className="mr-3 text-amber-600 text-xl" onClick={() => setDetail('')}>
            <i className="fas fa-chevron-left"></i>
          </button>
          <h1 className="text-[1.1rem]  text-gray-900">Детали</h1>
        </header>
        <div className="flex-1 px-4 py-6">
          <div className="bg-amber-50 rounded-xl p-6 min-h-[200px]">Тут будет текст по теме: {detail}</div>
        </div>
      </div>
    );
  }

  // Пособие
  if (screen === BOOK && !detail) {
    return (
      <div className="min-h-screen bg-white flex flex-col pb-16">
        <header className="flex items-center px-4 py-4 border-b border-gray-100 bg-white">
          <button className="mr-3 text-amber-600 text-xl" onClick={() => setScreen(MAIN)}>
            <i className="fas fa-chevron-left"></i>
          </button>
          <h1 className="text-[1.1rem]  text-gray-900">Пособие</h1>
        </header>
        <div className="flex-1 px-4 py-6">
          <ul className="divide-y divide-gray-100 rounded-xl bg-amber-50">
            <li className="px-4 py-3 cursor-pointer" onClick={() => setDetail('book1')}>Пособие 1</li>
            <li className="px-4 py-3 cursor-pointer" onClick={() => setDetail('book2')}>Пособие 2</li>
            <li className="px-4 py-3 cursor-pointer" onClick={() => setDetail('book3')}>Пособие 3</li>
            <li className="px-4 py-3 cursor-pointer" onClick={() => setDetail('book4')}>Пособие 4</li>
            <li className="px-4 py-3 cursor-pointer" onClick={() => setDetail('book5')}>Пособие 5</li>
          </ul>
        </div>
      </div>
    );
  }
  // Деталка по пособию
  if (screen === BOOK && detail) {
    return (
      <div className="min-h-screen bg-white flex flex-col pb-16">
        <header className="flex items-center px-4 py-4 border-b border-gray-100 bg-white">
          <button className="mr-3 text-amber-600 text-xl" onClick={() => setDetail('')}>
            <i className="fas fa-chevron-left"></i>
          </button>
          <h1 className="text-[1.1rem]  text-gray-900">Детали</h1>
        </header>
        <div className="flex-1 px-4 py-6">
          <div className="bg-amber-50 rounded-xl p-6 min-h-[200px]">Тут будет текст по теме: {detail}</div>
        </div>
      </div>
    );
  }

  // Видео уроки
  if (screen === VIDEO) {
    return (
      <div className="min-h-screen bg-white flex flex-col pb-16">
        <header className="flex items-center px-4 py-4 border-b border-gray-100 bg-white">
          <button className="mr-3 text-amber-600 text-xl" onClick={() => setScreen(MAIN)}>
            <i className="fas fa-chevron-left"></i>
          </button>
          <h1 className="text-[1.1rem]  text-gray-900">Видео уроки</h1>
        </header>
        <div className="flex-1 px-4 py-6">
          <div className="space-y-4">
            <div className="bg-amber-50 rounded-xl p-4 flex items-center gap-4">
              <div className="w-20 h-14 bg-gray-300 rounded-lg flex items-center justify-center">
                <i className="fas fa-play text-2xl text-white"></i>
              </div>
              <div>
                <div className="font-medium">Хадж в первый раз</div>
                <div className="text-xs text-gray-400">17.08.2024</div>
              </div>
            </div>
            <div className="bg-amber-50 rounded-xl p-4 flex items-center gap-4">
              <div className="w-20 h-14 bg-gray-300 rounded-lg flex items-center justify-center">
                <i className="fas fa-play text-2xl text-white"></i>
              </div>
              <div>
                <div className="font-medium">Умра в первый раз</div>
                <div className="text-xs text-gray-400">17.08.2024</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
} 