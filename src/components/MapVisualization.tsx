import { useRef } from 'react';
import { GoogleMap, LoadScript, Polygon } from '@react-google-maps/api';
import type { Parcel } from '../lib/supabase';

interface MapVisualizationProps {
  parcel: Parcel;
  apiKey: string;
}

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '8px',
};

const defaultCenter = {
  lat: 41.0082,
  lng: 28.9784,
};

export function MapVisualization({ parcel, apiKey }: MapVisualizationProps) {
  const mapRef = useRef<google.maps.Map | null>(null);

  const polygonPath = parcel.coordinates?.map(coord => ({
    lat: coord[1],
    lng: coord[0],
  })) || [];

  const handleMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;

    if (polygonPath.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      polygonPath.forEach(point => {
        bounds.extend(point);
      });
      map.fitBounds(bounds);
    }
  };

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={defaultCenter}
        zoom={15}
        onLoad={handleMapLoad}
        options={{
          styles: [
            {
              featureType: 'all',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#494949' }],
            },
            {
              featureType: 'all',
              elementType: 'labels.text.stroke',
              stylers: [{ color: '#f5f5f5' }],
            },
          ],
        }}
      >
        {polygonPath.length > 0 && (
          <Polygon
            path={polygonPath}
            options={{
              fillColor: '#3b82f6',
              fillOpacity: 0.2,
              strokeColor: '#3b82f6',
              strokeOpacity: 0.9,
              strokeWeight: 2,
              editable: false,
              draggable: false,
            }}
          />
        )}
      </GoogleMap>
    </LoadScript>
  );
}
