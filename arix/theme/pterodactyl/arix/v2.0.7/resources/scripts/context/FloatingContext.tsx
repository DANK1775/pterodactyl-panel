import React, { createContext, useContext, useState } from 'react';

const FloatingContext = createContext<{
    floating: boolean;
    setFloating: (v: boolean) => void;
}>({
    floating: false,
    setFloating: () => {},
});

export const FloatingProvider: React.FC = ({ children }) => {
    const [floating, setFloating] = useState(false);

    return (
        <FloatingContext.Provider value={{ floating, setFloating }}>
            {children}
        </FloatingContext.Provider>
    );
};

export const useFloating = () => useContext(FloatingContext);