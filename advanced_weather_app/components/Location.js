import { useEffect } from 'react';
import * as LocationExpo from "expo-location";
import { useTopBar } from '../context/TopBarContext';
import { useLocation } from "../context/LocationContext";
import { extractCity } from '../utils/weatherApi';

export const getUserLocation = async ({ setLocation, setErrorMsg, setGeoClicked, setLastUsed }) => {
  const { status } = await LocationExpo.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    setErrorMsg("Geolocation is not available. Please, enable it in your App settings.");
    return;
  }

  const userLocation = await LocationExpo.getCurrentPositionAsync({});
  setLocation(userLocation);
  setGeoClicked(true);
  setLastUsed('geo');
  console.log("Location updated:", userLocation);
  return userLocation;
};

export default function Location() {
  const { location, setLocation, setErrorMsg, selectedLocation, setSelectedLocation } = useLocation();
  const { setGeoClicked, setLastUsed } = useTopBar();

  // Probleme test web car l'API n'accepte pas le CORS 
  const searchCityByCoords = async (lat, lon) => {
    try {
      console.log('lat = ', lat);
      console.log('lon = ', lon);
      const result = await fetch(
        // `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&language=en`
        // `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=fr`
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=fr`
      );
      if (!result.ok) {
        throw new Error(`Erreur API: ${result.status} ${result.statusText}`);
      }
      console.log("HTTP status:", result.status);
      const data = await result.json();
      console.log("API response:", data);
      const city = extractCity(data.address);
      if (!city) {
        throw new Error("Aucune ville trouvée pour ces coordonnées ");
      }
      const newLocation = {
        // name: data.locality,
        name: city,
        // admin1: data.principalSubdivision, // Region
        admin1: data.address.state,
        // country: data.countryName,
        country: data.address.country,
        // countryCode: data.countryCode,
        countryCode: data.address.country_code,
        latitude: lat,
        longitude: lon,
      }
      setSelectedLocation(newLocation);
      return newLocation;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  useEffect(() => {
    getUserLocation({ setLocation, setErrorMsg, setGeoClicked, setLastUsed });
  }, []);
  
  useEffect(() => {
    const fetchLocation = async () => {
      if (location) {
        console.log("Appel a searchCityByCoords avec ", location.coords);
        const city = await searchCityByCoords(location.coords.latitude, location.coords.longitude);
        if (!city){
          console.log("Le retour de searchCitiesByCoords est null");
          setErrorMsg("Could not find any results for the supplied coordinates");
        } else {
          console.log("searchCityByCoords a trouve une city");
          setErrorMsg(null);
          // setSelectedLocation(suggestions[0]);
        }
      }
    };
    fetchLocation();
  }, [location]);

  
  return null;
}