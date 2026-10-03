import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { cores, fonte } from '../theme';

export default function LinhaDetalhe({ rotulo, valor, explicacao }) {
  return (
    <View accessible accessibilityLabel={`${rotulo}: ${valor}. ${explicacao ?? ''}`} style={estilos.linha}>
      <View style={estilos.topo}>
        <Text style={estilos.rotulo}>{rotulo}</Text>
        <Text style={estilos.valor}>{valor}</Text>
      </View>
      {explicacao ? <Text style={estilos.explicacao}>{explicacao}</Text> : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  linha: { gap: 2 },
  topo: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' },
  rotulo: { fontSize: fonte.corpo, color: cores.texto, flexShrink: 1 },
  valor: { fontSize: fonte.corpo, fontWeight: '700', color: cores.texto },
  explicacao: { fontSize: fonte.pequeno, color: cores.textoSecundario, lineHeight: 20 },
});
