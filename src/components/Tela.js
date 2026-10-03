import React from 'react';
import { ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MarcaNexus from './MarcaNexus';
import { cores, espaco } from '../theme';

export default function Tela({ children, edges = ['top', 'left', 'right'] }) {
  const { width } = useWindowDimensions();
  const paddingHorizontal = width <= 360 ? espaco.lg : width >= 768 ? espaco.xl + espaco.sm : espaco.xl;

  return (
    <SafeAreaView style={estilos.safe} edges={edges}>
      <ScrollView
        contentContainerStyle={[estilos.conteudo, { paddingHorizontal }]}
        keyboardShouldPersistTaps="handled"
      >
        <MarcaNexus />
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  safe: { flex: 1, backgroundColor: cores.fundo },
  conteudo: {
    flexGrow: 1,
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
    paddingTop: espaco.xl,
    paddingBottom: espaco.xl * 2,
    gap: espaco.lg,
  },
});
