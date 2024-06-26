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
  ModalCloseButton,
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
  chakra,
  HStack,
  Image,
} from '@chakra-ui/react';
import { AttachmentIcon, CloseIcon } from '@chakra-ui/icons';
import { useDropzone } from 'react-dropzone';
import { CiPen } from "react-icons/ci";
import { supabase } from './../../../supabaseClient'
import { GoPaperclip } from 'react-icons/go';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { FaPlus, FaTimes } from 'react-icons/fa';
import { MdEuro } from 'react-icons/md';
import { FcFullTrash, FcWorkflow, FcSupport, FcBullish, FcDebt, FcFactory, FcAutomotive, FcAlarmClock, FcDonate } from 'react-icons/fc';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useToast } from '@chakra-ui/react';
import { FcApproval } from "react-icons/fc";
import CategorySelectionModal from './CategorySelectionModal';

function UpdateTransaction({ selectedTransactionId }) {
  const [transaction, setTransaction] = useState({
    id: '',
    libelle: '',
    date_transaction: new Date(),
    montant_total: '',
    annotations: '',
    justificatifs_url: []
  });
  const ChakraDatePicker = chakra(DatePicker);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedTransactionId) {
      fetchTransaction(selectedTransactionId);
    }
  }, [selectedTransactionId]);

  const fetchTransaction = async (id) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error(`Error fetching transaction: ${error.message}`);
        return;
      }

      if (data) {
        setTransaction({
          id,
          libelle: data.libelle,
          date_transaction: new Date(data.date_transaction),
          montant_total: data.montant_total,
          annotations: data.annotations,
          justificatifs_url: JSON.parse(data.justificatifs_url || '[]') // Parsing JSON or default to empty array
        });
      } else {
        setTransaction({ id: '', libelle: '', date_transaction: new Date(), montant_total: '', annotations: '', justificatifs_url: [] });
      }
    } catch (error) {
      console.error(`Error fetching transaction: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    const { id, libelle, date_transaction, montant_total, annotations, justificatifs_url } = transaction;
    if (!id) {
      console.error('Please provide the transaction ID.');
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase
        .from('transactions')
        .update({ libelle, date_transaction, montant_total, annotations, justificatifs_url: JSON.stringify(justificatifs_url) })
        .match({ id });

      if (error) throw error;
      console.log('Transaction updated successfully!');
    } catch (error) {
      console.error(`Update failed: ${error.message}`);
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
  const fileBg = useColorModeValue('red.50', 'gray.700');
  const fileBorderColor = useColorModeValue('red.200', 'gray.600');
  const inputBg = useColorModeValue('gray.100', 'gray.600');
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filesBis, setFilesBis] = useState([]);
  const maxFilesBis = 10;
  const { getRootProps, getInputProps, isDragReject, fileRejections } = useDropzone({
    accept: 'image/png, image/jpeg, application/pdf',
    maxSize: 10 * 1024 * 1024, // 10MB max size
    onDrop: acceptedFilesBis => {
      setFiles(prevFilesBis=> {
        const updatedFilesBis = prevFilesBis.concat(acceptedFilesBis).slice(0, maxFilesBis);
        return updatedFilesBis.map(file => Object.assign(file, {
          preview: URL.createObjectURL(file)
        }));
      });
      handleFileUpload(acceptedFilesBis);
    },
    noClick: filesBis.length >= maxFilesBis,
    noKeyboard: filesBis.length >= maxFilesBis,
  });
  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };

  useEffect(() => {
    if (filesBis.length === 0) {
      setSelectedFile(null);
    }
  }, [filesBis]);

  return (
    <VStack spacing={4} align="stretch">
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
      <FormControl mt={4}>
        <FormLabel>Justificatifs</FormLabel>
        <InputGroup>
          <Input
            placeholder="Ajouter des justificatifs"
            background={inputBg}
            readOnly
            onClick={() => setIsFileModalOpen(true)}
          />
        </InputGroup>
        <HStack
          borderWidth="1px"
          borderRadius="lg"
          p={1}
          m={1}
          justifyContent="space-between"
          alignItems="center"
          bg={fileBg}
          borderColor={fileBorderColor}
          width="full"
        >
          <HStack spacing={2}>
            {transaction.justificatifs_url.map((file, index) => (
              <Box key={index} display="flex" alignItems="center">
                <Image
                  src={file.url}
                  alt={`Justificatif ${file.name}`}
                  objectFit="cover"
                  borderRadius="md"
                  boxSize="50px"
                  fallbackSrc="https://via.placeholder.com/100" // Optional: Placeholder if the image fails to load
                />
                <Text>{file.name} <a href={file.url} target="_blank"></a></Text>
              </Box>
            ))}
          </HStack>
          <Tooltip label="Supprimer le fichier" hasArrow>
            <IconButton
              icon={<FcFullTrash />}
              aria-label="Delete file"
              size="sm"
              isRound={true}
              variant="ghost"
            />
          </Tooltip>
        </HStack>
      </FormControl>
      <Modal isOpen={isFileModalOpen} onClose={() => setIsFileModalOpen(false)} size="4xl">
        <ModalOverlay />
        <ModalOverlay />
        <ModalContent minH="80vh">
          <ModalHeader>Ajouter des justificatifs</ModalHeader>
          <Box
            borderBottomWidth="1px"
            borderColor="gray.200"
            width="full"
          />
          <ModalCloseButton />
          <ModalBody>
            <Flex>
              <>
                {filesBis.length === 0 ? (
                  <div {...getRootProps({ className: 'dropzone' })} style={{ width: '100%', minHeight: '69vh', border: '2px dashed gray', padding: '20px', textAlign: 'center' }}>
                    <input {...getInputProps()} />
                    <AttachmentIcon w={12} h={12} color='gray.500' />
                    <Text>Glissez et déposez les fichiers ici, ou cliquez pour sélectionner des fichiers 3</Text>
                    <Text fontSize='sm'>Formats autorisés: PNG, JPEG, PDF</Text>
                    <Text fontSize='sm'>Taille max: 10Mo par justificatif</Text>
                  </div>
                ) : (
                  <VStack width="50%" spacing={4}>
                    <Box w="95%">
                      <HStack
                        borderWidth="1px"
                        borderRadius="lg"
                        p={1}
                        m={1}
                        justifyContent="space-between"
                        alignItems="center"
                        bg={fileBg}
                        borderColor={fileBorderColor}
                        width="full"
                      >
                        <HStack spacing={2}>
                          {transaction.justificatifs_url.map((file, index) => (
                            <Box key={index} display="flex" alignItems="center">
                              <Image
                                src={file.url}
                                alt={`Justificatif ${file.name}`}
                                objectFit="cover"
                                borderRadius="md"
                                boxSize="50px"
                                fallbackSrc="https://via.placeholder.com/100" // Optional: Placeholder if the image fails to load
                              />
                              <Text>{file.name} <a href={file.url} target="_blank"></a></Text>
                            </Box>
                          ))}
                        </HStack>
                        <Tooltip label="Supprimer le fichier" hasArrow>
                          <IconButton
                            icon={<FcFullTrash />}
                            aria-label="Delete file"
                            size="sm"
                            isRound={true}
                            variant="ghost"
                          />
                        </Tooltip>
                      </HStack>
                    </Box>
                    <>
                      <div {...getRootProps({ className: 'dropzone' })} style={{ width: '100%', padding: '10px', textAlign: 'center' }}>
                        <input {...getInputProps()} />
                        <Button
                          leftIcon={<LiaCloudUploadAltSolid />}
                          colorScheme="teal"
                          variant="outline"
                          bg={useColorModeValue('white', 'gray.800')}
                          color={useColorModeValue('gray.600', 'white')}
                          _hover={{
                            bg: useColorModeValue('gray.100', 'gray.700'),
                          }}
                        >
                          Ajouter d'autres fichiers
                        </Button>
                      </div>
                      <Text fontSize='sm'>
                        {`Vous pouvez encore en ajouter ${maxFilesBis - filesBis.length}.`}
                      </Text>
                    </>
                  </VStack>
                )}
              </>
              {selectedFile && selectedFile.type.startsWith('image/') && (
                <Box width="50%" height="100%">
                  <Image
                    src={selectedFile.preview}
                    alt={`Preview of ${selectedFile.name}`}
                    objectFit="cover"
                    width="100%"
                    height="100%"
                  />
                </Box>
              )}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Button colorScheme="blue" onClick={handleUpdate} isLoading={loading}>
        Enregistrer les modifications
      </Button>
    </VStack>
  );
}


function TransactionItem({ transaction, transactionId }) {
  const { isOpen: isUploadOpen, onOpen: onUploadOpen, onClose: onUploadClose } = useDisclosure();
  const { isOpen: isDetailOpen, onOpen: onDetailOpen, onClose: onDetailClose, onToggle: onDetailToggle } = useDisclosure();
  const { isOpen: isAnnotationModalOpen, onOpen: onAnnotationModalOpen, onClose: onAnnotationModalClose } = useDisclosure();
  const { isOpen: isVentilationModalOpen, onOpen: onVentilationModalOpen, onClose: onVentilationModalClose } = useDisclosure();
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const openCategoryModal = (index) => {
    setActiveVentilationIndex(index);
    setIsCategoryModalOpen(true);
  };
  const [selectedTransactionId, setSelectedTransactionId] = useState('');

  // Function to handle row click
  const handleRowClick = (transactionId) => {
    setSelectedTransactionId(transactionId);
  };
  const handleTransactionClick = (transactionId) => {
    handleRowClick(transactionId); // Set the selected transaction ID
    onDetailToggle();              // Toggle the detail view
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


  const borderColor = useColorModeValue('gray.200', 'gray.600');

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

  const [files, setFiles] = useState([]);
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    // Map over files to create a displayText format that includes filenames and URLs
    const fileInfo = files.map(file => ({
      name: file.name,
      // Concatenate the base URL with the file's name to form the complete URL
      url: `https://iholojdqmdamozagajwk.supabase.co/storage/v1/object/public/justificatifs/${file.name}`
    }));

    setDisplayText(JSON.stringify(fileInfo));
  }, [files]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTransaction(prev => ({ ...prev, [name]: value }));
  };

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
        <Text
          fontSize="lg"
          fontWeight="bold"
          color={amountColor}
          onClick={() => handleTransactionClick(transaction.id)}>
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
      <Modal isOpen={isUploadOpen} onClose={onUploadClose} isCentered size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {transaction.libelle} {/* Dynamic display of libelle in the modal header */}
            <IconButton
              aria-label="Close modal"
              icon={<FaTimes />}
              onClick={onUploadClose}
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
            <Button colorScheme="pink" onClick={onUploadClose}>
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

      <Modal isOpen={isDetailOpen} onClose={onDetailClose} size="full" overflow="auto">
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <>
              <Flex justifyContent="space-between" alignItems="center" p={4} bg="white" boxShadow="md">
                <Heading as="h3" size="lg">
                  Ajout d'une dépense professionnelle
                </Heading>
                <Box>
                  <Button mr={3} onClick={onDetailToggle}>
                    Fermer
                  </Button>
                  <Button colorScheme="pink" onClick={() => onSubmitTransaction(files)}>
                    Ajouter
                  </Button>
                </Box>
              </Flex>
              <Box
                p={4}
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="flex-start"
                maxW="1400px"
                m="0 auto"
                w="100%"
              >
                <SimpleGrid
                  columns={{ base: 1, md: 2 }}
                  spacing={10}
                  width="100%"
                  maxWidth="1400px"
                  margin="0 auto"
                >
                  <Box borderWidth="1px" borderRadius="lg" p={4} borderColor={borderColor}>
                    <UpdateTransaction selectedTransactionId={selectedTransactionId} />
                  </Box>
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
                </SimpleGrid>
              </Box>
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
                  onClick={onDetailClose}
                  leftIcon={<Icon as={FcWorkflow} />}
                  mr={2}
                  variant="ghost"
                  aria-label="Appliquer les modifications"
                >
                  Fermer
                </Button>
              </ModalFooter>
            </>
          </ModalBody>
        </ModalContent>
      </Modal>

    </>
  );
}

export default TransactionItem;
