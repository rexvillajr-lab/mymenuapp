import React, { createContext, useContext, useState, ReactNode } from 'react';

type ThemeColors = {
  background: string;
  surface: string;
  card: string;

  text: string;
  textSecondary: string;

  border: string;

  modalBackground: string;
  modalOverlay: string;

  button: string;
  buttonText: string;

  buttonSecondary: string;
  buttonSecondaryText: string;

  deleteButton: string;
  deleteButtonText: string;
};

type ThemeContextType = {
  isDarkMode: boolean;
  colors: ThemeColors;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

type Props = {
  children: ReactNode;
};

export const ThemeProvider = ({ children }: Props) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  const colors: ThemeColors = isDarkMode
    ? {
        background: '#121212',
        surface: '#1e1e1e',
        card: '#242424',

        text: '#ffffff',
        textSecondary: '#b3b3b3',

        border: '#2c2c2c',

        modalBackground: '#1e1e1e',
        modalOverlay: 'rgba(0,0,0,0.6)',

        button: '#f0f0f0',
        buttonText: '#121212',

        buttonSecondary: '#2a2a2a',
        buttonSecondaryText: '#ffffff',

        deleteButton: '#c92a2a',
        deleteButtonText: '#ffffff',
      }
    : {
        background: '#ffffff',
        surface: '#f7f7f7',
        card: '#f0f0f0',

        text: '#000000',
        textSecondary: '#555555',

        border: '#e0e0e0',

        modalBackground: '#ffffff',
        modalOverlay: 'rgba(0,0,0,0.4)',

        button: '#26547c',
        buttonText: '#ffffff',

        buttonSecondary: '#edf2f7',
        buttonSecondaryText: '#102a43',

        deleteButton: '#c92a2a',
        deleteButtonText: '#ffffff',
      };

  return (
    <ThemeContext.Provider value={{ isDarkMode, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }

  return context;
};
