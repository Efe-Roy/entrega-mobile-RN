import React, { memo, useEffect, useState } from 'react';
import { Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';

export default function ChatModal({userID}) {
    const [messages, setMessages] = useState([])
    const [message, setMessage] = useState('');
    console.log(userID);

    useEffect(() => {
        setTimeout(() => setMessages(msgs => ([{ id: new Date().getTime(), type: 'receive', text: 'hey! how are you?' }, ...msgs])), 1000);
    }, [])

    const sendMsg = () => { setMessages([{ id: new Date().getTime(), type: 'send', text: message }, ...messages]); setMessage('') };
    const receiveMsg = () => { setMessages([{ id: new Date().getTime(), type: 'receive', text: message }, ...messages]); setMessage('') };
    
    return (
        <View className='flex-1'>
            <FlatList 
                data={messages} 
                keyExtractor={x => x.id} 
                renderItem={({ item, index }) => <ChatItemMemo {...{ item, index }} />} 
                inverted
                contentContainerStyle={{paddingHorizontal: 10}} 
            />
            <View className='flex-row items-center bg-[#eee]'>
                <Button title='Receive' onPress={receiveMsg} disabled={message.length === 0} />
                <TextInput 
                    className='flex-1 text-base p-2' 
                    value={message} 
                    placeholder='Type your message' 
                    onChangeText={setMessage} 
                />
                <Button title='Send' onPress={sendMsg} disabled={message.length === 0} />
            </View>
        </View>
    )
}

function ChatItem({ item }) {
    return (
        <View className={`mb-1 ${item.type === 'send' ? "self-end" : "self-start" }`}>
            <Text className='bg-slate-200 p-2 rounded max-w-[75%]'>{item.text}</Text>
        </View>
    )
}

// put you logic of rerendering here (major part for performance)
const ChatItemMemo = memo(ChatItem, (prevProps, nextProps) => true)