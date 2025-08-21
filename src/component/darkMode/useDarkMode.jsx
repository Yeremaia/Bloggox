import { useContext } from 'react';
import { DarkModeContext } from './darkModeContext';

export const useDarkMode = () => useContext(DarkModeContext);