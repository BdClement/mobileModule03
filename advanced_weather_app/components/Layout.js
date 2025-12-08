import { ScrollView, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useResponsiveContext } from "../context/ResponsiveContext";

export default function Layout({ children }) {

  const { height, width, moderateScale, verticalScale, horizontalScale } = useResponsiveContext();

    const styles = StyleSheet.create({
     container: {
        padding: moderateScale(10),
        maxHeight: width > height ? verticalScale(650) : verticalScale(570)
      },
    });

  return (
    // <SafeAreaView style={{ flex: 1, backgroundColor: '#d6f0f7ff' }}>
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" />
        <ScrollView style={styles.container}   contentContainerStyle={{flexGrow: 1, alignItems: 'center', justifyContent: 'center'}}>
            {children}
        </ScrollView>
    </SafeAreaView>
  );
}
