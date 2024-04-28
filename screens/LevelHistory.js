import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { neon } from '@neondatabase/serverless';

const LevelHistory = ({route, navigation}) => {
    const { sugar } = route.params;
    let low = 0;
    let mid = 0;
    let high = 0;

    for (let i = 0; i < 8640; i++) {
        if (sugar[i]["value"] <= 80) {
            low++;
            
        }
        else if (sugar[i]["value"] < 180) {
            mid++;
        }
        else {
            high++;
     
        }

    }

    return (
<ScrollView className='bg-neutral-950 flex-1 pt-28'>
  <View style={{flexDirection: 'row', justifyContent: 'center'}}>
    <View className='rounded-full' style={{width: '80%', borderRadius: 50, flexDirection: 'row', alignItems: 'center', height: 48, }}>
      <View style={{width: `${low / 8640 * 100}%`, height: 48}} className='bg-rose-500 rounded-l-full'></View>
      <View style={{width: `${mid / 8640 * 100}%`, height: 48}} className='bg-emerald-500'></View>
      <View style={{width: `${high / 8640 * 100}%`, height: 48}} className='bg-amber-500 rounded-r-full'></View>
    </View>
  </View>
  <View className="p-4 mt-2 text-2xl">
        <Text className="text-white text-center text-3xl">Statistics Overview</Text>
        <View className="mt-2 ">
          <Text className="text-rose-500  text-xl text-center ">Low: {((low / 8640) * 100).toFixed(2)}%</Text>
          <Text className="text-emerald-500  text-xl text-center">In Range: {((mid / 8640) * 100).toFixed(2)}%</Text>
          <Text className="text-amber-500  text-xl text-center">High: {((high / 8640) * 100).toFixed(2)}%</Text>
        </View>
      </View>
</ScrollView>
    );
  };
  
  export default LevelHistory;