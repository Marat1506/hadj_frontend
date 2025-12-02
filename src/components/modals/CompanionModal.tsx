'use client';

import React, {ChangeEvent, FormEvent, useEffect, useState} from 'react';
import {Button} from '@/components/ui/button';
import {api} from '@/services';
import {Upload, X} from 'lucide-react';

interface CompanionModalProps {
    open: boolean;
    onClose: () => void;
    companion?: any;
}

const CompanionModal: React.FC<CompanionModalProps> = ({open, onClose, companion}) => {
    const isEdit = Boolean(companion);

    const initialForm = {
        lastName: '',
        firstName: '',
        middleName: '',
        birthDate: '',
        gender: '',
        foreignLastName: '',
        foreignFirstName: '',
        citizenship: '',
        issueCountry: '',
        issueDate: '',
        passportNumber: '',
        expiryDate: '',
        fms: '',
        russianPassportNumber: '',
        passportTerm: '',
        russianExpiryDate: '',
        issuedBy: '',
        issuedDate: '',
        departmentCode: '',
        residence: '',
        snils: '',
        inn: '',
        postalCode: '',
        region: '',
        district: '',
        street: '',
        house: '',
        building: '',
        structure: '',
        apartment: '',
        foreignPassportFile: null as File | null,
        russianPassportFile: null as File | null,
        visaPhotoFile: null as File | null,
        selfieWithPassportFile: null as File | null,
    };

    const [form, setForm] = useState(initialForm);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Функции валидации
    const validatePassportNumber = (value: string): string => {
        if (!value) return 'Серия и номер заграничного паспорта обязательны';
        if (!/^\d+$/.test(value)) return 'Должны содержать только цифры (например: 721234567)';
        if (value.length !== 9) return 'Должны содержать 9 цифр';
        return '';
    };

    const validateRussianPassportNumber = (value: string): string => {
        if (!value) return 'Серия и номер российского паспорта обязательны';
        if (!/^\d+$/.test(value)) return 'Должны содержать только цифры (например: 4516789012)';
        if (value.length !== 10) return 'Должны содержать 10 цифр';
        return '';
    };

    const validateDepartmentCode = (value: string): string => {
        if (!value) return 'Код подразделения обязателен';
        if (!/^\d+$/.test(value)) return 'Должен содержать только цифры (например: 770045)';
        if (value.length !== 6) return 'Должен содержать 6 цифр';
        return '';
    };

    const validateSnils = (value: string): string => {
        if (!value) return 'СНИЛС обязателен';
        if (!/^\d+$/.test(value)) return 'Должен содержать только цифры (например: 12345678901)';
        if (value.length !== 11) return 'Должен содержать 11 цифр';
        return '';
    };

    const validateInn = (value: string): string => {
        if (!value) return 'ИНН обязателен';
        if (!/^\d+$/.test(value)) return 'Должен содержать только цифры (например: 771234567890)';
        if (value.length !== 12) return 'Должен содержать 12 цифр';
        return '';
    };

    const validatePostalCode = (value: string): string => {
        if (!value) return 'Почтовый индекс обязателен';
        if (!/^\d+$/.test(value)) return 'Должен содержать только цифры (например: 125047)';
        if (value.length !== 6) return 'Должен содержать 6 цифр';
        return '';
    };

    useEffect(() => {
        if (isEdit && companion) {
            setForm({
                ...initialForm,
                ...companion,
                foreignPassportFile: null,
                russianPassportFile: null,
                visaPhotoFile: null,
                selfieWithPassportFile: null,
            });
        } else {
            setForm(initialForm);
        }
        setErrors({});
    }, [companion, isEdit]);

    if (!open) return null;

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        setForm((prev) => ({...prev, [name]: value}));
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, files} = e.target;
        if (files && files[0]) {
            setForm((prev) => ({...prev, [name]: files[0]}));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        // Обязательные текстовые поля
        const requiredFields = [
            'lastName', 'firstName', 'middleName', 'birthDate', 'gender',
            'foreignLastName', 'foreignFirstName', 'citizenship', 'issueCountry',
            'issueDate', 'expiryDate', 'fms', 'passportTerm',
            'russianExpiryDate', 'issuedBy', 'issuedDate', 'residence',
            'region', 'district', 'street', 'house'
        ];

        requiredFields.forEach(field => {
            if (!form[field as keyof typeof form]) {
                newErrors[field] = 'Это поле обязательно';
            }
        });

        // Специфичная валидация
        const passportError = validatePassportNumber(form.passportNumber);
        if (passportError) newErrors.passportNumber = passportError;

        const russianPassportError = validateRussianPassportNumber(form.russianPassportNumber);
        if (russianPassportError) newErrors.russianPassportNumber = russianPassportError;

        const departmentCodeError = validateDepartmentCode(form.departmentCode);
        if (departmentCodeError) newErrors.departmentCode = departmentCodeError;

        const snilsError = validateSnils(form.snils);
        if (snilsError) newErrors.snils = snilsError;

        const innError = validateInn(form.inn);
        if (innError) newErrors.inn = innError;

        const postalCodeError = validatePostalCode(form.postalCode);
        if (postalCodeError) newErrors.postalCode = postalCodeError;

        // Файлы обязательны только при создании
        if (!isEdit) {
            if (!form.foreignPassportFile) newErrors.foreignPassportFile = 'Загрузите файл';
            if (!form.russianPassportFile) newErrors.russianPassportFile = 'Загрузите файл';
            if (!form.visaPhotoFile) newErrors.visaPhotoFile = 'Загрузите файл';
            if (!form.selfieWithPassportFile) newErrors.selfieWithPassportFile = 'Загрузите файл';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const formData = new FormData();
            
            // Необязательные поля, которые можно очищать
            const optionalFields = ['building', 'structure', 'apartment'];
            
            Object.entries(form).forEach(([key, value]) => {
                // Для файлов - только если есть значение
                if (value instanceof File) {
                    formData.append(key, value);
                }
                // Для необязательных полей - отправляем даже пустые строки при редактировании
                else if (isEdit && optionalFields.includes(key)) {
                    formData.append(key, value || '');
                }
                // Для остальных полей - только если не пустые
                else if (value !== null && value !== '') {
                    formData.append(key, value as any);
                }
            });

            if (isEdit) {
                await api.updateCompanions(companion.id, formData);
            } else {
                await api.createCompanions(formData);
            }

            onClose();
        } catch (error) {
            console.error('Ошибка при сохранении попутчика', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!companion) return;

        try {
            await api.deleteCompanions(companion.id);
            onClose();
        } catch (error) {
            console.error('Ошибка при удалении попутчика', error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[999] overflow-y-auto">
            <div className="bg-white sm:rounded-2xl w-full max-w-4xl h-full sm:h-auto p-6 shadow-xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                >
                    <X size={22}/>
                </button>

                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    {isEdit ? 'Редактировать попутчика' : 'Добавить попутчика'}
                </h2>

                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[80vh] sm:max-h-[70vh] overflow-y-auto pr-2"
                >
                    {/* Текстовые поля */}
                    {Object.entries({
                        lastName: 'Фамилия',
                        firstName: 'Имя',
                        middleName: 'Отчество',
                        birthDate: 'Дата рождения',
                        gender: 'Пол',
                        foreignLastName: 'Фамилия (иностран.)',
                        foreignFirstName: 'Имя (иностран.)',
                        citizenship: 'Гражданство',
                        issueCountry: 'Страна выдачи паспорта',
                        issueDate: 'Дата выдачи паспорта',
                        passportNumber: 'Номер загранпаспорта',
                        expiryDate: 'Дата истечения паспорта',
                        fms: 'Код подразделения ФМС',
                        russianPassportNumber: 'Номер российского паспорта',
                        passportTerm: 'Срок действия паспорта',
                        russianExpiryDate: 'Дата истечения рос. паспорта',
                        issuedBy: 'Кем выдан',
                        issuedDate: 'Дата выдачи рос. паспорта',
                        departmentCode: 'Код подразделения',
                        residence: 'Место жительства',
                        snils: 'СНИЛС',
                        inn: 'ИНН',
                        postalCode: 'Почтовый индекс',
                        region: 'Регион',
                        district: 'Район',
                        street: 'Улица',
                        house: 'Дом',
                        building: 'Корпус',
                        structure: 'Строение',
                        apartment: 'Квартира',
                    }).map(([key, label]) => (
                        <div key={key} className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
                            {key === 'gender' ? (
                                <select
                                    name={key}
                                    value={form[key as keyof typeof form] as string}
                                    onChange={handleChange}
                                    className={`border rounded-lg p-2 ${errors[key] ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                >
                                    <option value="">Выбери пол</option>
                                    <option value="male">Мужской</option>
                                    <option value="female">Женский</option>
                                </select>
                            ) : key === 'passportTerm' ? (
                                <select
                                    name={key}
                                    value={form[key as keyof typeof form] as string}
                                    onChange={handleChange}
                                    className={`border rounded-lg p-2 ${errors[key] ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                >
                                    <option value="">Выбери срок</option>
                                    <option value="with_deadline">Срок ограничен</option>
                                    <option value="without_deadline">Без срока</option>
                                </select>
                            ) : (
                                <input
                                    type={key.includes('Date') ? 'date' : 'text'}
                                    name={key}
                                    value={form[key as keyof typeof form] as string}
                                    onChange={handleChange}
                                    className={`border rounded-lg p-2 ${errors[key] ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                />
                            )}
                            {errors[key] && (
                                <span className="text-xs text-red-500 mt-1">{errors[key]}</span>
                            )}
                        </div>
                    ))}

                    {/* --- КРАСИВЫЕ ПОЛЯ ДЛЯ ФАЙЛОВ --- */}
                    {Object.entries({
                        foreignPassportFile: 'Загранпаспорт (файл)',
                        russianPassportFile: 'Российский паспорт (файл)',
                        visaPhotoFile: 'Фото для визы',
                        selfieWithPassportFile: 'Селфи с паспортом',
                    }).map(([key, label]) => {
                        const file = form[key as keyof typeof form] as File | null;
                        const hasFile = Boolean(file);
                        
                        return (
                            <div key={key} className="flex flex-col">
                                <div
                                    className={`flex flex-col border-2 border-dashed rounded-xl p-4 text-center transition ${
                                        hasFile 
                                            ? 'border-green-400 bg-green-50' 
                                            : errors[key] 
                                                ? 'border-red-500 bg-red-50' 
                                                : 'border-gray-300 hover:border-blue-400'
                                    }`}
                                >
                                    <label
                                        htmlFor={key}
                                        className="cursor-pointer flex flex-col items-center justify-center gap-2 text-gray-600 hover:text-blue-600 transition"
                                    >
                                        {hasFile ? (
                                            <>
                                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-sm font-medium text-green-700">{label}</span>
                                                <span className="text-xs text-green-600 font-medium">
                                                    ✓ {file.name}
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <Upload size={24} className={errors[key] ? 'text-red-500' : ''}/>
                                                <span className="text-sm font-medium">{label}</span>
                                                <span className="text-xs text-gray-400">
                                                    Нажмите, чтобы выбрать файл
                                                </span>
                                            </>
                                        )}
                                    </label>
                                    <input
                                        id={key}
                                        type="file"
                                        name={key}
                                        onChange={handleFileChange}
                                        className="hidden"
                                        accept="image/*,.pdf"
                                    />
                                </div>
                                {errors[key] && (
                                    <span className="text-xs text-red-500 mt-1">{errors[key]}</span>
                                )}
                            </div>
                        );
                    })}
                </form>

                {/* Кнопки */}
                <div className="flex justify-between mt-6">
                    {isEdit && (
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={loading}
                        >
                            Удалить
                        </Button>
                    )}
                    <div className="flex gap-3 ml-auto">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Отмена
                        </Button>
                        <Button
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                            type="submit"
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? 'Сохранение...' : 'Сохранить'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanionModal;
