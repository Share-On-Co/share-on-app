import React from 'react'; // Add this line to import the 'React' module

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import { useColorScheme } from '@/hooks/useColorScheme';
import LoginScreen from './auth/login';
import Register from './auth/register';
import ChatbotScreen from './chat';
import 'react-native-polyfill-globals/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
const Stack = createStackNavigator();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loggedIn, setLoggedIn] = React.useState(false);

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    const fetchData = async () => {
      if (loggedIn) {
        await AsyncStorage.setItem('loggedIn', 'true');
        setLoggedIn(true);
      }
      else {
        const value = await AsyncStorage.getItem('loggedIn');
        if (value === 'true') {
          setLoggedIn(true);
        }
        else {
          setLoggedIn(false);
        }
      }
    };
  
    fetchData();
  
    return () => {
      // Cleanup logic here
    };
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          ...TransitionPresets.ModalSlideFromBottomIOS,
          headerBackTitle: ''
        }}>
          { loggedIn ? (
            <Stack.Screen name="chat" component={ChatbotScreen} />
          ) : (
            <Stack.Group>
            <Stack.Screen name="auth/login" component={() => <LoginScreen setLoggedIn={setLoggedIn}/>} />
            <Stack.Group screenOptions={{presentation: 'modal'}}>
              <Stack.Screen name="auth/register" component={Register} options={{headerShown: true, headerTransparent: true, headerTitle: ''}}/>
            </Stack.Group>
            <Stack.Screen name="chat" component={ChatbotScreen} />
          </Stack.Group>
          )}
      </Stack.Navigator>
  );
}
