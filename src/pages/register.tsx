import React, {useState} from 'react';
import {useMutation} from '@tanstack/react-query';
import {useRouter} from 'next/navigation';
import {useDispatch} from 'react-redux';
import DateInput from '@/components/ui/date-input';
import {setAuthToken} from '@/hooks/cookies';
import {useToast} from '@/hooks/use-toast';
import {api} from '@/services';
import {loginSuccess} from '@/store/slices/authSlice';
import FloatingInput from '@/components/ui/floating-input';

const Register = () => {
    // Personal data
    const [lastName, setLastName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [gender, setGender] = useState<'male' | 'female' | null>('male');

    // Foreign passport
    const [foreignLastName, setForeignLastName] = useState('');
    const [foreignFirstName, setForeignFirstName] = useState('');
    const [citizenship, setCitizenship] = useState('');
    const [issueCountry, setIssueCountry] = useState('issueCountry');
    const [issueDate, setIssueDate] = useState('');
    const [passportNumber, setPassportNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [fms, setFms] = useState('');

    // Russian passport
    const [russianPassportNumber, setRussianPassportNumber] = useState('');
    const [passportTerm, setPassportTerm] = useState<'with_deadline' | 'without_deadline' | null>('without_deadline');
    const [russianExpiryDate, setRussianExpiryDate] = useState('');
    const [issuedBy, setIssuedBy] = useState('');
    const [issuedDate, setIssuedDate] = useState('');
    const [departmentCode, setDepartmentCode] = useState('');
    const [residence, setResidence] = useState('');

    // SNILS and INN
    const [snils, setSnils] = useState('');
    const [inn, setInn] = useState('');

    // Registration address
    const [postalCode, setPostalCode] = useState('');
    const [region, setRegion] = useState('');
    const [district, setDistrict] = useState('');
    const [street, setStreet] = useState('');
    const [house, setHouse] = useState('');
    const [building, setBuilding] = useState('');
    const [structure, setStructure] = useState('');
    const [apartment, setApartment] = useState('');

    // Authentication
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');

    // File uploads (необязательные)
    const [foreignPassportFile, setForeignPassportFile] = useState<File | null>(null);
    const [russianPassportFile, setRussianPassportFile] = useState<File | null>(null);
    const [visaPhotoFile, setVisaPhotoFile] = useState<File | null>(null);
    const [selfieWithPassportFile, setSelfieWithPassportFile] = useState<File | null>(null);

    // Errors
    const [errors, setErrors] = useState<Record<string, boolean>>({});

    const {toast} = useToast();
    const dispatch = useDispatch();
    const router = useRouter();

    // Register
    const {mutate: registerMutate, isPending: isRegistering} = useMutation({
        mutationFn: (formData: FormData) => api.register(formData),
        onSuccess: () => {
            loginMutate({phone, password});
        },
        onError: (error: any) => {
            toast({
                title: 'Ошибка регистрации',
                description: error.response?.data?.message?.[0] || 'Произошла ошибка.',
                variant: 'destructive',
            });
        },
    });

    // Login
    const {mutate: loginMutate, isPending: isLoggingIn} = useMutation({
        mutationFn: (credentials: { phone: string; password: string }) => api.login(credentials),
        onSuccess: (data: any) => {
            dispatch(loginSuccess({user: data.user, accessToken: data.accessToken}));
            setAuthToken(data.accessToken);
            toast({
                variant: 'default',
                title: 'Успешно',
                description: 'Вы зарегистрировались и вошли в систему.',
            });
            router.push('/');
        },
        onError: (error: any) => {
            toast({
                title: 'Ошибка входа',
                description: error.response?.data?.message || 'Произошла ошибка.',
                variant: 'destructive',
            });
        },
    });

    const validateFields = () => {
        const requiredFields: Record<string, string> = {
            lastName,
            firstName,
            middleName,
            birthDate,
            phone,
            password,
            foreignLastName,
            foreignFirstName,
            citizenship,
            issueDate,
            passportNumber,
            expiryDate,
            fms,
            russianPassportNumber,
            russianExpiryDate,
            issuedBy,
            issuedDate,
            departmentCode,
            residence,
            snils,
            inn,
            postalCode,
            region,
            district,
            street,
            house,
        };

        const newErrors: Record<string, boolean> = {};
        Object.entries(requiredFields).forEach(([key, value]) => {
            newErrors[key] = !value || value.trim() === '';
        });

        setErrors(newErrors);
        return Object.values(newErrors).every((v) => !v);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateFields()) {
            toast({
                title: 'Проверьте заполнение полей',
                description: 'Некоторые обязательные поля не заполнены.',
                variant: 'destructive',
            });
            return;
        }

        if (!foreignPassportFile || !russianPassportFile || !visaPhotoFile || !selfieWithPassportFile) {
            toast({
                title: 'Проверьте заполнение полей',
                description: 'Загрузите все фото документов',
                variant: 'destructive',
            });
            return;
        }


        const formData = new FormData();
        formData.append('lastName', lastName);
        formData.append('firstName', firstName);
        formData.append('middleName', middleName);
        formData.append('birthDate', birthDate);
        if (gender) formData.append('gender', gender);
        formData.append('foreignLastName', foreignLastName);
        formData.append('foreignFirstName', foreignFirstName);
        formData.append('citizenship', citizenship);
        formData.append('issueCountry', issueCountry);
        formData.append('issueDate', issueDate);
        formData.append('passportNumber', passportNumber);
        formData.append('expiryDate', expiryDate);
        formData.append('fms', fms);
        formData.append('russianPassportNumber', russianPassportNumber);
        if (passportTerm) formData.append('passportTerm', passportTerm);
        formData.append('russianExpiryDate', russianExpiryDate);
        formData.append('issuedBy', issuedBy);
        formData.append('issuedDate', issuedDate);
        formData.append('departmentCode', departmentCode);
        formData.append('residence', residence);
        formData.append('snils', snils);
        formData.append('inn', inn);
        formData.append('postalCode', postalCode);
        formData.append('region', region);
        formData.append('district', district);
        formData.append('street', street);
        formData.append('house', house);
        formData.append('building', building);
        formData.append('structure', structure);
        formData.append('apartment', apartment);
        formData.append('password', password);
        formData.append('phone', phone);

        if (foreignPassportFile) formData.append('foreignPassportFile', foreignPassportFile);
        if (russianPassportFile) formData.append('russianPassportFile', russianPassportFile);
        if (visaPhotoFile) formData.append('visaPhotoFile', visaPhotoFile);
        if (selfieWithPassportFile) formData.append('selfieWithPassportFile', selfieWithPassportFile);

        registerMutate(formData);
    };

    // Хелпер для полей
    const inputClass = (field: string) =>
        `text-sm font-medium bg-transparent outline-none flex-1 max-w-[60%] transition-colors ${
            errors[field] ? 'placeholder:text-red-400' : ''
        }`;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-4 mt-5">
            <form onSubmit={handleSubmit} className="w-full max-w-[600px] bg-white rounded-xl shadow-lg">
                {/* Персональные данные */}
                <div className="brand-bg rounded-t-xl px-4 py-3 flex justify-between items-center">
                    <span className="font-semibold text-white text-sm">Персональные данные</span>
                </div>

                <div className="px-4 divide-y divide-gray-200 bg-white">
                    <div className="flex items-center pb-3 pt-4">
                        <FloatingInput
                            label="Фамилия"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            error={errors.lastName}
                        />

                    </div>
                    <div className="flex items-center pb-3 pt-4">

                        <FloatingInput
                            label="Имя"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            error={errors.firstName}
                        />
                    </div>
                    <div className="flex items-center pb-3 pt-4">
                        <FloatingInput
                            label="Отчество"
                            value={middleName}
                            onChange={(e) => setMiddleName(e.target.value)}
                            error={errors.middleName}
                        />
                    </div>
                    <div className="flex items-center py-3">
                        <DateInput placeholder="Дата рождения" value={birthDate} error={errors.birthDate} onChange={(val) => setBirthDate(val)} className={`w-[150px] ${errors.birthDate ? 'border-red-500' : ''}`}/>
                    </div>
                    <div className="flex items-center pb-3 pt-4">
                        <FloatingInput
                            label="Телефон"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            error={errors.phone}
                        />
                    </div>
                    <div className="flex items-center pb-3 pt-4">
                        <FloatingInput
                            label="Пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            error={errors.password}
                        />
                    </div>
                </div>
                {/* Заграничный паспорт */}
                <div className="brand-bg px-4 py-3">
                    <span className="font-semibold text-white text-sm">Заграничный паспорт</span>
                </div>
                <div className="px-4 divide-y divide-gray-200 bg-white">
                    <div className="flex items-center pb-3 pt-4">
                        <FloatingInput
                            label="Фамилия (Лат.)"
                            value={foreignLastName}
                            onChange={(e) => setForeignLastName(e.target.value)}
                            error={errors.foreignLastName}
                        />
                    </div>

                    <div className="flex items-center pb-3 pt-4">
                        <FloatingInput
                            label="Имя (Лат.)"
                            value={foreignFirstName}
                            onChange={(e) => setForeignFirstName(e.target.value)}
                            error={errors.foreignFirstName}
                        />
                    </div>
                    <div className="flex items-center pb-3 pt-4">
                        <FloatingInput
                            label="Гражданство"
                            value={citizenship}
                            onChange={(e) => setCitizenship(e.target.value)}
                            error={errors.citizenship}
                        />
                    </div>
                    <div className="flex items-center pb-3 pt-4">
                        <DateInput
                            placeholder="Дата выдачи"
                            value={issueDate}
                            onChange={(val) => setIssueDate(val)}
                            error={errors.issueDate}
                            className={`${inputClass('issueDate')} max-w-[150px]`}/>
                    </div>
                    <div className="flex items-center pb-3 pt-4">
                        <FloatingInput
                            label="Серия и номер"
                            value={passportNumber}
                            onChange={(e) => setPassportNumber(e.target.value)}
                            error={errors.passportNumber}
                        />
                    </div>
                    <div className="flex items-center pb-3 pt-4">
                        <DateInput
                            placeholder="Годен до"
                            value={expiryDate}
                            onChange={(val) => setExpiryDate(val)}
                            error={errors.expiryDate}
                            className={`${inputClass('expiryDate')} max-w-[150px]`}/>
                    </div>
                    <div className="flex items-center pb-3 pt-4">
                        <FloatingInput
                            label="ФМС"
                            value={fms}
                            onChange={(e) => setFms(e.target.value)}
                            error={errors.fms}
                        />
                    </div>
                </div>
                {/* Российский паспорт */}
                <div className="brand-bg px-4 py-3">
                    <span className="font-semibold text-white text-sm">Российский паспорт</span>
                </div>
                <div className="px-4 divide-y divide-gray-200 bg-white">
                    <div className="flex items-center pb-3 pt-4">
                        <FloatingInput
                            label="Серия и номер"
                            value={russianPassportNumber}
                            onChange={(e) => setRussianPassportNumber(e.target.value)}
                            error={errors.russianPassportNumber}
                        />
                    </div>
                    <div className="flex items-center py-3">
                        <div className="flex gap-2 justify-end">
                            <button
                                type="button"
                                className={`px-4 py-1 rounded text-sm font-medium transition-colors ${passportTerm === 'with_deadline' ? 'brand-bg text-white border-amber-600' : 'bg-white text-gray-700 border-gray-300 border'}`}
                                onClick={() => setPassportTerm('with_deadline')}
                            >
                                Срочный
                            </button>
                            <button
                                type="button"
                                className={`px-4 py-1 rounded text-sm font-medium transition-colors ${passportTerm === 'without_deadline' ? 'brand-bg text-white border-amber-600' : 'bg-white text-gray-700 border-gray-300 border'}`}
                                onClick={() => setPassportTerm('without_deadline')}
                            >
                                Бессрочный
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center py-3">
                        <DateInput
                            placeholder="Годен до"
                            value={russianExpiryDate}
                            onChange={(val) => setRussianExpiryDate(val)}
                            error={errors.russianExpiryDate}
                            className={`${inputClass('russianExpiryDate')} max-w-[150px]`}
                        />
                    </div>
                    <div className="flex items-center pb-3 pt-4">
                        <FloatingInput
                            label="Кем выдан"
                            value={issuedBy}
                            onChange={(e) => setIssuedBy(e.target.value)}
                            error={errors.issuedBy}
                        />
                    </div>
                    <div className="flex items-center py-3">
                        <DateInput
                            placeholder="Когда выдан"
                            value={issuedDate}
                            onChange={(val) => setIssuedDate(val)}
                            error={errors.issuedDate}
                            className={`${inputClass('issuedDate')} max-w-[150px]`}/>
                    </div>
                    <div className="flex items-center pb-3 pt-4">
                        <FloatingInput
                            label="Код подразделения"
                            value={departmentCode}
                            onChange={(e) => setDepartmentCode(e.target.value)}
                            error={errors.departmentCode}
                        />
                    </div>
                    <div className="flex items-center pb-3 pt-4">
                        <FloatingInput
                            label="Место проживания"
                            value={residence}
                            onChange={(e) => setResidence(e.target.value)}
                            error={errors.residence}
                        />
                    </div>
                </div>
                {/* СНИЛС и ИНН */}
                <div className="brand-bg px-4 py-3">
                    <span className="font-semibold text-white text-sm">СНИЛС и ИНН</span>
                </div>
                <div className="px-4 divide-y divide-gray-200 bg-white">
                    <div className="flex items-center pb-3 pt-4">
                        <FloatingInput
                            label="СНИЛС"
                            value={snils}
                            onChange={(e) => setSnils(e.target.value)}
                            error={errors.snils}
                        />
                    </div>
                    <div className="flex items-center pb-3 pt-4">
                        <FloatingInput
                            label="ИНН"
                            value={inn}
                            onChange={(e) => setInn(e.target.value)}
                            error={errors.inn}
                        />
                    </div>
                </div>
                {/* Адрес регистрации */}
                <div className="brand-bg px-4 py-3">
                    <span className="font-semibold text-white text-sm">Адрес регистрации</span>
                </div>
                <div className="px-4 divide-y divide-gray-200 bg-white">
                    <div className="flex items-center pb-3 pt-4">
                        <FloatingInput
                            label="Индекс"
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value)}
                            error={errors.postalCode}
                        />
                    </div>
                    <div className="flex items-center pb-3 pt-4">
                        <FloatingInput
                            label="Регион"
                            value={region}
                            onChange={(e) => setRegion(e.target.value)}
                            error={errors.region}
                        />
                    </div>
                    <div className="flex items-center pb-3 pt-4">
                        <FloatingInput
                            label="Район или город"
                            value={district}
                            onChange={(e) => setDistrict(e.target.value)}
                            error={errors.district}
                        />
                    </div>
                    <div className="flex items-center pb-3 pt-4">
                        <FloatingInput
                            label="Улица"
                            value={street}
                            onChange={(e) => setStreet(e.target.value)}
                            error={errors.street}
                        />
                    </div>
                    <div className="flex items-center pb-3 pt-4">
                        <FloatingInput
                            label="Дом"
                            value={house}
                            onChange={(e) => setHouse(e.target.value)}
                            error={errors.house}
                        />
                    </div>
                    <div className="flex items-center pb-3 pt-4">
                        <FloatingInput
                            label="Корпус (если есть)"
                            value={building}
                            onChange={(e) => setBuilding(e.target.value)}
                            error={errors.building}
                        />
                    </div>
                    <div className="flex items-center pb-3 pt-4">
                        <FloatingInput
                            label="Строение (если есть)"
                            value={structure}
                            onChange={(e) => setStructure(e.target.value)}
                            error={errors.structure}
                        />
                    </div>
                    <div className="flex items-center pb-3 pt-4">
                        <FloatingInput
                            label="Квартира (если есть)"
                            value={apartment}
                            onChange={(e) => setApartment(e.target.value)}
                            error={errors.apartment}
                        />
                    </div>
                </div>
                {/* Фото документов */}
                <div className="brand-bg px-4 py-3">
                    <span className="font-semibold text-white text-sm">Фото документов</span>
                </div>
                <div className="px-4 divide-y divide-gray-200 bg-white pb-4">
                    <div className="flex items-center py-3">
                        <label className="flex items-center gap-2 border rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100 transition-colors w-full justify-between cursor-pointer">
                            <span className="flex items-center gap-2"><i className="fas fa-camera"></i>Заграничный паспорт</span>
                            <span className="text-xs font-medium">{foreignPassportFile ? foreignPassportFile.name : 'Загрузить'}</span>
                            <input
                                type="file"
                                className="hidden"
                                onChange={(e) => setForeignPassportFile(e.target.files?.[0] || null)}
                                accept="image/*,.pdf"
                            />
                        </label>
                    </div>
                    <div className="flex items-center py-3">
                        <label className="flex items-center gap-2 border rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100 transition-colors w-full justify-between cursor-pointer">
                            <span className="flex items-center gap-2"><i className="fas fa-camera"></i>Российский паспорт</span>
                            <span className="text-xs font-medium">{russianPassportFile ? russianPassportFile.name : 'Загрузить'}</span>
                            <input
                                type="file"
                                className="hidden"
                                onChange={(e) => setRussianPassportFile(e.target.files?.[0] || null)}
                                accept="image/*,.pdf"
                            />
                        </label>
                    </div>
                    <div className="flex items-center py-3">
                        <label className="flex items-center gap-2 border rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100 transition-colors w-full justify-between cursor-pointer">
                            <span className="flex items-center gap-2"><i className="fas fa-camera"></i>Личное фото для визы</span>
                            <span className="text-xs font-medium">{visaPhotoFile ? visaPhotoFile.name : 'Загрузить'}</span>
                            <input
                                type="file"
                                className="hidden"
                                onChange={(e) => setVisaPhotoFile(e.target.files?.[0] || null)}
                                accept="image/*"
                            />
                        </label>
                    </div>
                    <div className="flex items-center py-3">
                        <label className="flex items-center gap-2 border rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100 transition-colors w-full justify-between cursor-pointer">
                            <span className="flex items-center gap-2"><i className="fas fa-camera"></i>Селфи с паспортом</span>
                            <span className="text-xs font-medium">{selfieWithPassportFile ? selfieWithPassportFile.name : 'Загрузить'}</span>
                            <input
                                type="file"
                                className="hidden"
                                onChange={(e) => setSelfieWithPassportFile(e.target.files?.[0] || null)}
                                accept="image/*"
                            />
                        </label>
                    </div>
                </div>
                <div className="px-4 pb-6">
                    <button
                        type="submit"
                        disabled={isRegistering || isLoggingIn}
                        className={`w-full brand-bg text-white py-2 rounded-lg font-semibold hover:bg-amber-700 transition-colors mt-4 ${(isRegistering || isLoggingIn) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isRegistering || isLoggingIn ? 'Обработка...' : 'Сохранить'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Register;
