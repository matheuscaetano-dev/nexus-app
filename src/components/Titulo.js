import React from 'react';
import { StyleSheet } from 'react-native';
import { ViewAcessivel as View, TextoAcessivel as Text } from '../context/AcessibilidadeContext';
import { cores, fonte } from '../theme';

export default function Titulo({ titulo, subtitulo }) {
  return (
    <View style={estilos.caixa}>
      <Text accessibilityRole="header" style={estilos.titulo}>{titulo}</Text>
      {subtitulo ? <Text style={estilos.subtitulo}>{subtitulo}</Text> : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  caixa: { gap: 4 },
  titulo: { fontSize: fonte.titulo, fontWeight: '700', color: cores.texto },
  subtitulo: { fontSize: fonte.corpo, color: cores.textoSecundario, lineHeight: 22 },
});
