import React, { createContext, ReactNode, useContext, useState } from 'react';

interface StatusContextType {
  status: number;
  setStatus: (value: number) => void;
}

const StatusContext = createContext<StatusContextType | undefined>(undefined);

export const useStatus = (): StatusContextType => {
  const context = useContext(StatusContext);
  if (!context) {
    throw new Error("useStatus must be used within a StatusProvider");
  }
  return context;
};

interface StatusProviderProps {
  children: ReactNode;
}

export const StatusProvider: React.FC<StatusProviderProps> = ({ children }) => {
  const [status, setStatusValue] = useState(2);

  const setStatus = (value: number) => setStatusValue(value);

  return (
    <StatusContext.Provider value={{ status, setStatus }}>
      {children}
    </StatusContext.Provider>
  );
};