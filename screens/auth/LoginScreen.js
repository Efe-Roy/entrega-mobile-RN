import React, { useState } from 'react';
import { SafeAreaView, View, Image, Text, TouchableOpacity, TextInput, Pressable, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native'
import { useDispatch } from 'react-redux';
import { errorAuth, getAuth, initAuth, successAuth } from '../../redux/features/authSlice';
import Toast from 'react-native-toast-message'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Icon from "react-native-feather";
import { baseURL } from '../../redux/utils';

export default function LoginScreen() {
  const navigation = useNavigation();
    const dispatch = useDispatch();
    const [isPasswordShown, setIsPasswordShown] = useState(false);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
      username: '',
      password: '',
    });

  const handleLogin = async () => {
    // console.log(form)
    try {
      setLoading(true);
      dispatch(initAuth());
      const response = await axios.post(`${baseURL}/login/`, form);
      if (response.data.is_rider){
        await AsyncStorage.setItem('jwtToken', response.data.token);
        await AsyncStorage.setItem('user', JSON.stringify(response.data));
        dispatch(getAuth(response.data));
        dispatch(successAuth());
        showToastSuccess('Logged in Successfully');
        setLoading(false);
        navigation.navigate('Main');
      } else {
        showToast('No tienes permiso para iniciar sesión ');
        setLoading(false);
        dispatch(errorAuth());
      }
      // console.log(response.data);
    } catch (error) {
        showToast('Credenciales no válidas');
        setLoading(false);
        console.log(error)
    }
  };

  const showToast = (message) => {
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: message
    });
  }
  const showToastSuccess = (message) => {
    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: message
    });
  }
  
  return (
    <SafeAreaView className='flex-1 bg-[#e8ecf4]'>
      <View className='py-6 px-0 flex-grow flex-shrink flex-basis-0'>
          <View className='justify-center items-center my-10'>
              <View className='bg-white p-3 rounded-full mb-4'>
                <Icon.Activity 
                    className='text-purple-600'
                    height={80} width={80} 
                    strokeWidth="2.5" 
                />
              </View>

            <Text className='text-[31px] font-bold text-gray-800 mb-1'> Iniciar sesión </Text>

            <Text className='my-3 font-bold text-lg text-center'>
            ¡Hola, bienvenido de nuevo! 👋
            </Text>
          </View>


          <View className='mb-6 px-6 flex-grow flex-shrink flex-basis-0'>
            <View className='mb-4'>
              <Text className='text-base font-semibold text-gray-700 mb-2'>Nombre de usuario</Text>

              <TextInput
                autoCapitalize="none"
                // autoCorrect={false}
                // keyboardType="email-address"
                onChangeText={username => setForm({ ...form, username })}
                placeholder="John Doe"
                placeholderTextColor="#6b7280"
                className='h-12 bg-white px-4 rounded-xl text-base font-medium text-gray-700 border border-gray-300'
                value={form.username} />
            </View>

            <View className='mb-4'>
              <Text className='text-base font-semibold text-gray-700 mb-2'>Contraseña</Text>

              <TextInput
                autoCapitalize="none"
                // autoCorrect={false}
                onChangeText={password => setForm({ ...form, password })}
                placeholder="********"
                placeholderTextColor="#6b7280"
                className='h-12 bg-white px-4 rounded-xl text-base font-medium text-gray-700 border border-gray-300'
                secureTextEntry={true}
                value={form.password} />
            </View>

            <View className='mt-1 mb-4'>
              {loading? 
                <View className='flex flex-row items-center justify-center rounded-lg py-2 px-4 border-2 border-purple-600 bg-gray-600'>
                  <Text className='text-lg leading-7 font-semibold text-white'>Cargando ...</Text>
                </View> :
                <TouchableOpacity onPress={() => handleLogin()}>
                  <View className='flex flex-row items-center justify-center rounded-lg py-2 px-4 border-2 border-purple-600 bg-purple-600'>
                    <Text className='text-lg leading-7 font-semibold text-white'>Enviar</Text>
                  </View>
                </TouchableOpacity>
              }
            </View>

            <Text className='text-base font-semibold text-purple-600 text-center'>Has olvidado tu contraseña?</Text>
          </View>

      </View>

      {/* <View className='flex-1 mx-6'>
        <View className='my-6'>
            <Text className='my-3 font-bold text-lg'>
                Hi Welcome Back ! 👋
            </Text>

            <Text className='text-base text-black'>Hello again you have been missed!</Text>
        </View>

        <View className='mb-3'>
            <Text className='text-xs font-semibold my-2'>Email address</Text>

            <View className='w-full h-12 border-gray-500 border-2 rounded-lg justify-center items-center pl-6' >
                <TextInput
                    placeholder='Enter your email address'
                    className='text-gray-500 w-full'
                    keyboardType='email-address'
                />
            </View>
        </View>

        <View className='mb-3'>
            <Text className='text-xs font-semibold my-2'>Password</Text>

            <View className='w-full h-12 border-gray-500 border-2 rounded-lg justify-center items-center pl-6' >
                <TextInput
                    placeholder='Enter your password'
                    className='text-gray-500 w-full'
                    secureTextEntry={isPasswordShown}
                />
                <TouchableOpacity
                    onPress={() => setIsPasswordShown(!isPasswordShown)}
                    style={{
                        position: "absolute",
                        right: 12
                    }}
                >
                    {
                        isPasswordShown == true ? (
                            <Icon.EyeOff 
                              className='text-black'
                              height={25} width={25} 
                              strokeWidth="2.5" 
                            />
                            // <Ionicons name="eye-off" size={24} color={COLORS.black} />
                            ) : (
                            <Icon.Eye 
                              className='text-black'
                              height={25} width={25} 
                              strokeWidth="2.5" 
                            />
                            // <Ionicons name="eye" size={24} color={COLORS.black} />
                        )
                    }

                </TouchableOpacity>
            </View>
        </View>

       

        <Button
            title="Login"
            filled
            className='rounded-xl mt-5 mb-1'
        />

        <View style={{
            flexDirection: "row",
            justifyContent: "center",
            marginVertical: 22
        }}>
            <Text className='text-black'
            // style={{ fontSize: 16, color: COLORS.black }}
            >Don't have an account ? </Text>
            <Pressable
                // onPress={() => navigation.navigate("Signup")}
            >
                <Text className='text-purple-500 text-base font-bold ml-2'>Register</Text>
            </Pressable>
        </View>
      </View> */}
    </SafeAreaView>
  )
}

