import React, { useState } from 'react';
import {
  Keyboard,
  Modal,
  TouchableWithoutFeedback,
  Alert
} from 'react-native';

import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { Button } from '../../components/Form/Button';
import { CategorySelectButton } from '../../components/Form/CategorySelectButton';
import { InputForm } from '../../components/Form/InputForm';
import { Input } from '../../components/Form/Input';
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

  const {
    control,
    handleSubmit,
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

  function handleTransactionTypeSelect(type: 'up' | 'down') {
    setTransactionsType(type)
  }

  function handleOpenSelectCategoryModal() {
    setCategoryModalOpen(true);
  }


  function handleCloseSelectCategoryModal() {
    setCategoryModalOpen(false);
  }

  function handleSubmitForm(form: FormData) {

    if (!transactionsType) {
      return Alert.alert("Selecione o tipo de transação")
    }

    if (category.key === 'category') {
      return Alert.alert("Selecione a gategoria")
    }

    const data = {
      name: form.name,
      amount: form.amount,
      transactionsType,
      category: category.key
    }
    console.log("🚀 ~ file: index.tsx ~ line 62 ~ handleSubmitForm ~ data", data)
  }

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
                isActive={transactionsType === 'up'}
                type="up"
                title='Income'
                onPress={() => handleTransactionTypeSelect('up')}
              />

              <TransactionsTypeButton
                isActive={transactionsType === 'down'}
                type="down"
                title='Outcome'
                onPress={() => handleTransactionTypeSelect('down')}
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