import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Text,
  Icon,
  Button,
  Tooltip,
  useColorModeValue,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  VStack,
  Center,
  Input,
  IconButton,
  Stack,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
  Container,
  SimpleGrid,
  Heading,
  Tag,
  Select,
} from '@chakra-ui/react';
import { CiPen } from "react-icons/ci";
import { supabase } from './../../../supabaseClient'
import { GoPaperclip } from 'react-icons/go';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { FaPlus, FaTimes } from 'react-icons/fa';
import { MdEuro } from 'react-icons/md';
import { FcFullTrash, FcSupport, FcBullish, FcDebt, FcFactory, FcAutomotive, FcAlarmClock, FcDonate } from 'react-icons/fc';
import TransactionDetailHeader from './transactiondetail/TransactionDetailHeader';
import TransactionDetail from './transactiondetail/TransactionDetail';
import { useToast } from '@chakra-ui/react';
import { FcApproval } from "react-icons/fc";

function TransactionItem({ transaction }) {
  const [ventilations, setVentilations] = useState(transaction.ventilations || []);
  const [tempVentilations, setTempVentilations] = useState([]); // Nouvel état pour stocker les modifications temporaires
  // Autres hooks et fonctions inchangés...


  // Nouvelle fonction pour soumettre les ventilations
  const submitVentilations = async () => {
    // Parcourir les ventilations temporairement modifiées et les soumettre à la base de données
    for (let i = 0; i < tempVentilations.length; i++) {
      const ventilation = tempVentilations[i];
      // Vérifier si la ventilation a été modifiée
      if (ventilation && Object.keys(ventilation).length > 0) {
        await updateVentilation(i, ventilation); // Mettre à jour la ventilation dans la base de données
      }
    }
    // Réinitialiser les modifications temporaires après la soumission
    setTempVentilations([]);
  };

  const { isOpen: isUploadOpen, onOpen: onUploadOpen, onClose: onUploadClose, onClose } = useDisclosure();
  const { isOpen: isCategoryModalOpen, onOpen: onCategoryModalOpen, onClose: onCategoryModalClose } = useDisclosure();
  const { isOpen: isDetailOpen, onToggle: onDetailToggle } = useDisclosure();
  const { isOpen: isAnnotationModalOpen, onOpen: onAnnotationModalOpen, onClose: onAnnotationModalClose } = useDisclosure();
  const bgColor = useColorModeValue('gray.50', 'gray.700');
  const dateColor = useColorModeValue('gray.600', 'gray.300');
  const amountColor = useColorModeValue('red.500', 'red.300');
  const hoverBgColor = useColorModeValue('gray.100', 'gray.600');
  const { isOpen: isVentilationModalOpen, onOpen: onVentilationModalOpen, onClose: onVentilationModalClose } = useDisclosure();
  const toast = useToast();
  const [activeVentilationIndex, setActiveVentilationIndex] = useState(null);
  const [selectedItem, setSelectedItem] = useState('');

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

  const iconColor = useColorModeValue('gray.200', 'gray.300');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const hoverBg = useColorModeValue("green.100", "green.700");
  const activeBg = useColorModeValue("blue.300", "blue.800");

  const addVentilation = () => {
    const newId = ventilations.length + 1;
    setVentilations([...ventilations, { id: newId, category: '', amount: '', selectedCategory: '' }]);
  };

  const removeVentilation = index => {
    setVentilations(ventilations.filter((_, i) => i !== index));
  };

  // Function to update a single ventilation
  const updateVentilation = async (index, fields) => {
    const ventilation = ventilations[index];
    const { data, error } = await supabase
      .from('ventilations')
      .update(fields)
      .eq('id', ventilation.id);

    if (error) {
      toast({
        title: "Error updating",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else {
      // Update the local state to reflect changes
      const updatedVentilations = [...ventilations];
      updatedVentilations[index] = { ...ventilation, ...fields };
      setVentilations(updatedVentilations);
      toast({
        title: "Update Successful",
        description: "The ventilation has been updated successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Function to delete a ventilation
  const deleteVentilation = async (index) => {
    const ventilation = ventilations[index];
    const { error } = await supabase
      .from('ventilations')
      .delete()
      .eq('id', ventilation.id);

    if (error) {
      toast({
        title: "Error deleting",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else {
      // Remove the ventilation from local state
      const updatedVentilations = ventilations.filter((_, i) => i !== index);
      setVentilations(updatedVentilations);
      toast({
        title: "Deletion Successful",
        description: "The ventilation has been deleted successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }
  };


  const handleCategorySelect = (index, category) => {
    updateVentilation(index, { category });
  };

  const handleAmountChange = (index, amount) => {
    updateVentilation(index, { amount: parseFloat(amount) });
  };

  const [annotation, setAnnotation] = useState('');

  const handleAnnotationConfirm = async () => {
    const { data, error } = await supabase
      .from('transactions')
      .update({ annotations: annotation })
      .eq('id', transaction.id);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'annotation.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      console.error('Error updating annotation', error);
    } else {
      toast({
        title: "Succès",
        description: "Annotation mise à jour avec succès.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      console.log('Annotation updated successfully', data);
    }

    onAnnotationModalClose();
  };
  function isJustificatifNotEmpty(justificatifsUrl) {
    if (!justificatifsUrl) return false;
    if (Array.isArray(justificatifsUrl) && justificatifsUrl.length === 0) return false;
    if (justificatifsUrl === "[]") return false;
    return true;
  }
  const openVentilationDetailModal = (index) => {
    onVentilationModalOpen();

  };
  useEffect(() => {
    if (selectedItem && activeVentilationIndex !== null) {
      let updatedVentilations = [...ventilations];
      updatedVentilations[activeVentilationIndex] = {
        ...updatedVentilations[activeVentilationIndex],
        category: selectedItem,
      };
      setVentilations(updatedVentilations);
    }
  }, [selectedItem, activeVentilationIndex, ventilations]);

  return (
    <>
      <Flex
        p={4}
        bg={bgColor}
        borderRadius="lg"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
        _hover={{ bg: hoverBgColor, cursor: 'pointer' }}
        transition="background 0.3s ease"
      >
        <Text fontSize="lg" fontWeight="bold" color={dateColor}>
          {new Date(transaction.date_transaction).toLocaleDateString('fr-FR')}
        </Text>

        <Tooltip hasArrow label="Lier un justificatif à la transaction" placement="top" closeOnClick={false}>
          <Box display="flex" alignItems="center" position="relative">
            <Icon
              as={GoPaperclip}
              w={5}
              h={5}
              onClick={onUploadOpen}
              sx={{ _hover: { transform: 'scale(1.2)' }, transition: 'transform 0.2s ease-in-out' }}
            />
            {isJustificatifNotEmpty(transaction.justificatifs_url) && (
              <Icon as={FcApproval} w={4} h={4} position="absolute" bottom="-1" right="-1" />
            )}
          </Box>
        </Tooltip>
        <Tooltip hasArrow label="Cliquer pour Annoter" placement="top" closeOnClick={false}>
          <Box onClick={() => {
            setAnnotation(transaction.annotations || '');
            onAnnotationModalOpen();
          }} display="flex" alignItems="center">
            <Text fontWeight="medium" mr={2}>
              {transaction.libelle}
            </Text>
            {transaction.annotations && (
              <Flex alignItems="center">
                <Icon as={CiPen} w={4} h={4} mr={1} />
                <Text fontStyle="italic">{transaction.annotations}</Text>
              </Flex>
            )}
          </Box>
        </Tooltip>
        {transaction.ventilations && transaction.ventilations.map((ventilation, index) => (
          <Box
            p={4}
            onClick={() => openVentilationDetailModal(index)}
            cursor="pointer"
            bg={hoverBgColor}
            color="gray.500"
            fontSize="lg"
            key={index}
            _hover={{ textDecoration: 'underline', cursor: 'pointer' }}
          >
            <Flex direction="row" align="center" gap="2">
              <Text fontSize="sm" fontWeight="bold">
                {ventilation.category}
              </Text>
              <Text fontSize="sm">
                {ventilation.amount} €
              </Text>
            </Flex>
          </Box>
        ))}
        <Text fontSize="lg" fontWeight="bold" color={amountColor} onClick={onDetailToggle}>
          {`${transaction.montant_total.toFixed(2)} €`}
        </Text>
      </Flex>

      <Modal isOpen={isVentilationModalOpen} onClose={onVentilationModalClose} size="xl">
  <ModalOverlay />
  <ModalContent>
    <ModalHeader>Edit Ventilation</ModalHeader>
    <ModalBody>
      <Box p={4} bg={bgColor} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
        <Text fontSize="lg" fontWeight="semibold" mb={4}>Ventilation(s)</Text>
        {ventilations.map((ventilation, index) => (
          <Box key={ventilation.id} mb={4} p={4} bg="white" borderRadius="lg" boxShadow="sm">
            <Flex justify="space-between" align="center">
              <Text fontWeight="medium">Ventilation {index + 1}</Text>
            </Flex>
            <Stack spacing={4} mt={4}>
              <FormControl>
                <FormLabel>Catégorie</FormLabel>
                <Select
                  placeholder="Sélectionnez une catégorie..."
                  value={ventilation.category || ''}
                  onChange={(e) => handleCategorySelect(index, e.target.value)}
                >
                  {Object.keys(categories).map(categoryKey => (
                    categories[categoryKey].map(item => (
                      <option value={item} key={item}>{item}</option>
                    ))
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Montant</FormLabel>
                <InputGroup>
                  <Input type="number" value={ventilation.amount || ''} onChange={(e) => handleAmountChange(index, e.target.value)} />
                  <InputRightElement pointerEvents="none" children={<MdEuro color="gray.500" />} />
                </InputGroup>
              </FormControl>
            </Stack>
          </Box>
        ))}
        <Button leftIcon={<FaPlus />} colorScheme="blue" variant="outline" onClick={addVentilation} mt={2}>
          Ajouter une ventilation
        </Button>
      </Box>
    </ModalBody>
    <ModalFooter>
      <Tooltip label="Apply changes to all ventilations" placement="top">
        <IconButton
          aria-label="Apply changes"
          icon={<FcSupport />}
          size="sm"
          variant="ghost"
          onClick={submitVentilations}
          mr={2}
        />
      </Tooltip>
      <Tooltip label="Delete all ventilations" placement="top">
        <IconButton
          aria-label="Remove all ventilations"
          icon={<FcFullTrash />}
          size="sm"
          variant="ghost"
          onClick={() => setVentilations([])}
        />
      </Tooltip>
      <Button onClick={onVentilationModalClose}>Close</Button>
    </ModalFooter>
  </ModalContent>
</Modal>


      <Modal isOpen={isUploadOpen} onClose={onUploadClose} isCentered size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {transaction.libelle} {/* Dynamic display of libelle in the modal header */}
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
            <VStack spacing={4}>
              <Text>{`${new Date(transaction.date_transaction).toLocaleDateString('fr-FR')} - Montant : ${transaction.montant_total.toFixed(2)} €`}</Text>
              <Center
                p={10}
                border="2px dashed"
                borderColor="gray.300"
                borderRadius="md"
                w="full"
                bg="gray.50"
              >
                <VStack spacing={3}>
                  <FaCloudUploadAlt size="3em" />
                  <Text textAlign="center">
                    Déposez ici les justificatifs que vous souhaitez attacher à cette transaction
                  </Text>
                  <Text fontSize="sm">Formats autorisés : PNG / JPG / PDF</Text>
                  <Text fontSize="sm">Taille max : 10MB par justificatif</Text>
                  <Button as="label" size="md" colorScheme="pink">
                    Sélectionner des fichiers
                    <Input type="file" hidden multiple />
                  </Button>
                </VStack>
              </Center>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="pink" onClick={onClose}>
              Fermer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isAnnotationModalOpen} onClose={onAnnotationModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Annoter la Transaction</ModalHeader>
          <ModalBody>
            <Input
              placeholder="Ajoutez une annotation"
              value={annotation}
              onChange={(e) => setAnnotation(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onAnnotationModalClose}>Annuler</Button>
            <Button colorScheme="pink" ml={3} onClick={handleAnnotationConfirm}>
              Confirmer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isDetailOpen} onClose={onDetailToggle} size="full" overflow="auto">
        <ModalOverlay />
        <ModalContent m={0} maxW="100vw">
          <TransactionDetailHeader onClose={onDetailToggle} />
          <TransactionDetail />
        </ModalContent>
      </Modal>
    </>
  );
}

export default TransactionItem;