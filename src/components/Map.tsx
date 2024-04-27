import {View, StyleSheet, TextInput} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import React, {useState} from 'react';
import Mapbox, {LineJoin} from '@rnmapbox/maps';
import axios from 'axios';
import coverageToGeoJSON from '@utils/coverageToGeoJSON';

const query = {
  api_key: 'efA3y8Un1klQqgeeNgVWBliArEjnY7dk2TGHbGUd',
};

const Map = () => {
  const [coordinates, setCoordinates] = useState([0, 0]);
  const [coordinatesToMove, setCoordinatesToMove] = useState([0, 0]);
  const [move, setMove] = useState(false);
  const [routes, setRoutes] = useState([]);
  const [search, setSearch] = useState('');

  const onMove = async () => {
    // const url = encodeURI(
    //   `https://rsapi.goong.io/Direction?origin=${coordinates[0]},${coordinates[1]}&destination=${coordinatesToMove[1]},${coordinatesToMove[0]}&alternatives=true&api_key=${query.api_key}`,
    // );
    const url = encodeURI(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates[1]},${coordinates[0]};${coordinatesToMove[0]},${coordinatesToMove[1]}?alternatives=true&steps=true&banner_instructions=true&geometries=geojson&overview=full&access_token=pk.eyJ1IjoiZGVzcGxheXNoaWRvIiwiYSI6ImNsdmczM2MxZTBzOXAybnQ3bWJhY2ZtM3oifQ.yyLX1kqEpIbD0KK0RCCHKQ`,
    );
    const response = await axios.get(url);
    const data = response.data;
    // @ts-ignore
    setRoutes(coverageToGeoJSON(data));
  };

  const findLocation = async () => {
    Geolocation.getCurrentPosition(
      position => {
        setCoordinates([
          position.coords.latitude,
          position.coords.longitude,
        ]);
      },
      error => console.log(error),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
    const url = encodeURI(
      `https://rsapi.goong.io/Place/AutoComplete?api_key=${query.api_key}&input=${search}&limit=1&location=${coordinates[1]},${coordinates[0]}`,
    );
    const response = await axios.get(url);
    const data = response.data;
    const {place_id} = data.predictions[0];
    const placeUrl = encodeURI(
      `https://rsapi.goong.io/Place/Detail?api_key=${query.api_key}&place_id=${place_id}`,
    );
    const placeResponse = await axios.get(placeUrl);
    const placeData = placeResponse.data;
    const {lat, lng} = placeData.result.geometry.location;
    setCoordinatesToMove([lng, lat]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <TextInput
          style={styles.searchBoxInput}
          placeholder="Search"
          placeholderTextColor="gray"
          onChange={e => setSearch(e.nativeEvent.text)}
          onEndEditing={async () => {
            await findLocation();
          }}
        />
      </View>
      <Mapbox.MapView
        style={styles.container}
        styleURL={
          'https://tiles.goong.io/assets/goong_map_web.json?api_key=0nDbhIUVFRBY1gRKKlUwMzNi1EMRkXvj3efUBDWO'
        }
        zoomEnabled={true}
        logoEnabled={false}
        compassEnabled={true}
        attributionEnabled={false}
        scaleBarEnabled={false}>
        {coordinatesToMove[0] === 0 ? (
          <Mapbox.Camera
            zoomLevel={15}
            followUserLocation={true}
            animationMode={'flyTo'}
          />
        ) : (
          <>
            <Mapbox.Camera
              zoomLevel={15}
              centerCoordinate={coordinatesToMove}
              animationMode={'flyTo'}
            />
            {/* @ts-ignore */}
            <Mapbox.PointAnnotation
              id="pointAnnotation"
              coordinate={coordinatesToMove}
              onSelected={() => {
                setMove(true);
                onMove();
              }}
            />
          </>
        )}
        {move ? (
          <>
            {/* @ts-ignore */}
            <Mapbox.ShapeSource id="StreetLine1" shape={routes}>
              {/* // @ts-ignore */}
              <Mapbox.LineLayer
                id="line1"
                // eslint-disable-next-line react-native/no-inline-styles
                style={{
                  lineColor: 'red',
                  lineWidth: 7.5,
                  lineCap: 'round',
                  lineJoin: 'round',
                  lineOpacity: 0.3,
                }}
              />
            </Mapbox.ShapeSource>
          </>
        ) : null}
        <Mapbox.UserLocation
          visible={true}
          animated={true}
          androidRenderMode="compass"
        />
      </Mapbox.MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
  mapContainer: {
    height: '100%',
    position: 'relative',
  },
  searchBox: {
    width: '100%',
  },
  searchBoxInput: {
    backgroundColor: 'white',
    width: '80%',
    height: 50,
    margin: 8,
    padding: 10,
    borderRadius: 99,
  },
});

export default Map;
