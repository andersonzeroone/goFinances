import 'react-native-gesture-handler';
import React from 'react';
import AppLoading from 'expo-app-loading';
import { ThemeProvider } from 'styled-components';
import 'intl';
import 'intl/locale-data/jsonp/pt-BR';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';


import { Routes } from './src/routes';

import theme from './src/global/styles/theme';

import { DashBord } from './src/screens/DashBord';
import { AppRoute } from './src/routes/app.routes';
import { StatusBar } from 'react-native';
import { SignIn } from './src/screens/SignIn';
import { AuthProvider, useAuth } from './src/hooks/auth';


export default function App() {

  const { isUserStorageLoading } = useAuth();

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold
  });

  if (!fontsLoaded || isUserStorageLoading) {
    return <AppLoading />
  }


  return (
    <ThemeProvider theme={theme}>
      <StatusBar barStyle='light-content' backgroundColor='#5636D3' />
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </ThemeProvider>
  );
}
