import { useEffect, useState} from 'react';
import { Text, View, ScrollView } from 'react-native';
import Layout from '../components/Layout';
import { useResponsiveContext } from "../context/ResponsiveContext";
import { useLocation } from '../context/LocationContext';
import { getWeather , getWeatherIcon} from '../utils/weatherApi';
import { LineChart } from 'react-native-chart-kit';

export default function Weekly() {
  const { height, width, moderateScale } = useResponsiveContext();
  const { errorMsg, setErrorMsg, selectedLocation } = useLocation();
  const [weatherData, setWeatherData] = useState(null);
  const [apiError, setApiError] = useState(null);
  const isLandscape = width > height

  useEffect(() => {
    if (!selectedLocation) return;

    (async () => {
      const data = await getWeather({
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        type: "weekly",        
      });
      if (!data) setApiError("The service connection is lost. Please check your Internet connection or try again later.");
      else {
        setApiError(null);
        setWeatherData(data);
        console.log("weatherData == ", JSON.stringify(data, null, 2));
      }
    })();   
  }, [selectedLocation]);

  let temperatureData = {}
  if (weatherData) {
    const labelsDays = weatherData.daily.time.map(timestamp => {
      const date = new Date(timestamp);
      return date.toLocaleDateString("sv-SE", {day: "2-digit", month: "2-digit"})
    })
    temperatureData = {
      labels: labelsDays,
      datasets: [
        {
          data: weatherData.daily.temperature_2m_min,
          strokeWidth: 1, //Epaisseur de la ligne
          color: () => '#09b9ffff', 
        },
        {
          data: weatherData.daily.temperature_2m_max,
          strokeWidth: 1, //Epaisseur de la ligne
          color: () => '#fc8618ff',
        },
      ],
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
                  borderTopLeftRadius: moderateScale(16),
                  borderTopRightRadius: moderateScale(16),
                  }}>Weekly temperatures</Text>
                <LineChart
                  data={temperatureData}
                  width= {isLandscape ? width * 0.85 : width * 0.95}
                  height={isLandscape ? height * 0.5 : height * 0.3}
                  yAxisSuffix='°C'
                  xLabelsOffset={isLandscape? moderateScale(2) : moderateScale(8)}
                  yLabelsOffset={isLandscape? moderateScale(2) : moderateScale(8)}
                  // formatXLabel={(value, index) => {
                  //   const hour = parseInt(value.split(':')[0], 10);
                  //   if (hour % 4 === 0) {
                  //     return value;
                  //   }
                  //   return '';
                  // }}
                  chartConfig={{
                    // Pb d'opacite sur mobile 
                    backgroundColor: 'rgba(23, 228, 255, 0.5)',
                    backgroundGradientFrom: 'rgba(23, 228, 255, 0.4)',
                    backgroundGradientTo: 'rgba(23, 228, 255, 0.7)',
                    decimalPlaces: 1,
                    color: () => 'white',
                    propsForDots: {
                      r: isLandscape ? "4" : "2",
                      strokeWidth: isLandscape ? "2" : "1",
                    },
                    propsForLabels: {
                      fontSize: isLandscape ? moderateScale(5) : moderateScale(10),
                      padding: isLandscape ? moderateScale(1) : moderateScale(2)
                    },
                  }}
                />
              </View>
            }
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={true}
            style={{backgroundColor: 'rgba(23, 228, 255, 0.5)', width: width}}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'center',
              alignItems: 'center', 
            }}
          >
            {weatherData && 
                weatherData.daily.time.map((d, i) => {
                  const day = new Date(d).toLocaleDateString("sv-SE", {
                    day: "2-digit",
                    month: "2-digit"
                  });
                  const temp_min = weatherData.daily.temperature_2m_min[i];
                  const temp_max = weatherData.daily.temperature_2m_max[i];
                  const weather = getWeatherIcon(weatherData.daily.weathercode[i], isLandscape ? moderateScale(14) : moderateScale(20), '#fceee2ff');
                  return (
                    <View key={i} style={{padding: isLandscape? moderateScale(4) : moderateScale(2), marginLeft: isLandscape? moderateScale(12) : moderateScale(8), marginRight: isLandscape? moderateScale(12) : moderateScale(8), alignItems: 'center', justifyContent: 'center'}}>
                      <View style={{alignItems: 'center', gap: isLandscape ? moderateScale(4) : moderateScale(8)}}>
                        <Text style={{ color: '#fceee2ff'}}>{day}</Text>
                        <Text>{weather}</Text>
                        <Text style={{ color: '#fc8618ff', }}>{temp_max}°C max</Text>
                        <Text style={{ color: '#15d9f3ff', }}>{temp_min}°C min</Text>
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
