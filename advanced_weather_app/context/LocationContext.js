import React, { createContext, useContext, useState } from 'react';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    
    const [selectedLocation, setSelectedLocation] = useState(null); 

    return (
        <LocationContext.Provider value={{
            location,
            setLocation,
            errorMsg,
            setErrorMsg,
            selectedLocation,
            setSelectedLocation
        }}>
            {children}
        </LocationContext.Provider>
    );
};

export const useLocation = () => useContext(LocationContext);