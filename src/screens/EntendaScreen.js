import React, { useEffect, useState } from 'react';
import { AccessibilityInfo, AppState, Linking, Platform, StyleSheet } from 'react-native';
import { PressableAcessivel as Pressable, ScrollViewAcessivel as ScrollView, TextoAcessivel as Text, ViewAcessivel as View, useAcessibilidade } from '../context/AcessibilidadeContext';
import { cores, espaco, raio } from '../theme';
import Icone from '../components/Icone';
import { useConexao } from '../context/ConexaoContext';

const termos = [
  { icone: 'stopwatch-outline', titulo: 'RTT', texto: 'Tempo que a informação leva para ir e voltar.', extra: 'RTT significa Round Trip Time. Valores menores costumam indicar resposta mais rápida entre dois pontos da rede.' },
  { icone: 'cube-outline', titulo: 'Perda de Pacotes', texto: 'Partes da informação que não chegam ao destino.', extra: 'A perda é apresentada em porcentagem. Quanto maior o valor, maior a chance de travamentos, falhas em chamadas ou retransmissões.' },
  { icone: 'flash-outline', titulo: 'Qualidade', texto: 'Classificação estimada da conexão para o período consultado.', extra: 'As categorias são experimentais e usam RTT e perda de pacotes. Elas não são uma medição direta do seu aparelho.' },
  { icone: 'location-outline', titulo: 'Estação de Referência', texto: 'Probe pública usada como referência geográfica.', extra: 'A previsão usa a probe disponível mais próxima. As coordenadas são aproximadas e não identificam o endereço do usuário.' },
  { icone: 'shield-checkmark-outline', titulo: 'Confiança do Modelo', texto: 'Indicador de confiança, quando fornecido pela API.', extra: 'A API pode não enviar esse indicador. Quando ele não está disponível, o app não deve interpretar a previsão como uma certeza.' },
  { icone: 'bar-chart-outline', titulo: 'Previsão Estimada', texto: 'Resultado calculado previamente a partir dos dados publicados pela API.', extra: 'A disponibilidade depende das datas existentes na base da API. O resultado pode não cobrir o dia atual.' },
];

export default function EntendaScreen({ navigation }) {
  const [termoAberto, setTermoAberto] = useState(null);
  const [leitorAtivo, setLeitorAtivo] = useState(false);
  const [mostrarAjudaLeitor, setMostrarAjudaLeitor] = useState(false);
  const { textoAmpliado, setTextoAmpliado, altoContraste, setAltoContraste, toquesGrandes, setToquesGrandes } = useAcessibilidade();
  const { setModelo, setLocal } = useConexao();

  useEffect(() => {
    let montado = true;
    const atualizarLeitor = () => {
      AccessibilityInfo.isScreenReaderEnabled()
        .then((ativo) => montado && setLeitorAtivo(ativo))
        .catch(() => montado && setLeitorAtivo(false));
    };
    const leitorSubscription = AccessibilityInfo.addEventListener('screenReaderChanged', setLeitorAtivo);
    const appSubscription = AppState.addEventListener('change', (estado) => {
      if (estado === 'active') atualizarLeitor();
    });
    atualizarLeitor();
    return () => {
      montado = false;
      leitorSubscription.remove();
      appSubscription.remove();
    };
  }, []);

  async function abrirConfiguracoesLeitor() {
    if (Platform.OS !== 'android') {
      setMostrarAjudaLeitor((atual) => !atual);
      return;
    }
    try {
      await Linking.sendIntent('android.settings.ACCESSIBILITY_SETTINGS');
    } catch {
      setMostrarAjudaLeitor(true);
    }
  }

  function reiniciarConfiguracao() {
    setModelo(null);
    setLocal(null);
    const navegadorPrincipal = navigation.getParent();
    navegadorPrincipal?.reset({ index: 0, routes: [{ name: 'BoasVindas' }] });
  }
  const fundo = altoContraste ? '#000000' : cores.fundo;
  const superficie = altoContraste ? '#111111' : cores.superficie;
  const texto = altoContraste ? '#FFFFFF' : cores.texto;
  const textoSecundario = altoContraste ? '#F0F0F0' : cores.textoSecundario;
  const borda = altoContraste ? '#FFFFFF' : cores.divisor;
  const exibirTermo = ({ icone, titulo, texto: descricao, extra }, index) => {
    const aberto = termoAberto === index;
    return (
      <Pressable key={titulo} accessibilityRole="button" accessibilityState={{ expanded: aberto }} onPress={() => setTermoAberto(aberto ? null : index)} style={[estilos.termoBox, { borderBottomColor: borda, minHeight: toquesGrandes ? 68 : 56 }]}>
        <Icone name={icone} size={25} color={cores.primaria} style={estilos.iconeTermo} />
        <View style={estilos.textosTermo}>
          <Text style={[estilos.tituloTermo, { color: texto }]}>{titulo}</Text>
          <Text style={[estilos.descTermo, { color: textoSecundario }]}>{descricao}</Text>
          {aberto && <Text style={[estilos.descTermo, estilos.textoExpandido, { color: textoSecundario }]}>{extra}</Text>}
        </View>
        <Icone name={aberto ? 'chevron-down' : 'chevron-forward'} size={20} color={textoSecundario} style={estilos.setaRight} />
      </Pressable>
    );
  };

  return (
    <ScrollView style={[estilos.tela, { backgroundColor: fundo }]} contentContainerStyle={estilos.conteudo}>
      <Text style={[estilos.overline, { color: altoContraste ? '#FFFFFF' : cores.primaria }]}>GLOSSÁRIO E ACESSIBILIDADE</Text>
      <Text style={[estilos.tituloGigante, { color: texto }]}>Entenda o Nexus</Text>

      <View style={estilos.linhaTopoSecao}>
        <Text style={[estilos.tituloSecao, { color: texto }]}>Em Palavras Simples</Text>
      </View>

      <View style={[estilos.listaTermos, { backgroundColor: superficie, borderColor: borda }]}>
        {termos.map(exibirTermo)}
      </View>

      <Text style={[estilos.tituloSecao, {marginTop: espaco.xl, color: texto}]}>Feito para Incluir</Text>
      <View style={estilos.gridAcessibilidade}>
        <Pressable accessibilityRole="switch" accessibilityState={{ checked: textoAmpliado }} onPress={() => setTextoAmpliado((v) => !v)} style={[estilos.boxAces, { backgroundColor: superficie, borderColor: borda, minHeight: toquesGrandes ? 64 : 54 }]}>
          <Icone name="text-outline" size={21} color={textoSecundario} />
          <View style={estilos.textosOpcao}>
            <Text style={[estilos.textoAces, { color: texto }]}>{textoAmpliado ? 'Texto Maior: Ativado' : 'Texto Maior'}</Text>
            <Text style={[estilos.descricaoAces, { color: textoSecundario }]}>Amplia os textos para facilitar a leitura.</Text>
          </View>
        </Pressable>
        <Pressable accessibilityRole="switch" accessibilityState={{ checked: altoContraste }} onPress={() => setAltoContraste((v) => !v)} style={[estilos.boxAces, { backgroundColor: superficie, borderColor: borda, minHeight: toquesGrandes ? 64 : 54 }]}>
          <Icone name="contrast-outline" size={21} color={textoSecundario} />
          <View style={estilos.textosOpcao}>
            <Text style={[estilos.textoAces, { color: texto }]}>{altoContraste ? 'Alto Contraste: Ativado' : 'Alto Contraste'}</Text>
            <Text style={[estilos.descricaoAces, { color: textoSecundario }]}>Destaca textos e elementos com mais contraste.</Text>
          </View>
        </Pressable>
        <Pressable accessibilityRole="switch" accessibilityState={{ checked: toquesGrandes }} onPress={() => setToquesGrandes((v) => !v)} style={[estilos.boxAces, { backgroundColor: superficie, borderColor: borda, minHeight: toquesGrandes ? 64 : 54 }]}>
          <Icone name="hand-left-outline" size={21} color={textoSecundario} />
          <View style={estilos.textosOpcao}>
            <Text style={[estilos.textoAces, { color: texto }]}>{toquesGrandes ? 'Toques Maiores: Ativado' : 'Toques Maiores'}</Text>
            <Text style={[estilos.descricaoAces, { color: textoSecundario }]}>Amplia as áreas dos botões para facilitar o toque.</Text>
          </View>
        </Pressable>
      </View>
      <View style={[estilos.cartaoLeitor, { backgroundColor: superficie, borderColor: borda }]}>
        <View style={estilos.linhaLeitor}>
          <View style={[estilos.iconeLeitor, { backgroundColor: fundo }]}>
            <Icone name={leitorAtivo ? 'ear-outline' : 'accessibility-outline'} size={22} color={cores.primaria} />
          </View>
          <View style={estilos.textosLeitor}>
            <Text accessibilityLiveRegion="polite" style={[estilos.textoAces, { color: texto }]}>Leitor de Tela</Text>
            <Text accessibilityLiveRegion="polite" style={[estilos.descricaoLeitor, { color: textoSecundario }]}>
              {leitorAtivo
                ? 'Ativado. Lê em voz alta os textos e controles do app.'
                : Platform.OS === 'ios'
                  ? 'Desativado. Lê em voz alta os textos e controles. Ative o VoiceOver nos Ajustes do iPhone.'
                  : 'Desativado. Lê em voz alta os textos e controles. Ative o TalkBack nas configurações do Android.'}
            </Text>
          </View>
        </View>
        {mostrarAjudaLeitor ? (
          <Text style={[estilos.descricaoLeitor, { color: textoSecundario }]}>
            {Platform.OS === 'ios'
              ? 'Depois de ativar o VoiceOver nos Ajustes, volte ao Nexus. O status será atualizado automaticamente.'
              : 'Não foi possível abrir as configurações. Acesse Configurações > Acessibilidade > TalkBack e ative o leitor de tela.'}
          </Text>
        ) : null}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={Platform.OS === 'android' ? 'Abrir configurações de acessibilidade' : mostrarAjudaLeitor ? 'Ocultar instruções do VoiceOver' : 'Mostrar como ativar o VoiceOver'}
          onPress={abrirConfiguracoesLeitor}
          style={[estilos.botaoLeitor, { backgroundColor: cores.primaria, minHeight: toquesGrandes ? 56 : 46 }]}
        >
          <Icone name={Platform.OS === 'android' ? 'settings-outline' : 'information-circle-outline'} size={18} color={cores.sobrePrimaria} />
          <Text style={estilos.textoBotaoLeitor}>{Platform.OS === 'android' ? 'Abrir Acessibilidade' : mostrarAjudaLeitor ? 'Ocultar Instruções' : 'Como Ativar no iPhone'}</Text>
        </Pressable>
      </View>

      <Text style={[estilos.tituloSecao, { marginTop: espaco.xl, color: texto }]}>Configuração Inicial</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Refazer Configuração inicial do aplicativo"
        accessibilityHint="Limpa o modelo e a referência atuais e retorna à primeira tela."
        onPress={reiniciarConfiguracao}
        style={[estilos.botaoReiniciar, { backgroundColor: superficie, borderColor: borda, minHeight: toquesGrandes ? 64 : 56 }]}
      >
        <Icone name="refresh-outline" size={21} color={cores.primaria} />
        <View style={estilos.textosReiniciar}>
          <Text style={[estilos.tituloReiniciar, { color: texto }]}>Refazer Configuração</Text>
          <Text style={[estilos.descricaoLeitor, { color: textoSecundario }]}>Escolha novamente o modelo e a referência regional.</Text>
        </View>
        <Icone name="chevron-forward" size={18} color={textoSecundario} />
      </Pressable>

      <Text style={[estilos.rodape, { color: textoSecundario }]}>Compatível com TalkBack e VoiceOver • WCAG 2.2 AA • ABNT NBR 17060.</Text>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: espaco.xl, paddingTop: espaco.xl + espaco.sm, paddingBottom: espaco.xxl * 2 },
  overline: { fontSize: 11, fontWeight: '800', color: cores.primaria, letterSpacing: 0.5, marginBottom: 4 },
  tituloGigante: { fontSize: 32, fontWeight: '800', color: cores.texto, lineHeight: 36, marginBottom: espaco.lg },
  linhaTopoSecao: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: espaco.md },
  tituloSecao: { fontSize: 18, fontWeight: '800', color: cores.texto, marginBottom: espaco.sm },
  listaTermos: { backgroundColor: cores.superficie, borderRadius: raio.xl, borderWidth: 1, borderColor: cores.divisor, overflow: 'hidden' },
  termoBox: { flexDirection: 'row', alignItems: 'center', padding: espaco.md, borderBottomWidth: 1, borderBottomColor: cores.divisor },
  iconeTermo: { width: 30, marginRight: espaco.md },
  textosTermo: { flex: 1, marginRight: espaco.sm },
  tituloTermo: { fontSize: 15, fontWeight: '800', color: cores.texto, marginBottom: 2 },
  descTermo: { fontSize: 12, color: cores.textoSecundario, lineHeight: 16 },
  textoExpandido: { marginTop: espaco.sm, lineHeight: 20 },
  setaRight: { paddingRight: 4 },
  gridAcessibilidade: { flexDirection: 'column', gap: 8, marginTop: espaco.sm },
  boxAces: { backgroundColor: cores.superficie, paddingVertical: 12, paddingHorizontal: 12, borderRadius: raio.md, borderWidth: 1, borderColor: cores.divisor, width: '100%', minHeight: 54, flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  textosOpcao: { flex: 1, gap: 3 },
  descricaoAces: { fontSize: 12, lineHeight: 16 },
  cartaoLeitor: { marginTop: espaco.lg, padding: espaco.md, borderRadius: raio.lg, borderWidth: 1, gap: espaco.md },
  linhaLeitor: { flexDirection: 'row', alignItems: 'flex-start', gap: espaco.md },
  iconeLeitor: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  textosLeitor: { flex: 1, gap: 4 },
  descricaoLeitor: { fontSize: 13, lineHeight: 19 },
  botaoLeitor: { borderRadius: raio.md, paddingHorizontal: espaco.md, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: espaco.sm },
  textoBotaoLeitor: { color: cores.sobrePrimaria, fontSize: 14, fontWeight: '800' },
  botaoReiniciar: { padding: espaco.md, borderRadius: raio.lg, borderWidth: 1, flexDirection: 'row', alignItems: 'center', gap: espaco.md },
  textosReiniciar: { flex: 1 },
  tituloReiniciar: { fontSize: 15, fontWeight: '800', marginBottom: 3 },
  textoAces: { fontSize: 14, fontWeight: '800', color: cores.textoSecundario },
  rodape: { fontSize: 11, color: cores.textoSecundario, textAlign: 'center', marginTop: espaco.xl, lineHeight: 16 }
});
