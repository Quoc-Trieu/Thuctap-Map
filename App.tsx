import React, {useEffect} from 'react';
import {LogBox, SafeAreaView, StyleSheet, View} from 'react-native';
import Map from '@screens/Map';
import MapboxGL from '@rnmapbox/maps';
import BottomSheet from '@components/BottomSheet';
import {NativeBaseProvider} from 'native-base';

MapboxGL.setAccessToken(
  'pk.eyJ1IjoiZGVzcGxheXNoaWRvIiwiYSI6ImNsdmczM2MxZTBzOXAybnQ3bWJhY2ZtM3oifQ.yyLX1kqEpIbD0KK0RCCHKQ',
);

export default function App(): React.JSX.Element {
  // Ignore not compatible warning
  useEffect(() => {
    LogBox.ignoreLogs([
      'In React 18, SSRProvider is not necessary and is a noop. You can remove it from your app.',
    ]);
  }, []);

  return (
    <NativeBaseProvider>
      <SafeAreaView style={styles.container}>
        <Map />
        {/* <BottomSheet /> */}
      </SafeAreaView>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
});
