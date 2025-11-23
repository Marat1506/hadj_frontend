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
    const [errors, setErrors] = useState<Record<string, boolean>>({});

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
        const newErrors: Record<string, boolean> = {};
        Object.entries(form).forEach(([key, value]) => {
            if (!isEdit && (value === '' || value === null)) {
                newErrors[key] = true;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const formData = new FormData();
            Object.entries(form).forEach(([key, value]) => {
                if (value !== null && value !== '') {
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
                                    className={`border rounded-lg p-2 ${errors[key] ? 'border-red-500' : ''}`}
                                    required={!isEdit}
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
                                    className={`border rounded-lg p-2 ${errors[key] ? 'border-red-500' : ''}`}
                                    required={!isEdit}
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
                                    className={`border rounded-lg p-2 ${errors[key] ? 'border-red-500' : ''}`}
                                    required={!isEdit}
                                />
                            )}
                        </div>
                    ))}

                    {/* --- КРАСИВЫЕ ПОЛЯ ДЛЯ ФАЙЛОВ --- */}
                    {Object.entries({
                        foreignPassportFile: 'Загранпаспорт (файл)',
                        russianPassportFile: 'Российский паспорт (файл)',
                        visaPhotoFile: 'Фото для визы',
                        selfieWithPassportFile: 'Селфи с паспортом',
                    }).map(([key, label]) => (
                        <div
                            key={key}
                            className={`flex flex-col border-2 border-dashed rounded-xl p-4 text-center transition hover:border-blue-400 ${
                                errors[key] ? 'border-red-500' : 'border-gray-300'
                            }`}
                        >
                            <label
                                htmlFor={key}
                                className="cursor-pointer flex flex-col items-center justify-center gap-2 text-gray-600 hover:text-blue-600 transition"
                            >
                                <Upload size={24}/>
                                <span className="text-sm font-medium">{label}</span>
                                <span className="text-xs text-gray-400">
                  {form[key as keyof typeof form]
                      ? (form[key as keyof typeof form] as File).name
                      : 'Нажмите, чтобы выбрать файл'}
                </span>
                            </label>
                            <input
                                id={key}
                                type="file"
                                name={key}
                                onChange={handleFileChange}
                                className="hidden"
                                required={!isEdit}
                            />
                        </div>
                    ))}
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
