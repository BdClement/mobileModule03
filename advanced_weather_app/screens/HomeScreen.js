import { useEffect, useState} from 'react';
import { Text } from 'react-native';
import Layout from '../components/Layout';
import { useResponsiveContext } from "../context/ResponsiveContext";
import { useTopBar } from '../context/TopBarContext';
import { useLocation } from '../context/LocationContext';
import { getWeather , getWeatherDescription} from '../utils/weatherApi';

export default function HomeScreen() {
  const { height, width, moderateScale } = useResponsiveContext();
    const { errorMsg, selectedLocation } = useLocation();
    const [weatherData, setWeatherData] = useState(null);
    const [apiError, setApiError] = useState(null);

    
    useEffect(() => {
      if (!selectedLocation) return;
      
      (async () => {
        const data = await getWeather({
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
          type: "current",
        });
        if (!data) setApiError("The service connection is lost. Please check your Internet connection or try again later.");
        else {
          setApiError(null);
          setWeatherData(data);
          console.log("weatherData == ", JSON.stringify(data, null, 2));
        }
      })();
    }, [selectedLocation])
    
    const isLandscape = width > height

  return (
    <Layout>
      {errorMsg && !selectedLocation ? (
        <Text style={{ fontSize: isLandscape ? moderateScale(15) : moderateScale(20), color: 'red'}}>{errorMsg}</Text>
      ) : apiError ? (
        <Text style={{ fontSize: isLandscape ? moderateScale(15) : moderateScale(20), color: 'red'}}>{apiError}</Text>
      ) : (
        <>
        <Text style={{ fontSize: isLandscape ? moderateScale(15) : moderateScale(20)}}>Currently</Text>
        {selectedLocation && <Text style={{ fontSize: isLandscape ? moderateScale(10) : moderateScale(14)}}>{selectedLocation.name}, {selectedLocation.admin1}, {selectedLocation.country}</Text>}
        {weatherData && 
          <>
            <Text style={{ fontSize: isLandscape ? moderateScale(6) : moderateScale(10)}}>{weatherData.current_weather.temperature}°C</Text>
            <Text style={{ fontSize: isLandscape ? moderateScale(6) : moderateScale(10)}}>{weatherData.current_weather.windspeed}km/h</Text>
            <Text style={{ fontSize: isLandscape ? moderateScale(6) : moderateScale(10)}}>{getWeatherDescription(weatherData.current_weather.weathercode)}</Text>
          </>}
        </>
      )  
    }
    </Layout>
  );
}
