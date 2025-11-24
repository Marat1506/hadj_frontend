'use client';

import {useRouter} from 'next/navigation';

const PilgrimageCards = () => {
    const router = useRouter();

    return (
        <section className="container mx-auto px-0 py-6">
            <h2 className="text-xl flex items-center pl-4 sm:pl-0">Выбор тура</h2>

            <div className="sm:flex mt-3 hidden flex-wrap md:flex-nowrap gap-4">
                {/* Умра */}
                <div
                    className="w-full md:w-1/2 bg-gradient-to-r from-blue-800 to-blue-900 rounded-xl p-4 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-xl font-semibold">Умра</h3>
                        <p className="mb-3 text-xs max-w-[350px] leading-relaxed">
                            Малое паломничество в любое время года с лучшими условиями
                        </p>
                        <button
                            className="bg-white text-blue-800 px-5 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
                            onClick={() => router.push('/umrah')}
                        >
                            Выбрать тур
                        </button>
                    </div>
                    <div className="absolute -right-8 -bottom-0">
                        <svg width="120" height="96" viewBox="0 0 160 128" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M0 120V40H32V120C32 124.5 28.25 128 24 128H8C3.5 128 0 124.5 0 120ZM144.75 72H55C50.5 67.75 48 62.75 48 57.5C48 44.25 58.25 34 69.75 26.75C80.25 20 90 12.25 97.75 2.5L100 0L102 2.5C109.75 12.25 119.5 20 130 26.75C141.5 34 152 44.25 152 57.5C152 62.75 149.25 67.75 144.75 72ZM152 80C156.25 80 160 83.75 160 88V120C160 124.5 156.25 128 152 128H144V112C144 107.75 140.25 104 136 104C131.5 104 128 107.75 128 112V128H112V110C112 98 100 92 100 92C100 92 88 98 88 110V128H72V112C72 107.75 68.25 104 64 104C59.5 104 56 107.75 56 112V128H48C43.5 128 40 124.5 40 120V88C40 83.75 43.5 80 48 80H152ZM16 0C16 0 32 8 32 24V32H0V24C0 8 16 0 16 0Z"
                                fill="#0846AA"/>
                        </svg>
                    </div>
                </div>

                {/* Хадж */}
                <div className="w-full md:w-1/2 bg-[#03AA77] rounded-xl p-4 text-white relative overflow-hidden">

                    <div className="relative z-10">
                        <h3 className="text-xl font-semibold">Хадж 2025</h3>
                        <p className="mb-3 text-xs max-w-[350px] leading-relaxed">
                            Совершите пятый столп Ислама с нашими комфортными турами
                        </p>
                        <button
                            className="bg-white text-amber-700 px-5 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
                            onClick={() => router.push('/hajj')}
                        >
                            Выбрать тур
                        </button>
                    </div>
                    <div className="absolute -right-0 -bottom-0">
                        <svg width="108" height="78" viewBox="0 0 144 104" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M138.5 21C141.75 22 144 25.25 144 28.5V40.75L77.75 21C73.75 19.75 70 19.75 66.25 21L0 40.75V28.5C0 25 2.25 22 5.25 21L64.25 1.25C66.75 0.5 69.25 0.25 72 0.25C74.5 0.25 77 0.5 79.5 1.25L138.5 21ZM68.5 28.75C70.75 28 73 28 75.25 28.75L144 49.25V106.25C144 110 141.25 113.25 137.5 114L77 127.5C75.5 128 73.75 128.25 72 128.25C70 128.25 68.25 128 66.75 127.5L6.25 114C2.5 113.25 0 110 0 106.25V49.25L68.5 28.75ZM32 57.75V53.5C32 52.25 30.5 51.25 29.25 51.5L9.25 57C8.5 57.25 8 58 8 59V63C8 64.5 9.25 65.5 10.5 65L30.5 59.5C31.25 59.25 32 58.5 32 57.75ZM68 47.75V43.75C68 42.25 66.5 41.5 65.25 41.75L41.25 48.25C40.5 48.5 40 49.25 40 50.25V54.5C40 55.75 41.25 56.75 42.5 56.25L66.5 49.75C67.25 49.5 68 48.75 68 47.75ZM112 53.5V57.75C112 58.5 112.5 59.25 113.25 59.5L133.25 65C134.5 65.5 136 64.5 136 63V59C136 58 135.25 57.25 134.5 57L114.5 51.5C113.25 51.25 112 52.25 112 53.5ZM76 43.75V47.75C76 48.75 76.5 49.5 77.25 49.75L101.25 56.25C102.5 56.75 104 55.75 104 54.5V50.25C104 49.25 103.25 48.5 102.5 48.25L78.5 41.75C77.25 41.5 76 42.25 76 43.75Z"
                                fill="black" fillOpacity="0.6"/>
                        </svg>
                    </div>
                </div>
            </div>

            <div
                className="
                     sm:hidden mt-3 flex gap-4
                     overflow-x-auto scrollbar-hide
                     md:overflow-visible md:flex-nowrap md:flex-wrap
                     md:mx-0 md:px-0
    "
            >
                {/* Умра */}
                <div
                    className="
                    ml-4
                        flex-shrink-0
                        w-[80%]
                        bg-gradient-to-r from-blue-800 to-blue-900
                        rounded-xl p-4 text-white relative overflow-hidden
                    "
                >
                    <div className="relative z-10">
                        <h3 className="text-xl font-semibold">Умра</h3>
                        <p className="mb-3 text-xs max-w-[350px] leading-relaxed">
                            Малое паломничество в любое время года с лучшими условиями
                        </p>
                        <button
                            className="bg-white text-blue-800 px-5 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
                            onClick={() => router.push('/umrah')}
                        >
                            Выбрать тур
                        </button>
                    </div>
                    <div className="absolute -right-8 -bottom-0">
                        <svg width="120" height="96" viewBox="0 0 160 128" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M0 120V40H32V120C32 124.5 28.25 128 24 128H8C3.5 128 0 124.5 0 120ZM144.75 72H55C50.5 67.75 48 62.75 48 57.5C48 44.25 58.25 34 69.75 26.75C80.25 20 90 12.25 97.75 2.5L100 0L102 2.5C109.75 12.25 119.5 20 130 26.75C141.5 34 152 44.25 152 57.5C152 62.75 149.25 67.75 144.75 72ZM152 80C156.25 80 160 83.75 160 88V120C160 124.5 156.25 128 152 128H144V112C144 107.75 140.25 104 136 104C131.5 104 128 107.75 128 112V128H112V110C112 98 100 92 100 92C100 92 88 98 88 110V128H72V112C72 107.75 68.25 104 64 104C59.5 104 56 107.75 56 112V128H48C43.5 128 40 124.5 40 120V88C40 83.75 43.5 80 48 80H152ZM16 0C16 0 32 8 32 24V32H0V24C0 8 16 0 16 0Z"
                                fill="#0846AA"/>
                        </svg>
                    </div>
                </div>

                {/* Хадж */}
                <div
                    className="
                        flex-shrink-0
                        w-[80%]
                        bg-[#03AA77]
                        rounded-xl p-4 text-white relative overflow-hidden
                    "
                >
                    <div className="relative z-10">
                        <h3 className="text-xl font-semibold">Хадж 2025</h3>
                        <p className="mb-3 text-xs max-w-[350px] leading-relaxed">
                            Совершите пятый столп Ислама с нашими комфортными турами
                        </p>
                        <button
                            className="bg-white text-amber-700 px-5 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
                            onClick={() => router.push('/hajj')}
                        >
                            Выбрать тур
                        </button>
                    </div>
                    <div className="absolute -right-0 -bottom-0">
                        <svg width="108" height="78" viewBox="0 0 144 104" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M138.5 21C141.75 22 144 25.25 144 28.5V40.75L77.75 21C73.75 19.75 70 19.75 66.25 21L0 40.75V28.5C0 25 2.25 22 5.25 21L64.25 1.25C66.75 0.5 69.25 0.25 72 0.25C74.5 0.25 77 0.5 79.5 1.25L138.5 21ZM68.5 28.75C70.75 28 73 28 75.25 28.75L144 49.25V106.25C144 110 141.25 113.25 137.5 114L77 127.5C75.5 128 73.75 128.25 72 128.25C70 128.25 68.25 128 66.75 127.5L6.25 114C2.5 113.25 0 110 0 106.25V49.25L68.5 28.75ZM32 57.75V53.5C32 52.25 30.5 51.25 29.25 51.5L9.25 57C8.5 57.25 8 58 8 59V63C8 64.5 9.25 65.5 10.5 65L30.5 59.5C31.25 59.25 32 58.5 32 57.75ZM68 47.75V43.75C68 42.25 66.5 41.5 65.25 41.75L41.25 48.25C40.5 48.5 40 49.25 40 50.25V54.5C40 55.75 41.25 56.75 42.5 56.25L66.5 49.75C67.25 49.5 68 48.75 68 47.75ZM112 53.5V57.75C112 58.5 112.5 59.25 113.25 59.5L133.25 65C134.5 65.5 136 64.5 136 63V59C136 58 135.25 57.25 134.5 57L114.5 51.5C113.25 51.25 112 52.25 112 53.5ZM76 43.75V47.75C76 48.75 76.5 49.5 77.25 49.75L101.25 56.25C102.5 56.75 104 55.75 104 54.5V50.25C104 49.25 103.25 48.5 102.5 48.25L78.5 41.75C77.25 41.5 76 42.25 76 43.75Z"
                                fill="black" fillOpacity="0.6"/>
                        </svg>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PilgrimageCards;
