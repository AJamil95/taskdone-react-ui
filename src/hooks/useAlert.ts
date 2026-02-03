import { useContext } from 'react';
import { AlertContext } from '../context/alert';

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context)
    throw new Error('AlertContext debe usarse dentro de un AlertProvider');
  return context;
};
