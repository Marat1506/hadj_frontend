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
    const [issueCountry, setIssueCountry] = useState('');
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
    const [errors, setErrors] = useState<Record<string, string>>({});

    const {toast} = useToast();
    const dispatch = useDispatch();
    const router = useRouter();

    // Функции валидации для конкретных полей
    const validatePassword = (value: string): string => {
        if (!value) return 'Пароль обязателен';
        if (value.length < 8) return 'Пароль должен содержать минимум 8 символов';
        if (!/(?=.*[a-z])/.test(value)) return 'Пароль должен содержать минимум одну строчную букву';
        if (!/(?=.*[A-Z])/.test(value)) return 'Пароль должен содержать минимум одну заглавную букву';
        if (!/(?=.*\d)/.test(value)) return 'Пароль должен содержать минимум одну цифру';
        return '';
    };

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

    // Register
    const {mutate: registerMutate, isPending: isRegistering} = useMutation({
        mutationFn: (formData: FormData) => api.register(formData),
        onSuccess: () => {
            loginMutate({phone, password});
        },
        onError: (error: any) => {
            console.log('Registration error:', error.response?.data);
            const validationErrors = error.response?.data?.message;
            
            if (Array.isArray(validationErrors)) {
                // Обработка ошибок валидации от backend
                const newErrors: Record<string, string> = {};
                validationErrors.forEach((err: string) => {
                    // Извлекаем имя поля и сообщение об ошибке
                    // Формат ошибки от class-validator: "property message"
                    const fieldMapping: Record<string, string> = {
                        'passportNumber': 'passportNumber',
                        'паспорта': 'passportNumber',
                        'russianPassportNumber': 'russianPassportNumber',
                        'российского паспорта': 'russianPassportNumber',
                        'departmentCode': 'departmentCode',
                        'подразделения': 'departmentCode',
                        'snils': 'snils',
                        'СНИЛС': 'snils',
                        'inn': 'inn',
                        'ИНН': 'inn',
                        'postalCode': 'postalCode',
                        'Индекс': 'postalCode',
                        'индекс': 'postalCode',
                        'password': 'password',
                        'Пароль': 'password',
                        'пароль': 'password',
                    };
                    
                    // Ищем соответствие поля в сообщении об ошибке
                    let fieldFound = false;
                    for (const [keyword, fieldName] of Object.entries(fieldMapping)) {
                        if (err.includes(keyword)) {
                            newErrors[fieldName] = err;
                            fieldFound = true;
                            break;
                        }
                    }
                    
                    // Если не нашли конкретное поле, выводим в консоль для отладки
                    if (!fieldFound) {
                        console.warn('Unmatched validation error:', err);
                    }
                });
                
                setErrors(newErrors);
                
                toast({
                    title: 'Ошибка валидации',
                    description: 'Проверьте правильность заполнения полей',
                    variant: 'destructive',
                });
            } else {
                toast({
                    title: 'Ошибка регистрации',
                    description: error.response?.data?.message || 'Произошла ошибка.',
                    variant: 'destructive',
                });
            }
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
            foreignLastName,
            foreignFirstName,
            citizenship,
            issueCountry,
            issueDate,
            expiryDate,
            fms,
            russianExpiryDate,
            issuedBy,
            issuedDate,
            residence,
            region,
            district,
            street,
            house,
        };

        const newErrors: Record<string, string> = {};
        
        // Проверка обязательных полей
        Object.entries(requiredFields).forEach(([key, value]) => {
            if (!value || value.trim() === '') {
                newErrors[key] = 'Это поле обязательно';
            }
        });

        // Проверка полей с особой валидацией
        const passwordError = validatePassword(password);
        if (passwordError) newErrors.password = passwordError;

        const passportError = validatePassportNumber(passportNumber);
        if (passportError) newErrors.passportNumber = passportError;

        const russianPassportError = validateRussianPassportNumber(russianPassportNumber);
        if (russianPassportError) newErrors.russianPassportNumber = russianPassportError;

        const departmentCodeError = validateDepartmentCode(departmentCode);
        if (departmentCodeError) newErrors.departmentCode = departmentCodeError;

        const snilsError = validateSnils(snils);
        if (snilsError) newErrors.snils = snilsError;

        const innError = validateInn(inn);
        if (innError) newErrors.inn = innError;

        const postalCodeError = validatePostalCode(postalCode);
        if (postalCodeError) newErrors.postalCode = postalCodeError;

        // Проверка файлов
        if (!foreignPassportFile) newErrors.foreignPassportFile = 'Загрузите файл';
        if (!russianPassportFile) newErrors.russianPassportFile = 'Загрузите файл';
        if (!visaPhotoFile) newErrors.visaPhotoFile = 'Загрузите файл';
        if (!selfieWithPassportFile) newErrors.selfieWithPassportFile = 'Загрузите файл';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
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

                <div className="px-4 bg-white space-y-6 py-4">
                    <div className="flex items-center">
                        <FloatingInput
                            label="Фамилия"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            error={errors.lastName}
                        />
                    </div>
                    <div className="flex items-center">
                        <FloatingInput
                            label="Имя"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            error={errors.firstName}
                        />
                    </div>
                    <div className="flex items-center">
                        <FloatingInput
                            label="Отчество"
                            value={middleName}
                            onChange={(e) => setMiddleName(e.target.value)}
                            error={errors.middleName}
                        />
                    </div>
                    <div className="flex items-center py-4">
                        <DateInput placeholder="Дата рождения" value={birthDate} error={errors.birthDate} onChange={(val) => setBirthDate(val)} className="w-full"/>
                    </div>
                    <div className="flex items-center">
                        <FloatingInput
                            label="Телефон"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            error={errors.phone}
                        />
                    </div>
                    <div className="flex items-center">
                        <FloatingInput
                            label="Пароль"
                            value={password}
                            type="password"
                            onChange={(e) => {
                                setPassword(e.target.value);
                                // Очищаем ошибку при вводе
                                if (errors.password) {
                                    const {password, ...rest} = errors;
                                    setErrors(rest);
                                }
                            }}
                            onBlur={() => {
                                const error = validatePassword(password);
                                if (error) {
                                    setErrors(prev => ({...prev, password: error}));
                                }
                            }}
                            error={errors.password}
                        />
                    </div>
                </div>
                {/* Заграничный паспорт */}
                <div className="brand-bg px-4 py-3">
                    <span className="font-semibold text-white text-sm">Заграничный паспорт</span>
                </div>
                <div className="px-4 bg-white space-y-6 py-4">
                    <div className="flex items-center">
                        <FloatingInput
                            label="Фамилия (Лат.)"
                            value={foreignLastName}
                            onChange={(e) => setForeignLastName(e.target.value)}
                            error={errors.foreignLastName}
                        />
                    </div>

                    <div className="flex items-center ">
                        <FloatingInput
                            label="Имя (Лат.)"
                            value={foreignFirstName}
                            onChange={(e) => setForeignFirstName(e.target.value)}
                            error={errors.foreignFirstName}
                        />
                    </div>
                    <div className="flex items-center ">
                        <FloatingInput
                            label="Гражданство"
                            value={citizenship}
                            onChange={(e) => setCitizenship(e.target.value)}
                            error={errors.citizenship}
                        />
                    </div>
                    <div className="flex items-center">
                        <FloatingInput
                            label="Страна выдачи"
                            value={issueCountry}
                            onChange={(e) => setIssueCountry(e.target.value)}
                            error={errors.issueCountry}
                        />
                    </div>
                    <div className="flex items-center py-4">
                        <DateInput
                            placeholder="Дата выдачи"
                            value={issueDate}
                            onChange={(val) => setIssueDate(val)}
                            error={errors.issueDate}
                            className="w-full"/>
                    </div>
                    <div className="flex items-center ">
                        <FloatingInput
                            label="Серия и номер"
                            value={passportNumber}
                            onChange={(e) => {
                                setPassportNumber(e.target.value);
                                if (errors.passportNumber) {
                                    const {passportNumber, ...rest} = errors;
                                    setErrors(rest);
                                }
                            }}
                            onBlur={() => {
                                const error = validatePassportNumber(passportNumber);
                                if (error) {
                                    setErrors(prev => ({...prev, passportNumber: error}));
                                }
                            }}
                            error={errors.passportNumber}
                        />
                    </div>
                    <div className="flex items-center py-4">
                        <DateInput
                            placeholder="Годен до"
                            value={expiryDate}
                            onChange={(val) => setExpiryDate(val)}
                            error={errors.expiryDate}
                            className="w-full"/>
                    </div>
                    <div className="flex items-center ">
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
                <div className="px-4 bg-white space-y-6 py-4">
                    <div className="flex items-center ">
                        <FloatingInput
                            label="Серия и номер"
                            value={russianPassportNumber}
                            onChange={(e) => {
                                setRussianPassportNumber(e.target.value);
                                if (errors.russianPassportNumber) {
                                    const {russianPassportNumber, ...rest} = errors;
                                    setErrors(rest);
                                }
                            }}
                            onBlur={() => {
                                const error = validateRussianPassportNumber(russianPassportNumber);
                                if (error) {
                                    setErrors(prev => ({...prev, russianPassportNumber: error}));
                                }
                            }}
                            error={errors.russianPassportNumber}
                        />
                    </div>
                    <div className="flex items-center py-4">
                        <div className="flex gap-2 justify-end w-full">
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
                    <div className="flex items-center py-1">
                        <DateInput
                            placeholder="Годен до"
                            value={russianExpiryDate}
                            onChange={(val) => setRussianExpiryDate(val)}
                            error={errors.russianExpiryDate}
                            className="w-full"
                        />
                    </div>
                    <div className="flex items-center 4" style={{marginTop: "12px"}}>
                        <FloatingInput
                            label="Кем выдан"
                            value={issuedBy}
                            onChange={(e) => setIssuedBy(e.target.value)}
                            error={errors.issuedBy}
                        />
                    </div>
                    <div className="flex items-center ">
                        <DateInput
                            placeholder="Когда выдан"
                            value={issuedDate}
                            onChange={(val) => setIssuedDate(val)}
                            error={errors.issuedDate}
                            className="w-full"/>
                    </div>
                    <div className="flex items-center 4">
                        <FloatingInput
                            label="Код подразделения"
                            value={departmentCode}
                            onChange={(e) => {
                                setDepartmentCode(e.target.value);
                                if (errors.departmentCode) {
                                    const {departmentCode, ...rest} = errors;
                                    setErrors(rest);
                                }
                            }}
                            onBlur={() => {
                                const error = validateDepartmentCode(departmentCode);
                                if (error) {
                                    setErrors(prev => ({...prev, departmentCode: error}));
                                }
                            }}
                            error={errors.departmentCode}
                        />
                    </div>
                    <div className="flex items-center ">
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
                <div className="px-4 bg-white space-y-6 py-4">
                    <div className="flex items-center ">
                        <FloatingInput
                            label="СНИЛС"
                            value={snils}
                            onChange={(e) => {
                                setSnils(e.target.value);
                                if (errors.snils) {
                                    const {snils, ...rest} = errors;
                                    setErrors(rest);
                                }
                            }}
                            onBlur={() => {
                                const error = validateSnils(snils);
                                if (error) {
                                    setErrors(prev => ({...prev, snils: error}));
                                }
                            }}
                            error={errors.snils}
                        />
                    </div>
                    <div className="flex items-center ">
                        <FloatingInput
                            label="ИНН"
                            value={inn}
                            onChange={(e) => {
                                setInn(e.target.value);
                                if (errors.inn) {
                                    const {inn, ...rest} = errors;
                                    setErrors(rest);
                                }
                            }}
                            onBlur={() => {
                                const error = validateInn(inn);
                                if (error) {
                                    setErrors(prev => ({...prev, inn: error}));
                                }
                            }}
                            error={errors.inn}
                        />
                    </div>
                </div>
                {/* Адрес регистрации */}
                <div className="brand-bg px-4 py-3">
                    <span className="font-semibold text-white text-sm">Адрес регистрации</span>
                </div>
                <div className="px-4 bg-white space-y-6 py-4">
                    <div className="flex items-center ">
                        <FloatingInput
                            label="Индекс"
                            value={postalCode}
                            onChange={(e) => {
                                setPostalCode(e.target.value);
                                if (errors.postalCode) {
                                    const {postalCode, ...rest} = errors;
                                    setErrors(rest);
                                }
                            }}
                            onBlur={() => {
                                const error = validatePostalCode(postalCode);
                                if (error) {
                                    setErrors(prev => ({...prev, postalCode: error}));
                                }
                            }}
                            error={errors.postalCode}
                        />
                    </div>
                    <div className="flex items-center ">
                        <FloatingInput
                            label="Регион"
                            value={region}
                            onChange={(e) => setRegion(e.target.value)}
                            error={errors.region}
                        />
                    </div>
                    <div className="flex items-center ">
                        <FloatingInput
                            label="Район или город"
                            value={district}
                            onChange={(e) => setDistrict(e.target.value)}
                            error={errors.district}
                        />
                    </div>
                    <div className="flex items-center ">
                        <FloatingInput
                            label="Улица"
                            value={street}
                            onChange={(e) => setStreet(e.target.value)}
                            error={errors.street}
                        />
                    </div>
                    <div className="flex items-center ">
                        <FloatingInput
                            label="Дом"
                            value={house}
                            onChange={(e) => setHouse(e.target.value)}
                            error={errors.house}
                        />
                    </div>
                    <div className="flex items-center ">
                        <FloatingInput
                            label="Корпус (если есть)"
                            value={building}
                            onChange={(e) => setBuilding(e.target.value)}
                            error={errors.building}
                        />
                    </div>
                    <div className="flex items-center ">
                        <FloatingInput
                            label="Строение (если есть)"
                            value={structure}
                            onChange={(e) => setStructure(e.target.value)}
                            error={errors.structure}
                        />
                    </div>
                    <div className="flex items-center ">
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
                <div className="px-4 bg-white space-y-6 py-4 pb-4">
                    <div className="flex flex-col py-3 gap-1">
                        <label className={`flex items-center gap-2 border-2 rounded-lg px-3 py-2 hover:bg-gray-100 transition-colors w-full justify-between cursor-pointer ${
                            errors.foreignPassportFile ? 'border-red-500 bg-red-50' : 'border-gray-300 text-gray-700'
                        }`}>
                            <span className={`flex items-center gap-2 ${errors.foreignPassportFile ? 'text-red-600' : ''}`}>
                                <i className="fas fa-camera"></i>Заграничный паспорт
                            </span>
                            <span className={`text-xs font-medium ${errors.foreignPassportFile ? 'text-red-600' : ''}`}>
                                {foreignPassportFile ? foreignPassportFile.name : 'Загрузить'}
                            </span>
                            <input
                                type="file"
                                className="hidden"
                                onChange={(e) => {
                                    setForeignPassportFile(e.target.files?.[0] || null);
                                    if (e.target.files?.[0]) {
                                        const {foreignPassportFile, ...rest} = errors;
                                        setErrors(rest);
                                    }
                                }}
                                accept="image/*,.pdf"
                            />
                        </label>
                        {errors.foreignPassportFile && (
                            <span className="text-xs text-red-500 ml-1">Загрузите файл</span>
                        )}
                    </div>
                    <div className="flex flex-col py-3 gap-1">
                        <label className={`flex items-center gap-2 border-2 rounded-lg px-3 py-2 hover:bg-gray-100 transition-colors w-full justify-between cursor-pointer ${
                            errors.russianPassportFile ? 'border-red-500 bg-red-50' : 'border-gray-300 text-gray-700'
                        }`}>
                            <span className={`flex items-center gap-2 ${errors.russianPassportFile ? 'text-red-600' : ''}`}>
                                <i className="fas fa-camera"></i>Российский паспорт
                            </span>
                            <span className={`text-xs font-medium ${errors.russianPassportFile ? 'text-red-600' : ''}`}>
                                {russianPassportFile ? russianPassportFile.name : 'Загрузить'}
                            </span>
                            <input
                                type="file"
                                className="hidden"
                                onChange={(e) => {
                                    setRussianPassportFile(e.target.files?.[0] || null);
                                    if (e.target.files?.[0]) {
                                        const {russianPassportFile, ...rest} = errors;
                                        setErrors(rest);
                                    }
                                }}
                                accept="image/*,.pdf"
                            />
                        </label>
                        {errors.russianPassportFile && (
                            <span className="text-xs text-red-500 ml-1">Загрузите файл</span>
                        )}
                    </div>
                    <div className="flex flex-col py-3 gap-1">
                        <label className={`flex items-center gap-2 border-2 rounded-lg px-3 py-2 hover:bg-gray-100 transition-colors w-full justify-between cursor-pointer ${
                            errors.visaPhotoFile ? 'border-red-500 bg-red-50' : 'border-gray-300 text-gray-700'
                        }`}>
                            <span className={`flex items-center gap-2 ${errors.visaPhotoFile ? 'text-red-600' : ''}`}>
                                <i className="fas fa-camera"></i>Личное фото для визы
                            </span>
                            <span className={`text-xs font-medium ${errors.visaPhotoFile ? 'text-red-600' : ''}`}>
                                {visaPhotoFile ? visaPhotoFile.name : 'Загрузить'}
                            </span>
                            <input
                                type="file"
                                className="hidden"
                                onChange={(e) => {
                                    setVisaPhotoFile(e.target.files?.[0] || null);
                                    if (e.target.files?.[0]) {
                                        const {visaPhotoFile, ...rest} = errors;
                                        setErrors(rest);
                                    }
                                }}
                                accept="image/*"
                            />
                        </label>
                        {errors.visaPhotoFile && (
                            <span className="text-xs text-red-500 ml-1">Загрузите файл</span>
                        )}
                    </div>
                    <div className="flex flex-col py-3 gap-1">
                        <label className={`flex items-center gap-2 border-2 rounded-lg px-3 py-2 hover:bg-gray-100 transition-colors w-full justify-between cursor-pointer ${
                            errors.selfieWithPassportFile ? 'border-red-500 bg-red-50' : 'border-gray-300 text-gray-700'
                        }`}>
                            <span className={`flex items-center gap-2 ${errors.selfieWithPassportFile ? 'text-red-600' : ''}`}>
                                <i className="fas fa-camera"></i>Селфи с паспортом
                            </span>
                            <span className={`text-xs font-medium ${errors.selfieWithPassportFile ? 'text-red-600' : ''}`}>
                                {selfieWithPassportFile ? selfieWithPassportFile.name : 'Загрузить'}
                            </span>
                            <input
                                type="file"
                                className="hidden"
                                onChange={(e) => {
                                    setSelfieWithPassportFile(e.target.files?.[0] || null);
                                    if (e.target.files?.[0]) {
                                        const {selfieWithPassportFile, ...rest} = errors;
                                        setErrors(rest);
                                    }
                                }}
                                accept="image/*"
                            />
                        </label>
                        {errors.selfieWithPassportFile && (
                            <span className="text-xs text-red-500 ml-1">Загрузите файл</span>
                        )}
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
