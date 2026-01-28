import React, { createContext, useContext, useState } from 'react';

const UIContext = createContext(null);

export function UIProvider({ children }) {
  const [toast, setToast] = useState(null); // {type, message}

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <UIContext.Provider value={{ toast, showToast }}>
      {children}
    </UIContext.Provider>
  );
}

export const useUI = () => useContext(UIContext);
``