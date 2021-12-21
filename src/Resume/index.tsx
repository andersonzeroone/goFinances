import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components';

import { VictoryPie } from 'victory-native';
import { HistoryCard } from '../components/HistoryCard';

import { categories } from '../utils/categories';

import {
  Container,
  Header,
  Title,
  Content,
  ChaContainer
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
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([]);
  const datakey = '@gofinances:transactions';

  const theme = useTheme();

  async function loadData() {
    const response = await AsyncStorage.getItem(datakey);
    const responseFormatted = response ? JSON.parse(response) : [];
    // console.log("🚀 ~ file: index.tsx ~ line 18 ~ loadData ~ responseFormatted", responseFormatted)



    const totalByCategory: CategoryData[] = [];

    const expensives = responseFormatted
      .filter((expensive: TransactionsData) => expensive.type === 'negative');

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
    console.log("🚀 ~ file: index.tsx ~ line 83 ~ loadData ~ totalByCategory", totalByCategory)
  }

  useEffect(() => {
    loadData()
  }, []);

  return (
    <Container>
      <Header>
        <Title>Resumo por categoria</Title>
      </Header>
      <Content >
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

    </Container>
  )
}