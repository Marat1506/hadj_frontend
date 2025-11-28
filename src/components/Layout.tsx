'use client';

import React, {useEffect, useState} from 'react';

import {useDispatch} from 'react-redux';

import {getCookie} from '@/hooks/cookies';
import {useToast} from '@/hooks/use-toast';
import {api} from '@/services';
import {loginSuccess} from '@/store/slices/authSlice';
import Footer from './Footer';
import Header from './Header';
import MobileMenu from './MobileMenu';
import MobileNavigation from './MobileNavigation';


const Layout = ({children}: { children: React.ReactNode }) => {
    const dispatch = useDispatch();
    const {toast} = useToast();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const getUserInfo = async () => {
            const token = getCookie('token');
            if (!token) return;
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

                dispatch(loginSuccess({user: data}));
            } catch (error: any) {
                console.error('Ошибка при получении данных:', error);
            }
        };
        getUserInfo();
    }, [dispatch, toast]);

    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 850);
        };

        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);

        return () => window.removeEventListener('resize', checkIsMobile);
    }, []);

    const handleMenuClick = () => {
        if (isMobile) {
            setIsMobileMenuOpen(true);
        } else {
            setIsDesktopMenuOpen((prev) => !prev);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-white nav:pb-0 pb-16">
            <Header onMenuClick={handleMenuClick}/>

            <main className="flex-1 w-full max-w-full pt-20 nav:pt-24">
                {children}
            </main>

            <Footer/>
            <MobileNavigation onMenuClick={() => setIsMobileMenuOpen(true)} isOpen={isMobileMenuOpen}/>
            <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}/>
            {/*<DesktopMenu isDesktopMenuOpen={isDesktopMenuOpen} onClose={() => setIsDesktopMenuOpen(false)}/>*/}
        </div>
    );
};

export default Layout;
