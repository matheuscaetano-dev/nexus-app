import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { ViewAcessivel as View, TextoAcessivel as Text } from '../context/AcessibilidadeContext';
import { APP_NOME } from '../config';
import { cores } from '../theme';

export default function MarcaNexus({ completa = false }) {
  if (completa) {
    return <Image source={require('../../assets/logo-nexus.png')} style={estilos.logoCompleta} resizeMode="contain" accessible accessibilityLabel={`${APP_NOME}, logo`} />;
  }

  return (
    <View style={estilos.marca} accessible accessibilityRole="text" accessibilityLabel={`${APP_NOME}, previsão de conexão`}>
      <Image source={require('../../assets/logo-nexus-simbolo.png')} style={estilos.simbolo} resizeMode="contain" importantForAccessibility="no" accessibilityElementsHidden />
      <Text style={estilos.nome}>{APP_NOME}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  marca: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 2 },
  simbolo: { width: 42, height: 42 },
  logoCompleta: { width: 112, height: 98 },
  nome: { fontSize: 21, fontWeight: '800', letterSpacing: 0.2, color: cores.texto },
});
