import {View, Text, ActivityIndicator} from 'react-native';
import React from 'react';

const Splash = () => {
  return (
    <View className='flex-1 justify-center items-center'>
      <Text className='font-bold text-2xl text-blue-800'>Loading ...</Text>
      <ActivityIndicator color={'#000'} animating={true} size="small" />
    </View>
  );
};

export default Splash;