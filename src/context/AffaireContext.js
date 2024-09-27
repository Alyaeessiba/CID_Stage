import React, { createContext, useState, useContext } from 'react';

const AffaireContext = createContext();

export const AffaireProvider = ({ children }) => {
  const [currentAffaireId, setCurrentAffaireId] = useState(null);

  return (
    <AffaireContext.Provider value={{ currentAffaireId, setCurrentAffaireId }}>
      {children}
    </AffaireContext.Provider>
  );
};

export const useAffaire = () => useContext(AffaireContext);