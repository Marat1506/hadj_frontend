'use client';

import {useEffect, useState} from 'react';

import {faChevronLeft} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {useRouter} from 'next/navigation';

import {api} from '@/services';

const ChecklistPage = () => {
    const router = useRouter();
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Загрузка чеклиста с сервера
    useEffect(() => {
        const fetchChecklist = async () => {
            try {
                setLoading(true);
                const data = await api.getChecklist({
                    includeCompleted: true
                });
                setTasks(data);
            } catch (err: any) {
                console.error('Ошибка при загрузке чек-листа:', err);
                setError('Не удалось загрузить чек-лист.');
            } finally {
                setLoading(false);
            }
        };

        fetchChecklist();
    }, []);

    // Переключение чекбокса
    const toggleTask = async (id: number) => {
        try {
            // Обновляем на сервере
            await api.patchChecklistItemToggle(id);

            // Обновляем локально
            setTasks(tasks => tasks.map(task =>
                task.id === id ? {...task, isCompleted: !task.isCompleted} : task
            ));
        } catch (err) {
            console.error('Ошибка при переключении задачи:', err);
            alert('Не удалось обновить статус задачи. Попробуйте снова.');
        }
    };

    const resetTasks = () => {
        if (confirm('Вы уверены, что хотите сбросить весь прогресс?')) {
            // Опционально — можно вызвать отдельный API для сброса, если он существует.
            setTasks(tasks.map(task => ({...task, isCompleted: false})));
        }
    };

    const completed = tasks.filter(t => t.isCompleted).length;
    const percent = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-700">
                Загрузка чек-листа...
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-red-600">
                <p>{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    Повторить попытку
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex flex-col pb-16">
            <div className="container mx-auto px-4 py-2">
                <header className="flex items-center mb-6">
                    <button
                        className="mr-3 text-blue-800 hover:text-blue-600 text-xl p-2 rounded-full hover:bg-blue-100 transition-colors flex items-center justify-center w-10 h-10"
                        onClick={() => router.push('/')}
                    >
                        <FontAwesomeIcon icon={faChevronLeft}/>
                    </button>
                    <h1 className="text-xl font-bold text-gray-900">Чек-лист подготовки</h1>
                </header>

                <div className="flex justify-center px-2 sm:px-0">
                    <div className="w-full max-w-[700px] bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* Header */}
                <div className="brand-bg from-blue-600 to-indigo-700 text-white p-6 text-center">
                    <h1 className="text-2xl md:text-3xl font-bold mb-2">Чек-лист подготовки</h1>
                    <p className="text-blue-100">Отметьте выполненные задачи для отслеживания прогресса</p>
                </div>

                <div className="p-6">
                    {/* Progress Section */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-gray-700 font-semibold">
                                Выполнено: {completed} из {tasks.length}
                            </span>
                            <span className="text-blue-600 font-bold text-lg">{percent}%</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500 ease-out"
                                style={{width: `${percent}%`}}
                            ></div>
                        </div>

                        {completed === tasks.length && tasks.length > 0 && (
                            <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg text-center">
                                🎉 Поздравляем! Все задачи выполнены!
                            </div>
                        )}
                    </div>

                    {/* Tasks List */}
                    <ul className="space-y-4 mb-8">
                        {tasks.map((task) => (
                            <li
                                key={task.id}
                                className={`flex items-center rounded-xl p-4 shadow-sm transition-all duration-200 ${
                                    task.isCompleted
                                        ? 'bg-green-50 border border-green-200'
                                        : 'bg-white border border-gray-200 hover:shadow-md'
                                }`}
                            >
                                <input
                                    type="checkbox"
                                    checked={task.isCompleted}
                                    onChange={() => toggleTask(task.id)}
                                    className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 rounded focus:ring-blue-500 mr-4 cursor-pointer"
                                />
                                <span
                                    className={`text-lg font-medium ${
                                        task.isCompleted ? 'line-through text-gray-500' : 'text-gray-800'
                                    }`}
                                >
                                    {task.title}
                                </span>
                            </li>
                        ))}
                    </ul>

                    {/* Reset Button */}
                    <div className="text-center">
                        <button
                            onClick={resetTasks}
                            className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors font-medium"
                        >
                            Сбросить прогресс
                        </button>
                    </div>
                </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChecklistPage;
