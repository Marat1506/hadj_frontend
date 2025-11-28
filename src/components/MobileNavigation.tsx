'use client';

import Image from 'next/image';
import {usePathname, useRouter} from 'next/navigation';

import mobile_gid from '@/../public/mobile_gid.svg';
import mobile_gid_active from '@/../public/mobile_gid_active.svg';
import mobile_home from '@/../public/mobile_home.svg';
import mobile_home_active from '@/../public/mobile_home_active.svg';
import mobile_menu from '@/../public/mobile_menu.svg';
import mobile_menu_active from '@/../public/mobile_menu_active.svg';
import mobile_navigation from '@/../public/mobile_navigation.svg';
import mobile_navigation_active from '@/../public/mobile_navigation_active.svg';

interface MobileNavigationProps {
    onMenuClick: () => void;
    onNavigate?: () => void;
    isOpen: boolean;
}

const MobileNavigation = ({onMenuClick, onNavigate, isOpen}: MobileNavigationProps) => {
    const router = useRouter();
    const pathname = usePathname();

    const navItems = [
        {path: '/', label: 'Главная', icon: mobile_home, activeIcon: mobile_home_active},
        {path: '/guide', label: 'Гид', icon: mobile_gid, activeIcon: mobile_gid_active},
        {path: '/navigation', label: 'Навигация', icon: mobile_navigation, activeIcon: mobile_navigation_active},
    ];

    const handleNavigate = (path: string) => {
        router.push(path);
        if (onNavigate) onNavigate();
    };

    return (
        <nav className="block nav:hidden fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white shadow-lg z-50">
            <div className="flex justify-around items-center">
                {navItems.map(({path, label, icon, activeIcon}) => (
                    <button
                        key={path}
                        onClick={() => handleNavigate(path)}
                        className={`flex flex-col items-center py-3 px-4 ${
                            pathname === path && !isOpen ? 'brand-col' : 'text-gray-500'
                        }`}
                    >
                        <Image
                            src={pathname === path && !isOpen ? activeIcon : icon}
                            alt={label}
                            width={24}
                            height={24}
                        />
                        <span className="text-xs mt-1">{label}</span>
                    </button>
                ))}

                <button
                    onClick={onMenuClick}
                    className={`flex flex-col items-center py-3 px-4 ${
                        isOpen ? 'brand-col' : 'text-gray-500'
                    }`}
                >
                    <Image
                        src={isOpen ? mobile_menu_active : mobile_menu}
                        alt="Меню"
                        width={24}
                        height={24}
                    />
                    <span className="text-xs mt-1">Меню</span>
                </button>
            </div>
        </nav>
    );
};

export default MobileNavigation;
