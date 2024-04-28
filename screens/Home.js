import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import GlucoseCircle from '../components/GlucoseCircle';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import HeroAlert from '../components/HeroAlert';
import Insight from '../components/Insight';
import { neon } from '@neondatabase/serverless';


const Home = ({ navigation }) => {
    const [sugar, setSugar] = useState([]);
    const [predSugar, setPredSugar] = useState(0);
    const [alertBg, setAlertBg] = useState('');
    const [alertAction, setAlertAction] = useState('');

    const [insights, setInsights] = useState({ insight1: '', insight2: '', insight3: '' });
    const [isLoading, setIsLoading] = useState(true); // State to manage loading indicator
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://analyze-data-gahlpxcqwa-uc.a.run.app', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer`,
                        'Content-Type': 'application/json'
                    }
                });
                console.log(response);

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const apiData = await response.json();
  
                const gptData = JSON.parse(apiData.gpt_response);
                setInsights({
                    insight1: gptData.insight1,
                    insight2: gptData.insight2,
                    insight3: gptData.insight3
                });
            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
            }
          
            try {
                const sql = neon("postgresql://Dexcom:gBDxIj40XUHq@ep-plain-scene-a6ertth0.us-west-2.aws.neon.tech/blood_sugar_data?sslmode=require");
                const sugarResult = await sql(`SELECT value FROM cgm_data ORDER BY id DESC LIMIT 8640;`);
                if (sugarResult.length > 0) {
                    setSugar(sugarResult);
                } else {
                    console.error('No data returned from database');
                }
            } catch (error) {
                console.error('Error fetching data from database:', error);
            }
            try {
                const response = await fetch('https://ml-model-gahlpxcqwa-uc.a.run.app', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer`,
                        'Content-Type': 'application/json'
                    }
                });
                console.log(response);

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const apiData = await response.json();
                const ps = parseInt(apiData["Predicted Blood Sugar Levels in 30 minutes"]);
                setPredSugar(ps);
                if (ps <= 80) {
                    setAlertBg('bg-rose-950');
                    setAlertAction('Try to find something to eat!');
                }
                else if (ps < 180) {
                    setAlertBg('bg-emerald-950');
                    setAlertAction('You are looking good for now!');
                }
                else {
                    setAlertBg('bg-amber-950');
                    setAlertAction('Try to administer insulin or exercise!');
                }
       
            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
            }
            
            // Database query
             finally {
                setIsLoading(false); // Set loading to false after fetching is done
            }
        };

       
        fetchData();

    }, []);

    if (isLoading) {
        return (
            <View className='flex-1 bg-neutral-950 items-center justify-center'>
                <ActivityIndicator size="large" color="white" />
            </View>
        );
    }
 
    return (
        <ScrollView className="flex-1 bg-neutral-950 pt-20">

        <View className="flex flex-row justify-between mx-6">
            <TouchableOpacity>
                <MaterialIcons name="menu" size={36} color="white" />
            </TouchableOpacity>
            <View>
                <Text className='text-2xl font-extrabold text-emerald-500'>Sweet<Text className='text-rose-500'>Spot</Text></Text>
            </View>
            <TouchableOpacity
                onPress={() => navigation.navigate('Chat')}>
                <Entypo name="chat" size={36} color="white" />
            </TouchableOpacity>
        </View>
        <View className="flex-row justify-center mt-6">
            <HeroAlert alertText={`Your predicted sugar in 30 minutes is ${predSugar} mg/dl. ${alertAction}`} alertBg={alertBg}/>
        </View>
        <View className="flex-row justify-center mt-5">
            <GlucoseCircle value={sugar[0].value}/>
        </View>
        <TouchableOpacity 
            className="flex-row justify-center mt-3"
            onPress={() => navigation.navigate('LevelHistory', {sugar: sugar})}>
            <Text className='text-gray-400'>See your full sugar level history →</Text>
        </TouchableOpacity>
        <Text className='text-white text-center text-xl font-bold mt-4'>Insights</Text>
        <View className='flex-row justify-center mt-2'>
            <Insight 
                insightText={insights.insight1}/>
        </View>
        <View className='flex-row justify-center mt-2'>
        <Insight 
                insightText={insights.insight2}/>
        </View>
        <View className='flex-row justify-center mt-2'>
            <Insight 
                insightText={insights.insight3}/>
        </View>
     </ScrollView>


  );
};

export default Home;
