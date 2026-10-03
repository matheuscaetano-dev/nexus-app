import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { niveisCor, fonte } from '../theme';

// Usado para qualidade (boa/regular/instavel) e adequação das atividades.
// A informação principal é o TEXTO; símbolo e cor são só reforço (RNF03).
export default function BadgeNivel({ corId, rotulo, simbolo, grande }) {
  const c = niveisCor[corId];
  return (
    <View style={[estilos.badge, { backgroundColor: c.fundo, borderColor: c.texto }]}>
      <Text importantForAccessibility="no" accessibilityElementsHidden style={[estilos.simbolo, { color: c.texto }]}>
        {simbolo}
      </Text>
      <Text style={[estilos.texto, { color: c.texto }, grande && { fontSize: 22 }]}>{rotulo}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  badge: {
    flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: 8,
    paddingVertical: 6, paddingHorizontal: 14, borderRadius: 999, borderWidth: 1.5, flexShrink: 1,
  },
  simbolo: { fontSize: fonte.corpo, fontWeight: '800' },
  texto: { fontSize: fonte.corpo, fontWeight: '700', flexShrink: 1 },
});
