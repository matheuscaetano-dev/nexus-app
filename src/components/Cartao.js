import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { cores, raio, espaco, fonte } from '../theme';

export default function Cartao({ titulo, children, style }) {
  return (
    <View style={[estilos.cartao, style]}>
      {titulo ? <Text accessibilityRole="header" style={estilos.titulo}>{titulo}</Text> : null}
      {children}
    </View>
  );
}

const estilos = StyleSheet.create({
  cartao: {
    backgroundColor: cores.superficie, borderRadius: raio.lg, padding: espaco.lg,
    gap: espaco.md, borderWidth: 1, borderColor: cores.divisor,
  },
  titulo: { fontSize: fonte.subtitulo, fontWeight: '700', color: cores.texto },
});
