import React from 'react';
import {
  Box,
  Button,
  CloseButton,
  Heading,
  useColorModeValue,
} from '@chakra-ui/react';
import FilterPanel from './FilterPanel';

const TransactionDetails = ({ onClose }) => {
  const boxBg = useColorModeValue('white', 'gray.700');

  return (
    <Box
      width="400px"
      p={4}
      bg={boxBg}
      h="100vh"
      position="relative"
    >
      <CloseButton position="absolute" right="4" top="4" onClick={onClose} />
      <Heading size="md" mb={4}>
        Transaction Details
      </Heading>
      <FilterPanel/>
    </Box>
  );
};

export default TransactionDetails;
