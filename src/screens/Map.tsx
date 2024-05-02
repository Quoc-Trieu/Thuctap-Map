import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import React, {useEffect, useState} from 'react';
import Mapbox from '@rnmapbox/maps';
import axios from 'axios';
import {getCoodinatesFromResponse} from '@utils/coverageToGeoJSON';
import {findCenterPoint, findZoomFromTwoPoints} from '@utils/findZoom';
import {useStore} from '../store';
import BottomSheet from '@components/BottomSheet';

const API_KEY = 'f3aa5d53-bbc9-43ea-bc64-e5e398ccff99';

const Map = ({navigation}: {navigation: any}) => {
  const [coordinates, setCoordinates] = useState([0, 0]);
  const [coordinatesToMoveCamera, setCoordinatesToMoveCamera] = useState([
    106, 10,
  ]);
  const [coordinatesToMove, setCoordinatesToMove] = useState([0, 0]);
  // @ts-ignore
  const [move, setMove] = useStore(state => [state.move, state.setMove]);
  // @ts-ignore
  const [setReadyToMove] = useStore(state => [state.setReadyToMove]);
  const [routes, setRoutes] = useState(undefined);
  const [search, setSearch] = useState('');
  // @ts-ignore
  const [setDistance, setTotalTime] = useStore(state => [
    // @ts-ignore
    state.setDistance,
    // @ts-ignore
    state.setTotalTime,
  ]);
  // @ts-ignore
  const [setSteps] = useStore(state => [state.setSteps]);

  const onMove = async () => {
    if (
      coordinates[0] === 0 &&
      coordinates[1] === 0 &&
      coordinatesToMove[0] === 0 &&
      coordinatesToMove[1] === 0
    ) {
      return;
    }
    // const url = encodeURI(
    //   `https://rsapi.goong.io/Direction?origin=${coordinates[0]},${coordinates[1]}&destination=${coordinatesToMove[1]},${coordinatesToMove[0]}&alternatives=true&api_key=${query.api_key}`,
    // );
    const url = encodeURI(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates[0]},${coordinates[1]};${coordinatesToMove[0]},${coordinatesToMove[1]}?alternatives=true&steps=true&banner_instructions=true&geometries=geojson&language=vi&overview=full&access_token=pk.eyJ1IjoiZGVzcGxheXNoaWRvIiwiYSI6ImNsdmczM2MxZTBzOXAybnQ3bWJhY2ZtM3oifQ.yyLX1kqEpIbD0KK0RCCHKQ`,
    );
    console.log(url);
    // const url = encodeURI(
    //   `https://graphhopper.com/api/1/route?point=${coordinates[1]},${coordinates[0]}&point=${coordinatesToMove[1]},${coordinatesToMove[0]}&vehicle=scooter&locale=vi&instructions=true&points_encoded=false&key=${API_KEY}`,
    // );
    const response = await axios.get(url);
    const data = response.data;
    if (response.data.code !== 'Ok') {
      return;
    }
    const distanceTotal = data.routes[0].distance;
    const totalTime = data.routes[0].duration;
    setDistance(distanceTotal);
    setTotalTime(totalTime);
    // @ts-ignore
    const steps = data.routes[0].legs[0].steps;
    const newSteps = [];
    steps.forEach((step: any) => {
      const {maneuver, duration, distance} = step;
      const {instruction} = maneuver;
      newSteps.push({text: instruction, duration, distance});
    });
    setSteps(newSteps);
    // @ts-ignore
    setRoutes(getCoodinatesFromResponse(data));
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
      `https://nominatim.openstreetmap.org/search?q=${search}&format=json&polygon_kml=1&addressdetails=1&limit=1`,
    );
    const response = await axios.get(url);
    const data = response.data;
    const {lat, lon} = data[0];
    setCoordinatesToMoveCamera([lon, lat]);
    setCoordinatesToMove([lon, lat]);
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

  useEffect(() => {
    onMove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [move]);

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
            if (
              coordinatesToMove[0] !== 0 &&
              coordinatesToMove[1] !== 0 &&
              move
            ) {
            }
          }}
          onChange={e => {
            setSearch(e.nativeEvent.text);
          }}
          onEndEditing={async () => {
            await findLocation();
            setReadyToMove(true);
          }}
        />
      </View>
      <Mapbox.MapView
        style={styles.container}
        // styleURL={
        //   'https://tiles.goong.io/assets/goong_map_web.json?api_key=0nDbhIUVFRBY1gRKKlUwMzNi1EMRkXvj3efUBDWO'
        // }
        zoomEnabled={true}
        logoEnabled={false}
        compassEnabled={true}
        compassViewMargins={{x: 10, y: 70}}
        // attributionEnabled={false}
        // compassFadeWhenNorth={true}
        // scaleBarEnabled={false}
        attributionPosition={{bottom: 20, right: 20}}
        scaleBarPosition={{bottom: 15, right: 50}}>
        <Mapbox.Camera
          zoomLevel={15}
          centerCoordinate={coordinatesToMoveCamera}
          animationMode={'flyTo'}
          allowUpdates
        />
        {/* @ts-ignore */}
        <Mapbox.PointAnnotation
          id="pointAnnotation"
          coordinate={coordinatesToMove}
        />
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
      <BottomSheet navigation={navigation} />
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
