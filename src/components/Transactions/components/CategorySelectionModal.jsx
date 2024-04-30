import React from 'react';
import {
  Box, Flex, IconButton, Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalBody, SimpleGrid, Tag, VStack, Heading, FormControl, FormLabel, Input, Container, useColorModeValue,
} from '@chakra-ui/react';
import { FaTimes } from 'react-icons/fa';
import { FcFullTrash, FcBullish, FcDebt, FcFactory, FcAutomotive, FcAlarmClock, FcDonate } from 'react-icons/fc';

function CategorySelectionModal({ categories, isOpen, onClose, onSelectCategory, activeIndex }) {
  const icons = {
    Revenues: <FcBullish />,
    Remunerations: <FcDebt />,
    Functionnement: <FcFactory />,
    Deplacements: <FcAutomotive />,
    FraisFixes: <FcAlarmClock />,
    CotisationsEtTaxes: <FcDonate />
  };

  const iconColor = useColorModeValue('gray.200', 'gray.300');
  const bgColor = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const hoverBg = useColorModeValue("green.100", "green.700");
  const activeBg = useColorModeValue("blue.300", "blue.800");
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full" overflow="auto">
      <ModalOverlay />
      <ModalContent m={0} maxW="100vw">
        <ModalHeader>
          Affecter une Catégorie
          <IconButton
            aria-label="Close modal"
            icon={<FaTimes />}
            onClick={onClose}
            position="absolute"
            right="8px"
            top="8px"
            size="sm"
          />
        </ModalHeader>
        <ModalBody>
            <Container maxW="container.xxl">
              <SimpleGrid columns={6} spacing={5}>
              {Object.keys(categories).map((categoryKey) => (
                <Box p={5} borderWidth="1px" borderRadius="lg" key={categoryKey}>
                <Flex align="center" fontSize="xl">
                  {icons[categoryKey]}
                  <Heading as="h3" ml={3} fontSize="xl">{categoryKey}</Heading>
                  </Flex>
                  <VStack align="start" spacing={3}>
                    {categories[categoryKey].map((item, index) => (
                      <Tag size="md" variant="solid" key={index} _hover={{
                        background: hoverBg,
                        transform: 'scale(1.1)',
                        transition: 'background-color 0.2s, transform 0.2s'
                      }} _active={{
                        background: activeBg,
                        transform: 'scale(0.9)',
                        transition: 'background-color 0.1s, transform 0.1s'
                      }} 
                      onClick={() => onSelectCategory(item, activeIndex)}
                      >
                        {item}
                      </Tag>
                    ))}
                  </VStack>
                </Box>
              ))}
            </SimpleGrid>
          </Container>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default CategorySelectionModal;
