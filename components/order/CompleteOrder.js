import * as Icon from "react-native-feather";
import React, { useEffect, useState } from 'react'
import { Text, View, ScrollView, ActivityIndicator } from 'react-native'
import { baseURL } from '../../redux/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default CompleteOrder = ({isModalVisible, userAuth}) => {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);

  const getOrders = async () => {
    try {
        setLoading(true);

        const url = `${baseURL}/order-list/?received="true"&rider_id=${userAuth?.id}`
        const jwtToken = await AsyncStorage.getItem('jwtToken');
        let response = await axios.get(url, {
          headers: { 
            'Authorization': `Token ${jwtToken}`, 
          }, 
        });

        // console.log("xxss", response.data.results);
        setOrders(response.data.results);
        setLoading(false);

    } catch (error) {
        setLoading(false);
        console.log(error)
    }
  };

  useEffect(() => {
    getOrders();
  }, [isModalVisible])
  
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
      <View className="flex-row justify-center items-center px-4">
        <View>
          <Text className="font-bold text-lg mb-5">Pedidos completados</Text>
        </View>
      </View>

      <View className='h-[580px]'>
        {loading? <ActivityIndicator size={'large'} /> :
          <ScrollView contentContainerStyle={{
            paddingHorizontal: 10
          }}>
            {orders?.map((data, index)=>(
              <View
                className='bg-green-50 rounded-3xl shadow-md p-4 mb-4'
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
                
              </View>
            ))}
            
          </ScrollView>
        }
      </View>
      <View className='mt-5'></View>

    </View>
  )
}