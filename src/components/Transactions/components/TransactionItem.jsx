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
import { FcFullTrash, FcWorkflow, FcSupport, FcBullish, FcDebt, FcFactory, FcAutomotive, FcAlarmClock, FcDonate } from 'react-icons/fc';
import TransactionDetailHeader from './transactiondetail/TransactionDetailHeader';
import TransactionDetail from './transactiondetail/TransactionDetail';
import { useToast } from '@chakra-ui/react';
import { FcApproval } from "react-icons/fc";
import CategorySelectionModal from './CategorySelectionModal';

function TransactionItem({ transaction }) {
  const { isOpen: isUploadOpen, onOpen: onUploadOpen, onClose: onUploadClose } = useDisclosure();
  const { isOpen: isDetailOpen, onOpen: onDetailOpen, onClose: onDetailClose, onToggle: onDetailToggle } = useDisclosure();
  const { isOpen: isAnnotationModalOpen, onOpen: onAnnotationModalOpen, onClose: onAnnotationModalClose } = useDisclosure();
  const { isOpen: isVentilationModalOpen, onOpen: onVentilationModalOpen, onClose: onVentilationModalClose } = useDisclosure();
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const openCategoryModal = (index) => {
    setActiveVentilationIndex(index);
    setIsCategoryModalOpen(true);
  };

  const [ventilations, setVentilations] = useState(transaction.ventilations || []);
  const [tempVentilations, setTempVentilations] = useState(ventilations);

  const newVentilation = () => {
    return { id: ventilations.length + 1, category: '', amount: '' };
  };
  const addVentilation = () => {
    setTempVentilations([...tempVentilations, newVentilation()]);
  };
  const deleteVentilation = (index) => {
    setTempVentilations(prevVentilations => prevVentilations.filter((_, i) => i !== index));
  };

  const submitVentilations = async () => {
    const payload = {
      ventilations: tempVentilations.map(v => ({
        id: v.id,
        amount: v.amount,
        category: v.category
      }))
    };

    const { data, error } = await supabase
      .from('transactions')
      .update(payload)
      .eq('id', transaction.id);

    if (error) {
      toast({
        title: "Erreur lors de la mise à jour des ventilations",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      console.error("Erreur lors de la mise à jour des ventilations :", error);
    } else {
      setVentilations([...tempVentilations]);
      toast({
        title: "Ventilations mises à jour",
        description: "Les ventilations ont été mises à jour avec succès.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      console.log("Ventilations mises à jour avec succès:", data);
    }
  };

  const bgColor = useColorModeValue('gray.50', 'gray.700');
  const dateColor = useColorModeValue('gray.600', 'gray.300');
  const amountColor = useColorModeValue('red.500', 'red.300');
  const hoverBgColor = useColorModeValue('gray.100', 'gray.600');
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

  // Handler to close the modal and set category
  const handleCategorySelect = (category, index) => {
    const newVentilations = [...tempVentilations];
    newVentilations[index].category = category;
    setTempVentilations(newVentilations);
    setIsCategoryModalOpen(false);
  };

  const handleAmountChange = (index, amount) => {
    const newVentilations = [...tempVentilations];
    newVentilations[index] = { ...newVentilations[index], amount: parseFloat(amount) };
    setTempVentilations(newVentilations);
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
        <Box>
          {transaction.ventilations && transaction.ventilations.map((ventilation, index) => (
            <Box
              key={index}
              p={1}
              onClick={() => openVentilationDetailModal(index)}
              cursor="pointer"
              bg={hoverBgColor}
              color="gray.500"
              fontSize="lg"
              borderRadius={4}
              _hover={{ bg: 'gray.200' }}
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
        </Box>
        <Text fontSize="lg" fontWeight="bold" color={amountColor} onClick={onDetailToggle}>
          {`${transaction.montant_total.toFixed(2)} €`}
        </Text>
      </Flex>

      <Modal isOpen={isVentilationModalOpen} onClose={onVentilationModalClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modifier la ventilation</ModalHeader>
          <ModalBody>
            <Box p={4} bg={bgColor} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
              <Text fontSize="lg" fontWeight="semibold" mb={4}>Ventilation(s)</Text>
              {tempVentilations.map((ventilation, index) => (
                <Box key={ventilation.id} mb={4} p={4} bg="white" borderRadius="lg" boxShadow="sm">
                  <Flex justify="space-between" align="center">
                    <Text fontWeight="medium">Ventilation {index + 1}</Text>
                    <IconButton
                      aria-label="Supprimer la ventilation"
                      icon={<FaTimes />}
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => deleteVentilation(index)}
                    />
                  </Flex>
                  <Stack spacing={4} mt={4}>
                    <FormControl>
                      <FormLabel>Catégorie</FormLabel>
                      <Input
                        readOnly
                        value={ventilation.category || "Sélectionner une catégorie"}
                        onClick={() => openCategoryModal(index)}
                        placeholder="Sélectionner une catégorie"
                      />
                    </FormControl>
                    <CategorySelectionModal
                      categories={categories}
                      isOpen={isCategoryModalOpen}
                      onClose={() => setIsCategoryModalOpen(false)}
                      onSelectCategory={handleCategorySelect}
                      activeIndex={activeVentilationIndex}
                    />
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
            <Tooltip textAlign="center" label="Appliquer les modifications à toutes les ventilations" placement="top">
              <Button
                leftIcon={<Icon as={FcSupport} />}
                colorScheme="blue"
                onClick={submitVentilations}
                mr={2}
                variant="ghost"
                aria-label="Appliquer les modifications"
              >
                Enregistrer
              </Button>
            </Tooltip>
            <Button
              onClick={onVentilationModalClose}
              leftIcon={<Icon as={FcWorkflow} />}
              mr={2}
              variant="ghost"
              aria-label="Appliquer les modifications"
            >
              Fermer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default TransactionItem;
