// components/DriverMap.tsx
import { GoogleMap, Marker, DirectionsRenderer, useJsApiLoader } from '@react-google-maps/api';
import { useEffect, useState } from 'react';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const DriverMap = ({ pickup, drop }: { pickup: google.maps.LatLngLiteral, drop: google.maps.LatLngLiteral }) => {
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [currentPosition, setCurrentPosition] = useState<google.maps.LatLngLiteral | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!, // set in .env
    libraries: ['places']
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCurrentPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
      },
      (err) => console.error(err)
    );
  }, []);

  useEffect(() => {
    if (pickup && drop) {
      const service = new google.maps.DirectionsService();
      service.route(
        {
          origin: pickup,
          destination: drop,
          travelMode: google.maps.TravelMode.DRIVING
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            setDirections(result);
          }
        }
      );
    }
  }, [pickup, drop]);

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <GoogleMap center={pickup} zoom={14} mapContainerStyle={containerStyle}>
      {currentPosition && <Marker position={currentPosition} label="You" />}
      <Marker position={pickup} label="Pickup" />
      <Marker position={drop} label="Drop" />
      {directions && <DirectionsRenderer directions={directions} />}
    </GoogleMap>
  );
};

export default DriverMap;
