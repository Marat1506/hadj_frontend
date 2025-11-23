import React, {useEffect, useState} from 'react';

import {useRouter} from 'next/router';

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
        <div className="container mx-auto max-w-3xl px-2 md:px-0 py-10">
            <button
                onClick={() => router.push("/attractions")}
                className="flex items-center gap-2 hover:bg-green-100 px-4 rounded-lg font-semibold mb-4 transition-colors"
            >
                <span className="text-2xl leading-none">←</span>
                <span>Назад к достопримечательностям</span>
            </button>

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
    );
};

export default Id;
