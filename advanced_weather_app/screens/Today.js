import { useEffect, useState} from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useResponsiveContext } from "../context/ResponsiveContext";
import Layout from '../components/Layout';
import { useLocation } from '../context/LocationContext';
import { getWeather , getWeatherIcon} from '../utils/weatherApi';
import { LineChart } from 'react-native-chart-kit';

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
    let temperatureData = {}
    if (weatherData) {
      const labelsHours = weatherData.hourly.time.map(timestamp => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString("sv-SE", {hour: "2-digit", minute: "2-digit"})
      })
      temperatureData = {
        labels: labelsHours,
        datasets: [
          {
            data: weatherData.hourly.temperature_2m,
            strokeWidth: 1, //Epaisseur de la ligne
            // color: '#fc8618ff'
            color: () => 'black', 
          },
        ],
        // legend: ["Today temperatures"],
      }
    }


  return (
    <Layout>
      {errorMsg && !selectedLocation ? (
        <Text style={{ fontSize: isLandscape ? moderateScale(15) : moderateScale(20), color: 'red'}}>{errorMsg}</Text>
      ) : apiError ? (
        <Text style={{ fontSize: isLandscape ? moderateScale(15) : moderateScale(20), color: 'red'}}>{apiError}</Text>
      ) : (
        <View style={{flex: 1, alignItems: 'center'}}>          
            {/* <Text style={{ fontSize: isLandscape ? moderateScale(15) : moderateScale(20)}}>Today</Text> */}
            {selectedLocation && 
            <View style={{alignItems: 'center', padding: moderateScale(8)}}>
              <Text style={{ fontSize: isLandscape ? moderateScale(20) : moderateScale(40), color:'#15d9f3ff'}}>{selectedLocation.name}</Text>
              <Text style={{ fontSize: isLandscape ? moderateScale(10) : moderateScale(25), color: '#fceee2ff'}}>{selectedLocation.admin1}, {selectedLocation.country}</Text>
            </View>
            }
            {weatherData && 
              <View style={{padding: moderateScale(8), flex: 1, justifyContent: 'center'}}>
                <Text style={{
                  textAlign: 'center',
                  fontSize: moderateScale(12),
                  color: '#fceee2ff',
                  backgroundColor: 'rgba(23, 228, 255, 0.5)',
                  padding: moderateScale(8),
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                  }}>Today temperatures</Text>
                <LineChart
                  data={temperatureData}
                  width= {width * 0.95}
                  height={height / 3}
                  yAxisSuffix='°C'
                  xLabelsOffset={moderateScale(8)}
                  yLabelsOffset={moderateScale(8)}
                  formatXLabel={(value, index) => {
                    const hour = parseInt(value.split(':')[0], 10);
                    if (hour % 4 === 0) {
                      return value;
                    }
                    return '';
                  }}
                  chartConfig={{
                    // Pb d'opacite sur mobile 
                    backgroundColor: 'rgba(23, 228, 255, 0.5)',
                    backgroundGradientFrom: 'rgba(23, 228, 255, 0.4)',
                    backgroundGradientTo: 'rgba(23, 228, 255, 0.7)',
                    decimalPlaces: 1,
                    color: () => 'white',
                    propsForDots: {
                      r: "4",
                      strokeWidth: "4",
                      // stroke: "#ff0000ff",
                      fill: '#fc8618ff',
                    },
                    propsForLabels: {
                      fontSize: moderateScale(10),
                      padding: moderateScale(2)
                    },
                  }}
                />
              </View>
            }
            
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={true}
              style={{backgroundColor: 'rgba(23, 228, 255, 0.5)'}}
            >
              {weatherData && 
                  weatherData.hourly.time.map((t, i) => {
                    const time = new Date(t).toLocaleTimeString("sv-SE", {
                      hour: "2-digit",
                      minute: "2-digit"
                    });
                    const temp = weatherData.hourly.temperature_2m[i];
                    const weather = getWeatherIcon(weatherData.hourly.weathercode[i], isLandscape ? moderateScale(6) : moderateScale(10), '#15d9f3ff');
                    const windIcon = <MaterialCommunityIcons name="weather-windy" size={isLandscape ? moderateScale(6) : moderateScale(10)} color='#fceee2ff' />
                    const windspeed = weatherData.hourly.windspeed_10m[i];
                    return (
                      <View key={i} style={{marginLeft: moderateScale(4), marginRight: moderateScale(4), alignItems: 'center', justifyContent: 'center'}}>
                        <View style={{alignItems: 'center', gap: moderateScale(2)}}>
                          <Text style={{ color: '#fceee2ff'}}>{time}</Text>
                          <Text>{weather}</Text>
                          <Text style={{ color: '#fc8618ff', }}>{temp}°C</Text>
                          <Text style={{ color: '#fceee2ff', }}>{windIcon} {windspeed}km/h</Text>
                        </View>                        
                      </View>
                    )
                  })
              }
            </ScrollView>
        </View>
      )  
    }
    </Layout>
  );
}

// gerer le landscape


