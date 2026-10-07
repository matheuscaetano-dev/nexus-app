import React, { useState } from 'react';
import { Alert, Platform, StyleSheet } from 'react-native';
import { PressableAcessivel as Pressable, ScrollViewAcessivel as ScrollView, TextoAcessivel as Text, ViewAcessivel as View, useAcessibilidade } from '../context/AcessibilidadeContext';
import { cores, espaco, raio } from '../theme';

const termos = [
  { icone: '⏱️', titulo: 'RTT', texto: 'Tempo que a informação leva para ir e voltar.', extra: 'RTT significa Round Trip Time. Valores menores costumam indicar resposta mais rápida entre dois pontos da rede.' },
  { icone: '📦', titulo: 'Perda de pacotes', texto: 'Partes da informação que não chegam ao destino.', extra: 'A perda é apresentada em porcentagem. Quanto maior o valor, maior a chance de travamentos, falhas em chamadas ou retransmissões.' },
  { icone: '⚡', titulo: 'Qualidade', texto: 'Classificação estimada da conexão para o período consultado.', extra: 'As categorias são experimentais e usam RTT e perda de pacotes. Elas não são uma medição direta do seu aparelho.' },
  { icone: '📍', titulo: 'Estação de referência', texto: 'Probe pública usada como referência geográfica.', extra: 'A previsão usa a probe disponível mais próxima. As coordenadas são aproximadas e não identificam o endereço do usuário.' },
  { icone: '🛡️', titulo: 'Confiança do modelo', texto: 'Indicador de confiança, quando fornecido pela API.', extra: 'A API pode não enviar esse indicador. Quando ele não está disponível, o app não deve interpretar a previsão como uma certeza.' },
  { icone: '📊', titulo: 'Previsão estimada', texto: 'Resultado calculado previamente a partir dos dados publicados pela API.', extra: 'A disponibilidade depende das datas existentes na base da API. O resultado pode não cobrir o dia atual.' },
];

export default function EntendaScreen() {
  const [termoAberto, setTermoAberto] = useState(null);
  const { textoAmpliado, setTextoAmpliado, altoContraste, setAltoContraste, toquesGrandes, setToquesGrandes } = useAcessibilidade();
  const fundo = altoContraste ? '#000000' : cores.fundo;
  const superficie = altoContraste ? '#111111' : cores.superficie;
  const texto = altoContraste ? '#FFFFFF' : cores.texto;
  const textoSecundario = altoContraste ? '#F0F0F0' : cores.textoSecundario;
  const borda = altoContraste ? '#FFFFFF' : cores.divisor;
  const exibirTermo = ({ icone, titulo, texto: descricao, extra }, index) => {
    const aberto = termoAberto === index;
    return (
      <Pressable key={titulo} accessibilityRole="button" accessibilityState={{ expanded: aberto }} onPress={() => setTermoAberto(aberto ? null : index)} style={[estilos.termoBox, { borderBottomColor: borda, minHeight: toquesGrandes ? 68 : 56 }]}>
        <Text style={estilos.iconeTermo}>{icone}</Text>
        <View style={estilos.textosTermo}>
          <Text capitalizar style={[estilos.tituloTermo, { color: texto }]}>{titulo}</Text>
          <Text style={[estilos.descTermo, { color: textoSecundario }]}>{descricao}</Text>
          {aberto && <Text style={[estilos.descTermo, estilos.textoExpandido, { color: textoSecundario }]}>{extra}</Text>}
        </View>
        <Text style={[estilos.setaRight, { color: textoSecundario }]}>{aberto ? '⌄' : '›'}</Text>
      </Pressable>
    );
  };

  return (
    <ScrollView style={[estilos.tela, { backgroundColor: fundo }]} contentContainerStyle={estilos.conteudo}>
      <Text style={[estilos.overline, { color: altoContraste ? '#FFFFFF' : cores.primaria }]}>GLOSSÁRIO E ACESSIBILIDADE</Text>
      <Text capitalizar style={[estilos.tituloGigante, { color: texto }]}>Entenda o Nexus</Text>

      <View style={estilos.linhaTopoSecao}>
        <Text capitalizar style={[estilos.tituloSecao, { color: texto }]}>Em palavras simples</Text>
      </View>

      <View style={[estilos.listaTermos, { backgroundColor: superficie, borderColor: borda }]}>
        {termos.map(exibirTermo)}
      </View>

      <Text capitalizar style={[estilos.tituloSecao, {marginTop: espaco.xl, color: texto}]}>Feito para incluir</Text>
      <View style={estilos.gridAcessibilidade}>
        <Pressable accessibilityRole="switch" accessibilityState={{ checked: textoAmpliado }} onPress={() => setTextoAmpliado((v) => !v)} style={[estilos.boxAces, { backgroundColor: superficie, borderColor: borda, minHeight: toquesGrandes ? 64 : 48 }]}><Text style={[estilos.textoAces, { color: textoSecundario }]}>{textoAmpliado ? '✓ Texto maior no app' : 'T Texto maior no app'}</Text></Pressable>
        <Pressable accessibilityRole="button" onPress={() => Alert.alert('Leitor de tela', `O Nexus oferece rótulos acessíveis. Para ouvir a tela, ative o leitor de tela nas configurações de acessibilidade do ${Platform.OS === 'ios' ? 'iPhone (VoiceOver)' : 'Android (TalkBack)'}.`)} style={[estilos.boxAces, { backgroundColor: superficie, borderColor: borda, minHeight: toquesGrandes ? 64 : 48 }]}><Text style={[estilos.textoAces, { color: textoSecundario }]}>👁️ Leitor de tela</Text></Pressable>
        <Pressable accessibilityRole="switch" accessibilityState={{ checked: altoContraste }} onPress={() => setAltoContraste((v) => !v)} style={[estilos.boxAces, { backgroundColor: superficie, borderColor: borda, minHeight: toquesGrandes ? 64 : 48 }]}><Text style={[estilos.textoAces, { color: textoSecundario }]}>{altoContraste ? '✓ Alto contraste no app' : '🌗 Alto contraste no app'}</Text></Pressable>
        <Pressable accessibilityRole="switch" accessibilityState={{ checked: toquesGrandes }} onPress={() => setToquesGrandes((v) => !v)} style={[estilos.boxAces, { backgroundColor: superficie, borderColor: borda, minHeight: toquesGrandes ? 64 : 48 }]}><Text style={[estilos.textoAces, { color: textoSecundario }]}>{toquesGrandes ? '✓ Toques maiores no app' : '👆 Toques maiores no app'}</Text></Pressable>
      </View>

      <Text style={[estilos.rodape, { color: textoSecundario }]}>Compatível com TalkBack e VoiceOver • WCAG 2.2 AA • ABNT NBR 17060.</Text>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: espaco.xl, paddingBottom: espaco.xxl * 2 },
  overline: { fontSize: 11, fontWeight: '800', color: cores.primaria, letterSpacing: 0.5, marginBottom: 4 },
  tituloGigante: { fontSize: 32, fontWeight: '800', color: cores.texto, lineHeight: 36, marginBottom: espaco.xl },
  linhaTopoSecao: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: espaco.md },
  tituloSecao: { fontSize: 18, fontWeight: '800', color: cores.texto, marginBottom: espaco.sm },
  listaTermos: { backgroundColor: cores.superficie, borderRadius: raio.xl, borderWidth: 1, borderColor: cores.divisor, overflow: 'hidden' },
  termoBox: { flexDirection: 'row', alignItems: 'center', padding: espaco.md, borderBottomWidth: 1, borderBottomColor: cores.divisor },
  iconeTermo: { fontSize: 24, marginRight: espaco.md },
  textosTermo: { flex: 1, marginRight: espaco.sm },
  tituloTermo: { fontSize: 15, fontWeight: '800', color: cores.texto, marginBottom: 2 },
  descTermo: { fontSize: 12, color: cores.textoSecundario, lineHeight: 16 },
  textoExpandido: { marginTop: espaco.sm, lineHeight: 20 },
  setaRight: { fontSize: 24, color: cores.borda, paddingRight: 4 },
  gridAcessibilidade: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: espaco.sm },
  boxAces: { backgroundColor: cores.superficie, paddingVertical: 12, paddingHorizontal: 16, borderRadius: raio.md, borderWidth: 1, borderColor: cores.divisor, width: '48%' },
  textoAces: { fontSize: 13, fontWeight: '700', color: cores.textoSecundario },
  rodape: { fontSize: 11, color: cores.textoSecundario, textAlign: 'center', marginTop: espaco.xl, lineHeight: 16 }
});
