"use client";

import React, {useEffect, useState} from "react";
import {faChevronLeft, faPen} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useRouter} from "next/navigation";
import CompanionModal from "@/components/modals/CompanionModal";
import {api} from '@/services';

const CompanionsPage = () => {
    const router = useRouter();
    const [companions, setCompanions] = useState<any[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"create" | "edit">("create");
    const [selected, setSelected] = useState<any>(null);

    const fetchCompanions = async () => {
        try {
            const data = await api.getAllCompanions();
            setCompanions(data);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchCompanions();
    }, []);

    return (
        <div className="min-h-screen bg-white flex flex-col pb-16">
            <div className="container mx-auto px-4 py-8">
                <header className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        <button
                            className="mr-3 text-blue-800 hover:text-blue-600 text-xl p-2 rounded-full hover:bg-blue-100 transition-colors flex items-center justify-center w-10 h-10"
                            onClick={() => router.push("/")}
                        >
                            <FontAwesomeIcon icon={faChevronLeft}/>
                        </button>
                        <h1 className="text-xl font-bold text-gray-900">Попутчики</h1>
                    </div>

                    <button
                        onClick={() => {
                            setModalMode("create");
                            setSelected(null);
                            setModalOpen(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                        </svg>
                        Добавить
                    </button>
                </header>

                <div className="flex justify-center">
                    <div className="max-w-[700px] w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {companions.map((companion) => (
                        <div
                            key={companion.id}
                            className="border bg-blue-300/20 border-blue-950 rounded-xl p-6 flex flex-col items-center justify-center min-h-[140px] relative"
                        >
                            <div
                                onClick={() => {
                                    setSelected(companion);
                                    setModalMode("edit");
                                    setModalOpen(true);
                                }}
                                className="absolute top-3 right-3 border border-blue-800 bg-[#0846AA1A] hover:bg-blue-100 hover:text-blue-600 w-9 h-9 flex items-center justify-center rounded-full cursor-pointer transition-colors"
                            >
                                <FontAwesomeIcon icon={faPen}/>
                            </div>

                            <div className="w-16 h-16 bg-[#DBEAFE] rounded-full flex items-center justify-center text-blue-600 text-2xl mb-2">
                                {companion.firstName?.charAt(0) || "?"}
                            </div>

                            <div className="text-center">
                                <h3 className="text-[18px] font-semibold text-gray-800">
                                    {companion.firstName} {companion.lastName}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>

                    {companions.length === 0 && (
                        <div className="text-center py-12 bg-white rounded-xl shadow-md mt-6">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">Попутчики не найдены</h3>
                            <p className="text-gray-500">Попробуйте добавить первого попутчика</p>
                        </div>
                    )}
                </div>
            </div>

            <CompanionModal
                open={modalOpen}
                onClose={() => {
                    setModalOpen(false),
                        fetchCompanions()
                }}
                companion={selected}
            />
        </div>
    );
};

export default CompanionsPage;
