import React, { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native'

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
  LogoutButton
} from './styles';

export interface DataListProps extends TransactionCardProps {
  id: string;
}

export function DashBord() {

  const [data, setData] = useState<DataListProps[]>([]);


  async function loadTransactions() {
    const datakey = '@gofinances:transactions';
    const response = await AsyncStorage.getItem(datakey);
    const transactions = response ? JSON.parse(response) : [];

    const transactionsFormated: DataListProps[] = transactions
      .map((item: DataListProps) => {
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

    setData(transactionsFormated)


  }

  useEffect(() => {
    loadTransactions()
  }, []);

  useFocusEffect(useCallback(() => {
    loadTransactions()
  }, []));

  return (
    <Container>
      <Header>

        <UserContainer>
          <UserInfo>
            <Photo source={{ uri: 'https://avatars.githubusercontent.com/u/33969430?v=4' }} />
            <User>
              <UserGreeting>Olé,</UserGreeting>
              <UserName>Anderson</UserName>
            </User>
          </UserInfo>
          <LogoutButton onPress={() => { }}>
            <Icon name='power' />
          </LogoutButton>

        </UserContainer>
      </Header>
      <HighLightCards>
        <HighLightCard />
        <HighLightCard />
        <HighLightCard />
      </HighLightCards>

      <Transactions>
        <Title>Listagem</Title>

        <TransactionsList
          data={data}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <TransactionCard data={item} />}
        />

      </Transactions>


    </Container>
  )
}
