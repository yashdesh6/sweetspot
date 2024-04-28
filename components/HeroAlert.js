import React from 'react';
import { View, Text } from 'react-native';

const HeroAlert = ({ alertText, alertBg }) => {

  return (
    <View className={`p-4 rounded-3xl w-[90%] ${alertBg}`}>
        <Text className='text-white'>{alertText}</Text>
    </View>
  );
};

export default HeroAlert;
