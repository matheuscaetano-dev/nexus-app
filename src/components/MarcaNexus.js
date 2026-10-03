import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { APP_NOME } from '../config';
import { cores } from '../theme';

export default function MarcaNexus() {
  return (
    <View style={estilos.marca} accessible accessibilityRole="text" accessibilityLabel={`${APP_NOME}, previsão de conexão`}>
      <View style={estilos.simbolo} importantForAccessibility="no-hide-descendants" accessibilityElementsHidden>
        <Text style={estilos.letra}>N</Text>
        <View style={estilos.ponto} />
      </View>
      <Text style={estilos.nome}>{APP_NOME}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  marca: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 2 },
  simbolo: {
    width: 40, height: 40, borderRadius: 13, backgroundColor: cores.primaria,
    alignItems: 'center', justifyContent: 'center',
  },
  letra: { color: cores.sobrePrimaria, fontSize: 25, lineHeight: 30, fontWeight: '800' },
  ponto: {
    position: 'absolute', width: 6, height: 6, borderRadius: 3,
    backgroundColor: '#B9E4CF', right: 7, bottom: 7,
  },
  nome: { fontSize: 21, fontWeight: '800', letterSpacing: 0.2, color: cores.texto },
});
