import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { cores, raio, fonte } from '../theme';

export default function AvisoInfo({ children }) {
  return (
    <View style={estilos.caixa}>
      <Text style={estilos.texto}>{children}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  caixa: { backgroundColor: cores.aviso, borderRadius: raio.md, padding: 14 },
  texto: { fontSize: fonte.pequeno, color: cores.textoSecundario, lineHeight: 20 },
});
