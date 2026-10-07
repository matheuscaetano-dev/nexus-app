import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import  AppNavigator  from './src/navigation/AppNavigator';
import { ConexaoProvider } from './src/context/ConexaoContext';
import { AcessibilidadeProvider } from './src/context/AcessibilidadeContext';
import { useAcessibilidade } from './src/context/AcessibilidadeContext';

function BarraStatusAcessivel() {
  const { altoContraste } = useAcessibilidade();
  return <StatusBar style={altoContraste ? 'light' : 'dark'} />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ConexaoProvider>
        <AcessibilidadeProvider>
          <BarraStatusAcessivel />
          <AppNavigator />
        </AcessibilidadeProvider>
      </ConexaoProvider>
    </SafeAreaProvider>
  );
}
