import React from 'react';
import SplashScreenComponent from '@/components/SplashScreen'; // Renomeado para evitar conflito

export default function InitialSplashScreen() {
  // Este componente agora apenas renderiza o SplashScreen.
  // A lógica de navegação após o splash é gerenciada no SplashScreen.tsx e no _layout.tsx/App.tsx
  return <SplashScreenComponent />;
}
