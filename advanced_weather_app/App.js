import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, ImageBackground } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import BottomTabNavigator from './navigation/BottomTabNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import  TopBar from './components/TopBar';
import { TopBarProvider } from './context/TopBarContext';
import { LocationProvider } from './context/LocationContext';
import Location from './components/Location';
import { ResponsiveProvider } from './context/ResponsiveContext';
import { Image } from 'expo-image'

export default function App() {

  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: 'transparent'
    },    
  }

  return (
    <ResponsiveProvider>
      <TopBarProvider>
        <SafeAreaProvider>
          <LocationProvider>
            <SafeAreaView style={ styles.container }>
              <Image
                source={require('./assets/ciel-nuit.jpg')}
                contentFit='cover'
                style={StyleSheet.absoluteFill}// Flex: 1
              />
              {/* <ImageBackground source={require('./assets/ciel.jpg')} resizeMode="cover" style={{height: '100%', width: '100%'}}> */}
                  <Location/>
                  <TopBar/>
                  <NavigationContainer 
                    theme={MyTheme}
                  >
                    <BottomTabNavigator/>
                  </NavigationContainer>
              {/* </ImageBackground> */}
            </SafeAreaView>
          </LocationProvider>
        </SafeAreaProvider>
      </TopBarProvider>
    </ResponsiveProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000ff',
    // backgroundColor: 'transparent',
  },
});

// Gerer le background color sur mobile (safeArea)
// Pb reseau Wifi pour image
// Pb avec Region en geolocalisation !
// Checker la taille de police sur mobile ?