'use client';

import React from 'react';

import {faChevronLeft, faDownload, faFileContract} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {useRouter} from 'next/navigation';

const contracts = [
    {id: 1, number: 'ДГ-2024-001', date: '2024-04-10', amount: 25000, status: 'Активен', file: '#'},
    {id: 2, number: 'ДГ-2023-112', date: '2023-12-01', amount: 18000, status: 'Завершён', file: '#'},
    {id: 3, number: 'ДГ-2023-045', date: '2023-07-15', amount: 21000, status: 'Завершён', file: '#'},
];

const statusColors: Record<string, string> = {
    'Активен': 'bg-green-100 text-green-700',
    'Завершён': 'bg-gray-200 text-gray-600',
};

const ContractsPage = () => {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-white flex flex-col pb-16">
            <div className="container mx-auto px-4 py-8">
                <header className="flex items-center mb-6">
                    <button
                        className="mr-3 text-blue-800 hover:text-blue-600 text-xl p-2 rounded-full hover:bg-blue-100 transition-colors flex items-center justify-center w-10 h-10"
                        onClick={() => router.push('/')}
                    >
                        <FontAwesomeIcon icon={faChevronLeft}/>
                    </button>
                    <h1 className="text-xl font-bold text-gray-900">Мои договоры</h1>
                </header>

                <div className="flex justify-center">
                    <div className="w-full max-w-[850px] bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-12 shadow">
                <div className="flex items-center gap-4 mb-8 sm:mb-10">
            <span
                className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full brand-col text-2xl sm:text-3xl shadow">
                  <FontAwesomeIcon icon={faFileContract}/>
            </span>
                    <h1 className="text-2xl sm:text-4xl font-extrabold">Мои договоры</h1>
                </div>

                <div className="hidden sm:block overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg text-base sm:text-lg">
                        <thead>
                        <tr>
                            <th className="px-6 py-4 text-left text-gray-500 font-semibold">Номер</th>
                            <th className="px-6 py-4 text-left text-gray-500 font-semibold">Дата</th>
                            <th className="px-6 py-4 text-left text-gray-500 font-semibold">Сумма</th>
                            <th className="px-6 py-4 text-left text-gray-500 font-semibold">Статус</th>
                            <th className="px-6 py-4 text-left text-gray-500 font-semibold">Файл</th>
                        </tr>
                        </thead>
                        <tbody>
                        {contracts.map((c) => (
                            <tr key={c.id} className="border-b last:border-b-0">
                                <td className="px-6 py-4 whitespace-nowrap font-semibold">{c.number}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{c.date}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{c.amount.toLocaleString()} ₽</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                        className={`inline-block px-4 py-2 rounded-full text-sm sm:text-base font-medium ${statusColors[c.status]}`}>
                                        {c.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <a
                                        href={c.file}
                                        className="brand-bg text-white px-4 sm:px-5 py-2 rounded-lg font-medium text-sm sm:text-base shadow-none inline-flex items-center gap-2"
                                    >
                                        <FontAwesomeIcon icon={faDownload}/> Скачать
                                    </a>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                <div className="sm:hidden space-y-4">
                    {contracts.map((c) => (
                        <div key={c.id} className="p-4 rounded-xl bg-gray-50 shadow flex flex-col gap-3">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-gray-800">{c.number}</span>
                                <span className="text-sm text-gray-500">{c.date}</span>
                            </div>
                            <div className="text-lg text-amber-700">{c.amount.toLocaleString()} ₽</div>
                            <div>
                                 <span
                                     className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusColors[c.status]}`}>
                                     {c.status}
                                 </span>
                            </div>
                            <a
                                href={c.file}
                                className="w-full text-center brand-bg text-white py-2 rounded-lg font-medium text-sm shadow-none inline-flex items-center justify-center gap-2"
                            >
                                <FontAwesomeIcon icon={faDownload}/> Скачать
                            </a>
                        </div>
                    ))}
                </div>
            </div>
                </div>
            </div>
        </div>
    );
};

export default ContractsPage;
