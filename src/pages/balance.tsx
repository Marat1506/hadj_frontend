'use client';

import React, {useEffect, useState} from 'react';

import {faChevronLeft} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {useRouter} from 'next/navigation';

import {api} from '@/services';

interface Balance {
    balance: number;
    currency: string;
    lastUpdated: string;
}

interface BalanceHistoryTransaction {
    id: number;
    type: string;
    status: string;
    amount: number;
    currency: string;
    description: string;
    balanceBefore: number;
    balanceAfter: number;
    createdAt: string;
    paymentId: string;
}

interface BalanceHistoryType {
    transactions: BalanceHistoryTransaction[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

const BalancePage = () => {
    const router = useRouter();
    const [balance, setBalance] = useState<Balance>();
    const [balanceHistory, setBalanceHistory] = useState<BalanceHistoryType>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [payments, setPayments] = useState([
        {id: 1, date: '2024-05-01', amount: 5000, type: 'Пополнение', status: 'Успешно'},
        {id: 2, date: '2024-05-10', amount: -2000, type: 'Оплата услуг', status: 'Успешно'},
        {id: 3, date: '2024-05-15', amount: -1500, type: 'Оплата услуг', status: 'Успешно'},
        {id: 4, date: '2024-05-20', amount: 3000, type: 'Пополнение', status: 'Успешно'},
    ]);

    const fetchBalance = async () => {
        try {
            const data = await api.getBalance();
            console.log(data);
            setBalance(data);
        } catch (err: any) {
            setError(err.message || 'Failed to load balance');
        } finally {
            setLoading(false);
        }
    };

    const fetchBalanceHistory = async () => {
        try {
            const data = await api.getBalanceHistory({
                page: 1,
                limit: 20
            });
            console.log(data);
            setBalanceHistory(data);
        } catch (err: any) {
            setError(err.message || 'Failed to load balance');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBalance();
        fetchBalanceHistory();
    }, []);

    const handleAddFunds = () => {
        // In a real app, this would open a payment modal or redirect to a payment page
        alert('Функция пополнения баланса будет доступна в ближайшее время');
    };

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
                    <h1 className="text-xl font-bold text-gray-900">Финансы</h1>
                </header>

                <div className="flex justify-center">
                    <div className="max-w-[700px] w-full bg-white rounded-2xl shadow-lg overflow-hidden">

                {/* Header */}
                <div className="brand-bg from-blue-600 to-indigo-700 text-white p-6">
                    <h1 className="text-2xl font-bold">Финансы</h1>
                    <p className="text-blue-100">Управление вашим балансом и платежами</p>
                </div>

                {/* Balance Section */}
                <div className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
                        <div className="flex items-center gap-4">
                            <div className="bg-blue-100 p-4 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none"
                                     viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/>
                                </svg>
                            </div>
                            <div>
                                <div className="text-gray-500 text-sm">Текущий баланс</div>
                                <div className="text-3xl font-bold text-gray-800">
                                    {balance?.balance} ₽
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment History */}

                    {balanceHistory?.transactions?.length ? (
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">История платежей</h2>

                            {/* Desktop Table */}
                            <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата
                                        </th>
                                        <th scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Тип
                                            операции
                                        </th>
                                        <th scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Сумма
                                        </th>
                                        <th scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                    {balanceHistory?.transactions.map((payment) => (
                                        <tr key={payment.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{payment.createdAt}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{payment.type}</td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${payment.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {payment.amount > 0 ? '+' : ''}{payment.amount.toLocaleString('ru-RU')} ₽
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                        <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${payment.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {payment.status}
                        </span>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Cards */}
                            <div className="md:hidden space-y-4">
                                {balanceHistory?.transactions.map((payment) => (
                                    <div key={payment.id}
                                         className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-800">{payment.type}</h3>
                                                <p className="text-xs text-gray-500 mt-1">{payment.createdAt}</p>
                                            </div>
                                            <span
                                                className={`text-sm font-semibold ${payment.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {payment.amount > 0 ? '+' : ''}{payment.amount.toLocaleString('ru-RU')} ₽
                    </span>
                                        </div>
                                        <div className="mt-3">
                    <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${payment.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {payment.status}
                    </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : ''}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BalancePage;
