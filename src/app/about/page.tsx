'use client';

import {useRouter} from 'next/navigation';

import PageHeader from '@/components/PageHeader';

const AboutPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-2">
        <PageHeader title="О компании" />

        <div className="mb-8">
          <p className="mb-4 text-gray-700 leading-relaxed">
            Наша компания специализируется на организации паломнических и культурных туров для мусульман. Мы стремимся
            сделать каждое путешествие комфортным, безопасным и соответствующим исламским традициям. Наши программы
            включают хадж, умру, а также образовательные и культурные поездки по святым местам.
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Мы работаем с опытными гидами, предоставляем качественное сопровождение и заботимся о каждом участнике
            тура. Наша цель — не просто путешествие, а духовное обогащение и новые знания о религии и культуре.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Присоединяйтесь к нам и откройте для себя мир исламского туризма с НХК!
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-xl font-bold mb-6 flex items-center text-gray-800">Выбор тура</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="w-full md:w-1/2 bg-gradient-to-r from-blue-800 to-blue-900 rounded-xl p-6 text-white relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-2xl ">Умра</h3>
                <p className="mb-4 text-sm max-w-[400px]">
                  Малое паломничество в любое время года с лучшими условиями
                </p>
                <button
                  className="bg-white text-blue-800 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                  onClick={() => router.push('/umrah')}
                >
                  Выбрать тур
                </button>
              </div>
            </div>

            <div className="w-full md:w-1/2 mt-4 sm:mt-0 bg-[#03AA77] rounded-xl p-6 text-white relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-2xl ">Хадж 2025</h3>
                <p className="mb-4 text-sm max-w-[400px]">
                  Совершите пятый столп Ислама с нашими комфортными турами
                </p>
                <button
                  className="bg-white text-amber-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                  onClick={() => router.push('/hajj')}
                >
                  Выбрать тур
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;


