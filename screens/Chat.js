import React, { useState, useCallback, useEffect } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import axios from 'axios';
import { View } from 'react-native';
import { neon } from '@neondatabase/serverless';

const Chat = () => {

    const [res, setRes] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const sql = neon("postgresql://Dexcom:gBDxIj40XUHq@ep-plain-scene-a6ertth0.us-west-2.aws.neon.tech/blood_sugar_data?sslmode=require");

            try {
                // Execute the query
                const result = await sql(`SELECT systemtime, value FROM cgm_data ORDER BY id DESC;`);

                // Assuming the query returns an array of objects and we need the 'value' from the first object
                if (result.length > 0) {
                    setRes(result); // Accessing the 'value' property
                } else {
                    console.log("No data found");
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

  const [messages, setMessages] = useState([]);
  const [sessionPrompt, setSessionPrompt] = useState([
    { role: "system", content: `You are a chat feature in a diabetes help app. The user has some questions about their data or how they can better live with diabetes. Be of help to them and stay on topic. Here is their Dexcom data ${res}. It has the system time and their value (sugar in mg/dl at that time). Please look through this comprehensively before each response and use specific data to cater user.` }
  ]);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hi! How can I assist you today?',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Diabetes Helper',
          avatar: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/29a2818a-b797-4271-9798-0d51d7d9e29f/dfugdos-ca56853e-1f79-4791-b820-26907c4317b3.png/v1/fill/w_541,h_444,q_80,strp/heart_pfp_by_madifun_dfugdos-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NDQ0IiwicGF0aCI6IlwvZlwvMjlhMjgxOGEtYjc5Ny00MjcxLTk3OTgtMGQ1MWQ3ZDllMjlmXC9kZnVnZG9zLWNhNTY4NTNlLTFmNzktNDc5MS1iODIwLTI2OTA3YzQzMTdiMy5wbmciLCJ3aWR0aCI6Ijw9NTQxIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.n9PRQFHOhudQdgE63cSWzYg6OzYrrpoWNsHSXO0IgcE',
        },
      },
    ]);
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
    const sentMessage = messages[0];

    // Update session prompt to include user message
    const updatedPrompt = [...sessionPrompt, { role: "user", content: sentMessage.text }];

    axios.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-3.5-turbo",
      messages: updatedPrompt
    }, {
      headers: {
        'Authorization': `Bearer sk-proj-AOY2wT4T6Q5g2Tc7IdFPT3BlbkFJ1hGGg3IChXkkGHpoJRMC`,
        'Content-Type': 'application/json'
      }
    }).then(response => {
      const botResponse = response.data.choices[0].message.content;
      const receivedMessage = {
        _id: Math.round(Math.random() * 1000000),
        text: botResponse,
        createdAt: new Date(),
        user: {
          _id: 2,
                    name: 'Diabetes Helper',
          avatar: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/29a2818a-b797-4271-9798-0d51d7d9e29f/dfugdos-ca56853e-1f79-4791-b820-26907c4317b3.png/v1/fill/w_541,h_444,q_80,strp/heart_pfp_by_madifun_dfugdos-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NDQ0IiwicGF0aCI6IlwvZlwvMjlhMjgxOGEtYjc5Ny00MjcxLTk3OTgtMGQ1MWQ3ZDllMjlmXC9kZnVnZG9zLWNhNTY4NTNlLTFmNzktNDc5MS1iODIwLTI2OTA3YzQzMTdiMy5wbmciLCJ3aWR0aCI6Ijw9NTQxIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.n9PRQFHOhudQdgE63cSWzYg6OzYrrpoWNsHSXO0IgcE',
        },
      };
      setMessages(previousMessages => GiftedChat.append(previousMessages, receivedMessage));

      // Update session prompt to include bot response
      setSessionPrompt([...updatedPrompt, { role: "assistant", content: botResponse }]);
    }).catch(error => {
      console.error("API Error:", error);
    });
  }, [sessionPrompt]);

  return (
    <View className='flex-1 bg-neutral-950 '>
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: 1,
        }}
      />
    </View>
  );
};

export default Chat;
