import 'react-native-gesture-handler';
import React from 'react';
import AppLoading from 'expo-app-loading';
import { ThemeProvider } from 'styled-components';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';


import { NavigationContainer } from '@react-navigation/native';
import theme from './src/global/styles/theme';

import { DashBord } from './src/screens/DasBord';
import { AppRoute } from './src/routes/app.routes';


export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold
  });

  if (!fontsLoaded) {
    return <AppLoading />
  }


  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer>
        <AppRoute />
      </NavigationContainer>
    </ThemeProvider>
  );
}