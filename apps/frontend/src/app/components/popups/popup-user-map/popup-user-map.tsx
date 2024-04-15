import 'leaflet/dist/leaflet.css';
import './popup-user-map.css';

import { layerGroup, Marker } from 'leaflet';
import { useEffect, useRef, useState } from 'react';
import Popup from 'reactjs-popup';
import { PopupActions } from 'reactjs-popup/dist/types';

import { LOCATIONS, MAP_ZOOM } from '@2299899-fit-friends/consts';
import { selectUser, useAppSelector, useMap } from '@2299899-fit-friends/frontend-core';
import { Location } from '@2299899-fit-friends/types';

type PopupUserMapProps = {
  trigger: JSX.Element,
};

export default function PopupUserMap(props: PopupUserMapProps): JSX.Element {
  const { trigger } = props;
  const user = useAppSelector(selectUser);
  const popupRef = useRef<PopupActions | null>(null);
  const [mapRef, setMapRef] = useState<HTMLDivElement | null>(null);
  const [location, setLocation] = useState<Location>(LOCATIONS[0]);
  const map = useMap(mapRef, location, MAP_ZOOM);

  useEffect(() => {
    if (user) {
      const location = LOCATIONS.find((location) => location.name === user.location);
      if (location) {
        setLocation(location);
      }
    }
  }, [user]);

  useEffect(() => {
    if (map) {
      map.setView({ lat: location?.latitude, lng: location.longitude }, MAP_ZOOM);
      const markerLayer = layerGroup().addTo(map);
      const marker = new Marker({ lat: location.latitude, lng: location.longitude });
      marker.addTo(markerLayer);
      return () => {
        map.removeLayer(markerLayer);
      };
    }
  }, [map, location]);

  const handleCloseButtonClick = () => {
    if (popupRef.current) {
      popupRef.current.close();
    }
  }

  return (
    <Popup
      ref={popupRef}
      modal
      trigger={trigger}
      lockScroll={true}
    >
      <div className="">
        <div className="popup-head popup-head--address">
          <h2 className='popup-head__header'>{user?.name}</h2>
          <p className='popup-head__address'>
            <svg className='popup-head__icon-location' width={12} height={14} aria-hidden={true}>
              <use xlinkHref='#icon-location'></use>
            </svg>
            <span>м. {user?.location}</span>
          </p>
          <button
            className="btn-icon btn-icon--outlined btn-icon--big"
            type="button"
            aria-label="close"
            onClick={handleCloseButtonClick}
          >
            <svg width={20} height={20} aria-hidden="true">
              <use xlinkHref="#icon-cross" />
            </svg>
          </button>
        </div>
        <div className="popup__content-map">
          <div className="popup__map">
            <div ref={(ref) => setMapRef(ref)} data-testid="map" style={{ width: '1160px', height: '623px' }}></div>
          </div>
        </div>
      </div>
    </Popup>
  );
}
