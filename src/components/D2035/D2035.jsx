import React from 'react';
import { Box } from '@chakra-ui/react';
import HeaderD2035 from './components/HeaderD2035';
import TaskProgressBar from './components/TaskProgressBar';
import TaskList from './components/TaskList';
import FinalizeButton from './components/FinalizeButton';
import Sidebar from './components/Sidebar';

const D2035 = () => {
  const tasks = [
    'Catégoriser toutes les transactions',
    'Immobilisations, amortissements et cessions',
    'Ventiler les repas hors domicile',
    'Retraiter les frais de véhicule',
    'Ventiler les échéances d\'emprunts',
    'Chèques non encaissés de 2022',
    'Chèques non encaissés de 2023',
    'Saisir les frais de blanchissage à domicile',
    'Barème kilométrique forfaitaire',
    'Vérifier les comptes financiers',
    'Évolution de la caisse',
    'Cotisations Urssaf à ventiler',
    'Saisie du compte commun ou de la SCM',
    'Réductions d\'impôt pour les frais de comptabilité',
    'Cotisations facultatives déductibles',
    'Exonérations fiscales et crédits d\'impôts',
    'Identité de l\'entrepreneur',
    'Informations relatives à l\'activité',
    'Informations relatives à l\'exercice fiscal',
    'Valider la clôture',
  ];
  return (
    <Box textAlign="center" alignItems="center" justifyContent="center">
      <HeaderD2035 />
      <Box m={4} >
      <FinalizeButton />
      </Box>
      <Box textAlign="center" alignItems="center" justifyContent="center" borderRadius="10px" borderWidth={1} m={4} >
        <TaskProgressBar completedTasks={19} totalTasks={20} timeSpent={1} />
        <TaskList tasks={tasks} />
      </Box>
      <Sidebar/>
    </Box>
  );
};

export default D2035;
