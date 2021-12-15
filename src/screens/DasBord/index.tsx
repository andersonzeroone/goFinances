import React from 'react';
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
  const data: DataListProps[] = [
    {

      id: '0',
      type: 'positive',
      title: 'Desenvolvimento de site',
      amount: 'R$ 12.000,00',
      category: {
        name: 'vendas',
        icon: 'dollar-sign'
      },
      date: '12/15/2021',
    },
    {
      id: '1',
      type: 'negative',
      title: 'Hamburgueria Pizzy',
      amount: 'R$ 5.000,00',
      category: {
        name: 'Alimentação',
        icon: 'coffee'
      },
      date: '12/15/2021',
    },

    {
      id: '2',
      type: 'positive',
      title: 'Aluguel do apartamento',
      amount: 'R$ 1.000,00',
      category: {
        name: 'casa',
        icon: 'shopping-bag'
      },
      date: '12/15/2021',
    },
  ]

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
