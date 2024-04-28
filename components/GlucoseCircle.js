import React from 'react';
import { View, Text } from 'react-native';

const GlucoseCircle = ({ value }) => {
  // Determine the styling classes based on the glucose value
  const borderColor = value < 80 ? 'border-rose-500' : value > 180 ? 'border-amber-500' : 'border-emerald-500';
  const textColor = value < 80 ? 'text-rose-500' : value > 180 ? 'text-amber-500' : 'text-emerald-500';

  return (
    <View className={`rounded-full border-8 flex items-center justify-center w-60 h-60 ${borderColor}`}>
      <Text className={`text-3xl font-extrabold ${textColor}`}>{`${value} mg/dL`}</Text>
    </View>
  );
};

export default GlucoseCircle;
