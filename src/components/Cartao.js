import React from 'react';
import { StyleSheet } from 'react-native';
import { ViewAcessivel as View, TextoAcessivel as Text } from '../context/AcessibilidadeContext';
import { cores, raio, espaco, fonte } from '../theme';

export default function Cartao({ titulo, children, variante = 'padrao', style }) {
  const isDestaque = variante === 'destaque';
  
  return (
    <View style={[estilos.cartao, isDestaque && estilos.cartaoDestaque, style]}>
      {titulo ? (
        <Text accessibilityRole="header" style={[estilos.titulo, isDestaque && estilos.tituloDestaque]}>
          {titulo}
        </Text>
      ) : null}
      {children}
    </View>
  );
}

const estilos = StyleSheet.create({
  cartao: {
    backgroundColor: cores.superficie,
    borderRadius: raio.xl,
    padding: espaco.lg,
    gap: espaco.md,
    borderWidth: 1,
    borderColor: cores.divisor,
  },
  cartaoDestaque: {
    backgroundColor: cores.primaria,
    borderColor: cores.primaria,
  },
  titulo: {
    fontSize: fonte.subtitulo,
    fontWeight: '800',
    color: cores.texto
  },
  tituloDestaque: {
    color: cores.sobrePrimaria,
  }
});
