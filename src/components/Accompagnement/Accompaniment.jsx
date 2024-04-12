// Accompaniment.js
import React from 'react';
import SpecialistsComponent from './components/SpecialistsComponent';
import TitleSubtitleComponent from './components/TitleSubtitleComponent';
import KnowledgeBaseCard from './components/KnowledgeBaseCard';
import HelpCenterCard from './components/HelpCenterCard';
import AllerPlusLoin from './components/AllerPlusLoin';
import CreerUneSci from './components/CreerUneSci';

function Accompaniment() {
  return (
    <div>
      <h1>Accompaniment Page</h1>
      <SpecialistsComponent/>
      <TitleSubtitleComponent/>
      <KnowledgeBaseCard/>
      <HelpCenterCard/>
      <AllerPlusLoin/>
      <CreerUneSci/>
    </div>
  );
}

export default Accompaniment;
