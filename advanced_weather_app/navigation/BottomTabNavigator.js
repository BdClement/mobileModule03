import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import HomeScreen from '../screens/HomeScreen';
import Today from '../screens/Today';
import Weekly from '../screens/Weekly';

import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { useResponsiveContext } from "../context/ResponsiveContext";

const Tab = createMaterialTopTabNavigator();

export default function TabNavigator() {
  const { height, width, moderateScale, verticalScale, horizontalScale } = useResponsiveContext();

  return (
    <Tab.Navigator
      initialRouteName='Currently'
      tabBarPosition="bottom"
      screenOptions={{
        swipeEnabled: true, 
        tabBarShowLabel: true,
        tabBarStyle: { backgroundColor: "rgba(0, 0, 0, 0.5)", height: width > height ? verticalScale(120) : verticalScale(80)},
        tabBarLabelStyle: { fontSize: width > height ? moderateScale(6) : moderateScale(10) },
        tabBarItemStyle: { justifyContent: 'center', alignItems: 'center' },
        tabBarIndicatorStyle: { display: 'None' },
        tabBarActiveTintColor: '#fc8618ff',
        tabBarInactiveTintColor: '#aaa',
        // contentStyle: { backgroundColor: 'transparent' }
      }}
    >
      <Tab.Screen
        name="Currently"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <AntDesign name="aim" size={width > height ? moderateScale(8) : moderateScale(18)} color={focused ? '#fc8618ff' : '#aaa'} />
          ),
        }}
      />
      <Tab.Screen
        name="Today"
        component={Today}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <MaterialIcons name="today" size={width > height ? moderateScale(8) : moderateScale(18)} color={focused ? '#fc8618ff' : '#aaa'} />
          ),
        }}
      />
      <Tab.Screen
        name="Weekly"
        component={Weekly}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <MaterialCommunityIcons name="calendar-week" size={width > height ? moderateScale(8) : moderateScale(18)} color={focused ? '#fc8618ff' : '#aaa'} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}


// changement pour une TopBar place au bottom pour gerer le swipe
