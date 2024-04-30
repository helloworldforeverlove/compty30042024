import React from 'react';
import {
  Box, Flex, IconButton, Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalBody, SimpleGrid, Tag, VStack, Heading, FormControl, FormLabel, Input, Container
} from '@chakra-ui/react';
import { FaTimes } from 'react-icons/fa';

function CategorySelectionModal({ categories, isOpen, onClose, onSelectCategory, activeIndex }) {
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
                    <Heading as="h3" ml={3} fontSize="xl">{categoryKey}</Heading>
                  </Flex>
                  <VStack align="start" spacing={3}>
                    {categories[categoryKey].map((item, index) => (
                      <Tag
                        key={index}
                        size="md"
                        variant="solid"
                        _hover={{ bg: "blue.500", color: "white" }}
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
