import React from 'react';
import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from '@expo-google-fonts/inter';
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
  const [fontesCarregadas, erroFonte] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  if (!fontesCarregadas && !erroFonte) return null;
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
