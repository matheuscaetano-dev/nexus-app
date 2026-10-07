import React from 'react';
import { StyleSheet } from 'react-native';
import { PressableAcessivel as Pressable, TextoAcessivel as Text } from '../context/AcessibilidadeContext';
import { cores, raio, AREA_MINIMA, fonte } from '../theme';

export default function BotaoPrincipal({ titulo, onPress, variante = 'primario', desabilitado, dica, estiloContexto }) {
  const isSecundario = variante === 'secundario';
  const isContorno = variante === 'contorno';
  
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
        isSecundario && estilos.secundario,
        isContorno && estilos.contorno,
        desabilitado && estilos.desabilitado,
        pressed && { opacity: 0.85 },
        estiloContexto
      ]}
    >
      <Text style={[
        estilos.texto,
        isSecundario && estilos.textoSecundario,
        isContorno && estilos.textoContorno
      ]}>{titulo}</Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  botao: {
    minHeight: AREA_MINIMA + 4, borderRadius: raio.lg, paddingVertical: 14, paddingHorizontal: 20,
    alignItems: 'center', justifyContent: 'center', backgroundColor: cores.primaria,
  },
  secundario: { backgroundColor: 'transparent' },
  contorno: { backgroundColor: 'transparent', borderWidth: 1, borderColor: cores.borda },
  desabilitado: { opacity: 0.5 },
  texto: { fontSize: fonte.corpo, fontWeight: '700', color: cores.sobrePrimaria },
  textoSecundario: { color: cores.primaria },
  textoContorno: { color: cores.texto },
});
