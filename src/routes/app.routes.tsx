import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';

import { DashBord } from '../screens/DashBord';
import { Register } from '../screens/Register';
import { useTheme } from 'styled-components';
import theme from '../global/styles/theme';
import { Resumo } from '../screens/Resume';

const { Navigator, Screen } = createBottomTabNavigator();

export function AppRoute() {
  return (
    <Navigator
      tabBarOptions={{
        activeTintColor: theme.colors.secondary,
        inactiveTintColor: theme.colors.text,
        labelPosition: 'beside-icon',
        style: {
          paddingVertical: Platform.OS === 'ios' ? 20 : 0,
          height: 75
        }
      }}
    >
      <Screen
        name='Listagem'
        component={DashBord}
        options={{
          tabBarIcon: (({ size, color, }) => (
            <MaterialIcons
              name='format-list-bulleted'
              size={size}
              color={color}
            />
          ))
        }}
      />

      <Screen
        name='Cadastrar'
        component={Register}
        options={{
          tabBarIcon: (({ size, color, }) => (
            <MaterialIcons
              name='attach-money'
              size={size}
              color={color}
            />
          ))
        }}
      />

      <Screen
        name='Resumo'
        component={Resumo}
        options={{
          tabBarIcon: (({ size, color, }) => (
            <MaterialIcons
              name='pie-chart'
              size={size}
              color={color}
            />
          ))
        }}
      />
    </Navigator>
  );
}