'use client';

import {useEffect, useState} from 'react';

import {SlidersHorizontal} from 'lucide-react';
import {useRouter, useSearchParams} from 'next/navigation';
import {FaChevronLeft} from 'react-icons/fa';

import FilterModal from '@/components/FilterModal';
import SearchPanel from '@/components/SearchPanel';
import {useToast} from '@/hooks/use-toast';
import {api} from '@/services';

interface TourGroup {
    type: string;
    priceUSD: string;
    priceRUB: number;
    discount: boolean;
    available: boolean;
    leader: {
        name: string;
        lastName: string;
        middleName: string;
        photoUrl: string;
    };
}

interface Tour {
    id: number;
    date: string;
    from: string;
    to: string;
    directFlight: boolean;
    dateRange: { dateFrom: string; dateTo: string };
    groups: TourGroup[];
}

const Umrah = () => {
    const [filters, setFilters] = useState<any>(null);
    const [applied, setApplied] = useState(false);
    const [openFilter, setOpenFilter] = useState(false);
    const [tours, setTours] = useState<Tour[]>([]);
    const router = useRouter();
    const searchParams = useSearchParams();
    const {toast} = useToast();

    const dates = [
        {id: '1', dateFrom: '2025-09-22', dateTo: '2025-09-30'},
        {id: '2', dateFrom: '2025-10-01', dateTo: '2025-10-08'},
        {id: '3', dateFrom: '2025-10-10', dateTo: '2025-10-18'},
    ];

    const searchParamsString = searchParams.toString();

    useEffect(() => {
        // if (sessionStorage.getItem('umrah_applied') === 'true') {
        //     setApplied(true);
        // }
    }, [searchParamsString]);

    const getToursUmra = async (body: any) => {
        try {
            const data = await api.getToursUmra(body);
            if (data?.tours) {
                setTours(data.tours);
            } else {
                setTours([]);
            }
        } catch (err) {
            console.error(err);
            toast({
                title: 'Ошибка загрузки туров',
                description: 'Попробуйте ещё раз позже',
                variant: 'destructive',
            });
        }
    };

    const handleApply = async (data: any) => {
        const body: any = {
            cityTo: 'MADINAH',
            packageType: data.flightClass,
        };

        // Добавляем даты только если они выбраны
        if (data.date?.[0] && data.date?.[1]) {
            body.dateFrom = data.date[0];
            body.dateTo = data.date[1];
        }

        await getToursUmra(body);
        setFilters(data);
        setApplied(true);
        // sessionStorage.setItem('umrah_applied', 'true');
    };

    const handleBuy = (trip: Tour, group: TourGroup) => {
        const params = new URLSearchParams();
        params.set('trip', encodeURIComponent(JSON.stringify(trip)));
        params.set('group', encodeURIComponent(JSON.stringify(group)));

        router.push(`/umrah-package?${params.toString()}`);
    };

    return (
        <>
            <FilterModal open={openFilter} onOpenChange={setOpenFilter} onApply={handleApply}/>

            {!applied && (
                <div className="min-h-screen bg-white flex flex-col pb-16">
                    <div className="container mx-auto px-4 py-8">
                        <header className="flex items-center pb-4 mb-6 border-b border-gray-200">
                            <div className="flex items-center">
                                <button className="mr-3 text-blue-800 hover:text-blue-600 text-xl p-2 rounded-full hover:bg-blue-100 transition-colors flex items-center justify-center w-10 h-10" onClick={() => router.push('/')}>
                                    <FaChevronLeft/>
                                </button>
                                <h1 className="text-xl font-bold text-gray-900">Хадж</h1>
                            </div>
                        </header>
                        
                        <div className="sm:min-h-[60vh] flex items-center justify-center">
                            <SearchPanel onApply={handleApply} dates={dates} hideDate/>
                        </div>
                    </div>
                </div>
            )}

            {applied && (
                <div className="min-h-screen bg-white flex flex-col pb-16">
                    <div className="container mx-auto px-4 py-8">
                        <header className="flex items-center pb-4 mb-6 border-b border-gray-200">
                            <div className="flex items-center">
                                <button className="mr-3 text-blue-800 hover:text-blue-600 text-xl p-2 rounded-full hover:bg-blue-100 transition-colors flex items-center justify-center w-10 h-10" onClick={() => router.push('/')}>
                                    <FaChevronLeft/>
                                </button>
                                <h1 className="text-xl font-bold text-gray-900">Хадж</h1>
                            </div>
                        </header>

                        <div className="grid grid-cols-1 gap-6">
                        {tours.length === 0 && (
                            <p className="text-gray-500">Нет доступных туров</p>
                        )}

                        {tours.map((trip) => (
                            <div key={trip.id} className="flex flex-col gap-5">
                                {trip.groups.map((group, gidx) => (
                                    <div
                                        key={gidx}
                                        onClick={() => handleBuy(trip, group)}
                                        className="relative bg-white cursor-pointer border border-gray-200 rounded-2xl shadow-sm overflow-hidden transition hover:shadow-md"
                                    >
                                        <div
                                            className="flex justify-between items-center bg-[#0B1F55] text-white px-5 py-3">
                                            {group.discount ? <div
                                                className="text-sm text-black font-semibold bg-white px-3 py-1 rounded-full">
                                                {Math.floor(Math.random() * 20) + 10}%`
                                            </div> : <span/>}
                                            <span className="text-lg font-bold uppercase">
                                                {group.type === 'Комфорт' ? 'Комфорт' : 'Эконом'}
                                            </span>
                                        </div>

                                        <div
                                            className="px-5 py-5 flex flex-col sm:flex-row sm:justify-between sm:items-center">
                                            <div>
                                                <div className={'flex align-bottom gap-3'}>
                                                    <div className="flex items-baseline gap-2">
                                                    <span className="text-[26px] font-extrabold text-[#2B2BFF]">
                                                        {Number(group.priceUSD).toLocaleString()}$
                                                    </span>
                                                        {group.discount && (
                                                            <span className="text-gray-400 line-through text-lg">
                                                            {(Number(group.priceUSD) + 200).toLocaleString()}$
                                                        </span>
                                                        )}
                                                    </div>
                                                    <div className="mt-1 text-gray-700 font-semibold text-[17px]">
                                                        {group.priceRUB.toLocaleString()} ₽
                                                    </div>
                                                </div>


                                                <p className="text-xs text-gray-400 mt-1">
                                                    По курсу на {new Date().toLocaleDateString('ru-RU')}
                                                </p>

                                                <div className="mt-4 text-sm text-gray-700 space-y-1">
                                                    <p>
                                                        <span className="font-semibold">
                                                            Расстояние до мечети:
                                                        </span>{' '}
                                                        Мекка – 500 м., Мина – 10 мин. на транспорте
                                                    </p>
                                                    <p>
                                                        <span className="font-semibold">Питание:</span>{' '}
                                                        Включено
                                                    </p>
                                                </div>

                                                {/* Icons row */}
                                                <div
                                                    className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-4">
                                                    <span>Махачкала</span>
                                                    <span>Дубай</span>
                                                    <span>Мекка</span>
                                                    <span>Мина</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                        </div>
                    </div>
                </div>
            )}

            {applied && (
                <button
                    onClick={() => setOpenFilter(true)}
                    className="fixed sm:bottom-5 bottom-20 right-6 z-50 brand-bg text-white rounded-full p-4 shadow-lg transition"
                    aria-label="Фильтр"
                >
                    <SlidersHorizontal className="w-6 h-6"/>
                </button>
            )}
        </>
    );
};

export default Umrah;
