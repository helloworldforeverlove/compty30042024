import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  FormErrorMessage,
  useToast,
} from '@chakra-ui/react';
import { v4 as uuidv4 } from 'uuid'; // Import uuid
import { supabase } from './../../../../supabaseClient';

function TransactionForm() {
  const [libelle, setLibelle] = useState('');
  const [dateTransaction, setDateTransaction] = useState('');
  const [montantTotal, setMontantTotal] = useState(0);
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const toast = useToast();

  const handleFileChange = e => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    let justificatifsUrl = null;
  
    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`; // Use uuid to generate a unique file name
      console.log('Uploading file:', fileName); // Debug: Log file name before upload
  
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('justificatifs')
        .upload(fileName, file);
  
      if (uploadError) {
        console.error('Upload error:', uploadError); // Debug: Log upload error
        toast({
          title: "Failed to upload file.",
          description: uploadError.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }
  
      console.log('Upload success:', uploadData); // Debug: Log upload success data
  
      // Using getPublicUrl correctly
      const { publicURL } = supabase.storage.from('justificatifs').getPublicUrl(fileName);
      console.log('File URL:', publicURL); // Debug: Log the retrieved public URL
      if (publicURL) {
        justificatifsUrl = publicURL;
      } else {
        // Manually constructing the URL if getPublicUrl fails
        justificatifsUrl = `https://iholojdqmdamozagajwk.supabase.co/storage/v1/object/public/justificatifs/${fileName}`;
    }
    }
    
    const formData = {
    libelle,
    date_transaction: dateTransaction,
    montant_total: Number(montantTotal),
    ventilations: [], // Provide an empty array as the default value
    justificatifs_url: justificatifsUrl ? [{ url: justificatifsUrl }] : [] // Ensure this matches your schema expectation
    };
    
    console.log('Form data before insert:', formData); // Debug: Log form data before insertion
    
    // Insert the data into the transactions table
    const { error: insertError, data: insertData } = await supabase
    .from('transactions')
    .insert([formData]);
    
    if (insertError) {
    console.error('Insert error:', insertError); // Debug: Log insert error
    toast({
    title: "Failed to create transaction.",
    description: insertError.message,
    status: "error",
    duration: 5000,
    isClosable: true,
    });
    return;
    }
    
    console.log('Insert success:', insertData); // Debug: Log success data after insertion
    toast({
    title: "Transaction created.",
    description: "Your transaction has been successfully created.",
    status: "success",
    duration: 5000,
    isClosable: true,
    });
    };
  
  

  return (
    <Box p={5} shadow="md" borderWidth="1px">
      <form onSubmit={handleSubmit}>
        <FormControl isInvalid={errors.libelle}>
          <FormLabel htmlFor="libelle">Libelle</FormLabel>
          <Input id="libelle" value={libelle} onChange={(e) => setLibelle(e.target.value)} placeholder="Libelle" />
          {errors.libelle && <FormErrorMessage>{errors.libelle}</FormErrorMessage>}
        </FormControl>

        <FormControl mt={4}>
          <FormLabel htmlFor="date_transaction">Date of Transaction</FormLabel>
          <Input type="date" id="date_transaction" value={dateTransaction} onChange={(e) => setDateTransaction(e.target.value)} />
        </FormControl>

        <FormControl mt={4}>
          <FormLabel htmlFor="montant_total">Total Amount</FormLabel>
          <NumberInput value={montantTotal} onChange={valueString => setMontantTotal(valueString)}>
            <NumberInputField id="montant_total" />
          </NumberInput>
        </FormControl>

        <FormControl mt={4}>
          <FormLabel htmlFor="files">Upload Justificatif</FormLabel>
          <Input type="file" id="files" onChange={handleFileChange} />
        </FormControl>

        <Button mt={4} colorScheme="teal" type="submit">
          Submit
        </Button>
      </form>
    </Box>
  );
}

export default TransactionForm;