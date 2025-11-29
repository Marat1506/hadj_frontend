import React, {useEffect, useState} from 'react';

import {faChevronLeft} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {useRouter} from 'next/navigation';
import {useToast} from '@/hooks/use-toast';

import {api} from '@/services';

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

interface MedicalCardData {
    id?: number;
    bloodGroup: string | null;
    bloodPressure: string | null;
    asthma: boolean;
    bronchialDisease: boolean;
    pulmonaryHeartDisorder: boolean;
    otherChronicDiseases: string;
    meningitisVaccineUrl: string | null;
    fluVaccineUrl: string | null;
    covidVaccineUrl: string | null;
    hadCovidBefore: 'Да' | 'Нет';
    covidTestResultUrl: string | null;
}

interface FileWithPreview {
    file: File;
    preview: string;
}

const MedicalCardPage = () => {
    const {toast} = useToast();

    const [medicalCard, setMedicalCard] = useState<MedicalCardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deletedFiles, setDeletedFiles] = useState<(keyof MedicalCardData)[]>([]);

    // Form states
    const [blood, setBlood] = useState<string | null>(null);
    const [bloodEdit, setBloodEdit] = useState(false);
    const [pressure, setPressure] = useState<string | null>(null);
    const [pressureEdit, setPressureEdit] = useState(false);
    const [chronic, setChronic] = useState({
        asthma: false,
        bronchialDisease: false,
        pulmonaryHeartDisorder: false,
        otherChronicDiseases: '',
    });
    const [covid, setCovid] = useState<'Да' | 'Нет'>('Нет');
    const [files, setFiles] = useState<{
        meningitisVaccines?: FileWithPreview;
        fluVaccines?: FileWithPreview;
        covidVaccines?: FileWithPreview;
        covidTestResults?: FileWithPreview;
    }>({});
    const router = useRouter();

    // Fetch medical card on mount
    useEffect(() => {
        const fetchMedicalCard = async () => {
            try {
                const data = await api.getMedicalCard();

                setMedicalCard(data);
                setBlood(data.bloodGroup || null);
                setPressure(data.bloodPressure || null);
                setChronic({
                    asthma: data.asthma,
                    bronchialDisease: data.bronchialDisease,
                    pulmonaryHeartDisorder: data.pulmonaryHeartDisorder,
                    otherChronicDiseases: data.otherChronicDiseases || '',
                });
                setCovid(data.hadCovidBefore || 'Нет');
            } catch (err: any) {
                if (err.response?.status === 404) {
                    setMedicalCard(null);
                } else {
                    setError('Не удалось загрузить медицинскую карту');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchMedicalCard();
    }, []);

    // Clean up object URLs
    useEffect(() => {
        return () => {
            Object.values(files).forEach((file) => {
                if (file?.preview) {
                    URL.revokeObjectURL(file.preview);
                }
            });
        };
    }, [files]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Проверяем: или есть локальный файл, или на бэке уже есть ссылка (и не удалена)
        // const isFileMissing =
        //     (!files.meningitisVaccines?.file && (!medicalCard?.meningitisVaccineUrl || deletedFiles.includes('meningitisVaccineUrl'))) ||
        //     (!files.fluVaccines?.file && (!medicalCard?.fluVaccineUrl || deletedFiles.includes('fluVaccineUrl'))) ||
        //     (!files.covidVaccines?.file && (!medicalCard?.covidVaccineUrl || deletedFiles.includes('covidVaccineUrl'))) ||
        //     (!files.covidTestResults?.file && (!medicalCard?.covidTestResultUrl || deletedFiles.includes('covidTestResultUrl')));
        //
        // if (isFileMissing) {
        //     toast({
        //         title: 'Ошибка',
        //         description: 'Загрузите все необходимые файлы',
        //         variant: 'destructive',
        //     });
        //     return;
        // }
        setLoading(true);
        setError(null);

        try {
            const formData = api.prepareMedicalCardFormData({
                id: medicalCard?.id,
                bloodGroup: blood,
                bloodPressure: pressure,
                asthma: chronic.asthma,
                bronchialDisease: chronic.bronchialDisease,
                pulmonaryHeartDisorder: chronic.pulmonaryHeartDisorder,
                otherChronicDiseases: chronic.otherChronicDiseases || 'Нет',
                hadCovidBefore: covid,
                meningitisVaccines: files.meningitisVaccines?.file,
                fluVaccines: files.fluVaccines?.file,
                covidVaccines: files.covidVaccines?.file,
                covidTestResults: files.covidTestResults?.file,
                deletedFiles,
            });

            const data = medicalCard
                ? await api.updateMedicalCard(formData)
                : await api.createMedicalCard(formData);

            setFiles({});
            setDeletedFiles([]);
            setMedicalCard(data);
        } catch (err: any) {
            setError(err.response?.data?.message?.[0] || 'Не удалось сохранить медицинскую карту');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (field: keyof typeof files, urlField: keyof MedicalCardData) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];
                const preview = URL.createObjectURL(file);
                setFiles((prev) => ({...prev, [field]: {file, preview}}));
                setDeletedFiles((prev) => prev.filter((f) => f !== urlField));
            }
        };

    const handleRemoveFile = (field: keyof typeof files, urlField: keyof MedicalCardData) => {
        if (medicalCard?.[urlField]) {
            setDeletedFiles((prev) => [...prev, urlField]);
        }
        console.log(field)
        if (files[field]?.preview) {
            URL.revokeObjectURL(files[field]!.preview);
        }
        setFiles((prev) => ({...prev, [field]: undefined}));

        if (field === 'covidTestResults') {
            setMedicalCard((prev) =>
                prev ? {...prev, covidTestResultUrl: null} : prev
            );

        }
        if (field === 'covidVaccines') {
            setMedicalCard((prev) =>
                prev ? {...prev, covidVaccineUrl: null} : prev
            );
        }
        if (field === 'fluVaccines') {
            setMedicalCard((prev) =>
                prev ? {...prev, fluVaccineUrl: null} : prev
            );
        }
        if (field === 'meningitisVaccines') {
            setMedicalCard((prev) =>
                prev ? {...prev, meningitisVaccineUrl: null} : prev
            );
        }
    };

    const renderFileInput = (
        field: keyof typeof files,
        urlField: keyof MedicalCardData,
        label: string
    ) => {
        const serverUrl: any = medicalCard ? medicalCard[urlField] : null;
        const localFile = files[field];
        const isDeleted = deletedFiles.includes(urlField);

        return (
            <div className="flex items-center py-3">
                <span className="text-gray-700 text-sm flex-1">{label}</span>
                <div className="flex gap-2">
                    {serverUrl && !isDeleted ? (
                        <div className="w-14 h-14 bg-gray-100 rounded-md flex items-center justify-center relative">
                            {serverUrl.endsWith('.pdf') ? (
                                <a
                                    href={serverUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline text-xs text-center px-1"
                                >
                                    PDF
                                </a>
                            ) : (
                                <img
                                    src={serverUrl}
                                    alt={`${label} document`}
                                    className="w-full h-full object-cover rounded-md"
                                />
                            )}
                            <button
                                type="button"
                                className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow text-red-500 text-xs border border-gray-200 w-5 h-5 flex items-center justify-center"
                                onClick={() => handleRemoveFile(field, urlField)}
                            >
                                ✕
                            </button>
                        </div>
                    ) : localFile ? (
                        <div className="w-14 h-14 bg-gray-100 rounded-md flex items-center justify-center relative">
                            {localFile.file.type === 'application/pdf' ? (
                                <span className="text-blue-600 text-xs">PDF</span>
                            ) : (
                                <img
                                    src={localFile.preview}
                                    alt={`${label} preview`}
                                    className="w-full h-full object-cover rounded-md"
                                />
                            )}
                            <button
                                type="button"
                                className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow text-red-500 text-xs border border-gray-200 w-5 h-5 flex items-center justify-center"
                                onClick={() => handleRemoveFile(field, urlField)}
                            >
                                ✕
                            </button>
                        </div>
                    ) : (
                        <label htmlFor={field} className="w-14 h-14 bg-gray-100 rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors relative">
                            <input
                                type="file"
                                id={field}
                                className="hidden"
                                onChange={handleFileChange(field, urlField)}
                                accept="image/*,.pdf"
                            />
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                            </svg>
                        </label>
                    )}
                </div>
            </div>
        );
    };

    if (loading && !medicalCard) {
        return <div className="min-h-screen flex items-center justify-center">Загрузка...</div>;
    }

    if (error) {
        return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
    }

    return (
        <div className="min-h-screen bg-white flex flex-col pb-16">
            <div className="container mx-auto px-4 py-2">
                <header className="flex items-center mb-6">
                    <div className="flex items-center">
                        <button
                            className="mr-3 text-blue-800 hover:text-blue-600 text-xl p-2 rounded-full hover:bg-blue-100 transition-colors flex items-center justify-center w-10 h-10"
                            onClick={() => router.push('/')}
                        >
                            <FontAwesomeIcon icon={faChevronLeft}/>
                        </button>
                        <h1 className="text-xl font-bold text-gray-900">Медицинская карта</h1>
                    </div>
                </header>

                <div className="flex justify-center">
                    <form
                        onSubmit={handleSubmit}
                        className="w-full max-w-[700px] bg-white rounded-xl shadow-lg p-0 sm:p-0"
                    >
                {/* Общие данные */}
                <div className="brand-bg border-b border-amber-600 px-4 py-3 rounded-t-xl">
                    <span className="font-semibold text-white text-sm">Общие данные</span>
                </div>
                <div className="px-4 divide-y divide-gray-200 bg-white">
                    {/* Группа крови */}
                    <div className="flex items-center py-3">
                        <span className="text-gray-500 text-sm flex-1">Группа крови</span>
                        {bloodEdit ? (
                            <select
                                className="text-blue-700 text-sm font-medium bg-white border border-gray-300 rounded px-2 py-1 outline-none"
                                value={blood || ''}
                                onChange={(e) => {
                                    setBlood(e.target.value);
                                    setBloodEdit(false);
                                }}
                                onBlur={() => setBloodEdit(false)}
                                autoFocus
                            >
                                <option value="" disabled>
                                    Выберите
                                </option>
                                {bloodGroups.map((bg) => (
                                    <option key={bg} value={bg}>
                                        {bg}
                                    </option>
                                ))}
                            </select>
                        ) : blood ? (
                            <span
                                className="text-blue-700 text-sm font-medium cursor-pointer"
                                onClick={() => setBloodEdit(true)}
                            >
                {blood}
              </span>
                        ) : (
                            <span
                                className="text-blue-700 text-sm font-medium cursor-pointer"
                                onClick={() => setBloodEdit(true)}
                            >
                Указать
              </span>
                        )}
                    </div>

                    {/* Кровяное давление */}
                    <div className="flex items-center py-3">
                        <span className="text-gray-500 text-sm flex-1">Кровяное давление</span>
                        {pressureEdit ? (
                            <input
                                className="text-blue-700 text-sm font-medium bg-white border border-gray-300 rounded px-2 py-1 outline-none w-24"
                                value={pressure || ''}
                                onChange={(e) => setPressure(e.target.value)}
                                onBlur={() => setPressureEdit(false)}
                                placeholder="120/80"
                                autoFocus
                            />
                        ) : pressure ? (
                            <span
                                className="text-blue-700 text-sm font-medium cursor-pointer"
                                onClick={() => setPressureEdit(true)}
                            >
                {pressure}
              </span>
                        ) : (
                            <span
                                className="text-blue-700 text-sm font-medium cursor-pointer"
                                onClick={() => setPressureEdit(true)}
                            >
                Указать
              </span>
                        )}
                    </div>
                </div>

                {/* Хронические заболевания */}
                <div className="brand-bg border-b border-amber-600 px-4 py-3">
                    <span className="font-semibold text-white text-sm">Хронические заболевания</span>
                </div>
                <div className="px-4 divide-y divide-gray-200 bg-white">
                    <div className="flex items-center py-3">
                        <span className="text-gray-700 text-sm flex-1">Астма</span>
                        <input
                            type="checkbox"
                            checked={chronic.asthma}
                            onChange={(e) => setChronic((c) => ({...c, asthma: e.target.checked}))}
                            className="accent-amber-600 w-5 h-5"
                        />
                    </div>
                    <div className="flex items-center py-3">
                        <span className="text-gray-700 text-sm flex-1">Бронхоэктазическая болезнь</span>
                        <input
                            type="checkbox"
                            checked={chronic.bronchialDisease}
                            onChange={(e) => setChronic((c) => ({...c, bronchialDisease: e.target.checked}))}
                            className="accent-amber-600 w-5 h-5"
                        />
                    </div>
                    <div className="flex items-center py-3">
            <span className="text-gray-700 text-sm flex-1">
              Легочное сердце и нарушение легочного кровообращения
            </span>
                        <input
                            type="checkbox"
                            checked={chronic.pulmonaryHeartDisorder}
                            onChange={(e) =>
                                setChronic((c) => ({...c, pulmonaryHeartDisorder: e.target.checked}))
                            }
                            className="accent-amber-600 w-5 h-5"
                        />
                    </div>
                    <div className="flex items-center py-3">
                        <span className="text-gray-700 text-sm flex-1">Иное</span>
                        <input
                            type="text"
                            value={chronic.otherChronicDiseases}
                            onChange={(e) =>
                                setChronic((c) => ({...c, otherChronicDiseases: e.target.value}))
                            }
                            placeholder="Напишите сюда"
                            className="text-gray-700 text-sm text-right bg-transparent outline-none flex-1 max-w-[60%]"
                        />
                    </div>
                </div>

                {/* Прививки */}
                <div className="brand-bg border-b border-amber-600 px-4 py-3">
                    <span className="font-semibold text-white text-sm">Прививки</span>
                </div>
                <div className="px-4 divide-y divide-gray-200 bg-white">
                    {renderFileInput('meningitisVaccines', 'meningitisVaccineUrl', 'Менингит')}
                    {renderFileInput('fluVaccines', 'fluVaccineUrl', 'Грипп')}
                    {renderFileInput('covidVaccines', 'covidVaccineUrl', 'COVID-19')}
                </div>

                {/* COVID-19 */}
                <div className="brand-bg border-b border-amber-600 px-4 py-3">
                    <span className="font-semibold text-white text-sm">COVID-19</span>
                </div>
                <div className="px-4 divide-y divide-gray-200 bg-white">
                    <div className="flex items-center py-3">
                        <span className="text-gray-700 text-sm flex-1">Наличие прежде</span>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                className={`px-4 py-1 rounded-l border text-sm font-medium transition-colors ${
                                    covid === 'Да'
                                        ? 'brand-bg text-white border-amber-600'
                                        : 'bg-white text-gray-700 border-gray-300'
                                }`}
                                onClick={() => setCovid('Да')}
                            >
                                Да
                            </button>
                            <button
                                type="button"
                                className={`px-4 py-1 rounded-r border text-sm font-medium transition-colors ${
                                    covid === 'Нет'
                                        ? 'brand-bg text-white border-amber-600'
                                        : 'bg-white text-gray-700 border-gray-300'
                                }`}
                                onClick={() => setCovid('Нет')}
                            >
                                Нет
                            </button>
                        </div>
                    </div>
                    {renderFileInput(
                        'covidTestResults',
                        'covidTestResultUrl',
                        'Тест на COVID-19 (за 72 часа до вылета IgG + IgM)'
                    )}
                </div>

                <div className="px-4 pb-6">
                    <button
                        type="submit"
                        className="w-full brand-bg text-white py-2 rounded-lg font-semibold hover:bg-amber-700 transition-colors mt-4"
                        disabled={loading}
                    >
                        {loading ? 'СОХРАНЕНИЕ...' : 'СОХРАНИТЬ'}
                    </button>
                    {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
                </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default MedicalCardPage;
