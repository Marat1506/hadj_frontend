'use client';

export const dynamic = 'force-dynamic';

import React, {Suspense, useEffect, useMemo, useState} from "react";
import {useMutation} from "@tanstack/react-query";
import {useRouter, useSearchParams} from "next/navigation";

import DateInput from "@/components/ui/date-input";
import {useToast} from "@/hooks/use-toast";
import {api} from "@/services";

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

const DataVerificationContent = () => {
    const [formData, setFormData] = useState<FormDataState>(initialFormData);
    const [errors, setErrors] = useState<Record<keyof FormDataState, boolean>>(
        {} as Record<keyof FormDataState, boolean>
    );

    const {toast} = useToast();
    const router = useRouter();
    const searchParams = useSearchParams();

    const getUserInfo = async () => {
        try {
            const data = await api.getUserFullProfile();
            const {
                password,
                foreignPassportFile,
                russianPassportFile,
                visaPhotoFile,
                selfieWithPassportFile,
                ...rest
            } = data;
            setFormData((prev) => ({...prev, ...rest}));
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

    const tripParam = searchParams.get("trip");
    const groupParam = searchParams.get("group");

    const {trip, group} = useMemo(() => {
        try {
            const decode = (value: string | null) => {
                if (!value) return null;
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

    const postPaymentsCreate = async () => {
        try {
            const data = await api.postPaymentsCreate({
                tourId: String(trip?.id),
                amount: group?.priceRUB,
                currency: "RUB",
                customerEmail: "user@example.com",
                customerPhone: formData?.phone,
                userId: String(formData?.id),
            });
            window.location.href = data.confirmationUrl;
        } catch (error) {
            console.log(error);
        }
    };

    const {mutate: updateUserData, isPending: isUpdating} = useMutation({
        mutationFn: (data: FormDataState) => api.updateUserData(data),
        onSuccess: () => {
            toast({
                variant: "default",
                title: "Успешно",
                description: "Данные пользователя обновлены.",
            });
            postPaymentsCreate();
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
        const newErrors: Record<keyof FormDataState, boolean> = {} as Record<
            keyof FormDataState,
            boolean
        >;

        (Object.keys(formData) as (keyof FormDataState)[]).forEach((key) => {
            const value = formData[key];
            if (value === "" || value === null || value === undefined) {
                newErrors[key] = true;
            } else {
                newErrors[key] = false;
            }
        });

        setErrors(newErrors);
        return !Object.values(newErrors).includes(true);
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
        updateUserData(formData);
    };

    useEffect(() => {
        getUserInfo();
    }, []);

    const inputClass = (key: keyof FormDataState) =>
        `text-sm font-medium bg-transparent outline-none flex-1 max-w-[60%] transition-colors ${
            errors[key] ? "placeholder-red-500" : ""
        }`;

    return (
        <div className="container mx-auto max-w-4xl px-1 py-4">
            <button
                onClick={() => router.push("/hajj-package")}
                className="flex items-center gap-2 hover:bg-green-100 px-2 py-1 rounded-lg font-semibold mb-2 transition-colors"
            >
                <span className="text-2xl leading-none">←</span>
                <span>Назад к списку</span>
            </button>

            <h3 className="px-2 text-xl text-gray-900 mb-4">Проверьте данные</h3>

            <div className="min-h-screen flex items-center justify-center bg-gray-50">
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
                    <div className="px-4 divide-y divide-gray-200 bg-white">
                        <div className="flex items-center py-3">
                            <input
                                value={formData.lastName}
                                onChange={(e) => handleChange("lastName", e.target.value)}
                                className={inputClass("lastName")}
                                placeholder="Фамилия"
                            />
                        </div>
                        <div className="flex items-center py-3">
                            <input
                                value={formData.firstName}
                                onChange={(e) => handleChange("firstName", e.target.value)}
                                className={inputClass("firstName")}
                                placeholder="Имя"
                            />
                        </div>
                        <div className="flex items-center py-3">
                            <input
                                value={formData.middleName}
                                onChange={(e) => handleChange("middleName", e.target.value)}
                                className={inputClass("middleName")}
                                placeholder="Отчество"
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
                        <div className="flex items-center py-3">
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => handleChange("phone", e.target.value)}
                                className={inputClass("phone")}
                                placeholder="Телефон"
                            />
                        </div>
                    </div>

                    {/* Заграничный паспорт */}
                    <div className="brand-bg px-4 py-3">
            <span className="font-semibold text-white text-sm">
              Заграничный паспорт
            </span>
                    </div>
                    <div className="px-4 divide-y divide-gray-200 bg-white">
                        <div className="flex items-center py-3">
                            <input
                                value={formData.foreignLastName}
                                onChange={(e) => handleChange("foreignLastName", e.target.value)}
                                className={inputClass("foreignLastName")}
                                placeholder="Фамилия (Лат.)"
                            />
                        </div>
                        <div className="flex items-center py-3">
                            <input
                                value={formData.foreignFirstName}
                                onChange={(e) =>
                                    handleChange("foreignFirstName", e.target.value)
                                }
                                className={inputClass("foreignFirstName")}
                                placeholder="Имя (Лат.)"
                            />
                        </div>
                        <div className="flex items-center py-3">
                            <input
                                value={formData.citizenship}
                                onChange={(e) => handleChange("citizenship", e.target.value)}
                                className={inputClass("citizenship")}
                                placeholder="Гражданство"
                            />
                        </div>
                        <div className="flex items-center py-3">
                            <input
                                value={formData.issueCountry}
                                onChange={(e) => handleChange("issueCountry", e.target.value)}
                                className={inputClass("issueCountry")}
                                placeholder="Страна выдачи"
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
                        <div className="flex items-center py-3">
                            <input
                                value={formData.passportNumber}
                                onChange={(e) => handleChange("passportNumber", e.target.value)}
                                className={inputClass("passportNumber")}
                                placeholder="Серия и номер"
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
                        <div className="flex items-center py-3">
                            <input
                                value={formData.fms}
                                onChange={(e) => handleChange("fms", e.target.value)}
                                className={inputClass("fms")}
                                placeholder="ФМС"
                            />
                        </div>
                    </div>

                    {/* Российский паспорт */}
                    <div className="brand-bg px-4 py-3">
            <span className="font-semibold text-white text-sm">
              Российский паспорт
            </span>
                    </div>
                    <div className="px-4 divide-y divide-gray-200 bg-white">
                        <div className="flex items-center py-3">
                            <input
                                value={formData.russianPassportNumber}
                                onChange={(e) =>
                                    handleChange("russianPassportNumber", e.target.value)
                                }
                                className={inputClass("russianPassportNumber")}
                                placeholder="Серия и номер"
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
                        <div className="flex items-center py-3">
                            <input
                                value={formData.issuedBy}
                                onChange={(e) => handleChange("issuedBy", e.target.value)}
                                className={inputClass("issuedBy")}
                                placeholder="Кем выдан"
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
                        <div className="flex items-center py-3">
                            <input
                                value={formData.departmentCode}
                                onChange={(e) => handleChange("departmentCode", e.target.value)}
                                className={inputClass("departmentCode")}
                                placeholder="Код подразделения"

                            />
                        </div>
                        <div className="flex items-center py-3">
                            <input
                                value={formData.residence}
                                onChange={(e) => handleChange("residence", e.target.value)}
                                className={inputClass("residence")}
                                placeholder="Место проживания"
                            />
                        </div>
                    </div>

                    {/* СНИЛС и ИНН */}
                    <div className="brand-bg px-4 py-3">
                        <span className="font-semibold text-white text-sm">СНИЛС и ИНН</span>
                    </div>
                    <div className="px-4 divide-y divide-gray-200 bg-white">
                        <div className="flex items-center py-3">
                            <input
                                value={formData.snils}
                                onChange={(e) => handleChange("snils", e.target.value)}
                                className={inputClass("snils")}
                                placeholder="СНИЛС"
                            />
                        </div>
                        <div className="flex items-center py-3">
                            <input
                                value={formData.inn}
                                onChange={(e) => handleChange("inn", e.target.value)}
                                className={inputClass("inn")}
                                placeholder="ИНН"
                            />
                        </div>
                    </div>

                    {/* Адрес регистрации */}
                    <div className="brand-bg px-4 py-3">
            <span className="font-semibold text-white text-sm">
              Адрес регистрации
            </span>
                    </div>
                    <div className="px-4 divide-y divide-gray-200 bg-white">
                        <div className="flex items-center py-3">
                            <input
                                value={formData.postalCode}
                                onChange={(e) => handleChange("postalCode", e.target.value)}
                                className={inputClass("postalCode")}
                                placeholder="Индекс"
                            />
                        </div>
                        <div className="flex items-center py-3">
                            <input
                                value={formData.region}
                                onChange={(e) => handleChange("region", e.target.value)}
                                className={inputClass("region")}
                                placeholder="Регион"
                            />
                        </div>
                        <div className="flex items-center py-3">
                            <input
                                value={formData.district}
                                onChange={(e) => handleChange("district", e.target.value)}
                                className={inputClass("district")}
                                placeholder="Район или город"
                            />
                        </div>
                        <div className="flex items-center py-3">
                            <input
                                value={formData.street}
                                onChange={(e) => handleChange("street", e.target.value)}
                                className={inputClass("street")}
                                placeholder="Улица"
                            />
                        </div>
                        <div className="flex items-center py-3">
                            <input
                                value={formData.house}
                                onChange={(e) => handleChange("house", e.target.value)}
                                className={inputClass("house")}
                                placeholder="Дом"
                            />
                        </div>
                        <div className="flex items-center py-3">
                            <input
                                value={formData.building}
                                onChange={(e) => handleChange("building", e.target.value)}
                                className={inputClass("building")}
                                placeholder="Корпус (если есть)"
                            />
                        </div>
                        <div className="flex items-center py-3">
                            <input
                                value={formData.structure}
                                onChange={(e) => handleChange("structure", e.target.value)}
                                className={inputClass("structure")}
                                placeholder="Строение (если есть)"
                            />
                        </div>
                        <div className="flex items-center py-3">
                            <input
                                value={formData.apartment}
                                onChange={(e) => handleChange("apartment", e.target.value)}
                                className={inputClass("apartment")}
                                placeholder="Квартира (если есть)"
                            />
                        </div>
                    </div>

                    <div className="p-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={isUpdating}
                            className="brand-bg text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50"
                        >
                            {isUpdating ? "Сохраняем..." : "Подтвердить"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const DataVerificationPage = () => {
    return (
        <Suspense fallback={<div className="container mx-auto max-w-4xl px-4 py-8">Загрузка...</div>}>
            <DataVerificationContent/>
        </Suspense>
    );
};

export default DataVerificationPage;
