import { Map, TileLayer } from 'leaflet';
import { useEffect, useRef, useState } from 'react';

import { Location } from '@2299899-fit-friends/types';

export function useMap(
  mapRef: HTMLDivElement | null,
  location: Location,
  zoom: number,
): Map | null {
  const [map, setMap] = useState<Map | null>(null);
  const isRenderedRef = useRef<boolean>(false);

  useEffect(() => {
    if (mapRef && !isRenderedRef.current) {
      const instance = new Map(mapRef, {
        center: {
          lat: location.latitude,
          lng: location.longitude,
        },
        zoom,
      });

      const layer = new TileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
        {
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: 'abcd',
        },
      );

      instance.addLayer(layer);

      setMap(instance);
      isRenderedRef.current = true;
    }
    return () => {
      isRenderedRef.current = false;
    };
  }, [mapRef, location, zoom]);

  return map;
}
