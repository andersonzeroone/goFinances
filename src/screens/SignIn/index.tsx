import React from 'react';
import { Alert } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

import AppleSvg from '../../assets/apple.svg';
import GoolgeSvg from '../../assets/google.svg';
import LogoSvg from '../../assets/logo.svg';
import { SignInSocialButton } from '../../components/SignInSocialButton';

import { useAuth } from '../../hooks/auth';

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

  const { user, signWinthGoogle, signWinthApple } = useAuth();

  async function handleSignWinthGoogle() {
    try {

      await signWinthGoogle()

    } catch (error) {
      console.log("🚀 ~ file: index.tsx ~ line 30 ~ handleSignWinthGoogle ~ error", error)
      Alert.alert('tente novamente')

    }
  }

  async function handleSignWinthApple() {
    try {

      await signWinthApple()

    } catch (error) {
      console.log("🚀 ~ file: index.tsx ~ line 30 ~ handleSignWinthGoogle ~ error", error)
      Alert.alert('tente novamente')

    }
  }
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
            onPress={handleSignWinthGoogle}
            title='Entrar com o Google'
            svg={GoolgeSvg}
          />

          <SignInSocialButton
            onPress={handleSignWinthApple}
            title='Entrar com o Apple'
            svg={AppleSvg}
          />
        </FooterWrapper>

      </Footer>

    </Container>
  )
}