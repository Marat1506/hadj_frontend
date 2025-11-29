import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {api} from "@/services";

import {RootState} from '../store';
import {resetPassword} from '../store/slices/authSlice';
import {useToast} from "@/hooks/use-toast";
import {useMutation} from "@tanstack/react-query";
import DateInput from "@/components/ui/date-input";
import {loginSuccess} from '@/store/slices/authSlice';
import FloatingInput from "@/components/ui/floating-input";

type Gender = "male" | "female";
type PassportTerm = "with_deadline" | "without_deadline";

interface FormDataState {
    lastName: string;
    firstName: string;
    middleName: string;
    birthDate: string;
    gender: Gender;
    id?: string | number;

    foreignLastName: string;
    foreignFirstName: string;
    citizenship: string;
    issueCountry: string;
    issueDate: string;
    passportNumber: string;
    expiryDate: string;
    fms: string;

    russianPassportNumber: string;
    passportTerm: PassportTerm;
    russianExpiryDate: string;
    issuedBy: string;
    issuedDate: string;
    departmentCode: string;
    residence: string;

    snils: string;
    inn: string;

    postalCode: string;
    region: string;
    district: string;
    street: string;
    house: string;
    building: string;
    structure: string;
    apartment: string;

    phone: string;
}

const initialFormData: FormDataState = {
    lastName: "",
    firstName: "",
    middleName: "",
    birthDate: "",
    gender: "male",

    foreignLastName: "",
    foreignFirstName: "",
    citizenship: "",
    issueCountry: "",
    issueDate: "",
    passportNumber: "",
    expiryDate: "",
    fms: "",

    russianPassportNumber: "",
    passportTerm: "without_deadline",
    russianExpiryDate: "",
    issuedBy: "",
    issuedDate: "",
    departmentCode: "",
    residence: "",

    snils: "",
    inn: "",

    postalCode: "",
    region: "",
    district: "",
    street: "",
    house: "",
    building: "",
    structure: "",
    apartment: "",

    phone: "",
};

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

const Profile: React.FC = () => {
    const dispatch = useDispatch();
    const {user, isAuthenticated, loading, error}: any = useSelector((state: RootState) => state.user);

    const {toast} = useToast();

    const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');

    const [formData, setFormData] = useState<FormDataState>(initialFormData);
    const [errors, setErrors] = useState<Record<string, string | boolean>>({});

    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
    });

    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');

    // Функции валидации для конкретных полей
    const validatePassportNumber = (value: string): string => {
        if (!value) return 'Серия и номер заграничного паспорта обязательны';
        if (!/^\d+$/.test(value)) return 'Серия и номер паспорта должны содержать только цифры (например: 721234567)';
        if (value.length !== 9) return 'Серия и номер должны содержать 9 цифр (например: 721234567)';
        return '';
    };

    const validateRussianPassportNumber = (value: string): string => {
        if (!value) return 'Серия и номер российского паспорта обязательны';
        if (!/^\d+$/.test(value)) return 'Серия и номер паспорта должны содержать только цифры (например: 4516789012)';
        if (value.length !== 10) return 'Серия и номер должны содержать 10 цифр (например: 4516789012)';
        return '';
    };

    const validateDepartmentCode = (value: string): string => {
        if (!value) return 'Код подразделения обязателен';
        if (!/^\d+$/.test(value)) return 'Код подразделения должен содержать только цифры (например: 770045)';
        if (value.length !== 6) return 'Код подразделения должен содержать 6 цифр (например: 770045)';
        return '';
    };

    const validateSnils = (value: string): string => {
        if (!value) return 'СНИЛС обязателен';
        if (!/^\d+$/.test(value)) return 'СНИЛС должен содержать только цифры (например: 12345678901)';
        if (value.length !== 11) return 'СНИЛС должен содержать 11 цифр (например: 12345678901)';
        return '';
    };

    const validateInn = (value: string): string => {
        if (!value) return 'ИНН обязателен';
        if (!/^\d+$/.test(value)) return 'ИНН должен содержать только цифры (например: 771234567890)';
        if (value.length !== 12) return 'ИНН должен содержать 12 цифр (например: 771234567890)';
        return '';
    };

    const validatePostalCode = (value: string): string => {
        if (!value) return 'Почтовый индекс обязателен';
        if (!/^\d+$/.test(value)) return 'Индекс должен содержать только цифры (например: 125047)';
        if (value.length !== 6) return 'Индекс должен содержать 6 цифр (например: 125047)';
        return '';
    };

    const getUserInfo = async () => {
        try {
            const data = await api.getUserInfo();
            const {
                password,
                foreignPassportFile,
                russianPassportFile,
                visaPhotoFile,
                selfieWithPassportFile,
                ...rest
            } = data;
            setFormData((prev) => ({...prev, ...rest}));

            dispatch(loginSuccess({user: data}));
        } catch (error: any) {
            console.error("Ошибка при получении данных:", error);
            toast({
                title: "Ошибка",
                description:
                    error.response?.data?.message ||
                    "Не удалось загрузить данные пользователя",
                variant: "destructive",
            });
        }
    };

    const {mutate: updateUserData, isPending: isUpdating} = useMutation({
        mutationFn: (data: FormDataState) => api.updateUserData(data),
        onSuccess: () => {
            getUserInfo();
            toast({
                variant: "default",
                title: "Успешно",
                description: "Данные пользователя обновлены.",
            });
        },
        onError: (error: any) => {
            console.error("Update Error:", error);
            toast({
                title: "Ошибка обновления",
                description:
                    error.response?.data?.message || "Произошла непредвиденная ошибка.",
                variant: "destructive",
            });
        },
    });

    const handleChange = (
        field: keyof FormDataState,
        value: string | Gender | PassportTerm
    ) => {
        setFormData((prev) => ({...prev, [field]: value}));
        setErrors((prev) => ({...prev, [field]: false}));
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string | boolean> = {};

        // Поля, которые не являются обязательными
        const optionalFields: string[] = [
            'building', 
            'structure', 
            'apartment',
            'foreignPassportFileUrl',
            'russianPassportFileUrl',
            'visaPhotoFileUrl',
            'selfieWithPassportFileUrl',
            'id' // ID тоже не обязательное поле
        ];

        // Валидация специфичных полей
        const passportError = validatePassportNumber(formData.passportNumber);
        if (passportError) {
            newErrors.passportNumber = passportError;
        }

        const russianPassportError = validateRussianPassportNumber(formData.russianPassportNumber);
        if (russianPassportError) {
            newErrors.russianPassportNumber = russianPassportError;
        }

        const departmentCodeError = validateDepartmentCode(formData.departmentCode);
        if (departmentCodeError) {
            newErrors.departmentCode = departmentCodeError;
        }

        const snilsError = validateSnils(formData.snils);
        if (snilsError) {
            newErrors.snils = snilsError;
        }

        const innError = validateInn(formData.inn);
        if (innError) {
            newErrors.inn = innError;
        }

        const postalCodeError = validatePostalCode(formData.postalCode);
        if (postalCodeError) {
            newErrors.postalCode = postalCodeError;
        }

        // Проверка остальных обязательных полей
        (Object.keys(formData) as (keyof FormDataState)[]).forEach((key) => {
            // Пропускаем необязательные поля и уже проверенные
            if (optionalFields.includes(key) || newErrors[key]) {
                return;
            }

            const value = formData[key];
            if (value === "" || value === null || value === undefined) {
                newErrors[key] = true;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            toast({
                title: "Ошибка",
                description: "Пожалуйста, заполните все обязательные поля.",
                variant: "destructive",
            });
            return;
        }

        // Создаем копию данных и удаляем пустые необязательные поля и поля файлов
        const dataToSend: any = {...formData};
        const fieldsToRemove = [
            'building', 
            'structure', 
            'apartment',
            'foreignPassportFileUrl',
            'russianPassportFileUrl',
            'visaPhotoFileUrl',
            'selfieWithPassportFileUrl',
            'id'
        ];
        
        fieldsToRemove.forEach(field => {
            if (!dataToSend[field] || dataToSend[field] === '' || field.includes('FileUrl') || field === 'id') {
                delete dataToSend[field];
            }
        });

        updateUserData(dataToSend);
    };

    useEffect(() => {
        getUserInfo();
    }, []);

    const inputClass = (key: keyof FormDataState) =>
        `text-sm font-medium bg-transparent outline-none flex-1 max-w-[60%] transition-colors ${
            errors[key] ? "placeholder-red-500" : ""
        }`;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setPasswordData(prev => ({...prev, [name]: value}));
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess('');

        try {
            await dispatch(resetPassword(passwordData) as any);
            setPasswordSuccess('Пароль успешно изменен!');
            setPasswordData({oldPassword: '', newPassword: ''});
            toast({title: 'Пароль успешно изменен!'});
        } catch (err) {
            setPasswordError('Ошибка при изменении пароля');
            toast({title: 'Ошибка при изменении пароля'});
        }
    };

    if (loading) return <div className="container mx-auto p-4">Загрузка профиля...</div>;
    if (error) return <div className="container mx-auto p-4 text-red-500">Ошибка загрузки профиля: {error}</div>;
    if (!isAuthenticated) return <div className="container mx-auto p-4">Пожалуйста, войдите в систему для просмотра
        профиля.</div>;
    if (!user) return <div className="container mx-auto p-4">Данные пользователя не найдены.</div>;

    return (
        <div className="min-h-screen flex flex-col items-center px-2 sm:px-0">
            <div className="max-w-[700px] w-full mt-4 mb-4">
                <h1 className="text-2xl font-extrabold text-gray-800 mb-4">Профиль</h1>

                {/* Навигация по табам */}
                <div className="flex border-b mb-6">
                    <button
                        className={`px-4 py-2 text-[14px] sm:text-base font-medium transition-colors border-b-2 ${
                            activeTab === 'profile'
                                ? 'border-[#042253] text-[#042253]'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                        onClick={() => setActiveTab('profile')}
                    >
                        Редактирование профиля
                    </button>
                    <button
                        className={`ml-6 px-4 py-2 text-sm sm:text-base font-medium transition-colors border-b-2 ${
                            activeTab === 'password'
                                ? 'border-[#042253] text-[#042253]'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                        onClick={() => setActiveTab('password')}
                    >
                        Смена пароля
                    </button>
                </div>

                {/* Контент табов */}
                {activeTab === 'profile' && (
                    <form
                        onSubmit={handleSubmit}
                        className="w-full bg-white rounded-xl shadow-lg"
                    >
                        {/* --- Персональные данные --- */}
                        <div className="brand-bg rounded-t-xl px-4 py-3">
            <span className="font-semibold text-white text-sm">
              Персональные данные
            </span>
                        </div>
                        <div className="px-4 space-y-4 bg-white py-4">
                            <div className="flex items-center">
                                <FloatingInput
                                    label="Фамилия"
                                    value={formData.lastName}
                                    onChange={(e) => handleChange("lastName", e.target.value)}
                                    error={errors.lastName}
                                />
                            </div>
                            <div className="flex items-center">
                                <FloatingInput
                                    label="Имя"
                                    value={formData.firstName}
                                    onChange={(e) => handleChange("firstName", e.target.value)}
                                    error={errors.firstName}
                                />
                            </div>
                            <div className="flex items-center">
                                <FloatingInput
                                    label="Отчество"
                                    value={formData.middleName}
                                    onChange={(e) => handleChange("middleName", e.target.value)}
                                    error={errors.middleName}
                                />
                            </div>
                            <div className="flex items-center py-3">
                                <DateInput
                                    placeholder="Дата рождения"
                                    value={formData.birthDate}
                                    onChange={(val) => handleChange("birthDate", val)}
                                    className={`w-[150px] ${
                                        errors.birthDate ? "border border-red-500 rounded" : ""
                                    }`}
                                />
                            </div>
                            <div className="flex items-center py-3">
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        className={`px-4 py-1 rounded text-sm font-medium transition-colors ${
                                            formData.gender === "male"
                                                ? "brand-bg text-white"
                                                : "bg-white text-gray-700 border-gray-300 border"
                                        }`}
                                        onClick={() => handleChange("gender", "male")}
                                    >
                                        Мужчина
                                    </button>
                                    <button
                                        type="button"
                                        className={`px-4 py-1 rounded text-sm font-medium transition-colors ${
                                            formData.gender === "female"
                                                ? "brand-bg text-white"
                                                : "bg-white text-gray-700 border-gray-300 border"
                                        }`}
                                        onClick={() => handleChange("gender", "female")}
                                    >
                                        Женщина
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <FloatingInput
                                    type="tel"
                                    label="Телефон"
                                    value={formData.phone}
                                    onChange={(e) => handleChange("phone", e.target.value)}
                                    error={errors.phone}
                                />
                            </div>
                        </div>

                        {/* Заграничный паспорт */}
                        <div className="brand-bg px-4 py-3">
            <span className="font-semibold text-white text-sm">
              Заграничный паспорт
            </span>
                        </div>
                        <div className="px-4 space-y-4 bg-white py-4">
                            <div className="flex items-center">
                                <FloatingInput
                                    label="Фамилия (Лат.)"
                                    value={formData.foreignLastName}
                                    onChange={(e) => handleChange("foreignLastName", e.target.value)}
                                    error={errors.foreignLastName}
                                />
                            </div>
                            <div className="flex items-center">
                                <FloatingInput
                                    label="Имя (Лат.)"
                                    value={formData.foreignFirstName}
                                    onChange={(e) => handleChange("foreignFirstName", e.target.value)}
                                    error={errors.foreignFirstName}
                                />
                            </div>
                            <div className="flex items-center">
                                <FloatingInput
                                    label="Гражданство"
                                    value={formData.citizenship}
                                    onChange={(e) => handleChange("citizenship", e.target.value)}
                                    error={errors.citizenship}
                                />
                            </div>
                            <div className="flex items-center">
                                <FloatingInput
                                    label="Страна выдачи"
                                    value={formData.issueCountry}
                                    onChange={(e) => handleChange("issueCountry", e.target.value)}
                                    error={errors.issueCountry}
                                />
                            </div>
                            <div className="flex items-center py-3">
                                <DateInput
                                    placeholder="Дата выдачи"
                                    value={formData.issueDate}
                                    onChange={(val) => handleChange("issueDate", val)}
                                    className="w-[150px]"
                                />
                            </div>
                            <div className="flex items-center">
                                <FloatingInput
                                    label="Серия и номер"
                                    value={formData.passportNumber}
                                    onChange={(e) => handleChange("passportNumber", e.target.value)}
                                    error={errors.passportNumber}
                                />
                            </div>
                            <div className="flex items-center py-3">
                                <DateInput
                                    placeholder="Годен до"
                                    value={formData.expiryDate}
                                    onChange={(val) => handleChange("expiryDate", val)}
                                    className="w-[150px]"
                                />
                            </div>
                            <div className="flex items-center">
                                <FloatingInput
                                    label="ФМС"
                                    value={formData.fms}
                                    onChange={(e) => handleChange("fms", e.target.value)}
                                    error={errors.fms}
                                />
                            </div>
                        </div>

                        {/* Российский паспорт */}
                        <div className="brand-bg px-4 py-3">
            <span className="font-semibold text-white text-sm">
              Российский паспорт
            </span>
                        </div>
                        <div className="px-4 space-y-4 bg-white py-4">
                            <div className="flex items-center">
                                <FloatingInput
                                    label="Серия и номер"
                                    value={formData.russianPassportNumber}
                                    onChange={(e) => handleChange("russianPassportNumber", e.target.value)}
                                    error={errors.russianPassportNumber}
                                />
                            </div>
                            <div className="flex items-center py-3">
                                <div className="flex gap-2 justify-end">
                                    <button
                                        type="button"
                                        className={`px-4 py-1 rounded text-sm font-medium transition-colors ${
                                            formData.passportTerm === "with_deadline"
                                                ? "brand-bg text-white border-amber-600"
                                                : "bg-white text-gray-700 border-gray-300 border"
                                        }`}
                                        onClick={() => handleChange("passportTerm", "with_deadline")}
                                    >
                                        Срочный
                                    </button>
                                    <button
                                        type="button"
                                        className={`px-4 py-1 rounded text-sm font-medium transition-colors ${
                                            formData.passportTerm === "without_deadline"
                                                ? "brand-bg text-white border-amber-600"
                                                : "bg-white text-gray-700 border-gray-300 border"
                                        }`}
                                        onClick={() => handleChange("passportTerm", "without_deadline")}
                                    >
                                        Бессрочный
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center py-3">
                                <DateInput
                                    placeholder="Годен до"
                                    value={formData.russianExpiryDate}
                                    onChange={(val) => handleChange("russianExpiryDate", val)}
                                    className="w-[150px]"
                                />
                            </div>
                            <div className="flex items-center">
                                <FloatingInput
                                    label="Кем выдан"
                                    value={formData.issuedBy}
                                    onChange={(e) => handleChange("issuedBy", e.target.value)}
                                    error={errors.issuedBy}
                                />
                            </div>
                            <div className="flex items-center py-3">
                                <DateInput
                                    placeholder="Когда выдан"
                                    value={formData.issuedDate}
                                    onChange={(val) => handleChange("issuedDate", val)}
                                    className="w-[150px]"
                                />
                            </div>
                            <div className="flex items-center">
                                <FloatingInput
                                    label="Код подразделения"
                                    value={formData.departmentCode}
                                    onChange={(e) => handleChange("departmentCode", e.target.value)}
                                    error={errors.departmentCode}
                                />
                            </div>
                            <div className="flex items-center">
                                <FloatingInput
                                    label="Место проживания"
                                    value={formData.residence}
                                    onChange={(e) => handleChange("residence", e.target.value)}
                                    error={errors.residence}
                                />
                            </div>
                        </div>

                        {/* СНИЛС и ИНН */}
                        <div className="brand-bg px-4 py-3">
                            <span className="font-semibold text-white text-sm">СНИЛС и ИНН</span>
                        </div>
                        <div className="px-4 space-y-4 bg-white py-4">
                            <div className="flex items-center">
                                <FloatingInput
                                    label="СНИЛС"
                                    value={formData.snils}
                                    onChange={(e) => handleChange("snils", e.target.value)}
                                    error={errors.snils}
                                />
                            </div>
                            <div className="flex items-center">
                                <FloatingInput
                                    label="ИНН"
                                    value={formData.inn}
                                    onChange={(e) => handleChange("inn", e.target.value)}
                                    error={errors.inn}
                                />
                            </div>
                        </div>

                        {/* Адрес регистрации */}
                        <div className="brand-bg px-4 py-3">
            <span className="font-semibold text-white text-sm">
              Адрес регистрации
            </span>
                        </div>
                        <div className="px-4 space-y-4 bg-white py-4">
                            <div className="flex items-center">
                                <FloatingInput
                                    label="Индекс"
                                    value={formData.postalCode}
                                    onChange={(e) => handleChange("postalCode", e.target.value)}
                                    error={errors.postalCode}
                                />
                            </div>
                            <div className="flex items-center">
                                <FloatingInput
                                    label="Регион"
                                    value={formData.region}
                                    onChange={(e) => handleChange("region", e.target.value)}
                                    error={errors.region}
                                />
                            </div>
                            <div className="flex items-center">
                                <FloatingInput
                                    label="Район или город"
                                    value={formData.district}
                                    onChange={(e) => handleChange("district", e.target.value)}
                                    error={errors.district}
                                />
                            </div>
                            <div className="flex items-center">
                                <FloatingInput
                                    label="Улица"
                                    value={formData.street}
                                    onChange={(e) => handleChange("street", e.target.value)}
                                    error={errors.street}
                                />
                            </div>
                            <div className="flex items-center">
                                <FloatingInput
                                    label="Дом"
                                    value={formData.house}
                                    onChange={(e) => handleChange("house", e.target.value)}
                                    error={errors.house}
                                />
                            </div>
                            <div className="flex items-center">
                                <FloatingInput
                                    label="Корпус (если есть)"
                                    value={formData.building}
                                    onChange={(e) => handleChange("building", e.target.value)}
                                    error={errors.building}
                                />
                            </div>
                            <div className="flex items-center">
                                <FloatingInput
                                    label="Строение (если есть)"
                                    value={formData.structure}
                                    onChange={(e) => handleChange("structure", e.target.value)}
                                    error={errors.structure}
                                />
                            </div>
                            <div className="flex items-center">
                                <FloatingInput
                                    label="Квартира (если есть)"
                                    value={formData.apartment}
                                    onChange={(e) => handleChange("apartment", e.target.value)}
                                    error={errors.apartment}
                                />
                            </div>
                        </div>

                        <div className="p-4 flex justify-end">
                            <button
                                type="submit"
                                disabled={isUpdating}
                                className="brand-bg text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50"
                            >
                                {isUpdating ? "Сохраняем..." : "Сохранить"}
                            </button>
                        </div>
                    </form>
                )}

                {activeTab === 'password' && (
                    <div className="bg-white shadow-md rounded-2xl p-6 sm:p-8">
                        <form onSubmit={handlePasswordSubmit}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Старый
                                        пароль</label>
                                    <input
                                        type="password"
                                        name="oldPassword"
                                        value={passwordData.oldPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Новый пароль</label>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-end items-center gap-3">
                                {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
                                {passwordSuccess && <p className="text-green-500 text-sm">{passwordSuccess}</p>}
                                <button
                                    type="submit"
                                    className="brand-bg text-white px-6 py-3 rounded-xl font-medium hover:bg-green-700 transition"
                                    disabled={loading}
                                >
                                    {loading ? 'Смена...' : 'Сменить пароль'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
