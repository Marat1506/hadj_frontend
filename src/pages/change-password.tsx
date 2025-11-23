import React, {useState} from 'react';
import {resetPassword} from "@/store/slices/authSlice";
import {toast} from "sonner";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/store";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft} from "@fortawesome/free-solid-svg-icons";
import {useRouter} from "next/navigation";

const ChangePassword = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const {user, isAuthenticated, loading, error}: any = useSelector((state: RootState) => state.user);

    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
    });


    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');

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
            toast.success('Пароль успешно изменен!');
        } catch (err) {
            setPasswordError('Ошибка при изменении пароля');
            toast.error('Ошибка при изменении пароля');
        }
    };

    return (
        <div className="container mx-auto px-4 sm:px-8 lg:px-20 mt-4 mb-12">
            <header className="flex items-center pb-2 border-gray-200">
                <div className="flex items-center">
                    <button
                        className="mr-1 text-blue-800 hover:text-blue-600 text-xl rounded-full hover:bg-blue-100 transition-colors"
                        onClick={() => router.push('/profile')}
                    >
                        <FontAwesomeIcon icon={faChevronLeft}/>
                    </button>
                    <h1 className="text-1xl font-bold text-gray-900">Назад</h1>
                </div>
            </header>

            <h1 className="text-2xl font-extrabold text-gray-800 mt-4 mb-4 sm:text-left">
                Смена пароля
            </h1>
            <div className="bg-white shadow-md rounded-2xl p-6 sm:p-8">
                {/*<h2 className="text-xl sm:text-2xl mb-6 text-gray-800">Смена пароля</h2>*/}
                <form onSubmit={handlePasswordSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Старый пароль</label>
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
                            className="w-full sm:w-auto brand-bg text-white px-6 py-3 rounded-xl font-medium hover:bg-green-700 transition"
                            disabled={loading}
                        >
                            {loading ? 'Смена...' : 'Сменить пароль'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;
