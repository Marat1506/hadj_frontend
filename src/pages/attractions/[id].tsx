import React, {useEffect, useState} from 'react';

import {useRouter} from 'next/router';
import {FaChevronLeft} from 'react-icons/fa';

import {api} from '@/services';

interface Attraction {
    id: string;
    title: string;
    description: string;
    coverUrl: string;
    additionalInformation?: string;
}

const Id: React.FC = () => {
    const router = useRouter();
    const {id} = router.query;

    const [attraction, setAttraction] = useState<Attraction | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchAttraction = async () => {
            try {
                const data: Attraction = await api.getSingleAttraction(id as string);
                setAttraction(data);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('Не удалось загрузить достопримечательность');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchAttraction();
    }, [id]);

    if (loading) {
        return <div className="text-center py-8">Загрузка достопримечательности...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-red-500">{error}</div>;
    }

    if (!attraction) {
        return <div className="text-center py-8">Достопримечательности не найдена</div>;
    }

    return (
        <div className="min-h-screen bg-white flex flex-col pb-16">
            <div className="container mx-auto px-4 py-8">
                <header className="flex items-center pb-4 mb-6 border-b border-gray-200">
                    <div className="flex items-center">
                        <button className="mr-3 text-blue-800 hover:text-blue-600 text-xl p-2 rounded-full hover:bg-blue-100 transition-colors flex items-center justify-center w-10 h-10" onClick={() => router.push('/attractions')}>
                            <FaChevronLeft/>
                        </button>
                        <h1 className="text-xl font-bold text-gray-900">Назад</h1>
                    </div>
                </header>

                <div className="flex-1">
                    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
                <img
                    src={attraction.coverUrl}
                    alt={attraction.title}
                    className="w-full h-72 object-cover"
                />
                <div className="p-6">
                    <h1 className="text-3xl  mb-4 text-gray-900">{attraction.title}</h1>
                    <div className="prose max-w-none text-gray-800 mb-8">
                        <p>{attraction.description}</p>
                    </div>
                    {attraction.additionalInformation && (
                        <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                            <h2 className="text-lg font-semibold mb-2 text-gray-800">
                                Дополнительная информация
                            </h2>
                            <div className="text-gray-500 text-sm">
                                {attraction.additionalInformation}
                            </div>
                        </div>
                    )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Id;
