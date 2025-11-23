'use client';

import React from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

const tabs = [
    { label: 'Мекка' },
    { label: 'Медина' },
    { label: 'Мина' },
    { label: 'Муздалифа' },
    { label: 'Арафат' },
];

const NavigationMap = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const tabParam = searchParams?.get('tab'); 
    const activeTab = tabParam ? Number(tabParam) : 0;

    const handleTabClick = (idx: number) => {
        router.replace(`/navigation?tab=${idx}`);
    };

    return (
        <div className="min-h-screen flex flex-col bg-white pb-16 md:pb-0">
            {/* Header */}
            <header className="flex items-center px-4 py-4 border-b border-gray-100 justify-between">
                <div className="flex items-center">
                    <button
                        className="mr-3 text-amber-600 text-xl"
                        onClick={() => router.back()}
                    >
                        <i className="fas fa-chevron-left"></i>
                    </button>
                    <h1 className="text-[1.3rem]  text-gray-900">Навигация</h1>
                </div>
                <button
                    className="text-xl text-gray-500"
                    onClick={() => router.push('/')}
                >
                    <i className="fas fa-times"></i>
                </button>
            </header>

            {/* Tabs */}
            <nav className="flex overflow-x-auto border-b border-gray-100 bg-white">
                {tabs.map((tab, idx) => (
                    <button
                        key={tab.label}
                        className={`flex-1 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                            activeTab === idx
                                ? 'border-b-2 border-amber-600'
                                : 'text-gray-400'
                        }`}
                        onClick={() => handleTabClick(idx)}
                    >
                        {tab.label}
                    </button>
                ))}
            </nav>

            {/* Map */}
            <div className="relative flex-1 w-full h-full bg-gray-100">
                <img
                    src="/placeholder.svg"
                    alt="Карта"
                    className="w-full h-full object-cover absolute inset-0"
                />
                <div className="absolute top-6 right-6 px-3 py-1 bg-white border border-amber-400 rounded-lg text-amber-700 text-sm shadow">
                    Гостиница 1
                </div>
            </div>
        </div>
    );
};

export default NavigationMap;
