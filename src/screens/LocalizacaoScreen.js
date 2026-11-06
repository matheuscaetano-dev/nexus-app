import React, { useEffect, useState } from 'react';
import { Linking, Platform, StyleSheet } from 'react-native';
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
import { distanciaEmKm, obterCidadeReferencia } from '../utils/Referencias';

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
  const [avisoLocalizacao, setAvisoLocalizacao] = useState(null);

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
    setAvisoLocalizacao(null);

    try {
      if (!(await Location.hasServicesEnabledAsync())) {
        setAvisoLocalizacao({
          tipo: 'servicos',
          titulo: 'Localização desativada',
          descricao: Platform.OS === 'ios'
            ? 'No iPhone, ative Serviços de Localização em Ajustes > Privacidade e Segurança. O botão abre os ajustes do Nexus; depois, volte e toque em Permitir Localização.'
            : 'Ative a localização do aparelho para encontrar a referência regional mais próxima.',
        });
        return;
      }

      const permissao = await Location.requestForegroundPermissionsAsync();
      if (permissao.status !== 'granted') {
        setAvisoLocalizacao({
          tipo: permissao.canAskAgain ? 'permissao' : 'permissaoBloqueada',
          titulo: 'Acesso à localização necessário',
          descricao: permissao.canAskAgain
            ? 'Permita o acesso enquanto usa o app para selecionar a probe regional mais próxima.'
            : 'O acesso foi bloqueado. Abra os ajustes do Nexus e permita a localização durante o uso.',
        });
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
        setAvisoLocalizacao({
          tipo: 'erro',
          titulo: 'Referência indisponível',
          descricao: 'Não há referências válidas para comparar. Você pode escolher uma cidade manualmente.',
        });
        return;
      }

      setLocal(probeMaisProxima);
      continuarParaInicio();
    } catch {
      setAvisoLocalizacao({
        tipo: 'erro',
        titulo: 'Não foi possível obter a localização',
        descricao: 'Confira os ajustes do aparelho ou escolha uma cidade manualmente.',
      });
    } finally {
      setSolicitandoLocalizacao(false);
    }
  }

  async function agirAvisoLocalizacao() {
    if (!avisoLocalizacao) return;

    if (avisoLocalizacao.tipo === 'permissao' || avisoLocalizacao.tipo === 'erro') {
      await permitirLocalizacao();
      return;
    }

    if (avisoLocalizacao.tipo === 'permissaoBloqueada' || (avisoLocalizacao.tipo === 'servicos' && Platform.OS === 'ios')) {
      try {
        await Linking.openSettings();
      } catch {
        setAvisoLocalizacao((atual) => atual && { ...atual, descricao: `${atual.descricao} Abra os Ajustes do aparelho manualmente.` });
      }
      return;
    }

    if (avisoLocalizacao.tipo === 'servicos' && Platform.OS === 'android') {
      setAvisoLocalizacao(null);
      try {
        try {
          await Location.enableNetworkProviderAsync();
        } catch {
          await Linking.sendIntent('android.settings.LOCATION_SOURCE_SETTINGS');
        }
        if (await Location.hasServicesEnabledAsync()) {
          await permitirLocalizacao();
        } else {
          setAvisoLocalizacao({
            tipo: 'servicos',
            titulo: 'Localização ainda desativada',
            descricao: 'Ative a localização nas configurações do aparelho e tente novamente.',
          });
        }
      } catch {
        setAvisoLocalizacao({
          tipo: 'servicos',
          titulo: 'Ative a localização do aparelho',
          descricao: 'Não foi possível abrir a solicitação automática. Ative a localização nas configurações do Android e volte ao Nexus.',
        });
      }
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
      <SafeAreaView style={estilos.safe} edges={['right', 'bottom', 'left']}>
        <ScrollView style={estilos.tela} contentContainerStyle={estilos.conteudoManual} showsVerticalScrollIndicator={false}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Voltar para usar a localização do dispositivo"
            onPress={() => setModoManual(false)}
            style={estilos.voltar}
          >
            <Icone name="arrow-back" size={20} color={cores.primaria} />
            <Text style={estilos.textoVoltar}>Usar Minha Localização</Text>
          </Pressable>

          <Text style={[estilos.overline, estilos.overlineManual]}>CONFIGURAÇÃO INICIAL • ETAPA 2 DE 2</Text>
          <Text style={estilos.tituloManual}>Escolher Outra Cidade</Text>
          <Text style={estilos.descricaoManual}>
            A cidade indicada é uma referência aproximada calculada pelas coordenadas da estação. Confira a região e as coordenadas antes de escolher.
          </Text>

          <Text style={estilos.tituloLista}>Referências Disponíveis</Text>
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
            titulo="Usar Esta Referência"
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
    <SafeAreaView style={estilos.safe} edges={['right', 'bottom', 'left']}>
      <ScrollView style={estilos.tela} contentContainerStyle={estilos.conteudo} showsVerticalScrollIndicator={false}>
        <View style={estilos.conteudoPrincipal}>
          <View style={estilos.cabecalho}>
            <View style={estilos.titulosCabecalho}>
              <Text style={estilos.overline}>CONFIGURAÇÃO INICIAL • ETAPA 2 DE 2</Text>
              <Text accessibilityRole="header" style={estilos.tituloCabecalho}>Usar Sua Localização</Text>
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
                Encontre uma Referência Perto de Você
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
                <Text style={estilos.tituloVantagemDestaque}>Não Usamos seu Endereço IP</Text>
                <Text style={estilos.descricaoVantagemDestaque}>O GPS é comparado neste aparelho. À API vai apenas a referência escolhida ao buscar a previsão.</Text>
              </View>
            </View>

            <View style={estilos.listaVantagens}>
              <View style={estilos.itemVantagem}>
                <View style={estilos.iconeFundo}>
                  <Icone name="radio-outline" size={20} color="#115E59" />
                </View>
                <View style={estilos.textoVantagem}>
                  <Text style={estilos.tituloVantagem}>Referência Regional</Text>
                  <Text style={estilos.descricaoVantagem}>A estação próxima serve como base para a consulta de previsão.</Text>
                </View>
              </View>
              <View style={estilos.itemVantagem}>
                <View style={estilos.iconeFundo}>
                  <Icone name="sparkles-outline" size={20} color="#115E59" />
                </View>
                <View style={estilos.textoVantagem}>
                  <Text style={estilos.tituloVantagem}>É uma Estimativa</Text>
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

          {avisoLocalizacao ? (
            <View style={estilos.avisoLocalizacao} accessibilityLiveRegion="polite">
              <View style={estilos.conteudoAvisoLocalizacao}>
                <Icone name="location-outline" size={20} color={cores.avisoTexto} />
                <View style={estilos.textosAvisoLocalizacao}>
                  <Text style={estilos.tituloAvisoLocalizacao}>{avisoLocalizacao.titulo}</Text>
                  <Text style={estilos.descricaoAvisoLocalizacao}>{avisoLocalizacao.descricao}</Text>
                </View>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={avisoLocalizacao.tipo === 'servicos' ? Platform.OS === 'android' ? 'Ativar localização do aparelho' : 'Abrir ajustes de localização' : avisoLocalizacao.tipo === 'permissaoBloqueada' ? 'Abrir ajustes do Nexus' : 'Tentar novamente'}
                onPress={agirAvisoLocalizacao}
                style={({ pressed }) => [estilos.botaoAvisoLocalizacao, pressed && estilos.botaoPressionado]}
              >
                <Icone name={avisoLocalizacao.tipo === 'servicos' && Platform.OS === 'android' ? 'locate-outline' : 'settings-outline'} size={17} color={cores.sobrePrimaria} />
                <Text style={estilos.textoBotaoAvisoLocalizacao}>{avisoLocalizacao.tipo === 'servicos' ? Platform.OS === 'android' ? 'Ativar Localização' : 'Abrir Ajustes' : avisoLocalizacao.tipo === 'permissaoBloqueada' ? 'Abrir Ajustes' : 'Tentar Novamente'}</Text>
              </Pressable>
            </View>
          ) : null}

          <View style={estilos.acoes}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={solicitandoLocalizacao ? 'Buscando localização' : 'Permitir Localização'}
              accessibilityState={{ disabled: solicitandoLocalizacao }}
              disabled={solicitandoLocalizacao}
              onPress={permitirLocalizacao}
              style={({ pressed }) => [estilos.botaoLocalizacao, pressed && estilos.botaoPressionado, solicitandoLocalizacao && estilos.botaoDesabilitado]}
            >
              <Icone name="locate-outline" size={18} color={cores.sobrePrimaria} />
              <Text style={estilos.textoBotaoPrimario}>
                {solicitandoLocalizacao ? 'Buscando localização…' : 'Permitir Localização'}
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Escolher Outra Cidade"
              onPress={abrirSelecaoManual}
              style={({ pressed }) => [estilos.botaoCidade, pressed && estilos.botaoPressionado]}
            >
              <Icone name="map-outline" size={18} color={cores.primaria} />
              <Text style={estilos.textoBotaoSecundario}>Escolher Outra Cidade</Text>
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
  avisoLocalizacao: { alignSelf: 'stretch', padding: 12, borderRadius: 14, backgroundColor: '#FFF5DB', borderWidth: 1, borderColor: '#E8C66B', gap: 10 },
  conteudoAvisoLocalizacao: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  textosAvisoLocalizacao: { flex: 1, gap: 3 },
  tituloAvisoLocalizacao: { fontSize: 14, fontWeight: '800', color: '#49380A' },
  descricaoAvisoLocalizacao: { fontSize: 12, lineHeight: 17, color: '#49380A' },
  botaoAvisoLocalizacao: { alignSelf: 'stretch', minHeight: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, paddingHorizontal: 12, borderRadius: 10, backgroundColor: cores.primaria },
  textoBotaoAvisoLocalizacao: { color: cores.sobrePrimaria, fontSize: 13, fontWeight: '800' },
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
