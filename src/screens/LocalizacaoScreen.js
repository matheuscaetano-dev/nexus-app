import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular';
import { Inter_700Bold } from '@expo-google-fonts/inter/700Bold';
import { useFonts } from 'expo-font';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PressableAcessivel as Pressable, ScrollViewAcessivel as ScrollView, TextoAcessivel as Text, ViewAcessivel as View } from '../context/AcessibilidadeContext';
import BotaoPrincipal from '../components/BotaoPrincipal';
import OpcaoSelecionavel from '../components/OpcaoSelecionavel';
import { EstadoCarregando, EstadoErro } from '../components/Estados';
import { useConexao } from '../context/ConexaoContext';
import { cores, espaco, raio } from '../theme';
import Icone from '../components/Icone';

const distanciaEmKm = (origem, destino) => {
  const radianos = (graus) => (graus * Math.PI) / 180;
  const diferencaLatitude = radianos(destino.latitude - origem.latitude);
  const diferencaLongitude = radianos(destino.longitude - origem.longitude);
  const a = Math.sin(diferencaLatitude / 2) ** 2
    + Math.cos(radianos(origem.latitude))
      * Math.cos(radianos(destino.latitude))
      * Math.sin(diferencaLongitude / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const cidadesReferenciaBR = [
  { nome: 'São Paulo', uf: 'SP', latitude: -23.5505, longitude: -46.6333 },
  { nome: 'Rio de Janeiro', uf: 'RJ', latitude: -22.9068, longitude: -43.1729 },
  { nome: 'Belo Horizonte', uf: 'MG', latitude: -19.9167, longitude: -43.9345 },
  { nome: 'Brasília', uf: 'DF', latitude: -15.7975, longitude: -47.8919 },
  { nome: 'Salvador', uf: 'BA', latitude: -12.9714, longitude: -38.5014 },
  { nome: 'Recife', uf: 'PE', latitude: -8.0476, longitude: -34.8770 },
  { nome: 'Fortaleza', uf: 'CE', latitude: -3.7172, longitude: -38.5434 },
  { nome: 'Curitiba', uf: 'PR', latitude: -25.4284, longitude: -49.2733 },
  { nome: 'Porto Alegre', uf: 'RS', latitude: -30.0346, longitude: -51.2177 },
  { nome: 'Manaus', uf: 'AM', latitude: -3.1190, longitude: -60.0217 },
];

const obterCidadeReferencia = (probe) => {
  if (probe?.countryCode !== 'BR') return null;
  const maisProxima = cidadesReferenciaBR
    .map((cidade) => ({ cidade, distancia: distanciaEmKm(probe.location, cidade) }))
    .sort((a, b) => a.distancia - b.distancia)[0];
  return maisProxima?.distancia <= 50 ? maisProxima.cidade : null;
};

const encontrarProbeMaisProxima = (coordenadas, probes) => probes
  .filter((probe) => Number.isFinite(probe?.location?.latitude) && Number.isFinite(probe?.location?.longitude))
  .map((probe) => ({ probe, distancia: distanciaEmKm(coordenadas, probe.location) }))
  .sort((a, b) => a.distancia - b.distancia)[0]?.probe ?? null;
const formatarCoordenada = (valor) => Number(valor).toLocaleString('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 4,
});

export default function LocalizacaoScreen({ navigation }) {
  const [fontesCarregadas, erroFontes] = useFonts({ Inter_400Regular, Inter_700Bold });
  const { locais, local, setLocal, carregandoCatalogo, erroCatalogo, recarregarCatalogo } = useConexao();
  const [probeSelecionada, setProbeSelecionada] = useState(local?.probeId ?? null);
  const [modoManual, setModoManual] = useState(false);
  const [solicitandoLocalizacao, setSolicitandoLocalizacao] = useState(false);

  useEffect(() => {
    if (modoManual && probeSelecionada == null && locais.length) {
      setProbeSelecionada(locais[0].probeId);
    }
  }, [modoManual, probeSelecionada, locais]);

  function continuarParaInicio() {
    navigation.navigate('Abas', { screen: 'Inicio' });
  }

  function abrirSelecaoManual() {
    setModoManual(true);
  }

  async function permitirLocalizacao() {
    if (solicitandoLocalizacao) return;
    setSolicitandoLocalizacao(true);

    try {
      const permissao = await Location.requestForegroundPermissionsAsync();
      if (permissao.status !== 'granted') {
        Alert.alert(
          'Localização não autorizada',
          'A permissão não foi concedida. Você pode escolher uma referência manualmente.',
          [
            { text: 'Agora não', style: 'cancel' },
            { text: 'Escolher outra cidade', onPress: abrirSelecaoManual },
          ],
        );
        return;
      }

      if (!(await Location.hasServicesEnabledAsync())) {
        Alert.alert(
          'Localização desativada',
          'Ative a localização do aparelho ou escolha uma referência manualmente.',
          [
            { text: 'Agora não', style: 'cancel' },
            { text: 'Escolher outra cidade', onPress: abrirSelecaoManual },
          ],
        );
        return;
      }

      let posicao = null;
      try {
        posicao = await Location.getLastKnownPositionAsync({ maxAge: 120000, requiredAccuracy: 10000 });
      } catch {
        posicao = null;
      }
      if (!posicao) {
        posicao = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      }

      const { latitude, longitude } = posicao.coords;
      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        throw new Error('O dispositivo retornou coordenadas inválidas.');
      }

      const probeMaisProxima = encontrarProbeMaisProxima({ latitude, longitude }, locais);
      if (!probeMaisProxima) {
        Alert.alert(
          'Referência indisponível',
          'Não há referências válidas para comparar. Você pode escolher uma manualmente.',
          [{ text: 'Escolher outra cidade', onPress: abrirSelecaoManual }],
        );
        return;
      }

      setLocal(probeMaisProxima);
      continuarParaInicio();
    } catch {
      Alert.alert(
        'Não foi possível obter sua localização',
        'Confira se a localização está ativada no dispositivo ou escolha uma região manualmente.',
        [
          { text: 'Tentar novamente', onPress: permitirLocalizacao },
          { text: 'Escolher outra cidade', onPress: abrirSelecaoManual },
        ],
      );
    } finally {
      setSolicitandoLocalizacao(false);
    }
  }

  function confirmarReferenciaManual() {
    const escolhida = locais.find((probe) => probe.probeId === probeSelecionada);
    if (!escolhida) return;
    setLocal(escolhida);
    continuarParaInicio();
  }
  if (erroFontes) throw erroFontes;
  if (!fontesCarregadas) return null;

  if (modoManual) {
    return (
      <SafeAreaView style={estilos.safe} edges={['top', 'right', 'bottom', 'left']}>
        <ScrollView style={estilos.tela} contentContainerStyle={estilos.conteudoManual} showsVerticalScrollIndicator={false}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Voltar para usar a localização do dispositivo"
            onPress={() => setModoManual(false)}
            style={estilos.voltar}
          >
            <Icone name="arrow-back" size={20} color={cores.primaria} />
            <Text style={estilos.textoVoltar}>Usar minha localização</Text>
          </Pressable>

          <Text style={[estilos.overline, estilos.overlineManual]}>CONFIGURAÇÃO INICIAL • ETAPA 2 DE 2</Text>
          <Text style={estilos.tituloManual}>Escolher outra cidade</Text>
          <Text style={estilos.descricaoManual}>
            A cidade indicada é uma referência aproximada calculada pelas coordenadas da estação. Confira a região e as coordenadas antes de escolher.
          </Text>

          <Text style={estilos.tituloLista}>Referências disponíveis</Text>
          {carregandoCatalogo ? (
            <EstadoCarregando mensagem="Carregando referências disponíveis…" />
          ) : erroCatalogo ? (
            <EstadoErro erro={erroCatalogo} onTentarNovamente={recarregarCatalogo} />
          ) : locais.length === 0 ? (
            <View style={estilos.semReferencias}>
              <Text style={estilos.textoSemReferencias}>Nenhuma estação de referência disponível no momento.</Text>
              <Pressable
                accessibilityRole="button"
                onPress={recarregarCatalogo}
                style={estilos.tentarNovamente}
              >
                <Text style={estilos.textoTentarNovamente}>Tentar novamente</Text>
              </Pressable>
            </View>
          ) : locais.map((probe) => {
            const cidade = obterCidadeReferencia(probe);
            const pais = probe.countryCode === 'BR' ? 'Brasil' : probe.countryCode || 'País não informado';
            const regiao = cidade ? `${cidade.nome} (${cidade.uf}), ${pais}` : pais;
            return (
              <OpcaoSelecionavel
                key={probe.probeId}
                rotulo={cidade ? `Perto de ${cidade.nome} (${cidade.uf})` : `${pais} • Referência Regional`}
                detalhe={`Região Aprox.: ${regiao}\nLatitude Aprox.: ${formatarCoordenada(probe.location.latitude)}°\nLongitude Aprox.: ${formatarCoordenada(probe.location.longitude)}°\nProbe Pública: ${probe.probeId}`}
                selecionado={probeSelecionada === probe.probeId}
                onPress={() => setProbeSelecionada(probe.probeId)}
              />
            );
          })}
          <BotaoPrincipal
            titulo="Usar esta referência"
            icone="map-outline"
            desabilitado={probeSelecionada == null || carregandoCatalogo || !!erroCatalogo}
            onPress={confirmarReferenciaManual}
            estiloContexto={estilos.botaoManual}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={estilos.safe} edges={['top', 'right', 'bottom', 'left']}>
      <ScrollView style={estilos.tela} contentContainerStyle={estilos.conteudo} showsVerticalScrollIndicator={false}>
        <View style={estilos.conteudoPrincipal}>
          <View style={estilos.cabecalho}>
            <View style={estilos.titulosCabecalho}>
              <Text style={estilos.overline}>CONFIGURAÇÃO INICIAL • ETAPA 2 DE 2</Text>
              <Text accessibilityRole="header" style={estilos.tituloCabecalho}>Usar sua localização</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Ajuda sobre localização"
              onPress={() => navigation.navigate('Abas', { screen: 'Entenda' })}
              style={estilos.botaoAjuda}
            >
              <Icone name="help-circle-outline" size={18} color={cores.primaria} />
            </Pressable>
          </View>

          <View style={estilos.blocoDesign}>
            <View
              style={estilos.ilustracao}
              accessible
              accessibilityRole="image"
              accessibilityLabel="Ilustração de um marcador de localização"
            >
              <View style={estilos.orbita} />
              <View style={estilos.pontoAmarelo} />
              <View style={estilos.pontoVerde} />
              <View style={estilos.marcadorExterno}>
                <View style={estilos.marcadorInterno}>
                  <Icone name="location-outline" size={34} color="#042F2E" />
                </View>
              </View>
              <View style={estilos.tagUso} accessible accessibilityRole="text" accessibilityLabel="Sem IP">
                <Icone name="eye-off-outline" size={14} color={cores.primaria} />
                <Text style={estilos.textoTag}>Sem IP</Text>
              </View>
            </View>

            <View style={estilos.introducao}>
              <Text accessibilityRole="header" style={estilos.titulo}>
                Encontre uma referência perto de você
              </Text>
              <Text style={estilos.descricao}>
                Com sua permissão, usamos latitude e longitude somente para localizar uma estação de referência próxima.
              </Text>
            </View>

            <View style={estilos.itemVantagemDestaque}>
              <View style={[estilos.iconeFundo, estilos.iconeDestaque]}>
                <Icone name="shield-checkmark-outline" size={20} color="#115E59" />
              </View>
              <View style={estilos.textoVantagem}>
                <Text style={estilos.tituloVantagemDestaque}>Não usamos seu endereço IP</Text>
                <Text style={estilos.descricaoVantagemDestaque}>O GPS é comparado neste aparelho. À API vai apenas a referência escolhida ao buscar a previsão.</Text>
              </View>
            </View>

            <View style={estilos.listaVantagens}>
              <View style={estilos.itemVantagem}>
                <View style={estilos.iconeFundo}>
                  <Icone name="radio-outline" size={20} color="#115E59" />
                </View>
                <View style={estilos.textoVantagem}>
                  <Text style={estilos.tituloVantagem}>Referência regional</Text>
                  <Text style={estilos.descricaoVantagem}>A estação próxima serve como base para a consulta de previsão.</Text>
                </View>
              </View>
              <View style={estilos.itemVantagem}>
                <View style={estilos.iconeFundo}>
                  <Icone name="sparkles-outline" size={20} color="#115E59" />
                </View>
                <View style={estilos.textoVantagem}>
                  <Text style={estilos.tituloVantagem}>É uma estimativa</Text>
                  <Text style={estilos.descricaoVantagem}>O resultado não é uma medição direta da rede ou do aparelho do usuário.</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={estilos.rodape}>
          <View style={estilos.indicadorEtapa} accessibilityLabel="Etapa 2 de 2">
            <View style={estilos.pontoInativo} />
            <View style={estilos.pontoAtivo} />
          </View>

          <View style={estilos.acoes}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={solicitandoLocalizacao ? 'Buscando localização' : 'Permitir localização'}
              accessibilityState={{ disabled: solicitandoLocalizacao }}
              disabled={solicitandoLocalizacao}
              onPress={permitirLocalizacao}
              style={({ pressed }) => [estilos.botaoLocalizacao, pressed && estilos.botaoPressionado, solicitandoLocalizacao && estilos.botaoDesabilitado]}
            >
              <Icone name="locate-outline" size={18} color={cores.sobrePrimaria} />
              <Text style={estilos.textoBotaoPrimario}>
                {solicitandoLocalizacao ? 'Buscando localização…' : 'Permitir localização'}
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Escolher outra cidade"
              onPress={abrirSelecaoManual}
              style={({ pressed }) => [estilos.botaoCidade, pressed && estilos.botaoPressionado]}
            >
              <Icone name="map-outline" size={18} color={cores.primaria} />
              <Text style={estilos.textoBotaoSecundario}>Escolher outra cidade</Text>
            </Pressable>
          </View>

          <Text style={estilos.notaRodape}>Você pode alterar essa escolha depois.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F4F8F7' },
  tela: { flex: 1, backgroundColor: '#F4F8F7' },
  conteudo: {
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 22,
  },
  conteudoPrincipal: { alignSelf: 'stretch' },
  rodape: { alignSelf: 'stretch', alignItems: 'center', gap: 10 },
  conteudoManual: { padding: espaco.xl, paddingTop: espaco.lg, paddingBottom: espaco.xxl * 2, flexGrow: 1 },
  cabecalho: { minHeight: 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  titulosCabecalho: { flex: 1 },
  overline: {
    fontFamily: 'Inter_700Bold',
    fontSize: 12,
    fontWeight: '700',
    color: '#115E59',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  overlineManual: { fontSize: 11, letterSpacing: 0.6, marginBottom: espaco.xs },
  tituloCabecalho: {
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
    fontWeight: '700',
    color: '#042F2E',
    lineHeight: 24,
  },
  botaoAjuda: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', backgroundColor: '#EAF6F3', marginLeft: espaco.sm },
  blocoDesign: { alignSelf: 'stretch', gap: 14, overflow: 'hidden' },
  ilustracao: {
    width: '100%',
    height: 174,
    borderRadius: 24,
    backgroundColor: '#EDF7F6',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  orbita: {
    position: 'absolute',
    width: 144,
    height: 144,
    borderRadius: 72,
    borderWidth: 2,
    borderColor: '#C8D9D8',
    borderStyle: 'dashed',
  },
  pontoAmarelo: {
    position: 'absolute',
    width: 12,
    height: 12,
    left: 57,
    top: 42,
    borderRadius: 6,
    backgroundColor: '#F5B942',
  },
  pontoVerde: {
    position: 'absolute',
    width: 12,
    height: 12,
    left: 280,
    top: 117,
    borderRadius: 6,
    backgroundColor: '#075E66',
  },
  marcadorExterno: {
    width: 86,
    height: 86,
    borderRadius: 24,
    backgroundColor: '#075E66',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    transform: [{ rotate: '-4deg' }],
  },
  marcadorInterno: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: '#F5B942',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    transform: [{ rotate: '4deg' }],
  },
  tagUso: { position: 'absolute', top: 16, right: 16, minHeight: 30, flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, backgroundColor: '#FFFFFF', borderRadius: 999, overflow: 'hidden' },
  textoTag: { fontFamily: 'Inter_700Bold', fontSize: 12, fontWeight: '700', color: '#042F2E' },
  introducao: { alignItems: 'center', gap: 6, overflow: 'hidden' },
  titulo: {
    alignSelf: 'stretch',
    fontFamily: 'Inter_700Bold',
    fontSize: 26,
    fontWeight: '700',
    color: '#102A2E',
    lineHeight: 29.1,
    textAlign: 'center',
  },
  descricao: {
    alignSelf: 'stretch',
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    fontWeight: '400',
    color: '#4C6467',
    lineHeight: 20,
    textAlign: 'center',
  },
  listaVantagens: { alignSelf: 'stretch', paddingHorizontal: 2, gap: 2, overflow: 'hidden' },
  itemVantagem: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    overflow: 'hidden',
  },
  itemVantagemDestaque: {
    alignSelf: 'stretch',
    minHeight: 72,
    padding: 13,
    backgroundColor: '#E1F3EA',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    overflow: 'hidden',
  },
  iconeFundo: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#EDF7F6', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  iconeDestaque: { width: 36, height: 36, borderRadius: 999, backgroundColor: '#FFFFFF' },
  textoVantagem: { flex: 1 },
  tituloVantagemDestaque: { alignSelf: 'stretch', fontFamily: 'Inter_700Bold', fontSize: 14, fontWeight: '700', color: '#1D6B4F' },
  descricaoVantagemDestaque: { alignSelf: 'stretch', fontFamily: 'Inter_400Regular', fontSize: 12, fontWeight: '400', color: '#102A2E', lineHeight: 16.2 },
  tituloVantagem: { alignSelf: 'stretch', fontFamily: 'Inter_700Bold', fontSize: 14, fontWeight: '700', color: '#102A2E' },
  descricaoVantagem: { alignSelf: 'stretch', fontFamily: 'Inter_400Regular', fontSize: 12, fontWeight: '400', color: '#4C6467', lineHeight: 16.2 },
  indicadorEtapa: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 0, marginBottom: 0 },
  pontoInativo: { width: 7, height: 7, borderRadius: 999, backgroundColor: '#C8D9D8' },
  pontoAtivo: { width: 22, height: 7, borderRadius: 999, backgroundColor: '#075E66' },
  acoes: { gap: 10, marginTop: 0 },
  botaoLocalizacao: { minHeight: 52, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#075E66', paddingHorizontal: 18, paddingVertical: 14, borderWidth: 1.5, borderColor: '#075E66' },
  textoBotaoPrimario: { fontFamily: 'Inter_700Bold', color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  botaoCidade: { minHeight: 52, borderRadius: 12, borderWidth: 1.5, borderColor: '#075E66', backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingHorizontal: 18, paddingVertical: 14 },
  textoBotaoSecundario: { fontFamily: 'Inter_700Bold', color: '#075E66', fontSize: 16, fontWeight: '700' },
  botaoPressionado: { opacity: 0.82 },
  botaoDesabilitado: { opacity: 0.55 },
  notaRodape: { alignSelf: 'stretch', marginTop: 0, fontFamily: 'Inter_400Regular', fontWeight: '400', fontSize: 11, lineHeight: 15.4, color: '#4C6467', textAlign: 'center' },
  voltar: { minHeight: 42, flexDirection: 'row', alignItems: 'center', gap: espaco.sm, marginBottom: espaco.lg },
  textoVoltar: { color: cores.primaria, fontSize: 14, fontWeight: '700' },
  tituloManual: { fontSize: 30, lineHeight: 36, fontWeight: '800', color: cores.texto, marginBottom: espaco.sm },
  descricaoManual: { fontSize: 14, color: cores.textoSecundario, lineHeight: 21, marginBottom: espaco.xl },
  tituloLista: { fontSize: 17, fontWeight: '800', color: cores.texto, marginBottom: espaco.md },
  semReferencias: { padding: espaco.lg, borderRadius: raio.lg, backgroundColor: cores.superficie, alignItems: 'center', gap: espaco.sm },
  textoSemReferencias: { color: cores.textoSecundario, fontSize: 14, textAlign: 'center' },
  tentarNovamente: { minHeight: 44, justifyContent: 'center', paddingHorizontal: espaco.md },
  textoTentarNovamente: { color: cores.primaria, fontSize: 14, fontWeight: '700' },
  botaoManual: { marginTop: espaco.lg },
});
