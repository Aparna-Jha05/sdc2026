"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AppState {
  crisisMode: boolean;
  setCrisisMode: (value: boolean) => void;
  crisisAlertOpen: boolean;
  setCrisisAlertOpen: (value: boolean) => void;
  alertMessage: string;
  setAlertMessage: (message: string) => void;
}

const AppStateContext = createContext<AppState | undefined>(undefined);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [crisisMode, setCrisisMode] = useState(false);
  const [crisisAlertOpen, setCrisisAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const value = {
    crisisMode,
    setCrisisMode,
    crisisAlertOpen,
    setCrisisAlertOpen,
    alertMessage,
    setAlertMessage,
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
}
