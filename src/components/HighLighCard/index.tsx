import React from 'react';

import {
  Container,
  Header,
  Title,
  Icon,
  Footer,
  Amount,
  LastTransaction
} from './styles';

export function HighLightCard(){
  return(
    <Container>
      <Header>
        <Title>Entrada</Title>
        <Icon name="arrow-up-circle"/>
      </Header>
      <Footer>
        <Amount>R$ 15.400,00</Amount>
        <LastTransaction>lasdasdasdasd</LastTransaction>
      </Footer>
    </Container>
  )
}