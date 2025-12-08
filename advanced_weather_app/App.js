import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import BottomTabNavigator from './navigation/BottomTabNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import  TopBar from './components/TopBar';
import { TopBarProvider } from './context/TopBarContext';
import { LocationProvider } from './context/LocationContext';
import Location from './components/Location';
import { ResponsiveProvider } from './context/ResponsiveContext';

export default function App() {
  return (
    <ResponsiveProvider>
      <TopBarProvider>
        <SafeAreaProvider>
          <LocationProvider>
            <SafeAreaView style={ styles.container }>
              <Location/>
              <TopBar/>
              <NavigationContainer>
                <BottomTabNavigator/>
              </NavigationContainer>
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
  },
});