import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Phone, Clock, AlertTriangle, Loader2, ExternalLink } from 'lucide-react';
import { getTranslation } from '../utils/translations';

interface Hospital {
  id: string;
  name: string;
  address: string;
  phone?: string;
  emergency?: boolean;
  distance: number;
  lat: number;
  lon: number;
}

interface HospitalFinderProps {
  language: string;
}

const HospitalFinder: React.FC<HospitalFinderProps> = ({ language }) => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [locationPermission, setLocationPermission] = useState<'pending' | 'granted' | 'denied'>('pending');

  useEffect(() => {
    requestLocation();
  }, []);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      setLocationPermission('denied');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lon: position.coords.longitude
        };
        setUserLocation(location);
        setLocationPermission('granted');
        fetchNearbyHospitals(location);
      },
      (error) => {
        console.error('Location error:', error);
        setError('Unable to access your location. Please enable location services.');
        setLocationPermission('denied');
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  const fetchNearbyHospitals = async (location: { lat: number; lon: number }) => {
    try {
      setLoading(true);
      setError(null);

      // Overpass API query for hospitals within 10km radius
      const query = `
        [out:json][timeout:25];
        (
          node["amenity"="hospital"](around:10000,${location.lat},${location.lon});
          way["amenity"="hospital"](around:10000,${location.lat},${location.lon});
          relation["amenity"="hospital"](around:10000,${location.lat},${location.lon});
        );
        out center meta;
      `;

      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `data=${encodeURIComponent(query)}`
      });

      if (!response.ok) {
        throw new Error('Failed to fetch hospital data');
      }

      const data = await response.json();
      const hospitalData: Hospital[] = [];

      data.elements.forEach((element: any) => {
        const lat = element.lat || element.center?.lat;
        const lon = element.lon || element.center?.lon;
        
        if (lat && lon && element.tags?.name) {
          const distance = calculateDistance(location.lat, location.lon, lat, lon);
          
          hospitalData.push({
            id: element.id.toString(),
            name: element.tags.name,
            address: formatAddress(element.tags),
            phone: element.tags.phone,
            emergency: element.tags.emergency === 'yes' || element.tags['emergency:phone'],
            distance,
            lat,
            lon
          });
        }
      });

      // Sort by distance and limit to 10 closest hospitals
      const sortedHospitals = hospitalData
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 10);

      setHospitals(sortedHospitals);
    } catch (error) {
      console.error('Error fetching hospitals:', error);
      setError('Failed to load nearby hospitals. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const formatAddress = (tags: any): string => {
    const parts = [];
    if (tags['addr:street']) parts.push(tags['addr:street']);
    if (tags['addr:city']) parts.push(tags['addr:city']);
    if (tags['addr:state']) parts.push(tags['addr:state']);
    if (parts.length === 0 && tags.address) parts.push(tags.address);
    return parts.join(', ') || 'Address not available';
  };

  const openDirections = (hospital: Hospital) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${hospital.lat},${hospital.lon}&travelmode=driving`;
    window.open(url, '_blank');
  };

  const callHospital = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const getEmergencyHospital = (): Hospital | null => {
    return hospitals.find(h => h.emergency) || hospitals[0] || null;
  };

  if (locationPermission === 'denied') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Location Access Required
          </h3>
          <p className="text-gray-600 mb-6">
            To find hospitals near you, please enable location access in your browser.
          </p>
          <button
            onClick={requestLocation}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Enable Location
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {getTranslation('hospitalsNearYou', language)}
        </h2>
        <p className="text-gray-600">
          {getTranslation('findNearbyHospitals', language)}
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <Loader2 className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Finding hospitals near you...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
            <p className="text-red-800">{error}</p>
          </div>
          <button
            onClick={() => userLocation ? fetchNearbyHospitals(userLocation) : requestLocation()}
            className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Emergency Hospital Card */}
      {hospitals.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-lg mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-red-900 mb-1">
                Nearest Emergency Hospital
              </h3>
              <p className="text-red-800 font-medium">
                {getEmergencyHospital()?.name}
              </p>
              <p className="text-red-700 text-sm">
                {getEmergencyHospital()?.distance.toFixed(1)} km away
              </p>
            </div>
            <button
              onClick={() => getEmergencyHospital() && openDirections(getEmergencyHospital()!)}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
            >
              <Navigation className="h-4 w-4" />
              <span>Emergency Directions</span>
            </button>
          </div>
        </div>
      )}

      {/* Hospitals List */}
      {hospitals.length > 0 && (
        <div className="space-y-4">
          {hospitals.map((hospital) => (
            <div key={hospital.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {hospital.name}
                    </h3>
                    {hospital.emergency && (
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                        Emergency
                      </span>
                    )}
                  </div>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="text-sm">{hospital.address}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    <span className="text-sm">{hospital.distance.toFixed(1)} km away</span>
                  </div>
                </div>
                <div className="flex flex-col space-y-2 ml-4">
                  <button
                    onClick={() => openDirections(hospital)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 text-sm"
                  >
                    <Navigation className="h-4 w-4" />
                    <span>Directions</span>
                    <ExternalLink className="h-3 w-3" />
                  </button>
                  {hospital.phone && (
                    <button
                      onClick={() => callHospital(hospital.phone!)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 text-sm"
                    >
                      <Phone className="h-4 w-4" />
                      <span>Call</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Results */}
      {!loading && !error && hospitals.length === 0 && userLocation && (
        <div className="text-center py-12">
          <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Hospitals Found
          </h3>
          <p className="text-gray-600 mb-6">
            No hospitals found within 10km of your location.
          </p>
          <button
            onClick={() => userLocation && fetchNearbyHospitals(userLocation)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Search Again
          </button>
        </div>
      )}
    </div>
  );
};

export default HospitalFinder;