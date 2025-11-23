import React, {useEffect, useState} from 'react';

import {useRouter} from 'next/router';
import {
    FaBriefcaseMedical,
    FaCampground,
    FaChevronLeft,
    FaHospital,
    FaHotel,
    FaKaaba,
    FaMapMarkerAlt
} from 'react-icons/fa';

import MapView from '@/components/MapView';
import {api} from '@/services';

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

const Navigation: React.FC = () => {
    const router = useRouter();
    const {query} = router;

    const [activeTab, setActiveTab] = useState(0);
    const [openedCard, setOpenedCard] = useState<OpenedCard | null>(null);
    const [cities, setCities] = useState<City[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [showMap, setShowMap] = useState(false);
    const [mapLocation, setMapLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [mapTitle, setMapTitle] = useState('');

    useEffect(() => {
        if (query.lat && query.lng) {
            setMapLocation({lat: parseFloat(query.lat as string), lng: parseFloat(query.lng as string)});
            setMapTitle((query.title as string) || 'Местоположение');
            setShowMap(true);
        } else {
            setShowMap(false);
        }
    }, [query.lat, query.lng, query.title]);

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const citiesData = await api.getCities();
                setCities(citiesData);

                if (!query.cityId && citiesData.length > 0 && !showMap) {
                    router.replace({query: {...query, cityId: citiesData[0].id}});
                }
            } catch (err) {
            } finally {
                setLoading(false);
            }
        };
        fetchCities();
    }, [query.cityId, router, showMap, query]);

    useEffect(() => {
        if (query.cityId && !showMap) {
            const fetchServices = async () => {
                try {
                    const servicesData = await api.getServicesByCity(query.cityId as string);
                    setServices(servicesData);
                } catch (err) {
                }
            };
            fetchServices();
        }
    }, [query.cityId, showMap]);

    const handleCityClick = (cityId: number, cityIndex: number) => {
        router.replace({query: {...query, cityId}});
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
            <header className="container flex items-center px-4 py-4 border-b border-gray-100 justify-between">
                <div className="flex items-center">
                    <button className="mr-3 text-blue-800 text-xl" onClick={handleBackClick}>
                        <FaChevronLeft/>
                    </button>
                    <h1 className="text-[1.3rem]  text-gray-900">
                        {showMap ? 'Карта' : 'Навигация'}
                    </h1>
                </div>
            </header>

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
                        <div className="container flex-1 px-4 py-6 bg-white">
                            {loading ? (
                                <div className="text-center py-10">Загрузка...</div>
                            ) : (
                                <div
                                    className={`grid ${services.length > 1 ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-1'} gap-4`}>
                                    {services.map(service => (
                                        <button
                                            key={service.id}
                                            className="border bg-blue-400/20 border-blue-950 rounded-xl p-4 flex flex-col items-center justify-center min-h-[140px]"
                                            onClick={() => handleServiceClick(service)}
                                        >
                                            {getServiceIcon(service.type)}
                                            <span
                                                className="mt-3 text-sm font-medium text-black text-center">{service.title}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Navigation;
