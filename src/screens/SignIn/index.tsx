import React from 'react';
import { RFValue } from 'react-native-responsive-fontsize';

import AppleSvg from '../../assets/apple.svg';
import GoolgeSvg from '../../assets/google.svg';
import LogoSvg from '../../assets/logo.svg';
import { SignInSocialButton } from '../../components/SignInSocialButton';

import {
  Container,
  Header,
  TitleWrapper,
  Title,
  SignInTitles,
  Footer,
  FooterWrapper
} from './styles';


export function SignIn() {
  return (
    <Container>
      <Header>
        <TitleWrapper>
          <LogoSvg
            width={RFValue(120)}
            height={RFValue(68)}
          />
          <Title>
            Controle suas {'\n'}
            finanças de forma{'\n'}
            muito simples
          </Title>
        </TitleWrapper>

        <SignInTitles>
          Faça seu login com {'\n'}
          umas das contas a baixo
        </SignInTitles>
      </Header>

      <Footer>
        <FooterWrapper>
          <SignInSocialButton
            title='Entrar com o Google'
            svg={GoolgeSvg}
          />

          <SignInSocialButton
            title='Entrar com o Apple'
            svg={AppleSvg}
          />
        </FooterWrapper>

      </Footer>

    </Container>
  )
}