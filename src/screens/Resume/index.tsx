import React, { useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RFValue } from 'react-native-responsive-fontsize';
import { addMonths, subMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native'

import { useTheme } from 'styled-components';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

import { VictoryPie } from 'victory-native';
import { HistoryCard } from '../../components/HistoryCard';

import { categories } from '../../utils/categories';

import {
  Container,
  Header,
  Title,
  Content,
  ChaContainer,
  MonthSelect,
  MonthSelectButton,
  MonthSelectIcon,
  Previous,
  Month,
  LoadContainer

} from './styles';

interface TransactionsData {
  type: 'positive' | 'negative';
  name: string;
  amount: string;
  category: string;
  date: string;
}

interface CategoryData {
  key: string;
  name: string;
  total: number;
  totalFormatted: string;
  color: string;
  percentFormateed: string;
  percent: number;
}

export function Resumo() {

  const [isLoading, setIsLoading] = useState(false);
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const datakey = '@gofinances:transactions';

  const theme = useTheme();

  async function loadData() {
    setIsLoading(true);
    const response = await AsyncStorage.getItem(datakey);
    const responseFormatted = response ? JSON.parse(response) : [];
    // console.log("🚀 ~ file: index.tsx ~ line 18 ~ loadData ~ responseFormatted", responseFormatted)



    const totalByCategory: CategoryData[] = [];

    const expensives = responseFormatted
      .filter((expensive: TransactionsData) =>
        expensive.type === 'negative' &&
        new Date(expensive.date).getMonth() === selectedDate.getMonth() &&
        new Date(expensive.date).getUTCFullYear() === selectedDate.getUTCFullYear()
      );

    const expensivesTotal = expensives.reduce((accumulator: number, item: TransactionsData) => {
      return accumulator + Number(item.amount);
    }, 0)

    categories.forEach(category => {
      let categorySum = 0;

      expensives.forEach((expensive: TransactionsData) => {
        if (expensive.category === category.key) {
          categorySum += Number(expensive.amount);
        }
      });

      if (categorySum > 0) {

        const totalFormatted = categorySum
          .toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          });

        const percent = (categorySum / expensivesTotal * 100);

        totalByCategory.push({
          key: category.key,
          name: category.name,
          color: category.color,
          total: categorySum,
          totalFormatted,
          percentFormateed: `${percent.toFixed(0)}%`,
          percent,
        });
      }
    });

    setTotalByCategories(totalByCategory)
    setIsLoading(false);
  }

  useFocusEffect(useCallback(() => {
    loadData()
  }, [selectedDate]));


  function handleDateChange(action: 'next' | 'prev') {
    if (action === 'next') {
      setSelectedDate(addMonths(selectedDate, 1));

    } else {
      setSelectedDate(subMonths(selectedDate, 1))
    }
  }

  return (
    <Container>
      <Header>
        <Title>Resumo por categoria</Title>
      </Header>
      {
        isLoading ?
          <LoadContainer>
            <ActivityIndicator
              color={theme.colors.primary}
              size='large'
            />
          </LoadContainer> :
          <Content
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingBottom: useBottomTabBarHeight()
            }}
          >

            <MonthSelect>
              <MonthSelectButton onPress={() => handleDateChange('prev')} >
                <MonthSelectIcon name='chevron-left' />
                <Previous />
              </MonthSelectButton>

              <Month>
                {format(selectedDate, 'MMMM,yyyy', { locale: ptBR })}
              </Month>

              <MonthSelectButton onPress={() => handleDateChange('next')} >
                <MonthSelectIcon name='chevron-right' />
              </MonthSelectButton>
            </MonthSelect>

            <ChaContainer>
              <VictoryPie
                data={totalByCategories}
                x='percentFormateed'
                y='total'
                colorScale={totalByCategories.map(category => category.color)}
                style={{
                  labels: {
                    fontSize: RFValue(18),
                    fontWeight: 'bold',
                    fill: theme.colors.shape
                  }
                }}
                labelRadius={50}
              />

            </ChaContainer>

            {totalByCategories.map(item => (
              <HistoryCard key={item.key}
                title={item.name}
                amount={item.totalFormatted}
                color={item.color}
              />
            ))
            }
          </Content>
      }
    </Container>
  )
}