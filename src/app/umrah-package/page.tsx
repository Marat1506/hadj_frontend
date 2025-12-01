'use client';

export const dynamic = 'force-dynamic';

import {NextPage} from "next";
import {useRouter, useSearchParams} from "next/navigation";
import {Suspense, useMemo} from "react";

interface Trip {
    id: number;
    date: string;
    from: string;
    to: string;
    directFlight: boolean;
}

interface Group {
    type: string;
    priceUSD: number;
    priceRUB: number;
    discount: boolean;
    available: boolean;
    leader?: {
        name: string;
        lastName: string;
        middleName: string;
        photoUrl: string;
    };
}

const UmrahPackageContent: NextPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const tripParam = searchParams.get("trip");
    const groupParam = searchParams.get("group");

    const {trip, group} = useMemo(() => {
        try {
            const decode = (value: string | null) => {
                if (!value) return null;
                // иногда нужно раскодировать дважды
                const once = decodeURIComponent(value);
                const twice = decodeURIComponent(once);
                return JSON.parse(twice);
            };

            return {
                trip: decode(tripParam) as Trip | null,
                group: decode(groupParam) as Group | null,
            };
        } catch (e) {
            console.error("Ошибка парсинга параметров", e);
            return {trip: null, group: null};
        }
    }, [tripParam, groupParam]);

    const apply = () => {
        const params = new URLSearchParams();
        params.set('trip', encodeURIComponent(JSON.stringify(trip)));
        params.set('group', encodeURIComponent(JSON.stringify(group)));

        router.push(`/data-verification?${params.toString()}`)
    }


    if (!trip || !group) {
        return <div className="text-center py-20 text-xl">Данные тура не найдены</div>;
    }

    return (
        <div className="container mx-auto max-w-3xl px-1 md:px-0 py-4">
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 hover:bg-green-100 px-4 py-1 rounded-lg font-semibold mb-2 transition-colors"
            >
                <span className="text-2xl leading-none">←</span>
                <span>Назад к списку</span>
            </button>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                        <div className="text-xl">{trip.date}</div>
                        <span className="text-green-600 text-2xl">🛫</span>
                    </div>

                    <div className="flex items-center gap-2 mb-4 text-gray-700">
                        <span>{trip.from}</span>
                        <span className="text-green-600 text-xl">→</span>
                        <span>{trip.to}</span>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-gray-400 text-sm">ГРУППА</span>
                        <span className="ml-2 text-base text-green-700">
              {group.type}
            </span>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
            <span className="text-gray-400 text-sm line-through">
              {group.priceUSD.toLocaleString()} $
            </span>
                        <span className="bg-green-100 text-green-700 rounded px-3 py-1 text-base">
              {group.priceRUB.toLocaleString()} ₽
            </span>
                    </div>

                    <button
                        onClick={() => apply()}
                        className="w-full mt-6 brand-bg hover:bg-amber-700 text-white py-4 px-6 rounded-xl transition-colors"
                    >
                        Подать заявку
                    </button>
                </div>

                <div className="p-6">
                    <div className="text-gray-700 text-base mb-2">В стоимость тура входит:</div>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1">
                        <li>Авиаперелёт {trip.from} — {trip.to}</li>
                        <li>Групповое сопровождение</li>
                        <li>Проживание в отеле</li>
                        <li>Трансферы по маршруту</li>
                        <li>Экскурсионная программа</li>
                        <li>Питание (уточнять по группе)</li>
                        <li>Виза и страховка</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

const UmrahPackagePage: NextPage = () => {
    return (
        <Suspense fallback={<div className="text-center py-20 text-xl">Загрузка...</div>}>
            <UmrahPackageContent/>
        </Suspense>
    );
};

export default UmrahPackagePage;
