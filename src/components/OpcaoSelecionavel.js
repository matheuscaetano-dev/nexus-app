import React from 'react';
import { StyleSheet } from 'react-native';
import { PressableAcessivel as Pressable, ViewAcessivel as View, TextoAcessivel as Text } from '../context/AcessibilidadeContext';
import { cores, raio, AREA_MINIMA, fonte, espaco } from '../theme';

export default function OpcaoSelecionavel({ rotulo, detalhe, versao, selecionado, desabilitado, onPress }) {
  return (
    <Pressable onPress={onPress} disabled={desabilitado} accessibilityRole="radio" accessibilityState={{ checked: !!selecionado, disabled: !!desabilitado }} style={[estilos.opcao, selecionado && estilos.selecionada, desabilitado && { opacity: 0.5 }]}>
      <View style={[estilos.radio, selecionado && estilos.radioAtivo]}>
        {selecionado && <View style={estilos.radioInner} />}
      </View>
      <View style={{ flex: 1, marginLeft: espaco.md }}>
        <Text style={[estilos.rotulo, selecionado && estilos.rotuloAtivo]}>{rotulo}</Text>
        {detalhe ? <Text style={estilos.detalhe}>{detalhe}</Text> : null}
      </View>
      {versao && <Text style={estilos.versao}>{versao}</Text>}
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  opcao: {
    minHeight: AREA_MINIMA + 8, flexDirection: 'row', alignItems: 'center',
    backgroundColor: cores.superficie, borderRadius: raio.lg, borderWidth: 1, borderColor: cores.divisor,
    paddingVertical: 16, paddingHorizontal: 16, marginBottom: espaco.sm
  },
  selecionada: { borderColor: cores.primaria, borderWidth: 2, backgroundColor: cores.sucessoFundo },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: cores.borda, alignItems: 'center', justifyContent: 'center' },
  radioAtivo: { borderColor: cores.primaria },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: cores.primaria },
  rotulo: { fontSize: fonte.corpo, fontWeight: '700', color: cores.texto },
  rotuloAtivo: { color: cores.primaria },
  detalhe: { fontSize: fonte.pequeno, color: cores.textoSecundario, marginTop: 2 },
  versao: { fontSize: 12, fontWeight: '700', color: cores.primaria, backgroundColor: '#D8EDE9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 }
});
