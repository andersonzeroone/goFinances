import React, { useCallback, useEffect, useState } from 'react';
import { useTheme } from 'styled-components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native'
import { ActivityIndicator } from 'react-native';
import { HighLightCard } from '../../components/HighLighCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';

import {
  Container,
  Header,
  UserContainer,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  Icon,
  HighLightCards,
  Transactions,
  Title,
  TransactionsList,
  LogoutButton,
  LoadContainer
} from './styles';

export interface DataListProps extends TransactionCardProps {
  id: string;
}

interface HighLightProps {
  amount: string;
  lastTransaction: string;
}

interface HighLightData {
  entries: HighLightProps;
  expensive: HighLightProps;
  total: HighLightProps;
}


export function DashBord() {

  const theme = useTheme();

  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<DataListProps[]>([]);
  const [highLightData, setHighLightData] = useState<HighLightData>({} as HighLightData);

  async function loadTransactions() {
    const datakey = '@gofinances:transactions';
    const response = await AsyncStorage.getItem(datakey);
    const transactions = response ? JSON.parse(response) : [];

    let entriesSum = 0;
    let expensiveTotal = 0;

    const transactionsFormated: DataListProps[] = transactions
      .map((item: DataListProps) => {

        if (item.type === 'positive') {
          entriesSum += Number(item.amount)
        } else {
          expensiveTotal += Number(item.amount)
        }

        const amount = Number(item.amount)
          .toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          });

        const date = Intl.DateTimeFormat('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit'
        }).format(new Date(item.date));

        return {
          id: item.id,
          name: item.name,
          amount,
          type: item.type,
          category: item.category,
          date
        }
      });

    setTransactions(transactionsFormated);

    const lastTransactionEntries = getLastTransactionDate(transactions, 'positive');
    const lastTransactionExpensive = getLastTransactionDate(transactions, 'negative');
    const totalInterval = `01 a ${lastTransactionExpensive}`;
    const total = entriesSum - expensiveTotal;

    setHighLightData({
      entries: {
        amount: entriesSum
          .toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }),
        lastTransaction: transactions === [] ?
          `Última entrada dia ${lastTransactionEntries}` :
          'Sem entradas'
      },
      expensive: {
        amount: expensiveTotal
          .toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }),
        lastTransaction: transactions === [] ?
          `Última saida dia ${lastTransactionExpensive}` :
          'Sem saidas'
      },
      total: {
        amount: total
          .toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }),
        lastTransaction: transactions === [] ? totalInterval : 'Sem movitação'
      },
    })

    setIsLoading(false)


  }

  useEffect(() => {
    loadTransactions()
  }, []);

  useFocusEffect(useCallback(() => {
    loadTransactions()
  }, []));

  function getLastTransactionDate(
    collections: DataListProps[],
    type: 'positive' | 'negative'
  ) {

    const lastTransaction = new Date(
      Math.max.apply(Math, collections
        .filter(collection => collection.type === type)
        .map(collection => new Date(collection.date).getTime())))


    // return Intl.DateTimeFormat('pt-BR', {
    //   day: '2-digit',
    //   month: '2-digit',
    //   year: '2-digit'
    // }).format(new Date(lastTransaction));

    return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString('pt-BR', { month: 'short', })}.`
  }

  function cleanTransaction() {
    const datakey = '@gofinances:transactions';
    AsyncStorage.removeItem(datakey);
  }
  return (
    <Container>

      {

        isLoading ?
          <LoadContainer>
            <ActivityIndicator
              color={theme.colors.primary}
              size='large'
            />
          </LoadContainer> :
          <>
            <Header>
              <UserContainer>
                <UserInfo>
                  <Photo source={{ uri: 'https://avatars.githubusercontent.com/u/33969430?v=4' }} />
                  <User>
                    <UserGreeting>Olé,</UserGreeting>
                    <UserName>Anderson</UserName>
                  </User>
                </UserInfo>
                <LogoutButton onPress={cleanTransaction}>
                  <Icon name='power' />
                </LogoutButton>

              </UserContainer>
            </Header>
            <HighLightCards>
              <HighLightCard
                type='up'
                title='Entradas'
                amount={highLightData?.entries?.amount}
                lastTransaction={highLightData?.entries?.lastTransaction}
              />
              <HighLightCard
                type='down'
                title='Saidas'
                amount={highLightData?.expensive?.amount}
                lastTransaction={highLightData?.expensive?.lastTransaction}
              />
              <HighLightCard
                type='total'
                title='Resumo'
                amount={highLightData?.total?.amount}
                lastTransaction={highLightData?.total?.lastTransaction}
              />
            </HighLightCards>

            <Transactions>
              <Title>Listagem</Title>

              <TransactionsList
                data={transactions}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <TransactionCard data={item} />}
              />

            </Transactions>
          </>}

    </Container>
  )
}
