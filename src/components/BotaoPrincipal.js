import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { cores, raio, AREA_MINIMA, fonte } from '../theme';

export default function BotaoPrincipal({ titulo, onPress, variante = 'primario', desabilitado, dica }) {
  const secundario = variante === 'secundario';
  return (
    <Pressable
      onPress={onPress}
      disabled={desabilitado}
      accessibilityRole="button"
      accessibilityLabel={titulo}
      accessibilityHint={dica}
      accessibilityState={{ disabled: !!desabilitado }}
      style={({ pressed }) => [
        estilos.botao,
        secundario ? estilos.secundario : estilos.primario,
        desabilitado && estilos.desabilitado,
        pressed && { opacity: 0.85 },
      ]}
    >
      <Text style={[estilos.texto, { color: secundario ? cores.primaria : cores.sobrePrimaria }]}>{titulo}</Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  botao: {
    minHeight: AREA_MINIMA + 4, borderRadius: raio.md, paddingVertical: 14, paddingHorizontal: 20,
    alignItems: 'center', justifyContent: 'center',
  },
  primario: { backgroundColor: cores.primaria },
  secundario: { backgroundColor: cores.superficie, borderWidth: 2, borderColor: cores.primaria },
  desabilitado: { opacity: 0.5 },
  texto: { fontSize: fonte.corpo + 1, fontWeight: '700', textAlign: 'center' },
});
