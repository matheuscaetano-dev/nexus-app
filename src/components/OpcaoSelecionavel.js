import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { cores, raio, AREA_MINIMA, fonte } from '../theme';

// Opção de escolha única (rádio). Estado aparece em texto ("Selecionado"), não só por cor.
export default function OpcaoSelecionavel({ rotulo, detalhe, selecionado, desabilitado, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={desabilitado}
      accessibilityRole="radio"
      accessibilityLabel={detalhe ? `${rotulo}, ${detalhe}` : rotulo}
      accessibilityState={{ checked: !!selecionado, disabled: !!desabilitado }}
      style={[estilos.opcao, selecionado && estilos.selecionada, desabilitado && { opacity: 0.5 }]}
    >
      <View style={{ flex: 1 }}>
        <Text style={estilos.rotulo}>{rotulo}</Text>
        {detalhe ? <Text style={estilos.detalhe}>{detalhe}</Text> : null}
        {selecionado ? <Text style={estilos.estado}>Selecionado</Text> : null}
      </View>
      <View style={[estilos.marca, selecionado && estilos.marcaAtiva]}>
        {selecionado ? <Text importantForAccessibility="no" style={estilos.check}>✓</Text> : null}
      </View>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  opcao: {
    minHeight: AREA_MINIMA + 8, flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: cores.superficie, borderRadius: raio.md, borderWidth: 1.5, borderColor: cores.borda,
    paddingVertical: 12, paddingHorizontal: 16,
  },
  selecionada: { borderColor: cores.primaria, borderWidth: 2.5, backgroundColor: '#EAF5EF' },
  rotulo: { fontSize: fonte.corpo, fontWeight: '600', color: cores.texto },
  detalhe: { fontSize: fonte.pequeno, color: cores.textoSecundario },
  estado: { fontSize: fonte.pequeno, color: cores.primaria, fontWeight: '700' },
  marca: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: cores.borda, alignItems: 'center', justifyContent: 'center' },
  marcaAtiva: { backgroundColor: cores.primaria, borderColor: cores.primaria },
  check: { color: cores.sobrePrimaria, fontWeight: '800' },
});
