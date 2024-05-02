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
        {steps.map((step: any, index: number) => {
          if (index === 0) {
            return (
              <View style={styles.stepView} key={index}>
                {step.distance > 100 && index !== 0 ? (
                  <Text style={styles.stepText}>
                    {step.text +
                      ' và đi thêm ' +
                      formatDistance(step.distance)}
                  </Text>
                ) : (
                  <>
                    <Text style={styles.stepText}>
                      {step.text + ' và đi thêm ' + step.distance + 'm'}
                    </Text>
                  </>
                )}
              </View>
            );
          }
          if (index === steps.length - 1) {
            return (
              <View style={styles.stepView} key={index}>
                <Text style={styles.stepText}>
                  {step.text + ' và bạn đã đến nơi'}
                </Text>
              </View>
            );
          }
          return (
            <View style={styles.stepView} key={index}>
              {step.distance > 100 ? (
                <Text style={styles.stepText}>
                  {step.text +
                    ' và đi thêm ' +
                    formatDistance(step.distance)}
                </Text>
              ) : (
                <>
                  <Text style={styles.stepText}>
                    {step.text + ' và đi thêm ' + step.distance + 'm'}
                  </Text>
                </>
              )}
            </View>
          );
        })}
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
