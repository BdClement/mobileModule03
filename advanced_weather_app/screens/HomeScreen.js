import { useEffect, useState} from 'react';
import { Text, View } from 'react-native';
import Layout from '../components/Layout';
import { useResponsiveContext } from "../context/ResponsiveContext";
import { useTopBar } from '../context/TopBarContext';
import { useLocation } from '../context/LocationContext';
import { getWeather , getWeatherDescription, getWeatherIcon} from '../utils/weatherApi';

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

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
        <View style={{flex: 1, justifyContent: 'space-evenly', alignItems: 'center'}}>
          {/* <Text style={{ fontSize: isLandscape ? moderateScale(15) : moderateScale(20)}}>Currently</Text> */}
          {selectedLocation && 
          <View style={{alignItems: 'center'}}>
            <Text style={{ fontSize: isLandscape ? moderateScale(25) : moderateScale(30), color:'#15d9f3ff'}}>{selectedLocation.name}</Text>
            <Text style={{ fontSize: isLandscape ? moderateScale(10) : moderateScale(14)}}>{selectedLocation.admin1}, {selectedLocation.country}</Text>
          </View>
          }
          {weatherData && 
            <>
              <Text style={{ color: '#fc8618ff', fontSize: isLandscape ? moderateScale(25) : moderateScale(30)}}>{weatherData.current_weather.temperature}°C</Text>
              <View style={{alignItems: 'center'}}>
                {getWeatherIcon(weatherData.current_weather.weathercode, isLandscape ? moderateScale(25) : moderateScale(30), '#15d9f3ff')}
                <Text style={{ fontSize: isLandscape ? moderateScale(6) : moderateScale(10), padding: moderateScale(8)}}>{getWeatherDescription(weatherData.current_weather.weathercode)}</Text>
              </View>
              <Text style={{ fontSize: isLandscape ? moderateScale(6) : moderateScale(10)}}>
                <MaterialCommunityIcons name="weather-windy" size={moderateScale(10)} color='#17e4ffff' />
                  {weatherData.current_weather.windspeed}km/h
              </Text>
            </>
          }
        </View>
      )  
    }
    </Layout>
  );
}
