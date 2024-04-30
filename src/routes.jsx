import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Pilotage from './components/Pilotage/Pilotage';
import Transactions from './components/Transactions/Transactions';
import Todo from './components/Afaire/Todo';
import Documents from './components/Documents/Documents';
import Accompaniment from './components/Accompagnement/Accompaniment';
import Sponsorship from './components/Sponsorship';
import Profile from './components/Profile/Profile';
import D2035 from './components/D2035/D2035';
import Parrainage from './components/Parrainage/Parrainage';
import Logout from './Logout';
// Composants pour les nouvelles routes
const CatégoriserToutesLesTransactions = () => {
  return <div>Catégoriser toutes les transactions</div>;
};

const ImmobilisationsAmortissementsEtCessions = () => {
  return <div>Immobilisations, amortissements et cessions</div>;
};

const VentilerLesRepasHorsDomicile = () => {
  return <div>Ventiler les repas hors domicile</div>;
};

const RetraiterLesFraisDeVéhicule = () => {
  return <div>Retraiter les frais de véhicule</div>;
};

const VentilerLesÉchéancesDEmprunts = () => {
  return <div>Ventiler les échéances d'emprunts</div>;
};

const ChèquesNonEncaissésDe2022 = () => {
  return <div>Chèques non encaissés de 2022</div>;
};

const ChèquesNonEncaissésDe2023 = () => {
  return <div>Chèques non encaissés de 2023</div>;
};

const SaisirLesFraisDeBlanchissageÀDomicile = () => {
  return <div>Saisir les frais de blanchissage à domicile</div>;
};

const BarèmeKilométriqueForfaitaire = () => {
  return <div>Barème kilométrique forfaitaire</div>;
};

const VérifierLesComptesFinanciers = () => {
  return <div>Vérifier les comptes financiers</div>;
};

const ÉvolutionDeLaCaisse = () => {
  return <div>Évolution de la caisse</div>;
};

const CotisationsUrssafÀVentiler = () => {
  return <div>Cotisations Urssaf à ventiler</div>;
};

const SaisieDuCompteCommunOuDeLaSCM = () => {
  return <div>Saisie du compte commun ou de la SCM</div>;
};

const RéductionsDImpôtPourLesFraisDeComptabilité = () => {
  return <div>Réductions d'impôt pour les frais de comptabilité</div>;
};

const CotisationsFacultativesDéductibles = () => {
  return <div>Cotisations facultatives déductibles</div>;
};

const ExonérationsFiscalesEtCréditsDImpôts = () => {
  return <div>Exonérations fiscales et crédits d'impôts</div>;
};

const IdentitéDeLEntrepreneur = () => {
  return <div>Identité de l'entrepreneur</div>;
};

const InformationsRelativesÀLActivité = () => {
  return <div>Informations relatives à l'activité</div>;
};

const InformationsRelativesÀLExerciceFiscal = () => {
  return <div>Informations relatives à l'exercice fiscal</div>;
};

const ValiderLaClôture = () => {
  return <div>Valider la clôture</div>;
};

// Define a component that will handle all routes
export const Road = ({ showSidebar }) => {
  return (
    <Routes>
      <Route path="/" element={<Pilotage />} />
      <Route path="/pilotage" element={<Pilotage />} />
      <Route path="/transactions" element={<Transactions />} />
      <Route path="/todo" element={<Todo />} />
      <Route path="/documents" element={<Documents />} />
      <Route path="/accompaniment" element={<Accompaniment />} />
      <Route path="/sponsorship" element={<Sponsorship />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/parrainage" element={<Parrainage />} />
      <Route path="/d2035" element={<D2035 />} />
      <Route path="/catégoriser-toutes-les-transactions" element={<CatégoriserToutesLesTransactions />} />
      <Route path="/immobilisations-amortissements-et-cessions" element={<ImmobilisationsAmortissementsEtCessions />} />
      <Route path="/ventiler-les-repas-hors-domicile" element={<VentilerLesRepasHorsDomicile />} />
      <Route path="/retraiter-les-frais-de-véhicule" element={<RetraiterLesFraisDeVéhicule />} />
      <Route path="/ventiler-les-échéances-d-emprunts" element={<VentilerLesÉchéancesDEmprunts />} />
      <Route path="/chèques-non-encaissés-de-2022" element={<ChèquesNonEncaissésDe2022 />} />
      <Route path="/chèques-non-encaissés-de-2023" element={<ChèquesNonEncaissésDe2023 />} />
      <Route path="/saisir-les-frais-de-blanchissage-à-domicile" element={<SaisirLesFraisDeBlanchissageÀDomicile />} />
      <Route path="/barème-kilométrique-forfaitaire" element={<BarèmeKilométriqueForfaitaire />} />
      <Route path="/vérifier-les-comptes-financiers" element={<VérifierLesComptesFinanciers />} />
      <Route path="/évolution-de-la-caisse" element={<ÉvolutionDeLaCaisse />} />
      <Route path="/cotisations-urssaf-à-ventiler" element={<CotisationsUrssafÀVentiler />} />
      <Route path="/saisie-du-compte-commun-ou-de-la-scm" element={<SaisieDuCompteCommunOuDeLaSCM />} />
      <Route path="/réductions-d-impôt-pour-les-frais-de-comptabilité" element={<RéductionsDImpôtPourLesFraisDeComptabilité />} />
      <Route path="/cotisations-facultatives-déductibles" element={<CotisationsFacultativesDéductibles />} />
      <Route path="/exonérations-fiscales-et-crédits-d-impôts" element={<ExonérationsFiscalesEtCréditsDImpôts />} />
      <Route path="/identité-de-l-entrepreneur" element={<IdentitéDeLEntrepreneur />} />
      <Route path="/informations-relatives-à-l-activité" element={<InformationsRelativesÀLActivité />} />
      <Route path="/informations-relatives-à-l-exercice-fiscal" element={<InformationsRelativesÀLExerciceFiscal />} />
      <Route path="/valider-la-clôture" element={<ValiderLaClôture />} />
      <Route path="/sedeconnecter" element={<Logout />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};