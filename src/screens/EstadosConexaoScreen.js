import React from 'react';
import { Alert, StyleSheet } from 'react-native';
import { ScrollViewAcessivel as ScrollView, TextoAcessivel as Text, ViewAcessivel as View } from '../context/AcessibilidadeContext';
import Cartao from '../components/Cartao';
import BotaoPrincipal from '../components/BotaoPrincipal';
import { cores, espaco, raio } from '../theme';

export default function EstadosConexaoScreen({ navigation }) {
  const ItemEstado = ({ icone, titulo, texto, btnTexto, btnVariante='contorno', onPress }) => (
    <Cartao style={estilos.cartaoEstado}>
      <View style={estilos.linhaEstado}>
        <Text style={estilos.iconeEstado}>{icone}</Text>
        <View style={estilos.textosEstado}>
          <Text capitalizar style={estilos.tituloEstado}>{titulo}</Text>
          <Text style={estilos.descEstado}>{texto}</Text>
        </View>
        <View style={estilos.btnContainer}>
          <BotaoPrincipal titulo={btnTexto} variante={btnVariante} onPress={onPress} estiloContexto={estilos.btnPequeno} />
        </View>
      </View>
    </Cartao>
  );

  return (
    <ScrollView style={estilos.tela} contentContainerStyle={estilos.conteudo}>
      <Text style={estilos.overline}>ESTADOS REAIS DA INTERFACE</Text>
      <Text capitalizar style={estilos.tituloGigante}>Estados de conexão</Text>
      
      <View style={estilos.boxInfo}>
        <Text style={estilos.boxTexto}>💡 Cada estado combina ícone, título, mensagem e ação — nunca depende somente da cor.</Text>
      </View>

      <ItemEstado icone="⏳" titulo="Conectando ao servidor" texto="A consulta pode levar alguns segundos." btnTexto="Aguardar" onPress={() => Alert.alert('Consulta em andamento', 'A previsão será exibida assim que a consulta terminar.')} />
      <ItemEstado icone="❌" titulo="Sem conexão com o servidor" texto="Não foi possível acessar o serviço agora." btnTexto="Tentar de novo" onPress={() => navigation.navigate('Abas', { screen: 'Inicio' })} />
      <ItemEstado icone="⚠️" titulo="Nenhuma estação encontrada" texto="Não há referência disponível nesta região." btnTexto="Outra cidade" onPress={() => navigation.navigate('Localizacao')} />
      <ItemEstado icone="⚙️" titulo="Modelo indisponível" texto="O modelo escolhido não responde no momento." btnTexto="Trocar modelo" onPress={() => navigation.navigate('EscolherModelo')} />
      <ItemEstado icone="📡" titulo="Sem previsão" texto="Ainda não há uma previsão para exibir." btnTexto="Atualizar" onPress={() => navigation.navigate('Abas', { screen: 'Inicio' })} />
      
      <BotaoPrincipal titulo="Ir para Planejamento →" onPress={() => navigation.navigate('Planejar')} estiloContexto={{marginTop: espaco.xl}} />
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: espaco.xl, paddingBottom: espaco.xxl * 2 },
  overline: { fontSize: 11, fontWeight: '800', color: cores.primaria, letterSpacing: 0.5, marginBottom: 4 },
  tituloGigante: { fontSize: 32, fontWeight: '800', color: cores.texto, lineHeight: 36, marginBottom: espaco.md },
  boxInfo: { backgroundColor: 'transparent', paddingVertical: espaco.sm, marginBottom: espaco.lg },
  boxTexto: { fontSize: 13, color: cores.textoSecundario, lineHeight: 18, fontWeight: '600' },
  cartaoEstado: { marginBottom: espaco.sm, padding: espaco.md },
  linhaEstado: { flexDirection: 'row', alignItems: 'center', gap: espaco.sm },
  iconeEstado: { fontSize: 24 },
  textosEstado: { flex: 1 },
  tituloEstado: { fontSize: 14, fontWeight: '800', color: cores.texto, marginBottom: 2 },
  descEstado: { fontSize: 11, color: cores.textoSecundario, lineHeight: 16 },
  btnContainer: { marginLeft: espaco.xs },
  btnPequeno: { paddingVertical: 8, paddingHorizontal: 12, minHeight: 0, borderRadius: 8 }
});
