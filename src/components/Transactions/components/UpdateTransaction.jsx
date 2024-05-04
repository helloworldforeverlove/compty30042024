import React, { useState } from 'react';
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast
} from '@chakra-ui/react';
import { supabase } from './../../../supabaseClient';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {chakra} from '@chakra-ui/react';

function UpdateTransaction() {
  const [transaction, setTransaction] = useState({
    id: '',
    libelle: '',
    date_transaction: new Date(),
    montant_total: '',
    annotations: ''
  });
  const ChakraDatePicker = chakra(DatePicker);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const fetchTransaction = async (id) => {
    if (!id) {
      toast({
        title: 'Error',
        description: 'Please enter a valid transaction ID.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) {
        setTransaction({
          id,
          libelle: data.libelle,
          date_transaction: new Date(data.date_transaction),
          montant_total: data.montant_total,
          annotations: data.annotations
        });
        toast({
          title: 'Transaction Loaded',
          description: 'Modify and update as necessary.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        setTransaction({ id: '', libelle: '', date_transaction: new Date(), montant_total: '', annotations: '' });
        toast({
          title: 'Not Found',
          description: 'No transaction found with the given ID.',
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Fetching Failed',
        description: `Error: ${error.message}`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    const { id, libelle, date_transaction, montant_total, annotations } = transaction;
    if (!id) {
      toast({
        title: 'Error',
        description: 'Please provide the transaction ID.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase
        .from('transactions')
        .update({ libelle, date_transaction, montant_total, annotations })
        .match({ id });

      if (error) throw error;
      toast({
        title: 'Updated Successfully',
        description: 'Transaction updated successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: `Error: ${error.message}`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTransaction(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = date => {
    setTransaction(prev => ({
      ...prev,
      date_transaction: date
    }));
  };

  const handleAmountChange = value => {
    setTransaction(prev => ({
      ...prev,
      montant_total: value
    }));
  };

  return (
    <VStack spacing={4} align="stretch">
      <FormControl>
        <FormLabel>ID de Transaction</FormLabel>
        <Input
          name="id"
          value={transaction.id}
          onChange={handleChange}
          onBlur={() => fetchTransaction(transaction.id)}
        />
      </FormControl>
      <FormControl mt={4}>
        <FormLabel>Libellé</FormLabel>
        <Input
          name="libelle"
          value={transaction.libelle}
          onChange={handleChange}
        />
      </FormControl>
      <FormControl mt={4}>
        <FormLabel>Date</FormLabel>
        <ChakraDatePicker
          selected={transaction.date_transaction}
          onChange={handleDateChange}
          dateFormat="dd/MM/yyyy"
        />
      </FormControl>
      <FormControl mt={4}>
        <FormLabel>Montant</FormLabel>
        <Input
          name="montant_total"
          type="number"
          value={transaction.montant_total}
          onChange={(e) => handleAmountChange(e.target.value)}
        />
      </FormControl>
      <FormControl mt={4}>
        <FormLabel>Annotations</FormLabel>
        <Input
          name="annotations"
          value={transaction.annotations}
          onChange={handleChange}
        />
      </FormControl>
      <Button colorScheme="blue" onClick={handleUpdate} isLoading={loading}>
        Enregistrer les modifications
      </Button>
    </VStack>
  );
}

export default UpdateTransaction;
