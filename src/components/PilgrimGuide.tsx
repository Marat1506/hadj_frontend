'use client';

import { faBookOpen, faVideo, faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';

const PilgrimGuide = () => {
    const guideItems = [
        {
            icon: faBookOpen,
            title: 'Пошаговые руководства',
            description: 'Подробные инструкции по совершению Хаджа и Умры с иллюстрациями',
        },
        {
            icon: faVideo,
            title: 'Видеоуроки',
            description: 'Наглядные видеоинструкции от опытных гидов',
        },
        {
            icon: faDownload,
            title: 'Полезные материалы',
            description: 'Чек-листы, карты и памятки для скачивания',
        },
    ]; 

    return (
        <section className="container mx-auto px-4 py-8 bg-gray-50 rounded-xl my-6">
            <h2 className="text-xl  mb-6 text-center">Гид паломника</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {guideItems.map((item, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-md p-6">
                        <div className="text-3xl mb-4">
                            <FontAwesomeIcon icon={item.icon} />
                        </div>
                        <h3 className=" mb-2">{item.title}</h3>
                        <p className="text-gray-600 text-sm">{item.description}</p>
                    </div>
                ))}
            </div>

            <div className="text-center mt-6">
                <Link
                    href="/guide"
                    className="brand-bg text-white px-6 py-2 rounded-lg font-medium hover:bg-amber-700 transition-colors inline-block"
                >
                    Открыть гид
                </Link>
            </div>
        </section>
    );
};

export default PilgrimGuide;