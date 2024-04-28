import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import GlucoseCircle from '../components/GlucoseCircle';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import HeroAlert from '../components/HeroAlert';
import Insight from '../components/Insight';
import { neon } from '@neondatabase/serverless';
import functions from '@react-native-firebase/functions';


const Home = ({navigation}) => {
    const [currentSugar, setCurrentSugar] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const sql = neon("postgresql://Dexcom:gBDxIj40XUHq@ep-plain-scene-a6ertth0.us-west-2.aws.neon.tech/blood_sugar_data?sslmode=require");

            try {
                const result = await sql(`SELECT value FROM cgm_data ORDER BY id DESC LIMIT 1;`);
                setCurrentSugar(result[0].value);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);
  return (
    <ScrollView className="flex-1 bg-neutral-950 pt-20">
        
        <View className="flex flex-row justify-between mx-6">
            <TouchableOpacity>
                <MaterialIcons name="menu" size={36} color="white" />
            </TouchableOpacity>
            <View>
                <Text className='text-2xl font-extrabold text-emerald-500'>Sweet<Text className='text-rose-500'>Spot</Text></Text>
            </View>
            <TouchableOpacity>
                <FontAwesome name="user-circle-o" size={35} color="white" />
            </TouchableOpacity>
        </View>
        <View className="flex-row justify-center mt-8">
            <HeroAlert alertText={"Your glucose levels will be low in 15 mins! Find something to eat ASAP!"}/>
        </View>
        <View className="flex-row justify-center mt-6">
            <GlucoseCircle value={currentSugar}/>
        </View>
        <TouchableOpacity 
            className="flex-row justify-center mt-4"
            onPress={() => navigation.navigate('LevelHistory')}>
            <Text className='text-gray-400'>See your full sugar level history →</Text>
        </TouchableOpacity>
        <Text className='text-white text-center text-xl font-bold mt-6'>Insights</Text>
        <View className='flex-row justify-center mt-3'>
            <Insight 
                insightText={"Your sugar dips around 11am everyday. Are you eating a filling breakfast?"}
                insightBgColorTailwind={"bg-rose-950"}/>
        </View>
        <View className='flex-row justify-center mt-3'>
        <Insight 
                insightText={"You're glucose levels have been within threshold 83% of the time. Good job!"}
                insightBgColorTailwind={"bg-emerald-950"}/>
        </View>
        <View className='flex-row justify-center mt-3'>
            <Insight 
                insightText={"Your sugar rose to 340 at 4PM yesterday. Please avoid such spikes."}
                insightBgColorTailwind={"bg-rose-950"}/>
        </View>

    </ScrollView>
  );
};

export default Home;
