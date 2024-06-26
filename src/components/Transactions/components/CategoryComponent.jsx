import React, { useState } from 'react';
import {
  Box, Flex, Heading, Tag, VStack, SimpleGrid, Container, Input, useColorModeValue
} from '@chakra-ui/react';
import {
  FcBullish, FcDebt, FcFactory, FcAutomotive, FcAlarmClock, FcDonate
} from 'react-icons/fc';

const categories = {
  Revenues: ['Apport personnel', 'Recette', 'Recette secondaire', 'Redevance de collaboration perçue', 'Autre gain divers', 'Vente d’une immobilisation', 'Emprunt', 'Caution reçue'],
  Remunerations: ['Prélèvement personnel', 'Dépense personnelle', 'Rétrocession versée', 'Redevance de collaboration versée', 'Honoraires payés', '[Salariés] Salaire net', '[Salariés] Impôt à la source', '[Salariés] Charge sociale'],
  Functionnement: ['Immobilisation', 'Matériel et outillage', 'Achat', 'Frais divers', 'Télécom, fournitures, documents', 'Frais d’acte et de contentieux', 'Débours pour vos clients', 'Virement interne'],
  Deplacements: ['À catégoriser', 'Formation', 'Réception et congrès', 'Restaurant et repas d’affaires', 'Frais de repas hors domicile', 'Frais de déplacement', 'Véhicule et carburant', 'Location de matériel'],
  FraisFixes: ['Emprunt', 'Compte commun ou SCM', 'Loyer et charge locative', 'Caution versée', 'Entretien et réparation', 'Abonnement logiciel', 'Eau, gaz, électricité', 'Assurance professionnelle'],
  CotisationsEtTaxes: ['Cotisation sociale Urssaf', 'Cotisation retraite', 'Cotisation facultative', 'Cotisation professionnelle', 'CFE', 'Autre impôt', 'Amende et pénalité']
};

const icons = {
  Revenues: <FcBullish />,
  Remunerations: <FcDebt />,
  Functionnement: <FcFactory />,
  Deplacements: <FcAutomotive />,
  FraisFixes: <FcAlarmClock />,
  CotisationsEtTaxes: <FcDonate />
};

const CategoryComponent = () => {
  const [selectedItem, setSelectedItem] = useState('');
  const hoverBg = useColorModeValue("green.100", "green.700"); // Light or dark mode friendly hover background
  const activeBg = useColorModeValue("blue.300", "blue.800"); // Click effect background

  return (
    <Container maxW="container.xxl">
      <Input
        value={selectedItem}
        placeholder="Click on an item to see it here..."
        readOnly
        mb={4}
      />
      <SimpleGrid columns={6} spacing={5}>
        {Object.keys(categories).map((categoryKey) => (
          <Box p={5} borderWidth="1px" borderRadius="lg" key={categoryKey}>
            <Flex align="center" fontSize="xl">
              {icons[categoryKey]}
              <Heading as="h3" ml={3} fontSize="xl">{categoryKey}</Heading>
            </Flex>
            <VStack align="start">
              {categories[categoryKey].map((item, index) => (
                <Tag size="md" variant="solid" key={index} _hover={{
                  background: hoverBg,
                  transform: 'scale(1.1)',
                  transition: 'background-color 0.2s, transform 0.2s'
                }} _active={{
                  background: activeBg,
                  transform: 'scale(0.9)',
                  transition: 'background-color 0.1s, transform 0.1s'
                }} onClick={(event) => {
                  event.preventDefault(); // Prevent default link behavior
                  setSelectedItem(item);
                }}>
                  {item}
                </Tag>
              ))}
            </VStack>
          </Box>
        ))}
      </SimpleGrid>
    </Container>
  );
};

export default CategoryComponent;
