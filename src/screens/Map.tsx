import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import React, {useState} from 'react';
import Mapbox from '@rnmapbox/maps';
import axios from 'axios';
import coverageToGeoJSON from '@utils/coverageToGeoJSON';
import {findCenterPoint, findZoomFromTwoPoints} from '@utils/findZoom';

const query = {
  api_key: 'efA3y8Un1klQqgeeNgVWBliArEjnY7dk2TGHbGUd',
};

const Map = () => {
  const [coordinates, setCoordinates] = useState([0, 0]);
  const [coordinatesToMoveCamera, setCoordinatesToMoveCamera] = useState([
    106, 10,
  ]);
  const [coordinatesToMove, setCoordinatesToMove] = useState([0, 0]);
  const [move, setMove] = useState(false);
  const [routes, setRoutes] = useState([]);
  const [search, setSearch] = useState('');

  const onMove = async () => {
    // const url = encodeURI(
    //   `https://rsapi.goong.io/Direction?origin=${coordinates[0]},${coordinates[1]}&destination=${coordinatesToMove[1]},${coordinatesToMove[0]}&alternatives=true&api_key=${query.api_key}`,
    // );
    const url = encodeURI(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates[0]},${coordinates[1]};${coordinatesToMove[0]},${coordinatesToMove[1]}?alternatives=true&steps=true&banner_instructions=true&geometries=geojson&overview=full&access_token=pk.eyJ1IjoiZGVzcGxheXNoaWRvIiwiYSI6ImNsdmczM2MxZTBzOXAybnQ3bWJhY2ZtM3oifQ.yyLX1kqEpIbD0KK0RCCHKQ`,
    );
    const response = await axios.get(url);
    const data = response.data;
    // @ts-ignore
    setRoutes(coverageToGeoJSON(data));
  };

  const findLocation = async () => {
    if (search === '') {
      return;
    }
    Geolocation.getCurrentPosition(
      position => {
        setCoordinates([
          position.coords.longitude,
          position.coords.latitude,
        ]);
      },
      error => console.log(error),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
    const url = encodeURI(
      `https://rsapi.goong.io/Place/AutoComplete?api_key=${query.api_key}&input=${search}&limit=1&location=${coordinates[0]},${coordinates[1]}`,
    );
    const response = await axios.get(url);
    const {status} = response.data;
    if (status !== 'OK') {
      return;
    }
    const data = response.data;
    const {place_id} = data.predictions[0];
    const placeUrl = encodeURI(
      `https://rsapi.goong.io/Place/Detail?api_key=${query.api_key}&place_id=${place_id}`,
    );
    const placeResponse = await axios.get(placeUrl);
    const placeData = placeResponse.data;
    const {lat, lng} = placeData.result.geometry.location;
    setCoordinatesToMoveCamera([lng, lat]);
    setCoordinatesToMove([lng, lat]);
  };

  const getMyLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        setCoordinatesToMoveCamera([
          position.coords.longitude,
          position.coords.latitude,
        ]);
      },
      error => console.log(error),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <TextInput
          style={styles.searchBoxInput}
          placeholder="Search"
          placeholderTextColor="gray"
          onFocus={() => {
            setCoordinatesToMoveCamera(coordinatesToMoveCamera);
            setMove(false);
          }}
          onChange={e => {
            setSearch(e.nativeEvent.text);
          }}
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
        compassViewMargins={{x: 10, y: 70}}
        attributionEnabled={false}
        // compassFadeWhenNorth={true}
        scaleBarEnabled={false}>
        <Mapbox.Camera
          zoomLevel={15}
          centerCoordinate={coordinatesToMoveCamera}
          animationMode={'flyTo'}
          allowUpdates
        />
        {coordinatesToMove[0] !== 0 ? (
          <>
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
        ) : null}
        {move ? (
          <>
            <Mapbox.Camera
              zoomLevel={findZoomFromTwoPoints(
                // @ts-ignore
                coordinates,
                coordinatesToMove,
              )}
              centerCoordinate={findCenterPoint(
                // @ts-ignore
                coordinates,
                coordinatesToMove,
              )}
            />
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
        <Mapbox.UserLocation visible={true} animated={true} />
      </Mapbox.MapView>
      <View style={styles.myLocationButton}>
        <TouchableOpacity
          style={styles.myLocationButtonImage}
          onPress={() => {
            getMyLocation();
          }}>
          <Image
            source={{
              uri: 'https://img.icons8.com/material-outlined/500/4264FB/center-direction.png',
            }}
            // eslint-disable-next-line react-native/no-inline-styles
            style={{width: 25, height: 25}}
          />
        </TouchableOpacity>
      </View>
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
    position: 'absolute',
    top: 10,
    zIndex: 10,
    backgroundColor: 'transparent',
    width: '100%',
  },
  searchBoxInput: {
    backgroundColor: 'white',
    marginHorizontal: 10,
    height: 42,
    marginTop: 2,
    padding: 10,
    paddingHorizontal: 20,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 99,
  },
  myLocationButton: {
    width: 43,
    height: 43,
    position: 'absolute',
    backgroundColor: '#FFFFF9',
    borderRadius: 99,
    borderWidth: 1,
    borderColor: '#000000',
    top: 135,
    right: 12.25,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  myLocationButtonImage: {
    width: 43,
    height: 43,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 99,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Map;
