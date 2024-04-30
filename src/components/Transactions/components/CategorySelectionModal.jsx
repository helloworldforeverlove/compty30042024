import React from 'react';
import {
  Box, Flex, Button, Modal, ModalOverlay, ModalContent, ModalHeader,
  IconButton, ModalBody, SimpleGrid, Tag, VStack, Heading, Input, FormControl, FormLabel
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
          <SimpleGrid columns={3} spacing={5}>
            {Object.entries(categories).map(([key, items]) => (
              <Box p={5} borderWidth="1px" borderRadius="lg" key={key}>
                <Flex align="center" fontSize="xl">
                  <Heading as="h3" ml={3} fontSize="xl">{key}</Heading>
                </Flex>
                <VStack align="start">
                  {items.map((item, idx) => (
                    <Tag key={idx} size="md" variant="solid" onClick={() => onSelectCategory(item, activeIndex)}>
                      {item}
                    </Tag>
                  ))}
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default CategorySelectionModal;