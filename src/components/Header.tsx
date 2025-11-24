import React, {useEffect, useRef, useState} from 'react';

import {faPhone} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import {usePathname, useRouter} from 'next/navigation';
import {useSelector} from 'react-redux';


import {Button} from '@/components/ui/button';
import {RootState} from '@/store';
import DesktopMenu from "@/components/DesktopMenu";

interface HeaderProps {
    onLoginClick?: () => void;
    onMenuClick?: () => void;
}

const Header = ({onLoginClick, onMenuClick}: HeaderProps) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const {isAuthenticated, user} = useSelector((state: RootState) => state.user);
    const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);


    const router = useRouter();
    const pathname = usePathname();
    const isHome = pathname === '/';

    const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnter = () => {
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
            closeTimeoutRef.current = null;
        }

        if (!isDesktopMenuOpen) {
            setIsDesktopMenuOpen((prev) => !prev);
        }
    };

    const handleMouseLeave = () => {
        // ставим отложенное закрытие только если мышь не на меню
        closeTimeoutRef.current = setTimeout(() => {
            setIsDesktopMenuOpen((prev) => !prev);
        }, 300); // меньшее время, просто "страховка"
    };

    const handleMenuClick = () => {
        setIsDesktopMenuOpen((prev) => !prev);
    };

    // Важно: очистка
    useEffect(() => {
        return () => {
            if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
        };
    }, []);

    return (
        <header
            className="fixed top-0 left-0 z-50 w-full py-4"
        >
            <div className="container mx-auto px-4 md:px-8">
                <div
                    className="flex justify-between items-center rounded-2xl bg-[#f9f9f9]/70 backdrop-blur-md border border-gray-300/40 px-6 py-3 shadow-sm">

                    <nav className="flex items-center gap-5 lg:gap-10">
                        <div
                            onClick={() => router.push('/')}
                            className="text-3xl text-amber-700 cursor-pointer"
                        >
                            <img src="/logo.svg" alt="Logo" className="rounded-lg object-cover w-[100px]"/>
                        </div>

                        <nav className="hidden md:block">
                            <ul className="flex space-x-10 text-gray-700 font-medium text-[15px]">
                                {[
                                    {href: '/', label: 'Главная'},
                                    {href: '/hajj', label: 'Хадж'},
                                    {href: '/umrah', label: 'Умра'},
                                    {href: '/guide', label: 'Гид паломника'},
                                    {href: '/navigation', label: 'Навигация'},
                                    {href: '/gallery', label: 'Галерея'},
                                ].map(({href, label}) => (
                                    <li key={href}>
                                        <Link
                                            href={href}
                                            className="relative group transition-colors duration-200 text-gray-700 hover:text-[#052E70]"
                                        >
                                            {label}
                                            <span
                                                className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#12326a] transition-all duration-300 group-hover:w-full"></span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </nav>

                    <div className="flex items-center gap-20">
                        <a
                            href="tel:+78007003736"
                            className="relative hidden lg:flex items-center font-medium group transition-colors duration-200 text-gray-700 hover:text-[#12326a]"
                        >
                            <FontAwesomeIcon icon={faPhone} className="mr-2 text-[16px]"/>
                            8 (800) 700 37 36
                            <span
                                className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#12326a] transition-all duration-300 group-hover:w-full"></span>
                        </a>

                        <div className={'hidden md:block'}>
                            {isAuthenticated ? (

                                <div
                                    onMouseEnter={handleMouseEnter}
                                    onMouseLeave={handleMouseLeave}>
                                    <button
                                        id="menu-btn"
                                        className="relative group"

                                    >
                                        <div className="rounded-[30px] text-gray-700 transition-colors flex items-center justify-center px-[14px] h-[34px] border border-[#000] hover:border-[#fff] hover:bg-[#12326a] hover:text-white cursor-pointer">
                                            {isAuthenticated ? (`${user?.firstName[0]} ${user?.lastName[0]}`) : 'Помощь'}
                                        </div>

                                    </button>

                                    <DesktopMenu isDesktopMenuOpen={isDesktopMenuOpen} onClose={() => setIsDesktopMenuOpen(false)}/>
                                </div>
                            ) : (
                                <div className={'flex items-center gap-3'}>
                                    <Button
                                        onClick={() => router.push('/login')}
                                        className="bg-[#12326a] text-white px-7 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition"
                                    >
                                        Войти
                                    </Button>

                                    <Button
                                        onClick={handleMenuClick}
                                        className="px-7 h-[38px] text-black border border-black rounded-full bg-transparent hover:bg-transparent"
                                    >
                                        Помощь
                                    </Button>

                                    <DesktopMenu isDesktopMenuOpen={isDesktopMenuOpen} onClose={() => setIsDesktopMenuOpen(false)}/>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
