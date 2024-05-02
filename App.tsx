import React, {useEffect} from 'react';
import {LogBox, SafeAreaView, StyleSheet} from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import stackNavigation from './src/navigations/stackNavigation';
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
        {stackNavigation()}
      </SafeAreaView>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    flex: 1,
  },
  mapContainer: {
    height: '100%',
  },
});
