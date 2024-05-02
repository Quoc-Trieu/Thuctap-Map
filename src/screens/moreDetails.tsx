import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useStore} from '../store';
import {ScrollView} from 'native-base';
import {formatDistance} from '@utils/handleData';

const MoreDetails = () => {
  // @ts-ignore
  const [steps] = useStore(state => [state.steps]);
  return (
    <>
      <ScrollView style={styles.scrollView}>
        {steps.map((step: any, index: number) => (
          <View style={styles.stepView} key={index}>
            <Text style={styles.stepText}>{step.text}</Text>
          </View>
        ))}
      </ScrollView>
    </>
  );
};

export default MoreDetails;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    padding: 10,
  },
  stepView: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f8f8f8',
  },
  stepText: {
    fontSize: 16,
  },
});
