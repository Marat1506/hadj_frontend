import React, { useRef, useEffect } from 'react';

import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MapModal = () => {
    const mapRef = useRef<any>(null);
    const mapContainerRef = useRef<any>(null);
 
    useEffect(() => {
        mapboxgl.accessToken = 'pk.eyJ1IjoibGF0aXBqcyIsImEiOiJjbGFtenMxeDQwa2wxM291cnQ5amI2MzdnIn0.Q0ZA4_hTGydrIv453cLoqA';
        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/latipjs/cm3komg1d00nd01s7a9a93a3i'
        });

        return () => {
            mapRef.current.remove();
        };
    }, []);

    return (
        <div className={'w-[800px] h-[500px] p-4 pt-0 '}>
            <div className={'w-full h-full rounded-[14px]'} id='map-container' ref={mapContainerRef}/>
        </div>
    );
};

export default MapModal;
