import { Map } from 'leaflet';
import { useRef } from 'react';

import { LOCATIONS, MAP_ZOOM } from '@2299899-fit-friends/consts';
import { renderHook } from '@testing-library/react';

import { useMap } from './use-map';

describe('Hook useMap', () => {
  test('should return leaflet Map class', () => {
    const mapRef = renderHook(() => useRef<HTMLDivElement | null>(document.createElement('div')));

    const map = renderHook(() => useMap(mapRef.result.current.current, LOCATIONS[0], MAP_ZOOM));

    expect(map.result.current).toBeInstanceOf(Map);
  });

  test('should return null if ref null', () => {
    const mapRef = renderHook(() => useRef<HTMLDivElement | null>(null));

    const map = renderHook(() => useMap(mapRef.result.current.current, LOCATIONS[0], MAP_ZOOM));

    expect(map.result.current).toBeNull();
  });
});
