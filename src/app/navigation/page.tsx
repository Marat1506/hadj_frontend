import React, {Suspense} from 'react';
import NavigationClient from './NavigationClient';

interface City {
    id: number;
    name: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

async function fetchCities(): Promise<City[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/cities`, {
            next: { revalidate: 3600 } // Revalidate every hour
        });
        
        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
            return [];
        }
        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error('Ошибка при загрузке городов:', error);
        return [];
    }
}

const NavigationContent: React.FC = async () => {
    const cities = await fetchCities();
    return <NavigationClient initialCities={cities} />;
};

const NavigationPage = () => {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Загрузка...</div>}>
            <NavigationContent/>
        </Suspense>
    );
};

export default NavigationPage;
