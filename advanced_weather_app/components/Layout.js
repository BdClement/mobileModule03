import { ScrollView, StatusBar, StyleSheet, View } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';

import { useResponsiveContext } from "../context/ResponsiveContext";

export default function Layout({ children }) {

  const { height, width, moderateScale, verticalScale, horizontalScale } = useResponsiveContext();

  // Deplacer la logique de style ici pour plus de clarete
  // const isLandscape = width > height
  const styles = StyleSheet.create({
   container: {
      flex: 1,
      // backgroundColor: 'red',
      // padding: 0,
      // margin: 0,
      // padding: moderateScale(10),
      // maxHeight: width > height ? verticalScale(650) : verticalScale(570)
    },
    children: {
      flexGrow: 1,
      alignItems: 'center',
      justifyContent: 'center',
    }
  });

  return (
    // <SafeAreaView style={{ flex: 1, backgroundColor: '#d6f0f7ff' }}>
    <View style={{ flex: 1}}>
      {/* <StatusBar barStyle="light-content"/> */}
        <ScrollView style={styles.container}   contentContainerStyle={styles.children}>
            {children}
        </ScrollView>
    </View>
  );
}
