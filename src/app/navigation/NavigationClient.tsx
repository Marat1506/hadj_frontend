'use client';

import React, {useEffect, useState} from 'react';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {
    FaBriefcaseMedical,
    FaCampground,
    FaHospital,
    FaHotel,
    FaKaaba,
    FaMapMarkerAlt
} from 'react-icons/fa';
import MapView from '@/components/MapView';
import {api} from '@/services';
import PageHeader from '@/components/PageHeader';
import {GridSkeleton} from '@/components/ui/loading-skeletons';

interface City {
    id: number;
    name: string;
}

interface Service {
    id: number;
    title: string;
    type: string;
}

interface ObjectItem {
    id: number;
    createdAt: string;
    title: string;
    description?: string;
    latitude: number;
    longitude: number;
    updatedAt: string;
    service: Service;
}

interface OpenedCard {
    id: number;
    title: string;
    type: string;
    objects: ObjectItem[];
    icon: any;
}

interface NavigationClientProps {
    initialCities: City[];
}

const NavigationClient: React.FC<NavigationClientProps> = ({ initialCities }) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const searchParamsString = searchParams.toString();

    const cityIdParam = searchParams.get('cityId');
    const latParam = searchParams.get('lat');
    const lngParam = searchParams.get('lng');
    const titleParam = searchParams.get('title');

    const [activeTab, setActiveTab] = useState(0);
    const [openedCard, setOpenedCard] = useState<OpenedCard | null>(null);
    const [cities] = useState<City[]>(initialCities);
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(false);
    const [showMap, setShowMap] = useState(false);
    const [mapLocation, setMapLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [mapTitle, setMapTitle] = useState('');

    useEffect(() => {
        if (latParam && lngParam) {
            setMapLocation({lat: parseFloat(latParam), lng: parseFloat(lngParam)});
            setMapTitle(titleParam || 'Местоположение');
            setShowMap(true);
        } else {
            setShowMap(false);
        }
    }, [latParam, lngParam, titleParam]);

    useEffect(() => {
        if (!cityIdParam && cities.length > 0 && !showMap) {
            const params = new URLSearchParams(searchParamsString);
            params.set('cityId', String(cities[0].id));
            const queryString = params.toString();
            router.replace(queryString ? `${pathname}?${queryString}` : pathname);
        }
    }, [cityIdParam, router, showMap, pathname, searchParamsString, cities]);

    useEffect(() => {
        if (cityIdParam && !showMap) {
            const fetchServices = async () => {
                setLoading(true);
                try {
                    const servicesData = await api.getServicesByCity(cityIdParam);
                    setServices(servicesData);
                } catch (err) {
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };
            fetchServices();
        }
    }, [cityIdParam, showMap]);

    const handleCityClick = (cityId: number, cityIndex: number) => {
        const params = new URLSearchParams(searchParamsString);
        params.set('cityId', String(cityId));
        const queryString = params.toString();
        router.replace(queryString ? `${pathname}?${queryString}` : pathname);
        setActiveTab(cityIndex);
        setShowMap(false);
    };

    const handleServiceClick = async (service: Service) => {
        try {
            const objectsData = await api.getObjectsByService(service.id);
            setOpenedCard({
                ...service,
                objects: objectsData,
                icon: getServiceIcon(service.type)
            });
            setShowMap(true);
        } catch (err) {
            console.error(err);
        }
    };

    const getServiceIcon = (type: string) => {
        switch (type) {
            case 'hotel':
                return <FaHotel className="text-blue-800 text-4xl"/>;
            case 'hospital':
                return <FaHospital className="text-blue-800 text-4xl"/>;
            case 'camp':
                return <FaCampground className="text-blue-800 text-4xl"/>;
            case 'medical':
                return <FaBriefcaseMedical className="text-blue-800 text-4xl"/>;
            case 'kaaba':
                return <FaKaaba className="text-blue-800 text-4xl"/>;
            default:
                return <FaMapMarkerAlt className="text-blue-800 text-4xl"/>;
        }
    };

    const handleBackClick = () => {
        if (showMap) {
            setShowMap(false);
            setOpenedCard(null);
        } else {
            router.push('/');
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col pb-16">
            <div className="container mx-auto px-4 py-2">
                <PageHeader 
                    title={showMap ? 'Карта' : 'Навигация'} 
                    onBack={handleBackClick} 
                />

            {showMap && openedCard ? (
                <MapView mapData={openedCard} handleBackClick={handleBackClick}/>
            ) : (
                <>
                    {!openedCard && (
                        <nav className="flex overflow-x-auto scrollbar-hide border-b border-gray-100 bg-white">
                            {cities.map((city, idx) => (
                                <button
                                    key={city.id}
                                    className={`flex-1 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                                        activeTab === idx ? 'border-b-2 border-[#042253]' : 'text-gray-400'
                                    }`}
                                    onClick={() => handleCityClick(city.id, idx)}
                                >
                                    {city.name}
                                </button>
                            ))}
                        </nav>
                    )}

                    {!openedCard && (
                        <div className="flex-1 bg-white pt-4">
                            {loading ? (
                                <GridSkeleton count={4} />
                            ) : (
                                <div
                                    className={`grid ${services.length > 1 ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-1'} gap-4`}>
                                    {services.map(service => (
                                        <button
                                            key={service.id}
                                            className="p-6 rounded-lg hover:shadow-lg transition-all duration-200 min-h-[140px] relative"
                                            onClick={() => handleServiceClick(service)}
                                            style={{
                                                background: 'linear-gradient(white, white) padding-box, linear-gradient(90deg, #052E70 0%, #042253 100%) border-box',
                                                border: '1px solid transparent'
                                            }}
                                        >
                                            <div 
                                                className="absolute inset-0 rounded-lg pointer-events-none"
                                                style={{
                                                    background: 'linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), linear-gradient(0deg, rgba(0, 91, 254, 0.07), rgba(0, 91, 254, 0.07)), linear-gradient(0deg, rgba(14, 54, 98, 0.01), rgba(14, 54, 98, 0.01))'
                                                }}
                                            />
                                            <div className="flex flex-col items-center space-y-3 relative z-10">
                                                {getServiceIcon(service.type)}
                                                <span className="text-base font-medium text-center leading-relaxed">{service.title}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}
            </div>
        </div>
    );
};

export default NavigationClient;
