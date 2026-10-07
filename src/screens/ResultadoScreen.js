import React from 'react';
import { StyleSheet } from 'react-native';
import { ScrollViewAcessivel as ScrollView, TextoAcessivel as Text, ViewAcessivel as View } from '../context/AcessibilidadeContext';
import Cartao from '../components/Cartao';
import BadgeNivel from '../components/BadgeNivel';
import BotaoPrincipal from '../components/BotaoPrincipal';
import { cores, espaco, raio } from '../theme';

export default function ResultadoScreen({ navigation, route }) {
  const previsao = route?.params?.previsao;
  const atividade = route?.params?.atividade;
  return (
    <ScrollView style={estilos.tela} contentContainerStyle={estilos.conteudo}>
      <View style={estilos.cabecalho}>
        <Text style={estilos.overline}>DETALHES EM LINGUAGEM SIMPLES</Text>
        <Text capitalizar style={estilos.tituloGigante}>Por que essa previsão?</Text>
      </View>

      <Cartao>
        <View style={estilos.linhaTopoDetalhe}>
          <View>
            <Text style={estilos.labelModelo}>{atividade || 'Previsão atual'}</Text>
            <Text capitalizar style={estilos.tituloCartao}>Conexão {previsao?.nivel.rotulo.toLowerCase() || '—'}</Text>
          </View>
          {previsao && <BadgeNivel corId={previsao.nivel.id} rotulo={previsao.nivel.rotulo} simbolo={previsao.nivel.simbolo} iconeEsquerda />}
        </View>

        <View style={estilos.listaDetalhes}>
          <View style={estilos.itemDetalhe}>
            <Text style={estilos.iconeDetalhe}>⏱️</Text>
            <View style={estilos.textoDetalheContainer}>
              <Text style={estilos.tituloDetalhe}>RTT previsto</Text>
              <Text style={estilos.descDetalhe}>Tempo estimado para a resposta</Text>
            </View>
            <View style={estilos.valorDetalheContainer}>
              <Text style={estilos.valorDetalhePrincipal}>{previsao ? `${Number(previsao.latenciaMs).toFixed(1).replace('.', ',')} ms` : '—'}</Text>
              <Text style={estilos.valorDetalheBadge}>Estimativa</Text>
            </View>
          </View>
          
          <View style={estilos.itemDetalhe}>
            <Text style={estilos.iconeDetalhe}>📦</Text>
            <View style={estilos.textoDetalheContainer}>
              <Text style={estilos.tituloDetalhe}>Perda de pacotes</Text>
              <Text style={estilos.descDetalhe}>Pacotes que podem se perder</Text>
            </View>
            <View style={estilos.valorDetalheContainer}>
              <Text style={estilos.valorDetalhePrincipal}>{previsao ? `${Number(previsao.perdaPercentual).toFixed(1).replace('.', ',')}%` : '—'}</Text>
              <Text style={estilos.valorDetalheBadge}>Estimativa</Text>
            </View>
          </View>
          
          <View style={estilos.itemDetalhe}>
            <Text style={estilos.iconeDetalhe}>⚡</Text>
            <View style={estilos.textoDetalheContainer}>
              <Text style={estilos.tituloDetalhe}>Qualidade</Text>
              <Text style={estilos.descDetalhe}>{previsao?.nivel.resumo || 'Qualidade prevista para este período'}</Text>
            </View>
            <View style={estilos.valorDetalheContainer}>
              <Text style={estilos.valorDetalhePrincipal}>{previsao?.nivel.rotulo || '—'}</Text>
              <Text style={estilos.valorDetalheBadge}>{previsao?.modelo || 'Modelo'}</Text>
            </View>
          </View>
        </View>
      </Cartao>

      <Text capitalizar style={estilos.tituloSecaoMargin}>De onde vem?</Text>
      <Cartao>
        <View style={estilos.listaInfoBasico}>
          <View style={estilos.itemInfoBasico}>
            <Text style={estilos.iconeInfo}>📍</Text>
            <View style={estilos.textoDetalheContainer}>
              <Text style={estilos.tituloDetalheInfo}>Referência regional aproximada</Text>
              <Text style={estilos.descDetalheInfo}>{previsao?.distanciaProbeKm != null ? `Estação de referência a ${Number(previsao.distanciaProbeKm).toFixed(1).replace('.', ',')} km.` : 'A API ainda não informou a estação de referência.'}</Text>
            </View>
          </View>
          <View style={estilos.itemInfoBasico}>
            <Text style={estilos.iconeInfo}>🛡️</Text>
            <View style={estilos.textoDetalheContainer}>
              <Text style={estilos.tituloDetalheInfo}>Sua privacidade é preservada</Text>
              <Text style={estilos.descDetalheInfo}>Esta demonstração não solicita localização, identidade ou histórico de navegação. A etapa de permissão será conectada depois.</Text>
            </View>
          </View>
          <View style={estilos.itemInfoBasico}>
            <Text style={estilos.iconeInfo}>📊</Text>
            <View style={estilos.textoDetalheContainer}>
              <Text style={estilos.tituloDetalheInfo}>Estimativa do modelo</Text>
              <Text style={estilos.descDetalheInfo}>Não é uma medição direta da sua internet. Eventos locais podem causar diferenças.</Text>
            </View>
          </View>
        </View>
      </Cartao>
      
      <BotaoPrincipal titulo="Entenda o App →" onPress={() => navigation.navigate('Abas', { screen: 'Entenda' })} estiloContexto={{marginTop: espaco.xl}} />
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: espaco.xl, paddingBottom: espaco.xxl * 2 },
  cabecalho: { marginBottom: espaco.lg },
  overline: { fontSize: 12, fontWeight: '800', color: cores.primaria, letterSpacing: 0.5, marginBottom: 4 },
  tituloGigante: { fontSize: 32, fontWeight: '800', color: cores.texto, lineHeight: 36, maxWidth: 300 },
  linhaTopoDetalhe: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: espaco.md, borderBottomWidth: 1, borderBottomColor: cores.divisor },
  labelModelo: { fontSize: 12, fontWeight: '700', color: cores.textoSecundario, marginBottom: 2 },
  tituloCartao: { fontSize: 22, fontWeight: '800', color: cores.texto },
  listaDetalhes: { marginTop: espaco.sm, gap: espaco.lg },
  itemDetalhe: { flexDirection: 'row', alignItems: 'center', gap: espaco.md },
  iconeDetalhe: { fontSize: 24, backgroundColor: cores.fundoSecundario, padding: 8, borderRadius: 12 },
  textoDetalheContainer: { flex: 1 },
  tituloDetalhe: { fontSize: 15, fontWeight: '800', color: cores.texto },
  descDetalhe: { fontSize: 12, color: cores.textoSecundario, lineHeight: 16 },
  valorDetalheContainer: { alignItems: 'flex-end' },
  valorDetalhePrincipal: { fontSize: 16, fontWeight: '800', color: cores.texto },
  valorDetalheBadge: { fontSize: 11, fontWeight: '800', color: '#0E5B63' },
  tituloSecaoMargin: { fontSize: 18, fontWeight: '800', color: cores.texto, marginTop: espaco.xl, marginBottom: espaco.md },
  listaInfoBasico: { gap: espaco.lg },
  itemInfoBasico: { flexDirection: 'row', alignItems: 'flex-start', gap: espaco.md },
  iconeInfo: { fontSize: 24, marginTop: 2, color: cores.primaria },
  tituloDetalheInfo: { fontSize: 15, fontWeight: '800', color: cores.texto, marginBottom: 2 },
  descDetalheInfo: { fontSize: 13, color: cores.textoSecundario, lineHeight: 18 }
});
