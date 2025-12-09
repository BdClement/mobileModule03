import { useEffect, useState} from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useResponsiveContext } from "../context/ResponsiveContext";
import Layout from '../components/Layout';
import { useTopBar } from '../context/TopBarContext';
import { useLocation } from '../context/LocationContext';
import { getWeather , getWeatherIcon} from '../utils/weatherApi';

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

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
        <View style={{flex: 1, justifyContent: 'space-evenly', alignItems: 'center'}}>          
            {/* <Text style={{ fontSize: isLandscape ? moderateScale(15) : moderateScale(20)}}>Today</Text> */}
            {selectedLocation && 
            <View style={{alignItems: 'center'}}>
              <Text style={{ fontSize: isLandscape ? moderateScale(25) : moderateScale(30), color:'#15d9f3ff'}}>{selectedLocation.name}</Text>
              <Text style={{ fontSize: isLandscape ? moderateScale(10) : moderateScale(14)}}>{selectedLocation.admin1}, {selectedLocation.country}</Text>
            </View>
            }
            <Text style={{flex: 1}}>Graphique</Text>
            {/* <Text>Liste</Text> */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{}}
            >
              {weatherData && 
                  weatherData.hourly.time.map((t, i) => {
                    const time = new Date(t).toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit"
                    });
                    const temp = weatherData.hourly.temperature_2m[i];
                    const weather = getWeatherIcon(weatherData.hourly.weathercode[i], isLandscape ? moderateScale(6) : moderateScale(10), '#15d9f3ff');
                    const windIcon = <MaterialCommunityIcons name="weather-windy" size={isLandscape ? moderateScale(6) : moderateScale(10)} color='black' />
                    const windspeed = weatherData.hourly.windspeed_10m[i];
                    // return (<Text key={i} style={{ fontSize: isLandscape ? moderateScale(6) : moderateScale(10)}}>{time} {temp}°C {weather} {windIcon} {windspeed}km/h</Text>)
                    return (
                      <View key={i} style={{marginRight: moderateScale(15), alignItems: 'center'}}>
                        <View>
                          <Text>{time}</Text>
                          <Text>{weather}</Text>
                          <Text style={{ color: '#fc8618ff'}}>{temp}°C</Text>
                          <Text>{windIcon} {windspeed}km/h</Text>
                        </View>                        
                      </View>
                    )
                  })
              }
            </ScrollView>
            {/* {weatherData && 
                weatherData.hourly.time.map((t, i) => {
                  const time = new Date(t).toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit"
                  });
                  const temp = weatherData.hourly.temperature_2m[i];
                  const weather = getWeatherIcon(weatherData.hourly.weathercode[i], isLandscape ? moderateScale(6) : moderateScale(10), '#15d9f3ff');
                  const windIcon = <MaterialCommunityIcons name="weather-windy" size={isLandscape ? moderateScale(6) : moderateScale(10)} color='#17e4ffff' />
                  const windspeed = weatherData.hourly.windspeed_10m[i];
                  return (<Text key={i} style={{ fontSize: isLandscape ? moderateScale(6) : moderateScale(10)}}>{time} {temp}°C {weather} {windIcon} {windspeed}km/h</Text>)
                })
            } */}
        </View>
      )  
    }
    </Layout>
  );
}
