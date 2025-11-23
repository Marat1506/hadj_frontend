import React, {useEffect, useRef, useState} from 'react';

import MapboxLanguage from '@mapbox/mapbox-gl-language';
import mapboxgl, {Map} from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface ObjectItem {
    id: number;
    createdAt: string;
    title: string;
    description?: string;
    latitude: number;
    longitude: number;
    updatedAt: string;
    service: {
        createdAt: string;
        id: number;
        title: string;
        type: string;
        updatedAt: string;
    };
}

interface OpenedCard {
    id: number;
    title: string;
    type: string;
    objects: ObjectItem[];
    icon: any;
}

interface MapViewProps {
    handleBackClick?: () => void;
    mapData?: OpenedCard | any;
}

const MapView: React.FC<MapViewProps> = ({mapData}) => {
    const mapRef = useRef<Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement | null>(null);

    const [destination, setDestination] = useState<[number, number] | null>(null);
    const [title, setTitle] = useState<string>('Destination');
    const [userLocation, setUserLocation] = useState<any>(null);

    useEffect(() => {
        mapboxgl.accessToken = process.env.NEXT_PUBLIC_API_MAPBOX_KEY;

        if (!mapContainerRef.current) return;

        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [37.618423, 55.751244],
            zoom: 4,
        });

        mapRef.current = map;

        const language = new MapboxLanguage();
        map.addControl(language);

        const geolocate = new mapboxgl.GeolocateControl({
            positionOptions: {enableHighAccuracy: true},
            trackUserLocation: true,
            showUserHeading: true,
        });

        map.addControl(geolocate);

        map.on('load', () => {
            geolocate.trigger();

            if (mapData?.objects?.length) {
                const bounds = new mapboxgl.LngLatBounds();

                mapData.objects.forEach((item: any) => {
                    const markerEl = document.createElement('div');
                    markerEl.style.width = '28px';
                    markerEl.style.height = '28px';
                    markerEl.style.backgroundColor = '#f88a37';
                    markerEl.style.borderRadius = '50%';
                    markerEl.style.boxShadow = '0 2px 8px rgba(0,0,0,0.25)';
                    markerEl.style.border = '2px solid white';
                    markerEl.style.cursor = 'pointer';

                    const popup = new mapboxgl.Popup({offset: 25}).setHTML(
                        `<div style="padding: 3px 0 0 0; font-size:14px;font-weight:600;color:#333;">${item.title}</div>`
                    );

                    new mapboxgl.Marker(markerEl)
                        .setLngLat([item.longitude, item.latitude])
                        .setPopup(popup)
                        .addTo(map)
                        .getElement()
                        .addEventListener('click', () => {
                            setDestination([item.longitude, item.latitude]);
                            setTitle(item.title);
                        });

                    bounds.extend([item.longitude, item.latitude]);
                });

                if (!bounds.isEmpty()) {
                    map.fitBounds(bounds, {padding: 60});
                }
            }
        });

        (map as any)._geolocateControl = geolocate;
        const geo: mapboxgl.GeolocateControl = (map as any)._geolocateControl;

        const handleGeolocate = (e: GeolocationPosition) => {
            console.log(e)
            setUserLocation([e.coords?.longitude, e.coords?.latitude]);
        };

        geo.on('geolocate', handleGeolocate);

        return () => {
            map.remove();
        };
    }, [mapData]);

    useEffect(() => {
        if (!mapRef.current || !destination) return;

        const map = mapRef.current;
        const geolocate: mapboxgl.GeolocateControl = (map as any)._geolocateControl;

        const handleGeolocate = async (e?: GeolocationPosition) => {
            if (e?.coords) {
                setUserLocation([e.coords.longitude, e.coords.latitude]);
            }
            // const userLocation: [number, number] = [
            //     e.coords.longitude,
            //     e.coords.latitude,
            // ];

            const query = await fetch(
                `https://api.mapbox.com/directions/v5/mapbox/driving/${userLocation[0]},${userLocation[1]};${destination[0]},${destination[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`
            );
            const data = await query.json();

            if (!data.routes || !data.routes.length) return;
            const route = data.routes[0].geometry;

            if (map.getSource('route')) {
                (map.getSource('route') as mapboxgl.GeoJSONSource).setData({
                    type: 'Feature',
                    properties: {},
                    geometry: route,
                });
            } else {
                map.addSource('route', {
                    type: 'geojson',
                    data: {
                        type: 'Feature',
                        properties: {},
                        geometry: route,
                    },
                });

                map.addLayer({
                    id: 'route',
                    type: 'line',
                    source: 'route',
                    layout: {
                        'line-join': 'round',
                        'line-cap': 'round',
                    },
                    paint: {
                        'line-color': '#f88a37',
                        'line-width': 5,
                    },
                });
            }

            const bounds = new mapboxgl.LngLatBounds();
            route.coordinates.forEach((coord: [number, number]) =>
                bounds.extend(coord)
            );
            map.fitBounds(bounds, {padding: 50});
        };

        handleGeolocate();
        geolocate.once('geolocate', handleGeolocate);

        return () => {
            geolocate.off('geolocate', handleGeolocate);
        };
    }, [destination, title, userLocation]);

    return (
        <div className="h-[calc(100vh-130px)] flex flex-col">
            <div
                ref={mapContainerRef}
                style={{flex: 1, width: '100%'}}
                id="map-container"
            />
        </div>
    );
};

export default MapView;
