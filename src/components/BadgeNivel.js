import React from 'react';
import { StyleSheet } from 'react-native';
import { ViewAcessivel as View, TextoAcessivel as Text } from '../context/AcessibilidadeContext';
import { niveisCor, fonte } from '../theme';

export default function BadgeNivel({ corId = 'boa', rotulo, simbolo, iconeEsquerda = false }) {
  const c = niveisCor[corId] || niveisCor.boa;
  return (
    <View style={[estilos.badge, { backgroundColor: c.fundo }]}>
      {simbolo && iconeEsquerda && <Text style={[estilos.simbolo, { color: c.texto }]}>{simbolo}</Text>}
      <Text style={[estilos.texto, { color: c.texto }]}>{rotulo}</Text>
      {simbolo && !iconeEsquerda && <Text style={[estilos.simbolo, { color: c.texto }]}>{simbolo}</Text>}
    </View>
  );
}

const estilos = StyleSheet.create({
  badge: {
    flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: 4,
    paddingVertical: 6, paddingHorizontal: 12, borderRadius: 999,
  },
  simbolo: { fontSize: fonte.pequeno, fontWeight: '800' },
  texto: { fontSize: fonte.pequeno, fontWeight: '700', flexShrink: 1 },
});
