import React, { useEffect, useState } from 'react';
import {
  Keyboard,
  Modal,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import uuid from 'react-native-uuid';

import { Button } from '../../components/Form/Button';
import { CategorySelectButton } from '../../components/Form/CategorySelectButton';
import { InputForm } from '../../components/Form/InputForm';
import { TransactionsTypeButton } from '../../components/Form/TransactionTypeButton';

import { CategorySelect } from '../CategorySelect';

import {
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionsTypes
} from './styles';

interface FormData {
  name: string;
  amount: string;
}


const schema = yup.object().shape({
  name: yup
    .string()
    .required('Nome obrigatório'),
  amount: yup
    .number()
    .typeError('Informe um valor númerico')
    .positive('O valor não pode ser negativo')
    .required('Valor obrigatório')

});

export function Register() {

  const navigation = useNavigation();

  const datakey = '@gofinances:transactions';

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  const [transactionsType, setTransactionsType] = useState('');
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  const [category, setCategory] = useState({
    key: 'category',
    name: 'Categoria',
  });

  function handleTransactionTypeSelect(type: 'positive' | 'negative') {
    setTransactionsType(type)
  }

  function handleOpenSelectCategoryModal() {
    setCategoryModalOpen(true);
  }


  function handleCloseSelectCategoryModal() {
    setCategoryModalOpen(false);
  }

  async function handleSubmitForm(form: FormData) {

    if (!transactionsType) {
      return Alert.alert("Selecione o tipo de transação")
    }

    if (category.key === 'category') {
      return Alert.alert("Selecione a gategoria")
    }

    const newTranslation = {
      id: String(uuid.v4()),
      name: form.name,
      amount: form.amount,
      type: transactionsType,
      category: category.key,
      date: new Date()
    }

    try {
      const data = await AsyncStorage.getItem(datakey);
      const currentData = data ? JSON.parse(data) : [];

      const dataFormated = [
        ...currentData,
        newTranslation
      ]
      await AsyncStorage.setItem(datakey, JSON.stringify(dataFormated));

      reset()
      setTransactionsType('')
      setCategory({
        key: 'category',
        name: 'Categoria',
      })

      navigation.navigate('Listagem');

    } catch (erro) {
      console.log(erro)
      Alert.alert('Não foi possivel salvar.')
    }
  }

  useEffect(() => {
    async function getItemsAsyncStorage() {
      const data = await AsyncStorage.getItem(datakey);
      console.log("🚀 ~ file: index.tsx ~ line 109 ~ getItemsAsyncStorage ~ data", JSON.parse(data!))
      // await AsyncStorage.removeItem(datakey);
    }
    getItemsAsyncStorage();
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Header>
          <Title>Cadastro</Title>
        </Header>

        <Form>
          <Fields>
            <InputForm
              control={control}
              name="name"
              placeholder='Nome'
              autoCapitalize="sentences"
              autoCorrect={false}
              error={errors.name && errors.name.message}
            />

            <InputForm
              control={control}
              name="amount"
              placeholder='Valor'
              keyboardType='numeric'
              error={errors.amount && errors.amount.message}
            />

            <TransactionsTypes>
              <TransactionsTypeButton
                isActive={transactionsType === 'positive'}
                type="up"
                title='Income'
                onPress={() => handleTransactionTypeSelect('positive')}
              />

              <TransactionsTypeButton
                isActive={transactionsType === 'negative'}
                type="down"
                title='Outcome'
                onPress={() => handleTransactionTypeSelect('negative')}
              />
            </TransactionsTypes>

            <CategorySelectButton
              title={category.name}
              onPress={handleOpenSelectCategoryModal}
            />
          </Fields>


          <Button
            title='Enviar'
            onPress={handleSubmit(handleSubmitForm)}
          />
        </Form>

        <Modal visible={categoryModalOpen}>
          <CategorySelect
            category={category}
            setCategory={setCategory}
            closeSelectCategory={handleCloseSelectCategoryModal}
          />
        </Modal>
      </Container>
    </TouchableWithoutFeedback>

  )
}