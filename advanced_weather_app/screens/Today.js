import { useEffect, useState} from 'react';
import { Text } from 'react-native';
import { useResponsiveContext } from "../context/ResponsiveContext";
import Layout from '../components/Layout';
import { useTopBar } from '../context/TopBarContext';
import { useLocation } from '../context/LocationContext';
import { getWeather , getWeatherDescription} from '../utils/weatherApi';

export default function Today() {
  const { height, width, moderateScale } = useResponsiveContext();
    const { errorMsg , selectedLocation} = useLocation();
    const [weatherData, setWeatherData] = useState(null);
    const [apiError, setApiError] = useState(null);


    useEffect(() => {
      if (!selectedLocation) return;

      (async () => {
        const data = await getWeather({
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
          type: "today",        
        });
        if (!data) setApiError("The service connection is lost. Please check your Internet connection or try again later.");
        else {
          setApiError(null);
          setWeatherData(data);
          console.log("weatherData == ", JSON.stringify(data, null, 2));
        }
      })();
    }, [selectedLocation]);

    const isLandscape = width > height

  return (
    <Layout>
      {errorMsg && !selectedLocation ? (
        <Text style={{ fontSize: isLandscape ? moderateScale(15) : moderateScale(20), color: 'red'}}>{errorMsg}</Text>
      ) : apiError ? (
        <Text style={{ fontSize: isLandscape ? moderateScale(15) : moderateScale(20), color: 'red'}}>{apiError}</Text>
      ) : (
        <>
        <Text style={{ fontSize: isLandscape ? moderateScale(15) : moderateScale(20)}}>Today</Text>
        {selectedLocation && <Text style={{ fontSize: isLandscape ? moderateScale(10) : moderateScale(14)}}>{selectedLocation.name}, {selectedLocation.admin1}, {selectedLocation.country}</Text>}
        {weatherData && 
            weatherData.hourly.time.map((t, i) => {
              const time = new Date(t).toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit"
              });
              const temp = weatherData.hourly.temperature_2m[i];
              const weather = getWeatherDescription(weatherData.hourly.weathercode[i]);
              const windspeed = weatherData.hourly.windspeed_10m[i];
              return (<Text key={i} style={{ fontSize: isLandscape ? moderateScale(6) : moderateScale(10)}}>{time} {temp}°C {weather} {windspeed}km/h</Text>)
            })
        }
        </>
      )  
    }
    </Layout>
  );
}
