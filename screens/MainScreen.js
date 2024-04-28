import { View, Text, SafeAreaView, Image, TouchableOpacity, ImageBackground, ScrollView, StatusBar, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as Icon from "react-native-feather";
import { useNavigation } from '@react-navigation/native';
import { logoutUser } from '../redux/features/authSlice';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
const headerImage = require('../assets/images/header.jpg');
const notification = require('../assets/images/Notification.png');
const banner = require('../assets/images/BG.png');
const model = require('../assets/images/model4.png');
import moment from 'moment';
import { baseURL } from '../redux/utils';
import PendingOrder from '../components/order/PendingOrder';
import CompleteOrder from '../components/order/CompleteOrder';


export default function MainScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const logOutFunc = () => {
    dispatch(logoutUser(navigation));
  }

  let date = moment().format('MMMM Do YYYY');

  const [orders, setOrders] = useState([]);
  const [orderSum, setOrderSum] = useState(null);
  const [userAuth, setUserAuth] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isPending, setIsPending] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const getTotalSum = async () => {
    if (userAuth?.id){
      try {
          setLoading(true);
  
          const url = `${baseURL}/order-rider-sum/${userAuth?.id}/`
          const jwtToken = await AsyncStorage.getItem('jwtToken');
          let response = await axios.get(url, {
            headers: {
              'Authorization': `Token ${jwtToken}`, 
            }, 
          });
  
          // console.log("total sum", response.data);
          setOrderSum(response.data);
          setLoading(false);
  
      } catch (error) {
          setLoading(false);
          console.log(error)
      }
    } else {
      console.log("no id provided")
    }
   
  };
  
  const getOrders = async () => {
    if (userAuth?.id){
      try {
          setLoading(true);
  
          const url = `${baseURL}/order-list/?rider_id=${userAuth?.id}`
          // const url = `${baseURL}/order-rider-sum/${userAuth?.id}/`
          const jwtToken = await AsyncStorage.getItem('jwtToken');
          let response = await axios.get(url, {
            headers: {
              'Authorization': `Token ${jwtToken}`, 
            }, 
          });
  
          // console.log("xxss", response.data);
          setOrders(response.data);
          setLoading(false);
  
      } catch (error) {
          setLoading(false);
          console.log(error)
      }
    } else {
      console.log("no id provided")
    }
   
  };

  const getUserDetail = async () => {
    try {
        setLoading(true);
        const url = `${baseURL}/user-detail/`
        const jwtToken = await AsyncStorage.getItem('jwtToken');
        let response = await axios.get(url, {
          headers: {
            'Authorization': `Token ${jwtToken}`, 
          }, 
        });

        // console.log("zzww", response.data);
        setUserAuth(response.data);
        setLoading(false);

    } catch (error) {
        setLoading(false);
        console.log(error)
    }
  };

  useEffect(() => { 
    getOrders(); 
    getTotalSum();
    getUserDetail();
  }, [userAuth?.id, isCompleted, isPending]);

  return (
    <SafeAreaView className='bg-white h-full'>
      <StatusBar />

      <Modal
          visible={isPending}
          onRequestClose={()=>setIsPending(false)}
          animationType='fade'
      >
        <View className=''>
            <TouchableOpacity 
                onPress={()=>setIsPending(false)} 
                className=" bg-gray-200 p-2 w-10 h-10 ml-5 mt-5 rounded-full shadow">
                <Icon.ArrowLeft strokeWidth={3} stroke="black" />
            </TouchableOpacity>
        </View>
        <PendingOrder userAuth={userAuth} setIsPending={setIsPending} isPending={isPending} />
      </Modal> 
      <Modal
          visible={isCompleted}
          onRequestClose={()=>setIsCompleted(false)}
          animationType='fade'
      >
        <View className=''>
            <TouchableOpacity 
                onPress={()=>setIsCompleted(false)} 
                className=" bg-gray-200 p-2 w-10 h-10 ml-5 mt-5 rounded-full shadow">
                <Icon.ArrowLeft strokeWidth={3} stroke="black" />
            </TouchableOpacity>
        </View>
        <CompleteOrder userAuth={userAuth} isCompleted={isCompleted} setIsCompleted={setIsCompleted} />
      </Modal> 
      
      <ScrollView>
        <View className='my-10 mx-3'>
            <View className='flex-row items-center px-1'>
                <View className='h-[50px] w-[50px] rounded-xl justify-center items-center overflow-hidden'>
                    <Image source={headerImage} className='h-full w-full' />
                </View>

                <View className='flex-1 justify-center px-2'>
                    <Text className='text-base'>Hi, {userAuth?.username}</Text>
                    <Text className='text-xs opacity-60'>{date}</Text>
                </View>

                <View className='rounded-xl flex-row space-x-2 justify-center items-center overflow-hidden'>
                    <Image source={notification} className='h-[25px] w-[25px]' />
                    <Icon.Power 
                      onPress={logOutFunc}
                      height={25} width={25} 
                      strokeWidth="3.5" stroke="red" 
                    />
                </View>
            </View>
            <>
                <ImageBackground className="mt-5 p-8 overflow-hidden flex flex-row rounded-2xl" source={banner}>
                    <View className='flex-1'>
                        <View className='flex-row items-center'>
                            <Text className='text-white text-xl font-extrabold'>Bienvenido de nuevo</Text>
                        </View>
                    </View>
                </ImageBackground>
                <Image source={model}
                    className='absolute bottom-0 right-0 z-10 h-3/4 w-1/2'
                    resizeMode="contain"
                // style={{transform: [{rotateY: '180deg'}]}}
                />
            </>
        </View>

        <View 
          className='flex justify-center items-center bg-slate-50 rounded-lg shadow-md p-4 mx-5 mt-10'
          style={{shadowColor: "#044244", shadowRadius: 7}}
        >
          <Text className='text-lg font-bold mb-1'>${orderSum?.total_sum}</Text>
          <Text className='text-sm text-gray-600 mb-1'>Monto de la billetera </Text>
          
        </View>

        <View className='p-5 mt-7'>
          <Text className='text-base font-semibold mb-1'>Work Order</Text>
          
          <View className='flex flex-row flex-wrap mb-4'>
            <View className='w-1/2 pr-2'>
              <TouchableOpacity onPress={()=>setIsCompleted(true)} 
                className='py-4 flex items-center rounded-lg shadow-md bg-green-50'
                style={{shadowColor: "#044244", shadowRadius: 7}}
              >
                <Icon.Command 
                  height={20} width={20} 
                  strokeWidth="2.5" stroke="lightgreen" 
                />
                <View className='h-14 w-14 rounded-full mt-3 bg-white justify-center items-center'>
                  <Text className='text-2xl text-green-500 font-bold'>{orders?.received}</Text>
                </View>
                <Text className='text-xs my-2'>Entrega completada</Text>
              </TouchableOpacity>
            </View>
            <View className='w-1/2 pl-2'>
              <TouchableOpacity onPress={()=>setIsPending(true)} 
                className='py-4 flex items-center rounded-lg shadow-md bg-orange-50'
                style={{shadowColor: "#044244", shadowRadius: 7}}
              >
                <Icon.Clock 
                  height={20} width={20} 
                  strokeWidth="2.5" stroke="orange" 
                />
                <View className='h-14 w-14 rounded-full mt-3 bg-white justify-center items-center'>
                  <Text className='text-2xl text-orange-500 font-bold'>{orders?.being_delivered}</Text>
                </View>
                <Text className='text-xs my-2'>Entrega pendiente</Text>
              </TouchableOpacity>
            </View>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  )
}