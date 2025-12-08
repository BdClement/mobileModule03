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
import { useResponsiveContext } from "./context/ResponsiveContext";

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
            <ImageBackground source={require('./assets/ciel.jpg')} resizeMode="cover" style={{height: '100%', width: '100%'}}>
              <SafeAreaView style={ styles.container }>
                  <Location/>
                  <TopBar/>
                  <NavigationContainer 
                    theme={MyTheme}
                  >
                    <BottomTabNavigator/>
                  </NavigationContainer>
              </SafeAreaView>
            </ImageBackground>
          </LocationProvider>
        </SafeAreaProvider>
      </TopBarProvider>
    </ResponsiveProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#000000ff',
  },
});

// Gerer le background color sur mobile (safeArea)