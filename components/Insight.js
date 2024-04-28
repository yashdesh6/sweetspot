import React from 'react';
import { View, Text } from 'react-native';

const Insight = ({ insightText, insightBgColorTailwind }) => {

  return (
    <View className={`${insightBgColorTailwind} p-4 rounded-3xl w-[90%]`}>
        <Text className='text-white'>{insightText}</Text>
    </View>
  );
};

export default Insight;
