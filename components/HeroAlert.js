import React from 'react';
import { View, Text } from 'react-native';

const HeroAlert = ({ alertText }) => {

  return (
    <View className='bg-rose-950 p-4 rounded-3xl w-[90%]'>
        <Text className='text-white'>{alertText}</Text>
    </View>
  );
};

export default HeroAlert;
