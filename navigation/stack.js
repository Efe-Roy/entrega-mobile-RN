import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import MainScreen from '../screens/MainScreen';
import { useDispatch, useSelector } from 'react-redux';
import Splash from '../components/Splash';
import LoginScreen from '../screens/auth/LoginScreen';
import { useEffect } from 'react';
import { errorAuth, initAuth, successAuth } from '../redux/features/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

export const HomeStack = () => {
  return (
    <Stack.Navigator 
      initialRouteName='Welcome' 
      screenOptions={{headerShown: false}}
    >
      <Stack.Screen name="Main" component={MainScreen} />
    </Stack.Navigator>
  );
}

export const AuthStack = () => {
  const authData = useSelector(state => state.auth)
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchToken = async () => {
      try {
        dispatch(initAuth());
        const jwtToken = await AsyncStorage.getItem('jwtToken');
        if (jwtToken !== null) {
          dispatch(successAuth());
          setTimeout(() => {
            navigation.navigate('Main');
          }, 1000);
            // console.log(jwtToken)
            // navigation.navigate('Home')
        } else {
            // navigation.navigate('Login');
            dispatch(errorAuth());
            setTimeout(() => {
              navigation.navigate('Login');
            }, 1000);
        }
      } catch (error) {
        console.error('Error retrieving token:', error);
      }
    };

    fetchToken();
  }, [authData.isLoggedIn]);

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {authData.Loading ? (
        <Stack.Screen
          name="Splash"
          component={Splash}
        />
      ) : authData.isLoggedIn ? (
        <>
          <Stack.Screen name="Main" component={MainScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function Navigation() {
  return (
    <NavigationContainer>
      {/* <HomeStack /> */}
      <AuthStack />
    </NavigationContainer>
  );
}