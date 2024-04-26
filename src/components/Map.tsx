import {View, StyleSheet, TextInput} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import React, {useState} from 'react';
import Mapbox from '@rnmapbox/maps';
import axios from 'axios';

const query = {
  api_key: 'efA3y8Un1klQqgeeNgVWBliArEjnY7dk2TGHbGUd',
};

const Map = () => {
  const [coordinates, setCoordinates] = useState([0, 0]);
  const [coordinatesToMove, setCoordinatesToMove] = useState([0, 0]);
  const [search, setSearch] = useState('');

  const findLocation = async () => {
    Geolocation.getCurrentPosition(
      position => {
        setCoordinates([
          position.coords.latitude,
          position.coords.longitude,
        ]);
      },
      error => console.log(error),
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
        zoomEnabled={false}
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
              id={'pointAnnotation'}
              coordinate={coordinatesToMove}
            />
          </>
        )}
        <Mapbox.UserLocation visible={true} animated={true} />
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
