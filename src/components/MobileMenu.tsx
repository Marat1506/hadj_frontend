'use client';

import React from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '@/store';
import { logout, logoutUser } from '@/store/slices/authSlice';

import MobileNavigation from './MobileNavigation';

import avatar from '@/../public/avatar.svg';
import contract from '@/../public/contract.svg';
import edit from '@/../public/edit.svg';
import faq from '@/../public/faq.svg';
import gallery from '@/../public/gallery.svg';
import info from '@/../public/info.svg';
import logout_icon from '@/../public/logout.svg';
import medical from '@/../public/medical.svg';
import phone from '@/../public/phone.svg';
import tasks from '@/../public/tasks.svg';
import users from '@/../public/users.svg';
import wallet from '@/../public/wallet.svg';


interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { isAuthenticated, user } = useSelector((state: RootState) => state.user);

    if (!isOpen) return null;

    const goTo = (path: string) => {
        router.push(path);
        onClose();
    };

    const handleLogout = () => {
        dispatch(logoutUser() as any);
        logout();
        localStorage.clear();
        document.cookie = 'token=; Max-Age=-1;';
        onClose();
        setTimeout(() => {
            router.push('/login');
            router.refresh();
        }, 500);
    };

    const iconMap: Record<string, any> = {
        medical,
        wallet,
        tasks,
        contract,
        users,
        info,
        phone,
        gallery,
        faq,
        logout: logout_icon,
    };

    return (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto pb-10">
            <div className="container mx-auto px-4 py-6">
                <div className="flex justify-between items-center mb-8">
                    {isAuthenticated ? (
                        <div className="flex items-center gap-4 w-full">
                            <div className="w-[72px] h-[72px] rounded-full overflow-hidden bg-neutral-200 flex items-center justify-center">
                                <Image
                                    src={avatar}
                                    alt={`${user?.firstName} ${user?.lastName}`}
                                    width={40}
                                    height={40}
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-[17px] font-semibold text-gray-900 leading-tight">
                                    {user?.firstName} {user?.lastName}
                                </h3>
                                <p className="text-[16px] text-gray-600 mt-1">{user?.phone}</p>
                            </div>
                            <Image
                                src={edit}
                                alt={'edit'}
                                width={30}
                                height={30}
                                className="opacity-80 hover:opacity-100 transition-all cursor-pointer"
                                onClick={() => goTo('/profile')}
                            />
                        </div>
                    ) : (
                        <div className="w-full flex justify-between items-center">
                            <Image src="/logo.svg" alt="Логотип" width={80} height={35}/>
                            <button
                                onClick={() => goTo('/login')}
                                className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                            >
                                Войти
                            </button>
                        </div>
                    )}
                </div>

                <div className="mb-8">
                    <ul className="space-y-0.5">
                        {isAuthenticated && (
                            <>
                                <MenuListItem icon={iconMap.medical} title="Медицинская карта" onClick={() => goTo('/medical-card')}/>
                                <MenuListItem icon={iconMap.wallet} title="Баланс и платежи" onClick={() => goTo('/balance')}/>
                                <MenuListItem icon={iconMap.tasks} title="Чек-лист подготовки" onClick={() => goTo('/checklist')}/>
                                <MenuListItem icon={iconMap.contract} title="Мои договоры" onClick={() => goTo('/contracts')}/>
                                <MenuListItem icon={iconMap.users} title="Попутчики" onClick={() => goTo('/companions')}/>
                            </>
                        )}

                        <MenuListItem icon={iconMap.info} title="О компании" onClick={() => goTo('/about')}/>
                        <MenuListItem icon={iconMap.phone} title="Контакты" onClick={() => goTo('/contacts')}/>
                        <MenuListItem icon={iconMap.gallery} title="Галерея" onClick={() => goTo('/gallery')}/>
                        <MenuListItem icon={iconMap.faq} title="FAQ" onClick={() => goTo('/faq')}/>

                        {isAuthenticated && (
                            <MenuListItem
                                icon={iconMap.logout}
                                title="Выйти"
                                onClick={handleLogout}
                                className="text-red-600 hover:text-red-700 font-medium"
                            />
                        )}
                    </ul>
                </div>

                <div className="w-full">
                    <div className="mb-20"></div>
                    <MobileNavigation onMenuClick={onClose} onNavigate={onClose} isOpen={isOpen}/>
                </div>
            </div>
        </div>
    );
};

interface MenuListItemProps {
    icon: any;
    title: string;
    onClick: () => void;
    className?: string;
}

const MenuListItem = ({ icon, title, onClick, className = '' }: MenuListItemProps) => (
    <li>
        <button
            onClick={onClick}
            className={`flex items-center justify-between w-full px-4 py-3 text-gray-800 hover:bg-black/5 transition rounded-xl ${className}`}
        >
            <div className="flex items-center gap-3">
                <Image
                    src={icon}
                    alt={title}
                    width={22}
                    height={22}
                    className="opacity-80 hover:opacity-100 transition-all"
                />
                <span className="text-[16px] font-medium">{title}</span>
            </div>
            <svg width="7" height="10" viewBox="0 0 7 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 0.5L6 5L1 9.5" stroke="#161C24" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </button>
    </li>
);

export default MobileMenu;