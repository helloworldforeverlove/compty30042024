import React, { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
  Text,
  useColorModeValue,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import { FaPlus } from 'react-icons/fa';
import { FcFullTrash } from 'react-icons/fc';

const VentilationComponent = () => {
  const [ventilations, setVentilations] = useState([
    { category: 'Dépense personnelle', amount: '-0.99', percentage: 100 },
  ]);

  const bgColor = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const addVentilation = () => {
    setVentilations([...ventilations, { category: '', amount: '', percentage: 0 }]);
  };

  const removeVentilation = index => {
    const newVentilations = ventilations.filter((_, i) => i !== index);
    setVentilations(newVentilations);
  };

  return (
    <Box p={4} bg={bgColor} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
      <Text fontSize="lg" fontWeight="semibold" mb={4}>
        Ventilation(s)
      </Text>
      {ventilations.map((ventilation, index) => (
        <Box key={index} mb={4} p={4} bg="white" borderRadius="lg" boxShadow="sm">
          <Flex justify="space-between" align="center">
            <Text fontWeight="medium">Ventilation {index + 1}</Text>
            <Tooltip label="Supprimer cette ventilation" hasArrow placement="top">
              <IconButton
                aria-label="Remove ventilation"
                icon={<FcFullTrash />}
                size="sm"
                variant="ghost"
                onClick={() => removeVentilation(index)}
              />
            </Tooltip>
          </Flex>
          <FormControl mt={4}>
            <FormLabel>Catégorie</FormLabel>
            <Select placeholder="Sélectionnez une catégorie" defaultValue={ventilation.category}>
              {/* Add category options here */}
              <option value="personal">Dépense personnelle</option>
              {/* ... other categories */}
            </Select>
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Montant</FormLabel>
            <Input type="number" value={ventilation.amount} />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Pourcentage</FormLabel>
            <Input type="number" value={ventilation.percentage} />
          </FormControl>
        </Box>
      ))}
      <Button leftIcon={<FaPlus />} colorScheme="blue" variant="outline" onClick={addVentilation} mt={2}>
        Ajouter une ventilation
      </Button>
    </Box>
  );
};

export default VentilationComponent;
