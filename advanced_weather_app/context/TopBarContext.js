import React, { createContext, useContext, useState } from 'react';

const TopBarContext = createContext();

export const TopBarProvider = ({ children }) => {
  const [searchText, setSearchText] = useState(''); 
  const [geoClicked, setGeoClicked] = useState(false);
  const [lastUsed, setLastUsed] = useState('');

  return (
    <TopBarContext.Provider value={{
      searchText,
      setSearchText,
      geoClicked,
      setGeoClicked,
      lastUsed,
      setLastUsed
    }}>
      {children}
    </TopBarContext.Provider>
  );
};

export const useTopBar = () => useContext(TopBarContext);
