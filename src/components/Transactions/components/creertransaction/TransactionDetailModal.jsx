import { supabase } from './../../../../supabaseClient';
import React, { useState, useEffect } from 'react';
import { AttachmentIcon, CloseIcon } from '@chakra-ui/icons';
import {
  Box, Button, FormControl, FormLabel, Input, VStack,
  IconButton, InputGroup, InputRightElement, Modal, useColorModeValue,
  ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
  ModalBody, Text, Image, HStack, Flex, Tooltip, SimpleGrid, Heading, Stack, Container, Tag,
} from '@chakra-ui/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDropzone } from 'react-dropzone';
import { chakra } from '@chakra-ui/react';
import { fr } from 'date-fns/locale';
import { LiaCloudUploadAltSolid } from "react-icons/lia";
import { FaPlus, FaTimes } from 'react-icons/fa';
import { MdEuro } from 'react-icons/md';
import { FcFullTrash, FcBullish, FcDebt, FcFactory, FcAutomotive, FcAlarmClock, FcDonate } from 'react-icons/fc';

const ExpenseFormHeader = ({ onToggle, onSubmitTransaction, files }) => {
  return (
    <Flex justifyContent="space-between" alignItems="center" p={4} bg="white" boxShadow="md">
      <Heading as="h3" size="lg">
        Ajout d'une dépense professionnelle
      </Heading>
      <Box>
        <Button mr={3} onClick={onToggle}>
          Fermer
        </Button>
        <Button colorScheme="pink" onClick={() => onSubmitTransaction(files)}>
          Ajouter
        </Button>
      </Box>
    </Flex>
  );
};

const ChakraDatePicker = chakra(DatePicker);

const FilePreview = ({ file, onDelete, onSelect }) => {
  const isImage = file.type.startsWith('image/');
  const fileBg = useColorModeValue('red.50', 'gray.700');
  const fileBorderColor = useColorModeValue('red.200', 'gray.600');
  const textColor = useColorModeValue('gray.700', 'red.50');

  return (
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
      onClick={() => onSelect(file)}
    >
      <HStack spacing={2}>
        {isImage ? (
          <Image src={file.preview} boxSize="50px" />
        ) : (
          <AttachmentIcon color={textColor} />
        )}
        <Text color={textColor} isTruncated maxWidth="calc(100% - 3rem)" title={file.name}>
          {file.name}
        </Text>
      </HStack>
      <Tooltip label="Supprimer le fichier" hasArrow>
        <IconButton
          icon={<FcFullTrash />}
          onClick={(e) => {
            e.stopPropagation();  // Prevent onSelect from being called when deleting
            onDelete(file);
          }}
          aria-label="Delete file"
          size="sm"
          isRound={true}
          variant="ghost"
        />
      </Tooltip>
    </HStack>
  );
};

const handleFileUpload = async (acceptedFiles) => {
  const uploads = await Promise.all(acceptedFiles.map(async (file) => {

    const fileName = `${file.name}`;

    try {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('justificatifs')
        .upload(fileName, file);

      if (uploadError) {
        console.error(`Error during file upload: ${uploadError.message}`);
        return null;
      }

      const { publicURL, error: urlError } = supabase.storage
        .from('justificatifs')
        .getPublicUrl(fileName);

      if (urlError) {
        console.error(`Error retrieving public URL: ${urlError.message}`);
        return null;
      }

      return { fileName, url: publicURL };
    } catch (err) {
      console.error(`Exception during file upload: ${err.message}`);
      return null;
    }
  }));

  console.log('Uploaded files:', uploads);

  const successfulUploads = uploads.filter(upload => upload && upload.url);
  const uploadedFileUrls = successfulUploads.map(upload => upload.url);
  setUploadedFileKeys(uploadedFileUrls);
};


const ExpenseInformation = ({ formData, onChange, files, setFiles }) => {
  const [annotations, setAnnotations] = useState('');
  const [selectedDate, setSelectedDate] = useState(formData.date_transaction || new Date());

  const handleDateChange = (date) => {
    setSelectedDate(date);
    onChange({ target: { name: 'date_transaction', value: date } });
  };

  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const inputBg = useColorModeValue('gray.100', 'gray.600');
  const borderColor = useColorModeValue('gray.300', 'gray.700');
  const [selectedFile, setSelectedFile] = useState(null);
  const maxFiles = 10;

  const { getRootProps, getInputProps, isDragReject, fileRejections } = useDropzone({
    accept: 'image/png, image/jpeg, application/pdf',
    maxSize: 10 * 1024 * 1024, // 10MB max size
    onDrop: acceptedFiles => {
      setFiles(prevFiles => {
        const updatedFiles = prevFiles.concat(acceptedFiles).slice(0, maxFiles);
        return updatedFiles.map(file => Object.assign(file, {
          preview: URL.createObjectURL(file)
        }));
      });
      handleFileUpload(acceptedFiles);
    },
    noClick: files.length >= maxFiles,
    noKeyboard: files.length >= maxFiles,
  });

  const deleteFile = (fileToDelete) => {
    setFiles(files.filter(file => file !== fileToDelete));
    URL.revokeObjectURL(fileToDelete.preview);
  };

  const clearFiles = () => {
    files.forEach(file => URL.revokeObjectURL(file.preview));
    setFiles([]);
  };

  const closeButtonStyle = {
    opacity: annotations ? 1 : 0,
    transition: 'opacity 0.3s ease-out',
    cursor: 'pointer'
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };

  useEffect(() => {
    if (files.length === 0) {
      setSelectedFile(null);
    }
  }, [files]);

  return (
    <Box borderWidth="1px" borderRadius="lg" p={4} borderColor={borderColor}>
      <VStack spacing={4} align="stretch">
        <FormControl id="transaction-label">
          <FormLabel>Libellé</FormLabel>
          <Input value={formData.libelle} onChange={onChange} name="libelle" />
        </FormControl>

        <FormControl id="transaction-date">
          <FormLabel>Date</FormLabel>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="dd/MM/yyyy"
            customInput={<Input />}
            popperPlacement="bottom-start"
            showWeekNumbers
            calendarStartDay={1}
          />
        </FormControl>

        <FormControl id="transaction-amount">
          <FormLabel>Montant</FormLabel>
          <Input
            type="number"
            step="0.01"
            value={formData.montant_total}
            onChange={onChange}
            name="montant_total"
          />
        </FormControl>

        <FormControl id="transaction-annotations">
          <FormLabel>Annotations</FormLabel>
          <InputGroup>
            <Input
              placeholder="Ajouter des mots clés"
              value={formData.annotations}
              onChange={onChange}
              name="annotations"
            />
            {annotations && (
              <InputRightElement>
                <IconButton
                  aria-label="Clear annotations"
                  icon={<CloseIcon />}
                  size="sm"
                  onClick={() => setAnnotations('')}
                  isRound={true}
                  style={closeButtonStyle}
                />
              </InputRightElement>
            )}
          </InputGroup>
        </FormControl>

        <FormControl id="transaction-justifications">
          <FormLabel>Justificatifs</FormLabel>
          <InputGroup>
            <Input
              placeholder="Ajouter des justificatifs"
              background={inputBg}
              value={files.map(file => `${file.name}`).join(', ')}
              onClick={() => setIsFileModalOpen(true)}
              readOnly
            />
            {files.length > 0 && (
              <InputRightElement>
                <IconButton
                  aria-label="Clear files"
                  icon={<CloseIcon />}
                  size="sm"
                  onClick={clearFiles}
                  isRound={true}
                />
              </InputRightElement>
            )}
          </InputGroup>
          {files.map((file, index) => (
            <FilePreview key={index} file={file} onDelete={deleteFile} onSelect={handleFileSelect} />
          ))}
        </FormControl>

        <Modal isOpen={isFileModalOpen} onClose={() => setIsFileModalOpen(false)} size="4xl">
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
                  {files.length === 0 ? (
                    <div {...getRootProps({ className: 'dropzone' })} style={{ width: '100%', minHeight: '69vh', border: '2px dashed gray', padding: '20px', textAlign: 'center' }}>
                      <input {...getInputProps()} />
                      <AttachmentIcon w={12} h={12} color='gray.500' />
                      <Text>Glissez et déposez les fichiers ici, ou cliquez pour sélectionner des fichiers</Text>
                      <Text fontSize='sm'>Formats autorisés: PNG, JPEG, PDF</Text>
                      <Text fontSize='sm'>Taille max: 10Mo par justificatif</Text>
                    </div>
                  ) : (
                    <VStack width="50%" spacing={4}>
                      <Box w="95%">
                        {files.map((file, index) => (
                          <FilePreview key={index} file={file} onDelete={deleteFile} onSelect={handleFileSelect} />
                        ))}
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
                          {`Vous pouvez encore en ajouter ${maxFiles - files.length}.`}
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
      </VStack>
    </Box>
  );
};

const ExpenseVentilationComponent = ({ ventilations, onVentilationChange, onAddVentilation, onRemoveVentilation }) => {
  const [ventilationsState, setVentilations] = useState([
    { id: 1, amount: '', selectedCategory: 'Dépense personnelle' },
  ]);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [activeVentilationIndex, setActiveVentilationIndex] = useState(null);

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
  const bgColor = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const hoverBg = useColorModeValue("green.100", "green.700");
  const activeBg = useColorModeValue("blue.300", "blue.800");

  const handleAmountChange = (index, value) => {
    const newVentilations = [...ventilations];
    newVentilations[index].amount = value;
    setVentilations(newVentilations);
  };


  const addVentilation = () => {
    const newId = ventilationsState.length + 1;
    setVentilations([...ventilationsState, { id: newId, amount: '', selectedCategory: '' }]);
  };


  const removeVentilation = index => {
    setVentilations(ventilations.filter((_, i) => i !== index));
  };

  const openCategoryModal = (index) => {
    setActiveVentilationIndex(index);
    setIsCategoryModalOpen(true);
  };

  const onCategoryModalClose = () => {
    setIsCategoryModalOpen(false);
  };

  const handleCategorySelect = (category) => {
    // S'assurer que l'index est valide
    if (activeVentilationIndex != null && ventilations[activeVentilationIndex]) {
      onVentilationChange(activeVentilationIndex, 'selectedCategory', category);
      onCategoryModalClose();
    } else {
      console.error("Index de ventilation non valide lors de la sélection de la catégorie");
    }
  };
  return (
    <Box p={4} bg={bgColor} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
      <Text fontSize="lg" fontWeight="semibold" mb={4}>Ventilation(s)</Text>
      {ventilations.map((vent, index) => (
        <Box key={vent.id} p={4} bg="white" shadow="sm" mb={4} rounded="md">
          <Flex alignItems="center" justifyContent="space-between">
            <Heading size="md" mb={4}>Ventilation {index + 1}</Heading>
            <IconButton
              icon={<FaTimes />}
              onClick={() => onRemoveVentilation(index)}
              aria-label="Remove ventilation"
            />
          </Flex>
          <Stack spacing={3}>
            <FormControl>
              <FormLabel>Catégorie</FormLabel>
              <Input
                value={vent.selectedCategory}
                onChange={(e) => onVentilationChange(index, 'selectedCategory', e.target.value)}
                placeholder="Select Category"
                readOnly
                onClick={() => openCategoryModal(index)}

              />
            </FormControl>
            <FormControl>
              <FormLabel>Montant</FormLabel>
              <InputGroup>
                <Input
                  type="number"
                  value={vent.amount}
                  onChange={(e) => onVentilationChange(index, 'amount', e.target.value)}
                />
                <InputRightElement children={<MdEuro />} />
              </InputGroup>
            </FormControl>
          </Stack>
        </Box>
      ))}
      <Button leftIcon={<FaPlus />} onClick={onAddVentilation} colorScheme="blue">
        Ajouter une ventilation
      </Button>
      <Modal isOpen={isCategoryModalOpen} onClose={onCategoryModalClose} size="full" overflow="auto">
        <ModalOverlay />
        <ModalContent m={0} maxW="100vw">
          <ModalHeader>
            Affecter une Catégories
            <IconButton
              aria-label="Close modal"
              icon={<FaTimes />}
              onClick={onCategoryModalClose}
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
                          event.preventDefault();
                          handleCategorySelect(item);
                        }}>
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
    </Box>
  );
};

const ExpenseTransactionDetail = ({ onToggle }) => {
  const [formData, setFormData] = useState({
    libelle: '',
    date_transaction: new Date(),
    montant_total: 0,
    annotations: '',
    justificatifs_url: [],
    moyen: '',
    compte_bancaire: '',
    ventilations: [
      { id: 1, amount: '', selectedCategory: 'Dépense personnelle' }
    ]
  });
  const [files, setFiles] = useState([]);  // Manage files here

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const [uploadedFileKeys, setUploadedFileKeys] = useState([]);

  const handleVentilationChange = (index, field, value) => {
    const updatedVentilations = formData.ventilations.map((vent, idx) => {
      if (idx === index) {
        return { ...vent, [field]: value };
      }
      return vent;
    });
    setFormData(prev => ({ ...prev, ventilations: updatedVentilations }));
  };


  const addVentilation = () => {
    setFormData(prev => ({
      ...prev,
      ventilations: [...prev.ventilations, { id: prev.ventilations.length + 1, category: '', amount: '', selectedCategory: '' }]
    }));
  };

  const removeVentilation = (index) => {
    const newVentilations = formData.ventilations.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, ventilations: newVentilations }));
  };
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

const handleSubmitTransaction = async () => {
  try {
      const transactionData = {
          ...formData,
          justificatifs_url: displayText,  // Use displayText which now includes proper URLs
          ventilations: formData.ventilations.map(vent => ({
              id: vent.id,
              amount: vent.amount || 0,
              category: vent.selectedCategory
          }))
      };

      const { data, error } = await supabase.from('transactions').insert([transactionData]);
      if (error) throw error;

      console.log('Transaction added successfully!', data);
      onToggle(); // Close modal or reset form
  } catch (error) {
      console.error('Error submitting transaction:', error.message);
  }
};


  return (
    <>
      <ExpenseFormHeader onToggle={onToggle} onSubmitTransaction={handleSubmitTransaction} files={files} />
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
          <ExpenseInformation formData={formData} onChange={handleInputChange} files={files} setFiles={setFiles} />
          <ExpenseVentilationComponent
            ventilations={formData.ventilations}
            onVentilationChange={handleVentilationChange}
            onAddVentilation={addVentilation}
            onRemoveVentilation={removeVentilation}
          />
        </SimpleGrid>
      </Box>
    </>
  );
};


const TransactionDetailModal = ({ isDetailOpen, onToggle }) => {
  return (
    <Modal isOpen={isDetailOpen} onClose={onToggle} size="full" overflow="auto">
      <ModalOverlay />
      <ModalContent m={0} maxW="100vw">
        <ExpenseTransactionDetail onToggle={onToggle} />
      </ModalContent>
    </Modal>
  );
};

export default TransactionDetailModal;