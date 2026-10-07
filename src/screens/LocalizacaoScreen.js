import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { ScrollViewAcessivel as ScrollView, TextoAcessivel as Text, ViewAcessivel as View } from '../context/AcessibilidadeContext';
import BotaoPrincipal from '../components/BotaoPrincipal';
import OpcaoSelecionavel from '../components/OpcaoSelecionavel';
import { EstadoCarregando, EstadoErro } from '../components/Estados';
import { useConexao } from '../context/ConexaoContext';
import { cores, espaco, raio } from '../theme';

const formatarCoordenada = (valor) => Number(valor).toLocaleString('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 4,
});

export default function LocalizacaoScreen({ navigation }) {
  const { locais, local, setLocal, carregandoCatalogo, erroCatalogo, recarregarCatalogo } = useConexao();
  const [probeSelecionada, setProbeSelecionada] = useState(local?.probeId ?? null);
  useEffect(() => {
    if (probeSelecionada == null && locais.length) setProbeSelecionada(locais[0].probeId);
  }, [probeSelecionada, locais]);

  return (
    <ScrollView style={estilos.tela} contentContainerStyle={estilos.conteudo}>
      <Text style={estilos.overline}>CONFIGURAÇÃO INICIAL - ETAPA 2 DE 2</Text>
      <Text capitalizar style={estilos.tituloGigante}>Escolher referência regional</Text>

      <View style={estilos.ilustracaoContainer}>
        <View style={estilos.ilustracaoBox}>
          <Text style={estilos.iconeGrande}>📍</Text>
        </View>
      </View>

      <Text capitalizar style={estilos.tituloCentro}>Encontre uma referência perto de você</Text>
      <Text style={estilos.textoCentro}>A API não fornece nomes de cidades para essas probes. Escolha uma referência pelo país e pelas coordenadas aproximadas; elas não representam seu endereço ou localização exata.</Text>

      <View style={estilos.listaVantagens}>
        <View style={estilos.itemVantagem}>
          <Text style={estilos.iconeVantagem}>🛡️</Text>
          <View style={{flex:1}}>
            <Text capitalizar style={estilos.tituloVantagem}>A probe é a referência</Text>
            <Text style={estilos.textoVantagem}>A API não retorna o endereço IP das probes.</Text>
          </View>
        </View>
        <View style={estilos.itemVantagem}>
          <Text style={estilos.iconeVantagem}>📡</Text>
          <View style={{flex:1}}>
            <Text capitalizar style={estilos.tituloVantagem}>Referência regional</Text>
            <Text style={estilos.textoVantagem}>A estação próxima serve como base para a consulta de previsão.</Text>
          </View>
        </View>
        <View style={estilos.itemVantagem}>
          <Text style={estilos.iconeVantagem}>📊</Text>
          <View style={{flex:1}}>
            <Text capitalizar style={estilos.tituloVantagem}>É uma estimativa</Text>
            <Text style={estilos.textoVantagem}>O resultado não é uma medição direta da rede ou do aparelho do usuário.</Text>
          </View>
        </View>
      </View>

      <Text capitalizar style={estilos.tituloVantagem}>Localidades disponíveis</Text>
      {carregandoCatalogo ? <EstadoCarregando mensagem="Carregando probes disponíveis…" /> : erroCatalogo ? <EstadoErro erro={erroCatalogo} onTentarNovamente={recarregarCatalogo} /> : locais.map((probe) => (
        <OpcaoSelecionavel
          key={probe.probeId}
          rotulo={`${probe.countryCode === 'BR' ? 'Brasil' : probe.countryCode} • referência regional`}
          detalhe={`Latitude aproximada: ${formatarCoordenada(probe.location.latitude)}°\nLongitude aproximada: ${formatarCoordenada(probe.location.longitude)}°\nProbe pública: ${probe.probeId}`}
          selecionado={probeSelecionada === probe.probeId}
          onPress={() => setProbeSelecionada(probe.probeId)}
        />
      ))}
      <BotaoPrincipal titulo="Usar esta referência →" desabilitado={probeSelecionada == null || carregandoCatalogo} onPress={() => {
        const escolhida = locais.find((probe) => probe.probeId === probeSelecionada);
        if (!escolhida) return;
        setLocal(escolhida);
        navigation.navigate('Abas', { screen: 'Inicio' });
      }} estiloContexto={{marginTop: espaco.lg}} />
      <Text style={estilos.notaRodape}>Você pode trocar a referência a qualquer momento. A escolha fica na memória durante esta sessão.</Text>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: espaco.xl, paddingBottom: espaco.xxl * 2 },
  overline: { fontSize: 11, fontWeight: '800', color: cores.primaria, letterSpacing: 0.5, marginBottom: 4 },
  tituloGigante: { fontSize: 32, fontWeight: '800', color: cores.texto, lineHeight: 36, marginBottom: espaco.xl },
  ilustracaoContainer: { alignItems: 'center', marginBottom: espaco.xl },
  ilustracaoBox: { width: 100, height: 100, borderRadius: 24, backgroundColor: cores.fundoSecundario, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: cores.borda },
  iconeGrande: { fontSize: 48 },
  tituloCentro: { fontSize: 24, fontWeight: '800', color: cores.texto, textAlign: 'center', marginBottom: espaco.sm },
  textoCentro: { fontSize: 14, color: cores.textoSecundario, textAlign: 'center', lineHeight: 22, paddingHorizontal: espaco.lg, marginBottom: espaco.xl },
  listaVantagens: { gap: espaco.lg, marginBottom: espaco.xxl },
  itemVantagem: { flexDirection: 'row', alignItems: 'flex-start', gap: espaco.md },
  iconeVantagem: { fontSize: 24, color: cores.primaria },
  tituloVantagem: { fontSize: 15, fontWeight: '800', color: cores.texto, marginBottom: 2 },
  textoVantagem: { fontSize: 13, color: cores.textoSecundario, lineHeight: 18 },
  notaRodape: { fontSize: 12, color: cores.textoSecundario, textAlign: 'center', marginTop: espaco.lg }
});
