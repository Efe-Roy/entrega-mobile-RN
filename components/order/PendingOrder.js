import * as Icon from "react-native-feather";
import React, { useEffect, useState } from 'react'
import { Text, View, TouchableOpacity, ScrollView, ActivityIndicator, Modal } from 'react-native'
import { baseURL } from '../../redux/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import ChatModal from "../ChatModal";
import ChatMsg from "../ChatMsg";

export default PendingOrder = ({isPending, setIsPending, userAuth}) => {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [isChat, setIsChat] = useState(false);
  const [userID, setUserID] = useState(null);
  
  const getOrders = async () => {
    try {
        setLoading(true);

        const url = `${baseURL}/order-list/?being_delivered="true"&received_f="false"&rider_id=${userAuth?.id}`
        const jwtToken = await AsyncStorage.getItem('jwtToken');
        let response = await axios.get(url, {
          headers: {
            'Authorization': `Token ${jwtToken}`, 
          }, 
        });

        // console.log("Order dd", response.data.results[0].user.id);
        setOrders(response.data.results);
        setLoading(false);

    } catch (error) {
        setLoading(false);
        console.log(error)
    }
  };

  const OrderDeivered = async (id) => {
    try {
        setLoading(true);

        const url = `${baseURL}/order/${id}/`
        const jwtToken = await AsyncStorage.getItem('jwtToken');
        let response = await axios.get(url, {
          headers: {
            'Authorization': `Token ${jwtToken}`, 
          }, 
        });

        console.log("Catch the big head", response.data);
        setLoading(false);
        setIsPending(false);

    } catch (error) {
        setLoading(false);
        console.log(error)
    }
  };

  useEffect(() => {
    getOrders();
  }, [isPending])
  

  function formatDate(dateString) {
    const date = new Date(dateString);
   
    // Format the date to '29 Feb, 2024'
    const formattedDate = date.toLocaleDateString('en-US', {
       day: 'numeric',
       month: 'short',
       year: 'numeric'
    });
   
    return formattedDate;
   }

  return (
    <View className="flex-1 px-3">
      <Modal
          visible={isChat}
          onRequestClose={()=>setIsChat(false)}
          animationType='fade'
      >
        <View className=''>
            <TouchableOpacity 
                onPress={()=>setIsChat(false)} 
                className=" bg-gray-200 p-2 w-10 h-10 ml-5 mt-5 rounded-full shadow">
                <Icon.ArrowLeft strokeWidth={3} stroke="black" />
            </TouchableOpacity>
        </View>
        <ChatMsg setIsChat={setIsChat} isChat={isChat} userID={userID} />
      </Modal> 

      <View className="flex-row justify-center items-center px-4">
        <View>
          <Text className="font-bold text-lg my-5">Entrega pendiente</Text>
        </View>
      </View>

      <View className='h-[580px]'>
        {loading? <ActivityIndicator size={'large'} /> :
          <ScrollView contentContainerStyle={{
            paddingHorizontal: 10
          }}>
            {orders?.map((data, index)=>(
              <View
                className='bg-white rounded-lg shadow-md p-4 mb-4'
                style={{shadowColor: "#044244", shadowRadius: 7}}
                key={index}
              >
                <View className='flex-row'>
                  <Text className='text-sm text-gray-600 mr-3'>Order ID:</Text>
                  <Text className='text-sm font-bold'>#{data?.ref_code}</Text>
                </View>
                <View className='flex-row'>
                  <Text className='text-sm text-gray-600 mr-3'>Total:</Text>
                  <Text className='text-sm font-bold'>${data?.total}</Text>
                </View>

                <View className='flex-row items-center my-2'>
                  <Icon.MapPin 
                      height={15} width={15} 
                      strokeWidth="2.5" stroke="red" 
                  />
                  <Text className='text-sm ml-2'>{data?.address?.address} </Text>
                </View>
                <Text className='text-sm font-bold text-center'>{formatDate(data?.ordered_date)}</Text>
                
                <View className='flex-row items-center justify-between mt-5'>
                  <TouchableOpacity 
                    onPress={()=>{
                      setIsChat(true)
                      setUserID(data?.user?.id)
                    }}
                    className='flex-row items-center py-4 px-10 rounded-lg shadow-md bg-white'
                    style={{shadowColor: "#044244", shadowRadius: 7}}
                  >
                    <Icon.MessageCircle 
                      height={15} width={15} 
                      strokeWidth="2.5" stroke="black" 
                    />
                    <Text className='ml-2'>Charlar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=> OrderDeivered(data?.id)} className='py-4 px-10 rounded-2xl flex-row items-center bg-green-500' >
                    {/* <Icon.Map 
                      height={15} width={15} 
                      strokeWidth="2.5" stroke="white" 
                    /> */}
                    <Text className='ml-2 text-white'>Aprobar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

          </ScrollView>
        }
      </View>
      <View className='mt-5'></View>

    </View>
  )
}