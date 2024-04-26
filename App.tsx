import React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import Map from '@components/Map';
import MapboxGL from '@rnmapbox/maps';

MapboxGL.setAccessToken(
  'pk.eyJ1IjoiZGVzcGxheXNoaWRvIiwiYSI6ImNsdmczM2MxZTBzOXAybnQ3bWJhY2ZtM3oifQ.yyLX1kqEpIbD0KK0RCCHKQ',
);

export default function App(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Map />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
});
