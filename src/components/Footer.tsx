import React from 'react';
import Link from 'next/link';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="hidden md:block w-full h-[200px] bg-gray-50 border-t border-gray-200 mt-auto">
            <div className="container mx-auto px-4 h-full flex items-center">
                {/* Main Footer Content */}
                <div className="flex justify-between items-center w-full">
                    {/* Left Section - Logo and Copyright */}
                    <div className="flex flex-col space-y-4">
                        <div className="flex items-center space-x-2">
                            {/* <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-sm">Н</span>
                            </div>
                            <span className="text-xl font-bold text-gray-900">НХК</span> */}
                            <img src="/logo.svg" alt="НХК Logo" className="h-8"/>
                        </div>
                        <p className="text-sm text-gray-500">
                            {currentYear} © Все права защищены
                        </p>
                    </div>

                    {/* Center Section - Contact Info and Legal */}
                    <div className="flex flex-col space-y-3">
                        {/* Email */}
                        <a
                            href="mailto:NXK@mail.com"
                            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            {/* <MdEmail className="w-5 h-5" /> */}
                            <img src="/sms.svg" alt="Email" className="w-5 h-5"/>
                            <span className="text-sm">NXK@mail.com</span>
                        </a>

                        {/* Phone */}
                        <a
                            href="tel:+79281001001"
                            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            {/* <MdPhone className="w-5 h-5" /> */}
                            <img src="/call.svg" alt="Phone" className="w-5 h-5"/>
                            <span className="text-sm">+7(928) 100 100 1</span>
                        </a>

                       
                    </div>
                     <div className="flex flex-col space-y-3">
                        {/* Legal Info */}
                        <div className="text-xs text-gray-500 space-y-1 mt-2">
                            <p>ООО «Национальная Хадж Компания»</p>
                            <p>ИНН 9710000000</p>
                            <p>ОГРН 5555</p>
                        </div>
                     </div>

                     

                    {/* Right Section - Links and Social */}
                    <div className="flex flex-col space-y-4">
                        {/* Document Links */}
                        <div className="flex flex-col space-y-2">
                            <div className='flex items-center gap-1'>
                                <Link
                                href="/terms"
                                className="text-sm hover:text-blue-800 transition-colors"
                                style={{ fontSize: '14px', color: 'rgba(42, 171, 238, 1)' }}
                            >
                                Условия использования
                            </Link>
                            <span className="text-sm text-gray-600">и</span>
                            </div>
                            
                            <Link
                                href="/privacy"
                                className="text-sm hover:text-blue-800 transition-colors"
                                style={{ fontSize: '14px', color: 'rgba(42, 171, 238, 1)' }}
                            >
                                Политика конфиденциальности
                            </Link>
                        </div>

                       
                    </div>
                    <div className="flex flex-col space-y-4">
{/* Social Media Icons */}
                        <div className="flex items-center space-x-4">
                            <a
                                href="https://t.me/nhk"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 hover:text-blue-500 transition-colors"
                                aria-label="Telegram"
                            >
                                {/* <FaTelegram className="w-6 h-6" /> */}
                                <img src="/Telegram - Negative.svg" alt="Telegram" className="w-6 h-6"/>
                            </a>
                            <a
                                href="https://linkedin.com/company/nhk"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 hover:text-blue-700 transition-colors"
                                aria-label="LinkedIn"
                            >
                                {/* <FaLinkedin className="w-6 h-6" /> */}
                                <img src="/LinkedIn - Negative.svg" alt="LinkedIn" className="w-6 h-6"/>
                            </a>
                            <a
                                href="https://instagram.com/nhk"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 hover:text-pink-600 transition-colors"
                                aria-label="Instagram"
                            >
                                {/* <FaInstagram className="w-6 h-6" /> */}
                                <img src="/Instagram - Negative.svg" alt="Instagram" className="w-6 h-6"/>
                            </a>
                            <a
                                href="https://facebook.com/nhk"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 hover:text-blue-600 transition-colors"
                                aria-label="Facebook"
                            >
                                {/* <FaFacebook className="w-6 h-6" /> */}
                                <img src="/Facebook - Negative.svg" alt="Facebook" className="w-6 h-6"/>
                            </a>
                        </div>
                    </div>
                     
                </div>
            </div>
        </footer>
    );
};

export default Footer;
