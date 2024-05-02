import Map from '@screens/Map';
import MoreDetails from '@screens/moreDetails';

import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';

const Navigation = createStackNavigator();

const StackNavigation = () => {
  return (
    <NavigationContainer>
      <Navigation.Navigator initialRouteName="Map">
        <Navigation.Screen
          name="Map"
          component={Map}
          options={{headerShown: false}}
        />
        <Navigation.Screen name="Steps" component={MoreDetails} />
      </Navigation.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigation;
