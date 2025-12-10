import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, View } from 'react-native';
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
              <View style={{flex:1}}>
                <Image
                  source={require('./assets/ciel-nuit.jpg')}
                  contentFit='cover'
                  style={StyleSheet.absoluteFillObject}
                />
                <Location/>
                <TopBar/>
                <NavigationContainer 
                  theme={MyTheme}
                >
                  <BottomTabNavigator/>
                </NavigationContainer>
              </View>
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

// Cleaner les screens (notamment styles)