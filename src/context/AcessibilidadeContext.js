import React, { createContext, useContext, useMemo, useState } from 'react';
import { Pressable as NativePressable, ScrollView as NativeScrollView, StyleSheet, Text as NativeText, View as NativeView } from 'react-native';

const AcessibilidadeContext = createContext(null);

export function AcessibilidadeProvider({ children }) {
  const [textoAmpliado, setTextoAmpliado] = useState(false);
  const [altoContraste, setAltoContraste] = useState(false);
  const [toquesGrandes, setToquesGrandes] = useState(false);
  const valor = useMemo(() => ({ textoAmpliado, setTextoAmpliado, altoContraste, setAltoContraste, toquesGrandes, setToquesGrandes }), [textoAmpliado, altoContraste, toquesGrandes]);
  return <AcessibilidadeContext.Provider value={valor}>{children}</AcessibilidadeContext.Provider>;
}

export function useAcessibilidade() {
  const contexto = useContext(AcessibilidadeContext);
  if (!contexto) throw new Error('useAcessibilidade deve ser usado dentro de AcessibilidadeProvider.');
  return contexto;
}

function estiloAcessivel(style, { altoContraste, toquesGrandes }, tipo) {
  const base = StyleSheet.flatten(style) || {};
  const ajustes = {};
  if (altoContraste && tipo !== 'text') {
    if (base.backgroundColor) ajustes.backgroundColor = fundoDeAltoContraste(base.backgroundColor, base, tipo);
    if (base.borderColor) ajustes.borderColor = '#777777';
    if (base.borderBottomColor) ajustes.borderBottomColor = '#404040';
  }
  if (altoContraste && tipo === 'text') ajustes.color = textoDeAltoContraste(base.color);
  if (toquesGrandes && tipo === 'pressable') ajustes.minHeight = Math.max(base.minHeight || 0, 56);
  return [style, ajustes];
}

function componentesHsl(cor) {
  if (typeof cor !== 'string' || !/^#[\da-f]{6}$/i.test(cor)) return null;
  const r = parseInt(cor.slice(1, 3), 16) / 255;
  const g = parseInt(cor.slice(3, 5), 16) / 255;
  const b = parseInt(cor.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (delta) {
    s = delta / (1 - Math.abs(2 * l - 1));
    if (max === r) h = ((g - b) / delta) % 6;
    else if (max === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
    h = (h * 60 + 360) % 360;
  }
  return { h, s, l };
}

function fundoDeAltoContraste(cor, estilo, tipo) {
  if (cor === 'transparent') return cor;
  if (tipo === 'view' && ((typeof estilo.width === 'number' && estilo.width <= 4) || (typeof estilo.height === 'number' && estilo.height <= 4))) return '#FFFFFF';
  const hsl = componentesHsl(cor);
  if (!hsl) return '#161616';
  if (hsl.l < 0.035 && hsl.s < 0.16) return '#000000';
  if (hsl.s < 0.12) {
    if (hsl.l < 0.12 || hsl.l > 0.88) return '#121212';
    return '#202020';
  }
  if (tipo === 'pressable') return '#202020';
  return hsl.l > 0.72 ? '#181818' : '#242424';
}

function textoDeAltoContraste() {
  return '#FFFFFF';
}

export function TextoAcessivel({ style, capitalizar = false, ...props }) {
  const acessibilidade = useAcessibilidade();
  const original = StyleSheet.flatten(style) || {};
  const tamanho = original.fontSize || 16;
  const transformarTitulo = capitalizar || props.accessibilityRole === 'header';
  return <NativeText {...props} style={[style, transformarTitulo && { textTransform: 'capitalize' }, estiloAcessivel(style, acessibilidade, 'text'), acessibilidade.textoAmpliado && { fontSize: tamanho * 1.18 }]} />;
}

export function ViewAcessivel({ style, ...props }) {
  const acessibilidade = useAcessibilidade();
  return <NativeView {...props} style={estiloAcessivel(style, acessibilidade, 'view')} />;
}

export function PressableAcessivel({ style, ...props }) {
  const acessibilidade = useAcessibilidade();
  const styleFinal = typeof style === 'function'
    ? (state) => estiloAcessivel(style(state), acessibilidade, 'pressable')
    : estiloAcessivel(style, acessibilidade, 'pressable');
  return <NativePressable {...props} style={styleFinal} />;
}

export function ScrollViewAcessivel({ style, ...props }) {
  const acessibilidade = useAcessibilidade();
  return <NativeScrollView {...props} style={estiloAcessivel(style, acessibilidade, 'view')} />;
}
