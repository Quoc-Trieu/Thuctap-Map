import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {Actionsheet, useDisclose} from 'native-base';
import {useStore} from '../store';
import {metersToKm, msToTime} from '@utils/handleData';

const BottomSheet = ({navigation}: {navigation: any}) => {
  const {isOpen, onClose, onOpen} = useDisclose();
  // @ts-ignore
  const [setMove] = useStore(state => [state.setMove]);
  const [readyToMove] = useStore(state => [state.readyToMove]);
  const [distance, totalTime] = useStore(state => [
    state.distance,
    state.totalTime,
  ]);
  const styles = StyleSheet.create({
    container: {
      display: readyToMove ? 'flex' : 'none',
      position: 'relative',
    },
    actionContainer: {
      display: isOpen ? 'none' : 'flex',
      position: 'absolute',
      bottom: 10,
      zIndex: 10,
      backgroundColor: 'transparent',
      width: '100%',
    },
    actionButtonBox: {
      justifyContent: 'center',
      alignItems: 'center',
      width: 100,
      backgroundColor: 'white',
      marginHorizontal: 10,
      height: 42,
      padding: 10,
      paddingHorizontal: 20,
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 99,
    },
    actionButton: {
      fontWeight: 'bold',
      justifyContent: 'center',
      alignItems: 'center',
      width: 100,
      backgroundColor: 'white',
      marginHorizontal: 10,
      height: 42,
      padding: 10,
      paddingHorizontal: 20,
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 99,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.actionContainer}>
        <View style={styles.actionButtonBox}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              setMove(true);
              onOpen();
            }}>
            <Text>Move</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Actionsheet
        isOpen={isOpen}
        onClose={onClose}
        _backdrop={{
          backgroundColor: 'transparent',
        }}>
        <Actionsheet.Content>
          <View
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-start',
            }}>
            <Text style={{fontSize: 24, color: 'green'}}>
              {msToTime(totalTime)}
            </Text>
            <Text style={{fontSize: 24}}>
              {' (' + metersToKm(distance) + ' Km' + ')'}
            </Text>
          </View>
          <View
            style={{
              width: '100%',
              marginTop: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: 100,
                backgroundColor: '#4d73ff',
                height: 42,
                borderColor: 'gray',
                borderWidth: 1,
                borderRadius: 99,
              }}
              onPress={() => {
                setMove(false);
                onClose();
              }}>
              <Text style={{color: 'white'}}>Di Chuyển</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: 100,
                backgroundColor: 'white',
                height: 42,
                borderColor: 'gray',
                borderWidth: 1,
                borderRadius: 99,
                marginLeft: 10,
              }}
              onPress={() => {
                setMove(false);
                onClose();
                navigation.navigate('Steps');
              }}>
              <Text style={{color: 'black'}}>Xem Chặng</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: 100,
                backgroundColor: '#ff4f75',
                height: 42,
                borderColor: 'gray',
                borderWidth: 1,
                borderRadius: 99,
                marginLeft: 10,
              }}
              onPress={() => {
                setMove(false);
                onClose();
              }}>
              <Text style={{color: 'white'}}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </Actionsheet.Content>
      </Actionsheet>
    </View>
  );
};

export default BottomSheet;
