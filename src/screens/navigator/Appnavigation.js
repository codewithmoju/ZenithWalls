import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from '../ProjectScreens/SplashScreen';
import WelcomeScreen from '../ProjectScreens/WelcomeScreen';
import Home from '../ProjectScreens/Home';
import BottomSheet, { BottomSheetModalProvider, BottomSheetView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Appnavigation = () => {
  const Stack = createNativeStackNavigator();
  return (
    <GestureHandlerRootView style={{flex:1}}>
      <BottomSheetModalProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName='Welcome'>
            <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
        </BottomSheetModalProvider>
    </GestureHandlerRootView>
  )
}

export default Appnavigation

const styles = StyleSheet.create({})