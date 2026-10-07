import React from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { ViewAcessivel as View, TextoAcessivel as Text } from '../context/AcessibilidadeContext';
import { cores, fonte } from '../theme';
import BotaoPrincipal from './BotaoPrincipal';

export function EstadoCarregando({ mensagem = 'Carregando previsão…' }) {
  return (
    <View style={estilos.caixa} accessibilityLiveRegion="polite" accessible accessibilityLabel={mensagem}>
      <ActivityIndicator size="large" color={cores.primaria} />
      <Text style={estilos.texto}>{mensagem}</Text>
    </View>
  );
}

export function EstadoErro({ erro, onTentarNovamente }) {
  const mensagens = {
    configuracao: 'A API ainda não está configurada corretamente. Confira o arquivo .env e reinicie o Expo.',
    rede: 'Não foi possível conectar. Verifique sua internet e tente de novo.',
    timeout: 'A consulta demorou demais. Tente de novo.',
    servidor: 'O serviço de previsão está com problemas no momento. Tente mais tarde.',
    resposta: 'O serviço de previsão retornou dados inválidos. Tente mais tarde.',
  };
  return (
    <View style={estilos.caixa} accessibilityRole="alert" accessibilityLiveRegion="assertive">
      <Text style={estilos.titulo}>Não foi possível carregar a previsão</Text>
      <Text style={estilos.texto}>{mensagens[erro?.tipo] ?? 'Algo deu errado. Tente de novo.'}</Text>
      <BotaoPrincipal titulo="Tentar de novo" onPress={onTentarNovamente} />
    </View>
  );
}

const estilos = StyleSheet.create({
  caixa: { gap: 12, paddingVertical: 24, alignItems: 'stretch' },
  titulo: { fontSize: fonte.subtitulo, fontWeight: '700', color: cores.texto },
  texto: { fontSize: fonte.corpo, color: cores.textoSecundario, textAlign: 'left' },
});
